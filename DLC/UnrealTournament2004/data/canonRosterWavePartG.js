import { UT2004_ACTOR_CATALOG_ACTIONS } from './actorCatalogCombat.js';

// Unreal Tournament 2004 — definitions consumed by src/game/canonRosterWavePartG.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterWavePartG({ event, gear, hero, stage, threat }) {
  // These competitors have a shared pickup arsenal. Body/race is not a
  // personal attack or supernatural special in the 2004 tournament rules.
  const arenaHero = (id, name, anchor, weapon, incarnation) => hero(
    id, name, anchor, weapon, UT2004_ACTOR_CATALOG_ACTIONS[id].special, {
      role: id === 'sapphire' ? 'tactical' : 'marine', weaponType: 'gun',
      ...UT2004_ACTOR_CATALOG_ACTIONS[id],
      incarnation, referenceUrl: 'https://unrealarchive.org/wikis/the-liandri-archives/Unreal_Tournament_2004.html',
      canonStatus: 'canon UT2004 competitor using shared arena weapon pickups; no personal superpower'
    }
  );
  const arenaThreat = (id, name, anchor, weapon, special, incarnation, extra = {}) => threat(
    id, name, anchor, weapon, special, {
      incarnation, referenceUrl: 'https://unrealarchive.org/wikis/the-liandri-archives/Unreal_Tournament_2004.html',
      canonStatus: 'canon UT2004 competitor using shared arena weapon pickups; no racial melee superpower', ...extra
    }
  );
  return ({
    key: 'unreal_tournament_2004', universe: 'Unreal Tournament 2004', aliases: ['UT2004', 'UT2K4', 'Unreal Tournament 2k4'],
    continuity: 'Epic Games Unreal Tournament 2004 Liandri Grand Tournament, distinct from Unreal Tournament 1999.',
    adaptationRule: 'Use UT2004 team biographies, armor families, weapons and arenas; do not merge UT99 models or the unfinished 2014 game.',
    visualAnchor: 'Bright 2004 sci-fi tournament arenas, chunky team armor, Liandri robots, Skaarj competitors and energy weapons.',
    referenceUrl: 'https://www.epicgames.com/unrealtournament/?lang=en-US', referenceUrls: ['https://www.epicgames.com/unrealtournament/?lang=en-US', 'https://unrealarchive.org/wikis/the-liandri-archives/Unreal_Tournament_2004.html'],
    heroes: [
      arenaHero('gorge', 'Gorge', 'Massive bald Juggernaut champion in bulky red-and-silver tournament armor.', 'Flak Cannon', 'Unreal Tournament 2004 (2004), PC — Gorge, Juggernaut competitor model, standard tournament armor'),
      arenaHero('sapphire', 'Sapphire', 'Adult human Mercenary competitor in standard UT2004 combat armor; not the Juggernaut model family or the UC2 Ice Burst incarnation.', 'Shock Rifle', 'Unreal Tournament 2004 (2004), PC — Sapphire, Mercenary competitor model, standard tournament armor'),
      arenaHero('frostbite', 'Frostbite', 'Masked Juggernaut in complete white-blue tournament armor with broad shoulder plates.', 'Rocket Launcher', 'Unreal Tournament 2004 (2004), PC — Frostbite, Juggernaut competitor model, standard tournament armor')
    ],
    enemies: [
      arenaThreat('skaarj_warrior', 'Skaarj Warrior', 'Skaarj tournament competitor model with plated limbs; carries shared arena firearms rather than intrinsic wrist-blade attacks.', 'Link Gun', 'Link Gun Beam', 'Unreal Tournament 2004 (2004), PC — Skaarj competitor, Gaargod selectable model, standard arena rules'),
      arenaThreat('gen_mokai', 'Gen Mo’Kai Fighter', 'Gen MoKai tournament competitor model with horned head and segmented arena armor, using shared weapon pickups.', 'Shock Rifle', 'Shock Combo', 'Unreal Tournament 2004 (2004), PC — Gen MoKai competitor, Motig selectable model, standard arena rules'),
      // The released 2004 roster does not list a Necris model family. Keep this
      // legacy slot unresolved, rather than inventing an approved incarnation.
      threat('necris', 'Necris Combatant', 'Pale adult arena warrior in fully closed black nanoblack armor with blue markings.', 'Lightning Gun', 'Adrenaline Invisibility')
    ],
    bosses: [
      arenaThreat('damarus', 'Damarus', 'Tall Gen MoKai tournament competitor model with crown-like horns and segmented arena armor.', 'Shock Rifle', 'Shock Combo', 'Unreal Tournament 2004 (2004), PC — Damarus, Gen MoKai selectable model, standard tournament armor'),
      arenaThreat('clanlord', 'ClanLord', 'Skaarj Clanlord tournament model in arena armor, using shared pickups rather than a racial blade rush or roar attack.', 'Flak Cannon', 'Flak Cannon Secondary Fire', 'Unreal Tournament 2004 (2004), PC — Clanlord, Skaarj championship competitor model'),
      arenaThreat('xan', 'Xan Kriegor', 'Liandri cybernetic Xan championship competitor model in UT2004 tournament armor.', 'Minigun', 'Minigun Secondary Fire', 'Unreal Tournament 2004 (2004), PC — Xan Kriegor championship competitor model; not the UT99 model')
    ],
    worldBoss: arenaThreat('malcolm', 'Malcolm — Tournament Champion', 'Veteran Black champion in Thunder Crash tournament armor, with the UT2004 game-character face rather than a substituted original face or a live actor.', 'Rocket Launcher', 'Rocket Launcher Volley', 'Unreal Tournament 2004 (2004), PC — Malcolm, Thunder Crash championship competitor model', { prohibitedConcepts: ['actor likeness'] }),
    gear: [gear('shock_rifle', 'Shock Rifle', 'Long blue-gray energy rifle with glowing cyan emitter.', { atk: 4, def: 0, spd: 1 }), gear('redeemer', 'Redeemer', 'Large dark missile launcher with yellow hazard accents and no logo.', { atk: 6, def: 0, spd: 0 }), gear('double_damage', 'Double Damage Core', 'Floating purple energy amp in a compact mechanical frame.', { atk: 5, def: 0, spd: 1 })],
    stages: [stage('DM-Rankin', 'Rust-red industrial arena with ramps, brick halls and glowing pickups.'), stage('ONS-Torlan', 'Open green battlefield with linked power nodes and distant towers.'), stage('AS-Mothership', 'Skaarj mothership assault route from space approach to reactor core.')],
    event: event('grand_tournament', 'Liandri Grand Tournament', 'Arena brackets converge across Deathmatch, Onslaught and Assault battlegrounds without logos or UI.')
  });
}
