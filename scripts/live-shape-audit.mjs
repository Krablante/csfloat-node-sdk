import fs from "node:fs";
import path from "node:path";
import { decodeLink } from "@csfloat/cs2-inspect-serializer";

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
      (value.startsWith("\"") && value.endsWith("\"")) ||
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
    outDir: process.env.SHAPE_AUDIT_OUT_DIR || "/tmp/csfloat-shape-audit",
    delayMs: Number(process.env.SHAPE_AUDIT_DELAY_MS || 1500),
    retryDelayMs: Number(process.env.SHAPE_AUDIT_RETRY_DELAY_MS || 6000),
    retryOn429: process.env.SHAPE_AUDIT_RETRY_ON_429 !== "0",
    maxDepth: Number(process.env.SHAPE_AUDIT_MAX_DEPTH || 6),
    includeTokenHelpers: process.env.SHAPE_AUDIT_INCLUDE_TOKEN_HELPERS !== "0",
  };
}

async function sleep(ms) {
  if (ms > 0) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}

function collectPaths(value, prefix = "", depth = 0, maxDepth = 6, out = new Set()) {
  if (depth > maxDepth || value === null || value === undefined) {
    return out;
  }

  if (Array.isArray(value)) {
    out.add(prefix ? `${prefix}[]` : "[]");
    for (const item of value.slice(0, 10)) {
      collectPaths(item, prefix ? `${prefix}[]` : "[]", depth + 1, maxDepth, out);
    }
    return out;
  }

  if (typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      const nextPrefix = prefix ? `${prefix}.${key}` : key;
      out.add(nextPrefix);
      collectPaths(child, nextPrefix, depth + 1, maxDepth, out);
    }
  }

  return out;
}

function firstKeys(value) {
  if (Array.isArray(value)) {
    const first = value[0];
    return first && typeof first === "object" && !Array.isArray(first)
      ? Object.keys(first).slice(0, 20)
      : [];
  }

  if (value && typeof value === "object") {
    return Object.keys(value).slice(0, 20);
  }

  return [];
}

function summarize(value) {
  if (Array.isArray(value)) {
    return {
      kind: "array",
      length: value.length,
      firstKeys: firstKeys(value),
    };
  }

  if (value && typeof value === "object") {
    return {
      kind: "object",
      keys: Object.keys(value).slice(0, 20),
    };
  }

  return {
    kind: typeof value,
    preview: String(value).slice(0, 200),
  };
}

const MASKED_INSPECT_LINK_PATTERN =
  /^steam:\/\/run(?:game)?\/730\/\d*\/(?:\+|%20)csgo_econ_action_preview(?: |%20)([0-9A-Fa-f]+)$/i;

function isMaskedInspectLink(value) {
  return typeof value === "string" && MASKED_INSPECT_LINK_PATTERN.test(decodeURIComponent(value));
}

function resolveCurrentInspectLink(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  if (isMaskedInspectLink(item.serialized_inspect)) {
    return item.serialized_inspect;
  }

  if (isMaskedInspectLink(item.inspect_link)) {
    return item.inspect_link;
  }

  if (typeof item.inspect_link === "string") {
    return item.inspect_link;
  }

  return typeof item.serialized_inspect === "string" ? item.serialized_inspect : null;
}

function summarizeThrownError(error, depth = 0) {
  if (depth > 2 || error === null || error === undefined) {
    return {
      kind: typeof error,
      preview: String(error),
    };
  }

  if (error instanceof Error) {
    return {
      kind: "error",
      name: error.name,
      message: error.message,
      ...(typeof error.code === "string" ? { code: error.code } : {}),
      ...(typeof error.errno === "number" ? { errno: error.errno } : {}),
      ...(typeof error.hostname === "string" ? { hostname: error.hostname } : {}),
      ...(typeof error.syscall === "string" ? { syscall: error.syscall } : {}),
      ...("cause" in error && error.cause !== undefined
        ? { cause: summarizeThrownError(error.cause, depth + 1) }
        : {}),
    };
  }

  if (typeof error === "object") {
    return {
      kind: "object",
      preview: JSON.stringify(error).slice(0, 200),
    };
  }

  return {
    kind: typeof error,
    preview: String(error).slice(0, 200),
  };
}

function sanitizeName(name) {
  return name.replace(/[^a-z0-9._-]+/gi, "_");
}

function parseCsvText(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  return {
    lineCount: lines.length,
    header: lines[0] ?? "",
    preview: lines.slice(0, 5),
  };
}

function buildLocalInspectSnapshot(inspectLink) {
  const decoded = decodeLink(inspectLink);
  return {
    iteminfo: {
      defindex: decoded.defindex,
      paintindex: decoded.paintindex,
      rarity: decoded.rarity,
      quality: decoded.quality,
      paintseed: decoded.paintseed,
      floatvalue: decoded.paintwear,
      stickers: decoded.stickers,
      keychains: decoded.keychains,
      variations: decoded.variations,
    },
  };
}

async function main() {
  const config = getConfig();
  fs.mkdirSync(config.outDir, { recursive: true });

  const stats = {
    requests: 0,
    retries429: 0,
  };

  let lastRequestAt = 0;

  async function pacedFetch(url, init) {
    const now = Date.now();
    const waitMs = Math.max(0, config.delayMs - (now - lastRequestAt));
    await sleep(waitMs);

    let response = await fetch(url, init);
    lastRequestAt = Date.now();
    stats.requests += 1;

    if (config.retryOn429 && response.status === 429) {
      stats.retries429 += 1;
      await sleep(Math.max(config.retryDelayMs, config.delayMs * 4));
      response = await fetch(url, init);
      lastRequestAt = Date.now();
      stats.requests += 1;
    }

    return response;
  }

  async function request(spec) {
    const baseHeaders = {
      Accept: spec.accept ?? "application/json",
      ...(spec.auth === false ? {} : { Authorization: config.apiKey }),
      ...(spec.headers ?? {}),
    };

    if (spec.body && !baseHeaders["Content-Type"]) {
      baseHeaders["Content-Type"] = "application/json";
    }

    const response = await pacedFetch(
      spec.url ?? `${config.baseUrl}${spec.route}`,
      {
        method: spec.method ?? "GET",
        headers: baseHeaders,
        body: spec.body ? JSON.stringify(spec.body) : undefined,
      },
    );

    const text = await response.text();
    let data;

    if (spec.parseAs === "text") {
      data = text;
    } else {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    return {
      status: response.status,
      ok: response.ok,
      data,
    };
  }

  const context = {};
  const summary = {
    generated_at: new Date().toISOString(),
    out_dir: config.outDir,
    delay_ms: config.delayMs,
    retry_delay_ms: config.retryDelayMs,
    retry_on_429: config.retryOn429,
    include_token_helpers: config.includeTokenHelpers,
    stats,
    routes: {},
    skipped: [],
  };

  function addSkipped(name, reason) {
    summary.skipped.push({ name, reason });
  }

  const me = await request({ route: "/me" });
  if (!me.ok) {
    throw new Error(`Failed bootstrap GET /me (${me.status})`);
  }

  context.me = me.data;
  context.steamId = context.me?.user?.steam_id ? String(context.me.user.steam_id) : null;

  const listingPreview = await request({ route: "/listings?limit=5&type=buy_now" });
  if (listingPreview.ok && Array.isArray(listingPreview.data?.data)) {
    context.listings = listingPreview.data.data;
    context.firstListing = context.listings[0] ?? null;
    context.firstListingId = context.firstListing?.id ? String(context.firstListing.id) : null;
    const inspectCandidate = context.listings.find(
      (listing) => isMaskedInspectLink(resolveCurrentInspectLink(listing?.item)),
    ) ?? context.listings.find(
      (listing) => typeof resolveCurrentInspectLink(listing?.item) === "string",
    ) ?? null;

    context.firstInspectLink =
      resolveCurrentInspectLink(inspectCandidate?.item);
    context.firstInspectMarketHashName =
      inspectCandidate?.item?.market_hash_name ?? null;
    context.firstInspectSig =
      inspectCandidate?.item?.gs_sig ?? null;
  }

  const auctionPreview = await request({ route: "/listings?limit=5&type=auction" });
  if (auctionPreview.ok && Array.isArray(auctionPreview.data?.data)) {
    context.firstAuction = auctionPreview.data.data[0] ?? null;
    context.firstAuctionId = context.firstAuction?.id ? String(context.firstAuction.id) : null;
  }

  const offersPreview = await request({ route: "/me/offers?page=0&limit=1" });
  if (offersPreview.ok && Array.isArray(offersPreview.data?.offers)) {
    context.firstOffer = offersPreview.data.offers[0] ?? null;
    context.firstOfferId = context.firstOffer?.id ? String(context.firstOffer.id) : null;
  }

  const tradesPreview = await request({ route: "/me/trades?page=0&limit=1" });
  if (tradesPreview.ok && Array.isArray(tradesPreview.data?.trades)) {
    context.firstTrade = tradesPreview.data.trades[0] ?? null;
    context.firstTradeId = context.firstTrade?.id ? String(context.firstTrade.id) : null;
  }

  const buyOrdersPreview = await request({ route: "/me/buy-orders?page=0&limit=1" });
  if (buyOrdersPreview.ok && Array.isArray(buyOrdersPreview.data?.orders)) {
    context.firstBuyOrder = buyOrdersPreview.data.orders[0] ?? null;
    context.firstBuyOrderId = context.firstBuyOrder?.id ? String(context.firstBuyOrder.id) : null;
  }

  const safeMonth = (() => {
    const now = new Date();
    const utcYear = now.getUTCFullYear();
    const utcMonth = now.getUTCMonth() + 1;
    if (utcMonth === 1) {
      return { year: utcYear - 1, month: 12 };
    }
    return { year: utcYear, month: utcMonth - 1 };
  })();

  const routeSpecs = [
    { name: "schema", route: "/schema" },
    { name: "schema_browse_stickers", route: "/schema/browse?type=stickers" },
    { name: "schema_browse_keychains", route: "/schema/browse?type=keychains" },
    { name: "schema_item_screenshot", route: "/schema/images/screenshot?def_index=7&paint_index=490&min_float=0.15&max_float=0.38" },
    { name: "exchange_rates", route: "/meta/exchange-rates" },
    { name: "app_meta", route: "/meta/app" },
    { name: "location", route: "/meta/location" },
    { name: "notary_meta", route: "/meta/notary" },
    { name: "me", route: "/me" },
    { name: "inventory", route: "/me/inventory" },
    { name: "account_standing", route: "/me/account-standing" },
    { name: "transactions", route: "/me/transactions?limit=10&page=0&order=desc" },
    {
      name: "transactions_export",
      route: `/me/transactions/export?year=${safeMonth.year}&month=${safeMonth.month}`,
      parseAs: "text",
    },
    { name: "trades", route: "/me/trades?limit=10&page=0" },
    { name: "offers", route: "/me/offers?limit=10&page=0" },
    { name: "offers_timeline", route: "/me/offers-timeline?limit=10" },
    { name: "watchlist", route: "/me/watchlist?limit=10" },
    { name: "notifications", route: "/me/notifications/timeline" },
    { name: "buy_orders", route: "/me/buy-orders?limit=10&page=0&order=desc" },
    { name: "auto_bids", route: "/me/auto-bids" },
    { name: "pending_deposits", route: "/me/payments/pending-deposits" },
    { name: "max_withdrawable", route: "/me/payments/max-withdrawable" },
    { name: "pending_withdrawals", route: "/me/pending-withdrawals" },
    { name: "extension_status", route: "/me/extension/status" },
    { name: "mobile_status", route: "/me/mobile/status" },
    { name: "price_list", route: "/listings/price-list" },
    { name: "listings", route: "/listings?limit=10&type=buy_now" },
    { name: "user", skipUnless: () => context.steamId, route: () => `/users/${context.steamId}` },
    { name: "stall", skipUnless: () => context.steamId, route: () => `/users/${context.steamId}/stall?limit=10&type=buy_now` },
    { name: "listing", skipUnless: () => context.firstListingId, route: () => `/listings/${context.firstListingId}` },
    { name: "listing_buy_orders", skipUnless: () => context.firstListingId, route: () => `/listings/${context.firstListingId}/buy-orders?limit=5` },
    { name: "listing_similar", skipUnless: () => context.firstListingId, route: () => `/listings/${context.firstListingId}/similar` },
    { name: "auction_bids", skipUnless: () => context.firstAuctionId, route: () => `/listings/${context.firstAuctionId}/bids` },
    {
      name: "sales",
      route: `/history/${encodeURIComponent("Souvenir P250 | Boreal Forest (Factory New)")}/sales`,
    },
    {
      name: "graph_paint",
      route: `/history/${encodeURIComponent("Souvenir P250 | Boreal Forest (Factory New)")}/graph?paint_index=77`,
    },
    {
      name: "graph_no_paint",
      route: `/history/${encodeURIComponent("AK-47 | Redline (Field-Tested)")}/graph`,
    },
    {
      name: "inspect_buy_orders",
      skipUnless: () =>
        context.firstInspectLink &&
        context.firstInspectMarketHashName &&
        context.firstInspectSig,
      route: () =>
        `/buy-orders/item?url=${encodeURIComponent(context.firstInspectLink)}&market_hash_name=${encodeURIComponent(context.firstInspectMarketHashName)}&sig=${encodeURIComponent(context.firstInspectSig)}&limit=3`,
    },
    {
      name: "similar_buy_orders_market_hash",
      method: "POST",
      route: "/buy-orders/similar-orders?limit=5",
      body: { market_hash_name: "AK-47 | Redline (Field-Tested)" },
    },
    {
      name: "inspect_item",
      skipUnless: () => context.firstInspectLink,
      local: () => buildLocalInspectSnapshot(context.firstInspectLink),
      localLabel: "local:masked-inspect-decode",
    },
    {
      name: "loadout_public_discover",
      auth: false,
      url: "https://loadout-api.csfloat.com/v1/loadout?sort_by=favorites&limit=5&months=1&any_filled=true",
    },
    {
      name: "loadout_user_loadouts",
      skipUnless: () => context.steamId,
      auth: false,
      url: () => `https://loadout-api.csfloat.com/v1/user/${context.steamId}/loadouts`,
    },
    {
      name: "trade_detail",
      skipUnless: () => context.firstTradeId,
      route: () => `/trades/${context.firstTradeId}`,
    },
    {
      name: "trade_buyer_details",
      skipUnless: () => context.firstTradeId,
      route: () => `/trades/${context.firstTradeId}/buyer-details`,
    },
    {
      name: "offer_detail",
      skipUnless: () => context.firstOfferId,
      route: () => `/offers/${context.firstOfferId}`,
    },
    {
      name: "offer_history",
      skipUnless: () => context.firstOfferId,
      route: () => `/offers/${context.firstOfferId}/history`,
    },
  ];

  const lowRiskPostSpecs = config.includeTokenHelpers ? [
    { name: "recommender_token", method: "POST", route: "/me/recommender-token", body: {} },
    { name: "notary_token", method: "POST", route: "/me/notary-token", body: {} },
    { name: "gs_inspect_token", method: "POST", route: "/me/gs-inspect-token", body: {} },
  ] : [];

  for (const spec of [...routeSpecs, ...lowRiskPostSpecs]) {
    const skipReason = spec.skipUnless && !spec.skipUnless();
    if (skipReason) {
      addSkipped(spec.name, "missing safe runtime context for this route");
      continue;
    }

    const resolved = {
      ...spec,
      route: typeof spec.route === "function" ? spec.route() : spec.route,
      url: typeof spec.url === "function" ? spec.url() : spec.url,
      local: typeof spec.local === "function" ? spec.local : spec.local,
    };

    const outputPath = path.join(config.outDir, `${sanitizeName(spec.name)}.json`);
    try {
      const result = resolved.local
        ? {
            status: 200,
            ok: true,
            data: await resolved.local(),
          }
        : await request(resolved);

      if (resolved.parseAs === "text") {
        fs.writeFileSync(outputPath, String(result.data), "utf8");
      } else {
        fs.writeFileSync(outputPath, JSON.stringify(result.data, null, 2));
      }

      summary.routes[spec.name] = {
        method: resolved.local ? "LOCAL" : (resolved.method ?? "GET"),
        route: resolved.route ?? resolved.url ?? resolved.localLabel ?? "local",
        status: result.status,
        ok: result.ok,
        summary: resolved.parseAs === "text"
          ? { kind: "text", ...parseCsvText(String(result.data)) }
          : summarize(result.data),
        paths: resolved.parseAs === "text"
          ? []
          : Array.from(collectPaths(result.data, "", 0, config.maxDepth)).sort(),
      };

      if (spec.name === "recommender_token" && result.ok && result.data?.token) {
        context.recommenderToken = result.data.token;
      }
    } catch (error) {
      const summarizedError = summarizeThrownError(error);
      fs.writeFileSync(
        outputPath,
        JSON.stringify({ error: summarizedError }, null, 2),
      );
      summary.routes[spec.name] = {
        method: resolved.local ? "LOCAL" : (resolved.method ?? "GET"),
        route: resolved.route ?? resolved.url ?? resolved.localLabel ?? "local",
        status: null,
        ok: false,
        summary: summarizedError,
        paths: [],
      };
    }
  }

  const tokenRoutes = [
    {
      name: "loadout_favorites",
      skipUnless: () => context.recommenderToken,
      auth: false,
      url: "https://loadout-api.csfloat.com/v1/user/favorites",
      headers: () => ({ Authorization: `Bearer ${context.recommenderToken}` }),
    },
    {
      name: "loadout_recommend_for_skin",
      skipUnless: () => context.recommenderToken,
      auth: false,
      method: "POST",
      url: "https://loadout-api.csfloat.com/v1/recommend",
      headers: () => ({ Authorization: `Bearer ${context.recommenderToken}` }),
      body: { items: [{ type: "skin", def_index: 7, paint_index: 490 }], count: 3 },
    },
  ];

  for (const spec of tokenRoutes) {
    if (!config.includeTokenHelpers) {
      addSkipped(spec.name, "token helper coverage disabled");
      continue;
    }

    if (!spec.skipUnless()) {
      addSkipped(spec.name, "missing recommender token");
      continue;
    }

    const resolved = {
      ...spec,
      headers: typeof spec.headers === "function" ? spec.headers() : spec.headers,
    };

    const outputPath = path.join(config.outDir, `${sanitizeName(spec.name)}.json`);

    try {
      const result = await request(resolved);
      fs.writeFileSync(
        outputPath,
        JSON.stringify(result.data, null, 2),
      );
      summary.routes[spec.name] = {
        method: resolved.method ?? "GET",
        route: resolved.url,
        status: result.status,
        ok: result.ok,
        summary: summarize(result.data),
        paths: Array.from(collectPaths(result.data, "", 0, config.maxDepth)).sort(),
      };
    } catch (error) {
      const summarizedError = summarizeThrownError(error);
      fs.writeFileSync(
        outputPath,
        JSON.stringify({ error: summarizedError }, null, 2),
      );
      summary.routes[spec.name] = {
        method: resolved.method ?? "GET",
        route: resolved.url,
        status: null,
        ok: false,
        summary: summarizedError,
        paths: [],
      };
    }
  }

  fs.writeFileSync(
    path.join(config.outDir, "_summary.json"),
    JSON.stringify(summary, null, 2),
  );

  console.log(JSON.stringify({
    outDir: config.outDir,
    routeCount: Object.keys(summary.routes).length,
    skipped: summary.skipped.length,
    stats,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
