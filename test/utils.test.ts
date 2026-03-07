import { describe, expect, it } from "vitest";

import { cleanParams } from "../src/utils.js";

describe("cleanParams", () => {
  it("drops nullish values and serializes the rest", () => {
    const params = cleanParams({
      market_hash_name: "Revolution Case",
      limit: 10,
      cursor: undefined,
      type: "buy_now",
      ignored: null,
    });

    expect(params.toString()).toBe(
      "market_hash_name=Revolution+Case&limit=10&type=buy_now",
    );
  });
});
