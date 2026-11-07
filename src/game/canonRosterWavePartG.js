// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcCryptOfTheNecroDancer from '../../DLC/CryptOfTheNecroDancer/data/canonRosterWavePartG.js';
import * as dlcSubverseSafeGalacticRebellion from '../../DLC/SubverseSafeGalacticRebellion/data/canonRosterWavePartG.js';
import * as dlcNoMansSky from '../../DLC/NoMansSky/data/canonRosterWavePartG.js';
import * as dlcTeamFortress2 from '../../DLC/TeamFortress2/data/canonRosterWavePartG.js';
import * as dlcNaturalSelection2 from '../../DLC/NaturalSelection2/data/canonRosterWavePartG.js';
import * as dlcNemesisAwakenRealms from '../../DLC/NemesisAwakenRealms/data/canonRosterWavePartG.js';
import * as dlcUnrealTournament2004 from '../../DLC/UnrealTournament2004/data/canonRosterWavePartG.js';
import * as dlcAngelsFallFirst from '../../DLC/AngelsFallFirst/data/canonRosterWavePartG.js';
import * as dlcCounterStrike from '../../DLC/CounterStrike/data/canonRosterWavePartG.js';
import * as dlcBeatBangerSafeRhythmStudio from '../../DLC/BeatBangerSafeRhythmStudio/data/canonRosterWavePartG.js';
import * as dlcDoomSweeperSafeApocalypse from '../../DLC/DoomSweeperSafeApocalypse/data/canonRosterWavePartG.js';
import * as dlcStellarDreamSafeColonyMission from '../../DLC/StellarDreamSafeColonyMission/data/canonRosterWavePartG.js';
import * as dlcAbsolverDownfall from '../../DLC/AbsolverDownfall/data/canonRosterWavePartG.js';
import * as dlcAgony from '../../DLC/Agony/data/canonRosterWavePartG.js';
import * as dlcAtomicHeart from '../../DLC/AtomicHeart/data/canonRosterWavePartG.js';
import * as dlcBioShock from '../../DLC/BioShock/data/canonRosterWavePartG.js';
import * as dlcBendyAndTheInkMachine from '../../DLC/BendyAndTheInkMachine/data/canonRosterWavePartG.js';

import { freezeCanonRosterPart } from './canonRosterPackFactory.js';

const hero = (id, name, visualAnchor, weapon, special, extra = {}) => ({
  id, name, visualAnchor, weapon, special,
  fr: `${name} conserve sa silhouette et sa fonction canoniques dans cette adaptation fan-made originale.`,
  en: `${name} preserves the canonical silhouette and function in this original fan-made adaptation.`,
  ...extra
});

const threat = (id, name, visualAnchor, weapon, special, extra = {}) => ({
  id, name, visualAnchor, weapon, special,
  fr: `${name} reste une menace canonique clairement identifiable, sans gore ni reprise d'illustration officielle.`,
  en: `${name} remains a clearly identifiable canonical threat, without gore or copied official artwork.`,
  ...extra
});

const trial = (id, name, visualAnchor, objective, extra = {}) => ({
  id, name, visualAnchor, nonCombat: true, objective,
  objectiveFr: `Terminer l'épreuve « ${name} » par l'observation, l'orientation, le rythme ou l'interaction, sans attaquer personne.`,
  victoryCondition: `complete-${id}-trial`,
  fr: `${name} est une épreuve environnementale non combattante et jamais une cible vivante.`,
  en: `${name} is a non-combat environmental Trial and never a living target.`,
  ...extra
});

const gear = (id, name, visualAnchor, boost = { atk: 2, def: 2, spd: 1 }) => ({
  id, name, frName: name, visualAnchor, boost,
  fr: `${name} conserve sa forme et son usage canoniques.`,
  en: `${name} preserves its canonical shape and use.`
});

const stage = (name, visualAnchor, extra = {}) => ({
  name, visualAnchor,
  fr: `${name} transpose fidèlement ce lieu ou cette situation en parcours de jeu original.`,
  en: `${name} faithfully translates this location or situation into an original gameplay route.`,
  ...extra
});

const event = (id, name, visualAnchor, extra = {}) => ({
  id, name, frName: name, visualAnchor,
  en: `${name} temporarily reshapes the breach around the continuity's signature rules.`,
  fr: `${name} reconfigure temporairement la brèche autour des règles emblématiques de la continuité.`,
  ...extra
});

export const CANON_ROSTER_WAVE_PART_G = freezeCanonRosterPart([
  dlcCryptOfTheNecroDancer.createCanonRosterWavePartG({ event, gear, hero, stage, threat }),
  dlcSubverseSafeGalacticRebellion.createCanonRosterWavePartG({ event, gear, hero, stage, threat }),
  dlcNoMansSky.createCanonRosterWavePartG({ event, gear, hero, stage, threat }),
  dlcTeamFortress2.createCanonRosterWavePartG({ event, gear, hero, stage, threat }),
  dlcNaturalSelection2.createCanonRosterWavePartG({ event, gear, hero, stage, threat }),
  dlcNemesisAwakenRealms.createCanonRosterWavePartG({ event, gear, hero, stage, threat }),
  dlcUnrealTournament2004.createCanonRosterWavePartG({ event, gear, hero, stage, threat }),
  dlcAngelsFallFirst.createCanonRosterWavePartG({ event, gear, hero, stage, threat }),
  dlcCounterStrike.createCanonRosterWavePartG({ event, gear, hero, stage, threat, trial }),
  dlcBeatBangerSafeRhythmStudio.createCanonRosterWavePartG({ event, gear, hero, stage, trial }),
  dlcDoomSweeperSafeApocalypse.createCanonRosterWavePartG({ event, gear, hero, stage, threat }),
  dlcStellarDreamSafeColonyMission.createCanonRosterWavePartG({ event, gear, hero, stage, trial }),
  dlcAbsolverDownfall.createCanonRosterWavePartG({ event, gear, hero, stage, threat }),
  dlcAgony.createCanonRosterWavePartG({ event, gear, hero, stage, threat }),
  dlcAtomicHeart.createCanonRosterWavePartG({ event, gear, hero, stage, threat }),
  dlcBioShock.createCanonRosterWavePartG({ event, gear, hero, stage, threat }),
  dlcBendyAndTheInkMachine.createCanonRosterWavePartG({ event, gear, hero, stage, threat })
]);
