import { describe, expect, it, vi } from "vitest";

import { InventoryResource } from "../src/resources/inventory.js";
import type { CsfloatInventoryItem } from "../src/types.js";

describe("InventoryResource", () => {
  it("requests authenticated inventory", async () => {
    const get = vi.fn(async (_path: string) => []);
    const resource = new InventoryResource({ get } as never);

    await resource.getInventory();

    expect(get).toHaveBeenCalledWith("me/inventory");
  });

  it("allows live-confirmed listing_id on inventory items", () => {
    const item: CsfloatInventoryItem = {
      asset_id: "49922189197",
      listing_id: "949643188866516245",
    };

    expect(item.listing_id).toBe("949643188866516245");
  });
});
