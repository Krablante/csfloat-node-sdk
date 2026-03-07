import type { CsfloatHttpClient } from "../client.js";
import type { CsfloatHistoryGraphPoint, CsfloatListing } from "../types.js";

export class HistoryResource {
  constructor(private readonly client: CsfloatHttpClient) {}

  getSales(marketHashName: string): Promise<CsfloatListing[]> {
    return this.client.get<CsfloatListing[]>(
      `history/${encodeURIComponent(marketHashName)}/sales`,
    );
  }

  getGraph(
    marketHashName: string,
    params: { paint_index: number },
  ): Promise<CsfloatHistoryGraphPoint[]> {
    return this.client.get<CsfloatHistoryGraphPoint[]>(
      `history/${encodeURIComponent(marketHashName)}/graph`,
      params,
    );
  }
}
