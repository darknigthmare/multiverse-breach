// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcTeamFortress2 from '../../DLC/TeamFortress2/data/signatureSourceWave3.js';
import * as dlcHalfLife from '../../DLC/HalfLife/data/signatureSourceWave3.js';
import * as dlcAliens from '../../DLC/Aliens/data/signatureSourceWave3.js';
import * as dlcQuake from '../../DLC/Quake/data/signatureSourceWave3.js';
import * as dlcDoom from '../../DLC/Doom/data/signatureSourceWave3.js';
import * as dlcHexen from '../../DLC/Hexen/data/signatureSourceWave3.js';

// Explicit identities, not a franchise-wide grant. See each adaptation note.
export const SIGNATURE_WAVE3_REFERENCES = Object.freeze({
  'tf-stock-medigun': 'https://github.com/ValveSoftware/source-sdk-2013/blob/master/src/game/shared/tf/tf_weapon_medigun.cpp',
  'hl2-dog': 'https://github.com/ValveSoftware/source-sdk-2013/blob/master/src/game/server/hl2/npc_dog.cpp',
  'q2-makron': 'https://github.com/id-Software/Quake-2/blob/master/game/m_boss32.c',
  'doom-pinky': 'https://github.com/id-Software/DOOM/blob/master/linuxdoom-1.10/p_enemy.c',
  'hexen-centaur': 'https://github.com/chocolate-doom/chocolate-doom/blob/master/src/hexen/p_enemy.c',
  'aliens-film-equipment': 'https://super7.com/blogs/news/super7-x-aliens-reaction-figures'
});
const hero = (universe, actorId, legacyName, name, style, range, source, extra = {}) => Object.freeze({
  key: actorId, universe, actorId, legacyName, name, style, range, source, wave: 3, ...extra
});
const enemy = (universe, enemyName, legacyName, name, style, range, source, extra = {}) => Object.freeze({
  key: `${universe}::${enemyName}`, universe, enemyName, legacyName, name, style, range, source, wave: 3, ...extra
});
export const SIGNATURE_WAVE3_ROWS = Object.freeze([
  dlcTeamFortress2.createSignatureWave3Rows({ hero }),
  dlcHalfLife.createSignatureWave3Rows({ hero }),
  dlcAliens.createSignatureWave3Rows({ hero }),
  dlcAliens.createSignatureWave3Rows2({ hero }),
  dlcAliens.createSignatureWave3Rows3({ hero }),
  dlcQuake.createSignatureWave3Rows({ enemy }),
  dlcDoom.createSignatureWave3Rows({ enemy }),
  dlcHexen.createSignatureWave3Rows({ enemy })
]);
