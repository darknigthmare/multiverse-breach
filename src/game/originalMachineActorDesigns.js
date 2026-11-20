// Internal production targets for actors in the original campaign. The
// selected marks describe the project's current reference, not all frames.
const sourceRecord = 'src/game/originalUniversesManifest.json';

const record = (kind, name, incarnation, visualAnchor, rpgMove = null) => Object.freeze({
  kind, name, incarnation, visualAnchor, rpgMove, sourceRecord
});
const hero = (...values) => record('hero', ...values);
const enemy = (...values) => record('enemy', ...values);
const boss = (...values) => record('boss', ...values);
const worldBoss = (...values) => record('worldBoss', ...values);

const label = (name, description, targeting = null) => Object.freeze({ name, description, targeting });
const railLine = Object.freeze({ delivery: 'projectile', shape: 'line' });

const byUniverse = new Map(Object.entries({
  'The Aether Crown': {
    elara_voss: hero('Elara Voss', 'Capitaine corsaire des routes interdites',
      'Boucles sombres, long manteau bordeaux à galons or, rapière cyan et pistolet de pont distincts.'),
    bram_quill: hero('Bram Quill', 'Inventeur banni des soupapes d’éther',
      'Visière et lunettes cyan, manteau bleu noir à coutures laiton et clef d’éther longue à tête ajourée.'),
    merek_flint: hero('Merek Flint', 'Chevalier-chaudière insurgé de la Couronne',
      'Armure lourde noir et cuivre, tablier brun déchiré et marteau-piston à tête cylindrique, avec surfaces chauffées orange.'),
    'aether_crown:brass_constable': enemy('Brass Constable', 'Patrouille du Marché de Cuivre',
      'Armure de laiton, panache bleu, grand bouclier rond gravé à cœur cyan et matraque pneumatique.'),
    'aether_crown:coalbound_golem': enemy('Coalbound Golem', 'Golem de la Fonderie de la Couronne',
      'Corps de chaudière bas et massif, cercle cyan au centre du torse, épaule fumante et lourd outil de forge présenté bas.'),
    'aether_crown:aether_mite_swarm': enemy('Aether Mite Swarm', 'Essaim rongeur de la Couronne en formation',
      'Figure de laiton flottante à capuchon bleu, longue tige à cristal cyan et petites mites sphériques formant l’essaim dans la planche de référence initiale.'),
    'aether_crown:sky_corsair_press_gang': enemy('Sky Corsair Press-Gang', 'Corsaire d’abordage du Pont du Marché',
      'Casque de laiton à pointe, manteau bleu déchiré, sabre court à lueur cyan et protection ronde devant le bras.'),
    'aether_crown:pressure_wraith': enemy('Pressure Wraith', 'Spectre de pression des conduites d’éther',
      'Haut du corps mécanisé cuivre et cyan, spirale gazeuse en guise de jambes, hampe à globe et échappées de vapeur lumineuse.'),
    'aether_crown:duchess_caldera': boss('Duchess Caldera', 'Duchesse du Pont du Marché de Cuivre',
      'Robe brun cuivre à pans longs, épaules et couronne de laiton, sceptre ajouré éclairé cyan.',
      label('Prélèvement de charbon', 'Taxe l’ATB et invoque des collecteurs de charbon.')),
    'aether_crown:lord_pneuma': boss('Lord Pneuma', 'Seigneur de la Fonderie de la Couronne',
      'Haute couronne à anneau, respirateur à tuyaux, chemise d’armure bleu nuit et or, globe au bout du sceptre et vortex en main. Référence de pose unique.',
      label('Décompression', 'Vole l’oxygène d’une zone puis déclenche une décompression.')),
    'aether_crown:hms_sovereign_automaton': boss('HMS Sovereign Automaton', 'Automate du Quai du Moteur-Léviathan',
      'Marcheur en laiton, superstructure de cheminée et couronne, bras-canons et grands télémètres cyan.',
      label('Feu des télémètres', 'Bombarde les cases marquées par ses télémètres.')),
    'aether_crown:crown_of_storms_leviathan_engine': worldBoss('Crown of Storms, Leviathan Engine', 'Moteur-Léviathan de la Couronne des Tempêtes',
      'Coque aérienne large à tours et chaudières en laiton, grands anneaux lumineux sous la quille et courants d’éther cyan.',
      label('Aspiration d’éther', 'Aspire l’éther du décor, change la gravité et ouvre ses chaudières comme points faibles.'))
  },
  'Meridian Clockwork': {
    seraphine_meridius: hero('Seraphine Meridius', 'Protectrice des minutes libres',
      'Manteau bleu à passementerie or, cheveux bruns, lame fine à garde d’échappement et bottes de duel.'),
    lio_ferrante: hero('Lio Ferrante', 'Mécanicien du Méridien et des minutes libres',
      'Cheveux en bataille, manteau court de cuir brun, lance-rouages mécanique et faucon à ressort distinct de son corps.'),
    brother_ors: hero('Frère Ors', 'Frère horloger des minutes libres',
      'Robe et cape cuivrées, col haut, silhouette large et grand maillet rond suspendu à sa hampe.'),
    'meridian_clockwork:escapement_guard': enemy('Escapement Guard', 'Garde de la Place aux Mille Cadrans',
      'Casque en cadran, bouclier d’échappement bleu et or, lourde chaîne portant sa masse de rouage.'),
    'meridian_clockwork:springblade_automaton': enemy('Springblade Automaton', 'Automate de l’Astrarium',
      'Automate courbé bleu et or sur pieds griffus, lames fines en faisceau au bout de chaque avant-bras.'),
    'meridian_clockwork:gearwing_falcon': enemy('Gearwing Falcon', 'Faucon de garde du Méridien',
      'Pattes d’oiseau, bec mécanique et ailes d’engrenage déployées en longues plumes articulées bleues et or.'),
    'meridian_clockwork:pendulum_penitent': enemy('Pendulum Penitent', 'Pénitent de la Grande Horloge',
      'Masque grêle ivoire sous une capuche bleue, tunique sombre effilochée et balanciers à anneaux de laiton dans les deux mains.'),
    'meridian_clockwork:hour_thief': enemy('Hour-Thief', 'Voleur d’heures du Méridien',
      'Manteau bleu flottant, visage en cadran unique, anneau de mesure et trace bleu vif autour du bras.'),
    'meridian_clockwork:maestro_vellum': boss('Maestro Vellum', 'Maestro de la Place aux Mille Cadrans',
      'Longue silhouette d’officiant bleu et or, grand cadran autour du masque et sceptre solaire orné.',
      label('Cycle du sceau', 'Inverse l’ordre des tours et scelle une compétence par cycle.')),
    'meridian_clockwork:orloj_duelist': boss('Orloj Duelist', 'Duelliste de l’Astrarium',
      'Capuche bleue pointue, corps horloger en retrait, griffes argentées très longues et fils de manteau tirés vers l’arrière.',
      label('Écho d’Orloj', 'Rejoue exactement l’attaque reçue au tour précédent.')),
    'meridian_clockwork:the_twelve_bell_judges': boss('The Twelve Bell Judges', 'Juges de la Grande Horloge',
      'Officiant bleu, or et blanc à cadran facial, hampe frontale et cloches isolées dans des disques bleus. Référence de pose unique.',
      label('Décret des cloches', 'Chaque cloche impose une nouvelle règle de terrain.')),
    'meridian_clockwork:chronophage_of_the_last_meridian': worldBoss('Chronophage of the Last Meridian', 'Chronophage du Dernier Méridien',
      'Silhouette effilée en armature d’horloge bleue et or, cadran d’ancrages derrière le corps et sphère au sceptre.',
      label('Dévoration de durée', 'Dévore la durée restante du combat et doit être interrompu en cassant ses douze ancrages.'))
  },
  'Iron Tempest': {
    mara_veylan: hero('Mara Veylan', 'Reconnaissance de la Ligne-Cendre',
      'Tenue de terrain olive, cheveux sombres courts, pan de cape rouge et carabine diesel portée devant le buste.'),
    anton_rook: hero('Anton Rook', 'Artilleur à rivets du front diesel',
      'Veste de travail en cuir et plaques renforcées, barbe sombre et canon à rivets à tubulure orange.'),
    ilya_cross: hero('Ilya Cross', 'Pilote affranchi du front Zephyr',
      'Tenue sombre légère à liserés cuivre, bandes longues d’écharpe ocre et lame-hélice tenue vers le sol.'),
    'iron_tempest:soot_legionnaire': enemy('Soot Legionnaire', 'Infanterie de la Ligne-Cendre',
      'Casque filtrant à fente rouge, plastron cuirassé rouille et haut bouclier rectangulaire à bosse centrale.'),
    'iron_tempest:gyro_trooper': enemy('Gyro Trooper', 'Troupe d’assaut de l’Aérodrome Zephyr',
      'Armure rouge à casque fermé, deux pales au-dessus du corps et lame courte tenue près de la cuisse.'),
    'iron_tempest:trench_automaton': enemy('Trench Automaton', 'Automate de la Ligne-Cendre',
      'Robot à chaudière ventrale orange, face ronde et bras épais, outil long au fer rouge à deux branches.'),
    'iron_tempest:fuel_hound': enemy('Fuel Hound', 'Molosse mécanique du front diesel',
      'Quadrupède bas couvert de câbles, plaques rouges, grandes griffes et petite flamme au bout de la queue.'),
    'iron_tempest:propaganda_drone': enemy('Propaganda Drone', 'Drone des émetteurs du front',
      'Machine arrondie sans jambes, optique rouge entourée de haut-parleurs, bannières irrégulières et module de signal suspendu.'),
    'iron_tempest:marshal_volgra': boss('Marshal Volgra', 'Commandement de la Ligne-Cendre',
      'Officier longiligne en manteau noir et rouge, casque militaire et hampe d’émetteur rouge rayonnant.',
      label('Ordre des émetteurs', 'Renforce les unités tant que ses émetteurs restent actifs.')),
    'iron_tempest:black_zephyr_ace': boss('Black Zephyr Ace', 'As de l’Aérodrome Zephyr',
      'Combinaison d’as sombre, casque rond rouge, longues griffes aux mains et pans de foulard rouge flottants.',
      label('Passe du Zephyr', 'Strafe l’arène puis engage un duel aérien.')),
    'iron_tempest:rail_cannon_behemoth': boss('Rail-Cannon Behemoth', 'Canon sur rails du front diesel',
      'Châssis bas à quatre supports, bandes rouges et canon sur rail à double guide rouge, monté au-dessus du centre du corps.',
      label('Tir transversal', 'Télégraphie un tir qui traverse toute la carte.', railLine)),
    'iron_tempest:moloch_continental_landship': worldBoss('Moloch Continental Landship', 'Forteresse continentale de l’Iron Tempest',
      'Forteresse mobile à chenilles superposées, batteries saillantes et cœur diesel rouge au centre de la tour.',
      label('Salve de Moloch', 'Forteresse mobile en trois sections : chenilles, batteries et cœur diesel alimenté par la Brèche.'))
  },
  'Helios 56': {
    celeste_ray: hero('Dr Celeste Ray', 'Physicienne de Tomorrowville',
      'Blouse ivoire et combinaison turquoise, lunettes de protection et émetteur gamma portatif cyan.'),
    nova_bell: hero('Nova Bell', 'Pilote-fusée de Helios 56',
      'Cheveux ondulés sous casque ouvert à lunettes, combinaison rouge et jaune, bottes renforcées et pistolet rayon.'),
    aura_7: hero('AURA-7', 'Serviteur protecteur de Tomorrowville',
      'Robot blanc et rouge à visage circulaire cyan, grand gantelet atomique et écran de protection arrondi.'),
    'helios_56:helio_1_smiling_sun_reactor': worldBoss('HELIO-1, Smiling Sun Reactor', 'Cœur de HELIO-1',
      'Automate-réacteur cuivré, grand disque jaune souriant entouré de pointes, cœur bleu et deux masses bleues aux bras.',
      label('Surchauffe de HELIO-1', 'Alterne phase publicitaire lumineuse et fusion critique ; ses écrans doivent être coupés avant le cœur.'))
  }
}));

export function getOriginalMachineActorDesign(actor) {
  const entries = byUniverse.get(actor?.universe);
  const design = entries && Object.hasOwn(entries, actor?.id) ? entries[actor.id] : null;
  return design?.name === actor?.name ? design : null;
}

export function resolveOriginalMachineRpgSpecial(actor, supplied) {
  const move = getOriginalMachineActorDesign(actor)?.rpgMove;
  if (!move || !supplied || typeof supplied !== 'object' || Object.keys(supplied).length !== 2
    || supplied.fr !== move.description || supplied.en !== move.description) return null;
  return {
    ...supplied,
    name: move.name,
    ...(move.targeting ? { type: 'projectile', targeting: { ...move.targeting } } : {})
  };
}
