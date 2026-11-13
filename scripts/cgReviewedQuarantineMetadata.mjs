import { getReviewedQuarantinedHeroSprite } from '../src/game/spriteAssets.js';
import { getQuarantinedCanonSprite, QUARANTINED_CANON_SPRITES } from '../src/game/canonicalSpriteQuarantine.js';

// The resolver helper validates the actual registered candidate against the
// reviewed identity, source hashes, frame grid, baseline and per-row scale.
// This projection records that selection; it does not approve new artwork.
export function getCgReviewedQuarantineSprite(hero, selectedSprite) {
  const correction = getReviewedQuarantinedHeroSprite(hero);
  if (!correction || selectedSprite !== correction.sheet) return null;
  return {
    path: correction.sheet, sha256: correction.sha256,
    sourceImageSha256: correction.sourceImageSha256, sourceWork: correction.sourceWork,
    incarnation: correction.incarnation, review: correction.review,
    status: 'corrected-sprite-reviewed-with-source-limitations',
    selectedInRuntime: true, archivalOnly: false, runtimeEligible: true,
    visualFidelityApproved: false, canonicalFidelityApproved: false, fullSource1to1Verified: false,
    selectionScope: 'Exact reviewed resolver selection; media loading and artistic coverage have separate evidence.',
    evidenceFile: 'docs/assets/p0-p1-p2-continuation-2026-11-13/p0-lot-004/source-reference.json'
  };
}

export function getCgQuarantineVisualFlags(path, quarantine, correction) {
  if (!quarantine) return {};
  if (correction && correction.path === path) return { ...correction };
  return { archivalOnly: true, selectedInRuntime: false, runtimeEligible: false,
    status: 'OLD-quarantined-project-art-not-current-or-canon-reference', quarantineReason: quarantine.reason };
}

export function getCgQuarantineSelectionMessage(quarantine, correction) {
  return correction
    ? `L’ancien sprite reste en quarantaine (${quarantine.reason}); seul le correctif précisément revu est sélectionné. Les autres états/présentations et la fidélité artistique complète restent à vérifier.`
    : `Sprite runtime en quarantaine (${quarantine.reason}); les anciens bitmaps restent OLD, sans sélection runtime ni qualification de source.`;
}

export const KOTOR_I_CG_MIDGROUND = 'Matériaux, objets fixes et échelle à relever dans KOTOR I, dans le contexte de la Forge Stellaire; aucune architecture Episode IV transférée. Garder la silhouette du personnage entièrement lisible.';

// A factual source-place correction is separate from the bitmap exception.
// The plot reference establishes the Star Forge, not its visual reconstruction.
export function getCgQuarantineWorldScope(hero) {
  if (hero?.id !== 'darth_revan' || getQuarantinedCanonSprite(hero) !== QUARANTINED_CANON_SPRITES.darth_revan
      || [hero.sourceHeroId, hero.sourceId].some(id => id !== undefined && id !== '' && id !== hero.id)) return null;
  const location = 'Forge Stellaire, Star Wars: Knights of the Old Republic (2003), contexte de la voie du côté obscur; composition originale à comparer au jeu.';
  return {
    referenceUrl: 'https://en.wikipedia.org/wiki/Star_Wars:_Knights_of_the_Old_Republic_(video_game)',
    evidenceFile: 'docs/assets/p0-p1-p2-continuation-2026-11-13/cg-runtime-correction/world-reference-wikipedia.json',
    world: { sourceWork: 'Star Wars: Knights of the Old Republic (2003)', period: hero.incarnation,
      locations: [location], architecture: [], palette: [], props: [],
      boundaries: ['Le lieu et son rôle dans le scénario sont documentés par un résumé public; aucune image indépendante de ce décor n’est qualifiée ici.',
        'Architecture, matières, palette et objets fixes de la Forge Stellaire restent à relever dans KOTOR I avant génération.',
        'La tranchée de l’Étoile de la Mort, le TIE Advanced de Vador et les X-wing de la bataille de Yavin appartiennent au dossier Episode IV partagé, pas à cette incarnation KOTOR I.'] },
    sourceContext: { sourceWork: 'Star Wars: Knights of the Old Republic (2003)',
      visualDetails: 'Architecture, matières, palette et objets à comparer aux images du jeu; le résumé textuel du scénario ne qualifie pas ces détails.' }
  };
}
