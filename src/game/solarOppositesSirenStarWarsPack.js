// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcSolarOpposites from '../../DLC/SolarOpposites/data/solarOppositesSirenStarWarsPack.js';
import * as dlcSirenHead from '../../DLC/SirenHead/data/solarOppositesSirenStarWarsPack.js';
import * as dlcStarWars from '../../DLC/StarWars/data/solarOppositesSirenStarWarsPack.js';

const localized = (fr, en) => ({ fr, en });

const action = (name, type, dmg, extra = {}) => ({
  name,
  type,
  dmg,
  ...extra
});

const fighter = ({
  id,
  name,
  cat,
  color,
  accent,
  weaponType,
  stats,
  simple,
  secondary,
  defense,
  special,
  equipment,
  incarnation,
  canonStatus = 'canon',
  ...fidelityMetadata
}) => ({
  id,
  name,
  cat,
  color,
  // Fallback renderer uses primaryColor; source fighter templates previously only exposed color.
  primaryColor: color,
  secondaryColor: accent,
  weaponType,
  weaponColor: accent,
  stats,
  simple,
  secondary,
  defense,
  special,
  equipment,
  incarnation,
  canonStatus,
  ...fidelityMetadata
});

const plaque = ({
  clearance,
  rankFr,
  rankEn,
  roleFr,
  roleEn,
  callSign,
  originFr,
  originEn,
  dossierFr,
  dossierEn,
  breachFr,
  breachEn,
  doctrineFr,
  doctrineEn,
  threatFr,
  threatEn,
  tags
}) => ({
  clearance,
  rank: localized(rankFr, rankEn),
  role: localized(roleFr, roleEn),
  callSign,
  origin: localized(originFr, originEn),
  dossier: localized(dossierFr, dossierEn),
  breachLore: localized(breachFr, breachEn),
  doctrine: localized(doctrineFr, doctrineEn),
  threat: localized(threatFr, threatEn),
  tags
});

const korvo = dlcSolarOpposites.createKorvo({ action, fighter });

const terry = dlcSolarOpposites.createTerry({ action, fighter });

const yumyulack = dlcSolarOpposites.createYumyulack({ action, fighter });

const jesse = dlcSolarOpposites.createJesse({ action, fighter });

const sirenHead = dlcSirenHead.createSirenHead({ action, fighter });

const longHorse = dlcSirenHead.createLongHorse({ action, fighter });

const cartoonCat = dlcSirenHead.createCartoonCat({ action, fighter });

const ahsokaPadawan = dlcStarWars.createAhsokaPadawan({ action, fighter });

const ahsokaSiege = dlcStarWars.createAhsokaSiege({ action, fighter });

const ahsokaAdult = dlcStarWars.createAhsokaAdult({ action, fighter });

const aaylaSecura = dlcStarWars.createAaylaSecura({ action, fighter });

const darthMaul = dlcStarWars.createDarthMaul({ action, fighter });

const darthRevan = dlcStarWars.createDarthRevan({ action, fighter });

const darthTalon = dlcStarWars.createDarthTalon({ action, fighter });

export const SOLAR_OPPOSITES_SIREN_STAR_WARS_HERO_EXPANSIONS = {
  'Solar Opposites': dlcSolarOpposites.createSolarOppositesSirenStarWarsHeroExpansions({ jesse, korvo, terry, yumyulack }),
  'Siren Head': dlcSirenHead.createSolarOppositesSirenStarWarsHeroExpansions({ cartoonCat, longHorse, sirenHead }),
  'Star Wars': dlcStarWars.createSolarOppositesSirenStarWarsHeroExpansions({ aaylaSecura, ahsokaAdult, ahsokaPadawan, darthRevan, darthTalon })
};

export const SOLAR_OPPOSITES_SIREN_STAR_WARS_HERO_OVERRIDES = {
  ahsoka: ahsokaSiege,
  darth_maul: darthMaul
};

export const SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE = [
  dlcSolarOpposites.createSolarOppositesSirenStarWarsUniverseWave(),
  dlcSirenHead.createSolarOppositesSirenStarWarsUniverseWave()
];

export const SOLAR_OPPOSITES_SIREN_STAR_WARS_LORE_DB = {
  'Solar Opposites': dlcSolarOpposites.createSolarOppositesSirenStarWarsLoreDb({ SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE, localized }),
  'Siren Head': dlcSirenHead.createSolarOppositesSirenStarWarsLoreDb({ SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE, localized })
};

export const SOLAR_OPPOSITES_SIREN_STAR_WARS_CHARACTER_PLAQUES = {
  korvo_solar: dlcSolarOpposites.createSolarOppositesSirenStarWarsCharacterPlaques({ plaque }),
  terry_solar: dlcSolarOpposites.createSolarOppositesSirenStarWarsCharacterPlaques2({ plaque }),
  yumyulack_solar: dlcSolarOpposites.createSolarOppositesSirenStarWarsCharacterPlaques3({ plaque }),
  jesse_solar: dlcSolarOpposites.createSolarOppositesSirenStarWarsCharacterPlaques4({ plaque }),
  siren_head: dlcSirenHead.createSolarOppositesSirenStarWarsCharacterPlaques({ plaque }),
  long_horse: dlcSirenHead.createSolarOppositesSirenStarWarsCharacterPlaques2({ plaque }),
  cartoon_cat: dlcSirenHead.createSolarOppositesSirenStarWarsCharacterPlaques3({ plaque }),
  ahsoka_padawan: dlcStarWars.createSolarOppositesSirenStarWarsCharacterPlaques({ plaque }),
  ahsoka: dlcStarWars.createSolarOppositesSirenStarWarsCharacterPlaques2({ plaque }),
  ahsoka_adult: dlcStarWars.createSolarOppositesSirenStarWarsCharacterPlaques3({ plaque }),
  aayla_secura: dlcStarWars.createSolarOppositesSirenStarWarsCharacterPlaques4({ plaque }),
  darth_maul: dlcStarWars.createSolarOppositesSirenStarWarsCharacterPlaques5({ plaque }),
  darth_revan: dlcStarWars.createSolarOppositesSirenStarWarsCharacterPlaques6({ plaque }),
  darth_talon: dlcStarWars.createSolarOppositesSirenStarWarsCharacterPlaques7({ plaque })
};

export const SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES = {
  korvo_solar: '/sprites/generated/heroes/solar-opposites/korvo-solar.png',
  terry_solar: '/sprites/generated/heroes/solar-opposites/terry-solar.png',
  yumyulack_solar: '/sprites/generated/heroes/solar-opposites/yumyulack-solar.png',
  jesse_solar: '/sprites/generated/heroes/solar-opposites/jesse-solar.png',
  siren_head: '/sprites/generated/heroes/siren-head/siren-head.png',
  long_horse: '/sprites/generated/heroes/siren-head/long-horse.png',
  cartoon_cat: '/sprites/generated/heroes/siren-head/cartoon-cat.png',
  ahsoka_padawan: '/sprites/generated/heroes/star-wars/ahsoka-padawan.png',
  ahsoka: '/sprites/generated/heroes/star-wars/ahsoka.png',
  ahsoka_adult: '/sprites/generated/heroes/star-wars/ahsoka-adult.png',
  aayla_secura: '/sprites/generated/heroes/star-wars/aayla-secura.png',
  darth_maul: '/sprites/generated/heroes/star-wars/darth-maul.png',
  darth_revan: '/sprites/generated/heroes/star-wars/darth-revan.png',
  darth_talon: '/sprites/generated/heroes/star-wars/darth-talon.png'
};

export const SOLAR_OPPOSITES_SIREN_STAR_WARS_REFERENCE_ENTRIES = [
  ['Korvo', 'Solar Opposites - current suburban outfit', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.korvo_solar, ['https://www.hulu.com/series/solar-opposites-f089664b-1a87-433b-86a5-24e7da5a246a']],
  ['Terry', 'Solar Opposites - current suburban outfit', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.terry_solar, ['https://www.hulu.com/series/solar-opposites-f089664b-1a87-433b-86a5-24e7da5a246a']],
  ['Yumyulack', 'Solar Opposites - replicant trench-coat outfit', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.yumyulack_solar, ['https://www.hulu.com/series/solar-opposites-f089664b-1a87-433b-86a5-24e7da5a246a']],
  ['Jesse', 'Solar Opposites - replicant pink polka-dot dress', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.jesse_solar, ['https://www.hulu.com/series/solar-opposites-f089664b-1a87-433b-86a5-24e7da5a246a']],
  ['Siren Head', 'Trevor Henderson solitary twin-siren mimetic predator', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.siren_head, ['https://www.trevorhenderson.com/', 'https://trevorhenderson.fandom.com/wiki/Siren_Head']],
  ['Long Horse', 'Trevor Henderson benevolent endless-neck omen entity', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.long_horse, ['https://www.trevorhenderson.com/', 'https://trevorhenderson.fandom.com/wiki/Long_Horse']],
  ['Cartoon Cat', 'Trevor Henderson old-media faux cartoon body', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.cartoon_cat, ['https://www.trevorhenderson.com/', 'https://trevorhenderson.fandom.com/wiki/Cartoon_Cat']],
  ['Ahsoka Tano (Padawan)', 'The Clone Wars early Padawan with one green lightsaber', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.ahsoka_padawan, ['https://www.starwars.com/databank/ahsokas-lightsabers', 'https://www.starwars.com/databank/ahsoka-tano']],
  ['Ahsoka Tano (Siege of Mandalore)', 'The Clone Wars final-season Mandalore outfit with twin blue lightsabers', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.ahsoka, ['https://www.starwars.com/news/clone-wars-declassified-5-highlights-from-old-friends-not-forgotten', 'https://www.starwars.com/series/clone-wars/old-friends-not-forgotten-episode-guide']],
  ['Ahsoka Tano (Adult)', 'Star Wars Rebels Fulcrum-era former Jedi with twin white lightsabers', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.ahsoka_adult, ['https://www.starwars.com/databank/ahsokas-lightsabers', 'https://www.starwars.com/databank/ahsoka-tano']],
  ['Aayla Secura', 'Clone Wars Twi lek Jedi General', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.aayla_secura, ['https://www.starwars.com/databank/aayla-secura']],
  ['Darth Maul', 'The Clone Wars S7 Siege of Mandalore: red double-bladed duel weapon and cybernetic legs', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.darth_maul, ['https://www.starwars.com/series/clone-wars/the-phantom-apprentice-episode-guide', 'https://www.starwars.com/news/clone-wars-declassified-5-highlights-from-the-phantom-apprentice', 'https://www.starwars.com/databank/maul']],
  ['Darth Revan', 'KOTOR I masked Sith: one red lightsaber; KOTOR II red/purple duel and SWTOR masks/hilts are distinct depictions', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.darth_revan, ['https://crls.501st.com/tfe/darth-revan-kotor-i-and-ii', 'https://www.starwars.com/games-apps/knights-of-the-old-republic', 'https://www.swtor.com/info/news/article/20201209-0']],
  ['Darth Talon', 'Star Wars Legacy One Sith Hand: ritual body markings and distinct 501st-reference protective plates', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.darth_talon, ['https://crls.501st.com/tfe/darth-talon', 'https://starwars.fandom.com/wiki/Darth_Talon']]
].map(([character, incarnation, output, referencePages]) => ({
  character,
  incarnation,
  output,
  referencePages,
  referenceImages: [],
  verifiedAt: '2026-07-23'
}));
