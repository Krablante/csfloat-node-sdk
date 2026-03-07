export type ListingType = "buy_now" | "auction" | string;
export type Category = "normal" | "stattrak" | "souvenir";
export type SortBy =
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
  | string;

export type QueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;

export interface CsfloatCursorParams {
  cursor?: string;
  limit?: number;
}

export interface CsfloatPageParams {
  page?: number;
  limit?: number;
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
  slot?: number;
  offset_x?: number;
  offset_y?: number;
  offset_z?: number;
  pattern?: number;
  icon_url?: string;
  name?: string;
  reference?: CsfloatAttachmentReference;
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
  sticker_index?: string;
  badges?: string[];
  fade?: unknown;
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

export interface CsfloatMeResponse {
  user: CsfloatAuthenticatedUser & {
    steam_id: string;
  };
}

export interface CsfloatExchangeRatesResponse {
  data: Record<string, number>;
}

export interface CsfloatLocationResponse {
  inferred_location?: CsfloatInferredLocation;
}

export interface CsfloatSchemaCollection {
  key: string;
  name: string;
  has_crate?: boolean;
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
  market_hash_name?: string;
  image?: string;
  price?: number;
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

export interface CsfloatTradeSteamOffer {
  id?: string;
  state?: number | string;
  is_from_seller?: boolean;
  can_cancel_at?: string;
  sent_at?: string;
  deadline_at?: string;
  updated_at?: string;
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
  state?: string;
  verification_mode?: string;
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

export interface CsfloatTransaction {
  id?: string;
  created_at?: string;
  user_id?: string;
  type?: string;
  details?: Record<string, unknown>;
  balance_offset?: number;
  pending_offset?: number;
}

export interface CsfloatTransactionsResponse {
  transactions: CsfloatTransaction[];
  count?: number;
}

export interface CsfloatOffer {
  id?: string;
  created_at?: string;
  price?: number;
  state?: string;
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
}

export interface CsfloatBuyOrdersResponse {
  orders: CsfloatBuyOrder[];
  count?: number;
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

export interface CsfloatMobileStatusResponse {
  created_at?: string;
  updated_at?: string;
  version?: string;
  has_access_token?: boolean;
  user_agent?: string;
  status?: string;
  message?: string;
}

export interface CsfloatHistoryGraphPoint {
  count?: number;
  day?: string;
  avg_price?: number;
}

export interface CsfloatInventoryItem extends CsfloatItem {
  reference?: CsfloatReferencePrice;
}

export type CsfloatInventoryResponse = CsfloatInventoryItem[];

export interface CsfloatListParams {
  cursor?: string;
  limit?: number;
  type?: ListingType;
  market_hash_name?: string;
  def_index?: number;
  paint_index?: number;
  category?: Category;
  min_float?: number;
  max_float?: number;
  sort_by?: SortBy;
  user_id?: string;
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
