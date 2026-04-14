import { decodeLink } from "@csfloat/cs2-inspect-serializer";
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
const MASKED_INSPECT_LINK_PATTERN =
  /^steam:\/\/run(?:game)?\/730\/\d*\/(?:\+|%20)csgo_econ_action_preview(?: |%20)([0-9A-Fa-f]+)$/i;

type MaskedInspectPayload = ReturnType<typeof decodeLink>;
type MaskedInspectAttachment = MaskedInspectPayload["stickers"][number];

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

function isMaskedInspectLink(inspectLink: string): boolean {
  return MASKED_INSPECT_LINK_PATTERN.test(decodeURIComponent(inspectLink));
}

function mapMaskedInspectAttachment(attachment: MaskedInspectAttachment) {
  return {
    slot: attachment.slot,
    sticker_id: attachment.stickerId,
    stickerId: attachment.stickerId,
    wear: attachment.wear,
    scale: attachment.scale,
    rotation: attachment.rotation,
    tint_id: attachment.tintId,
    tintId: attachment.tintId,
    offset_x: attachment.offsetX,
    offset_y: attachment.offsetY,
    offset_z: attachment.offsetZ,
    pattern: attachment.pattern,
    highlight_reel: attachment.highlightReel,
    highlightReel: attachment.highlightReel,
    wrapped_sticker: attachment.wrappedSticker,
    wrappedSticker: attachment.wrappedSticker,
  };
}

function definedProps<T extends Record<string, unknown>>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== undefined),
  ) as Partial<T>;
}

function buildMaskedInspectResponse(
  inspectLink: string,
  decoded: MaskedInspectPayload,
): CsfloatInspectResponse {
  return {
    iteminfo: {
      inspect_link: inspectLink,
      stickers: decoded.stickers.map(mapMaskedInspectAttachment),
      keychains: decoded.keychains.map(mapMaskedInspectAttachment),
      variations: decoded.variations.map(mapMaskedInspectAttachment),
      ...definedProps({
        defindex: decoded.defindex,
        paintindex: decoded.paintindex,
        rarity: decoded.rarity,
        quality: decoded.quality,
        paintseed: decoded.paintseed,
        floatvalue: decoded.paintwear,
        paintwear: decoded.paintwear,
        killeaterscoretype: decoded.killeaterscoretype,
        killeatervalue: decoded.killeatervalue,
        customname: decoded.customname,
        inventory: decoded.inventory,
        origin: decoded.origin,
        questid: decoded.questid,
        dropreason: decoded.dropreason,
        musicindex: decoded.musicindex,
        entindex: decoded.entindex,
        petindex: decoded.petindex,
        style: decoded.style,
        upgrade_level: decoded.upgradeLevel,
      }),
    },
  };
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
    if (isMaskedInspectLink(inspectLink)) {
      try {
        return buildMaskedInspectResponse(inspectLink, decodeLink(inspectLink));
      } catch (error) {
        throw new CsfloatSdkError(
          "Failed to decode the masked CS2 inspect link locally",
          {
            kind: "validation",
            details: error,
            cause: error,
          },
        );
      }
    }

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
          "CSFloat inspect companion is currently unavailable; only current masked/protobuf inspect links can still be decoded locally",
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
