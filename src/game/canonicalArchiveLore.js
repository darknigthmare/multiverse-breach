// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcGearsOfWar from '../../DLC/GearsOfWar/data/canonicalArchiveLore.js';
import * as dlcHalo from '../../DLC/Halo/data/canonicalArchiveLore.js';
import * as dlcAlien from '../../DLC/Alien/data/canonicalArchiveLore.js';
import * as dlcHalfLife from '../../DLC/HalfLife/data/canonicalArchiveLore.js';
import * as dlcMetalGear from '../../DLC/MetalGear/data/canonicalArchiveLore.js';
import * as dlcPiratesOfTheCaribbean from '../../DLC/PiratesOfTheCaribbean/data/canonicalArchiveLore.js';
import * as dlcFallout from '../../DLC/Fallout/data/canonicalArchiveLore.js';

import { CANON_PRIORITY_STAGES } from './canonPriorityStages.js';

// These notices do not certify the historical sprites. Other episodes of each
// franchise retain their own entries instead of inheriting this mission's era.
const notice = (name, incarnation, referenceUrl, fr, en) => Object.freeze({
  name, incarnation, referenceUrl, lore: Object.freeze({ fr, en })
});

export const CANONICAL_ARCHIVE_ENEMY_LORE = Object.freeze({
  'Gears of War': dlcGearsOfWar.createCanonicalArchiveEnemyLore({ notice }),
  Halo: dlcHalo.createCanonicalArchiveEnemyLore({ notice }),
  Alien: dlcAlien.createCanonicalArchiveEnemyLore({ notice }),
  'Half-Life': dlcHalfLife.createCanonicalArchiveEnemyLore({ notice }),
  'Metal Gear': dlcMetalGear.createCanonicalArchiveEnemyLore({ notice }),
  'Pirates of the Caribbean': dlcPiratesOfTheCaribbean.createCanonicalArchiveEnemyLore({ notice }),
  Fallout: dlcFallout.createCanonicalArchiveEnemyLore({ notice })
});

export const getCanonicalArchiveEnemyLore = (universe, enemy) => {
  if (
    enemy?.incarnation && enemy.referenceUrl?.startsWith('https://')
    && enemy.sourceLore?.fr && enemy.sourceLore?.en
  ) {
    return notice(enemy.canonicalName || enemy.name, enemy.incarnation, enemy.referenceUrl, enemy.sourceLore.fr, enemy.sourceLore.en);
  }
  if (!Object.hasOwn(CANONICAL_ARCHIVE_ENEMY_LORE, universe)) return null;
  const entries = CANONICAL_ARCHIVE_ENEMY_LORE[universe];
  if (!Object.hasOwn(entries, enemy?.name)) return null;
  const entry = entries[enemy.name];
  if (enemy.incarnation && (
    typeof enemy.incarnation !== 'string' || !enemy.incarnation.startsWith(entry.incarnation)
  )) return null;
  return entry;
};

const stageNotice = (source, fr, en, adaptationFr, adaptationEn) => Object.freeze({
  source, lore: Object.freeze({ fr, en }),
  adaptation: Object.freeze({ fr: adaptationFr, en: adaptationEn })
});

export const CANONICAL_STAGE_ARCHIVE_LORE = Object.freeze([
  stageNotice(
    CANON_PRIORITY_STAGES.lightmassTrain,
    'Le train transporte la bombe Lightmass dans les profondeurs de Sera. Marcus Fenix et Dominic Santiago progressent de wagon en wagon, puis affrontent General RAAM, sa Troika et sa protection de Kryll.',
    'The train carries the Lightmass Bomb into Sera’s depths. Marcus Fenix and Dominic Santiago advance through its cars before confronting General RAAM, his Troika and his Kryll protection.',
    'Les Kryll bloquent les dégâts ordinaires. Les grenades frag et les départs de l’essaim exposent RAAM ; la lumière protège de l’essaim. Les commandes ATB, la réserve partagée de grenades et les durées adaptent le combat original.',
    'Kryll block ordinary damage. Frag grenades and swarm departures expose RAAM; light protects from the swarm. ATB commands, shared grenade supply and timings adapt the original fight.'
  ),
  stageNotice(
    CANON_PRIORITY_STAGES.metropolisScarab,
    'À Metropolis, Master Chief traverse les rues et canaux de New Mombasa envahis par le Covenant. Il rejoint les passerelles au-dessus du Scarab Protos, l’aborde et neutralise son équipage.',
    'In Metropolis, Master Chief crosses Covenant-occupied New Mombasa streets and canals. He reaches the walkways above the Protos Scarab, boards it and neutralizes its crew.',
    'Rejoignez la passerelle d’abordage puis neutralisez le Grunt et l’Élite de l’équipage. La coque du Scarab est invulnérable. La grille, le véhicule immobile et le nombre d’occupants adaptent Metropolis ; aucun cœur arrière de Halo 3 n’est ajouté.',
    'Reach the boarding catwalk, then neutralize the Grunt and Elite crew. The Scarab hull is invulnerable. The grid, stationary walker and crew count adapt Metropolis; no Halo 3 rear core is added.'
  ),
  stageNotice(
    CANON_PRIORITY_STAGES.hadleysQueen,
    'Ripley entre dans la ruche du processeur atmosphérique de Hadley’s Hope, sur LV-426, pour sauver Newt. Elle découvre les œufs et la Reine, puis quitte le processeur avant son explosion. Le duel au power loader se déroule ensuite à bord du Sulaco.',
    'Ripley enters Hadley’s Hope’s atmosphere processor hive on LV-426 to rescue Newt. She discovers the eggs and the Queen, then leaves the processor before it explodes. The power-loader duel takes place afterward aboard the Sulaco.',
    'Libérez Newt au repère du nid, puis atteignez la sortie avec son porteur vivant. Les coups repoussent la Reine sans la tuer ; sa défaite ne remplace pas le sauvetage. Les vagues, la route 2D, les repères et l’échec si le porteur tombe adaptent la scène. Le duel ultérieur au power loader reste à réaliser séparément à bord du Sulaco.',
    'Free Newt at the nest marker, then reach the exit with her living carrier. Hits repel the Queen without killing her; defeating her cannot replace the rescue. Waves, the 2D route, markers and failure if the carrier falls adapt the scene. The later power-loader duel remains to be implemented separately aboard the Sulaco.'
  ),
  stageNotice(
    CANON_PRIORITY_STAGES.xenNihilanth,
    'Dans la dernière chambre de Xen, Gordon Freeman affronte Nihilanth, une créature en lévitation alimentée par des cristaux. Ses sphères de téléportation peuvent envoyer Freeman dans d’autres salles ; sa tête ouverte révèle son point faible cérébral.',
    'In Xen’s final chamber, Gordon Freeman confronts Nihilanth, a levitating creature sustained by crystals. Its teleportation spheres can send Freeman into other rooms; its opened head exposes its brain weak point.',
    'Détruisez les trois cristaux, affaiblissez le boss et sa réserve de sphères de soin, puis visez le cerveau lorsque la tête s’ouvre. Le corps ne peut pas recevoir le coup fatal. Les plateformes et durées sont adaptées au mode Smash ; les salles de téléportation et les renforts invoqués restent à réaliser.',
    'Destroy the three crystals, weaken the boss and its healing-sphere reserve, then aim at the brain when the head opens. Body hits cannot deliver the lethal blow. Platforms and timings adapt the fight to Smash; teleport rooms and summoned reinforcements remain to be implemented.'
  ),
  stageNotice(
    CANON_PRIORITY_STAGES.shadowMoses,
    'Dans le hangar souterrain de Shadow Moses, Solid Snake affronte le Metal Gear REX piloté par Liquid Snake. Le radôme détruit prive REX de ses capteurs, oblige le cockpit à s’ouvrir et expose le pilote à la seconde phase.',
    'In Shadow Moses’s underground hangar, Solid Snake confronts the Metal Gear REX piloted by Liquid Snake. Destroying the radome deprives REX of its sensors, forces the cockpit open and exposes the pilot in the second phase.',
    'Le Stinger de mission vise le radôme puis le cockpit ouvert ; les dégâts ordinaires sur la coque ne désactivent pas REX. Grille, portée, réapprovisionnement, deux réserves de PV et aide de Gray Fox hors champ sont adaptés au jeu. Les soldats Genome représentent l’approche. Liquid survit : son duel ultérieur reste hors mission. Mitrailleuses, missiles, laser ventral et piétinement ont des cases annoncées. Trois grenades chaff partagées dispersent les salves radar pendant deux attaques de REX ; au cockpit Liquid vise à vue. Empreintes, impacts et durée sont adaptés, pas mesurés sur PS1.',
    'The mission Stinger targets the radome, then the open cockpit; ordinary body damage cannot disable REX. Grid, range, resupply, two HP pools and Gray Fox’s offscreen assistance are gameplay adaptations. Genome soldiers represent the approach. Liquid survives: his later fistfight is outside the mission. Machine guns, missiles, belly laser and stomps have marked cells. Three shared chaff grenades disperse radar salvos for two REX attacks; from the cockpit Liquid aims visually. Footprints, impacts and duration are adaptations, not PS1 measurements.'
  ),
  stageNotice(
    CANON_PRIORITY_STAGES.legatesCamp,
    'Pendant la seconde bataille de Hoover Dam, le Courrier atteint le camp du Légat à l’est du barrage. Lanius y commande les forces de la Légion de César, porte son masque d’acier et manie la Blade of the East. Le jeu original permet le combat ou une résolution par le dialogue.',
    'During the Second Battle of Hoover Dam, the Courier reaches the Legate’s camp east of the dam. Lanius commands Caesar’s Legion, wears his steel mask and wields the Blade of the East. The original game permits combat or a dialogue resolution.',
    'La mission Smash choisit le duel contre Lanius ; les résidus de brèche des vagues ordinaires appartiennent à Multiverse Breach.',
    'The Smash mission selects the Lanius duel; the regular waves’ breach residue belongs to Multiverse Breach.'
  )
]);

export const getCanonicalArchiveStageLore = stage => {
  if (
    stage?.incarnation && stage.referenceUrl?.startsWith('https://')
    && stage.sourceSceneLore?.fr && stage.sourceSceneLore?.en
    && stage.sourceSceneAdaptation?.fr && stage.sourceSceneAdaptation?.en
    && !stage.characterArc && !stage.fusionMission && !stage.originalContent
  ) {
    return { source: stage, lore: stage.sourceSceneLore, adaptation: stage.sourceSceneAdaptation };
  }
  return CANONICAL_STAGE_ARCHIVE_LORE.find(entry => (
    stage?.id === entry.source.id
    && stage.universe === entry.source.universe
    && stage.incarnation === entry.source.incarnation
    && !stage.characterArc && !stage.fusionMission && !stage.originalContent
  )) || null;
};

// Explicit names are authoritative. Never substitute a different world boss
// when a mission asks for a local opponent, including a disabled/missing one.
export const resolveStageArchiveBoss = (stage, universeEnemies = {}) => {
  if (!stage) return null;
  const candidates = [
    ...(universeEnemies.bosses || []),
    universeEnemies.worldBoss,
    ...(universeEnemies.monsters || [])
  ].filter(Boolean);
  const requestedNames = [stage.bossName, stage.canonicalBossName].filter(Boolean);
  if (requestedNames.length) {
    return candidates.find(enemy => requestedNames.includes(enemy.name))
      || candidates.find(enemy => requestedNames.includes(enemy.canonicalName))
      || null;
  }
  return universeEnemies.worldBoss || universeEnemies.bosses?.[0] || null;
};
