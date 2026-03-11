import type { CsfloatInventoryItem, CsfloatListing, CsfloatReferencePrice } from "./types.js";

export type CsfloatReferenceCarrier = Pick<CsfloatListing, "price" | "reference"> | Pick<CsfloatInventoryItem, "reference">;

export type CsfloatReferenceTarget =
  | CsfloatReferencePrice
  | CsfloatReferenceCarrier
  | null
  | undefined;

export interface CsfloatReferenceInsight {
  basePrice?: number;
  itemFactorMultiplier?: number;
  itemFactorAmount?: number;
  finalPrice?: number;
  globalListings?: number;
  lastUpdated?: string;
  listingPrice?: number;
  priceDelta?: number;
  discountPercent?: number;
  premiumPercent?: number;
}

function isReferencePrice(target: CsfloatReferenceTarget): target is CsfloatReferencePrice {
  return Boolean(
    target &&
      typeof target === "object" &&
      ("base_price" in target ||
        "predicted_price" in target ||
        "float_factor" in target ||
        "quantity" in target ||
        "last_updated" in target),
  );
}

function extractReference(target: CsfloatReferenceTarget): CsfloatReferencePrice | undefined {
  if (!target) {
    return undefined;
  }

  if (isReferencePrice(target)) {
    return target;
  }

  return target.reference ?? undefined;
}

function extractListingPrice(
  target: CsfloatReferenceTarget,
  overridePrice?: number | null,
): number | undefined {
  if (overridePrice !== undefined && overridePrice !== null) {
    return overridePrice;
  }

  if (!target || isReferencePrice(target) || !("price" in target)) {
    return undefined;
  }

  return typeof target.price === "number" ? target.price : undefined;
}

function computePriceDelta(
  listingPrice: number | undefined,
  finalPrice: number | undefined,
): number | undefined {
  if (listingPrice === undefined || finalPrice === undefined) {
    return undefined;
  }

  return listingPrice - finalPrice;
}

function computeRelativePercent(
  numerator: number | undefined,
  denominator: number | undefined,
): number | undefined {
  if (numerator === undefined || denominator === undefined || denominator <= 0) {
    return undefined;
  }

  return (numerator / denominator) * 100;
}

export function getReferencePrice(
  target: CsfloatReferenceTarget,
): CsfloatReferencePrice | undefined {
  return extractReference(target);
}

export function getReferenceItemFactorAmount(
  target: CsfloatReferenceTarget,
): number | undefined {
  const reference = extractReference(target);
  if (!reference || reference.base_price === undefined || reference.predicted_price === undefined) {
    return undefined;
  }

  return reference.predicted_price - reference.base_price;
}

export function getReferenceDiscountPercent(
  target: CsfloatReferenceTarget,
  listingPrice?: number | null,
): number | undefined {
  const reference = extractReference(target);
  const price = extractListingPrice(target, listingPrice);
  const finalPrice = reference?.predicted_price;

  if (price === undefined || finalPrice === undefined || finalPrice <= 0 || price >= finalPrice) {
    return undefined;
  }

  return computeRelativePercent(finalPrice - price, finalPrice);
}

export function getReferencePremiumPercent(
  target: CsfloatReferenceTarget,
  listingPrice?: number | null,
): number | undefined {
  const reference = extractReference(target);
  const price = extractListingPrice(target, listingPrice);
  const finalPrice = reference?.predicted_price;

  if (price === undefined || finalPrice === undefined || finalPrice <= 0 || price <= finalPrice) {
    return undefined;
  }

  return computeRelativePercent(price - finalPrice, finalPrice);
}

export function buildReferenceInsight(
  target: CsfloatReferenceTarget,
  listingPrice?: number | null,
): CsfloatReferenceInsight | undefined {
  const reference = extractReference(target);
  if (!reference) {
    return undefined;
  }

  const price = extractListingPrice(target, listingPrice);
  const finalPrice = reference.predicted_price;
  const insight: CsfloatReferenceInsight = {};

  if (reference.base_price !== undefined) {
    insight.basePrice = reference.base_price;
  }

  if (reference.float_factor !== undefined) {
    insight.itemFactorMultiplier = reference.float_factor;
  }

  const itemFactorAmount = getReferenceItemFactorAmount(reference);
  if (itemFactorAmount !== undefined) {
    insight.itemFactorAmount = itemFactorAmount;
  }

  if (finalPrice !== undefined) {
    insight.finalPrice = finalPrice;
  }

  if (reference.quantity !== undefined) {
    insight.globalListings = reference.quantity;
  }

  if (reference.last_updated !== undefined) {
    insight.lastUpdated = reference.last_updated;
  }

  if (price !== undefined) {
    insight.listingPrice = price;
  }

  const priceDelta = computePriceDelta(price, finalPrice);
  if (priceDelta !== undefined) {
    insight.priceDelta = priceDelta;
  }

  const discountPercent = getReferenceDiscountPercent(reference, price);
  if (discountPercent !== undefined) {
    insight.discountPercent = discountPercent;
  }

  const premiumPercent = getReferencePremiumPercent(reference, price);
  if (premiumPercent !== undefined) {
    insight.premiumPercent = premiumPercent;
  }

  return insight;
}
