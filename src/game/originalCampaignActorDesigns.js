// Individual production contracts reviewed against the original campaign
// manifest and the first idle cell of each actor's exact game sheet.
const sourceRecord = 'src/game/originalUniversesManifest.json';

const record = (kind, name, incarnation, visualAnchor, rpgMove = null) => Object.freeze({
  kind, name, incarnation, visualAnchor, rpgMove, sourceRecord
});
const hero = (...values) => record('hero', ...values);
const enemy = (...values) => record('enemy', ...values);
const boss = (...values) => record('boss', ...values);
const worldBoss = (...values) => record('worldBoss', ...values);
const move = (name, description, action = {}) => Object.freeze({ name, description, ...action });

const sandstorm = {
  type: 'sand_aoe', targeting: Object.freeze({ delivery: 'radial', shape: 'area', range: 200, areaRadius: 200 })
};
const orbitalStrike = {
  type: 'orbital_aoe', targeting: Object.freeze({ delivery: 'area', shape: 'area', areaRadius: 100 })
};
const obliqueScreens = {
  type: 'shield', dmg: 0,
  targeting: Object.freeze({ effect: 'guard', targetSide: 'ally', shape: 'group', range: 190, reduce: 0.4, duration: 3 })
};

const byUniverse = new Map(Object.entries({
  'Kemet: The Devoured Sun': {
    nefra_balance: hero('Nefra de la Balance', 'Tribunal des Deux Vérités, scribe-guerrière',
      'Cheveux noirs tressés et perles au bandeau, robe blanche à panneau bleu et parure or, sabre recourbé tenu vers le sol.'),
    khepri_sen: hero('Khepri-Sen', 'Gardien des routes de la Barque solaire',
      'Tête nue aux cheveux courts et bouclés, drapés turquoise, ivoire et or, sandales ouvertes et long bâton droit.'),
    taset_lioness: hero('Taset la Lionne', 'Protectrice du nome désertique',
      'Longs cheveux noirs sous bandeau rouge, robe blanche à pans et drapé ocre, lance à rubans et bouclier rond rouge.'),
    'kemet_devoured_sun:shabti_corrompu': enemy('Shabti corrompu', 'Shabti sous un ordre falsifié',
      'Statuette sans jambes à bras croisés, faïence turquoise fissurée, anneaux dorés et ombres violettes au-dessus du crâne.'),
    'kemet_devoured_sun:serpent_des_dunes': enemy('Serpent des dunes', 'Serpent fouisseur des dunes de Kemet',
      'Anneaux brun or au sol, ventre d’écailles dorées, haute collerette turquoise et griffes cyan dressées.'),
    'kemet_devoured_sun:ombre_de_ba': enemy('Ombre de Ba', 'Ba spectral de la Douât',
      'Ailes à longues plumes bleu sombre, visage humain orné de perles, pattes d’oiseau et pendentif bleu suspendu.'),
    'kemet_devoured_sun:chacal_de_tombe': enemy('Chacal de tombe', 'Chacal des portes funéraires',
      'Quadrupède à museau allongé et deux grandes oreilles, côtes exposées, tête et griffes cyan, filets bleu noir derrière le dos.'),
    'kemet_devoured_sun:pretre_d_isfet': enemy('Prêtre d’Isfet', 'Prêtre des créatures d’Isfet',
      'Capuche aux tissus écrus sur visage sombre, sceptre à cercle cyan, pieds nus et tablette rectangulaire levée.'),
    'kemet_devoured_sun:ammit_aux_balances_brisees': boss('Ammit aux Balances Brisées', 'Ammit du Tribunal des Deux Vérités',
      'Museau crocodilien denté, crinière et pattes avant fauves, arrière-train gris mauve et volutes bleues sur le dos.',
      move('Poids des Balances brisées', 'Dévore les buffs des cibles dont le « poids » de corruption est trop élevé.')),
    'kemet_devoured_sun:tempete_rouge_avatar_d_isfet': boss('Tempête Rouge, Avatar d’Isfet', 'Avatar du Temple de l’Éclipse Rouge',
      'Guerrier au casque haut doré, armure bronze et rouge, longs voiles de tempête et hache basse en feu.',
      move('Sable d’Isfet', 'Recouvre l’arène de sable et transforme les lignes sûres en zones de chaos.', sandstorm)),
    'kemet_devoured_sun:pharaon_usurpateur_sans_nom': boss('Pharaon Usurpateur Sans-Nom', 'Usurpateur aux faux cartouches',
      'Coiffe rayée or et bleu, visage sombre dans la coiffe, cape cyan effilochée et cartouches lumineux au-dessus de la main.',
      move('Faux cartouches', 'Efface les noms des alliés et invoque des shabtis portant de faux cartouches.')),
    'kemet_devoured_sun:apep_devoreur_de_l_aube': worldBoss('Apep, Dévoreur de l’Aube', 'Apep autour de la Barque solaire',
      'Serpent géant bleu nuit à gueule cyan, crête d’or et barque dorée enserrée dans les anneaux.',
      move('Étreinte de l’Aube', 'Enroule la Barque solaire, plonge les phases dans l’obscurité et doit être repoussé avant la fin de la douzième heure.'))
  },
  'Imperium Aeternum': {
    aurelia_marcellina: hero('Aurelia Marcellina', 'Vestale du Feu civique',
      'Voile et étoffe ivoire bordés rouge et or, lance haute à rubans et coupe de feu tenue dans l’autre main.'),
    cassian_varro: hero('Cassian Varro', 'Centurion de la légion dissoute',
      'Visage découvert et cheveux courts bruns, armure sombre à lames et cape rouge, glaive court et bouclier haut à ombon.'),
    numa_corvinus: hero('Numa Corvinus', 'Augure des présages de la Brèche',
      'Robe bleue à galons or sur longues étoffes blanches, manche large et hampe fine à cage circulaire dorée.'),
    'imperium_aeternum:lemure_de_la_maison_vide': enemy('Lémure de la Maison Vide', 'Lémure de la Maison Vide',
      'Capuche de toile ivoire sans visage, haillons blancs et rouges flottants, hampe à lanterne rouge montée dans un cercle.'),
    'imperium_aeternum:legionnaire_au_serment_brise': enemy('Légionnaire au serment brisé', 'Légionnaire du serment rompu',
      'Armure noire et or, casque fermé avec crête écarlate, bouclier rectangulaire rouge et cape déchirée.'),
    'imperium_aeternum:louve_de_bronze': enemy('Louve de bronze', 'Automate des enseignes impériales',
      'Museau de loup en métal bronze, pattes griffues, drapés rouges et lame rouge montée sur l’avant-bras.'),
    'imperium_aeternum:oracle_des_dirae': enemy('Oracle des Dirae', 'Oracle des présages néfastes',
      'Visage pâle sous le voile rouge, couches d’étoffe noire et ivoire, sceptre haut à médaillon facial.'),
    'imperium_aeternum:aquila_mecanique': enemy('Aquila mécanique', 'Aigle mécanique des enseignes',
      'Carcasse de bronze sur serres, tête d’aigle allongée, ailes hautes en plumes rouges articulées et pinces courbes.'),
    'imperium_aeternum:centurion_rouge_de_bellone': boss('Centurion Rouge de Bellone', 'Centurion de Bellone au Forum',
      'Casque à crête rouge, écharpe et armure bronze à disques, lourde tête de masse et bras libre tendu.',
      move('Ordre de contre-charge', 'Force les unités à avancer et punit tout repli par une contre-charge.')),
    'imperium_aeternum:collecteur_d_orcus': boss('Collecteur d’Orcus', 'Collecteur des dettes d’Orcus',
      'Visage sombre cerclé d’or, manteau grenat et cuirasse longue, sceptre à deux plateaux et chaîne de sceaux rouges.',
      move('Dette d’Orcus', 'Réclame une « dette » à chaque soin et invoque des lémures impayés.')),
    'imperium_aeternum:dictateur_a_la_couronne_vide': boss('Dictateur à la Couronne Vide', 'Dictateur sans peuple de la Couronne Vide',
      'Disque noir entouré de rayons à la place de la tête, cape écarlate et cuirasse ivoire, sceptre en cage et ville miniature en main.',
      move('Décret de la Couronne Vide', 'Impose des décrets temporaires qui changent les règles de tour.')),
    'imperium_aeternum:janus_bifrons_seuil_fracture': worldBoss('Janus Bifrons, Seuil Fracturé', 'Seuil corrompu de la Porte Bifrons',
      'Arc à deux piliers clairs, deux visages opposés or et ardoise, moitié noire avec globe rouge et longue hampe à anneaux.',
      move('Seuil fracturé', 'Manifestation corrompue d’un seuil : une face rejoue le passé, l’autre annule le futur, et les deux doivent être synchronisées.'))
  },
  'Tawantinsuyu: The Split Sun': {
    killa_mayu: hero('Killa Mayu', 'Chasqui du Qhapaq Ñan des Falaises',
      'Cheveux bruns coiffés d’un bandeau, tunique ocre rouge à losanges et manteau court, fronde visible et cordelettes contre le torse.'),
    rumi_illa: hero('Rumi Illa', 'Maçonne-guerrière des routes séparées',
      'Cheveux noirs noués, épaules de tissu pourpre, plaques géométriques or et brun, grande hache claire au manche court.'),
    sumaq_khipu: hero('Sumaq Khipu', 'Gardienne des nœuds de la route',
      'Longue robe violette à galons ocre et manteau rayé, coiffe tissée et deux ensembles de cordelettes pendantes.'),
    'tawantinsuyu_split_sun:ombre_d_uku_pacha': enemy('Ombre d’Uku Pacha', 'Ombre des profondeurs d’Uku Pacha',
      'Vortex noir et pourpre aux contours effilés, mains et cordes qui émergent des bras tourbillonnants.'),
    'tawantinsuyu_split_sun:chasqui_corrompu': enemy('Chasqui corrompu', 'Porteur de renforts des portails',
      'Bandeau pourpre à deux pans, tunique ocre et pourpre tissée, large boucle à l’oreille et faisceau de cordelettes au torse.'),
    'tawantinsuyu_split_sun:gardien_puma_de_pierre': enemy('Gardien puma de pierre', 'Puma des carrefours de la route',
      'Quadrupède trapu en blocs de pierre appareillés, arcs magenta entre les plaques et museau carré bas.'),
    'tawantinsuyu_split_sun:jeune_amaru_de_tempete': enemy('Jeune Amaru de tempête', 'Jeune Amaru de la tempête',
      'Corps serpentiforme effilé suspendu en arc, zigzag d’or sur écailles violettes et fins sillages pourpres le long du dos.'),
    'tawantinsuyu_split_sun:masque_du_monde_renverse': enemy('Masque du monde renversé', 'Masque des cases retournées',
      'Masque suspendu à panneaux pierre et or, lignes en escalier pourpres, pendeloques et lame verticale séparée.'),
    'tawantinsuyu_split_sun:echo_de_la_montagne_aux_neiges_noires': boss('Écho de la Montagne aux Neiges Noires', 'Écho de l’avalanche aux Neiges Noires',
      'Masse d’avalanche oblique sans visage, blocs noirs sur gerbe neigeuse claire traversée d’éclairs mauves.',
      move('Avalanche des Neiges Noires', 'Provoque avalanches et pertes d’altitude sans représenter l’esprit tutélaire lui-même.')),
    'tawantinsuyu_split_sun:amaru_de_la_tempete_fendue': boss('Amaru de la Tempête Fendue', 'Amaru adulte de la Tempête Fendue',
      'Serpent-dragon en S, museau large durement anguleux, lignes géométriques dorées et violet dans les jointures.',
      move('Traversée de la Tempête Fendue', 'Serpent-dragon qui traverse ciel, terre et profondeur au cours d’un même tour.')),
    'tawantinsuyu_split_sun:gardien_du_khipu_sectionne': boss('Gardien du Khipu Sectionné', 'Gardien des liens du Khipu Sectionné',
      'Manteau d’étoffes à panneaux violets et or, masque long et halo de pierres, cordelettes suspendues à la hampe.',
      move('Khipu sectionné', 'Supprime les liens entre objectifs et fait oublier pourquoi la mission doit être accomplie.')),
    'tawantinsuyu_split_sun:pachakuti_du_soleil_noir': worldBoss('Pachakuti du Soleil Noir', 'Anomalie du renversement solaire',
      'Disque noir à bord d’éclipse orangé, quatre quartiers de pierre brisés par une fissure mauve, ensemble sans corps humanoïde.',
      move('Renversement du Soleil Noir', 'Catastrophe de renversement du monde : les quatre quartiers pivotent autour de Cusco et doivent être réalignés avant l’éclipse totale.'))
  },
  'Neon Requiem': {
    'neon_requiem:chrome_saint_k_0': boss('Chrome Saint K-0', 'Chrome Saint du Coffre mémoriel Helix',
      'Visière facettée sans visage, manteau de métal magenta et halo à rayons, masse de treillis rose et lumière sur l’autre paume.',
      move('Sermon chromé', 'Alterner entre sermon de contrôle et charge cybernétique.')),
    'neon_requiem:omnia_citymind_of_nadir_9': worldBoss('OMNIA, Citymind of Nadir-9', 'Esprit urbain de la Cathédrale OMNIA',
      'Corps noir suspendu se défaisant en pixels roses, halo ponctuel, boucles en câble et cœur magenta au torse.',
      move('Règle de Nadir-9', 'Réécrit les règles de l’arène quartier par quartier et tente de supprimer le nom des héros.'))
  },
  'Helios 56': {
    'helios_56:isotope_mite': enemy('Isotope Mite', 'Acarien des seuils d’irradiation',
      'Carapace turquoise ovale à rivets, trois bonbonnes au dos, plusieurs pattes et double pince blanche sur la tête.'),
    'helios_56:civil_defense_automaton': enemy('Civil Defense Automaton', 'Automate de la défense publicitaire',
      'Blindage turquoise et ivoire, antenne haute, visière rouge et disque marqué du symbole atomique.'),
    'helios_56:radglass_mutant': enemy('Radglass Mutant', 'Mutant de verre irradié',
      'Scaphandre turquoise à bocal rond, épaulement de cristaux cyan et bras rose à griffes, masse tubulaire cerclée.'),
    'helios_56:saucer_scout': enemy('Saucer Scout', 'Éclaireur-soucoupe de la ligne lunaire',
      'Coupole turquoise à œil unique, anneau blanc et rouge, bras articulés à lame bleue et embout conique.'),
    'helios_56:happy_home_servitor': enemy('Happy Home Servitor', 'Serviteur domestique de Tomorrowville',
      'Robot à visage souriant rond cyan, tablier turquoise à symbole atomique, coiffure de fil doré et sceptre à anneaux.'),
    'helios_56:director_isotope': boss('Director Isotope', 'Directeur de l’Exposition Tomorrowville',
      'Scaphandre de direction à masque rond, cape ivoire et turquoise, écrans cyan autour de la taille et sceptre orbital.',
      move('Seuil d’Isotope', 'Transforme les seuils de radiation en objectifs obligatoires.')),
    'helios_56:moonbase_warden': boss('Moonbase Warden', 'Gardien du Silo lunaire 7',
      'Armure trapue arrondie ivoire, turquoise et rouge, hublot radial cyan et canon greffé à l’avant-bras.',
      move('Frappe orbitale du Silo', 'Verrouille des secteurs sous vide et déclenche des tirs orbitaux.', orbitalStrike)),
    'helios_56:the_perfect_family_broadcast': boss('The Perfect Family Broadcast', 'Émission de la famille parfaite',
      'Visage souriant, robe turquoise à tablier ivoire et cloche basse, halo atomique doré et hampe à noyau cyan.',
      move('Reflets du foyer modèle', 'Crée des doubles souriants qui absorbent les soins.'))
  },
  'Mythos Primordia': {
    'mythos_primordia:chimere_sans_nom': enemy('Chimère sans nom', 'Chimère de l’Archive des Mythes à Naître',
      'Silhouette haute sombre aux jambes griffues, casque ivoire double pointe, lames roses et pans organiques fins.'),
    'mythos_primordia:colosse_idole': enemy('Colosse-idole', 'Idole alourdie par les archives',
      'Corps massif en blocs concentriques, bouclier circulaire à visage gravé, grand cercle dorsal et noyaux roses sur la pierre.'),
    'mythos_primordia:oracle_d_os': enemy('Oracle d’os', 'Oracle des actions annoncées',
      'Visage osseux sous grand cercle de rayons, robes bleu noir et fuchsia, sceptre à anneaux et globe rose au-dessus de la main.'),
    'mythos_primordia:rejeton_mange_etoile': enemy('Rejeton mange-étoile', 'Mange-étoile de la Mer Sans Rivage',
      'Créature voûtée sans visage distinct, griffes magenta, tentacules noirs et ouvertures roses en anneau.'),
    'mythos_primordia:titan_au_masque_vierge': enemy('Titan au masque vierge', 'Titan du masque sans rôle',
      'Masque ovale ivoire sans traits, halo de courtes pointes, robe violette et or, anneau lumineux au bout du bâton.'),
    'mythos_primordia:mere_des_masques': boss('Mère des Masques', 'Mère des archétypes de la Première Trame',
      'Figure au masque ivoire, couronne à pointes, étoffes fuchsia, masques satellites et hampe portant un masque supplémentaire.',
      move('Attribution des masques', 'Assigne des archétypes aux héros et modifie leurs compétences jusqu’à ce qu’ils brisent leur masque.')),
    'mythos_primordia:traitre_du_premier_feu': boss('Traître du Premier Feu', 'Traître de la source de création',
      'Armure noire effilée à cavités roses, cercle noir à feu rose au visage et au plastron, longue lame hérissée.',
      move('Vol du Premier Feu', 'Vole une source de création et la transforme en brûlure qui se propage entre les plateformes.')),
    'mythos_primordia:mer_sans_rivage': boss('Mer Sans Rivage', 'Océan conscient de la Mer Sans Rivage',
      'Figure spectrale bleu violet, couronne et sceptre roses, jupe en filaments ondulants ouverts comme des courants.',
      move('Îles-mémoires', 'Océan conscient qui efface la distance et fait apparaître des îles-mémoires.'))
  },
  'Ilyr Concordat': {
    'ilyr_concordat:aberration_du_culte_genetique': enemy('Aberration du Culte génétique', 'Aberration adaptative du Culte génétique',
      'Corps bronze et mauve asymétrique à bras organique, visage oblong ivoire, grappes de tubes et arme crantée.'),
    'ilyr_concordat:drone_nul_paleen': enemy('Drone Nul paléen', 'Drone géométrique paléen',
      'Blindage bronze à masque allongé, segment circulaire au-dessus de la tête, grand bouclier radial violet et réseau d’énergie à la main.'),
    'ilyr_concordat:parasite_de_voie_resonante': enemy('Parasite de voie résonante', 'Parasite des voies de portail',
      'Créature ramassée à crâne tressé, long faisceau de tentacules violets, deux lames courbes et points lumineux sur le buste.'),
    'ilyr_concordat:deserteur_du_concordat': enemy('Déserteur du Concordat', 'Déserteur des cinq doctrines',
      'Coiffe lisse ivoire au visage caché, tenue bleu noir à bordures et cape violettes, encensoir au sceptre et losanges flottants.'),
    'ilyr_concordat:archonte_sevrix': boss('Archonte Sevrix', 'Archonte de l’Assemblée orbitale d’Ilyr',
      'Casque facetté et drapés violets or, longue hampe à anneau lumineux et assemblée géométrique projetée dans la main.',
      move('Vote de Sevrix', 'Manipule les votes tactiques et transforme les renforts refusés en escadrons hostiles.')),
    'ilyr_concordat:vaisseau_ch_ur_du_schisme_nym': boss('Vaisseau-Chœur du Schisme Nym', 'Chœur schismatique de Nym',
      'Coque suspendue symétrique à hautes pointes argentées, voiles violettes latérales et noyau au-dessus de filaments.',
      move('Ordres du Schisme Nym', 'Divise l’interface en opinions concurrentes et duplique les ordres contradictoires.')),
    'ilyr_concordat:cuirasse_nul_oblique': boss('Cuirassé Nul « Oblique »', 'Cuirassé du Treillis de l’Architecte Pâle',
      'Corps anguleux bleu nuit à éclats violets, tête en prisme, aile de plaques noires et segments de treillis externes. Planche de pose unique.',
      move('Écrans obliques', 'Déploie des surfaces qui rendent les trajectoires droites impossibles.', obliqueScreens)),
    'ilyr_concordat:l_architecte_pale': worldBoss('L’Architecte Pâle', 'Architecte du treillis biologique et social',
      'Machine suspendue à montants ivoire, tête en cristal violet, anneaux au-dessus du châssis et pyramides flottantes.',
      move('Treillis de l’Architecte', 'Ancienne machine d’espèce inconnue qui convertit les civilisations en formes géométriques compatibles; chaque phase compresse une loi biologique ou sociale.'))
  },
  'Aevum Fracture': {
    'aevum_fracture:soldat_anachrone': enemy('Soldat anachrone', 'Soldat des capitales superposées',
      'Visière noire à fente orange, armure grise à reflets bronze, longue lame étroite chaude et étoffes orange effilochées.'),
    'aevum_fracture:doppelganger_de_propagande': enemy('Doppelgänger de propagande', 'Double du Ministère de l’Histoire Correcte',
      'Masque gris sans visage, manteau noir et rouge à galons or, sceptre à lanterne et éclats orange au bout des doigts.'),
    'aevum_fracture:molosse_chronal': enemy('Molosse chronal', 'Molosse des traces de retour',
      'Quadrupède mécanique bas, museau en pointe, rangée de plaques dorsales incandescentes et longues griffes orange.'),
    'aevum_fracture:citoyen_efface_automatise': enemy('Citoyen effacé automatisé', 'Témoin effacé forcé au combat',
      'Masque blanc piqué, manteau gris à bordures déchirées, longue tige à globe orange et écharpe qui se défait en pixels.'),
    'aevum_fracture:empereur_de_la_ligne_victorieuse': boss('Empereur de la Ligne Victorieuse', 'Empereur de la Ligne Victorieuse',
      'Couronne rayonnante sans visage, cape à doublure orange et hermine, cuirasse noire et or et sceptre solaire.',
      move('Monument de victoire', 'Déclare chaque tour comme preuve historique de sa victoire et invoque des monuments défensifs.')),
    'aevum_fracture:ministre_d_hier': boss('Ministre d’Hier', 'Ministre de l’Histoire Correcte',
      'Visage découvert aux cheveux blancs, manteau sombre à doublure orange, sceptre à cercle noir et écrans de mémoire bleus et orange.',
      move('Réécriture d’Hier', 'Réécrit les objectifs accomplis et transforme les archives contradictoires en crimes.')),
    'aevum_fracture:general_qui_n_a_jamais_perdu': boss('Général Qui-N’a-Jamais-Perdu', 'Général de la victoire rétroactive',
      'Armure anthracite aux grands pans ocre, chapeau à large bord, lumière rouge au plastron, masse carrée à noyau orange.',
      move('Victoire précédente', 'Recharge sa phase précédente lorsqu’il est vaincu sans preuve documentaire suffisante.')),
    'aevum_fracture:moteur_de_l_histoire_unique': worldBoss('Moteur de l’Histoire Unique', 'Moteur des quatre lignes temporelles',
      'Automate dans de grands anneaux de laiton, cœur à quatre voyants, deux fuseaux bleus et deux orange flottant de part et d’autre.',
      move('Histoire unique', 'Machine construite dans plusieurs futurs : compare les lignes, élimine les écarts et doit être forcée à conserver quatre vérités incompatibles.'))
  }
}));

export function getOriginalCampaignActorDesign(actor) {
  const entries = byUniverse.get(actor?.universe);
  const design = entries && Object.hasOwn(entries, actor?.id) ? entries[actor.id] : null;
  return design?.name === actor?.name ? design : null;
}
