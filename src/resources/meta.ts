import type { CsfloatHttpClient } from "../client.js";
import { CsfloatSdkError } from "../errors.js";
import type {
  CsfloatAppMetaResponse,
  CsfloatExchangeRatesResponse,
  CsfloatInspectResponse,
  CsfloatLocationResponse,
  CsfloatNotaryMetaResponse,
  CsfloatSchemaBrowseResponse,
  CsfloatSchemaScreenshotParams,
  CsfloatSchemaScreenshotResponse,
  CsfloatSchemaBrowseType,
  CsfloatSchemaResponse,
  QueryParams,
} from "../types.js";

const CSFLOAT_INSPECT_API_BASE_URL = "https://api.csfloat.com";

function summarizeErrorChain(value: unknown, depth = 0): string {
  if (value === null || value === undefined || depth > 2) {
    return "";
  }

  if (value instanceof Error) {
    const error = value as Error & {
      code?: unknown;
      hostname?: unknown;
      cause?: unknown;
    };

    return [
      value.name,
      value.message,
      typeof error.code === "string" ? error.code : null,
      typeof error.hostname === "string" ? error.hostname : null,
      summarizeErrorChain(error.cause, depth + 1),
    ]
      .filter((part): part is string => Boolean(part))
      .join(" ");
  }

  if (typeof value === "string") {
    return value;
  }

  return "";
}

function isHistoricalInspectCompanionFailure(error: unknown): error is CsfloatSdkError {
  if (!(error instanceof CsfloatSdkError) || error.kind !== "network") {
    return false;
  }

  const details = summarizeErrorChain(error.details).toLowerCase();
  const cause = summarizeErrorChain((error as { cause?: unknown }).cause).toLowerCase();
  const combined = `${error.message} ${details} ${cause}`.toLowerCase();

  return combined.includes("api.csfloat.com") && combined.includes("enotfound");
}

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

  async inspectItem(inspectLink: string): Promise<CsfloatInspectResponse> {
    try {
      return await this.client
        .derive({
          baseUrl: CSFLOAT_INSPECT_API_BASE_URL,
          sendAuthorization: false,
          defaultHeaders: {
            Origin: "https://csfloat.com",
          },
        })
        .get<CsfloatInspectResponse>("", {
          url: inspectLink,
        });
    } catch (error) {
      if (isHistoricalInspectCompanionFailure(error)) {
        throw new CsfloatSdkError(
          "CSFloat inspect companion is currently unavailable; the historical api.csfloat.com host no longer resolves",
          {
            kind: "network",
            retryable: error.retryable,
            details: error.details,
            cause: error,
          },
        );
      }

      throw error;
    }
  }
}
