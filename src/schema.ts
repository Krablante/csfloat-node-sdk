import type {
  CsfloatSchemaCollection,
  CsfloatSchemaHighlightReel,
  CsfloatSchemaMusicKit,
  CsfloatSchemaPaint,
  CsfloatSchemaRarity,
  CsfloatSchemaResponse,
  CsfloatSchemaScreenshotResponse,
  CsfloatSchemaWeapon,
} from "./types.js";

const CSFLOAT_PICS_BASE_URL = "https://csfloat.pics/";

export interface CsfloatSchemaRecordEntry<T> {
  key: string;
  value: T;
}

export interface CsfloatSchemaPaintMatch {
  weapon_key: string;
  weapon_name: string;
  paint_key: string;
  paint: CsfloatSchemaPaint;
}

export interface CsfloatScreenshotUrls {
  playside?: string;
  backside?: string;
}

function listRecordEntries<T>(
  record: Record<string, T> | undefined,
): CsfloatSchemaRecordEntry<T>[] {
  return Object.entries(record ?? {}).map(([key, value]) => ({
    key,
    value,
  }));
}

export function getSchemaCollection(
  schema: CsfloatSchemaResponse,
  key: string,
): CsfloatSchemaCollection | undefined {
  return schema.collections.find((collection) => collection.key === key);
}

export function getSchemaRarityByValue(
  schema: CsfloatSchemaResponse,
  value: number,
): CsfloatSchemaRarity | undefined {
  return schema.rarities.find((rarity) => rarity.value === value);
}

export function getSchemaWeapon(
  schema: CsfloatSchemaResponse,
  defIndex: number | string,
): CsfloatSchemaWeapon | undefined {
  return schema.weapons[String(defIndex)];
}

export function getSchemaPaint(
  schema: CsfloatSchemaResponse,
  defIndex: number | string,
  paintIndex: number | string,
): CsfloatSchemaPaint | undefined {
  return getSchemaWeapon(schema, defIndex)?.paints[String(paintIndex)];
}

export function listSchemaWeapons(
  schema: CsfloatSchemaResponse,
): CsfloatSchemaRecordEntry<CsfloatSchemaWeapon>[] {
  return listRecordEntries(schema.weapons);
}

export function listSchemaPaints(
  schema: CsfloatSchemaResponse,
  defIndex: number | string,
): CsfloatSchemaRecordEntry<CsfloatSchemaPaint>[] {
  return listRecordEntries(getSchemaWeapon(schema, defIndex)?.paints);
}

export function listSchemaMusicKits(
  schema: CsfloatSchemaResponse,
): CsfloatSchemaRecordEntry<CsfloatSchemaMusicKit>[] {
  return listRecordEntries(schema.music_kits);
}

export function listSchemaHighlightReels(
  schema: CsfloatSchemaResponse,
): CsfloatSchemaRecordEntry<CsfloatSchemaHighlightReel>[] {
  return listRecordEntries(schema.highlight_reels);
}

export function findSchemaPaintsByIndex(
  schema: CsfloatSchemaResponse,
  paintIndex: number | string,
): CsfloatSchemaPaintMatch[] {
  const target = String(paintIndex);
  const matches: CsfloatSchemaPaintMatch[] = [];

  for (const [weaponKey, weapon] of Object.entries(schema.weapons)) {
    const paint = weapon.paints[target];
    if (!paint) {
      continue;
    }

    matches.push({
      weapon_key: weaponKey,
      weapon_name: weapon.name,
      paint_key: target,
      paint,
    });
  }

  return matches;
}

export function toCsfloatScreenshotUrl(path: string): string {
  return new URL(path.replace(/^\/+/, ""), CSFLOAT_PICS_BASE_URL).toString();
}

export function getCsfloatScreenshotUrls(
  screenshot: CsfloatSchemaScreenshotResponse,
): CsfloatScreenshotUrls {
  const playsidePath = screenshot.sides?.playside?.path;
  const backsidePath = screenshot.sides?.backside?.path;

  return {
    ...(playsidePath ? { playside: toCsfloatScreenshotUrl(playsidePath) } : {}),
    ...(backsidePath ? { backside: toCsfloatScreenshotUrl(backsidePath) } : {}),
  };
}
