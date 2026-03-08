import { describe, expect, it, vi } from "vitest";

import { LoadoutResource } from "../src/resources/loadout.js";

describe("LoadoutResource", () => {
  it("requests public user loadouts", async () => {
    const get = vi.fn(async (_path: string) => null);
    const resource = new LoadoutResource({ get } as never);

    await resource.getUserLoadouts("76561198771627775");

    expect(get).toHaveBeenCalledWith(
      "https://loadout-api.csfloat.com/v1/user/76561198771627775/loadouts",
    );
  });

  it("requests a single public loadout", async () => {
    const get = vi.fn(async (_path: string) => null);
    const resource = new LoadoutResource({ get } as never);

    await resource.getLoadout("154023336572224457");

    expect(get).toHaveBeenCalledWith(
      "https://loadout-api.csfloat.com/v1/loadout/154023336572224457",
    );
  });
});
