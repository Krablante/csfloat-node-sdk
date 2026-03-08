import { CsfloatSdkError } from "./errors.js";
import type { CsfloatLoadoutListParams, CsfloatLoadoutSortBy } from "./types.js";

export const CSFLOAT_LOADOUT_SORT_OPTIONS: readonly CsfloatLoadoutSortBy[] = [
  "favorites",
  "random",
  "created_at",
];

export const CSFLOAT_LOADOUT_MAX_LIMIT = 200;

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

function assertInteger(label: string, value: number | undefined, min: number): void {
  if (value === undefined) {
    return;
  }

  if (!Number.isInteger(value) || value < min) {
    throw new CsfloatSdkError(`${label} must be an integer greater than or equal to ${min}`);
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
