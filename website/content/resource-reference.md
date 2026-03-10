# Resource Reference

This page is the method-level reference for the runtime SDK surface.

For the higher-level map of when to use each surface, see [Resources, Workflows, And Surface Map](./resources-and-workflows.md). For builders and presets, see [Helpers, Builders, And Constants](./helpers-and-builders.md). For minimal write payloads and caveats on mutation-heavy routes, see [Write Flows And Payloads](./write-flows-and-payloads.md).

## Main Entry Points

| Symbol | Use It For | Notes |
|---|---|---|
| `CsfloatSdk` | the normal application entrypoint | wires `client`, `account`, `inventory`, `stall`, `listings`, `loadout`, `history`, `users`, `meta`, and `workflows` |
| `CsfloatHttpClient` | low-level transport access | useful for wrappers, custom base URLs, and metadata access |
| `CsfloatSdkError` | thrown on transport or API failures | pairs with `isCsfloatSdkError()` |
| `LoadoutResource` | advanced direct access to the loadout resource class | most users reach it through `sdk.loadout` |
| `WorkflowResource` | advanced direct access to the workflow class | most users reach it through `sdk.workflows` |

## `sdk.meta`

| Method | Returns | Use It For | Notes |
|---|---|---|---|
| `getSchema()` | `Promise<CsfloatSchemaResponse>` | full public schema bootstrap | pairs with schema helper exports |
| `getExchangeRates()` | `Promise<CsfloatExchangeRatesResponse>` | exchange-rate lookup | public route |
| `getApp()` | `Promise<CsfloatAppMetaResponse>` | app bootstrap metadata | public route |
| `getLocation()` | `Promise<CsfloatLocationResponse>` | inferred location metadata | public route |
| `getSchemaBrowse(type)` | `Promise<CsfloatSchemaBrowseResponse>` | grouped browse categories such as stickers or keychains | `type` is `CsfloatSchemaBrowseType` |
| `getItemExampleScreenshot(params)` | `Promise<CsfloatSchemaScreenshotResponse>` | example media lookup for a schema item | use schema helpers to build final image URLs |
| `getNotary()` | `Promise<CsfloatNotaryMetaResponse>` | current notary-related capability flags | authenticated/helper-adjacent |
| `inspectItem(inspectLink)` | `Promise<CsfloatInspectResponse>` | inspect-link lookup through the companion surface | the SDK handles the required base URL and `Origin` header |

Key types:
`CsfloatSchemaResponse`, `CsfloatSchemaBrowseType`, `CsfloatSchemaScreenshotParams`, `CsfloatInspectResponse`

## `sdk.account`

### Profile And Account Snapshot

| Method | Returns | Use It For | Notes |
|---|---|---|---|
| `getMe()` | `Promise<CsfloatMeResponse>` | authenticated account snapshot | normal authenticated bootstrap |
| `updateMe(request)` | `Promise<CsfloatMessageResponse>` | low-level profile/account patching | direct wrapper over `PATCH /me` |
| `setOffersEnabled(enabled)` | `Promise<CsfloatMessageResponse>` | enable or disable offers | convenience wrapper over `updateMe()` |
| `setStallPublic(isPublic)` | `Promise<CsfloatMessageResponse>` | toggle public stall visibility | convenience wrapper |
| `setAway(isAway)` | `Promise<CsfloatMessageResponse>` | update away status | convenience wrapper |
| `setMaxOfferDiscount(maxOfferDiscount)` | `Promise<CsfloatMessageResponse>` | change account max-offer discount | convenience wrapper |
| `updateTradeUrl(tradeUrl)` | `Promise<CsfloatMessageResponse>` | set account trade URL | convenience wrapper |
| `updateBackground(backgroundUrl)` | `Promise<CsfloatMessageResponse>` | set profile background image URL | live-confirmed field on `PATCH /me` |
| `updateUsername(username)` | `Promise<CsfloatMessageResponse>` | update display username | exact validation rules remain API-driven |
| `markNotificationsRead(lastReadId)` | `Promise<CsfloatMessageResponse>` | update notification read receipt | posts `last_read_id` |
| `setMobileStatus(version?)` | `Promise<CsfloatMessageResponse>` | send mobile client status heartbeat | defaults to `"8.0.0"` |

Key types:
`CsfloatMeResponse`, `CsfloatUpdateMeRequest`, `CsfloatMessageResponse`

### Trades And Steam Sync

| Method | Returns | Use It For | Notes |
|---|---|---|---|
| `getTrades(params?)` | `Promise<CsfloatTradesResponse>` | list authenticated trades | supports `CsfloatTradesParams` |
| `getTrade(tradeId)` | `Promise<CsfloatTrade>` | fetch one trade detail | trade route detail lookup |
| `getTradeBuyerDetails(tradeId)` | `Promise<CsfloatTradeBuyerDetails>` | fetch the buyer-details side payload | seller/operator flow |
| `syncSteamNewOffer(offerIdOrRequest)` | `Promise<CsfloatMessageResponse>` | low-level Steam new-offer sync helper | route exists, business side effects remain partially mapped |
| `syncSteamOffers(request)` | `Promise<CsfloatMessageResponse>` | low-level Steam offer-status sync helper | browser-observed support helper |
| `acceptTrades(tradeIdsOrRequest)` | `Promise<CsfloatTradeBatchResponse>` | bulk seller acceptance | can be account/state-sensitive |
| `markTradesReceived(tradeIdsOrRequest)` | `Promise<CsfloatTrade[]>` | bulk buyer receipt flow | state-gated by actual Steam offer lifecycle |
| `acceptTrade(tradeId)` | `Promise<CsfloatTrade>` | accept one queued trade | seller-side single trade flow |
| `acceptSale(tradeId)` | `Promise<CsfloatTrade>` | seller-oriented alias for `acceptTrade()` | convenience alias |
| `cancelTrades(tradeIdsOrRequest)` | `Promise<CsfloatTradeBatchResponse>` | bulk seller cancel flow | bundle-backed route |
| `cancelTrade(tradeId)` | `Promise<CsfloatMessageResponse>` | cancel one trade | seller-side single cancel flow |
| `cancelSale(tradeId)` | `Promise<CsfloatMessageResponse>` | seller-oriented alias for `cancelTrade()` | convenience alias |

Key types:
`CsfloatTradesParams`, `CsfloatTradesResponse`, `CsfloatTrade`, `AcceptTradesRequest`, `CsfloatTradeSteamStatusNewOfferRequest`, `CsfloatTradeSteamOfferSyncRequest`

Write payload guide:
[Write Flows And Payloads](./write-flows-and-payloads.md#trades-and-steam-sync)

### Offers

| Method | Returns | Use It For | Notes |
|---|---|---|---|
| `getOffers(params?)` | `Promise<CsfloatOffersResponse>` | list authenticated offers | page-based profile flow |
| `createOffer(request)` | `Promise<CsfloatOffer>` | create a buyer-side offer | request type is `CreateOfferRequest` |
| `getOffer(offerId)` | `Promise<CsfloatOffer>` | fetch one offer thread node | direct offer lookup |
| `acceptOffer(offerId)` | `Promise<CsfloatAcceptOfferResponse>` | low-level accept route helper | route is implemented, happy-path shape still conservative |
| `getOfferHistory(offerId)` | `Promise<CsfloatOffer[]>` | load the offer thread history | historical offer chain |
| `counterOffer(offerId, request)` | `Promise<CsfloatOffer>` | seller-side counter offer | request type is `CounterOfferRequest` |
| `cancelOffer(offerId)` | `Promise<CsfloatMessageResponse>` | cancel an offer thread | close/cancel flow |
| `declineOffer(offerId)` | `Promise<CsfloatMessageResponse>` | ergonomic alias for cancel/decline close | same route as `cancelOffer()` |
| `getOffersTimeline(params?)` | `Promise<CsfloatOffersResponse>` | profile timeline-style offer feed | limit-focused snapshot helper |

Key types:
`CsfloatOffersParams`, `CsfloatOffersResponse`, `CreateOfferRequest`, `CounterOfferRequest`, `CsfloatAcceptOfferResponse`

Write payload guide:
[Write Flows And Payloads](./write-flows-and-payloads.md#offers)

### Watchlist And Notifications

| Method | Returns | Use It For | Notes |
|---|---|---|---|
| `getWatchlist(params?)` | `Promise<CsfloatListingsResponse>` | authenticated watchlist listing feed | query surface mirrors listing-style filters |
| `iterateWatchlist(params?)` | `AsyncGenerator<CsfloatListing>` | stream the cursor-based watchlist | convenience over `paginateCursor()` |
| `getNotifications(params?)` | `Promise<CsfloatNotificationsResponse>` | notifications timeline | cursor-aware route |

Key types:
`CsfloatWatchlistParams`, `CsfloatListingsResponse`, `CsfloatNotificationsParams`, `CsfloatNotificationsResponse`

### Transactions, Payments, And Status

| Method | Returns | Use It For | Notes |
|---|---|---|---|
| `getTransactions(params?)` | `Promise<CsfloatTransactionsResponse>` | authenticated transactions feed | page/order/type filters supported |
| `exportTransactions(year, month)` | `Promise<string>` | monthly CSV export | full past month only |
| `getAccountStanding()` | `Promise<CsfloatAccountStandingResponse>` | standing and account status lookup | authenticated |
| `getMaxWithdrawable()` | `Promise<CsfloatMaxWithdrawableResponse>` | payout-state lookup | payments helper |
| `getPendingDeposits()` | `Promise<CsfloatPendingDeposit[]>` | pending deposit list | authenticated |
| `getPendingWithdrawals()` | `Promise<CsfloatPendingWithdrawal[]>` | pending withdrawal list | authenticated |
| `deletePendingWithdrawal(withdrawalId)` | `Promise<CsfloatMessageResponse \| null>` | cancel pending withdrawal | response can be opaque/null |
| `getExtensionStatus()` | `Promise<CsfloatExtensionStatusResponse>` | extension version/permission metadata | authenticated |
| `getMobileStatus()` | `Promise<CsfloatMobileStatusResponse>` | current mobile status payload | authenticated |

Key types:
`CsfloatTransactionsParams`, `CsfloatTransactionsResponse`, `CsfloatAccountStandingResponse`, `CsfloatPendingDeposit`, `CsfloatPendingWithdrawal`, `CsfloatExtensionStatusResponse`, `CsfloatMobileStatusResponse`

### Buy Orders, Auto-Bids, And Tokens

| Method | Returns | Use It For | Notes |
|---|---|---|---|
| `getBuyOrders(params?)` | `Promise<CsfloatBuyOrdersResponse>` | list account buy orders | page/order/limit profile flow |
| `getBuyOrdersForInspect(inspectLink, limit?)` | `Promise<CsfloatInspectBuyOrdersResponse>` | inspect-link oriented buy-order lookup | wraps `/buy-orders/item` |
| `getSimilarBuyOrders(request, limit?)` | `Promise<CsfloatSimilarBuyOrdersResponse>` | similar order research | accepts `market_hash_name` or expression-backed request shapes |
| `createBuyOrder(request)` | `Promise<CsfloatBuyOrder>` | create a market-hash or expression-backed order | request type is `CreateBuyOrderRequest` |
| `updateBuyOrder(orderId, request)` | `Promise<CsfloatBuyOrder>` | change an existing buy order | currently wraps the validated patch surface |
| `deleteBuyOrder(orderId)` | `Promise<CsfloatMessageResponse>` | remove an order | delete lifecycle step |
| `getAutoBids()` | `Promise<CsfloatAutoBid[]>` | fetch auction auto-bids | authenticated |
| `deleteAutoBid(autoBidId)` | `Promise<CsfloatMessageResponse>` | remove an auto-bid | authenticated |
| `createRecommenderToken()` | `Promise<CsfloatRecommenderTokenResponse>` | mint token for loadout companion writes/recommendations | feeds `sdk.loadout` bearer flows |
| `createNotaryToken()` | `Promise<CsfloatNotaryTokenResponse>` | mint notary companion token | helper-adjacent account flow |
| `createGsInspectToken()` | `Promise<CsfloatGsInspectTokenResponse>` | mint companion inspect token | advanced companion use |

Key types:
`CsfloatBuyOrdersParams`, `CsfloatBuyOrdersResponse`, `CreateBuyOrderRequest`, `UpdateBuyOrderRequest`, `SimilarBuyOrdersRequest`, `CsfloatAutoBid`, `CsfloatRecommenderTokenResponse`, `CsfloatNotaryTokenResponse`, `CsfloatGsInspectTokenResponse`

Write payload guide:
[Write Flows And Payloads](./write-flows-and-payloads.md#buy-orders)

## `sdk.inventory`

| Method | Returns | Use It For | Notes |
|---|---|---|---|
| `getInventory()` | `Promise<CsfloatInventoryResponse>` | authenticated inventory lookup | simple read-only resource |

## `sdk.users`

| Method | Returns | Use It For | Notes |
|---|---|---|---|
| `getUser(userId)` | `Promise<CsfloatUser>` | public user profile lookup | useful before stall or profile tooling |

## `sdk.stall`

| Method | Returns | Use It For | Notes |
|---|---|---|---|
| `getStall(userId, params?)` | `Promise<CsfloatListingsResponse>` | fetch one public seller stall | `params` is `CsfloatStallParams` |
| `iterateStall(userId, params?)` | `AsyncGenerator<CsfloatListing>` | stream a cursor-based public stall | convenience over `paginateCursor()` |

Key types:
`CsfloatStallParams`, `CsfloatListingsResponse`, `CsfloatListing`

## `sdk.listings`

### Public Reads, Watchlist Mutation, And Purchases

| Method | Returns | Use It For | Notes |
|---|---|---|---|
| `getListings(params?)` | `Promise<CsfloatListingsResponse>` | public market search and scans | the main listing query surface |
| `getPriceList()` | `Promise<CsfloatPriceListEntry[]>` | public market-wide min-price index | public route |
| `iterateListings(params?)` | `AsyncGenerator<CsfloatListing>` | stream public listings across cursors | convenience over `paginateCursor()` |
| `getListingById(listingId)` | `Promise<CsfloatListing>` | fetch one listing | direct item-page bootstrap read |
| `getBids(listingId)` | `Promise<CsfloatBid[]>` | auction bid history | auction listings only |
| `getBuyOrders(listingId, params?)` | `Promise<CsfloatBuyOrder[]>` | listing-specific buy-order insight | accepts optional `limit` |
| `getSimilar(listingId)` | `Promise<CsfloatListing[]>` | similar listing lookup | public route |
| `addToWatchlist(listingId)` | `Promise<CsfloatMessageResponse>` | watchlist one listing | authenticated |
| `removeFromWatchlist(listingId)` | `Promise<CsfloatMessageResponse>` | unwatch one listing | authenticated |
| `buyNow(request)` | `Promise<CsfloatMessageResponse>` | purchase one or more direct-buy listings | request type is `BuyNowRequest` |
| `placeBid(listingId, request)` | `Promise<CsfloatAutoBid>` | set or replace an auction max-price bid | request type is `PlaceBidRequest` |
| `buyListing(contractId, totalPrice)` | `Promise<CsfloatMessageResponse>` | buy one contract without building `BuyNowRequest` manually | convenience wrapper |

Key types:
`CsfloatListParams`, `CsfloatListingsResponse`, `CsfloatListing`, `CsfloatPriceListEntry`, `CsfloatBid`, `BuyNowRequest`, `PlaceBidRequest`

### Listing Writes

| Method | Returns | Use It For | Notes |
|---|---|---|---|
| `createListing(request)` | `Promise<CsfloatListing>` | generic listing create | defaults `type` to `"buy_now"` when omitted |
| `createBuyNowListing(request)` | `Promise<CsfloatListing>` | ergonomic buy-now listing create | wraps `createListing()` |
| `createAuctionListing(request)` | `Promise<CsfloatListing>` | auction listing create | validates `duration_days` |
| `createBulkListings(requests)` | `Promise<CsfloatListing[]>` | bulk list multiple contracts | requires at least one item |
| `updateBulkListings(modifications)` | `Promise<CsfloatListing[]>` | bulk edit multiple listings | currently centered on validated bulk modification semantics |
| `deleteBulkListings(contractIds)` | `Promise<CsfloatMessageResponse>` | bulk delist multiple contracts | requires at least one contract id |
| `unlistBulkListings(contractIds)` | `Promise<CsfloatMessageResponse>` | alias for bulk delist | convenience alias |
| `updateListing(listingId, request)` | `Promise<CsfloatListing>` | patch one listing | low-level generic listing patch |
| `updateListingPrice(listingId, price)` | `Promise<CsfloatListing>` | change listing price | convenience wrapper |
| `updateListingDescription(listingId, description)` | `Promise<CsfloatListing>` | change listing description | convenience wrapper |
| `updateListingMaxOfferDiscount(listingId, maxOfferDiscount)` | `Promise<CsfloatListing>` | change max-offer discount on a listing | convenience wrapper |
| `updateListingPrivate(listingId, isPrivate)` | `Promise<CsfloatListing>` | toggle listing privacy | convenience wrapper |
| `deleteListing(listingId)` | `Promise<CsfloatListing \| null>` | delist one listing | delete/unlist lifecycle step |
| `unlistListing(listingId)` | `Promise<CsfloatListing \| null>` | alias for `deleteListing()` | convenience alias |

Important validation notes:

- `createListing()` rejects descriptions longer than `32` characters
- auction `duration_days` must be one of `1`, `3`, `5`, `7`, `14`

Key types:
`CreateListingRequest`, `CreateBuyNowListingRequest`, `CreateAuctionListingRequest`, `UpdateBulkListingRequest`, `UpdateListingRequest`

Write payload guide:
[Write Flows And Payloads](./write-flows-and-payloads.md#listings-and-bids)

## `sdk.history`

| Method | Returns | Use It For | Notes |
|---|---|---|---|
| `getSales(marketHashName)` | `Promise<CsfloatListing[]>` | recent sales for one market hash name | history surface |
| `getGraph(marketHashName, params?)` | `Promise<CsfloatHistoryGraphPoint[]>` | graph/history points | accepts `CsfloatHistoryGraphParams` |

Key types:
`CsfloatHistoryGraphParams`, `CsfloatHistoryGraphPoint`

## `sdk.loadout`

### Public Loadout Reads

| Method | Returns | Use It For | Notes |
|---|---|---|---|
| `getLoadouts(params?)` | `Promise<CsfloatUserLoadoutsResponse>` | general public loadout listing | main public companion entrypoint |
| `getDiscoverLoadouts(params?)` | `Promise<CsfloatUserLoadoutsResponse>` | discover-mode loadout list | injects the validated discover defaults |
| `getSkinLoadouts(defIndex, paintIndex, params?)` | `Promise<CsfloatUserLoadoutsResponse>` | search loadouts for one skin | pairs `def_index` + `paint_index` correctly |
| `getUserLoadouts(steamId)` | `Promise<CsfloatUserLoadoutsResponse>` | loadouts for one user | public route |
| `getLoadout(loadoutId)` | `Promise<CsfloatLoadoutResponse>` | fetch one loadout detail | public route |
| `cloneLoadout(recommenderToken, loadoutId, name?)` | `Promise<CsfloatLoadoutResponse>` | read one loadout then create a copied version | convenience multi-call helper |

### Recommender-Token Loadout Writes And Recommendations

| Method | Returns | Use It For | Notes |
|---|---|---|---|
| `getFavoriteLoadouts(recommenderToken)` | `Promise<CsfloatFavoriteLoadoutsResponse>` | list favorited loadouts for a token holder | bearer-token route |
| `createLoadout(recommenderToken, request)` | `Promise<CsfloatLoadoutResponse>` | create a loadout | bearer-token route |
| `updateLoadout(recommenderToken, loadoutId, request)` | `Promise<CsfloatLoadoutResponse>` | update a loadout | bearer-token route |
| `deleteLoadout(recommenderToken, loadoutId)` | `Promise<CsfloatMessageResponse>` | delete a loadout | bearer-token route |
| `recommend(recommenderToken, request)` | `Promise<CsfloatLoadoutRecommendationResponse>` | generic skin recommendation call | bearer-token route |
| `recommendForSkin(recommenderToken, defIndex, paintIndex, options)` | `Promise<CsfloatLoadoutRecommendationResponse>` | ergonomic single-skin recommend helper | wraps `recommend()` |
| `recommendStickers(recommenderToken, request)` | `Promise<CsfloatStickerRecommendationResponse>` | generic sticker recommendation call | bearer-token route |
| `recommendStickersForSkin(recommenderToken, defIndex, paintIndex, options)` | `Promise<CsfloatStickerRecommendationResponse>` | ergonomic single-skin sticker helper | wraps `recommendStickers()` |
| `generateRecommendations(recommenderToken, request)` | `Promise<CsfloatGenerateLoadoutRecommendationsResponse>` | broader loadout generation flow | bearer-token route |
| `favoriteLoadout(recommenderToken, loadoutId)` | `Promise<CsfloatLoadoutFavoriteResponse>` | favorite one loadout | bearer-token route |
| `unfavoriteLoadout(recommenderToken, loadoutId)` | `Promise<CsfloatLoadoutFavoriteResponse>` | remove a favorite | bearer-token route |

Key types:
`CsfloatLoadoutListParams`, `CsfloatCreateLoadoutRequest`, `CsfloatUpdateLoadoutRequest`, `CsfloatLoadoutRecommendationRequest`, `CsfloatStickerRecommendationRequest`, `CsfloatGenerateLoadoutRecommendationsRequest`

Write payload guide:
[Write Flows And Payloads](./write-flows-and-payloads.md#loadout-crud-and-recommendations)

## `sdk.workflows`

The workflow layer is documented in detail here:

- [Workflows And CLI](./workflows-and-cli.md)

Methods available:

- `getPublicMarketFeeds()`
- `getAccountWorkspace()`
- `getSingleSkinBuyOrderInsights()`
