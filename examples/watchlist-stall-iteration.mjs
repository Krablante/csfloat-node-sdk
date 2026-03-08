import { CsfloatSdk } from "../dist/index.js";

const apiKey = process.env.CSFLOAT_API_KEY;

if (!apiKey) {
  throw new Error("Missing CSFLOAT_API_KEY");
}

const sdk = new CsfloatSdk({ apiKey });

const me = await sdk.account.getMe();

const watchlistIds = [];
for await (const listing of sdk.account.iterateWatchlist({
  limit: 5,
  state: "listed",
})) {
  watchlistIds.push(String(listing.id));
  if (watchlistIds.length >= 5) {
    break;
  }
}

const stallIds = [];
for await (const listing of sdk.stall.iterateStall(me.user.steam_id, {
  limit: 20,
  type: "buy_now",
})) {
  stallIds.push(String(listing.id));
  if (stallIds.length >= 5) {
    break;
  }
}

console.log(
  JSON.stringify(
    {
      steam_id: me.user.steam_id,
      listed_watchlist_ids: watchlistIds,
      public_stall_ids: stallIds,
    },
    null,
    2,
  ),
);
