import { describe, expect, it } from "vitest";

import {
  buildReferenceInsight,
  getReferenceDiscountPercent,
  getReferenceItemFactorAmount,
  getReferencePremiumPercent,
  getReferencePrice,
} from "../src/reference.js";
import type { CsfloatListing, CsfloatReferencePrice } from "../src/types.js";

const reference: CsfloatReferencePrice = {
  base_price: 401_898,
  float_factor: 1.19481,
  predicted_price: 480_191,
  quantity: 57,
  last_updated: "2026-03-10T20:36:22.015139Z",
};

const discountedListing: Pick<CsfloatListing, "price" | "reference"> = {
  price: 407_747,
  reference,
};

describe("reference helpers", () => {
  it("extracts the raw reference price object", () => {
    expect(getReferencePrice(reference)).toEqual(reference);
    expect(getReferencePrice(discountedListing)).toEqual(reference);
  });

  it("builds reference insight values for a discounted listing", () => {
    expect(buildReferenceInsight(discountedListing)).toEqual({
      basePrice: 401_898,
      itemFactorMultiplier: 1.19481,
      itemFactorAmount: 78_293,
      finalPrice: 480_191,
      globalListings: 57,
      lastUpdated: "2026-03-10T20:36:22.015139Z",
      listingPrice: 407_747,
      priceDelta: -72_444,
      discountPercent: ((480_191 - 407_747) / 480_191) * 100,
      premiumPercent: undefined,
    });
  });

  it("computes the marketplace-style discount percentage from reference data", () => {
    expect(getReferenceDiscountPercent(discountedListing)).toBeCloseTo(15.0865, 3);
    expect(getReferenceItemFactorAmount(discountedListing)).toBe(78_293);
    expect(getReferencePremiumPercent(discountedListing)).toBeUndefined();
  });

  it("computes premium percentages for listings above the predicted price", () => {
    const premiumListing: Pick<CsfloatListing, "price" | "reference"> = {
      price: 500_000,
      reference,
    };

    expect(getReferenceDiscountPercent(premiumListing)).toBeUndefined();
    expect(getReferencePremiumPercent(premiumListing)).toBeCloseTo(
      ((500_000 - 480_191) / 480_191) * 100,
      3,
    );
  });

  it("returns undefined when no reference data is available", () => {
    expect(buildReferenceInsight(undefined)).toBeUndefined();
    expect(getReferencePrice(undefined)).toBeUndefined();
    expect(getReferenceDiscountPercent(undefined)).toBeUndefined();
  });
});
