import { describe, expect, it, vi } from "vitest";

import { CsfloatSdkError } from "../src/errors.js";
import { MetaResource } from "../src/resources/meta.js";

describe("MetaResource", () => {
  it("requests schema", async () => {
    const get = vi.fn(async (_path: string) => null);
    const resource = new MetaResource({ get } as never);

    await resource.getSchema();

    expect(get).toHaveBeenCalledWith("schema");
  });

  it("requests exchange rates", async () => {
    const get = vi.fn(async (_path: string) => null);
    const resource = new MetaResource({ get } as never);

    await resource.getExchangeRates();

    expect(get).toHaveBeenCalledWith("meta/exchange-rates");
  });

  it("requests app meta", async () => {
    const get = vi.fn(async (_path: string) => null);
    const resource = new MetaResource({ get } as never);

    await resource.getApp();

    expect(get).toHaveBeenCalledWith("meta/app");
  });

  it("requests inferred location", async () => {
    const get = vi.fn(async (_path: string) => null);
    const resource = new MetaResource({ get } as never);

    await resource.getLocation();

    expect(get).toHaveBeenCalledWith("meta/location");
  });

  it("requests schema browse groups for a known category", async () => {
    const get = vi.fn(async (_path: string, _params?: unknown) => null);
    const resource = new MetaResource({ get } as never);

    await resource.getSchemaBrowse("stickers");

    expect(get).toHaveBeenCalledWith("schema/browse", {
      type: "stickers",
    });
  });

  it("requests an example screenshot for a schema item", async () => {
    const get = vi.fn(async (_path: string, _params?: unknown) => null);
    const resource = new MetaResource({ get } as never);

    await resource.getItemExampleScreenshot({
      def_index: 7,
      paint_index: 490,
      min_float: 0.15,
      max_float: 0.38,
    });

    expect(get).toHaveBeenCalledWith("schema/images/screenshot", {
      def_index: 7,
      paint_index: 490,
      min_float: 0.15,
      max_float: 0.38,
    });
  });

  it("requests notary meta", async () => {
    const get = vi.fn(async (_path: string) => null);
    const resource = new MetaResource({ get } as never);

    await resource.getNotary();

    expect(get).toHaveBeenCalledWith("meta/notary");
  });

  it("requests external inspect-link item details with the checker origin header", async () => {
    const deriveGet = vi.fn(async (_path: string, _params?: unknown) => null);
    const derive = vi.fn(() => ({
      get: deriveGet,
    }));
    const resource = new MetaResource({ derive } as never);

    await resource.inspectItem("steam://inspect-link");

    expect(derive).toHaveBeenCalledWith({
      baseUrl: "https://api.csfloat.com",
      sendAuthorization: false,
      defaultHeaders: {
        Origin: "https://csfloat.com",
      },
    });
    expect(deriveGet).toHaveBeenCalledWith("", {
      url: "steam://inspect-link",
    });
  });

  it("decodes current masked inspect links locally", async () => {
    const derive = vi.fn();
    const resource = new MetaResource({ derive } as never);

    const response = await resource.inspectItem(
      "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%2000180920D8022806300438FF8AE9D90340E302A2011B080010241D000000003D5FF49040454C62173F4D41770F4158D902E3BE243A",
    );

    expect(derive).not.toHaveBeenCalled();
    expect(response).toMatchObject({
      iteminfo: {
        defindex: 9,
        paintindex: 344,
        paintseed: 355,
        floatvalue: 0.002842277055606246,
        keychains: [
          {
            sticker_id: 36,
            highlight_reel: 345,
          },
        ],
      },
    });
  });

  it("surfaces a clearer error when the historical inspect companion host no longer resolves", async () => {
    const dnsError = Object.assign(
      new Error("getaddrinfo ENOTFOUND api.csfloat.com"),
      {
        code: "ENOTFOUND",
        hostname: "api.csfloat.com",
      },
    );
    const fetchError = new TypeError("fetch failed");
    Object.defineProperty(fetchError, "cause", {
      value: dnsError,
      configurable: true,
    });

    const deriveGet = vi.fn(async () => {
      throw new CsfloatSdkError("CSFloat API request failed", {
        kind: "network",
        retryable: true,
        details: fetchError,
        cause: fetchError,
      });
    });
    const derive = vi.fn(() => ({
      get: deriveGet,
    }));
    const resource = new MetaResource({ derive } as never);

    await expect(resource.inspectItem("steam://inspect-link")).rejects.toMatchObject({
      name: "CsfloatSdkError",
      kind: "network",
      retryable: true,
      message:
        "CSFloat inspect companion is currently unavailable; only current masked/protobuf inspect links can still be decoded locally",
    });
  });
});
