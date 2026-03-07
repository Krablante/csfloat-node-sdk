import { CsfloatSdk } from "../dist/index.js";

const apiKey = process.env.CSFLOAT_API_KEY;

if (!apiKey) {
  throw new Error("Missing CSFLOAT_API_KEY");
}

const sdk = new CsfloatSdk({ apiKey });

const me = await sdk.account.getMe();
const inventory = await sdk.inventory.getInventory();
const stall = await sdk.stall.getStall(me.user.steam_id, { limit: 10 });

console.log(
  JSON.stringify(
    {
      me: {
        steam_id: me.user.steam_id,
        username: me.user.username,
      },
      inventory_count: inventory.length,
      stall_count: stall.total_count ?? stall.data.length,
      first_stall_ids: stall.data.slice(0, 3).map((listing) => listing.id),
    },
    null,
    2,
  ),
);
