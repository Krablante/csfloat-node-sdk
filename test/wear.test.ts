import { describe, expect, it } from "vitest";

import { CSFLOAT_WEAR_PRESETS, getWearParams } from "../src/wear.js";

describe("wear helpers", () => {
  it("exposes live-confirmed wear preset mappings", () => {
    expect(CSFLOAT_WEAR_PRESETS).toEqual({
      FN: { max_float: 0.07 },
      MW: { min_float: 0.07, max_float: 0.15 },
      FT: { min_float: 0.15, max_float: 0.38 },
      WW: { min_float: 0.38, max_float: 0.45 },
      BS: { min_float: 0.45 },
    });
  });

  it("returns a copy of wear params", () => {
    const params = getWearParams("MW");

    expect(params).toEqual({ min_float: 0.07, max_float: 0.15 });
    expect(params).not.toBe(CSFLOAT_WEAR_PRESETS.MW);
  });
});
