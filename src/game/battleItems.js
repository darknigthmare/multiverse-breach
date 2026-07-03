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

const mediaItemFlavor = {
  game: {
    offense: { fr: 'module offensif extrait des regles jouables du monde', en: 'offensive module extracted from the playable rules of the world' },
    defense: { fr: 'cache de survie convertie en protection Nexus', en: 'survival cache converted into Nexus protection' },
    tempo: { fr: 'routine de tempo qui recharge les actions du porteur', en: 'tempo routine that recharges the carrier actions' }
  },
  movie: {
    offense: { fr: 'plan d impact cinematographique condense en artefact', en: 'cinematic impact beat condensed into an artifact' },
    defense: { fr: 'accessoire de scene transforme en garde-fou narratif', en: 'screen prop turned into a narrative safeguard' },
    tempo: { fr: 'coupe de montage qui accelere une action decisive', en: 'editing cut that accelerates a decisive action' }
  },
  series: {
    offense: { fr: 'ressort d episode transforme en pression de combat', en: 'episode beat turned into combat pressure' },
    defense: { fr: 'ressource recurrente qui garde l escouade en vie', en: 'recurring resource that keeps the squad alive' },
    tempo: { fr: 'cliffhanger stabilise qui relance le tour suivant', en: 'stabilized cliffhanger that restarts the next turn' }
  },
  manga: {
    offense: { fr: 'technique d arc compressee en frappe ramassable', en: 'arc technique compressed into a pickup strike' },
    defense: { fr: 'talisman d arc qui retient la transformation', en: 'arc talisman that restrains transformation' },
    tempo: { fr: 'signal de power-up qui pousse le rythme du duel', en: 'power-up signal that pushes duel tempo' }
  },
  music: {
    offense: { fr: 'riff de resonance converti en onde offensive', en: 'resonance riff converted into an offensive wave' },
    defense: { fr: 'boucle harmonique qui amortit la pression ennemie', en: 'harmonic loop that absorbs enemy pressure' },
    tempo: { fr: 'pulse de scene qui synchronise le heros actif', en: 'stage pulse that synchronizes the active hero' }
  }
};

const BATTLE_ITEM_OVERRIDES = {
  'Resident Evil': {
    pickups: [
      ['Herbe verte compacte', 'Compact Green Herb', 'Ressource de survie Raccoon City: en melee elle soigne au ramassage, en tactique elle devient une case de secours a proteger.'],
      ['Grenade flash R.P.D.', 'R.P.D. Flash Grenade', 'Contre-mesure anti-B.O.W.: aveugle les infectes proches, coupe une charge de Licker ou de chien zombie et ouvre une seconde de repositionnement.'],
      ['Munitions incendiaires Umbrella', 'Umbrella Incendiary Rounds', 'Cartouches recuperees dans un stockage de crise: brulent les mutations, percent les masses infectees et donnent a Leon une reponse courte contre les formes instables.']
    ],
    summon: ['Renfort S.T.A.R.S.', 'S.T.A.R.S. Backup', 'Invocation temporaire: un operateur S.T.A.R.S. traverse la breche, couvre les survivants et marque les B.O.W. prioritaires.'],
    ultimate: ['Confinement Raccoon City', 'Raccoon City Lockdown', 'Attaque ultime: sirenes, barricades et frappe anti-B.O.W. enferment la zone; une horde T-Virus deviee submerge les ennemis avant extraction A.R.C.A.']
  },
  Halo: {
    pickups: [
      ['Bulle de bouclier deployable', 'Deployable Bubble Shield', 'Generateur UNSC de campagne: en melee il cree une fenetre de survie courte, en tactique il securise une case contre le tir Covenant.'],
      ['Grenade plasma Covenant', 'Covenant Plasma Grenade', 'Explosif adhesif de technologie Covenant: colle une cible prioritaire, punit les groupes serres et rappelle le danger des lignes Elites/Grunts.'],
      ['Batterie de bouclier MJOLNIR', 'MJOLNIR Shield Cell', 'Cellule energetique compatible Spartan: recharge une partie du bouclier, accelere la reprise d assaut et stabilise le porteur sous feu nourri.']
    ],
    summon: ['Pelican Echo 419', 'Echo 419 Pelican', 'Invocation temporaire UNSC: Foehammer ouvre une passe de soutien, depose des munitions et mitraille les signatures Covenant les plus proches.'],
    ultimate: ['Tir MAC orbital', 'Orbital MAC Strike', 'Attaque ultime UNSC: une solution de tir Magnetic Accelerator Cannon traverse la breche et frappe la ligne ennemie comme une frappe anti-capital ship miniaturisee.']
  },
  'Silent Hill': {
    pickups: [
      ['Radio parasite', 'Static Radio', 'Alerte de survie Silent Hill: en melee elle gronde quand une menace approche, en tactique elle revele une case ennemie cachee par le brouillard.'],
      ['Ampoule de soin', 'Health Drink', 'Ressource fragile de survie: soigne peu mais vite, utile quand l Otherworld force a avancer sans station sure.'],
      ['Carte griffonnee de South Vale', 'Marked South Vale Map', 'Carte qui se corrige pendant la mission: indique une sortie, marque les portes condamnees et reduit le risque de tourner en boucle dans la ville.']
    ],
    summon: ['Echo de Harry Mason', 'Harry Mason Echo', 'Invocation temporaire: une trace de Harry traverse le brouillard, guide Heather/James vers une sortie et repousse les monstres symboliques sans briser le ton survival.'],
    ultimate: ['Sirene Otherworld', 'Otherworld Siren', 'Attaque ultime: la sirene retentit, les murs deviennent rouille et la ville juge les ennemis; les cibles sont ralenties, marquees et frappees par leurs propres symboles.']
  },
  Stargate: {
    pickups: [
      ['Cellule au naquadah', 'Naquadah Cell', 'Source energetique instable: en melee elle charge une frappe, en tactique elle alimente une Porte ou surcharge un bouclier Goa uld.'],
      ['Balise GDO SGC', 'SGC GDO Beacon', 'Identification de retour Terre: securise une zone, valide les allies et bloque les signatures hostiles avant ouverture iris.'],
      ['Drone Ancien', 'Ancient Drone', 'Technologie des Anciens: projectile guidant qui traverse les defenses ordinaires et cherche le noyau de menace le plus dangereux.']
    ],
    summon: ['Equipe SG temporaire', 'Temporary SG Team', 'Invocation temporaire: une equipe SG franchit la Porte, pose un tir de couverture et marque les coordonnees de repli.'],
    ultimate: ['Surcharge de Porte', 'Gate Overload', 'Attaque ultime: les chevrons se verrouillent de force, un vortex instable arrache les signatures hostiles et l iris se referme avant contre-invasion.']
  },
  'Half-Life': {
    pickups: [
      ['Batterie auxiliaire HEV', 'HEV Auxiliary Battery', 'Module de combinaison Black Mesa: en melee il restaure l armure du porteur, en tactique il devient une case de recharge HEV sous feu Combine.'],
      ['Caisse Lambda', 'Lambda Crate', 'Cache de resistance Half-Life: munitions, medkit ou charge experimentale; elle transforme la rarete des ressources en decision de terrain.'],
      ['Nid de snarks Xen', 'Xen Snark Nest', 'Containment Xen instable: libere de petites creatures agressives qui harcelent les ennemis et cassent les lignes de tir.']
    ],
    summon: ['Cellule Resistance Lambda', 'Lambda Resistance Cell', 'Invocation temporaire: Barney et une cellule de resistance ouvrent une couverture courte, posent des munitions et guident les survivants vers la sortie.'],
    ultimate: ['Cascade de resonance controlee', 'Controlled Resonance Cascade', 'Attaque ultime: A.R.C.A. force une mini-cascade Black Mesa, aspire les cibles dans une rupture Xen puis referme la frequence avant invasion totale.']
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
  const lore = LORE_DB[universe];
  const mediaType = lore?.mediaType || 'game';
  const flavor = mediaItemFlavor[mediaType] || mediaItemFlavor.game;
  const title = lore?.title || { fr: universe, en: universe };
  const templates = [
    {
      id: `${slug}_field_relic`,
      role: 'offense',
      name: { fr: `Relique d impact ${title.fr}`, en: `${title.en} Impact Relic` },
      desc: {
        fr: `${title.fr}: ${flavor.offense.fr}. Le Nexus l autorise en melee comme declencheur lisible, avec une signature de Trame identifiable.`,
        en: `${title.en}: ${flavor.offense.en}. The Nexus allows it in melee as a readable trigger, not an abstract bonus.`
      },
      effect: { damage: 26, charge: 8 }
    },
    {
      id: `${slug}_survival_cache`,
      role: 'defense',
      name: { fr: `Cache d ancrage ${title.fr}`, en: `${title.en} Anchor Cache` },
      desc: {
        fr: `${title.fr}: ${flavor.defense.fr}. En tactique, A.R.C.A. peut la poser comme zone de repli coherente avec le lore local.`,
        en: `${title.en}: ${flavor.defense.en}. In tactics, A.R.C.A. can place it as a fallback zone coherent with local lore.`
      },
      effect: { heal: 42, shield: 12 }
    },
    {
      id: `${slug}_tempo_core`,
      role: 'tempo',
      name: { fr: `Noyau de cadence ${title.fr}`, en: `${title.en} Cadence Core` },
      desc: {
        fr: `${title.fr}: ${flavor.tempo.fr}. Il sert a garder le rythme de la Trame sans transformer le combat en effet hors-sujet.`,
        en: `${title.en}: ${flavor.tempo.en}. It keeps the Thread rhythm without turning combat into an off-theme effect.`
      },
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
    rpg: {
      fr: 'Commande RPG: consomme l ATB du heros actif pour declencher une relique de Trame.',
      en: 'RPG command: consumes the active hero ATB to trigger a Thread relic.'
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
      rpg: { fr: 'Commande RPG: utilise la jauge ATB du heros actif pour convertir cet artefact en action de soutien.', en: 'RPG command: spends the active hero ATB to convert this artifact into a support action.' },
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
    rpg: { fr: 'Commande RPG: depense une ATB pleine pour appeler un renfort temporaire entre deux tours ennemis.', en: 'RPG command: spends a full ATB to call a temporary assist between enemy turns.' },
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
    rpg: { fr: 'Commande RPG: limite break d artefact, declenchee par le heros actif quand son ATB est prete.', en: 'RPG command: artifact limit break, triggered by the active hero when ATB is ready.' },
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
