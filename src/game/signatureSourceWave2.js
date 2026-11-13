// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcStarWars from '../../DLC/StarWars/data/signatureSourceWave2.js';
import * as dlcHexen from '../../DLC/Hexen/data/signatureSourceWave2.js';
import * as dlcQuake from '../../DLC/Quake/data/signatureSourceWave2.js';
import * as dlcTeamFortress2 from '../../DLC/TeamFortress2/data/signatureSourceWave2.js';
import * as dlcHalfLife from '../../DLC/HalfLife/data/signatureSourceWave2.js';
import * as dlcDoom from '../../DLC/Doom/data/signatureSourceWave2.js';

// Individually selected identities. Contact budgets and geometry are adaptations.
export const SIGNATURE_WAVE2_REFERENCES = Object.freeze({
  "sw-ahsoka": "https://www.starwars.com/databank/ahsoka-tano",
  "sw-aayla": "https://www.starwars.com/databank/aayla-secura",
  "sw-obiwan": "https://www.starwars.com/databank/obi-wan-kenobi",
  "sw-yoda": "https://www.starwars.com/databank/yoda",
  "sw-leia": "https://www.starwars.com/databank/leia-organa",
  "sw-maul": "https://www.starwars.com/databank/maul",
  "sw-vader": "https://www.starwars.com/databank/darth-vader",
  "sw-dooku": "https://www.starwars.com/databank/count-dooku",
  "sw-palpatine": "https://www.starwars.com/databank/emperor-palpatine-darth-sidious",
  "sw-stormtrooper": "https://www.starwars.com/databank/stormtroopers",
  "sw-droideka": "https://www.starwars.com/databank/droideka",
  "sw-tusken": "https://www.starwars.com/databank/tusken-raiders",
  "sw-inquisitor": "https://www.starwars.com/databank/the-grand-inquisitor",
  "hexen-weapons": "https://github.com/chocolate-doom/chocolate-doom/blob/master/src/hexen/p_pspr.c",
  "hexen-monsters": "https://github.com/chocolate-doom/chocolate-doom/blob/master/src/hexen/p_enemy.c",
  "quake-weapons": "https://github.com/id-Software/Quake-Tools/blob/master/qcc/v101qc/weapons.qc",
  "quake-ogre": "https://github.com/id-Software/Quake-Tools/blob/master/qcc/v101qc/ogre.qc",
  "q2-weapons": "https://github.com/id-Software/Quake-2/blob/master/game/p_weapon.c",
  "q2-berserker": "https://github.com/id-Software/Quake-2/blob/master/game/m_berserk.c",
  "q2-gladiator": "https://github.com/id-Software/Quake-2/blob/master/game/m_gladiator.c",
  "tf-scattergun": "https://github.com/ValveSoftware/source-sdk-2013/blob/master/src/game/shared/tf/tf_weapon_shotgun.cpp",
  "tf-rocket": "https://github.com/ValveSoftware/source-sdk-2013/blob/master/src/game/shared/tf/tf_weapon_rocketlauncher.cpp",
  "tf-minigun": "https://github.com/ValveSoftware/source-sdk-2013/blob/master/src/game/shared/tf/tf_weapon_minigun.cpp",
  "tf-grenade": "https://github.com/ValveSoftware/source-sdk-2013/blob/master/src/game/shared/tf/tf_weapon_grenadelauncher.cpp",
  "hl-vort": "https://github.com/ValveSoftware/halflife/blob/master/dlls/islave.cpp",
  "hl-combine": "https://github.com/ValveSoftware/source-sdk-2013/blob/master/src/game/server/hl2/npc_combine.cpp",
  "hl-hunter": "https://github.com/ValveSoftware/source-sdk-2013/blob/master/src/game/server/episodic/npc_hunter.cpp",
  "hl-gunship": "https://github.com/ValveSoftware/source-sdk-2013/blob/master/src/game/server/hl2/npc_combinegunship.cpp",
  "hl-strider": "https://github.com/ValveSoftware/source-sdk-2013/blob/master/src/game/server/hl2/npc_strider.cpp",
  "doom-weapons": "https://github.com/id-Software/DOOM/blob/master/linuxdoom-1.10/p_pspr.c",
  "doom-enemies": "https://github.com/id-Software/DOOM/blob/master/linuxdoom-1.10/p_enemy.c"
});

const saberNote = 'Descriptive saber sequence; no new Force power or transformation. Contact count and animation are adaptations.';
const hero = (universe, actorId, legacyName, name, style, range, source, extra = {}) => Object.freeze({
  key: actorId, universe, actorId, legacyName, name, style, range, source, wave: 2, ...extra
});
const enemy = (universe, enemyName, legacyName, name, style, range, source, extra = {}) => Object.freeze({
  key: `${universe}::${enemyName}`, universe, enemyName, legacyName, name, style, range, source, wave: 2, ...extra
});
export const SIGNATURE_WAVE2_ROWS = Object.freeze([
  dlcStarWars.createSignatureWave2Rows({ hero, saberNote }),
  dlcStarWars.createSignatureWave2Rows2({ hero, saberNote }),
  dlcStarWars.createSignatureWave2Rows3({ hero, saberNote }),
  dlcStarWars.createSignatureWave2Rows4({ hero, saberNote }),
  dlcStarWars.createSignatureWave2Rows5({ hero, saberNote }),
  dlcStarWars.createSignatureWave2Rows6({ hero, saberNote }),
  dlcStarWars.createSignatureWave2Rows7({ hero, saberNote }),
  dlcStarWars.createSignatureWave2Rows8({ hero, saberNote }),
  dlcStarWars.createSignatureWave2Rows9({ hero }),
  dlcStarWars.createSignatureWave2Rows10({ hero }),
  dlcStarWars.createSignatureWave2Rows11({ enemy }),
  dlcStarWars.createSignatureWave2Rows12({ enemy }),
  dlcStarWars.createSignatureWave2Rows13({ enemy }),
  dlcStarWars.createSignatureWave2Rows14({ enemy }),
  dlcStarWars.createSignatureWave2Rows15({ enemy }),
  dlcStarWars.createSignatureWave2Rows16({ enemy }),
  dlcStarWars.createSignatureWave2Rows17({ enemy }),
  dlcStarWars.createSignatureWave2Rows18({ enemy }),
  dlcStarWars.createSignatureWave2Rows19({ enemy }),
  dlcStarWars.createSignatureWave2Rows20({ enemy }),
  dlcStarWars.createSignatureWave2Rows21({ enemy }),
  dlcStarWars.createSignatureWave2Rows22({ enemy }),
  dlcHexen.createSignatureWave2Rows({ hero }),
  dlcHexen.createSignatureWave2Rows2({ enemy }),
  dlcHexen.createSignatureWave2Rows3({ hero }),
  dlcHexen.createSignatureWave2Rows4({ enemy }),
  dlcHexen.createSignatureWave2Rows5({ hero }),
  dlcHexen.createSignatureWave2Rows6({ enemy }),
  dlcHexen.createSignatureWave2Rows7({ enemy }),
  dlcHexen.createSignatureWave2Rows8({ enemy }),
  dlcQuake.createSignatureWave2Rows({ hero }),
  dlcQuake.createSignatureWave2Rows2({ hero }),
  dlcQuake.createSignatureWave2Rows3({ enemy }),
  dlcQuake.createSignatureWave2Rows4({ enemy }),
  dlcQuake.createSignatureWave2Rows5({ enemy }),
  dlcTeamFortress2.createSignatureWave2Rows({ hero }),
  dlcTeamFortress2.createSignatureWave2Rows2({ enemy }),
  dlcTeamFortress2.createSignatureWave2Rows3({ hero }),
  dlcTeamFortress2.createSignatureWave2Rows4({ enemy }),
  dlcTeamFortress2.createSignatureWave2Rows5({ enemy }),
  dlcTeamFortress2.createSignatureWave2Rows6({ enemy }),
  dlcTeamFortress2.createSignatureWave2Rows7({ enemy }),
  dlcHalfLife.createSignatureWave2Rows({ hero }),
  dlcHalfLife.createSignatureWave2Rows2({ enemy }),
  dlcHalfLife.createSignatureWave2Rows3({ enemy }),
  dlcHalfLife.createSignatureWave2Rows4({ enemy }),
  dlcHalfLife.createSignatureWave2Rows5({ enemy }),
  dlcDoom.createSignatureWave2Rows({ hero }),
  dlcDoom.createSignatureWave2Rows2({ enemy })
]);
