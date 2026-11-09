import { UNIVERSE_KART_IDENTITIES_A, CHARACTER_KART_IDENTITIES_A } from './kartIdentityCatalogA.js';
import { UNIVERSE_KART_IDENTITIES_B, CHARACTER_KART_IDENTITIES_B } from './kartIdentityCatalogB.js';

/**
 * A vehicle reference is a design decision, never a character-role fallback.
 * Each registered universe has an explicit silhouette and readable ornaments.
 * A canonical vehicle is condensed into a one-seat racing adaptation; invented
 * vehicles are labelled as such rather than being presented as source canon.
 */
export const KART_IDENTITY_VERSION = 'universe-vehicles-v2';

const nexus = (label, model, motifs, recognition, extra = {}) => ({
  label, model, motifs, recognition,
  sourceKind: 'original-universe-design', referenceVehicle: null, sourceUrls: [],
  rationale: 'Véhicule de course original construit à partir du métier, de la silhouette et des accessoires du personnage du Nexus.',
  ...extra
});

const NEXUS_CHARACTER_IDENTITIES = {
  player_anchor: nexus('Balise d’Ancre', 'suture', ['antenna', 'runes', 'suture'], ['Plateforme de convergence', 'Balise dressée', 'Ligatures de lumière cyan']),
  arca_mirelle: nexus('Disque de Suture', 'suture-disc', ['cards', 'suture'], ['Disque noir et or', 'Garde-corps circulaire', 'Cartes holographiques cyan'], {
    color: '#17272a', accent: '#d5a342', detailColor: '#71e9f2', width: 1.55, wheelbase: 2.08,
    referenceAsset: '/sprites/generated/heroes/nexus-de-convergence/arca-mirelle-complete/arca-mirelle-kart-directions.png',
    rationale: 'Conservation du disque déjà dessiné pour Mirelle : le véhicule et ses cartes sont la référence existante du projet.'
  }),
  arca_bastion: nexus('Relève du Rempart', 'tank', ['shield', 'armor'], ['Plaques de rempart', 'Écu frontal', 'Train roulant protégé']),
  arca_nova: nexus('Battement de Nova', 'clockwork', ['clock', 'electric'], ['Anneau chronométrique', 'Mécanisme de chronomancie', 'Arcs de pulsation']),
  arca_marrow: nexus('Crochet de Marrow', 'buggy', ['chains', 'tools'], ['Châssis de récupération', 'Chaînes de remorquage', 'Outillage de ferrailleur']),
  arca_sable: nexus('Route d’Orison', 'jeep', ['scrolls', 'lanterns'], ['Train de reconnaissance', 'Cartes roulées de voyage', 'Lanternes de route']),
  arca_loom: nexus('Relais d’Ivara', 'apc', ['circuit', 'antenna'], ['Coque de relais blindée', 'Antenne de liaison', 'Pistes de signal lumineuses']),
  arca_tessera: nexus('Fenêtre de Tessera', 'crystal', ['crystals', 'gate-ring'], ['Facettes de miroir', 'Fenêtre de passage', 'Éclats de verre en périphérie']),
  arca_quillon: nexus('Pompe de Rusk', 'truck', ['tanks', 'pipes'], ['Réservoirs de pression', 'Pompe et tuyauterie', 'Plateau industriel']),
  arca_nadir: nexus('Sonde de Nadir', 'lab-pod', ['radar', 'crystals'], ['Capsule de sondage', 'Antenne parabolique', 'Cristaux de mesure']),
  arca_elyra: nexus('Prisme d’Elyra', 'crystal', ['gems', 'books'], ['Prisme central', 'Sertissages de cristal', 'Archives fixées aux flancs']),
  arca_oryn: nexus('Serment d’Oryn', 'reliquary', ['swords', 'shield'], ['Reliquaire d’acier', 'Lames de serment', 'Bouclier de garde'])
};

export const UNIVERSE_KART_IDENTITIES = Object.freeze({
  ...UNIVERSE_KART_IDENTITIES_A, ...UNIVERSE_KART_IDENTITIES_B
});

export const CHARACTER_KART_IDENTITIES = Object.freeze({
  ...CHARACTER_KART_IDENTITIES_A, ...CHARACTER_KART_IDENTITIES_B,
  ...NEXUS_CHARACTER_IDENTITIES
});

const modelSizes = {
  warthog: [2.18, 1.84, 0.38], narcissus: [2.04, 1.72, 0.27], ghost: [2.08, 1.72, 0.27],
  banshee: [2.04, 1.74, 0.27], mako: [2.18, 1.84, 0.35], 'x-wing': [2.15, 1.68, 0.28],
  'tie-fighter': [1.9, 1.7, 0.28], falcon: [1.86, 1.76, 0.28], 'puddle-jumper': [2.0, 1.68, 0.28],
  lightcycle: [2.12, 1.35, 0.33], motorbike: [2.12, 1.35, 0.33],
  tank: [2.0, 1.88, 0.35], apc: [2.15, 1.84, 0.36], truck: [2.16, 1.82, 0.35],
  ship: [2.08, 1.68, 0.29], submarine: [2.1, 1.6, 0.29], biplane: [2.06, 1.64, 0.29],
  carriage: [1.94, 1.74, 0.35], wagon: [1.94, 1.74, 0.35], stage: [2.0, 1.8, 0.32]
};

const webUrls = values => [...new Set(values.filter(value => typeof value === 'string' && /^https?:\/\//.test(value)))];

/** Null is intentional: a newly added universe must receive a design entry. */
export function getKartVehicleIdentity(hero) {
  if (!hero?.id || !hero.universe) return null;
  const universeDesign = UNIVERSE_KART_IDENTITIES[hero.universe];
  const characterDesign = CHARACTER_KART_IDENTITIES[hero.id];
  if (!universeDesign && !characterDesign) return null;
  const design = { ...universeDesign, ...characterDesign };
  // Structural variants belong to a particular body. A character replacing
  // a duel disk with a dragon must not inherit the disk's geometry modifier.
  if (characterDesign?.model && characterDesign.model !== universeDesign?.model
    && !Object.hasOwn(characterDesign, 'variant')) design.variant = null;
  const [wheelbase, width, wheelRadius] = modelSizes[design.model] || [2.0, 1.68, 0.32];
  const vehicleUrls = webUrls([...(universeDesign?.sourceUrls || []), ...(characterDesign?.sourceUrls || [])]);
  const sourceUrls = webUrls([
    ...vehicleUrls,
    hero.referenceUrl, ...(hero.referenceUrls || [])
  ]);
  return Object.freeze({
    ...design,
    id: `kart-design:${characterDesign ? hero.id : hero.universe}`,
    designScope: characterDesign ? 'character-specific' : 'universe-shared',
    sourceIncarnation: hero.incarnation || '',
    sourceAnchor: hero.visualAnchor || '',
    motifs: Object.freeze([...new Set(design.motifs || [])]),
    recognition: Object.freeze([...(design.recognition || [])]),
    sourceUrls: Object.freeze(sourceUrls),
    referenceScope: vehicleUrls.length ? 'vehicle-and-universe-references' : 'existing-universe-anchor',
    dimensions: Object.freeze({
      wheelbase: design.wheelbase || wheelbase, width: design.width || width,
      wheelRadius: design.wheelRadius || wheelRadius, nose: design.nose || 0.78, fin: design.fin || 0.4
    }),
    adaptation: 'Single-seat racing proportions and open cockpit; source silhouette and visual cues retained.',
    reviewStatus: 'recognizable-adaptation-awaiting-individual-visual-review',
    modelVersion: KART_IDENTITY_VERSION
  });
}
