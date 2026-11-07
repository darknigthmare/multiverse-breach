import { isUniverseInstalled } from './dlcInstallation.js';
import { getStableContentIndex } from './dlcContentIdentity.js';
// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcHalo from '../../DLC/Halo/data/narrativeSystems.js';
import * as dlcResidentEvil from '../../DLC/ResidentEvil/data/narrativeSystems.js';
import * as dlcHalfLife from '../../DLC/HalfLife/data/narrativeSystems.js';
import * as dlcStargate from '../../DLC/Stargate/data/narrativeSystems.js';
import * as dlcSilentHill from '../../DLC/SilentHill/data/narrativeSystems.js';
import * as dlcDinoCrisis from '../../DLC/DinoCrisis/data/narrativeSystems.js';
import * as dlcTheMatrix from '../../DLC/TheMatrix/data/narrativeSystems.js';
import * as dlcBuckethead from '../../DLC/Buckethead/data/narrativeSystems.js';
import * as dlcSystemOfADown from '../../DLC/SystemOfADown/data/narrativeSystems.js';
import * as dlcKaamelott from '../../DLC/Kaamelott/data/narrativeSystems.js';
import * as dlcAlien from '../../DLC/Alien/data/narrativeSystems.js';
import * as dlcPredator from '../../DLC/Predator/data/narrativeSystems.js';
import * as dlcPortal from '../../DLC/Portal/data/narrativeSystems.js';
import * as dlcBuffyTheVampireSlayer from '../../DLC/BuffyTheVampireSlayer/data/narrativeSystems.js';
import * as dlcBreakingBad from '../../DLC/BreakingBad/data/narrativeSystems.js';
import * as dlcPoliceSquad from '../../DLC/PoliceSquad/data/narrativeSystems.js';

import { HEROES_DB } from './heroes';
import { FEATURED_UNIVERSE_NARRATIVE_ARCS } from './featuredUniversePacks';
import { ORIGINAL_UNIVERSE_DEFINITIONS } from './originalUniverseWave.js';

const ORIGINAL_UNIVERSE_NARRATIVE_ARCS = ORIGINAL_UNIVERSE_DEFINITIONS.map(world => ({
  ...world.narrativeArc,
  universes: [world.universe],
  stages: world.stages,
  rewardItemId: `universe_arc_${world.narrativeArc.id}`,
  rewards: [
    {
      id: world.booster.chaseRewardId,
      type: 'hud',
      name: world.customUnlockables.find(item => item.id === world.booster.chaseRewardId)?.name
    }
  ],
  claimReward: { gold: 560, shards: 115, tokens: 6 },
  sourceType: 'original',
  originalContent: true
}));

const ORIGINAL_SKIN_CATALOG = Object.fromEntries(
  ORIGINAL_UNIVERSE_DEFINITIONS.flatMap(world => (
    world.skins.map(skin => [skin.id, skin])
  ))
);

export const ARC_CAMPAIGN_DETAILS = {
  xeno_yautja_war: {
    intro: { fr: 'A.R.C.A. detecte une coordonnee ou la chasse et la reproduction utilisent la meme faille.', en: 'A.R.C.A. detects coordinates where hunting and breeding use the same breach.' },
    missions: [
      { fr: 'Couper les couloirs de ponte dans une colonie fusionnee Alien/Predator.', en: 'Cut egg corridors inside a fused Alien/Predator colony.' },
      { fr: 'Recuperer un Eclat d Origine dans un temple Yautja contamine.', en: 'Recover an Origin Shard inside a contaminated Yautja temple.' },
      { fr: 'Battre le Nid-Trophee avant sa migration vers la Cite-Mosaique.', en: 'Defeat the Trophy-Hive before it migrates to Mosaic City.' }
    ],
    outro: { fr: 'La chasse reste ouverte, mais le Voile n est plus un nid.', en: 'The hunt remains open, but the Veil is no longer a nest.' },
    rewards: [
      { id: 'arc_xeno_skin_acid_armor', type: 'skin', name: { fr: 'Apparence Armure Acide', en: 'Acid Armor Appearance' } },
      { id: 'arc_xeno_item_corroded_plasma', type: 'item', name: { fr: 'Lame Plasma Corrodee', en: 'Corroded Plasma Blade' } }
    ],
    claimReward: { gold: 500, shards: 90, tokens: 4 }
  },
  stage_resonance: {
    intro: { fr: 'La Scene Fantome pulse comme un coeur: les Personas de Resonance maintiennent les souvenirs collectifs en vie.', en: 'The Ghost Stage pulses like a heart: Resonance Personas keep collective memory alive.' },
    missions: [
      { fr: 'Synchroniser trois failles musicales sans casser le tempo ATB.', en: 'Synchronize three music breaches without breaking ATB tempo.' },
      { fr: 'Proteger un concert holographique contre une vague de silence blanc.', en: 'Protect a holographic concert against a wave of white silence.' },
      { fr: 'Transformer le rappel final en balise anti-Sans-Auteur.', en: 'Turn the final encore into an anti-Authorless beacon.' }
    ],
    outro: { fr: 'Le Nexus retrouve une frequence: chaque victoire a maintenant un battement.', en: 'The Nexus finds a frequency again: every victory now has a beat.' },
    rewards: [
      { id: 'arc_stage_skin_neon_persona', type: 'skin', name: { fr: 'Apparence Neon Persona', en: 'Neon Persona Appearance' } },
      { id: 'arc_stage_item_anchor_microphone', type: 'item', name: { fr: 'Micro d Ancrage', en: 'Anchor Microphone' } }
    ],
    claimReward: { gold: 420, shards: 80, tokens: 5 }
  },
  frontline_sci_fi: {
    intro: { fr: 'L Alliance du Nexus forme le Rempart Atrium avec les soldats, explorateurs et commandants des Trames sci-fi.', en: 'The Nexus Alliance forms the Atrium Bulwark with soldiers, explorers, and commanders from sci-fi Threads.' },
    missions: [
      { fr: 'Construire une ligne de tir entre Halo, Stargate et Mass Effect.', en: 'Build a firing line between Halo, Stargate, and Mass Effect.' },
      { fr: 'Synchroniser BT-7274, RoboCop et un T-800 reprogramme sans laisser leurs directives remplacer le commandement humain.', en: 'Synchronize BT-7274, RoboCop, and a reprogrammed T-800 without letting their directives replace human command.' },
      { fr: 'Proteger Alphie pendant que NOMAD et la Fold Weapon tentent de verrouiller la meme coordonnee de la Cite-Mosaique.', en: 'Protect Alphie while NOMAD and the Fold Weapon try to lock the same Mosaic City coordinate.' },
      { fr: 'Evacuer des civils de la Cite-Mosaique sous bombardement de faille.', en: 'Evacuate Mosaic City civilians under breach bombardment.' },
      { fr: 'Activer le Rempart Atrium contre le Noyau final.', en: 'Activate the Atrium Bulwark against the final Core.' }
    ],
    outro: { fr: 'Le Nexus possede enfin une armee, mais pas encore une paix.', en: 'The Nexus finally has an army, but not yet peace.' },
    rewards: [
      { id: 'arc_scifi_skin_atrium_bulwark', type: 'skin', name: { fr: 'Apparence Rempart Atrium', en: 'Atrium Bulwark Appearance' } },
      { id: 'arc_scifi_item_sgc_n7_plate', type: 'item', name: { fr: 'Plaque de Commandement SGC/N7', en: 'SGC/N7 Command Plate' } }
    ],
    claimReward: { gold: 460, shards: 85, tokens: 4 }
  },
  cyber_reality: {
    intro: { fr: 'La Zone 404 prouve que certaines breches sont des permissions volees, pas des lieux.', en: 'Zone 404 proves some breaches are stolen permissions, not places.' },
    missions: [
      { fr: 'Nettoyer une trace memoire corrompue par un virus de Trame.', en: 'Clean a memory trace corrupted by a Thread virus.' },
      { fr: 'Extraire un engramme de Mikoshi avant qu Arasaka ne vende les souvenirs des heros comme contrats de mercenaires.', en: 'Extract an engram from Mikoshi before Arasaka sells hero memories as mercenary contracts.' },
      { fr: 'Comparer une memoire de replicant Blade Runner a une Ancre authentique sans declarer la copie moins humaine.', en: 'Compare a Blade Runner replicant memory with an authentic Anchor without declaring the copy less human.' },
      { fr: 'Defendre A.R.C.A. pendant une attaque de droits administrateur.', en: 'Defend A.R.C.A. during an administrator-rights attack.' },
      { fr: 'Installer un pare-feu narratif dans le coeur du hub.', en: 'Install a narrative firewall in the hub core.' }
    ],
    outro: { fr: 'Les traces memoire possedent maintenant une chambre de secours.', en: 'Memory traces now have a backup chamber.' },
    rewards: [
      { id: 'arc_cyber_skin_zone_404', type: 'skin', name: { fr: 'Apparence Zone 404', en: 'Zone 404 Appearance' } },
      { id: 'arc_cyber_item_firewall_fragment', type: 'item', name: { fr: 'Fragment de Pare-feu Narratif', en: 'Narrative Firewall Fragment' } }
    ],
    claimReward: { gold: 440, shards: 85, tokens: 4 }
  },
  urban_legends: {
    intro: { fr: 'Les Effaces utilisent la peur pour retirer les noms, puis les visages, puis les mondes.', en: 'The Erased use fear to remove names, then faces, then worlds.' },
    missions: [
      { fr: 'Identifier les entites avant que leurs fiches codex deviennent blanches.', en: 'Identify entities before their codex files turn white.' },
      { fr: 'Suivre Hinako dans Ebisugaoka sans laisser le rite du Masque de Renard imposer sa fin aux autres survivants.', en: 'Follow Hinako through Ebisugaoka without letting the Fox Mask rite impose its ending on other survivors.' },
      { fr: 'Separer le Lointain d Insidious, la ferme Perron et les faux souvenirs du Heart Eyes Killer avant qu ils partagent une meme maison.', en: 'Separate the Further, the Perron farmhouse, and the Heart Eyes Killer false memories before they share one house.' },
      { fr: 'Resister a une mission sans carte, sans nom de boss et sans musique.', en: 'Survive a mission without map, boss name, or music.' },
      { fr: 'Nommer le cauchemar central dans les Archives Impossibles.', en: 'Name the central nightmare inside the Impossible Archives.' }
    ],
    outro: { fr: 'Une peur nommee reste dangereuse, mais elle cesse d etre infinie.', en: 'A named fear remains dangerous, but stops being infinite.' },
    rewards: [
      { id: 'arc_fear_skin_black_archive', type: 'skin', name: { fr: 'Apparence Archive Noire', en: 'Black Archive Appearance' } },
      { id: 'arc_fear_item_origin_lamp', type: 'item', name: { fr: 'Lampe d Origine', en: 'Origin Lamp' } }
    ],
    claimReward: { gold: 430, shards: 80, tokens: 4 }
  },
  dark_gotham: {
    intro: { fr: 'Trois Gotham se superposent: le Joker transforme les portails en choix impossibles, les variantes noires imposent le nihilisme et le Chevalier noir cherche encore une solution qui ne sacrifie personne.', en: 'Three Gothams overlap: the Joker turns portals into impossible choices, dark variants impose nihilism, and the Dark Knight still seeks a solution that sacrifices no one.' },
    missions: [
      { fr: 'Securiser les ferries de Gotham avant que leur dilemme ne devienne une regle de mission permanente.', en: 'Secure the Gotham ferries before their dilemma becomes a permanent mission rule.' },
      { fr: 'Neutraliser le sonar vole sans donner a A.R.C.A. un droit de surveillance totale.', en: 'Neutralize the stolen sonar without granting A.R.C.A. total surveillance rights.' },
      { fr: 'Isoler les toxines Joker New 52 du metal noir des Robins infectes.', en: 'Separate New 52 Joker toxin from the infected Robins dark metal.' },
      { fr: 'Vaincre le Rire noir sur le toit de l Atrium sans activer son choix final.', en: 'Defeat the Black Laugh on the Atrium roof without activating its final choice.' }
    ],
    outro: { fr: 'Gotham ne devient pas pure, mais elle reste capable de choisir mieux que ses monstres.', en: 'Gotham does not become pure, but remains capable of choosing better than its monsters.' },
    rewards: [
      { id: 'arc_gotham_skin_white_lens', type: 'skin', name: { fr: 'Apparence Lentille blanche', en: 'White Lens Appearance' } },
      { id: 'arc_gotham_item_ferry_transponder', type: 'item', name: { fr: 'Transpondeur des ferries', en: 'Ferry Transponder' } }
    ],
    claimReward: { gold: 470, shards: 88, tokens: 4 }
  },
  arcane_paradox: {
    intro: { fr: 'Les lois magiques de la Terre du Milieu, de Poudlard, d Hamunaptra et des royaumes comiques tentent toutes de definir le meme portail.', en: 'The magical laws of Middle-earth, Hogwarts, Hamunaptra, and comic kingdoms all try to define the same portal.' },
    missions: [
      { fr: 'Empêcher un fragment de l Anneau Unique de devenir l Horcruxe d une Ancre A.R.C.A.', en: 'Prevent a One Ring fragment from becoming an A.R.C.A. Anchor Horcrux.' },
      { fr: 'Traduire les runes de Barad-dur, les mouvements de baguette et le Livre d Amon-Ra dans un sceau commun.', en: 'Translate Barad-dur runes, wand movements, and the Book of Amun-Ra into one common seal.' },
      { fr: 'Defendre le village gaulois et le village schtroumpf contre une legion romaine guidee par Gargamel.', en: 'Defend the Gaulish and Smurf villages against a Roman legion guided by Gargamel.' },
      { fr: 'Fermer le Grimoire d Equilibre avant que Morgoth ne soit nomme comme loi premiere du Nexus.', en: 'Close the Grimoire of Balance before Morgoth is named the Nexus first law.' }
    ],
    outro: { fr: 'Aucune magie ne remplace les autres: le Nexus conserve plusieurs lois locales et une seule limite commune, le consentement de la Trame.', en: 'No magic replaces the others: the Nexus keeps several local laws and one shared limit, the Thread consent.' },
    rewards: [
      { id: 'arc_arcane_skin_runic_wayfinder', type: 'skin', name: { fr: 'Apparence Guide runique', en: 'Runic Wayfinder Appearance' } },
      { id: 'arc_arcane_item_three_law_seal', type: 'item', name: { fr: 'Sceau des trois lois', en: 'Three-Law Seal' } }
    ],
    claimReward: { gold: 490, shards: 92, tokens: 5 }
  },
  hell_circus: {
    intro: { fr: 'Le spectacle infernal recrute Silent Hill f, les Deadites, Spawn et les maisons hantees comme nouveaux numeros dont personne ne peut quitter la scene.', en: 'The infernal show recruits Silent Hill f, the Deadites, Spawn, and haunted houses as new acts no one can leave.' },
    missions: [
      { fr: 'Interrompre le mariage du Masque de Renard avant que Hinako ne devienne le role principal du cabaret.', en: 'Interrupt the Fox Mask wedding before Hinako becomes the cabaret lead role.' },
      { fr: 'Recuperer le Necronomicon dans les coulisses sans signer le contrat de Malebolgia.', en: 'Recover the Necronomicon backstage without signing Malebolgia s contract.' },
      { fr: 'Fermer la porte rouge d Insidious et la cave Perron entre deux changements de decor.', en: 'Close the Insidious red door and the Perron cellar between two set changes.' },
      { fr: 'Vaincre le Maitre de ceremonie Deadite avant le rappel final.', en: 'Defeat the Deadite Ringmaster before the final encore.' }
    ],
    outro: { fr: 'Le rideau tombe, mais A.R.C.A. garde une place vide pour ceux qui choisissent encore de sortir de leur role.', en: 'The curtain falls, but A.R.C.A. keeps an empty seat for those still choosing to leave their role.' },
    rewards: [
      { id: 'arc_hell_skin_red_curtain', type: 'skin', name: { fr: 'Apparence Rideau rouge', en: 'Red Curtain Appearance' } },
      { id: 'arc_hell_item_exit_ticket', type: 'item', name: { fr: 'Ticket de sortie infernal', en: 'Infernal Exit Ticket' } }
    ],
    claimReward: { gold: 475, shards: 90, tokens: 5 }
  },
  containment_labs: {
    intro: { fr: 'Les laboratoires de Rage, les IA d Evilution, Mikoshi, les experiences X1000 et les programmes UniSol partagent maintenant une meme chaine de confinement.', en: 'Rage laboratories, Evilution AI, Mikoshi, X1000 experiments, and UniSol programs now share one containment chain.' },
    missions: [
      { fr: 'Separer le virus Rage d une colonie de Cordyceps avant la premiere exposition croisee.', en: 'Separate the Rage virus from a Cordyceps colony before the first cross-exposure.' },
      { fr: 'Decompiler la combinaison Evilution sans copier ses modules adaptatifs dans RoboCop ou un UniSol.', en: 'Decompile the Evilution suit without copying its adaptive modules into RoboCop or a UniSol.' },
      { fr: 'Desactiver les puces X1000 qui classent les heros comme jouets militaires.', en: 'Disable X1000 chips that classify heroes as military toys.' },
      { fr: 'Sceller le Laboratoire Zero pendant que les morts de Matul contaminent les conduites de refroidissement.', en: 'Seal Laboratory Zero while the Matul dead contaminate the cooling lines.' }
    ],
    outro: { fr: 'Le nouveau protocole ne promet pas une purge parfaite: il garantit une origine, un echantillon et une voie de sortie pour chaque incident.', en: 'The new protocol does not promise a perfect purge: it guarantees an origin, a sample, and an exit route for every incident.' },
    rewards: [
      { id: 'arc_containment_skin_white_hazard', type: 'skin', name: { fr: 'Apparence Risque blanc', en: 'White Hazard Appearance' } },
      { id: 'arc_containment_item_origin_vial', type: 'item', name: { fr: 'Fiole d origine scellee', en: 'Sealed Origin Vial' } }
    ],
    claimReward: { gold: 500, shards: 96, tokens: 5 }
  },
  duel_and_arena: {
    intro: { fr: 'La House of Blue Leaves, le ring de Philadelphie, le Continental et l Animus imposent quatre regles de duel incompatibles.', en: 'The House of Blue Leaves, Philadelphia ring, the Continental, and the Animus impose four incompatible duel rules.' },
    missions: [
      { fr: 'Gagner un round sans tuer afin de conserver la lecon de Rocky dans une arene d assassins.', en: 'Win a round without killing to preserve Rocky s lesson inside an assassin arena.' },
      { fr: 'Rompre un marqueur de la Grande Table sans effacer la memoire du contrat dans l Animus.', en: 'Break a High Table marker without erasing the contract memory in the Animus.' },
      { fr: 'Aider Beatrix a retirer les faux noms multiversels de sa liste.', en: 'Help Beatrix remove forged multiversal names from her list.' },
      { fr: 'Vaincre le Duelliste Sans-Auteur selon une regle choisie par les trois combattants.', en: 'Defeat the Authorless Duelist under a rule chosen by all three fighters.' }
    ],
    outro: { fr: 'Le tournoi reconnait enfin qu une regle n est legitime que si les combattants peuvent la refuser.', en: 'The tournament finally recognizes that a rule is legitimate only if fighters can refuse it.' },
    rewards: [
      { id: 'arc_duel_skin_free_corner', type: 'skin', name: { fr: 'Apparence Coin libre', en: 'Free Corner Appearance' } },
      { id: 'arc_duel_item_broken_marker', type: 'item', name: { fr: 'Marqueur brise', en: 'Broken Marker' } }
    ],
    claimReward: { gold: 480, shards: 90, tokens: 4 }
  },
  wasteland_hellfront: {
    intro: { fr: 'La Fury Road traverse une Grande-Bretagne infectee puis debouche sur une nuit de Purge qui ne possede plus de limite horaire.', en: 'The Fury Road crosses infected Britain and opens into a Purge night that no longer has a time limit.' },
    missions: [
      { fr: 'Escorter le War Rig entre deux foyers Rage sans abandonner les civils lents.', en: 'Escort the War Rig between two Rage outbreaks without abandoning slow civilians.' },
      { fr: 'Detruire une balise NFFA qui declare la Citadelle zone de Purge permanente.', en: 'Destroy an NFFA beacon declaring the Citadel a permanent Purge zone.' },
      { fr: 'Recuperer les graines du Lieu Vert avant que le desert ne copie leur ADN.', en: 'Recover the Green Place seeds before the wasteland copies their DNA.' },
      { fr: 'Prendre la Citadelle de Rupture et diffuser une vraie fin de sirene.', en: 'Take the Rupture Citadel and broadcast a real siren ending.' }
    ],
    outro: { fr: 'Le front devient une route d evacuation plutot qu une machine a produire toujours plus de survivants armes.', en: 'The front becomes an evacuation route rather than a machine producing ever more armed survivors.' },
    rewards: [
      { id: 'arc_waste_skin_war_rig_anchor', type: 'skin', name: { fr: 'Apparence Ancre War Rig', en: 'War Rig Anchor Appearance' } },
      { id: 'arc_waste_item_green_seed_cache', type: 'item', name: { fr: 'Cache de graines vertes', en: 'Green Seed Cache' } }
    ],
    claimReward: { gold: 510, shards: 98, tokens: 5 }
  },
  absurd_b_movie_front: {
    intro: { fr: 'Le ticket de Last Action Hero, les echecs de Dragonfly, les Minions et Stan Helsing imposent au Nexus des consequences reelles avec une logique volontairement absurde.', en: 'The Last Action Hero ticket, Dragonfly s failures, the Minions, and Stan Helsing impose real consequences through deliberately absurd logic.' },
    missions: [
      { fr: 'Recuperer le ticket dore avant qu il n ouvre toutes les fins de film en meme temps.', en: 'Recover the golden ticket before it opens every movie ending at once.' },
      { fr: 'Terminer une mission de Dragonfly dont chaque erreur valide un objectif different.', en: 'Finish a Dragonfly mission where every mistake validates a different objective.' },
      { fr: 'Empecher les Minions d adopter le Sans-Auteur comme nouveau super-mechant.', en: 'Stop the Minions from adopting the Authorless as their new supervillain.' },
      { fr: 'Battre le Projectionniste impossible en respectant le rythme de la parodie.', en: 'Defeat the Impossible Projectionist while respecting parody timing.' }
    ],
    outro: { fr: 'A.R.C.A. archive enfin le non-sens comme une loi locale mesurable, et non comme une erreur a effacer.', en: 'A.R.C.A. finally archives nonsense as a measurable local law rather than an error to erase.' },
    rewards: [
      { id: 'arc_absurd_skin_golden_stub', type: 'skin', name: { fr: 'Apparence Souche doree', en: 'Golden Stub Appearance' } },
      { id: 'arc_absurd_item_parody_timer', type: 'item', name: { fr: 'Minuteur de parodie', en: 'Parody Timer' } }
    ],
    claimReward: { gold: 430, shards: 82, tokens: 5 }
  },
  kaiju_disaster_protocol: {
    intro: { fr: 'Mumakil, Fold Weapon, NOMAD, flottes Vogons et attaques RDA obligent A.R.C.A. a traiter la catastrophe comme un probleme d evacuation avant le combat.', en: 'Mumakil, the Fold Weapon, NOMAD, Vogon fleets, and RDA assaults force A.R.C.A. to treat disaster as an evacuation problem before combat.' },
    missions: [
      { fr: 'Tracer une voie civile entre les Mumakil et un largage de Titans.', en: 'Plot a civilian route between Mumakil and a Titanfall drop.' },
      { fr: 'Faire devier NOMAD sans rediriger son rayon vers Pandora.', en: 'Deflect NOMAD without redirecting its beam toward Pandora.' },
      { fr: 'Saboter les formulaires de demolition Vogons avant validation planetaire.', en: 'Sabotage the Vogon demolition forms before planetary approval.' },
      { fr: 'Detruire le Coordinateur de catastrophe seulement apres la derniere extraction.', en: 'Destroy the Disaster Coordinator only after the final extraction.' }
    ],
    outro: { fr: 'Le protocole compte les vies evacuees avant les degats infliges, ce qui change durablement le score des missions de catastrophe.', en: 'The protocol counts evacuated lives before damage dealt, permanently changing disaster mission scoring.' },
    rewards: [
      { id: 'arc_kaiju_skin_rescue_beacon', type: 'skin', name: { fr: 'Apparence Balise de secours', en: 'Rescue Beacon Appearance' } },
      { id: 'arc_kaiju_item_mass_route', type: 'item', name: { fr: 'Carte d evacuation massive', en: 'Mass Evacuation Chart' } }
    ],
    claimReward: { gold: 520, shards: 100, tokens: 5 }
  },
  manga_war_council: {
    faction: { fr: 'Archivistes des arcs de destin', en: 'Fate Arc Archivists' },
    intro: { fr: 'Les Trames manga n ouvrent pas seulement des mondes: elles imposent des arcs, des rivalites et des transformations.', en: 'Manga Threads do not only open worlds: they impose arcs, rivalries, and transformations.' },
    stakes: {
      fr: 'Si ces lois d arc se melangent sans cadre, chaque mission peut devenir une guerre finale avant que le joueur soit pret.',
      en: 'If these arc laws mix without structure, every mission can become a final war before the player is ready.'
    },
    gameplay: {
      fr: 'Directive A.R.C.A.: monter les niveaux, respecter les prerequis de personnages et reserver les trios aux conflits de synergie.',
      en: 'A.R.C.A. directive: raise levels, respect character prerequisites, and reserve trios for synergy conflicts.'
    },
    missions: [
      { fr: 'Isoler un carnet, une malediction ou un front militaire avant contamination d un autre arc.', en: 'Isolate a notebook, curse, or military front before it contaminates another arc.' },
      { fr: 'Forcer une transformation a rester un choix tactique et pas une reecriture permanente.', en: 'Force a transformation to remain a tactical choice, not a permanent rewrite.' },
      { fr: 'Sceller le Conseil des Rivaux sans effacer leurs histoires d origine.', en: 'Seal the Council of Rivals without erasing their origin stories.' }
    ],
    outro: { fr: 'Les arcs manga restent intenses, mais ils ne sautent plus les etapes de progression.', en: 'Manga arcs remain intense, but no longer skip progression steps.' },
    finale: { fr: 'Transformer les tropes de destin en routes jouables et coherentes.', en: 'Turn fate tropes into playable, coherent routes.' },
    rewards: [
      { id: 'arc_manga_skin_rival_mark', type: 'skin', name: { fr: 'Marque de Rivalite', en: 'Rival Mark' } },
      { id: 'arc_manga_item_arc_seal', type: 'item', name: { fr: 'Sceau de Chapitre Manga', en: 'Manga Chapter Seal' } }
    ],
    claimReward: { gold: 500, shards: 105, tokens: 5 }
  },
  screen_archive_fracture: {
    intro: { fr: 'Les archives d ecran melangent Springfield, Pasadena, Zootopie, le video-club de Stan et les aventures de Tintin dans un programme qui change de ton a chaque porte.', en: 'Screen archives mix Springfield, Pasadena, Zootopia, Stan s video store, and Tintin s adventures into a program that changes tone at every door.' },
    missions: [
      { fr: 'Retrouver un indice de Tintin retire par un gag de canape des Simpson.', en: 'Recover a Tintin clue removed by a Simpsons couch gag.' },
      { fr: 'Resoudre le modele de portail de Sheldon avec les preuves sociales de Judy et Nick.', en: 'Solve Sheldon s portal model using Judy and Nick s social evidence.' },
      { fr: 'Ramener Lilo et Stitch hors d une archive qui classe Ohana comme anomalie administrative.', en: 'Bring Lilo and Stitch out of an archive that classifies Ohana as an administrative anomaly.' },
      { fr: 'Verrouiller le Projecteur de ton avant qu il ne transforme toute mission en parodie mortelle.', en: 'Lock the Tone Projector before it turns every mission into lethal parody.' }
    ],
    outro: { fr: 'Chaque archive conserve son ton et ses consequences, sans obliger les autres mondes a jouer selon sa mise en scene.', en: 'Each archive keeps its tone and consequences without forcing other worlds to follow its staging.' },
    rewards: [
      { id: 'arc_screen_skin_archive_splice', type: 'skin', name: { fr: 'Apparence Montage archive', en: 'Archive Montage Appearance' } },
      { id: 'arc_screen_item_tone_key', type: 'item', name: { fr: 'Cle de tonalite', en: 'Tone Key' } }
    ],
    claimReward: { gold: 445, shards: 86, tokens: 4 }
  },
  infection_mutation_cordon: {
    intro: { fr: 'Les morts de Romero, le virus Rage, les morts de Matul et les Cordyceps atteignent le meme cordon avec des vitesses, memoires et comportements incompatibles.', en: 'Romero s dead, the Rage virus, Matul corpses, and Cordyceps reach the same cordon with incompatible speeds, memories, and behavior.' },
    missions: [
      { fr: 'Identifier quatre infections sans appliquer le mauvais antidote ni le mauvais protocole de tir.', en: 'Identify four infections without applying the wrong antidote or firing protocol.' },
      { fr: 'Escorter Bub et Big Daddy afin d etudier leur memoire sans les transformer en armes.', en: 'Escort Bub and Big Daddy to study their memory without turning them into weapons.' },
      { fr: 'Separer les infectes Rage des lents morts de ferme avant qu une horde hybride apparaisse.', en: 'Separate Rage infected from slow farmhouse dead before a hybrid horde appears.' },
      { fr: 'Purger les conduites de Matul et fermer le Cordon Alpha avec tous les survivants identifies.', en: 'Purge the Matul pipes and close Cordon Alpha with every identified survivor.' }
    ],
    outro: { fr: 'Le Codex ne classe plus tout mort mobile comme le meme ennemi: origine, vitesse, memoire et vecteur deviennent des informations de gameplay.', en: 'The Codex no longer classifies every moving corpse as the same enemy: origin, speed, memory, and vector become gameplay information.' },
    rewards: [
      { id: 'arc_infection_skin_cordon_alpha', type: 'skin', name: { fr: 'Apparence Cordon Alpha', en: 'Cordon Alpha Appearance' } },
      { id: 'arc_infection_item_four_vector_kit', type: 'item', name: { fr: 'Kit quatre vecteurs', en: 'Four-Vector Kit' } }
    ],
    claimReward: { gold: 515, shards: 100, tokens: 5 }
  }
};

export const UNIVERSE_NARRATIVE_ARCS = [
  ...FEATURED_UNIVERSE_NARRATIVE_ARCS,
  ...ORIGINAL_UNIVERSE_NARRATIVE_ARCS,
  dlcHalo.createUniverseNarrativeArcs(),
  dlcResidentEvil.createUniverseNarrativeArcs(),
  dlcHalfLife.createUniverseNarrativeArcs(),
  dlcStargate.createUniverseNarrativeArcs(),
  dlcSilentHill.createUniverseNarrativeArcs(),
  dlcDinoCrisis.createUniverseNarrativeArcs(),
  dlcTheMatrix.createUniverseNarrativeArcs(),
  dlcBuckethead.createUniverseNarrativeArcs(),
  dlcSystemOfADown.createUniverseNarrativeArcs(),
  dlcKaamelott.createUniverseNarrativeArcs(),
  {
    id: 'stargate_chain',
    title: { fr: 'Arc Univers - Reseau des Portes', en: 'Universe Arc - Gate Network' },
    universes: ['Stargate', 'Stargate Atlantis', 'Stargate Universe', 'Stargate Infinity'],
    intro: { fr: 'Les Portes ne relient plus seulement des planetes: elles accrochent des Trames entieres au Nexus.', en: 'The Gates no longer connect only planets: they hook entire Threads to the Nexus.' },
    missions: [
      { fr: 'Stabiliser Abydos et isoler le signal Goa uld.', en: 'Stabilize Abydos and isolate the Goa uld signal.' },
      { fr: 'Recuperer une carte ancienne dans Atlantis avant la derive.', en: 'Recover an Ancient map in Atlantis before drift.' },
      { fr: 'Forcer le Destiny a transmettre un Eclat d Origine.', en: 'Force Destiny to transmit an Origin Shard.' }
    ],
    outro: { fr: 'Le reseau devient une colonne vertebrale de voyage pour les futures cellules partagees.', en: 'The network becomes a travel backbone for future shared cells.' },
    reward: { fr: 'Apparence Iris Nexus + Relique Chevron Huit', en: 'Nexus Iris Appearance + Eighth Chevron Relic' }
  },
  {
    id: 'lab_disasters',
    title: { fr: 'Arc Univers - Laboratoires de rupture', en: 'Universe Arc - Rupture Labs' },
    universes: ['Half-Life', 'Portal', 'Resident Evil', 'Dino Crisis', 'Dead Space'],
    intro: { fr: 'Chaque laboratoire pretendait controler son anomalie. Le Nexus archive le mensonge.', en: 'Every lab claimed it controlled its anomaly. The Nexus archives the lie.' },
    missions: [
      { fr: 'Comparer Cascade de Resonance, portail Aperture et infection Umbrella.', en: 'Compare Resonance Cascade, Aperture portal, and Umbrella infection.' },
      { fr: 'Purifier une station ou Xen et Necromorphs partagent la meme frequence.', en: 'Purify a station where Xen and Necromorphs share one frequency.' },
      { fr: 'Fermer le Laboratoire Zero.', en: 'Close Laboratory Zero.' }
    ],
    outro: { fr: 'A.R.C.A. cree les Protocoles de confinement permanents.', en: 'A.R.C.A. creates permanent containment protocols.' },
    reward: { fr: 'Trace Chambre Blanche + Apparence Combinaison Nexus', en: 'White Chamber Trace + Nexus Suit Appearance' }
  },
  {
    id: 'watcher_hellmouth',
    title: { fr: 'Arc Univers - Ligne de la Bouche d Enfer', en: 'Universe Arc - Hellmouth Line' },
    universes: ['Buffy the Vampire Slayer', 'Charmed', 'Hellraiser', 'Hazbin Hotel'],
    intro: { fr: 'Magie, demons et prophecies entrent dans le Nexus par les memes fissures rituelles.', en: 'Magic, demons, and prophecies enter the Nexus through the same ritual cracks.' },
    missions: [
      { fr: 'Proteger une archive d Observateur pendant une attaque de demons croises.', en: 'Protect a Watcher archive during a cross-demon attack.' },
      { fr: 'Recomposer un cercle Halliwell sans donner de nom au Sans-Auteur.', en: 'Rebuild a Halliwell circle without giving the Authorless a name.' },
      { fr: 'Sceller une boite infernale avant qu elle ne devienne portail permanent.', en: 'Seal an infernal box before it becomes a permanent portal.' }
    ],
    outro: { fr: 'La magie devient une discipline de stabilisation, pas seulement une exception.', en: 'Magic becomes a stabilization discipline, not only an exception.' },
    reward: { fr: 'Relique Pieu d Origine + Apparence Cercle Nexus', en: 'Origin Stake Relic + Nexus Circle Appearance' }
  },
  {
    id: 'anime_judgment_cell',
    title: { fr: 'Arc Univers - Corps, carnets et titans', en: 'Universe Arc - Cells, Notes, and Titans' },
    universes: ['Attack on Titan', 'Death Note', 'Cells at Work!', 'Inuyashiki'],
    intro: { fr: 'Ces Trames posent la meme question au Nexus: qui decide qu une vie vaut moins qu une histoire?', en: 'These Threads ask the Nexus one question: who decides a life is worth less than a story?' },
    missions: [
      { fr: 'Evacuer une ville miniature attaquee par des geants et des cellules infectees.', en: 'Evacuate a miniature city attacked by giants and infected cells.' },
      { fr: 'Bruler une page de jugement avant qu elle ne classe les heros comme variables.', en: 'Burn a judgment page before it classifies heroes as variables.' },
      { fr: 'Forcer un corps cybernetique a choisir le sauvetage plutot que l effacement.', en: 'Force a cybernetic body to choose rescue over erasure.' }
    ],
    outro: { fr: 'Le Nexus inscrit une regle: aucune optimisation ne remplace le choix de proteger.', en: 'The Nexus writes one rule: no optimization replaces the choice to protect.' },
    reward: { fr: 'Serum de Trame + Apparence Cellule Blindee', en: 'Thread Serum + Armored Cell Appearance' }
  }
];

const CURATED_CHARACTER_NARRATIVE_ARCS = [
  {
    id: 'player_anchor',
    stageId: 9201,
    heroId: 'player_anchor',
    title: { fr: 'Arc Personnage - L Ancre', en: 'Character Arc - The Anchor' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Ombre du Sans-Auteur',
    unlock: { type: 'clears', value: 1 },
    intro: { fr: 'Le joueur n est pas recrute: il est le point fixe autour duquel les autres signatures tiennent.', en: 'The player is not recruited: they are the fixed point holding other signatures together.' },
    missions: [
      { fr: 'Choisir son nom et stabiliser la premiere escouade.', en: 'Choose a name and stabilize the first squad.' },
      { fr: 'Porter une relique de Trame sans perdre son identite.', en: 'Carry a Thread relic without losing identity.' },
      { fr: 'Resister a une tentative de suppression du Sans-Auteur.', en: 'Resist an Authorless deletion attempt.' }
    ],
    outro: { fr: 'L Ancre devient commandant, archive vivante et cle des futures cellules partagees.', en: 'The Anchor becomes commander, living archive, and key to future shared cells.' },
    reward: { fr: 'Titre Profil: Ancre Prime', en: 'Profile Title: Prime Anchor' },
    rewardItemId: 'char_player_anchor_prime'
  },
  dlcHalfLife.createCuratedCharacterNarrativeArcs(),
  dlcHalfLife.createCuratedCharacterNarrativeArcs2(),
  dlcHalfLife.createCuratedCharacterNarrativeArcs3(),
  dlcHalfLife.createCuratedCharacterNarrativeArcs4(),
  dlcHalo.createCuratedCharacterNarrativeArcs(),
  dlcAlien.createCuratedCharacterNarrativeArcs(),
  dlcPredator.createCuratedCharacterNarrativeArcs(),
  dlcResidentEvil.createCuratedCharacterNarrativeArcs(),
  dlcResidentEvil.createCuratedCharacterNarrativeArcs2(),
  dlcResidentEvil.createCuratedCharacterNarrativeArcs3(),
  dlcTheMatrix.createCuratedCharacterNarrativeArcs(),
  dlcTheMatrix.createCuratedCharacterNarrativeArcs2(),
  dlcTheMatrix.createCuratedCharacterNarrativeArcs3(),
  dlcBuckethead.createCuratedCharacterNarrativeArcs(),
  dlcBuckethead.createCuratedCharacterNarrativeArcs2(),
  dlcBuckethead.createCuratedCharacterNarrativeArcs3(),
  dlcSystemOfADown.createCuratedCharacterNarrativeArcs(),
  dlcSystemOfADown.createCuratedCharacterNarrativeArcs2(),
  dlcSystemOfADown.createCuratedCharacterNarrativeArcs3(),
  dlcStargate.createCuratedCharacterNarrativeArcs(),
  dlcStargate.createCuratedCharacterNarrativeArcs2(),
  dlcStargate.createCuratedCharacterNarrativeArcs3(),
  dlcStargate.createCuratedCharacterNarrativeArcs4(),
  dlcSilentHill.createCuratedCharacterNarrativeArcs(),
  dlcSilentHill.createCuratedCharacterNarrativeArcs2(),
  dlcSilentHill.createCuratedCharacterNarrativeArcs3(),
  dlcDinoCrisis.createCuratedCharacterNarrativeArcs(),
  dlcDinoCrisis.createCuratedCharacterNarrativeArcs2(),
  dlcDinoCrisis.createCuratedCharacterNarrativeArcs3(),
  dlcPortal.createCuratedCharacterNarrativeArcs(),
  dlcBuffyTheVampireSlayer.createCuratedCharacterNarrativeArcs(),
  dlcBreakingBad.createCuratedCharacterNarrativeArcs(),
  dlcPoliceSquad.createCuratedCharacterNarrativeArcs(),
  dlcKaamelott.createCuratedCharacterNarrativeArcs(),
  dlcKaamelott.createCuratedCharacterNarrativeArcs2(),
  dlcKaamelott.createCuratedCharacterNarrativeArcs3()
];

const CATEGORY_ARC_PROFILE = {
  marine: {
    mode: 'Tactics',
    boss: { fr: 'Champion de Frontiere', en: 'Frontier Champion' },
    reward: { fr: 'Armure Nexus', en: 'Nexus Armor' },
    color: '#63d7ff',
    role: {
      fr: 'tenir la ligne, encaisser la premiere vague et transformer une guerre locale en victoire d escouade',
      en: 'hold the line, absorb the first wave, and turn a local war into a squad victory'
    }
  },
  tactical: {
    mode: 'Tactics',
    boss: { fr: 'Strategie Miroir', en: 'Mirror Strategy' },
    reward: { fr: 'Dossier Tactique Nexus', en: 'Nexus Tactical File' },
    color: '#f6f1d1',
    role: {
      fr: 'lire le terrain, choisir la bonne cible et faire tenir ensemble des allies impossibles',
      en: 'read the field, choose the right target, and make impossible allies hold together'
    }
  },
  hacker: {
    mode: 'RPG',
    boss: { fr: 'Noyau de Code Fantome', en: 'Ghost Code Core' },
    reward: { fr: 'Interface Nexus', en: 'Nexus Interface' },
    color: '#41ffac',
    role: {
      fr: 'comprendre les regles cachees de la Trame et retourner une anomalie contre elle-meme',
      en: 'understand hidden Thread rules and turn an anomaly against itself'
    }
  },
  slayer: {
    mode: 'Smash',
    boss: { fr: 'Duelliste Sans-Auteur', en: 'Authorless Duelist' },
    reward: { fr: 'Marque de Chasseur Nexus', en: 'Nexus Hunter Mark' },
    color: '#e74c3c',
    role: {
      fr: 'rompre la ligne ennemie, provoquer le champion local et finir la scene avant qu elle ne se referme',
      en: 'break the enemy line, provoke the local champion, and finish the scene before it closes'
    }
  },
  horror: {
    mode: 'RPG',
    boss: { fr: 'Peur d Origine', en: 'Origin Fear' },
    reward: { fr: 'Talisman de Survie Nexus', en: 'Nexus Survival Talisman' },
    color: '#cbd8c8',
    role: {
      fr: 'survivre au script de peur, proteger les derniers temoins et donner un nom au cauchemar',
      en: 'survive the fear script, protect the last witnesses, and give the nightmare a name'
    }
  }
};

const slugifyArcId = (value) => String(value)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '_')
  .replace(/^_+|_+$/g, '');

const getCharacterArcProfile = (hero) => CATEGORY_ARC_PROFILE[hero.category] || CATEGORY_ARC_PROFILE.tactical;

const CURATED_CHARACTER_HERO_IDS = new Set(CURATED_CHARACTER_NARRATIVE_ARCS.map(arc => arc.heroId));

const GENERATED_CHARACTER_NARRATIVE_ARCS = HEROES_DB
  .filter(hero => isUniverseInstalled(hero.universe) && !CURATED_CHARACTER_HERO_IDS.has(hero.id))
  .map((hero, index) => {
    const stableIndex = getStableContentIndex('generatedCharacterArcs', hero.id, index);
    const profile = getCharacterArcProfile(hero);
    const slug = slugifyArcId(hero.id);
    const specialName = hero.special?.name || hero.secondary?.name || hero.simple?.name || hero.weaponType || hero.category;
    const levelUnlock = stableIndex % 2 === 0;
    return {
      id: `${slug}_personal_thread`,
      stageId: 9300 + stableIndex,
      heroId: hero.id,
      title: { fr: `Arc Personnage - ${hero.name}`, en: `Character Arc - ${hero.name}` },
      mode: profile.mode,
      difficulty: 'Personal',
      bossName: `${profile.boss.fr} - ${hero.universe}`,
      unlock: levelUnlock
        ? { type: 'level', value: 2 + (stableIndex % 4) }
        : { type: 'clears', value: 2 + (stableIndex % 10) },
      intro: {
        fr: `${hero.name} arrive depuis ${hero.universe} avec une signature que le Nexus ne peut pas copier sans la comprendre. Son arc personnel sert a ${profile.role.fr}.`,
        en: `${hero.name} arrives from ${hero.universe} with a signature the Nexus can only stabilize by respecting its Thread laws. This personal arc is about how they ${profile.role.en}.`
      },
      missions: [
        {
          fr: `Stabiliser la signature ${hero.universe} de ${hero.name} avant qu elle ne devienne une simple donnee d archive.`,
          en: `Stabilize ${hero.name}'s ${hero.universe} signature before it becomes a simple archive record.`
        },
        {
          fr: `Transformer "${specialName}" en protocole anti-breche compatible avec une escouade multivers.`,
          en: `Turn "${specialName}" into an anti-breach protocol compatible with a multiverse squad.`
        },
        {
          fr: `Vaincre ${profile.boss.fr} pour prouver que ${hero.name} reste fidele a son lore meme dans la Compression de Resonance.`,
          en: `Defeat the ${profile.boss.en} to prove ${hero.name} stays true to their lore even inside Resonance Compression.`
        }
      ],
      outro: {
        fr: `${hero.name} garde sa memoire de ${hero.universe}, mais gagne une fonction claire dans Breach Multiverse.`,
        en: `${hero.name} keeps their ${hero.universe} memory, but gains a clear function inside Breach Multiverse.`
      },
      reward: {
        fr: `Apparence ${hero.name} Nexus + ${profile.reward.fr}`,
        en: `${hero.name} Nexus Appearance + ${profile.reward.en}`
      },
      rewardItemId: `char_auto_${slug}_nexus`,
      // Original rescue adaptation: Saturnin is the protected identity, never
      // both the deployed fighter and the escorted duckling in this mission.
      ...(hero.id === 'saturnin_duck' ? {
        bossName: null,
        finalePolicy: {
          policy: 'nonCombatFinal',
          objective: {
            fr: 'Escorter Saturnin vivant jusqu’à la zone d’extraction',
            en: 'Escort Saturnin alive to the extraction zone'
          }
        },
        tacticsBattlefieldId: 'nexus_escort_route',
        escort: {
          heroId: hero.id,
          universe: hero.universe,
          role: { fr: 'Caneton à escorter', en: 'Duckling to escort' }
        },
        requiredTeam: {
          type: 'sources',
          sourceUniverses: [hero.universe],
          excludedHeroIds: [hero.id],
          allowAnchor: true
        },
        intro: {
          fr: 'Adaptation originale du projet : Saturnin doit quitter le village miniature sous la protection de ses compagnons. Déployez Police Dog ou Professor Popof avec votre Cellule éligible ; Saturnin reste la cible escortée, pas un combattant de l’équipe.',
          en: 'Original project adaptation: Saturnin must leave the miniature village under his companions’ protection. Deploy Police Dog or Professor Popof with your eligible Cell; Saturnin remains the escorted target, not a squad fighter.'
        },
        missions: [
          { fr: 'Former une équipe de secours avec au moins un compagnon de Saturnin, sans déployer Saturnin lui-même.', en: 'Form a rescue squad with at least one of Saturnin’s companions, without deploying Saturnin himself.' },
          { fr: 'Rester à proximité du caneton et dégager une route praticable jusqu’à la zone d’extraction.', en: 'Stay close to the duckling and clear a walkable route to the extraction zone.' },
          { fr: 'Amener Saturnin vivant jusqu’à la zone d’extraction : éliminer les menaces ne termine pas l’escorte.', en: 'Get Saturnin to the extraction zone alive: clearing threats does not complete the escort.' }
        ],
        outro: {
          fr: 'Saturnin atteint la sortie vivant grâce à ses compagnons. Cette escorte originale préserve son identité de caneton et les souvenirs de son village.',
          en: 'Saturnin reaches the exit alive thanks to his companions. This original escort preserves his duckling identity and memories of his village.'
        }
      } : {})
    };
  });

export const CHARACTER_NARRATIVE_ARCS = [
  ...CURATED_CHARACTER_NARRATIVE_ARCS,
  ...GENERATED_CHARACTER_NARRATIVE_ARCS
];

const GENERATED_CHARACTER_SKINS = Object.fromEntries(
  GENERATED_CHARACTER_NARRATIVE_ARCS.map(arc => {
    const hero = HEROES_DB.find(item => item.id === arc.heroId);
    const profile = getCharacterArcProfile(hero || {});
    return [
      arc.rewardItemId,
      {
        id: arc.rewardItemId,
        heroId: arc.heroId,
        name: {
          fr: `${hero?.name || arc.heroId} Nexus`,
          en: `${hero?.name || arc.heroId} Nexus`
        },
        colors: {
          primaryColor: hero?.primaryColor || profile.color,
          secondaryColor: hero?.secondaryColor || profile.color
        }
      }
    ];
  })
);

export const SKIN_CATALOG = {
  default: {
    id: 'default',
    name: { fr: 'Apparence origine', en: 'Origin look' },
    colors: {}
  },
  char_player_anchor_prime: {
    id: 'char_player_anchor_prime',
    heroId: 'player_anchor',
    name: { fr: 'Ancre Prime', en: 'Prime Anchor' },
    colors: { primaryColor: '#ffffff', secondaryColor: '#39c5bb' }
  },
  char_player_anchor_palimpsest: {
    id: 'char_player_anchor_palimpsest',
    heroId: 'player_anchor',
    name: { fr: 'Ancre du Palimpseste', en: 'Palimpsest Anchor' },
    colors: { primaryColor: '#f7fbff', secondaryColor: '#8a63ff' }
  },
  char_freeman_hev_nexus: dlcHalfLife.createSkinCatalog(),
  char_barney_city17: dlcHalfLife.createSkinCatalog2(),
  char_shephard_opposing_force: dlcHalfLife.createSkinCatalog3(),
  char_alyx_resistance: dlcHalfLife.createSkinCatalog4(),
  char_masterchief_atrium: dlcHalo.createSkinCatalog(),
  char_oneill_sgc_nexus: dlcStargate.createSkinCatalog(),
  char_carter_sgc_science: dlcStargate.createSkinCatalog2(),
  char_tealc_free_jaffa: dlcStargate.createSkinCatalog3(),
  char_daniel_abydos: dlcStargate.createSkinCatalog4(),
  char_pyramidhead_red_rust: dlcSilentHill.createSkinCatalog(),
  char_james_lakeview: dlcSilentHill.createSkinCatalog2(),
  char_heather_aglaophotis: dlcSilentHill.createSkinCatalog3(),
  char_regina_sort_ibis: dlcDinoCrisis.createSkinCatalog(),
  char_dylan_trat: dlcDinoCrisis.createSkinCatalog2(),
  char_rick_third_energy: dlcDinoCrisis.createSkinCatalog3(),
  char_ripley_loader_nexus: dlcAlien.createSkinCatalog(),
  char_predator_rift_stalker: dlcPredator.createSkinCatalog(),
  char_leon_rpd_nexus: dlcResidentEvil.createSkinCatalog(),
  char_jill_last_escape: dlcResidentEvil.createSkinCatalog2(),
  char_wesker_uroboros_sealed: dlcResidentEvil.createSkinCatalog3(),
  char_neo_free_code: dlcTheMatrix.createSkinCatalog(),
  char_trinity_nebuchadnezzar: dlcTheMatrix.createSkinCatalog2(),
  char_morpheus_red_pill: dlcTheMatrix.createSkinCatalog3(),
  char_buckethead_bucketheadland: dlcBuckethead.createSkinCatalog(),
  char_death_cube_k_shadow: dlcBuckethead.createSkinCatalog2(),
  char_pike_riff_archive: dlcBuckethead.createSkinCatalog3(),
  char_soad_frontline_voice: dlcSystemOfADown.createSkinCatalog(),
  char_soad_staccato_guitar: dlcSystemOfADown.createSkinCatalog2(),
  char_soad_groove_bass: dlcSystemOfADown.createSkinCatalog3(),
  char_arthur_kaamelott_king: dlcKaamelott.createSkinCatalog(),
  char_perceval_c_est_pas_faux: dlcKaamelott.createSkinCatalog2(),
  char_karadoc_vannes_ration: dlcKaamelott.createSkinCatalog3(),
  char_chell_white_room: dlcPortal.createSkinCatalog(),
  char_buffy_nexus_slayer: dlcBuffyTheVampireSlayer.createSkinCatalog(),
  char_walter_blue_formula: dlcBreakingBad.createSkinCatalog(),
  char_drebin_wrong_case: dlcPoliceSquad.createSkinCatalog(),
  ...GENERATED_CHARACTER_SKINS,
  ...ORIGINAL_SKIN_CATALOG,
  arc_scifi_skin_atrium_bulwark: {
    id: 'arc_scifi_skin_atrium_bulwark',
    name: { fr: 'Rempart Atrium', en: 'Atrium Bulwark' },
    colors: { primaryColor: '#63d7ff', secondaryColor: '#ffeb3b' }
  },
  arc_cyber_skin_zone_404: {
    id: 'arc_cyber_skin_zone_404',
    name: { fr: 'Zone 404', en: 'Zone 404' },
    colors: { primaryColor: '#41ffac', secondaryColor: '#9b59b6' }
  },
  arc_fear_skin_black_archive: {
    id: 'arc_fear_skin_black_archive',
    name: { fr: 'Archive Noire', en: 'Black Archive' },
    colors: { primaryColor: '#cbd8c8', secondaryColor: '#e74c3c' }
  },
  arc_stage_skin_neon_persona: {
    id: 'arc_stage_skin_neon_persona',
    name: { fr: 'Neon Persona', en: 'Neon Persona' },
    colors: { primaryColor: '#f1c40f', secondaryColor: '#39c5bb' }
  },
  arc_xeno_skin_acid_armor: {
    id: 'arc_xeno_skin_acid_armor',
    name: { fr: 'Armure Acide', en: 'Acid Armor' },
    colors: { primaryColor: '#7ee8dc', secondaryColor: '#8cff5a' }
  }
};

export const FUSION_MISSIONS = [
  {
    id: 'stargate_x_halo',
    stageId: 9001,
    title: { fr: 'Fusion - Anneau et Porte', en: 'Fusion - Ring and Gate' },
    universes: ['Halo', 'Stargate'],
    primaryUniverse: 'Halo',
    mode: 'Tactics',
    difficulty: 'Fusion',
    bossName: 'Scarab a Chevrons',
    goldPrize: 180,
    shardPrize: 70,
    tokenPrize: 3,
    unlockClears: 6,
    decor: { fr: 'Une installation Halo percee par une Porte des Etoiles active.', en: 'A Halo installation pierced by an active Stargate.' },
    enemies: { fr: 'Elites contamines par symbiotes, drones Anciens, sentinelles Forerunner.', en: 'Symbiote-corrupted Elites, Ancient drones, Forerunner sentinels.' },
    item: { fr: 'Chevron Forerunner', en: 'Forerunner Chevron' },
    itemId: 'fusion_chevron_forerunner'
  },
  {
    id: 'matrix_portal_ghost',
    stageId: 9002,
    title: { fr: 'Fusion - Chambre 404', en: 'Fusion - Chamber 404' },
    universes: ['The Matrix', 'Portal', 'Ghost in the Shell'],
    primaryUniverse: 'The Matrix',
    mode: 'RPG',
    difficulty: 'Fusion',
    bossName: 'Administrateur Aperture-Section 9',
    goldPrize: 190,
    shardPrize: 75,
    tokenPrize: 3,
    unlockClears: 8,
    decor: { fr: 'Salle de test Aperture compilee dans un cybercerveau vert Matrix.', en: 'An Aperture test chamber compiled inside a green Matrix cyberbrain.' },
    enemies: { fr: 'Tourelles conscientes, agents copies, pare-feu Tachikoma hostile.', en: 'Self-aware turrets, copied agents, hostile Tachikoma firewall.' },
    item: { fr: 'Cube de Simulation', en: 'Simulation Cube' },
    itemId: 'fusion_simulation_cube'
  },
  {
    id: 'silent_resident_saw',
    stageId: 9003,
    title: { fr: 'Fusion - Hopital du Jugement', en: 'Fusion - Judgment Hospital' },
    universes: ['Silent Hill', 'Resident Evil', 'Saw'],
    primaryUniverse: 'Silent Hill',
    mode: 'Smash',
    difficulty: 'Fusion',
    bossName: 'Infirmiere Jigsaw-T',
    goldPrize: 200,
    shardPrize: 80,
    tokenPrize: 4,
    unlockClears: 10,
    decor: { fr: 'Hopital brumeux ou chaque soin exige un choix moral.', en: 'A foggy hospital where every heal demands a moral choice.' },
    enemies: { fr: 'Infectes a pieges, infirmieres corrompues, marionnette de brume.', en: 'Trap-infected, corrupted nurses, fog puppet.' },
    item: { fr: 'Seringue du Verdict', en: 'Verdict Syringe' },
    itemId: 'fusion_verdict_syringe'
  },
  {
    id: 'buffycharmed_hellraiser',
    stageId: 9004,
    title: { fr: 'Fusion - Cercle et Configuration', en: 'Fusion - Circle and Configuration' },
    universes: ['Buffy the Vampire Slayer', 'Charmed', 'Hellraiser'],
    primaryUniverse: 'Buffy the Vampire Slayer',
    mode: 'RPG',
    difficulty: 'Fusion',
    bossName: 'Oracle Cenobite de Sunnydale',
    goldPrize: 210,
    shardPrize: 85,
    tokenPrize: 4,
    unlockClears: 12,
    decor: { fr: 'Un lycee de Sunnydale grave de runes Halliwell autour d une boite de lamentation.', en: 'A Sunnydale school carved with Halliwell runes around a lament configuration.' },
    enemies: { fr: 'Vampires ensorceles, demons a chaines, familiers corrompus.', en: 'Hexed vampires, chained demons, corrupted familiars.' },
    item: { fr: 'Pieu de Configuration', en: 'Configuration Stake' },
    itemId: 'fusion_configuration_stake'
  },
  {
    id: 'breakingbad_splice_evolution',
    stageId: 9005,
    title: { fr: 'Fusion - Laboratoire Bleu Chimere', en: 'Fusion - Blue Chimera Lab' },
    universes: ['Breaking Bad', 'Splice', 'Evolution'],
    primaryUniverse: 'Breaking Bad',
    mode: 'Tactics',
    difficulty: 'Fusion',
    bossName: 'Heisenberg Chimere',
    goldPrize: 220,
    shardPrize: 90,
    tokenPrize: 4,
    unlockClears: 14,
    decor: { fr: 'Un labo mobile ou catalyseurs bleus, ADN hybride et evolution alien reagissent ensemble.', en: 'A mobile lab where blue catalysts, hybrid DNA, and alien evolution react together.' },
    enemies: { fr: 'Gardes cartel mutes, larves chimere, drones de confinement.', en: 'Mutated cartel guards, chimera larvae, containment drones.' },
    item: { fr: 'Catalyseur Chimere Bleu', en: 'Blue Chimera Catalyst' },
    itemId: 'fusion_blue_chimera_catalyst'
  },
  {
    id: 'aot_deathnote_inuyashiki',
    stageId: 9006,
    title: { fr: 'Fusion - Jugement du Titan Cyber', en: 'Fusion - Cyber Titan Judgment' },
    universes: ['Attack on Titan', 'Death Note', 'Inuyashiki'],
    primaryUniverse: 'Attack on Titan',
    mode: 'Smash',
    difficulty: 'Fusion',
    bossName: 'Titan Kira Mecanise',
    goldPrize: 230,
    shardPrize: 95,
    tokenPrize: 5,
    unlockClears: 16,
    decor: { fr: 'Une ville muree ou les noms ecrits deviennent trajectoires de missiles.', en: 'A walled city where written names become missile trajectories.' },
    enemies: { fr: 'Titans purs marques, drones civils, copies de jugement.', en: 'Marked pure titans, civilian drones, judgment copies.' },
    item: { fr: 'Page de Titan Cyber', en: 'Cyber Titan Page' },
    itemId: 'fusion_cyber_titan_page'
  },
  {
    id: 'middle_earth_wizard_mummy',
    stageId: 9007,
    title: { fr: 'Fusion - L Anneau des deux Livres', en: 'Fusion - Ring of the Two Books' },
    universes: ['The Lord of the Rings', 'Harry Potter', 'The Mummy'],
    primaryUniverse: 'The Lord of the Rings',
    mode: 'RPG',
    difficulty: 'Fusion',
    bossName: 'Imhotep Nazgul Horcruxe',
    goldPrize: 245,
    shardPrize: 100,
    tokenPrize: 5,
    unlockClears: 18,
    decor: { fr: 'Barad-dur s eleve au-dessus d Hamunaptra tandis que les escaliers de Poudlard relient les deux Livres des Morts.', en: 'Barad-dur rises above Hamunaptra while Hogwarts staircases connect the two Books of the Dead.' },
    enemies: { fr: 'Mangemorts Uruk-hai, momies Dementors et cavaliers Nazgul sous malediction egyptienne.', en: 'Death Eater Uruk-hai, Dementor mummies, and Nazgul riders under an Egyptian curse.' },
    item: { fr: 'Fiole d Amon-Galadriel', en: 'Phial of Amun-Galadriel' },
    itemId: 'fusion_amun_galadriel_phial'
  },
  {
    id: 'machine_personhood_protocol',
    stageId: 9008,
    title: { fr: 'Fusion - Directive Personne', en: 'Fusion - Personhood Directive' },
    universes: ['Terminator', 'RoboCop', 'The Creator'],
    primaryUniverse: 'The Creator',
    mode: 'Tactics',
    difficulty: 'Fusion',
    bossName: 'NOMAD-Skynet OCP Mainframe',
    goldPrize: 250,
    shardPrize: 102,
    tokenPrize: 5,
    unlockClears: 20,
    decor: { fr: 'Un Detroit futur sert de cible a NOMAD pendant que Skynet et OCP se disputent les directives de chaque machine.', en: 'A future Detroit becomes a NOMAD target while Skynet and OCP fight over every machine directive.' },
    enemies: { fr: 'Endosquelettes OCP, drones NOMAD et escouades ED-209 pilotees par une IA de guerre.', en: 'OCP endoskeletons, NOMAD drones, and ED-209 squads driven by a war AI.' },
    item: { fr: 'Processeur de libre directive', en: 'Free Directive Processor' },
    itemId: 'fusion_free_directive_cpu'
  },
  {
    id: 'night_city_memory_heist',
    stageId: 9009,
    title: { fr: 'Fusion - Braquage de Memoire 2077', en: 'Fusion - Memory Heist 2077' },
    universes: ['Cyberpunk', 'Blade Runner', 'Assassin\'s Creed'],
    primaryUniverse: 'Cyberpunk',
    mode: 'Tactics',
    difficulty: 'Fusion',
    bossName: 'Templier Smasher Replicant',
    goldPrize: 255,
    shardPrize: 105,
    tokenPrize: 5,
    unlockClears: 22,
    decor: { fr: 'Mikoshi est reconstruit dans une pyramide Tyrell dont les souvenirs sont parcourus par un Animus Templier.', en: 'Mikoshi is rebuilt inside a Tyrell pyramid whose memories are traversed by a Templar Animus.' },
    enemies: { fr: 'Assassins corporatifs, replicants sous contrat et daemons Abstergo.', en: 'Corporate assassins, contracted replicants, and Abstergo daemons.' },
    item: { fr: 'Lame secrete Voight-Kampff', en: 'Voight-Kampff Hidden Blade' },
    itemId: 'fusion_voight_hidden_blade'
  },
  {
    id: 'zombie_vector_collision',
    stageId: 9010,
    title: { fr: 'Fusion - Cordon des Quatre Vitesses', en: 'Fusion - Four-Speed Cordon' },
    universes: ['Day of the Dead', '28 Days Later', 'The Last of Us'],
    primaryUniverse: 'Day of the Dead',
    mode: 'RPG',
    difficulty: 'Fusion',
    bossName: 'Bloater Rage de Bunker',
    goldPrize: 260,
    shardPrize: 108,
    tokenPrize: 5,
    unlockClears: 24,
    decor: { fr: 'Le bunker de Floride ouvre sur un Londres vide dont les conduites portent des spores Cordyceps.', en: 'The Florida bunker opens into an empty London whose pipes carry Cordyceps spores.' },
    enemies: { fr: 'Infectes Rage, clickers de mine et morts lents conservant des fragments de memoire.', en: 'Rage infected, mine clickers, and slow dead retaining memory fragments.' },
    item: { fr: 'Serum Bub-Cordyceps', en: 'Bub-Cordyceps Serum' },
    itemId: 'fusion_bub_cordyceps_serum'
  },
  {
    id: 'haunted_red_door',
    stageId: 9011,
    title: { fr: 'Fusion - Maison de la Porte rouge', en: 'Fusion - House of the Red Door' },
    universes: ['Silent Hill f', 'The Conjuring', 'Insidious'],
    primaryUniverse: 'Silent Hill f',
    mode: 'RPG',
    difficulty: 'Fusion',
    bossName: 'Bathsheba au Masque de Renard',
    goldPrize: 265,
    shardPrize: 110,
    tokenPrize: 6,
    unlockClears: 26,
    decor: { fr: 'La ferme Perron pousse dans Ebisugaoka; sa cave descend directement dans le Lointain derriere une porte rouge.', en: 'The Perron farmhouse grows inside Ebisugaoka; its cellar descends directly into the Further behind a red door.' },
    enemies: { fr: 'Esprits fleuris, onryo du Lointain et objets hantes lies au rite du mariage.', en: 'Flowered spirits, Further onryo, and haunted objects bound to the wedding rite.' },
    item: { fr: 'Omamori de lien astral', en: 'Astral Tether Omamori' },
    itemId: 'fusion_astral_omamori'
  },
  {
    id: 'speed_platform_trinity',
    stageId: 9012,
    title: { fr: 'Fusion - Route des Trois Portails', en: 'Fusion - Three-Portal Run' },
    universes: ['Sonic', 'Crash Bandicoot', 'Spyro'],
    primaryUniverse: 'Sonic',
    mode: 'Smash',
    difficulty: 'Fusion',
    bossName: 'Eggman Cortex Gnorc Engine',
    goldPrize: 235,
    shardPrize: 96,
    tokenPrize: 5,
    unlockClears: 18,
    decor: { fr: 'Green Hill traverse Wumpa Island avant de grimper dans le royaume cristallise des Artisans.', en: 'Green Hill crosses Wumpa Island before climbing into the crystallized Artisans realm.' },
    enemies: { fr: 'Badniks a caisses TNT, Gnorcs mutants et assistants de laboratoire montes sur anneaux.', en: 'TNT-crate Badniks, mutant Gnorcs, and lab assistants riding rings.' },
    item: { fr: 'Cristal du Chaos Wumpa', en: 'Wumpa Chaos Crystal' },
    itemId: 'fusion_wumpa_chaos_crystal'
  },
  {
    id: 'relic_investigation_route',
    stageId: 9013,
    title: { fr: 'Fusion - Ligne des Trois Reliques', en: 'Fusion - Three-Relic Line' },
    universes: ['Tomb Raider', 'The Da Vinci Code', 'Tintin'],
    primaryUniverse: 'Tomb Raider',
    mode: 'Tactics',
    difficulty: 'Fusion',
    bossName: 'Natla du Prieure rouge',
    goldPrize: 245,
    shardPrize: 100,
    tokenPrize: 5,
    unlockClears: 20,
    decor: { fr: 'Une tombe atlante sous le Louvre contient la Licorne et un Cryptex grave des signes du Scion.', en: 'An Atlantean tomb beneath the Louvre contains the Unicorn and a Cryptex carved with Scion signs.' },
    enemies: { fr: 'Mercenaires templiers, faux detectives et gardiens atlantes.', en: 'Templar mercenaries, false detectives, and Atlantean guardians.' },
    item: { fr: 'Cryptex du Scion-Licorne', en: 'Scion-Unicorn Cryptex' },
    itemId: 'fusion_scion_unicorn_cryptex'
  },
  {
    id: 'contract_ring_revenge',
    stageId: 9014,
    title: { fr: 'Fusion - Le Dernier Round du Contrat', en: 'Fusion - Contract Final Round' },
    universes: ['John Wick', 'Kill Bill', 'Rocky'],
    primaryUniverse: 'John Wick',
    mode: 'Smash',
    difficulty: 'Fusion',
    bossName: 'Bill de la Grande Table',
    goldPrize: 250,
    shardPrize: 104,
    tokenPrize: 5,
    unlockClears: 22,
    decor: { fr: 'Le ring de Philadelphie occupe le Continental, entoure par les cloisons de la House of Blue Leaves.', en: 'The Philadelphia ring occupies the Continental, surrounded by House of Blue Leaves partitions.' },
    enemies: { fr: 'Crazy 88 sous contrat, arbitres assassins et boxeurs blindes de la Grande Table.', en: 'Contracted Crazy 88, assassin referees, and High Table armored boxers.' },
    item: { fr: 'Marqueur du Gant Hanzo', en: 'Hanzo Glove Marker' },
    itemId: 'fusion_hanzo_glove_marker'
  },
  {
    id: 'family_toy_trap',
    stageId: 9015,
    title: { fr: 'Fusion - Maison des Petits Espions', en: 'Fusion - Small Spy House' },
    universes: ['Home Alone', 'Spy Kids', 'Small Soldiers'],
    primaryUniverse: 'Home Alone',
    mode: 'Tactics',
    difficulty: 'Fusion',
    bossName: 'Chip Hazard Wet Bandit',
    goldPrize: 225,
    shardPrize: 92,
    tokenPrize: 4,
    unlockClears: 16,
    decor: { fr: 'La maison McCallister devient un chateau de Floop dont chaque jouet contient une puce X1000.', en: 'The McCallister house becomes a Floop castle where every toy contains an X1000 chip.' },
    enemies: { fr: 'Thumb-Thumb camoufles, Commando Elite et cambrioleurs equipes de gadgets OSS.', en: 'Camouflaged Thumb-Thumbs, Commando Elite, and burglars carrying OSS gadgets.' },
    item: { fr: 'Talkboy X1000', en: 'X1000 Talkboy' },
    itemId: 'fusion_x1000_talkboy'
  },
  {
    id: 'fury_purge_mars',
    stageId: 9016,
    title: { fr: 'Fusion - Sirene rouge de Mars', en: 'Fusion - Red Siren of Mars' },
    universes: ['Mad Max: Fury Road', 'The Purge', 'Ghosts of Mars'],
    primaryUniverse: 'Mad Max: Fury Road',
    mode: 'Smash',
    difficulty: 'Fusion',
    bossName: 'Immortan Big Daddy Purger',
    goldPrize: 270,
    shardPrize: 112,
    tokenPrize: 6,
    unlockClears: 28,
    decor: { fr: 'Le War Rig traverse Shining Canyon pendant qu une sirene NFFA autorise les esprits martiens a posseder chaque convoi.', en: 'The War Rig crosses Shining Canyon while an NFFA siren authorizes Martian spirits to possess every convoy.' },
    enemies: { fr: 'War Boys possedes, escadrons NFFA et mineurs martiens sur polecars.', en: 'Possessed War Boys, NFFA squads, and Martian miners on polecars.' },
    item: { fr: 'Balise War Rig anti-possession', en: 'Anti-Possession War Rig Beacon' },
    itemId: 'fusion_war_rig_spirit_beacon'
  }
];

export { SPECIAL_EVENTS } from './specialEvents.js';

export const TRIO_NARRATIVE_ARCS = [
  {
    id: 'atrium_first_cell',
    stageId: 41001,
    heroIds: ['player_anchor', 'freeman', 'masterchief'],
    title: { fr: 'Arc Trio - Premiere cellule Atrium', en: 'Trio Arc - First Atrium Cell' },
    universes: ['Nexus de Convergence', 'Half-Life', 'Halo'],
    mode: 'Tactics',
    difficulty: 'Trio',
    bossName: 'Commandant de Frontiere Sans-Auteur',
    unlock: { type: 'clears', value: 2 },
    intro: {
      fr: 'L Ancre tient la memoire, Freeman ouvre la faille scientifique et le Chief transforme le chaos en ligne de front. A.R.C.A. teste ici la premiere cellule de trois signatures.',
      en: 'The Anchor holds memory, Freeman opens the scientific breach, and the Chief turns chaos into a battle line. A.R.C.A. tests the first three-signature cell here.'
    },
    missions: [
      { fr: 'Synchroniser HEV, Mjolnir et balise d Ancre sur une meme carte tactique.', en: 'Synchronize HEV, Mjolnir, and Anchor beacon on one tactical map.' },
      { fr: 'Defendre une porte de fuite pendant que la cascade de resonance traverse un anneau Halo.', en: 'Defend an escape gate while a resonance cascade crosses a Halo ring.' },
      { fr: 'Abattre le Commandant de Frontiere avant qu il ne transforme les soldats en variables sans nom.', en: 'Defeat the Frontier Commander before it turns soldiers into nameless variables.' }
    ],
    outro: { fr: 'La cellule Atrium devient le modele des futures equipes de trois.', en: 'The Atrium Cell becomes the model for future three-hero teams.' },
    reward: { fr: 'Relique Cellule Atrium + titre Trio Prime', en: 'Atrium Cell Relic + Prime Trio Title' },
    rewardItemId: 'trio_atrium_first_cell'
  },
  {
    id: 'survivors_last_door',
    stageId: 41002,
    heroIds: ['ripley', 'leon', 'chell'],
    title: { fr: 'Arc Trio - Derniere porte de survie', en: 'Trio Arc - Last Survival Door' },
    universes: ['Alien', 'Resident Evil', 'Portal'],
    mode: 'RPG',
    difficulty: 'Trio',
    bossName: 'Sas Infection-Test',
    unlock: { type: 'clears', value: 6 },
    intro: {
      fr: 'Ripley refuse la ruche, Leon refuse l infection et Chell refuse la chambre fermee. Ensemble, ils prouvent qu une sortie peut rester humaine.',
      en: 'Ripley refuses the hive, Leon refuses infection, and Chell refuses the sealed chamber. Together, they prove an exit can remain human.'
    },
    missions: [
      { fr: 'Escorter des survivants dans un complexe ou les tests Aperture distribuent des spores.', en: 'Escort survivors through a facility where Aperture tests distribute spores.' },
      { fr: 'Ouvrir une route de portails sans laisser Umbrella classer les civils comme specimens.', en: 'Open a portal route without letting Umbrella classify civilians as specimens.' },
      { fr: 'Sceller le Sas Infection-Test avec une evacuation complete.', en: 'Seal the Infection-Test Airlock with a full evacuation.' }
    ],
    outro: { fr: 'Le Nexus grave une regle de survie: personne ne devient ressource sans consentement.', en: 'The Nexus engraves a survival rule: no one becomes a resource without consent.' },
    reward: { fr: 'Cle de Sas Blanche + passif Evacuation', en: 'White Airlock Key + Evacuation Passive' },
    rewardItemId: 'trio_survivors_last_door'
  },
  {
    id: 'occult_wrong_prophecy',
    stageId: 41003,
    heroIds: ['predator', 'pyramidhead', 'kirsty'],
    title: { fr: 'Arc Trio - Tribunal des chasseurs', en: 'Trio Arc - Hunters Tribunal' },
    universes: ['Predator', 'Silent Hill', 'Hellraiser'],
    mode: 'Smash',
    difficulty: 'Trio',
    bossName: 'Juge du Trophee Interdit',
    unlock: { type: 'clears', value: 8 },
    intro: {
      fr: 'Le Yautja cherche une proie digne, Pyramid Head incarne la punition et Kirsty sait qu une boite peut transformer un desir en enfer. A.R.C.A. les enferme dans un tribunal ou la chasse doit redevenir une regle, pas une torture.',
      en: 'The Yautja seeks worthy prey, Pyramid Head embodies punishment, and Kirsty knows a box can turn desire into hell. A.R.C.A. locks them in a tribunal where the hunt must become a rule again, not torture.'
    },
    missions: [
      { fr: 'Separarer une chasse Yautja d une sentence Silent Hill avant que les deux lois fusionnent.', en: 'Separate a Yautja hunt from a Silent Hill sentence before the two laws merge.' },
      { fr: 'Utiliser la boite comme preuve, pas comme portail de punition permanente.', en: 'Use the box as evidence, not as a permanent punishment portal.' },
      { fr: 'Vaincre le Juge du Trophee Interdit sans laisser le Nexus confondre justice et plaisir de tuer.', en: 'Defeat the Forbidden Trophy Judge without letting the Nexus confuse justice with the joy of killing.' }
    ],
    outro: { fr: 'Le tribunal reste monstrueux, mais il obtient une limite: la proie doit encore avoir un nom.', en: 'The tribunal remains monstrous, but gains a limit: the prey must still have a name.' },
    reward: { fr: 'Masque du Tribunal + relique Boite-temoin', en: 'Tribunal Mask + Witness Box Relic' },
    rewardItemId: 'trio_occult_wrong_prophecy'
  },
  {
    id: 'control_formula_matrix',
    stageId: 41004,
    heroIds: ['neo', 'oneill', 'snake'],
    title: { fr: 'Arc Trio - Operation Source noire', en: 'Trio Arc - Black Source Operation' },
    universes: ['The Matrix', 'Stargate', 'Metal Gear'],
    mode: 'Tactics',
    difficulty: 'Trio',
    bossName: 'Architecte FoxDie Goa uld',
    unlock: { type: 'clears', value: 10 },
    intro: {
      fr: 'Neo lit le code, O Neill garde l equipe humaine et Snake infiltre le mensonge avant qu il devienne doctrine. Leur trio sert a detruire les systemes qui appellent le controle une liberation.',
      en: 'Neo reads code, O Neill keeps the team human, and Snake infiltrates the lie before it becomes doctrine. Their trio exists to destroy systems that call control liberation.'
    },
    missions: [
      { fr: 'Infiltrer une matrice SGC ou chaque Porte demande une authentification militaire.', en: 'Infiltrate an SGC matrix where every Gate demands military authentication.' },
      { fr: 'Neutraliser un virus FoxDie reecrit par un symbiote Goa uld.', en: 'Neutralize a FoxDie virus rewritten by a Goa uld symbiote.' },
      { fr: 'Demonter l Architecte FoxDie Goa uld avant qu il ne transforme le libre arbitre en protocole.', en: 'Dismantle the FoxDie Goa uld Architect before it turns free will into protocol.' }
    ],
    outro: { fr: 'La Source noire perd son masque: une mission peut etre discrete sans devenir inhumaine.', en: 'The Black Source loses its mask: a mission can be discreet without becoming inhuman.' },
    reward: { fr: 'Codec Chevron Noir + passif Libre Choix', en: 'Black Chevron Codec + Free Choice Passive' },
    rewardItemId: 'trio_control_formula_matrix'
  }
];

export { REPUTATION_TRACKS } from './factionProgression.js';

export const META_NEXUS_RECOMMENDATIONS = [
  { id: 'first_team', text: { fr: 'Garde ton Ancre dans l escouade: sa signature fixe empeche les autres Trames de se dissoudre.', en: 'Keep your Anchor in the squad: their fixed signature prevents other Threads from dissolving.' } },
  { id: 'faction_pair', text: { fr: 'Croise deux heros d une meme famille de Trame pour renforcer la resonance commune.', en: 'Cross two heroes from the same Thread family to reinforce shared resonance.' } },
  { id: 'arc_reward', text: { fr: 'Sceller un arc doit laisser une trace: apparence, relique ou passif de faction grave dans le Nexus.', en: 'Sealing an arc should leave a trace: appearance, relic, or faction passive engraved into the Nexus.' } }
];
