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

  it("requests inferred location", async () => {
    const get = vi.fn(async (_path: string) => null);
    const resource = new MetaResource({ get } as never);

    await resource.getLocation();

    expect(get).toHaveBeenCalledWith("meta/location");
  });

  it("requests notary meta", async () => {
    const get = vi.fn(async (_path: string) => null);
    const resource = new MetaResource({ get } as never);

    await resource.getNotary();

    expect(get).toHaveBeenCalledWith("meta/notary");
  });
});
