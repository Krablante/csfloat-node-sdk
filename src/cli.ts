#!/usr/bin/env node

import { CsfloatSdk } from "./sdk.js";
import type { CsfloatListing } from "./types.js";

interface ParsedArgs {
  command?: string;
  flags: Record<string, string | boolean>;
}

function printHelp(): void {
  console.log(`csfloat-node-sdk CLI

Usage:
  csfloat-node-sdk feeds [--api-key <key>] [--public-page-limit <n>] [--feed-limit <n>]
  csfloat-node-sdk workspace [--api-key <key>] [--watchlist-limit <n>] [--stall-limit <n>] [--offer-limit <n>] [--trade-limit <n>] [--auto-bid-limit <n>]
  csfloat-node-sdk buy-order-similar --def-index <n> --paint-index <n> [--api-key <key>] [--similar-limit <n>] [--listing-limit <n>] [--sort-by <value>] [--stattrak true|false] [--souvenir true|false] [--min-float <n>] [--max-float <n>] [--paint-seed <n>] [--rarity <n>] [--preview-max-price <n>] [--quantity <n>]

Environment:
  CSFLOAT_API_KEY=<key>
`);
}

function parseArgs(argv: string[]): ParsedArgs {
  const flags: Record<string, string | boolean> = {};
  let command: string | undefined;

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === undefined) {
      continue;
    }

    if (token.startsWith("--")) {
      const key = token.slice(2);
      const next = argv[index + 1];
      if (!next || next.startsWith("--")) {
        flags[key] = true;
        continue;
      }

      flags[key] = next;
      index += 1;
      continue;
    }

    if (!command) {
      command = token;
    }
  }

  return command === undefined ? { flags } : { command, flags };
}

function getStringFlag(flags: ParsedArgs["flags"], key: string): string | undefined {
  const value = flags[key];
  return typeof value === "string" ? value : undefined;
}

function getIntegerFlag(
  flags: ParsedArgs["flags"],
  key: string,
): number | undefined {
  const raw = getStringFlag(flags, key);
  if (raw === undefined) {
    return undefined;
  }

  const value = Number(raw);
  if (!Number.isInteger(value)) {
    throw new Error(`--${key} must be an integer`);
  }

  return value;
}

function getNumberFlag(flags: ParsedArgs["flags"], key: string): number | undefined {
  const raw = getStringFlag(flags, key);
  if (raw === undefined) {
    return undefined;
  }

  const value = Number(raw);
  if (!Number.isFinite(value)) {
    throw new Error(`--${key} must be a number`);
  }

  return value;
}

function getBooleanFlag(
  flags: ParsedArgs["flags"],
  key: string,
): boolean | undefined {
  const raw = getStringFlag(flags, key);
  if (raw === undefined) {
    return undefined;
  }

  if (raw === "true") {
    return true;
  }

  if (raw === "false") {
    return false;
  }

  throw new Error(`--${key} must be "true" or "false"`);
}

function summarizeListing(listing: CsfloatListing) {
  return {
    id: listing.id,
    market_hash_name: listing.item?.market_hash_name,
    price: listing.price,
    float_value: listing.item?.float_value,
  };
}

async function run(): Promise<void> {
  const { command, flags } = parseArgs(process.argv.slice(2));

  if (!command || command === "help" || command === "--help") {
    printHelp();
    return;
  }

  const apiKey = getStringFlag(flags, "api-key") ?? process.env.CSFLOAT_API_KEY;

  if (!apiKey) {
    throw new Error("Missing API key. Set CSFLOAT_API_KEY or pass --api-key");
  }

  const sdk = new CsfloatSdk({ apiKey });

  if (command === "feeds") {
    const publicPageLimit = getIntegerFlag(flags, "public-page-limit");
    const feedLimit = getIntegerFlag(flags, "feed-limit");
    const result = await sdk.workflows.getPublicMarketFeeds({
      ...(publicPageLimit === undefined ? {} : { public_page_limit: publicPageLimit }),
      ...(feedLimit === undefined ? {} : { feed_limit: feedLimit }),
    });

    console.log(
      JSON.stringify(
        {
          public_search_page: result.public_search_page.map(summarizeListing),
          top_deals: result.top_deals.map(summarizeListing),
          newest: result.newest.map(summarizeListing),
          unique: result.unique.map(summarizeListing),
        },
        null,
        2,
      ),
    );
    return;
  }

  if (command === "workspace") {
    const watchlistLimit = getIntegerFlag(flags, "watchlist-limit");
    const stallLimit = getIntegerFlag(flags, "stall-limit");
    const offerLimit = getIntegerFlag(flags, "offer-limit");
    const tradeLimit = getIntegerFlag(flags, "trade-limit");
    const autoBidLimit = getIntegerFlag(flags, "auto-bid-limit");
    const result = await sdk.workflows.getAccountWorkspace({
      ...(watchlistLimit === undefined ? {} : { watchlist_limit: watchlistLimit }),
      ...(stallLimit === undefined ? {} : { stall_limit: stallLimit }),
      ...(offerLimit === undefined ? {} : { offer_limit: offerLimit }),
      ...(tradeLimit === undefined ? {} : { trade_limit: tradeLimit }),
      ...(autoBidLimit === undefined ? {} : { auto_bid_limit: autoBidLimit }),
    });

    console.log(
      JSON.stringify(
        {
          me: {
            steam_id: result.me.user.steam_id,
            username: result.me.user.username,
            pending_offers: result.me.pending_offers,
            actionable_trades: result.me.actionable_trades,
            has_unread_notifications: result.me.has_unread_notifications,
          },
          watchlist: result.watchlist.map(summarizeListing),
          stall: result.stall.map(summarizeListing),
          offers: result.offers.map((offer) => ({
            id: offer.id,
            type: offer.type,
            state: offer.state,
            price: offer.price,
            contract_id: offer.contract_id,
          })),
          trades: result.trades.map((trade) => ({
            id: trade.id,
            state: trade.state,
            verification_mode: trade.verification_mode,
            contract_id: trade.contract?.id,
          })),
          auto_bids: result.auto_bids.map((bid) => ({
            id: bid.id,
            contract_id: bid.contract_id,
            max_price: bid.max_price,
          })),
        },
        null,
        2,
      ),
    );
    return;
  }

  if (command === "buy-order-similar") {
    const defIndex = getIntegerFlag(flags, "def-index");
    const paintIndex = getIntegerFlag(flags, "paint-index");

    if (defIndex === undefined || paintIndex === undefined) {
      throw new Error("buy-order-similar requires --def-index and --paint-index");
    }

    const result = await sdk.workflows.getSingleSkinBuyOrderInsights(defIndex, paintIndex, {
      ...(getIntegerFlag(flags, "similar-limit") === undefined
        ? {}
        : { similar_limit: getIntegerFlag(flags, "similar-limit")! }),
      ...(getIntegerFlag(flags, "listing-limit") === undefined
        ? {}
        : { listing_limit: getIntegerFlag(flags, "listing-limit")! }),
      ...(getStringFlag(flags, "sort-by") === undefined
        ? {}
        : { sort_by: getStringFlag(flags, "sort-by") as never }),
      ...(getBooleanFlag(flags, "stattrak") === undefined
        ? {}
        : { stattrak: getBooleanFlag(flags, "stattrak")! }),
      ...(getBooleanFlag(flags, "souvenir") === undefined
        ? {}
        : { souvenir: getBooleanFlag(flags, "souvenir")! }),
      ...(getNumberFlag(flags, "min-float") === undefined
        ? {}
        : { min_float: getNumberFlag(flags, "min-float")! }),
      ...(getNumberFlag(flags, "max-float") === undefined
        ? {}
        : { max_float: getNumberFlag(flags, "max-float")! }),
      ...(getIntegerFlag(flags, "paint-seed") === undefined
        ? {}
        : { paint_seed: getIntegerFlag(flags, "paint-seed")! }),
      ...(getIntegerFlag(flags, "rarity") === undefined
        ? {}
        : { rarity: getIntegerFlag(flags, "rarity")! }),
      ...(getIntegerFlag(flags, "preview-max-price") === undefined
        ? {}
        : { preview_max_price: getIntegerFlag(flags, "preview-max-price")! }),
      ...(getIntegerFlag(flags, "quantity") === undefined
        ? {}
        : { quantity: getIntegerFlag(flags, "quantity")! }),
    });

    console.log(
      JSON.stringify(
        {
          expression: result.expression,
          request_preview: result.request_preview,
          similar_orders: result.similar_orders,
          matching_listings: result.matching_listings.map(summarizeListing),
        },
        null,
        2,
      ),
    );
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
