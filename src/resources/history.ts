import type { CsfloatHttpClient } from "../client.js";
import type {
  CsfloatHistoryGraphParams,
  CsfloatHistoryGraphPoint,
  CsfloatListing,
  QueryParams,
} from "../types.js";

export class HistoryResource {
  constructor(private readonly client: CsfloatHttpClient) { }

  getSales(marketHashName: string): Promise<CsfloatListing[]> {
    return this.client.get<CsfloatListing[]>(
      `history/${encodeURIComponent(marketHashName)}/sales`,
    );
  }

  getGraph(
    marketHashName: string,
    params: CsfloatHistoryGraphParams = {},
  ): Promise<CsfloatHistoryGraphPoint[]> {
    return this.client.get<CsfloatHistoryGraphPoint[]>(
      `history/${encodeURIComponent(marketHashName)}/graph`,
      params as QueryParams,
    );
  }
}
