import { GEARS_DEADSPACE_CATALOG_EDITIONS_20261113, assertGearsDeadSpaceCatalogEdition } from './gearsDeadSpaceCatalogEditions20261113.mjs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

// Explicit compatibility evidence from GitHub master3036cd02. These pins keep
// current canonical references separate from the immutable historical atlases.
// Unknown actors/slots receive the original strict equality assertions.
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const read = file => readFileSync(new URL('../' + file, import.meta.url));
export const CANONICAL_BASE_EDITIONS = Object.freeze({
  "ripley": {
    "src": "/sprites/generated/heroes/alien/ripley-v2-fidelity-wave12-2026-11-01.png",
    "sha256": "9ace11dc65acf293675cbbd934a371688091b10dd4bff7112e2cd7b2aa09b35d",
    "historicalAtlases": [
      {
        "sheet": "/sprites/generated/combat-character-corrections-wave13-part-a/ripley.png",
        "sha256": "f9a374f66fec8fd432209dd46ba10d15db770d1d4c2ecf33f9cef915702aec06"
      }
    ],
    "universe": "Alien"
  },
  "predator": {
    "src": "/sprites/generated/heroes/predator/predator-v2-fidelity-wave12-2026-11-01.png",
    "sha256": "14c9b09cd7854c804d8daa0f60b0968c93ac7f9ede921e38b3185e9efec0b53b",
    "historicalAtlases": [
      {
        "sheet": "/sprites/generated/combat-character-corrections-wave12-part-b/predator.png",
        "sha256": "a66a56bf95639540873cf51e25d3a6facdf74d3b3b582c0cdb053c8a499abb06"
      }
    ],
    "universe": "Predator"
  },
  "greyback_yautja": {
    "src": "/sprites/generated/heroes/predator/greyback-yautja-v2-fidelity-wave12-2026-11-01.png",
    "sha256": "e5436632e464d92f27ca397b7691c50974ecd12bda784f880cd7b80d2914a60e",
    "historicalAtlases": [
      {
        "sheet": "/sprites/generated/combat-character-corrections-wave12-part-b/greyback_yautja.png",
        "sha256": "ef3eda3f81183b9f923e7c3d924f78e53ef301f0409235190ba217132a15c88b"
      }
    ],
    "universe": "Predator"
  },
  "bishop": {
    "src": "/sprites/generated/heroes/alien/bishop-v2-fidelity-wave12-2026-11-01.png",
    "sha256": "e84a413fea3b757f8b2ff88a3dc38d8c6257d0c528e00d3e37450a7f61b71829",
    "historicalAtlases": [
      {
        "sheet": "/sprites/generated/combat-character-corrections-wave13-part-a/bishop.png",
        "sha256": "d01d97b6cb794d566a8abda1377094db4d942836d24e9027433e89c46f31ce48"
      }
    ],
    "universe": "Alien"
  },
  "crash_bandicoot": {
    "src": "/sprites/generated/heroes/crash-bandicoot/crash-bandicoot-crash4-fidelity-wave5-2026-10-22.png",
    "sha256": "0a6dffec19b217cc8b8e1358c6f879dfc85db8a21f09a3a780467613ae7ab567",
    "historicalAtlases": [
      {
        "sheet": "/sprites/generated/combat-character-corrections-wave16-part-a/crash_bandicoot.png",
        "sha256": "96f99a7fc9ab6b66e55d0333d4c43d096eb12698c447251e2624dc77b58343ef"
      }
    ],
    "universe": "Crash Bandicoot"
  },
  "chris_redfield": {
    "src": "/sprites/generated/heroes/resident-evil/chris-redfield-re1-1996-fidelity-2026-10-18.png",
    "sha256": "758d421495de61ed9200e4490475e10385772408a91965cec83968c08941279a",
    "historicalAtlases": [
      {
        "sheet": "/sprites/generated/combat-character-corrections-wave9/chris_redfield.png",
        "sha256": "f13a5b588e29849123c1764ab06789b785eda18f49d6e1411577c6c98ae91bc9"
      }
    ],
    "universe": "Resident Evil"
  },
  "liquid_snake": {
    "src": "/sprites/generated/heroes/metal-gear/liquid-snake-mgs-1998-final-web.png",
    "sha256": "038d4a94faddc2e2d1d16bfdccc1bd0253923b6c36d1e36a848c155475a430ac",
    "historicalAtlases": [
      {
        "sheet": "/sprites/generated/combat-character-corrections-wave13-part-b/liquid_snake.png",
        "sha256": "4000f10d82b79d13c9fb698566c5b30fb27fa309588b3adf2200bddaacbc346c"
      }
    ],
    "universe": "Metal Gear"
  },
  "mistral_mgr": {
    "src": "/sprites/generated/heroes/metal-gear-rising/mistral-revengeance-2013-fidelity-2026-10-18.png",
    "sha256": "3c10a21007b17b735db2e8988ef7a109485b604f02c590b1e269740f7b960415",
    "historicalAtlases": [
      {
        "sheet": "/sprites/generated/combat-character-corrections-wave8/mistral_mgr.png",
        "sha256": "283426b99b894210580ec554bcb5f80fca465c1e22adb5c9079b4e072138f7aa"
      }
    ],
    "universe": "Metal Gear Rising"
  },
  "true_ogre_tekken": {
    "src": "/sprites/generated/heroes/tekken/true-ogre-tekken-3-fidelity-2026-10-18.png",
    "sha256": "5cd2d4d27120dfb3defc3d9598b51b6594852efb4aceae9b4454ffd9ff6d4c7b",
    "historicalAtlases": [
      {
        "sheet": "/sprites/generated/combat-character-corrections-wave15-part-b/true_ogre_tekken.png",
        "sha256": "bbb2b7e75640b2ae7c8160ab90122497590752caec0ee829fca55a070d11a589"
      }
    ],
    "universe": "Tekken"
  }
});
export const RAW_CANONICAL_EDITIONS = Object.freeze({
  "predator": {
    "incarnation": "Predator (1987) - Jungle Hunter",
    "slots": {
      "simple": {
        "historical": {
          "name": "Combistick Jab",
          "type": "melee",
          "dmg": 1.2
        },
        "selected": {
          "name": "Wristblade Slash",
          "type": "melee",
          "dmg": 1.2
        }
      },
      "special": {
        "historical": {
          "name": "Smart Disc Carnage",
          "type": "boomerang",
          "dmg": 4.8
        },
        "selected": {
          "name": "Unmasked Jungle Duel",
          "type": "melee_aoe",
          "dmg": 4.8
        }
      }
    },
    "universe": "Predator"
  },
  "ripley": {
    "incarnation": "Alien (1979) - Nostromo / Narcissus",
    "slots": {
      "simple": {
        "historical": {
          "name": "Pulse Rifle",
          "type": "bullet",
          "dmg": 1
        },
        "selected": {
          "name": "Nostromo Flamethrower",
          "type": "fire",
          "dmg": 1
        }
      },
      "secondary": {
        "historical": {
          "name": "M94 Flamethrower",
          "type": "fire",
          "cd": 7,
          "dmg": 1.7
        },
        "selected": {
          "name": "Improvised Flame Burst",
          "type": "fire",
          "cd": 7,
          "dmg": 1.7
        }
      },
      "defense": {
        "historical": {
          "name": "Loader Block",
          "type": "shield",
          "dur": 2,
          "reduce": 0.75
        },
        "selected": {
          "name": "Nostromo Escape",
          "type": "dodge",
          "dur": 2,
          "reduce": 0.75
        }
      },
      "special": {
        "historical": {
          "name": "Power Loader Smash",
          "type": "melee_aoe",
          "dmg": 4.2
        },
        "selected": {
          "name": "Narcissus Harpoon",
          "type": "projectile",
          "dmg": 4.2
        }
      }
    },
    "universe": "Alien"
  },
  "liquid_snake": {
    "incarnation": "Metal Gear Solid (1998) - Liquid Snake, final bare-handed duel on REX",
    "slots": {
      "simple": {
        "historical": {
          "name": "Liquid Snake Signature Strike",
          "type": "melee",
          "dmg": 1
        },
        "selected": {
          "name": "Final-Duel Punch",
          "type": "melee",
          "dmg": 1,
          "canonStatus": "Physical source-described action adapted to game damage; exact source choreography is not certified.",
          "attackProfile": {
            "shape": "single",
            "delivery": "melee"
          },
          "tacticsProfile": {
            "range": 1
          },
          "smashProfile": {
            "range": 70,
            "verticalRange": 35,
            "shape": "single",
            "delivery": "melee",
            "maxTargets": 1
          },
          "canonPresentation": {
            "kind": "melee"
          }
        }
      },
      "secondary": {
        "historical": {
          "name": "Liquid Snake Breach Technique",
          "type": "signature",
          "cd": 8,
          "dmg": 2.2
        },
        "selected": {
          "name": "Close-Quarters Kick",
          "type": "melee",
          "cd": 8,
          "dmg": 2.2,
          "canonStatus": "Physical source-described action adapted to game damage; exact source choreography is not certified.",
          "attackProfile": {
            "shape": "single",
            "delivery": "melee"
          },
          "tacticsProfile": {
            "range": 1
          },
          "smashProfile": {
            "range": 70,
            "verticalRange": 35,
            "shape": "single",
            "delivery": "melee",
            "maxTargets": 1
          },
          "canonPresentation": {
            "kind": "melee"
          }
        }
      },
      "defense": {
        "historical": {
          "name": "Liquid Snake Guard",
          "type": "shield",
          "dur": 2,
          "reduce": 0.75
        },
        "selected": {
          "name": "Bare-Handed Duel Guard",
          "type": "shield",
          "dur": 2,
          "reduce": 0.75,
          "canonStatus": "Physical source-described action adapted to game damage; exact source choreography is not certified."
        }
      },
      "special": {
        "historical": {
          "name": "Liquid Snake Origin Burst",
          "type": "origin_aoe",
          "dmg": 4.5,
          "color": "#7f5c38"
        },
        "selected": {
          "name": "REX-Top Bare-Handed Rush",
          "type": "melee",
          "dmg": 4.5,
          "color": "#7f5c38",
          "canonStatus": "Physical source-described action adapted to game damage; exact source choreography is not certified.",
          "attackProfile": {
            "shape": "single",
            "delivery": "melee"
          },
          "tacticsProfile": {
            "range": 1
          },
          "smashProfile": {
            "range": 70,
            "verticalRange": 35,
            "shape": "single",
            "delivery": "melee",
            "maxTargets": 1
          },
          "canonPresentation": {
            "kind": "melee"
          }
        }
      }
    },
    "universe": "Metal Gear"
  },
  "luke": {
    "incarnation": "Star Wars: Return of the Jedi (1983) - Death Star II Jedi Knight",
    "slots": {
      "simple": {
        "historical": {
          "name": "Lightsaber Cut",
          "type": "melee",
          "dmg": 1.2
        },
        "selected": {
          "name": "Green Lightsaber Cut",
          "type": "melee",
          "dmg": 1.2,
          "tacticsProfile": {
            "range": 1
          }
        }
      },
      "secondary": {
        "historical": {
          "name": "Force Push Blast",
          "type": "gravity",
          "cd": 5,
          "dmg": 1.8
        },
        "selected": {
          "name": "Force Telekinesis",
          "type": "gravity",
          "cd": 5,
          "dmg": 1.8
        }
      },
      "defense": {
        "historical": {
          "name": "Saber Deflect",
          "type": "shield",
          "dur": 2,
          "reduce": 0.9
        },
        "selected": {
          "name": "Lightsaber Deflection",
          "type": "shield",
          "dur": 2,
          "reduce": 0.9
        }
      },
      "special": {
        "historical": {
          "name": "Jedi Mind Strike",
          "type": "beam_aoe",
          "dmg": 5.2
        },
        "selected": {
          "name": "Green Lightsaber Duel",
          "type": "melee",
          "dmg": 5.2,
          "color": "#00ff00",
          "attackProfile": {
            "shape": "single",
            "delivery": "melee"
          },
          "tacticsProfile": {
            "range": 1
          }
        }
      }
    },
    "universe": "Star Wars"
  },
  "vader": {
    "incarnation": "Star Wars: The Empire Strikes Back (1980) - Bespin Sith Lord",
    "slots": {
      "simple": {
        "historical": {
          "name": "Sith Saber Cut",
          "type": "melee",
          "dmg": 1
        },
        "selected": {
          "name": "Red Lightsaber Cut",
          "type": "melee",
          "dmg": 1,
          "tacticsProfile": {
            "range": 1
          }
        }
      },
      "secondary": {
        "historical": {
          "name": "Force Choke Hold",
          "type": "signature",
          "cd": 7,
          "dmg": 1.8
        },
        "selected": {
          "name": "Bespin Debris Telekinesis",
          "type": "gravity",
          "cd": 7,
          "dmg": 1.8
        }
      },
      "defense": {
        "historical": {
          "name": "Dark Side Guard",
          "type": "shield",
          "dur": 2,
          "reduce": 0.8
        },
        "selected": {
          "name": "Lightsaber Parry",
          "type": "shield",
          "dur": 2,
          "reduce": 0.8
        }
      },
      "special": {
        "historical": {
          "name": "Imperial March Execution",
          "type": "nexus_aoe",
          "dmg": 4.6,
          "color": "#2d3436"
        },
        "selected": {
          "name": "Force Choke",
          "type": "gravity",
          "dmg": 4.6,
          "color": "#ff3030",
          "attackProfile": {
            "shape": "single",
            "delivery": "ranged"
          }
        }
      }
    },
    "universe": "Star Wars"
  },
  "true_ogre_tekken": {
    "incarnation": "Tekken 3 (1997 arcade / 1998 PlayStation) - True Ogre, transformed beast form",
    "slots": {
      "simple": {
        "historical": {
          "name": "True Ogre Signature Strike",
          "type": "melee",
          "dmg": 1
        },
        "selected": {
          "name": "True Ogre Claw Strike",
          "type": "melee",
          "dmg": 1,
          "canonStatus": "Physical source-described action adapted to game damage; exact source choreography is not certified.",
          "attackProfile": {
            "shape": "single",
            "delivery": "melee"
          },
          "tacticsProfile": {
            "range": 1
          },
          "smashProfile": {
            "range": 70,
            "verticalRange": 35,
            "shape": "single",
            "delivery": "melee",
            "maxTargets": 1
          },
          "canonPresentation": {
            "kind": "melee"
          }
        }
      },
      "secondary": {
        "historical": {
          "name": "True Ogre Breach Technique",
          "type": "signature",
          "cd": 8,
          "dmg": 2.2
        },
        "selected": {
          "name": "Serpent-Arm Strike",
          "type": "melee",
          "cd": 8,
          "dmg": 2.2,
          "canonStatus": "Physical source-described action adapted to game damage; exact source choreography is not certified.",
          "attackProfile": {
            "shape": "single",
            "delivery": "melee"
          },
          "tacticsProfile": {
            "range": 1
          },
          "smashProfile": {
            "range": 70,
            "verticalRange": 35,
            "shape": "single",
            "delivery": "melee",
            "maxTargets": 1
          },
          "canonPresentation": {
            "kind": "melee"
          }
        }
      },
      "defense": {
        "historical": {
          "name": "True Ogre Guard",
          "type": "shield",
          "dur": 2,
          "reduce": 0.75
        },
        "selected": {
          "name": "Bestial Contact Guard",
          "type": "shield",
          "dur": 2,
          "reduce": 0.75,
          "canonStatus": "Physical source-described action adapted to game damage; exact source choreography is not certified."
        }
      },
      "special": {
        "historical": {
          "name": "True Ogre Origin Burst",
          "type": "origin_aoe",
          "dmg": 4.5,
          "color": "#c0ff6d"
        },
        "selected": {
          "name": "True Ogre Physical Rush",
          "type": "melee",
          "dmg": 4.5,
          "color": "#c0ff6d",
          "canonStatus": "Physical source-described action adapted to game damage; exact source choreography is not certified.",
          "attackProfile": {
            "shape": "single",
            "delivery": "melee"
          },
          "tacticsProfile": {
            "range": 1
          },
          "smashProfile": {
            "range": 70,
            "verticalRange": 35,
            "shape": "single",
            "delivery": "melee",
            "maxTargets": 1
          },
          "canonPresentation": {
            "kind": "melee"
          }
        }
      }
    },
    "universe": "Tekken"
  }
});

// A second, additive snapshot validates the newer GitHub Star Wars editions.
// It does not replace the 3036 raw actors or the independently frozen W13 plan.
const githubStarWarsBytes = read('scripts/fixtures/githubStarWarsRaw2333c2c0.json');
assert.equal(hash(githubStarWarsBytes), '089937eb9a918a458cc717066585543be5aa80efdc5bd8be9222fd7cb3c78b89');
const githubStarWars = JSON.parse(githubStarWarsBytes);
assert.equal(githubStarWars.sourceCommit, '2333c2c0c524414c6c7ab84ca86d7e3e40c187ac');
const githubStarWarsById = new Map(githubStarWars.actors.map(actor => [actor.id, actor]));
const frozenWave13Bytes = read('docs/combat-fidelity-wave13-2026-10-24/batch-plan-before.json');
assert.equal(hash(frozenWave13Bytes), 'c2c5072ee64c0a8570b1d3229c2644b6f61ff0e2c6f7cc203e821f315326388f');
const frozenWave13ById = new Map(JSON.parse(frozenWave13Bytes).heroes.map(row => [row.hero.id, row]));

export function assertLatestGitHubStarWarsEdition(actor) {
  const selected = githubStarWarsById.get(actor?.id);
  assert.ok(selected, actor?.id + ': undeclared GitHub Star Wars source identity');
  for (const [field, expected] of Object.entries(selected)) {
    assert.deepEqual(actor[field], expected, actor.id + ': selected 2333c2c0 source field ' + field + ' changed');
  }
  return selected;
}
const isLatestGitHubStarWarsCandidate = actor => {
  const selected = githubStarWarsById.get(actor?.id);
  return !!selected && (actor.incarnation === selected.incarnation
    || Object.hasOwn(actor, 'equipmentEvidenceStatus'));
};
function assertLatestWave13Comparison(actor) {
  assertLatestGitHubStarWarsEdition(actor);
  const frozen = frozenWave13ById.get(actor.id);
  assert.ok(frozen, actor.id + ': undeclared W13 historical comparison');
  return frozen;
}

// Additive source projections accepted in the November13 actor batches.
// Historical actions remain pinned per slot; current raw actions are the exact
// previously authored W14/W15 objects, not newly invented gameplay or art approval.
export const PROJECTED_SOURCE_EDITIONS_20261113 = Object.freeze({
  "ardyn_ff15": {
    "id": "ardyn_ff15",
    "universe": "Final Fantasy XV",
    "incarnation": "Final Fantasy XV (2016), main-game chancellor outfit",
    "weaponType": "sword",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceFidelityAudit": "ff-lot-040-2026-11-13",
    "canonStatus": "Source edition declared individually; existing authored ability rules reused. Numeric effects, timing, poses and artwork remain adaptations requiring review.",
    "slots": {
      "simple": {
        "historical": {
          "name": "Starscourge Cut",
          "type": "melee",
          "dmg": 1
        },
        "selected": {
          "name": "Coupe de la lame royale d’Ardyn",
          "type": "melee",
          "dmg": 1.15,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "melee",
            "shape": "single",
            "range": 85,
            "targetSide": "enemy"
          }
        }
      },
      "secondary": {
        "historical": {
          "name": "Royal Parry Theft",
          "type": "signature",
          "cd": 8,
          "dmg": 2.2
        },
        "selected": {
          "name": "Contre de la lame spectrale d’Ardyn",
          "type": "melee",
          "dmg": 1.85,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "melee",
            "shape": "single",
            "range": 85,
            "targetSide": "enemy"
          },
          "cd": 6
        }
      },
      "defense": {
        "historical": {
          "name": "Immortal Feint",
          "type": "shield",
          "dur": 2,
          "reduce": 0.75
        },
        "selected": {
          "name": "Garde de la lame d’Ardyn",
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
        }
      },
      "special": {
        "historical": {
          "name": "Usurper Throne Collapse",
          "type": "origin_aoe",
          "dmg": 4.5,
          "color": "#7b241c"
        },
        "selected": {
          "name": "Taille de la lame royale d’Ardyn",
          "type": "melee",
          "dmg": 4.65,
          "animationDuration": 1.1,
          "hitAt": 0.451,
          "targeting": {
            "effect": "damage",
            "delivery": "melee",
            "shape": "single",
            "range": 165,
            "targetSide": "enemy"
          },
          "meterCost": 100
        }
      }
    }
  },
  "cor_ff15": {
    "id": "cor_ff15",
    "universe": "Final Fantasy XV",
    "incarnation": "Final Fantasy XV (2016), main-game Crownsguard marshal outfit",
    "weaponType": "katana",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceFidelityAudit": "ff-lot-040-2026-11-13",
    "canonStatus": "Source edition declared individually; existing authored ability rules reused. Numeric effects, timing, poses and artwork remain adaptations requiring review.",
    "slots": {
      "simple": {
        "historical": {
          "name": "Katana Draw",
          "type": "melee",
          "dmg": 1
        },
        "selected": {
          "name": "Coupe du katana du Maréchal",
          "type": "melee",
          "dmg": 1.15,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "melee",
            "shape": "single",
            "range": 85,
            "targetSide": "enemy"
          }
        }
      },
      "secondary": {
        "historical": {
          "name": "Immortal Counter",
          "type": "signature",
          "cd": 8,
          "dmg": 2.2
        },
        "selected": {
          "name": "Contre du katana de Cor",
          "type": "melee",
          "dmg": 1.85,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "melee",
            "shape": "single",
            "range": 85,
            "targetSide": "enemy"
          },
          "cd": 6
        }
      },
      "defense": {
        "historical": {
          "name": "Crownsguard Stance",
          "type": "shield",
          "dur": 2,
          "reduce": 0.75
        },
        "selected": {
          "name": "Garde de katana de Cor",
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
        }
      },
      "special": {
        "historical": {
          "name": "Lucian Veteran Rush",
          "type": "origin_aoe",
          "dmg": 4.5,
          "color": "#566573"
        },
        "selected": {
          "name": "Taille du katana de Cor",
          "type": "melee",
          "dmg": 4.65,
          "animationDuration": 1.1,
          "hitAt": 0.451,
          "targeting": {
            "effect": "damage",
            "delivery": "melee",
            "shape": "single",
            "range": 165,
            "targetSide": "enemy"
          },
          "meterCost": 100
        }
      }
    }
  },
  "noble_six": {
    "id": "noble_six",
    "universe": "Halo",
    "incarnation": "Halo: Reach (2010), default adult Noble Six",
    "weaponType": "gun",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "slots": {
      "simple": {
        "historical": {
          "name": "Noble Six Signature Strike",
          "type": "bullet",
          "dmg": 1
        },
        "selected": {
          "name": "Tir du MA37 de Noble Six",
          "type": "projectile",
          "dmg": 1.15,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 480,
            "targetSide": "enemy"
          }
        }
      },
      "secondary": {
        "historical": {
          "name": "Noble Six Breach Technique",
          "type": "projectile",
          "cd": 8,
          "dmg": 2.2
        },
        "selected": {
          "name": "Visée du MA37 de Reach",
          "type": "projectile",
          "dmg": 1.85,
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
        }
      },
      "defense": {
        "historical": {
          "name": "Noble Six Guard",
          "type": "shield",
          "dur": 2,
          "reduce": 0.75
        },
        "selected": {
          "name": "Garde de l’armure Mark V(B)",
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
        }
      },
      "special": {
        "historical": {
          "name": "Noble Six Origin Burst",
          "type": "origin_aoe",
          "dmg": 4.5,
          "color": "#566573"
        },
        "selected": {
          "name": "Rafale du MA37 de Noble Six",
          "type": "projectile",
          "dmg": 4.65,
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
        }
      }
    }
  },
  "buck_odst": {
    "id": "buck_odst",
    "universe": "Halo",
    "incarnation": "Halo 3: ODST (2009), Buck before Spartan conversion",
    "weaponType": "gun",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "slots": {
      "simple": {
        "historical": {
          "name": "Edward Buck Signature Strike",
          "type": "bullet",
          "dmg": 1
        },
        "selected": {
          "name": "Tir du M7S silencieux de Buck",
          "type": "projectile",
          "dmg": 1.15,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 480,
            "targetSide": "enemy"
          }
        }
      },
      "secondary": {
        "historical": {
          "name": "Edward Buck Breach Technique",
          "type": "projectile",
          "cd": 8,
          "dmg": 2.2
        },
        "selected": {
          "name": "Visée du M7S de l’ODST Buck",
          "type": "projectile",
          "dmg": 1.85,
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
        }
      },
      "defense": {
        "historical": {
          "name": "Edward Buck Guard",
          "type": "shield",
          "dur": 2,
          "reduce": 0.75
        },
        "selected": {
          "name": "Repli de Buck en armure ODST",
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
        }
      },
      "special": {
        "historical": {
          "name": "Edward Buck Origin Burst",
          "type": "origin_aoe",
          "dmg": 4.5,
          "color": "#34495e"
        },
        "selected": {
          "name": "Rafale du M7S de Buck",
          "type": "projectile",
          "dmg": 4.65,
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
        }
      }
    }
  },
  "kelly_087": {
    "id": "kelly_087",
    "universe": "Halo",
    "incarnation": "Halo 5: Guardians (2015)",
    "weaponType": "gun",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "slots": {
      "simple": {
        "historical": {
          "name": "Kelly-087 Signature Strike",
          "type": "melee",
          "dmg": 1
        },
        "selected": {
          "name": "Tir de l’Oathsworn de Kelly",
          "type": "projectile",
          "dmg": 1.15,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 480,
            "targetSide": "enemy"
          }
        }
      },
      "secondary": {
        "historical": {
          "name": "Kelly-087 Breach Technique",
          "type": "signature",
          "cd": 8,
          "dmg": 2.2
        },
        "selected": {
          "name": "Visée du M45D de Kelly",
          "type": "projectile",
          "dmg": 1.85,
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
        }
      },
      "defense": {
        "historical": {
          "name": "Kelly-087 Guard",
          "type": "shield",
          "dur": 2,
          "reduce": 0.75
        },
        "selected": {
          "name": "Garde de Kelly en armure Hermes",
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
        }
      },
      "special": {
        "historical": {
          "name": "Kelly-087 Origin Burst",
          "type": "origin_aoe",
          "dmg": 4.5,
          "color": "#1f7a3f"
        },
        "selected": {
          "name": "Tir du fusil Oathsworn de Kelly",
          "type": "projectile",
          "dmg": 4.65,
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
        }
      }
    }
  },
  "linda_058": {
    "id": "linda_058",
    "universe": "Halo",
    "incarnation": "Halo 5: Guardians (2015)",
    "weaponType": "rifle",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "slots": {
      "simple": {
        "historical": {
          "name": "Linda-058 Signature Strike",
          "type": "bullet",
          "dmg": 1
        },
        "selected": {
          "name": "Tir de précision du Nornfang",
          "type": "projectile",
          "dmg": 1.15,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 480,
            "targetSide": "enemy"
          }
        }
      },
      "secondary": {
        "historical": {
          "name": "Linda-058 Breach Technique",
          "type": "projectile",
          "cd": 8,
          "dmg": 2.2
        },
        "selected": {
          "name": "Visée Argus de Linda",
          "type": "projectile",
          "dmg": 1.85,
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
        }
      },
      "defense": {
        "historical": {
          "name": "Linda-058 Guard",
          "type": "shield",
          "dur": 2,
          "reduce": 0.75
        },
        "selected": {
          "name": "Repli de Linda en armure Argus",
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
        }
      },
      "special": {
        "historical": {
          "name": "Linda-058 Origin Burst",
          "type": "origin_aoe",
          "dmg": 4.5,
          "color": "#255f3f"
        },
        "selected": {
          "name": "Tir du Nornfang de Linda",
          "type": "projectile",
          "dmg": 4.65,
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
        }
      }
    }
  },
  "ashley_williams": {
    "id": "ashley_williams",
    "universe": "Mass Effect",
    "incarnation": "Mass Effect 3 (2012), Alliance officer Ashley",
    "weaponType": "gun",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "slots": {
      "simple": {
        "historical": {
          "name": "Ashley Williams Signature Strike",
          "type": "bullet",
          "dmg": 1
        },
        "selected": {
          "name": "Tir du M8 Avenger d’Ashley",
          "type": "projectile",
          "dmg": 1.15,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 480,
            "targetSide": "enemy"
          }
        }
      },
      "secondary": {
        "historical": {
          "name": "Ashley Williams Breach Technique",
          "type": "projectile",
          "cd": 8,
          "dmg": 2.2
        },
        "selected": {
          "name": "Visée de l’officière Ashley",
          "type": "projectile",
          "dmg": 1.85,
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
        }
      },
      "defense": {
        "historical": {
          "name": "Ashley Williams Guard",
          "type": "shield",
          "dur": 2,
          "reduce": 0.75
        },
        "selected": {
          "name": "Garde de l’armure Alliance d’Ashley",
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
        }
      },
      "special": {
        "historical": {
          "name": "Ashley Williams Origin Burst",
          "type": "origin_aoe",
          "dmg": 4.5,
          "color": "#34495e"
        },
        "selected": {
          "name": "Rafale du M8 Avenger d’Ashley",
          "type": "projectile",
          "dmg": 4.65,
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
        }
      }
    }
  },
  "mordin": {
    "id": "mordin",
    "universe": "Mass Effect",
    "incarnation": "Mass Effect 2 (2010)",
    "weaponType": "omnitool",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "slots": {
      "simple": {
        "historical": {
          "name": "Mordin Solus Signature Strike",
          "type": "energy",
          "dmg": 1
        },
        "selected": {
          "name": "Projection incendiaire du omni-outil",
          "type": "projectile",
          "dmg": 1.15,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 480,
            "targetSide": "enemy"
          }
        }
      },
      "secondary": {
        "historical": {
          "name": "Mordin Solus Breach Technique",
          "type": "signature",
          "cd": 8,
          "dmg": 2.2
        },
        "selected": {
          "name": "Visée du omni-outil de Mordin",
          "type": "projectile",
          "dmg": 1.85,
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
        }
      },
      "defense": {
        "historical": {
          "name": "Mordin Solus Guard",
          "type": "shield",
          "dur": 2,
          "reduce": 0.75
        },
        "selected": {
          "name": "Retrait du scientifique Mordin",
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
        }
      },
      "special": {
        "historical": {
          "name": "Mordin Solus Origin Burst",
          "type": "origin_aoe",
          "dmg": 4.5,
          "color": "#95a5a6"
        },
        "selected": {
          "name": "Incinération du omni-outil de Mordin",
          "type": "projectile",
          "dmg": 4.65,
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
        }
      }
    }
  },
  "shephard": {
    "id": "shephard",
    "universe": "Half-Life",
    "incarnation": "Half-Life: Opposing Force (1999), Adrian Shephard HECU loadout",
    "weaponType": "gun",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "slots": {
      "simple": {
        "historical": {
          "name": "HECU Rifle Burst",
          "type": "bullet",
          "dmg": 1.05
        },
        "selected": {
          "name": "Tir de HECU submachinegun de Adrian Shephard",
          "type": "projectile",
          "dmg": 1.15,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 480,
            "targetSide": "enemy"
          }
        }
      },
      "secondary": {
        "historical": {
          "name": "Pipe Wrench Breach",
          "type": "melee",
          "cd": 6,
          "dmg": 1.8
        },
        "selected": {
          "name": "Visée de HECU submachinegun de Adrian Shephard",
          "type": "projectile",
          "dmg": 1.85,
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
        }
      },
      "defense": {
        "historical": {
          "name": "Marine Cover Order",
          "type": "shield",
          "dur": 2.1,
          "reduce": 0.78
        },
        "selected": {
          "name": "Repli de Adrian Shephard en Half-Life: Opposing Force (1999)",
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
        }
      },
      "special": {
        "historical": {
          "name": "Race X Suppression",
          "type": "explosive_aoe",
          "dmg": 4.6,
          "color": "#7f8c8d"
        },
        "selected": {
          "name": "Rafale HECU d’Adrian Shephard",
          "type": "projectile",
          "dmg": 4.65,
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
        }
      }
    }
  },
  "vortigaunt_ally": {
    "id": "vortigaunt_ally",
    "universe": "Half-Life",
    "incarnation": "Half-Life 2 (2004), freed allied Vortigaunt",
    "weaponType": "energy",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "slots": {
      "simple": {
        "historical": {
          "name": "Vortigaunt Ally Signature Strike",
          "type": "energy",
          "dmg": 1
        },
        "selected": {
          "name": "Décharge de Vortessence",
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
        }
      },
      "secondary": {
        "historical": {
          "name": "Vortigaunt Ally Breach Technique",
          "type": "signature",
          "cd": 8,
          "dmg": 2.2
        },
        "selected": {
          "name": "Concentration du Vortigaunt libre",
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
        }
      },
      "defense": {
        "historical": {
          "name": "Vortigaunt Ally Guard",
          "type": "shield",
          "dur": 2,
          "reduce": 0.75
        },
        "selected": {
          "name": "Repli du Vortigaunt allié",
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
        }
      },
      "special": {
        "historical": {
          "name": "Vortigaunt Ally Origin Burst",
          "type": "origin_aoe",
          "dmg": 4.5,
          "color": "#6f8f4f"
        },
        "selected": {
          "name": "Décharge du Vortigaunt libre",
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
        }
      }
    }
  },
  "dog_hl2": {
    "id": "dog_hl2",
    "universe": "Half-Life",
    "incarnation": "Half-Life 2 (2004), Alyx’s robot Dog",
    "weaponType": "fist",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "slots": {
      "simple": {
        "historical": {
          "name": "Dog Signature Strike",
          "type": "bullet",
          "dmg": 1
        },
        "selected": {
          "name": "Poussée du bras mécanique de Dog",
          "type": "melee",
          "dmg": 1,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "melee",
            "shape": "single",
            "range": 85,
            "targetSide": "enemy"
          }
        }
      },
      "secondary": {
        "historical": {
          "name": "Dog Breach Technique",
          "type": "projectile",
          "cd": 8,
          "dmg": 2.2
        },
        "selected": {
          "name": "Reprise de l’appui hydraulique",
          "type": "melee",
          "dmg": 1.65,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "melee",
            "shape": "single",
            "range": 85,
            "targetSide": "enemy"
          },
          "cd": 6
        }
      },
      "defense": {
        "historical": {
          "name": "Dog Guard",
          "type": "shield",
          "dur": 2,
          "reduce": 0.75
        },
        "selected": {
          "name": "Blocage des bras de Dog",
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
        }
      },
      "special": {
        "historical": {
          "name": "Dog Origin Burst",
          "type": "origin_aoe",
          "dmg": 4.5,
          "color": "#95a5a6"
        },
        "selected": {
          "name": "Coup du bras mécanique de Dog",
          "type": "melee",
          "dmg": 4.4,
          "animationDuration": 1.1,
          "hitAt": 0.451,
          "targeting": {
            "effect": "damage",
            "delivery": "melee",
            "shape": "single",
            "range": 165,
            "targetSide": "enemy"
          },
          "meterCost": 100
        }
      }
    }
  },
  "cortana": {
    "id": "cortana",
    "universe": "Halo",
    "incarnation": "Halo 3 (2007), Cortana holographic AI",
    "weaponType": "terminal",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "slots": {
      "simple": {
        "historical": {
          "name": "Cortana Signature Strike",
          "type": "energy",
          "dmg": 1
        },
        "selected": {
          "name": "Lecture tactique de Cortana",
          "type": "buff",
          "dmg": 0,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "buff",
            "delivery": "support",
            "shape": "group",
            "range": 760,
            "targetSide": "ally",
            "duration": 3,
            "buffMultiplier": 1.08
          }
        }
      },
      "secondary": {
        "historical": {
          "name": "Cortana Breach Technique",
          "type": "signature",
          "cd": 8,
          "dmg": 2.2
        },
        "selected": {
          "name": "Repérage du relais par Cortana",
          "type": "buff",
          "dmg": 0,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "buff",
            "delivery": "support",
            "shape": "group",
            "range": 760,
            "targetSide": "ally",
            "duration": 3,
            "buffMultiplier": 1.14
          },
          "cd": 6
        }
      },
      "defense": {
        "historical": {
          "name": "Cortana Guard",
          "type": "shield",
          "dur": 2,
          "reduce": 0.75
        },
        "selected": {
          "name": "Redondance de l’IA Cortana",
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
        }
      },
      "special": {
        "historical": {
          "name": "Cortana Origin Burst",
          "type": "origin_aoe",
          "dmg": 4.5,
          "color": "#4dd2ff"
        },
        "selected": {
          "name": "Guidage tactique de Cortana",
          "type": "buff",
          "dmg": 0,
          "animationDuration": 1.1,
          "hitAt": 0.451,
          "targeting": {
            "effect": "buff",
            "delivery": "support",
            "shape": "group",
            "range": 760,
            "targetSide": "ally",
            "duration": 4,
            "buffMultiplier": 1.25
          },
          "meterCost": 100
        }
      }
    }
  },
  "unreal_tournament_2004_gorge": {
    "id": "unreal_tournament_2004_gorge",
    "universe": "Unreal Tournament 2004",
    "incarnation": "Unreal Tournament 2004 (2004), PC — Gorge, Juggernaut competitor model, standard tournament armor",
    "weaponType": "gun",
    "canonStatus": "canon UT2004 competitor using shared arena weapon pickups; no personal superpower",
    "slots": {
      "simple": {
        "historical": {
          "type": "melee",
          "dmg": 1,
          "name": "Flak Cannon"
        },
        "selected": {
          "type": "projectile",
          "dmg": 1,
          "name": "Tir du Flak Cannon de Gorge",
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 480,
            "targetSide": "enemy"
          }
        }
      },
      "secondary": {
        "historical": {
          "type": "signature",
          "cd": 7,
          "dmg": 1.8,
          "name": "Gorge signature technique"
        },
        "selected": {
          "type": "projectile",
          "cd": 6,
          "dmg": 1.65,
          "name": "Visée lourde du Juggernaut",
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 480,
            "targetSide": "enemy"
          }
        }
      },
      "defense": {
        "historical": {
          "type": "dodge",
          "dur": 1.8,
          "reduce": 0.74,
          "name": "Gorge defensive action"
        },
        "selected": {
          "type": "guard",
          "dur": 1.2,
          "reduce": 0.5,
          "name": "Appui de l’armure de Gorge",
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
          }
        }
      },
      "special": {
        "historical": {
          "type": "origin_aoe",
          "dmg": 4,
          "name": "Juggernaut Charge"
        },
        "selected": {
          "type": "projectile",
          "dmg": 4.4,
          "name": "Décharge du Flak Cannon de Gorge",
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
        }
      }
    }
  },
  "unreal_tournament_2004_sapphire": {
    "id": "unreal_tournament_2004_sapphire",
    "universe": "Unreal Tournament 2004",
    "incarnation": "Unreal Tournament 2004 (2004), PC — Sapphire, Mercenary competitor model, standard tournament armor",
    "weaponType": "gun",
    "canonStatus": "canon UT2004 competitor using shared arena weapon pickups; no personal superpower",
    "slots": {
      "simple": {
        "historical": {
          "type": "melee",
          "dmg": 1,
          "name": "Shock Rifle"
        },
        "selected": {
          "type": "projectile",
          "dmg": 1,
          "name": "Orbe secondaire du Shock Rifle",
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 480,
            "targetSide": "enemy"
          }
        }
      },
      "secondary": {
        "historical": {
          "type": "signature",
          "cd": 7,
          "dmg": 1.8,
          "name": "Sapphire signature technique"
        },
        "selected": {
          "type": "projectile",
          "cd": 6,
          "dmg": 1.65,
          "name": "Visée du Shock Rifle de Sapphire",
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 480,
            "targetSide": "enemy"
          }
        }
      },
      "defense": {
        "historical": {
          "type": "dodge",
          "dur": 1.8,
          "reduce": 0.74,
          "name": "Sapphire defensive action"
        },
        "selected": {
          "type": "guard",
          "dur": 1.2,
          "reduce": 0.5,
          "name": "Dodge de Sapphire",
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
          }
        }
      },
      "special": {
        "historical": {
          "type": "origin_aoe",
          "dmg": 4,
          "name": "Shock Combo"
        },
        "selected": {
          "type": "projectile",
          "dmg": 4.4,
          "name": "Orbe du Shock Rifle de Sapphire",
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
        }
      }
    }
  },
  "unreal_tournament_2004_frostbite": {
    "id": "unreal_tournament_2004_frostbite",
    "universe": "Unreal Tournament 2004",
    "incarnation": "Unreal Tournament 2004 (2004), PC — Frostbite, Juggernaut competitor model, standard tournament armor",
    "weaponType": "gun",
    "canonStatus": "canon UT2004 competitor using shared arena weapon pickups; no personal superpower",
    "slots": {
      "simple": {
        "historical": {
          "type": "melee",
          "dmg": 1,
          "name": "Rocket Launcher"
        },
        "selected": {
          "type": "projectile",
          "dmg": 1,
          "name": "Roquette du lanceur de Frostbite",
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 480,
            "targetSide": "enemy"
          }
        }
      },
      "secondary": {
        "historical": {
          "type": "signature",
          "cd": 7,
          "dmg": 1.8,
          "name": "Frostbite signature technique"
        },
        "selected": {
          "type": "projectile",
          "cd": 6,
          "dmg": 1.65,
          "name": "Visée du lance-roquettes de Frostbite",
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 480,
            "targetSide": "enemy"
          }
        }
      },
      "defense": {
        "historical": {
          "type": "dodge",
          "dur": 1.8,
          "reduce": 0.74,
          "name": "Frostbite defensive action"
        },
        "selected": {
          "type": "guard",
          "dur": 1.2,
          "reduce": 0.5,
          "name": "Dodge de Frostbite",
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
          }
        }
      },
      "special": {
        "historical": {
          "type": "origin_aoe",
          "dmg": 4,
          "name": "Adrenaline Burst"
        },
        "selected": {
          "type": "projectile",
          "dmg": 4.4,
          "name": "Roquette de Frostbite",
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
        }
      }
    }
  }
});

export function assertCatalogActionEdition(actor, slot, historical) {
  if (Object.hasOwn(GEARS_DEADSPACE_CATALOG_EDITIONS_20261113, actor.id)) return assertGearsDeadSpaceCatalogEdition(actor, slot, historical);
  const projected = PROJECTED_SOURCE_EDITIONS_20261113[actor.id];
  if (projected) {
    for (const [field, expected] of Object.entries(projected)) {
      if (field !== 'slots') assert.deepEqual(actor[field], expected, actor.id + ': projected source ' + field + ' changed');
    }
    const revision = projected.slots[slot];
    assert.ok(revision, actor.id + ': undeclared projected slot ' + slot);
    assert.deepEqual(historical, revision.historical, actor.id + ': historical raw action changed');
    return assert.deepEqual(actor[slot], revision.selected, actor.id + ': projected W14/W15 raw action changed');
  }
  if (isLatestGitHubStarWarsCandidate(actor)) {
    const frozen = assertLatestWave13Comparison(actor);
    return assert.deepEqual(historical, frozen.hero[slot], actor.id + ': frozen W13 raw action changed');
  }
  const edition = RAW_CANONICAL_EDITIONS[actor.id], revision = edition?.slots[slot];
  if (!revision) return assert.deepEqual(actor[slot], historical, actor.id + ':' + slot);
  assert.equal(actor.universe, edition.universe, actor.id + ': unexpected canonical universe');
  assert.equal(actor.incarnation, edition.incarnation, actor.id + ': unexpected canonical incarnation');
  assert.deepEqual(historical, revision.historical, actor.id + ': historical raw action changed');
  assert.deepEqual(actor[slot], revision.selected, actor.id + ': selected master raw action changed');
}

export function assertBaseSpriteEdition(actor, historical, actualSrc) {
  assert.equal(hash(read('public' + historical.sheet)), historical.sha256, actor.id + ': historical atlas bytes changed');
  const edition = CANONICAL_BASE_EDITIONS[actor.id];
  if (!edition) return assert.equal(actualSrc, historical.sheet, actor.id);
  assert.equal(actor.universe, edition.universe, actor.id + ': unexpected canonical universe');
  const retained = edition.historicalAtlases.find(entry => entry.sheet === historical.sheet);
  assert.ok(retained, actor.id + ': undeclared historical atlas');
  assert.equal(historical.sha256, retained.sha256, actor.id + ': historical registry fingerprint changed');
  assert.equal(actualSrc, edition.src, actor.id + ': selected canonical PNG changed');
  assert.equal(hash(read('public' + edition.src)), edition.sha256, actor.id + ': selected canonical PNG bytes changed');
}

export function historicalWave13Actor(current, frozen, source) {
  if (isLatestGitHubStarWarsCandidate(current)) {
    const retained = assertLatestWave13Comparison(current);
    assert.deepEqual(frozen, retained.hero, current.id + ': frozen W13 actor changed');
    assert.deepEqual(source, retained.source, current.id + ': frozen W13 source changed');
    return { ...structuredClone(frozen), weaponType: source.weaponType,
      incarnation: source.sourceWork, canonCombatPresentation: false };
  }
  if (!['liquid_snake', 'ripley', 'darth_maul'].includes(current.id)) return current;
  assert.equal(frozen.id, current.id); assert.equal(source.universe, current.universe);
  if (current.id === 'darth_maul') {
    assert.equal(current.incarnation, 'The Clone Wars - ruler of Mandalore');
    assert.deepEqual(current.equipment, ['Double-Bladed Red Lightsaber', 'Cybernetic Legs', 'Mandalore Command Seal']);
  }
  for (const slot of ['simple', 'secondary', 'defense', 'special']) assertCatalogActionEdition(current, slot, frozen[slot]);
  return { ...structuredClone(frozen), weaponType: source.weaponType,
    incarnation: source.sourceWork, canonCombatPresentation: false };
}

export function assertCatalogWeaponEdition(actor, historicalWeaponType) {
  if (isLatestGitHubStarWarsCandidate(actor)) {
    const frozen = assertLatestWave13Comparison(actor);
    assert.equal(historicalWeaponType, frozen.source.weaponType, actor.id + ': frozen W13 weapon changed');
    return;
  }
  if (actor.id === 'darth_maul' && actor.incarnation === 'The Clone Wars - ruler of Mandalore') {
    assert.equal(actor.universe, 'Star Wars');
    assert.deepEqual(actor.equipment, ['Double-Bladed Red Lightsaber', 'Cybernetic Legs', 'Mandalore Command Seal']);
    assert.equal(historicalWeaponType, 'lightsaber');
    assert.equal(actor.weaponType, 'double_lightsaber');
    return;
  }
  if (actor.id !== 'liquid_snake') return assert.equal(actor.weaponType, historicalWeaponType, actor.id);
  assert.equal(actor.universe, 'Metal Gear');
  assert.equal(actor.incarnation, RAW_CANONICAL_EDITIONS.liquid_snake.incarnation);
  assert.equal(historicalWeaponType, 'fist');
  assert.equal(actor.weaponType, 'fists');
}

// These native bodies already depict the current source incarnation. Master's
// older shared PNG remains retained reference evidence, not the selected body.
export const NATIVE_SOURCE_BASE_EDITIONS = Object.freeze({
  luke: {
    universe: 'Star Wars', incarnation: 'Star Wars: Return of the Jedi (1983) - Death Star II Jedi Knight',
    sourceWork: 'Star Wars: Return of the Jedi (1983), adult Luke Skywalker aboard the second Death Star',
    registry: 'src/game/combat/characterSpriteCorrectionsWave13PartB.generated.json',
    src: '/sprites/generated/combat-character-corrections-wave13-part-b/luke.png',
    sha256: '5feee4bf4b31609d48bb1f74ab848f6c998ab98885dc1d896d793554128be775',
    reference: '/sprites/generated/heroes/star-wars/luke.png',
    referenceSha256: 'e7c5dc6bdf10918c7c5d63c31a27f5c6c799fe04c0aba35160edd55021e3e650'
  },
  han_solo: {
    universe: 'Star Wars', incarnation: 'Star Wars: A New Hope (1977) - Mos Eisley / Death Star escape',
    sourceWork: 'Star Wars: EpisodeIV — A New Hope (1977), black vest and DL-44 heavy blaster pistol',
    registry: 'src/game/combat/characterSpriteCorrectionsWave7PartB.generated.json',
    src: '/sprites/generated/combat-character-corrections-wave7/han_solo.png',
    sha256: '422985c683664f21278d6e5698346450502479c050c93392199ed5e1ff916be1',
    reference: '/sprites/generated/heroes/star-wars/han-solo.png',
    referenceSha256: '1155787614f9d471c76709485a32f8fe0dc7f43a8244dde3d1428f8594941c3f'
  },
  ripley_aliens: {
    universe: 'Aliens', incarnation: 'Aliens (1986) - LV-426 / Sulaco', sourceWork: 'Aliens (1986)',
    registry: 'src/game/combat/characterSpriteCorrectionsWave10PartC.generated.json',
    src: '/sprites/generated/combat-character-corrections-wave10/ripley_aliens.png',
    sha256: '96dea9a4ebb1c2fbfead1b0b3271f2efb4939f490390a3d2b5956572458b62e9',
    reference: '/sprites/generated/heroes/aliens/ripley-aliens.png',
    referenceSha256: '1a287c731c1972da8c1fc01ca795430eb329b11993be05fc3cdfe6d298c51661'
  },
  freeman: {
    universe: 'Half-Life', incarnation: 'Half-Life 2 (2004) - HEV Mark V / Citadel', sourceWork: 'Half-Life 2 (2004), Citadel finale',
    registry: 'src/game/combat/characterSpriteCorrectionsWave10PartB.generated.json',
    src: '/sprites/generated/combat-character-corrections-wave10/freeman.png',
    sha256: 'f60ffe51362337694fce06bcc9d123c7a704309addabef4fe56c72df49f51ae0',
    reference: '/sprites/generated/heroes/half-life/freeman.png',
    referenceSha256: '88f9e1269f442c9eb805f78bfd776ebd5cdbe6aba85fbc57db390464d443fd28'
  }
});

export function assertNativeSourceBaseEdition(actor, actualSrc) {
  const id = actor.sourceHeroId || actor.sourceId || actor.id, edition = NATIVE_SOURCE_BASE_EDITIONS[id];
  assert.ok(edition, id + ': undeclared native source edition');
  assert.equal(actor.universe, edition.universe, id + ': wrong source universe');
  assert.equal(actor.incarnation, edition.incarnation, id + ': wrong source incarnation');
  assert.equal(actualSrc, edition.src, id + ': source-correct native base was replaced');
  const entry = JSON.parse(read(edition.registry)).entries.find(row => row.heroId === id);
  assert.ok(entry, id + ': missing native source registry');
  assert.equal(entry.universe, edition.universe); assert.equal(entry.sourceWork, edition.sourceWork);
  assert.equal(entry.sheet, edition.src); assert.equal(entry.sha256, edition.sha256);
  assert.equal(entry.referenceAsset, edition.reference); assert.equal(entry.referenceAssetSha256, edition.referenceSha256);
  assert.equal(entry.frames, 16); assert.equal(entry.columns, 4); assert.equal(entry.rows, 4);
  assert.equal(entry.normalization.baseline, 244);
  assert.equal(entry.visualValidation.canon1to1Verified, false);
  assert.equal(hash(read('public' + edition.src)), edition.sha256, id + ': native base PNG changed');
  assert.equal(hash(read('public' + edition.reference)), edition.referenceSha256, id + ': retained master PNG changed');
}

// Closed two-field source erratum. Full current source data remain exact.
export const HAMMOND_PULSE_RIFLE_SOURCE_ERRATUM_20261113 = Object.freeze({
  "actorId": "zach_hammond",
  "source": "Original Dead Space2008 source label correction only; SWS is Pulse Rifle,211-V is Plasma Cutter. No historical source plan rewritten.",
  "fields": [
    "weapon",
    "pose"
  ],
  "historical": {
    "universe": "Dead Space",
    "sourceWork": "Dead Space (2008), security chief Zach Hammond",
    "appearance": "Adult Black man, close-cropped hair, dark brown security RIG with blue spine lights, original 2008 outfit and pulse rifle; not remake armour",
    "weapon": "211-V plasma pulse rifle",
    "actionName": "Rafale du Pulse Rifle de Hammond",
    "effect": "damage",
    "delivery": "projectile",
    "pose": "Brace 211-V plasma pulse rifle, aim, tiny attached muzzle flash at the physical barrel tip on release only, recoil, recover; no floating projectile or beam",
    "bodyHeight": 195,
    "sourceReference": "https://deadspace.fandom.com/wiki/Zach_Hammond",
    "source1to1Verified": false,
    "networkVerified": false,
    "name": "Rafale du Pulse Rifle de Hammond",
    "kind": "hammond-pulse-rifle",
    "weaponType": "gun"
  },
  "current": {
    "universe": "Dead Space",
    "sourceWork": "Dead Space (2008), security chief Zach Hammond",
    "appearance": "Adult Black man, close-cropped hair, dark brown security RIG with blue spine lights, original 2008 outfit and pulse rifle; not remake armour",
    "weapon": "SWS Motorized Pulse Rifle",
    "actionName": "Rafale du Pulse Rifle de Hammond",
    "effect": "damage",
    "delivery": "projectile",
    "pose": "Brace SWS Motorized Pulse Rifle, aim, tiny attached muzzle flash at the physical barrel tip on release only, recoil, recover; no floating projectile or beam",
    "bodyHeight": 195,
    "sourceReference": "https://deadspace.fandom.com/wiki/Zach_Hammond",
    "source1to1Verified": false,
    "networkVerified": false,
    "name": "Rafale du Pulse Rifle de Hammond",
    "kind": "hammond-pulse-rifle",
    "weaponType": "gun"
  }
});
export function assertHammondPulseRifleSourceField(actorId, current, historical, field) {
  const correction = HAMMOND_PULSE_RIFLE_SOURCE_ERRATUM_20261113;
  assert.equal(actorId, correction.actorId, 'Only the exact Hammond source receives this erratum');
  assert.ok(correction.fields.includes(field), 'Only weapon/pose receive the Hammond label erratum');
  assert.deepEqual(current, correction.current, 'Hammond current source changed outside exact SWS correction');
  for (const key of ['universe', 'sourceWork', 'appearance', 'weaponType', 'sourceReference']) {
    assert.deepEqual(historical[key], correction.historical[key], 'Hammond historical source identity changed: ' + key);
  }
  assert.deepEqual(historical[field], correction.historical[field], 'Hammond historical label must remain retained: ' + field);
  assert.deepEqual(current[field], correction.current[field], 'Hammond corrected SWS label changed: ' + field);
}
