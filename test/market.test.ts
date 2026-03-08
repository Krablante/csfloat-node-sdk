import { describe, expect, it } from "vitest";

import { CsfloatSdkError } from "../src/errors.js";
import {
  buildBlueRange,
  buildFadeRange,
  buildFloatRange,
  buildKeychainFilters,
  buildKeychainPatternRange,
  buildPriceRange,
  buildReferenceQuantityFilter,
  buildStickerFilters,
  CSFLOAT_EXCLUDE_RARE_ITEMS_MIN_REF_QTY,
  CSFLOAT_CATEGORY_PRESETS,
  CSFLOAT_STICKER_SEARCH_OPTIONS,
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
    expect(CSFLOAT_STICKER_SEARCH_OPTIONS).toEqual(["skins", "packages"]);
    expect(CSFLOAT_EXCLUDE_RARE_ITEMS_MIN_REF_QTY).toBe(20);
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
    expect(buildKeychainPatternRange({ min_keychain_pattern: 0, max_keychain_pattern: 10 })).toEqual({
      min_keychain_pattern: 0,
      max_keychain_pattern: 10,
    });
  });

  it("rejects inverted or out-of-range percent ranges", () => {
    expect(() => buildFadeRange({ min_fade: 101 })).toThrow(CsfloatSdkError);
    expect(() => buildFadeRange({ min_fade: 80, max_fade: 50 })).toThrow(
      CsfloatSdkError,
    );
    expect(() => buildBlueRange({ min_blue: -1 })).toThrow(CsfloatSdkError);
    expect(() => buildKeychainPatternRange({ min_keychain_pattern: -1 })).toThrow(CsfloatSdkError);
    expect(() => buildKeychainPatternRange({ min_keychain_pattern: 50, max_keychain_pattern: 10 })).toThrow(
      CsfloatSdkError,
    );
  });

  it("serializes applied sticker filters", () => {
    expect(
      buildStickerFilters([
        { sticker_id: 3, slot: 1 },
        { custom_sticker_id: "custom-123", slot: 5 },
        { slot: 2 },
      ]),
    ).toEqual({
      stickers: JSON.stringify([
        { i: 3, s: 0 },
        { c: "custom-123", s: 4 },
        { s: 1 },
      ]),
    });
  });

  it("rejects invalid sticker filter shapes", () => {
    expect(() => buildStickerFilters([{ sticker_id: 3, custom_sticker_id: "custom-123" }])).toThrow(
      CsfloatSdkError,
    );
    expect(() => buildStickerFilters([{ sticker_id: -1 }])).toThrow(CsfloatSdkError);
    expect(() => buildStickerFilters([{ slot: 0 }])).toThrow(CsfloatSdkError);
  });

  it("serializes keychain filters", () => {
    expect(buildKeychainFilters([{ keychain_index: 1 }, { keychain_index: 7 }])).toEqual({
      keychains: JSON.stringify([{ i: 1 }, { i: 7 }]),
    });
  });

  it("rejects invalid keychain filters", () => {
    expect(() => buildKeychainFilters([{ keychain_index: -1 }])).toThrow(CsfloatSdkError);
  });

  it("builds reference quantity filters", () => {
    expect(buildReferenceQuantityFilter({ min_ref_qty: 20 })).toEqual({
      min_ref_qty: 20,
    });
  });

  it("rejects invalid reference quantity filters", () => {
    expect(() => buildReferenceQuantityFilter({ min_ref_qty: -1 })).toThrow(CsfloatSdkError);
    expect(() => buildReferenceQuantityFilter({ min_ref_qty: 1.5 })).toThrow(CsfloatSdkError);
  });
});
