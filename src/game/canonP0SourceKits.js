// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcLesAventuresDeSaturnin from '../../DLC/LesAventuresDeSaturnin/data/canonP0SourceKits.js';
import * as dlcLiloStitch from '../../DLC/LiloStitch/data/canonP0SourceKits.js';
import * as dlcPiratesOfTheCaribbean from '../../DLC/PiratesOfTheCaribbean/data/canonP0SourceKits.js';
import * as dlcRogerRabbit from '../../DLC/RogerRabbit/data/canonP0SourceKits.js';
import * as dlcTheDarkKnight from '../../DLC/TheDarkKnight/data/canonP0SourceKits.js';
import * as dlcJokerNew52 from '../../DLC/JokerNew52/data/canonP0SourceKits.js';
import * as dlcTheBatmanWhoLaughs from '../../DLC/TheBatmanWhoLaughs/data/canonP0SourceKits.js';
import * as dlcTeenTitans from '../../DLC/TeenTitans/data/canonP0SourceKits.js';
import * as dlcHarryPotter from '../../DLC/HarryPotter/data/canonP0SourceKits.js';
import * as dlcSpiderTheVideoGame from '../../DLC/SpiderTheVideoGame/data/canonP0SourceKits.js';
import * as dlcMichaelJackson from '../../DLC/MichaelJackson/data/canonP0SourceKits.js';

// Source locks for the remaining Wave4 identities. This module deliberately
// leaves IDs, stats, resource costs and historical sprite/provenance paths alone.
// Named source props/powers are separate from numerical combat adaptations.
import { CANON_BLACK_PEARL_SOURCE_KITS } from './canonBlackPearlSourceKits.js';

const REF = Object.freeze({
  saturnin: 'https://fr.wikipedia.org/wiki/Les_Aventures_de_Saturnin',
  lilo: 'https://d23.com/a-to-z/lilo-stitch-film/',
  jack: 'https://d23.com/a-to-z/pirates-of-the-caribbean-the-curse-of-the-black-pearl-film/',
  roger: 'https://d23.com/a-to-z/who-framed-roger-rabbit-film/',
  batman: 'https://www.dc.com/characters/batman',
  darkKnight: 'https://en.wikipedia.org/wiki/The_Dark_Knight',
  endgame: 'https://www.dc.com/graphic-novels/batman-2011/batman-vol-7-endgame',
  joker: 'https://www.dc.com/characters/the-joker',
  harley: 'https://en.wikipedia.org/wiki/Harley_Quinn',
  grim: 'https://en.wikipedia.org/wiki/The_Batman_Who_Laughs',
  raven: 'https://www.dc.com/characters/raven',
  starfire: 'https://www.dc.com/characters/starfire',
  titans: 'https://en.wikipedia.org/wiki/Teen_Titans_(TV_series)',
  harry: 'https://www.harrypotter.com/fact-file/characters-and-pets/harry-potter',
  hermione: 'https://www.harrypotter.com/fact-file/characters-and-pets/hermione-granger',
  phoenix: 'https://en.wikipedia.org/wiki/Harry_Potter_and_the_Order_of_the_Phoenix_(film)',
  spider: 'https://en.wikipedia.org/wiki/Spider:_The_Video_Game',
  project: 'https://chatgpt.com/share/6abdc1d1-1a7c-83eb-9a7a-d979173f3754'
});

const MELEE = Object.freeze({ shape: 'single', delivery: 'melee' });
const RANGED = Object.freeze({ shape: 'single', delivery: 'ranged' });
const DAMAGE_ADAPTATION = 'Named source action translated into game damage; original choreography and source-specific effects are not certified.';
const COMIC_ADAPTATION = 'Physical comic interaction translated into game damage; this is an original combat adaptation, not a combat feat from the source.';
const melee = (name, canonStatus = DAMAGE_ADAPTATION) => ({
  name, type: 'melee', attackProfile: MELEE, tacticsProfile: { range: 1 },
  smashProfile: { range: 70, shape: 'single', maxTargets: 1 }, canonStatus,
  canonPresentation: { kind: 'melee' }
});
const ranged = (name, type = 'projectile', color, canonStatus = DAMAGE_ADAPTATION) => ({
  name, type, attackProfile: RANGED, tacticsProfile: { range: 4 },
  smashProfile: { range: 300, shape: 'single', maxTargets: 1 },
  ...(color ? { color } : {}), canonStatus
});
const dodge = name => ({ name, type: 'dodge', canonStatus: DAMAGE_ADAPTATION });
const guard = name => ({ name, type: 'shield', canonStatus: DAMAGE_ADAPTATION });

const lock = (details) => ({
  canonCombatPresentation: true,
  canonStatus: 'Source incarnation and props locked; numerical combat is a game adaptation, not a fidelity approval.',
  sourceReviewStatus: 'reference-supported; scene-by-scene fidelity review pending',
  visualReviewStatus: 'pending',
  mechanicsReviewStatus: 'game adaptation; source choreography and special rules pending',
  ...details,
  referenceUrl: details.referenceUrls[0]
});

const titans = (details) => lock({
  incarnation: 'Teen Titans (2003-2006 animated series) - original Jump City team',
  ...details,
  referenceUrls: [...details.referenceUrls, REF.titans]
});

const spiderLoadout = (details) => lock({
  incarnation: 'Spider: The Video Game (PlayStation, 1997) - Dr. Michael Kelly cybernetic-spider loadout',
  referenceUrls: [REF.spider],
  sourceIdentityType: 'source-protagonist-loadout-adaptation',
  canonStatus: 'Kelly is the source protagonist; separate playable attachment slots are project adaptations, not three official characters. Historical substitute sprites remain unapproved.',
  equipmentEvidenceStatus: 'Source-pack attachment identity; exact attachment model requires original manual/gameplay review.',
  ...details
});

export const CANON_P0_SOURCE_KITS = Object.freeze({
  saturnin_duck: dlcLesAventuresDeSaturnin.createCanonP0SourceKits({ COMIC_ADAPTATION, REF, dodge, lock, melee }),
  lilo_pelekai: dlcLiloStitch.createCanonP0SourceKits({ COMIC_ADAPTATION, REF, dodge, lock, melee, ranged }),
  stitch_626: dlcLiloStitch.createCanonP0SourceKits2({ REF, dodge, lock, melee }),
  jack_sparrow_potc: dlcPiratesOfTheCaribbean.createCanonP0SourceKits({ CANON_BLACK_PEARL_SOURCE_KITS }),
  roger_rabbit: dlcRogerRabbit.createCanonP0SourceKits({ COMIC_ADAPTATION, REF, dodge, lock, melee }),
  batman_tdk: dlcTheDarkKnight.createCanonP0SourceKits({ REF, guard, lock, melee, ranged }),
  batman_n52: dlcJokerNew52.createCanonP0SourceKits({ REF, guard, lock, melee, ranged }),
  joker_n52: dlcJokerNew52.createCanonP0SourceKits2({ REF, dodge, lock, melee, ranged }),
  harley_n52: dlcJokerNew52.createCanonP0SourceKits3({ REF, dodge, lock, melee }),
  grim_knight: dlcTheBatmanWhoLaughs.createCanonP0SourceKits({ REF, guard, lock, ranged }),
  raven_tt: dlcTeenTitans.createCanonP0SourceKits({ REF, guard, ranged, titans }),
  starfire_tt: dlcTeenTitans.createCanonP0SourceKits2({ REF, guard, melee, ranged, titans }),
  harry: dlcHarryPotter.createCanonP0SourceKits({ REF, guard, lock, ranged }),
  hermione: dlcHarryPotter.createCanonP0SourceKits2({ REF, guard, lock, ranged }),
  cyber_spider_kelly: dlcSpiderTheVideoGame.createCanonP0SourceKits({ dodge, melee, spiderLoadout }),
  cyber_spider_flamethrower: dlcSpiderTheVideoGame.createCanonP0SourceKits2({ dodge, ranged, spiderLoadout }),
  cyber_spider_electro_beam: dlcSpiderTheVideoGame.createCanonP0SourceKits3({ dodge, ranged, spiderLoadout }),
  mj_performer: dlcMichaelJackson.createCanonP0SourceKits({ COMIC_ADAPTATION, REF, dodge, lock, melee }),
  rhythm_guard_mj: dlcMichaelJackson.createCanonP0SourceKits2({ COMIC_ADAPTATION, REF, dodge, lock, melee, ranged })
});

export const CANON_P0_SOURCE_KIT_IDS = Object.freeze(Object.keys(CANON_P0_SOURCE_KITS));
const ABILITIES = ['simple', 'secondary', 'defense', 'special'];

function presentationFor(id, action) {
  if (action.canonPresentation) return { ...action.canonPresentation };
  const kind = action.type === 'melee' ? 'melee'
    : id === 'jack_sparrow_potc' ? 'flintlock'
      : ['batman_tdk', 'batman_n52'].includes(id) ? 'batarang'
        : id === 'lilo_pelekai' ? 'cameraFlash'
          : id === 'raven_tt' ? 'shadow'
            : id === 'starfire_tt' ? 'starbolt'
              : ['harry', 'hermione'].includes(id) ? 'spell'
                : id === 'cyber_spider_flamethrower' ? 'flame'
                  : id === 'cyber_spider_electro_beam' ? 'electricBeam'
                    : id === 'rhythm_guard_mj' ? 'music'
                      : id === 'joker_n52' ? 'toxin' : 'bullet';
  return { kind, ...(action.color ? { color: action.color } : {}) };
}

export function applyCanonP0SourceKit(hero) {
  const source = Object.hasOwn(CANON_P0_SOURCE_KITS, hero?.id)
    ? CANON_P0_SOURCE_KITS[hero.id] : null;
  if (!source) return hero;
  const result = {
    ...hero, ...source,
    referenceUrls: [...source.referenceUrls], equipment: [...source.equipment],
    loreLocalized: { ...source.loreLocalized }
  };
  if (source.sourceAbilities) result.sourceAbilities = [...source.sourceAbilities];
  if (source.sourceAmmunition) result.sourceAmmunition = {
    ...source.sourceAmmunition, actionIds: [...source.sourceAmmunition.actionIds]
  };
  for (const key of ABILITIES) {
    if (source[key]) {
      const action = { ...hero[key], ...source[key] };
      if (key !== 'defense') action.canonPresentation = presentationFor(hero.id, action);
      for (const profile of ['attackProfile', 'tacticsProfile', 'smashProfile']) {
        if (action[profile]) action[profile] = { ...action[profile] };
      }
      result[key] = action;
    }
  }
  // All balancing numbers stay owned by the existing hero data. New profiles
  // describe delivery/targeting rather than overwriting damage or resources.
  return result;
}

export function getCanonP0SourcePlaque(hero) {
  const source = Object.hasOwn(CANON_P0_SOURCE_KITS, hero?.id)
    ? CANON_P0_SOURCE_KITS[hero.id] : null;
  if (!source) return null;
  return {
    origin: { fr: source.incarnation, en: source.incarnation },
    dossier: { ...source.loreLocalized },
    doctrine: {
      fr: `${source.equipment.join(', ')}. Les chiffres et enchainements sont une adaptation du jeu ; revue visuelle toujours en attente.`,
      en: `${source.equipment.join(', ')}. Numbers and sequences are a game adaptation; visual review remains pending.`
    }
  };
}
