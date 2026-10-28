// Artwork records only. These four reference designs do not declare combat kits,
// unlock rewards, an invented Cloud Meadow campaign, or source-game animations.
export const CLOUD_MEADOW_UNIVERSE = 'Cloud Meadow';
export const CLOUD_MEADOW_REVIEW_PATH = '/reviews/cloud-meadow/index.html';
export const CLOUD_MEADOW_REFERENCE_SRC = '/reviews/cloud-meadow/reference.png';

export const CLOUD_MEADOW_STATIC_LAYOUT = Object.freeze({
  columns: 1,
  rows: 1,
  fullBodyPortrait: true,
  rowByState: Object.freeze({
    idle: 0, run: 0, attack: 0, defense: 0, support: 0, special: 0,
    hit: 0, dead: 0, jump: 0, fall: 0, reload: 0
  })
});

const assetBase = '/sprites/generated/heroes/cloud-meadow/';
const artwork = ({
  id, name, englishName = name, file, kind, referenceRegion, relativeHeight, traits, description,
  fidelityStatus = 'reference-based-generated',
  fidelityNote = {
    fr: 'Recréation générée d’après la référence fournie. Il ne s’agit pas du fichier original ni d’une copie exacte pixel par pixel.',
    en: 'Generated recreation based on the supplied reference. This is not the original file or an exact pixel-for-pixel copy.'
  }
}) => Object.freeze({
  id,
  name,
  displayName: Object.freeze({ fr: name, en: englishName }),
  universe: CLOUD_MEADOW_UNIVERSE,
  kind,
  src: `${assetBase}${file}`,
  referenceSrc: CLOUD_MEADOW_REFERENCE_SRC,
  referenceRegion,
  // Approximate relationship measured in the supplied sheet, not a canon height.
  referenceRelativeHeight: relativeHeight,
  provenance: 'generated-from-user-reference',
  fidelityStatus,
  fidelityNote: Object.freeze(fidelityNote),
  canonicalFidelityApproved: false,
  animationFrames: 1,
  animationStatus: 'static-reference-pose',
  traits: Object.freeze(traits),
  description: Object.freeze(description)
});

export const CLOUD_MEADOW_CHARACTERS = Object.freeze([
  artwork({
    id: 'cloud_meadow_eve', name: 'Eve', file: 'eve-reference.png', kind: 'human',
    referenceRegion: 'upper-left-female-farmer', relativeHeight: 1,
    traits: ['auburn-bob', 'indigo-bib-overalls', 'dark-short-sleeved-shirt', 'brown-gloves', 'black-tall-boots', 'raised-two-finger-gesture'],
    description: {
      fr: 'Carré auburn, salopette indigo, gants bruns et bottes noires. Une main sur la hanche, deux doigts levés.',
      en: 'Auburn bob, indigo overalls, brown gloves and black boots. One hand on her hip, two fingers raised.'
    }
  }),
  artwork({
    id: 'cloud_meadow_evan', name: 'Evan', file: 'evan-reference.png', kind: 'human',
    referenceRegion: 'upper-left-male-farmer', relativeHeight: 1.04,
    traits: ['tousled-auburn-hair', 'indigo-bib-overalls', 'dark-short-sleeved-shirt', 'brown-gloves', 'black-tall-boots', 'raised-fist'],
    description: {
      fr: 'Cheveux auburn ébouriffés, salopette indigo, gants bruns et bottes noires. Un poing relevé près de l’épaule.',
      en: 'Tousled auburn hair, indigo overalls, brown gloves and black boots. One fist raised beside his shoulder.'
    }
  }),
  artwork({
    id: 'cloud_meadow_dragon_female', name: 'Dragon femelle', englishName: 'Female Dragon',
    file: 'dragon-female-adapted.png', kind: 'dragon',
    fidelityStatus: 'adapted-coverage',
    fidelityNote: {
      fr: 'Adaptation : couverture d’écailles opaque ajoutée sur le buste et le bassin. Ce visuel n’est pas une reproduction 1:1.',
      en: 'Adaptation: opaque scale coverage added over the chest and pelvis. This image is not a 1:1 reproduction.'
    },
    referenceRegion: 'upper-right-dragon', relativeHeight: 1.8,
    traits: ['long-neck', 'swept-back-horns', 'magenta-eyes', 'charcoal-scales', 'peach-underside', 'red-angular-markings', 'no-wings', 'long-looped-hollow-tip-tail'],
    description: {
      fr: 'Silhouette élancée, long cou, cornes vers l’arrière et écailles anthracite. La longue queue forme une boucle et se termine par une ouverture tubulaire.',
      en: 'Slender silhouette, long neck, swept-back horns and charcoal scales. Her long tail loops upward and ends in a hollow tube.'
    }
  }),
  artwork({
    id: 'cloud_meadow_dragon_male', name: 'Dragon mâle', englishName: 'Male Dragon',
    file: 'dragon-male-reference.png', kind: 'dragon',
    referenceRegion: 'lower-right-dragon', relativeHeight: 1.9,
    traits: ['broad-muscular-build', 'upright-curved-horns', 'magenta-eyes', 'charcoal-scales', 'peach-underside', 'red-angular-markings', 'no-wings', 'long-u-shaped-hollow-tip-tail'],
    description: {
      fr: 'Épaules larges, membres musclés et cornes relevées. La queue dessine un grand U vers la gauche, avec une extrémité tubulaire creuse.',
      en: 'Broad shoulders, muscular limbs and upright horns. His tail sweeps into a large U to the left, ending in a hollow tube.'
    }
  })
]);

const byId = new Map(CLOUD_MEADOW_CHARACTERS.map(character => [character.id, character]));
const sourcePaths = new Set(CLOUD_MEADOW_CHARACTERS.map(character => character.src));

export function getCloudMeadowCharacter(id) {
  return typeof id === 'string' ? byId.get(id) || null : null;
}

export function getCloudMeadowSpriteSrc(actor) {
  if (actor?.universe !== CLOUD_MEADOW_UNIVERSE) return '';
  return getCloudMeadowCharacter(actor.id)?.src || '';
}

export function getCloudMeadowSpriteLayout(src) {
  if (typeof src !== 'string' || !src) return null;
  try {
    const pathname = new URL(src, 'https://sprites.invalid').pathname;
    return sourcePaths.has(pathname) ? CLOUD_MEADOW_STATIC_LAYOUT : null;
  } catch {
    return null;
  }
}
