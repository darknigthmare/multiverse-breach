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
    ['La trace qui tient', 'Examiner deux souvenirs incompatibles de l’Atrium puis choisir une formulation qui conserve leurs auteurs.', 'Un écho réclame de remplacer le souvenir minoritaire pour simplifier l’archive.', 'Comparaison de preuves, attribution des témoins, dépôt volontaire.'],
    ['Les cellules reliées', 'Relier les demandes d’un habitant, d’une vitrine et d’un service sans fusionner leurs identités ; faire confirmer le dossier par chaque partie.', 'Une liaison est valide dans un seul sens ; vérifier le retour avant de fermer le dossier.', 'Consentement, trajet entre services, preuve d’ancrage.']
  ],
  arca_mirelle: [
    ['La couture visible', 'Comparer les deux bords d’une déchirure d’archive, repérer la ligne manquante puis préparer un Patch de Trame qui conserve la cicatrice.', 'Un raccord paraît parfait mais efface la provenance de la version initiale.', 'Lecture de Trame, comparaison de versions, contrôle du patch.'],
    ['Le registre réparé', 'Recueillir deux témoignages contradictoires et leur relier des notices distinctes ; Mirelle vérifie que le raccord reste réversible.', 'La sauvegarde proposée remplace les deux récits par un récit unique.', 'Dossier à deux voix, sauvegarde de l’état initial, validation du retour.']
  ],
  arca_bastion: [
    ['Le passage compté', 'Reconstituer sur une table d’exercice l’ordre d’évacuation du Rempart Est et noter les routes fermées sans effacer les absents.', 'Le plan optimisé masque le coût du dernier choix de fermeture.', 'Table tactique, comptage des passages, trace des choix.'],
    ['Une barrière, deux issues', 'Placer les barrières inertes d’un exercice d’Atrium puis vérifier à pied deux sorties accessibles avant d’accepter le plan.', 'Un rempart qui protège l’entrée condamne la sortie du dernier groupe.', 'Géométrie de protection, vérification piétonne, clôture responsable.']
  ],
  arca_nova: [
    ['Les possibles mesurés', 'Lire trois traces de l’Observatoire, comparer leur cause et présenter les options à l’Ancre sans choisir pour elle.', 'La prédiction la plus favorable omet une conséquence non mesurée.', 'Relevés causaux, incertitude visible, choix de l’Ancre.'],
    ['Le signal de retour', 'Comparer les lectures d’une borne et de son retour, isoler le signal retardé puis demander une nouvelle mesure avant la remise en service.', 'Un résultat statistiquement plausible est présenté comme une certitude.', 'Mesure bidirectionnelle, journal des incertitudes, contrôle humain.']
  ],
  arca_marrow: [
    ['Le sceau et le double', 'Comparer les gravures d’un sceau et de sa copie dans une reconstitution ; ne rompre que le lien artificiel identifié.', 'Le double possède un détail valide qui empêche de le rejeter sur sa seule apparence.', 'Lecture de sceau, identification conditionnelle, démontage inerte.'],
    ['La preuve avant la lame', 'Préparer un exercice de reconnaissance de doublons : relever les différences, demander un témoignage puis annoter la décision.', 'Un automate propose une suppression avant la fin de l’enquête.', 'Priorité à la preuve, décision réversible, aucune cible habitante.']
  ],
  arca_sable: [
    ['La carte corrigée', 'Suivre une portion sûre d’un ancien relevé des Cartographes, placer des repères puis comparer la route réellement parcourue à la carte.', 'Une ligne élégante traverse une zone qui ne possède aucun passage.', 'Reconnaissance, relevé de terrain, correction sourcée.'],
    ['Les balises se contredisent', 'Comparer les directions de trois panneaux de quartier, parcourir les deux trajets proposés puis corriger seulement le panneau réfuté.', 'La distance annoncée est plus courte que le chemin praticable.', 'Navigation, preuve de déplacement, restitution aux Archives.']
  ],
  arca_loom: [
    ['Le dernier fil', 'Dans un exercice des services de récupération, vérifier chaque point de retour avant d’amener le dernier témoin vers la sortie.', 'Le témoin accepte l’aide mais refuse le premier itinéraire ; rechercher une autre issue.', 'Consentement, suivi du groupe, vérification d’issue.'],
    ['Le relais de récupération', 'Rapprocher une demande d’assistance, une fiche de balise et un relevé de trajet ; demander au bénéficiaire de confirmer la transmission.', 'Une fiche marque le retour comme acquis avant l’arrivée effective.', 'Preuve d’arrivée, soutien non létal, transmission unique.']
  ],
  arca_tessera: [
    ['Deux mémoires debout', 'Présenter séparément deux souvenirs de la Forge et montrer leur contradiction sans déclarer l’un remplaçable.', 'Le classement ne prévoit qu’une seule version par personne.', 'Classement parallèle, témoignage, refus de remplacement.'],
    ['La vitrine à deux récits', 'Installer deux notices incompatibles dans la même exposition avec leurs provenances et demander à chacun comment il souhaite être présenté.', 'Une légende automatique confond des identités distinctes.', 'Consentement de présentation, provenance visible, coexistence.']
  ],
  arca_quillon: [
    ['La ligne manquante', 'Comparer une demande de restitution au contre-registre et rendre visible le coût oublié sans attribuer une dette à une personne absente.', 'Le total est juste mais un nom manque dans la ventilation.', 'Rapprochement de registres, coût visible, attribution vérifiable.'],
    ['Le reçu et le témoin', 'Suivre le trajet d’une pièce d’archive de l’accueil à sa vitrine puis faire signer chaque remise par le témoin présent.', 'Une copie du reçu propose de comptabiliser deux restitutions.', 'Chaîne de remise, détection de doublon, clôture unique.']
  ],
  arca_nadir: [
    ['L’autre côté du seuil', 'Tester un seuil d’exercice dans les deux sens et conserver la sonde de retour tant que le dernier agent n’a pas rejoint le départ.', 'La première traversée réussit mais la liaison inverse reste muette.', 'Sonde bidirectionnelle, garde du retour, extraction vérifiée.'],
    ['Le dernier visiteur', 'Parcourir le trajet Galerie–Archives avec un groupe volontaire et vérifier le dernier point de passage avant de refermer le service.', 'Un compteur de départ et un compteur d’arrivée ne concordent pas.', 'Comptage de présence, réouverture, retour effectif.']
  ],
  arca_elyra: [
    ['La possibilité de refuser', 'Lire une demande de passage du Seuil blanc et conserver explicitement l’option de refus dans la procédure.', 'Un formulaire assimile le silence à une acceptation.', 'Choix explicite, mémorisation de l’intention, retrait possible.'],
    ['La porte consentie', 'Faire tester une borne de la Cité par deux volontaires, vérifier acceptation et refus puis restituer chaque décision sans la corriger.', 'La borne présente le refus comme un échec à contourner.', 'Branches de dialogue, validation des deux issues, aucune récompense conditionnée au consentement.']
  ],
  arca_oryn: [
    ['Les noms du seuil', 'Comparer les gravures des ateliers de Route X aux témoignages, puis restaurer une attribution lisible sans inventer les noms effacés.', 'Une gravure partielle ressemble à deux personnes différentes.', 'Comparaison nominative, question ouverte, protection des témoins.'],
    ['Le manifeste des voix', 'Recueillir des contributions volontaires, conserver leurs signatures séparées puis laisser chaque témoin retirer sa contribution avant dépôt.', 'Un éditeur fusionne les voix en une déclaration que personne n’a choisie.', 'Attribution, consentement, archive polyphonique.']
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
  const individual = INDIVIDUAL_PROPOSALS[character.id];
  const individualPlan = individual?.plans[city ? 1 : 0];
  const peaceful = character.nonCombat || character.finalePolicy === 'nonCombatFinal';
  const sourceGoal = character.sourceObjective || (peaceful ? character.finaleObjective : '');
  const namedActions = character.actions.filter(action => !action.generic);
  const selectedActions = peaceful ? [] : [namedActions.find(action => action.slot === 'simple'), namedActions.find(action => action.slot === 'defense')].filter(Boolean);
  const fields = individual?.sourceFields || (special ? character.sourceRefs : [`HEROES_DB[${character.id}].category`, `LORE_DB[${character.universe}]`,
    ...(sourceGoal ? [character.sourceObjective ? `HEROES_DB[${character.id}].objective` : `ENEMIES_DB[${character.universe}].finalePolicy.objective`] : []),
    ...selectedActions.map(action => action.sourceField),
    ...(character.equipment.length && !peaceful ? [`HEROES_DB[${character.id}].equipment/weapon`] : [])]);
  const coreAction = individualPlan?.[2] || special?.[1] || (city ? family.cityAction : family.originAction);
  const obstacle = individualPlan?.[3] || special?.[2] || (city ? family.cityObstacle : family.originObstacle);
  const title = individualPlan?.[0] || special?.[0] || `${city ? family.cityTitle : family.universeTitle} — ${character.name}`;
  const originLocation = individual?.location || character.sourceStage;
  const premise = individualPlan?.[1] || `${obstacle} ${character.isPlayer ? 'A.R.C.A. confie le relevé à l’Ancre.' : `${character.name} demande un relevé avant de poursuivre.`}`;
  const sourceCheck = character.sourceGaps.length ? 'Vérifier les lacunes signalées avant écriture définitive.' : 'Relire la continuité et les sources avant écriture définitive.';
  const objectives = [
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
    location: city ? `${character.cityDistrict} → Archives A.R.C.A.` : `${originLocation} → ${character.cityDistrict}`,
    family: familyId, familyLabel: family.label, objectives,
    mechanics: individualPlan || special ? [{ id: `source_role_${character.id}`, description: individualPlan?.[4] || special[3] }]
      : family.mechanics.map(id => ({ id, description: family.tools })),
    designKind: individualPlan || special ? 'individual_proposal' : familyId === 'research' ? 'research_scaffold' : sourceGoal ? 'source_objective_adaptation' : 'source_family_adaptation',
    sourceCharacterId: character.id, sourceBindings: fields,
    nonCombat: character.nonCombat, combatPolicy: peaceful ? 'peaceful_objectives_only' : city ? 'safe_city_inert_exercise_only' : 'source_review_before_optional_encounter',
    killRequired: false, hostileResidentAllowed: false, finalePolicy: character.finalePolicy,
    identityConstraints: character.identityConstraints,
    prerequisites: { installedUniverse: character.universe, characterOwnedOrAuthorizedResident: !character.isPlayer, requiredRuntimeQuest: null, requiresCanonReview: true },
    commonPolicyId: 'city-planning-v1',
    canonStatus: character.canonStatus,
    implementationStatus: 'planned', runtimeMissionId: null,
    readiness: familyId === 'research' || character.sourceGaps.includes('generic_ability_names') ? 'source_research_required' : 'design_review_required',
    priority: character.isPlayer || character.universe === 'Nexus de Convergence' ? 'P1' : 'P2',
    planningStatus: 'to_design', owner: '', targetMilestone: '', reviewNotes: '',
    nextAction: `${sourceCheck} Écrire le dialogue, la géométrie et les critères propres à cette proposition ; raccorder ensuite les états de quête.`,
    acceptanceCriteria: [peaceful ? 'Aucun tir, arme ajoutée, barre de vie ou élimination ; la résolution conserve l’objectif pacifique.' : 'Aucun habitant hostile dans la Cité ; les démonstrations utilisent des objets inertes.',
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
  const allFiles = sourceClosure(unique([...SOURCE_FILES, ...characters.flatMap(character => character.sourceFiles),
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
      rewardPolicy: 'Récompense narrative proposée : dossier/notice. Aucune monnaie, propriété, dépense ou récompense de combat ajoutée par ce catalogue ; économie à décider avant implémentation.',
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
      premise: text(item.premise), source: item.source, sourceFile: item.contentFile || 'src/game/mosaicCharacterMissions.js',
      chapter: item.chapter || 1, requiresMissionId: item.requiresMissionId || null,
      continuity: text(item.continuity), referenceUrls: item.references || [],
      implementationStatus: 'runtime_contract', browserValidation: 'not_certified_by_catalog',
      steps: item.steps.map(step => ({ id: step.id, type: step.type, text: text(step.text),
        ...(step.finding ? { finding: text(step.finding) } : {}),
        ...(step.type === 'marker' ? { x: step.x, y: step.y } : {}),
        ...Object.fromEntries(['byOriginChoice', 'byChoice'].filter(field => step[field]).map(field => [field,
          Object.fromEntries(Object.entries(step[field]).map(([key, branch]) => [key,
            { x: branch.x, y: branch.y, text: text(branch.text), finding: text(branch.finding) }]))])),
        ...(step.choices ? { choices: step.choices.map(choice => ({ id: choice.id, label: text(choice.label), result: text(choice.result), valid: choice.valid })) } : {}) }))
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
