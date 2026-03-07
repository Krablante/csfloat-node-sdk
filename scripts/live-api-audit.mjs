import fs from "node:fs";

function parseEnvFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const env = {};

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const idx = trimmed.indexOf("=");
    if (idx === -1) {
      continue;
    }

    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }

  return env;
}

function getConfig() {
  const envFile = process.env.ENV_FILE;
  const fileEnv = envFile ? parseEnvFile(envFile) : {};

  const apiKey = process.env.CSFLOAT_API_KEY || fileEnv.CSFLOAT_API_KEY;
  if (!apiKey) {
    throw new Error("CSFLOAT_API_KEY is required. Set it directly or pass ENV_FILE=/path/to/.env");
  }

  return {
    apiKey,
    baseUrl: process.env.CSFLOAT_BASE_URL || "https://csfloat.com/api/v1",
    allowLiveMutations: process.env.ALLOW_LIVE_MUTATIONS === "1",
    preferredSteamId: process.env.CSFLOAT_STEAM_ID || fileEnv.CSFLOAT_STEAM_ID || null,
  };
}

function summarizePayload(payload) {
  if (Array.isArray(payload)) {
    return { kind: "array", length: payload.length };
  }

  if (payload && typeof payload === "object") {
    return {
      kind: "object",
      keys: Object.keys(payload).slice(0, 10),
    };
  }

  return {
    kind: typeof payload,
    preview: String(payload).slice(0, 120),
  };
}

function errorSummary(payload) {
  if (payload && typeof payload === "object") {
    return Object.fromEntries(Object.entries(payload).slice(0, 6));
  }

  return String(payload).slice(0, 200);
}

async function main() {
  const config = getConfig();

  async function request(method, route, body) {
    const response = await fetch(`${config.baseUrl}${route}`, {
      method,
      headers: {
        Authorization: config.apiKey,
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    return {
      method,
      route,
      status: response.status,
      ok: response.ok,
      data,
    };
  }

  const summary = {
    generated_at: new Date().toISOString(),
    base_url: config.baseUrl,
    allow_live_mutations: config.allowLiveMutations,
    known_endpoints: [],
    candidate_endpoints: [],
    mutation_checks: [],
  };

  const me = await request("GET", "/me");
  const steamId =
    config.preferredSteamId ||
    (me.ok && me.data && me.data.user ? String(me.data.user.steam_id) : null);

  const listings = await request("GET", "/listings?limit=1&type=buy_now");
  const firstListing = listings.ok && listings.data?.data?.[0] ? listings.data.data[0] : null;
  const listingId = firstListing ? String(firstListing.id) : null;
  const marketHashName = firstListing?.item?.market_hash_name || null;

  const knownRoutes = [
    ["GET", "/me"],
    ["GET", "/me/inventory"],
    ...(steamId ? [["GET", `/users/${steamId}`], ["GET", `/users/${steamId}/stall?limit=1&type=buy_now`]] : []),
    ["GET", "/listings?limit=1&type=buy_now"],
    ...(listingId ? [["GET", `/listings/${listingId}`]] : []),
    ...(marketHashName ? [["GET", `/history/${encodeURIComponent(marketHashName)}/sales`]] : []),
  ];

  for (const [method, route] of knownRoutes) {
    const result = await request(method, route);
    summary.known_endpoints.push({
      method,
      route,
      status: result.status,
      ok: result.ok,
      summary: summarizePayload(result.data),
    });
  }

  const candidateRoutes = [
    ["GET", "/me/trades?limit=1"],
    ["GET", "/me/offers?limit=1"],
    ["GET", "/me/watchlist?limit=1"],
    ["GET", "/me/stall"],
    ["GET", "/me/listings"],
    ["GET", "/notifications?limit=1"],
    ["GET", "/watchlist?limit=1"],
    ["GET", "/bids?limit=1"],
    ["GET", "/offers?limit=1"],
    ["POST", "/offers", {}],
    ...(listingId ? [["GET", `/listings/${listingId}/bids`]] : []),
    ["GET", "/listings/948726619852374910/bids"],
    ["GET", "/listings/949824804901487637/bids"],
  ];

  for (const [method, route, body] of candidateRoutes) {
    const result = await request(method, route, body);
    summary.candidate_endpoints.push({
      method,
      route,
      status: result.status,
      ok: result.ok,
      summary: result.ok ? summarizePayload(result.data) : errorSummary(result.data),
    });
  }

  if (config.allowLiveMutations && steamId) {
    const stall = await request("GET", `/users/${steamId}/stall?limit=1&type=buy_now`);
    const trackedListing = stall.ok && stall.data?.data?.[0] ? stall.data.data[0] : null;

    if (trackedListing) {
      const originalPrice = trackedListing.price;
      const trackedListingId = String(trackedListing.id);

      const patchUp = await request("PATCH", `/listings/${trackedListingId}`, {
        price: originalPrice + 1,
      });
      const patchDown = await request("PATCH", `/listings/${trackedListingId}`, {
        price: originalPrice,
      });
      const verify = await request("GET", `/listings/${trackedListingId}`);

      summary.mutation_checks.push({
        method: "PATCH",
        route: `/listings/${trackedListingId}`,
        status: patchUp.status,
        ok: patchUp.ok && patchDown.ok && verify.ok,
        details: {
          original_price: originalPrice,
          after_plus_one: patchUp.data?.price,
          after_revert: patchDown.data?.price,
          verified_price: verify.data?.price,
        },
      });
    }

    const inventory = await request("GET", "/me/inventory");
    const fullStall = await request("GET", `/users/${steamId}/stall?limit=500&type=buy_now`);
    const listedAssetIds = new Set((fullStall.data?.data || []).map((entry) => String(entry.item.asset_id)));
    const candidate = (inventory.data || []).find((item) => !listedAssetIds.has(String(item.asset_id)));

    if (candidate) {
      const create = await request("POST", "/listings", {
        asset_id: String(candidate.asset_id),
        price: 9999999,
        type: "buy_now",
      });

      const createDetails = {
        asset_id: String(candidate.asset_id),
        status: create.status,
        ok: create.ok,
        summary: create.ok ? summarizePayload(create.data) : errorSummary(create.data),
      };

      if (create.ok && create.data?.id) {
        const createdId = String(create.data.id);
        const del = await request("DELETE", `/listings/${createdId}`);
        createDetails.delete = {
          status: del.status,
          ok: del.ok,
          summary: del.ok ? summarizePayload(del.data) : errorSummary(del.data),
        };
      }

      summary.mutation_checks.push({
        method: "POST",
        route: "/listings",
        ...createDetails,
      });
    }
  }

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
