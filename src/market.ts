import { CsfloatSdkError } from "./errors.js";
import type {
  CsfloatAppliedKeychainFilter,
  CsfloatAppliedStickerFilter,
  CsfloatListParams,
  CsfloatListingCategoryFilter,
  CsfloatListingsFilter,
  SortBy,
} from "./types.js";
import type { CsfloatWearParams, CsfloatWearPreset } from "./wear.js";
import { getWearParams } from "./wear.js";

export type CsfloatCategoryPreset = "normal" | "stattrak" | "souvenir" | "highlight";

export const CSFLOAT_CATEGORY_PRESETS: Record<
  CsfloatCategoryPreset,
  CsfloatListingCategoryFilter
> = {
  normal: 1,
  stattrak: 2,
  souvenir: 3,
  highlight: 4,
};

export const CSFLOAT_FILTER_OPTIONS: readonly CsfloatListingsFilter[] = [
  "sticker_combos",
  "unique",
];

export const CSFLOAT_SORT_OPTIONS: readonly SortBy[] = [
  "lowest_price",
  "highest_price",
  "most_recent",
  "expires_soon",
  "lowest_float",
  "highest_float",
  "best_deal",
  "highest_discount",
  "float_rank",
  "num_bids",
];

export const CSFLOAT_EXCLUDE_RARE_ITEMS_MIN_REF_QTY = 20;

export interface CsfloatPriceRangeParams {
  min_price?: number;
  max_price?: number;
}

export interface CsfloatFadeRangeParams {
  min_fade?: number;
  max_fade?: number;
}

export interface CsfloatBlueRangeParams {
  min_blue?: number;
  max_blue?: number;
}

export interface CsfloatReferenceQuantityParams {
  min_ref_qty?: number;
}

function assertPositiveInteger(label: string, value: number | undefined): void {
  if (value === undefined) {
    return;
  }

  if (!Number.isInteger(value) || value < 0) {
    throw new CsfloatSdkError(`${label} must be a non-negative integer`);
  }
}

function assertNumberInRange(
  label: string,
  value: number | undefined,
  {
    min,
    max,
  }: {
    min: number;
    max: number;
  },
): void {
  if (value === undefined) {
    return;
  }

  if (!Number.isFinite(value) || value < min || value > max) {
    throw new CsfloatSdkError(`${label} must be between ${min} and ${max}`);
  }
}

function assertAscendingRange(
  label: string,
  minValue: number | undefined,
  maxValue: number | undefined,
): void {
  if (minValue !== undefined && maxValue !== undefined && minValue > maxValue) {
    throw new CsfloatSdkError(`${label} min cannot be greater than max`);
  }
}

export function getCategoryParams(
  preset: CsfloatCategoryPreset,
): Pick<CsfloatListParams, "category"> {
  return {
    category: CSFLOAT_CATEGORY_PRESETS[preset],
  };
}

export function withWearPreset(
  params: Omit<CsfloatListParams, "min_float" | "max_float">,
  preset: CsfloatWearPreset,
): CsfloatListParams {
  return {
    ...params,
    ...getWearParams(preset),
  };
}

export function buildFloatRange(
  params: CsfloatWearParams,
): Pick<CsfloatListParams, "min_float" | "max_float"> {
  assertNumberInRange("min_float", params.min_float, { min: 0, max: 1 });
  assertNumberInRange("max_float", params.max_float, { min: 0, max: 1 });
  assertAscendingRange("float range", params.min_float, params.max_float);

  return {
    ...(params.min_float === undefined ? {} : { min_float: params.min_float }),
    ...(params.max_float === undefined ? {} : { max_float: params.max_float }),
  };
}

export function buildPriceRange(
  params: CsfloatPriceRangeParams,
): Pick<CsfloatListParams, "min_price" | "max_price"> {
  assertNumberInRange("min_price", params.min_price, {
    min: 0,
    max: Number.MAX_SAFE_INTEGER,
  });
  assertNumberInRange("max_price", params.max_price, {
    min: 0,
    max: Number.MAX_SAFE_INTEGER,
  });
  assertAscendingRange("price range", params.min_price, params.max_price);

  return {
    ...(params.min_price === undefined ? {} : { min_price: params.min_price }),
    ...(params.max_price === undefined ? {} : { max_price: params.max_price }),
  };
}

export function buildFadeRange(
  params: CsfloatFadeRangeParams,
): Pick<CsfloatListParams, "min_fade" | "max_fade"> {
  assertNumberInRange("min_fade", params.min_fade, { min: 0, max: 100 });
  assertNumberInRange("max_fade", params.max_fade, { min: 0, max: 100 });
  assertAscendingRange("fade range", params.min_fade, params.max_fade);

  return {
    ...(params.min_fade === undefined ? {} : { min_fade: params.min_fade }),
    ...(params.max_fade === undefined ? {} : { max_fade: params.max_fade }),
  };
}

export function buildBlueRange(
  params: CsfloatBlueRangeParams,
): Pick<CsfloatListParams, "min_blue" | "max_blue"> {
  assertNumberInRange("min_blue", params.min_blue, { min: 0, max: 100 });
  assertNumberInRange("max_blue", params.max_blue, { min: 0, max: 100 });
  assertAscendingRange("blue range", params.min_blue, params.max_blue);

  return {
    ...(params.min_blue === undefined ? {} : { min_blue: params.min_blue }),
    ...(params.max_blue === undefined ? {} : { max_blue: params.max_blue }),
  };
}

export function buildReferenceQuantityFilter(
  params: CsfloatReferenceQuantityParams,
): Pick<CsfloatListParams, "min_ref_qty"> {
  assertPositiveInteger("min_ref_qty", params.min_ref_qty);

  return {
    ...(params.min_ref_qty === undefined ? {} : { min_ref_qty: params.min_ref_qty }),
  };
}

export function buildStickerFilters(
  filters: CsfloatAppliedStickerFilter[],
): Pick<CsfloatListParams, "stickers"> {
  const serialized = filters.flatMap((filter) => {
    const { sticker_id, custom_sticker_id, slot } = filter;

    if (sticker_id !== undefined && custom_sticker_id !== undefined) {
      throw new CsfloatSdkError("sticker filters cannot include both sticker_id and custom_sticker_id");
    }

    assertPositiveInteger("sticker_id", sticker_id);

    if (slot !== undefined && (!Number.isInteger(slot) || slot < 1 || slot > 5)) {
      throw new CsfloatSdkError("sticker slot must be an integer between 1 and 5");
    }

    const entry: Record<string, number | string> = {};

    if (sticker_id !== undefined) {
      entry.i = sticker_id;
    }

    if (custom_sticker_id) {
      entry.c = custom_sticker_id;
    }

    if (slot !== undefined) {
      entry.s = slot - 1;
    }

    return Object.keys(entry).length > 0 ? [entry] : [];
  });

  return {
    stickers: JSON.stringify(serialized),
  };
}

export function buildKeychainFilters(
  filters: CsfloatAppliedKeychainFilter[],
): Pick<CsfloatListParams, "keychains"> {
  const serialized = filters.map((filter) => {
    assertPositiveInteger("keychain_index", filter.keychain_index);

    return {
      i: filter.keychain_index,
    };
  });

  return {
    keychains: JSON.stringify(serialized),
  };
}
