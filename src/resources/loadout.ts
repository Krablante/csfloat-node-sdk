import type { CsfloatHttpClient } from "../client.js";
import type {
  CsfloatLoadoutResponse,
  CsfloatLoadoutRecommendationRequest,
  CsfloatLoadoutRecommendationResponse,
  CsfloatUserLoadoutsResponse,
} from "../types.js";

const LOADOUT_API_BASE_URL = "https://loadout-api.csfloat.com/v1";

export class LoadoutResource {
  constructor(private readonly client: CsfloatHttpClient) {}

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
}
