import { createClient } from "@sanity/client";

const EFFECTS = new Set([
  "relax",
  "energy",
  "creative",
  "sleep",
  "euphoria",
  "focus",
  "happy",
  "uplifted",
  "talkative",
  "hungry",
]);

const TERPENES = new Set([
  "Myrcene",
  "Caryophyllene",
  "Limonene",
  "Pinene",
  "Terpinolene",
  "Ocimene",
  "Linalool",
  "Humulene",
  "Nerolidol",
  "Bisabolol",
  "Fenchol",
]);

function normalizeTerpeneName(raw) {
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  if (!value) return null;
  const titleCase = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  return TERPENES.has(titleCase) ? titleCase : value;
}

function createEffectPatch(doc) {
  if (Array.isArray(doc.effects) && doc.effects.length > 0) return null;
  if (!doc.effect || !EFFECTS.has(doc.effect)) return null;
  return [{ key: doc.effect, amount: 3 }];
}

function createTerpenePatch(doc) {
  if (Array.isArray(doc.terpeneProfile) && doc.terpeneProfile.length > 0) return null;
  if (!Array.isArray(doc.terpenes) || doc.terpenes.length === 0) return null;

  const deduped = [];
  const seen = new Set();
  for (const terpene of doc.terpenes) {
    const normalized = normalizeTerpeneName(terpene);
    if (!normalized) continue;
    const dedupeKey = normalized.toLowerCase();
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    deduped.push({ name: normalized, amount: 0 });
  }

  return deduped.length > 0 ? deduped : null;
}

async function run() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "77odgngy";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_WRITE_TOKEN;
  const dryRun = process.argv.includes("--dry-run");
  const cleanupLegacy = process.argv.includes("--cleanup-legacy");

  if (!token && !dryRun) {
    console.error("Missing SANITY_WRITE_TOKEN. Use --dry-run for preview without writes.");
    process.exit(1);
  }

  const client = createClient({
    projectId,
    dataset,
    token,
    useCdn: false,
    apiVersion: "2024-01-01",
  });

  const docs = await client.fetch(
    `*[_type == "strain"]{
      _id,
      effect,
      effects,
      terpenes,
      terpeneProfile
    }`
  );

  let planned = 0;
  let updated = 0;

  for (const doc of docs) {
    const effects = createEffectPatch(doc);
    const terpeneProfile = createTerpenePatch(doc);
    const finalEffects = effects || (Array.isArray(doc.effects) && doc.effects.length > 0 ? doc.effects : null);
    const finalTerpeneProfile =
      terpeneProfile ||
      (Array.isArray(doc.terpeneProfile) && doc.terpeneProfile.length > 0 ? doc.terpeneProfile : null);
    const shouldUnsetLegacyEffect = cleanupLegacy && finalEffects && doc.effect;
    const shouldUnsetLegacyTerpenes = cleanupLegacy && finalTerpeneProfile && Array.isArray(doc.terpenes) && doc.terpenes.length > 0;

    if (!effects && !terpeneProfile && !shouldUnsetLegacyEffect && !shouldUnsetLegacyTerpenes) {
      continue;
    }

    planned += 1;

    if (dryRun) {
      console.log(
        `[DRY] ${doc._id}:` +
          `${effects ? " set effects" : ""}` +
          `${terpeneProfile ? " set terpeneProfile" : ""}` +
          `${shouldUnsetLegacyEffect ? " unset effect" : ""}` +
          `${shouldUnsetLegacyTerpenes ? " unset terpenes" : ""}`
      );
      continue;
    }

    const patch = client.patch(doc._id);
    if (effects) patch.set({ effects });
    if (terpeneProfile) patch.set({ terpeneProfile });
    if (shouldUnsetLegacyEffect || shouldUnsetLegacyTerpenes) {
      const fieldsToUnset = [];
      if (shouldUnsetLegacyEffect) fieldsToUnset.push("effect");
      if (shouldUnsetLegacyTerpenes) fieldsToUnset.push("terpenes");
      patch.unset(fieldsToUnset);
    }
    await patch.commit();

    updated += 1;
    console.log(`[OK] ${doc._id}`);
  }

  console.log(
    `Done. Planned: ${planned}. Updated: ${dryRun ? 0 : updated}. Dry-run: ${dryRun}. Cleanup legacy: ${cleanupLegacy}`
  );
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
