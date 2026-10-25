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

// These21 W12 selections are restricted to the pre-edit40-character batch.
// Expectations are literal snapshots of the unchanged completion records and
// the reviewed W12 versions/curation; runtime definitions are not imported here.
const wave12CompletedRevisions = {
  "harry_mason": {
    "work": "Silent Hill (1999), original PlayStation",
    "name": "Tir prudent de Harry Mason",
    "basis": "canonical-role",
    "referencePrefix": "Harry uses an ordinary handgun in original Silent Hill1999.",
    "historicalSpecial": "Tir au pistolet de Harry",
    "historicalWork": "Silent Hill (1999), Silent Hill 2 (2001), Silent Hill 3 (2003)",
    "historicalReference": "Harry utilise des armes récupérées dans le premier Silent Hill ; survivant humain, aucune télékinésie.",
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
      "multiplier": 4.45
    }
  },
  "alessa_gillespie": {
    "work": "Silent Hill (1999), apparition d’Alessa en uniforme scolaire",
    "name": "Présence recueillie d’Alessa",
    "basis": "canonical-role",
    "referencePrefix": "Original Silent Hill1999 school-uniform apparition.",
    "historicalSpecial": "Sceau de protection d’Alessa",
    "historicalWork": "Silent Hill (1999), Silent Hill 2 (2001), Silent Hill 3 (2003)",
    "historicalReference": "Alessa manifeste des pouvoirs psychiques et tente de contenir le rituel par les sceaux dans Silent Hill ; protection adaptée à son rôle.",
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
  "maria_sh2": {
    "work": "Silent Hill 2 (2001), Maria du jeu original",
    "name": "Indication du passage sûr par Maria",
    "basis": "canonical-role",
    "referencePrefix": "Maria in the original Silent Hill2 main-story role guides James and stays human in presentation.",
    "historicalSpecial": "Repérage de Maria à Silent Hill",
    "historicalWork": "Silent Hill (1999), Silent Hill 2 (2001), Silent Hill 3 (2003)",
    "historicalReference": "Maria accompagne James dans Silent Hill 2 ; soutien de guidage, sans lui attribuer l’arsenal du protagoniste.",
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
  "cybil_bennett": {
    "work": "Silent Hill (1999), agente de police de Brahms",
    "name": "Tir de couverture de Cybil",
    "basis": "canonical-role",
    "referencePrefix": "Cybil is the Brahms police officer of Silent Hill1999,",
    "historicalSpecial": "Pistolet de service de Cybil",
    "historicalWork": "Silent Hill (1999), Silent Hill 2 (2001), Silent Hill 3 (2003)",
    "historicalReference": "Cybil est policière et apporte son arme de service ; tir conventionnel issu du premier jeu.",
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
      "multiplier": 4.6
    }
  },
  "claudia_wolf": {
    "work": "Silent Hill 3 (2003), Claudia humaine avant transformation",
    "name": "Consigne de rassemblement de Claudia",
    "basis": "canonical-role",
    "referencePrefix": "Claudia is shown as the human cult leader from original Silent Hill3",
    "historicalSpecial": "Exhortation de Claudia à l’Ordre",
    "historicalWork": "Silent Hill (1999), Silent Hill 2 (2001), Silent Hill 3 (2003)",
    "historicalReference": "Claudia est une prêtresse de l’Ordre dans Silent Hill 3 ; influence et exhortation adaptées, sans créer une attaque de faisceau.",
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
  "anna_predator": {
    "work": "Predator (1987), original film continuity",
    "name": "Indication du passage sûr par Anna",
    "basis": "canonical-role",
    "referencePrefix": "Anna Gonsalves in Predator1987 is the rescued human",
    "historicalSpecial": "Avertissement d’Anna sur le chasseur",
    "historicalWork": "Predator (1987) and Predator 2 (1990), identified per record",
    "historicalReference": "Predator (1987): Anna recognizes the hunter’s behavior and helps the survivors understand when it will attack.",
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
  "billy_predator": {
    "work": "Predator (1987), original film continuity",
    "name": "Taille à la machette de Billy",
    "basis": "canonical-role",
    "referencePrefix": "Billy Sole in Predator1987 is a human tracker carrying a large machete.",
    "historicalSpecial": "Piste relevée par Billy",
    "historicalWork": "Predator (1987) and Predator 2 (1990), identified per record",
    "historicalReference": "Predator (1987): Billy Sole is the squad’s tracker; following signs in the jungle supplies reconnaissance.",
    "historicalSemantics": {
      "effect": "buff",
      "shape": "group",
      "targetSide": "ally",
      "damage": 0
    },
    "selectedSemantics": {
      "effect": "damage",
      "delivery": "melee",
      "shape": "single",
      "targetSide": "enemy",
      "multiplier": 4.7
    }
  },
  "mac_predator": {
    "work": "Predator (1987), original film continuity",
    "name": "Rafale au M60 de Mac",
    "basis": "canonical-role",
    "referencePrefix": "Mac Eliot in Predator1987 uses the conventional belt-fed M60 machine gun.",
    "historicalSpecial": "Couverture à la M60 de Mac",
    "historicalWork": "Predator (1987) and Predator 2 (1990), identified per record",
    "historicalReference": "Predator (1987): Mac Eliot uses the M60 during the squad’s sustained fire into the jungle.",
    "historicalSemantics": {
      "effect": "damage",
      "shape": "cone",
      "targetSide": "enemy",
      "damage": 4.2
    },
    "selectedSemantics": {
      "effect": "damage",
      "delivery": "projectile",
      "shape": "single",
      "targetSide": "enemy",
      "multiplier": 4.8
    }
  },
  "harrigan_predator": {
    "work": "Predator 2 (1990), original film continuity",
    "name": "Tir ajusté du pistolet de Harrigan",
    "basis": "canonical-role",
    "referencePrefix": "Mike Harrigan in Predator2 1990 is an LAPD human detective using an ordinary handgun.",
    "historicalSpecial": "Contre au disque du chasseur",
    "historicalWork": "Predator (1987) and Predator 2 (1990), identified per record",
    "historicalReference": "Predator 2 (1990): Harrigan ultimately uses the City Hunter’s smart disc in close combat; this roster entry selects that film action.",
    "historicalSemantics": {
      "effect": "damage",
      "shape": "single",
      "targetSide": "enemy",
      "damage": 4.4
    },
    "selectedSemantics": {
      "effect": "damage",
      "delivery": "projectile",
      "shape": "single",
      "targetSide": "enemy",
      "multiplier": 4.6
    }
  },
  "greyback_yautja": {
    "work": "Predator 2 (1990), original film continuity",
    "name": "Reconnaissance du chasseur par Greyback",
    "basis": "canonical-role",
    "referencePrefix": "Greyback Elder appears at the end of Predator2 1990",
    "historicalSpecial": "Reconnaissance du clan de Greyback",
    "historicalWork": "Predator (1987) and Predator 2 (1990), identified per record",
    "historicalReference": "Predator 2 (1990): the elder gives Harrigan the antique pistol after recognizing his victory; the adapted special is a recognition buff, not an invented elder weapon feat.",
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
  "ash_williams": {
    "work": "Army of Darkness (1992), Ash Williams avant le retour à S-Mart",
    "name": "Enchaînement à la tronçonneuse d’Ash",
    "basis": "canonical-role",
    "referencePrefix": "Ash, Army of Darkness 1992: his chainsaw replaces the anatomical RIGHT hand",
    "historicalSpecial": "Boomstick d’Ash",
    "historicalWork": "Evil Dead II (1987) ; Army of Darkness (1992)",
    "historicalReference": "Ash emploie son fusil à canon scié, dit boomstick ; tir physique, pas invocation de Deadites.",
    "historicalSemantics": {
      "effect": "damage",
      "shape": "single",
      "targetSide": "enemy",
      "damage": 4.5
    },
    "selectedSemantics": {
      "effect": "damage",
      "delivery": "melee",
      "shape": "single",
      "targetSide": "enemy",
      "multiplier": 4.7
    }
  },
  "annie_knowby": {
    "work": "Evil Dead II (1987), Annie Knowby humaine et vivante",
    "name": "Lecture des passages par Annie",
    "basis": "canonical-role",
    "referencePrefix": "Annie Knowby in Evil Dead II 1987 is a human researcher",
    "historicalSpecial": "Lecture des pages de Knowby",
    "historicalWork": "Evil Dead II (1987) ; Army of Darkness (1992)",
    "historicalReference": "Annie traduit et lit les passages du Necronomicon pour contrer le mal dans Evil Dead II ; soutien de dissipation adapté.",
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
  "henry_red_ed": {
    "work": "Army of Darkness (1992), Henry le Rouge, guerrier humain médiéval",
    "name": "Passe d’armes de Henry le Rouge",
    "basis": "canonical-role",
    "referencePrefix": "Henry the Red in Army of Darkness 1992 is the red-haired, bearded human knight",
    "historicalSpecial": "Charge d’Henry le Rouge",
    "historicalWork": "Evil Dead II (1987) ; Army of Darkness (1992)",
    "historicalReference": "Henry le Rouge dirige ses hommes et participe à la bataille finale d’Army of Darkness ; attaque rapprochée de guerrier.",
    "historicalSemantics": {
      "effect": "damage",
      "shape": "single",
      "targetSide": "enemy",
      "damage": 4.5
    },
    "selectedSemantics": {
      "effect": "damage",
      "delivery": "melee",
      "shape": "single",
      "targetSide": "enemy",
      "multiplier": 4.8
    }
  },
  "nicole_brennan": {
    "work": "Dead Space (2008), Nicole Brennan humaine, vivante et en tenue médicale",
    "name": "Consignes médicales de Nicole",
    "basis": "canonical-role",
    "referencePrefix": "Nicole Brennan is the living human medical officer shown in the original Dead Space 2008 context",
    "historicalSpecial": "Assistance médicale de Nicole",
    "historicalWork": "Dead Space",
    "historicalReference": "Dead Space : Nicole Brennan est officier médical de l'USG Ishimura ; soin adapté de son travail médical, pas d'attaque du Marqueur.",
    "historicalSemantics": {
      "effect": "heal",
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
  "fry_futurama": {
    "work": "Futurama, série Fox originale (1999–2003), Fry livreur de Planet Express",
    "name": "Relais de livraison de Fry",
    "basis": "canonical-role",
    "referencePrefix": "Fry is an ordinary Planet Express delivery boy in the original Fox run.",
    "historicalSpecial": "Résistance aux Brain Spawn",
    "historicalWork": "Futurama, The Why of Fry (2003)",
    "historicalReference": "Fry’s unusual brain structure makes him immune to the Brain Spawn’s mental influence; this self-protective action does not claim he can grant that biology to everyone.",
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
  "leela_futurama": {
    "work": "Futurama, série Fox originale (1999–2003), Leela pilote et combattante",
    "name": "Enchaînement de Leela",
    "basis": "canonical-role",
    "referencePrefix": "Leela is a skilled physical martial artist and Planet Express pilot.",
    "historicalSpecial": "Coup de pied de Leela",
    "historicalWork": "Futurama (1999–), Leela’s recurring martial arts",
    "historicalReference": "Leela is a trained hand-to-hand fighter and frequently uses strong high kicks.",
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
      "multiplier": 4.6
    }
  },
  "bender_futurama": {
    "work": "Futurama, série Fox originale (1999–2003), Bender Bending Rodríguez",
    "name": "Charge mécanique de Bender",
    "basis": "canonical-role",
    "referencePrefix": "Bender is the gray bending robot from the original Fox run.",
    "historicalSpecial": "Force de robot cintreur",
    "historicalWork": "Futurama (1999–), Bender Bending Rodríguez",
    "historicalReference": "Bender is an industrial bending robot and uses his strength to bend metal; the special is a close-range mechanical strike.",
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
  "amy_futurama": {
    "work": "Futurama, série Fox originale (1999–2003), Amy stagiaire ingénieure de Planet Express",
    "name": "Diagnostic mécanique d’Amy",
    "basis": "canonical-role",
    "referencePrefix": "Amy is a Planet Express engineering intern in the original Fox period.",
    "historicalSpecial": "Réglage Planet Express",
    "historicalWork": "Futurama (1999–), Planet Express engineer role",
    "historicalReference": "Amy works with Professor Farnsworth’s machinery at Planet Express; a check of equipment provides preparation rather than an invented energy attack.",
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
  "hermes_futurama": {
    "work": "Futurama, série Fox originale (1999–2003), Hermes bureaucrate de Planet Express",
    "name": "Coordination administrative d’Hermes",
    "basis": "canonical-role",
    "referencePrefix": "Hermes is the human bureaucrat of Planet Express.",
    "historicalSpecial": "Réquisition de grade 36",
    "historicalWork": "Futurama, How Hermes Requisitioned His Groove Back (2000)",
    "historicalReference": "Hermes uses his bureaucratic expertise to retrieve the missing data and restore order; this is practical coordination.",
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
  "zoidberg_futurama": {
    "work": "Futurama, série Fox originale (1999–2003), Dr John Zoidberg",
    "name": "Orientation médicale de Zoidberg",
    "basis": "canonical-role",
    "referencePrefix": "Dr John Zoidberg is the red Decapodian",
    "historicalSpecial": "Visite médicale de Zoidberg",
    "historicalWork": "Futurama (1999–), Planet Express staff physician role",
    "historicalReference": "Dr. Zoidberg serves as the company physician; a modest medical check is a role adaptation and makes no claim that his human medicine is reliable.",
    "historicalSemantics": {
      "effect": "heal",
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
  "birdperson": {
    "work": "Rick and Morty, saison 2 (2015), Birdperson avant sa transformation en Phoenixperson",
    "name": "Garde ailée de Birdperson",
    "basis": "canonical-role",
    "referencePrefix": "Birdperson is his biological season2 version before Phoenixperson.",
    "historicalSpecial": "Appui aérien de Birdperson",
    "historicalWork": "Rick and Morty — Birdperson, Beth and Meeseeks appearances",
    "historicalReference": "Birdperson is an armed resistance veteran with functional wings; this special adapts his aerial combat movement.",
    "historicalSemantics": {
      "effect": "damage",
      "shape": "multi",
      "targetSide": "enemy",
      "damage": 4.2
    },
    "selectedSemantics": {
      "effect": "guard",
      "delivery": "support",
      "shape": "group",
      "targetSide": "ally",
      "multiplier": 0
    }
  }
};
const wave12SelectedIds = Object.values(JSON.parse(readProjectFile('docs/combat-fidelity-wave12-2026-10-23/batch-plan-before.json')).parts).flat();

// These twenty W13 selections are bounded to the frozen forty-character plan.
// Both historical completion records and selected source versions have literal expectations.
const wave13CompletedRevisions = {
  "dallas_alien": {
    "work": "Alien (1979), Captain Arthur Dallas before entering the ventilation ducts",
    "name": "Consigne de repli de Dallas",
    "basis": "canonical-role",
    "referencePrefix": "Alien (1979): Dallas commands the Nostromo crew. This selected unarmed scene adapts practical crew instructions and retreat guidance; it does not transfer colonial-marine equipment, alien powers or later-film events.",
    "historicalSpecial": "Balayage au lance-flammes du Nostromo",
    "historicalWork": "Alien",
    "historicalReference": "Alien (1979) : Dallas emporte le lance-flammes improvisé dans les conduits de ventilation pour traquer la créature.",
    "historicalSemantics": {
      "effect": "damage",
      "shape": "cone",
      "targetSide": "enemy",
      "damage": 3.2
    },
    "selectedSemantics": {
      "effect": "guard",
      "delivery": "support",
      "shape": "group",
      "targetSide": "ally",
      "multiplier": 0
    }
  },
  "parker_alien": {
    "work": "Alien (1979), Dennis Parker aboard the Nostromo",
    "name": "Organisation du passage par Parker",
    "basis": "canonical-role",
    "referencePrefix": "Alien (1979): Parker is the Nostromo chief engineer. His practical knowledge and crew coordination support allies with zero damage; engineering does not give him a powered gauntlet, energy blast or personal reactor attack.",
    "historicalSpecial": "Lance-flammes de l'ingénieur Parker",
    "historicalWork": "Alien",
    "historicalReference": "Alien (1979) : Parker porte le lance-flammes lors de la recherche de provisions ; Lambert gêne sa ligne de tir dans la soute.",
    "historicalSemantics": {
      "effect": "damage",
      "shape": "cone",
      "targetSide": "enemy",
      "damage": 3.2
    },
    "selectedSemantics": {
      "effect": "buff",
      "delivery": "support",
      "shape": "group",
      "targetSide": "ally",
      "multiplier": 0
    }
  },
  "lambert_alien": {
    "work": "Alien (1979), Joan Lambert aboard the Nostromo",
    "name": "Indication de route de Lambert",
    "basis": "canonical-role",
    "referencePrefix": "Alien (1979): Lambert is the Nostromo navigator. Her selected nonoffensive route calls are bounded team support. Anxiety is not a fear weapon, psychic blast or reason to give her a marine rifle.",
    "historicalSpecial": "Navigation d'urgence de Lambert",
    "historicalWork": "Alien",
    "historicalReference": "Alien (1979) : Joan Lambert est la navigatrice du Nostromo ; protection de l'équipe adaptée de son rôle de navigation.",
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
  "ash_alien": {
    "work": "Alien (1979), Ash in his intact science-officer form",
    "name": "Lecture du protocole par Ash",
    "basis": "canonical-role",
    "referencePrefix": "Alien (1979): intact science-officer Ash reads protocols and handles ship procedures. This zero-damage technical-support selection makes no claim of a friendly canonical alliance and excludes strangulation, disassembly and invented android weapons.",
    "historicalSpecial": "Force de l'androïde Ash",
    "historicalWork": "Alien",
    "historicalReference": "Alien (1979) : Ash révèle sa force d'androïde pendant l'affrontement avec Ripley dans le mess du Nostromo.",
    "historicalSemantics": {
      "effect": "damage",
      "shape": "single",
      "targetSide": "enemy",
      "damage": 3.8
    },
    "selectedSemantics": {
      "effect": "buff",
      "delivery": "support",
      "shape": "group",
      "targetSide": "ally",
      "multiplier": 0
    }
  },
  "glados": {
    "work": "Portal 2 (2011), GLaDOS in her central chamber chassis",
    "name": "Consigne de test de GLaDOS",
    "basis": "canonical-role",
    "referencePrefix": "Portal 2 (2011): GLaDOS retains her suspended central-chamber chassis and yellow optic. Voice and optic movements are zero-damage coordination adaptations; a combat placement does not grant legs, portable flight, neurotoxin or turrets.",
    "historicalSpecial": "Déploiement de neurotoxine",
    "historicalWork": "Portal",
    "historicalReference": "Portal et Portal 2 : GLaDOS utilise les systèmes de neurotoxine d'Aperture ; danger de zone adapté de cet équipement de laboratoire.",
    "historicalSemantics": {
      "effect": "damage",
      "shape": "area",
      "targetSide": "enemy",
      "damage": 3.8
    },
    "selectedSemantics": {
      "effect": "buff",
      "delivery": "support",
      "shape": "group",
      "targetSide": "ally",
      "multiplier": 0
    }
  },
  "wheatley": {
    "work": "Portal 2 (2011), portable Wheatley intelligence core before the chassis transfer",
    "name": "Avertissement de Wheatley",
    "basis": "canonical-role",
    "referencePrefix": "Portal 2 (2011): Wheatley is the portable blue-optic intelligence core before the chassis transfer. Core motions and warnings support allies without damage. Portable battle presentation is an adaptation, not humanoid anatomy, independent flight or ownership of the facility arsenal.",
    "historicalSpecial": "Bombes du châssis de Wheatley",
    "historicalWork": "Portal",
    "historicalReference": "Portal 2, combat final : Wheatley utilise le châssis central et lance des bombes dans la chambre de test ; pas de rayon personnel ajouté.",
    "historicalSemantics": {
      "effect": "damage",
      "shape": "area",
      "targetSide": "enemy",
      "damage": 3.3
    },
    "selectedSemantics": {
      "effect": "guard",
      "delivery": "support",
      "shape": "group",
      "targetSide": "ally",
      "multiplier": 0
    }
  },
  "rincewind_dw": {
    "work": "The Colour of Magic (1983), adult Rincewind",
    "name": "Repli prudent de Rincewind",
    "basis": "canonical-role",
    "referencePrefix": "The Colour of Magic (1983): Rincewind is a failed wizard whose survival and flight from danger are defining roles. The selected retreat instructions are zero-damage adaptation; he does not gain reliable fireballs, an Octavo combat cast or a new staff.",
    "historicalSpecial": "Fuite stratégiquement très rapide",
    "historicalWork": "Terry Pratchett’s Discworld novels",
    "historicalReference": "The Colour of Magic and later novels repeatedly define Rincewind through survival by running away, not reliable offensive sorcery.",
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
  "vimes_dw": {
    "work": "Guards! Guards! (1989), Captain Sam Vimes of the Night Watch",
    "name": "Frappe de l’épée de Vimes",
    "basis": "canonical-role",
    "referencePrefix": "Guards! Guards! (1989): adult Captain Vimes uses the ordinary physical sword and worn equipment of the Night Watch. His authority and later story developments do not become magical law damage, a dragon summon or an instant arrest effect.",
    "historicalSpecial": "La Garde tient la rue",
    "historicalWork": "Terry Pratchett’s Discworld novels",
    "historicalReference": "Sam Vimes investigates crimes and holds the City Watch together; his watchman’s command becomes defensive coordination.",
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
      "multiplier": 4.6
    }
  },
  "granny_dw": {
    "work": "Wyrd Sisters (1988), Granny Esme Weatherwax",
    "name": "Consigne ferme de Mémé Ciredutemps",
    "basis": "canonical-role",
    "referencePrefix": "Wyrd Sisters (1988): Granny Weatherwax employs headology and force of personality. Grounded instruction adapts that role as zero-damage team support; it is not a claim of visible shields, damaging borrowing, fireballs or a combat staff.",
    "historicalSpecial": "Headology de Mémé Ciredutemps",
    "historicalWork": "Terry Pratchett’s Discworld novels",
    "historicalReference": "Granny Weatherwax uses headology and Borrowing rather than showy generic wizard attacks; headology steadies the squad.",
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
  "twoflower_dw": {
    "work": "The Colour of Magic (1983), adult Twoflower",
    "name": "Repérage touristique de Deuxfleurs",
    "basis": "canonical-role",
    "referencePrefix": "The Colour of Magic (1983): adult Twoflower is a tourist whose observations and enthusiasm motivate companions. This is zero-damage coordination, not a weaponized iconograph flash, magical insurance attack or offensive Luggage summon.",
    "historicalSpecial": "Optimisme du premier touriste",
    "historicalWork": "Terry Pratchett’s Discworld novels",
    "historicalReference": "The Colour of Magic: Twoflower is a tourist with an iconograph and optimistic curiosity, not a trained combat mage.",
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
  "death_dw": {
    "work": "Mort (1987), Death in his ordinary robed manifestation",
    "name": "Balayage physique de la faux de la Mort",
    "basis": "canonical-role",
    "referencePrefix": "Mort (1987): Death carries a physical scythe and appears as a black-robed skeleton with blue eye lights. The arena strike is a bounded physical-contact adaptation; it never reaps a soul, bypasses HP, guarantees a kill or claims official cinematic fidelity.",
    "historicalSpecial": "Il reste encore du temps",
    "historicalWork": "Terry Pratchett’s Discworld novels",
    "historicalReference": "Death’s duties concern guiding souls, while his sword is reserved for exceptional tasks; this adapts his composed guidance as protection.",
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
  "nanny_ogg_dw": {
    "work": "Wyrd Sisters (1988), Nanny Gytha Ogg",
    "name": "Rassemblement de Nounou Ogg",
    "basis": "canonical-role",
    "referencePrefix": "Wyrd Sisters (1988): Nanny Ogg is an experienced witch and community organizer. The selected practical gathering signals support allies without damage, invented spellcasting, attacking alcohol or a damaging song.",
    "historicalSpecial": "Réconfort de Nounou Ogg",
    "historicalWork": "Terry Pratchett’s Discworld novels",
    "historicalReference": "Nanny Ogg uses practical witchcraft, common sense and community support in the Witches novels.",
    "historicalSemantics": {
      "effect": "heal",
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
  "meryl_mgs": {
    "work": "Metal Gear Solid (1998), Meryl Silverburgh at Shadow Moses",
    "name": "Tir ajusté du Desert Eagle de Meryl",
    "basis": "canonical-role",
    "referencePrefix": "Metal Gear Solid (1998): Meryl at Shadow Moses uses her physical Desert Eagle handgun. No later Guns of the Patriots costume, telepathy, stress blast or source-free area attack is selected.",
    "historicalSpecial": "Desert Eagle de Meryl",
    "historicalWork": "Metal Gear Solid (1998)",
    "historicalReference": "Meryl Silverburgh carries a Desert Eagle during the Shadow Moses incident.",
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
      "multiplier": 4.6
    }
  },
  "liquid_snake": {
    "work": "Metal Gear Solid (1998), Liquid Snake at Shadow Moses",
    "name": "Enchaînement rapproché de Liquid",
    "basis": "canonical-role",
    "referencePrefix": "Metal Gear Solid (1998): adult Liquid fights physically at close range. This unarmed selection does not borrow REX weapons, a Hind missile, FOXDIE damage or genetic invulnerability.",
    "historicalSpecial": "Duel sur Metal Gear REX",
    "historicalWork": "Metal Gear Solid (1998), Metal Gear REX rooftop fight",
    "historicalReference": "Liquid fights Solid Snake unarmed on REX at the end of the Shadow Moses incident; this is a close-range fist combination.",
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
  "the_boss_mgs": {
    "work": "Metal Gear Solid 3: Snake Eater (2004), The Boss during Operation Snake Eater (1964)",
    "name": "Prise de CQC de The Boss",
    "basis": "canonical-role",
    "referencePrefix": "Metal Gear Solid 3 (2004), Operation Snake Eater in1964: The Boss uses physical close-quarters combat. Her selected fastened white-grey sneaking suit and CQC do not confer Volgin electricity, an orbital weapon or modern equipment.",
    "historicalSpecial": "CQC de The Boss",
    "historicalWork": "Metal Gear Solid 3: Snake Eater (2004)",
    "historicalReference": "The Boss co-developed CQC and demonstrates throws and disarms during Operation Snake Eater.",
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
      "multiplier": 4.75
    }
  },
  "ocelot_mgs": {
    "work": "Metal Gear Solid (1998), Revolver Ocelot before losing his hand",
    "name": "Tir ajusté du revolver d’Ocelot",
    "basis": "canonical-role",
    "referencePrefix": "Metal Gear Solid (1998): intact older Revolver Ocelot uses the physical Colt Single Action Army. The selected aimed shot does not invent ricochets through obstacles, transfer Psycho Mantis powers or mix his young1964 appearance.",
    "historicalSpecial": "Single Action Army",
    "historicalWork": "Metal Gear Solid (1998)",
    "historicalReference": "Revolver Ocelot uses his Colt Single Action Army in the Shadow Moses duel.",
    "historicalSemantics": {
      "effect": "damage",
      "shape": "single",
      "targetSide": "enemy",
      "damage": 4.6
    },
    "selectedSemantics": {
      "effect": "damage",
      "delivery": "projectile",
      "shape": "single",
      "targetSide": "enemy",
      "multiplier": 4.75
    }
  },
  "obi_wan": {
    "work": "Star Wars: Revenge of the Sith (2005), adult Obi-Wan Kenobi",
    "name": "Contre au sabre bleu d’Obi-Wan",
    "basis": "canonical-role",
    "referencePrefix": "Revenge of the Sith (2005): adult Obi-Wan uses a blue lightsaber in cream Jedi field robes. The selected sword counter stays physical and local, with no older Ben Kenobi costume, blaster or ranged Force execution.",
    "historicalSpecial": "Soresu — défense au sabre",
    "historicalWork": "Star Wars",
    "historicalReference": "Star Wars : Obi-Wan Kenobi maîtrise la forme III, Soresu, centrée sur la défense au sabre laser et la déviation des tirs.",
    "historicalSemantics": {
      "effect": "guard",
      "shape": "single",
      "targetSide": "self",
      "damage": 0
    },
    "selectedSemantics": {
      "effect": "damage",
      "delivery": "melee",
      "shape": "single",
      "targetSide": "enemy",
      "multiplier": 4.7
    }
  },
  "yoda": {
    "work": "Star Wars: Attack of the Clones (2002), Yoda in his Jedi field robes",
    "name": "Enchaînement au sabre vert de Yoda",
    "basis": "canonical-role",
    "referencePrefix": "Attack of the Clones (2002): Yoda keeps his small green body, cream field robes and short green lightsaber. The local blade range is bounded to his selected body; no human-size stretching, invented lightning or limitless remote contact is granted.",
    "historicalSpecial": "Ataru de Yoda",
    "historicalWork": "Star Wars",
    "historicalReference": "Star Wars: Attack of the Clones et Revenge of the Sith : Yoda pratique une escrime acrobatique associée à la forme IV Ataru.",
    "historicalSemantics": {
      "effect": "damage",
      "shape": "single",
      "targetSide": "enemy",
      "damage": 3.8
    },
    "selectedSemantics": {
      "effect": "damage",
      "delivery": "melee",
      "shape": "single",
      "targetSide": "enemy",
      "multiplier": 4.65
    }
  },
  "joel_tlou": {
    "work": "The Last of Us (2013), adult Joel during the autumn journey",
    "name": "Tir ajusté du revolver de Joel",
    "basis": "canonical-role",
    "referencePrefix": "The Last of Us (2013): adult Joel uses an ordinary physical revolver during the autumn journey. Survival and protection are narrative motivations, not infected abilities, area stuns or transferred injuries.",
    "historicalSpecial": "Tir de couverture de Joel",
    "historicalWork": "The Last of Us (2013)",
    "historicalReference": "Joel utilise les armes de récupération pour protéger le trajet ; tir conventionnel, sans capacité liée à l’infection.",
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
      "multiplier": 4.6
    }
  },
  "tess_tlou": {
    "work": "The Last of Us (2013), adult Tess before the Capitol encounter",
    "name": "Tir de couverture du pistolet de Tess",
    "basis": "canonical-role",
    "referencePrefix": "The Last of Us (2013): adult Tess before the Capitol encounter fires an ordinary handgun. The selected intact human version excludes infection imagery, explosive death scenes and invented fungal powers.",
    "historicalSpecial": "Passage sécurisé par Tess",
    "historicalWork": "The Last of Us (2013)",
    "historicalReference": "Tess organise l’acheminement d’Ellie et protège la fuite ; soutien tactique de survivante.",
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
      "multiplier": 4.55
    }
  }
};
const wave13SelectedIds = Object.values(JSON.parse(readProjectFile('docs/combat-fidelity-wave13-2026-10-24/batch-plan-before.json')).parts).flat();

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

// W14 selected source overlays are bounded to the frozen26 existing completion records.
// Complete historical objects remain compared below; no completion data is rewritten.
const wave14Plan = JSON.parse(readProjectFile('docs/combat-fidelity-wave14-2026-10-25/batch-plan-before.json'));
const wave14CompletedRevisions = Object.fromEntries(wave14Plan.heroes.filter(row => row.priorCompletion).map(row => {
  const prior = row.priorCompletion, source = row.source;
  return [row.hero.id, { work: source.sourceWork, name: source.actionName, basis: 'canonical-role',
    referencePrefix: source.sourceWork, historicalSpecial: prior.special.name, historicalWork: prior.sourceWork, historicalReference: prior.sourceReference,
    historicalSemantics: { effect: prior.special.targeting.effect, shape: prior.special.targeting.shape, targetSide: prior.special.targeting.targetSide, damage: prior.special.dmg },
    selectedSemantics: { effect: source.effect, delivery: source.delivery, shape: source.delivery === 'radial' ? 'area' : source.effect === 'damage' ? 'single' : 'group', targetSide: source.effect === 'damage' ? 'enemy' : 'ally', multiplier: source.effect === 'damage' ? 4.65 : 0 } }];
}));
test('W14 preserves exactly the26 historical completion objects pinned before source overlays', () => {
  assert.equal(Object.keys(wave14CompletedRevisions).length, 26);
  for (const row of wave14Plan.heroes.filter(row => row.priorCompletion)) assert.deepEqual(COMBAT_CAPABILITY_COMPLETION[row.hero.id], row.priorCompletion, row.hero.id);
});

test('every completed action carries an explicit identity basis and source scene', () => {
  assert.equal(Object.keys(wave13CompletedRevisions).length, 20);
  assert.deepEqual(sorted(Object.keys(wave13CompletedRevisions)), sorted(wave13SelectedIds.filter(id => Object.hasOwn(COMBAT_CAPABILITY_COMPLETION, id))), 'W13 revisions must match only selected historical completion identities');
  assert.equal(Object.keys(wave12CompletedRevisions).length, 21);
  assert.deepEqual(sorted(Object.keys(wave12CompletedRevisions)), sorted(wave12SelectedIds.filter(id => Object.hasOwn(COMBAT_CAPABILITY_COMPLETION, id))), 'W12 revisions must match only the selected historical completion identities');
  for (const { id, universe } of completedIdentities) {
    const entry = COMBAT_CAPABILITY_COMPLETION[id];
    const profile = resolveMeleeSuper(roster.get(id));
    assert.ok(identityBases.has(entry.identityBasis), `${id}: unsupported identity basis ${entry.identityBasis}`);
    assert.ok(typeof entry.sourceWork === 'string' && entry.sourceWork.trim(), id);
    assert.ok(typeof entry.sourceReference === 'string' && entry.sourceReference.trim(), id);
    assert.equal(profile.provenance.identityAuthored, true, id);
    const version8 = wave8CompletedRevisions[id];
    const revision = wave14CompletedRevisions[id] || wave13CompletedRevisions[id] || wave12CompletedRevisions[id] || wave11CompletedRevisions[id] || wave10CompletedRevisions[id] || wave9CompletedRevisions[id] || wave7CompletedRevisions[id] || (version8 ? { work: version8[0], name: version8[1], basis: version8[2], reference: /Selected |LQ-84i |Samuel Rodrigues |Use the early exploration-party/ } : null);
    if (revision) {
      assert.equal(profile.provenance.sourceWork, revision.work, id);
      if (revision.referencePrefix) assert.ok(profile.provenance.sourceReference.includes(revision.referencePrefix),id);
      else assert.match(profile.provenance.sourceReference, revision.reference, id);
      assert.equal(profile.provenance.identityBasis, revision.basis, id);
      if (wave14CompletedRevisions[id] || wave13CompletedRevisions[id] || wave12CompletedRevisions[id] || wave11CompletedRevisions[id]) {
        assert.equal(entry.special.name,revision.historicalSpecial,id+': original completion technique changed');
        assert.equal(entry.sourceWork,revision.historicalWork,id+': original completion source changed');
        if (wave14CompletedRevisions[id] || wave13CompletedRevisions[id] || wave12CompletedRevisions[id]) {
          assert.equal(entry.sourceReference, revision.historicalReference, id + ': historical completion reference changed');
        }
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
    const selectedRevision=wave14CompletedRevisions[id] || wave13CompletedRevisions[id] || wave12CompletedRevisions[id] || wave11CompletedRevisions[id];
    if(selectedRevision){
      assert.deepEqual({effect:action.targeting.effect,shape:action.targeting.shape,targetSide:action.targeting.targetSide,damage:action.dmg},selectedRevision.historicalSemantics,id+': immutable completion semantics');
      assert.deepEqual({effect:profile.effect,delivery:profile.delivery,shape:profile.shape,targetSide:profile.targetSide,multiplier:profile.multiplier},selectedRevision.selectedSemantics,id+': selected source version semantics');
    }
    if (id === 'agent_smith') {
      assert.equal(action.targeting.effect, 'buff'); assert.equal(action.dmg, 0, 'the historical Smith completion was overwritten');
      assert.equal(profile.effect, 'damage'); assert.equal(profile.delivery, 'melee'); assert.equal(profile.multiplier, 5);
    } else if(!selectedRevision) assert.equal(profile.effect, action.targeting.effect, id);
    // Attack Drone shocks one target; ME1 Barrier protects Wrex himself.
    const revisedShapes = { tali: 'single', wrex: 'single', preston_garvey: 'single', vasquez_aliens: 'cone' };
    assert.equal(profile.shape, selectedRevision?.selectedSemantics.shape || revisedShapes[id] || action.targeting.shape, id);
    assert.equal(profile.targetSide, selectedRevision?.selectedSemantics.targetSide || (id === 'wrex' ? 'self' : id === 'agent_smith' ? 'enemy' : action.targeting.targetSide), id);
    if (supportEffects.has(profile.effect)) {
      assert.equal(selectedRevision ? selectedRevision.selectedSemantics.multiplier : action.dmg, 0, `${id}: authored support must not hide damage in its source action`);
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
      assert.ok(id === 'agent_smith' ? profile.multiplier === 5 : selectedRevision ? selectedRevision.selectedSemantics.multiplier > 0 : action.dmg > 0 && Number.isFinite(action.dmg), id);
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
    if (id === 'granny_dw') {
      assert.equal(COMBAT_CAPABILITY_COMPLETION[id].special.targeting.effect, effect, 'Historical headology cleanse remains immutable');
      assert.equal(wave13CompletedRevisions[id].selectedSemantics.effect, 'guard');
      assert.equal(profile.effect, 'guard', 'W13 selects nonoffensive practical instructions');
    } else assert.equal(profile.effect, effect, id);
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

test('the82 historical entity bindings retain their assets while ten W10 and six W13 callers select real partners', () => {
  const before = JSON.stringify(HEROES_DB);
  const expectedCallers = new Set(), activeLegacyCallers = new Set();
  const selectedW10 = { freeman: 'alyx_vance', barney: 'alyx_vance', alyx_vance: 'barney', eli_vance: 'alyx_vance', kleiner: 'alyx_vance', dallas: 'chains_pd', wolf_pd: 'chains_pd', hoxton: 'chains_pd', chains_pd: 'dallas', clover_pd: 'chains_pd' };
  const selectedW13 = { chell: 'atlas', atlas: 'pbody', pbody: 'atlas', glados: 'atlas', wheatley: 'atlas', doug_rattmann: 'chell' };
  assert.equal(Object.keys(selectedW10).length, 10); assert.equal(Object.keys(selectedW13).length, 6);
  assert.ok(Object.keys(selectedW13).every(id => wave13SelectedIds.includes(id)));
  const selectedPartners = { ...selectedW10, ...selectedW13 };
  const revisedCallers = new Set();
  for (const expected of baseline.entities) {
    const registered = entityRegistry.entries.find(entry => entry.key === expected.key);
    for (const id of expected.callers) {
      expectedCallers.add(id);
      const hero = roster.get(id);
      assert.equal(hero?.universe, expected.universe, id);
      const descriptor = resolveUniverseSummon(hero);
      assert.equal(descriptor.universe, expected.universe, id);
      if (selectedPartners[id]) {
        revisedCallers.add(id);
        assert.equal(descriptor.kind, 'reinforcement', id); assert.equal(descriptor.performerRole, 'reinforcement', id);
        assert.equal(descriptor.sourceHeroId, selectedPartners[id], id);
        assert.equal(descriptor.performer.id, selectedPartners[id], id); assert.equal(descriptor.performer.universe, hero.universe, id);
        assert.notEqual(descriptor.entityRender?.kind, 'sprite-sheet', id);
        const historical = attachCombatEntityAsset({ universe: expected.universe, entityName: expected.entityName, action: { name: expected.actionName } });
        assert.equal(historical.entityRender.asset.id, registered.id, id);
        assert.equal(sha256(readProjectFile('public' + registered.sheet)), registered.sha256, id);
        const adversarial = resolveUniverseSummon({ ...hero, id: `enemy:custom:0:${id}`, sourceHeroId: id });
        assert.equal(adversarial.sourceHeroId, selectedPartners[id], id);
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
  assert.equal(expectedCallers.size, 82); assert.equal(activeLegacyCallers.size, 66);
  assert.deepEqual(sorted(revisedCallers), sorted(Object.keys(selectedPartners)));
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
