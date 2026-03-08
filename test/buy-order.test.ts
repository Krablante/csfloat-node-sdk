import { describe, expect, it } from "vitest";

import {
  buildExpressionBuyOrderRequest,
  buildSingleSkinBuyOrderExpression,
  buildSingleSkinBuyOrderRequest,
  CsfloatBuyOrderExpressionBuilder,
  CSFLOAT_BUY_ORDER_COMPARISON_OPERATORS,
  CSFLOAT_BUY_ORDER_EXPRESSION_FIELDS,
  CSFLOAT_BUY_ORDER_GROUP_CONDITIONS,
  CSFLOAT_BUY_ORDER_OPERATORS,
} from "../src/buy-order.js";
import { CsfloatSdkError } from "../src/errors.js";

describe("buy-order helpers", () => {
  it("exposes the stable expression enums", () => {
    expect(CSFLOAT_BUY_ORDER_GROUP_CONDITIONS).toEqual(["and", "or"]);
    expect(CSFLOAT_BUY_ORDER_COMPARISON_OPERATORS).toEqual([
      "==",
      ">",
      ">=",
      "<",
      "<=",
    ]);
    expect(CSFLOAT_BUY_ORDER_OPERATORS).toEqual([
      "==",
      ">",
      ">=",
      "<",
      "<=",
      "has",
    ]);
    expect(CSFLOAT_BUY_ORDER_EXPRESSION_FIELDS).toEqual([
      "FloatValue",
      "Stickers",
      "PaintSeed",
      "StatTrak",
      "Souvenir",
      "Rarity",
      "DefIndex",
      "PaintIndex",
    ]);
  });

  it("builds buy-order expressions with nested groups", () => {
    const expression = new CsfloatBuyOrderExpressionBuilder()
      .addRule("DefIndex", "==", 7)
      .addRule("PaintIndex", "==", 72)
      .addGroup("or", (builder) => {
        builder
          .addRule("StatTrak", "==", false)
          .addRule("Souvenir", "==", false);
      })
      .build();

    expect(expression).toEqual({
      condition: "and",
      rules: [
        {
          field: "DefIndex",
          operator: "==",
          value: { constant: "7" },
        },
        {
          field: "PaintIndex",
          operator: "==",
          value: { constant: "72" },
        },
        {
          expression: {
            condition: "or",
            rules: [
              {
                field: "StatTrak",
                operator: "==",
                value: { constant: "false" },
              },
              {
                field: "Souvenir",
                operator: "==",
                value: { constant: "false" },
              },
            ],
          },
        },
      ],
    });
  });

  it("builds sticker rules", () => {
    const expression = new CsfloatBuyOrderExpressionBuilder()
      .addRule("DefIndex", "==", 7)
      .addRule("PaintIndex", "==", 72)
      .addStickerRule(3, { qty: 2 })
      .build();

    expect(expression.rules[2]).toEqual({
      field: "Stickers",
      operator: "has",
      value: {
        sticker: {
          id: 3,
          qty: 2,
        },
      },
    });
  });

  it("builds single-skin expression helpers", () => {
    expect(
      buildSingleSkinBuyOrderExpression(7, 72, {
        min_float: 0.06,
        max_float: 0.15,
        paint_seed: 611,
        stattrak: false,
        souvenir: false,
        rarity: 2,
      }),
    ).toEqual({
      condition: "and",
      rules: [
        {
          field: "DefIndex",
          operator: "==",
          value: { constant: "7" },
        },
        {
          field: "PaintIndex",
          operator: "==",
          value: { constant: "72" },
        },
        {
          field: "StatTrak",
          operator: "==",
          value: { constant: "false" },
        },
        {
          field: "Souvenir",
          operator: "==",
          value: { constant: "false" },
        },
        {
          field: "Rarity",
          operator: "==",
          value: { constant: "2" },
        },
        {
          field: "PaintSeed",
          operator: "==",
          value: { constant: "611" },
        },
        {
          field: "FloatValue",
          operator: ">=",
          value: { constant: "0.06" },
        },
        {
          field: "FloatValue",
          operator: "<=",
          value: { constant: "0.15" },
        },
      ],
    });
  });

  it("builds expression-backed buy-order requests", () => {
    const expression = buildSingleSkinBuyOrderExpression(7, 72, {
      stattrak: false,
    });
    const request = buildExpressionBuyOrderRequest(expression, {
      max_price: 3,
      quantity: 1,
    });

    expect(request).toEqual({
      expression,
      max_price: 3,
      quantity: 1,
    });
  });

  it("builds single-skin buy-order requests", () => {
    expect(
      buildSingleSkinBuyOrderRequest(7, 72, {
        max_price: 3,
        quantity: 1,
        stattrak: false,
        souvenir: false,
      }),
    ).toEqual({
      expression: {
        condition: "and",
        rules: [
          {
            field: "DefIndex",
            operator: "==",
            value: { constant: "7" },
          },
          {
            field: "PaintIndex",
            operator: "==",
            value: { constant: "72" },
          },
          {
            field: "StatTrak",
            operator: "==",
            value: { constant: "false" },
          },
          {
            field: "Souvenir",
            operator: "==",
            value: { constant: "false" },
          },
        ],
      },
      max_price: 3,
      quantity: 1,
    });
  });

  it("rejects invalid expression inputs", () => {
    expect(() => new CsfloatBuyOrderExpressionBuilder().addRule("StatTrak", "==", 1)).toThrow(
      CsfloatSdkError,
    );
    expect(() =>
      new CsfloatBuyOrderExpressionBuilder().addStickerRule(3, {
        qty: 1,
        slot: 2,
      }),
    ).toThrow(CsfloatSdkError);
    expect(() =>
      buildSingleSkinBuyOrderExpression(7, 72, {
        min_float: 0.2,
        max_float: 0.1,
      }),
    ).toThrow(CsfloatSdkError);
    expect(() =>
      buildSingleSkinBuyOrderRequest(7, 72, {
        max_price: 0,
      }),
    ).toThrow(CsfloatSdkError);
  });
});
