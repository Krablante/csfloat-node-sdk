import { CsfloatSdkError } from "./errors.js";
import type {
  CsfloatBuyOrderExpressionComparisonOperator,
  CsfloatBuyOrderExpressionCondition,
  CsfloatBuyOrderExpressionField,
  CsfloatBuyOrderExpressionGroup,
  CsfloatBuyOrderExpressionGroupEntry,
  CsfloatBuyOrderExpressionOperator,
  CsfloatBuyOrderExpressionRule,
  CsfloatBuyOrderExpressionStickerValue,
  CsfloatCreateExpressionBuyOrderRequest,
} from "./types.js";

export type CsfloatBuyOrderComparableField = Exclude<
  CsfloatBuyOrderExpressionField,
  "Stickers"
>;

export const CSFLOAT_BUY_ORDER_GROUP_CONDITIONS: readonly CsfloatBuyOrderExpressionCondition[] = [
  "and",
  "or",
];

export const CSFLOAT_BUY_ORDER_EXPRESSION_FIELDS: readonly CsfloatBuyOrderExpressionField[] = [
  "FloatValue",
  "Stickers",
  "PaintSeed",
  "StatTrak",
  "Souvenir",
  "Rarity",
  "DefIndex",
  "PaintIndex",
];

export const CSFLOAT_BUY_ORDER_COMPARISON_OPERATORS:
readonly CsfloatBuyOrderExpressionComparisonOperator[] = [
  "==",
  ">",
  ">=",
  "<",
  "<=",
];

export const CSFLOAT_BUY_ORDER_OPERATORS: readonly CsfloatBuyOrderExpressionOperator[] = [
  ...CSFLOAT_BUY_ORDER_COMPARISON_OPERATORS,
  "has",
];

const FIELD_OPERATOR_MAP: Record<
  CsfloatBuyOrderExpressionField,
  readonly CsfloatBuyOrderExpressionOperator[]
> = {
  FloatValue: ["==", ">", ">=", "<", "<="],
  Stickers: ["has"],
  PaintSeed: ["==", ">", ">=", "<", "<="],
  StatTrak: ["=="],
  Souvenir: ["=="],
  Rarity: ["=="],
  DefIndex: ["=="],
  PaintIndex: ["=="],
};

export interface CsfloatSingleSkinBuyOrderExpressionOptions {
  max_float?: number;
  min_float?: number;
  paint_seed?: number;
  rarity?: number;
  souvenir?: boolean;
  stattrak?: boolean;
}

export interface CsfloatSingleSkinBuyOrderRequestOptions
  extends CsfloatSingleSkinBuyOrderExpressionOptions {
  max_price: number;
  quantity?: number;
}

function assertInteger(label: string, value: number, min: number): void {
  if (!Number.isInteger(value) || value < min) {
    throw new CsfloatSdkError(`${label} must be an integer greater than or equal to ${min}`);
  }
}

function assertOptionalInteger(
  label: string,
  value: number | undefined,
  min: number,
): void {
  if (value === undefined) {
    return;
  }

  assertInteger(label, value, min);
}

function assertOptionalFloat(label: string, value: number | undefined): void {
  if (value === undefined) {
    return;
  }

  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new CsfloatSdkError(`${label} must be between 0 and 1`);
  }
}

function cloneRule(rule: CsfloatBuyOrderExpressionRule): CsfloatBuyOrderExpressionRule {
  return {
    field: rule.field,
    operator: rule.operator,
    value: {
      ...(rule.value.constant === undefined ? {} : { constant: rule.value.constant }),
      ...(rule.value.sticker === undefined
        ? {}
        : {
            sticker: {
              id: rule.value.sticker.id,
              ...(rule.value.sticker.qty === undefined ? {} : { qty: rule.value.sticker.qty }),
              ...(rule.value.sticker.slot === undefined ? {} : { slot: rule.value.sticker.slot }),
            },
          }),
    },
  };
}

function cloneEntry(entry: CsfloatBuyOrderExpressionGroupEntry): CsfloatBuyOrderExpressionGroupEntry {
  if ("expression" in entry) {
    return {
      expression: cloneGroup(entry.expression),
    };
  }

  return cloneRule(entry);
}

export function cloneGroup(group: CsfloatBuyOrderExpressionGroup): CsfloatBuyOrderExpressionGroup {
  return {
    condition: group.condition,
    rules: group.rules.map(cloneEntry),
  };
}

function normalizeConstantValue(
  field: CsfloatBuyOrderComparableField,
  value: boolean | number,
): string {
  if (field === "StatTrak" || field === "Souvenir") {
    if (typeof value !== "boolean") {
      throw new CsfloatSdkError(`${field} rules require a boolean value`);
    }

    return String(value);
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new CsfloatSdkError(`${field} rules require a finite numeric value`);
  }

  if (field === "FloatValue") {
    if (value < 0 || value > 1) {
      throw new CsfloatSdkError("FloatValue must be between 0 and 1");
    }

    return String(value);
  }

  if (!Number.isInteger(value) || value < 0) {
    throw new CsfloatSdkError(`${field} must be a non-negative integer`);
  }

  return String(value);
}

function validateOperator(
  field: CsfloatBuyOrderExpressionField,
  operator: CsfloatBuyOrderExpressionOperator,
): void {
  if (!FIELD_OPERATOR_MAP[field].includes(operator)) {
    throw new CsfloatSdkError(
      `${field} only supports ${FIELD_OPERATOR_MAP[field].join(", ")} operators`,
    );
  }
}

function validateStickerValue(value: CsfloatBuyOrderExpressionStickerValue): void {
  assertInteger("sticker.id", value.id, 0);

  if (value.qty !== undefined && value.slot !== undefined) {
    throw new CsfloatSdkError("sticker rules accept either qty or slot, not both");
  }

  if (value.qty !== undefined) {
    assertInteger("sticker.qty", value.qty, 1);
  }

  if (value.slot !== undefined) {
    assertInteger("sticker.slot", value.slot, 0);
  }
}

function buildConstantRule(
  field: CsfloatBuyOrderComparableField,
  operator: CsfloatBuyOrderExpressionComparisonOperator,
  value: boolean | number,
): CsfloatBuyOrderExpressionRule {
  validateOperator(field, operator);

  return {
    field,
    operator,
    value: {
      constant: normalizeConstantValue(field, value),
    },
  };
}

function buildStickerRule(
  stickerId: number,
  options: Omit<CsfloatBuyOrderExpressionStickerValue, "id"> = {},
): CsfloatBuyOrderExpressionRule {
  const sticker = {
    id: stickerId,
    ...(options.qty === undefined ? {} : { qty: options.qty }),
    ...(options.slot === undefined ? {} : { slot: options.slot }),
  };

  validateStickerValue(sticker);

  return {
    field: "Stickers",
    operator: "has",
    value: {
      sticker,
    },
  };
}

function validateGroup(group: CsfloatBuyOrderExpressionGroup): void {
  if (!CSFLOAT_BUY_ORDER_GROUP_CONDITIONS.includes(group.condition)) {
    throw new CsfloatSdkError(
      `condition must be one of ${CSFLOAT_BUY_ORDER_GROUP_CONDITIONS.join(", ")}`,
    );
  }

  for (const rule of group.rules) {
    if ("expression" in rule) {
      validateGroup(rule.expression);
      continue;
    }

    validateOperator(rule.field, rule.operator);

    if (rule.field === "Stickers") {
      if (!rule.value.sticker) {
        throw new CsfloatSdkError("sticker rules require a sticker payload");
      }

      validateStickerValue(rule.value.sticker);
      continue;
    }

    if (rule.value.constant === undefined) {
      throw new CsfloatSdkError(`${rule.field} rules require a constant value`);
    }
  }
}

function validateRequestOptions(
  options: CsfloatSingleSkinBuyOrderRequestOptions,
): void {
  assertInteger("max_price", options.max_price, 1);
  assertOptionalInteger("quantity", options.quantity, 1);
}

export class CsfloatBuyOrderExpressionBuilder {
  private readonly group: CsfloatBuyOrderExpressionGroup;

  constructor(condition: CsfloatBuyOrderExpressionCondition = "and") {
    this.group = {
      condition,
      rules: [],
    };
  }

  addRule(
    field: CsfloatBuyOrderComparableField,
    operator: CsfloatBuyOrderExpressionComparisonOperator,
    value: boolean | number,
  ): this {
    this.group.rules.push(buildConstantRule(field, operator, value));
    return this;
  }

  addStickerRule(
    stickerId: number,
    options: Omit<CsfloatBuyOrderExpressionStickerValue, "id"> = {},
  ): this {
    this.group.rules.push(buildStickerRule(stickerId, options));
    return this;
  }

  addGroup(
    condition: CsfloatBuyOrderExpressionCondition,
    build: (builder: CsfloatBuyOrderExpressionBuilder) => void,
  ): this {
    const nested = new CsfloatBuyOrderExpressionBuilder(condition);
    build(nested);
    this.group.rules.push({
      expression: nested.build(),
    });
    return this;
  }

  build(): CsfloatBuyOrderExpressionGroup {
    const expression = cloneGroup(this.group);
    validateGroup(expression);
    return expression;
  }
}

export function buildExpressionBuyOrderRequest(
  expression: CsfloatBuyOrderExpressionGroup,
  options: {
    max_price: number;
    quantity?: number;
  },
): CsfloatCreateExpressionBuyOrderRequest {
  const normalizedExpression = cloneGroup(expression);
  validateGroup(normalizedExpression);
  validateRequestOptions(options);

  return {
    expression: normalizedExpression,
    max_price: options.max_price,
    ...(options.quantity === undefined ? {} : { quantity: options.quantity }),
  };
}

export function buildSingleSkinBuyOrderExpression(
  defIndex: number,
  paintIndex: number,
  options: CsfloatSingleSkinBuyOrderExpressionOptions = {},
): CsfloatBuyOrderExpressionGroup {
  assertInteger("defIndex", defIndex, 0);
  assertInteger("paintIndex", paintIndex, 0);
  assertOptionalInteger("paint_seed", options.paint_seed, 0);
  assertOptionalInteger("rarity", options.rarity, 0);
  assertOptionalFloat("min_float", options.min_float);
  assertOptionalFloat("max_float", options.max_float);

  if (
    options.min_float !== undefined &&
    options.max_float !== undefined &&
    options.min_float > options.max_float
  ) {
    throw new CsfloatSdkError("min_float cannot be greater than max_float");
  }

  const builder = new CsfloatBuyOrderExpressionBuilder();
  builder.addRule("DefIndex", "==", defIndex);
  builder.addRule("PaintIndex", "==", paintIndex);

  if (options.stattrak !== undefined) {
    builder.addRule("StatTrak", "==", options.stattrak);
  }

  if (options.souvenir !== undefined) {
    builder.addRule("Souvenir", "==", options.souvenir);
  }

  if (options.rarity !== undefined) {
    builder.addRule("Rarity", "==", options.rarity);
  }

  if (options.paint_seed !== undefined) {
    builder.addRule("PaintSeed", "==", options.paint_seed);
  }

  if (options.min_float !== undefined) {
    builder.addRule("FloatValue", ">=", options.min_float);
  }

  if (options.max_float !== undefined) {
    builder.addRule("FloatValue", "<=", options.max_float);
  }

  return builder.build();
}

export function buildSingleSkinBuyOrderRequest(
  defIndex: number,
  paintIndex: number,
  options: CsfloatSingleSkinBuyOrderRequestOptions,
): CsfloatCreateExpressionBuyOrderRequest {
  return buildExpressionBuyOrderRequest(
    buildSingleSkinBuyOrderExpression(defIndex, paintIndex, options),
    options,
  );
}
