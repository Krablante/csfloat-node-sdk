import { describe, expect, it } from "vitest";

import { paginateCursor } from "../src/pagination.js";

describe("paginateCursor", () => {
  it("iterates through all pages until cursor disappears", async () => {
    const pages = [
      { data: [1, 2], cursor: "page-2" },
      { data: [3], cursor: "page-3" },
      { data: [4, 5] },
    ];

    let index = 0;
    const results: number[] = [];

    for await (const item of paginateCursor({
      loadPage: async () => pages[index++]!,
      getItems: (page) => page.data,
    })) {
      results.push(item);
    }

    expect(results).toEqual([1, 2, 3, 4, 5]);
  });
});
