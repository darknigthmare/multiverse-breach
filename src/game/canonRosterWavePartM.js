// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcTheTexasChainSawMassacre from '../../DLC/TheTexasChainSawMassacre/data/canonRosterWavePartM.js';
import * as dlcFridayThe13th from '../../DLC/FridayThe13th/data/canonRosterWavePartM.js';
import * as dlcANightmareOnElmStreet from '../../DLC/ANightmareOnElmStreet/data/canonRosterWavePartM.js';
import * as dlcTheTrumanShow from '../../DLC/TheTrumanShow/data/canonRosterWavePartM.js';
import * as dlcTorbahead from '../../DLC/Torbahead/data/canonRosterWavePartM.js';

import { freezeCanonRosterPart } from './canonRosterPackFactory.js';

const r = (key, universe, referenceUrl, heroes, enemies, bosses, worldBoss, gear, stages, options = {}) => ({
  key, universe, referenceUrl, heroes, enemies, bosses, worldBoss, gear, stages,
  aliases: options.aliases || [], continuity: options.continuity || `${universe} primary continuity`,
  adaptationRule: options.rule || `Preserve ${universe}'s canon while using original fan-made art; no copied official art, logos, gore or actor likeness.`,
  visualAnchor: options.anchor || `${universe} signature setting, palette, silhouettes and props recreated as original fan art.`,
  mediaType: options.mediaType || 'film', faction: options.faction || 'horror', mode: options.mode || 'Trial', difficulty: options.difficulty || 'Hard',
  colors: options.colors || ['#3b3130', '#090a0b', '#bc553f'], motif: options.motif || 'pursuit', allNonCombat: options.allNonCombat === true,
  event: { id: 'breach_event', name: `${universe} Breach`, frName: `Brèche ${universe}` }
});

const rows = [
  dlcTheTexasChainSawMassacre.createRows({ r }),

  dlcFridayThe13th.createRows({ r }),

  dlcANightmareOnElmStreet.createRows({ r }),

  dlcTheTrumanShow.createRows({ r }),

  dlcTorbahead.createRows({ r })
];

export const CANON_ROSTER_WAVE_PART_M = freezeCanonRosterPart(rows);
