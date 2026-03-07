export type CsfloatWearPreset = "FN" | "MW" | "FT" | "WW" | "BS";

export interface CsfloatWearParams {
  min_float?: number;
  max_float?: number;
}

// Live-confirmed against the CSFloat search UI and API on 2026-03-07.
export const CSFLOAT_WEAR_PRESETS: Record<CsfloatWearPreset, CsfloatWearParams> = {
  FN: {
    max_float: 0.07,
  },
  MW: {
    min_float: 0.07,
    max_float: 0.15,
  },
  FT: {
    min_float: 0.15,
    max_float: 0.38,
  },
  WW: {
    min_float: 0.38,
    max_float: 0.45,
  },
  BS: {
    min_float: 0.45,
  },
};

export function getWearParams(preset: CsfloatWearPreset): CsfloatWearParams {
  return { ...CSFLOAT_WEAR_PRESETS[preset] };
}
