// Explicit per-ID editorial records. Helpers below only encode combat rules;
// they never select a name, ability, universe or source from a genre or hash.
// Role adaptations are labeled separately from attested named techniques.
const action = (name, type, effect, shape, delivery, range, extra = {}) => ({
  name, type, dmg: effect === 'damage' ? 4.5 : 0,
  animationDuration: 1.1, hitAt: 0.45,
  targeting: { effect, targetSide: effect === 'damage' ? 'enemy' : 'ally', shape, delivery, range, ...extra }
});
const melee = (name, extra = {}) => action(name, 'melee', 'damage', 'single', 'melee', 170, extra);
const shot = (name, extra = {}) => action(name, 'bullet', 'damage', 'single', 'projectile', 720, extra);
const projectile = (name, type = 'projectile', extra = {}) => action(name, type, 'damage', 'area', 'projectile', 700, { areaRadius: 115, ...extra });
const beam = (name, extra = {}) => action(name, 'beam', 'damage', 'line', 'beam', 760, { lineWidth: 48, ...extra });
const area = (name, type, extra = {}) => action(name, type, 'damage', 'area', 'area', 570, { areaRadius: 140, ...extra });
const buff = (name, extra = {}) => action(name, 'buff', 'buff', 'group', 'support', 760, { buffMultiplier: 1.25, duration: 4, ...extra });
const guard = (name, extra = {}) => action(name, 'shield_aoe', 'guard', 'group', 'support', 760, { reduce: 0.45, duration: 4, ...extra });
const heal = (name, extra = {}) => action(name, 'heal_aoe', 'heal', 'group', 'support', 760, { healRatio: 0.32, duration: 3, ...extra });
const cleanse = (name, extra = {}) => action(name, 'cleanse', 'cleanse', 'group', 'support', 760, { cleanses: true, ...extra });
const selfBuff = name => buff(name, { targetSide: 'self', shape: 'single', buffMultiplier: 1.4 });
const TECHNIQUE = 'canonical-technique';
const ROLE = 'canonical-role';
const AUTHORED = 'authored-universe-canon';
const group = (universe, sourceWork, color, rows) => Object.fromEntries(rows.map(([id, special, sourceReference, identityBasis = ROLE]) => [id, {
  universe, sourceWork, sourceReference, identityBasis,
  canonicalVerified: false, networkVerified: false, gameplayAdapted: true,
  special: { ...special, color }
}]));

export const CAPABILITIES_LOT_1 = {
  ...group('Alien Resurrection', 'Alien Resurrection (1997)', '#84cdb6', [
    ['ripley8', melee('Force du clone 8'), 'Ripley 8 possède une force physique issue du clonage hybride ; frappe rapprochée adaptée, sans nouvelle attaque xénomorphe.'],
    ['call_resurrection', guard('Prise de contrôle des systèmes de l’Auriga'), 'Call, androïde Auton, se connecte aux systèmes de l’Auriga ; couverture électronique adaptée à son intervention.'],
    ['christie_resurrection', shot('Tir croisé aux deux pistolets', { shape: 'multi', maxTargets: 2 }), 'Christie utilise deux pistolets et des tirs à ricochet pendant la fuite de l’Auriga.']
  ]),
  ...group('Aliens vs Predator: Requiem', 'Aliens vs. Predator: Requiem (2007)', '#85a3b5', [
    ['wolf_avpr', projectile('Tir des canons plasma de Wolf', 'plasma_aoe'), 'Wolf emploie ses canons plasma d’épaule pour éliminer les xénomorphes ; projectile technologique.'],
    ['dallas_avpr', shot('Tir au canon plasma récupéré'), 'Dallas récupère le canon plasma portatif de Wolf ; son tir est un équipement de la fin du film.'],
    ['kelly_avpr', guard('Extraction en hélicoptère'), 'Kelly O’Brien, militaire, pilote l’hélicoptère de fuite avec les survivants ; extraction protectrice adaptée.']
  ]),
  ...group('Ash vs Evil Dead', 'Ash vs Evil Dead (2015–2018)', '#eb8a58', [
    ['ash_williams_aveds', melee('Charge à la tronçonneuse'), 'Ash utilise son bras-tronçonneuse contre les Deadites ; attaque physique rapprochée.'],
    ['pablo_bolivar_aveds', guard('Protection du Brujo Especial'), 'Pablo devient le Brujo Especial ; sa médiation spirituelle protège les Ghostbeaters, sans lui attribuer les armes d’Ash.'],
    ['kelly_maxwell_aveds', shot('Couverture armée des Ghostbeaters'), 'Kelly participe aux combats contre les Deadites avec des armes à feu ; tir de couverture adapté.']
  ]),
  ...group('Atarashii Gakko', 'ATARASHII GAKKO! — OTONABLUE ; avatars scéniques du catalogue Multiverse Breach', '#ff6d6d', [
    ['atarashii_unit', buff('OTONABLUE — chorégraphie collective'), 'Le groupe est représenté par une unité scénique du catalogue ; performance chorégraphiée de OTONABLUE, sans pouvoir offensif réel attribué aux artistes.', AUTHORED],
    ['school_dancer_ag', buff('OTONABLUE — pas synchronisés'), 'School Dancer est un rôle de scène du pack Atarashii Gakko ; synchronisation des danseurs en soutien.', AUTHORED],
    ['megaphone_ag', guard('Rappel de placement au mégaphone'), 'Megaphone Signal est l’opérateur scénique du catalogue ; consignes de placement, pas rayon sonore destructeur.', AUTHORED]
  ]),
  ...group('Atomic Heart', 'Atomic Heart (2023), exposition VDNH', '#9bd7df', [
    ['atomic_heart_tereshkova', buff('Guidage de l’hôtesse Tereshkova'), 'Tereshkova est une androïde d’accueil qui guide P-3 ; assistance de navigation adaptée, aucune capacité de combat inventée.']
  ]),
  ...group('Band-Maid', 'BAND-MAID — DOMINATION ; avatars scéniques du catalogue Multiverse Breach', '#e4e7f0', [
    ['bandmaid_avatar', buff('DOMINATION — entrée du groupe'), 'Maid Rocker représente la performance hard rock du groupe dans le pack ; le soutien est scénique, pas une attaque des musiciennes.', AUTHORED],
    ['guitar_maid', buff('DOMINATION — passage de guitare'), 'Guitar Maid est un avatar instrumental du catalogue ; passage de guitare en soutien collectif.', AUTHORED],
    ['drum_maid', guard('DOMINATION — maintien du tempo'), 'Drum Maid est le rôle de batterie du pack ; maintien du tempo pour coordonner le groupe.', AUTHORED]
  ]),
  ...group('Bella Poarch', 'Bella Poarch — Build a Bitch / INFERNO ; avatars du catalogue Multiverse Breach', '#ff9dba', [
    ['bella_poarch_avatar', buff('Build a Bitch — performance de Bella'), 'Bella Avatar est une persona scénique inspirée du clip Build a Bitch ; performance de soutien et non capacité surnaturelle de l’artiste.', AUTHORED],
    ['doll_guard_bella', guard('Atelier de poupées — mise à l’abri'), 'Doll Guard est un rôle créé dans le catalogue à partir du décor d’atelier de Build a Bitch ; protection logistique sans laser.', AUTHORED],
    ['inferno_dancer_bella', buff('INFERNO — séquence dansée'), 'Inferno Dancer est un avatar de chorégraphie du catalogue inspiré du clip INFERNO ; le titre du morceau ne devient pas un pouvoir de feu.', AUTHORED]
  ]),
  ...group('Bigflo & Oli', 'Bigflo & Oli — Dommage ; avatars du catalogue Multiverse Breach', '#ffd087', [
    ['bigflo_oli_unit', buff('Dommage — relais des deux voix'), 'L’unité représente le duo et son alternance vocale sur Dommage ; soutien de performance sans arme magique.', AUTHORED],
    ['toulouse_crowd', guard('Réponse du public toulousain'), 'Toulouse Crowd est le public allié du pack ; réponse collective et encouragement, sans attaque d’une foule réelle.', AUTHORED],
    ['verse_guard_bfo', buff('Relais du couplet'), 'Verse Guard est un rôle scénique original du catalogue ; soutien au passage de couplet du duo.', AUTHORED]
  ]),
  ...group('Blackpink', 'BLACKPINK — Pink Venom ; avatars du catalogue Multiverse Breach', '#ffa5d8', [
    ['blackpink_avatar', buff('Pink Venom — refrain collectif'), 'Blackpink Unit représente une performance du groupe, pas un combattant canonique ; le refrain encourage les alliés.', AUTHORED],
    ['pink_venom_dancer', buff('Pink Venom — pas du refrain'), 'Pink Venom Dancer est un avatar de danse du pack ; la référence au morceau ne produit aucun poison.', AUTHORED],
    ['blink_guard', guard('Soutien des BLINKs'), 'Blink Guard est un rôle de public allié du catalogue ; encouragement et protection abstraite de gameplay.', AUTHORED]
  ]),
  ...group('Boruto: Two Blue Vortex', 'Boruto: Two Blue Vortex (manga)', '#91c7ff', [
    ['boruto_tbv', melee('Rasengan Uzuhiko'), 'Boruto emploie Rasengan Uzuhiko, utilisant la rotation planétaire ; l’effet durable de vertige est simplifié en impact de jeu.', TECHNIQUE],
    ['sarada_tbv', melee('Chidori de Sarada'), 'Sarada maîtrise le Chidori avant Two Blue Vortex et demeure une combattante Uchiha ; pas de pouvoir de Mangekyō inventé.', TECHNIQUE],
    ['kawaki_tbv', projectile('Daikokuten — chute des cubes', 'projectile_aoe'), 'Kawaki stocke puis fait apparaître les cubes associés à Daikokuten ; impact de zone adapté à cette capacité.', TECHNIQUE]
  ]),
  ...group('Cells at Work!', 'Cells at Work! (manga / anime), rôles cellulaires', '#ffb4b7', [
    ['red_blood_cell', buff('Livraison d’oxygène d’AE3803'), 'AE3803 transporte oxygène et nutriments ; soutien de transport, sans attaque ni pouvoir immunitaire.'],
    ['white_blood_cell', melee('Lame du neutrophile U-1146'), 'U-1146 combat les bactéries à l’arme blanche dans la représentation anthropomorphe de la série.'],
    ['platelet_cells', guard('Formation du caillot'), 'Les plaquettes ferment les lésions par coagulation ; protection du groupe, sans leur attribuer un rôle de soldat.'],
    ['red_blood_cell_courier_ae3803', buff('Acheminement des nutriments'), 'Variante coursière AE3803 du catalogue : elle poursuit le transport des nutriments, conformément au rôle du globule rouge.'],
    ['white_blood_cell_long_hair', melee('Interception bactérienne du défenseur'), 'Variante à cheveux longs du leucocyte du catalogue ; interception physique issue du rôle immunitaire, pas une technique nommée attestée.', AUTHORED],
    ['white_blood_cell_short_hair', guard('Périmètre immunitaire du défenseur'), 'Variante à cheveux courts du catalogue : couverture des cellules civiles par un leucocyte, soutien défensif adapté.', AUTHORED],
    ['neutrophil_u1146_combat', melee('Assaut antibactérien d’U-1146'), 'Variante de combat U-1146 : l’élimination rapprochée des bactéries reprend son rôle de neutrophile.'],
    ['platelet_squad_leader', guard('Coordination du chantier de coagulation'), 'La cheffe des plaquettes coordonne la réparation des lésions ; protection par travail collectif.'],
    ['macrophage_cleaner', cleanse('Nettoyage des débris cellulaires'), 'Les macrophages éliminent les débris et agents pathogènes ; purification de gameplay adaptée à la fonction phagocytaire.']
  ]),
  ...group('Chappie', 'Chappie (2015)', '#a9c7df', [
    ['chappie_ai', melee('Intervention du robot policier'), 'Chappie est un robot de police doté d’un corps mécanique ; intervention physique, pas pouvoir énergétique.'],
    ['deon_chappie', guard('Diagnostic et sécurisation de Deon'), 'Deon crée la conscience de Chappie et intervient sur sa programmation ; le diagnostic organise une protection de l’équipe, sans restaurer les blessures biologiques des alliés.'],
    ['yolandi_chappie', buff('Encouragement de Yolandi'), 'Yolandi protège Chappie et lui sert de figure maternelle ; soutien moral plutôt qu’attaque surnaturelle.']
  ]),
  ...group('Charmed', 'Charmed (1998–2006)', '#d0b6ff', [
    ['prue_halliwell', projectile('Projection télékinétique de Prue'), 'Prue déplace et projette les objets par télékinésie ; projection de matière, pas emprunt aux pouvoirs de Piper.'],
    ['piper_halliwell', area('Combustion moléculaire', 'explosive_aoe'), 'Piper acquiert la combustion moléculaire, distincte de son pouvoir d’immobilisation.', TECHNIQUE],
    ['phoebe_halliwell', melee('Coup de pied en lévitation'), 'Phoebe associe arts martiaux et lévitation ; attaque rapprochée adaptée sans projectile magique inventé.'],
    ['prue_charmed', guard('Interception télékinétique de Prue'), 'Seconde entrée Prue du catalogue : sa télékinésie détourne les objets menaçants ; défense adaptée de son propre pouvoir.'],
    ['paige_charmed', guard('Mise à l’abri par téléportation orbing'), 'Paige, mi-sorcière mi-être de lumière, emploie l’orbing ; transfert protecteur adapté.'],
    ['leo_charmed', heal('Soin d’être de lumière', { excludeSelf: true }), 'Leo guérit les blessures des autres grâce au pouvoir de soin des êtres de lumière ; il ne se soigne pas lui-même.']
  ]),
  ...group('Commando', 'Commando (1985)', '#d5bf85', [
    ['john_matrix_commando', projectile('Tir au lance-roquettes de Matrix', 'rocket'), 'John Matrix emploie un lance-roquettes pendant l’assaut contre le domaine d’Arius ; arme conventionnelle.'],
    ['cindy_commando', projectile('M202 de Cindy', 'rocket'), 'Cindy utilise le lance-roquettes M202 lors de l’évasion de Matrix ; tir explosif adapté.'],
    ['general_kirby_commando', guard('Extraction ordonnée par Kirby'), 'Kirby intervient avec des militaires et propose une extraction à la fin du film ; coordination de soutien.']
  ]),
  ...group('Croc', 'Croc: Legend of the Gobbos (1997) ; canonRosterWavePartD.js', '#b7ed86', [
    ['croc_hero', melee('Tourbillon de la queue de Croc'), 'Croc frappe les Dantinis avec sa queue ; action jouable du premier jeu, sans pouvoir de Croc 2 ajouté.', TECHNIQUE],
    ['gobbo_chief', buff('Ralliement des Gobbos libérés'), 'Gobbo Chief est le rôle de chef du pack historique ; les Gobbos sauvés soutiennent Croc, sans arme ni pouvoir offensif inventé.', AUTHORED],
    ['beany_bird', guard('Trajet sécurisé des Beany Gongs'), 'Le pack canon précise que Beany transporte Croc entre les îles et ne combat pas ; appel protecteur de transport uniquement.']
  ]),
  ...group('Daft Punk', 'Daft Punk — One More Time ; Interstella 5555 (2003)', '#bee4ff', [
    ['thomas_bangalter', buff('One More Time — séquence électronique'), 'Performance du musicien et persona robot de scène ; soutien musical, sans transformer Thomas Bangalter en robot armé.'],
    ['guy_manuel', guard('One More Time — maintien du mix'), 'Performance de Guy-Manuel de Homem-Christo dans le duo ; coordination du mix, aucun laser attribué à l’artiste.'],
    ['stella_interstella', buff('Basse de Stella — One More Time'), 'Stella est la bassiste des Crescendolls dans Interstella 5555 ; soutien musical de sa propre fonction.']
  ]),
  ...group("Dante's Inferno", "Dante’s Inferno (2010)", '#eee0a4', [
    ['dantes_inferno_beatrice', guard('Intercession de Beatrice'), 'Beatrice est l’âme poursuivie par Dante et associée à son salut ; intercession de soutien, aucune faux ou croisade physique ajoutée.'],
    ['dantes_inferno_virgil', buff('Conseil de Virgile'), 'Virgile guide Dante à travers les cercles et explique les lieux ; renseignement de soutien, sans attaque d’un personnage guide.']
  ]),
  ...group('Deadman Wonderland', 'Deadman Wonderland (manga / anime)', '#ed99ad', [
    ['ganta_igarashi', projectile('Ganta Gun', 'projectile'), 'Ganta projette son sang sous forme de balle grâce au Branch of Sin ; portée et dégâts adaptés.', TECHNIQUE],
    ['shiro_deadman', area('Branch of Sin de Wretched Egg', 'energy_aoe'), 'Shiro est Wretched Egg et possède le Branch of Sin ; explosion de force adaptée, sans attribuer cette puissance à un autre Deadman.'],
    ['senji_kiyomasa', melee('Crow Claw'), 'Senji façonne son sang en lames sur les avant-bras avec Crow Claw ; corps à corps, pas tir générique.', TECHNIQUE]
  ]),
  ...group('Deponia', 'Deponia (2012) et trilogie', '#dcb789', [
    ['deponia_rufus', buff('Bricolage de Rufus'), 'Rufus assemble des solutions improvisées dans les énigmes de Deponia ; avantage tactique adapté, pas un canon énergétique.'],
    ['deponia_goal', guard('Mise en sécurité de Goal'), 'Goal porte les données et devient une cible de l’Organon ; son soutien préserve l’accès aux informations sans attaque inventée.'],
    ['deponia_bozo', guard('Extraction sur le bateau de Bozo'), 'Bozo est le capitaine qui transporte Rufus et Goal ; extraction protectrice de groupe.']
  ]),
  ...group('Digimon', 'Digimon Adventure (1999)', '#b7e8ff', [
    ['sora_biyomon', projectile('Spiral Twister de Biyomon', 'fire'), 'Le partenaire Biyomon de Sora utilise Spiral Twister ; aucune évolution supérieure n’est imposée au sprite de base.', TECHNIQUE],
    ['mimi_palmon', melee('Poison Ivy de Palmon', { range: 230 }), 'Palmon allonge les lianes de ses griffes avec Poison Ivy ; capacité du partenaire de Mimi.', TECHNIQUE],
    ['joe_gomamon', projectile('Marching Fishes de Gomamon', 'water'), 'Gomamon appelle les poissons dans Marching Fishes ; capacité du partenaire de Joe.', TECHNIQUE],
    ['kari_gatomon', melee('Lightning Paw de Gatomon'), 'Gatomon combat avec Lightning Paw ; technique de la forme partenaire de Kari, sans transformation imposée.', TECHNIQUE],
    ['tk_patamon', projectile('Boom Bubble de Patamon', 'projectile'), 'Patamon lance un projectile d’air par Boom Bubble ; capacité propre de la forme de base.', TECHNIQUE]
  ]),
  ...group('Digital Circus', 'The Amazing Digital Circus (2023–), personnages de la série', '#f2b6d6', [
    ['ragatha', buff('Réconfort de Ragatha'), 'Ragatha aide Pomni et cherche à rassurer les autres ; soutien moral, pas magie de poupée ajoutée.'],
    ['kinger', guard('Repère dans l’obscurité'), 'Kinger retrouve de la lucidité dans l’obscurité et protège Pomni dans l’épisode 3 ; soutien protecteur adapté.'],
    ['gangle', buff('Reprise de confiance de Gangle'), 'Gangle est caractérisée par ses masques et son état émotionnel ; soutien adapté de confiance sans contrôle mental inventé.'],
    ['zooble', guard('Mise à distance de Zooble'), 'Zooble exprime ses limites et refuse des situations imposées ; défense de repli adaptée, sans armes issues des pièces de son corps.']
  ]),
  ...group('Discipline: The Record of a Crusade', 'Multiverse Breach — adaptation documentaire de Saint Arcadia, canonRosterWavePartE.js', '#c8d5e4', [
    ['discipline_takurou_hayami', buff('Carte complète des pièces du dossier'), 'Le pack impose une enquête sans affrontement : Takurou recoupe les registres et reconstitue les preuves ; aucun pouvoir offensif.', AUTHORED],
    ['discipline_saori_otokawa', guard('Témoignage corroboré de Saori'), 'Le pack fait de Saori une témoin et enquêtrice : confrontation des horaires et témoignage documenté, sans agression.', AUTHORED],
    ['discipline_ruri_nonomiya', cleanse('Restauration de la piste d’audit'), 'Le pack confie à Ruri la restauration de traces administratives ; purification de jeu signifie rétablissement des données.', AUTHORED]
  ]),
  ...group('Earthworm Jim', 'Earthworm Jim (1994)', '#ffce8b', [
    ['earthworm_jim', melee('Fouet du ver Jim', { range: 205 }), 'Jim retire son corps de ver de la combinaison et l’utilise comme fouet ; attaque jouable du premier jeu.', TECHNIQUE],
    ['peter_puppy', selfBuff('Métamorphose de Peter Puppy'), 'Peter se transforme en créature féroce lorsqu’il est blessé ou effrayé ; renforcement adapté de cette transformation.'],
    ['princess_whats_her_name', buff('Signal de la princesse secourue'), 'La princesse est l’objectif du sauvetage et ne possède pas de super offensif attesté ; encouragement de rôle, pas aptitude guerrière inventée.']
  ]),
  ...group('Elfen Lied', 'Elfen Lied (manga / anime)', '#e6b4d1', [
    ['elfen_lied_kouta', heal('Refuge de la maison Kaede'), 'Kouta accueille les personnes blessées à la maison Kaede ; soutien de refuge adapté, sans vecteurs de Diclonius.'],
    ['elfen_lied_nana', guard('Interception par les vecteurs de Nana'), 'Nana utilise ses vecteurs invisibles et cherche à protéger les autres ; interception défensive de son propre pouvoir.']
  ]),
  ...group('Evil Dead', 'Evil Dead II (1987) ; Army of Darkness (1992)', '#e8ad82', [
    ['ash_williams', shot('Boomstick d’Ash'), 'Ash emploie son fusil à canon scié, dit boomstick ; tir physique, pas invocation de Deadites.', TECHNIQUE],
    ['annie_knowby', cleanse('Lecture des pages de Knowby'), 'Annie traduit et lit les passages du Necronomicon pour contrer le mal dans Evil Dead II ; soutien de dissipation adapté.'],
    ['henry_red_ed', melee('Charge d’Henry le Rouge'), 'Henry le Rouge dirige ses hommes et participe à la bataille finale d’Army of Darkness ; attaque rapprochée de guerrier.']
  ]),
  ...group('Exit 8', 'The Exit 8 (2023) ; rôles de parcours du catalogue Multiverse Breach', '#e7e8c2', [
    ['commuter_exit8', guard('Demi-tour à l’anomalie'), 'Le protagoniste doit revenir sur ses pas quand une anomalie apparaît ; protection par la règle réelle du parcours.', ROLE],
    ['sign_watcher_exit8', buff('Vérification du panneau de sortie'), 'Sign Watcher est un rôle du catalogue chargé de lire les indications du couloir ; observation en soutien, sans attaque.', AUTHORED],
    ['corridor_runner_exit8', guard('Retour au couloir sûr'), 'Corridor Runner est un rôle de déplacement du pack ; repli coordonné selon la règle des anomalies, pas combat contre un passant.', AUTHORED]
  ]),
  ...group('Flashback', 'Flashback: The Quest for Identity (1992)', '#a8d4de', [
    ['conrad_flashback', shot('Pistolet de Conrad'), 'Conrad B. Hart emploie son pistolet pour combattre les mutants et agents ; arme du jeu original.'],
    ['ian_flashback', buff('Restauration de mémoire par Ian'), 'Ian est le contact scientifique qui aide Conrad à retrouver sa mémoire ; soutien informationnel sans pouvoir offensif.'],
    ['agent_flashback', guard('Couverture de la résistance'), 'Resistance Agent est un rôle d’allié du pack Flashback ; couverture et extraction adaptées au conflit contre les Morphs.', AUTHORED]
  ]),
  ...group('Fullmetal Alchemist', 'Fullmetal Alchemist (manga) / Brotherhood (2009)', '#e9d5a6', [
    ['edward_elric', melee('Lame transmutée d’Edward'), 'Edward transforme son automail en lame grâce à l’alchimie ; frappe rapprochée, sans pierre philosophale attribuée.'],
    ['alphonse_elric', guard('Rempart transmuté d’Alphonse'), 'Alphonse construit des protections par alchimie et protège ses compagnons ; défense de matière, pas soin de l’âme inventé.'],
    ['roy_mustang', area('Alchimie de flamme de Mustang', 'fire_aoe'), 'Mustang provoque des combustions par ses gants et l’alchimie de flamme ; ignition de zone adaptée.']
  ]),
  ...group('Ghostbusters', 'Ghostbusters (1984)', '#a1eacb', [
    ['venkman_gb', beam('Effluve protonique de Venkman'), 'Venkman utilise le proton pack pour contenir les fantômes ; faisceau technologique de son équipement.'],
    ['stantz_gb', guard('Mise en place du piège à fantôme'), 'Ray manipule le piège associé aux faisceaux de confinement ; couverture défensive adaptée de la capture.'],
    ['zeddemore_gb', beam('Effluve de couverture de Winston'), 'Winston emploie le proton pack avec l’équipe ; tir continu de couverture, pas pouvoir spectral.'],
    ['spengler_gb', buff('Lecture du PKE Meter'), 'Egon utilise le PKE Meter pour identifier l’activité paranormale ; renseignement collectif, pas attaque de magie.']
  ]),
  ...group('Gorillaz', 'Gorillaz — Feel Good Inc. (2005)', '#b5dbb2', [
    ['2d_gorillaz', buff('Feel Good Inc. — voix de 2-D'), '2-D est le chanteur et claviériste du groupe virtuel ; performance musicale en soutien.'],
    ['noodle_gorillaz', buff('Feel Good Inc. — guitare de Noodle'), 'Noodle est la guitariste ; le passage de guitare soutient l’équipe sans lui attribuer une onde meurtrière.'],
    ['russel_gorillaz', guard('Feel Good Inc. — pulsation de Russel'), 'Russel est le batteur de Gorillaz ; coordination rythmique adaptée plutôt qu’invocation d’un autre personnage.']
  ]),
  ...group('Guns N Roses', 'Guns N’ Roses — Welcome to the Jungle ; avatars du catalogue Multiverse Breach', '#f0cf86', [
    ['gnr_frontman', buff('Welcome to the Jungle — entrée vocale'), 'Rose Stage Avatar est une persona scénique du pack inspirée du frontman ; performance vocale sans pouvoir attribué au musicien.', AUTHORED],
    ['slash_avatar', buff('Welcome to the Jungle — solo de guitare'), 'Top Hat Guitarist est un avatar instrumental du catalogue ; solo de guitare et non lame ou rayon.', AUTHORED],
    ['jungle_drummer_gnr', guard('Welcome to the Jungle — battement du groupe'), 'Jungle Drummer est le batteur scénique du pack ; maintien de la cohésion rythmique.', AUTHORED]
  ]),
  ...group('Heart of Darkness', 'Heart of Darkness (1998) ; profils de sauvetage du catalogue', '#bee5a4', [
    ['heart_of_darkness_whisky_rescue', guard('Parcours de sauvetage de Whisky'), 'Whisky est le chien à sauver ; ce profil balise son trajet de secours, sans arme ni pouvoir de ténèbres.'],
    ['heart_of_darkness_amigo_evacuation', guard('Évacuation guidée par Amigo'), 'Amigo est une créature alliée rencontrée par Andy ; le profil du catalogue conserve son rôle d’aide à l’évacuation.']
  ]),
  ...group('Hell House LLC', 'Hell House LLC (2015)', '#c9b9a5', [
    ['alex_hellhouse', buff('Plan d’évacuation de l’Abaddon'), 'Alex Taylor organise l’attraction hantée ; organisation des déplacements adaptée à son rôle, pas maîtrise des apparitions.'],
    ['sara_hellhouse', guard('Regroupement de Sara'), 'Sara Havel fait partie de l’équipe menacée à l’Abaddon ; repli protecteur adapté sans pouvoirs occultes.'],
    ['paul_hellhouse', buff('Repérage à la caméra de Paul'), 'Paul documente les manifestations avec sa caméra ; observation et renseignement, pas un faisceau offensif.']
  ]),
  ...group('HITMAN — World of Assassination', 'HITMAN — World of Assassination', '#c8d4e0', [
    ['hitman_woa_diana_burnwood', buff('Briefing opérationnel de Diana'), 'Diana Burnwood est la responsable de liaison d’Agent 47 ; analyse et consignes, sans lui transférer les capacités physiques de 47.']
  ]),
  ...group('House of 1000 Corpses', 'House of 1000 Corpses (2003)', '#ddaa8e', [
    ['baby_firefly', melee('Couteau de Baby Firefly'), 'Baby participe aux agressions de la famille Firefly avec des armes conventionnelles ; aucune capacité surnaturelle.'],
    ['otis_driftwood', shot('Arme à feu d’Otis'), 'Otis menace et attaque les victimes avec des armes à feu ; tir conventionnel adapté, sans rituel magique ajouté.'],
    ['captain_spaulding', shot('Fusil de la station-service'), 'Spaulding emploie une arme à feu lors du braquage de sa station-service ; source concrète du tir.']
  ]),
  ...group('Inside Out', 'Inside Out (2015)', '#ffe6a4', [
    ['joy_insideout', buff('Rappel d’un souvenir heureux'), 'Joy coordonne les souvenirs positifs de Riley ; soutien émotionnel adapté, pas contrôle d’un esprit adverse.'],
    ['sadness_insideout', heal('Réconfort par l’empathie de Sadness'), 'Sadness console Bing Bong en reconnaissant sa peine ; récupération de gameplay fondée sur cette fonction émotionnelle.'],
    ['anger_insideout', buff('Mobilisation d’Anger'), 'Anger exprime frustration et détermination au quartier général ; stimulation collective, pas attaque de feu contre un personnage.']
  ]),
  ...group('Italian Brainrot', 'Multiverse Breach — adaptation des figures de mèmes Italian Brainrot', '#e9c2a4', [
    ['italian_brainrot_tralalero_tralala', selfBuff('Course en baskets de Tralalero'), 'Le personnage du mème est un requin à trois jambes portant des baskets ; mobilité adaptée, aucun pouvoir supplémentaire déduit du mème.', AUTHORED],
    ['italian_brainrot_ballerina_cappuccina', buff('Pirouette de Ballerina Cappuccina'), 'La figure du mème est une ballerine à tête de tasse ; mouvement dansé de soutien, sans magie de café inventée.', AUTHORED],
    ['italian_brainrot_lirili_larila', guard('Pas mesurés de Lirilì Larilà'), 'La figure combine éléphant, cactus et sandales ; repli adapté à sa silhouette, sans capacité de manipulation du temps inventée.', AUTHORED]
  ]),
  ...group('Kazaam', 'Kazaam (1996)', '#dfc89c', [
    ['kazaam_genie', guard('Vœu protecteur de Kazaam'), 'Kazaam est un génie lié à Max ; réalisation de vœu adaptée en protection, sans transfert de magie au garçon.'],
    ['max_kazaam', buff('Demande de vœu de Max'), 'Max est l’enfant qui découvre le génie ; son action consiste à formuler un vœu, pas à lancer lui-même un sort.'],
    ['malik_kazaam', guard('Diversion dans l’affaire des enregistrements'), 'Malik est un personnage humain du pack Kazaam ; rôle de diversion adapté au conflit autour de la musique, sans pouvoir de génie attribué.']
  ]),
  ...group('Kung Pow', 'Kung Pow! Enter the Fist (2002)', '#f4d7a5', [
    ['chosen_one_kungpow', melee('Kung-fu de l’Élu'), 'L’Élu combat au corps à corps dans la parodie de kung-fu ; enchaînement martial adapté sans nouvelle technique certifiée.'],
    ['woah_kungpow', buff('Conseil de Maître Tang'), 'Maître Tang entraîne et guide l’Élu ; soutien d’instructeur plutôt que rayon magique.'],
    ['ling_kungpow', buff('Encouragement de Ling'), 'Ling est l’alliée attachée à l’Élu ; encouragement de rôle, sans capacité surnaturelle inventée.']
  ]),
  ...group('Lady Gaga', 'Lady Gaga — Chromatica / Rain on Me ; avatars du catalogue Multiverse Breach', '#eeaedb', [
    ['gaga_avatar', buff('Rain on Me — performance collective'), 'Gaga Avatar est une persona scénique du catalogue ; la performance ne confère aucun contrôle de la météo à l’artiste.', AUTHORED],
    ['little_monster_guard', guard('Soutien des Little Monsters'), 'Little Monster Guard représente le public allié du pack ; cohésion de concert, pas créature invoquée.', AUTHORED],
    ['chromatica_dancer', buff('Chromatica — danse d’ensemble'), 'Chromatica Dancer est un rôle chorégraphique du catalogue ; synchronisation scénique en soutien.', AUTHORED]
  ]),
  ...group('Le Cinquième Element', 'Le Cinquième Élément / The Fifth Element (1997)', '#e5c596', [
    ['zorg', projectile('Tir de roquette du ZF-1', 'rocket'), 'Zorg présente le ZF-1 et son armement intégré ; le tir vient d’un mode réel de cette arme, sans pouvoirs de Leeloo.'],
    ['cornelius', buff('Interprétation des pierres par Cornelius'), 'Le prêtre Cornelius connaît le rituel des pierres et guide les protagonistes ; renseignement de soutien, pas rayon du cinquième élément.'],
    ['munro_fifth', guard('Coordination de l’extraction militaire'), 'Le général Munro dirige la mission autour de Korben Dallas ; coordination défensive adaptée à son rôle de commandement.']
  ]),
  ...group('Left 4 Dead', 'Left 4 Dead (2008) / Left 4 Dead 2 (2009)', '#b8d393', [
    ['zoey_l4d', shot('Tir de précision de Zoey'), 'Zoey est une survivante du premier jeu et peut manier le fusil de chasse ; tir conventionnel, pas pouvoir contre les infectés.'],
    ['bill_l4d', guard('Couverture du vétéran Bill'), 'Bill protège le groupe et prend des risques pour l’extraction ; couverture adaptée à son expérience militaire.'],
    ['ellis_l4d', buff('Remise en route par Ellis'), 'Ellis est mécanicien et survivant du second jeu ; intervention sur l’équipement et encouragement, pas aptitude électronique surnaturelle.'],
    ['coach_l4d', buff('Consignes de Coach'), 'Coach est un ancien entraîneur qui rassemble les survivants ; leadership de soutien.'],
    ['rochelle_l4d', guard('Repérage du trajet d’extraction'), 'Rochelle est une survivante et journaliste de terrain ; observation du trajet et repli collectif adaptés à son rôle.'],
    ['nick_l4d', shot('Double pistolet de Nick'), 'Nick est un survivant humain utilisant l’arsenal accessible du second jeu ; choix d’équipement de deux pistolets, pas capacité innée.']
  ]),
  ...group('Les Tuche', 'Les Tuche (2011) ; famille Tuche', '#e6d4ac', [
    ['jeff_tuche', buff('Ralliement familial de Jeff'), 'Jeff est le père de famille de la comédie ; encouragement collectif adapté, aucune technique offensive ou pouvoir.'],
    ['cathy_tuche', heal('Réconfort de Cathy'), 'Cathy soutient sa famille dans les bouleversements de leur vie ; récupération abstraite de soutien, pas soin magique.'],
    ['coincoin_tuche', buff('Solution préparée par Coin-Coin'), 'Donald, dit Coin-Coin, est le fils studieux de la famille ; réflexion et préparation en soutien.']
  ]),
  ...group('Lil Nas X', 'Lil Nas X — MONTERO / STAR WALKIN’ / Rodeo ; avatars Multiverse Breach', '#c8b3ff', [
    ['lilnasx_avatar', buff('MONTERO — performance vocale'), 'Montero Avatar est une persona de scène du catalogue ; performance issue du morceau, sans pouvoir démoniaque attribué à l’artiste.', AUTHORED],
    ['star_walkin_echo', buff('STAR WALKIN’ — reprise du refrain'), 'Star Walkin Echo est un avatar de performance du pack ; soutien vocal, sans attaque stellaire.', AUTHORED],
    ['rodeo_guard', guard('Rodeo — coordination de scène'), 'Rodeo Guard est un rôle scénique créé dans le catalogue ; régie et placement en protection du groupe.', AUTHORED]
  ]),
  ...group('M3GAN', 'M3GAN (2022)', '#c5dfea', [
    ['gemma_m3gan', buff('Diagnostic de la roboticienne Gemma'), 'Gemma conçoit M3GAN et le prototype Bruce ; diagnostic technique, sans pouvoir transféré depuis l’androïde.'],
    ['cady_m3gan', guard('Pilotage protecteur du prototype Bruce'), 'Lors de l’affrontement final, Cady pilote Bruce à l’aide de ses commandes ; soutien de télécommande sans attribuer à l’enfant la force mécanique du robot.'],
    ['bruce_robot', melee('Force mécanique de Bruce'), 'Bruce est le grand prototype télécommandé utilisé contre M3GAN dans le final ; frappe mécanique rapprochée.']
  ]),
  ...group('Man with a Mission', 'MAN WITH A MISSION — Raise your flag ; avatars de scène Multiverse Breach', '#d9dedf', [
    ['mwam_avatar', buff('Raise your flag — appel vocal'), 'Wolfhead Vocalist est une persona scénique du catalogue inspirée des masques de loup du groupe ; aucune transformation animale réelle.', AUTHORED],
    ['dj_santa_monica', buff('Raise your flag — relais aux platines'), 'DJ Santa Monica est le rôle de DJ du groupe ; performance et coordination du mix, pas piratage magique.'],
    ['rock_commando_mwam', guard('Raise your flag — placement du collectif'), 'Rock Commando est un rôle de scène du pack, malgré son nom militaire ; protection logistique et non opération armée attribuée aux artistes.', AUTHORED]
  ]),
  ...group('Mass Effect', 'Mass Effect (2007) / Mass Effect 2 (2010)', '#b3cdef', [
    ['tali', area('Drone de combat de Tali', 'gadget_aoe'), 'Tali’Zorah peut déployer Combat Drone ; appareil technique dont l’impact est condensé pour le moteur.', TECHNIQUE],
    ['wrex', guard('Barrière biotique de Wrex'), 'Wrex est un Krogan biotique capable d’utiliser Barrier dans Mass Effect ; protection de gameplay adaptée sans équipement d’un autre compagnon.'],
    ['ashley_williams', shot('Rafale de la soldate Ashley'), 'Ashley est une soldate humaine spécialisée dans les armes, non une biotique ; rafale d’arme conventionnelle.'],
    ['mordin', projectile('Incinerate de Mordin', 'fire_aoe'), 'Mordin possède le pouvoir technologique Incinerate ; projectile incendiaire technologique, pas magie.', TECHNIQUE]
  ]),
  ...group('Meet the Feebles', 'Meet the Feebles (1989)', '#d8bf9d', [
    ['heidi_feebles', shot('Mitrailleuse de Heidi', { shape: 'cone', coneAngle: 38 }), 'Heidi emploie une mitrailleuse dans le final du film ; l’action reste une arme réelle dans la fiction de marionnettes.'],
    ['wynyard_feebles', guard('Ralliement de Wynyard en coulisses'), 'Wynyard est un artiste vétéran du spectacle ; repli en coulisses adapté à son rôle, sans pouvoir psychique inventé.'],
    ['robert_feebles', buff('Numéro du hérisson Robert'), 'Robert est un jeune artiste qui arrive dans la troupe ; soutien de représentation, pas attaque de piquants inventée.']
  ]),
  ...group('Michael Jackson', 'Michael Jackson — Billie Jean ; avatars scéniques Multiverse Breach', '#e6e6fb', [
    ['mj_performer', buff('Billie Jean — moonwalk scénique'), 'King of Pop Avatar est une persona de scène du catalogue ; référence au moonwalk de la performance, aucun pouvoir réel ou magie de Moonwalker transféré.', AUTHORED],
    ['rhythm_guard_mj', guard('Billie Jean — synchronisation des danseurs'), 'Rhythm Guard est un rôle chorégraphique original du pack ; soutien rythmique défensif.', AUTHORED],
    ['stage_light_mj', buff('Billie Jean — repères lumineux de scène'), 'Stage Light Tech est l’opérateur de régie du catalogue ; éclairage de placement, pas laser offensif.', AUTHORED]
  ]),
  ...group('Necronomicon', 'Multiverse Breach — pack Necronomicon, expandedUniverses.js', '#d0b582', [
    ['occult_reader_necro', buff('Déchiffrement des pages interdites'), 'Le pack définit Occult Reader comme lecteur de langues mortes dans les catacombes du livre ; renseignement adapté, pas sorcier nommé du film.', AUTHORED],
    ['deadite_scribe', guard('Confinement de l’encre maudite'), 'Deadite Scribe est une figure propre au pack historique ; garde des pages et confinement du support maudit, sans nouvel être emprunté à Evil Dead.', AUTHORED],
    ['ritual_guard_necro', guard('Fermeture du périmètre du livre'), 'Ritual Guard est le gardien du périmètre des catacombes dans le pack ; protection de lieu cohérente avec son rôle original.', AUTHORED]
  ]),
  ...group('Nightwish', 'Nightwish — Imaginaerum / Ghost Love Score ; avatars de scène Multiverse Breach', '#c1c9f1', [
    ['nightwish_avatar', buff('Imaginaerum — ouverture symphonique'), 'Imaginaerum Bard est une persona de scène du catalogue ; la référence à l’album ne devient pas un pouvoir de barde surnaturel.', AUTHORED],
    ['opera_voice_nightwish', buff('Ghost Love Score — voix d’ensemble'), 'Opera Voice est un avatar vocal du pack ; passage chanté de Ghost Love Score en soutien, sans onde destructrice.', AUTHORED],
    ['metal_ship_nightwish', guard('Repères de plateau du navire scénique'), 'Metal Ship est un élément allié de la scénographie du catalogue ; couverture et coordination de plateau, pas navire magique canonique.', AUTHORED]
  ]),
  ...group('One Punch Man', 'One-Punch Man (manga / anime)', '#cfe8f5', [
    ['saitama_opm', melee('Serious Punch'), 'Saitama emploie Serious Punch ; les dégâts sont plafonnés par les règles du crossover, sans prétendre égaler sa puissance narrative.', TECHNIQUE],
    ['genos_opm', beam('Canon d’incinération de Genos'), 'Genos projette des jets d’énergie thermique avec ses bras cyborg ; faisceau de son propre équipement.'],
    ['tatsumaki_opm', area('Compression télékinétique de Tatsumaki', 'force_aoe'), 'Tatsumaki manipule les masses et adversaires par télékinésie ; pression de zone adaptée à son pouvoir psychique.']
  ]),
  ...group('Parasyte', 'Parasyte / Kiseijū (manga), Parasyte: The Maxim (2014)', '#bfdeb9', [
    ['shinichi_migi', melee('Lame du bras Migi'), 'Migi transforme le bras droit de Shinichi en lames ; attaque de ce duo précis, sans parasite supplémentaire inventé.'],
    ['satomi_murano', buff('Rappel à l’humanité de Shinichi'), 'Satomi est l’amie humaine qui reconnaît les changements de Shinichi ; soutien relationnel, sans pouvoir de parasite.'],
    ['mamoru_uda', guard('Interception de Jaw'), 'Le parasite Jaw occupe la mâchoire d’Uda et peut se transformer pour le défendre ; protection adaptée de ce duo.']
  ]),
  ...group('Pirates of the Caribbean', 'Pirates of the Caribbean: The Curse of the Black Pearl (2003)', '#dec69d', [
    ['jack_sparrow_potc', melee('Feinte au sabre de Jack Sparrow'), 'Jack est un bretteur usant de ruse et d’improvisation ; pas de magie ni maîtrise du Kraken attribuée.'],
    ['elizabeth_swann_potc', guard('Ordre de pourparlers d’Elizabeth'), 'Elizabeth invoque le droit de pourparlers face aux pirates dans le premier film ; répit protecteur adapté à cette démarche.'],
    ['will_turner_potc', melee('Riposte du forgeron Turner'), 'Will manie les épées qu’il forge et affronte les pirates en duel ; attaque d’escrime rapprochée.']
  ]),
  ...group('Predator: Killer of Killers', 'Predator: Killer of Killers (2025) ; rôles du catalogue', '#c8bb9e', [
    ['viking_kok', melee('Charge au bouclier de la guerrière viking'), 'Le segment viking met en scène Ursa et son bouclier ; l’entrée Viking Shieldmaiden conserve ce combat physique.'],
    ['ninja_kok', melee('Coupe furtive du combattant shinobi'), 'Le segment japonais montre un combattant shinobi face au Yautja ; l’entrée Shadow Ninja reste au sabre, sans ninjutsu magique ajouté.'],
    ['pilot_kok', shot('Tir de couverture du pilote de guerre'), 'Le segment de la Seconde Guerre mondiale montre un pilote affrontant une menace Yautja ; tir d’armement d’appareil adapté, pas technologie Predator acquise.']
  ]),
  ...group('Prey (2006)', 'Prey (2006)', '#badacc', [
    ['prey_2006_jen', buff('Signal de Jen depuis la Sphère'), 'Jen est la personne que Tommy cherche à sauver sur la Sphère ; liaison et encouragement adaptés, aucune arme de Tommy attribuée.'],
    ['prey_2006_enisi', guard('Guidage spirituel d’Enisi'), 'Enisi guide Tommy dans les épreuves spirituelles ; soutien protecteur du grand-père, sans lui transférer le Spirit Bow de Tommy.']
  ]),
  ...group('PSY', 'PSY — Gangnam Style (2012) ; avatars scéniques Multiverse Breach', '#b7d9f0', [
    ['psy_avatar', buff('Gangnam Style — danse du cheval'), 'PSY Avatar représente la performance du morceau ; chorégraphie de soutien sans aptitude de combat attribuée à l’artiste.', AUTHORED],
    ['gangnam_dancer', buff('Gangnam Style — relais chorégraphié'), 'Gangnam Dancer est un rôle de danse du catalogue ; relais du mouvement collectif.', AUTHORED],
    ['kpop_crowd_psy', guard('Gangnam Style — réponse du public'), 'K-Pop Crowd est le public allié du pack ; encouragement collectif, pas attaque d’une foule réelle.', AUTHORED]
  ]),
  ...group('Rambo', 'Rambo: First Blood Part II (1985) ; First Blood (1982)', '#ced59c', [
    ['john_rambo', projectile('Flèche explosive de Rambo', 'explosive_aoe'), 'John Rambo utilise des flèches explosives dans First Blood Part II ; projectile d’équipement, pas puissance surnaturelle.'],
    ['sam_trautman', buff('Consigne radio du colonel Trautman'), 'Trautman est le supérieur et contact radio de Rambo ; coordination de soutien, sans dupliquer les performances du soldat.'],
    ['co_bao', shot('Couverture de Co Bao'), 'Co Bao accompagne Rambo pendant l’exfiltration au Vietnam et emploie une arme à feu ; tir conventionnel.']
  ]),
  ...group('Repo! The Genetic Opera', 'Repo! The Genetic Opera (2008)', '#c6b0dc', [
    ['shilo_repo', buff('Seventeen — voix de Shilo'), 'Shilo exprime son autonomie dans Seventeen ; soutien de performance et détermination, sans pouvoir de chirurgie.'],
    ['repo_man', melee('Lame chirurgicale du Repo Man'), 'Nathan Wallace exerce la fonction de Repo Man avec des instruments chirurgicaux ; attaque fictionnelle rapprochée, sans pouvoir surnaturel.'],
    ['blind_mag', buff('Chromaggia — chant de Blind Mag'), 'Blind Mag est la chanteuse d’opéra de GeneCo et interprète Chromaggia ; soutien vocal, pas attaque oculaire.']
  ]),
  ...group('Rob Zombie', 'Rob Zombie — Hellbilly Deluxe / Dragula (1998)', '#d4b3a0', [
    ['rob_zombie', buff('Dragula — entrée vocale de Rob Zombie'), 'Rob Zombie est le chanteur de la performance ; le nom d’artiste ne lui confère aucune capacité de mort-vivant.'],
    ['mike_riggs', buff('Dragula — guitare de Riggs'), 'Mike Riggs joue la guitare dans la formation de Hellbilly Deluxe ; performance instrumentale de soutien.'],
    ['rob_blasko_nicholson', guard('Dragula — ligne de basse de Blasko'), 'Blasko est le bassiste de cette formation ; cohésion rythmique adaptée, pas magie nécromantique.']
  ]),
  ...group('Rosario + Vampire', 'Rosario + Vampire (manga)', '#d5bee7', [
    ['tsukune_aono', selfBuff('Résistance vampirique de Tsukune'), 'Dans le manga, le sang de Moka transforme progressivement Tsukune ; renforcement adapté et identifié à cette continuité, sans prétendre une technique de l’anime.'],
    ['yukari_rv', projectile('Objets invoqués par Yukari', 'magic'), 'Yukari est une sorcière qui utilise sa baguette pour invoquer et déplacer des objets ; projectile de matière adapté.'],
    ['mizore_rv', projectile('Lames de glace de Mizore', 'ice_aoe'), 'Mizore est une yuki-onna qui produit et façonne la glace ; capacité de sa propre espèce.'],
    ['gin_rv', melee('Assaut du loup-garou Gin'), 'Gin Morioka se transforme en loup-garou et combat physiquement ; attaque rapprochée de sa forme monstrueuse.']
  ]),
  ...group('Rubber', 'Rubber (2010)', '#d1c1a3', [
    ['robert_rubber', area('Pression psychokinétique de Robert', 'mind_aoe'), 'Robert est le pneu qui détruit des objets par psychokinésie dans le film ; cette capacité n’est pas attribuée aux spectateurs.'],
    ['sheriff_rubber', guard('Périmètre du shérif'), 'Le shérif participe au dispositif policier et à la mise en scène du récit ; périmètre de repli adapté, sans télékinésie.'],
    ['spectator_rubber', buff('Observation aux jumelles'), 'Les spectateurs observent les événements à distance avec des jumelles ; renseignement de soutien, aucun pouvoir offensif.']
  ]),
  ...group('Sausage Party', 'Sausage Party (2016)', '#e8b595', [
    ['frank_sausage', buff('Avertissement de Frank aux rayons'), 'Frank révèle la vérité sur les humains aux autres aliments ; alerte collective adaptée, sans arme ou magie.'],
    ['brenda_bun', guard('Regroupement des aliments par Brenda'), 'Brenda est l’alliée de Frank dans le supermarché ; regroupement protecteur adapté à son rôle.'],
    ['barry_sausage', buff('Rapport d’évasion de Barry'), 'Barry revient avec des informations sur le monde hors du magasin ; renseignement de soutien, sans force surnaturelle ajoutée.']
  ]),
  ...group('Shaka Ponk', 'Shaka Ponk — My Name Is Stain ; avatars scéniques Multiverse Breach', '#bbdfb0', [
    ['shaka_ponk_avatar', buff('My Name Is Stain — relais du groupe'), 'Shaka Ponk Unit représente la performance du groupe ; soutien musical, sans pouvoir attribué aux artistes.', AUTHORED],
    ['goz_signal', buff('Repère visuel de Goz'), 'Goz est la mascotte virtuelle du groupe ; son avatar de catalogue relaie un signal de scène, sans rayon destructeur.'],
    ['punk_drum_shaka', guard('My Name Is Stain — pulsation de batterie'), 'Punk Drum est le rôle de percussion du pack ; maintien de tempo pour la cohésion de scène.', AUTHORED]
  ]),
  ...group('Silent Hill', 'Silent Hill (1999), Silent Hill 2 (2001), Silent Hill 3 (2003)', '#d1b4b9', [
    ['harry_mason', shot('Tir au pistolet de Harry'), 'Harry utilise des armes récupérées dans le premier Silent Hill ; survivant humain, aucune télékinésie.'],
    ['alessa_gillespie', guard('Sceau de protection d’Alessa'), 'Alessa manifeste des pouvoirs psychiques et tente de contenir le rituel par les sceaux dans Silent Hill ; protection adaptée à son rôle.'],
    ['maria_sh2', buff('Repérage de Maria à Silent Hill'), 'Maria accompagne James dans Silent Hill 2 ; soutien de guidage, sans lui attribuer l’arsenal du protagoniste.'],
    ['cybil_bennett', shot('Pistolet de service de Cybil'), 'Cybil est policière et apporte son arme de service ; tir conventionnel issu du premier jeu.'],
    ['claudia_wolf', buff('Exhortation de Claudia à l’Ordre'), 'Claudia est une prêtresse de l’Ordre dans Silent Hill 3 ; influence et exhortation adaptées, sans créer une attaque de faisceau.']
  ]),
  ...group('Sinister', 'Sinister (2012)', '#c6c1b1', [
    ['ellison_sinister', buff('Recoupement des bobines Super 8'), 'Ellison examine les films et archives des crimes ; information de soutien, sans contrôler Bughuul.'],
    ['tracy_sinister', guard('Mise à l’abri de la famille Oswalt'), 'Tracy cherche à protéger ses enfants et leur foyer ; repli de groupe adapté sans pouvoir occulte.'],
    ['deputy_so_and_so', buff('Vérification des dossiers du shérif'), 'Le Deputy So-and-So aide Ellison à retrouver les informations policières ; renseignement, pas capacité de démon.']
  ]),
  ...group('Soldier of Fortune', 'Soldier of Fortune (2000)', '#c2d5a3', [
    ['soldier_of_fortune_sam_gladstone', buff('Briefing d’armurerie de Sam Gladstone'), 'Sam est le contact d’armurerie de John Mullins ; préparation d’équipement et briefing, sans aptitude surnaturelle.']
  ]),
  ...group('Solo Leveling', 'Solo Leveling (manhwa)', '#c3b0ed', [
    ['sung_jinwoo', melee('Enchaînement aux dagues de Jinwoo'), 'Jinwoo manie deux dagues dans ses combats ; l’entrée conserve sa technique physique sans appeler une ombre d’un autre univers.'],
    ['cha_haein', melee('Sword Dance de Cha Hae-In'), 'Cha Hae-In est une chasseuse épéiste ; Sword Dance est son enchaînement d’escrime, adapté en impact rapproché.', TECHNIQUE],
    ['yoo_jinho', guard('Rempart de Yoo Jinho'), 'Jinho accompagne Jinwoo avec son armure et son bouclier ; protection de tank, sans pouvoir du Monarque des ombres.']
  ]),
  ...group('Splatterhouse', 'Splatterhouse (1988) ; continuité du masque de Rick', '#d4a3a1', [
    ['rick_splatterhouse', melee('Coup de poing du Terror Mask'), 'Rick reçoit une force accrue en portant le Terror Mask ; frappe rapprochée du personnage, sans arme d’un autre épisode imposée.'],
    ['jennifer_splatterhouse', buff('Appel de Jennifer à Rick'), 'Jennifer est la personne à secourir ; ce soutien reprend son lien avec Rick sans la transformer en combattante.'],
    ['terror_mask', selfBuff('Force conférée par le Terror Mask'), 'Le masque augmente les capacités du porteur ; renforcement adapté du masque, sans sprite de créature ajouté.']
  ]),
  ...group('Spy Kids', 'Spy Kids (2001)', '#e6c8ae', [
    ['carmen_cortez', guard('Évasion au gadget de Carmen'), 'Carmen utilise les équipements d’espionnage pendant le sauvetage des parents ; extraction technologique adaptée, pas magie.'],
    ['juni_cortez', buff('Déchiffrage du message de Floop'), 'Juni comprend la demande d’aide dissimulée dans le programme de Floop ; renseignement de soutien propre à son rôle.'],
    ['gregorio_cortez', melee('Intervention de l’agent Cortez'), 'Gregorio est un espion expérimenté et combat physiquement ; action rapprochée sans pouvoir de robot.']
  ]),
  ...group('Stargate', 'Stargate SG-1 (1997–2007)', '#a9d5e0', [
    ['hammond_sgc', guard('Autorisation d’extraction du SGC'), 'Le général Hammond dirige le Stargate Command et coordonne les secours ; soutien de commandement, pas attaque par la porte.'],
    ['vala_mal_doran', shot('Tir au zat de Vala'), 'Vala utilise les armes Goa’uld, dont le zat, pendant ses missions ; tir d’équipement, sans pouvoir d’Ori attribué.'],
    ['cam_mitchell', shot('Rafale P90 de Mitchell'), 'Cameron Mitchell commande SG-1 et emploie les armes du SGC ; rafale balistique de son équipement.']
  ]),
  ...group('Steins;Gate', 'Steins;Gate (2009 visual novel / 2011 anime)', '#c5dcde', [
    ['rintaro_okabe', guard('Avertissement par D-Mail'), 'Okabe envoie des informations vers le passé via le PhoneWave ; soutien d’avertissement adapté, sans téléportation d’adversaire ni arrêt du temps simulé.'],
    ['kurisu_makise', buff('Analyse du Time Leap par Kurisu'), 'Kurisu contribue à la théorie et au dispositif de Time Leap ; analyse de soutien, aucun faisceau scientifique inventé.'],
    ['itaru_hashida', cleanse('Restauration des accès par Daru'), 'Daru est le spécialiste informatique du laboratoire ; nettoyage d’un blocage logiciel adapté, pas magie ni contrôle de tous les systèmes.']
  ]),
  ...group('Super Meat Boy', 'Super Meat Boy (2010)', '#f5b1ae', [
    ['super_meat_boy_meat_boy', selfBuff('Course et saut mural de Meat Boy'), 'Meat Boy traverse les niveaux par la course et les sauts muraux ; renforcement de mobilité, pas nouvelle attaque de viande.'],
    ['super_meat_boy_bandage_girl', guard('Itinéraire de secours de Bandage Girl'), 'Bandage Girl est l’objectif du sauvetage et devient jouable dans certaines séquences ; repli de plateforme adapté, pas soin magique déduit de son nom.'],
    ['super_meat_boy_brownie', selfBuff('Course rivale de Brownie'), 'Brownie rivalise avec Meat Boy dans une course d’obstacles ; mobilité de son rôle, sans projectile ajouté.']
  ]),
  ...group('System of a Down', 'System of a Down — Chop Suey! (2001)', '#d8bf9f', [
    ['serj_tankian', buff('Chop Suey! — relais vocal de Serj'), 'Serj Tankian est le chanteur du groupe ; performance vocale de soutien, sans pouvoir offensif attribué au musicien.'],
    ['daron_malakian', buff('Chop Suey! — guitare et seconde voix'), 'Daron Malakian joue la guitare et partage les voix ; coordination musicale adaptée à ses fonctions réelles.'],
    ['shavo_odadjian', guard('Chop Suey! — pulsation de basse'), 'Shavo Odadjian est le bassiste ; soutien rythmique de cohésion, pas onde destructrice.']
  ]),
  ...group('Terrifier', 'Terrifier 2 (2022) ; Terrifier (2016)', '#d5b4b0', [
    ['sienna_terrifier', melee('Épée de la guerrière Sienna'), 'Sienna affronte Art avec l’épée associée au costume dessiné par son père dans Terrifier 2 ; arme de cette continuité.'],
    ['victoria_terrifier', guard('Repli de la survivante Victoria'), 'Victoria survit aux événements du premier Terrifier ; profil de survivante protecteur, sans lui attribuer par anticipation des pouvoirs d’un autre état de possession.'],
    ['jonathan_terrifier', buff('Repérage de Jonathan'), 'Jonathan aide Sienna et connaît les signes liés à Art ; renseignement de soutien, sans les capacités de l’épée.']
  ]),
  ...group('The Big Bang Theory', 'The Big Bang Theory (2007–2019)', '#c5d5e7', [
    ['sheldon_cooper_tbbt', buff('Planification méthodique de Sheldon'), 'Sheldon est physicien et attaché aux procédures ; préparation rationnelle adaptée, pas rayon théorique ou pouvoir de superhéros.'],
    ['leonard_hofstadter_tbbt', buff('Vérification expérimentale de Leonard'), 'Leonard est physicien expérimental ; vérification d’équipement en soutien, pas arme laser de laboratoire inventée.'],
    ['penny_tbbt', guard('Médiation de Penny'), 'Penny aide les membres du groupe dans leurs relations et désaccords ; répit de médiation, sans aptitude de combat.']
  ]),
  ...group('The Creator', 'The Creator (2023)', '#b1d9d6', [
    ['joshua_taylor_creator', shot('Couverture de Joshua Taylor'), 'Joshua est un ancien militaire qui protège Alphie ; tir d’armement conventionnel dans le conflit.'],
    ['alphie_creator', guard('Arrêt des machines par Alphie'), 'Alphie contrôle les systèmes technologiques à distance et peut arrêter les machines ; protection électronique adaptée, sans attaque contre des humains par magie.'],
    ['harun_creator', guard('Couverture de l’extraction par Harun'), 'Harun est un simulant combattant qui aide les protagonistes ; protection et coordination, sans lui attribuer le pouvoir d’Alphie.']
  ]),
  ...group('The Last of Us', 'The Last of Us (2013)', '#b8cc9e', [
    ['ellie_tlou', melee('Couteau d’Ellie'), 'Ellie utilise son couteau contre les menaces ; arme de survie, son immunité ne devient pas un pouvoir de guérison.'],
    ['joel_tlou', shot('Tir de couverture de Joel'), 'Joel utilise les armes de récupération pour protéger le trajet ; tir conventionnel, sans capacité liée à l’infection.'],
    ['tess_tlou', guard('Passage sécurisé par Tess'), 'Tess organise l’acheminement d’Ellie et protège la fuite ; soutien tactique de survivante.']
  ]),
  ...group('The Smurfs', 'Les Schtroumpfs / The Smurfs, personnages de Peyo', '#b9e8ff', [
    ['papa_smurf', heal('Remède du Grand Schtroumpf'), 'Le Grand Schtroumpf prépare des potions et remèdes ; soin allié adapté à son savoir, sans sort offensif inventé.'],
    ['smurfette', buff('Ralliement de la Schtroumpfette'), 'La Schtroumpfette est une alliée du village ; encouragement et entraide, sans lui transférer la magie de Gargamel.'],
    ['hefty_smurf', melee('Force du Schtroumpf Costaud'), 'Le Schtroumpf Costaud est défini par sa force physique ; intervention rapprochée de son rôle.']
  ]),
  ...group('Them!', 'Them! (1954)', '#d7caa2', [
    ['ben_peterson_them', shot('Couverture policière de Ben Peterson'), 'Ben Peterson est le policier qui enquête sur les disparitions et combat les fourmis ; arme conventionnelle.'],
    ['pat_medford_them', buff('Identification entomologique de Pat Medford'), 'Pat est une scientifique qui aide à identifier et comprendre les fourmis géantes ; renseignement, pas contrôle d’insectes.'],
    ['robert_graham_them', guard('Coordination du périmètre par Robert Graham'), 'Robert Graham est l’agent du FBI associé aux opérations ; coordination des secours et du périmètre.']
  ]),
  ...group('Tomb Raider', 'Tomb Raider (1996), Tomb Raider II (1997), Tomb Raider (2013)', '#d7c09e', [
    ['lara_croft_tr', shot('Double pistolet de Lara Croft'), 'Lara utilise ses deux pistolets dans les jeux classiques ; équipement propre à cette version d’action, sans pouvoir d’artefact inventé.'],
    ['winston_tr', heal('Service de ravitaillement de Winston'), 'Winston est le majordome de Croft Manor et apporte le plateau de service ; récupération abstraite de ravitaillement, sans en faire un tireur.'],
    ['jonah_tr', guard('Mise à l’abri par Jonah'), 'Jonah Maiava aide Lara et protège les survivants dans la continuité Survivor ; soutien de force et de secours, sans double pistolet de Lara.']
  ]),
  ...group('Toy Soldiers', 'Toy Soldiers (2010) ; rôles miniatures du catalogue Multiverse Breach', '#cbe28b', [
    ['tin_commander', buff('Ordre d’artillerie miniature'), 'Tin Commander est le rôle de commandement du pack de diorama ; coordination des pièces militaires miniatures, pas sorcellerie.', AUTHORED],
    ['plastic_gunner', shot('Rafale de la mitrailleuse miniature'), 'Plastic Gunner est le servant d’arme du pack Toy Soldiers ; tir de mitrailleuse conforme au jeu de défense de diorama.', AUTHORED],
    ['windup_sapper', projectile('Charge du sapeur à ressort', 'explosive_aoe'), 'Wind-Up Sapper est le rôle de sapeur mécanique miniature du pack ; explosif de champ de bataille, pas rayon déduit de sa catégorie.', AUTHORED]
  ]),
  ...group('Turok', 'Turok 2: Seeds of Evil (1998)', '#cae0bd', [
    ['turok_adon', buff('Conseil d’Adon à Joshua'), 'Adon est l’émissaire qui guide Joshua Fireseed et expose ses objectifs ; soutien d’information, aucune arme de Turok attribuée.']
  ]),
  ...group('Universal Soldier', 'Universal Soldier (1992) ; pack historique Multiverse Breach', '#bae4ed', [
    ['luc_deveraux_us', melee('Force augmentée du GR44'), 'Luc Deveraux est un UniSol doté de capacités physiques augmentées ; frappe rapprochée, pas laser ou magie.'],
    ['veronica_roberts_us', buff('Enquête de Veronica Roberts'), 'Veronica est la journaliste qui enquête sur le programme UniSol ; renseignement et coordination, pas soldat modifié.'],
    ['maggie_us', guard('Distribution du pack de refroidissement'), 'Maggie est uniquement l’alliée de catalogue du pack historique expandedUniverses.js ; soutien logistique avec le coolant déjà listé, sans prétendre une technique filmique attestée.', AUTHORED]
  ]),
  ...group('Virus', 'Virus (1999)', '#b7e9ed', [
    ['kit_foster_virus', guard('Navigation de secours de Kit Foster'), 'Kit Foster est la navigatrice du Sea Star ; organisation du trajet de sortie du navire contaminé.'],
    ['steve_baker_virus', projectile('Charge de démolition de Steve Baker', 'explosive_aoe'), 'Steve est le mécanicien qui participe à la destruction des machines du navire ; explosif matériel adapté à l’évasion.'],
    ['nadia_virus', buff('Avertissement de Nadia sur les machines'), 'Nadia Vinogradova est la survivante qui explique la menace et son fonctionnement ; renseignement sans maîtrise de l’entité électrique.']
  ]),
  ...group('Vocaloid', 'VOCALOID, banques vocales et performances musicales', '#f0dea3', [
    ['len', buff('Fire Flower — voix de Kagamine Len'), 'Kagamine Len est une banque vocale employée dans Fire Flower de halyosy ; performance chantée, aucun feu réel déduit du titre.'],
    ['meiko', buff('Nostalogic — voix de MEIKO'), 'MEIKO est la banque vocale employée dans Nostalogic de yuukiss ; soutien musical, pas attaque armée.'],
    ['kaito', buff('Cantarella — voix de KAITO'), 'KAITO chante dans Cantarella de Kurousa-P ; soutien vocal, sans poison ni pouvoirs déduits de la chanson.'],
    ['gumi', buff('KING — voix de GUMI'), 'GUMI est la banque vocale de KING de Kanaria ; performance musicale, pas domination mentale.']
  ]),
  ...group('Wrong Turn', 'Wrong Turn (2003)', '#c7d7a4', [
    ['jessie_wrongturn', guard('Repli forestier de Jessie'), 'Jessie cherche une voie de sortie avec les survivants et résiste à ses poursuivants ; protection de repli sans arme surnaturelle.'],
    ['chris_wrongturn', projectile('Explosion du camion de Chris', 'explosive_aoe'), 'Chris utilise le camion et son explosion pour combattre les poursuivants lors du final ; explosif circonstanciel adapté.'],
    ['carly_wrongturn', buff('Repérage du groupe par Carly'), 'Carly est une randonneuse parmi les survivants ; observation du trajet et soutien, sans lui attribuer une capacité de mutant.']
  ]),
  ...group('Zombi', 'Zombi 2 / Zombie Flesh Eaters (1979)', '#c6cca2', [
    ['peter_west_zombi', guard('Itinéraire de fuite de Peter West'), 'Peter est le journaliste qui accompagne l’expédition vers Matul ; repérage et repli, pas capacité liée aux morts-vivants.'],
    ['anne_bowles_zombi', buff('Recherche des traces du docteur Menard'), 'Anne se rend à Matul pour retrouver son père et rassemble les indices ; renseignement humain, aucune magie de réanimation.'],
    ['brian_hull_zombi', shot('Fusil du bateau de Brian Hull'), 'Brian participe à la traversée et à la défense du groupe ; le pack fournit le fusil du bateau, tir d’équipement conventionnel.']
  ])
};
