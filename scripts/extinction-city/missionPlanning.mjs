/** Reproducible design backlog, never a runtime quest registry or a canon certificate. */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseAst } from 'rolldown/parseAst';
import { HEROES_DB } from '../../src/game/heroes.js';
import { ENEMIES_DB, FINAL_GAME_BOSS } from '../../src/game/enemies.js';
import { LORE_DB } from '../../src/game/lore.js';
import { createPlayerHero } from '../../src/game/playerHero.js';
import { CHARACTER_PLAQUES, getCharacterPlaque } from '../../src/game/characterPlaques.js';
import { getUniverseSignature } from '../../src/game/loreDescriptions.js';
import { getUniverseHubPlace } from '../../src/game/mosaicUniversePlaces.js';
import { MOSAIC_CHARACTER_MISSIONS } from '../../src/game/mosaicCharacterMissions.js';
import { CANON_ROSTER_WAVE } from '../../src/game/canonRosterWave.js';
import { EXPANDED_UNIVERSES } from '../../src/game/expandedUniverses.js';
import { getDlcManifest } from '../../DLC/index.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DATE = '2026-11-08';
const SLOTS = ['simple', 'secondary', 'defense', 'special'];
const GENERIC_ACTION = /signature strike|breach technique|origin burst|signature action|signature technique|defensive action|decisive action/i;
const GENERIC_OBJECTIVE = /^(terminer l.objectif de|résoudre .+ par le rythme, l.orientation|complete .+ without combat)/i;
const GENERIC_LORE = /conserve sa silhouette et sa fonction|preserves the canonical silhouette|progresse uniquement par interaction|progresses only through interaction/i;
const GENERIC_WEAPON = /^(gun|laser|slash|improvised)$/i;
const nonCombat = actor => actor?.nonCombat === true || actor?.category === 'trial' || actor?.cat === 'trial';
const text = value => typeof value === 'string' ? value : value?.fr || value?.en || value?.label || '';
const texts = value => Array.isArray(value) ? value.flatMap(texts) : typeof value === 'object' && value !== null
  ? text(value) ? [text(value)] : Object.entries(value).flatMap(([key, item]) => typeof item === 'string' ? [`${key}: ${item}`] : texts(item))
  : typeof value === 'string' && value ? [value] : [];
const unique = items => [...new Set(items.filter(Boolean))];
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const sourceUrl = (revision, file) => `https://github.com/darknigthmare/multiverse-breach/blob/${revision}/${file}`;
const packs = new Map([...CANON_ROSTER_WAVE, ...EXPANDED_UNIVERSES].map(pack => [pack.universe, pack]));

const SOURCE_FILES = [
  'scripts/extinction-city/catalog.mjs', 'scripts/extinction-city/missionPlanning.mjs',
  'src/game/heroes.js', 'src/game/enemies.js', 'src/game/playerHero.js', 'src/game/lore.js',
  'src/game/characterPlaques.js', 'src/game/loreDescriptions.js', 'src/game/expandedUniverses.js',
  'src/game/canonRosterWave.js', 'src/game/canonP0SourceKits.js',
  'src/game/canonBlackPearlSourceKits.js', 'src/game/canonFollowupSourceKits.js',
  'src/game/mosaicUniversePlaces.js', 'src/game/mosaicCityRuntime.js',
  'src/game/mosaicResidentDialogue.js', 'src/game/mosaicReconnaissance.js', 'src/game/mosaicCharacterMissions.js',
  'src/game/mosaicCharacterStories.js', 'src/game/mosaicMissionOperations.js', 'src/game/ocCampaign.js',
  'src/game/nexusFieldOperation.js', 'DLC/index.js'
];

function referenceFiles(universe) {
  const manifest = getDlcManifest(universe);
  const related = manifest?.modules.filter(module => /heroes|enemies|lore|canonRoster|expandedUniverse|characterPlaques|canon.*SourceKit/i.test(module.runtimeAdapter)) || [];
  return unique([
    'src/game/heroes.js', 'src/game/enemies.js', 'src/game/characterPlaques.js',
    'src/game/lore.js', 'src/game/loreDescriptions.js', 'src/game/mosaicUniversePlaces.js',
    ...related.map(module => `${manifest.directory}/${module.path}`)
  ]);
}

/** Inventory static local imports recursively, including shared source-kit builders.
 * No source module is evaluated by this walk and no external reference is fetched. */
function sourceClosure(entryFiles) {
  const seen = new Set();
  const queue = [...entryFiles];
  while (queue.length) {
    const file = queue.shift();
    if (seen.has(file)) continue;
    seen.add(file);
    const absolute = path.join(ROOT, file);
    if (!existsSync(absolute) || !/\.(?:m?js|jsx)$/.test(file)) continue;
    const ast = parseAst(readFileSync(absolute, 'utf8'), file.endsWith('.jsx') ? { lang: 'jsx' } : null, absolute);
    for (const node of ast.body) {
      if (!['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration'].includes(node.type)
        || typeof node.source?.value !== 'string' || !node.source.value.startsWith('.')) continue;
      const target = path.resolve(path.dirname(absolute), node.source.value);
      if (!target.startsWith(`${ROOT}${path.sep}`)) throw new Error(`Source import escapes repository: ${file}`);
      const resolved = [target, `${target}.js`, `${target}.jsx`, `${target}.mjs`, `${target}.json`, path.join(target, 'index.js')].find(candidate => existsSync(candidate));
      if (!resolved) throw new Error(`Missing source import in ${file}: ${node.source.value}`);
      queue.push(path.relative(ROOT, resolved).split(path.sep).join('/'));
    }
  }
  return [...seen].sort();
}

function sourceObjective(actor) {
  // Several source records have a generic French label and a precise English objective.
  // Keep the precise text verbatim with its language instead of silently losing its meaning.
  const fr = text(actor.objectiveFr);
  return fr && !GENERIC_OBJECTIVE.test(fr) ? { text: fr, language: 'fr' }
    : text(actor.objective) ? { text: text(actor.objective), language: typeof actor.objective === 'string' ? 'en' : 'fr' }
      : fr ? { text: fr, language: 'fr' } : { text: '', language: null };
}

function characterRecord(hero, revision) {
  const pack = packs.get(hero.universe) || {};
  const lore = LORE_DB[hero.universe] || {};
  const plaque = getCharacterPlaque(hero);
  const policy = ENEMIES_DB[hero.universe]?.finalePolicy;
  const universe = getUniverseSignature(hero.universe, lore);
  const objective = sourceObjective(hero);
  const equipment = unique([...texts(hero.equipment), ...texts(hero.sourceProps), ...texts(hero.weapon)]);
  const actions = SLOTS.filter(slot => hero[slot]).map(slot => ({
    slot, name: text(hero[slot]?.name || hero[slot]), type: hero[slot]?.type || '',
    generic: GENERIC_ACTION.test(text(hero[slot]?.name || hero[slot])),
    sourceField: `HEROES_DB[${hero.id}].${slot}`
  }));
  const declaredReferences = unique([
    hero.referenceUrl, ...texts(hero.referenceUrls), ...texts(hero.additionalReferences),
    pack.referenceUrl, ...texts(pack.referenceUrls), lore.referenceUrl, ...texts(policy?.referenceUrls)
  ]).filter(value => /^https?:\/\//.test(value));
  const rawLore = text(hero.loreLocalized || hero.lore);
  const authoredPlaque = Boolean(CHARACTER_PLAQUES[hero.id]);
  const genericActions = actions.some(action => action.generic);
  const missing = [];
  if (!declaredReferences.length && hero.universe !== 'Nexus de Convergence' && !hero.originalContent) missing.push('external_reference_missing');
  const continuity = text(hero.incarnation || hero.sourceIncarnation || hero.continuity || hero.continuityScope
    || pack.continuity || pack.canonProfile?.continuity || policy?.continuity);
  if (!continuity && hero.universe !== 'Nexus de Convergence') missing.push('continuity_not_locked');
  if (genericActions && !nonCombat(hero)) missing.push('generic_ability_names');
  if (!nonCombat(hero) && !authoredPlaque && (!equipment.length || equipment.every(item => GENERIC_WEAPON.test(item)))) missing.push('individual_equipment_not_documented');
  if (!objective.text && !authoredPlaque && (!rawLore || GENERIC_LORE.test(rawLore))) missing.push('individual_narrative_not_documented');
  const rules = unique([
    ...texts(hero.identityRule), ...texts(hero.presentationRule), ...texts(hero.depictionRule),
    ...texts(hero.representationRule), ...texts(hero.captureRule),
    ...texts(hero.prohibitedConcepts).map(value => `Exclusion source : ${value}`),
    ...texts(hero.prohibitedAudio).map(value => `Audio exclu : ${value}`),
    hero.sameProtagonistAs ? `Même protagoniste que ${hero.sameProtagonistAs} : variante distincte du catalogue, aucune seconde personne inventée.` : '',
    hero.uniqueAbility === false ? 'Aucune capacité exclusive à cette apparence : conserver les capacités communes du protagoniste.' : ''
  ]);
  const files = unique([hero.isPlayer ? 'src/game/playerHero.js' : '', ...referenceFiles(hero.universe)]);
  return {
    id: hero.id, name: hero.name, universe: hero.universe, category: hero.category || hero.cat || '',
    nonCombat: nonCombat(hero), isPlayer: hero.isPlayer === true,
    sourceRole: text(hero.narrativeRole || hero.loreRole || hero.combatRole || plaque.role),
    planningNotes: INDIVIDUAL_PROPOSALS[hero.id]?.note || '',
    sourceIdentityType: hero.sourceIdentityType || hero.entityType || 'catalog-character',
    sameProtagonistAs: hero.sameProtagonistAs || null, uniqueAbility: hero.uniqueAbility ?? null,
    sourceLore: rawLore || text(plaque.dossier), sourceLoreKind: rawLore ? 'authored-actor-field' : authoredPlaque ? 'authored-plaque' : 'generated-category-plaque',
    sourceDoctrine: text(plaque.doctrine), sourceBreachLore: text(plaque.breachLore),
    sourceOrigin: text(plaque.origin), sourceObjective: objective.text, sourceObjectiveLanguage: objective.language,
    sourceVictoryCondition: hero.victoryCondition || '', equipment, rawWeaponType: hero.weaponType || '',
    equipmentUse: nonCombat(hero) ? 'Source brute conservée pour audit ; armes génériques exclues des missions pacifiques.' : 'Équipement déclaré, association et incarnation à vérifier avant production.',
    actions, sourceAbilities: unique([...texts(hero.sourceAbilities), ...texts(hero.skills)]),
    genericActions, sourceStage: universe.stageName || hero.universe, sourceTheme: text(universe.theme),
    cityDistrict: getUniverseHubPlace(hero.universe, 'fr').name,
    finalePolicy: policy?.policy || null, finaleObjective: text(policy?.objective),
    continuity: continuity || (hero.universe === 'Nexus de Convergence' ? 'Lore original Multiverse du dépôt' : ''),
    runtimeMissions: MOSAIC_CHARACTER_MISSIONS.filter(item => item.heroId === hero.id).map(item => item.id),
    declaredCanonStatus: hero.canonStatus || pack.canonStatus || '',
    declaredReviewStatus: hero.sourceReviewStatus || hero.referenceReviewStatus || '',
    canonStatus: hero.universe === 'Nexus de Convergence' || hero.originalContent ? 'project_lore_review_required' : 'external_canon_review_required',
    sourceGaps: missing, identityConstraints: rules,
    externalReferences: declaredReferences, externalReferencesChecked: false,
    sourceFiles: files, sourceRefs: [hero.isPlayer ? 'createPlayerHero()' : `HEROES_DB[${hero.id}]`, `getCharacterPlaque(${hero.id})`, `LORE_DB[${hero.universe}]`, `getUniverseSignature(${hero.universe})`],
    sourceUrl: sourceUrl(revision, hero.isPlayer ? 'src/game/playerHero.js' : 'src/game/heroes.js')
  };
}

const FAMILIES = {
  rhythm: {
    label: 'Rythme et coordination', universeTitle: 'Le passage en mesure', cityTitle: 'Répétition des voix',
    originAction: 'Reproduire une courte séquence de signaux visuels et rythmiques de la répétition, puis guider le passage au bon tempo.',
    originObstacle: 'Le décalage des repères brouille la séquence ; une erreur impose de reprendre la phrase, sans dégâts ni punition corporelle.',
    cityAction: 'Régler les balises lumineuses de la place sur une séquence originale ; recueillir séparément chaque contribution avant la restitution collective.',
    cityObstacle: 'Des échos se superposent ; le joueur doit isoler les pistes et demander le départ de chaque participant.',
    mechanics: ['sequence_timing', 'channel_isolation'],
    tools: 'Signaux visuels et sons originaux ; aucune chanson, voix ou interprétation connue supposée disponible.'
  },
  rescue: {
    label: 'Accompagnement et mise à l’abri', universeTitle: 'Un retour accompagné', cityTitle: 'Le chemin des arrivants',
    originAction: 'Repérer un trajet sûr vers le refuge annoncé, ouvrir les accès, puis accompagner les personnes concernées sans les séparer.',
    originObstacle: 'Un passage bloqué force un détour ; il faut vérifier le dernier membre du groupe avant la sortie.',
    cityAction: 'Préparer un itinéraire entre l’accueil et les Archives, placer les repères d’aide puis accompagner un habitant qui peut demander une pause.',
    cityObstacle: 'Un repère de quartier est incomplet ; recouper le témoignage et la carte avant de reprendre le trajet.',
    mechanics: ['route_safety', 'group_checkin'], tools: 'Balisage, dialogue et déplacement ; les personnes secourues ne deviennent pas des cibles.'
  },
  care: {
    label: 'Soutien et diagnostic', universeTitle: 'Avant de repartir', cityTitle: 'Le relais des soins',
    originAction: 'Identifier la demande de soutien, préparer l’outil d’assistance, puis vérifier que le bénéficiaire peut reprendre le trajet.',
    originObstacle: 'Les symptômes et les signaux de la faille se ressemblent ; un contrôle croisé est nécessaire avant l’intervention.',
    cityAction: 'Avec le service de récupération, trier les demandes d’assistance par symptôme observé et tester un protocole de retour sur une balise inerte.',
    cityObstacle: 'Une fiche attribue le même effet à deux causes ; demander une seconde observation avant de conclure.',
    mechanics: ['diagnosis_matching', 'support_verification'], tools: 'Technique de soutien déclarée ; aucune compétence médicale ou résurrection ajoutée par déduction.'
  },
  repair: {
    label: 'Réparation et circuit', universeTitle: 'Le circuit interrompu', cityTitle: 'Les relais qui se répondent',
    originAction: 'Inspecter le dispositif indiqué par le témoin, isoler son composant défaillant puis rétablir un circuit vérifiable dans le bon ordre.',
    originObstacle: 'Une liaison semble active alors qu’elle renvoie son propre signal ; tester l’aller et le retour avant de reconnecter.',
    cityAction: 'Établir une chaîne de diagnostics entre la vitrine, la borne du quartier et les Archives ; conserver le journal avant chaque remise en service.',
    cityObstacle: 'Un relais accuse le suivant ; comparer les deux mesures pour identifier l’origine de la panne sans effacer les traces.',
    mechanics: ['circuit_order', 'bidirectional_probe'], tools: 'Interfaces et appareils documentés ; un rôle hacker générique ne garantit pas une capacité de piratage universelle.'
  },
  investigation: {
    label: 'Enquête et preuve', universeTitle: 'Les traces discordantes', cityTitle: 'La preuve qui manque',
    originAction: 'Observer le lieu indiqué, recueillir deux types d’indices indépendants et reconstruire leur ordre sans attribuer de déclaration à un témoin absent.',
    originObstacle: 'Une copie altérée reproduit une partie du témoignage ; relever le détail matériel qui permet de la distinguer.',
    cityAction: 'Comparer le récit du personnage à une notice de vitrine, marquer les divergences puis déposer un dossier conservant les deux versions.',
    cityObstacle: 'La notice et le témoignage ne couvrent pas la même période ; éviter une fusion forcée des continuités.',
    mechanics: ['evidence_comparison', 'chronology_order'], tools: 'Inspection, photographie ou lecture uniquement si l’outil est documenté ; le dialogue reste disponible.'
  },
  traversal: {
    label: 'Trajet et franchissement', universeTitle: 'La route réversible', cityTitle: 'Le seuil et son retour',
    originAction: 'Lire le parcours, préparer un franchissement avec l’outil prévu puis vérifier qu’une sortie reste accessible après le passage.',
    originObstacle: 'Un raccourci coupe la ligne de retour ; placer un repère de sécurité avant de s’engager.',
    cityAction: 'Tester les deux sens d’un seuil de la Galerie sur un parcours d’exercice, puis publier une carte qui indique aussi le retour.',
    cityObstacle: 'Les sorties ne sont pas symétriques ; une seconde lecture révèle la fausse correspondance.',
    mechanics: ['route_planning', 'return_path_check'], tools: 'Portée, mouvement et outil limités à la source ; aucun portail ni vol supplémentaire inventé.'
  },
  survival: {
    label: 'Observation et survie', universeTitle: 'Lire avant d’avancer', cityTitle: 'L’alerte sans panique',
    originAction: 'Observer les signaux de danger du parcours, repérer les intervalles sûrs et rejoindre la sortie en conservant les éléments demandés.',
    originObstacle: 'Le bruit ou une apparition peut masquer un repère ; s’arrêter à un point sûr pour relire le trajet.',
    cityAction: 'Transformer les observations en balisage lisible dans un exercice inerte de la Cité, puis vérifier qu’un visiteur peut l’utiliser sans consigne cachée.',
    cityObstacle: 'Deux avertissements se contredisent ; retirer le faux signal après comparaison du relevé original.',
    mechanics: ['hazard_observation', 'safe_window_navigation'], tools: 'Menace observée ou évitée ; aucune victoire par dégâts exigée contre une entité de poursuite.'
  },
  command: {
    label: 'Protection et commandement', universeTitle: 'Le corridor tenu', cityTitle: 'Une issue pour chacun',
    originAction: 'Repérer un couvert et un passage de repli, coordonner une progression courte puis confirmer que le groupe a franchi le dernier seuil.',
    originObstacle: 'Deux accès demandent une protection simultanée ; choisir l’ordre de passage et annoncer les changements de couverture.',
    cityAction: 'Organiser un exercice d’évacuation avec barrières inertes, affecter les points de contrôle puis recueillir les retours des participants.',
    cityObstacle: 'Une barrière protège un accès mais coupe une sortie ; modifier la disposition sans déplacer les personnes par téléportation.',
    mechanics: ['cover_route', 'checkpoint_coordination'], tools: 'La défense et l’équipement de commandement restent ceux de la source ; aucun combat dans le quartier sûr.'
  },
  ranged: {
    label: 'Distance et ligne de vue', universeTitle: 'La ligne dégagée', cityTitle: 'Le stand de lecture',
    originAction: 'Reconnaître les lignes de vue, déplacer le groupe de couvert en couvert et réserver l’outil de portée à la cible d’exercice autorisée.',
    originObstacle: 'L’objectif partage l’axe d’un obstacle ; obtenir une ligne dégagée et vérifier la nature de la cible avant l’action.',
    cityAction: 'Dans une annexe d’exercice fermée, lire des cibles inertes et des silhouettes interdites ; expliquer le choix d’une ligne de vue sûre dans le compte rendu.',
    cityObstacle: 'Des marqueurs visuellement proches représentent des catégories différentes ; annuler l’action si l’identification reste ambiguë.',
    mechanics: ['line_of_sight', 'target_identification'], tools: 'Type de tir, munition ou énergie tiré du dossier ; les munitions et les valeurs de dégâts ne sont pas inventées.'
  },
  melee: {
    label: 'Contact et maîtrise du geste', universeTitle: 'Le passage à courte portée', cityTitle: 'Le geste et sa limite',
    originAction: 'Lire une ouverture, rejoindre un obstacle inerte à portée puis démontrer le geste de contact annoncé avant le retrait.',
    originObstacle: 'Le passage n’est sûr que pendant la récupération du mécanisme ; attendre le signal au lieu de forcer le contact.',
    cityAction: 'Préparer une démonstration avec mannequin et périmètre d’exclusion ; décomposer préparation, contact et retour avant d’ouvrir l’observation au public.',
    cityObstacle: 'Un accessoire empiète sur le périmètre ; interrompre et replacer le matériel avant la reprise.',
    mechanics: ['spacing_timing', 'recovery_window'], tools: 'Mannequins et mécanismes inertes ; la technique ne devient ni projectile ni pouvoir propre à une variante cosmétique.'
  },
  resonance: {
    label: 'Énergie et résonance', universeTitle: 'L’accord des résonances', cityTitle: 'Une signature lisible',
    originAction: 'Mesurer un signal local, comparer les réactions à un réglage de l’appareil puis stabiliser le dispositif d’essai en conservant la mesure initiale.',
    originObstacle: 'Un signal imite la signature attendue mais arrive en retard ; comparer la réponse avec la mesure de départ.',
    cityAction: 'Préparer une exposition interactive sur un seul réglage, isoler émission et effet puis remettre les mesures aux Archives.',
    cityObstacle: 'Un effet visuel résiduel est pris pour une action encore active ; attendre sa disparition avant de recommencer.',
    mechanics: ['signal_comparison', 'controlled_demonstration'], tools: 'Le type de capacité est une proposition d’adaptation ; portée, recharge et effet exacts demandent une validation source.'
  },
  research: {
    label: 'Préparation documentaire', universeTitle: 'Le dossier d’origine à compléter', cityTitle: 'Un récit encore incomplet',
    originAction: 'Retrouver le récit d’une activité du personnage, examiner une trace du lieu et une notice d’objet puis poser les questions qui permettent de relier ces indices.',
    originObstacle: 'Une notice décrit tout un groupe et prétend expliquer le parcours d’un seul individu ; séparer ce qui est commun de ce qui lui appartient.',
    cityAction: 'Préparer un entretien d’arrivée, comparer les réponses aux notices du même univers et ranger séparément les informations confirmées et les questions restées ouvertes.',
    cityObstacle: 'Une notice de rôle collectif est attribuée à tort à l’individu ; retirer cette attribution et conserver la question ouverte.',
    mechanics: ['source_crosscheck', 'identity_separation'], tools: 'Dialogue et archives provisoires ; aucun pouvoir personnel supposé, aucune quête déclarée prête à produire.'
  }
};

function selectFamily(character) {
  const objective = `${character.sourceObjective} ${character.finaleObjective}`.toLowerCase();
  const equipment = character.equipment.join(' ').toLowerCase();
  const signature = `${equipment} ${character.rawWeaponType} ${character.actions.map(action => action.name).join(' ')}`.toLowerCase();
  if (/rhythm|rythme|beat|tempo|recital|répétition|concert|set final|music|song|mélodie|dance|danse|guitar|microphone|drums|vocal/.test(`${objective} ${signature}`)) return 'rhythm';
  if (/heal|soin|medic|medicinal|triage|blessé|injured|sut[uü]re/.test(`${objective} ${signature}`) || ['medic', 'support'].includes(character.category)) return 'care';
  if (/repair|répar|generator|circuit|containment locks|diagnos|aseptic|traceability/.test(`${objective} ${equipment}`) || character.category === 'technician') return 'repair';
  if (/escort|rescue|evacuat|shelter|refuge|mise à l.abri/.test(objective)) return 'rescue';
  if (/evidence|enqu[eê]te|indices|trace |clue|reconstruct|photograph|camera|scan/.test(`${objective} ${equipment}`) || character.category === 'investigator') return 'investigation';
  if (/route|maze|parcours|chase|chamber|spirit.walk|jet boost|race|course|portal|grabpack/.test(`${objective} ${equipment}`) || character.category === 'racer') return 'traversal';
  if (character.nonCombat || character.finalePolicy === 'nonCombatFinal') return 'investigation';
  if (character.sourceGaps.includes('individual_narrative_not_documented') && character.sourceGaps.includes('individual_equipment_not_documented') && character.genericActions) return 'research';
  if (character.category === 'horror' || character.category === 'survivor' || /flashlight|lantern/.test(signature)) return 'survival';
  if (/cyberdeck|laptop|terminal|tablet/.test(signature) || character.category === 'hacker') return 'repair';
  if (character.actions.some(action => action.type === 'summon') || ['guardian', 'tactical', 'operator'].includes(character.category)) return 'command';
  if (/fists|melee|sword|katana|blade|axe|hammer|claw|spear|knife|saber|slash|whip|polearm/.test(signature)) return 'melee';
  if (character.actions.some(action => /^(bullet|shotgun|gun|rocket)$/.test(action.type)) || character.category === 'marine') return 'ranged';
  return 'resonance';
}

// Specific proposals use individual source roles. They do not assert that a new incident
// happened in the campaign, and resolving one never rewrites the existing campaign ending.
const NEXUS_PROPOSALS = {
  player_anchor: [
    { related: 'city-anchor-signature-v1', title: 'Une place dans le faisceau',
      premise: 'Prolongement proposé : un nouvel arrivant perd ses repères chaque fois que la balise se cale sur la signature de l’Ancre.', location: 'Nexus — balise de l’Atrium',
      opening: 'Rejoindre le halo qui s’éteint et écouter la personne restée en dehors.',
      action: 'Poser un repère distinct, orienter le faisceau vers le refuge puis parcourir son bord avec l’arrivant volontaire.',
      obstacle: 'Renforcer seulement la signature de l’Ancre rend l’autre présence moins visible.',
      ending: 'Attendre au refuge que l’arrivant retrouve seul son propre repère.',
      consequence: 'Deux lumières distinctes guident le retour ; personne n’a besoin de prendre le nom de l’Ancre.', mechanics: 'Balise orientable, reconnaissance à pied, signatures séparées.' },
    { related: 'city-anchor-trace-return-v1', title: 'Le retour des retardataires',
      premise: 'Prolongement proposé : les lampes du retour s’éteignent avant le dernier groupe de marcheurs.', location: 'Nexus — chemin de retour vers l’Atrium',
      opening: 'Aller à la dernière lampe allumée et demander qui manque encore.',
      action: 'Rallumer les points du retour depuis l’aval, accompagner les retardataires puis reprendre chaque balise derrière eux.',
      obstacle: 'Les échos de la Brèche font clignoter un capteur de présence sans qu’une personne soit passée.',
      ending: 'Rester au dernier embranchement jusqu’au passage réel du groupe.',
      consequence: 'Les marcheurs rejoignent l’Atrium ; le retour reste ouvert tant qu’une personne manque.', mechanics: 'Présence physique, escortes volontaires, fermeture après arrivée.' }
  ],
  arca_mirelle: [
    { related: 'city-mirelle-suture-v1', title: 'L’appel qu’on n’entend plus',
      premise: 'Prolongement proposé : Mirelle entend une personne derrière les parasites, mais le récepteur d’accueil ne produit plus que son propre écho.', location: 'Nexus — relais de suture et accueil',
      opening: 'Écouter le récepteur avec Mirelle et repérer l’appel qui attend une réponse.',
      action: 'Débrancher la boucle de retour, raccorder le canal intact puis porter un récepteur de secours à l’accueil.',
      obstacle: 'Un pontage trop large étouffe la voix faible sous la plus forte.',
      ending: 'Faire répondre l’accueil sur chaque canal, sans changer le nom de l’appelant.',
      consequence: 'L’appel reçoit une réponse distincte ; les deux canaux restent disponibles.', mechanics: 'Écoute directionnelle, câblage séparé, réponse à distance.' },
    { related: 'city-mirelle-relay-followup-v1', title: 'La garde de nuit',
      premise: 'Prolongement proposé : les secousses d’une Trame blessée font sauter l’alimentation du poste où Mirelle tient la veille.', location: 'Nexus — poste de veille et relais',
      opening: 'Apporter une lampe au poste où Mirelle poursuit sa veille dans le noir.',
      action: 'Isoler le raccord qui chauffe, installer l’alimentation de secours puis alterner les appels avec Mirelle.',
      obstacle: 'Réunir toutes les lignes sur le même raccord rétablit la lumière mais menace de couper chaque appel à la prochaine secousse.',
      ending: 'Remettre la lampe de veille en service et laisser un canal de secours accessible.',
      consequence: 'Le poste continue de répondre pendant une nouvelle coupure du circuit principal.', mechanics: 'Réparation locale, circuit de secours, continuité d’écoute.' }
  ],
  arca_bastion: [
    { related: 'city-bastion-tenth-route-v1', title: 'La relève du Rempart',
      premise: 'Prolongement proposé : Bastion retient une grille faussée pendant que le matériel du refuge passe dessous.', location: 'Nexus — grille du Rempart',
      opening: 'Rejoindre Bastion sous la grille et caler le battant avant de lui demander de lâcher.',
      action: 'Installer deux étais, dégager la voie restante puis prendre la relève le temps qu’il sorte.',
      obstacle: 'Le premier étai masque un point de rupture ; Bastion refuse de s’écarter tant que le passage reste douteux.',
      ending: 'Traverser le passage avec Bastion et abaisser la grille seulement une fois le couloir vide.',
      consequence: 'La charge repose sur les étais et Bastion quitte son poste ; la dixième route demeure fermée.', mechanics: 'Étais physiques, relève, passage visible du dernier occupant.' },
    { related: 'city-bastion-tenth-witness-v1', title: 'Le dernier dans le couloir',
      premise: 'Prolongement proposé : une personne blessée se retrouve derrière un chariot renversé ; Bastion entend ses coups.', location: 'Nexus — couloir du Rempart',
      opening: 'Suivre les coups avec Bastion et demander à la personne comment l’aider.',
      action: 'Maintenir le battant ouvert, redresser le chariot puis accompagner la personne par la sortie qu’elle peut atteindre.',
      obstacle: 'Fermer trop tôt le premier battant soulage la pression mais coupe le retour du blessé.',
      ending: 'Attendre son arrivée auprès de Bastion avant de retirer les cales.',
      consequence: 'La personne rejoint le refuge par un passage réellement tenu ouvert.', mechanics: 'Dégagement, escorte consentie, retour du dernier occupant.' }
  ],
  arca_nova: [
    { related: 'city-nova-measured-exit-v1', title: 'La fenêtre entre deux battements',
      premise: 'Prolongement proposé : un raccord du sol devient praticable entre deux pulsations, mais l’intervalle se raccourcit.', location: 'Nexus — raccord près de l’Observatoire',
      opening: 'Rejoindre Nova au bord du raccord et observer deux pulsations sans s’y engager.',
      action: 'Placer les capteurs de part et d’autre, mesurer la fenêtre actuelle puis choisir entre une traversée limitée et le détour.',
      obstacle: 'Le relevé précédent ne décrit plus la pulsation présente.',
      ending: 'Retirer l’autorisation de passage dès que la fenêtre mesurée se referme.',
      consequence: 'Le passage suit une mesure présente ; le détour reste disponible sans promesse sur le prochain battement.', mechanics: 'Mesure causale, fenêtre temporelle, retour possible.' },
    { related: 'city-nova-return-measurement-v1', title: 'Un détour qu’on peut refuser',
      premise: 'Prolongement proposé : le trajet le plus court traverse une zone qui peut se déphaser ; Nova veut laisser le choix aux marcheurs.', location: 'Nexus — embranchement vers l’accueil',
      opening: 'Rejoindre les marcheurs avec Nova et leur montrer les deux départs.',
      action: 'Parcourir le détour, rallumer ses repères puis donner les mesures disponibles avant que chacun choisisse son trajet.',
      obstacle: 'Le gain de temps du passage court cache une incertitude sur le retour.',
      ending: 'Accompagner ceux qui choisissent le détour et maintenir son éclairage jusqu’à leur arrivée.',
      consequence: 'Une route plus lente devient utilisable ; aucune personne n’est engagée sur la seule promesse d’un meilleur futur.', mechanics: 'Reconnaissance, choix informé, escorte par le détour.' }
  ],
  arca_marrow: [
    { related: 'city-marrow-distinct-choices-v1', title: 'La lame sous les scellés',
      premise: 'Prolongement proposé : un lien artificiel fait répondre deux portes en même temps et empêche leurs occupants de sortir séparément.', location: 'Nexus — deux portes près de l’accueil',
      opening: 'Demander à chaque occupant quelle porte il souhaite ouvrir, en présence de Marrow.',
      action: 'Suivre le lien jusqu’au mécanisme commun, l’isoler puis ne couper que sa pièce inerte.',
      obstacle: 'Deux voix semblables ne disent pas quelle porte doit être condamnée.',
      ending: 'Laisser chaque occupant actionner sa propre poignée après la coupure.',
      consequence: 'Les deux portes fonctionnent indépendamment ; aucune conscience n’est traitée comme une pièce à supprimer.', mechanics: 'Recherche de liaison, découplage matériel, décisions indépendantes.' },
    { related: 'city-marrow-independent-answers-v1', title: 'La sortie des deux voisins',
      premise: 'Prolongement proposé : deux voisins qui se ressemblent demandent des sorties différentes pendant une panne de l’accueil.', location: 'Nexus — accueil et deux sorties',
      opening: 'Écouter chaque voisin avec Marrow sans répondre à sa place.',
      action: 'Dégager les deux issues, remettre leurs lampes en service puis accompagner chacun vers la sortie choisie.',
      obstacle: 'Le mécanisme de tri ouvre une seule porte lorsqu’il entend deux fois une voix semblable.',
      ending: 'Désactiver ce tri et attendre les deux passages distincts.',
      consequence: 'Les voisins quittent l’accueil séparément ; leur ressemblance ne conditionne plus leur départ.', mechanics: 'Deux parcours, réparation de portes, choix de personne.' }
  ],
  arca_sable: [
    { related: 'city-sable-signed-map-v1', title: 'Une nuit sans panneaux',
      premise: 'Prolongement proposé : une poussière de Trame recouvre les panneaux du retour et des marcheurs tournent autour du même carrefour.', location: 'Nexus — carrefour et route vers le refuge',
      opening: 'Retrouver Sable au carrefour et suivre les pas qui reviennent sur eux-mêmes.',
      action: 'Dégager les panneaux, marcher jusqu’au refuge puis poser les flèches dans le sens réellement parcouru.',
      obstacle: 'L’ancienne carte dessine encore un passage interrompu par un décalage du sol.',
      ending: 'Reprendre le trajet depuis le carrefour avec les marcheurs.',
      consequence: 'Les flèches conduisent à une porte atteinte à pied, et le tronçon coupé reste barré.', mechanics: 'Orientation, marche de reconnaissance, balisage physique.' },
    { related: 'city-sable-map-detour-v1', title: 'Le chariot trop large',
      premise: 'Prolongement proposé : les vivres passent sur la carte mais leur chariot reste coincé dans le détour de Sable.', location: 'Nexus — passage du détour',
      opening: 'Rejoindre le chariot arrêté et mesurer l’espace avec Sable.',
      action: 'Déplacer une barrière démontable, dégager les roues puis guider le chariot jusqu’au refuge.',
      obstacle: 'Le passage à pied était praticable ; sa largeur ne suffit pas au chargement.',
      ending: 'Replacer la protection après le passage du chariot sans refermer le chemin des marcheurs.',
      consequence: 'Les vivres arrivent par un détour adapté au chargement ; le passage piéton reste ouvert.', mechanics: 'Gabarit réel, obstacle mobile, livraison visible.' }
  ],
  arca_loom: [
    { related: 'city-loom-return-thread-v1', title: 'Le brancard sur le fil',
      premise: 'Prolongement proposé : une personne blessée attend derrière une travée instable ; Loom garde son fil de retour tendu.', location: 'Nexus — travée et poste de soins',
      opening: 'Rejoindre Loom, parler au blessé et préparer un brancard à sa portée.',
      action: 'Fixer les deux points de retour, stabiliser le brancard puis ramener la personne par le trajet qu’elle accepte.',
      obstacle: 'Le premier trajet secoue trop le brancard ; une liaison lumineuse ne suffit pas à le rendre praticable.',
      ending: 'Installer la personne au poste de soins avant de détacher le fil.',
      consequence: 'Le blessé arrive auprès de soignants présents ; les voix gardées dans le drone de Loom n’ont pas été transférées.', mechanics: 'Secours consenti, stabilité du brancard, arrivée physique.' },
    { related: 'city-loom-receiving-end-v1', title: 'Une place avant l’arrivée',
      premise: 'Prolongement proposé : une équipe appelle un refuge dont les lits ont été déplacés après une panne.', location: 'Nexus — accueil du refuge',
      opening: 'Rejoindre Loom à l’accueil et constater les places réellement disponibles.',
      action: 'Dégager un lit, rétablir sa lampe et faire répondre la personne qui prendra la relève avant de guider l’équipe.',
      obstacle: 'L’enseigne « refuge » est allumée mais personne ne répond au poste d’arrivée.',
      ending: 'Attendre l’équipe et son accueil par le soignant présent.',
      consequence: 'Une place et une personne accueillent les arrivants ; le signal lumineux seul ne vaut plus promesse d’abri.', mechanics: 'Préparation de refuge, relais humain, réception du groupe.' }
  ],
  arca_tessera: [
    { related: 'city-tessera-two-accounts-v1', title: 'La fenêtre que j’ai choisie',
      premise: 'Prolongement proposé : deux souvenirs attirent la lumière de la chambre de Tessera dans des directions opposées ; elle veut choisir sa propre fenêtre.', location: 'Nexus — chambre de Tessera',
      opening: 'Rejoindre Tessera dans sa chambre et lui demander où elle veut s’asseoir.',
      action: 'Déplacer le réflecteur, séparer les deux commandes puis régler la lumière depuis la place qu’elle choisit.',
      obstacle: 'Une commande remet automatiquement la pièce dans la disposition d’un souvenir qui n’est pas son choix présent.',
      ending: 'Laisser Tessera actionner elle-même le réglage indépendant.',
      consequence: 'La chambre répond à sa décision présente sans détruire l’un de ses deux souvenirs.', mechanics: 'Aménagement choisi, commandes séparées, mémoire coexistante.' },
    { related: 'city-tessera-caption-review-v1', title: 'Le reflet attend dehors',
      premise: 'Prolongement proposé : la serrure reconnaît un reflet ancien avant Tessera et referme sa porte sur elle.', location: 'Nexus — seuil de la chambre de Tessera',
      opening: 'Retrouver Tessera devant sa porte et attendre qu’elle demande de l’aide.',
      action: 'Éteindre le capteur de reflet, poser une poignée intérieure puis régler la serrure sur son geste présent.',
      obstacle: 'Le reflet ressemble à l’une de ses mémoires sans être la personne qui demande à entrer.',
      ending: 'Se retirer du seuil pendant que Tessera entre et ferme elle-même sa porte.',
      consequence: 'Tessera contrôle sa chambre ; aucun souvenir n’a été élu propriétaire à sa place.', mechanics: 'Serrure locale, présence actuelle, retrait de l’aidant.' }
  ],
  arca_quillon: [
    { related: 'city-quillon-single-receipt-v1', title: 'La caisse des oubliés',
      premise: 'Prolongement proposé : une caisse de couvertures dort à la Galerie tandis que ceux qui l’attendent passent la nuit sans elle.', location: 'Nexus — Galerie et refuge',
      opening: 'Suivre Quillon jusqu’à la caisse et lui montrer le refuge qui attend.',
      action: 'Retrouver la poignée manquante, charger la caisse puis la porter aux personnes présentes.',
      obstacle: 'Deux marques d’acheminement se contredisent ; aucune seconde caisse n’existe pour compenser l’erreur.',
      ending: 'Aider à distribuer les couvertures et signaler à Quillon celles qui manquent encore.',
      consequence: 'La seule caisse disponible arrive au refuge ; les besoins restants demeurent visibles sans dette inventée.', mechanics: 'Objet unique, transport, besoin matériel constaté.' },
    { related: 'city-quillon-delivery-check-v1', title: 'La pompe après la lampe',
      premise: 'Prolongement proposé : la lampe fonctionne, mais la pompe du refuge s’arrête ; Quillon cherche encore qui doit payer la pièce.', location: 'Nexus — pompe du refuge',
      opening: 'Ouvrir le capot avec Quillon et constater que l’eau n’arrive plus.',
      action: 'Couper le courant, réutiliser la seule pièce compatible disponible puis réamorcer la pompe.',
      obstacle: 'La remise en marche consomme une pièce réelle ; la discussion sur son coût ne doit pas laisser le refuge à sec.',
      ending: 'Remplir un récipient au refuge et rendre la pièce retirée à Quillon pour réparation.',
      consequence: 'L’eau revient avant la clôture du compte ; la pièce consommée reste unique et son coût reste explicite.', mechanics: 'Consignation, réparation, débit visible, ressource unique.' }
  ],
  arca_nadir: [
    { related: 'city-nadir-return-probe-v1', title: 'La sonde sous les décombres',
      premise: 'Prolongement proposé : la sonde de Nadir cesse de répondre après une chute de débris près d’un seuil fermé.', location: 'Nexus — seuil et débris de la travée',
      opening: 'Rejoindre Nadir à la limite du seuil et sécuriser le câble tendu.',
      action: 'Dégager le câble, sortir la sonde depuis le côté sûr puis comparer son état au départ.',
      obstacle: 'Un signal de retour persiste dans les parasites alors que la sonde reste physiquement bloquée.',
      ending: 'Ramener la sonde auprès de Nadir et laisser le passage fermé jusqu’à un nouvel essai complet.',
      consequence: 'La sonde est récupérée ; son retour incomplet n’autorise aucune traversée humaine.', mechanics: 'Récupération matérielle, comparaison de sonde, seuil gardé.' },
    { related: 'city-nadir-second-threshold-v1', title: 'Personne derrière moi',
      premise: 'Prolongement proposé : la lumière du retour s’affaiblit pendant qu’un petit groupe regagne la Cité.', location: 'Nexus — retour du second seuil',
      opening: 'Rejoindre Nadir au dernier repère et identifier les personnes encore sur le trajet.',
      action: 'Maintenir le harnais de retour, rallumer les repères depuis l’arrivée puis accompagner le dernier marcheur.',
      obstacle: 'Le signal de l’ancienne porte ne prouve rien sur ce second seuil.',
      ending: 'Revenir avec Nadir en dernier et ne retirer le harnais qu’une fois le groupe présent.',
      consequence: 'Tous les marcheurs réellement partis reviennent ; aucun succès antérieur ne remplace leur arrivée.', mechanics: 'Retour de groupe, seuil distinct, fermeture après présence.' }
  ],
  arca_elyra: [
    { related: 'city-elyra-consented-door-v1', title: 'Le levier à portée de main',
      premise: 'Prolongement proposé : une personne accepte d’approcher la porte, mais ne peut pas atteindre son levier d’arrêt.', location: 'Nexus — porte du passage accompagné',
      opening: 'Écouter la personne avec Elyra et lui faire montrer le levier inaccessible.',
      action: 'Abaisser le levier, relier l’arrêt au mécanisme puis laisser la personne essayer sans déclencher de traversée.',
      obstacle: 'Un arrêt indiqué sur le panneau reste inutile s’il ne peut pas être actionné.',
      ending: 'Rester en retrait pendant qu’elle choisit de poursuivre ou de quitter le seuil.',
      consequence: 'L’arrêt devient accessible et coupe réellement le passage ; le refus reste une issue complète.', mechanics: 'Accessibilité, essai d’arrêt, décision renouvelable.' },
    { related: 'city-elyra-renewed-passage-v1', title: 'Le départ différé',
      premise: 'Prolongement proposé : une voyageuse venue partir veut attendre ; la porte reprend pourtant son ancienne séquence.', location: 'Nexus — attente près du seuil',
      opening: 'Rejoindre Elyra et la voyageuse, puis arrêter la séquence en cours.',
      action: 'Décharger la commande mémorisée, préparer une place d’attente puis rendre le déclenchement manuel.',
      obstacle: 'L’accord précédent portait sur un départ qui n’a plus lieu maintenant.',
      ending: 'Laisser la voyageuse relancer le passage si elle le demande, ou partir du seuil sans être suivie.',
      consequence: 'La porte ne redémarre plus sur un ancien accord ; attendre et renoncer n’enlèvent aucun droit au retour.', mechanics: 'Arrêt persistant, attente, nouvel accord explicite.' }
  ],
  arca_oryn: [
    { related: 'city-oryn-separate-voices-v1', title: 'La garde sans signature',
      premise: 'Prolongement proposé : une garde d’outil venue d’un atelier de Route X perd ses dernières gravures ; Oryn refuse d’y mettre son nom à la place.', location: 'Nexus — établi de la Galerie',
      opening: 'Retrouver Oryn à l’établi et regarder les marques encore visibles.',
      action: 'Stabiliser la garde, poser un support qui laisse ses marques accessibles puis demander aux artisans présents ce qu’ils reconnaissent.',
      obstacle: 'Une marque incomplète peut appartenir à plusieurs mains ; la ressemblance ne permet pas de la réattribuer.',
      ending: 'Remonter le support avec les espaces inconnus visibles, sans les combler.',
      consequence: 'L’outil cesse de se dégrader ; les noms retrouvés restent distincts et les absences restent reconnues.', mechanics: 'Restauration matérielle, témoignages volontaires, marques conservées.' },
    { related: 'city-oryn-manifest-delivery-v1', title: 'Des voix autour de l’établi',
      premise: 'Prolongement proposé : le haut-parleur de l’atelier répète la voix d’Oryn par-dessus celles des artisans venus travailler.', location: 'Nexus — établi et haut-parleur de la Galerie',
      opening: 'Rejoindre Oryn à l’établi et écouter les artisans qui souhaitent parler.',
      action: 'Couper la boucle d’écho, rendre chaque interrupteur accessible puis laisser chacun choisir de parler ou de travailler en silence.',
      obstacle: 'Un canal collectif utilise le nom d’Oryn pour toutes les voix et relance les paroles retirées.',
      ending: 'Essayer chaque arrêt avec son propriétaire et ranger les outils avec les artisans présents.',
      consequence: 'Les voix restent attribuées à ceux qui les donnent ; le silence n’interrompt pas l’accès à l’atelier.', mechanics: 'Découplage audio, retrait effectif, atelier partagé.' }
  ]
};

// The selected action references deliberately exclude unrelated legacy abilities.
// Locations use the individual incarnation where the generic universe stage conflicts.
const INDIVIDUAL_PROPOSALS = {
  masterchief: {
    location: 'Installation 04 — itinéraire UNSC à repérer',
    sourceFields: ['DLC/Halo/data/characterPlaques.js:dossier/doctrine', 'HEROES_DB[masterchief].simple'],
    note: 'Le dossier relie Installation 04 et doctrine MJOLNIR. Le Bubble Shield et le Spartan Laser du kit multivers ne sont pas imposés à cette continuité ; vérifier leurs périodes avant une autre mission.',
    plans: [
      ['La ligne UNSC perdue', 'Un relevé de route UNSC a disparu entre deux couverts de l’Installation 04. Le Chief veut récupérer la trace sans exposer le groupe.',
        'Reconnaître les couverts, vérifier une ligne libre avec le fusil d’assaut puis avancer jusqu’au relevé. Après une alerte, attendre à couvert le retour du bouclier MJOLNIR avant la dernière traversée.',
        'Le chemin direct croise la ligne d’une patrouille ; un couvert intermédiaire permet de changer l’angle sans promettre l’invulnérabilité.',
        'Ligne de vue du fusil d’assaut, récupération du bouclier à couvert, extraction du relevé.'],
      ['Le couloir de retour', 'Une équipe de la Cité confond la protection MJOLNIR avec une permission d’avancer sans couvert. Le Chief prépare un exercice de retour lisible.',
        'Dans une annexe d’exercice, placer deux couverts, reconnaître une ligne interdite et ramener une balise d’essai. Expliquer au dernier point pourquoi le bouclier ne remplace pas le trajet de repli.',
        'Le stand affiche un bouclier plein au départ mais coupe un accès au retour ; le joueur doit conserver une seconde route.',
        'Parcours sans cible vivante, lecture des couverts, validation du retour.']
    ]
  },
  chell: {
    location: 'Chambre de test Aperture — parcours de cube',
    sourceFields: ['DLC/Portal/data/loreDescriptions.js:createCoreUniverseSignatures', 'HEROES_DB[chell].weaponType', 'HEROES_DB[chell].defense'],
    note: 'Le plan utilise géométrie, cube et portails. Les entrées historiques Turret Summon et Neurotoxin Vent ne sont pas prises comme pouvoirs personnels confirmés.',
    plans: [
      ['Le cube de l’autre côté', 'Un cube est visible depuis le départ, mais le couloir de retour est fermé. Chell doit rendre le trajet réversible.',
        'Observer les surfaces admissibles, relier les deux côtés par les portails, déplacer le cube puis reprendre le passage avec lui avant de valider la sortie.',
        'Le premier couple de portails permet d’atteindre le cube mais empêche de le ramener ; il faut garder une surface utile pour le retour.',
        'Placement de deux portails, transport d’un cube, résolution géométrique.'],
      ['Le colis sans raccourci perdu', 'Les Archives demandent le passage d’un colis d’exercice à travers une annexe fermée. Chell montre comment garder une issue après le transfert.',
        'Tester le trajet avec un cube inerte, réorienter le portail de sortie puis ramener le cube au comptoir de départ avant d’autoriser le colis.',
        'Une sortie surélevée donne l’impression de gagner du temps mais bloque la récupération ; vérifier l’accès depuis le sol.',
        'Test réversible, objet inerte, contrôle d’accès au retour.']
    ]
  },
  miku: {
    location: 'Scène holographique — répétition d’un set original',
    sourceFields: ['DLC/Vocaloid/data/loreDescriptions.js:createCoreUniverseSignatures', 'ENEMIES_DB[Vocaloid].finalePolicy'],
    note: 'La politique nonCombatFinal prime sur le kit de combat historique. Composition et voix originales à produire ; aucune chanson existante ni pouvoir de blessure déduit des noms du kit.',
    plans: [
      ['Le rappel des lumières', 'La scène holographique perd un repère de tempo avant le rappel. Miku attend que les musiciens et le public retrouvent le même départ.',
        'Recaler une courte suite lumineuse, vérifier l’accès de scène et lancer le rappel seulement quand les signaux du public et des musiciens concordent.',
        'Un retour visuel arrive en retard : suivre son image au lieu du repère sonore décale toute la séquence.',
        'Synchronisation visuelle/sonore, sécurité de scène, finale collective pacifique.'],
      ['Le chœur des quartiers', 'Plusieurs quartiers proposent leurs signaux d’accueil à la Cité. Miku prépare une répétition où chacun garde sa voix.',
        'Enregistrer des motifs originaux très courts, régler leur ordre d’entrée puis laisser chaque groupe confirmer sa participation avant la restitution.',
        'Une piste trop forte masque une contribution ; isoler les canaux et corriger le niveau sans supprimer de participant.',
        'Mixage de canaux, entrées rythmiques, consentement collectif.']
    ]
  },
  harry: {
    location: 'Entraînement de l’Armée de Dumbledore — cinquième année',
    sourceFields: ['HEROES_DB[harry].incarnation', 'HEROES_DB[harry].loreLocalized', 'HEROES_DB[harry].simple', 'HEROES_DB[harry].defense'],
    note: 'Le stage générique Astronomy Tower appartient à un autre contexte que la cinquième année retenue. Le plan reste dans un exercice de défense, sans reprendre cette bataille ni convertir le Patronus en explosion.',
    plans: [
      ['La baguette rendue', 'Un exercice de l’Armée de Dumbledore se termine sans que les partenaires sachent qui doit rendre la baguette désarmée. Harry reprend le protocole.',
        'Annoncer le départ, démontrer Expelliarmus avec un partenaire volontaire, récupérer la baguette puis la lui rendre avant d’inverser les rôles.',
        'Un signal de départ arrive pendant la restitution ; l’exercice reste suspendu tant que la baguette n’a pas été rendue.',
        'Désarmement contrôlé, consentement, restitution de l’objet.'],
      ['Un abri pour le message', 'Une annexe de la Cité simule un message à protéger pendant une alerte. Harry veut que l’exercice distingue protection et attaque.',
        'Lire l’alerte, préparer Protego à la position indiquée puis porter le message derrière le couvert pendant la fenêtre sûre.',
        'Le message est accessible avant le signal mais le trajet ne l’est pas ; attendre l’ouverture sans lancer un sort offensif.',
        'Protection, lecture d’alerte, déplacement d’un objet inerte.']
    ]
  },
  unreal_1998_gina: {
    location: 'Vortex Rikers — sortie du pont-prison',
    sourceFields: ['HEROES_DB[unreal_1998_gina].narrativeRole', 'HEROES_DB[unreal_1998_gina].sameProtagonistAs', 'HEROES_DB[unreal_1998_gina].uniqueAbility', 'HEROES_DB[unreal_1998_gina].simple'],
    note: 'Gina est une apparence de Prisoner 849, pas une compagne de Dante/Kurgan. Cette proposition peut devenir une quête commune aux apparences ; aucune aptitude propre à Gina n’est créée.',
    plans: [
      ['La sortie du prisonnier', 'Une route du pont-prison du Vortex Rikers n’indique plus si le dernier accès reste praticable. Prisoner 849 doit en retrouver la sortie.',
        'Explorer le pont, relever un point de repli puis vérifier le fonctionnement du Dispersion Pistol sur un dispositif d’exercice avant le dernier passage.',
        'Un objet récupéré change l’arsenal mais ne répare pas le passage ; séparer la collecte d’arme de la lecture de la route.',
        'Exploration, arme commune de Prisoner 849, sortie vérifiée.'],
      ['Un dossier, plusieurs apparences', 'Une notice des Archives a créé trois prisonniers à partir de trois portraits. Gina demande que l’erreur soit corrigée.',
        'Comparer les notices Gina, Dante et Kurgan, conserver chaque portrait puis relier les trois apparences au même rôle de Prisoner 849.',
        'La fiche attribue une compétence exclusive à chaque apparence ; retirer ces différences sans supprimer les entrées du catalogue.',
        'Rapprochement d’identité, conservation des variantes, arsenal commun.']
    ]
  },
  arthur_kaamelott: {
    location: 'Kaamelott — Table Ronde',
    sourceFields: ['DLC/Kaamelott/data/characterPlaques.js:dossier/doctrine', 'HEROES_DB[arthur_kaamelott].secondary'],
    note: 'Le champ équipement générique gun contredit le dossier Excalibur/commandement ; il reste signalé comme lacune et n’est pas utilisé dans ces missions.',
    plans: [
      ['Une réunion qui aboutit', 'Deux rapports de quête arrivent à la Table Ronde avec le même itinéraire et des objectifs différents. Arthur veut enfin un ordre exécutable.',
        'Faire reformuler les rapports, distinguer ce qui est observé de ce qui est supposé puis rédiger un ordre de départ avec lieu de retour et personne responsable.',
        'Chaque interlocuteur croit que l’autre doit apporter la preuve ; désigner explicitement qui revient avec quoi.',
        'Dialogue de clarification, attribution des tâches, rapport de quête.'],
      ['La Table des services', 'Une demande circule entre Forge, Archives et accueil sans trouver de responsable. Arthur réunit les services avant que la tâche ne reparte pour un tour.',
        'Collecter les trois réponses, supprimer les renvois circulaires et remettre un ordre simple à un service qui accepte de l’exécuter.',
        'Deux services promettent la même action sous des noms différents ; choisir une responsabilité unique sans effacer les contributions.',
        'Comparaison de réponses, coordination de services, reçu unique.']
    ]
  },
  bioshock_rapture_tenenbaum: {
    location: 'Rapture — accès au conduit protégé',
    sourceFields: ['HEROES_DB[bioshock_rapture_tenenbaum].objective', 'HEROES_DB[bioshock_rapture_tenenbaum].nonCombat'],
    note: 'Le gun et les techniques génériques hérités du catalogue ne servent pas au plan. Les Little Sisters secourues ne sont ni des ennemies ni des objets de récompense.',
    plans: [
      ['Le conduit sûr', 'Les Little Sisters secourues attendent un passage vers un conduit protégé. Tenenbaum a besoin d’un trajet praticable pour tout le groupe.',
        'Inspecter l’entrée du conduit, libérer le chemin par interaction puis accompagner les Little Sisters secourues jusqu’au refuge ; compter les arrivées avant de refermer.',
        'Une porte se referme entre deux passages ; rouvrir l’accès et regrouper les personnes avant de poursuivre.',
        'Escorte pacifique, ouverture de porte, vérification du groupe.'],
      ['Le refuge indiqué', 'Un nouvel arrivant se perd entre l’accueil et la zone de repos. Tenenbaum veut vérifier le chemin du point de vue de celui qui cherche refuge.',
        'Suivre les panneaux avec l’arrivant, corriger un embranchement ambigu et lui laisser choisir une pause avant l’arrivée.',
        'Le trajet le plus court comporte une porte lourde inutilisable sans aide ; conserver une seconde route accessible.',
        'Accompagnement, accessibilité du trajet, confirmation d’arrivée.']
    ]
  },
  ripley: {
    location: 'Nostromo — chemin vers le Narcissus',
    sourceFields: ['HEROES_DB[ripley].incarnation', 'HEROES_DB[ripley].loreLocalized', 'HEROES_DB[ripley].simple', 'HEROES_DB[ripley].defense'],
    note: 'Incarnation Alien (1979). Le stage générique Derelict Hive n’est pas utilisé ; ni M41A ni power loader ni Newt ne sont introduits dans ce plan.',
    plans: [
      ['Le chemin du Narcissus', 'Une alerte condamne un couloir du Nostromo alors que Ripley prépare la fuite vers le Narcissus. Il faut vérifier un détour avant de s’engager.',
        'Observer les portes et les signaux, tester le détour puis réserver le lance-flammes improvisé à une fenêtre de recul permettant de rejoindre la navette.',
        'Le couloir est libre à l’aller mais la fermeture d’une porte change le retour ; garder une route lisible au lieu de poursuivre la menace.',
        'Observation, dissuasion temporaire, fuite vers le point sûr.'],
      ['L’alarme et la sortie', 'La Cité teste une alarme qui annonce le danger sans indiquer la sortie. Ripley propose de vérifier le trajet avant de toucher au volume.',
        'Déclencher un exercice sans menace vivante, parcourir le couloir puis corriger les panneaux qui empêchent de trouver l’issue.',
        'Une lumière d’alerte masque la signalétique du retour ; déplacer le signal sans cacher le danger.',
        'Exercice d’évacuation, lisibilité des signaux, vérification physique.']
    ]
  },
  ripley_aliens: {
    location: 'Hadley’s Hope — itinéraire de secours',
    sourceFields: ['HEROES_DB[ripley_aliens].incarnation', 'HEROES_DB[ripley_aliens].loreLocalized', 'HEROES_DB[ripley_aliens].simple', 'HEROES_DB[ripley_aliens].secondary'],
    note: 'Incarnation Aliens (1986), distincte de ripley/Alien (1979). Le power loader du Sulaco n’est pas déplacé arbitrairement dans les couloirs de Hadley’s Hope.',
    plans: [
      ['Le retour du secours', 'Le relevé d’un trajet de secours à Hadley’s Hope s’interrompt avant la zone d’extraction. Ripley doit vérifier le retour avant l’entrée du groupe.',
        'Repérer deux couverts, reconnaître une ligne sûre avec le M41A puis réserver le M240 à l’obstacle de sortie ; rapporter le relevé avant d’engager l’escorte.',
        'Le couloir de sortie partage l’axe du groupe secouru ; changer d’angle avant toute démonstration d’arme.',
        'Reconnaissance, séparation des outils, priorité au retour du groupe.'],
      ['Les deux Ripley', 'Une vitrine présente le M41A à côté d’un dossier du Nostromo. Ripley demande de séparer les deux parcours sans effacer leurs liens.',
        'Comparer les dates et les équipements des deux dossiers, déplacer la notice M41A vers le dossier Aliens puis conserver une passerelle clairement étiquetée.',
        'Le même nom et le même visage poussent l’archive à fusionner les expériences ; garder les identités de catalogue distinctes.',
        'Attribution d’équipement, séparation des continuités, provenance.']
    ]
  },
  serj_tankian: {
    location: 'Scène de concert — répétition originale',
    sourceFields: ['DLC/SystemOfADown/data/loreDescriptions.js:createCoreUniverseSignatures', 'ENEMIES_DB[System of a Down].finalePolicy'],
    note: 'Le thème collectif sert uniquement à préparer une performance originale pacifique. Les capacités individuelles restent en recherche ; aucune déclaration, chanson, voix ou arme laser réelle n’est attribuée à l’artiste.',
    plans: [
      ['La reprise après la rupture', 'Une répétition originale perd son départ collectif après un changement de tempo. Le personnage de scène attend un repère que tout le groupe peut suivre.',
        'Marquer la rupture de tempo avec un signal visuel, répéter la reprise puis vérifier le passage de scène avant de lancer la séquence complète.',
        'Le signal est visible des musiciens mais pas de la régie ; ajouter un retour lisible sans imposer une imitation de voix.',
        'Rupture et reprise rythmiques, coordination de régie, sécurité.'],
      ['Les voix de la place', 'Les habitants préparent une scène d’expression avec des messages originaux. La régie veut que les voix restent distinctes et volontaires.',
        'Recueillir les contributions autorisées, régler leurs entrées et laisser chaque personne approuver la restitution finale.',
        'Un collage change le sens de deux messages ; rétablir les séquences originales avant leur diffusion dans l’exercice.',
        'Montage transparent, consentement, expression collective pacifique.']
    ]
  }
};

function objective(id, action, obstacle, success, sourceFields) {
  return { id, action, obstacle, success, sourceFields };
}

function mission(character, strand) {
  const city = strand === 'multiverse';
  const familyId = selectFamily(character);
  const family = FAMILIES[familyId];
  const special = NEXUS_PROPOSALS[character.id]?.[city ? 1 : 0];
  const relatedRuntime = special ? MOSAIC_CHARACTER_MISSIONS.find(item => item.id === special.related) : null;
  if (special && !relatedRuntime) throw new Error(`Missing related Nexus story: ${special.related}`);
  const individual = INDIVIDUAL_PROPOSALS[character.id];
  const individualPlan = individual?.plans[city ? 1 : 0];
  const peaceful = character.nonCombat || character.finalePolicy === 'nonCombatFinal';
  const sourceGoal = character.sourceObjective || (peaceful ? character.finaleObjective : '');
  const namedActions = character.actions.filter(action => !action.generic);
  const selectedActions = peaceful ? [] : [namedActions.find(action => action.slot === 'simple'), namedActions.find(action => action.slot === 'defense')].filter(Boolean);
  const fields = individual?.sourceFields || (special ? unique([...character.sourceRefs, ...(relatedRuntime.sourceRefs || []),
    `${relatedRuntime.contentFile || 'src/game/mosaicCharacterStories.js'}#${relatedRuntime.id}`]) : [`HEROES_DB[${character.id}].category`, `LORE_DB[${character.universe}]`,
    ...(sourceGoal ? [character.sourceObjective ? `HEROES_DB[${character.id}].objective` : `ENEMIES_DB[${character.universe}].finalePolicy.objective`] : []),
    ...selectedActions.map(action => action.sourceField),
    ...(character.equipment.length && !peaceful ? [`HEROES_DB[${character.id}].equipment/weapon`] : [])]);
  const coreAction = individualPlan?.[2] || special?.action || (city ? family.cityAction : family.originAction);
  const obstacle = individualPlan?.[3] || special?.obstacle || (city ? family.cityObstacle : family.originObstacle);
  const title = individualPlan?.[0] || special?.title || `${city ? family.cityTitle : family.universeTitle} — ${character.name}`;
  const originLocation = individual?.location || character.sourceStage;
  const premise = individualPlan?.[1] || special?.premise || `${obstacle} ${character.isPlayer ? 'A.R.C.A. confie le relevé à l’Ancre.' : `${character.name} demande un relevé avant de poursuivre.`}`;
  const sourceCheck = character.sourceGaps.length ? 'Vérifier les lacunes signalées avant écriture définitive.' : 'Relire la continuité et les sources avant écriture définitive.';
  const objectives = special ? [
    objective('briefing', special.opening, special.obstacle, 'La demande est entendue auprès de la personne concernée et le problème est constaté sur place.', fields),
    objective('activity', special.action, special.obstacle, special.consequence, fields),
    objective('return', special.ending, 'Le résultat doit être constaté après le geste et auprès de son destinataire.', special.consequence, fields)
  ] : [
    objective('briefing', character.isPlayer
      ? 'Prendre le mandat A.R.C.A. aux Archives, consulter les observations et choisir le point de départ du relevé.'
      : city
        ? `Rencontrer ${character.name} dans le quartier ${character.cityDistrict}, recueillir son accord et consulter la notice reliée à sa demande.`
        : `Consulter le relevé de ${originLocation} depuis la Cité, préparer le trajet avec ${character.name} puis rejoindre le départ de l’exercice.`,
    character.sameProtagonistAs ? 'Plusieurs portraits renvoient au même parcours ; une image différente ne suffit pas à distinguer les personnes.' : 'Le premier relevé est incomplet ; vérifier ce qui manque avant le départ.',
    'La demande, le départ et le résultat attendu figurent dans le journal.', []),
    objective('activity', `${coreAction}${!city && sourceGoal && !individualPlan && !special ? ` Résultat attendu : « ${sourceGoal} ».` : ''}`,
      obstacle, city ? 'Le résultat de l’interaction peut être constaté sur place et relié au témoignage initial.'
        : sourceGoal ? `Le résultat est vérifiable : ${sourceGoal}` : 'Le trajet ou la démonstration est terminé et ses observations sont enregistrées.', []),
    objective('return', city
      ? character.isPlayer ? 'Revenir aux Archives A.R.C.A., joindre le relevé au mandat et conserver les contributions séparées avant clôture.'
        : 'Revenir aux Archives A.R.C.A., présenter la preuve et laisser le personnage confirmer ou corriger sa contribution avant clôture.'
      : 'Revenir au quartier de départ dans la Cité, comparer le relevé à la demande et signaler les contradictions sans effacer les premières observations.',
    'Un relevé incomplet ne peut pas être validé par un simple clic à distance.',
    'Un seul reçu de mission est archivé ; annulation et reprise conservent la progression sans double attribution.',
    [])
  ];
  return {
    id: `city-plan-v1::${character.id}::${strand}`, characterId: character.id, characterName: character.name,
    universe: character.universe, strand, title,
    premise,
    location: special?.location || (city ? `${character.cityDistrict} → Archives A.R.C.A.` : `${originLocation} → ${character.cityDistrict}`),
    family: familyId, familyLabel: family.label, objectives,
    mechanics: individualPlan || special ? [{ id: `source_role_${character.id}`, description: individualPlan?.[4] || special.mechanics }]
      : family.mechanics.map(id => ({ id, description: family.tools })),
    designKind: individualPlan || special ? 'individual_proposal' : familyId === 'research' ? 'research_scaffold' : sourceGoal ? 'source_objective_adaptation' : 'source_family_adaptation',
    diegeticReviewStatus: individualPlan || special ? 'individual_story_review_required' : 'diegetic_rewrite_required',
    relatedRuntimeMissionId: special?.related || null,
    sourceCharacterId: character.id, sourceBindings: fields,
    nonCombat: character.nonCombat, combatPolicy: peaceful ? 'peaceful_objectives_only' : special ? 'safe_city_nonhostile_interventions' : city ? 'safe_city_inert_exercise_only' : 'source_review_before_optional_encounter',
    killRequired: false, hostileResidentAllowed: false, finalePolicy: character.finalePolicy,
    identityConstraints: character.identityConstraints,
    prerequisites: { installedUniverse: character.universe, characterOwnedOrAuthorizedResident: !character.isPlayer, requiredRuntimeQuest: null, requiresCanonReview: true },
    commonPolicyId: 'city-planning-v1',
    canonStatus: character.canonStatus,
    implementationStatus: 'planned', runtimeMissionId: null,
    readiness: familyId === 'research' || character.sourceGaps.includes('generic_ability_names') ? 'source_research_required' : 'design_review_required',
    priority: character.isPlayer || character.universe === 'Nexus de Convergence' ? 'P1' : 'P2',
    planningStatus: 'to_design', owner: '', targetMilestone: '', reviewNotes: '',
    nextAction: `${!individualPlan && !special ? 'Réécriture diégétique requise : remplacer le canevas par une situation personnelle et ses effets joués. ' : ''}${sourceCheck} Écrire le dialogue, la géométrie et les critères propres à cette proposition ; raccorder ensuite les états de quête.`,
    acceptanceCriteria: [peaceful ? 'Aucun tir, arme ajoutée, barre de vie ou élimination ; la résolution conserve l’objectif pacifique.' : special ? 'Aucun habitant hostile dans la Cité ; l’intervention modifie un objet ou un trajet, sans remplacer une personne.' : 'Aucun habitant hostile dans la Cité ; les démonstrations utilisent des objets inertes.',
      ...(character.sameProtagonistAs || character.uniqueAbility === false ? ['La variante ne devient ni une seconde personne ni une capacité exclusive.'] : [])]
  };
}

function encounterRecords(universes, revision) {
  const entries = [];
  const append = (actor, universe, kind, index, fixedKey) => {
    const key = fixedKey || `${kind}::${universe}::${actor.id || actor.name}::${index}`;
    const policy = ENEMIES_DB[universe]?.finalePolicy;
    const objectiveSource = sourceObjective(actor);
    const peaceful = nonCombat(actor) || policy?.policy === 'nonCombatFinal';
    entries.push({
      id: key, sourceActorId: actor.id || null, name: actor.name, universe, kind, occurrenceIndex: index,
      possessable: false, nonCombat: nonCombat(actor), sourceObjective: objectiveSource.text,
      sourceObjectiveLanguage: objectiveSource.language, sourceWeapon: text(actor.weapon) || actor.weaponType || '',
      sourceSpecial: text(actor.special?.name || actor.special),
      sourceLore: text(actor.loreLocalized || actor.lore),
      finalePolicy: policy?.policy || null, sourceFinaleObjective: text(policy?.objective),
      proposedCityUse: peaceful ? 'Épreuve/notice pacifique dans une sortie guidée ou une reconstitution ; aucun habitant transformé en adversaire.'
        : 'Notice de menace et rencontre extérieure à concevoir après revue de l’incarnation ; aucune apparition hostile dans le quartier sûr.',
      encounterPlan: peaceful
        ? `Préparer les interactions de « ${objectiveSource.text || text(policy?.objective) || actor.name} » ; une réussite dépend d’un objectif, jamais de PV retirés.`
        : `Documenter l’annonce de « ${text(actor.special?.name || actor.special) || text(actor.weapon) || 'attaque non renseignée'} », son évitement et une condition de sortie ; aucune phase ni anatomie nouvelle n’est déduite du statut ${kind}.`,
      combatPolicy: peaceful ? 'peaceful_objectives_only' : 'external_encounter_requires_source_review',
      killRequired: false, implementationStatus: 'planned', canonStatus: 'source_review_required',
      planningStatus: 'to_design', owner: '', reviewNotes: '',
      sourceRefs: [kind === 'Boss final' ? 'FINAL_GAME_BOSS' : `ENEMIES_DB[${universe}]`],
      sourceFiles: unique(['src/game/enemies.js', ...referenceFiles(universe).filter(file => /enemies|lore|canon/i.test(file))]),
      sourceUrl: sourceUrl(revision, 'src/game/enemies.js'),
      externalReferences: unique([actor.referenceUrl, ...texts(actor.referenceUrls), packs.get(universe)?.referenceUrl, ...texts(policy?.referenceUrls)]).filter(value => /^https?:\/\//.test(value)),
      externalReferencesChecked: false
    });
  };
  for (const universe of universes) {
    const group = ENEMIES_DB[universe] || {};
    for (const [kind, actors] of [['Ennemi', group.monsters || []], ['Boss', group.bosses || []], ['Boss mondial', group.worldBoss ? [group.worldBoss] : []]]) {
      actors.forEach((actor, index) => append(actor, universe, kind, index));
    }
  }
  append(FINAL_GAME_BOSS, 'Nexus de Convergence', 'Boss final', 0, 'Boss final::Nexus::FINAL_GAME_BOSS');
  return entries;
}

function runtimeOperation(operation) {
  return operation ? { kind: operation.kind, label: text(operation.label), propName: text(operation.propName), completedText: text(operation.completedText) } : undefined;
}

function runtimeStep(step) {
  return {
    ...(step.id ? { id: step.id } : {}), ...(step.type ? { type: step.type } : {}), text: text(step.text),
    ...(step.targetId ? { targetId: step.targetId } : {}),
    ...(step.finding ? { finding: text(step.finding) } : {}),
    ...(step.dialogue ? { dialogue: text(step.dialogue) } : {}),
    ...(step.operation ? { operation: runtimeOperation(step.operation) } : {}),
    ...(Number.isFinite(step.x) && Number.isFinite(step.y) ? { x: step.x, y: step.y } : {}),
    ...Object.fromEntries(['byOriginChoice', 'byChoice'].filter(field => step[field]).map(field => [field,
      Object.fromEntries(Object.entries(step[field]).map(([key, branch]) => [key, runtimeStep(branch)]))])),
    ...(step.choices ? { choices: step.choices.map(choice => ({ id: choice.id, label: text(choice.label), result: text(choice.result), valid: choice.valid })) } : {})
  };
}

export function buildMissionPlanning(sourceRevision, { includeSourceHashes = true } = {}) {
  if (!/^[a-f0-9]{40}$/.test(sourceRevision || '')) throw new Error('Full immutable source revision required');
  const heroes = [createPlayerHero(), ...HEROES_DB];
  const universes = [...new Set([...Object.keys(LORE_DB), ...Object.keys(ENEMIES_DB), ...heroes.map(hero => hero.universe)])].sort();
  const characters = heroes.map(hero => characterRecord(hero, sourceRevision));
  const missions = characters.flatMap(character => ['universe', 'multiverse'].map(strand => mission(character, strand)));
  const encounters = encounterRecords(universes, sourceRevision);
  const finalePolicies = universes.filter(universe => ENEMIES_DB[universe]?.finalePolicy).map(universe => {
    const policy = ENEMIES_DB[universe].finalePolicy;
    return { universe, policy: policy.policy, continuity: text(policy.continuity),
      objective: text(policy.objective), finale: text(policy.finale), reason: text(policy.reason),
      externalReferences: texts(policy.referenceUrls), externalReferencesChecked: false,
      sourceFile: 'src/game/enemies.js', sourceRef: `ENEMIES_DB[${universe}].finalePolicy` };
  });
  const runtimeReferenceFiles = MOSAIC_CHARACTER_MISSIONS.flatMap(mission => [
    mission.contentFile, ...(mission.sourceRefs || []), ...String(mission.source || '').split(';').map(ref => ref.trim())
  ]).filter(ref => typeof ref === 'string' && /^(?:src|DLC)\/.*\.js(?:#|$)/.test(ref)).map(ref => ref.split('#')[0]);
  const allFiles = sourceClosure(unique([...SOURCE_FILES, ...runtimeReferenceFiles, ...characters.flatMap(character => character.sourceFiles),
    ...encounters.flatMap(encounter => encounter.sourceFiles), 'package.json', 'package-lock.json']));
  const sourceManifest = allFiles.map(file => ({ file, exists: existsSync(path.join(ROOT, file)),
    sha256: includeSourceHashes && existsSync(path.join(ROOT, file)) ? sha256(readFileSync(path.join(ROOT, file))) : null }));
  const reviewQueue = characters.filter(character => character.sourceGaps.length).map(character => ({
    characterId: character.id, characterName: character.name, universe: character.universe,
    missing: character.sourceGaps, nextAction: 'Vérifier une source individuelle, l’incarnation et l’activité avant d’approuver la scène.',
    owner: '', status: 'open', sourceFiles: character.sourceFiles
  }));
  const counts = {
    universes: universes.length, characters: characters.length, nonCombatCharacters: characters.filter(character => character.nonCombat).length,
    combatEligibleCharacters: characters.filter(character => !character.nonCombat).length,
    missions: missions.length, universeMissions: missions.filter(row => row.strand === 'universe').length,
    multiverseMissions: missions.filter(row => row.strand === 'multiverse').length,
    implementedMissions: missions.filter(row => row.implementationStatus !== 'planned').length,
    separatelyImplementedCityMissions: MOSAIC_CHARACTER_MISSIONS.length,
    individuallyDesignedCharacters: characters.filter(character => NEXUS_PROPOSALS[character.id] || INDIVIDUAL_PROPOSALS[character.id]).length,
    individuallyDesignedMissions: missions.filter(row => row.designKind === 'individual_proposal').length,
    sourceResearchMissions: missions.filter(row => row.readiness === 'source_research_required').length,
    charactersWithSourceGaps: reviewQueue.length,
    charactersWithGenericAbilities: characters.filter(character => character.genericActions).length,
    enemyOccurrences: encounters.filter(row => row.kind === 'Ennemi').length,
    bossOccurrences: encounters.filter(row => row.kind !== 'Ennemi').length,
    nonCombatEncounterOccurrences: encounters.filter(row => row.nonCombat).length,
    finalePolicies: finalePolicies.length, nonCombatFinalePolicies: finalePolicies.filter(row => row.policy === 'nonCombatFinal').length,
    missionFamilies: Object.fromEntries(Object.keys(FAMILIES).map(id => [id, missions.filter(row => row.family === id).length]))
  };
  const catalog = {
    schema: 1, date: DATE, sourceRevision,
    sourceRevisionMeaning: 'Révision de départ des catalogues ; les empreintes ci-dessous décrivent les fichiers effectivement lus. Les propositions et ce générateur sont ajoutés après cette révision.',
    scope: 'Deux propositions de missions Cité par identité du roster résolu, Ancre incluse ; occurrences ennemies/boss séparées et non possédables.',
    status: 'planning_only', counts,
    editorialPolicy: [
      'Les missions sont des propositions de design, pas des épisodes officiels ni des missions déjà implémentées.',
      'Les références externes sont reprises du dépôt sans nouvelle consultation ; leur présence ne valide ni la source, ni la fidélité, ni la continuité.',
      'Les données génériques sont conservées comme lacunes : aucun pouvoir individuel ou équipement ne devient canon par génération.',
      'Les variantes du même protagoniste gardent des IDs distincts, sans inventer une nouvelle personne ni une capacité exclusive.',
      'Les univers et les PNJ pacifiques restent sans objectif d’élimination ; les habitants ne deviennent pas hostiles.',
      'Les seuils, obstacles et dialogues proposés relèvent du design Multiverse et devront être écrits puis testés.',
      'Les contrats jouables ajoutés séparément à la Cité ne sont pas automatiquement les 3 824 lignes de ce catalogue.'
    ],
    editableTrackingFields: ['priority', 'planningStatus', 'owner', 'targetMilestone', 'reviewNotes'],
    commonPolicies: [{ id: 'city-planning-v1',
      rewardPolicy: 'Conséquence narrative et matérielle à concevoir pour chaque proposition. Aucune monnaie, propriété, dépense ou récompense de combat ajoutée par ce catalogue ; économie à décider avant implémentation.',
      missingDlcBehavior: 'Suspendre la disponibilité en conservant les identifiants et la progression ; aucun achat ni téléchargement déclenché.',
      acceptanceCriteria: ['Les IDs, univers, variantes et sauvegardes restent intacts.',
        'Le journal distingue préparation, activité, retour et clôture ; un menu ou une pause ne fait pas progresser l’objectif.',
        'Le résultat dépend d’actions observables ; un retour à distance, un abandon ou une répétition n’attribue rien.',
        'Les pouvoirs, équipements et liens narratifs non documentés restent bloqués pour revue.'],
      requiredWork: ['Validation source/continuité', 'Dialogue et embranchements', 'Géométrie/objets de mission', 'États/annulation/reprise/sauvegarde', 'Recette clavier/tactile/manette et localisation']
    }],
    generationPolicy: 'Modifier les propositions/source/générateur pour régénérer. Pour un suivi durable, réimporter explicitement les colonnes éditables du classeur par ID ; aucune synchronisation bidirectionnelle implicite.',
    sourceManifest, characters, missions, encounters, finalePolicies, reviewQueue,
    runtimeMissions: MOSAIC_CHARACTER_MISSIONS.map(item => ({
      id: item.id, characterId: item.heroId, universe: item.universe, title: text(item.title),
      premise: text(item.premise), request: text(item.request), location: text(item.location), source: item.source,
      sourceFile: item.contentFile || 'src/game/mosaicCharacterMissions.js', contentFile: item.contentFile || 'src/game/mosaicCharacterMissions.js',
      sourceRefs: item.sourceRefs || [],
      systemSourceFiles: ['src/game/mosaicCharacterMissions.js', 'src/game/mosaicMissionOperations.js',
        ...(item.requiresMissionId ? ['src/game/mosaicCharacterFollowups.js'] : [])],
      chapter: item.chapter || 1, requiresMissionId: item.requiresMissionId || null,
      continuity: text(item.continuity), referenceUrls: item.references || [],
      implementationStatus: 'runtime_contract', browserValidation: 'not_certified_by_catalog',
      steps: item.steps.map(runtimeStep)
    }))
  };
  catalog.dataSha256 = sha256(JSON.stringify(catalog));
  return catalog;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [sourceRevision, output, receiptOutput] = process.argv.slice(2);
  const catalog = buildMissionPlanning(sourceRevision);
  if (output) {
    mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
    const serialized = `${JSON.stringify(catalog)}\n`;
    writeFileSync(output, serialized);
    if (receiptOutput) {
      const receipt = { schema: 1, date: DATE, sourceRevision, counts: catalog.counts,
        dataSha256: catalog.dataSha256, outputBytes: Buffer.byteLength(serialized),
        sourceFileCount: catalog.sourceManifest.length,
        sourceManifestSha256: sha256(JSON.stringify(catalog.sourceManifest)),
        planningContentSha256: sha256(JSON.stringify({ characters: catalog.characters, missions: catalog.missions, encounters: catalog.encounters, finalePolicies: catalog.finalePolicies })),
        generator: 'scripts/extinction-city/missionPlanning.mjs', outputPolicy: 'Full JSON generated for workbook; compact receipt versioned. No mission completion or external canon approval inferred.',
        constraints: { allRosterIdentitiesCovered: true, proposalsPerCharacter: 2, allProposalStatus: 'planned', encounterPossession: false, externalReferencesChecked: false } };
      mkdirSync(path.dirname(path.resolve(receiptOutput)), { recursive: true });
      writeFileSync(receiptOutput, `${JSON.stringify(receipt, null, 2)}\n`);
    }
    console.log(JSON.stringify({ counts: catalog.counts, dataSha256: catalog.dataSha256, output }));
  } else process.stdout.write(`${JSON.stringify(catalog)}\n`);
}
