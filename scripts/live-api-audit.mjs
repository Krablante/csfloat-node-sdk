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

  async function publicRequest(method, route, body) {
    const response = await fetch(`${config.baseUrl}${route}`, {
      method,
      headers: {
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
    public_no_auth_checks: [],
    market_query_checks: [],
    candidate_endpoints: [],
    mutation_probes: [],
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
    ["GET", "/schema"],
    ["GET", "/meta/exchange-rates"],
    ["GET", "/meta/location"],
    ["GET", "/me"],
    ["GET", "/me/inventory"],
    ["GET", "/me/account-standing"],
    ["GET", "/me/transactions?limit=1"],
    ["GET", "/me/trades?limit=1"],
    ["GET", "/me/offers?limit=1"],
    ["GET", "/me/offers-timeline?limit=1"],
    ["GET", "/me/watchlist?limit=1"],
    ["GET", "/me/notifications/timeline"],
    ["GET", "/me/buy-orders?limit=1"],
    ["GET", "/me/auto-bids"],
    ["GET", "/me/mobile/status"],
    ...(steamId ? [["GET", `/users/${steamId}`], ["GET", `/users/${steamId}/stall?limit=1&type=buy_now`]] : []),
    ["GET", "/listings?limit=1&type=buy_now"],
    ...(listingId ? [["GET", `/listings/${listingId}`]] : []),
    ["GET", "/listings/948726619852374910/bids"],
    ["GET", "/listings/949824804901487637/bids"],
    ["GET", "/listings/948726619852374910/buy-orders"],
    ["GET", "/listings/948726619852374910/similar"],
    ...(marketHashName ? [["GET", `/history/${encodeURIComponent(marketHashName)}/sales`]] : []),
    [
      "GET",
      "/history/Souvenir%20P250%20%7C%20Boreal%20Forest%20(Factory%20New)/graph?paint_index=77",
    ],
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

  const publicRoutes = [
    ["GET", "/schema"],
    ["GET", "/meta/exchange-rates"],
    ["GET", "/meta/location"],
    ["GET", "/listings?limit=40&min_ref_qty=20"],
    ...(listingId ? [["GET", `/listings/${listingId}`]] : []),
    ...(steamId ? [["GET", `/users/${steamId}`], ["GET", `/users/${steamId}/stall?limit=1&type=buy_now`]] : []),
    ["GET", "/listings/948726619852374910/bids"],
    ["GET", "/listings/948726619852374910/similar"],
    ["GET", "/listings/948726619852374910/buy-orders"],
    ...(marketHashName ? [["GET", `/history/${encodeURIComponent(marketHashName)}/sales`]] : []),
    [
      "GET",
      "/history/Souvenir%20P250%20%7C%20Boreal%20Forest%20(Factory%20New)/graph?paint_index=77",
    ],
  ];

  for (const [method, route] of publicRoutes) {
    const result = await publicRequest(method, route);
    summary.public_no_auth_checks.push({
      method,
      route,
      status: result.status,
      ok: result.ok,
      summary: result.ok ? summarizePayload(result.data) : errorSummary(result.data),
    });
  }

  const marketQueryRoutes = [
    ["GET", "/listings?limit=1&category=2"],
    ["GET", "/listings?limit=1&category=3"],
    ["GET", "/listings?limit=1&category=4"],
    ["GET", "/listings?limit=1&collection=set_cobblestone"],
    ["GET", "/listings?limit=1&rarity=6"],
    ["GET", "/listings?limit=1&min_price=10000"],
    ["GET", "/listings?limit=1&max_price=1000"],
    ["GET", "/listings?limit=1&def_index=4&paint_index=437&paint_seed=611"],
    ["GET", "/listings?limit=1&music_kit_index=3"],
    ["GET", "/listings?limit=1&keychain_highlight_reel=1"],
    ["GET", "/listings?limit=1&def_index=507&paint_index=38&min_fade=99&max_fade=100"],
    ["GET", "/listings?limit=1&min_blue=90&max_blue=100"],
  ];

  for (const [method, route] of marketQueryRoutes) {
    const result = await request(method, route);
    const firstItem = result.data?.data?.[0];

    summary.market_query_checks.push({
      method,
      route,
      status: result.status,
      ok: result.ok,
      summary: result.ok
        ? {
            ...summarizePayload(result.data),
            first_item: firstItem
              ? {
                  id: firstItem.id,
                  market_hash_name: firstItem.item?.market_hash_name,
                  price: firstItem.price,
                }
              : null,
          }
        : errorSummary(result.data),
    });
  }

  const candidateRoutes = [
    ["GET", "/me/stall"],
    ["GET", "/me/listings"],
    ["GET", "/account-standing"],
    ["GET", "/notifications?limit=1"],
    ["GET", "/watchlist?limit=1"],
    ["GET", "/bids?limit=1"],
    ["GET", "/offers?limit=1"],
    ...(listingId ? [["GET", `/listings/${listingId}/bids`]] : []),
    ["GET", "/listings/950170960026273280/sales"],
    ["GET", "/listings/948726619852374910/sales"],
    ["GET", "/offers/0/history"],
    ["GET", "/me/notifications"],
    ["GET", "/me/notification"],
    ["GET", "/me/offer-history?limit=1"],
    ["GET", "/offers/history?limit=1"],
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

  const mutationProbeRoutes = [
    ["POST", "/offers", {}],
    ["POST", "/buy-orders", {}],
    ["DELETE", "/buy-orders/0"],
    ["POST", "/listings/buy", { contract_ids: ["0"], total_price: 0 }],
    ["POST", "/listings/sell", {}],
    ["POST", "/me/notifications/read-receipt", { last_read_id: "0" }],
    ["POST", "/trades/bulk/accept", { trade_ids: ["0"] }],
    ["POST", "/trades/bulk/cancel", { trade_ids: ["0"] }],
    ["POST", "/me/trades/bulk/cancel", { trade_ids: ["0"] }],
    ["POST", "/me/verify-sms", { phone_number: "0" }],
    ["POST", "/me/mobile/status", {}],
    ["POST", "/listings/950170960026273280/bit", { max_price: 1 }],
    ["DELETE", "/offers/0"],
    ["POST", "/offers/0/counter-offer", {}],
    [
      "POST",
      "/trades/steam-status/new-offer",
      { offer_id: "0", given_asset_ids: ["0"], received_asset_ids: ["0"] },
    ],
    ["POST", "/trades/steam-status/offer", { sent_offers: [], type: 0 }],
  ];

  for (const [method, route, body] of mutationProbeRoutes) {
    const result = await request(method, route, body);
    summary.mutation_probes.push({
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

      const watchlistAdd = await request("POST", `/listings/${trackedListingId}/watchlist`, {});
      const watchlistRemove = await request("DELETE", `/listings/${trackedListingId}/watchlist`);

      summary.mutation_checks.push({
        method: "POST/DELETE",
        route: `/listings/${trackedListingId}/watchlist`,
        status: watchlistAdd.status,
        ok: watchlistAdd.ok && watchlistRemove.ok,
        details: {
          add_summary: watchlistAdd.ok
            ? summarizePayload(watchlistAdd.data)
            : errorSummary(watchlistAdd.data),
          remove_summary: watchlistRemove.ok
            ? summarizePayload(watchlistRemove.data)
            : errorSummary(watchlistRemove.data),
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
