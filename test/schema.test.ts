import { describe, expect, it } from "vitest";

import {
  findSchemaPaintsByIndex,
  getCsfloatScreenshotUrls,
  getSchemaCollection,
  getSchemaPaint,
  getSchemaRarityByValue,
  getSchemaWeapon,
  listSchemaHighlightReels,
  listSchemaMusicKits,
  listSchemaPaints,
  listSchemaWeapons,
  toCsfloatScreenshotUrl,
} from "../src/schema.js";
import type { CsfloatSchemaResponse, CsfloatSchemaScreenshotResponse } from "../src/types.js";

const schema: CsfloatSchemaResponse = {
  collections: [
    { key: "set_cobblestone", name: "The Cobblestone Collection", has_souvenir: true },
  ],
  rarities: [
    { key: "covert", name: "Covert", value: 6 },
  ],
  stickers: {},
  keychains: {},
  collectibles: {},
  containers: {},
  agents: {
    "4613": {
      market_hash_name: "Agent Ava",
      image: "agent.png",
      rarity: 4,
      price: 1234,
      faction: "t",
    },
  },
  custom_stickers: {},
  music_kits: {
    "3": {
      market_hash_name: "Music Kit | Daniel Sadowski, Crimson Assault",
      rarity: 3,
      image: "music.png",
      normal_price: 100,
      stattrak_price: 200,
    },
  },
  weapons: {
    "7": {
      name: "AK-47",
      type: "Rifle",
      faction: "t",
      sticker_amount: 4,
      paints: {
        "282": {
          index: 282,
          name: "Redline",
          max: 0.7,
          min: 0.1,
          rarity: 4,
          collection: "set_phoenix",
          image: "redline.png",
          normal_prices: [1, 2],
          normal_volume: [3, 4],
        },
      },
    },
  },
  highlight_reels: {
    "1": {
      market_hash_name: "Souvenir Charm | Austin 2025 Highlight | chopper Double Kill",
      image: "highlight.png",
      keychain_index: 1,
    },
  },
};

const screenshot: CsfloatSchemaScreenshotResponse = {
  id: "1305328935500910839",
  sides: {
    playside: { path: "m/1305328935500910839/playside.png" },
    backside: { path: "m/1305328935500910839/backside.png" },
  },
};

describe("schema helpers", () => {
  it("resolves collections and rarities", () => {
    expect(getSchemaCollection(schema, "set_cobblestone")?.name).toBe(
      "The Cobblestone Collection",
    );
    expect(getSchemaRarityByValue(schema, 6)?.name).toBe("Covert");
    expect(schema.agents["4613"]?.faction).toBe("t");
  });

  it("resolves weapons and paints by live API keys", () => {
    expect(getSchemaWeapon(schema, 7)?.name).toBe("AK-47");
    expect(getSchemaWeapon(schema, 7)?.faction).toBe("t");
    expect(getSchemaPaint(schema, 7, 282)?.name).toBe("Redline");
  });

  it("lists keyed schema records", () => {
    expect(listSchemaWeapons(schema)).toEqual([
      {
        key: "7",
        value: schema.weapons["7"],
      },
    ]);
    expect(listSchemaPaints(schema, 7)).toEqual([
      {
        key: "282",
        value: schema.weapons["7"]!.paints["282"]!,
      },
    ]);
    expect(listSchemaMusicKits(schema)).toEqual([
      {
        key: "3",
        value: schema.music_kits["3"]!,
      },
    ]);
    expect(listSchemaHighlightReels(schema)).toEqual([
      {
        key: "1",
        value: schema.highlight_reels!["1"]!,
      },
    ]);
  });

  it("finds paint matches by paint index across weapons", () => {
    expect(findSchemaPaintsByIndex(schema, 282)).toEqual([
      {
        weapon_key: "7",
        weapon_name: "AK-47",
        paint_key: "282",
        paint: schema.weapons["7"]!.paints["282"]!,
      },
    ]);
  });

  it("builds absolute screenshot urls from relative screenshot paths", () => {
    expect(toCsfloatScreenshotUrl("m/1305328935500910839/playside.png")).toBe(
      "https://csfloat.pics/m/1305328935500910839/playside.png",
    );
    expect(getCsfloatScreenshotUrls(screenshot)).toEqual({
      playside: "https://csfloat.pics/m/1305328935500910839/playside.png",
      backside: "https://csfloat.pics/m/1305328935500910839/backside.png",
    });
  });
});
