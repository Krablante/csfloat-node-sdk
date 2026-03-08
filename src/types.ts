type LooseString<T extends string> = T | (string & {});
type LooseNumber<T extends number> = T | (number & {});

export type ListingType = "buy_now" | "auction" | string;
export type CsfloatSource = LooseString<"csfloat" | "p2p"> | number;
export type Category = "normal" | "stattrak" | "souvenir";
export type CsfloatListingCategoryFilter = LooseNumber<1 | 2 | 3 | 4>;
export type CsfloatOfferType = LooseString<"buyer_offer" | "seller_offer">;
export type CsfloatOfferState = LooseString<"active" | "declined">;
export type CsfloatTradeRole = LooseString<"seller" | "buyer">;
export type CsfloatTradeState = LooseString<
  "queued" | "pending" | "failed" | "verified" | "cancelled"
>;
export type CsfloatTradeVerificationMode = LooseString<
  "inventory" | "key" | "escrow"
>;
export type SortBy = LooseString<
  | "lowest_price"
  | "highest_price"
  | "most_recent"
  | "expires_soon"
  | "lowest_float"
  | "highest_float"
  | "best_deal"
  | "highest_discount"
  | "float_rank"
  | "num_bids"
>;

export type QueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;

export type CsfloatListingsFilter = LooseString<"sticker_combos" | "unique">;
export type CsfloatWatchlistState = LooseString<"listed" | "sold" | "delisted">;

export interface CsfloatCursorParams {
  cursor?: string;
  limit?: number;
}

export interface CsfloatPageParams {
  page?: number;
  limit?: number;
}

export interface CsfloatTradesParams extends CsfloatPageParams {
  cursor?: string;
  state?: string;
  role?: CsfloatTradeRole;
}

export interface CsfloatUserStatistics {
  median_trade_time?: number;
  total_avoided_trades?: number;
  total_failed_trades?: number;
  total_trades?: number;
  total_verified_trades?: number;
}

export interface CsfloatAuthenticatedUserStatistics
  extends CsfloatUserStatistics {
  total_sales?: number;
  total_purchases?: number;
}

export interface CsfloatUserPreferences {
  offers_enabled?: boolean;
  max_offer_discount?: number;
  localize_item_names?: boolean;
}

export interface CsfloatPaymentAccounts {
  stripe_connect?: string;
  stripe_customer?: string;
}

export interface CsfloatFirebaseMessaging {
  platform?: string;
  last_updated?: string;
}

export interface CsfloatInferredLocation {
  short?: string;
  long?: string;
  currency?: string;
}

export interface CsfloatUser {
  avatar?: string;
  away?: boolean;
  flags?: number;
  obfuscated_id?: string;
  has_valid_steam_api_key?: boolean;
  online?: boolean;
  stall_public?: boolean;
  statistics?: CsfloatUserStatistics;
  steam_id?: string;
  username?: string;
  verification_mode?: string;
}

export interface CsfloatAuthenticatedUser extends CsfloatUser {
  background_url?: string;
  email?: string;
  balance?: number;
  pending_balance?: number;
  trade_token?: string;
  payment_accounts?: CsfloatPaymentAccounts;
  api_key?: string;
  preferences?: CsfloatUserPreferences;
  know_your_customer?: string;
  fee?: number;
  withdraw_fee?: number;
  subscriptions?: string[];
  has_2fa?: boolean;
  extension_setup_at?: string;
  firebase_messaging?: CsfloatFirebaseMessaging;
  stripe_connect?: Record<string, boolean>;
  has_api_key?: boolean;
  statistics?: CsfloatAuthenticatedUserStatistics;
  notification_topic_opt_out?: number | boolean;
}

export interface CsfloatReferencePrice {
  base_price?: number;
  float_factor?: number;
  predicted_price?: number;
  quantity?: number;
  last_updated?: string;
}

export interface CsfloatTopBid {
  id?: string;
  created_at?: string;
  price?: number;
  contract_id?: string;
  state?: string;
  obfuscated_buyer_id?: string;
}

export type CsfloatBid = CsfloatTopBid;

export interface CsfloatAuctionDetails {
  reserve_price?: number;
  top_bid?: CsfloatTopBid;
  expires_at?: string;
  min_next_bid?: number;
}

export interface CsfloatAttachmentReference {
  price?: number;
  quantity?: number;
  updated_at?: string;
}

export interface CsfloatSticker {
  sticker_id?: number;
  stickerId?: number;
  slot?: number;
  wear?: number;
  icon_url?: string;
  name?: string;
  reference?: CsfloatAttachmentReference;
  offset_x?: number;
  offset_y?: number;
  rotation?: number;
}

export interface CsfloatKeychain {
  sticker_id?: number;
  stickerId?: number;
  slot?: number;
  offset_x?: number;
  offset_y?: number;
  offset_z?: number;
  pattern?: number;
  wrapped_sticker?: number;
  wrappedSticker?: number;
  icon_url?: string;
  name?: string;
  reference?: CsfloatAttachmentReference;
}

export interface CsfloatFadeDetails {
  seed?: number;
  percentage?: number;
  rank?: number;
  type?: string;
}

export interface CsfloatItem {
  asset_id: string;
  market_hash_name?: string;
  inspect_link?: string;
  float_value?: number | null;
  low_rank?: number | null;
  high_rank?: number | null;
  float_rank?: number | null;
  rank?: number | null;
  def_index?: number;
  paint_index?: number;
  paint_seed?: number;
  icon_url?: string;
  d_param?: string;
  rarity?: number;
  quality?: number;
  is_stattrak?: boolean;
  is_souvenir?: boolean;
  stickers?: CsfloatSticker[];
  keychains?: CsfloatKeychain[];
  tradable?: number;
  inspect_in_game?: string;
  cs2_screenshot_id?: string;
  cs2_screenshot_at?: string;
  is_commodity?: boolean;
  type?: string;
  rarity_name?: string;
  type_name?: string;
  item_name?: string;
  wear_name?: string;
  description?: string;
  collection?: string;
  serialized_inspect?: string;
  gs_sig?: string;
  phase?: string;
  sticker_index?: number | string;
  keychain_index?: number;
  keychain_highlight_reel?: number;
  music_kit_index?: number;
  fade?: CsfloatFadeDetails | Record<string, unknown> | null;
  badges?: string[];
}

export interface CsfloatListing {
  id: string;
  created_at?: string;
  type: ListingType;
  price: number;
  state?: string;
  description?: string;
  seller?: CsfloatUser;
  reference?: CsfloatReferencePrice;
  item: CsfloatItem;
  is_seller?: boolean;
  min_offer_price?: number | null;
  max_offer_discount?: number | null;
  is_watchlisted?: boolean;
  watchers?: number;
  sold_at?: string;
  auction_details?: CsfloatAuctionDetails | null;
}

export interface CsfloatListingsResponse {
  data: CsfloatListing[];
  cursor?: string;
  total_count?: number;
  total_price?: number;
}

export interface CsfloatListingBatchResponse {
  data: CsfloatListing[];
}

export interface CsfloatPriceListEntry {
  market_hash_name: string;
  quantity: number;
  min_price: number;
}

export interface CsfloatMeResponse {
  user: CsfloatAuthenticatedUser & {
    steam_id: string;
  };
  pending_offers?: number;
  actionable_trades?: number;
  has_unread_notifications?: boolean;
}

export interface CsfloatExchangeRatesResponse {
  data: Record<string, number>;
}

export interface CsfloatAppMetaResponse {
  min_required_version?: string;
  [key: string]: unknown;
}

export interface CsfloatLocationResponse {
  inferred_location?: CsfloatInferredLocation;
}

export interface CsfloatNotaryRule {
  enabled?: boolean;
  background?: boolean;
}

export interface CsfloatNotaryMetaResponse {
  rollback?: CsfloatNotaryRule;
  accepted?: CsfloatNotaryRule;
}

export interface CsfloatLoadoutItemRef {
  def_index?: number;
  paint_index?: number;
  wear_index?: number;
  isLocked?: boolean;
  stat_trak?: boolean;
  stickers?: number[];
}

export interface CsfloatLoadoutSide {
  agent?: CsfloatLoadoutItemRef;
  gloves?: CsfloatLoadoutItemRef;
  is_filled?: boolean;
  knife?: CsfloatLoadoutItemRef;
  midtier?: CsfloatLoadoutItemRef[];
  pistols?: CsfloatLoadoutItemRef[];
  rifles?: CsfloatLoadoutItemRef[];
  zeus?: CsfloatLoadoutItemRef;
}

export interface CsfloatLoadoutSocialStats {
  favorites?: number;
}

export interface CsfloatLoadout {
  created_at?: string;
  ct?: CsfloatLoadoutSide;
  id?: string;
  name?: string;
  social_stats?: CsfloatLoadoutSocialStats;
  t?: CsfloatLoadoutSide;
  updated_at?: string;
  user_id?: string;
}

export interface CsfloatUserLoadoutsResponse {
  loadouts: CsfloatLoadout[];
}

export interface CsfloatLoadoutResponse {
  loadout: CsfloatLoadout;
}

export type CsfloatLoadoutSortBy = "favorites" | "random" | "created_at";

export type CsfloatLoadoutListParams = QueryParams & {
  any_filled?: boolean;
  def_index?: number;
  limit?: number;
  months?: number;
  paint_index?: number;
  sort_by?: CsfloatLoadoutSortBy;
};

export interface CsfloatLoadoutFavoriteResponse {
  loadout?: {
    social_stats?: CsfloatLoadoutSocialStats;
  };
  message?: string;
}

export interface CsfloatLoadoutFavoriteEntry {
  added_at?: string;
  loadout?: CsfloatLoadout;
  loadout_id?: string;
}

export interface CsfloatFavoriteLoadoutsResponse {
  favorites: CsfloatLoadoutFavoriteEntry[];
}

export interface CsfloatCreateLoadoutRequest {
  name: string;
  ct: CsfloatLoadoutSide;
  t: CsfloatLoadoutSide;
}

export interface CsfloatUpdateLoadoutRequest {
  name: string;
  ct: CsfloatLoadoutSide;
  t: CsfloatLoadoutSide;
}

export interface CsfloatLoadoutRecommendationSkinItem {
  type: "skin";
  def_index: number;
  paint_index: number;
}

export interface CsfloatGenerateLoadoutSkinItem
  extends CsfloatLoadoutRecommendationSkinItem {
  wear_index?: number;
}

export interface CsfloatLoadoutRecommendationRequest {
  items: CsfloatLoadoutRecommendationSkinItem[];
  count: number;
  def_whitelist?: number[];
  def_blacklist?: number[];
}

export interface CsfloatLoadoutRecommendationResult {
  def_index: number;
  paint_index: number;
  score: number;
}

export interface CsfloatLoadoutRecommendationResponse {
  count: number;
  results: CsfloatLoadoutRecommendationResult[];
}

export interface CsfloatStickerRecommendationRequest {
  items: CsfloatLoadoutRecommendationSkinItem[];
  collection_whitelist?: string[];
  count: number;
}

export interface CsfloatStickerRecommendationResult {
  score: number;
  sticker_index: number;
}

export interface CsfloatStickerRecommendationResponse {
  count: number;
  results: CsfloatStickerRecommendationResult[];
}

export type CsfloatLoadoutFaction = "ct" | "t";

export interface CsfloatGenerateLoadoutRecommendationsRequest {
  def_indexes: number[];
  faction: CsfloatLoadoutFaction;
  items: CsfloatGenerateLoadoutSkinItem[];
  max_price?: number;
}

export interface CsfloatGenerateLoadoutSuggestion {
  def_index: number;
  locked?: boolean;
  paint_index: number;
  price: number;
  score: number;
  wear_index?: number;
}

export interface CsfloatGenerateLoadoutResult {
  def_index: number;
  recommendations: CsfloatGenerateLoadoutSuggestion[];
}

export interface CsfloatGenerateLoadoutRecommendationsResponse {
  remaining_budget: number;
  results: CsfloatGenerateLoadoutResult[];
  total_cost: number;
}

export interface CsfloatSchemaCollection {
  key: string;
  name: string;
  has_crate?: boolean;
  has_souvenir?: boolean;
}

export interface CsfloatSchemaRarity {
  key: string;
  name: string;
  value: number;
}

export interface CsfloatSchemaSticker {
  market_hash_name: string;
}

export interface CsfloatSchemaKeychain {
  market_hash_name: string;
}

export interface CsfloatSchemaCollectible {
  market_hash_name: string;
  image: string;
  rarity: number;
  price: number;
}

export interface CsfloatSchemaContainer {
  market_hash_name: string;
}

export interface CsfloatSchemaAgent {
  market_hash_name: string;
  image: string;
  rarity: number;
  price: number;
  faction?: string;
}

export interface CsfloatSchemaCustomSticker {
  group: number;
  name: string;
  count: number;
}

export interface CsfloatSchemaMusicKit {
  market_hash_name: string;
  rarity: number;
  image: string;
  normal_price: number;
  stattrak_price: number;
}

export interface CsfloatSchemaHighlightReel {
  name?: string;
  market_hash_name?: string;
  image?: string;
  price?: number;
  keychain_index?: number;
}

export interface CsfloatSchemaPaint {
  index: number;
  name: string;
  max: number;
  min: number;
  rarity: number;
  collection: string;
  image: string;
  souvenir?: boolean;
  stattrak?: boolean;
  normal_prices: number[];
  normal_volume: number[];
  stattrak_prices?: number[];
  stattrak_volume?: number[];
}

export interface CsfloatSchemaWeapon {
  name: string;
  type: string;
  faction?: string;
  sticker_amount: number;
  paints: Record<string, CsfloatSchemaPaint>;
}

export interface CsfloatSchemaResponse {
  collections: CsfloatSchemaCollection[];
  rarities: CsfloatSchemaRarity[];
  stickers: Record<string, CsfloatSchemaSticker>;
  keychains: Record<string, CsfloatSchemaKeychain>;
  collectibles: Record<string, CsfloatSchemaCollectible>;
  containers: Record<string, CsfloatSchemaContainer>;
  agents: Record<string, CsfloatSchemaAgent>;
  custom_stickers: Record<string, CsfloatSchemaCustomSticker>;
  music_kits: Record<string, CsfloatSchemaMusicKit>;
  weapons: Record<string, CsfloatSchemaWeapon>;
  highlight_reels?: Record<string, CsfloatSchemaHighlightReel>;
}

export type CsfloatSchemaBrowseType =
  | "rifles"
  | "pistols"
  | "smgs"
  | "heavy"
  | "knives"
  | "gloves"
  | "agents"
  | "containers"
  | "stickers"
  | "keychains"
  | "patches"
  | "collectibles"
  | "music kits";

export interface CsfloatSchemaBrowseItem {
  def_index?: number;
  market_hash_name?: string;
  rarity?: number | null;
  image?: string | null;
  price?: number | null;
  sticker_index?: number;
  keychain_index?: number;
  patch_index?: number;
  music_kit_index?: number;
  [key: string]: unknown;
}

export interface CsfloatSchemaBrowseGroup {
  type?: string;
  user_visible_type?: string;
  items: CsfloatSchemaBrowseItem[];
}

export interface CsfloatSchemaBrowseResponse {
  data: CsfloatSchemaBrowseGroup[];
}

export interface CsfloatSchemaScreenshotParams {
  def_index: number;
  paint_index: number;
  min_float?: number;
  max_float?: number;
  stattrak?: boolean;
  allow_stickers?: boolean;
}

export interface CsfloatSchemaScreenshotSide {
  path?: string;
  [key: string]: unknown;
}

export interface CsfloatSchemaScreenshotResponse {
  id?: string;
  sides?: {
    playside?: CsfloatSchemaScreenshotSide;
    backside?: CsfloatSchemaScreenshotSide;
  };
  [key: string]: unknown;
}

export interface CsfloatTradeSteamOffer {
  id?: string;
  state?: number | string;
  is_from_seller?: boolean;
  can_cancel_at?: string;
  sent_at?: string;
  deadline_at?: string;
  updated_at?: string;
}

export interface CsfloatTradeBuyerDetails {
  steam_level?: number;
  steam_age_badge_level?: number;
  persona_name?: string;
  avatar_url?: string;
}

export interface CsfloatTrade {
  id?: string;
  created_at?: string;
  buyer_id?: string;
  buyer?: CsfloatUser;
  seller_id?: string;
  seller?: CsfloatUser;
  contract_id?: string;
  accepted_at?: string;
  verified_at?: string;
  expires_at?: string;
  state?: CsfloatTradeState;
  verification_mode?: CsfloatTradeVerificationMode;
  steam_offer?: CsfloatTradeSteamOffer;
  verify_sale_at?: string;
  inventory_check_status?: number;
  trade_protection_ends_at?: string;
  contract?: CsfloatListing;
  trade_url?: string;
  trade_token?: string;
  wait_for_cancel_ping?: boolean;
  is_settlement_period?: boolean;
}

export interface CsfloatTradesResponse {
  trades: CsfloatTrade[];
  count?: number;
}

export interface CsfloatTradeBatchResponse {
  data: CsfloatTrade[];
}

export interface CsfloatRecommenderTokenResponse {
  token: string;
  expires_at: string;
}

export interface CsfloatNotaryTokenResponse {
  token: string;
  expires_at: string;
}

export interface CsfloatGsInspectTokenResponse {
  token: string;
  expires_at: string;
}

export interface CsfloatTransaction {
  id?: string;
  created_at?: string;
  user_id?: string;
  type?: string;
  details?: CsfloatTransactionDetails;
  balance_offset?: number;
  pending_offset?: number;
}

export interface CsfloatTransactionDetails {
  bid_id?: string;
  contract_id?: string;
  fee_amount?: number;
  listing_id?: string;
  original_tx?: string | number;
  reason?: string;
  trade_id?: string;
  type?: string;
  [key: string]: unknown;
}

export interface CsfloatTransactionsResponse {
  transactions: CsfloatTransaction[];
  count?: number;
}

export interface CsfloatOffer {
  id?: string;
  created_at?: string;
  expires_at?: string;
  price?: number;
  contract_price?: number;
  type?: CsfloatOfferType;
  state?: CsfloatOfferState;
  buyer_id?: string;
  buyer?: CsfloatUser;
  seller_id?: string;
  seller?: CsfloatUser;
  contract_id?: string;
  contract?: CsfloatListing;
  is_from_seller?: boolean;
}

export interface CsfloatOffersResponse {
  offers: CsfloatOffer[];
  count?: number;
}

export interface CsfloatNotification {
  title?: string;
  body?: string;
  redirect_path?: string;
  notification_id?: string;
  type?: string;
  created_at?: string;
}

export interface CsfloatNotificationsResponse {
  data: CsfloatNotification[];
  cursor?: string;
}

export interface CsfloatBuyOrder {
  id?: string;
  created_at?: string;
  expression?: string;
  market_hash_name?: string;
  qty?: number;
  price?: number;
  max_price?: number;
  quantity?: number;
  bought_item_count?: number;
}

export interface CsfloatBuyOrdersResponse {
  orders: CsfloatBuyOrder[];
  count?: number;
}

export interface CsfloatInspectBuyOrder {
  expression?: string;
  qty?: number;
  price?: number;
}

export type CsfloatInspectBuyOrdersResponse = CsfloatInspectBuyOrder[];

export interface CsfloatSimilarBuyOrder {
  market_hash_name?: string;
  qty?: number;
  price?: number;
}

export interface CsfloatSimilarBuyOrdersResponse {
  data: CsfloatSimilarBuyOrder[];
}

export interface CreateBuyOrderRequest {
  market_hash_name: string;
  max_price: number;
  quantity?: number;
}

export interface SimilarBuyOrdersRequest {
  market_hash_name: string;
}

export interface UpdateBuyOrderRequest {
  max_price: number;
}

export interface AcceptTradesRequest {
  trade_ids: string[];
}

export interface CreateOfferRequest {
  contract_id: string;
  price: number;
}

export interface CounterOfferRequest {
  price: number;
}

export interface BuyNowRequest {
  contract_ids: string[];
  total_price: number;
}

export interface PlaceBidRequest {
  max_price: number;
}

export interface CsfloatAutoBid {
  id?: string;
  created_at?: string;
  max_price?: number;
  contract_id?: string;
}

export interface CsfloatAccountStandingResponse {
  standing?: string;
  penalty_progress?: number;
  recent_restrictions?: unknown[];
}

export interface CsfloatExtensionStatusResponse {
  created_at?: string;
  updated_at?: string;
  version?: string;
  steam_community_permission?: boolean;
  steam_powered_permission?: boolean;
  user_agent?: string;
  access_token_steam_id?: string;
  status?: string;
  message?: string;
}

export interface CsfloatMaxWithdrawableResponse {
  max_withdrawable?: number;
}

export interface CsfloatPendingDeposit {
  amount?: number;
  created?: number | string;
  currency?: string;
  payment_method_types?: string[];
  [key: string]: unknown;
}

export interface CsfloatMobileStatusResponse {
  created_at?: string;
  updated_at?: string;
  version?: string;
  has_access_token?: boolean;
  user_agent?: string;
  cap_bundle_id?: string;
  status?: string;
  message?: string;
}

export interface CsfloatMessageResponse {
  message: string;
}

export interface CsfloatPendingWithdrawal {
  id?: string | number;
  [key: string]: unknown;
}

export interface CsfloatUpdateMeRequest {
  max_offer_discount?: number;
  offers_enabled?: boolean;
  stall_public?: boolean;
  away?: boolean;
  trade_url?: string;
  /** Live-confirmed accepted by PATCH /me (2026-03-07). Updates profile background image. */
  background_url?: string;
  /** Live-confirmed accepted by PATCH /me (2026-03-07). Note: exact validation rules unknown; empty string returns 200. */
  username?: string;
}

export interface CsfloatHistoryGraphPoint {
  count?: number;
  day?: string;
  avg_price?: number;
}

export interface CsfloatHistoryGraphParams {
  paint_index?: number;
  category?: CsfloatListingCategoryFilter;
}

export interface CsfloatInventoryItem extends CsfloatItem {
  listing_id?: string | null;
  reference?: CsfloatReferencePrice;
}

export type CsfloatInventoryResponse = CsfloatInventoryItem[];

export interface CsfloatListParams {
  cursor?: string;
  limit?: number;
  min_ref_qty?: number;
  filter?: CsfloatListingsFilter;
  source?: CsfloatSource;
  type?: ListingType;
  market_hash_name?: string;
  def_index?: number;
  paint_index?: number;
  category?: CsfloatListingCategoryFilter;
  collection?: string;
  rarity?: number;
  min_price?: number;
  max_price?: number;
  min_float?: number;
  max_float?: number;
  paint_seed?: number;
  sticker_index?: number;
  keychain_index?: number;
  keychain_highlight_reel?: number;
  music_kit_index?: number;
  stickers?: string;
  keychains?: string;
  min_keychain_pattern?: number;
  max_keychain_pattern?: number;
  min_blue?: number;
  max_blue?: number;
  min_fade?: number;
  max_fade?: number;
  sort_by?: SortBy;
  user_id?: string;
}

export interface CsfloatWatchlistParams extends CsfloatListParams {
  state?: CsfloatWatchlistState;
}

export interface CsfloatAppliedStickerFilter {
  sticker_id?: number;
  custom_sticker_id?: string;
  slot?: number;
}

export interface CsfloatAppliedKeychainFilter {
  keychain_index: number;
}

export interface CreateBuyNowListingRequest {
  type?: "buy_now";
  asset_id: string;
  price: number;
  private?: boolean;
  description?: string;
  max_offer_discount?: number;
}

export interface CreateAuctionListingRequest {
  type: "auction";
  asset_id: string;
  reserve_price: number;
  duration_days: 1 | 3 | 5 | 7 | 14;
  private?: boolean;
  description?: string;
}

export type CreateListingRequest =
  | CreateBuyNowListingRequest
  | CreateAuctionListingRequest;

export interface UpdateListingRequest {
  price: number;
}

export interface UpdateBulkListingRequest {
  contract_id: string;
  price: number;
}
