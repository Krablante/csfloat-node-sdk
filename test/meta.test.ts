import { describe, expect, it, vi } from "vitest";

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

  it("requests notary meta", async () => {
    const get = vi.fn(async (_path: string) => null);
    const resource = new MetaResource({ get } as never);

    await resource.getNotary();

    expect(get).toHaveBeenCalledWith("meta/notary");
  });
});
