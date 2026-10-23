// Authored identities for existing roster IDs. The cited works identify the
// ability, equipment or partner; damage, timing and RPG call-ins are adaptations.
// No source has been checked over the network in this change. In particular,
// an RPG call-in does not assert that the source character can cast a summon.
const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};

const entry = (universe, sourceWork, sourceReference, special, extra = {}) => ({
  universe,
  sourceWork,
  sourceReference,
  canonVerified: false,
  gameplayAdapted: true,
  special,
  ...extra
});
const attack = (name, type, dmg, color, targeting = {}) => ({
  name, type, dmg, color, targeting: { effect: 'damage', targetSide: 'enemy', ...targeting }
});
const callIn = (entityName, name, action, color, sourceWork, sourceReference, visualStyle = 'beam', kind = 'summon') => ({
  entityName, name, action, color, sourceWork, sourceReference, visualStyle, kind,
  canonVerified: false,
  gameplayAdapted: true
});

export const CANONICAL_COMBAT_EXTENSIONS = freeze({
  masterchief: entry('Halo', 'Halo 3',
    'Le Spartan Laser charge un tir rouge antivehicule. Le Pelican est un appareil de transport arme ; son appel RPG est une adaptation de renfort.',
    attack('Spartan Laser', 'beam', 4.5, '#ff3333', { shape: 'line', lineWidth: 42 }), {
      sourceUrl: 'https://www.halowaypoint.com/',
      summon: callIn('D77-TC Pelican', 'Appui Pelican', attack('Tir de couverture Pelican', 'bullet', 3.2, '#ffad42', { shape: 'group' }), '#ffad42', 'Halo 3', 'Le Pelican transporte les forces UNSC et possede un armement de bord ; renfort ponctuel adapte au RPG.', 'beam', 'reinforcement')
    }),
  arbiter: entry('Halo', 'Halo 2',
    'Thel Vadam utilise une epee a energie et un camouflage actif. La taille conserve une cible de melee.',
    attack('Energy Sword Lunge', 'melee', 4.6, '#95d9ff', { shape: 'single' })),
  johnson: entry('Halo', 'Halo 3',
    'Johnson utilise le Spartan Laser a la fin de la campagne ; tir charge et non magie de zone.',
    attack('Spartan Laser', 'beam', 4.3, '#ff3333', { shape: 'line', lineWidth: 38 })),
  noble_six: entry('Halo', 'Halo: Reach',
    'Le canon a acceleration de masse de la fin de campagne est un equipement fixe, deploye ici comme attaque scenarisee.',
    attack('MAC Cannon', 'beam', 4.8, '#a9e7ff', { shape: 'line', lineWidth: 50 })),
  doomslayer: entry('Doom', 'DOOM Eternal',
    'Le BFG-9000 tire un projectile d energie verte ; le Crucible est une lame a energie. Les degats et le deploiement RPG sont adaptes.',
    attack('BFG-9000', 'plasma_aoe', 5.6, '#39ff14', { shape: 'area', areaRadius: 180 }), {
      sourceUrl: 'https://slayersclub.bethesda.net/',
      summon: callIn('BFG-9000', 'Deploiement BFG-9000', attack('BFG-9000', 'plasma_aoe', 4.3, '#39ff14', { shape: 'group' }), '#39ff14', 'DOOM Eternal', 'Arme canonique, pas une creature invoquee : presentation RPG d un tir et de ses arcs d energie.', 'energy', 'reinforcement')
    }),
  doom_marine_classic: entry('Doom', 'DOOM (1993)',
    'Le BFG-9000 est une arme a projectile vert et impact de zone dans le jeu original.',
    attack('BFG-9000', 'plasma_aoe', 5.2, '#52ff32', { shape: 'area', areaRadius: 160 })),

  leon: entry('Resident Evil', 'Resident Evil 4 (2005)',
    'Leon peut utiliser le lance-roquettes, notamment le modele special de la confrontation finale.',
    attack('Special Rocket Launcher', 'rocket', 5.1, '#ffab57', { shape: 'area', areaRadius: 110 })),
  jill: entry('Resident Evil', 'Resident Evil 3 (2020)',
    'Jill utilise le canon electromagnetique experimental FINGeR contre Nemesis.',
    attack('FINGeR Railgun', 'beam', 5.2, '#79d0ff', { shape: 'line', lineWidth: 60 })),
  chris_redfield: entry('Resident Evil', 'Resident Evil 5',
    'Chris participe au ciblage du satellite contre Uroboros Aheri ; le dispositif est une arme scenarisee.',
    attack('Satellite Laser', 'beam_aoe', 5, '#ff674b', { shape: 'area', areaRadius: 135 })),
  claire_redfield: entry('Resident Evil', 'Resident Evil 2 (2019)',
    'Le lance-grenades GM 79 de Claire peut tirer des munitions incendiaires.',
    attack('GM 79 Flame Round', 'fire_aoe', 4.4, '#ff8048', { shape: 'area', areaRadius: 100 })),
  ada_wong: entry('Resident Evil', 'Resident Evil 4: Separate Ways',
    'Ada utilise une arbalete avec carreaux explosifs ; le tir reste une attaque de projectile.',
    attack('Explosive Crossbow', 'projectile', 4.3, '#ff7463', { shape: 'area', areaRadius: 95 })),
  rebecca_chambers: entry('Resident Evil', 'Resident Evil 0',
    'Rebecca est medic et sait preparer les melanges d herbes. Le soin collectif et sa puissance sont une adaptation de cette fonction.',
    { name: 'First Aid', type: 'heal_aoe', dmg: 3.1, color: '#76e7a1', targeting: { effect: 'heal', targetSide: 'ally', shape: 'group', healRatio: 0.32 } }),
  barry_burton: entry('Resident Evil', 'Resident Evil (2002)',
    'Le magnum de Barry est son arme personnelle ; aucune capacite surnaturelle n est attribuee au tir.',
    attack('Barry Magnum', 'bullet', 4.6, '#ffc278', { shape: 'single' })),

  solbadguy: entry('Guilty Gear', 'Guilty Gear -Strive-',
    'Tyrant Rave est un Overdrive de Sol a courte portee, represente par une frappe enflammee.',
    attack('Tyrant Rave', 'melee', 5.1, '#ff692e', { shape: 'single' }), { sourceUrl: 'https://www.guiltygear.com/ggst/en/character/sol/' }),
  ky: entry('Guilty Gear', 'Guilty Gear -Strive-',
    'Ride the Lightning est un Overdrive ou Ky charge entoure d energie electrique.',
    attack('Ride the Lightning', 'melee', 4.9, '#7cc9ff', { shape: 'single' })),
  may_gg: entry('Guilty Gear', 'Guilty Gear Xrd',
    'Great Yamada Attack fait intervenir une baleine ; l appel de Yamada reprend ce partenaire canonique.',
    attack('Great Yamada Attack', 'projectile', 4.8, '#72c9f5', { shape: 'area', areaRadius: 145 }), {
      summon: callIn('Yamada', 'Great Yamada Attack', attack('Great Yamada Attack', 'projectile', 4.2, '#72c9f5', { shape: 'group' }), '#72c9f5', 'Guilty Gear Xrd', 'Yamada est la baleine presente dans cet Overdrive ; timings et impact unique adaptes.', 'water')
    }),
  baiken_gg: entry('Guilty Gear', 'Guilty Gear -Strive-',
    'Tsurane Sanzu-watashi est un Overdrive de Baiken avec plusieurs tailles ; les tailles forment un impact de jeu unique.',
    attack('Tsurane Sanzu-watashi', 'melee', 4.9, '#f89b8a', { shape: 'single' })),
  baiken: entry('Guilty Gear', 'Guilty Gear -Strive-',
    'Tsurane Sanzu-watashi est l Overdrive a tailles multiples de Baiken, condense en un impact.',
    attack('Tsurane Sanzu-watashi', 'melee', 4.9, '#f89b8a', { shape: 'single' })),
  millia_gg: entry('Guilty Gear', 'Guilty Gear -Strive-',
    'Winger est un Overdrive ou la chevelure de Millia prend une forme d aile et frappe vers le haut.',
    attack('Winger', 'melee', 4.7, '#ffe489', { shape: 'single' })),
  millia_rage: entry('Guilty Gear', 'Guilty Gear -Strive-',
    'Winger emploie la chevelure comme aile offensive ; animation et duree sont adaptees.',
    attack('Winger', 'melee', 4.7, '#ffe489', { shape: 'single' })),

  ragna: entry('BlazBlue', 'BlazBlue: Centralfiction',
    'Carnage Scissors est un Distortion Drive de Ragna avec une avancee et deux tailles.',
    attack('Carnage Scissors', 'melee', 5, '#e03f6e', { shape: 'single' })),
  jin: entry('BlazBlue', 'BlazBlue: Centralfiction',
    'Touga Hyoujin projette une lame de glace en ligne ; la forme de zone reste une adaptation.',
    attack('Touga Hyoujin', 'beam', 4.9, '#97dfff', { shape: 'line', lineWidth: 42 })),
  noel: entry('BlazBlue', 'BlazBlue: Centralfiction',
    'Thor est un Distortion Drive utilisant l arme lancee par Noel pour produire une forte explosion.',
    attack('Thor', 'rocket', 4.8, '#ffd885', { shape: 'area', areaRadius: 125 })),
  rachel_bb: entry('BlazBlue', 'BlazBlue: Centralfiction',
    'Baden-Baden Lily produit des eclairs autour de Rachel et de ses paratonnerres.',
    attack('Baden-Baden Lily', 'lightning_aoe', 4.8, '#d4b2ff', { shape: 'area', areaRadius: 145 })),
  rachel_alucard: entry('BlazBlue', 'BlazBlue: Centralfiction',
    'Baden-Baden Lily emploie des eclairs et des paratonnerres ; aucun arret du temps n est ajoute.',
    attack('Baden-Baden Lily', 'lightning_aoe', 4.8, '#d4b2ff', { shape: 'area', areaRadius: 145 })),

  sonic_hedgehog: entry('Sonic', 'Sonic Adventure',
    'Light Speed Attack demande le pouvoir Ancient Light et enchaine des attaques sur les ennemis. La sequence est condensee en un impact.',
    attack('Light Speed Attack', 'melee_aoe', 4.8, '#80caff', { shape: 'group' }), {
      sourceUrl: 'https://sonic.sega.jp/',
      summon: callIn('Tails et le Tornado', 'Appui Tornado', attack('Tornado Machine Gun', 'bullet', 3.8, '#ffc65f', { shape: 'group' }), '#ffc65f', 'Sonic Adventure', 'Tails pilote le Tornado equipe de mitrailleuses ; appel en soutien adapte au RPG.', 'wind', 'reinforcement')
    }),
  miles_tails_prower: entry('Sonic', 'Sonic Adventure 2',
    'Power Laser est l attaque speciale du mecha Cyclone de Tails en mode multijoueur.',
    attack('Cyclone Power Laser', 'beam', 4.5, '#ffe064', { shape: 'line', lineWidth: 52 })),
  knuckles_echidna: entry('Sonic', 'Sonic Adventure 2',
    'Thunder Arrow est l attaque speciale de Knuckles en mode multijoueur ; representation electrique sans controle du temps.',
    attack('Thunder Arrow', 'lightning_aoe', 4.6, '#ff7a68', { shape: 'area', areaRadius: 125 })),

  jotaro_kujo: entry("JoJo's Bizarre Adventure", 'Stardust Crusaders',
    'Star Platinum est le Stand de Jotaro et attaque par rafales de poings. Aucun arret du temps mecanique n est revendique.',
    attack('Star Platinum — Ora Ora', 'melee', 4.9, '#b29bff', { shape: 'single' }), {
      summon: callIn('Star Platinum', 'Star Platinum — Ora Ora', attack('Ora Ora', 'melee', 4.5, '#b29bff', { shape: 'single' }), '#b29bff', 'Stardust Crusaders', 'Manifestation du Stand Star Platinum et barrage de poings ; cadence et degats adaptes.', 'stand')
    }),
  joseph_joestar: entry("JoJo's Bizarre Adventure", 'Stardust Crusaders',
    'Joseph age emploie Hermit Purple et peut conduire le Hamon dans ses lianes ; cette version ne juxtapose pas ses epoques.',
    attack('Hermit Purple — Hamon', 'melee', 4.4, '#d486ff', { shape: 'single' }), {
      summon: callIn('Hermit Purple', 'Hermit Purple — Hamon', attack('Hermit Purple — Hamon', 'melee', 4, '#d486ff', { shape: 'single' }), '#d486ff', 'Stardust Crusaders', 'Hermit Purple est le Stand de Joseph age ; ses lianes peuvent conduire le Hamon.', 'stand')
    }),
  giorno_giovanna: entry("JoJo's Bizarre Adventure", 'Golden Wind',
    'Gold Experience est le Stand de Giorno et emploie un barrage de poings ; Requiem et annulation causale ne sont pas simules.',
    attack('Gold Experience — Muda Muda', 'melee', 4.8, '#f4d97a', { shape: 'single' }), {
      summon: callIn('Gold Experience', 'Gold Experience', attack('Muda Muda', 'melee', 4.4, '#f4d97a', { shape: 'single' }), '#f4d97a', 'Golden Wind', 'Manifestation du Stand Gold Experience ; seule sa frappe est transposee ici.', 'stand')
    }),

  devil_may_cry_dante: entry('Devil May Cry', 'Devil May Cry 5',
    'Judgement est l attaque finale du Sin Devil Trigger de Dante ; sa disponibilite est adaptee a la jauge du moteur.',
    attack('Sin Devil Trigger — Judgement', 'melee_aoe', 5.2, '#ff5d4f', { shape: 'area', areaRadius: 150 })),
  devil_may_cry_nero: entry('Devil May Cry', 'Devil May Cry 5',
    'Showdown est une attaque de Nero en Devil Trigger, constituee d une sequence de tailles.',
    attack('Devil Trigger — Showdown', 'melee', 5.1, '#75b9ff', { shape: 'single' })),
  devil_may_cry_lady: entry('Devil May Cry', 'Devil May Cry 3',
    'Kalina Ann est le lance-roquettes de Lady ; le tir emploie cette arme et non un pouvoir demoniaque.',
    attack('Kalina Ann', 'rocket', 4.9, '#ffb761', { shape: 'area', areaRadius: 125 })),

  skullgirls_parasoul: entry('Skullgirls', 'Skullgirls 2nd Encore',
    'Inferno Brigade est un Blockbuster de Parasoul faisant intervenir les Black Egrets et leurs tirs.',
    attack('Inferno Brigade', 'bullet', 4.9, '#ffac67', { shape: 'group' }), {
      sourceUrl: 'https://skullgirls.com/world/',
      summon: callIn('Black Egrets', 'Inferno Brigade', attack('Inferno Brigade', 'bullet', 4.3, '#ffac67', { shape: 'group' }), '#ffac67', 'Skullgirls 2nd Encore', 'Les Black Egrets sont les soldats appeles dans le Blockbuster ; la presentation RPG est adaptee.', 'support', 'reinforcement')
    }),
  skullgirls_big_band: entry('Skullgirls', 'Skullgirls 2nd Encore',
    'Super-Sonic Jazz est un Blockbuster de Big Band utilisant son corps instrumental dans une charge.',
    attack('Super-Sonic Jazz', 'melee', 4.8, '#f4d083', { shape: 'single' })),
  skullgirls_beowulf: entry('Skullgirls', 'Skullgirls 2nd Encore',
    'Three Wulf Moonsault est un Blockbuster de Beowulf ; la prise ne s applique qu a une cible.',
    attack('Three Wulf Moonsault', 'melee', 4.9, '#91bbff', { shape: 'single' })),

  yoshimitsu_tekken: entry('Tekken', 'Tekken 3',
    'Le flash de Yoshimitsu et ses attaques d epee sont canoniques. Le super est une adaptation de la contre-attaque Flash, pas un Rage Art attribue a Tekken 3.',
    attack('Flash', 'melee', 4.6, '#bcff85', { shape: 'single' })),
  true_ogre_tekken: entry('Tekken', 'Tekken 3',
    'True Ogre possede un souffle de feu ; sa portee et son impact sont adaptes au moteur.',
    attack('Fire Breath', 'fire', 5.1, '#ff9b4c', { shape: 'cone', coneAngle: 48 })),
  gon_tekken: entry('Tekken', 'Tekken 3',
    'Gon possede une attaque de souffle de feu dans Tekken 3 ; aucune capacite de Stand ou de Devil Gene ne lui est ajoutee.',
    attack('Fireball', 'fire', 4.3, '#ffb15a', { shape: 'cone', coneAngle: 42 })),
  nightmare_sc: entry('Soul Calibur', 'Soulcalibur',
    'Soul Edge et la prise Soul Smasher appartiennent a Nightmare ; les effets de finisher sont une adaptation de combat.',
    attack('Soul Smasher', 'melee', 5.1, '#c285ff', { shape: 'single' })),
  siegfried_sc: entry('Soul Calibur', 'Soulcalibur',
    'Siegfried emploie des tailles a deux mains et des postures avec Requiem. Le nom de l arme n est pas une invocation magique.',
    attack('Requiem — Heavy Slash', 'melee', 4.9, '#a8c9ff', { shape: 'single' })),
  ivy_sc: entry('Soul Calibur', 'Soulcalibur',
    'Summon Suffering est une prise d Ivy utilisant son epee fouet ; malgre son nom elle ne convoque aucune creature.',
    attack('Summon Suffering', 'melee', 5, '#d3a1ff', { shape: 'single' })),

  godzilla_1954: entry('Godzilla', 'Godzilla (1954)',
    'Le Godzilla original emploie un souffle atomique ; un faisceau blanc bleute est une transposition du film noir et blanc.',
    attack('Atomic Breath', 'beam', 5.2, '#c3f4ff', { shape: 'line', lineWidth: 65 }), { sourceUrl: 'https://godzilla.com/' }),
  godzilla_millennium: entry('Godzilla', 'Godzilla 2000: Millennium',
    'Ce Godzilla emploie un souffle atomique orange, sans lui attribuer les pouvoirs du MonsterVerse.',
    attack('Atomic Breath', 'beam', 5.3, '#ff9851', { shape: 'line', lineWidth: 68 })),
  legendary_godzilla: entry('Godzilla', 'Godzilla (2014)',
    'Le Godzilla du MonsterVerse utilise un souffle atomique bleu ; le profil ne suppose pas sa forme thermonucleaire de 2019.',
    attack('Atomic Breath', 'beam', 5.4, '#66d7ff', { shape: 'line', lineWidth: 72 })),
  godzilla_jr_tas: entry('Godzilla The Animated Series', 'Godzilla: The Series',
    'Godzilla Junior possede un souffle atomique vert dans la serie animee ; couleur et continuite sont conservees.',
    attack('Atomic Breath', 'beam', 5.1, '#57fa81', { shape: 'line', lineWidth: 60 }))
});
