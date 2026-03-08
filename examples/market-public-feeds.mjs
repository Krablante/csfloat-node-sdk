import {
  CsfloatSdk,
  getHomepageFeedParams,
  getPublicMarketPageParams,
} from "../dist/index.js";

const apiKey = process.env.CSFLOAT_API_KEY;

if (!apiKey) {
  throw new Error("Missing CSFLOAT_API_KEY");
}

const sdk = new CsfloatSdk({ apiKey });

const [publicSearchPage, topDeals, newestItems, uniqueItems] = await Promise.all([
  sdk.listings.getListings(getPublicMarketPageParams()),
  sdk.listings.getListings(getHomepageFeedParams("top_deals")),
  sdk.listings.getListings(getHomepageFeedParams("newest")),
  sdk.listings.getListings(getHomepageFeedParams("unique")),
]);

console.log(
  JSON.stringify(
    {
      public_search_page: publicSearchPage.data.slice(0, 3).map((listing) => ({
        id: listing.id,
        market_hash_name: listing.item?.market_hash_name,
        price: listing.price,
      })),
      top_deals: topDeals.data.slice(0, 3).map((listing) => ({
        id: listing.id,
        market_hash_name: listing.item?.market_hash_name,
        price: listing.price,
      })),
      newest_items: newestItems.data.slice(0, 3).map((listing) => ({
        id: listing.id,
        market_hash_name: listing.item?.market_hash_name,
        price: listing.price,
      })),
      unique_items: uniqueItems.data.slice(0, 3).map((listing) => ({
        id: listing.id,
        market_hash_name: listing.item?.market_hash_name,
        price: listing.price,
      })),
    },
    null,
    2,
  ),
);
