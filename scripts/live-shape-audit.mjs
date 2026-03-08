import fs from "node:fs";
import path from "node:path";

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
    delayMs: Number(process.env.SHAPE_AUDIT_DELAY_MS || 400),
    allowLiveMutations: process.env.ALLOW_LIVE_MUTATIONS === "1",
  };
}

async function sleep(ms) {
  if (ms <= 0) {
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, ms));
}

function collectPaths(value, prefix = "", depth = 0, maxDepth = 5, out = new Set()) {
  if (depth > maxDepth || value === null || value === undefined) {
    return out;
  }

  if (Array.isArray(value)) {
    out.add(prefix ? `${prefix}[]` : "[]");
    for (const item of value.slice(0, 20)) {
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

function summarize(value) {
  if (Array.isArray(value)) {
    return {
      kind: "array",
      length: value.length,
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

async function main() {
  const config = getConfig();
  fs.mkdirSync(config.outDir, { recursive: true });

  let lastRequestAt = 0;

  async function request(route, options = {}) {
    const now = Date.now();
    const waitMs = Math.max(0, config.delayMs - (now - lastRequestAt));
    if (waitMs > 0) {
      await sleep(waitMs);
    }

    const response = await fetch(`${config.baseUrl}${route}`, {
      headers: {
        Authorization: config.apiKey,
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
      },
      ...options,
    });
    lastRequestAt = Date.now();

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    return {
      route,
      status: response.status,
      ok: response.ok,
      data,
    };
  }

  const me = await request("/me");
  const steamId = String(me.data.user.steam_id);
  const listings = await request("/listings?limit=1&type=buy_now");
  const listingId = String(listings.data.data[0].id);

  const routes = {
    schema: "/schema",
    schema_browse_stickers: "/schema/browse?type=stickers",
    schema_item_screenshot: "/schema/images/screenshot?def_index=7&paint_index=490&min_float=0.15&max_float=0.38",
    exchange_rates: "/meta/exchange-rates",
    app_meta: "/meta/app",
    location: "/meta/location",
    me: "/me",
    inventory: "/me/inventory",
    account_standing: "/me/account-standing",
    transactions: "/me/transactions?limit=10",
    trades: "/me/trades?limit=10",
    offers: "/me/offers?limit=10",
    offers_timeline: "/me/offers-timeline?limit=10",
    watchlist: "/me/watchlist?limit=10",
    notifications: "/me/notifications/timeline",
    buy_orders: "/me/buy-orders?limit=10",
    auto_bids: "/me/auto-bids",
    pending_deposits: "/me/payments/pending-deposits",
    mobile_status: "/me/mobile/status",
    user: `/users/${steamId}`,
    stall: `/users/${steamId}/stall?limit=10&type=buy_now`,
    listings: "/listings?limit=10&type=buy_now",
    listing: `/listings/${listingId}`,
    auction_bids: "/listings/949824804901487637/bids",
    listing_buy_orders: "/listings/948726619852374910/buy-orders",
    similar: "/listings/948726619852374910/similar",
    sales: `/history/${encodeURIComponent("Souvenir P250 | Boreal Forest (Factory New)")}/sales`,
    graph_paint: `/history/${encodeURIComponent("Souvenir P250 | Boreal Forest (Factory New)")}/graph?paint_index=77`,
    graph_no_paint: `/history/${encodeURIComponent("AK-47 | Redline (Field-Tested)")}/graph`,
    listings_fade: "/listings?limit=10&type=buy_now&def_index=507&paint_index=38&min_fade=99&max_fade=100",
    listings_music_kit: "/listings?limit=10&type=buy_now&music_kit_index=3",
    listings_keychain_highlight: "/listings?limit=10&type=buy_now&keychain_highlight_reel=1",
  };

  const summary = {
    generated_at: new Date().toISOString(),
    out_dir: config.outDir,
    allow_live_mutations: config.allowLiveMutations,
    routes: {},
  };

  for (const [name, route] of Object.entries(routes)) {
    const result = await request(route);
    fs.writeFileSync(
      path.join(config.outDir, `${name}.json`),
      JSON.stringify(result.data, null, 2),
    );
    summary.routes[name] = {
      route,
      status: result.status,
      ok: result.ok,
      summary: summarize(result.data),
      paths: Array.from(collectPaths(result.data)).sort(),
    };
  }

  if (config.allowLiveMutations) {
    const create = await request("/buy-orders", {
      method: "POST",
      body: JSON.stringify({
        market_hash_name: "AWP | Dragon Lore (Factory New)",
        max_price: 1,
      }),
    });

    summary.temp_buy_order = {
      create_status: create.status,
      create_ok: create.ok,
      create_summary: summarize(create.data),
    };

    if (create.ok && create.data?.id) {
      fs.writeFileSync(
        path.join(config.outDir, "temp_buy_order_create.json"),
        JSON.stringify(create.data, null, 2),
      );

      const afterCreate = await request("/me/buy-orders?limit=10");
      fs.writeFileSync(
        path.join(config.outDir, "buy_orders_after_temp_create.json"),
        JSON.stringify(afterCreate.data, null, 2),
      );
      summary.temp_buy_order.after_create_paths = Array.from(
        collectPaths(afterCreate.data),
      ).sort();

      const del = await request(`/buy-orders/${create.data.id}`, {
        method: "DELETE",
      });
      summary.temp_buy_order.delete_status = del.status;
      summary.temp_buy_order.delete_ok = del.ok;
      summary.temp_buy_order.delete_summary = summarize(del.data);
    }
  }

  fs.writeFileSync(
    path.join(config.outDir, "_summary.json"),
    JSON.stringify(summary, null, 2),
  );

  console.log(
    JSON.stringify(
      {
        outDir: config.outDir,
        routeCount: Object.keys(routes).length,
        allowLiveMutations: config.allowLiveMutations,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
