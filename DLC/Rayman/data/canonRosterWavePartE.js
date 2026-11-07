// Rayman — definitions consumed by src/game/canonRosterWavePartE.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSources() {
  return (Object.freeze({ key: 'rayman', universe: 'Rayman', url: 'https://www.ubisoft.com/en-us/company/about-us/our-brands/rayman' }));
}

export function createCanonRosterWavePartE({ SOURCES, definePack, stageVariant }) {
  return (definePack(SOURCES.rayman, {
  aliases: ['Rayman franchise', 'Rayman Legends'], mediaType: 'game-franchise', faction: 'arcane', mode: 'RPG', difficulty: 'Hard',
  colors: ['#6e4ab5', '#102538', '#f1c541'], motif: 'dreamglade', theme: 'limbless platforming through the Glade of Dreams and magical paintings',
  continuity: 'Ubisoft mainline Rayman games, presented as a labelled franchise anthology rather than one merged incident',
  adaptationRule: 'Preserve Rayman’s limbless floating hands and feet, Globox’s large blue frog-like body and Barbara’s Rayman Legends barbarian silhouette. Named villains retain their game of origin; Rabbids are not substituted for the mainline bestiary.',
  visualAnchor: 'Painterly Glade of Dreams, floating platforms, Electoons, lum trails, plum trees and theatrical portals.',
  canonStatus: 'canon mainline-franchise anthology with cross-game Nexus team',
  fr: 'Rayman, Globox et Barbara bondissent entre les tableaux de la Croisée des Rêves pour empêcher Mr Dark d’étendre son ombre.',
  en: 'Rayman, Globox and Barbara leap between Glade of Dreams paintings to stop Mr Dark from spreading his shadow.',
  referenceUrls: [SOURCES.rayman.url, 'https://www.ubisoft.com/en-us/games/rayman-legends', 'https://news.ubisoft.com/en-us/article/mqXBE5x8Kcn2NzNmrJclL/rayman-legends-definitive-edition-out-now-on-nintendo-switch'],
  characters: [
    { id: 'rayman', name: 'Rayman', role: 'slayer', weapon: 'Telescopic fist', weaponType: 'fists', secondary: 'Hair helicopter', defense: 'Limbless roll', special: 'Charged fist storm', visualAnchor: 'Limbless hero with floating white-gloved hands and yellow shoes, blond hair crest, purple torso with white ring and red neckerchief.', fr: 'Le héros sans bras ni jambes frappe à distance et plane avec ses cheveux.', en: 'The limbless hero punches at range and glides with his hair.' },
    { id: 'globox', name: 'Globox', role: 'marine', weapon: 'Globox slap', weaponType: 'fists', secondary: 'Rain dance', defense: 'Blue-body brace', special: 'Glade belly bounce', visualAnchor: 'Very large rounded blue frog-like friend with pale belly, long arms, tiny feet and broad friendly smile.', fr: 'Le meilleur ami de Rayman apporte sa force, sa maladresse et une loyauté absolue.', en: 'Rayman’s best friend brings strength, clumsiness and absolute loyalty.' },
    { id: 'barbara', name: 'Barbara', role: 'tactical', weapon: 'Battle axe', weaponType: 'blade', secondary: 'Axe rebound', defense: 'Viking roll', special: 'Princess rescue rush', visualAnchor: 'Small orange-haired barbarian princess with winged helmet, green tunic, striped leggings and one broad double-headed axe; practical cartoon design without sexualisation.', fr: 'La princesse guerrière de Rayman Legends manie sa hache avec agilité.', en: 'The warrior princess from Rayman Legends wields her axe with agility.' }
  ],
  monsters: [
    { id: 'antitoon', name: 'Antitoon', weapon: 'Dark-energy touch', special: 'Protoon disruption', visualAnchor: 'Small dark-purple spiky creature with round white eyes and floating cartoon hands from the original Rayman.', fr: 'Mr Dark transforme l’équilibre du monde en créant les Antitoons.', en: 'Mr Dark disrupts the world’s balance through the Antitoons.', canonStatus: 'canon Rayman enemy' },
    { id: 'hoodlum', name: 'Hoodlum', weapon: 'Armoured punch', special: 'Black Lum swarm', visualAnchor: 'Tall cloth-wrapped purple-red Hoodlum with long arms, hood and stitched cartoon armour from Rayman 3.', fr: 'Les Lums noirs forment les soldats Hoodlums.', en: 'Black Lums form the Hoodlum soldiers.', canonStatus: 'canon Rayman 3 enemy class' },
    { id: 'lividstone', name: 'Lividstone', weapon: 'Shield and spear', special: 'Painting ambush', visualAnchor: 'Small dark-blue stone-like warrior with horned helmet, wooden shield and spear from Rayman Origins and Legends.', fr: 'Un habitant cauchemardesque qui patrouille les mondes des tableaux.', en: 'A nightmarish inhabitant patrolling the painting worlds.', canonStatus: 'canon Origins/Legends enemy class' }
  ],
  bosses: [
    { id: 'space_mama', name: 'Space Mama', weapon: 'Rolling pin and laser washer', special: 'Theatrical stage change', visualAnchor: 'Large opera-viking cartoon boss with red hair, horned helmet, rolling pin and washing-machine laser prop on a theatrical set.', fr: 'Space Mama transforme le duel en représentation à plusieurs décors.', en: 'Space Mama turns the duel into a multi-set performance.', canonStatus: 'canon original Rayman boss' },
    { id: 'razorbeard', name: 'Admiral Razorbeard', weapon: 'Robo-Pirate fleet', special: 'Grolgoth deployment', visualAnchor: 'Small angular red-brown Robo-Pirate admiral with oversized metal hat aboard the mechanical Grolgoth cockpit.', fr: 'L’amiral des Robo-Pirates envahit la Croisée des Rêves dans Rayman 2.', en: 'The Robo-Pirate admiral invades the Glade of Dreams in Rayman 2.', canonStatus: 'canon Rayman 2 principal antagonist adapted as boss' },
    { id: 'reflux', name: 'Reflux', weapon: 'Knaaren staff', special: 'Leptys transformation', visualAnchor: 'Towering pale-green Knaaren champion with red markings, heavy staff and later winged Leptys-energy silhouette.', fr: 'Le champion Knaaren absorbe la puissance du Leptys dans Rayman 3.', en: 'The Knaaren champion absorbs the Leptys’s power in Rayman 3.', canonStatus: 'canon Rayman 3 antagonist' }
  ],
  worldBoss: { id: 'mr_dark', name: 'Mr Dark', weapon: 'Great Protoon theft', special: 'Dark transformation gauntlet', visualAnchor: 'Mysterious short cloaked magician with huge black hat, white gloves, hidden face and glowing yellow eyes in Candy Château.', fr: 'Mr Dark vole le Grand Protoon et dérègle la Croisée des Rêves dans le premier jeu.', en: 'Mr Dark steals the Great Protoon and throws the Glade of Dreams out of balance in the first game.', canonStatus: 'canon original Rayman principal antagonist', objective: 'Recover the Great Protoon and survive Mr Dark’s canonical transformation gauntlet.' },
  stage: { name: 'Croisée des Rêves — galerie des tableaux', visualAnchor: 'Ancient tree hall filled with living paintings, floating lum chains, carved Teensy doors and mossy platforms.', fr: 'Les tableaux vivants ouvrent des passages vers les mondes mythiques.', en: 'Living paintings open passages into mythical worlds.' },
  stageVariants: [stageVariant('RPG', 'Le Sommet d’Outre-Nuées', 'Very Hard', 'Reflux', { objective: 'Break the Leptys energy anchors during each transformation.' }), stageVariant('Smash', 'Candy Château — Grand Protoon', 'Expert', 'Mr Dark', { objective: 'Complete the transformation gauntlet and restore the Great Protoon.' })],
  gear: [
    { id: 'great_protoon', enName: 'Great Protoon', frName: 'Grand Protoon', boost: { hp: 60, atk: 5 }, visualAnchor: 'Large glowing pink-gold energy sphere with orbiting smaller motes and no face or text.', fr: 'Le noyau d’équilibre recherché dans le premier Rayman.', en: 'The balance core sought in the original Rayman.' },
    { id: 'purple_lum', enName: 'Purple Lum', frName: 'Lum violet', boost: { spd: 3, def: 3 }, visualAnchor: 'Tiny violet winged lum with a bright core and curved hook-like trail.', fr: 'Un Lum violet permet de se balancer au-dessus du vide.', en: 'A purple Lum enables swinging across gaps.' },
    { id: 'plum', enName: 'Walking Plum', frName: 'Prune mobile', boost: { hp: 55, def: 4 }, visualAnchor: 'Large round purple plum with green leaf, bouncy cartoon surface and no face.', fr: 'Une prune sert de projectile ou de plateforme rebondissante.', en: 'A plum serves as a projectile or bouncing platform.' }
  ],
  event: { id: 'lum_king', enName: 'Lum King Chain', frName: 'Chaîne du roi Lum', en: 'The team awakens a Lum King and collects a perfect timed trail through a living painting.', fr: 'L’équipe réveille un roi Lum puis collecte une traînée parfaite en rythme dans un tableau vivant.', visualAnchor: 'Golden Lum King with crown-like glow leading a curved trail through a painterly Glade level.' }
}));
}
