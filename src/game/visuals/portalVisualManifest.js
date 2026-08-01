const APPROVED_AT = '2026-08-01';
const PROMPT_VERSION = 'portal-atlas-v1';
const OPENAI_COSMETIC_ROOT = '/visuals/cosmetics/openai';

const freezeList = (values) => Object.freeze([...values]);

const makeAtlas = (slug) => Object.freeze({
  sheet: `${OPENAI_COSMETIC_ROOT}/universes/${slug}/portal-effects-atlas-p3.webp`,
  width: 1024,
  height: 256,
  columns: 4,
  rows: 1,
  frames: 4,
  frameWidth: 256,
  frameHeight: 256,
  source: 'openai'
});

const makeReview = () => Object.freeze({
  lore: true,
  composition: true,
  alpha: true,
  distinctFrames: true,
  approvedAt: APPROVED_AT
});

const makePortalVisual = ({
  universe,
  slug,
  continuityId,
  motifs,
  materials,
  palette,
  mustAvoid,
  officialReferenceUrls
}) => Object.freeze({
  universe,
  slug,
  continuityId,
  status: 'approved',
  promptVersion: PROMPT_VERSION,
  source: 'openai',
  atlas: makeAtlas(slug),
  motifs: freezeList(motifs),
  materials: freezeList(materials),
  palette: freezeList(palette),
  mustAvoid: freezeList(mustAvoid),
  officialReferenceUrls: freezeList(officialReferenceUrls),
  review: makeReview(),
  referenceDossier: `${OPENAI_COSMETIC_ROOT}/universes/${slug}/reference-dossier.json`
});

export const PORTAL_VISUAL_MANIFEST = Object.freeze([
  makePortalVisual({
    universe: '28 Days Later',
    slug: '28-days-later',
    continuityId: 'film-2002',
    motifs: [
      'London street-map geometry',
      'analogue emergency broadcast',
      'infected red pupil and veins',
      'evacuation chevrons'
    ],
    materials: [
      'torn emergency tape',
      'scratched CCTV plastic',
      'oxidized metal',
      'wet asphalt'
    ],
    palette: [
      'charcoal',
      'dirty concrete gray',
      'faded khaki',
      'warning red',
      'cold white'
    ],
    mustAvoid: [
      'official poster composition',
      'official logo or title typography',
      'actor likeness',
      'official biohazard mark',
      'gore'
    ],
    officialReferenceUrls: [
      'https://www.20thcenturystudios.com/movies/28-days-later',
      'https://www.sonypictures.com/movies/28dayslater'
    ]
  }),
  makePortalVisual({
    universe: 'A Nightmare on Elm Street',
    slug: 'a-nightmare-on-elm-street',
    continuityId: 'film-1984',
    motifs: [
      'rusted boiler-room pipes',
      'analog alarm clocks',
      'four diagonal dream scratches',
      'suburban bedroom fragments',
      'restrained burgundy and olive knit strips'
    ],
    materials: [
      'scorched black steel',
      'oxidized copper',
      'dirty brass gauges',
      'torn knit fabric',
      'furnace embers'
    ],
    palette: [
      'soot black',
      'rust brown',
      'oxidized copper',
      'dirty brass',
      'furnace red',
      'dark burgundy',
      'muted deep olive',
      'ivory-hot highlights'
    ],
    mustAvoid: [
      'official logo or poster composition',
      'actor likeness',
      'recognizable franchise-character portrait',
      'clock numerals or readable text',
      'blood or gore'
    ],
    officialReferenceUrls: [
      'https://www.warnerbros.co.jp/home_entertainment/fuoaukh9rq21/',
      'https://www.wescraven.com/film/a-nightmare-on-elm-street/'
    ]
  }),
  makePortalVisual({
    universe: 'Ado',
    slug: 'ado',
    continuityId: 'resonance-persona-2020-2026',
    motifs: [
      'original blue rose',
      'stepped soundwave',
      'equalizer geometry',
      'cobalt resonance rings'
    ],
    materials: [
      'pixel-light filigree',
      'opaque petal clusters',
      'angular game-interface trim'
    ],
    palette: [
      'midnight navy',
      'cobalt blue',
      'electric cyan',
      'violet',
      'cool white'
    ],
    mustAvoid: [
      'real-person likeness',
      'existing official illustrated character',
      'album or music-video art',
      'official logo',
      'artist name or readable text'
    ],
    officialReferenceUrls: [
      'https://cloud9pro.co.jp/artist/profile/ado/',
      'https://www.universal-music.co.jp/ado/biography/',
      'https://sp.universal-music.co.jp/ado/exhibition-adotomy/news/20251213/'
    ]
  }),
  makePortalVisual({
    universe: 'Aegea: War of the Moirai',
    slug: 'aegea-war-of-the-moirai',
    continuityId: 'original-project-v2',
    motifs: [
      'three-spindle Moirai crest',
      'broken Greek meander',
      'severable violet fate threads',
      'bronze fate loom',
      'open fourth path'
    ],
    materials: [
      'patinated bronze',
      'limestone ivory',
      'turquoise inlay',
      'controlled pixel-light threads'
    ],
    palette: [
      'midnight navy',
      'near-black',
      'Aegean blue',
      'prophecy violet',
      'old bronze',
      'limestone ivory',
      'turquoise patina'
    ],
    mustAvoid: [
      'external franchise assets',
      'extra characters',
      'text or pseudo-glyphs',
      'cropped limbs or weapons',
      'opaque gameplay center'
    ],
    officialReferenceUrls: []
  })
]);

export const PORTAL_FALLBACK_VISUAL = Object.freeze({
  universe: 'Nexus de Convergence',
  slug: 'nexus-production-fallback',
  continuityId: 'nexus-generic-v1',
  status: 'production',
  promptVersion: 'nexus-generic-v1',
  source: 'openai',
  atlas: Object.freeze({
    sheet: `${OPENAI_COSMETIC_ROOT}/portal-effects-atlas-v1.png`,
    width: 1024,
    height: 1024,
    columns: 4,
    rows: 4,
    frames: 4,
    frameWidth: 256,
    frameHeight: 256,
    row: 0,
    source: 'openai'
  }),
  motifs: freezeList(['Nexus breach ring', 'convergence aperture']),
  materials: freezeList(['pixel-light', 'fractured dimensional glass']),
  palette: freezeList(['cyan', 'violet', 'cold white']),
  mustAvoid: freezeList(['unapproved universe-specific motifs', 'final asset claim']),
  officialReferenceUrls: freezeList([]),
  review: Object.freeze({
    lore: true,
    composition: true,
    alpha: true,
    distinctFrames: true,
    approvedAt: '2026-07-28'
  }),
  referenceDossier: null,
  adminLabel: Object.freeze({
    fr: 'PORTAIL EN PRODUCTION',
    en: 'PORTAL IN PRODUCTION'
  })
});
