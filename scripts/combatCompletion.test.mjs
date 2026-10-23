import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import sharp from 'sharp';

import { HEROES_DB } from '../src/game/heroes.js';
import { COMBAT_CAPABILITY_COMPLETION } from '../src/game/combat/completion/catalog.js';
import { resolveMeleeSuper, resolveUniverseSummon } from '../src/game/combatIdentity.js';
import { attachCombatEntityAsset, getCombatEntityFrame, resolveCombatEntityAsset } from '../src/game/combat/entityAssets.js';

// This snapshot predates completion. Coverage is measured against its exact
// identities, rather than a count reconstructed from the new implementation.
const baseline = JSON.parse(readFileSync(new URL('../docs/combat-completion-2026-10-18/baseline.json', import.meta.url), 'utf8'));
const decisiveBaseline = JSON.parse(readFileSync(new URL('../docs/combat-completion-2026-10-18/decisive-baseline.json', import.meta.url), 'utf8'));
const completedIdentities = [...baseline.genericCapabilities, ...decisiveBaseline];
const entityRegistry = JSON.parse(readFileSync(new URL('../src/game/combat/entityAssets.generated.json', import.meta.url), 'utf8'));
const roster = new Map(HEROES_DB.map(hero => [hero.id, hero]));
const genericName = /origin\s+burst|signature\s+strike|breach\s+technique|decisive\s+action/i;
const supportEffects = new Set(['heal', 'guard', 'buff', 'cleanse', 'revive']);
const identityBases = new Set(['canonical-technique', 'canonical-role', 'authored-universe-canon']);
const sorted = values => [...values].sort();
const sha256 = value => createHash('sha256').update(value).digest('hex');
const readProjectFile = path => readFileSync(new URL(`../${path}`, import.meta.url));
// These three completed identities later selected an explicit source version.
// Axl also replaces the ordinary Rensen Geki super with the Xrd Overdrive.
const wave7CompletedRevisions = {
  hazama_bb: { work: 'BlazBlue: Continuum Shift Extend (2011)', name: 'Eternal Coils of the Dragon Serpent', basis: 'canonical-technique', reference: /Chosen costume and technique continuity: Continuum Shift Extend/ },
  dizzy_gg: { work: 'Guilty Gear Xrd REV 2 (2017)', name: 'Gamma Ray de Dizzy', basis: 'canonical-technique', reference: /Chosen Xrd REV 2 costume and equipment/ },
  axl_gg: { work: 'Guilty Gear Xrd REV 2 (2017)', name: 'Sickle Storm', basis: 'canonical-role', reference: /Sickle Storm is an Xrd Overdrive/ }
};

// Only these twelve later source-version selections may extend the immutable
// completion references. Their original technique, role and source prefix stay.
const wave8CompletedRevisions = {
  laios_meshi: ['Dungeon Meshi (2024 animated series), human exploration party', 'Coupe de Kensuke', 'canonical-role'],
  marcille_meshi: ['Dungeon Meshi (2024 animated series), human exploration party', 'Explosion magique de Marcille', 'canonical-technique'],
  senshi_meshi: ['Dungeon Meshi (2024 animated series), human exploration party', 'Repas équilibré du donjon', 'canonical-role'],
  chilchuck_meshi: ['Dungeon Meshi (2024 animated series), human exploration party', 'Désamorçage des pièges de Chilchuck', 'canonical-role'],
  falin_meshi: ['Dungeon Meshi (2024 animated series), human exploration party', 'Magie de soin de Falin', 'canonical-technique'],
  blade_wolf_mgr: ['Metal Gear Rising: Revengeance (2013)', 'Coupe de la scie caudale', 'canonical-role'],
  jetstream_sam: ['Metal Gear Rising: Revengeance (2013)', 'Iai de Murasama', 'canonical-technique'],
  kiryu_yakuza: ['Yakuza Kiwami (2016)', 'Coup du Dragon de Dojima', 'canonical-role'],
  majima_yakuza: ['Yakuza Kiwami (2016)', 'Style Mad Dog — coupe au tantō', 'canonical-technique'],
  ichiban_yakuza: ['Yakuza: Like a Dragon (2020)', 'Giga Swing', 'canonical-technique'],
  saejima_yakuza: ['Yakuza 5 (2012)', 'Herculean Spirit', 'canonical-technique'],
  akiyama_yakuza: ['Yakuza 5 (2012)', 'Launch Strike', 'canonical-technique']
};

// W9 changes seven of the completed identities to explicit source versions.
// Three source-role corrections replace a later-era fortification reference,
// an Attack Drone deployment explosion, and an incorrectly shared Barrier.
// Historical completion records and their baseline remain immutable.
const wave9CompletedRevisions = {
  baird: { work: 'Gears of War 2 (2008)', name: 'Maintenance du matériel COG', basis: 'canonical-role', reference: /Selected young GoW2 Baird/ },
  hoffman_cog: { work: 'Gears of War 2 (2008)', name: 'Ordre de mise en défense de Hoffman', basis: 'canonical-role', reference: /Selected GoW2 Colonel/ },
  tali: { work: 'Mass Effect 2 (2010)', name: 'Drone de combat de Tali', basis: 'canonical-role', reference: /Selected ME2 sealed/ },
  wrex: { work: 'Mass Effect (2007)', name: 'Barrière biotique de Wrex', basis: 'canonical-role', reference: /Selected ME1 heavy red/ },
  aramaki: { work: 'Ghost in the Shell: Stand Alone Complex (2002), season 1', name: "Autorisation d'opération de la Section 9", basis: 'canonical-role', reference: /SAC season1 \(2002\): Daisuke Aramaki/ },
  saito_gits: { work: 'Ghost in the Shell: Stand Alone Complex (2002), season 1', name: 'Œil de faucon — tir de précision', basis: 'canonical-technique', reference: /SAC season1 \(2002\): the official character/ },
  carlos_oliveira: { work: 'Resident Evil 3 remake (2020)', name: 'Rafale du CQBR de Carlos', basis: 'canonical-role', reference: /Carlos in the2020 remake/ }
};

// W10 selects these23 explicit source versions. Historical completion actions
// remain immutable, including the supers corrected below by a resolved overlay.
const wave10CompletedRevisions = {
  agent_smith: { work: 'The Matrix Reloaded (2003)', name: 'Enchaînement physique de Smith', basis: 'canonical-role', reference: /Reloaded Smith is the dark-suited/ },
  hammond_sgc: { work: 'Stargate SG-1 — saison 4 (2000–2001)', name: 'Autorisation d’extraction du SGC', basis: 'canonical-role', reference: /Season-four General George Hammond/ },
  eli_vance: { work: 'Half-Life 2 (2004), Black Mesa East', name: 'Coordination de Black Mesa East', basis: 'canonical-role', reference: /left below-knee prosthetic leg/ },
  kleiner: { work: 'Half-Life 2 (2004), Kleiner’s laboratory', name: 'Calibration du téléporteur', basis: 'canonical-role', reference: /lab-coated Resistance scientist/ },
  dogmeat: { work: 'Fallout 4 (2015), German Shepherd companion', name: 'Prise de Dogmeat', basis: 'canonical-role', reference: /real four-legged German Shepherd/ },
  piper_wright: { work: 'Fallout 4 (2015), Publick Occurrences journalist', name: 'Publick Occurrences — vérité publiée', basis: 'canonical-role', reference: /actual 10mm pistol/ },
  preston_garvey: { work: 'Fallout 4 (2015), Commonwealth Minutemen', name: 'Mousquet laser des Minutemen', basis: 'canonical-role', reference: /crank-charged laser musket/ },
  hicks_aliens: { work: 'Aliens (1986), Corporal Dwayne Hicks', name: 'Rafale M41A de Hicks', basis: 'canonical-role', reference: /Michael Biehn likeness selected/ },
  vasquez_aliens: { work: 'Aliens (1986), Private Jenette Vasquez', name: 'M56 Smartgun de Vasquez', basis: 'canonical-role', reference: /Jenette Goldstein likeness selected/ },
  bishop_aliens: { work: 'Aliens (1986), Bishop synthetic', name: 'Extraction par la seconde navette', basis: 'canonical-role', reference: /Lance Henriksen likeness selected/ },
  ripley_aliens: { work: 'Aliens (1986), human Ellen Ripley', name: 'P-5000 Power Loader', basis: 'canonical-role', reference: /visible human operator/ },
  hudson_aliens: { work: 'Aliens (1986), Private William Hudson', name: 'Contact au détecteur de mouvement', basis: 'canonical-role', reference: /Bill Paxton likeness selected/ },
  chains_pd: { work: 'PAYDAY 2 (2013), Chains with selected KSP loadout', name: 'Couverture lourde de Chains', basis: 'canonical-role', reference: /actual available KSP/ },
  clover_pd: { work: 'PAYDAY 2 (2013), Clover Character Pack (2014)', name: 'Approche discrète de Clover', basis: 'canonical-role', reference: /white\/green default mask/ },
  venkman_gb: { work: 'Ghostbusters (1984)', name: 'Effluve protonique de Venkman', basis: 'canonical-role', reference: /1984 Peter Venkman/ },
  stantz_gb: { work: 'Ghostbusters (1984)', name: 'Mise en place du piège à fantôme', basis: 'canonical-role', reference: /1984 Ray Stantz/ },
  zeddemore_gb: { work: 'Ghostbusters (1984)', name: 'Effluve de couverture de Winston', basis: 'canonical-role', reference: /1984 Winston Zeddemore/ },
  spengler_gb: { work: 'Ghostbusters (1984)', name: 'Lecture du PKE Meter', basis: 'canonical-role', reference: /1984 Egon Spengler/ },
  bill_l4d: { work: 'Left 4 Dead (2008)', name: 'Couverture du vétéran Bill', basis: 'canonical-role', reference: /grey-bearded veteran in green beret/ },
  ellis_l4d: { work: 'Left 4 Dead 2 (2009)', name: 'Remise en route par Ellis', basis: 'canonical-role', reference: /yellow mechanic T-shirt/ },
  coach_l4d: { work: 'Left 4 Dead 2 (2009)', name: 'Consignes de Coach', basis: 'canonical-role', reference: /purple\/yellow polo/ },
  rochelle_l4d: { work: 'Left 4 Dead 2 (2009)', name: 'Repérage du trajet d’extraction', basis: 'canonical-role', reference: /pink band T-shirt/ },
  nick_l4d: { work: 'Left 4 Dead 2 (2009)', name: 'Double pistolet de Nick', basis: 'canonical-role', reference: /light suit over an open blue shirt/ }
};

// Explicit W11 version selections. Immutable completion techniques remain checked
// against their captured historical name/work; only the resolved overlay changes.
const wave11CompletedRevisions = {
  "buffy_summers": {
    "work": "Buffy saison7, après retrait de la puce de Spike et avant la faux/amulette finale",
    "name": "Enchaînement au pieu de Buffy",
    "basis": "canonical-role",
    "referencePrefix": "Season seven, after Spike’s chip removal and before the final Scythe/amu",
    "historicalSpecial": "Pieu de la Tueuse",
    "historicalWork": "Buffy the Vampire Slayer (1997–2003)",
    "historicalSemantics": {
      "effect": "damage",
      "shape": "single",
      "targetSide": "enemy",
      "damage": 4.9
    },
    "selectedSemantics": {
      "effect": "damage",
      "delivery": "melee",
      "shape": "single",
      "targetSide": "enemy",
      "multiplier": 4.9
    }
  },
  "willow_rosenberg": {
    "work": "Buffy saison7, après retrait de la puce de Spike et avant la faux/amulette finale",
    "name": "Protection de Willow",
    "basis": "canonical-role",
    "referencePrefix": "Season-seven auburn-haired Willow practices controlled protective witchc",
    "historicalSpecial": "Cercle de concentration de Willow",
    "historicalWork": "Buffy the Vampire Slayer, Choices (1999)",
    "historicalSemantics": {
      "effect": "guard",
      "shape": "group",
      "targetSide": "ally",
      "damage": 0
    },
    "selectedSemantics": {
      "effect": "guard",
      "delivery": "support",
      "shape": "group",
      "targetSide": "ally",
      "multiplier": 0
    }
  },
  "giles_buffy": {
    "work": "Buffy saison7, après retrait de la puce de Spike et avant la faux/amulette finale",
    "name": "Couverture à l’arbalète de Giles",
    "basis": "canonical-role",
    "referencePrefix": "Season-seven Rupert Giles is a human Watcher with glasses, research know",
    "historicalSpecial": "Recherche de l’Observateur",
    "historicalWork": "Buffy the Vampire Slayer (1997–2003)",
    "historicalSemantics": {
      "effect": "buff",
      "shape": "group",
      "targetSide": "ally",
      "damage": 0
    },
    "selectedSemantics": {
      "effect": "damage",
      "delivery": "projectile",
      "shape": "single",
      "targetSide": "enemy",
      "multiplier": 4.4
    }
  },
  "xander_buffy": {
    "work": "Buffy saison7, après retrait de la puce de Spike et avant la faux/amulette finale",
    "name": "Mise à couvert de Xander",
    "basis": "canonical-role",
    "referencePrefix": "Season-seven human Xander, selected before Caleb’s eye injury, helps com",
    "historicalSpecial": "Je reste avec toi",
    "historicalWork": "Buffy the Vampire Slayer, Grave (2002)",
    "historicalSemantics": {
      "effect": "cleanse",
      "shape": "group",
      "targetSide": "ally",
      "damage": 0
    },
    "selectedSemantics": {
      "effect": "guard",
      "delivery": "support",
      "shape": "group",
      "targetSide": "ally",
      "multiplier": 0
    }
  },
  "harry_potter": {
    "work": "Harry Potter et le Prince de sang-mêlé, roman2005/film2009, versions explicites des cinq personnages",
    "name": "Stupéfix de Harry",
    "basis": "canonical-role",
    "referencePrefix": "Half-Blood Prince Harry, in his sixth-year Gryffindor uniform, casts the",
    "historicalSpecial": "Expecto Patronum",
    "historicalWork": "Harry Potter",
    "historicalSemantics": {
      "effect": "guard",
      "shape": "group",
      "targetSide": "ally",
      "damage": 0
    },
    "selectedSemantics": {
      "effect": "damage",
      "delivery": "projectile",
      "shape": "single",
      "targetSide": "enemy",
      "multiplier": 4.6
    }
  },
  "hermione_granger": {
    "work": "Harry Potter et le Prince de sang-mêlé, roman2005/film2009, versions explicites des cinq personnages",
    "name": "Protego d’Hermione",
    "basis": "canonical-role",
    "referencePrefix": "Half-Blood Prince Hermione uses her wand, studied spell knowledge and Pr",
    "historicalSpecial": "Protego Totalum",
    "historicalWork": "Harry Potter",
    "historicalSemantics": {
      "effect": "guard",
      "shape": "group",
      "targetSide": "ally",
      "damage": 0
    },
    "selectedSemantics": {
      "effect": "guard",
      "delivery": "support",
      "shape": "group",
      "targetSide": "ally",
      "multiplier": 0
    }
  },
  "ron_weasley": {
    "work": "Harry Potter et le Prince de sang-mêlé, roman2005/film2009, versions explicites des cinq personnages",
    "name": "Stupéfix de Ron",
    "basis": "canonical-role",
    "referencePrefix": "Half-Blood Prince Ron uses a wooden wand and the red Stunning Spell, nev",
    "historicalSpecial": "Stupefix de Ron",
    "historicalWork": "Harry Potter",
    "historicalSemantics": {
      "effect": "damage",
      "shape": "line",
      "targetSide": "enemy",
      "damage": 3.1
    },
    "selectedSemantics": {
      "effect": "damage",
      "delivery": "projectile",
      "shape": "single",
      "targetSide": "enemy",
      "multiplier": 4.5
    }
  },
  "dumbledore": {
    "work": "Harry Potter et le Prince de sang-mêlé, roman2005/film2009, versions explicites des cinq personnages",
    "name": "Tempête de feu de Dumbledore",
    "basis": "canonical-role",
    "referencePrefix": "Half-Blood Prince Dumbledore, with grey/silver robes and his blackened r",
    "historicalSpecial": "Cercle de feu de Dumbledore",
    "historicalWork": "Harry Potter",
    "historicalSemantics": {
      "effect": "damage",
      "shape": "area",
      "targetSide": "enemy",
      "damage": 3.8
    },
    "selectedSemantics": {
      "effect": "damage",
      "delivery": "area",
      "shape": "area",
      "targetSide": "enemy",
      "multiplier": 4.8
    }
  },
  "snape": {
    "work": "Harry Potter et le Prince de sang-mêlé, roman2005/film2009, versions explicites des cinq personnages",
    "name": "Protego de Rogue",
    "basis": "canonical-role",
    "referencePrefix": "Half-Blood Prince Severus Snape wears his plain black buttoned coat and ",
    "historicalSpecial": "Contre-sort non verbal de Rogue",
    "historicalWork": "Harry Potter",
    "historicalSemantics": {
      "effect": "guard",
      "shape": "single",
      "targetSide": "self",
      "damage": 0
    },
    "selectedSemantics": {
      "effect": "guard",
      "delivery": "support",
      "shape": "group",
      "targetSide": "ally",
      "multiplier": 0
    }
  },
  "sheppard_sga": {
    "work": "Stargate Atlantis saison3 (2006–2007), avant les nanites et la fin de Weir",
    "name": "Rafale au P90 de Sheppard",
    "basis": "canonical-role",
    "referencePrefix": "Sheppard carries a real FN P90 during Atlantis field missions; Sateda de",
    "historicalSpecial": "P90 de Sheppard",
    "historicalWork": "Stargate Atlantis (2004–2009)",
    "historicalSemantics": {
      "effect": "damage",
      "shape": "single",
      "targetSide": "enemy",
      "damage": 4.5
    },
    "selectedSemantics": {
      "effect": "damage",
      "delivery": "projectile",
      "shape": "single",
      "targetSide": "enemy",
      "multiplier": 4.5
    }
  },
  "mckay_sga": {
    "work": "Stargate Atlantis saison3 (2006–2007), avant les nanites et la fin de Weir",
    "name": "Diagnostic de terrain de McKay",
    "basis": "canonical-role",
    "referencePrefix": "McKay diagnoses Ancient technology through real consoles and portable co",
    "historicalSpecial": "Solution technique de McKay",
    "historicalWork": "Stargate Atlantis (2004–2009), Ancient technology research",
    "historicalSemantics": {
      "effect": "buff",
      "shape": "group",
      "targetSide": "ally",
      "damage": 0
    },
    "selectedSemantics": {
      "effect": "guard",
      "delivery": "support",
      "shape": "group",
      "targetSide": "ally",
      "multiplier": 0
    }
  },
  "teyla_sga": {
    "work": "Stargate Atlantis saison3 (2006–2007), avant les nanites et la fin de Weir",
    "name": "Enchaînement athosien de Teyla",
    "basis": "canonical-role",
    "referencePrefix": "Teyla practises Athosian bantos fighting with one or two wooden rods; th",
    "historicalSpecial": "Bâtons bantos de Teyla",
    "historicalWork": "Stargate Atlantis (2004–2009), Athosian bantos training",
    "historicalSemantics": {
      "effect": "damage",
      "shape": "single",
      "targetSide": "enemy",
      "damage": 4.6
    },
    "selectedSemantics": {
      "effect": "damage",
      "delivery": "melee",
      "shape": "single",
      "targetSide": "enemy",
      "multiplier": 4.7
    }
  },
  "rush_sgu": {
    "work": "Stargate Universe saison1 (2009–2010), personnages humains et équipement de cette saison",
    "name": "Lecture des systèmes par Rush",
    "basis": "canonical-role",
    "referencePrefix": "Rush studies Destiny interfaces and computes the ship systems using real",
    "historicalSpecial": "Interface des Anciens de Rush",
    "historicalWork": "Stargate Universe",
    "historicalSemantics": {
      "effect": "buff",
      "shape": "group",
      "targetSide": "ally",
      "damage": 0
    },
    "selectedSemantics": {
      "effect": "buff",
      "delivery": "support",
      "shape": "group",
      "targetSide": "ally",
      "multiplier": 0
    }
  },
  "young_sgu": {
    "work": "Stargate Universe saison1 (2009–2010), personnages humains et équipement de cette saison",
    "name": "Ordres de couverture de Young",
    "basis": "canonical-role",
    "referencePrefix": "Young commands the stranded crew and assigns field missions. His selecte",
    "historicalSpecial": "Ordre de protection du Destiny",
    "historicalWork": "Stargate Universe",
    "historicalSemantics": {
      "effect": "guard",
      "shape": "group",
      "targetSide": "ally",
      "damage": 0
    },
    "selectedSemantics": {
      "effect": "guard",
      "delivery": "support",
      "shape": "group",
      "targetSide": "ally",
      "multiplier": 0
    }
  },
  "greer_sgu": {
    "work": "Stargate Universe saison1 (2009–2010), personnages humains et équipement de cette saison",
    "name": "Rafale de couverture de Greer",
    "basis": "canonical-role",
    "referencePrefix": "Greer is a Black US Marine using physical firearms in season1. Both G36K",
    "historicalSpecial": "Rafale du fusil de Greer",
    "historicalWork": "Stargate Universe",
    "historicalSemantics": {
      "effect": "damage",
      "shape": "single",
      "targetSide": "enemy",
      "damage": 3.4
    },
    "selectedSemantics": {
      "effect": "damage",
      "delivery": "projectile",
      "shape": "single",
      "targetSide": "enemy",
      "multiplier": 4.6
    }
  },
  "lilith_borderlands": {
    "work": "Borderlands (2009), quatre chasseurs originaux et CL4P-TP ; pas de compétences du Pré-Sequel/BL2 transférées",
    "name": "Phasewalk de Lilith",
    "basis": "canonical-role",
    "referencePrefix": "Borderlands2009 Siren Lilith uses an ordinary equipped SMG for her simpl",
    "historicalSpecial": "Sortie de Marche de phase",
    "historicalWork": "Borderlands",
    "historicalSemantics": {
      "effect": "damage",
      "shape": "area",
      "targetSide": "enemy",
      "damage": 3.3
    },
    "selectedSemantics": {
      "effect": "damage",
      "delivery": "area",
      "shape": "area",
      "targetSide": "enemy",
      "multiplier": 4.7
    }
  },
  "mordecai_borderlands": {
    "work": "Borderlands (2009), quatre chasseurs originaux et CL4P-TP ; pas de compétences du Pré-Sequel/BL2 transférées",
    "name": "Tir de précision de Mordecai",
    "basis": "canonical-role",
    "referencePrefix": "Borderlands2009 Hunter Mordecai keeps his original leather mask/cowl and",
    "historicalSpecial": "Attaque de Bloodwing",
    "historicalWork": "Borderlands",
    "historicalSemantics": {
      "effect": "damage",
      "shape": "area",
      "targetSide": "enemy",
      "damage": 3.3
    },
    "selectedSemantics": {
      "effect": "damage",
      "delivery": "projectile",
      "shape": "single",
      "targetSide": "enemy",
      "multiplier": 4.9
    }
  },
  "claptrap_borderlands": {
    "work": "Borderlands (2009), quatre chasseurs originaux et CL4P-TP ; pas de compétences du Pré-Sequel/BL2 transférées",
    "name": "Appel de service de Claptrap",
    "basis": "canonical-role",
    "referencePrefix": "Borderlands2009 yellow CL4P-TP is the small monowheel service NPC, not t",
    "historicalSpecial": "VaultHunter.EXE — Funzerker",
    "historicalWork": "Borderlands",
    "historicalSemantics": {
      "effect": "buff",
      "shape": "single",
      "targetSide": "self",
      "damage": 0
    },
    "selectedSemantics": {
      "effect": "buff",
      "delivery": "support",
      "shape": "group",
      "targetSide": "ally",
      "multiplier": 0
    }
  },
  "toast_mm": {
    "work": "Mad Max: Fury Road (2015), équipements portatifs ; aucun véhicule créé par Canvas",
    "name": "Vérification des munitions par Toast",
    "basis": "canonical-role",
    "referencePrefix": "Mad Max Fury Road2015 Toast the Knowing is the adult woman played by Zoe",
    "historicalSpecial": "Tir de couverture de Toast",
    "historicalWork": "Mad Max: Fury Road (2015)",
    "historicalSemantics": {
      "effect": "damage",
      "shape": "single",
      "targetSide": "enemy",
      "damage": 4.2
    },
    "selectedSemantics": {
      "effect": "buff",
      "delivery": "support",
      "shape": "group",
      "targetSide": "ally",
      "multiplier": 0
    }
  },
  "capable_mm": {
    "work": "Mad Max: Fury Road (2015), équipements portatifs ; aucun véhicule créé par Canvas",
    "name": "Assistance au passage de Capable",
    "basis": "canonical-role",
    "referencePrefix": "Mad Max Fury Road2015 Capable is the adult red-haired woman played by Ri",
    "historicalSpecial": "Faire confiance à Nux",
    "historicalWork": "Mad Max: Fury Road (2015)",
    "historicalSemantics": {
      "effect": "buff",
      "shape": "group",
      "targetSide": "ally",
      "damage": 0
    },
    "selectedSemantics": {
      "effect": "guard",
      "delivery": "support",
      "shape": "group",
      "targetSide": "ally",
      "multiplier": 0
    }
  },
  "zorg": {
    "work": "Le Cinquième Élément (1997) ; ZF-1 attribué à Zorg, pistolet ordinaire à Korben",
    "name": "Rafale du ZF-1 de Zorg",
    "basis": "canonical-role",
    "referencePrefix": "Jean-Baptiste Emanuel Zorg demonstrates the physical multifunction ZF-1 ",
    "historicalSpecial": "Tir de roquette du ZF-1",
    "historicalWork": "Le Cinquième Élément / The Fifth Element (1997)",
    "historicalSemantics": {
      "effect": "damage",
      "shape": "area",
      "targetSide": "enemy",
      "damage": 4.5
    },
    "selectedSemantics": {
      "effect": "damage",
      "delivery": "projectile",
      "shape": "single",
      "targetSide": "enemy",
      "multiplier": 4.8
    }
  },
  "cornelius": {
    "work": "Le Cinquième Élément (1997) ; ZF-1 attribué à Zorg, pistolet ordinaire à Korben",
    "name": "Consignes des gardiens de Cornelius",
    "basis": "canonical-role",
    "referencePrefix": "Vito Cornelius, film1997, is the priest who knows and explains the guard",
    "historicalSpecial": "Interprétation des pierres par Cornelius",
    "historicalWork": "Le Cinquième Élément / The Fifth Element (1997)",
    "historicalSemantics": {
      "effect": "buff",
      "shape": "group",
      "targetSide": "ally",
      "damage": 0
    },
    "selectedSemantics": {
      "effect": "guard",
      "delivery": "support",
      "shape": "group",
      "targetSide": "ally",
      "multiplier": 0
    }
  },
  "leodagan_kaamelott": {
    "work": "Kaamelott LivreIII (2005), chevaliers humains ; paroles et rations ne blessent pas par magie",
    "name": "Charge de Léodagan",
    "basis": "canonical-role",
    "referencePrefix": "Léodagan in Kaamelott LivreIII2005 is the human warrior king of Carmélid",
    "historicalSpecial": "Défense de la Carmélide",
    "historicalWork": "Kaamelott, television series Books I–VI",
    "historicalSemantics": {
      "effect": "guard",
      "shape": "group",
      "targetSide": "ally",
      "damage": 0
    },
    "selectedSemantics": {
      "effect": "damage",
      "delivery": "melee",
      "shape": "single",
      "targetSide": "enemy",
      "multiplier": 4.8
    }
  },
  "lancelot_kaamelott": {
    "work": "Kaamelott LivreIII (2005), chevaliers humains ; paroles et rations ne blessent pas par magie",
    "name": "Passe d’armes de Lancelot",
    "basis": "canonical-role",
    "referencePrefix": "Lancelot in Kaamelott LivreIII2005 wears his pale knightly tunic and bro",
    "historicalSpecial": "Épée du chevalier Lancelot",
    "historicalWork": "Kaamelott, television series Books I–IV",
    "historicalSemantics": {
      "effect": "damage",
      "shape": "single",
      "targetSide": "enemy",
      "damage": 4.6
    },
    "selectedSemantics": {
      "effect": "damage",
      "delivery": "melee",
      "shape": "single",
      "targetSide": "enemy",
      "multiplier": 4.7
    }
  }
};

test('completion covers every exact identity in the independent 1089-character baseline', () => {
  assert.equal(baseline.schemaVersion, 1);
  assert.equal(baseline.genericCapabilities.length, 1089);
  const ids = baseline.genericCapabilities.map(entry => entry.id);
  assert.equal(new Set(ids).size, 1089, 'baseline contains duplicate characters');
  assert.deepEqual(sorted(Object.keys(COMBAT_CAPABILITY_COMPLETION).filter(id => ids.includes(id))), sorted(ids));
  for (const entry of baseline.genericCapabilities) {
    const hero = roster.get(entry.id);
    assert.ok(hero, `${entry.id}: a baseline character disappeared from the roster`);
    assert.equal(hero.universe, entry.universe, entry.id);
    assert.equal(hero.name, entry.name, entry.id);
    assert.equal(hero.special.name, entry.originalSpecial, `${entry.id}: completion must preserve the original catalog record`);
    assert.match(entry.originalSpecial, /Origin Burst$/i, entry.id);
    assert.equal(COMBAT_CAPABILITY_COMPLETION[entry.id].universe, entry.universe, entry.id);
  }
});

test('the 191 additional decisive-action identities are tracked separately and fill the remaining catalog exactly', () => {
  assert.equal(decisiveBaseline.length, 191);
  assert.equal(new Set(decisiveBaseline.map(hero => hero.id)).size, 191);
  const initialIds = new Set(baseline.genericCapabilities.map(hero => hero.id));
  assert.ok(decisiveBaseline.every(hero => !initialIds.has(hero.id)), 'the two independent baselines overlap');
  assert.deepEqual(sorted(Object.keys(COMBAT_CAPABILITY_COMPLETION)), sorted(completedIdentities.map(hero => hero.id)));
  for (const entry of decisiveBaseline) {
    const hero = roster.get(entry.id);
    assert.ok(hero, entry.id);
    assert.equal(hero.name, entry.name, entry.id);
    assert.equal(hero.universe, entry.universe, entry.id);
    assert.equal(hero.special.name, entry.special.name, `${entry.id}: original source was overwritten`);
    assert.match(entry.special.name, /decisive action$/i, entry.id);
    assert.equal(COMBAT_CAPABILITY_COMPLETION[entry.id].universe, entry.universe, entry.id);
  }
});

test('every completed action carries an explicit identity basis and source scene', () => {
  for (const { id, universe } of completedIdentities) {
    const entry = COMBAT_CAPABILITY_COMPLETION[id];
    const profile = resolveMeleeSuper(roster.get(id));
    assert.ok(identityBases.has(entry.identityBasis), `${id}: unsupported identity basis ${entry.identityBasis}`);
    assert.ok(typeof entry.sourceWork === 'string' && entry.sourceWork.trim(), id);
    assert.ok(typeof entry.sourceReference === 'string' && entry.sourceReference.trim(), id);
    assert.equal(profile.provenance.identityAuthored, true, id);
    const version8 = wave8CompletedRevisions[id];
    const revision = wave11CompletedRevisions[id] || wave10CompletedRevisions[id] || wave9CompletedRevisions[id] || wave7CompletedRevisions[id] || (version8 ? { work: version8[0], name: version8[1], basis: version8[2], reference: /Selected |LQ-84i |Samuel Rodrigues |Use the early exploration-party/ } : null);
    if (revision) {
      assert.equal(profile.provenance.sourceWork, revision.work, id);
      if (revision.referencePrefix) assert.ok(profile.provenance.sourceReference.includes(revision.referencePrefix),id);
      else assert.match(profile.provenance.sourceReference, revision.reference, id);
      assert.equal(profile.provenance.identityBasis, revision.basis, id);
      if (wave11CompletedRevisions[id]) {
        assert.equal(entry.special.name,revision.historicalSpecial,id+': original completion technique changed');
        assert.equal(entry.sourceWork,revision.historicalWork,id+': original completion source changed');
      } else if (['baird', 'tali', 'wrex', 'agent_smith', 'hammond_sgc', 'eli_vance', 'kleiner', 'dogmeat', 'piper_wright', 'preston_garvey', 'vasquez_aliens'].includes(id)) {
        assert.ok(wave9CompletedRevisions[id] || wave10CompletedRevisions[id]);
        assert.ok(entry.sourceReference && entry.special.name, `${id}: historical source identity disappeared`);
      } else if (id !== 'axl_gg') assert.ok(profile.provenance.sourceReference.startsWith(entry.sourceReference), `${id}: canonical technique reference was lost`);
      else {
        assert.equal(entry.special.name, 'Rensen Geki', 'the historical Axl completion must remain immutable');
        assert.equal(profile.delivery, 'melee');
      }
    } else {
      assert.equal(profile.provenance.sourceWork, entry.sourceWork, id);
      assert.equal(profile.provenance.sourceReference, entry.sourceReference, id);
      assert.equal(profile.provenance.identityBasis, entry.identityBasis, id);
    }
    assert.equal(profile.provenance.sourceUniverse, universe, id);
    assert.equal(profile.provenance.canonicalVerified, false, id);
    assert.equal(profile.provenance.networkVerified, false, id);
    assert.equal(profile.provenance.gameplayAdaptation, true, id);
    assert.equal(profile.name, revision?.name || entry.special.name, id);
    assert.doesNotMatch(profile.name, genericName, id);
  }
});

test('support completion never carries damage and offensive completion has positive damage', () => {
  const effectsSeen = new Set();
  for (const { id } of completedIdentities) {
    const action = COMBAT_CAPABILITY_COMPLETION[id].special;
    const profile = resolveMeleeSuper(roster.get(id));
    effectsSeen.add(profile.effect);
    const version11=wave11CompletedRevisions[id];
    if(version11){
      assert.deepEqual({effect:action.targeting.effect,shape:action.targeting.shape,targetSide:action.targeting.targetSide,damage:action.dmg},version11.historicalSemantics,id+': immutable completion semantics');
      assert.deepEqual({effect:profile.effect,delivery:profile.delivery,shape:profile.shape,targetSide:profile.targetSide,multiplier:profile.multiplier},version11.selectedSemantics,id+': selected source version semantics');
    }
    if (id === 'agent_smith') {
      assert.equal(action.targeting.effect, 'buff'); assert.equal(action.dmg, 0, 'the historical Smith completion was overwritten');
      assert.equal(profile.effect, 'damage'); assert.equal(profile.delivery, 'melee'); assert.equal(profile.multiplier, 5);
    } else if(!version11) assert.equal(profile.effect, action.targeting.effect, id);
    // Attack Drone shocks one target; ME1 Barrier protects Wrex himself.
    const revisedShapes = { tali: 'single', wrex: 'single', preston_garvey: 'single', vasquez_aliens: 'cone' };
    assert.equal(profile.shape, version11?.selectedSemantics.shape || revisedShapes[id] || action.targeting.shape, id);
    assert.equal(profile.targetSide, version11?.selectedSemantics.targetSide || (id === 'wrex' ? 'self' : id === 'agent_smith' ? 'enemy' : action.targeting.targetSide), id);
    if (supportEffects.has(profile.effect)) {
      assert.equal(version11 ? version11.selectedSemantics.multiplier : action.dmg, 0, `${id}: authored support must not hide damage in its source action`);
      assert.equal(profile.multiplier, 0, id);
      assert.equal(profile.delivery, 'support', id);
      assert.ok(['self', 'ally'].includes(profile.targetSide), id);
      if (profile.effect === 'heal') assert.ok(profile.healRatio > 0 && profile.healRatio <= 1, id);
      if (profile.effect === 'revive') assert.ok(profile.reviveRatio > 0 && profile.reviveRatio <= 1, id);
      if (profile.effect === 'buff') assert.ok(profile.buffMultiplier > 1, id);
      if (profile.effect === 'guard') assert.ok(profile.guardReduce > 0 && profile.guardReduce < 1, id);
      if (profile.effect === 'cleanse') assert.ok(profile.cleanses, id);
    } else {
      assert.equal(profile.effect, 'damage', id);
      assert.ok(id === 'agent_smith' ? profile.multiplier === 5 : version11 ? version11.selectedSemantics.multiplier > 0 : action.dmg > 0 && Number.isFinite(action.dmg), id);
      assert.ok(profile.multiplier > 0, id);
      assert.equal(profile.targetSide, 'enemy', id);
      assert.notEqual(profile.delivery, 'support', id);
    }
  }
  assert.deepEqual(sorted(effectsSeen), ['buff', 'cleanse', 'damage', 'guard', 'heal', 'revive']);
});

test('independent character roles retain beneficial semantics after their generic super is replaced', () => {
  // These expectations come from character roles, not the shared builders:
  // AE3803 transports oxygen, Zeus resurrects, Granny uses headology, and
  // Hannah escapes with her companions rather than becoming an infected unit.
  for (const [id, effect, side] of [
    ['red_blood_cell', 'buff', 'ally'],
    ['platelet_cells', 'guard', 'ally'],
    ['zeus_ab', 'revive', 'ally'],
    ['granny_dw', 'cleanse', 'ally'],
    ['hannah_28dl', 'guard', 'ally'],
    ['tyler_romulus', 'buff', 'ally']
  ]) {
    const profile = resolveMeleeSuper(roster.get(id));
    assert.ok(profile, id);
    assert.equal(profile.effect, effect, id);
    assert.equal(profile.targetSide, side, id);
    assert.equal(profile.multiplier, 0, id);
  }
});

test('completed startup, impact, range and resource values are finite and ordered', () => {
  for (const { id } of completedIdentities) {
    const profile = resolveMeleeSuper(roster.get(id));
    for (const key of ['duration', 'hitAt', 'effectDuration', 'meterCost', 'range', 'areaRadius', 'lineWidth', 'coneAngle', 'maxTargets']) {
      assert.ok(Number.isFinite(profile[key]), `${id}: ${key} is not finite`);
    }
    assert.ok(profile.duration > 0 && profile.duration <= 8, id);
    assert.ok(profile.hitAt > 0 && profile.hitAt < profile.duration, id);
    assert.ok(profile.effectDuration > 0 && profile.effectDuration <= 30, id);
    assert.equal(profile.meterCost, 100, id);
    assert.ok(profile.range > 0 && profile.range <= 2400, id);
    assert.ok(profile.maxTargets > 0 && profile.maxTargets <= 16, id);
  }
});

test('resolved completion profiles cannot mutate the source hero, catalog, or another resolution', () => {
  const catalogBefore = JSON.stringify(COMBAT_CAPABILITY_COMPLETION);
  const rosterBefore = JSON.stringify(HEROES_DB);
  for (const { id } of completedIdentities) {
    const hero = roster.get(id);
    const untouched = resolveMeleeSuper(hero);
    const changed = resolveMeleeSuper(hero);
    assert.notEqual(untouched, changed, id);
    assert.notEqual(untouched.sourceAbility, changed.sourceAbility, id);
    assert.notEqual(untouched.sourceAbility.targeting, changed.sourceAbility.targeting, id);
    changed.sourceAbility.name = 'Changed only in this result';
    changed.sourceAbility.targeting.effect = 'damage';
    changed.sourceAbility.targeting.range = -900;
    changed.provenance.sourceReference = 'Changed only in this result';
    changed.name = 'Changed only in this result';
    assert.deepEqual(resolveMeleeSuper(hero), untouched, id);
  }
  assert.equal(JSON.stringify(COMBAT_CAPABILITY_COMPLETION), catalogBefore);
  assert.equal(JSON.stringify(HEROES_DB), rosterBefore);
});

test('battle-prefixed identities preserve the exact source ID while foreign universes cannot borrow completion', () => {
  for (const { id, universe } of completedIdentities) {
    const hero = roster.get(id);
    const expected = resolveMeleeSuper(hero);
    for (const identityField of ['sourceHeroId', 'sourceId']) {
      const actor = { ...hero, id: `enemy:custom:0:${id}`, [identityField]: id };
      const before = JSON.stringify(actor);
      const profile = resolveMeleeSuper(actor);
      assert.equal(profile.name, expected.name, id);
      assert.equal(profile.sourceHeroId, id, id);
      assert.equal(profile.sourceAbility.sourceHeroId, id, id);
      assert.equal(profile.provenance.sourceHeroId, id, id);
      assert.equal(profile.universe, universe, id);
      assert.equal(JSON.stringify(actor), before, id);
    }
    const foreign = resolveMeleeSuper({ ...hero, universe: 'Independent foreign continuity' });
    assert.equal(foreign.name, hero.special.name, id);
    assert.equal(foreign.provenance.identityAuthored, false, id);
    assert.equal(foreign.provenance.identityBasis, 'existing-catalog', id);
    const sameName = resolveMeleeSuper({ ...hero, id: `unregistered:${id}` });
    assert.equal(sameName.name, hero.special.name, id);
    assert.equal(sameName.provenance.identityAuthored, false, id);
  }
});

test('all 1911 runtime heroes have a non-generic super, including outside the 1089 baseline', () => {
  assert.equal(HEROES_DB.length, 1911);
  const failures = [];
  for (const hero of HEROES_DB) {
    const profile = resolveMeleeSuper(hero);
    if (!profile || genericName.test(profile.name)) failures.push({ id: hero.id, universe: hero.universe, name: profile?.name });
  }
  assert.deepEqual(failures, [], `${failures.length} runtime supers still have placeholder names`);
});

test('the 28 entity sheets cover the exact 82 caller profiles from the independent missing-assets baseline', () => {
  assert.equal(baseline.entities.length, 28);
  assert.equal(baseline.missingEntityProfiles, 82);
  assert.equal(baseline.entities.reduce((sum, entry) => sum + entry.callers.length, 0), 82);
  assert.equal(entityRegistry.schemaVersion, 1);
  assert.equal(entityRegistry.source, 'OpenAI');
  assert.equal(entityRegistry.entries.length, 28);
  assert.deepEqual(sorted(entityRegistry.entries.map(entry => entry.key)), sorted(baseline.entities.map(entry => entry.key)));
  assert.equal(new Set(entityRegistry.entries.map(entry => entry.id)).size, 28);
  assert.equal(new Set(entityRegistry.entries.map(entry => entry.sheet)).size, 28);
  assert.equal(new Set(entityRegistry.entries.map(entry => entry.sha256)).size, 28);
  for (const expected of baseline.entities) {
    const entry = entityRegistry.entries.find(value => value.key === expected.key);
    for (const key of ['universe', 'entityName', 'actionName', 'sourceHeroId']) assert.equal(entry[key], expected[key], expected.key);
    assert.deepEqual(sorted(entry.callers), sorted(expected.callers), expected.key);
    assert.equal(new Set(entry.callers).size, entry.callers.length, expected.key);
    assert.equal(entry.key, [entry.universe, entry.entityName, entry.actionName].join('::'));
    assert.equal(roster.get(entry.sourceHeroId)?.universe, entry.universe, expected.key);
    assert.equal(entry.assetMissing, false, expected.key);
    assert.ok(entry.sourceWork && entry.sourceReference, expected.key);
    assert.equal(entry.visualValidation.canon1to1Verified, false, expected.key);
    assert.equal(entry.visualValidation.networkVerified, false, expected.key);
  }
});

test('the82 historical entity bindings retain their assets while ten explicit W10 callers select real partners', () => {
  const before = JSON.stringify(HEROES_DB);
  const expectedCallers = new Set(), activeLegacyCallers = new Set();
  const selectedW10 = { freeman: 'alyx_vance', barney: 'alyx_vance', alyx_vance: 'barney', eli_vance: 'alyx_vance', kleiner: 'alyx_vance', dallas: 'chains_pd', wolf_pd: 'chains_pd', hoxton: 'chains_pd', chains_pd: 'dallas', clover_pd: 'chains_pd' };
  const revisedCallers = new Set();
  for (const expected of baseline.entities) {
    const registered = entityRegistry.entries.find(entry => entry.key === expected.key);
    for (const id of expected.callers) {
      expectedCallers.add(id);
      const hero = roster.get(id);
      assert.equal(hero?.universe, expected.universe, id);
      const descriptor = resolveUniverseSummon(hero);
      assert.equal(descriptor.universe, expected.universe, id);
      if (selectedW10[id]) {
        revisedCallers.add(id);
        assert.equal(descriptor.kind, 'reinforcement', id); assert.equal(descriptor.performerRole, 'reinforcement', id);
        assert.equal(descriptor.sourceHeroId, selectedW10[id], id);
        assert.equal(descriptor.performer.id, selectedW10[id], id); assert.equal(descriptor.performer.universe, hero.universe, id);
        assert.notEqual(descriptor.entityRender?.kind, 'sprite-sheet', id);
        const historical = attachCombatEntityAsset({ universe: expected.universe, entityName: expected.entityName, action: { name: expected.actionName } });
        assert.equal(historical.entityRender.asset.id, registered.id, id);
        assert.equal(sha256(readProjectFile('public' + registered.sheet)), registered.sha256, id);
        const adversarial = resolveUniverseSummon({ ...hero, id: `enemy:custom:0:${id}`, sourceHeroId: id });
        assert.equal(adversarial.sourceHeroId, selectedW10[id], id);
        continue;
      }
      activeLegacyCallers.add(id);
      assert.equal(descriptor.entityName, expected.entityName, id);
      assert.equal(descriptor.action.name, expected.actionName, id);
      assert.equal(descriptor.entityRender.kind, 'sprite-sheet', id);
      assert.equal(descriptor.entityRender.assetMissing, false, id);
      assert.equal(descriptor.entityRender.asset.id, registered.id, id);
      assert.equal(descriptor.entityRender.asset.sheet, registered.sheet, id);
      assert.match(descriptor.entityRender.asset.sheet, /^\/sprites\/generated\/combat-entities\/[a-z0-9-]+\.png$/, id);
      assert.equal(descriptor.provenance.entityAssetMissing, false, id);
      assert.equal(descriptor.provenance.entityAssetId, registered.id, id);
      assert.equal(descriptor.provenance.visualValidation, 'not-certified-1:1', id);
      assert.equal(roster.get(descriptor.sourceHeroId)?.universe, expected.universe, id);
      const adversarial = resolveUniverseSummon({ ...hero, id: `enemy:custom:0:${id}`, sourceHeroId: id });
      assert.equal(adversarial.entityRender.asset.id, registered.id, id);
    }
  }
  assert.equal(expectedCallers.size, 82); assert.equal(activeLegacyCallers.size, 72);
  assert.deepEqual(sorted(revisedCallers), sorted(Object.keys(selectedW10)));
  const resolved = HEROES_DB.map(hero => ({ hero, descriptor: resolveUniverseSummon(hero) }));
  assert.equal(resolved.filter(({ descriptor }) => descriptor.entityRender?.assetMissing === true).length, 0);
  assert.deepEqual(sorted(resolved.filter(({ descriptor }) => descriptor.entityRender?.kind === 'sprite-sheet').map(({ hero }) => hero.id)), sorted(activeLegacyCallers));
  assert.equal(JSON.stringify(HEROES_DB), before);
});

test('the 28 entity PNGs contain four distinct visible poses with real alpha and uncropped margins', async () => {
  const encodedHashes = new Set();
  for (const entry of entityRegistry.entries) {
    const image = readProjectFile(`public${entry.sheet}`);
    assert.deepEqual(image.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), entry.id);
    assert.equal(sha256(image), entry.sha256, entry.id);
    assert.ok(!encodedHashes.has(entry.sha256), `${entry.id}: another entity's bitmap was reused`);
    encodedHashes.add(entry.sha256);
    const metadata = await sharp(image, { failOn: 'error' }).metadata();
    assert.equal(metadata.format, 'png', entry.id);
    assert.equal(metadata.hasAlpha, true, entry.id);
    assert.equal(entry.alpha, true, entry.id);
    assert.equal(entry.frames, 4, entry.id);
    assert.equal(entry.columns, 4, entry.id);
    assert.equal(entry.rows, 1, entry.id);
    assert.equal(entry.frameWidth, 256, entry.id);
    assert.equal(entry.frameHeight, 256, entry.id);
    assert.equal(metadata.width, 1024, entry.id);
    assert.equal(metadata.height, 256, entry.id);
    assert.equal(metadata.width, entry.width, entry.id);
    assert.equal(metadata.height, entry.height, entry.id);
    assert.deepEqual(entry.phases, ['idle', 'preparation', 'impact', 'recovery'], entry.id);

    // Decode the actual file. Metadata flags alone also accept an opaque
    // rectangle, an empty sheet, or four repeated copies of one placeholder.
    const { data, info } = await sharp(image).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.equal(info.channels, 4);
    const frameHashes = new Set();
    for (let frame = 0; frame < 4; frame++) {
      const pixels = Buffer.alloc(256 * 256 * 4);
      let visible = 0;
      let transparent = 0;
      let strongAlpha = 0;
      let visibleEdge = 0;
      for (let y = 0; y < 256; y++) {
        const start = (y * info.width + frame * 256) * 4;
        data.copy(pixels, y * 256 * 4, start, start + 256 * 4);
        for (let x = 0; x < 256; x++) {
          const alpha = data[start + x * 4 + 3];
          if (alpha > 0) visible++;
          if (alpha === 0) transparent++;
          if (alpha >= 128) strongAlpha++;
          if ((x === 0 || x === 255 || y === 0 || y === 255) && alpha > 0) visibleEdge++;
        }
      }
      assert.ok(visible > 256, `${entry.id}:${frame}: empty or negligible pose`);
      assert.ok(strongAlpha > 128, `${entry.id}:${frame}: no readable body`);
      assert.ok(transparent > 256 * 256 * 0.15, `${entry.id}:${frame}: background was not removed`);
      assert.equal(visibleEdge, 0, `${entry.id}:${frame}: artwork reaches the frame edge`);
      frameHashes.add(sha256(pixels));
    }
    assert.equal(frameHashes.size, 4, `${entry.id}: the four poses must be distinct native artwork`);
  }
});

test('normalized entity sheets retain byte-verifiable archived native sources and honest provenance', async () => {
  const provenance = JSON.parse(readProjectFile('docs/combat-completion-2026-10-18/entity-assets-provenance.json'));
  assert.equal(provenance.provider, 'OpenAI');
  assert.equal(provenance.fidelity.networkVerified, false);
  assert.equal(provenance.fidelity.canon1to1Verified, false);
  assert.equal(provenance.fidelity.sourceGameAssets, false);
  assert.equal(provenance.fidelity.generatedAdaptations, true);
  const sources = new Map();
  for (const entry of entityRegistry.entries) {
    assert.match(entry.sourceAtlas, /^docs\/combat-completion-2026-10-18\/sources\/[a-z0-9-]+\.png$/, entry.id);
    if (!sources.has(entry.sourceAtlas)) {
      const bytes = readProjectFile(entry.sourceAtlas);
      const metadata = await sharp(bytes, { failOn: 'error' }).metadata();
      assert.equal(metadata.format, 'png', entry.id);
      sources.set(entry.sourceAtlas, { hash: sha256(bytes), width: metadata.width, height: metadata.height });
    }
    const source = sources.get(entry.sourceAtlas);
    assert.equal(source.hash, entry.sourceAtlasSha256, entry.id);
    assert.deepEqual([source.width, source.height], entry.sourceDimensions, entry.id);
    assert.equal(entry.visualValidation.identityReviewed, true, entry.id);
    assert.equal(entry.visualValidation.technicalAlphaReviewed, true, entry.id);
  }
  assert.equal(provenance.nativeSources.length, 4);
  assert.deepEqual(sorted(provenance.nativeSources.map(source => source.batch)), [1, 2, 3, 4]);
  assert.equal(provenance.corrections.length, 3);
  assert.deepEqual(sorted(provenance.corrections.map(source => source.id)), ['ff7-bahamut', 'jojo-gold-experience', 'tawantinsuyu-relay']);
  const rejectedAttempts = provenance.corrections.flatMap(correction => correction.previousAttempts || []);
  assert.equal(rejectedAttempts.length, 1);
  const archived = [
    ...provenance.nativeSources.map(source => ({ ...source, archivePath: source.path })),
    ...provenance.corrections.map(source => ({ ...source, archivePath: source.archivedPath })),
    ...rejectedAttempts.map(source => ({ ...source, archivePath: source.archivedPath }))
  ];
  assert.equal(new Set(archived.map(source => source.archivePath)).size, 8);
  for (const source of archived) {
    assert.equal(source.provider, 'OpenAI', source.archivePath);
    const bytes = readProjectFile(source.archivePath);
    assert.equal(sha256(bytes), source.sha256, source.archivePath);
    if (source.bytes != null) assert.equal(bytes.length, source.bytes, source.archivePath);
    const metadata = await sharp(bytes, { failOn: 'error' }).metadata();
    assert.equal(metadata.format, 'png', source.archivePath);
  }
  assert.equal(sources.size, 7, 'four native batches and three accepted native corrections must be used');
  assert.deepEqual(sorted(sources.keys()), sorted([
    ...provenance.nativeSources.map(source => source.path),
    ...provenance.corrections.map(source => source.archivedPath)
  ]));
  for (const correction of provenance.corrections) {
    const entry = entityRegistry.entries.find(value => value.id === correction.id);
    assert.equal(entry.nativeCorrection, true, correction.id);
    assert.equal(entry.sourceAtlas, correction.archivedPath, correction.id);
    assert.equal(entry.sourceAtlasSha256, correction.sha256, correction.id);
    const original = provenance.nativeSources.find(source => source.path === entry.originalSourceAtlas);
    assert.ok(original, correction.id);
    assert.equal(entry.originalSourceAtlasSha256, original.sha256, correction.id);
    assert.ok(Number.isInteger(entry.originalSourceRow) && entry.originalSourceRow >= 0 && entry.originalSourceRow < 7, correction.id);
    assert.ok(archived.some(source => source.sha256 === correction.referencedSourceSha256 && source.sha256 !== correction.sha256), correction.id);
  }
  for (const rejected of rejectedAttempts) {
    assert.equal(rejected.accepted, false);
    assert.ok(typeof rejected.rejectionReason === 'string' && rejected.rejectionReason.trim());
    assert.ok(!sources.has(rejected.archivedPath), 'a rejected source must remain archived without supplying runtime artwork');
  }
});

test('an unrelated universe, entity or action never borrows an existing entity bitmap', () => {
  for (const entry of entityRegistry.entries) {
    const descriptor = { universe: entry.universe, entityName: entry.entityName, action: { name: entry.actionName }, entityRender: { assetMissing: true }, provenance: { sourceHeroId: entry.sourceHeroId } };
    const before = JSON.stringify(descriptor);
    assert.equal(resolveCombatEntityAsset(descriptor).id, entry.id);
    const attached = attachCombatEntityAsset(descriptor);
    assert.equal(attached.entityRender.asset.id, entry.id);
    assert.equal(JSON.stringify(descriptor), before, entry.id);
    for (const impostor of [
      { ...descriptor, universe: `${entry.universe} — different continuity` },
      { ...descriptor, entityName: `${entry.entityName} — different entity` },
      { ...descriptor, action: { name: `${entry.actionName} — different action` } },
      { ...descriptor, entityName: undefined },
      { ...descriptor, action: undefined }
    ]) {
      assert.equal(resolveCombatEntityAsset(impostor), null, entry.id);
      assert.equal(attachCombatEntityAsset(impostor), impostor, `${entry.id}: absent artwork must stay absent`);
      assert.equal(impostor.entityRender.assetMissing, true, entry.id);
    }
  }
  for (const empty of [null, undefined, {}]) assert.equal(resolveCombatEntityAsset(empty), null);
});

test('entity poses follow simulation arrival, preparation, one impact and return without advancing during pause', () => {
  for (const expected of baseline.entities) {
    const descriptor = resolveUniverseSummon(roster.get(expected.callers[0]));
    const durationTicks = Math.round(descriptor.duration * 60);
    const impactTick = Math.round(descriptor.impactAt * 60);
    const frames = [];
    for (let tick = 0; tick <= durationTicks; tick++) frames.push(getCombatEntityFrame({ tick, impactTick, durationTicks }).index);
    assert.deepEqual([...new Set(frames)], [0, 1, 2, 3], expected.key);
    assert.equal(getCombatEntityFrame({ tick: 0, impactTick, durationTicks }).index, 0, expected.key);
    assert.equal(getCombatEntityFrame({ tick: impactTick - 1, impactTick, durationTicks }).index, 1, expected.key);
    assert.equal(getCombatEntityFrame({ tick: impactTick, impactTick, durationTicks }).index, 2, expected.key);
    assert.equal(getCombatEntityFrame({ tick: durationTicks, impactTick, durationTicks }).index, 3, expected.key);
    assert.ok(frames.every((frame, index) => index === 0 || frame >= frames[index - 1]), expected.key);
    const paused = { tick: impactTick, impactTick, durationTicks };
    const before = { ...paused };
    const pose = getCombatEntityFrame(paused);
    for (let render = 0; render < 20; render++) assert.deepEqual(getCombatEntityFrame(paused), pose, expected.key);
    assert.deepEqual(paused, before);
  }
});
