import type { CsfloatHttpClient } from "../client.js";
import type { CsfloatInventoryResponse } from "../types.js";

export class InventoryResource {
  constructor(private readonly client: CsfloatHttpClient) {}

  getInventory(): Promise<CsfloatInventoryResponse> {
    return this.client.get<CsfloatInventoryResponse>("me/inventory");
  }
}
