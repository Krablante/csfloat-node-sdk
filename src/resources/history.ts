import type { CsfloatHttpClient } from "../client.js";
import type { CsfloatListing } from "../types.js";

export class HistoryResource {
  constructor(private readonly client: CsfloatHttpClient) {}

  getSales(marketHashName: string): Promise<CsfloatListing[]> {
    return this.client.get<CsfloatListing[]>(
      `history/${encodeURIComponent(marketHashName)}/sales`,
    );
  }
}
