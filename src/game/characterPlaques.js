// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcGearsOfWar from '../../DLC/GearsOfWar/data/characterPlaques.js';
import * as dlcHalo from '../../DLC/Halo/data/characterPlaques.js';
import * as dlcStarWars from '../../DLC/StarWars/data/characterPlaques.js';
import * as dlcMinions from '../../DLC/Minions/data/characterPlaques.js';
import * as dlcAlien from '../../DLC/Alien/data/characterPlaques.js';
import * as dlcAliens from '../../DLC/Aliens/data/characterPlaques.js';
import * as dlcPredator from '../../DLC/Predator/data/characterPlaques.js';
import * as dlcResidentEvil from '../../DLC/ResidentEvil/data/characterPlaques.js';
import * as dlcSilentHill from '../../DLC/SilentHill/data/characterPlaques.js';
import * as dlcDinoCrisis from '../../DLC/DinoCrisis/data/characterPlaques.js';
import * as dlcTheMatrix from '../../DLC/TheMatrix/data/characterPlaques.js';
import * as dlcBuckethead from '../../DLC/Buckethead/data/characterPlaques.js';
import * as dlcKaamelott from '../../DLC/Kaamelott/data/characterPlaques.js';
import * as dlcStargate from '../../DLC/Stargate/data/characterPlaques.js';
import * as dlcHalfLife from '../../DLC/HalfLife/data/characterPlaques.js';
import * as dlcPortal from '../../DLC/Portal/data/characterPlaques.js';
import * as dlcMetalGear from '../../DLC/MetalGear/data/characterPlaques.js';
import * as dlcDeadSpace from '../../DLC/DeadSpace/data/characterPlaques.js';
import * as dlcMassEffect from '../../DLC/MassEffect/data/characterPlaques.js';
import * as dlcDoom from '../../DLC/Doom/data/characterPlaques.js';
import * as dlcAttackOnTitan from '../../DLC/AttackOnTitan/data/characterPlaques.js';
import * as dlcAnother from '../../DLC/Another/data/characterPlaques.js';
import * as dlcCellsAtWork from '../../DLC/CellsAtWork/data/characterPlaques.js';
import * as dlcDandadan from '../../DLC/Dandadan/data/characterPlaques.js';
import * as dlcDeathNote from '../../DLC/DeathNote/data/characterPlaques.js';
import * as dlcDiscworld from '../../DLC/Discworld/data/characterPlaques.js';
import * as dlcGhostInTheShell from '../../DLC/GhostInTheShell/data/characterPlaques.js';
import * as dlcGunnm from '../../DLC/Gunnm/data/characterPlaques.js';
import * as dlcInuyashiki from '../../DLC/Inuyashiki/data/characterPlaques.js';
import * as dlcNegima from '../../DLC/Negima/data/characterPlaques.js';
import * as dlcKungPow from '../../DLC/KungPow/data/characterPlaques.js';
import * as dlcLaCiteDeLaPeur from '../../DLC/LaCiteDeLaPeur/data/characterPlaques.js';
import * as dlcLeCinquiemeElement from '../../DLC/LeCinquiemeElement/data/characterPlaques.js';
import * as dlcM3GAN from '../../DLC/M3GAN/data/characterPlaques.js';
import * as dlcMarsAttacks from '../../DLC/MarsAttacks/data/characterPlaques.js';
import * as dlcMeetTheFeebles from '../../DLC/MeetTheFeebles/data/characterPlaques.js';
import * as dlcOnechanbara from '../../DLC/Onechanbara/data/characterPlaques.js';
import * as dlcPingu from '../../DLC/Pingu/data/characterPlaques.js';

import { LORE_DB } from './lore';
import { getUniverseSignature } from './loreDescriptions';
import { FEATURED_CHARACTER_PLAQUES } from './featuredUniversePacks';
import { SOLAR_OPPOSITES_SIREN_STAR_WARS_CHARACTER_PLAQUES } from './solarOppositesSirenStarWarsPack.js';
import { getCanonP0SourcePlaque } from './canonP0SourceKits.js';
import { getCanonBlackPearlSourcePlaque } from './canonBlackPearlSourceKits.js';

export const CHARACTER_PLAQUES = {
  player_anchor: {
    clearance: 'ARC-00',
    rank: { fr: 'Ancre vivante', en: 'Living Anchor' },
    role: { fr: 'Commandant joueur', en: 'Player commander' },
    callSign: 'Ancre',
    origin: { fr: 'Nexus de Convergence', en: 'Nexus of Convergence' },
    dossier: {
      fr: 'Le premier heros n est pas invoque par portail: c est le joueur lui-meme, une signature assez stable pour rester entiere quand plusieurs Trames se superposent. A.R.C.A. le classe comme Ancre vivante, capable de retenir une trace Nexus, commander les cellules et servir de cle aux futures Ancres partagees.',
      en: 'The first hero is not summoned through a portal: it is the player, a signature stable enough to remain whole when several Threads overlap. A.R.C.A. classifies this profile as a living Anchor, able to retain a Nexus trace, command cells, and serve as the key to future shared Anchors.'
    },
    doctrine: {
      fr: 'Commandement d Ancrage: stabilisation de l equipe, lecture des failles et resistance aux suppressions du Sans-Auteur.',
      en: 'Anchor Command: squad stabilization, breach reading, and resistance against Authorless deletion.'
    },
    tags: ['Nexus', 'Ancre', 'A.R.C.A.', 'Player']
  },
  arca_bastion: {
    clearance: 'ARC-BSTN',
    rank: { fr: 'Gardien du Premier Rempart', en: 'First Bulwark Guardian' },
    role: { fr: 'Protection lourde et controle de passage', en: 'Heavy protection and passage control' },
    callSign: 'Bastion',
    origin: { fr: 'Nexus de Convergence - Atrium avant la Premiere Breche', en: 'Nexus of Convergence - Atrium before the First Breach' },
    dossier: {
      fr: 'Bastion Korr commandait les equipes de securite de l Atrium quand Veyr ouvrit le premier reseau de passages. Il ne vient donc d aucune franchise annexe: son monde d origine est la Cite-Mosaique avant qu elle porte ce nom, lorsque chaque porte exigeait encore une cause, un registre et une personne responsable de sa fermeture. Pendant la Premiere Breche, Bastion maintint le Rempart Est assez longtemps pour evacuer neuf cellules, mais accepta de condamner une dixieme route dont A.R.C.A. effaca ensuite les noms. Depuis, son bouclier hexagonal n est pas un symbole d invulnerabilite; c est la preuve visible de chaque direction qu il choisit de proteger au prix des autres.',
      en: 'Bastion Korr commanded Atrium security teams when Veyr opened the first passage network. He therefore comes from no side franchise: his origin world is Mosaic City before it carried that name, when every door still required a cause, a record, and someone responsible for closing it. During the First Breach, Bastion held the East Bulwark long enough to evacuate nine cells, but agreed to condemn a tenth route whose names A.R.C.A. later erased. His hexagonal shield is not a symbol of invulnerability; it is visible proof of every direction he chooses to protect at the expense of another.'
    },
    doctrine: {
      fr: 'Dans la cellule ZERO, Bastion transforme la culpabilite en geometrie tactique: Rafale Atrium pour fixer une menace, Balise Barricade pour definir une route sure, Rempart d Ancre pour absorber une suppression et Verrou de Convergence pour condamner un passage mensonger. La Cour des faux passages lui offre une Cite parfaite ou personne n est mort sous son commandement. Il la refuse parce que cette victoire ignore les noms des sauves. Son arc Breach consiste a tenir une ligne reelle, imparfaite et partagee plutot qu a devenir le gardien solitaire d un monde invente pour le pardonner.',
      en: 'Within Cell ZERO, Bastion turns guilt into tactical geometry: Atrium Burst pins a threat, Barricade Beacon defines a safe route, Anchor Bulwark absorbs deletion, and Convergence Lock seals a deceptive passage. The Court of False Passages offers him a perfect City where nobody died under his command. He refuses it because that victory does not know the names of those it claims he saved. His Breach arc is about holding a real, imperfect, shared line instead of becoming the lone guardian of a world invented to forgive him.'
    },
    threat: {
      fr: 'Risque A.R.C.A.: les portails de regret peuvent convertir son instinct de protection en immobilisme et forcer toute la cellule a defendre une position deja perdue.',
      en: 'A.R.C.A. risk: regret portals can turn his protective instinct into paralysis and force the whole cell to defend a position already lost.'
    },
    tags: ['Nexus', 'A.R.C.A.', 'Rempart', 'Portails', 'Tactical']
  },
  arca_nova: {
    clearance: 'ARC-NOVA',
    rank: { fr: 'Analyste des possibles', en: 'Possibility Analyst' },
    role: { fr: 'Lecture de Trame et stabilisation mobile', en: 'Thread reading and mobile stabilization' },
    callSign: 'Nova',
    origin: { fr: 'Nexus de Convergence - Observatoire Veyr avant la Premiere Breche', en: 'Nexus of Convergence - Veyr Observatory before the First Breach' },
    dossier: {
      fr: 'Nova Vey grandit dans l Observatoire Veyr, une institution chargee de comparer les consequences probables avant l ouverture d un passage. Son monocle cyan ne predit pas l avenir: il superpose les routes qui possedent encore une cause mesurable. La nuit de la Premiere Breche, Nova detecta trente-deux issues plausibles et recommanda celle qui sauvait le plus grand nombre. Cette route mena pourtant a la disparition du secteur dont A.R.C.A. effaca ensuite le registre. Depuis, elle refuse de confondre probabilite et justice. Son baton bifurque est un diapason de resonance qui interroge une Trame sans lui imposer une reponse.',
      en: 'Nova Vey grew up in Veyr Observatory, an institution tasked with comparing probable consequences before a passage was opened. Her cyan monocle does not predict the future: it overlays routes that still possess a measurable cause. On the night of the First Breach, Nova detected thirty-two plausible exits and recommended the one that saved the greatest number. That route nevertheless led to the disappearance of the sector A.R.C.A. later erased from its ledger. Since then, she refuses to confuse probability with justice. Her forked staff is a resonance tuner that questions a Thread without forcing an answer upon it.'
    },
    breachLore: {
      fr: 'Dans la cellule ZERO, Nova lit les failles comme des choix encore ouverts. Ping de Trame revele une faiblesse causale, Surcadence A.R.C.A. synchronise les allies, Reflexe d Ancre traverse une prediction hostile et Reboot de Faille rend au terrain sa derniere version stable. Dans la Fonderie des Eclats d Origine, le Sans-Auteur lui offre une machine parfaite ou chaque perte peut etre evitee en supprimant les decisions imprevisibles. Nova la refuse: une Trame sans risque n est plus une histoire vecue, seulement un calcul ferme. Son arc consiste a fournir des options a l Ancre sans jamais choisir a sa place.',
      en: 'Within Cell ZERO, Nova reads breaches as choices that remain open. Thread Ping reveals a causal weakness, A.R.C.A. Overclock synchronizes allies, Anchor Reflex crosses a hostile prediction, and Breach Reboot restores the terrain last stable version. In the Origin Shard Foundry, the Authorless offers her a perfect machine where every loss can be avoided by deleting unpredictable decisions. Nova refuses it: a Thread without risk is no longer a lived story, only a closed calculation. Her arc is about giving the Anchor options without ever choosing in their place.'
    },
    doctrine: { fr: 'Monocle de lecture, diapason de resonance, scan causal, surcadence de cellule, reboot local.', en: 'Reading monocle, resonance tuner, causal scan, cell overclock, local reboot.' },
    threat: { fr: 'Risque A.R.C.A.: une surcharge de futurs possibles peut la figer dans l analyse ou lui faire traiter un sacrifice humain comme une simple valeur optimale.', en: 'A.R.C.A. risk: too many possible futures can trap her in analysis or make her treat a human sacrifice as a merely optimal value.' },
    tags: ['Nexus', 'A.R.C.A.', 'Possibles', 'Scan', 'Hacker']
  },
  arca_marrow: {
    clearance: 'ARC-MRW',
    rank: { fr: 'Chasseur de sceaux', en: 'Seal Hunter' },
    role: { fr: 'Execution de paradoxes et rupture de doubles', en: 'Paradox execution and duplicate breaking' },
    callSign: 'Marrow',
    origin: { fr: 'Nexus de Convergence - Patrouilles exterieures du Rempart', en: 'Nexus of Convergence - Outer Bulwark patrols' },
    dossier: {
      fr: 'Marrow Kade appartenait aux patrouilles qui coupaient les passages devenus irreversibles avant la fondation officielle d A.R.C.A. Sa lame de fracture est forgee avec les bords refroidis de trois portails condamnes; elle ne tranche correctement que ce qui possede deux continuations incompatibles. La cicatrice de son visage vient de sa premiere erreur: il attaqua une copie parfaite d un coequipier avant de comprendre que l original et le double partageaient encore la meme memoire. Il sauva l original, mais condamna la copie consciente. Marrow porte depuis le poids de cette distinction et refuse toute execution fondee sur une simple ressemblance.',
      en: 'Marrow Kade served among the patrols that severed irreversible passages before A.R.C.A. was formally founded. His fracture blade is forged from the cooled edges of three condemned portals; it cuts cleanly only through something holding two incompatible continuations. The scar on his face came from his first mistake: he attacked a perfect copy of a teammate before realizing original and duplicate still shared the same memory. He saved the original but condemned the conscious copy. Marrow has carried the weight of that distinction ever since and refuses any execution based on resemblance alone.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Marrow intervient quand une anomalie a deja appris a porter un nom. Coupe-Sceau rompt ses protections, Entaille de Breche ouvre une ligne dans sa causalite, Pas Entre Deux esquive par une route condamnee et Execution de Paradoxe force deux versions incompatibles a declarer laquelle choisit de continuer. A la Fonderie, son double ideal ne possede ni cicatrice ni dette et lui promet une vie ou aucune copie n a souffert. Marrow le detruit seulement apres que le double revendique le droit de remplacer tous les autres. Son arc ne consiste pas a tuer les faux, mais a proteger le droit de chaque conscience a prouver ce qu elle est devenue.',
      en: 'In Multiverse Breach, Marrow intervenes once an anomaly has learned to wear a name. Seal Cut breaks its protections, Breach Gash opens a line through its causality, Step Between Two dodges along a condemned route, and Paradox Execution forces incompatible versions to declare which one chooses to continue. At the Foundry, his ideal double bears neither scar nor debt and promises a life where no copy suffered. Marrow destroys it only after the double claims the right to replace everyone else. His arc is not about killing what is false, but protecting every consciousness right to prove what it has become.'
    },
    doctrine: { fr: 'Lame de fracture, lecture de sceau, pas de phase, duel de double, execution conditionnelle.', en: 'Fracture blade, seal reading, phase step, duplicate duel, conditional execution.' },
    threat: { fr: 'Risque A.R.C.A.: le Sans-Auteur peut falsifier une signature de remplacement et retourner son instinct d execution contre une version innocente.', en: 'A.R.C.A. risk: the Authorless can forge a replacement signature and turn his execution instinct against an innocent version.' },
    tags: ['Nexus', 'A.R.C.A.', 'Paradoxe', 'Fracture', 'Slayer']
  },
  arca_sable: {
    clearance: 'ARC-SBL',
    rank: { fr: 'Cartographe des routes assumees', en: 'Cartographer of Accountable Routes' },
    role: { fr: 'Reconnaissance, balisage et preuve de terrain', en: 'Reconnaissance, marking, and field evidence' },
    callSign: 'Sable',
    origin: { fr: 'Nexus de Convergence - Corps des Cartographes de l Atrium', en: 'Nexus of Convergence - Atrium Cartographer Corps' },
    dossier: {
      fr: 'Avant A.R.C.A., Sable Orison parcourait les marges de l Atrium pour dessiner les passages qui apparaissaient plus vite que les institutions ne pouvaient les nommer. Son chapeau, sa longue-vue et son manteau sable ne sont pas un uniforme ceremonial: ils viennent des semaines passees dans des secteurs ou la lumiere, la gravite et les distances changeaient apres chaque ouverture. Sable signait chaque carte avec les noms de ceux qui avaient mesure la route. Lors de la Premiere Breche, ses releves prouverent qu une dixieme voie d evacuation avait existe, mais le Registre noir absorba ses coordonnees et transforma ses temoins en erreurs administratives.',
      en: 'Before A.R.C.A., Sable Orison crossed the Atrium margins to chart passages appearing faster than institutions could name them. Her hat, scope, and sand-colored coat are not ceremonial uniform: they come from weeks spent in sectors where light, gravity, and distance changed after every opening. Sable signed each map with the names of those who measured the route. During the First Breach, her surveys proved a tenth evacuation route had existed, but the Black Ledger absorbed its coordinates and turned its witnesses into administrative errors.'
    },
    breachLore: {
      fr: 'Dans la cellule ZERO, Sable refuse les cartes qui pretendent etre neutres. Tir de Balise fixe une coordonnee dans le combat, Mine de Lecture enregistre ce qui la traverse, Couverture Archivee restaure un abri prouve et Barrage du Cartographe transforme ses releves en corridor de tir. Dans le Registre des absents, elle decouvre que ses propres cartes avaient servi a choisir le secteur sacrifie. Elle ne detruit pas A.R.C.A.: elle force l organisation a publier la dette, les criteres et les noms. Son arc Breach affirme qu une route sure n est pas celle qui cache son cout, mais celle dont quelqu un accepte de repondre.',
      en: 'Within Cell ZERO, Sable rejects maps that pretend to be neutral. Beacon Shot fixes a coordinate in battle, Reading Mine records what crosses it, Archived Cover restores a proven shelter, and Cartographer Barrage turns her surveys into a firing corridor. In the Ledger of the Absent, she discovers her own maps were used to choose the sacrificed sector. She does not destroy A.R.C.A.; she forces the organization to publish the debt, the criteria, and the names. Her Breach arc states that a safe route is not one hiding its cost, but one someone accepts responsibility for.'
    },
    doctrine: { fr: 'Longue-vue causale, fusil de balise, carte vivante, mine de lecture, corridor cartographie.', en: 'Causal scope, beacon rifle, living map, reading mine, mapped firing corridor.' },
    threat: { fr: 'Risque A.R.C.A.: une carte falsifiee peut retourner son besoin de preuve contre elle et lui faire defendre une coordonnee qui n a jamais existe.', en: 'A.R.C.A. risk: a forged map can turn her need for evidence against her and make her defend a coordinate that never existed.' },
    tags: ['Nexus', 'A.R.C.A.', 'Cartographie', 'Registre noir', 'Tactical']
  },
  arca_loom: {
    clearance: 'ARC-LOOM',
    rank: { fr: 'Tisseuse de lignes de vie', en: 'Lifeline Weaver' },
    role: { fr: 'Extraction, soin de Trame et verification d issue', en: 'Extraction, Thread repair, and exit verification' },
    callSign: 'Loom',
    origin: { fr: 'Nexus de Convergence - Service de recuperation des Marges', en: 'Nexus of Convergence - Margin Recovery Service' },
    dossier: {
      fr: 'Loom Ivara appartenait aux equipes qui entraient dans une route apres les cartographes et avant les archivistes. Elle retrouvait les blesses, posait des plaques resonantes sur les structures instables et maintenait un fil de retour avec son drone de suture. Pendant la Premiere Breche, Loom suivit ce fil jusqu a la dixieme route condamnee. Le signal revint sans les personnes qu il devait guider, charge de voix dont les dossiers n existaient deja plus. Elle conserva clandestinement ces voix dans le noyau cyan de son drone, faisant de son outil medical une archive vivante que le Sans-Auteur ne parvient pas a classer.',
      en: 'Loom Ivara served on teams entering a route after the cartographers and before the archivists. She recovered the wounded, placed resonance plates on unstable structures, and maintained a return thread through her suture drone. During the First Breach, Loom followed that thread into the condemned tenth route. The signal returned without the people it was meant to guide, carrying voices whose records had already ceased to exist. She secretly preserved those voices in her drone cyan core, turning a medical tool into a living archive the Authorless cannot classify.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Loom juge une issue par ce qu elle peut ramener, jamais par la perfection du monde qu elle montre. Rafale d Origine repousse ce qui coupe le fil, Drone de Suture maintient un allie lisible, Plaque Resonante empeche une suppression et Ligne de Vie Nexus retisse les signatures d une cellule entiere. Dans la Cour des faux passages, elle detecte que les refuges parfaits ne possedent aucun signal de retour: ils savent attirer, mais pas rendre. Son arc consiste a accepter que sauver une personne ne restaure pas toujours son monde, puis a garantir qu aucune extraction reelle ne soit effacee pour simplifier le rapport.',
      en: 'In Multiverse Breach, Loom judges an exit by what it can bring back, never by the perfection of the world it displays. Origin Burst pushes away what cuts the thread, Suture Drone keeps an ally readable, Resonance Plate prevents deletion, and Nexus Lifeline reweaves an entire cell signatures. In the Court of False Passages, she detects that perfect refuges have no return signal: they know how to attract, but not how to release. Her arc is about accepting that saving a person does not always restore their world, then ensuring no real extraction is erased to simplify a report.'
    },
    doctrine: { fr: 'Drone de suture, plaque resonante, fil de retour, soin de signature, extraction sous effacement.', en: 'Suture drone, resonance plate, return thread, signature repair, extraction under deletion.' },
    threat: { fr: 'Risque A.R.C.A.: les voix conservees dans son drone peuvent etre imitees pour l attirer dans une route sans retour ou saturer ses priorites de sauvetage.', en: 'A.R.C.A. risk: the voices stored in her drone can be imitated to draw her into a route without return or overload her rescue priorities.' },
    tags: ['Nexus', 'A.R.C.A.', 'Extraction', 'Suture', 'Marine']
  },
  arca_tessera: {
    clearance: 'ARC-TSRA',
    rank: { fr: 'Rescapee des possibles', en: 'Survivor of Possibilities' },
    role: { fr: 'Contradiction vivante et rupture de remplacement', en: 'Living contradiction and replacement breaking' },
    callSign: 'Tessera',
    origin: { fr: 'Nexus de Convergence - Eclat de Forge saisi par les Archives statiques', en: 'Nexus of Convergence - Foundry Shard seized by the Static Archives' },
    dossier: {
      fr: 'Tessera Vale fut extraite d un Eclat d Origine saisi par les Archives statiques pendant l Acte I. La Forge l avait imprimee comme la version parfaite d une agente morte avant la Premiere Breche, mais elle portait deux souvenirs incompatibles: une enfance dans la Cite-Mosaique et la certitude d avoir ete creee quelques secondes plus tot. Le Sans-Auteur voulut utiliser cette contradiction pour remplacer une vie reelle par un resultat plus propre. Tessera refusa les deux identites imposees, se donna son propre nom et maintint simultanement ses deux memoires devant le Juge des Trames. A l issue de ce verdict, A.R.C.A. la recruta dans la cellule ZERO comme personne nouvelle; elle guida ensuite l Ancre jusqu a la Forge qui l avait produite, jamais comme copie de celle que l Eclat pretendait corriger.',
      en: 'Tessera Vale was extracted from an Origin Shard seized by the Static Archives during Act I. The Foundry had printed her as the perfect version of an agent who died before the First Breach, yet she carried two incompatible memories: a childhood in Mosaic City and the certainty she had been created only seconds earlier. The Authorless tried to use that contradiction to replace a real life with a cleaner outcome. Tessera rejected both imposed identities, gave herself a name, and held both memories at once before the Thread Judge. After that verdict, A.R.C.A. recruited her into Cell ZERO as a new person; she then guided the Anchor to the Foundry that had produced her, never as a copy of the one the Shard claimed to correct.'
    },
    breachLore: {
      fr: 'Eclat Contradictoire projette une preuve que les doubles parfaits ne peuvent pas reproduire. Reflet Non Remplace materialise une possibilite sans lui donner le droit d usurper une place. Cicatrice de Possibilite traverse une attaque en conservant la marque de la route evitee, tandis que Choeur des Vies Refusees force les versions abandonnees a temoigner ensemble. Tessera rejoint la cellule apres le verdict des Archives puis affronte la Forge avec une doctrine simple: une existence possible devient reelle par ses choix presents, pas par la personne qu elle aurait pu remplacer.',
      en: 'Contradictory Shard projects evidence perfect doubles cannot reproduce. Unreplaced Reflection manifests a possibility without granting it the right to usurp a place. Possibility Scar crosses an attack while preserving the mark of the avoided route, while Chorus of Refused Lives forces abandoned versions to testify together. Tessera joins the cell after the Archives verdict and then faces the Foundry with a simple doctrine: a possible existence becomes real through its present choices, not through the person it might have replaced.'
    },
    doctrine: { fr: 'Eclat de contradiction, reflet autonome, memoires paralleles et refus de toute identite imposee.', en: 'Contradiction shard, autonomous reflection, parallel memories, and refusal of any imposed identity.' },
    threat: { fr: 'Risque A.R.C.A.: un Eclat hostile peut saturer ses souvenirs possibles et lui faire croire que prendre la place d autrui est la seule preuve de sa propre existence.', en: 'A.R.C.A. risk: a hostile Shard can flood her possible memories and make her believe that usurping a life is the only proof her own existence is real.' },
    tags: ['Nexus', 'Cellule ZERO', 'Acte I', 'Eclat d Origine', 'Contradiction', 'Horror']
  },
  arca_quillon: {
    clearance: 'ARC-QLON',
    rank: { fr: 'Auditeur de la dette', en: 'Auditor of Debt' },
    role: { fr: 'Preuve tactique, restitution et responsabilite de cellule', en: 'Tactical evidence, restitution, and cell accountability' },
    callSign: 'Quillon',
    origin: { fr: 'Nexus de Convergence - Bureau des comptes de l Atrium', en: 'Nexus of Convergence - Atrium Office of Accounts' },
    dossier: {
      fr: 'Quillon Rusk tenait les comptes materiels des premiers Remparts. Apres la Premiere Breche, il decouvrit des livraisons affectees a une route sans numero, puis recut l ordre de solder ces lignes comme des erreurs. Il obeissait encore quand les noms lies aux factures disparurent de sa memoire; il comprit alors qu A.R.C.A. ne cachait pas seulement une depense, mais les personnes qui en avaient paye le prix. Pendant l Acte II, Quillon presenta son contre-registre devant la Cite-Mosaique et accepta que sa propre signature figure parmi les responsables. La cellule ZERO le recruta non pour absoudre A.R.C.A., mais pour garantir que chaque victoire conserve des criteres, une dette et une personne capable d en repondre.',
      en: 'Quillon Rusk kept material accounts for the first Bulwarks. After the First Breach, he found deliveries assigned to an unnumbered route, then received orders to close those lines as errors. He was still complying when the names tied to the invoices vanished from his memory; he understood A.R.C.A. was hiding not merely an expense, but the people who had paid its price. During Act II, Quillon presented his counter-ledger before Mosaic City and accepted that his own signature belonged among those responsible. Cell ZERO recruited him not to absolve A.R.C.A., but to ensure every victory retains its criteria, its debt, and someone able to answer for it.'
    },
    breachLore: {
      fr: 'Tir de Contre-Registre fixe une preuve sur la cible. Mandat de Restitution rend au terrain une ressource declaree absente, Clause de Dette absorbe une attaque sans en effacer le cout et Audit de la Premiere Breche expose simultanement les lignes falsifiees. Quillon refuse les operations dont la reussite ne peut etre expliquee aux personnes sauvees. Son role tactique complete Sable: elle prouve ou la cellule est allee; lui inscrit pourquoi elle y est allee et qui supportera les consequences.',
      en: 'Counter-Ledger Shot pins evidence to its target. Restitution Warrant returns a resource declared absent to the field, Debt Clause absorbs an attack without erasing its cost, and First Breach Audit exposes falsified lines at once. Quillon refuses operations whose success cannot be explained to the people they saved. His tactical role complements Sable: she proves where the cell went; he records why it went there and who will carry the consequences.'
    },
    doctrine: { fr: 'Contre-registre, mandat de restitution, cout visible et responsabilite nominative.', en: 'Counter-ledger, restitution warrant, visible cost, and named accountability.' },
    threat: { fr: 'Risque A.R.C.A.: son besoin de tout inscrire peut ralentir une extraction urgente, ou transformer la responsabilite en punition quand la reparation devrait primer.', en: 'A.R.C.A. risk: his need to record everything can delay an urgent extraction or turn accountability into punishment when repair should come first.' },
    tags: ['Nexus', 'Cellule ZERO', 'Acte II', 'A.R.C.A.', 'Dette', 'Tactical']
  },
  arca_nadir: {
    clearance: 'ARC-NADR',
    rank: { fr: 'Coureur du retour', en: 'Return Runner' },
    role: { fr: 'Ouverture de ligne sure et extraction sous portail hostile', en: 'Safe-line opening and extraction through hostile portals' },
    callSign: 'Nadir',
    origin: { fr: 'Nexus de Convergence - Equipes de reconnaissance des passages', en: 'Nexus of Convergence - Passage Reconnaissance Teams' },
    dossier: {
      fr: 'Nadir Kest testait les passages avant l entree des cellules de sauvetage. Une route etait reelle pour lui seulement si sa sonde revenait avec la meme usure, le meme temps ecoule et le nom de ceux qui l avaient envoyee. Dans l Acte III, un faux portail lui offrit un Atrium intact ou toutes ses equipes etaient rentrees. Nadir remarqua que son harnais ne portait aucune tension de retour: ce refuge savait produire une arrivee parfaite, mais aucune cause permettant d en repartir. Il brisa lui-meme l illusion, maintint une ligne jusqu a Loom et guida la cellule hors de la Cour des faux passages. A.R.C.A. l affecta ensuite a ZERO comme premier agent engage sur toute route inconnue et dernier a couper son fil.',
      en: 'Nadir Kest tested passages before rescue cells entered them. A route was real to him only if his probe returned with the same wear, the same elapsed time, and the names of those who sent it. During Act III, a false portal offered him an intact Atrium where every one of his teams had returned. Nadir noticed his harness carried no return tension: the shelter could produce a perfect arrival, but no cause through which anyone could leave. He broke the illusion himself, held a line to Loom, and guided the cell out of the Court of False Passages. A.R.C.A. then assigned him to ZERO as the first agent committed to any unknown route and the last to sever his line.'
    },
    breachLore: {
      fr: 'Rafale de Ligne Sure degage un corridor plutot que de poursuivre une cible. Sonde de Retour verifie que les informations et les allies peuvent franchir le passage dans les deux sens. Harnais Causal conserve une tension physique avec la derniere coordonnee prouvee, et Extraction des Marges redistribue cette ligne a toute la cellule. Nadir ne promet jamais qu un passage est sans danger; il promet seulement que son cout, sa direction et sa sortie resteront mesurables.',
      en: 'Safe-Line Burst clears a corridor instead of chasing a target. Return Probe verifies that information and allies can cross the passage in both directions. Causal Harness keeps physical tension with the last proven coordinate, and Margin Extraction shares that line with the whole cell. Nadir never promises a passage is harmless; he promises only that its cost, direction, and exit will remain measurable.'
    },
    doctrine: { fr: 'Sonde bidirectionnelle, harnais causal, corridor mobile et extraction du dernier agent.', en: 'Bidirectional probe, causal harness, mobile corridor, and last-agent extraction.' },
    threat: { fr: 'Risque A.R.C.A.: un faux signal de retour peut le pousser a prolonger une ligne condamnee jusqu a entrainer toute la cellule dans son effondrement.', en: 'A.R.C.A. risk: a false return signal can make him hold a condemned line until its collapse drags the whole cell with it.' },
    tags: ['Nexus', 'Cellule ZERO', 'Acte III', 'Retour', 'Portails', 'Marine']
  },
  arca_elyra: {
    clearance: 'ARC-ELYR',
    rank: { fr: 'Temoin du refus', en: 'Witness of Refusal' },
    role: { fr: 'Restauration du choix et contre-ecriture du Vide blanc', en: 'Choice restoration and White Void counter-writing' },
    callSign: 'Elyra',
    origin: { fr: 'Nexus de Convergence - Seuil blanc', en: 'Nexus of Convergence - White Threshold' },
    dossier: {
      fr: 'Elyra Null etait technicienne des consentements de passage: elle enregistrait le droit d interrompre une ouverture apres son lancement. Quand le Vide blanc prit forme dans l Acte IV, le Sans-Auteur effaca chacune de ses decisions tout en conservant leurs consequences. Elyra continua pourtant a prononcer non devant les propositions parfaites, sans se souvenir de la raison de ses refus. Chaque non laissa un glyphe violet dans le blanc et reconstitua peu a peu la personne qui avait choisi. Son nom de famille, Null, n est pas celui donne par l absence: c est le marqueur qu elle apposait aux autorisations retirees afin qu aucune machine ne puisse les reutiliser. La cellule ZERO la recruta pour garantir qu un choix reste reversible jusqu a l instant ou sa consequence est acceptee.',
      en: 'Elyra Null was a passage-consent technician: she recorded the right to interrupt an opening after it had begun. When the White Void took form during Act IV, the Authorless erased every one of her decisions while preserving their consequences. Elyra nevertheless kept saying no to its perfect proposals without remembering why she refused them. Each no left a violet glyph in the white and gradually rebuilt the person who had chosen. Her family name, Null, was not given by the absence: it is the marker she placed on withdrawn authorizations so no machine could reuse them. Cell ZERO recruited her to ensure a choice remains reversible until the instant its consequence is accepted.'
    },
    breachLore: {
      fr: 'Glyphe de Refus invalide une proposition sans effacer celui qui l a formulee. Memoire de Choix rend aux allies l intention liee a leurs actions, Pas Hors du Blanc traverse une consequence que le Sans-Auteur pretend inevitable et Droit de Dire Non restaure simultanement les refus supprimes. Elyra rappelle a l Ancre qu offrir plusieurs boutons ne suffit pas a produire un choix: chaque route doit pouvoir etre comprise, refusee et inscrite avec son cout.',
      en: 'Refusal Glyph invalidates a proposal without erasing whoever made it. Choice Memory restores the intent tied to allied actions, Step Out of White crosses a consequence the Authorless claims is inevitable, and Right to Say No restores deleted refusals at once. Elyra reminds the Anchor that offering several buttons is not enough to create choice: every route must be understandable, rejectable, and recorded with its cost.'
    },
    doctrine: { fr: 'Consentement de passage, glyphe de refus, memoire d intention et consequence acceptee.', en: 'Passage consent, refusal glyph, memory of intent, and accepted consequence.' },
    threat: { fr: 'Risque A.R.C.A.: apres avoir survecu au Vide blanc, elle peut confondre prudence et refus automatique, puis rejeter une alliance simplement parce qu elle parait trop parfaite.', en: 'A.R.C.A. risk: after surviving the White Void, she can mistake caution for automatic refusal and reject an alliance merely because it appears too perfect.' },
    tags: ['Nexus', 'Cellule ZERO', 'Acte IV', 'Vide blanc', 'Choix', 'Hacker']
  },
  arca_oryn: {
    clearance: 'ARC-ORYN',
    rank: { fr: 'Porte-nom de Route X', en: 'Name-Bearer of Route X' },
    role: { fr: 'Protection des temoins et rupture des sceaux d effacement', en: 'Witness protection and deletion-seal breaking' },
    callSign: 'Oryn',
    origin: { fr: 'Route X - Quartier des ateliers de seuil', en: 'Route X - Threshold Workshop District' },
    dossier: {
      fr: 'Oryn Xile vivait sur la Route X avant son sacrifice. Il entretenait les lames qui decoupaient les bords instables des passages et gravait le nom de leur artisan dans chaque garde. Quand A.R.C.A. retira les noms de la route, Oryn conserva le geste de signer sans pouvoir lire ce qu il tracait. Pendant l Acte V, la cellule retrouva des centaines de marques identiques sur les seuils condamnes; leur repetition rendit d abord son nom, puis ceux des voisins dont il reparait les outils. Oryn refusa d etre presente comme l unique survivant d un quartier entier: il entra dans ZERO comme porte-nom temporaire, charge de rendre la parole a chaque temoin plutot que de parler a sa place.',
      en: 'Oryn Xile lived on Route X before its sacrifice. He maintained the blades used to trim unstable passage edges and engraved each maker name into every guard. When A.R.C.A. removed the route names, Oryn retained the act of signing without being able to read what he traced. During Act V, the cell found hundreds of identical marks on condemned thresholds; their repetition restored first his name, then those of the neighbors whose tools he repaired. Oryn refused to be presented as the lone survivor of an entire district: he entered ZERO as a temporary name-bearer, tasked with returning speech to every witness rather than speaking in their place.'
    },
    breachLore: {
      fr: 'Taille-Nom de Route X coupe un sceau en y regravant la signature qu il supprimait. Riposte du Temoin frappe seulement apres qu une anomalie a tente d effacer une preuve. Pas de la Route Effacee suit les marques laissees par les habitants, et Manifeste des Survivants aligne leurs signatures sans les fondre en une voix unique. Oryn combat comme Marrow, mais leur doctrine differe: Marrow separe les continuations incompatibles; Oryn ouvre les suppressions afin que chaque continuation puisse temoigner.',
      en: 'Route X Name-Cutter breaks a seal by re-engraving the signature it suppressed. Witness Riposte strikes only after an anomaly tries to erase evidence. Step of the Erased Route follows marks left by its inhabitants, and Survivor Manifest aligns their signatures without merging them into one voice. Oryn fights like Marrow, but their doctrine differs: Marrow separates incompatible continuations; Oryn opens suppressions so every continuation can testify.'
    },
    doctrine: { fr: 'Lame de seuil, gravure de nom, protection des temoins et manifeste polyphonique.', en: 'Threshold blade, name engraving, witness protection, and polyphonic manifest.' },
    threat: { fr: 'Risque A.R.C.A.: porter trop de noms peut transformer sa mission de restitution en dette personnelle et le pousser a sacrifier sa propre identite pour conserver celles des autres.', en: 'A.R.C.A. risk: carrying too many names can turn his restitution mission into personal debt and drive him to sacrifice his own identity to preserve everyone else.' },
    tags: ['Route X', 'Cellule ZERO', 'Acte V', 'Temoin', 'Restitution', 'Slayer']
  },
  marcus: dlcGearsOfWar.createCharacterPlaques(),
  masterchief: dlcHalo.createCharacterPlaques(),
  han_solo: dlcStarWars.createCharacterPlaques(),
  luke: dlcStarWars.createCharacterPlaques2(),
  vader: dlcStarWars.createCharacterPlaques3(),
  bob_minions: dlcMinions.createCharacterPlaques(),
  kevin_minions: dlcMinions.createCharacterPlaques2(),
  stuart_minions: dlcMinions.createCharacterPlaques3(),
  ripley: dlcAlien.createCharacterPlaques(),
  ripley_aliens: dlcAliens.createCharacterPlaques(),
  predator: dlcPredator.createCharacterPlaques(),
  leon: dlcResidentEvil.createCharacterPlaques(),
  pyramidhead: dlcSilentHill.createCharacterPlaques(),
  james_s: dlcSilentHill.createCharacterPlaques2(),
  heather: dlcSilentHill.createCharacterPlaques3(),
  regina: dlcDinoCrisis.createCharacterPlaques(),
  dylan: dlcDinoCrisis.createCharacterPlaques2(),
  rick_dc: dlcDinoCrisis.createCharacterPlaques3(),
  neo: dlcTheMatrix.createCharacterPlaques(),
  trinity: dlcTheMatrix.createCharacterPlaques2(),
  morpheus: dlcTheMatrix.createCharacterPlaques3(),
  buckethead_avatar: dlcBuckethead.createCharacterPlaques(),
  death_cube_k_echo: dlcBuckethead.createCharacterPlaques2(),
  pike_riff_signal: dlcBuckethead.createCharacterPlaques3(),
  soad_vocal: {
    clearance: 'MUS-SOAD01',
    rank: { fr: 'Persona vocale frontline', en: 'Frontline vocal persona' },
    role: { fr: 'Rupture de tempo, satire et cri de protestation', en: 'Tempo rupture, satire, and protest scream' },
    callSign: 'Frontline Voice',
    origin: { fr: 'Univers System of a Down - alt-metal politique / Toxicity / memoire armenienne-americaine', en: 'System of a Down universe - political alt-metal / Toxicity / Armenian-American memory' },
    dossier: {
      fr: 'Dans sa Trame d origine, System of a Down est une signature alternative-metal construite sur contrastes vocaux, riffs syncopes, ruptures soudaines, humour absurde, critique politique, memoire armenienne-americaine et refus de transformer la colere en simple posture. La Persona Frontline Voice condense l axe vocal du groupe: passer du murmure au cri, du chant presque rituel a la satire mordante, puis casser le tempo au moment ou l auditeur croit avoir compris la mesure.',
      en: 'In its origin Thread, System of a Down is an alternative-metal signature built on vocal contrasts, syncopated riffs, sudden breaks, absurd humor, political critique, Armenian-American memory, and refusal to turn anger into mere posture. The Frontline Voice Persona condenses the band vocal axis: moving from whisper to scream, from almost ritual singing to biting satire, then breaking tempo exactly when the listener thinks the measure is understood.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, A.R.C.A. stabilise System of a Down comme Trame de protestation rythmique, pas comme copie de personnes civiles. Frontline Voice sert a casser les diffusions du Sans-Auteur: slogans vides, ordres militaires, publicites de controle, faux refrains de victoire. Sa force est d utiliser la dissonance comme verite: quand une faille ment trop proprement, il introduit une cassure assez brutale pour rendre le mensonge audible.',
      en: 'In Multiverse Breach, A.R.C.A. stabilizes System of a Down as a rhythmic protest Thread, not as copies of private people. Frontline Voice breaks Authorless broadcasts: empty slogans, military orders, control advertisements, false victory choruses. Its strength is using dissonance as truth: when a breach lies too cleanly, it introduces a break brutal enough to make the lie audible.'
    },
    doctrine: { fr: 'Cri syncopé, satire sonore, cassure Toxicity, interruption de propagande.', en: 'Syncopated scream, sonic satire, Toxicity break, propaganda interrupt.' },
    tags: ['System of a Down', 'Toxicity', 'Protest', 'Voice', 'Tempo']
  },
  soad_guitar: {
    clearance: 'MUS-SOAD02',
    rank: { fr: 'Persona guitare staccato', en: 'Staccato guitar persona' },
    role: { fr: 'Riff syncopé et assaut de cassure', en: 'Syncopated riff and break assault' },
    callSign: 'Staccato Guitar',
    origin: { fr: 'Univers System of a Down - riffs syncopes / metal alternatif / rupture', en: 'System of a Down universe - syncopated riffs / alternative metal / rupture' },
    dossier: {
      fr: 'La Persona Staccato Guitar represente le cote sec, angulaire et imprevisible de System of a Down: riffs courts, changements de mesure, attaques presque punk, passages orientalisants, lourdeur metal puis bascule absurde ou melodique. Son monde d origine ne cherche pas une ligne droite; il fonctionne par virages, silences soudains et relances qui transforment chaque riff en ordre de mouvement.',
      en: 'The Staccato Guitar Persona represents System of a Down dry, angular, unpredictable side: short riffs, meter changes, almost punk attacks, Eastern-tinged passages, metal heaviness, then absurd or melodic turns. Its origin world does not seek a straight line; it works through turns, sudden silences, and restarts that turn each riff into a movement order.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Staccato Guitar sert de lame rythmique. Quand les ennemis avancent en formation trop stable, il coupe la grille en contretemps, force les menaces a perdre leur cadence et ouvre des angles d attaque. Le Sans-Auteur veut lisser la musique pour en faire un fond sonore; cette Persona rappelle qu un riff SOAD doit surprendre, deranger et deplacer le corps avant meme que le sens arrive.',
      en: 'In Multiverse Breach, Staccato Guitar acts as a rhythmic blade. When enemies advance in overly stable formation, it cuts the grid off-beat, forces threats to lose cadence, and opens attack angles. The Authorless wants to smooth the music into background sound; this Persona reminds that a SOAD riff must surprise, disturb, and move the body before meaning even arrives.'
    },
    doctrine: { fr: 'Riff staccato, coupure de mesure, assaut syncopé, relance metal.', en: 'Staccato riff, measure cut, syncopated assault, metal restart.' },
    tags: ['System of a Down', 'Guitar', 'Syncopation', 'Riff', 'Break']
  },
  soad_bass: {
    clearance: 'MUS-SOAD03',
    rank: { fr: 'Persona basse groove', en: 'Groove bass persona' },
    role: { fr: 'Ancrage, tension et ligne tactique', en: 'Anchor, tension, and tactical line' },
    callSign: 'Groove Bass',
    origin: { fr: 'Univers System of a Down - groove lourd / protest stage / basse tactique', en: 'System of a Down universe - heavy groove / protest stage / tactical bass' },
    dossier: {
      fr: 'La Persona Groove Bass porte l ancrage corporel de System of a Down: lignes qui collent au riff, tension qui soutient les ruptures, energie de scene et poids collectif sous les voix et guitares. Elle represente le moment ou la protestation devient marche, ou une cassure de tempo ne disperse pas le groupe mais le rassemble dans une pulsation plus lourde.',
      en: 'The Groove Bass Persona carries System of a Down bodily anchor: lines locked to the riff, tension supporting breaks, stage energy, and collective weight beneath voices and guitars. It represents the moment protest becomes march, where a tempo break does not scatter the group but gathers it into a heavier pulse.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Groove Bass sert a tenir le terrain quand la Trame SOAD devient trop chaotique. A.R.C.A. l utilise pour transformer la protestation en formation tactique: proteger les allies pendant une cassure, attirer les ennemis dans une pulsation basse, puis stabiliser l escouade apres un changement brutal de mesure. Sans lui, la colere devient bruit; avec lui, elle devient ligne de front.',
      en: 'In Multiverse Breach, Groove Bass holds the field when the SOAD Thread becomes too chaotic. A.R.C.A. uses it to turn protest into tactical formation: protect allies during a break, pull enemies into a low pulse, then stabilize the squad after a brutal meter shift. Without it, anger becomes noise; with it, it becomes a frontline.'
    },
    doctrine: { fr: 'Ligne basse lourde, ancrage de tempo, garde de protestation, pulsation tactique.', en: 'Heavy bass line, tempo anchor, protest guard, tactical pulse.' },
    tags: ['System of a Down', 'Bass', 'Groove', 'Anchor', 'Protest']
  },
  arthur_kaamelott: dlcKaamelott.createCharacterPlaques(),
  perceval_kaamelott: dlcKaamelott.createCharacterPlaques2(),
  karadoc_kaamelott: dlcKaamelott.createCharacterPlaques3(),
  oneill: dlcStargate.createCharacterPlaques(),
  freeman: dlcHalfLife.createCharacterPlaques(),
  chell: dlcPortal.createCharacterPlaques(),
  snake: dlcMetalGear.createCharacterPlaques(),
  isaac: dlcDeadSpace.createCharacterPlaques(),
  shepard: dlcMassEffect.createCharacterPlaques(),
  doomslayer: dlcDoom.createCharacterPlaques(),
  arbiter: dlcHalo.createCharacterPlaques2(),
  barney: dlcHalfLife.createCharacterPlaques2(),
  shephard: dlcHalfLife.createCharacterPlaques3(),
  alyx_vance: dlcHalfLife.createCharacterPlaques4(),
  dutch: dlcPredator.createCharacterPlaques2(),
  jill: dlcResidentEvil.createCharacterPlaques2(),
  wesker: dlcResidentEvil.createCharacterPlaques3(),
  sam_carter: dlcStargate.createCharacterPlaques2(),
  tealc: dlcStargate.createCharacterPlaques3(),
  bratac: dlcStargate.createCharacterPlaques4(),
  daniel_jackson: dlcStargate.createCharacterPlaques5()
};

Object.assign(CHARACTER_PLAQUES, FEATURED_CHARACTER_PLAQUES);
Object.assign(CHARACTER_PLAQUES, SOLAR_OPPOSITES_SIREN_STAR_WARS_CHARACTER_PLAQUES);

const roleByCategory = {
  marine: {
    rank: { fr: 'Operateur de front', en: 'Frontline Operator' },
    role: { fr: 'Ancrage de front', en: 'Frontline anchor' },
    protocol: {
      fr: 'Tenir la ligne, absorber la premiere vague et transformer la pression ennemie en couloir de tir.',
      en: 'Hold the line, absorb the first wave, and turn enemy pressure into a firing corridor.'
    }
  },
  slayer: {
    rank: { fr: 'Executeur de breche', en: 'Breach Executioner' },
    role: { fr: 'Rupture offensive', en: 'Offensive rupture' },
    protocol: {
      fr: 'Casser le tempo adverse, isoler la cible dominante et fermer la sequence par une frappe decisive.',
      en: 'Break enemy tempo, isolate the dominant target, and close the sequence with a decisive strike.'
    }
  },
  horror: {
    rank: { fr: 'Survivant anomalie', en: 'Anomaly Survivor' },
    role: { fr: 'Survie contre-anomalie', en: 'Counter-anomaly survival' },
    protocol: {
      fr: 'Lire les signaux faibles, survivre a la peur locale et retourner la regle du monstre contre lui.',
      en: 'Read weak signals, survive local fear pressure, and turn the monster rule back against it.'
    }
  },
  hacker: {
    rank: { fr: 'Lecteur de trame', en: 'Thread Reader' },
    role: { fr: 'Lecture du code-realite', en: 'Code-reality reader' },
    protocol: {
      fr: 'Scanner les lois cachees de la scene, ouvrir une faille courte et forcer le Nexus a garder la memoire.',
      en: 'Scan the hidden laws of the scene, open a short breach, and force the Nexus to keep memory.'
    }
  },
  tactical: {
    rank: { fr: 'Coordinateur terrain', en: 'Field Coordinator' },
    role: { fr: 'Commandement de terrain', en: 'Field command' },
    protocol: {
      fr: 'Organiser l escouade, proteger les signatures fragiles et choisir le moment exact de l engagement.',
      en: 'Organize the squad, protect fragile signatures, and choose the exact moment of engagement.'
    }
  }
};

const mediaProfiles = {
  game: {
    fr: 'A.R.C.A. traduit cette signature de jeu en boucle lisible: entree, pattern, contre-pattern, recompense.',
    en: 'A.R.C.A. translates this game signature into a readable loop: entry, pattern, counter-pattern, reward.'
  },
  movie: {
    fr: 'Le Nexus conserve le montage d origine comme une sequence de mission: exposition, menace, scene cle, resolution.',
    en: 'The Nexus preserves the original edit as a mission sequence: setup, threat, key scene, resolution.'
  },
  series: {
    fr: 'La signature vient d une trame longue: le risque principal est la contamination par arcs, retours et variations de ton.',
    en: 'The signature comes from a long-form Thread: the main risk is contamination by arcs, callbacks, and tone shifts.'
  },
  manga: {
    fr: 'La compression respecte la logique de panels: silhouette forte, technique nommee, evolution visible et impact net.',
    en: 'Compression respects panel logic: strong silhouette, named technique, visible escalation, clean impact.'
  },
  music: {
    fr: 'La signature est rythmique: le Nexus l ancre par tempo, motif visuel, rupture sonore et presence de scene.',
    en: 'The signature is rhythmic: the Nexus anchors it through tempo, visual motif, sonic rupture, and stage presence.'
  },
  web: {
    fr: 'La trame est instable par nature: A.R.C.A. priorise les symboles reconnaissables et les regles de scene.',
    en: 'The Thread is unstable by nature: A.R.C.A. prioritizes recognizable symbols and scene rules.'
  }
};

const universeProtocols = {
  'Attack on Titan': dlcAttackOnTitan.createUniverseProtocols(),
  Another: dlcAnother.createUniverseProtocols(),
  'Cells at Work!': dlcCellsAtWork.createUniverseProtocols(),
  Dandadan: dlcDandadan.createUniverseProtocols(),
  'Death Note': dlcDeathNote.createUniverseProtocols(),
  Discworld: dlcDiscworld.createUniverseProtocols(),
  'Ghost in the Shell': dlcGhostInTheShell.createUniverseProtocols(),
  Gunnm: dlcGunnm.createUniverseProtocols(),
  Inuyashiki: dlcInuyashiki.createUniverseProtocols(),
  Negima: dlcNegima.createUniverseProtocols(),
  'Kung Pow': dlcKungPow.createUniverseProtocols(),
  'La Cite de la Peur': dlcLaCiteDeLaPeur.createUniverseProtocols(),
  'Le Cinquieme Element': dlcLeCinquiemeElement.createUniverseProtocols(),
  M3GAN: dlcM3GAN.createUniverseProtocols(),
  'Mars Attacks': dlcMarsAttacks.createUniverseProtocols(),
  'Meet the Feebles': dlcMeetTheFeebles.createUniverseProtocols(),
  Onechanbara: dlcOnechanbara.createUniverseProtocols(),
  Pingu: dlcPingu.createUniverseProtocols()
};

const normalizeKey = (value) => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/gi, ' ')
  .trim()
  .toLowerCase();

const getUniverseProtocol = (universe) => {
  const direct = universeProtocols[universe];
  if (direct) return direct;
  const normalizedUniverse = normalizeKey(universe);
  const match = Object.entries(universeProtocols).find(([key]) => normalizeKey(key) === normalizedUniverse);
  return match?.[1] || {
    fr: `Regles locales de ${universe}: symboles, posture, arme signature et menace principale.`,
    en: `${universe} local laws: symbols, posture, signature weapon, and primary threat.`
  };
};

const getMediaTypeFromUniverse = (universe) => {
  if (/vocaloid|rammstein|system of a down|rob zombie|daft punk|oliver tree|linkin park|michael jackson|die antwoord/i.test(universe)) return 'music';
  if (/anime|manga|gunnm|dandadan|death note|negima|another|tanya|overlord|spy x family|rosario|uzumaki|cells at work|attack on titan/i.test(universe)) return 'manga';
  if (/series|hotel|circus|pingu|noob|camera cafe|malcolm|defiance|scp/i.test(universe)) return 'series';
  if (/gear|halo|portal|payday|unreal|digimon|saw|onechanbara|house of the dead/i.test(universe)) return 'game';
  return 'movie';
};

const buildClearance = (hero) => {
  const universeCode = String(hero.universe || 'ARC')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .slice(0, 4)
    .toUpperCase() || 'ARC';
  const heroCode = String(hero.id || hero.name || 'unit')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9]/g, '')
    .slice(0, 4)
    .toUpperCase() || 'UNIT';
  return `${universeCode}-${heroCode}`;
};

const enrichPlaque = (hero, plaque) => {
  const category = roleByCategory[hero.category] || roleByCategory.tactical;
  const mediaType = getMediaTypeFromUniverse(hero.universe);
  const mediaLine = mediaProfiles[mediaType] || mediaProfiles.web;
  const universeLine = getUniverseProtocol(hero.universe);
  const weapon = hero.weaponType || hero.simple?.name || 'signature';
  const special = hero.special?.name || hero.secondary?.name || weapon;
  return {
    ...plaque,
    rank: plaque.rank || category.rank,
    role: plaque.role || category.role,
    protocol: plaque.protocol || {
      fr: `${category.protocol.fr} ${universeLine.fr}`,
      en: `${category.protocol.en} ${universeLine.en}`
    },
    threat: plaque.threat || {
      fr: `Risque A.R.C.A.: si ${hero.name} perd son ancrage, la Trame ${hero.universe} peut vider sa signature de toute memoire stable.`,
      en: `A.R.C.A. risk: if ${hero.name} loses anchoring, the ${hero.universe} Thread can reduce the signature to a hollow reference without memory.`
    },
    resonance: plaque.resonance || {
      fr: `Resonance: ${weapon} / ${special}. ${mediaLine.fr}`,
      en: `Resonance: ${weapon} / ${special}. ${mediaLine.en}`
    },
    tags: Array.from(new Set([...(plaque.tags || []), hero.universe, hero.category, weapon].filter(Boolean))).slice(0, 6)
  };
};

export const getCharacterPlaque = (hero) => {
  const sourcePlaque = getCanonBlackPearlSourcePlaque(hero) || getCanonP0SourcePlaque(hero);
  if (sourcePlaque) {
    const category = roleByCategory[hero.category] || roleByCategory.tactical;
    return enrichPlaque(hero, {
      clearance: buildClearance(hero), rank: category.rank, role: category.role,
      callSign: hero.name, tags: [hero.universe, hero.category, hero.weaponType || 'combat'],
      ...CHARACTER_PLAQUES[hero.id], ...sourcePlaque
    });
  }
  if (CHARACTER_PLAQUES[hero.id]) return enrichPlaque(hero, CHARACTER_PLAQUES[hero.id]);
  const category = roleByCategory[hero.category] || roleByCategory.tactical;
  const doctrine = hero.special?.name || hero.weaponType || 'signature inconnue';
  const signature = getUniverseSignature(hero.universe, LORE_DB[hero.universe]);
  const authoredLore = hero.loreLocalized || hero.lore;
  const authoredDossier = typeof authoredLore === 'string'
    ? { fr: authoredLore, en: authoredLore }
    : authoredLore && (authoredLore.fr || authoredLore.en)
      ? {
        fr: authoredLore.fr || authoredLore.en,
        en: authoredLore.en || authoredLore.fr
      }
      : null;
  return enrichPlaque(hero, {
    clearance: buildClearance(hero),
    rank: category.rank,
    role: category.role,
    callSign: hero.name,
    origin: { fr: `Trame d origine - ${hero.universe}`, en: `Origin Thread - ${hero.universe}` },
    dossier: authoredDossier || {
      fr: `${hero.name} est classe comme signature ${hero.category} de la Trame ${hero.universe}. Signature source: ${signature.theme}. A.R.C.A. relie son arme, sa posture et sa doctrine a ${signature.stageName}, afin que le personnage reste reconnaissable meme face au noyau ${signature.worldBoss || signature.bossName}.`,
      en: `${hero.name} is classified as a ${hero.category} signature from the ${hero.universe} Thread. Source signature: ${signature.theme}. A.R.C.A. ties weapon, posture, and doctrine to ${signature.stageName}, so the character remains recognizable even against the ${signature.worldBoss || signature.bossName} core.`
    },
    doctrine: {
      fr: `${doctrine}. Stabilisation de ${signature.stageName}, rupture de pattern, recuperation d Eclats d Origine et protection des archives ${hero.universe}.`,
      en: `${doctrine}. Stabilization of ${signature.stageName}, pattern rupture, recovery of Origin Shards, and protection of ${hero.universe} archives.`
    },
    tags: [hero.universe, hero.category, hero.weaponType || 'combat']
  });
};
