import { HEROES_DB } from './heroes';
import { LORE_DB } from './lore';

const slugify = (value) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '_')
  .replace(/^_+|_+$/g, '');

const paletteByMedia = {
  game: '#39c5bb',
  movie: '#ff8c00',
  series: '#9b59b6',
  manga: '#ff4fd8',
  music: '#ffeb3b'
};

const defaultColorFor = (universe) => paletteByMedia[LORE_DB[universe]?.mediaType] || '#39c5bb';

const BATTLE_ITEM_OVERRIDES = {
  'Resident Evil': {
    pickups: [
      ['Herbe verte compacte', 'Compact Green Herb', 'Soin rapide et charge speciale mineure.'],
      ['Grenade flash RPD', 'RPD Flash Grenade', 'Degats de zone et interruption des cibles proches.'],
      ['Munitions incendiaires', 'Incendiary Ammo', 'Bonus offensif court, ideal contre les boss.']
    ],
    summon: ['Renfort S.T.A.R.S.', 'S.T.A.R.S. Backup', 'Un agent temporaire traverse la breche et couvre le terrain.'],
    ultimate: ['Horde T-Virus', 'T-Virus Horde', 'Une vague biocontaminee balaye l ecran puis laisse les ennemis entames.']
  },
  Halo: {
    pickups: [
      ['Bulle de bouclier', 'Bubble Shield', 'Bouclier instantane pour l escouade.'],
      ['Grenade plasma', 'Plasma Grenade', 'Degats concentres sur la ligne ennemie.'],
      ['Suractivation Mjolnir', 'Mjolnir Overdrive', 'Charge speciale et tempo de combat.']
    ],
    summon: ['Pelican de soutien', 'Pelican Support', 'Un passage aerien tire sur les menaces prioritaires.'],
    ultimate: ['MAC orbital', 'Orbital MAC Strike', 'Un tir lourd traverse la breche et frappe tout le front.']
  },
  Stargate: {
    pickups: [
      ['Cellule au naquadah', 'Naquadah Cell', 'Charge speciale et degats energetiques.'],
      ['Balise GDO', 'GDO Beacon', 'Securise une case ou une zone de melee.'],
      ['Drone Ancien', 'Ancient Drone', 'Projectile guidant qui cherche la cible la plus dangereuse.']
    ],
    summon: ['Equipe SG temporaire', 'Temporary SG Team', 'Une equipe de reconnaissance arrive par fenetre de porte.'],
    ultimate: ['Surcharge de Porte', 'Gate Overload', 'Un vortex instable aspire et blesse toutes les signatures hostiles.']
  },
  'Half-Life': {
    pickups: [
      ['Batterie HEV', 'HEV Battery', 'Renforce le bouclier du porteur.'],
      ['Caisse lambda', 'Lambda Crate', 'Degats et recharge aleatoire stabilisee.'],
      ['Nid de snarks', 'Snark Nest', 'Petites morsures de harcelement sur la ligne ennemie.']
    ],
    summon: ['Resistance lambda', 'Lambda Resistance', 'Un duo de resistance pose un tir de couverture.'],
    ultimate: ['Cascade de resonance', 'Resonance Cascade', 'La salle se plie et inflige des degats massifs.']
  },
  Portal: {
    pickups: [
      ['Cube de voyage', 'Companion Cube', 'Bloque et absorbe une partie des degats.'],
      ['Gel repulsif', 'Repulsion Gel', 'Accelere le tempo du heros actif.'],
      ['Noyau PotatOS', 'PotatOS Core', 'Charge speciale et glitch defensif.']
    ],
    summon: ['Tourelle Aperture', 'Aperture Turret', 'Une tourelle temporaire arrose la zone.'],
    ultimate: ['Double portail terminal', 'Terminal Portal Loop', 'Les ennemis sont tires dans une boucle de chute infinie.']
  },
  'The Matrix': {
    pickups: [
      ['Programme esquive', 'Dodge Program', 'Bonus de vitesse et d evasion.'],
      ['Code vert compile', 'Compiled Green Code', 'Degats numeriques directs.'],
      ['Telephone de sortie', 'Exit Phone', 'Soin et repositionnement tactique.']
    ],
    summon: ['Operateur Zion', 'Zion Operator', 'Un operateur charge le terrain avec des armes virtuelles.'],
    ultimate: ['Bullet Time global', 'Global Bullet Time', 'Le temps ralentit pendant que l escouade frappe toute la ligne.']
  },
  'Breaking Bad': {
    pickups: [
      ['Fiole bleue instable', 'Unstable Blue Flask', 'Degats chimiques controles par A.R.C.A.'],
      ['Masque de labo', 'Lab Mask', 'Protection contre les statuts hostiles.'],
      ['Batterie improvisee', 'Improvised Battery', 'Recharge speciale et impulsion electrique.']
    ],
    summon: ['Equipe de laboratoire', 'Lab Crew', 'Des assistants temporaires saturent une case ennemie.'],
    ultimate: ['Reaction en chaine', 'Chain Reaction', 'Une reaction calculee nettoie l ecran sans briser la coherence Nexus.']
  },
  'Buffy the Vampire Slayer': {
    pickups: [
      ['Pieu beni', 'Blessed Stake', 'Degats lourds contre les elites.'],
      ['Grimoire Watcher', 'Watcher Grimoire', 'Charge speciale et lecture tactique.'],
      ['Eau benite', 'Holy Water', 'Zone de protection courte.']
    ],
    summon: ['Scooby Gang', 'Scooby Gang', 'Un groupe allie coupe la pression autour du heros actif.'],
    ultimate: ['Ouverture de Hellmouth', 'Hellmouth Breach', 'La faille s ouvre sous les ennemis et les disperse.']
  },
  Charmed: {
    pickups: [
      ['Potion Halliwell', 'Halliwell Potion', 'Soin et bouclier magique.'],
      ['Page du Livre des Ombres', 'Book of Shadows Page', 'Bonus special et contre-sort.'],
      ['Cristal de protection', 'Warding Crystal', 'Pose une zone defensive.']
    ],
    summon: ['Pouvoir des Trois', 'Power of Three', 'Une assistance magique temporaire amplifie l escouade.'],
    ultimate: ['Rituel de bannissement', 'Vanquishing Ritual', 'Un cercle de bannissement frappe toutes les menaces.']
  }
};

const makeGenericItem = (universe, index, color) => {
  const slug = slugify(universe);
  const templates = [
    {
      id: `${slug}_field_relic`,
      role: 'offense',
      name: { fr: `Relique de ${universe}`, en: `${universe} Field Relic` },
      desc: { fr: `Fragment offensif issu de ${universe}.`, en: `Offensive fragment from ${universe}.` },
      effect: { damage: 26, charge: 8 }
    },
    {
      id: `${slug}_survival_cache`,
      role: 'defense',
      name: { fr: `Cache de survie ${universe}`, en: `${universe} Survival Cache` },
      desc: { fr: `Reserve defensive stabilisee par le Nexus.`, en: `Defensive reserve stabilized by the Nexus.` },
      effect: { heal: 42, shield: 12 }
    },
    {
      id: `${slug}_tempo_core`,
      role: 'tempo',
      name: { fr: `Noyau tempo ${universe}`, en: `${universe} Tempo Core` },
      desc: { fr: `Pulse la signature du heros actif.`, en: `Pulses the active hero signature.` },
      effect: { charge: 28, heal: 18 }
    }
  ];
  return {
    ...templates[index],
    universe,
    tier: 'pickup',
    color,
    melee: {
      fr: 'Ramassable en melee: effet immediat sur le porteur et la ligne ennemie proche.',
      en: 'Melee pickup: immediate effect on the carrier and nearby enemy line.'
    },
    tactics: {
      fr: 'En tactique: devient une case de ressource a poser ou a capturer.',
      en: 'In tactics: becomes a resource tile to place or capture.'
    }
  };
};

const makeItemsForUniverse = (universe) => {
  const color = defaultColorFor(universe);
  const slug = slugify(universe);
  const override = BATTLE_ITEM_OVERRIDES[universe];
  const pickups = override
    ? override.pickups.map(([fr, en, effectText], index) => ({
      id: `${slug}_pickup_${index + 1}`,
      universe,
      tier: 'pickup',
      role: ['offense', 'defense', 'tempo'][index],
      name: { fr, en },
      desc: { fr: effectText, en: effectText },
      melee: { fr: 'Ramassable en melee: declenche son effet des que le heros le securise.', en: 'Melee pickup: triggers as soon as the hero secures it.' },
      tactics: { fr: 'En tactique: peut devenir une case bonus ou une ressource posee sur la carte.', en: 'In tactics: can become a bonus tile or placed map resource.' },
      effect: [
        { damage: 34, charge: 10 },
        { heal: 46, shield: 14 },
        { charge: 32, damage: 16 }
      ][index],
      color
    }))
    : [0, 1, 2].map(index => makeGenericItem(universe, index, color));

  const summon = {
    id: `${slug}_summon`,
    universe,
    tier: 'summon',
    role: 'summon',
    name: {
      fr: override?.summon?.[0] || `Renfort de ${universe}`,
      en: override?.summon?.[1] || `${universe} Assist`
    },
    desc: {
      fr: override?.summon?.[2] || `Invocation PNJ temporaire: une signature alliee de ${universe} intervient sans rejoindre l escouade permanente.`,
      en: override?.summon?.[2] || `Temporary NPC assist: an allied ${universe} signature intervenes without joining the permanent squad.`
    },
    melee: { fr: 'En melee: PNJ de soutien pendant une courte fenetre, degats directs au front.', en: 'In melee: short assist window with direct frontline damage.' },
    tactics: { fr: 'En tactique: pose un marqueur allie qui frappe la case ennemie prioritaire.', en: 'In tactics: places an allied marker that strikes the priority enemy tile.' },
    effect: { summonDamage: 76, charge: 12 },
    color
  };

  const ultimate = {
    id: `${slug}_ultimate`,
    universe,
    tier: 'ultimate',
    role: 'ultimate',
    name: {
      fr: override?.ultimate?.[0] || `Cataclysme ${universe}`,
      en: override?.ultimate?.[1] || `${universe} Ultimate Breach`
    },
    desc: {
      fr: override?.ultimate?.[2] || `Attaque ultime de terrain: A.R.C.A. ouvre une breche massive de ${universe} et frappe tout l ecran.`,
      en: override?.ultimate?.[2] || `Stage ultimate: A.R.C.A. opens a massive ${universe} breach and strikes the whole screen.`
    },
    melee: { fr: 'En melee: attaque spectaculaire plein ecran, rare et decisive.', en: 'In melee: rare, decisive full-screen attack.' },
    tactics: { fr: 'En tactique: equivalent a une carte operationnelle a usage unique sur plusieurs cases.', en: 'In tactics: acts like a one-use operational card across several tiles.' },
    effect: { ultimateDamage: 145, charge: 18 },
    color
  };

  return [...pickups, summon, ultimate];
};

const universeNames = Array.from(new Set([
  ...Object.keys(LORE_DB),
  ...HEROES_DB.map(hero => hero.universe)
])).filter(Boolean).sort((a, b) => a.localeCompare(b));

export const BATTLE_ITEMS_BY_UNIVERSE = Object.fromEntries(
  universeNames.map(universe => [universe, makeItemsForUniverse(universe)])
);

export const BATTLE_ITEM_CATALOG = Object.values(BATTLE_ITEMS_BY_UNIVERSE).flat();

export const getBattleItemsForUniverse = (universe) => BATTLE_ITEMS_BY_UNIVERSE[universe] || makeItemsForUniverse(universe);

export const getBattleItemPoolForStage = (stage) => {
  const universes = Array.from(new Set([
    ...(stage?.sourceUniverses || []),
    stage?.universe
  ].filter(Boolean)));
  return universes.flatMap(universe => getBattleItemsForUniverse(universe));
};
