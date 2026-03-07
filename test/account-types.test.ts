import { describe, expect, it } from "vitest";

import type { CsfloatAuthenticatedUser } from "../src/types.js";

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
});
