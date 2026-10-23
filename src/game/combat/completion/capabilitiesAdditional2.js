// Extra explicitly authored identities found after the initial completion audit.
// Named source techniques, shared loadouts and role adaptations remain distinct.
// Damage, timing, range and support values are gameplay adaptations; these
// records do not certify source animation frames or a 1:1 visual reproduction.
const action = (name, type, effect, shape, delivery, range, extra = {}) => ({
  name, type, dmg: effect === 'damage' ? 4.5 : 0,
  animationDuration: 1.1, hitAt: 0.45,
  targeting: { effect, targetSide: effect === 'damage' ? 'enemy' : 'ally', shape, delivery, range, ...extra }
});
const melee = (name, extra = {}) => action(name, 'melee', 'damage', 'single', 'melee', 170, extra);
const shot = (name, extra = {}) => action(name, 'bullet', 'damage', 'single', 'projectile', 720, extra);
const projectile = (name, extra = {}) => action(name, 'projectile', 'damage', 'area', 'projectile', 650, { areaRadius: 115, ...extra });
const beam = (name, extra = {}) => action(name, 'beam', 'damage', 'line', 'beam', 730, { lineWidth: 42, ...extra });
const area = (name, extra = {}) => action(name, 'area', 'damage', 'area', 'area', 530, { areaRadius: 135, ...extra });
const guard = (name, extra = {}) => action(name, 'shield_aoe', 'guard', 'group', 'support', 760, { reduce: 0.45, duration: 4, ...extra });
const buff = (name, extra = {}) => action(name, 'buff', 'buff', 'group', 'support', 760, { buffMultiplier: 1.25, duration: 4, ...extra });
const heal = (name, extra = {}) => action(name, 'heal_aoe', 'heal', 'group', 'support', 760, { healRatio: 0.3, ...extra });
const cleanse = (name, extra = {}) => action(name, 'cleanse', 'cleanse', 'group', 'support', 760, { cleanses: true, ...extra });
const TECHNIQUE = 'canonical-technique';
const ROLE = 'canonical-role';
const AUTHORED = 'authored-universe-canon';
const group = (universe, sourceWork, referenceUrl, color, rows) => Object.fromEntries(rows.map(([id, special, sourceReference, identityBasis = ROLE]) => [id, {
  universe, sourceWork, sourceReference, referenceUrl, sourceUrl: referenceUrl, identityBasis,
  canonicalVerified: false, networkVerified: false, gameplayAdapted: true,
  special: { ...special, color: special.color || color }
}]));

export const CAPABILITIES_ADDITIONAL_2 = {
  ...group('Starship Troopers', 'Starship Troopers (1997), continuité du premier film', 'https://www.sonypictures.com/movies/starshiptroopers', '#b7bfab', [
    ['starship_troopers_1997_johnny_rico', shot('Morita — couverture de Rico'), 'Rico combat avec le fusil Morita de la Mobile Infantry lors des opérations du film de 1997 ; cette salve adapte son équipement, pas une capacité des suites.'],
    ['starship_troopers_1997_dizzy_flores', projectile('Grenade de Dizzy contre le Tanker Bug'), 'Dizzy lance une grenade dans le Tanker Bug pendant la défense de Whiskey Outpost ; explosion simplifiée et sans gore.'],
    ['starship_troopers_1997_carmen_ibanez', guard('Extraction de Carmen au point de rendez-vous'), 'Carmen est pilote de la flotte ; la protection de l’équipe adapte le pilotage et le retour des survivants, sans lui attribuer une arme psychique ou une attaque de fantassin.']
  ]),
  ...group('Lost Planet 2', 'Lost Planet 2 (2010), avatars de factions et arsenal partagé', 'https://store.steampowered.com/app/45750/LOST_PLANET_2/', '#cba779', [
    ['lost_planet_2_snow_pirate_gunner', shot('Mitrailleuse des Snow Pirates', { shape: 'multi', maxTargets: 3 }), 'Snow Pirate Gunner est un avatar de faction du pack, utilisant les armes communes de Lost Planet 2 ; la rafale de mitrailleuse ne devient pas un pouvoir exclusif.', AUTHORED],
    ['lost_planet_2_jungle_pirate_scout', guard('Ancre — prise d’appui du Jungle Pirate', { targetSide: 'self', shape: 'single' }), 'Le Scout est un avatar de faction ; l’ancre de déplacement appartient au système de jeu partagé et son changement d’appui est adapté en protection momentanée.', AUTHORED],
    ['lost_planet_2_ex_nevec_defector', shot('Vital Suit — appui au canon'), 'L’Ex-NEVEC Defector est un avatar du catalogue ; l’action représente un Vital Suit et son armement commun, sans inventer de technique propre à un individu nommé.', AUTHORED]
  ]),
  ...group('Elfen Lied', 'Elfen Lied, Lucy dans la réinterprétation visuelle vêtue du projet', 'https://www.vap.co.jp/elfenlied/', '#bd929a', [
    ['elfen_lied_lucy', melee('Vecteurs de Lucy — interception', { shape: 'multi', maxTargets: 3, range: 200 }), 'Les vecteurs sont les bras télékinétiques des Diclonius, employés ici dans l’état Lucy ; Nyu n’est pas présentée comme une autre combattante. L’impact reste abstrait, sans gore ni dénudement.', TECHNIQUE]
  ]),
  ...group('A Nightmare on Elm Street', 'A Nightmare on Elm Street (1984) et Dream Warriors (1987), rôles distincts', 'https://www.warnerbros.com/movies/nightmare-elm-street', '#b8a2bc', [
    ['nightmare_elm_street_nancy_thompson', guard('Nancy — reprendre prise sur la peur'), 'Nancy comprend le rapport entre peur et emprise de Freddy, prépare sa survie et aide les rêveurs ; le bonus défensif adapte cette résistance, sans lui donner les pouvoirs de Freddy.'],
    ['nightmare_elm_street_kristen_parker', buff('Rêve partagé de Kristen'), 'Dans Dream Warriors, Kristen peut entraîner d’autres personnes dans son rêve ; la coordination du groupe adapte cette faculté, sans faisceau offensif inventé.', TECHNIQUE]
  ]),
  ...group('BRINK', 'BRINK (2011), classes de la Résistance et capacités partagées', 'https://bethesda.net/en/game/brink', '#a8c7c4', [
    ['brink_resistance_medic', heal('Seringue de soins du Medic'), 'Le Medic dispose de seringues et de soins dans les règles de classe de BRINK ; le soin de groupe est une adaptation de jeu de ce rôle, pas une personne canonique nommée.', AUTHORED],
    ['brink_resistance_engineer', buff('Amélioration d’arme de l’Engineer'), 'L’Engineer peut améliorer les armes alliées ; le multiplicateur abstrait reprend cette capacité de classe, sans tourelle magique ou pouvoir exclusif.', AUTHORED],
    ['brink_resistance_operative', buff('Piratage du poste de commande'), 'L’Operative est la classe d’infiltration et de piratage de BRINK ; l’information gagnée au poste de commande est traduite en appui de l’équipe.', AUTHORED]
  ]),
  ...group('Buckshot Roulette', 'Buckshot Roulette, trois rôles adultes d’observation du catalogue local', 'https://www.criticalreflex.com/buckshot_roulette', '#b3bca8', [
    ['buckshot_roulette_challenger_adult_20_closed_jacket', buff('Comptage des cartouches du Challenger'), 'Challenger est un rôle adulte créé pour les épreuves du pack ; il compte les cartouches annoncées. Le soutien est une adaptation de l’observation, sans identité ou pouvoir canonique inventé.', AUTHORED],
    ['buckshot_roulette_spotter_adult_20_utility_coat', buff('Loupe — lecture de la cartouche'), 'Le rôle local Spotter reprend l’usage de la loupe du jeu pour lire une cartouche ; cela procure une information tactique, sans tirer sur un civil.', AUTHORED],
    ['buckshot_roulette_technician_adult_20_coveralls', guard('Contrôle de sécurité de la table'), 'Technician est un rôle local d’épreuve et non un protagoniste attesté ; l’action est une précaution de mise en place, pas une capacité surnaturelle ni une nouvelle règle mortelle.', AUTHORED]
  ]),
  ...group('Crysis', 'Crysis (2007), première campagne de Lingshan uniquement', 'https://www.crytek.com/games/crysis', '#9ab8ad', [
    ['crysis_nomad', melee('Nanosuit — frappe en mode Force'), 'Dans le premier Crysis, Nomad dispose du mode Force de la Nanosuit ; la frappe renforcée reste une action physique de cette combinaison.', TECHNIQUE],
    ['crysis_prophet', guard('Prophet — extraction hors de la sphère'), 'Prophet commande l’équipe de la première campagne ; l’appui représente une sortie coordonnée de la zone gelée. Aucun arc de Crysis 3 ou pouvoir de sa version ultérieure n’est ajouté.'],
    ['crysis_psycho', guard('Nanosuit — tenue en mode Armure', { targetSide: 'self', shape: 'single' }), 'Psycho porte la Nanosuit de la première campagne ; le mode Armure est un système commun de la combinaison, pas une transformation propre au personnage.', TECHNIQUE]
  ]),
  ...group('Daikatana', 'Daikatana (2000), Hiro et ses compagnons de campagne', 'https://www.gog.com/en/game/daikatana', '#b8c5a3', [
    ['daikatana_hiro_miyamoto', melee('Taille de la Daikatana'), 'Hiro utilise l’épée Daikatana au fil des époques ; cette taille adapte l’arme réelle du jeu, sans inventer une téléportation offensive.', TECHNIQUE],
    ['daikatana_mikiko_ebihara', shot('Ion Blaster — couverture de Mikiko'), 'Mikiko accompagne Hiro et utilise l’arsenal disponible ; l’Ion Blaster appartient au premier épisode. Ce choix de charge équipée est une adaptation d’arsenal, pas une technique exclusive.', AUTHORED],
    ['daikatana_superfly_johnson', shot('Sidewinder — rafale de Superfly'), 'Superfly combat aux côtés de Hiro avec les armes du jeu ; le Sidewinder est choisi dans cet arsenal commun. Son attribution ici est un équipement adapté, pas un superpouvoir personnel.', AUTHORED]
  ]),
  ...group('Dead Rising', 'Anthologie Dead Rising 1, 2 et 3, chaque protagoniste garde son jeu', 'https://www.capcom.co.jp/ir/english/news/pdf/e101028d.pdf', '#c4b394', [
    ['dead_rising_frank_west', melee('Double Lariat de Frank'), 'Frank peut apprendre le Double Lariat dans le premier Dead Rising ; le mouvement de lutte est simplifié en frappe propre sans détail de blessure.', TECHNIQUE],
    ['dead_rising_chuck_greene', melee('Paddlesaw de Chuck'), 'Chuck fabrique la Paddlesaw dans Dead Rising 2 à partir des éléments de l’atelier ; ce super reprend une arme combinée du jeu, sans recette de construction réelle.', TECHNIQUE],
    ['dead_rising_nick_ramos', melee('Sledge Saw de Nick'), 'Nick utilise les armes combinées de Dead Rising 3, dont la Sledge Saw ; le coup est une adaptation de cet équipement, distinct du journalisme de Frank.', TECHNIQUE]
  ]),
  ...group('The Backrooms — Kane Pixels', 'Kane Pixels — Backrooms, chercheurs et rôles anonymes adaptés', 'https://www.youtube.com/watch?v=H4dGpz6cnHo', '#c8c194', [
    ['backrooms_kane_a_sync_researcher', buff('A-Sync — balisage du seuil'), 'Le Researcher représente les équipes de recherche A-Sync ; balises et observation guident le groupe. Aucun chercheur composite n’est promu en sorcier du Complexe.', AUTHORED],
    ['backrooms_kane_missing_cameraperson', guard('Cadrer une issue dans les Yellow Halls'), 'Le rôle de Cameraperson reprend la recherche d’une sortie par la personne qui filme ; le bonus est une fenêtre d’évasion, pas une arme de caméra.', AUTHORED],
    ['backrooms_kane_threshold_technician', guard('Sécurisation de la route du seuil'), 'Threshold Technician est un rôle d’épreuve du catalogue inspiré de l’installation scientifique ; sa procédure de repli est une adaptation de soutien, sans portail offensif.', AUTHORED]
  ]),
  ...group('E.Y.E: Divine Cybermancy', 'E.Y.E: Divine Cybermancy (2011), équipement Culter Dei et conseil du Mentor', 'https://eye.streumon-studio.com/press/press_kit.pdf', '#abb394', [
    ['eye_divine_culter_dei_operative', shot('HS 010 — tir du Culter Dei'), 'L’opératif anonyme utilise l’arsenal partagé d’E.Y.E ; le HS 010 est un pistolet du jeu. Le choix de charge équipée ne constitue pas une capacité exclusive de cet avatar.', AUTHORED],
    ['eye_divine_the_mentor', buff('Consigne tactique du Mentor'), 'Le Mentor conseille le protagoniste et oriente sa mission ; le bonus d’équipe adapte cette fonction de conseil, sans fabriquer une technique psychique nommée.'],
    ['eye_divine_dutch', shot('Bear Killer — appui de Dutch'), 'Dutch est un membre du cadre d’E.Y.E ; le Bear Killer est choisi dans l’arsenal du jeu pour un tir d’appui. Cette charge équipée est déclarée adaptée et non une technique personnelle attestée.', AUTHORED]
  ]),
  ...group('GTFO', 'GTFO — prisonniers du Complexe, équipements interchangeables', 'https://gtfothegame.com/prisoners', '#c7b18b', [
    ['gtfo_woods', shot('Rafale du fusil de Woods'), 'Le pack équipe Woods d’un fusil d’assaut ; ce tir reprend ce chargement, sans classe magique ou capacité unique inventée.'],
    ['gtfo_dauda', guard('C-Foam — consolidation de la porte'), 'Le C-Foam Launcher appartient aux outils sélectionnables de GTFO et peut renforcer une porte ; son équipement par Dauda est un choix de chargement adapté.', AUTHORED],
    ['gtfo_hackett', buff('Bio Tracker — annonce des contacts'), 'Hackett porte le Bio Tracker dans le pack ; son repérage transmet une information aux prisonniers. L’outil reste une charge interchangeable et non un pouvoir inné.']
  ]),
  ...group('Haydee — Safe Adaptation', 'Haydee — adaptation entièrement vêtue et configurations de parcours du projet', 'https://store.steampowered.com/app/530890/Haydee/', '#aac3bb', [
    ['haydee_safe_green_loadout', buff('Carte verte — ouverture de la route'), 'Green-Zone Loadout est une configuration de la même exploratrice dans l’adaptation sûre ; la lecture d’accès donne une route à l’équipe, sans pouvoir vert personnel.', AUTHORED],
    ['haydee_safe_red_loadout', buff('Inspection des accès de sécurité'), 'Red-Zone Loadout est une charge de parcours locale, pas une seconde personne canonique ; l’inspection des dispositifs de sécurité est un soutien d’exploration.', AUTHORED],
    ['haydee_safe_blue_loadout', guard('Préparation de l’issue Blue Zone'), 'Blue-Zone Loadout représente le repérage de l’itinéraire de sortie de la même exploratrice ; aucune aura de glace ou attaque associée à la couleur n’est inventée.', AUTHORED]
  ]),
  ...group('Tom Clancy’s Splinter Cell', 'Splinter Cell — Sam Fisher ; Blacklist — Isaac Briggs', 'https://www.ubisoft.com/en-us/company/about-us/our-brands/tom-clancy-s-splinter-cell', '#9fb9a7', [
    ['splinter_cell_sam_fisher', shot('SC-20K — tir contrôlé de Fisher'), 'Sam Fisher utilise le SC-20K dans les premières missions de Splinter Cell ; l’action est une salve contrôlée de cet équipement, sans pouvoir de vision offensif.'],
    ['splinter_cell_isaac_briggs', shot('Couverture de précision de Briggs'), 'Briggs est l’opératif allié de Blacklist et assure l’appui armé ; le tir de précision adapte ce rôle de coopération, sans lui attribuer une technique exclusive nommée.']
  ]),
  ...group('Killer Instinct', 'Killer Instinct (2013), continuité du reboot Xbox', 'https://www.xbox.com/en-US/games/store/killer-instinct/BP4S3XLJG78M/0001', '#bac6a5', [
    ['killer_instinct_jago_epee', shot('Endokuken de Jago'), 'Endokuken est le projectile d’énergie du répertoire de Jago ; la portée et les dégâts sont adaptés au moteur, pas reproduits à la frame près.', TECHNIQUE],
    ['killer_instinct_orchid_tonfas', melee('Ichi Ni San d’Orchid', { shape: 'multi', maxTargets: 3 }), 'Ichi Ni San est l’enchaînement de tonfas d’Orchid dans le reboot ; le moteur représente la série de coups par un impact groupé.', TECHNIQUE],
    ['killer_instinct_t_j_combo_boxe', melee('Powerline de T.J. Combo', { range: 195 }), 'Powerline appartient au répertoire de T.J. Combo ; l’avancée et le coup de poing sont adaptés à la distance du moteur.', TECHNIQUE]
  ]),
  ...group('Magicka', 'Magicka (2011), huit éléments partagés par les avatars de magiciens', 'https://www.paradoxinteractive.com/games/magicka/about', '#b7c5d9', [
    ['magicka_blue_wizard_foudre', beam('Élément Foudre — arc électrique'), 'Blue Wizard est un avatar de robe du catalogue ; la foudre est l’un des éléments partagés de Magicka. Cette charge élémentaire ne constitue pas une classe bleue exclusive.', AUTHORED],
    ['magicka_red_wizard_feu', projectile('Élément Feu — projection enflammée'), 'Red Wizard est un avatar du même système de sorts ; le feu appartient au répertoire partagé, avec une projection de zone adaptée au moteur.', AUTHORED],
    ['magicka_yellow_wizard_froid', area('Élément Froid — souffle glacé'), 'Yellow Wizard utilise l’élément Froid choisi pour ce chargement du catalogue ; la robe jaune n’est pas une preuve de pouvoir exclusif ou d’une biographie inventée.', AUTHORED]
  ]),
  ...group('Metal Slug', 'Metal Slug, arsenal de l’anthologie arcade SNK', 'https://www.snk-corp.co.jp/official/akeakaneogeo/metalslug/', '#c5b390', [
    ['metal_slug_marco_rossi', shot('Heavy Machine Gun de Marco', { shape: 'multi', maxTargets: 3 }), 'Marco peut ramasser la Heavy Machine Gun dans l’arsenal partagé ; la rafale adapte cette arme, pas une capacité unique inventée.'],
    ['metal_slug_tarma_roving', shot('SV-001 — appui au canon'), 'Tarma peut piloter le SV-001 Metal Slug comme les autres personnages ; le canon représente ce véhicule commun et non une nouvelle transformation personnelle.'],
    ['metal_slug_eri_kasamoto', projectile('Grenade d’Eri'), 'Eri utilise les grenades de l’arsenal Metal Slug ; ce lancer reprend un équipement du jeu sans prétendre reproduire les frames d’un épisode précis.']
  ]),
  ...group('Overgrowth', 'Overgrowth / Lugaru, anthologie explicitement mélangée dans le pack', 'https://www.wolfire.com/games/', '#b6bca3', [
    ['overgrowth_turner_lapin_brun', melee('Balayage de Turner'), 'Turner se bat par les arts martiaux physiques du jeu ; ce balayage est une description de l’action adaptée et non le nom d’une technique canonique vérifiée.'],
    ['overgrowth_sky_lapine_grise', guard('Sky — changement d’appui', { targetSide: 'self', shape: 'single' }), 'Sky est représentée par un rôle de personnage de l’anthologie ; le changement d’appui donne une esquive physique sans pouvoir lié à la couleur du pelage.', AUTHORED],
    ['overgrowth_sun_lapine_doree', guard('Sun — garde de protection', { targetSide: 'self', shape: 'single' }), 'Sun est un rôle de personnage du pack ; la garde est une adaptation du combat physique d’Overgrowth, sans technique exclusive ou pouvoir solaire déduit du nom.', AUTHORED]
  ]),
  ...group('Phantasmagoria', 'Phantasmagoria (1995), enquêtes et représentation illustrée du projet', 'https://www.gog.com/en/game/phantasmagoria', '#c4b6a8', [
    ['phantasmagoria_adrienne_delaney_illustree', cleanse('Livre de Carnovasch — bannissement'), 'Adrienne résout l’enquête et le rituel final à partir des objets du manoir ; le nettoyage d’altérations représente un bannissement abstrait, sans scène de violence ou reproduction FMV.'],
    ['phantasmagoria_harriet_illustree', buff('Indications de Harriet'), 'Harriet connaît le domaine et contribue à son exploration ; l’appui d’information ne lui attribue aucun sort ni pouvoir médical.'],
    ['phantasmagoria_malcolm_wyrmshadow_illustre', guard('Avertissement de Malcolm'), 'Le pack nomme la variante illustrée Malcolm Wyrmshadow ; l’action reprend la fonction de conseil de Malcolm et n’atteste ni un patronyme supplémentaire ni une technique magique personnelle.', AUTHORED]
  ]),
  ...group('Postal', 'POSTAL (1997), POSTAL 2: Apocalypse Weekend et POSTAL: Brain Damaged, variantes distinctes', 'https://gopostal.com/', '#b9a998', [
    ['postal_postal_dude_classic', shot('Fusil à pompe du Dude classique'), 'La version classique possède un fusil à pompe dans POSTAL ; la salve reste un usage d’équipement contre les cibles de jeu, sans acte visant une population réelle.'],
    ['postal_postal_dude_apocalypse_weekend', melee('Masse d’Apocalypse Weekend'), 'Apocalypse Weekend ajoute notamment la masse à l’arsenal du Dude ; le coup est stylisé sans gore ou détail de blessure.'],
    ['postal_postal_dude_brain_damaged', shot('Super Shotgun de Brain Damaged', { shape: 'area', areaRadius: 95, range: 330 }), 'La variante Brain Damaged emploie le Super Shotgun de son épisode ; sa salve rapprochée reste distincte du chargement du jeu de 1997.']
  ]),
  ...group('Halloween', 'Halloween (2018) et ses suites Kills / Ends, continuité du pack', 'https://www.universalpictures.com/movies/halloween', '#c2aa98', [
    ['halloween_2018_laurie_strode_survivante', guard('Laurie — mise à l’abri dans le refuge'), 'Laurie prépare un refuge et une issue pour sa famille ; le super traduit cette préparation en protection, sans donner un pouvoir surnaturel à une survivante civile.'],
    ['halloween_2018_karen_nelson_defense', guard('Karen — protection au sous-sol'), 'Karen participe à la défense et au repli familial dans la maison Strode ; la fenêtre défensive représente ce soutien, sans capacité du tueur empruntée.'],
    ['halloween_2018_allyson_nelson_evasion', guard('Allyson — issue de Haddonfield'), 'Allyson survit par la fuite et l’entraide ; ce super demeure une action d’évasion de soutien, sans attaque magique ou arme inventée.']
  ]),
  ...group('Remember Me', 'Remember Me (2013), rôles des Erroristes de Neo-Paris', 'https://store.steampowered.com/app/228300/Remember_Me/', '#b3cdd2', [
    ['remember_me_nilin_chasseuse_de_memoires', melee('Sensen Fury de Nilin', { shape: 'multi', maxTargets: 3 }), 'Sensen Fury est une capacité de combat de Nilin ; la rafale Pressen est simplifiée en séquence rapprochée, sans copier la durée ou les frames du jeu source.', TECHNIQUE],
    ['remember_me_edge_liaison_errorist', buff('Liaison des Erroristes'), 'Edge guide Nilin à distance ; le soutien de coordination ne lui invente pas un corps de combattant ou une arme personnelle.'],
    ['remember_me_bad_request_infiltration', guard('Itinéraire d’infiltration de Bad Request'), 'Bad Request est un allié mémoriste et infiltrateur ; le super représente son appui au parcours de Nilin, pas une technique de réécriture offensive nouvellement inventée.']
  ]),
  ...group('Wolfenstein', 'Continuité MachineGames — The New Order et résistance Kreisau', 'https://bethesda.net/en/game/wolfenstein', '#b8b19d', [
    ['wolfenstein_machinegames_b_j_blazkowicz', beam('Laserkraftwerk de Blazkowicz'), 'B.J. emploie le Laserkraftwerk dans The New Order ; le rayon est une adaptation de cette arme et non un pouvoir corporel.', TECHNIQUE],
    ['wolfenstein_machinegames_anya_oliwa', buff('Transmission de la résistance d’Anya'), 'Anya participe à la résistance et à ses communications ; l’appui de l’équipe ne lui attribue aucune arme ou force surnaturelle empruntée.'],
    ['wolfenstein_machinegames_set_roth', buff('Maintenance des équipements par Set Roth'), 'Set Roth est l’ingénieur et savant de la résistance lié aux technologies Da’at Yichud ; l’entretien améliore abstraitement l’équipement allié, sans soin magique.']
  ]),
  ...group('Serious Sam', 'Serious Sam, anthologie du pack ; Sam Stone et alliés explicitement adaptés', 'https://www.croteam.com/about2/', '#c4b18d', [
    ['serious_sam_sam_stone', projectile('Serious Cannon — boulet de Sam', { areaRadius: 135 }), 'Le canon portatif et ses boulets appartiennent à l’arsenal de Serious Sam ; la zone d’impact est simplifiée pour le moteur.', TECHNIQUE],
    ['serious_sam_hellfire', guard('Hellfire — coordination de l’extraction'), 'Hellfire est un rôle allié de l’anthologie du catalogue ; cette couverture d’extraction est une adaptation de soutien, sans prétendre attester une technique personnelle ou un armement exclusif.', AUTHORED],
    ['serious_sam_kenny', shot('Couverture au fusil de Kenny'), 'Kenny accompagne l’équipe de Serious Sam 4 ; ce tir adapte l’appui d’infanterie du personnage et ne transforme pas un arsenal partagé en superpouvoir personnel.']
  ]),
  ...group('Squirrel with a Gun', 'Squirrel with a Gun, trois chargements du même écureuil', 'https://squirrelwithagun.com/', '#c1b493', [
    ['squirrel_with_a_gun_squirrel_pistol_build', shot('Pistolet — tir avec recul'), 'Pistol Build est un chargement du même écureuil ; le pistolet et son recul appartiennent aux systèmes du jeu, sans inventer une autre identité.', AUTHORED],
    ['squirrel_with_a_gun_squirrel_smg_build', shot('SMG — rafale du chargement', { shape: 'multi', maxTargets: 3 }), 'SMG Build représente le chargement à mitraillette du même écureuil ; le tir en rafale est une adaptation d’arsenal.', AUTHORED],
    ['squirrel_with_a_gun_squirrel_shotgun_build', shot('Shotgun — salve rapprochée', { shape: 'area', range: 290, areaRadius: 90 }), 'Shotgun Build utilise le fusil à pompe du même écureuil ; sa dispersion et sa portée courte sont adaptées, pas une espèce ou un pouvoir supplémentaires.', AUTHORED]
  ]),
  ...group('The Ball', 'The Ball (2010), un archéologue et deux configurations du même dispositif', 'https://store.steampowered.com/app/35460/The_Ball/', '#baa88a', [
    ['the_ball_unnamed_archaeologist', buff('Ancient Glove — alignement du parcours'), 'L’archéologue anonyme dirige la sphère à l’aide du dispositif ancien ; l’action coordonne le parcours de puzzle, sans créer un combattant nommé ni infliger de dégâts.'],
    ['the_ball_ball_push_configuration', guard('Poussée de la sphère vers la dalle'), 'Ball Push Configuration est le mode de poussée du même dispositif, pas une autre personne ; le bénéfice défensif représente le temps gagné pour franchir une dalle.', AUTHORED],
    ['the_ball_ball_pull_configuration', guard('Rappel de la sphère au passage sûr'), 'Ball Pull Configuration représente le rappel de la même sphère dans les énigmes ; aucune attaque ou nouvelle identité n’est créée pour ce mode physique.', AUTHORED]
  ]),
  ...group('The Darkness', 'The Darkness et The Darkness II, anthologie des deux jeux', 'https://www.xbox.com/en-US/games/store/the-darkness/c035l0ns3sqn', '#a597ba', [
    ['the_darkness_jackie_estacado', area('Black Hole de Jackie'), 'Le Black Hole est un pouvoir de la Darkness utilisé par Jackie dans le premier jeu ; l’impact est présenté comme une distorsion abstraite sans gore.', TECHNIQUE],
    ['the_darkness_jenny_romano_soutien', guard('Souvenir de Jenny — garder le cap'), 'Jenny demeure un soutien civil de l’histoire de Jackie ; la protection traduit un ancrage affectif de gameplay, sans lui attribuer les pouvoirs de la Darkness.'],
    ['the_darkness_johnny_powell_soutien', buff('Lecture des reliques par Johnny Powell'), 'Johnny Powell est le conseiller érudit de The Darkness II ; sa connaissance des reliques et de la Brotherhood devient une information d’équipe, pas une attaque occultiste.']
  ]),
  ...group('Turok', 'Turok: Dinosaur Hunter — Tal’Set ; Turok 2: Seeds of Evil — Joshua Fireseed', 'https://www.nightdivestudios.com/turok', '#b8b08d', [
    ['turok_tal_set_turok', beam('Chronoscepter de Tal’Set'), 'Tal’Set assemble le Chronoscepter dans Dinosaur Hunter ; le tir reprend l’arme de cette première aventure, sans lui attribuer les équipements personnels des suites.', TECHNIQUE],
    ['turok_joshua_fireseed_turok', projectile('Tek Bow — flèche explosive de Joshua'), 'Joshua dispose du Tek Bow et des flèches explosives dans Seeds of Evil ; cet équipement de son jeu reste distinct du Chronoscepter de Tal’Set.']
  ]),
  ...group('Worms', 'Worms — arsenal Team17 partagé entre les vers du roster', 'https://www.team17.com/franchises/worms', '#c2baa0', [
    ['worms_boggy_b', projectile('Holy Hand Grenade de Boggy B'), 'Boggy B est un ver du roster utilisant les armes partagées de Worms ; la Holy Hand Grenade est un choix de chargement cartoon, pas une capacité individuelle innée.'],
    ['worms_spadge', projectile('Super Sheep de Spadge'), 'Super Sheep appartient à l’arsenal Worms ; son attribution à Spadge est un choix de chargement du ver, avec impact comique sans anatomie ni blessure détaillée.'],
    ['worms_clagnut', projectile('Bazooka de Clagnut'), 'Clagnut emploie ici le bazooka partagé de Worms ; le projectile et sa portée sont adaptés au moteur, sans technique exclusive inventée.']
  ]),
  ...group('Murder Drones', 'Murder Drones — continuité animée GLITCH', 'https://www.glitchprod.com/murder-drones', '#b6aacd', [
    ['murder_drones_uzi_doorman', { ...beam('Railgun d’Uzi'), color: '#5dff56' }, 'Uzi construit et utilise son railgun dans les premiers épisodes ; le rayon vert reprend cette arme et n’ajoute pas un pouvoir Solver à une autre identité.', TECHNIQUE],
    ['murder_drones_serial_designation_n', melee('N — interception aux lames'), 'N peut transformer ses mains en armes de Disassembly Drone ; cette interception utilise les lames, sans détail de démembrement ou de fluide.'],
    ['murder_drones_v', shot('V — rafale des armes intégrées', { shape: 'multi', maxTargets: 3 }), 'V possède les armes transformables des Disassembly Drones ; le tir adapté demeure une capacité mécanique de ce modèle.']
  ]),
  ...group('Marvel Zombies — MCU Animation', 'Marvel Studios Animation — Marvel Zombies, continuité du roster', 'https://www.marvel.com/tv-shows/animation/marvel-zombies/1', '#a7c5b4', [
    ['marvel_zombies_mcu_ms_marvel', guard('Ms. Marvel — construction de lumière solide'), 'Kamala Khan manifeste des constructions de lumière solide dans la continuité MCU adaptée ; le bouclier traduit cette faculté sans emprunter une attaque de zombie.', TECHNIQUE],
    ['marvel_zombies_mcu_kate_bishop', projectile('Kate Bishop — flèche explosive'), 'Kate est une archère équipée de flèches spéciales ; ce tir est un chargement de son arc adapté à l’évacuation, pas un pouvoir cosmique inédit.'],
    ['marvel_zombies_mcu_blade_knight', melee('Blade Knight — taille à la lame'), 'Blade Knight est le combattant à la lame du roster animé ; cette coupe reste physique, sans lui inventer une incantation nommée ou les pouvoirs personnels d’un autre Moon Knight.']
  ]),
  ...group('Invincible', 'Invincible — continuité de la série animée', 'https://www.skybound.com/invincible', '#b2bbce', [
    ['invincible_invincible', melee('Charge en vol d’Invincible', { range: 205 }), 'Mark combine le vol et la force viltrumite ; la charge est une description de cette action physique, sans ultime nommé artificiellement.'],
    ['invincible_atom_eve', guard('Barrière d’Atom Eve'), 'Atom Eve produit des barrières et constructions par manipulation de matière et d’énergie ; la protection reprend cette fonction sans faire disparaître ses limitations narratives.'],
    ['invincible_robot', shot('Robot — appui de l’armure télécommandée'), 'Robot commande des corps mécaniques armés à distance ; le tir vient de l’équipement de l’armure et non d’un pouvoir psychique prêté à Rudy.']
  ]),
  ...group('Oggy et les Cafards', 'Oggy et les Cafards — continuité cartoon Xilam', 'https://xilam.com/en/media/oggy-the-cockroaches/', '#a9c4bf', [
    ['oggy_cockroaches_oggy', cleanse('Oggy — remettre la cuisine en ordre'), 'Oggy cherche à préserver sa maison et sa tranquillité ; le rangement enlève abstraitement des perturbations de gameplay, sans soin magique ou dommage aux cafards.'],
    ['oggy_cockroaches_jack', guard('Jack — protéger la maison'), 'Jack aide Oggy face au chaos domestique ; ce soutien protège le groupe sans transformer un accessoire ménager en arme létale.'],
    ['oggy_cockroaches_olivia', buff('Olivia — accalmie au jardin'), 'Olivia privilégie les animaux et le jardin ; le soutien est une accalmie et un encouragement, sans pouvoir de guérison végétale inventé.']
  ]),
  ...group('Friday the 13th', 'Friday the 13th (1980) — Alice ; Jason Lives (1986) — Tommy', 'https://www.paramountpictures.com/movies/friday-the-13th', '#a8bab4', [
    ['friday_13th_alice_hardy', guard('Alice — mise à l’abri au canot'), 'Alice survit au camp et rejoint le canot ; la fenêtre de protection adapte son évasion, sans lui attribuer la résistance surnaturelle de Jason.'],
    ['friday_13th_tommy_jarvis', guard('Tommy — ancrage du piège du lac'), 'Dans Jason Lives, Tommy prépare l’ancrage qui retient Jason au fond du lac ; le bonus représente le temps gagné pour fuir et ne crée aucun nouveau danger de terrain.']
  ])
};
