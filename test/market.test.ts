import { describe, expect, it } from "vitest";

import { CsfloatSdkError } from "../src/errors.js";
import {
  buildBlueRange,
  buildFadeRange,
  buildFloatRange,
  buildPriceRange,
  CSFLOAT_CATEGORY_PRESETS,
  getCategoryParams,
  withWearPreset,
} from "../src/market.js";

describe("market helpers", () => {
  it("exposes stable category presets", () => {
    expect(CSFLOAT_CATEGORY_PRESETS).toEqual({
      normal: 1,
      stattrak: 2,
      souvenir: 3,
      highlight: 4,
    });
  });

  it("builds category params", () => {
    expect(getCategoryParams("souvenir")).toEqual({ category: 3 });
  });

  it("merges wear presets into listing params", () => {
    expect(
      withWearPreset(
        {
          limit: 10,
          sort_by: "most_recent",
        },
        "MW",
      ),
    ).toEqual({
      limit: 10,
      sort_by: "most_recent",
      min_float: 0.07,
      max_float: 0.15,
    });
  });

  it("builds float ranges", () => {
    expect(buildFloatRange({ min_float: 0.07, max_float: 0.15 })).toEqual({
      min_float: 0.07,
      max_float: 0.15,
    });
  });

  it("rejects invalid float ranges", () => {
    expect(() => buildFloatRange({ min_float: 0.5, max_float: 0.1 })).toThrow(
      CsfloatSdkError,
    );
    expect(() => buildFloatRange({ min_float: -0.1 })).toThrow(CsfloatSdkError);
    expect(() => buildFloatRange({ max_float: 1.1 })).toThrow(CsfloatSdkError);
  });

  it("builds price, fade, and blue ranges", () => {
    expect(buildPriceRange({ min_price: 100, max_price: 500 })).toEqual({
      min_price: 100,
      max_price: 500,
    });
    expect(buildFadeRange({ min_fade: 95, max_fade: 100 })).toEqual({
      min_fade: 95,
      max_fade: 100,
    });
    expect(buildBlueRange({ min_blue: 80, max_blue: 100 })).toEqual({
      min_blue: 80,
      max_blue: 100,
    });
  });

  it("rejects inverted or out-of-range percent ranges", () => {
    expect(() => buildFadeRange({ min_fade: 101 })).toThrow(CsfloatSdkError);
    expect(() => buildFadeRange({ min_fade: 80, max_fade: 50 })).toThrow(
      CsfloatSdkError,
    );
    expect(() => buildBlueRange({ min_blue: -1 })).toThrow(CsfloatSdkError);
  });
});
