import { CsfloatSdkError } from "./errors.js";
import type {
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
