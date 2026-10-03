// Source locks for the remaining Wave4 identities. This module deliberately
// leaves IDs, stats, resource costs and historical sprite/provenance paths alone.
// Named source props/powers are separate from numerical combat adaptations.
import { CANON_BLACK_PEARL_SOURCE_KITS } from './canonBlackPearlSourceKits.js';

const REF = Object.freeze({
  saturnin: 'https://fr.wikipedia.org/wiki/Les_Aventures_de_Saturnin',
  lilo: 'https://d23.com/a-to-z/lilo-stitch-film/',
  jack: 'https://d23.com/a-to-z/pirates-of-the-caribbean-the-curse-of-the-black-pearl-film/',
  roger: 'https://d23.com/a-to-z/who-framed-roger-rabbit-film/',
  batman: 'https://www.dc.com/characters/batman',
  darkKnight: 'https://en.wikipedia.org/wiki/The_Dark_Knight',
  endgame: 'https://www.dc.com/graphic-novels/batman-2011/batman-vol-7-endgame',
  joker: 'https://www.dc.com/characters/the-joker',
  harley: 'https://en.wikipedia.org/wiki/Harley_Quinn',
  grim: 'https://en.wikipedia.org/wiki/The_Batman_Who_Laughs',
  raven: 'https://www.dc.com/characters/raven',
  starfire: 'https://www.dc.com/characters/starfire',
  titans: 'https://en.wikipedia.org/wiki/Teen_Titans_(TV_series)',
  harry: 'https://www.harrypotter.com/fact-file/characters-and-pets/harry-potter',
  hermione: 'https://www.harrypotter.com/fact-file/characters-and-pets/hermione-granger',
  phoenix: 'https://en.wikipedia.org/wiki/Harry_Potter_and_the_Order_of_the_Phoenix_(film)',
  spider: 'https://en.wikipedia.org/wiki/Spider:_The_Video_Game',
  project: 'https://chatgpt.com/share/6abdc1d1-1a7c-83eb-9a7a-d979173f3754'
});

const MELEE = Object.freeze({ shape: 'single', delivery: 'melee' });
const RANGED = Object.freeze({ shape: 'single', delivery: 'ranged' });
const DAMAGE_ADAPTATION = 'Named source action translated into game damage; original choreography and source-specific effects are not certified.';
const COMIC_ADAPTATION = 'Physical comic interaction translated into game damage; this is an original combat adaptation, not a combat feat from the source.';
const melee = (name, canonStatus = DAMAGE_ADAPTATION) => ({
  name, type: 'melee', attackProfile: MELEE, tacticsProfile: { range: 1 },
  smashProfile: { range: 70, shape: 'single', maxTargets: 1 }, canonStatus,
  canonPresentation: { kind: 'melee' }
});
const ranged = (name, type = 'projectile', color, canonStatus = DAMAGE_ADAPTATION) => ({
  name, type, attackProfile: RANGED, tacticsProfile: { range: 4 },
  smashProfile: { range: 300, shape: 'single', maxTargets: 1 },
  ...(color ? { color } : {}), canonStatus
});
const dodge = name => ({ name, type: 'dodge', canonStatus: DAMAGE_ADAPTATION });
const guard = name => ({ name, type: 'shield', canonStatus: DAMAGE_ADAPTATION });

const lock = (details) => ({
  canonCombatPresentation: true,
  canonStatus: 'Source incarnation and props locked; numerical combat is a game adaptation, not a fidelity approval.',
  sourceReviewStatus: 'reference-supported; scene-by-scene fidelity review pending',
  visualReviewStatus: 'pending',
  mechanicsReviewStatus: 'game adaptation; source choreography and special rules pending',
  ...details,
  referenceUrl: details.referenceUrls[0]
});

const titans = (details) => lock({
  incarnation: 'Teen Titans (2003-2006 animated series) - original Jump City team',
  ...details,
  referenceUrls: [...details.referenceUrls, REF.titans]
});

const spiderLoadout = (details) => lock({
  incarnation: 'Spider: The Video Game (PlayStation, 1997) - Dr. Michael Kelly cybernetic-spider loadout',
  referenceUrls: [REF.spider],
  sourceIdentityType: 'source-protagonist-loadout-adaptation',
  canonStatus: 'Kelly is the source protagonist; separate playable attachment slots are project adaptations, not three official characters. Historical substitute sprites remain unapproved.',
  equipmentEvidenceStatus: 'Source-pack attachment identity; exact attachment model requires original manual/gameplay review.',
  ...details
});

export const CANON_P0_SOURCE_KITS = Object.freeze({
  saturnin_duck: lock({
    incarnation: 'Les Aventures de Saturnin (ORTF, 1965-1970) - real duckling in a miniature animal village',
    referenceUrls: [REF.saturnin],
    equipment: ['Yellow Duckling Anatomy', 'Miniature Animal Village Props'],
    visualAnchor: 'Saturnin is Jean Tourane s real yellow duckling in live-action miniature village sets: yellow down, orange bill and webbed feet, natural duck anatomy. No human arms, firearm, laser or human-sized uniform. Props and companions must match the selected episode.',
    weapon: 'body', weaponType: 'body', weaponColor: '#ffd83d',
    primaryColor: '#ffd83d', secondaryColor: '#e8942b',
    canonStatus: 'Real duckling source identity locked; bumps, distraction and escape are original comic game adaptations, not armed source combat.',
    simple: melee('Duckling Bump', COMIC_ADAPTATION),
    secondary: melee('Miniature Village Scramble', COMIC_ADAPTATION),
    defense: dodge('Duckling Sidestep'),
    special: melee('Village Escape Tumble', COMIC_ADAPTATION),
    loreLocalized: {
      fr: 'Saturnin est le caneton reel de Jean Tourane, dans les decors miniatures des Aventures de Saturnin diffuses par l ORTF. Son caractere et ses aventures de village ne lui donnent ni fusil ni pouvoirs. Ses contacts, detours et evasions jouables sont une adaptation comique originale du projet ; son escorte est une mission de secours distincte.',
      en: 'Saturnin is Jean Tourane s real duckling in the miniature sets of Les Aventures de Saturnin, broadcast by ORTF. His personality and village adventures do not give him a gun or supernatural powers. Playable bumps, detours and escapes are an original comic game adaptation; his escort is a separate rescue mission.'
    }
  }),
  lilo_pelekai: lock({
    incarnation: 'Lilo & Stitch (2002 animated film) - Lilo Pelekai on Kauai',
    referenceUrls: [REF.lilo],
    equipment: ['Camera', 'Scrump Doll', 'Red White-Leaf Dress'],
    visualAnchor: 'Lilo in the 2002 animated film: Hawaiian little girl, long straight black hair, red dress with large white leaf shapes and sandals. Camera and Scrump are personal props, not alien weapons. No adult substitute, laser rifle, magic beam or live-action redesign.',
    weapon: 'camera', weaponType: 'camera', weaponColor: '#383838',
    primaryColor: '#d83c38', secondaryColor: '#f8eee3',
    canonStatus: 'Lilo s human source identity and props locked; photo distractions, dance and physical comedy are original game adaptations, not alien combat powers.',
    simple: ranged('Camera Flash Distraction', 'flash', '#fff4d8', COMIC_ADAPTATION),
    secondary: melee('Playful Sidestep Bump', COMIC_ADAPTATION),
    defense: dodge('Hula Sidestep'),
    special: melee('Ohana Rescue Scramble', COMIC_ADAPTATION),
    loreLocalized: {
      fr: 'Lilo Pelekai est une enfant humaine de Kauai, elevee par sa soeur Nani dans le film anime Lilo & Stitch de 2002. Elle adopte Stitch et lui apprend le sens de ohana. Son appareil photo, sa poupee Scrump et sa danse appartiennent a sa vie ; le jeu adapte ces gestes en distraction et entraide, sans lui attribuer les pouvoirs de l Experience 626.',
      en: 'Lilo Pelekai is a human child on Kauai, raised by her sister Nani in the 2002 animated film Lilo & Stitch. She adopts Stitch and teaches him the meaning of ohana. Her camera, Scrump doll and dancing belong to her life; the game adapts those gestures into distraction and support without granting her Experiment 626 s powers.'
    }
  }),
  stitch_626: lock({
    incarnation: 'Lilo & Stitch (2002 animated film) - Experiment 626, Earth dog-disguise form',
    referenceUrls: [REF.lilo],
    equipment: ['Retractable Claws', 'Experiment 626 Anatomy'],
    visualAnchor: 'Stitch in the 2002 animated film, Earth dog disguise: short stocky blue alien, large lateral ears with pink interiors and characteristic notches, dark nose and eyes, pale-blue belly, two visible arms. Alien four-arm form is a separate presentation, not extra permanent Earth-form arms. No humanoid warrior costume or innate laser gun.',
    weapon: 'claws', weaponType: 'claws', weaponColor: '#a9d8ed',
    primaryColor: '#407eaf', secondaryColor: '#9ecce5',
    simple: melee('Experiment 626 Claw Swipe'),
    secondary: melee('Alien Strength Pounce'),
    defense: dodge('Agile Alien Sidestep'),
    special: melee('Experiment 626 Strength Rush'),
    loreLocalized: {
      fr: 'Stitch est l Experience 626, creation genetique de Jumba poursuivie apres sa fuite vers la Terre. Le film anime de 2002 le montre d abord destructeur, puis lie a Lilo et a ohana. Sa force, ses griffes et son agilite viennent de son corps extraterrestre ; le kit joue sa forme terrestre a deux bras et adapte les impacts au combat du jeu.',
      en: 'Stitch is Experiment 626, Jumba s genetic creation pursued after escaping to Earth. The 2002 animated film begins with his destructive behavior and follows his bond with Lilo and ohana. Strength, claws and agility come from his alien body; this kit uses his two-arm Earth disguise and adapts impacts to game combat.'
    }
  }),
  jack_sparrow_potc: CANON_BLACK_PEARL_SOURCE_KITS.jack_sparrow_potc,
  roger_rabbit: lock({
    incarnation: 'Who Framed Roger Rabbit (1988) - Roger, Maroon Cartoon Studio toon',
    referenceUrls: [REF.roger],
    equipment: ['Toon Body', 'Red Overalls', 'Blue Polka-Dot Bow Tie'],
    visualAnchor: 'Roger Rabbit in the 1988 film: white cartoon rabbit with tall ears, orange hair tuft, pink nose, red overalls with yellow buttons, blue bow tie with yellow polka dots and yellow gloves. Cartoon elastic anatomy, not a humanoid armored rabbit or laser-wielding substitute. Dip is a lethal threat to toons.',
    weapon: 'toon_body', weaponType: 'toon_body', weaponColor: '#eee9de',
    primaryColor: '#eee9de', secondaryColor: '#d64233',
    canonStatus: '1988 toon identity locked; comic slaps, stretches and tumbles are original game combat adaptations. Dip remains a source vulnerability, not a protective ability.',
    simple: melee('Toon Comic Slap', COMIC_ADAPTATION),
    secondary: melee('Elastic Toon Feint', COMIC_ADAPTATION),
    defense: dodge('Squash-and-Stretch Sidestep'),
    special: melee('Toon Comedy Tumble', COMIC_ADAPTATION),
    loreLocalized: {
      fr: 'Roger est le toon de Maroon Cartoon Studio accuse du meurtre de Marvin Acme dans Who Framed Roger Rabbit de 1988. Eddie Valiant enquete tandis que Judge Doom menace Toontown avec la Trempette. Roger reste un personnage comique elastique et vulnerable a ce solvant ; ses gestes convertis en degats sont une adaptation du jeu, pas des attaques laser du film.',
      en: 'Roger is the Maroon Cartoon Studio toon accused of Marvin Acme s murder in 1988 s Who Framed Roger Rabbit. Eddie Valiant investigates while Judge Doom threatens Toontown with Dip. Roger remains an elastic comic character vulnerable to that solvent; gestures converted into damage are a game adaptation, not laser attacks from the film.'
    }
  }),
  batman_tdk: lock({
    incarnation: 'The Dark Knight (2008) - Nolan s Bruce Wayne, segmented Batsuit',
    referenceUrls: [REF.darkKnight, REF.batman],
    equipment: ['Segmented Batsuit', 'Batarangs', 'Grapnel Gun', 'Utility Belt'],
    visualAnchor: 'Batman in The Dark Knight (2008): Christian Bale s Bruce Wayne in the black segmented armored Batsuit, narrow pointed ears, exposed mouth and jaw, black cape and gold utility belt. Batarangs and grapnel equipment; no ordinary pistol, Grim Knight rifle, Justice Buster, blue-gray animated suit or The Batman 2022 costume.',
    weapon: 'fists', weaponType: 'fists', weaponColor: '#2b2c30',
    primaryColor: '#24252a', secondaryColor: '#af914e',
    simple: melee('Batsuit Martial Strike'),
    secondary: ranged('Batarang Throw', 'projectile', '#72767d'),
    defense: guard('Armored Forearm Guard'),
    special: melee('Gotham Close-Quarters Takedown'),
    loreLocalized: {
      fr: 'Ce Batman est Bruce Wayne dans The Dark Knight de Nolan, sorti en 2008. Il agit avec Gordon et Harvey Dent face au Joker. Sa formation, son Batsuit segmente et ses gadgets expliquent son kit : combat martial, batarangs et protection. Le grapnel est un outil de deplacement, pas un pistolet a balles ; les chiffres de combat ne reproduisent pas le montage exact du film.',
      en: 'This Batman is Bruce Wayne in Nolan s The Dark Knight, released in 2008. He works with Gordon and Harvey Dent against the Joker. Training, his segmented Batsuit and gadgets explain the kit: martial combat, Batarangs and protection. The grapnel is a movement tool, not a bullet-firing pistol; combat numbers do not reproduce the film s exact choreography.'
    }
  }),
  batman_n52: lock({
    incarnation: 'Batman: Endgame (The New 52, Batman #35-40, 2014-2015) - Bruce Wayne',
    referenceUrls: [REF.endgame, REF.batman],
    equipment: ['New 52 Batsuit', 'Batarangs', 'Utility Belt'],
    visualAnchor: 'Bruce Wayne in the New 52 Endgame arc, Batman #35-40: gray armored suit, black cowl with white comic eye lenses, black bat emblem, black cape, gauntlets and boots, yellow-gold utility belt. Ordinary Batsuit form; Justice Buster is a separate armor form. No Grim Knight firearms or movie-specific Nolan costume.',
    weapon: 'fists', weaponType: 'fists', weaponColor: '#34373c',
    primaryColor: '#555a63', secondaryColor: '#24262b',
    simple: melee('New 52 Martial Strike'),
    secondary: ranged('Utility-Belt Batarang', 'projectile', '#656973'),
    defense: guard('Batsuit Gauntlet Guard'),
    special: melee('Endgame Close-Quarters Counter'),
    loreLocalized: {
      fr: 'Ce Bruce Wayne est verrouille sur Batman #35-40, l arc Endgame des New 52 recueilli par DC. Le Joker revient pour le tuer et retourne ses allies contre lui. Le kit conserve le Batsuit ordinaire et les batarangs ; Justice Buster, armure distincte de cet arc, n est pas fusionne avec sa silhouette. Aucun arsenal du Grim Knight n est attribue a ce Batman.',
      en: 'This Bruce Wayne is locked to Batman #35-40, the New 52 Endgame arc collected by DC. The Joker returns to kill him and turns his allies against him. The kit keeps the ordinary Batsuit and Batarangs; Justice Buster, a distinct armor from that arc, is not merged into his silhouette. The Grim Knight s arsenal is not assigned to this Batman.'
    }
  }),
  joker_n52: lock({
    incarnation: 'Batman: Endgame (The New 52, Batman #35-40, 2014-2015) - the Joker',
    referenceUrls: [REF.endgame, REF.joker],
    equipment: ['Joker Toxin', 'Knife'],
    visualAnchor: 'The Joker in New 52 Endgame, Batman #35-40: chalk-white face, green hair and wide red grin, sinister purple-associated civilian clothing. His restored face is not the detached strapped-on face of Death of the Family. Exact issue panels must drive the final costume review; no movie Joker tattoos, Glasgow smile or Batman Who Laughs visor.',
    weapon: 'knife', weaponType: 'knife', weaponColor: '#b5b6b7',
    primaryColor: '#72448d', secondaryColor: '#75a34a',
    simple: melee('Joker Knife Slash'),
    secondary: ranged('Joker Toxin Spray', 'spray', '#8ab155'),
    defense: dodge('Unpredictable Sidestep'),
    special: ranged('Endgame Toxin Spray', 'spray', '#8ab155'),
    mechanicsReviewStatus: 'Toxin is represented by game damage; Endgame infection and source antidote rules are not simulated.',
    loreLocalized: {
      fr: 'Ce Joker vient de l arc Endgame, Batman #35-40 des New 52. DC decrit son retour pour tuer Batman en retournant ses allies contre lui. Ses armes et sa toxine remplacent les attaques Nexus anonymes ; leurs degats sont une adaptation et non une simulation de l infection. Le visage rattache de Death of the Family appartient a un autre arc et n equipe pas cette incarnation.',
      en: 'This Joker comes from the New 52 Endgame arc, Batman #35-40. DC describes his return to kill Batman by turning his allies against him. Weapons and toxin replace anonymous Nexus attacks; damage is an adaptation rather than an infection simulation. The reattached face from Death of the Family belongs to another arc and does not equip this incarnation.'
    }
  }),
  harley_n52: lock({
    incarnation: 'Suicide Squad (The New 52, volume 4 #1, 2011) - Harley Quinn',
    referenceUrls: [REF.harley],
    equipment: ['Oversized Mallet', 'New 52 Squad Costume'],
    visualAnchor: 'Harley Quinn s early New 52 Suicide Squad design, volume 4 #1 (2011): pale skin, hair divided blue and red, red-and-blue corset and shorts with matching boots and gloves, oversized mallet. Fully clothed source costume. Not the animated jester suit, Rebirth pink-and-blue hair tips, or Margot Robbie s 2016 film wardrobe. Source-panel visual review remains pending.',
    weapon: 'hammer', weaponType: 'hammer', weaponColor: '#8a5941',
    primaryColor: '#b63845', secondaryColor: '#3c5e9b',
    canonStatus: 'Early New 52 Suicide Squad identity locked; presence in the Endgame universe roster is a crossover adaptation, not a claim she fights that comic finale.',
    simple: melee('Oversized Mallet Swing'),
    secondary: melee('Mallet Feint'),
    defense: dodge('Acrobatic Sidestep'),
    special: melee('Squad Mallet Takedown'),
    loreLocalized: {
      fr: 'Cette Harley Quinn vient du debut de Suicide Squad volume 4 des New 52, en 2011, avec son redesign bleu et rouge. Elle ne porte pas automatiquement les habits des films ni de Rebirth. Son maillet et son agilite deviennent un kit de combat adapte. Sa presence dans le roster Joker New 52 est un crossover du projet ; elle ne prouve pas une participation a la finale Endgame de Batman #35-40.',
      en: 'This Harley Quinn comes from the beginning of New 52 Suicide Squad volume 4 in 2011, with its blue-and-red redesign. She does not automatically wear the film or Rebirth costumes. Her mallet and agility become an adapted combat kit. Her place in the Joker New 52 roster is a project crossover, not evidence she participates in Batman #35-40 s Endgame finale.'
    }
  }),
  grim_knight: lock({
    incarnation: 'The Batman Who Laughs: The Grim Knight #1 (2019) - armed Dark Multiverse Bruce Wayne',
    referenceUrls: [REF.grim],
    equipment: ['Firearms Arsenal', 'Tactical Bat Armor'],
    visualAnchor: 'The Grim Knight is the firearm-using Dark Multiverse Bruce Wayne: dark tactical bat armor, cowl and cape, multiple weapon mounts and ammunition. Exact 2019 issue panels must determine weapon models and armor details before visual approval. Not Nolan Batman, ordinary New 52 Batman, or Batman Who Laughs with a spiked visor.',
    weapon: 'gun', weaponType: 'gun', weaponColor: '#353a3d',
    primaryColor: '#383d42', secondaryColor: '#666e73',
    simple: ranged('Grim Knight Firearm Burst', 'bullet', '#dfb879'),
    secondary: ranged('Tactical Covering Fire', 'projectile', '#dfb879'),
    defense: guard('Tactical Armor Guard'),
    special: ranged('Grim Knight Arsenal Volley', 'bullet', '#dfb879'),
    loreLocalized: {
      fr: 'Le Grim Knight est une version du Multivers Noir de Bruce Wayne qui utilise des armes a feu et impose a Gotham un regime militaire. Contrairement aux deux Batman ordinaires du roster, son arsenal est un trait de la source. Ce kit vise son one-shot de 2019 ; les modeles d armes, l armure et la choregraphie exigent encore une revue des pages originales.',
      en: 'The Grim Knight is a Dark Multiverse version of Bruce Wayne who uses firearms and imposes military rule on Gotham. Unlike the roster s two ordinary Batmen, his arsenal is a source trait. This kit targets his 2019 one-shot; weapon models, armor and choreography still require review of the original pages.'
    }
  }),
  raven_tt: titans({
    referenceUrls: [REF.raven],
    equipment: ['Mystical Powers', 'Hooded Purple Cloak'],
    visualAnchor: 'Raven in the original 2003 Teen Titans animated series: gray skin, short violet hair, red forehead gem, dark outfit beneath a hooded blue-violet cloak with red clasp, blue-violet boots. Mystical dark-energy and telekinetic presentation, no mechanical laser rifle, Teen Titans Go proportions or live-action Titans wardrobe.',
    weapon: 'magic', weaponType: 'magic', weaponColor: '#3c3259',
    primaryColor: '#54528c', secondaryColor: '#312a44',
    simple: ranged('Mystical Telekinetic Strike', 'gravity', '#383044'),
    secondary: ranged('Telekinetic Debris', 'gravity', '#383044'),
    defense: guard('Mystical Barrier'),
    special: ranged('Raven Telekinetic Restraint', 'gravity', '#383044'),
    loreLocalized: {
      fr: 'Cette Raven est celle de la serie animee Teen Titans commencee en 2003, pas de Teen Titans Go ni de la serie live-action Titans. Fille de Trigon, elle discipline ses emotions et pratique les arts mystiques. Son kit emploie telekinesie et protection magique sans lui donner un fusil laser ; les degats et la retenue de cible restent des abstractions du jeu.',
      en: 'This Raven belongs to the Teen Titans animated series that began in 2003, not Teen Titans Go or the live-action Titans series. Trigon s daughter disciplines her emotions and practices mystical arts. Her kit uses telekinesis and magical protection without a laser rifle; damage and target restraint remain game abstractions.'
    }
  }),
  starfire_tt: titans({
    referenceUrls: [REF.starfire],
    equipment: ['Tamaranean Starbolts', 'Purple Animated-Series Costume'],
    visualAnchor: 'Starfire in the original 2003 Teen Titans animated series: orange skin, long red hair, large green eyes, purple top and skirt, purple boots, silver neck piece and bracers with green gems. Green starbolts from her hands, not orange weapon fire, a rifle, New 52 comic costume or live-action Titans wardrobe.',
    weapon: 'starbolts', weaponType: 'starbolts', weaponColor: '#63ef72',
    primaryColor: '#ee874a', secondaryColor: '#845ca4',
    simple: ranged('Green Starbolt', 'energy', '#63ef72'),
    secondary: melee('Tamaranean Flight Kick'),
    defense: guard('Tamaranean Resilience'),
    special: ranged('Green Starbolt Volley', 'energy', '#63ef72'),
    loreLocalized: {
      fr: 'Cette Starfire est Koriand r de Tamaran dans la serie animee Teen Titans de 2003. Elle rejoint l equipe de Jump City et garde sa force, son vol et ses starbolts verts. Un starbolt est une attaque d energie a distance ; son coup de pied reste une action de contact distincte. La trajectoire et les chiffres adaptes du jeu ne certifient pas une choregraphie d episode.',
      en: 'This Starfire is Koriand r of Tamaran in the 2003 Teen Titans animated series. She joins the Jump City team and retains strength, flight and green starbolts. A starbolt is a ranged energy attack; her kick remains a separate contact action. Adapted game trajectories and numbers do not certify an episode s choreography.'
    }
  }),
  harry: lock({
    incarnation: 'Harry Potter and the Order of the Phoenix (2007 film) - fifth-year Dumbledore s Army',
    referenceUrls: [REF.harry, REF.phoenix],
    equipment: ['Holly Wand with Phoenix-Feather Core', 'Gryffindor School Uniform', 'Round Glasses'],
    sourceAbilities: ['Expelliarmus', 'Stupefy', 'Protego', 'Expecto Patronum - Stag'],
    visualAnchor: 'Harry in the 2007 Order of the Phoenix film: teenage Harry, untidy dark hair, round glasses and lightning scar, Hogwarts Gryffindor school clothing, original holly wand with phoenix-feather core. No Elder Wand, adult epilogue version or green Killing Curse. A corporeal Patronus is a stag, not a generic blast.',
    weapon: 'wand', weaponType: 'wand', weaponColor: '#6b4b35',
    primaryColor: '#494752', secondaryColor: '#a5443d',
    simple: ranged('Expelliarmus', 'projectile', '#ed6456'),
    secondary: ranged('Stupefy', 'projectile', '#e35c5c'),
    defense: guard('Protego'),
    special: ranged('Dumbledore s Army Stupefy Duel', 'projectile', '#e35c5c'),
    mechanicsReviewStatus: 'Spells use game damage/guard; disarm, stun and Dementor-specific Patronus behavior require dedicated mechanics. Patronus is not an offensive area explosion.',
    loreLocalized: {
      fr: 'Ce Harry est en cinquieme annee dans le film Order of the Phoenix de 2007. Il enseigne la defense a l Armee de Dumbledore avec sa baguette de houx a plume de phenix. Expelliarmus desarme, Stupefy etourdit et Protego protege dans la source ; les degats du moteur en sont une abstraction explicite. Son Patronus est un cerf protecteur face aux Detraqueurs et n est plus remplace par une explosion offensive generique.',
      en: 'This Harry is a fifth-year student in the 2007 Order of the Phoenix film. He teaches defense to Dumbledore s Army with his holly and phoenix-feather wand. In the source, Expelliarmus disarms, Stupefy stuns and Protego protects; engine damage is an explicit abstraction. His Patronus is a protective stag against Dementors and is no longer replaced by a generic offensive explosion.'
    }
  }),
  hermione: lock({
    incarnation: 'Harry Potter and the Order of the Phoenix (2007 film) - fifth-year Dumbledore s Army',
    referenceUrls: [REF.hermione, REF.phoenix],
    equipment: ['Vine Wand with Dragon-Heartstring Core', 'Gryffindor School Uniform'],
    sourceAbilities: ['Stupefy', 'Expelliarmus', 'Protego'],
    visualAnchor: 'Hermione in the 2007 Order of the Phoenix film: teenage Hermione with brown hair, Hogwarts Gryffindor school clothing and her vine wand with dragon-heartstring core. Fifth-year incarnation; no permanent third-year Time-Turner pendant, Elder Wand or Deathly Hallows forest outfit. Final film-costume review remains pending.',
    weapon: 'wand', weaponType: 'wand', weaponColor: '#795a44',
    primaryColor: '#6d5247', secondaryColor: '#a5443d',
    simple: ranged('Stupefy', 'projectile', '#e35c5c'),
    secondary: ranged('Expelliarmus', 'projectile', '#ed6456'),
    defense: guard('Protego'),
    special: ranged('Dumbledore s Army Stunning Duel', 'projectile', '#e35c5c'),
    mechanicsReviewStatus: 'Spells use game damage/guard; canonical disarm and stun effects are not yet simulated. No offensive Time-Turner or later-film Protego Maxima is attributed to this kit.',
    loreLocalized: {
      fr: 'Cette Hermione est la cinquieme annee du film Order of the Phoenix de 2007 et membre de l Armee de Dumbledore, avec sa baguette de vigne a coeur de dragon. Son intelligence et son apprentissage des sorts structurent le kit a distance. Le Retourneur de Temps de Prisoner of Azkaban et Protego Maxima des films suivants ne sont pas fusionnes dans cette incarnation ; desarmement et etourdissement restent a distinguer des degats abstraits du jeu.',
      en: 'This Hermione is the fifth-year Dumbledore s Army member from the 2007 Order of the Phoenix film, using her vine and dragon-heartstring wand. Intelligence and learned spells structure her ranged kit. The Prisoner of Azkaban Time-Turner and later-film Protego Maxima are not merged into this incarnation; disarm and stun still require separation from abstract game damage.'
    }
  }),
  cyber_spider_kelly: spiderLoadout({
    equipment: ['Cybernetic Spider Body', 'Default Slasher Attachment'],
    visualAnchor: 'The small cybernetic spider carrying Dr. Michael Kelly s mind in Spider: The Video Game (1997), insect-scale laboratory setting and interchangeable weapon legs. This base slot uses the default slasher attachment. No humanoid exosuit, Spider-Man costume or claim that an original substitute sprite already matches the source model.',
    weapon: 'blade', weaponType: 'blade', weaponColor: '#a6b7b3',
    simple: melee('Slasher Cyber-Leg Cut'),
    secondary: melee('Cybernetic Slasher Feint'),
    defense: dodge('Spider Leg Sidestep'),
    special: melee('Slasher Attachment Rush'),
    loreLocalized: {
      fr: 'L esprit du docteur Michael Kelly est transfere dans une araignee cybernetique dans Spider: The Video Game de 1997. Elle traverse des environnements de laboratoire a petite echelle et equipe des armes-pattes interchangeables ; le slasher est l attachment de base. Cette entree jouable represente un loadout du meme protagoniste, pas une nouvelle personne canonique. Son ancien sprite original reste a revoir.',
      en: 'Dr. Michael Kelly s mind is transferred into a cybernetic spider in 1997 s Spider: The Video Game. It crosses insect-scale laboratory environments and equips interchangeable weapon legs; the slasher is its base attachment. This playable entry represents a loadout of the same protagonist, not a new official character. Its historical original substitute sprite remains under review.'
    }
  }),
  cyber_spider_flamethrower: spiderLoadout({
    equipment: ['Cybernetic Spider Body', 'Flamethrower Cyber-Leg'],
    visualAnchor: 'Same Kelly cybernetic-spider protagonist, with the source pack s Flamethrower Cyber-Leg loadout. Small multi-legged spider, flame emission associated with a mechanical leg, not a humanoid blade warrior. Exact 1997 weapon attachment appearance awaits original gameplay review; the existing substitute sprite is not approved.',
    weapon: 'flamethrower', weaponType: 'flamethrower', weaponColor: '#f69a44',
    simple: ranged('Flamethrower Cyber-Leg', 'fire', '#f69a44'),
    secondary: ranged('Flamethrower Attachment Sweep', 'fire', '#f69a44'),
    defense: dodge('Spider Leg Sidestep'),
    special: ranged('Flamethrower Cyber-Leg Burst', 'fire', '#f69a44'),
    loreLocalized: {
      fr: 'Cette entree conserve l identite de Kelly dans l araignee cybernetique de Spider: The Video Game, avec le loadout lance-flammes nomme par le pack source du projet. Il ne s agit pas d un autre personnage officiel : le slot et les enchainements sont une adaptation jouable. Le lance-flammes remplace le slash generique ; modele exact de la patte, carburant et comportement du jeu original restent a revoir.',
      en: 'This entry keeps Kelly s cybernetic-spider identity from Spider: The Video Game with the flamethrower loadout named by the project source pack. It is not another official character: the slot and sequences are a playable adaptation. Flame replaces the generic slash; the exact leg model, fuel and original-game behavior remain to be reviewed.'
    }
  }),
  cyber_spider_electro_beam: spiderLoadout({
    equipment: ['Cybernetic Spider Body', 'Electro-Beam Cyber-Leg'],
    visualAnchor: 'Same Kelly cybernetic-spider protagonist, with the source pack s Electro-Beam attachment loadout. Small multi-legged cybernetic spider; the electrical beam belongs to a weapon leg, not a human gun. Exact 1997 weapon model and beam presentation await original gameplay review; the existing original substitute sprite is not approved.',
    weapon: 'electro_beam', weaponType: 'electro_beam', weaponColor: '#a6ddf0',
    simple: ranged('Electro-Beam Cyber-Leg', 'beam', '#a6ddf0'),
    secondary: ranged('Electro-Beam Attachment Sweep', 'beam', '#a6ddf0'),
    defense: dodge('Spider Leg Sidestep'),
    special: ranged('Electro-Beam Cyber-Leg Burst', 'beam', '#a6ddf0'),
    loreLocalized: {
      fr: 'Cette variante represente le loadout Electro-Beam du meme Kelly/araignee de Spider: The Video Game de 1997. Le rayon de la patte remplace les balles derivees de la classe tactical. Le slot jouable est une adaptation du projet, pas un second protagoniste canonique ; le modele de l attachment et ses contraintes exactes demandent encore une reference de manuel ou de gameplay.',
      en: 'This variant represents the Electro-Beam loadout of the same Kelly/spider from 1997 s Spider: The Video Game. A leg-mounted beam replaces the class-derived tactical bullets. The playable slot is a project adaptation, not a second official protagonist; the attachment model and exact constraints still require a manual or gameplay reference.'
    }
  }),
  mj_performer: lock({
    incarnation: 'Multiverse Breach original tribute persona - King of Pop Avatar',
    referenceUrls: [REF.project],
    sourceIdentityType: 'project-original-adaptation',
    isOfficialCharacter: false,
    equipment: ['Original Stage Costume', 'Dance Shoes'],
    visualAnchor: 'Keep the project s original fully clothed adult stage avatar distinct from a documentary likeness or any specific Michael Jackson film/game costume. Final visual review is pending. Do not silently label this substitute as Thriller, Moonwalker or historical Michael Jackson.',
    weapon: 'dance', weaponType: 'dance', weaponColor: '#e0c46a',
    canonStatus: 'Original tribute persona from the project, not historical Michael Jackson or an official Moonwalker character. Musical combat is an original game adaptation.',
    simple: melee('Original Dance-Step Contact', COMIC_ADAPTATION),
    secondary: melee('Original Stage-Step Feint', COMIC_ADAPTATION),
    defense: dodge('Original Performer Sidestep'),
    special: melee('Original Dance-Floor Finale', COMIC_ADAPTATION),
    loreLocalized: {
      fr: 'King of Pop Avatar est un personnage original d hommage du projet Multiverse Breach. Il n est pas une representation validee de Michael Jackson, du court metrage Thriller ni d une incarnation Moonwalker. Son costume et sa danse forment sa propre adaptation jouable ; une version source 1:1 exigerait une incarnation distincte, des references correspondantes et une revue visuelle.',
      en: 'King of Pop Avatar is an original tribute character created for Multiverse Breach. It is not an approved representation of Michael Jackson, the Thriller short film or a Moonwalker incarnation. Costume and dance define its own playable adaptation; a source-faithful version would require a distinct incarnation, matching references and visual review.'
    }
  }),
  rhythm_guard_mj: lock({
    incarnation: 'Multiverse Breach original companion - Rhythm Guard',
    referenceUrls: [REF.project],
    sourceIdentityType: 'project-original-adaptation',
    isOfficialCharacter: false,
    equipment: ['Original Stage Costume', 'Microphone'],
    visualAnchor: 'The project s original fully clothed adult Rhythm Guard companion, with stage clothing and microphone. Not a claimed historical Michael Jackson associate or official Moonwalker cast member. No firearm derived only from the tactical class; existing substitute artwork remains pending review.',
    weapon: 'microphone', weaponType: 'microphone', weaponColor: '#b4b3b7',
    canonStatus: 'Original project companion, not a character confirmed by an external musical source. Musical gestures converted to damage are an original game adaptation.',
    simple: melee('Microphone Contact', COMIC_ADAPTATION),
    secondary: ranged('Original Rhythm Cue', 'sound', '#e0c46a', COMIC_ADAPTATION),
    defense: dodge('Stage-Position Sidestep'),
    special: ranged('Original Rhythm Finale', 'sound', '#e0c46a', COMIC_ADAPTATION),
    loreLocalized: {
      fr: 'Rhythm Guard est un compagnon original du projet et ne correspond pas a une personne officielle identifiee dans une oeuvre de Michael Jackson. Son microphone et ses indications de rythme remplacent le fusil generique de classe. La conversion de ces gestes en degats est une adaptation musicale originale, pas un pouvoir historique ou canonique.',
      en: 'Rhythm Guard is an original project companion and does not correspond to an identified official person in a Michael Jackson work. A microphone and rhythm cues replace the generic class gun. Converting these gestures into damage is an original musical adaptation, not a historical or canonical power.'
    }
  })
});

export const CANON_P0_SOURCE_KIT_IDS = Object.freeze(Object.keys(CANON_P0_SOURCE_KITS));
const ABILITIES = ['simple', 'secondary', 'defense', 'special'];

function presentationFor(id, action) {
  if (action.canonPresentation) return { ...action.canonPresentation };
  const kind = action.type === 'melee' ? 'melee'
    : id === 'jack_sparrow_potc' ? 'flintlock'
      : ['batman_tdk', 'batman_n52'].includes(id) ? 'batarang'
        : id === 'lilo_pelekai' ? 'cameraFlash'
          : id === 'raven_tt' ? 'shadow'
            : id === 'starfire_tt' ? 'starbolt'
              : ['harry', 'hermione'].includes(id) ? 'spell'
                : id === 'cyber_spider_flamethrower' ? 'flame'
                  : id === 'cyber_spider_electro_beam' ? 'electricBeam'
                    : id === 'rhythm_guard_mj' ? 'music'
                      : id === 'joker_n52' ? 'toxin' : 'bullet';
  return { kind, ...(action.color ? { color: action.color } : {}) };
}

export function applyCanonP0SourceKit(hero) {
  const source = Object.hasOwn(CANON_P0_SOURCE_KITS, hero?.id)
    ? CANON_P0_SOURCE_KITS[hero.id] : null;
  if (!source) return hero;
  const result = {
    ...hero, ...source,
    referenceUrls: [...source.referenceUrls], equipment: [...source.equipment],
    loreLocalized: { ...source.loreLocalized }
  };
  if (source.sourceAbilities) result.sourceAbilities = [...source.sourceAbilities];
  if (source.sourceAmmunition) result.sourceAmmunition = {
    ...source.sourceAmmunition, actionIds: [...source.sourceAmmunition.actionIds]
  };
  for (const key of ABILITIES) {
    if (source[key]) {
      const action = { ...hero[key], ...source[key] };
      if (key !== 'defense') action.canonPresentation = presentationFor(hero.id, action);
      for (const profile of ['attackProfile', 'tacticsProfile', 'smashProfile']) {
        if (action[profile]) action[profile] = { ...action[profile] };
      }
      result[key] = action;
    }
  }
  // All balancing numbers stay owned by the existing hero data. New profiles
  // describe delivery/targeting rather than overwriting damage or resources.
  return result;
}

export function getCanonP0SourcePlaque(hero) {
  const source = Object.hasOwn(CANON_P0_SOURCE_KITS, hero?.id)
    ? CANON_P0_SOURCE_KITS[hero.id] : null;
  if (!source) return null;
  return {
    origin: { fr: source.incarnation, en: source.incarnation },
    dossier: { ...source.loreLocalized },
    doctrine: {
      fr: `${source.equipment.join(', ')}. Les chiffres et enchainements sont une adaptation du jeu ; revue visuelle toujours en attente.`,
      en: `${source.equipment.join(', ')}. Numbers and sequences are a game adaptation; visual review remains pending.`
    }
  };
}
