// Publisher / official-source inventory: existence is documented, artwork is NOT delivered.
const S0 = "https://store.steampowered.com/app/580600/";
const S1 = "https://store.steampowered.com/dlc/2050650/";
const S2 = "https://store.steampowered.com/dlc/287700/";
const S3 = "https://store.steampowered.com/dlc/339340/";
const S4 = "https://store.steampowered.com/dlc/601150/";
const S5 = "https://store.steampowered.com/dlc/750920/";
const S6 = "https://store.steampowered.com/dlc/883710/";
const S7 = "https://store.steampowered.com/dlc/952060/";
const S8 = "https://www.starwars.com/databank/han-solo";
const S9 = "https://www.starwars.com/databank/leia-organa";
const S10 = "https://www.starwars.com/databank/luke-skywalker";
const make = (universe, ids, key, fr, en, sourceWork, sourceUrl, nature="official-costume", note="Existence documentée. Captures multi-vues, détails, animation et validation artistique restent à réaliser.") => Object.freeze({
  universe, actorIds:Object.freeze(ids.split("|")), key, name:Object.freeze({fr,en}),sourceWork,sourceUrl,nature,note,
  sourceEvidence:sourceUrl.includes("steampowered")?"publisher-description":"official-databank-scene",
  artworkStatus:"NOT_PRODUCED",artApproval:"NOT_REVIEWED",equippable:false
});
export const OFFICIAL_WARDROBE = Object.freeze([
  make("Resident Evil", "leon", "re2-leon-sheriff", "Shérif d’Arklay", "Arklay Sheriff", "Resident Evil 2 (2019) — DLC", S6),
  make("Resident Evil", "leon", "re2-leon-noir", "Noir", "Noir", "Resident Evil 2 (2019) — DLC", S6),
  make("Resident Evil", "leon", "re2-leon-98", "Leon 98 — modèle low-poly", "Leon 98 — low-poly model", "Resident Evil 2 (2019) — DLC", S6, "official-model"),
  make("Resident Evil", "claire_redfield", "re2-claire-military", "Militaire", "Military", "Resident Evil 2 (2019) — DLC", S6),
  make("Resident Evil", "claire_redfield", "re2-claire-noir", "Noir", "Noir", "Resident Evil 2 (2019) — DLC", S6),
  make("Resident Evil", "claire_redfield", "re2-claire-elza", "Elza Walker — tenue de Claire", "Elza Walker — Claire outfit", "Resident Evil 2 (2019) — DLC", S6),
  make("Resident Evil", "claire_redfield", "re2-claire-98", "Claire 98 — modèle low-poly", "Claire 98 — low-poly model", "Resident Evil 2 (2019) — DLC", S6, "official-model"),
  make("Resident Evil", "leon", "re4-casual", "Décontracté", "Casual", "Resident Evil 4 (2023) — DLC", S1),
  make("Resident Evil", "leon", "re4-hero", "Héros", "Hero", "Resident Evil 4 (2023) — DLC", S1),
  make("Resident Evil", "leon", "re4-villain", "Vilain", "Villain", "Resident Evil 4 (2023) — DLC", S1),
  make("Resident Evil", "leon", "re4-sporty", "Lunettes sportives", "Sporty sunglasses", "Resident Evil 4 (2023) — DLC", S1, "official-accessory"),
  make("Resident Evil", "jill", "re3-classic-jill", "Tenue classique RE3", "Classic RE3 outfit", "Resident Evil 3 (2020) — Classic Costume Pack", S7),
  make("Resident Evil", "carlos_oliveira", "re3-classic-hair", "Coiffure classique RE3", "Classic RE3 hairstyle", "Resident Evil 3 (2020) — Classic Costume Pack", S7, "official-hairstyle"),
  make("Resident Evil", "jill", "resistance-claire", "Jill — tenue de Claire", "Jill — Claire outfit", "Resident Evil Resistance — DLC", S7, "official-costume", "Cosmétique officiel de Resistance porté par Jill ; ne remplace pas Jill par Claire et ne certifie pas une scène canonique."),
  make("Resident Evil", "rebecca_chambers", "re0-cheerleader", "Pom-pom girl", "Cheerleader", "Resident Evil 0 HD — Costume Packs", S3),
  make("Resident Evil", "rebecca_chambers", "re0-nurse", "Infirmière", "Nurse", "Resident Evil 0 HD — Costume Packs", S3),
  make("Resident Evil", "rebecca_chambers", "re0-stars1996", "S.T.A.R.S. 1996", "S.T.A.R.S. 1996", "Resident Evil 0 HD — Costume Packs", S3),
  make("Resident Evil", "rebecca_chambers", "re0-prototype", "Prototype RE0", "RE0 prototype", "Resident Evil 0 HD — Costume Packs", S3),
  make("Resident Evil", "rebecca_chambers", "re0-stars1997", "S.T.A.R.S. 1997", "S.T.A.R.S. 1997", "Resident Evil 0 HD — Costume Packs", S3),
  make("Resident Evil", "rebecca_chambers", "re0-sports", "Tenue sportive", "Sportswear", "Resident Evil 0 HD — Costume Packs", S3),
  make("Resident Evil", "rebecca_chambers", "re0-shadow", "T-shirt Shadow of Fear", "Shadow of Fear T-shirt", "Resident Evil 0 HD — Costume Packs", S3),
  make("NieR", "yorha_2b", "nier-2b", "Revealing Outfit", "Revealing Outfit", "NieR:Automata — 3C3C1D119440927", S0),
  make("NieR", "yorha_9s", "nier-9s", "Young Man’s Outfit", "Young Man’s Outfit", "NieR:Automata — 3C3C1D119440927", S0),
  make("NieR", "yorha_a2", "nier-a2", "Destroyer Outfit", "Destroyer Outfit", "NieR:Automata — 3C3C1D119440927", S0),
  make("Devil May Cry", "devil_may_cry_dante", "dmc5-dante-ex", "Couleurs EX", "EX colors", "Devil May Cry 5 — Alt Hero / Heroine Colors", S4, "official-palette", "Variante de couleurs officielle, pas un nouveau vêtement. Aucune teinte approximative activée sans référence graphique."),
  make("Devil May Cry", "devil_may_cry_nero", "dmc5-nero-ex", "Couleurs EX", "EX colors", "Devil May Cry 5 — Alt Hero / Heroine Colors", S4, "official-palette", "Variante de couleurs officielle, pas un nouveau vêtement. Aucune teinte approximative activée sans référence graphique."),
  make("Devil May Cry", "devil_may_cry_lady", "dmc5-lady-ex", "Couleurs EX", "EX colors", "Devil May Cry 5 — Alt Hero / Heroine Colors", S4, "official-palette", "Variante de couleurs officielle, pas un nouveau vêtement. Aucune teinte approximative activée sans référence graphique."),
  make("Metal Gear", "big_boss", "mgs3-fatigues", "Treillis Operation Snake Eater", "Operation Snake Eater fatigues", "Metal Gear Solid 3 — Naked Snake ; description du DLC MGSV", S2, "official-costume", "Naked Snake / Big Boss uniquement, jamais Solid Snake ni Raiden. La page MGSV décrit la tenue de MGS3 ; aucune mécanique MGSV transférée."),
  make("Metal Gear", "big_boss", "mgs3-sneaking", "Combinaison furtive soviétique", "Soviet Sneaking Suit", "Metal Gear Solid 3 — Naked Snake ; description du DLC MGSV", S2, "official-costume", "Naked Snake / Big Boss uniquement, jamais Solid Snake ni Raiden. La page MGSV décrit la tenue de MGS3 ; aucune mécanique MGSV transférée."),
  make("Metal Gear", "big_boss", "mgs3-tuxedo", "Smoking", "Tuxedo", "Metal Gear Solid 3 — Naked Snake ; description du DLC MGSV", S2, "official-costume", "Naked Snake / Big Boss uniquement, jamais Solid Snake ni Raiden. La page MGSV décrit la tenue de MGS3 ; aucune mécanique MGSV transférée."),
  make("Star Wars", "luke", "sw-luke-farm", "Tatooine — tunique de fermier", "Tatooine farm tunic", "A New Hope (1977)", S10, "source-outfit", "Même identité, tenue issue de cette époque. Ni arme ni pouvoirs ni âge ne changent ; désactivé dans les rencontres verrouillées à une autre incarnation."),
  make("Star Wars", "luke", "sw-luke-trooper", "Déguisement Stormtrooper", "Stormtrooper disguise", "A New Hope (1977)", S10, "source-outfit", "Même identité, tenue issue de cette époque. Ni arme ni pouvoirs ni âge ne changent ; désactivé dans les rencontres verrouillées à une autre incarnation."),
  make("Star Wars", "luke", "sw-luke-pilot", "Pilote X-wing", "X-wing pilot", "A New Hope (1977)", S10, "source-outfit", "Même identité, tenue issue de cette époque. Ni arme ni pouvoirs ni âge ne changent ; désactivé dans les rencontres verrouillées à une autre incarnation."),
  make("Star Wars", "luke", "sw-luke-dagobah", "Entraînement Dagobah", "Dagobah training", "The Empire Strikes Back (1980)", S10, "source-outfit", "Même identité, tenue issue de cette époque. Ni arme ni pouvoirs ni âge ne changent ; désactivé dans les rencontres verrouillées à une autre incarnation."),
  make("Star Wars", "luke", "sw-luke-bespin", "Bespin — treillis", "Bespin fatigues", "The Empire Strikes Back (1980)", S10, "source-outfit", "Même identité, tenue issue de cette époque. Ni arme ni pouvoirs ni âge ne changent ; désactivé dans les rencontres verrouillées à une autre incarnation."),
  make("Star Wars", "leia|leia_organa", "sw-leia-hoth", "Hoth — tenue de commandement", "Hoth command outfit", "The Empire Strikes Back (1980)", S9, "source-outfit"),
  make("Star Wars", "leia|leia_organa", "sw-leia-boushh", "Déguisement Boushh", "Boushh disguise", "Return of the Jedi (1983)", S9, "source-outfit"),
  make("Star Wars", "leia|leia_organa", "sw-leia-endor", "Endor — camouflage", "Endor camouflage", "Return of the Jedi (1983)", S9, "source-outfit"),
  make("Star Wars", "han_solo", "sw-han-hoth", "Hoth — parka", "Hoth parka", "The Empire Strikes Back (1980)", S8, "source-outfit"),
  make("Star Wars", "han_solo", "sw-han-endor", "Endor — manteau de camouflage", "Endor camouflage coat", "Return of the Jedi (1983)", S8, "source-outfit"),
  make("Star Wars", "han_solo", "sw-han-trooper", "Déguisement Stormtrooper", "Stormtrooper disguise", "A New Hope (1977)", S10, "source-outfit"),
  make("Tomb Raider", "lara_croft_tr", "shadow-brocken", "Brocken", "Brocken", "Shadow of the Tomb Raider — The Forge", S5, "official-costume", "Tenue officielle de la continuité Survivor. Vérifier la compatibilité de la fiche Lara avant de produire ; aucun bonus ni arme du DLC transféré."),
]);
