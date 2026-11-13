// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcPredator from '../../DLC/Predator/data/signatureSourceWave4.js';
import * as dlcPredator2 from '../../DLC/Predator2/data/signatureSourceWave4.js';
import * as dlcPredators from '../../DLC/Predators/data/signatureSourceWave4.js';
import * as dlcThePredator from '../../DLC/ThePredator/data/signatureSourceWave4.js';
import * as dlcHalo from '../../DLC/Halo/data/signatureSourceWave4.js';

// Explicit movie/game identities. These are gameplay adaptations, not 1:1 art.
export const SIGNATURE_WAVE4_REFERENCES = Object.freeze({
  'p2-disc': 'https://store.necaonline.com/products/predator-2-city-hunter-predator-with-led-lights-quarter-scale-action-figure',
  'pred-berserker': 'https://www.sideshow.com/collectibles/predator-berserker-predator-prime-1-studio-912621',
  'pred-falconer': 'https://necaonline.com/2012/11/closer-look-predators-series-7-camo-cloaked-falconer-predator/',
  'pred-fugitive': 'https://necaonline.com/2018/06/predator-2018-7-scale-action-figure-ultimate-predator/',
  'pred-assassin': 'https://necaonline.com/2021/03/predator-2018-7-scale-action-figure-deluxe-ultimate-assassin-predator-unarmored/',
  'pred-feral': 'https://www.sideshow.com/collectibles/predator-feral-predator-prime-1-studio-914062',
  'halo-arbiter': 'https://www.halowaypoint.com/news/canon-fodder-coming-of-age',
  'halo-linda': 'https://www.halowaypoint.com/en-us/news/inside-infinite-january-2021',
  'halo-weapons': 'https://support.halowaypoint.com/hc/en-us/articles/50948184078228-Weapons-Vehicles-in-Halo-Campaign-Evolved'
});
const hero = (universe, actorId, legacyName, name, style, range, source, extra = {}) => ({
  key: actorId, universe, actorId, legacyName, name, style, range, source, wave: 4, ...extra
});
const enemy = (universe, enemyName, legacyName, name, style, range, source, extra = {}) => ({
  key: `${universe}::${enemyName}`, universe, enemyName, legacyName, name, style, range, source, wave: 4, ...extra
});
const disc = {
  projectile: 'returning-disc', hits: 1, shape: 'single', delivery: 'ranged',
  note: 'Predator 2 throwing-disc equipment. Smash has a swept outbound flight and a harmless return to its owner; one confirmed target, no target substitution or repeated damage. Flight speed, range, hit radius and auto-return are Nexus rules, not a movie trajectory or Hunting Grounds remote-control recreation. RPG retains an abstract single contact.'
};
const blade = { hits: 2, note: 'Personal wrist-blade combination using the depicted weapon. No decapitation, summon, healing, automatic cloak or transformation. Two contacts are a shared Nexus damage budget, not a source combo certification.' };
const halo = 'Weapon-family adaptation for the existing Halo roster. No Campaign Evolved-exclusive traits, automatic shield stripping, headshot instant kill, recharge battery or source-specific ammunition rules are granted.';
export const SIGNATURE_WAVE4_ROWS = Object.freeze([
  dlcPredator.createSignatureWave4Rows({ disc, hero }),
  dlcPredator2.createSignatureWave4Rows({ disc, hero }),
  dlcPredator.createSignatureWave4Rows2({ disc, enemy }),
  dlcPredators.createSignatureWave4Rows({ blade, hero }),
  dlcPredator.createSignatureWave4Rows3({ blade, enemy }),
  dlcPredators.createSignatureWave4Rows2({ blade, enemy }),
  dlcPredators.createSignatureWave4Rows3({ blade, enemy }),
  dlcThePredator.createSignatureWave4Rows({ blade, hero }),
  dlcThePredator.createSignatureWave4Rows2({ blade, enemy }),
  dlcThePredator.createSignatureWave4Rows3({ enemy }),
  dlcPredator.createSignatureWave4Rows4({ enemy }),
  dlcHalo.createSignatureWave4Rows({ hero }),
  dlcHalo.createSignatureWave4Rows2({ hero }),
  dlcHalo.createSignatureWave4Rows3({ enemy, halo }),
  dlcHalo.createSignatureWave4Rows4({ enemy, halo }),
  dlcHalo.createSignatureWave4Rows5({ enemy, halo })
]);
