/** Source-locked equipment chronology; ACTIVE means a runtime label, NOT sprite/animation approval.
 * Historical rows are source documentation, never automatic hero inventory.
 */
export const STAR_WARS_EQUIPMENT_CHRONOLOGY = Object.freeze([
  {
    "id": "SW-AHS-EARLY",
    "actorId": "ahsoka_padawan",
    "actorName": "Ahsoka Tano",
    "edition": "The Clone Wars — early Padawan",
    "item": "Green Lightsaber",
    "kind": "ARME_PORTEE",
    "implementation": "ACTIVE",
    "sourceUrl": "https://www.starwars.com/databank/ahsokas-lightsabers",
    "evidence": "Databank : first green blade and reverse grip",
    "constraint": "Early Padawan only; not the later shoto pair",
    "visual": "NON_VALIDEE_1A1"
  },
  {
    "id": "SW-AHS-LATE",
    "actorId": "ahsoka_padawan",
    "actorName": "Ahsoka Tano",
    "edition": "The Clone Wars — later Padawan",
    "item": "Two green lightsabers (primary and shorter shoto)",
    "kind": "ARMES_PORTEES",
    "implementation": "REFERENCE_ONLY",
    "sourceUrl": "https://www.starwars.com/databank/ahsokas-lightsabers",
    "evidence": "Databank : a second shorter green blade was built during training",
    "constraint": "Later Padawan variant; requires distinct actor edition, art and tests",
    "visual": "NON_VALIDEE_1A1"
  },
  {
    "id": "SW-AHS-SIEGE",
    "actorId": "ahsoka",
    "actorName": "Ahsoka Tano",
    "edition": "The Clone Wars — S7, Siege of Mandalore",
    "item": "Twin Blue Lightsabers",
    "kind": "ARMES_PORTEES",
    "implementation": "ACTIVE",
    "sourceUrl": "https://www.starwars.com/news/clone-wars-declassified-5-highlights-from-old-friends-not-forgotten",
    "evidence": "S7E9 recap : Anakin returns the two blades modified to blue",
    "constraint": "Do not reassign her white Rebels lightsabers",
    "visual": "NON_VALIDEE_1A1"
  },
  {
    "id": "SW-AHS-REBELS",
    "actorId": "ahsoka_adult",
    "actorName": "Ahsoka Tano",
    "edition": "Star Wars Rebels — Fulcrum era",
    "item": "Twin White Lightsabers",
    "kind": "ARMES_PORTEES",
    "implementation": "ACTIVE",
    "sourceUrl": "https://www.starwars.com/databank/ahsokas-lightsabers",
    "evidence": "Databank : later twin white plasma blades during rebellion",
    "constraint": "Exclude the blue Siege of Mandalore blades",
    "visual": "NON_VALIDEE_1A1"
  },
  {
    "id": "SW-MAUL-HALF",
    "actorId": "darth_maul",
    "actorName": "Maul",
    "edition": "The Clone Wars — earlier Shadow Collective",
    "item": "Surviving Single-Bladed Red Lightsaber",
    "kind": "ARME_HISTORIQUE",
    "implementation": "REFERENCE_ONLY",
    "sourceUrl": "https://www.starwars.com/databank/darth-mauls-lightsaber",
    "evidence": "Databank : functional half retained after Naboo and used in Shadow Collective",
    "constraint": "Cannot be silently transferred to S7E10 Ahsoka duel",
    "visual": "NON_VALIDEE_1A1"
  },
  {
    "id": "SW-MAUL-DARK",
    "actorId": "darth_maul",
    "actorName": "Maul",
    "edition": "The Clone Wars — after Shades of Reason",
    "item": "Darksaber",
    "kind": "ARME_SCENE_HISTORIQUE",
    "implementation": "REFERENCE_ONLY",
    "sourceUrl": "https://www.starwars.com/news/what-is-the-darksaber",
    "evidence": "Official Darksaber history : Maul takes and wields it on Mandalore",
    "constraint": "Combat use and symbol are both attested; not the S7E10 default weapon",
    "visual": "NON_VALIDEE_1A1"
  },
  {
    "id": "SW-MAUL-SIEGE",
    "actorId": "darth_maul",
    "actorName": "Maul",
    "edition": "The Clone Wars — S7E10, The Phantom Apprentice",
    "item": "Double-Bladed Red Lightsaber (The Clone Wars S7)",
    "kind": "ARME_PORTEE",
    "implementation": "ACTIVE",
    "sourceUrl": "https://www.starwars.com/news/clone-wars-declassified-5-highlights-from-the-phantom-apprentice",
    "evidence": "S7E10 recap : his double-sided blade during Ahsoka duel",
    "constraint": "Do not assert that the hilt is the unbroken Naboo model",
    "visual": "NON_VALIDEE_1A1"
  },
  {
    "id": "SW-MAUL-LEGS",
    "actorId": "darth_maul",
    "actorName": "Maul",
    "edition": "The Clone Wars — S7E10, The Phantom Apprentice",
    "item": "Cybernetic Legs",
    "kind": "ANATOMIE_PROTHESE",
    "implementation": "ACTIVE",
    "sourceUrl": "https://www.starwars.com/series/clone-wars/the-phantom-apprentice-episode-guide",
    "evidence": "Episode commentary : Ray Park adapted Maul's fighting for metal legs",
    "constraint": "Prosthesis, not a detachable equipable weapon",
    "visual": "NON_VALIDEE_1A1"
  }
].map(entry => Object.freeze(entry)));
