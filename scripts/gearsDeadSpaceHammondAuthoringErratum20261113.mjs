import assert from 'node:assert/strict';
import { isDeepStrictEqual } from 'node:util';
export const HAMMOND_AUTHORING_SOURCE_ERRATUM_20261113 = Object.freeze({
  "actorId": "zach_hammond",
  "scope": "Corrected SWS Pulse Rifle source prose only; historical211-V wording and all historical image/prompt/plan records remain preserved. No pixel revalidation.",
  "historical": {
    "universe": "Dead Space",
    "sourceWork": "Dead Space (2008), security chief Zach Hammond",
    "sourceReference": "Dead Space (2008), security chief Zach Hammond. Adult Black man, close-cropped hair, dark brown security RIG with blue spine lights, original 2008 outfit and pulse rifle; not remake armour. Brace 211-V plasma pulse rifle, aim, tiny attached muzzle flash at the physical barrel tip on release only, recoil, recover; no floating projectile or beam. Explicit bounded gameplay adaptation; selected equipment applies to all four slots, source frames unverified.",
    "sourceUrl": "https://deadspace.fandom.com/wiki/Zach_Hammond",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Tir du Pulse Rifle de Hammond",
      "type": "projectile",
      "dmg": 1,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      }
    },
    "secondary": {
      "name": "Rafale du chef de sécurité",
      "type": "projectile",
      "dmg": 1.65,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Appui du RIG de Hammond",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.5
      },
      "reduce": 0.5,
      "dur": 1.2
    },
    "sourceHeroId": "zach_hammond",
    "source1to1Verified": false,
    "special": {
      "name": "Rafale du Pulse Rifle de Hammond",
      "type": "projectile",
      "dmg": 4.4,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 640,
        "targetSide": "enemy"
      },
      "meterCost": 100
    },
    "priorSourceReference": "Hammond assure la sécurité et l’appui armé de l’équipe ; la garde utilise une position de terrain.",
    "versionRevision": "wave15-explicit-source-version",
    "priorSourceWork": "Dead Space"
  },
  "current": {
    "universe": "Dead Space",
    "sourceWork": "Dead Space (2008), security chief Zach Hammond",
    "sourceReference": "Dead Space (2008), security chief Zach Hammond. Adult Black man, close-cropped hair, dark brown security RIG with blue spine lights, original 2008 outfit and pulse rifle; not remake armour. Brace SWS Motorized Pulse Rifle, aim, tiny attached muzzle flash at the physical barrel tip on release only, recoil, recover; no floating projectile or beam. Explicit bounded gameplay adaptation; selected equipment applies to all four slots, source frames unverified.",
    "sourceUrl": "https://deadspace.fandom.com/wiki/Zach_Hammond",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Tir du Pulse Rifle de Hammond",
      "type": "projectile",
      "dmg": 1,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      }
    },
    "secondary": {
      "name": "Rafale du chef de sécurité",
      "type": "projectile",
      "dmg": 1.65,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Appui du RIG de Hammond",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.5
      },
      "reduce": 0.5,
      "dur": 1.2
    },
    "sourceHeroId": "zach_hammond",
    "source1to1Verified": false,
    "special": {
      "name": "Rafale du Pulse Rifle de Hammond",
      "type": "projectile",
      "dmg": 4.4,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 640,
        "targetSide": "enemy"
      },
      "meterCost": 100
    },
    "priorSourceReference": "Hammond assure la sécurité et l’appui armé de l’équipe ; la garde utilise une position de terrain.",
    "versionRevision": "wave15-explicit-source-version",
    "priorSourceWork": "Dead Space"
  }
});
export function projectHammondSourceAuthoringForHistory(current, historical) {
 const expected = HAMMOND_AUTHORING_SOURCE_ERRATUM_20261113;
 assert.deepEqual(historical, expected.historical, 'Exact historical Hammond authoring record changed');
 if (isDeepStrictEqual(current, expected.historical)) return historical;
 assert.deepEqual(current, expected.current, 'Hammond authoring changed outside exact SWS sourceReference erratum');
 return historical;
}
