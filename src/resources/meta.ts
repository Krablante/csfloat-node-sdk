import type { CsfloatHttpClient } from "../client.js";
import type {
  CsfloatExchangeRatesResponse,
  CsfloatLocationResponse,
  CsfloatNotaryMetaResponse,
  CsfloatSchemaResponse,
} from "../types.js";

export class MetaResource {
  constructor(private readonly client: CsfloatHttpClient) {}

  getSchema(): Promise<CsfloatSchemaResponse> {
    return this.client.get<CsfloatSchemaResponse>("schema");
  }

  getExchangeRates(): Promise<CsfloatExchangeRatesResponse> {
    return this.client.get<CsfloatExchangeRatesResponse>("meta/exchange-rates");
  }

  getLocation(): Promise<CsfloatLocationResponse> {
    return this.client.get<CsfloatLocationResponse>("meta/location");
  }

  getNotary(): Promise<CsfloatNotaryMetaResponse> {
    return this.client.get<CsfloatNotaryMetaResponse>("meta/notary");
  }
}
