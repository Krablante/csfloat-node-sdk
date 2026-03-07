import { describe, expect, it } from "vitest";

import type { CsfloatAuthenticatedUser, CsfloatBuyOrder } from "../src/types.js";

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
});
