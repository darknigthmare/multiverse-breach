// Art direction for the original campaign roster, based on the project's
// existing sprites and story. These descriptions are targets for new art.
const NEXUS = 'Nexus de Convergence';

const hero = (id, name, incarnation, visualAnchor, sourceRecord = 'src/game/characterPlaques.js') => ({
  id, name, kind: 'hero', incarnation, visualAnchor, sourceRecord
});
const encounter = (kind, id, name, incarnation, visualAnchor) => ({
  id, name, kind, incarnation, visualAnchor, sourceRecord: 'src/game/enemies.js'
});
const enemy = (...fields) => encounter('enemy', ...fields);
const boss = (...fields) => encounter('boss', ...fields);

const designs = [
  hero('player_anchor', 'Ancre', 'Ancre vivante A.R.C.A. — cellule ZERO, après l’affectation à l’Atrium',
    'Casque intégral anthracite à repères jaunes, manteau long sombre fendu, bottes renforcées et signature cyan à une main. Le nom de l’Ancre appartient au joueur.', 'src/game/playerHero.js'),
  hero('arca_mirelle', 'Mirelle Suture', 'Mirelle Suture — pack original complet A.R.C.A., Cité-Mosaïque',
    'Grand chapeau noir pointu recourbé et manteau sombre à filigranes or. Visage découvert, cheveux noirs, cartes turquoise à croix claire et fils de résonance.', 'docs/cg/mirelle-reference-evidence-2026-10-18.json'),
  hero('arca_bastion', 'Bastion Korr', 'Bastion Korr — Gardien du Premier Rempart, cellule ZERO',
    'Armure lourde sombre à détails orange cuivré, cheveux noirs courts, grand bouclier à contour angulaire et marque du Rempart, arme longue distincte de la balise de protection.'),
  hero('arca_nova', 'Nova Vey', 'Nova Vey — analyse des Trames pour la cellule ZERO',
    'Chevelure courte argentée et tenue de terrain bleu nuit, câblage cyan et longue hampe lumineuse à deux pointes. Le contour reste fin et mobile.'),
  hero('arca_marrow', 'Marrow Kade', 'Marrow Kade — patrouilleur de la cellule ZERO à la Fonderie',
    'Visage marqué par l’ancienne blessure, cuir et manteau fendu prune noir, lame de fracture dentelée prolongée de corail. Conserver la cicatrice qui le distingue du double.'),
  hero('arca_sable', 'Sable Orison', 'Sable Orison — cartographe de l’Atrium, cellule ZERO',
    'Chapeau à large bord, long manteau sable et cuir brun, longue-vue levée à hauteur des yeux, équipement de balisage couleur or patiné.'),
  hero('arca_loom', 'Loom Ivara', 'Loom Ivara — récupération des Marges et cellule ZERO',
    'Tenue de récupération pétrole et laiton, capuche sombre, plaques résonantes et drone indépendant à noyau cyan. Le fil de retour relie l’outil à l’opératrice.'),
  hero('arca_tessera', 'Tessera Vale', 'Tessera Vale — après le verdict du Juge des Trames, acte I',
    'Personne autonome, chevelure courte mauve, manteau pourpre asymétrique et éclats brisés rose vif en orbite. Séparer sa silhouette de ses reflets possibles.'),
  hero('arca_quillon', 'Quillon Rusk', 'Quillon Rusk — contre-registre présenté à la Cité-Mosaïque, acte II',
    'Manteau d’auditeur brun sombre à accents ambre, cheveux bruns, registre rectangulaire or ouvert à la main et matériel de terrain à la ceinture.'),
  hero('arca_nadir', 'Nadir Kest', 'Nadir Kest — coureur du retour après la Cour des faux passages, acte III',
    'Équipement articulé bleu pétrole à épaules renforcées, harnais causal cyan visible au torse et petite sonde aérienne au bout du fil de retour.'),
  hero('arca_elyra', 'Elyra Null', 'Elyra Null — témoin du refus au Seuil blanc, acte IV',
    'Carré argenté, tenue courte blanche et violette à pans séparés, bottes claires et petits glyphes de refus à la main. Référence de cadrage corrigée à seize poses.'),
  hero('arca_oryn', 'Oryn Xile', 'Oryn Xile — porteur de noms de Route X, acte V',
    'Manteau d’atelier sombre à attaches corail, avant-bras bandés et grande lame de seuil à tranchant rouge. L’outil d’Oryn est gravé de noms propres à Route X.'),

  enemy(null, 'Echo Sans-Auteur', 'Echo Sans-Auteur — rencontre de base du Palimpseste',
    'Forme encapuchonnée creuse, masque sans traits au filet cyan et déchirures turquoise à la place des bords du vêtement. Griffes et éclats restent lisibles en silhouette.'),
  enemy(null, 'Archiviste Rompu', 'Archiviste Rompu — rencontre de base du Palimpseste',
    'Archiviste encapuchonné aux couches noir et or, volumes de registre empilés dans le dos et longue lame d’index portée bas.'),
  enemy(null, 'Noeud de Paradoxe', 'Noeud de Paradoxe — rencontre de base du Palimpseste',
    'Noyau suspendu sombre entouré de bandes violettes croisées et d’aiguilles d’archive en or. Corps sphérique et central, sans membres.'),
  enemy(null, 'Fragment Vagabond', 'Fragment Vagabond — rencontre de base du Palimpseste',
    'Assemblage en losange de cristaux corail pointus séparés par des vides noirs. Éclats latéraux détachés et pointe basse au lieu de jambes.'),
  enemy(null, 'Drone A.R.C.A. Corrompu', 'Drone A.R.C.A. Corrompu — rencontre de base du Palimpseste',
    'Coque ronde en métal usé aux appendices rigides et au grand œil cyan. Le faisceau part du bloc optique, le corps reste en vol.'),
  enemy(null, 'Double ideal de Marrow', 'Double ideal de Marrow — Fonderie des Éclats d’Origine, acte I',
    'Même base morphologique et lame de fracture que Marrow, dans une version pâle façonnée par la Fonderie. Un cristal d’Origine remplace la cicatrice de l’original. L’atlas partagé avec filtre ne dessine pas ce cristal.'),
  enemy(null, 'Matrice de Substitution', 'Matrice de Substitution — Fonderie des Éclats d’Origine, acte I',
    'Gyroscope horizontal d’anneaux noir et or, Éclat cyan suspendu au centre et petites pièces secondaires claires en orbite.'),
  enemy(null, 'Pelerin de la Fausse Sortie', 'Pelerin de la Fausse Sortie — Cour des faux passages, acte III',
    'Pèlerin voûté en robe sombre irrégulière, fenêtre de visage blanche vide et petits paliers bleus attachés au côté.'),
  enemy('oc_act1_reflet_vie_possible', 'Reflet de Vie Possible', 'Reflet de Vie Possible — les Vies qui arrivent, acte I',
    'Corps de facettes de miroir lilas, visage en ovale sans traits, crêtes cristallines aux épaules et miroir facetté tenu à côté. Silhouette distincte de Tessera.'),
  enemy('oc_act1_courtier_regret', 'Courtier du Regret', 'Courtier du Regret — les Vies qui arrivent, acte I',
    'Manteau court déchiqueté rouge brun, capuche en pointe, visage peu lisible et crochet recourbé tenu bas.'),
  enemy('oc_act2_scribe_registre_noir', 'Scribe du Registre Noir', 'Scribe du Registre Noir — Guerre des Ancrages, acte II',
    'Archiviste noir aux couches rectangulaires, plaque violette à la place du visage, reliures verticales au dos et longue plume d’index anguleuse.'),
  enemy('oc_act2_porte_verrou_endeuille', 'Porte-Verrou Endeuille', 'Porte-Verrou Endeuille — ancien Verrou d’Origine, acte II',
    'Automate massif articulé aux épaules épaisses vert-de-gris, colliers métalliques et cœur circulaire cyan dans le torse. Un bras fait office de bélier.'),
  enemy('oc_act3_indexeur_contradictions', 'Indexeur des Contradictions', 'Indexeur des Contradictions — Archives Impossibles, acte III',
    'Automate étroit de laiton, dos et tête encombrés de registres carrés, dispositif tranchant à deux branches tenu en avant.'),
  enemy('oc_act3_guide_issue_parfaite', 'Guide de l Issue Parfaite', 'Guide de l Issue Parfaite — Archives Impossibles, acte III',
    'Robe de guide ivoire brodée de bleu et d’or, écran facial vide dans un halo en arche. Hampe de portail à tête ouverte.'),
  enemy('oc_act4_rature_seuil_blanc', 'Rature du Seuil Blanc', 'Rature du Seuil Blanc — Vide blanc, acte IV',
    'Profil filiforme blanc et anthracite, tête en bec sombre, longs doigts et rubans de matière effacée qui se détachent du dos.'),
  enemy('oc_act4_simulacre_sans_choix', 'Simulacre Sans Choix', 'Simulacre Sans Choix — Vide blanc, acte IV',
    'Armure ronde pâle à épaules surdimensionnées, visage fermé, bouclier à centre violet. Le poids et les pieds restent lisibles au sol.'),
  enemy('oc_act5_vigie_coordonnee_x', 'Vigie de la Coordonnee X', 'Vigie de la Coordonnee X — Brèche Primordiale, acte V',
    'Balise A.R.C.A. tripode de métal sombre et de cyan, optique horizontale et anneau de coordonnées au-dessus des appuis mécaniques.'),
  enemy('oc_act5_contre_temoin_veyr', 'Contre-Temoin de Veyr', 'Contre-Temoin de Veyr — Brèche Primordiale, acte V',
    'Contrefaçon en manteau et capuche violets, masque strié et rédacteur de témoignage tenu en travers. Garder le corps séparé de Veyr et de son témoignage réel.'),

  boss(null, 'Greffier du Voile', 'Greffier du Voile — gardien du premier Verrou, prologue',
    'Robe noir et or à panneaux cyan d’archive, tête annulée par une fente lumineuse, registre en main et sceau circulaire au bout d’une hampe.'),
  boss(null, 'Juge des Trames', 'Juge des Trames — verdict des Archives statiques, acte I',
    'Grande robe de juge dorée et noire, collerette blanche ouverte, visage vide et haute arme verdict à couronne rayonnante.'),
  boss(null, 'Cartographe des Portes Mortes', 'Cartographe des Portes Mortes — corridor causal de Route X, acte V',
    'Protocole déchiqueté aux bandes de carte sombres suspendues, visage blanc évidé et longue hampe annotée à son extrémité.'),
  boss(null, 'Avatar du Sans-Auteur', 'Avatar du Sans-Auteur — Brèche Primordiale',
    'Manteau en éventail de ratures noires, ivoire et corail. Petit masque blanc au milieu d’une multitude de bords effilochés et longues griffes corail.'),
  boss('oc_act1_usurpateur_vies_possibles', 'Usurpateur des Vies Possibles', 'Usurpateur des Vies Possibles — les Vies qui arrivent, acte I',
    'Figure drapée pourpre, couronne de longues pointes de cristal rose et visages possibles incrustés autour du torse.'),
  boss('oc_act2_intendant_sacrifice_muet', 'Intendant du Sacrifice Muet', 'Intendant du Sacrifice Muet — Guerre des Ancrages, acte II',
    'Autorité encapuchonnée à l’ample robe ardoise, chaînes pesantes partant d’une balance et masse suspendue au bout d’une chaîne.'),
  boss('oc_act3_conservateur_causes_absentes', 'Conservateur des Causes Absentes', 'Conservateur des Causes Absentes — Archives Impossibles, acte III',
    'Gardien drapé à tête haute aux couches d’or vieilli et d’ivoire, penché vers le grand codex ouvert devant lui.'),
  boss('oc_act4_heraut_paix_illisible', 'Heraut de la Paix Illisible', 'Heraut de la Paix Illisible — Seuil blanc, acte IV',
    'Figure presque blanche aux bandes tombantes, halo de plaques séparées et haut sceptre à disque blanc. Le visage étroit se perd dans l’assemblage.'),
  boss('oc_act5_arbitre_cause_unique', 'Arbitre de la Cause Unique', 'Arbitre de la Cause Unique — Brèche Primordiale, acte V',
    'Longue armure de juge nuit bordée d’or, casque haut à grille cyan et marteau de verdict à segment cyan au bout d’un manche sombre.'),
  encounter('worldBoss', null, 'Moteur de Convergence Instable', 'Moteur de Convergence Instable — menace mondiale du Nexus',
    'Machine volante à grand noyau cyan et anneaux d’engrenages concentriques en laiton. Tiges violettes et lames céramiques claires entourent le cœur.')
];

const byId = new Map();
const byName = new Map();
for (const design of designs) {
  Object.freeze(design);
  const index = design.id ? byId : byName;
  index.set(design.id || design.name, design);
}

export function getNexusActorDesign(actor) {
  if (actor?.universe !== NEXUS) return null;
  if (actor.id === 'player_anchor') return actor.isPlayer === true ? byId.get(actor.id) : null;
  const design = actor.id ? byId.get(actor.id) : byName.get(actor.name);
  return design?.name === actor.name ? design : null;
}
