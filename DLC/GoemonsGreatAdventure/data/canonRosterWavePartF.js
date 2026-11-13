// Goemon's Great Adventure — definitions consumed by src/game/canonRosterWavePartF.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createGoemon() {
  return (Object.freeze({ key: 'goemons_great_adventure', universe: "Goemon's Great Adventure", url: 'https://world-of-nintendo.com/manuals/nintendo_64/goemon_great_adventure.shtml' }));
}

export function createGoemonsGreatAdventure({ GOEMON, definePack, stageVariant }) {
  return (definePack(GOEMON, {
  aliases: ["Goémon d’aventure", 'Goemon Great Adventure', 'Mystical Ninja 2 Starring Goemon'],
  mediaType: 'video-game', faction: 'clockwork', mode: 'RPG', difficulty: 'Very Hard',
  colors: ['#243c6b', '#080b10', '#e8c447'], motif: 'edo',
  theme: 'Goemon’s gang crossing ghost-infested Edo to stop Dochuki',
  continuity: "Goemon's Great Adventure / Ganbare Goemon: Dero Dero Dōchū (Nintendo 64)",
  adaptationRule: 'The spelling “Goémon d’aventure” is resolved to Goemon’s Great Adventure. Use only this game’s manual roster, five-area structure, Entry Passes, day/night ghosts and two-Impact giant-robot system. Dochuki is Underworld boss summoned by Bismaru, not a generic demon.',
  visualAnchor: 'Colorful side-view Edo roads, lantern towns, night ghosts, comic clockwork castles and giant kabuki robots.',
  canonStatus: 'Nintendo 64 game canon grounded in its English manual',
  fr: 'Goemon, Ebisumaru et Yae récupèrent la machine du Sage et affrontent l’armée de poupées d’argile qui prépare la prise de pouvoir de Dochuki.',
  en: 'Goemon, Ebisumaru and Yae recover Wiseman’s machine and confront the Clay Doll Army enabling Dochuki’s takeover.',
  referenceUrls: [GOEMON.url, 'https://www.gamesdatabase.org/Media/SYSTEM/Nintendo_N64/Manual/formated/Goemon-s_Great_Adventure_-_1999_-_Konami.pdf'],
  characters: [
    { id: 'goemon', name: 'Goemon', role: 'slayer', weapon: 'Family pipe', weaponType: 'fists', simple: 'Pipe strike', secondary: 'Wave coin', defense: 'Double jump', special: 'Flame coin', visualAnchor: 'Blue-haired Edo hero in red ninja-style outfit, white wrist wraps, sandals and long kiseru-like family pipe.', fr: 'Le héros impulsif combat avec la pipe transmise dans sa famille.', en: 'The impulsive hero fights with the pipe handed down through his family.' },
    { id: 'ebisumaru', name: 'Ebisumaru', role: 'marine', weapon: 'Magic mallet', weaponType: 'fists', simple: 'Mallet swing', secondary: 'Gesyunnin stars', defense: 'Hip attack', special: 'Mini-Ebisu transformation', visualAnchor: 'Round blue-clad comic ninja with white hood, red nose, sandals and oversized wooden magic mallet.', fr: 'Le partenaire rond et imprévisible dispose du maillet et de techniques uniques.', en: 'The round unpredictable partner uses a mallet and unique techniques.' },
    { id: 'yae', name: 'Yae', role: 'tactical', weapon: 'Katana', weaponType: 'blade', simple: 'Katana slash', secondary: 'Yae bazooka', defense: 'Mermaid dive', special: 'Lock-on bazooka', visualAnchor: 'Green-haired Secret Special Investigations ninja in purple-red practical shinobi clothes with katana and compact bazooka, no sexualization.', fr: 'Ninja d’investigation, Yae apporte katana, bazooka et magie de sirène.', en: 'An investigations ninja, Yae brings katana, bazooka and mermaid magic.' }
  ],
  monsters: [
    { id: 'clay_doll', name: 'Clay Doll Army Cavalry', weapon: 'Clay spear', special: 'Soul-embedded rush', visualAnchor: 'Small ochre mud-doll cavalry with paperlike armor and visible cracks, comic rather than realistic.', fr: 'Les âmes intégrées aux poupées d’argile forment l’armée de Bismaru.', en: 'Souls embedded in clay dolls form Bismaru’s army.', canonStatus: 'canon manual faction' },
    { id: 'night_ghost', name: 'Night Road Ghost', weapon: 'Ectoplasmic touch', special: 'Night-cycle swarm', visualAnchor: 'Playful translucent blue-white Edo ghost hovering over a lantern road after sunset.', fr: 'Les routes deviennent plus dangereuses lorsque les fantômes apparaissent la nuit.', en: 'Roads become more dangerous when ghosts appear at night.', canonStatus: 'canon manual stage enemy archetype' },
    { id: 'clockwork_patrol', name: 'Clockwork Castle Patrol', weapon: 'Mechanical blade', special: 'Trap synchronization', visualAnchor: 'Compact colorful Edo clockwork soldier with brass gears and lacquered blue armor.', fr: 'Un automate affecté aux châteaux piégés.', en: 'An automaton assigned to trapped castles.', canonStatus: 'canon stage enemy archetype' }
  ],
  bosses: [
    { id: 'kabuki_64', name: 'Kabuki 64', weapon: 'Kabuki blade', special: 'Underworld return', visualAnchor: 'Huge theatrical kabuki automaton with white-red face paint, towering black hair and clockwork joints.', fr: 'Kabuki revient des profondeurs pour se venger de Goemon.', en: 'Kabuki returns from the abyss to take revenge on Goemon.', canonStatus: 'canon manual boss' },
    { id: 'obisumaru', name: 'Obisumaru', weapon: 'Dirty-trick arsenal', special: 'Ebisumaru rivalry feint', visualAnchor: 'Showy comic ninja rival echoing Ebisumaru’s round shape in contrasting orange-black clothes.', fr: 'Le rival éternel d’Ebisumaru excelle dans les coups bas.', en: 'Ebisumaru’s eternal rival excels at dirty tricks.', canonStatus: 'canon manual rival boss' },
    { id: 'bismaru', name: 'Bismaru', weapon: 'Summoning machine controls', special: 'Clay Doll deployment', visualAnchor: 'Eccentric future traveler in ornate pink-purple Edo-future costume at a ghost-summoning clockwork console.', fr: 'Bismaru vole la machine du Sage et invoque Dochuki.', en: 'Bismaru steals Wiseman’s machine and summons Dochuki.', canonStatus: 'canon summoner antagonist' }
  ],
  worldBoss: { id: 'dochuki', name: 'Dochuki', weapon: 'Underworld power', special: 'Earth-and-Underworld takeover', visualAnchor: 'Massive purple-red Underworld sovereign with ancient ghost-war armor, horned silhouette and clockwork portal behind him.', fr: 'Le chef du Monde souterrain, autrefois emprisonné après une guerre entre fantômes.', en: 'The Underworld boss once imprisoned after an inter-ghost war.', canonStatus: 'canon final antagonist described by manual' },
  stage: { name: 'Route d’Edo — cycle jour/nuit', visualAnchor: 'Side-view rice fields, wooden bridges, red lanterns and a sky transitioning from gold to ghostly indigo.', fr: 'La même route change de population et de danger lorsque la nuit tombe.', en: 'The same road changes population and danger when night falls.' },
  stageVariants: [
    stageVariant('RPG', 'Château de Kabuki 64', 'Very Hard', 'Kabuki 64', { objective: 'Collect Entry Passes, cross the trap rooms and stop Kabuki 64.' }),
    stageVariant('Smash', 'Robot géant — Impact et Miss Impact', 'Expert', 'Dochuki', { objective: 'Alternate both Impact controls, fill the Blast Gauge and close Dochuki’s machine portal.' })
  ],
  gear: [
    { id: 'chain_pipe', enName: 'Goemon’s Chain Pipe', frName: 'Pipe-chaîne de Goemon', boost: { atk: 6, spd: 1 }, visualAnchor: 'Long red-brown smoking pipe extending on a linked metal chain.', fr: 'La pipe peut s’allonger pour frapper et briser des blocs-étoiles.', en: 'The pipe extends to strike and break Star Blocks.' },
    { id: 'entry_pass', enName: 'Entry Pass', frName: 'Laissez-passer', boost: { hp: 40, def: 4 }, visualAnchor: 'Small Edo travel pass with original abstract seal and no readable characters.', fr: 'Les laissez-passer ouvrent les étapes de porte.', en: 'Entry Passes open gate stages.' },
    { id: 'gold_armor', enName: 'Gold Armor', frName: 'Armure d’or', boost: { def: 8 }, visualAnchor: 'Compact lacquered gold Edo armor pickup on a small cushion.', fr: 'L’armure d’or repousse trois attaques selon le manuel.', en: 'Gold Armor repels three attacks according to the manual.' }
  ],
  event: { id: 'repeat_coop', enName: 'Impact Repeat Cooperative Attack', frName: 'Attaque coopérative répétée d’Impact', en: 'Goemon Impact and Miss Impact alternate cockpit and field controls to build the manual’s cooperative combo.', fr: 'Goemon Impact et Miss Impact alternent commandes de cockpit et de terrain pour construire le combo coopératif du manuel.', visualAnchor: 'Two giant clockwork robots passing the control baton before a synchronized punch-and-kick impact.', canonStatus: 'canon manual giant-robot mechanic' }
}));
}
