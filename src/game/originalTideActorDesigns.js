// Original designs for the tides, shattered kingdoms and First Song campaign
// actors. Visual anchors describe the existing project reference.
const sourceRecord = 'src/game/originalUniversesManifest.json';

const record = (kind, name, incarnation, visualAnchor, rpgMove = null) => Object.freeze({
  kind, name, incarnation, visualAnchor, rpgMove, sourceRecord
});
const hero = (...values) => record('hero', ...values);
const enemy = (...values) => record('enemy', ...values);
const boss = (...values) => record('boss', ...values);
const worldBoss = (...values) => record('worldBoss', ...values);
const move = (name, description, action = {}) => Object.freeze({ name, description, ...action });

const lighthouseBeam = {
  type: 'beam', targeting: Object.freeze({ delivery: 'beam', shape: 'line' })
};
const briarGuard = {
  type: 'shield', dmg: 0,
  targeting: Object.freeze({ effect: 'guard', targetSide: 'ally', shape: 'group', reduce: 0.4, duration: 3 })
};

const byUniverse = new Map(Object.entries({
  'The Crownless Sea': {
    ysara_flint: hero('Capitaine Ysara Flint', 'Capitaine élue de l’équipage sans pavillon',
      'Cheveux bruns aux boucles longues, manteau de pont bleu aux ganses or, écharpe jaune, sabre recourbé et pistolet séparés.'),
    milo_quill: hero('Milo Quill', 'Cartographe des courants impossibles',
      'Silhouette légère en manteau bleu court et chemise claire, cheveux bruns hérissés, sacoche de cartographie en bandoulière et bottes brunes.'),
    brann_crow: hero('Brann Crow', 'Charpentier des équipages libérés',
      'Charpentier barbu au manteau brun à panneaux jaunes, manche de chemise roulée et grande hache de pont tenue à une main.'),
    'crownless_sea:corsaire_noye': enemy('Corsaire noyé', 'Corsaire du Cimetière du Calme Mort',
      'Grand tricorne noir, squelette de manteau rongé, pans rouges déchirés et bouclier piqué de pointes et de dépôts marins.'),
    'crownless_sea:goule_a_poudre': enemy('Goule à poudre', 'Préposé maudit aux barils de pont',
      'Goule voûtée aux bandes rouges, visage osseux, plaques sombres et charge cerclée tenue bas au bout du bras.'),
    'crownless_sea:sirene_de_recif': enemy('Sirène de récif', 'Sirène des hauts-fonds sans pavillon',
      'Buste bleu, longue queue aquatique recourbée, filaments corail des nageoires et hampe rouge à tête ajourée.'),
    'crownless_sea:fusilier_de_la_marine_de_la_couronne': enemy('Fusilier de la Marine de la Couronne', 'Fusilier de marine du Port Sans Pavillon',
      'Coiffe haute à panache rouge, long uniforme sombre à bordures rouges, arme longue à monture rouge et or.'),
    'crownless_sea:coffre_mimetique': enemy('Coffre mimétique', 'Leurre vivant du trésor de pont',
      'Coffre rouge ferré d’or et boucle carrée. Les deux couvercles deviennent mâchoires dentées autour d’une langue, les griffes portent le corps.'),
    'crownless_sea:amiral_chain': boss('Amiral Chain', 'Commandant du Port Sans Pavillon',
      'Amiral à tricorne, barbe grise, grand manteau militaire sombre et pourpre, sceptre d’autorité nautique à signal rouge.',
      move('Dette des chaînes', 'Enchaîne les navires et transforme chaque déplacement en coût de dette.')),
    'crownless_sea:sorciere_du_calme_mort': boss('Sorcière du Calme Mort', 'Sorcière du Cimetière du Calme Mort',
      'Officiante sombre au haut voile déchiré, robe noir et corail à base ample et globe rouge au sceptre.',
      move('Brume du Calme Mort', 'Supprime le vent, ralentit les projectiles et invoque des silhouettes dans la brume.')),
    'crownless_sea:pretre_du_leviathan': boss('Prêtre du Léviathan', 'Officiant du Maelström du Kraken',
      'Haute silhouette cérémonielle, drapés de corde corail et cuir noir, coiffe à pointes et longue arme d’offrande en forme d’ancre.',
      move('Offrande sous la coque', 'Sacrifie des sections de pont pour nourrir une créature sous la coque.')),
    'crownless_sea:kraken_sans_couronne': worldBoss('Kraken Sans Couronne', 'Kraken du Maelström sans couronne',
      'Masse noire sans corps humanoïde, cœur rouge et tentacules à rangées de ventouses corail. La référence initiale est une pose fixe.',
      move('Emprise du Maelström', 'Huit tentacules occupent des zones distinctes, volent les objectifs et ne rendent le cœur vulnérable qu’après une bordée coordonnée.'))
  },
  'The Drowned Testament': {
    mara_ell: hero('Dr Mara Ell', 'Xénolinguiste de l’Institut Pelagic',
      'Chignon sombre, manteau de terrain bleu pétrole à ceinture de cuir, instrument de traduction à globe cyan allumé.'),
    jonas_mire: hero('Jonas Mire', 'Gardien du phare de Greywake',
      'Cheveux et barbe bruns, manteau long noir à col levé, gilet et ceinture de gardien dans des tons bruns et gris ardoise.'),
    oona_vell: hero('Oona Vell', 'Cartographe des rêves de Greywake',
      'Manteau violet en pans effilés, visage clair sous une capuche, cadran de marche suspendu à une chaîne et éclat de rêve violet.'),
    'drowned_testament:cultiste_lie_au_sel': enemy('Cultiste lié au sel', 'Cultiste lié au sel de Greywake',
      'Capuche sombre à visage masqué, cordes de sel et longue robe aux déchirures violettes, flamme dans une main et hampe dans l’autre.'),
    'drowned_testament:sangsue_de_reve': enemy('Sangsue de rêve', 'Parasite onirique de Greywake',
      'Corps sombre bas et courbé, tête ovoïde à pointe, griffes très longues et volutes améthyste issues du dos.'),
    'drowned_testament:rejeton_du_ch_ur_profond': enemy('Rejeton du Chœur Profond', 'Rejeton de la Basilique sous la Marée',
      'Petite silhouette monstrueuse en appui bas, tête en anneau noir lumineux sans traits et excroissance minérale pourpre.'),
    'drowned_testament:traqueur_d_angles': enemy('Traqueur d’angles', 'Traqueur de l’Observatoire des Angles Impossibles',
      'Tête creuse triangulaire à bords violet vif, corps noir fin aux angles marqués, longue griffe courbe lumineuse et pans effilochés.'),
    'drowned_testament:coquille_couverte_de_balanes': enemy('Coquille couverte de balanes', 'Ancien habitant de Greywake vidé de sa voix',
      'Armure trapue encroûtée de balanes roses et ocre, visage fermé, grand bouclier rond grêlé et arme courte incrustée.'),
    'drowned_testament:le_phare_qui_regarde': boss('Le Phare qui Regarde', 'Phare de Greywake à marée basse',
      'Tour sombre vivante à tourelle et faisceau violet, série d’yeux en façade et tentacules servant de fondation. La référence initiale est fixe.',
      move('Faisceau du Phare', 'Son faisceau suit le joueur, inverse ombre et lumière et ouvre un œil à chaque tour complet.', lighthouseBeam)),
    'drowned_testament:le_ch_ur_sous_la_ville': boss('Le Chœur sous la Ville', 'Chœur de Greywake sous la Ville',
      'Officiant violet à épaules rayonnantes, voiles de bras et traits lumineux horizontaux séparés autour d’un haut sceptre circulaire.',
      move('Accord sous la ville', 'Chaque voix contrôle une couche sonore; couper les mauvaises voix renforce les autres.')),
    'drowned_testament:cartographe_des_angles_impossibles': boss('Cartographe des Angles Impossibles', 'Maître de l’Observatoire des Angles Impossibles',
      'Robe noir violet et cuivre à arêtes géométriques, couronne discrète, polyèdre en main et orbe de mesure sur une hampe.',
      move('Pli de l’Observatoire', 'Plie la grille, superpose les cases et transforme la distance en variable.')),
    'drowned_testament:le_dormeur_derriere_la_maree': worldBoss('Le Dormeur derrière la Marée', 'Entité invoquée par le Testament',
      'Entité sans visage, vaste manteau gris bleu et tentacules pâles descendants, halo sombre et source améthyste tenue à gauche.',
      move('Pression de Rêve', 'Entité cosmique entièrement originale : sa présence augmente la Pression de Rêve, fait reculer le littoral et ne peut être repoussée qu’en détruisant le Testament qui l’appelle.'))
  },
  'Valedor: The Shattered Crown': {
    aelwen_starbough: hero('Aelwen Starbough', 'Éclaireuse des Sept Serments',
      'Elfe à longue chevelure claire, manteau forestier à pans verts et beiges, arc long en bois portant de petites feuilles.'),
    brokk_embervein: hero('Brokk Embervein', 'Forgeron nain des Sept Serments',
      'Silhouette large et courte, lourde barbe rousse, épaulières de cuir et acier, tablier sombre et grande boucle de forge.'),
    goruk_ash_tusk: hero('Goruk Ash-Tusk', 'Chef orc élu du Trône aux Sept Fragments',
      'Orc massif vert olive aux défenses visibles, peau et bras découverts, colliers d’ossements et pagne brun à pièces de fourrure.'),
    'valedor_shattered_crown:sapeur_gobelin_mercenaire': enemy('Sapeur gobelin mercenaire', 'Sapeur mercenaire de la Cité Libre',
      'Petit gobelin encapuchonné et penché, harnais de charge orange, lame incurvée et une mèche allumée au bout du bras.'),
    'valedor_shattered_crown:chevalier_creux': enemy('Chevalier creux', 'Armure du serment sans porteur',
      'Armure noire et bronze dont le casque n’abrite aucun visage, lambeaux effilés orange et bouclier bombé à moyeu chaud.'),
    'valedor_shattered_crown:brute_troll_des_ponts': enemy('Brute troll des ponts', 'Gardien du pont contesté',
      'Troll massif gris vert et pierreux, tresse et chiffons bruns, dents et pieds larges et masse hérissée d’éclats minéraux.'),
    'valedor_shattered_crown:matriarche_araignee_des_ruines': enemy('Matriarche araignée des ruines', 'Matriarche des toiles des ruines',
      'Abdomen globuleux caparaçonné et pattes d’araignée cuivrées sous un buste dressé, hampe à lumière orange et crête haute.'),
    'valedor_shattered_crown:archer_spectre_de_l_ancienne_cour': enemy('Archer spectre de l’ancienne cour', 'Archer spectral des anciennes bannières',
      'Archer sans traits à capuche étroite, vêtements gris brun en lambeaux et grand arc à bois doré noueux.'),
    'valedor_shattered_crown:lich_sans_couronne': boss('Lich Sans Couronne', 'Lich du Carrefour de la Cité Libre',
      'Crâne lumineux turquoise au-dessus d’une longue robe noire et violette, couronne brisée et hampe à foyer orange.',
      move('Serments brisés', 'Anime les serments brisés et change de corps tant qu’un fragment de Couronne reste actif.')),
    'valedor_shattered_crown:dragon_du_pic_creux': boss('Dragon du Pic Creux', 'Dragon gardien des mémoires du Pic Creux',
      'Dragon aux ailes larges cuivrées, cornes et gueule oranges, longues griffes et éclats de trésor sous le ventre.',
      move('Écailles du Pic Creux', 'Protège un trésor composé de mémoires volées; ses écailles s’ouvrent lorsque les reliques sont rendues.')),
    'valedor_shattered_crown:reine_des_ronces': boss('Reine des Ronces', 'Reine du Trône aux Sept Fragments',
      'Figure de branches et d’écorce verte en robe de racines, couronne végétale et grandes roues de ronces dorées. La référence initiale est fixe.',
      move('Forêt défensive', 'Étend une forêt défensive qui distingue intrus, réfugiés et anciens propriétaires.', briarGuard)),
    'valedor_shattered_crown:vaelgor_premier_wyrm': worldBoss('Vaelgor, Premier Wyrm', 'Wyrm réveillé par les sept fragments',
      'Dragon noir à longues ailes brunes à liserés cuivre, cornes dorées et noyaux orange dans les griffes et le corps. La référence initiale est fixe.',
      move('Récits du Premier Wyrm', 'Dragon primordial réveillé par les sept fragments : chaque royaume l’a raconté différemment, et il change de phase selon la version dominante.'))
  },
  'Mythos Primordia': {
    astra_vey: hero('Astra Vey', 'Cartographe des constellations antérieures aux dieux',
      'Longue chevelure sombre, tenue noire et violette à pans longs et petites attaches dorées. Cartographie des constellations pour son rôle.'),
    korun_stoneborn: hero('Korun Né-de-Pierre', 'Enfant de la montagne d’avant les temples',
      'Montagnard large aux cheveux bruns et à la barbe courte, épaules minérales dénudées et étoffes grises à ceinture de métal.'),
    nyme_first_song: hero('Nyme du Premier Chant', 'Chanteuse des choses encore sans nom',
      'Longues mèches violettes et roses étalées, robes superposées pourpres brodées d’or et mains libres écartées pour le chant.'),
    'mythos_primordia:le_dieu_d_avant_les_noms': worldBoss('Le Dieu d’Avant les Noms', 'Entité de l’Archive des Mythes à Naître',
      'Entité flottante à halo circulaire magenta autour d’un visage sombre, pans bleus et violets, hampe cristalline et éclats corail.',
      move('Dénomination', 'Entité entièrement originale née lorsque le Sans-Auteur prétend qu’un seul récit existait avant tous les autres; ses phases sont Foi, Peur, Contradiction et Dénomination.'))
  }
}));

export function getOriginalTideActorDesign(actor) {
  const entries = byUniverse.get(actor?.universe);
  const design = entries && Object.hasOwn(entries, actor?.id) ? entries[actor.id] : null;
  return design?.name === actor?.name ? design : null;
}
