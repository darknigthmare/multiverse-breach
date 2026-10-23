import { area, beam, buff, defend, guard, heal, hit, shot } from './rules.js';

// Only the explicitly assigned missing slots are supplied. Existing named
// attacks remain owned by their source records; nothing is inferred from a
// class, palette, hash, position in the roster, or the word "Guard".
const group = (universe, sourceWork, rows, identityBasis = 'canonical-role') => Object.fromEntries(rows.map(([id, slots, sourceReference]) => [id, {
  sourceHeroId: id, universe, sourceWork, sourceReference, identityBasis,
  canonicalVerified: false, networkVerified: false, gameplayAdaptation: true,
  ...slots,
  ...(slots.secondary ? { secondary: { cd: 6, ...slots.secondary } } : {})
}]));

export const ABILITIES_RESIDUAL = {
  ...group('Skyline', 'Skyline (2010), Beyond Skyline (2017), Skylines (2020)', [
    ['jarrod_skyline', { defense: defend('Résister à l’appel de la lumière bleue', 0.5) }, 'Jarrod résiste au contrôle mental et conserve son identité dans un corps alien ; sa résistance devient une fenêtre défensive, sans immunité universelle ni nouveau bouclier.'],
    ['elaine_skyline', { defense: defend('Se tenir hors de portée du faisceau de récolte', 0.35) }, 'Elaine est une survivante humaine qui échappe à la récolte ; retrait prudent, sans armure de commando ni lien de combat alien.'],
    ['rose_skyline', { defense: defend('Rester maîtresse de la connexion alien', 0.5) }, 'Rose Corley dirige la résistance dans Skylines et garde son identité malgré sa connexion aux aliens ; protection adaptée à cette maîtrise.']
  ]),
  ...group('BioShock', 'BioShock (2007), Rapture', [
    ['bioshock_rapture_jack', { secondary: beam('Electro Bolt de Jack', 1.7, { range: 390 }), defense: defend('Repli de Jack derrière les cloisons de Rapture') }, 'Jack peut utiliser le plasmide Electro Bolt et se mettre à couvert ; ce choix de plasmide ne change pas son attaque de clé anglaise existante.'],
    ['bioshock_rapture_bouncer', { secondary: hit('Charge à la foreuse du Bouncer', 1.9, { range: 150 }), defense: defend('Tenir sous l’armure de plongée du Bouncer', 0.65) }, 'Le Bouncer possède une foreuse et une lourde combinaison de Big Daddy ; charge physique et résistance de l’armure, sans plasmide de Jack ajouté.']
  ]),
  ...group('Counter-Strike', 'Counter-Strike / Counter-Strike 2, équipement des opérateurs', [
    ['counter_strike_sas', { secondary: shot('Rafale contrôlée au M4A1-S', 1.7), defense: defend('Couvert du SAS derrière une caisse de site') }, 'L’opérateur SAS du pack porte le M4A1-S ; la rafale reste balistique et le couvert est une position de site, pas une capacité surnaturelle.'],
    ['counter_strike_gign', { secondary: shot('Mode rafale du FAMAS', 1.7), defense: defend('Repli du GIGN derrière le couvert de désamorçage') }, 'Le FAMAS dispose d’un mode rafale dans Counter-Strike ; le GIGN protège son approche de désamorçage par les couverts physiques.'],
    ['counter_strike_fbi', { secondary: guard('Écran fumigène de reprise du site', { reduce: 0.35 }), defense: defend('Angle de repli de l’opérateur HRT') }, 'L’opérateur FBI HRT du pack possède le M4A4 et le rôle Smoke Retake ; la fumée occulte la ligne de vue, sa réduction des dégâts est une adaptation.']
  ]),
  ...group('Team Fortress 2', 'Team Fortress 2 (2007), équipements des classes', [
    ['team_fortress_2_scout', { secondary: shot('Pistolet secondaire du Scout', 1.5), defense: defend('Double saut d’évitement du Scout') }, 'Le pistolet est l’arme secondaire standard du Scout et son double saut est propre à la classe ; l’évitement est transposé en fenêtre défensive.'],
    ['team_fortress_2_soldier', { secondary: shot('Fusil à pompe secondaire du Soldier', 1.8, { shape: 'cone', coneAngle: 38 }), defense: defend('Repli du Soldier derrière le couvert du front', 0.5) }, 'Le Soldier possède le lance-roquettes et le shotgun standard ; son repli ne prétend pas qu’un rocket jump serait invulnérable ou gratuit.'],
    ['team_fortress_2_medic', { secondary: heal('Medi Gun du Medic', { healRatio: 0.2 }), defense: defend('Recul du Medic derrière son patient', 0.35) }, 'Le Medi Gun restaure la santé du patient ; le Medic se protège derrière son équipe. Le soin ne devient pas un projectile hostile ni une ÜberCharge gratuite.']
  ]),
  ...group('Skibidi', 'Skibidi Toilet, unités de base de l’Alliance du pack canonique', [
    ['cameraman_skibidi', { defense: defend('Repli du Cameraman derrière un obstacle') }, 'Le Cameraman du roster est une unité standard de l’Alliance ; il se met à couvert et ne reçoit pas les blindages d’un Titan.'],
    ['speakerman_skibidi', { defense: defend('Recul protégé par la pulsation sonore') }, 'Les impulsions sonores du Speakerman repoussent les adversaires ; la pulsation défensive adapte cette fonction sans importer les pouvoirs d’un Titan.'],
    ['tvman_skibidi', { defense: defend('Retrait dans la fumée du TV Man', 0.55) }, 'Le TV Man utilise sa téléportation dans la fumée ; retrait défensif, sans arrêt du temps ni écran d’un autre univers.']
  ]),
  ...group("Avatar (Na'vi)", 'Avatar (2009), Avatar: The Way of Water (2022)', [
    ['jake_sully_avatar', { defense: defend('Repli de Jake sous le couvert forestier') }, 'Jake utilise les couverts de Pandora et sa mobilité de Na’vi ; aucun bouclier technologique humain n’est inventé.'],
    ['neytiri_avatar', { defense: defend('Esquive de la chasseuse Omatikaya') }, 'Neytiri évite les menaces par sa mobilité de chasseuse ; la défense ne remplace ni son arc ni son identité par une magie élémentaire.'],
    ['kiri_avatar', { defense: defend('Rester dans le refuge guidé par Eywa', 0.35) }, 'Kiri perçoit le réseau d’Eywa et aide les autres à trouver leur chemin ; le refuge est une adaptation protectrice, pas un nouveau sort de combat.']
  ]),
  ...group('Poppy Playtime', 'Poppy Playtime, parcours de survie de Playtime Co.', [
    ['poppy_player', { defense: defend('Rappel du GrabPack vers le point sûr') }, 'Le corps du protagoniste reste un proxy du pack ; le GrabPack et les points de parcours permettent un retrait, sans inventer une apparence ou une force canonique.'],
    ['poppy_doll', { defense: defend('Retrait de Poppy par le passage de service', 0.35) }, 'Poppy connaît les accès de l’usine et guide le joueur ; protection par la navigation, sans pouvoir de poupée attaquante.'],
    ['kissy_missy', { defense: defend('Bras interposés pour le sauvetage', 0.55) }, 'Kissy Missy intervient comme alliée secourable ; l’interposition de ses longs bras adapte le sauvetage plutôt qu’une attaque générique.']
  ]),
  ...group('Plants vs. Zombies', 'Plants vs. Zombies (2009), défense du jardin original', [
    ['pvz_peashooter', { defense: defend('Tenir l’enracinement du Peashooter', 0.3) }, 'Le Peashooter du jeu original reste fixé à sa case et encaisse des morsures ; la réduction temporaire adapte sa tenue de ligne sans le faire esquiver ou porter un bouclier.'],
    ['pvz_sunflower', { defense: defend('Préserver la tige du Sunflower', 0.25) }, 'Le Sunflower produit du soleil et demeure planté sur sa case ; défense passive de son corps végétal, pas soin de combat emprunté à Garden Warfare.'],
    ['pvz_wallnut', { defense: defend('Carapace du Wall-nut face aux morsures', 0.7) }, 'Le Wall-nut absorbe les morsures grâce à sa coque et à ses PV ; cette protection adapte sa fonction réelle de barrage.']
  ]),
  ...group('Happy Wheels', 'Happy Wheels, commandes de physique des personnages', [
    ['hw_wheelchair_guy', { defense: defend('Rééquilibrage après la poussée du fauteuil') }, 'Wheelchair Guy utilise sa propulsion et son équilibre ; la défense est une correction de trajectoire, sans pouvoir ajouté au fauteuil.'],
    ['hw_business_guy', { defense: defend('Correction de l’inclinaison du gyropode') }, 'Business Guy traverse les obstacles en contrôlant son inclinaison sur le gyropode ; geste de physique adapté en protection.'],
    ['hw_irresponsible_dad', { defense: defend('Rééquilibrage du vélo et de son passager') }, 'Le vélo conserve le duo père-fils et son poids arrière ; la correction protège le parcours sans dissocier le passager ni inventer une arme.']
  ]),
  ...group('Marble Hornets', 'Marble Hornets (2009–2014), personnages humains', [
    ['mh_jay_merrick', { defense: defend('Repli de Jay pendant la reconstruction des Entries', 0.35) }, 'Jay enquête en assemblant les enregistrements et se replie face aux manifestations ; aucune résistance surnaturelle à l’Operator n’est affirmée.'],
    ['mh_tim_wright', { defense: defend('Retrait de Tim face aux symptômes', 0.4) }, 'Tim lutte contre les effets de l’Operator et des pertes de mémoire ; cette fenêtre défensive n’est ni une immunité ni un pouvoir attribué au masque.'],
    ['mh_jessica_locke', { defense: defend('Mettre Jessica et ses pièces à l’abri', 0.35) }, 'Jessica reste une survivante humaine liée à l’enquête ; refuge et conservation des preuves, sans arme ou force inventée.']
  ]),
  ...group('The Horribly Slow Murderer', 'The Horribly Slow Murderer with the Extremely Inefficient Weapon (2008)', [
    ['ginosaji_jack', { defense: defend('Écart désespéré hors de portée de la cuillère') }, 'Jack Cucchiaio tente constamment d’échapper au Ginosaji ; l’écart lui accorde un répit limité et ne brise pas la malédiction.'],
    ['ginosaji_mystic', { defense: defend('Retrait prudent après le diagnostic de malédiction', 0.3) }, 'La consultation identifie la malédiction sans remède simple ; la Mystic se protège par la distance, sans bannissement inventé.'],
    ['ginosaji_doctor', { defense: defend('Abri du médecin pendant la consultation', 0.3) }, 'Le médecin traite les contusions de Jack mais ne peut arrêter le poursuivant ; son abri reste humain et sans immunité.']
  ]),
  ...group('Sartorius Stedim Biotech', 'Multiverse Breach — adaptation professionnelle du bioprocédé Sartorius', [
    ['sartorius_aseptic_operator', { defense: defend('Suspendre le geste pour préserver l’asepsie', 0.3) }, 'L’opérateur du pack protège le produit par les manipulations aseptiques ; l’action est une pause de contrôle, pas un combat de laboratoire.'],
    ['sartorius_process_technician', { defense: defend('Mise en sécurité du circuit de bioprocédé', 0.3) }, 'Le technicien du scénario stabilise pression, débit et matériel ; sa protection représente la sécurisation du circuit sans attaque.'],
    ['sartorius_quality_controller', { defense: defend('Bloquer la libération du lot non conforme', 0.3) }, 'Le contrôleur du pack bloque les écarts avant libération ; le blocage est documentaire et non violent.']
  ], 'authored-universe-canon'),
  ...group('Trololo', 'Eduard Khil, vocalise télévisée ; rôles de studio du pack Trololo', [
    ['trololo_eduard_khil', { defense: defend('Reprise de souffle du baryton', 0.3) }, 'L’interprète d’archives soutient la vocalise par sa respiration et son sourire ; aucun pouvoir offensif ou magique n’est attribué à la personne réelle.'],
    ['trololo_tv_orchestra', { defense: defend('Pause coordonnée de l’orchestre de télévision', 0.3) }, 'L’orchestre du scénario maintient tempo et harmonie ; la pause reste un geste de studio sans arme.'],
    ['trololo_audience_chorus', { defense: defend('Regroupement du chœur du public', 0.3) }, 'Le public allié du pack prolonge le refrain participatif ; il se regroupe sans devenir une foule combattante.']
  ]),
  ...group('Crypt of the NecroDancer', 'Crypt of the NecroDancer (2015), règles des personnages', [
    ['crypt_necrodancer_cadence', { secondary: shot('Bombe de Cadence sur le battement', 1.7, { shape: 'area', areaRadius: 75 }), defense: defend('Repli de Cadence sur un battement libre') }, 'Cadence peut employer les bombes de son inventaire et se déplacer au rythme ; le consommable choisi est adapté en cooldown.'],
    ['crypt_necrodancer_melody', { secondary: hit('Frappe adjacente de la Golden Lute', 1.7, { shape: 'area', areaRadius: 75 }), defense: defend('Pas de Melody hors de la case menacée') }, 'La Golden Lute de Melody frappe les cases adjacentes au déplacement ; la portée de contact et le pas rythmique sont conservés.'],
    ['crypt_necrodancer_aria', { secondary: hit('Dague d’Aria sur le temps juste', 1.7), defense: defend('Pas exact d’Aria hors de la menace') }, 'Aria possède les restrictions de dague et d’exactitude rythmique de son mode ; cette action ne reprend pas le luth attribué par le vieux slot simple du pack.']
  ]),
  ...group('Subverse — Safe Galactic Rebellion', 'Multiverse Breach — adaptation non sexuelle de la rébellion du Prodigium, canonRosterWavePartG.js', [
    ['subverse_safe_rebellion_captain', { secondary: guard('Coordonner la couverture de la Mary Celeste'), defense: defend('Abri derrière la cloison de la passerelle') }, 'Le capitaine du pack commande la résistance depuis la Mary Celeste ; ordre de couverture et abri de vaisseau, sans nouvelle capacité personnelle.'],
    ['subverse_safe_rebellion_demi', { secondary: guard('Pare-feu des systèmes de DEMI'), defense: defend('Isoler le terminal de DEMI') }, 'DEMI est l’androïde de systèmes du pack ; pare-feu et isolement technique préservent sa fonction de soutien sans arme ajoutée.'],
    ['subverse_safe_rebellion_lily', { secondary: buff('Analyse de l’échantillon par Lily'), defense: defend('Mise à l’abri de la mallette de prélèvement', 0.35) }, 'Lily est la scientifique du scénario et possède une mallette d’échantillons ; recherche et repli, sans mutation ou magie déduite du prélèvement.']
  ], 'authored-universe-canon'),
  ...group("No Man's Sky", 'No Man’s Sky (2016–), exocombinaison et multi-outil', [
    ['no_mans_sky_traveller', { secondary: beam('Rayon d’extraction du multi-outil', 1.6, { range: 420 }), defense: defend('Bouclier de l’exocombinaison du Voyageur', 0.55) }, 'Le multi-outil possède un rayon d’extraction et l’exocombinaison un bouclier ; aucun pouvoir de l’Atlas ni module de lanceur non équipé n’est ajouté.']
  ]),
  ...group('Natural Selection 2', 'Natural Selection 2 (2012), équipement des Frontiersmen', [
    ['natural_selection_2_marine', { secondary: guard('Soudure de l’armure d’un équipier', { reduce: 0.3 }), defense: defend('Repli du Frontiersman derrière une structure') }, 'Le Welder répare l’armure des marines et les structures ; sa protection n’est pas un soin biologique ni un laser offensif.'],
    ['natural_selection_2_jetpack_marine', { secondary: buff('Poussée du jetpack des Frontiersmen', { targetSide: 'self', shape: 'single' }), defense: defend('Écart aérien au jetpack') }, 'Le jetpack permet une mobilité propulsée au marine équipé ; poussée et évitement adaptent ce matériel, sans vol inné.'],
    ['natural_selection_2_exosuit', { secondary: shot('Rafale appariée des miniguns de l’Exosuit', 1.9, { shape: 'cone', coneAngle: 35 }), defense: defend('Blindage de l’Exosuit en position', 0.65) }, 'La configuration à deux miniguns de l’Exosuit tire avec ses bras armés et encaisse sous armure ; aucune régénération personnelle n’est inventée.']
  ]),
  ...group('Nemesis — Awaken Realms', 'Nemesis (Awaken Realms), rôles de la boîte de base', [
    ['nemesis_awaken_realms_soldier', { secondary: shot('Tir de couverture du Soldat', 1.8), defense: defend('Repli du Soldat derrière une porte de coursive') }, 'Le Soldat possède un fusil et une fonction de couverture de combat ; le tir et l’abri sont adaptés aux coursives du jeu de plateau.'],
    ['nemesis_awaken_realms_scientist', { secondary: buff('Lecture de la console par le Scientifique'), defense: defend('Retrait du Scientifique par la coursive sûre', 0.35) }, 'Le Scientifique utilise les systèmes et la connaissance des Intruders ; lecture technique et retrait, sans arme biologique inventée.'],
    ['nemesis_awaken_realms_scout', { secondary: guard('Progression silencieuse du Scout'), defense: defend('Écart du Scout vers la porte libre') }, 'Le Scout privilégie déplacement et discrétion à bord ; la protection simule la progression prudente, sans invisibilité surnaturelle.']
  ]),
  ...group('Unreal Tournament 2004', 'Unreal Tournament 2004, arsenal et déplacements du tournoi', [
    ['unreal_tournament_2004_gorge', { secondary: shot('Grenade du tir secondaire du Flak Cannon', 1.8, { shape: 'area', areaRadius: 85 }), defense: defend('Esquive latérale de Gorge dans l’arène') }, 'Le Flak Cannon de Gorge possède un tir secondaire en grenade ; le dodge est un mouvement du tournoi, sans pouvoir déduit de sa carrure.'],
    ['unreal_tournament_2004_sapphire', { secondary: area('Shock Combo du Shock Rifle', 1.9), defense: defend('Dodge-jump de Sapphire') }, 'Le Shock Combo résulte du tir primaire dans l’orbe secondaire du Shock Rifle ; l’enchaînement est condensé en une action ciblée, le dodge-jump reste un mouvement de jeu.'],
    ['unreal_tournament_2004_frostbite', { secondary: shot('Salve chargée du Rocket Launcher', 1.9, { shape: 'area', areaRadius: 90 }), defense: defend('Repli de Frostbite après la salve') }, 'Le Rocket Launcher charge plusieurs roquettes ; l’action combine une salve d’équipement et le repli du combattant de tournoi, sans contrôle de glace attribué au nom Frostbite.']
  ]),
  ...group('Angels Fall First', 'Angels Fall First, rôles ULA du pack de combat spatial', [
    ['angels_fall_first_ula_rifleman', { secondary: shot('Rafale soutenue du fusil ULA', 1.8), defense: defend('Couvert du fusilier dans la coursive ULA') }, 'Le fusilier ULA utilise son arme de service et les couverts de la guerre embarquée ; aucune capacité d’uniforme ou de faction n’est inventée.'],
    ['angels_fall_first_ula_pilot', { secondary: buff('Coordination de la trajectoire d’approche ULA'), defense: defend('Repli du pilote vers le sas de l’appareil') }, 'Le pilote du pack assure l’approche et le trajet d’appareil ; coordination et sas reprennent son rôle, sans force spéciale attribuée au pistolet.'],
    ['angels_fall_first_ula_commander', { secondary: guard('Ordre de couverture de la flotte ULA'), defense: defend('Périmètre de protection de la passerelle') }, 'Le Fleet Commander coordonne les moyens ULA ; l’ordre de couverture et la protection de passerelle sont des adaptations de commandement.']
  ]),
  ...group('Doom Sweeper — Safe Apocalypse', 'Multiverse Breach — adaptation de survie de Doom Sweeper, canonRosterWavePartG.js', [
    ['doom_sweeper_safe_yamato', { secondary: shot('Rafale de couverture de Yamato', 1.8), defense: defend('Couvert de Yamato derrière le véhicule') }, 'Yamato est l’adulte armée d’un fusil de service du pack de survie ; couverture conventionnelle et couvert du convoi.'],
    ['doom_sweeper_safe_roche', { secondary: guard('Réparer la plaque de blindage du véhicule'), defense: defend('Se couvrir derrière le châssis réparé') }, 'Roche est le mécanicien du scénario et porte une clé de réparation ; son intervention protège un blindage, sans soin magique de personnes.'],
    ['doom_sweeper_safe_armored_van', { secondary: buff('Signal radio du ravitaillement aérien'), defense: defend('Plaques soudées du fourgon en barrage', 0.65) }, 'Le fourgon du pack porte une radio de parachutage, une tourelle et des plaques soudées ; le secondaire signale le ravitaillement sans dupliquer la tourelle.']
  ], 'authored-universe-canon'),
  ...group('Absolver: Downfall', 'Absolver (2017) / Downfall, styles des Prospects d’Adal', [
    ['absolver_downfall_windfall', { secondary: hit('Contre après esquive du style Windfall', 1.7), defense: defend('Évitement directionnel Windfall', 0.5) }, 'Le style Windfall emploie l’évitement directionnel ; le contre suit cet évitement, sans projectile de vent littéral.'],
    ['absolver_downfall_khalt', { secondary: hit('Riposte après absorption du style Kahlt', 1.8), defense: defend('Absorption du choc par la posture Kahlt', 0.6) }, 'Kahlt absorbe l’impact pour ouvrir la riposte ; la réduction de dégâts simplifie sa mécanique de posture sans le rendre invulnérable.'],
    ['absolver_downfall_forsaken', { secondary: hit('Contre de la parade Forsaken', 1.8), defense: defend('Parade directionnelle Forsaken', 0.55) }, 'Le style Forsaken repose sur la parade directionnelle et l’ouverture de contre ; actions martiales rapprochées, sans magie de Gleam inventée.']
  ]),
  ...group('Agony', 'Agony (2018), adaptation expurgée du pack de fuite infernale', [
    ['agony_2018_nimrod_soul', { secondary: buff('Prise de contrôle d’un réceptacle par l’âme', { targetSide: 'self', shape: 'single' }), defense: defend('Retrait de l’âme vers le réceptacle') }, 'La possession des réceptacles appartient à la progression de Nimrod ; le transfert devient un renforcement de contrôle et un retrait, sans détail graphique.'],
    ['agony_2018_martyr_vessel', { secondary: guard('Éclairer le passage avec la torche'), defense: defend('Se dissimuler sous l’abri de pierre') }, 'Le réceptacle humain du pack traverse les passages avec une torche et peut se cacher ; lumière protectrice et abri, pas nouvelle flamme magique.'],
    ['agony_2018_demon_vessel', { secondary: hit('Percussion de la porte par le réceptacle blindé', 1.9), defense: defend('Carapace du réceptacle démoniaque', 0.6) }, 'Le réceptacle démoniaque blindé du scénario dispose de griffes et force les passages ; les actions restent physiques et entièrement non graphiques.']
  ], 'authored-universe-canon'),
  ...group('Atomic Heart', 'Atomic Heart (2023), Facility 3826', [
    ['atomic_heart_p3', { secondary: beam('SHOK du gant de P-3', 1.7, { range: 350 }), defense: defend('Bouclier polymérique de P-3', 0.6) }, 'P-3 emploie SHOK et peut équiper Polymeric Shield grâce à son gant ; des capacités technologiques de la base du jeu, pas de magie.'],
    ['atomic_heart_granny_zina', { secondary: shot('Tir de soutien de Baba Zina', 1.8), defense: defend('Couvert dans le dépôt d’armes de Zina') }, 'Granny Zina est une alliée armée disposant d’un dépôt ; le tir reprend son arme de terrain et le couvert protège son poste, sans pouvoir de robot attribué.']
  ]),
  ...group('Bendy and the Ink Machine', 'Bendy and the Ink Machine (2017–2018)', [
    ['bendy_ink_machine_henry', { secondary: hit('Revers de la hache de Henry', 1.7), defense: defend('Repli de Henry dans la station de refuge') }, 'Henry utilise une hache et se cache des menaces dans les stations du studio ; équipement de survie et refuge, sans manipulation de l’encre.'],
    ['bendy_ink_machine_boris', { secondary: buff('Signaler le refuge de Boris'), defense: defend('S’abriter dans la pièce sûre de Boris', 0.35) }, 'Boris sert d’allié et accompagne le trajet depuis la pièce sûre ; ce secondaire est un signal de refuge, pas une attaque de monstre.'],
    ['bendy_ink_machine_allison', { secondary: hit('Riposte à l’épée d’Allison Angel', 1.8), defense: defend('Parade de l’épée d’Allison') }, 'Allison porte une épée et aide Henry ; riposte et parade sont ses propres gestes armés, sans pouvoirs d’Alice Angel hostile.']
  ]),
  ...group('F.E.A.R.', 'F.E.A.R. (2005), réflexes du Point Man', [
    ['fear_point_man', { secondary: buff('Réflexes accélérés du Point Man', { targetSide: 'self', shape: 'single', duration: 2, buffMultiplier: 1.16 }), defense: defend('Évitement sous réflexes du Point Man', 0.55) }, 'Le Point Man dispose de réflexes accélérés représentés par le bullet time ; le moteur les adapte en avantage bref et évitement, sans affirmer un arrêt réel du temps pour tous.']
  ])
};
