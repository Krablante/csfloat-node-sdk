import { describe, expect, it, vi } from "vitest";

import { HistoryResource } from "../src/resources/history.js";

describe("HistoryResource", () => {
  it("requests graph history with paint index", async () => {
    const get = vi.fn(async (_path: string, _params?: unknown) => []);
    const resource = new HistoryResource({ get } as never);

    await resource.getGraph("Souvenir P250 | Boreal Forest (Factory New)", {
      paint_index: 77,
    });

    expect(get).toHaveBeenCalledWith(
      "history/Souvenir%20P250%20%7C%20Boreal%20Forest%20(Factory%20New)/graph",
      { paint_index: 77 },
    );
  });
});
