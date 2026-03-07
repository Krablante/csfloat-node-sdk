import { describe, expect, it } from "vitest";

import type {
  CsfloatAuthenticatedUser,
  CsfloatBuyOrder,
  CsfloatMeResponse,
  CsfloatTransaction,
} from "../src/types.js";

describe("authenticated user typing", () => {
  it("accepts the currently observed me preference fields", () => {
    const user: CsfloatAuthenticatedUser = {
      notification_topic_opt_out: 0,
      preferences: {
        offers_enabled: true,
        max_offer_discount: 500,
        localize_item_names: false,
      },
    };

    expect(user.notification_topic_opt_out).toBe(0);
    expect(user.preferences?.localize_item_names).toBe(false);
  });

  it("accepts the currently observed temporary buy-order create fields", () => {
    const order: CsfloatBuyOrder = {
      id: "950515079802127604",
      created_at: "0001-01-01T00:00:00Z",
      market_hash_name: "AWP | Dragon Lore (Factory New)",
      qty: 1,
      price: 1,
      bought_item_count: 0,
    };

    expect(order.bought_item_count).toBe(0);
  });

  it("accepts the currently observed me response top-level fields", () => {
    const me: CsfloatMeResponse = {
      user: {
        steam_id: "76561198771627775",
      },
      pending_offers: 0,
      actionable_trades: 0,
      has_unread_notifications: false,
    };

    expect(me.pending_offers).toBe(0);
    expect(me.has_unread_notifications).toBe(false);
  });

  it("accepts the currently observed transaction detail fields", () => {
    const tx: CsfloatTransaction = {
      type: "trade_verified",
      details: {
        contract_id: "943453865930525327",
        trade_id: "947526657940522192",
        type: "buyer_ping",
        reason: "sample",
        fee_amount: 12,
        bid_id: "1",
        listing_id: "2",
        original_tx: "3",
      },
    };

    expect(tx.details?.trade_id).toBe("947526657940522192");
    expect(tx.details?.fee_amount).toBe(12);
  });
});
