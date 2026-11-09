// Spyro — definitions consumed by src/game/canonRosterWavePartE.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSources() {
  return (Object.freeze({ key: 'spyro', universe: 'Spyro', url: 'https://www.spyrothedragon.com/pl/spyroreignitedtrilogy' }));
}

export function createCanonRosterWavePartE({ SOURCES, definePack, stageVariant }) {
  return (definePack(SOURCES.spyro, {
  aliases: ['Spyro Reignited Trilogy', 'Spyro the Dragon'], mediaType: 'game-franchise', faction: 'arcane', mode: 'RPG', difficulty: 'Hard',
  colors: ['#6b3dc1', '#161028', '#f0a52e'], motif: 'dragonrealm', theme: 'dragon platforming across the Dragon Realms, Avalar and Forgotten Worlds',
  continuity: 'Spyro Reignited Trilogy’s remastered versions of the original three Insomniac games',
  adaptationRule: 'Keep Spyro quadrupedal and small, Sparx dragonfly-sized and Hunter an Avalar ally. Gnorcs, Riptocs and Rhynocs belong to their respective games; the anthology roster never pretends all three invasions occurred simultaneously.',
  visualAnchor: 'Bright fantasy homeworlds, stone portals, gems, dragon eggs and Spyro’s small purple quadrupedal dragon silhouette.',
  canonStatus: 'official Reignited Trilogy anthology with game-of-origin labels',
  fr: 'Spyro, Sparx et Hunter traversent trois aventures restaurées pour libérer les dragons, sauver Avalar et récupérer les œufs volés.',
  en: 'Spyro, Sparx and Hunter cross three restored adventures to free the dragons, save Avalar and recover the stolen eggs.',
  referenceUrls: [SOURCES.spyro.url, 'https://support.activision.com/spyro'],
  characters: [
    { id: 'spyro', name: 'Spyro', role: 'slayer', weapon: 'Dragon flame', weaponType: 'magic', secondary: 'Horn charge', defense: 'Wing glide', special: 'Superflame sweep', visualAnchor: 'Small quadrupedal purple dragon with yellow-orange curved horns, orange wing membranes, golden belly scales and a compact charge posture.', fr: 'Spyro utilise son souffle, ses cornes et son vol plané pour protéger les royaumes.', en: 'Spyro uses flame, horns and gliding to protect the realms.' },
    { id: 'sparx', name: 'Sparx', role: 'hacker', weapon: 'Dragonfly shield', weaponType: 'focus', secondary: 'Gem pickup', defense: 'Colour-state guard', special: 'Dragonfly barrier', visualAnchor: 'Tiny golden-yellow dragonfly with four translucent wings, blue eyes and a glow no larger than Spyro’s head.', fr: 'Sparx protège Spyro et indique son état de santé par sa couleur.', en: 'Sparx protects Spyro and shows his health through colour.', canonStatus: 'canon companion adapted as support hero' },
    { id: 'hunter', name: 'Hunter', role: 'tactical', weapon: 'Bow and arrow', weaponType: 'gun', secondary: 'Athletic leap', defense: 'Cheetah sidestep', special: 'Avalar target volley', visualAnchor: 'Tall slim yellow cheetah with black spots, red-brown utility vest, bow and eager athletic stance.', fr: 'L’athlète d’Avalar guide Spyro et relève ses propres défis.', en: 'Avalar’s athlete guides Spyro and takes on challenges of his own.' }
  ],
  monsters: [
    { id: 'gnorc', name: 'Gnorc Warrior', weapon: 'Club', special: 'Dragon Realm patrol', visualAnchor: 'Stocky green Gnorc with underbite, brown jerkin and crude wooden club from Spyro the Dragon.', fr: 'Un soldat de l’armée créée par Gnasty Gnorc.', en: 'A soldier from Gnasty Gnorc’s conjured army.', canonStatus: 'canon Spyro the Dragon enemy class' },
    { id: 'riptoc', name: 'Riptoc', weapon: 'Spear', special: 'Avalar ambush', visualAnchor: 'Small orange-red reptilian Riptoc in simple metal cap carrying an oversized spear.', fr: 'Un sbire reptilien de Ripto dans Avalar.', en: 'One of Ripto’s reptilian minions in Avalar.', canonStatus: 'canon Spyro 2 enemy class' },
    { id: 'rhynoc', name: 'Rhynoc', weapon: 'Mallet', special: 'Egg guard', visualAnchor: 'Broad blue-gray rhinoceros guard in red vest with cartoon mallet and Forgotten Worlds proportions.', fr: 'Un garde de l’armée de la Sorcière chargé des œufs volés.', en: 'A guard in the Sorceress’s army assigned to the stolen eggs.', canonStatus: 'canon Year of the Dragon enemy class' }
  ],
  bosses: [
    { id: 'toasty', name: 'Toasty', weapon: 'Scythe disguise', special: 'Sheep reveal', visualAnchor: 'Tall scarecrow-like robed figure with pumpkin-orange head and scythe, revealing the canonical sheep disguise beneath.', fr: 'Le premier grand duel dévoile un mouton caché sous un épouvantail.', en: 'The first major duel reveals a sheep hidden beneath a scarecrow.', canonStatus: 'canon Spyro the Dragon boss' },
    { id: 'gulp', name: 'Gulp', weapon: 'Body slam', special: 'Arena weapon swallow', visualAnchor: 'Huge quadrupedal green-blue Riptoc beast with orange back plates, broad jaw and Ripto-arena scale.', fr: 'La monture massive de Ripto transforme les objets de l’arène en attaques.', en: 'Ripto’s massive mount turns arena objects into attacks.', canonStatus: 'canon Spyro 2 boss' },
    { id: 'spike', name: 'Spike', weapon: 'Magma club', special: 'Lava arena blast', visualAnchor: 'Towering muscular red Rhynoc with horn, metal shoulder guards and oversized flaming club.', fr: 'La Sorcière fait grandir Spike pour défendre son territoire volcanique.', en: 'The Sorceress enlarges Spike to defend her volcanic territory.', canonStatus: 'canon Year of the Dragon boss' }
  ],
  worldBoss: { id: 'sorceress', name: 'The Sorceress', weapon: 'Forgotten Worlds magic', special: 'Saucer and spell barrage', visualAnchor: 'Tall blue reptilian sorceress in red-purple robes with gold staff, framed by stolen dragon eggs and a lava arena.', fr: 'La Sorcière commande les Rhynocs et vole les œufs de dragon pour préserver sa magie.', en: 'The Sorceress commands the Rhynocs and steals dragon eggs to preserve her magic.', canonStatus: 'canon Year of the Dragon principal antagonist', objective: 'Recover the remaining dragon eggs and defeat the Sorceress in her true arena sequence.' },
  stage: { name: 'Artisans — colline des portails', visualAnchor: 'Green Artisans grassland with stone dragon pedestals, waterfall, gem trails and portal archways.', fr: 'Le monde des Artisans sert de porte d’entrée aux royaumes de dragons.', en: 'The Artisans homeworld serves as the gateway to the Dragon Realms.' },
  stageVariants: [stageVariant('RPG', 'Avalar — arène de Gulp', 'Very Hard', 'Gulp', { objective: 'Intercept dropped items before Gulp swallows them.' }), stageVariant('Smash', 'Forgotten Worlds — antre de la Sorcière', 'Expert', 'The Sorceress', { objective: 'Use every vehicle phase and recover the guarded eggs.' })],
  gear: [
    { id: 'dragon_talisman', enName: 'Avalar Talisman', frName: 'Talisman d’Avalar', boost: { atk: 6, spd: 2 }, visualAnchor: 'Small original sun-shaped gold talisman with turquoise inlay and no text.', fr: 'Les talismans rouvrent le passage entre les mondes d’Avalar.', en: 'Talismans reopen passage between Avalar’s worlds.' },
    { id: 'dragon_egg', enName: 'Dragon Egg', frName: 'Œuf de dragon', boost: { hp: 65, def: 2 }, visualAnchor: 'Large cream dragon egg with purple spots resting in a padded stone nest.', fr: 'Un œuf volé à récupérer dans les Forgotten Worlds.', en: 'A stolen egg to recover in the Forgotten Worlds.' },
    { id: 'superflame', enName: 'Superflame Power-up', frName: 'Bonus Superflamme', boost: { atk: 8 }, visualAnchor: 'Winged stone power-up gate glowing orange-purple around a flame crystal.', fr: 'Une porte temporaire amplifie le souffle de Spyro.', en: 'A temporary gate amplifies Spyro’s breath.' }
  ],
  event: { id: 'three_realms', enName: 'Three-Realm Dragon Run', frName: 'Course des trois royaumes', en: 'Spyro links one Dragon Realm, one Avalar world and one Forgotten World without losing Sparx’s protection.', fr: 'Spyro enchaîne un royaume des dragons, un monde d’Avalar et un Forgotten World sans perdre la protection de Sparx.', visualAnchor: 'Three adjacent stone portals with exact Gnorc, Riptoc and Rhynoc silhouettes kept in their own worlds.' }
}));
}
