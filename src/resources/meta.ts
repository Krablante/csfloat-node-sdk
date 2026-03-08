import type { CsfloatHttpClient } from "../client.js";
import type {
  CsfloatAppMetaResponse,
  CsfloatExchangeRatesResponse,
  CsfloatLocationResponse,
  CsfloatNotaryMetaResponse,
  CsfloatSchemaBrowseResponse,
  CsfloatSchemaScreenshotParams,
  CsfloatSchemaScreenshotResponse,
  CsfloatSchemaBrowseType,
  CsfloatSchemaResponse,
  QueryParams,
} from "../types.js";

export class MetaResource {
  constructor(private readonly client: CsfloatHttpClient) {}

  getSchema(): Promise<CsfloatSchemaResponse> {
    return this.client.get<CsfloatSchemaResponse>("schema");
  }

  getExchangeRates(): Promise<CsfloatExchangeRatesResponse> {
    return this.client.get<CsfloatExchangeRatesResponse>("meta/exchange-rates");
  }

  getApp(): Promise<CsfloatAppMetaResponse> {
    return this.client.get<CsfloatAppMetaResponse>("meta/app");
  }

  getLocation(): Promise<CsfloatLocationResponse> {
    return this.client.get<CsfloatLocationResponse>("meta/location");
  }

  getSchemaBrowse(type: CsfloatSchemaBrowseType): Promise<CsfloatSchemaBrowseResponse> {
    return this.client.get<CsfloatSchemaBrowseResponse>("schema/browse", { type });
  }

  getItemExampleScreenshot(
    params: CsfloatSchemaScreenshotParams,
  ): Promise<CsfloatSchemaScreenshotResponse> {
    return this.client.get<CsfloatSchemaScreenshotResponse>(
      "schema/images/screenshot",
      params as unknown as QueryParams,
    );
  }

  getNotary(): Promise<CsfloatNotaryMetaResponse> {
    return this.client.get<CsfloatNotaryMetaResponse>("meta/notary");
  }
}
