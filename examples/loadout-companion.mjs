import { CsfloatSdk } from "../dist/index.js";

const apiKey = process.env.CSFLOAT_API_KEY;

if (!apiKey) {
  throw new Error("Missing CSFLOAT_API_KEY");
}

const sdk = new CsfloatSdk({ apiKey });

const recommender = await sdk.account.createRecommenderToken();
const discover = await sdk.loadout.getDiscoverLoadouts({
  limit: 5,
  def_index: 7,
  paint_index: 490,
});
const skinLoadouts = await sdk.loadout.getSkinLoadouts(7, 490, {
  limit: 5,
  months: 1,
});
const skinRecommendations = await sdk.loadout.recommendForSkin(
  recommender.token,
  7,
  490,
  {
    count: 5,
    def_whitelist: [7, 9, 13],
  },
);
const stickerRecommendations = await sdk.loadout.recommendStickersForSkin(
  recommender.token,
  7,
  490,
  {
    count: 10,
  },
);

console.log(
  JSON.stringify(
    {
      discover_ids: discover.loadouts.slice(0, 3).map((loadout) => loadout.id),
      skin_loadout_ids: skinLoadouts.loadouts.slice(0, 3).map((loadout) => loadout.id),
      skin_recommendations: skinRecommendations.results.slice(0, 5),
      sticker_recommendations: stickerRecommendations.results.slice(0, 5),
    },
    null,
    2,
  ),
);
