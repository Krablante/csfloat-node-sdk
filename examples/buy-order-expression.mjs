import {
  buildSingleSkinBuyOrderExpression,
  buildSingleSkinBuyOrderRequest,
  CsfloatSdk,
} from "../dist/index.js";

const apiKey = process.env.CSFLOAT_API_KEY;

if (!apiKey) {
  throw new Error("Missing CSFLOAT_API_KEY");
}

const sdk = new CsfloatSdk({ apiKey });

const expression = buildSingleSkinBuyOrderExpression(7, 72, {
  stattrak: false,
  souvenir: false,
});

const requestPreview = buildSingleSkinBuyOrderRequest(7, 72, {
  max_price: 3,
  quantity: 1,
  stattrak: false,
  souvenir: false,
});

const similar = await sdk.account.getSimilarBuyOrders({ expression }, 3);

console.log(
  JSON.stringify(
    {
      request_preview: requestPreview,
      similar_orders: similar.data,
    },
    null,
    2,
  ),
);
