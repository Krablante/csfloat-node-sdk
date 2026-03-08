import { CsfloatSdkError } from "./errors.js";
import type {
  CsfloatGenerateLoadoutRecommendationsRequest,
  CsfloatLoadoutFaction,
  CsfloatLoadoutListParams,
  CsfloatLoadoutRecommendationRequest,
  CsfloatLoadoutRecommendationSkinItem,
  CsfloatLoadoutSortBy,
  CsfloatStickerRecommendationRequest,
} from "./types.js";

export const CSFLOAT_LOADOUT_SORT_OPTIONS: readonly CsfloatLoadoutSortBy[] = [
  "favorites",
  "random",
  "created_at",
];

export const CSFLOAT_LOADOUT_FACTIONS: readonly CsfloatLoadoutFaction[] = [
  "ct",
  "t",
];

export const CSFLOAT_LOADOUT_MAX_LIMIT = 200;
export const CSFLOAT_STICKER_RECOMMENDATION_MAX_COUNT = 100;

export const CSFLOAT_DISCOVER_LOADOUT_PARAMS: Readonly<
  Pick<CsfloatLoadoutListParams, "any_filled" | "limit" | "months" | "sort_by">
> = {
  any_filled: true,
  limit: 100,
  months: 1,
  sort_by: "favorites",
};

export interface CsfloatLoadoutSkinSearchParams
  extends Omit<CsfloatLoadoutListParams, "def_index" | "paint_index"> {
  def_index: number;
  paint_index: number;
}

export interface CsfloatSingleSkinRecommendationOptions {
  count: number;
  def_blacklist?: number[];
  def_whitelist?: number[];
}

export interface CsfloatSingleSkinStickerRecommendationOptions {
  collection_whitelist?: string[];
  count: number;
}

function assertInteger(label: string, value: number | undefined, min: number): void {
  if (value === undefined) {
    return;
  }

  if (!Number.isInteger(value) || value < min) {
    throw new CsfloatSdkError(`${label} must be an integer greater than or equal to ${min}`);
  }
}

function assertRecommendationItems(
  items: CsfloatLoadoutRecommendationSkinItem[],
): void {
  for (const [index, item] of items.entries()) {
    if (item.type !== "skin") {
      throw new CsfloatSdkError(`items[${index}].type must be "skin"`);
    }

    assertInteger(`items[${index}].def_index`, item.def_index, 0);
    assertInteger(`items[${index}].paint_index`, item.paint_index, 0);
  }
}

export function buildLoadoutListParams(
  params: CsfloatLoadoutListParams = {},
): CsfloatLoadoutListParams {
  if (params.limit !== undefined) {
    assertInteger("limit", params.limit, 1);

    if (params.limit > CSFLOAT_LOADOUT_MAX_LIMIT) {
      throw new CsfloatSdkError(
        `limit must be between 1 and ${CSFLOAT_LOADOUT_MAX_LIMIT}`,
      );
    }
  }

  assertInteger("months", params.months, 1);
  assertInteger("def_index", params.def_index, 0);
  assertInteger("paint_index", params.paint_index, 0);

  if ((params.def_index === undefined) !== (params.paint_index === undefined)) {
    throw new CsfloatSdkError("def_index and paint_index must be provided together");
  }

  if (
    params.sort_by !== undefined &&
    !CSFLOAT_LOADOUT_SORT_OPTIONS.includes(params.sort_by)
  ) {
    throw new CsfloatSdkError(
      `sort_by must be one of ${CSFLOAT_LOADOUT_SORT_OPTIONS.join(", ")}`,
    );
  }

  if (params.any_filled !== undefined && params.any_filled !== true) {
    throw new CsfloatSdkError('any_filled must be "true" when provided');
  }

  return {
    ...params,
  };
}

export function buildLoadoutSkinSearchParams(
  params: CsfloatLoadoutSkinSearchParams,
): CsfloatLoadoutListParams {
  return buildLoadoutListParams(params);
}

export function getDiscoverLoadoutParams(
  params: Omit<CsfloatLoadoutListParams, "any_filled"> = {},
): CsfloatLoadoutListParams {
  return buildLoadoutListParams({
    ...CSFLOAT_DISCOVER_LOADOUT_PARAMS,
    ...params,
    any_filled: true,
  });
}

export function buildLoadoutRecommendationRequest(
  request: CsfloatLoadoutRecommendationRequest,
): CsfloatLoadoutRecommendationRequest {
  assertInteger("count", request.count, 0);
  assertRecommendationItems(request.items);

  for (const [index, defIndex] of (request.def_whitelist ?? []).entries()) {
    assertInteger(`def_whitelist[${index}]`, defIndex, 0);
  }

  for (const [index, defIndex] of (request.def_blacklist ?? []).entries()) {
    assertInteger(`def_blacklist[${index}]`, defIndex, 0);
  }

  return {
    ...request,
    items: [...request.items],
    ...(request.def_whitelist ? { def_whitelist: [...request.def_whitelist] } : {}),
    ...(request.def_blacklist ? { def_blacklist: [...request.def_blacklist] } : {}),
  };
}

export function buildStickerRecommendationRequest(
  request: CsfloatStickerRecommendationRequest,
): CsfloatStickerRecommendationRequest {
  assertInteger("count", request.count, 0);

  if (request.count > CSFLOAT_STICKER_RECOMMENDATION_MAX_COUNT) {
    throw new CsfloatSdkError(
      `count must be between 0 and ${CSFLOAT_STICKER_RECOMMENDATION_MAX_COUNT}`,
    );
  }

  assertRecommendationItems(request.items);

  return {
    ...request,
    items: [...request.items],
    ...(request.collection_whitelist
      ? { collection_whitelist: [...request.collection_whitelist] }
      : {}),
  };
}

export function buildGenerateLoadoutRecommendationsRequest(
  request: CsfloatGenerateLoadoutRecommendationsRequest,
): CsfloatGenerateLoadoutRecommendationsRequest {
  if (request.def_indexes.length === 0) {
    throw new CsfloatSdkError("def_indexes must contain at least one weapon id");
  }

  if (!CSFLOAT_LOADOUT_FACTIONS.includes(request.faction)) {
    throw new CsfloatSdkError(
      `faction must be one of ${CSFLOAT_LOADOUT_FACTIONS.join(", ")}`,
    );
  }

  if (request.max_price !== undefined) {
    assertInteger("max_price", request.max_price, 1);
  }

  return {
    ...request,
    def_indexes: [...request.def_indexes],
    items: [...request.items],
  };
}

export function buildSingleSkinRecommendationRequest(
  defIndex: number,
  paintIndex: number,
  options: CsfloatSingleSkinRecommendationOptions,
): CsfloatLoadoutRecommendationRequest {
  return buildLoadoutRecommendationRequest({
    items: [{ type: "skin", def_index: defIndex, paint_index: paintIndex }],
    ...options,
  });
}

export function buildSingleSkinStickerRecommendationRequest(
  defIndex: number,
  paintIndex: number,
  options: CsfloatSingleSkinStickerRecommendationOptions,
): CsfloatStickerRecommendationRequest {
  return buildStickerRecommendationRequest({
    items: [{ type: "skin", def_index: defIndex, paint_index: paintIndex }],
    ...options,
  });
}
