import type { CsfloatHttpClient } from "../client.js";
import {
  buildLoadoutSkinSearchParams,
  buildSingleSkinRecommendationRequest,
  buildSingleSkinStickerRecommendationRequest,
  getDiscoverLoadoutParams,
} from "../loadout.js";
import type { CsfloatLoadoutSkinSearchParams } from "../loadout.js";
import type {
  CsfloatSingleSkinRecommendationOptions,
  CsfloatSingleSkinStickerRecommendationOptions,
} from "../loadout.js";
import type {
  CsfloatCreateLoadoutRequest,
  CsfloatFavoriteLoadoutsResponse,
  CsfloatGenerateLoadoutRecommendationsRequest,
  CsfloatGenerateLoadoutRecommendationsResponse,
  CsfloatLoadoutFavoriteResponse,
  CsfloatLoadoutListParams,
  CsfloatLoadoutResponse,
  CsfloatLoadoutRecommendationRequest,
  CsfloatLoadoutRecommendationResponse,
  CsfloatStickerRecommendationRequest,
  CsfloatStickerRecommendationResponse,
  CsfloatMessageResponse,
  CsfloatUpdateLoadoutRequest,
  CsfloatUserLoadoutsResponse,
} from "../types.js";

const LOADOUT_API_BASE_URL = "https://loadout-api.csfloat.com/v1";

export class LoadoutResource {
  constructor(private readonly client: CsfloatHttpClient) {}

  getLoadouts(
    params?: CsfloatLoadoutListParams,
  ): Promise<CsfloatUserLoadoutsResponse> {
    return this.client.get<CsfloatUserLoadoutsResponse>(
      `${LOADOUT_API_BASE_URL}/loadout`,
      params,
    );
  }

  getDiscoverLoadouts(
    params: Omit<CsfloatLoadoutListParams, "any_filled"> = {},
  ): Promise<CsfloatUserLoadoutsResponse> {
    return this.getLoadouts(getDiscoverLoadoutParams(params));
  }

  getSkinLoadouts(
    defIndex: number,
    paintIndex: number,
    params: Omit<CsfloatLoadoutSkinSearchParams, "def_index" | "paint_index"> = {},
  ): Promise<CsfloatUserLoadoutsResponse> {
    return this.getLoadouts(
      buildLoadoutSkinSearchParams({
        ...params,
        def_index: defIndex,
        paint_index: paintIndex,
      }),
    );
  }

  getUserLoadouts(steamId: string): Promise<CsfloatUserLoadoutsResponse> {
    return this.client.get<CsfloatUserLoadoutsResponse>(
      `${LOADOUT_API_BASE_URL}/user/${steamId}/loadouts`,
    );
  }

  getLoadout(loadoutId: string): Promise<CsfloatLoadoutResponse> {
    return this.client.get<CsfloatLoadoutResponse>(
      `${LOADOUT_API_BASE_URL}/loadout/${loadoutId}`,
    );
  }

  async cloneLoadout(
    recommenderToken: string,
    loadoutId: string,
    name?: string,
  ): Promise<CsfloatLoadoutResponse> {
    const source = await this.getLoadout(loadoutId);

    return this.createLoadout(recommenderToken, {
      name: name ?? `${source.loadout.name ?? "Loadout"} (Clone)`,
      ct: source.loadout.ct ?? { is_filled: false },
      t: source.loadout.t ?? { is_filled: false },
    });
  }

  getFavoriteLoadouts(
    recommenderToken: string,
  ): Promise<CsfloatFavoriteLoadoutsResponse> {
    return this.client
      .derive({
        apiKey: `Bearer ${recommenderToken}`,
        baseUrl: LOADOUT_API_BASE_URL,
      })
      .get<CsfloatFavoriteLoadoutsResponse>("user/favorites");
  }

  createLoadout(
    recommenderToken: string,
    request: CsfloatCreateLoadoutRequest,
  ): Promise<CsfloatLoadoutResponse> {
    return this.client
      .derive({
        apiKey: `Bearer ${recommenderToken}`,
        baseUrl: LOADOUT_API_BASE_URL,
      })
      .post<CsfloatLoadoutResponse>("loadout", request);
  }

  updateLoadout(
    recommenderToken: string,
    loadoutId: string,
    request: CsfloatUpdateLoadoutRequest,
  ): Promise<CsfloatLoadoutResponse> {
    return this.client
      .derive({
        apiKey: `Bearer ${recommenderToken}`,
        baseUrl: LOADOUT_API_BASE_URL,
      })
      .put<CsfloatLoadoutResponse>(`loadout/${loadoutId}`, request);
  }

  deleteLoadout(
    recommenderToken: string,
    loadoutId: string,
  ): Promise<CsfloatMessageResponse> {
    return this.client
      .derive({
        apiKey: `Bearer ${recommenderToken}`,
        baseUrl: LOADOUT_API_BASE_URL,
      })
      .delete<CsfloatMessageResponse>(`loadout/${loadoutId}`);
  }

  recommend(
    recommenderToken: string,
    request: CsfloatLoadoutRecommendationRequest,
  ): Promise<CsfloatLoadoutRecommendationResponse> {
    return this.client
      .derive({
        apiKey: `Bearer ${recommenderToken}`,
        baseUrl: LOADOUT_API_BASE_URL,
      })
      .post<CsfloatLoadoutRecommendationResponse>("recommend", request);
  }

  recommendForSkin(
    recommenderToken: string,
    defIndex: number,
    paintIndex: number,
    options: CsfloatSingleSkinRecommendationOptions,
  ): Promise<CsfloatLoadoutRecommendationResponse> {
    return this.recommend(
      recommenderToken,
      buildSingleSkinRecommendationRequest(defIndex, paintIndex, options),
    );
  }

  recommendStickers(
    recommenderToken: string,
    request: CsfloatStickerRecommendationRequest,
  ): Promise<CsfloatStickerRecommendationResponse> {
    return this.client
      .derive({
        apiKey: `Bearer ${recommenderToken}`,
        baseUrl: LOADOUT_API_BASE_URL,
      })
      .post<CsfloatStickerRecommendationResponse>(
        "recommend/stickers",
        request,
      );
  }

  recommendStickersForSkin(
    recommenderToken: string,
    defIndex: number,
    paintIndex: number,
    options: CsfloatSingleSkinStickerRecommendationOptions,
  ): Promise<CsfloatStickerRecommendationResponse> {
    return this.recommendStickers(
      recommenderToken,
      buildSingleSkinStickerRecommendationRequest(defIndex, paintIndex, options),
    );
  }

  generateRecommendations(
    recommenderToken: string,
    request: CsfloatGenerateLoadoutRecommendationsRequest,
  ): Promise<CsfloatGenerateLoadoutRecommendationsResponse> {
    return this.client
      .derive({
        apiKey: `Bearer ${recommenderToken}`,
        baseUrl: LOADOUT_API_BASE_URL,
      })
      .post<CsfloatGenerateLoadoutRecommendationsResponse>("generate", request);
  }

  favoriteLoadout(
    recommenderToken: string,
    loadoutId: string,
  ): Promise<CsfloatLoadoutFavoriteResponse> {
    return this.client
      .derive({
        apiKey: `Bearer ${recommenderToken}`,
        baseUrl: LOADOUT_API_BASE_URL,
      })
      .post<CsfloatLoadoutFavoriteResponse>(`loadout/${loadoutId}/favorite`, {});
  }

  unfavoriteLoadout(
    recommenderToken: string,
    loadoutId: string,
  ): Promise<CsfloatLoadoutFavoriteResponse> {
    return this.client
      .derive({
        apiKey: `Bearer ${recommenderToken}`,
        baseUrl: LOADOUT_API_BASE_URL,
      })
      .delete<CsfloatLoadoutFavoriteResponse>(`loadout/${loadoutId}/favorite`);
  }
}
