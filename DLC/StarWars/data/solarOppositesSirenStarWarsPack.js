// Star Wars — definitions consumed by src/game/solarOppositesSirenStarWarsPack.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createAhsokaPadawan({ action, fighter }) {
  return (fighter({
  id: 'ahsoka_padawan',
  name: 'Ahsoka Tano (Padawan)',
  cat: 'slayer',
  color: '#e77836',
  accent: '#7ed957',
  weaponType: 'lightsaber',
  stats: { hp: 110, atk: 14, def: 6, spd: 9 },
  simple: action('Reverse-Grip Green Saber', 'melee', 1.08),
  secondary: action('Padawan Force Leap', 'force', 1.7, { cd: 5 }),
  defense: action('Shien Deflection', 'shield', 0, { dur: 1.9, reduce: 0.82 }),
  special: action('Skyguy Battlefield Lesson', 'force_aoe', 4.35, { color: '#7ed957' }),
  equipment: ['Green Lightsaber'],
  incarnation: 'The Clone Wars - early Padawan, age fourteen',
  referenceUrl: 'https://www.starwars.com/databank/ahsokas-lightsabers',
  equipmentSource: 'Star Wars Databank — Ahsoka lightsabers, early Padawan',
  equipmentEvidenceStatus: 'SOURCE_OFFICIELLE_INCARNATION_VERROUILLEE_VALIDATION_VISUELLE_REQUISE'
}));
}

export function createAhsokaSiege({ action, fighter }) {
  return (fighter({
  id: 'ahsoka',
  name: 'Ahsoka Tano (Siege of Mandalore)',
  cat: 'slayer',
  color: '#e77836',
  accent: '#4ea8ff',
  weaponType: 'dual_lightsaber',
  stats: { hp: 122, atk: 16, def: 7, spd: 9 },
  simple: action('Twin Blue Saber Cut', 'melee', 1.15),
  secondary: action('Mandalore Throne-Room Counter', 'force', 1.95, { cd: 5 }),
  defense: action('Order 66 Deflection', 'shield', 0, { dur: 2.1, reduce: 0.86 }),
  special: action('Siege of Mandalore Break', 'force_aoe', 4.8, { color: '#4ea8ff' }),
  equipment: ['Twin Blue Lightsabers'],
  incarnation: 'The Clone Wars - Season 7, Siege of Mandalore',
  referenceUrl: 'https://www.starwars.com/news/clone-wars-declassified-5-highlights-from-old-friends-not-forgotten',
  equipmentSource: 'Star Wars / The Clone Wars S7E9 — Anakin returns her blue-bladed sabers',
  equipmentEvidenceStatus: 'SOURCE_OFFICIELLE_INCARNATION_VERROUILLEE_VALIDATION_VISUELLE_REQUISE'
}));
}

export function createAhsokaAdult({ action, fighter }) {
  return (fighter({
  id: 'ahsoka_adult',
  name: 'Ahsoka Tano (Adult)',
  cat: 'tactical',
  color: '#d96f35',
  accent: '#f4f8ff',
  weaponType: 'dual_lightsaber',
  stats: { hp: 130, atk: 15, def: 9, spd: 8 },
  simple: action('White Saber Crosscut', 'melee', 1.12),
  secondary: action('Fulcrum Route Read', 'force', 1.75, { cd: 5 }),
  defense: action('Fulcrum Evasive Guard', 'dodge', 0, { dur: 2.3, reduce: 0.9 }),
  // Original 2D gameplay adaptation: neither a canon Force-time-step nor
  // the later white-cloak appearance of Ahsoka in the Rebels epilogue.
  special: action('Fulcrum Twin-Saber Sweep', 'light_aoe', 4.75, { color: '#f4f8ff' }),
  equipment: ['Twin White Lightsabers'],
  incarnation: 'Star Wars Rebels - Fulcrum era (adult former Jedi)',
  referenceUrl: 'https://www.starwars.com/databank/ahsokas-lightsabers',
  referenceUrls: ['https://www.starwars.com/databank/ahsoka-tano', 'https://www.starwars.com/databank/malachor-sith-temple'],
  visualAnchor: 'Star Wars Rebels Fulcrum era: two white-bladed sabers, Rebels-era outfit; NOT the later white-cloaked epilogue or New Republic outfit',
  combatMoveStatus: 'ADAPTATION_DE_JEU_NON_TELEPORTATION_TEMPORELLE',
  equipmentSource: 'Star Wars Databank — Fulcrum uses the white-bladed pair; Ezra rescues her through the World Between Worlds, which is not her personal dodge power',
  equipmentEvidenceStatus: 'SOURCE_OFFICIELLE_INCARNATION_VERROUILLEE_VALIDATION_VISUELLE_REQUISE'
}));
}

export function createAaylaSecura({ action, fighter }) {
  return (fighter({
  id: 'aayla_secura',
  name: 'Aayla Secura',
  cat: 'slayer',
  color: '#4ba6d8',
  accent: '#6cc7ff',
  weaponType: 'lightsaber',
  stats: { hp: 120, atk: 15, def: 7, spd: 8 },
  simple: action('Blue Saber Advance', 'melee', 1.1),
  secondary: action('Felucia Flank', 'force', 1.8, { cd: 6 }),
  defense: action('Jedi General Guard', 'shield', 0, { dur: 2.0, reduce: 0.82 }),
  special: action('Commander Bly Formation', 'force_aoe', 4.55, { color: '#6cc7ff' }),
  equipment: ['Blue Lightsaber'],
  incarnation: 'The Clone Wars - Aayla Secura as Jedi General',
  referenceUrl: 'https://www.starwars.com/databank/aayla-secura',
  equipmentSource: 'Star Wars Databank — sabre attesté ; les attributs secondaires et leur appartenance à Aayla ne sont pas établis.',
  equipmentEvidenceStatus: 'ARME_ATTESTEE_MODELE_ET_VISUEL_A_VALIDER'
}));
}

export function createDarthMaul({ action, fighter }) {
  return (fighter({
  id: 'darth_maul',
  name: 'Darth Maul',
  cat: 'slayer',
  color: '#b72822',
  accent: '#ff2d24',
  weaponType: 'double_lightsaber',
  stats: { hp: 134, atk: 17, def: 6, spd: 9 },
  simple: action('Mandalore Twin-Blade Assault', 'melee', 1.2),
  secondary: action('Dathomirian Force Choke', 'force', 2.05, { cd: 6 }),
  defense: action('Cybernetic Spin Parry', 'shield', 0, { dur: 1.8, reduce: 0.84 }),
  special: action('Shadow Collective Dominion', 'dark_aoe', 5.0, { color: '#ff2d24' }),
  equipment: ['Double-Bladed Red Lightsaber (The Clone Wars S7)'],
  bodyProsthetics: ['Mandalorian-Issue Humanoid Cybernetic Legs'],
  incarnation: 'The Clone Wars - Season 7, Siege of Mandalore (The Phantom Apprentice)',
  referenceUrl: 'https://www.starwars.com/series/clone-wars/the-phantom-apprentice-episode-guide',
  referenceUrls: [
    'https://www.starwars.com/news/clone-wars-declassified-5-highlights-from-the-phantom-apprentice',
    'https://www.starwars.com/databank/darth-mauls-lightsaber',
    'https://www.starwars.com/news/what-is-the-darksaber',
    'https://www.starwars.com/news/star-wars-maul-shadow-lord-leg-list'
  ],
  equipmentSource: 'The Phantom Apprentice (S7E10) — double red saber is equipped; Mandalorian-issued humanoid mechanical legs are intrinsic prostheses, not removable loot. Earlier half-saber, Darksaber and legs belong to other scenes.',
  visualAnchor: 'The Clone Wars S7: red double blade, Mandalorian-issued humanoid prosthetic legs (not Lotho Minor spider legs or Talzin claw legs)',
  equipmentEvidenceStatus: 'SOURCE_OFFICIELLE_INCARNATION_VERROUILLEE_VALIDATION_VISUELLE_REQUISE'
}));
}

export function createDarthRevan({ action, fighter }) {
  return (fighter({
  id: 'darth_revan',
  name: 'Darth Revan',
  cat: 'tactical',
  color: '#282329',
  accent: '#8f4dff',
  // This is the KOTOR I masked Sith costume/combat edition. KOTOR II, late SWTOR,
  // and LEGO have independently documented alternate saber presentations.
  weaponType: 'lightsaber',
  weaponColor: '#ff4242',
  stats: { hp: 138, atk: 16, def: 9, spd: 7 },
  simple: action('Red Saber Judgment', 'melee', 1.14),
  secondary: action('Force Reversal', 'force', 1.95, { cd: 6 }),
  defense: action('Revanite Mask Focus', 'shield', 0, { dur: 2.2, reduce: 0.86 }),
  special: action('Star Forge Command', 'force_aoe', 4.95, { color: '#8f4dff' }),
  equipment: ['Red Lightsaber'],
  costumeParts: [
    'KOTOR I Revan Mask (weathered rust red and graphite, two-pronged chin)',
    'Dark Hood and Capelet', 'Armored Cuirass and Vambraces'
  ],
  alternateIncarnations: [
    'KOTOR II costume reference: two lightsabers, one red and one purple',
    'SWTOR: Fallen Revan red blade and Redeemed Revan purple blade are separately listed',
    'LEGO Rebuild the Galaxy (2025): red-and-purple dual-wield cameo'
  ],
  incarnation: 'Star Wars: Knights of the Old Republic I - masked Darth Revan (Legends Sith)',
  canonStatus: 'legends',
  referenceUrl: 'https://crls.501st.com/tfe/darth-revan-kotor-i-and-ii',
  referenceUrls: [
    'https://www.starwars.com/games-apps/knights-of-the-old-republic',
    'https://www.swtor.com/info/news/article/20201209-0',
    'https://www.starwars.com/news/lego-rebuild-the-galaxy-pieces-of-the-past-deep-cuts'
  ],
  visualAnchor: 'KOTOR I masked Sith Revan: weathered graphite/rust mask with two chin prongs, dark hood, cuirass and vambraces; one red blade, NOT the SWTOR flat-chin mask',
  equipmentSource: '501st CRL: KOTOR I permits a single red blade, KOTOR II depicts two red/purple blades; SWTOR hilts are a separate edition. Approved cosplay reference only, not an in-game art certificate.',
  equipmentEvidenceStatus: 'KOTOR1_VARIANTE_SITH_REFERENCE_COSTUME_VISUEL_NON_CERTIFIE'
}));
}

export function createDarthTalon({ action, fighter }) {
  return (fighter({
  id: 'darth_talon',
  name: 'Darth Talon',
  cat: 'slayer',
  color: '#b52c32',
  accent: '#ef2828',
  weaponType: 'lightsaber',
  stats: { hp: 118, atk: 16, def: 6, spd: 9 },
  simple: action('One Sith Saber Cut', 'melee', 1.15),
  secondary: action('Twi lek Hunter Lunge', 'force', 1.95, { cd: 5 }),
  defense: action('Sith Tattoo Focus', 'dodge', 0, { dur: 1.8, reduce: 0.84 }),
  special: action('Hand of Darth Krayt', 'dark_aoe', 4.85, { color: '#ef2828' }),
  // 501st's approved costume-reference model lists distinct protective pieces.
  // Tattoos are skin markings, not detachable loot or a magic inventory item.
  equipment: ['Red Lightsaber', 'Forearm and Bicep Armor', 'Leg Armor'],
  costumeParts: [
    'Armored Bandeau', 'Armored Hand Strap', 'Black Gloves',
    'Belt with Front Buckle Plate and Straps', 'Black Boots and Leggings'
  ],
  bodyMarkings: ['Black Sith Ritual Tattoos (face, chest, abdomen, arms, legs and lekku)'],
  incarnation: 'Star Wars: Legacy (Legends) - One Sith Hand of Darth Krayt',
  canonStatus: 'legends',
  referenceUrl: 'https://crls.501st.com/tfe/darth-talon',
  referenceUrls: ['https://starwars.fandom.com/wiki/Darth_Talon'],
  visualAnchor: 'Legacy Darth Talon: red Lethan Twi-lek, black ritual tattoos, sleeveless armored bandeau, separate arm and leg plates; actual comic and sprite match unverified',
  equipmentSource: '501st Costume Reference Library, Legends visual costume reconstruction; reference for garment/armor shape, NOT a Lucasfilm certificate for in-game art.',
  equipmentEvidenceStatus: 'LEGENDS_COSTUME_501ST_APPROUVEE_SPRITE_NON_VERIFIE'
}));
}

export function createSolarOppositesSirenStarWarsHeroExpansions({ aaylaSecura, ahsokaAdult, ahsokaPadawan, darthRevan, darthTalon }) {
  return ([
    ahsokaPadawan,
    ahsokaAdult,
    aaylaSecura,
    darthRevan,
    darthTalon
  ]);
}

export function createSolarOppositesSirenStarWarsCharacterPlaques({ plaque }) {
  return (plaque({
    clearance: 'SW-AH14',
    rankFr: 'Padawan commandante',
    rankEn: 'Padawan commander',
    roleFr: 'Mobilite Jedi et apprentissage sous pression',
    roleEn: 'Jedi mobility and learning under pressure',
    callSign: 'Snips',
    originFr: 'Republique galactique - debut de la Guerre des Clones',
    originEn: 'Galactic Republic - early Clone Wars',
    dossierFr: 'Dans sa Trame d origine, Ahsoka Tano est une Togruta de quatorze ans confiee comme Padawan a Anakin Skywalker. Vive, inventive et parfois trop sure de son jugement, elle apprend a commander des clones dans une guerre qui transforme des apprentis en officiers. Cette incarnation porte sa tenue marron et bordeaux des premieres campagnes, manie un sabre vert en prise inversee et n a pas encore subi la rupture avec l Ordre Jedi.',
    dossierEn: 'In her origin Thread, Ahsoka Tano is a fourteen-year-old Togruta assigned as Padawan to Anakin Skywalker. Quick, inventive, and sometimes too certain of her judgment, she learns to command clones in a war that turns apprentices into officers. This incarnation wears her brown and burgundy early-campaign outfit, wields one green lightsaber in reverse grip, and has not yet endured her break with the Jedi Order.',
    breachFr: 'La Breche separe Ahsoka de son propre avenir et lui montre des fragments qu elle ne devrait pas connaitre: Mandalore, l Ordre 66 et le masque de Vader. A.R.C.A. verrouille ces images pour ne pas voler ses choix. Son arc personnel consiste a sauver une section clone sans utiliser la connaissance du futur comme condamnation, puis a comprendre que le courage n est pas l absence d erreur mais la responsabilite prise apres celle-ci.',
    breachEn: 'The Breach separates Ahsoka from her own future and shows fragments she should not know: Mandalore, Order 66, and Vader mask. A.R.C.A. locks those images so they do not steal her choices. Her personal arc is to save a clone section without using future knowledge as a sentence, then understand that courage is not the absence of mistakes but responsibility taken after them.',
    doctrineFr: 'Sabre vert en prise inversee, bond de Force, deflexion Shien et commandement clone.',
    doctrineEn: 'Reverse-grip green saber, Force leap, Shien deflection, and clone command.',
    threatFr: 'Risque A.R.C.A.: une memoire future non filtree peut briser sa confiance en Anakin avant que leur histoire ne soit vecue.',
    threatEn: 'A.R.C.A. risk: an unfiltered future memory can break her trust in Anakin before their history is lived.',
    tags: ['Star Wars', 'Ahsoka', 'Padawan', 'Clone Wars', 'Slayer']
  }));
}

export function createSolarOppositesSirenStarWarsCharacterPlaques2({ plaque }) {
  return (plaque({
    clearance: 'SW-AH17',
    rankFr: 'Commandante hors de l Ordre',
    rankEn: 'Commander outside the Order',
    roleFr: 'Duel, protection des clones et rupture de siege',
    roleEn: 'Dueling, clone protection, and siege breaking',
    callSign: 'Fulcrum-0',
    originFr: 'Mandalore - derniers jours de la Guerre des Clones',
    originEn: 'Mandalore - final days of the Clone Wars',
    dossierFr: 'Dans sa Trame d origine, Ahsoka a quitte l Ordre Jedi apres avoir ete accusee a tort de l attentat du Temple. Elle revient sans reprendre le titre de Jedi pour diriger la 332e compagnie avec Rex pendant le siege de Mandalore. Anakin lui rend deux sabres dont les lames sont devenues bleues. Elle affronte Maul, le capture, puis survit a l Ordre 66 en refusant autant que possible de massacrer les clones asservis par leurs puces inhibitrices.',
    dossierEn: 'In her origin Thread, Ahsoka has left the Jedi Order after being falsely accused in the Temple bombing. She returns without reclaiming the Jedi title to lead the 332nd with Rex during the Siege of Mandalore. Anakin returns two lightsabers whose blades have become blue. She duels and captures Maul, then survives Order 66 while refusing whenever possible to massacre clones enslaved by their inhibitor chips.',
    breachFr: 'Le fragment de Mandalore arrive dans le Nexus avec un ordre contradictoire: capturer Maul, proteger Rex et fuir un croiseur dont la chute existe deja dans les archives. Ahsoka utilise les portails comme des routes de sauvetage, jamais comme moyen de corriger le passe. Son arc la confronte a une copie de la 332e qui ne peut etre sauvee qu en laissant Maul libre. Elle choisit les vies presentes plutot que la victoire symbolique et accepte que cette decision ait un cout.',
    breachEn: 'The Mandalore fragment reaches the Nexus with contradictory orders: capture Maul, protect Rex, and escape a cruiser whose fall already exists in the archives. Ahsoka uses portals as rescue routes, never as a way to correct the past. Her arc confronts her with a copy of the 332nd that can only be saved by leaving Maul free. She chooses present lives over symbolic victory and accepts that the decision has a cost.',
    doctrineFr: 'Deux sabres bleus, contre de trone, deflexion Ordre 66 et rupture de siege.',
    doctrineEn: 'Twin blue sabers, throne-room counter, Order 66 deflection, and siege break.',
    threatFr: 'Risque A.R.C.A.: les echos de clones morts peuvent transformer chaque ordre tactique en paralysie morale.',
    threatEn: 'A.R.C.A. risk: echoes of dead clones can turn every tactical order into moral paralysis.',
    tags: ['Star Wars', 'Ahsoka', 'Mandalore', 'Order 66', 'Slayer']
  }));
}

export function createSolarOppositesSirenStarWarsCharacterPlaques3({ plaque }) {
  return (plaque({
    clearance: 'SW-AHAD',
    rankFr: 'Fulcrum et ancienne Jedi',
    rankEn: 'Fulcrum and former Jedi',
    roleFr: 'Renseignement Fulcrum, duels et mentorat des rebelles',
    roleEn: 'Fulcrum intelligence, dueling, and mentoring rebel cells',
    callSign: 'Fulcrum',
    originFr: 'Star Wars Rebels - Rebellion contre l Empire',
    originEn: 'Star Wars Rebels - rebellion against the Empire',
    dossierFr: 'Cette incarnation Star Wars Rebels suit Ahsoka en agente de renseignement Fulcrum pendant la rebellion contre l Empire. Elle porte deux sabres blancs, soutient l equipage du Ghost et affronte les Inquisiteurs puis Darth Vader au temple de Malachor. Plus tard, Ezra la sauve du duel par le Monde entre les Mondes: cette intervention est un evenement du recit, pas un pouvoir de teleportation dont Ahsoka disposerait au combat. Sa periode de Nouvelle Republique et son manteau blanc d epilogue doivent disposer de fiches et sprites differents.',
    dossierEn: 'This Star Wars Rebels incarnation follows Ahsoka as the Fulcrum intelligence operative opposing the Empire. She carries two white lightsabers, works with the Ghost crew, and faces Inquisitors and Darth Vader at the Malachor Sith temple. Ezra later rescues her through the World Between Worlds: this is a story event, not a combat teleportation power she can freely cast. Her New Republic era and white-cloaked epilogue portrayal require distinct actor editions and visual references.',
    breachFr: 'Les portails du Nexus ressemblent dangereusement au Monde entre les Mondes, mais Ahsoka reconnait qu ils n en suivent pas les lois. Elle devient la gardienne des routes qui montrent le passe sans autoriser sa consommation. Le Sans-Auteur lui offre un passage ou Anakin ne tombe jamais; elle le ferme parce qu il efface Luke, Leia, Ezra et toutes les decisions nees de cette perte. Sa victoire n est pas d obtenir une histoire parfaite, mais d empecher le Nexus de prendre la memoire pour une permission de reecrire.',
    breachEn: 'Nexus portals resemble the World Between Worlds dangerously closely, but Ahsoka recognizes that they do not follow its laws. She becomes guardian of routes that show the past without allowing it to be consumed. The Authorless offers her a passage where Anakin never falls; she closes it because it erases Luke, Leia, Ezra, and every choice born from that loss. Her victory is not obtaining a perfect history, but preventing the Nexus from mistaking memory for permission to rewrite.',
    doctrineFr: 'Deux sabres blancs, renseignement Fulcrum, garde evasive et balayage de combat adapte au jeu (pas de saut temporel).',
    doctrineEn: 'Twin white sabers, Fulcrum intelligence, evasive guard and adapted combat sweep; no personal time travel skill.',
    threatFr: 'Risque A.R.C.A.: tout portail imitant le Monde entre les Mondes doit etre considere hostile jusqu a preuve causale contraire.',
    threatEn: 'A.R.C.A. risk: any portal imitating the World Between Worlds must be treated as hostile until causally proven otherwise.',
    tags: ['Star Wars', 'Ahsoka', 'Fulcrum', 'White Sabers', 'Tactical']
  }));
}

export function createSolarOppositesSirenStarWarsCharacterPlaques4({ plaque }) {
  return (plaque({
    clearance: 'SW-AAYL',
    rankFr: 'Generale Jedi',
    rankEn: 'Jedi General',
    roleFr: 'Avant-garde agile et commandement clone',
    roleEn: 'Agile vanguard and clone command',
    callSign: 'Secura',
    originFr: 'Ryloth / Republique galactique - Guerre des Clones',
    originEn: 'Ryloth / Galactic Republic - Clone Wars',
    dossierFr: 'Dans sa Trame d origine, Aayla Secura est une Jedi Twi lek a la peau bleue, ancienne Padawan de Quinlan Vos et Generale pendant la Guerre des Clones. Elle combat sur Geonosis, Maridun et Felucia, travaille avec le Commandant Bly et enseigne a Ahsoka que l attachement ne doit pas detruire le devoir envers les vivants. L Ordre 66 retourne finalement ses propres soldats contre elle sur Felucia.',
    dossierEn: 'In her origin Thread, Aayla Secura is a blue-skinned Twi lek Jedi, former Padawan of Quinlan Vos, and General during the Clone Wars. She fights on Geonosis, Maridun, and Felucia, serves with Commander Bly, and teaches Ahsoka that attachment must not destroy duty toward the living. Order 66 ultimately turns her own soldiers against her on Felucia.',
    breachFr: 'Une faille de Felucia repete l Ordre 66 comme un signal sans emetteur et transforme chaque clone archive en assaillant. Aayla refuse de traiter Bly et ses hommes comme des ennemis ordinaires. Elle remonte le signal, neutralise les puces reproduites par le Nexus et recupere les memoires d avant l ordre. Son arc Breach transforme sa derniere seconde en mission active: sauver la relation de confiance que Palpatine avait convertie en arme.',
    breachEn: 'A Felucia breach repeats Order 66 as a signal without a sender and turns every archived clone into an attacker. Aayla refuses to treat Bly and his men as ordinary enemies. She traces the signal, disables chips reproduced by the Nexus, and recovers memories from before the order. Her Breach arc turns her final second into an active mission: save the trust Palpatine converted into a weapon.',
    doctrineFr: 'Sabre bleu, flanc de Felucia, parade Jedi et coordination avec le Commandant Bly.',
    doctrineEn: 'Blue saber, Felucia flank, Jedi guard, and Commander Bly coordination.',
    threatFr: 'Risque A.R.C.A.: les commandes clone falsifiees peuvent exploiter son refus legitime d abandonner ses soldats.',
    threatEn: 'A.R.C.A. risk: forged clone commands can exploit her justified refusal to abandon her soldiers.',
    tags: ['Star Wars', 'Aayla Secura', 'Jedi', 'Felucia', 'Slayer']
  }));
}

export function createSolarOppositesSirenStarWarsCharacterPlaques5({ plaque }) {
  return (plaque({
    clearance: 'SW-MAUL',
    rankFr: 'Ancien apprenti Sith',
    rankEn: 'Former Sith apprentice',
    roleFr: 'Duel agressif et domination criminelle',
    roleEn: 'Aggressive dueling and criminal domination',
    callSign: 'Maul',
    originFr: 'Dathomir / Mandalore - Ordre Sith et Shadow Collective',
    originEn: 'Dathomir / Mandalore - Sith Order and Shadow Collective',
    dossierFr: 'Dans sa Trame d origine, Maul est un Zabrak de Dathomir faconne par Darth Sidious comme arme contre les Jedi. Il manie un sabre rouge a double lame, tue Qui-Gon Jinn puis est tranche par Obi-Wan Kenobi. Sa haine le maintient en vie; des jambes mecaniques remplacent son corps perdu et Mother Talzin restaure son esprit. Maul construit le Shadow Collective, prend Mandalore, perd Savage face a Sidious et transforme sa survie en obsession contre Kenobi et contre tous les maitres qui l ont utilise.',
    dossierEn: 'In his origin Thread, Maul is a Dathomirian Zabrak shaped by Darth Sidious as a weapon against the Jedi. He wields a double-bladed red lightsaber, kills Qui-Gon Jinn, then is cut down by Obi-Wan Kenobi. Hatred keeps him alive; mechanical legs replace his lost body and Mother Talzin restores his mind. Maul builds the Shadow Collective, takes Mandalore, loses Savage to Sidious, and turns survival into obsession against Kenobi and every master who used him.',
    breachFr: 'Le Nexus contient des milliers d echos d Obi-Wan, mais aucun n appartient a la route que Maul croit devoir achever. Il conquiert des portails comme il conquis Mandalore et tente de batir un nouveau Shadow Collective avec des factions fracturees. Son arc Breach le force a choisir entre poursuivre un faux Kenobi fabrique pour le retenir ou detruire le relais de Sidious qui controle les fragments. Il brise le relais, non par redemption, mais parce qu il refuse enfin qu un maitre choisisse la forme de sa haine.',
    breachEn: 'The Nexus contains thousands of Obi-Wan echoes, but none belongs to the route Maul believes he must finish. He conquers portals as he conquered Mandalore and tries to build a new Shadow Collective from fractured factions. His Breach arc forces him to choose between pursuing a false Kenobi built to hold him or destroying the Sidious relay controlling the fragments. He breaks the relay, not through redemption, but because he finally refuses to let a master choose the shape of his hatred.',
    doctrineFr: 'Sabre double, rotation cybernetique, etranglement de Force et commandement du Shadow Collective.',
    doctrineEn: 'Double saber, cybernetic spin, Force choke, and Shadow Collective command.',
    threatFr: 'Risque A.R.C.A. critique: toute signature Kenobi peut provoquer une rupture immediate de mission.',
    threatEn: 'Critical A.R.C.A. risk: any Kenobi signature can trigger immediate mission rupture.',
    tags: ['Star Wars', 'Maul', 'Dathomir', 'Mandalore', 'Slayer']
  }));
}

export function createSolarOppositesSirenStarWarsCharacterPlaques6({ plaque }) {
  return (plaque({
    clearance: 'SW-REVN',
    rankFr: 'Seigneur Sith masque (KOTOR I)',
    rankEn: 'Masked Sith Lord (KOTOR I)',
    roleFr: 'Duel au sabre rouge, commandement Sith et pouvoirs de Force',
    roleEn: 'Red-lightsaber dueling, Sith command, and Force abilities',
    callSign: 'Revan',
    originFr: 'Legends - Ancienne Republique / Guerre Civile Jedi',
    originEn: 'Legends - Old Republic / Jedi Civil War',
    dossierFr: 'Dans la continuite Legends de Knights of the Old Republic, Revan est un Jedi parti combattre les Mandaloriens, devenu Seigneur Sith avec Malak avant sa capture et l effacement de ses souvenirs par le Conseil Jedi. La version jouable ici fixe son apparence masquee de KOTOR I: capuche noire, armure et masque patine rouge et gris, un seul sabre rouge. Le duo rouge et violet des references KOTOR II, tout comme les armes et casques SWTOR, correspondent a des editions distinctes et ne doivent pas modifier ce kit. La redemption et les choix du joueur restent des evenements essentiels du recit, sans imposer un equipement permanent unique a toutes les epoques.',
    dossierEn: 'In Legends Knights of the Old Republic, Revan fought in the Mandalorian Wars, became a Sith Lord alongside Malak, and was later captured and had his memories erased by the Jedi Council. This playable edition selects the masked Sith depiction from KOTOR I: black hood, dark armor, weathered red-and-grey mask, and one red lightsaber. The red-and-purple pair shown in KOTOR II references, as well as SWTOR helmets and weapons, are different editions and must not be silently equipped here. Revan later finds new choices and possible redemption; none of those eras should inherit one universal loadout.',
    breachFr: 'Le Sans-Auteur voit dans l amnesie de Revan une porte ideale: remplacer une personne par son dossier sans que personne ne puisse prouver la difference. Revan repond en cartographiant chaque decision conservee plutot qu en cherchant une version unique de lui-meme. La Forge Stellaire reconstituee par la Breche produit des soldats a partir de souvenirs supprimes; son arc personnel exige de detruire cette production, puis de laisser l Ancre choisir si le masque reste symbole de peur, de dette ou de seconde chance.',
    breachEn: 'The Authorless sees Revan amnesia as an ideal doorway: replace a person with a file while nobody can prove the difference. Revan answers by mapping every preserved choice instead of searching for one definitive self. A Breach-rebuilt Star Forge manufactures soldiers from deleted memories; the personal arc requires destroying that production, then letting the Anchor decide whether the mask remains a symbol of fear, debt, or second chance.',
    doctrineFr: 'KOTOR I : masque Sith, un sabre rouge, contre de Force et commandement de Forge Stellaire. Les variantes KOTOR II et SWTOR restent separees.',
    doctrineEn: 'KOTOR I: Sith mask, one red lightsaber, Force counter and Star Forge command. KOTOR II and SWTOR gear stay separate.',
    threatFr: 'Risque A.R.C.A.: une restauration forcee de memoire peut recreer Darth Revan sans les choix qui l avaient transforme.',
    threatEn: 'A.R.C.A. risk: forced memory restoration can recreate Darth Revan without the choices that changed that identity.',
    tags: ['Star Wars', 'Legends', 'Revan', 'KOTOR', 'Tactical']
  }));
}

export function createSolarOppositesSirenStarWarsCharacterPlaques7({ plaque }) {
  return (plaque({
    clearance: 'SW-TALN',
    rankFr: 'Main du One Sith',
    rankEn: 'Hand of the One Sith',
    roleFr: 'Traque, infiltration et assassinat Sith',
    roleEn: 'Hunting, infiltration, and Sith assassination',
    callSign: 'Talon',
    originFr: 'Legends - ere Legacy / One Sith de Darth Krayt',
    originEn: 'Legends - Legacy era / Darth Krayt One Sith',
    dossierFr: 'Dans la continuite Legends de Star Wars: Legacy, Darth Talon est une Twi lek Sith a la peau rouge couverte de tatouages noirs rituels. Formee dans l ordre One Sith de Darth Krayt, elle devient l une de ses Mains, traque Cade Skywalker et manie un sabre rouge avec une violence precise. Ses tatouages ne sont pas decoratifs: ils signalent son appartenance, sa discipline et la possession politique de son corps par l ordre Sith.',
    dossierEn: 'In the Legends continuity of Star Wars: Legacy, Darth Talon is a red-skinned Twi lek Sith covered in ritual black tattoos. Trained within Darth Krayt One Sith order, she becomes one of his Hands, hunts Cade Skywalker, and wields a red lightsaber with precise violence. Her tattoos are not decoration: they mark allegiance, discipline, and the Sith order political ownership of her body.',
    breachFr: 'Les fractures du Nexus transforment ses tatouages en lignes de coordonnees capables de marquer une cible entre plusieurs univers. Krayt lui ordonne de retrouver un Cade qui n existe que comme echo d archive. Talon decouvre que le signal vient du Sans-Auteur, lequel cherche a faire du One Sith une police de suppression. Son arc ne la rend pas soudainement heroique: elle coupe la marque parce qu elle refuse qu une autorite inconnue supplante son serment, puis conserve les coordonnees pour ses propres objectifs.',
    breachEn: 'Nexus fractures turn her tattoos into coordinate lines able to mark a target across universes. Krayt orders her to find a Cade who exists only as an archive echo. Talon discovers the signal comes from the Authorless, who wants the One Sith to become deletion police. Her arc does not make her suddenly heroic: she cuts the mark because she refuses to let an unknown authority replace her oath, then keeps the coordinates for her own purposes.',
    doctrineFr: 'Sabre rouge, bond de traque, focalisation des tatouages et execution de cible marquee.',
    doctrineEn: 'Red saber, hunter leap, tattoo focus, and marked-target execution.',
    threatFr: 'Risque A.R.C.A. critique: la cooperation cesse des qu une cible prioritaire du One Sith apparait dans la Trame.',
    threatEn: 'Critical A.R.C.A. risk: cooperation ends the moment a One Sith priority target appears in the Thread.',
    tags: ['Star Wars', 'Legends', 'Darth Talon', 'One Sith', 'Slayer']
  }));
}
