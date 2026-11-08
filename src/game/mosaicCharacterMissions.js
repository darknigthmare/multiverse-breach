import { MOSAIC_INTERACTION_RANGE } from './mosaicCityRuntime.js';

const text = (fr, en) => ({ fr, en });
export const localizeCityMission = (value, lang = 'fr') => value?.[lang === 'fr' ? 'fr' : 'en'] || '';
const person = (id, fr, en) => ({ id: `meet-${id}`, type: 'npc', targetId: id, text: text(fr, en) });
const exhibit = (id, fr, en) => ({ id: `inspect-${id}`, type: 'exhibit', targetId: id, text: text(fr, en) });
const marker = (id, x, y, fr, en, findingFr, findingEn) => ({ id, type: 'marker', x, y,
  text: text(fr, en), finding: text(findingFr, findingEn) });
const decision = (fr, en, choices) => ({ id: 'resolution', type: 'decision', text: text(fr, en), choices });
const choice = (id, fr, en, resultFr, resultEn, valid = true) => ({ id, label: text(fr, en), result: text(resultFr, resultEn), valid });
const report = { id: 'report', type: 'anchor', text: text('Transmettre le dossier à l’ancre locale.', 'Submit the case at the local anchor.') };

/** New, original City stories grounded in the existing Nexus dossiers. These
 * contracts do not retroactively complete campaign acts or award inventory. */
export const MOSAIC_CHARACTER_MISSIONS = Object.freeze([
  {
    id: 'city-anchor-signature-v1', heroId: 'player_anchor',
    title: text('Une signature qui reste', 'A signature that remains'),
    premise: text('Une balise confond deux traces de l’Ancre. Compare les outils d’A.R.C.A. avant de lui confier une identité.', 'A beacon confuses two Anchor traces. Compare A.R.C.A.’s tools before entrusting an identity to it.'),
    source: 'src/game/characterPlaques.js#player_anchor; src/game/heroes.js#nexus_anchor_coil',
    steps: [exhibit('nexus_anchor_coil', 'Lire la fonction de la Bobine d’Ancre dans sa vitrine.', 'Read the Anchor Coil’s purpose at its display.'),
      exhibit('arca_signal_lens', 'Examiner la Lentille de Signal : cibler une trace ne prouve pas son identité.', 'Inspect the Signal Lens: targeting a trace does not prove its identity.'),
      decision('Que faut-il conserver dans le registre ?', 'What should the ledger preserve?', [
        choice('retain-origin', 'Conserver l’origine et les deux observations.', 'Keep the origin and both observations.', 'L’Ancre garde son origine. Les deux outils sont décrits avec leurs limites.', 'The Anchor retains its origin. Both tools are recorded with their limits.'),
        choice('ask-review', 'Suspendre la fusion et demander une relecture.', 'Suspend the merge and request a review.', 'Les traces restent séparées jusqu’à une relecture par A.R.C.A.', 'The traces stay separate pending an A.R.C.A. review.'),
        choice('replace-origin', 'Remplacer l’origine par le signal le plus fort.', 'Replace the origin with the strongest signal.', 'Un signal plus fort ne donne pas le droit de réécrire une origine.', 'A stronger signal does not grant permission to rewrite an origin.', false)
      ]), report]
  },
  {
    id: 'city-mirelle-suture-v1', heroId: 'arca_mirelle',
    title: text('Une suture sans effacement', 'A suture without erasure'),
    premise: text('Un relais répète la même voix sous deux noms. Mirelle demande une réparation qui garde les traces distinctes.', 'A relay repeats the same voice under two names. Mirelle asks for a repair that keeps the traces distinct.'),
    source: 'src/game/heroes.js#arca_mirelle; src/game/mosaicCityRuntime.js#MOSAIC_WELCOME',
    steps: [person('arca_mirelle', 'Écouter Mirelle dans le quartier Nexus.', 'Listen to Mirelle in the Nexus district.'),
      exhibit('nexus_anchor_coil', 'Vérifier le stabilisateur dans la vitrine.', 'Check the stabilizer at the display.'),
      marker('suture-relay', 1210, 680, 'Diagnostiquer le relais de suture.', 'Diagnose the suture relay.', 'La boucle de sauvegarde conserve deux identifiants. Le relais a seulement dupliqué leur message.', 'The backup loop retains two identifiers. The relay has only duplicated their message.'),
      decision('Comment réparer la répétition ?', 'How should the repetition be repaired?', [
        choice('separate-traces', 'Rétablir deux canaux avec leurs identifiants.', 'Restore two channels with their identifiers.', 'Deux canaux rendent les voix lisibles sans supprimer leurs différences.', 'Two channels make the voices readable without erasing their differences.'),
        choice('isolate-relay', 'Isoler le relais et conserver la sauvegarde.', 'Isolate the relay and retain the backup.', 'Le relais reste isolé ; les traces sont préservées pour la réparation.', 'The relay remains isolated; the traces are preserved for repair.'),
        choice('erase-copy', 'Effacer la voix répétée et son identifiant.', 'Erase the repeated voice and its identifier.', 'Une répétition technique ne prouve pas qu’une identité est fausse.', 'A technical repetition does not prove that an identity is false.', false)
      ]), report]
  },
  {
    id: 'city-bastion-tenth-route-v1', heroId: 'arca_bastion',
    title: text('Les noms de la dixième route', 'The names of the tenth route'),
    premise: text('Un registre du Rempart omet encore une voie condamnée. Bastion veut une décision dont le coût reste visible.', 'A Bulwark record still omits a condemned route. Bastion wants a decision whose cost remains visible.'),
    source: 'src/game/characterPlaques.js#arca_bastion',
    steps: [person('arca_bastion', 'Recueillir le témoignage de Bastion.', 'Collect Bastion’s testimony.'),
      marker('east-record', 1340, 580, 'Lire la plaque du Rempart Est.', 'Read the East Bulwark plaque.', 'La plaque compte neuf cellules évacuées et laisse une ligne sans noms.', 'The plaque records nine evacuated cells and leaves one line without names.'),
      marker('route-register', 540, 770, 'Comparer le registre de fermeture.', 'Compare the closure record.', 'La dixième route a bien été condamnée. Une ligne vide ne signifie pas qu’elle n’a jamais existé.', 'The tenth route was condemned. A blank line does not mean it never existed.'),
      decision('Comment publier cette fermeture ?', 'How should the closure be published?', [
        choice('name-debt', 'Publier la dette et ouvrir la collecte des noms.', 'Publish the debt and open a collection of names.', 'Le registre reconnaît la dixième route et laisse une place à chaque témoin.', 'The ledger acknowledges the tenth route and leaves room for every witness.'),
        choice('attach-unknowns', 'Conserver les inconnus avec la preuve de fermeture.', 'Retain the unknowns alongside the closure evidence.', 'Les noms manquants restent signalés ; aucun nom inventé ne remplace les absents.', 'Missing names remain marked; no invented name replaces the absent.'),
        choice('perfect-report', 'Retirer la ligne pour ne garder que les évacués.', 'Remove the line and keep only those evacuated.', 'Bastion refuse un rapport parfait qui efface le prix de sa décision.', 'Bastion rejects a perfect report that erases the cost of his decision.', false)
      ]), report]
  },
  {
    id: 'city-nova-measured-exit-v1', heroId: 'arca_nova',
    title: text('Deux relevés, aucune prophétie', 'Two readings, no prophecy'),
    premise: text('Deux sondes annoncent une issue parfaite. Nova demande des mesures comparables, pas une promesse sur l’avenir.', 'Two probes announce a perfect exit. Nova asks for comparable measurements, not a promise about the future.'),
    source: 'src/game/characterPlaques.js#arca_nova',
    steps: [person('arca_nova', 'Demander à Nova ce que son monocle mesure.', 'Ask Nova what her monocle measures.'),
      exhibit('arca_signal_lens', 'Examiner la Lentille de Signal.', 'Inspect the Signal Lens.'),
      marker('near-reading', 620, 570, 'Relever la sonde de départ.', 'Read the departure probe.', 'La sonde donne une cause mesurable et une heure de départ.', 'The probe reports a measurable cause and a departure time.'),
      marker('far-reading', 1280, 780, 'Comparer la sonde distante.', 'Compare the distant probe.', 'La sonde distante donne une arrivée, mais aucun retour mesuré.', 'The distant probe reports an arrival, but no measured return.'),
      decision('Quelle option transmettre à l’Ancre ?', 'Which option should be sent to the Anchor?', [
        choice('mark-uncertainty', 'Décrire l’issue et son retour encore inconnu.', 'Describe the exit and its still unknown return.', 'Nova transmet une possibilité avec sa limite, sans choisir à la place de l’Ancre.', 'Nova transmits a possibility with its limit, without deciding for the Anchor.'),
        choice('require-return', 'Demander un relevé de retour avant tout départ.', 'Request a return reading before departure.', 'La route reste en observation jusqu’à un relevé bidirectionnel.', 'The route remains under observation pending a two-way reading.'),
        choice('guarantee-future', 'Garantir que personne ne sera perdu.', 'Guarantee that no one will be lost.', 'Le monocle compare des causes ; il ne garantit ni l’avenir ni la justice.', 'The monocle compares causes; it guarantees neither the future nor justice.', false)
      ]), report]
  },
  {
    id: 'city-sable-signed-map-v1', heroId: 'arca_sable',
    title: text('La carte porte ses témoins', 'The map names its witnesses'),
    premise: text('Une carte sans signature circule dans le Nexus. Sable te confie trois relevés de terrain à attribuer.', 'An unsigned map is circulating through the Nexus. Sable entrusts you with three field readings that need attribution.'),
    source: 'src/game/characterPlaques.js#arca_sable',
    steps: [person('arca_sable', 'Recueillir la méthode de Sable.', 'Learn Sable’s method.'),
      marker('map-west', 490, 580, 'Mesurer le repère ouest.', 'Measure the western marker.', 'Premier repère : bord du passage mesuré sur place, relevé de l’Ancre.', 'First marker: passage edge measured in person, Anchor’s reading.'),
      marker('map-east', 1380, 660, 'Mesurer le repère est.', 'Measure the eastern marker.', 'Deuxième repère : la largeur réelle diffère de la carte anonyme.', 'Second marker: the actual width differs from the anonymous map.'),
      marker('map-return', 700, 790, 'Vérifier le repère de retour.', 'Check the return marker.', 'Troisième repère : retour observé ; la carte peut citer ses mesures et leur auteur.', 'Third marker: return observed; the map can name its measurements and their author.'),
      decision('Quelle carte archiver ?', 'Which map should be archived?', [
        choice('signed-correction', 'Signer les trois mesures et la correction.', 'Sign the three readings and the correction.', 'La carte indique les écarts, les lieux et la personne qui les a mesurés.', 'The map records the differences, places, and person who measured them.'),
        choice('annotated-original', 'Garder l’original avec les relevés signés.', 'Keep the original with the signed readings.', 'Les deux versions restent comparables ; l’original ne devient pas une preuve de terrain.', 'The two versions remain comparable; the original does not become field evidence.'),
        choice('anonymous-perfect', 'Publier une carte parfaite sans témoins.', 'Publish a perfect map without witnesses.', 'Sable exige que quelqu’un puisse répondre des mesures et de leurs limites.', 'Sable requires someone to answer for the measurements and their limits.', false)
      ]), report]
  },
  {
    id: 'city-loom-return-thread-v1', heroId: 'arca_loom',
    title: text('Ce qui revient avec le fil', 'What returns along the thread'),
    premise: text('Un relais promet un refuge intact. Loom veut vérifier le fil dans les deux sens avant de lui confier une voix.', 'A relay promises an intact refuge. Loom wants the thread checked both ways before entrusting a voice to it.'),
    source: 'src/game/characterPlaques.js#arca_loom',
    steps: [person('arca_loom', 'Écouter les consignes de Loom.', 'Listen to Loom’s instructions.'),
      marker('thread-departure', 520, 760, 'Poser la référence du fil de retour.', 'Set the return-thread reference.', 'Référence posée : les voix restent dans le drone, sans copie transférée.', 'Reference set: the voices stay in the drone, with no copy transferred.'),
      marker('thread-distance', 1370, 580, 'Vérifier la tension du fil au relais distant.', 'Check thread tension at the distant relay.', 'La tension reste mesurable. Il faut encore revenir à la référence.', 'Tension remains measurable. You still need to return to the reference.'),
      marker('thread-home', 520, 760, 'Revenir physiquement au point de référence.', 'Physically return to the reference point.', 'Le retour est observé : la signature et la tension ont été conservées.', 'Return observed: the signature and tension were retained.'),
      decision('Que certifier dans le dossier ?', 'What should the case certify?', [
        choice('verify-thread', 'Certifier ce fil, sans promettre un monde restauré.', 'Certify this thread without promising a restored world.', 'Loom conserve les voix et inscrit un trajet de retour vérifié.', 'Loom retains the voices and records a verified return route.'),
        choice('retain-local', 'Garder les voix ici et transmettre seulement le relevé.', 'Keep the voices here and send only the reading.', 'Les voix restent protégées ; seule la mesure du trajet est transmise.', 'The voices remain protected; only the route measurement is transmitted.'),
        choice('send-unverified', 'Envoyer toutes les voix vers le refuge annoncé.', 'Send all voices to the announced refuge.', 'Vérifier un fil ne prouve pas que le refuge peut accueillir les témoins.', 'Verifying a thread does not prove that the refuge can receive the witnesses.', false)
      ]), report]
  },
  {
    id: 'city-marrow-distinct-choices-v1', heroId: 'arca_marrow',
    title: text('Une ressemblance ne prouve rien', 'Resemblance proves nothing'),
    premise: text('Deux empreintes portent le même visage. Marrow refuse de les condamner sur cette seule ressemblance.', 'Two imprints bear the same face. Marrow refuses to condemn them on resemblance alone.'),
    source: 'src/game/characterPlaques.js#arca_marrow',
    steps: [person('arca_marrow', 'Écouter la réserve de Marrow.', 'Listen to Marrow’s reservation.'),
      marker('first-imprint', 560, 580, 'Lire la première empreinte.', 'Read the first imprint.', 'La première empreinte veut conserver son nom et sa mémoire.', 'The first imprint wants to retain its name and memory.'),
      marker('second-imprint', 1320, 710, 'Lire la seconde empreinte.', 'Read the second imprint.', 'La seconde reconnaît une mémoire partagée, mais ne revendique aucune place à prendre.', 'The second acknowledges shared memory, but claims no place to usurp.'),
      decision('Comment distinguer ces continuations ?', 'How should these continuations be distinguished?', [
        choice('separate-testimony', 'Conserver deux témoignages distincts.', 'Keep two distinct testimonies.', 'Chaque continuation peut témoigner sans être réduite à son visage.', 'Each continuation may testify without being reduced to its face.'),
        choice('request-dialogue', 'Demander un dialogue sans jugement d’identité.', 'Request a dialogue without an identity judgment.', 'Le dossier demande un échange et suspend toute accusation de remplacement.', 'The case requests a dialogue and suspends any accusation of replacement.'),
        choice('erase-double', 'Supprimer la seconde empreinte parce qu’elle ressemble.', 'Delete the second imprint because it resembles the first.', 'Marrow refuse une exécution fondée sur une ressemblance.', 'Marrow refuses an execution based on resemblance.', false)
      ]), { ...person('arca_marrow', 'Rapporter les deux témoignages à Marrow.', 'Bring both testimonies back to Marrow.'), id: 'return-marrow' }, report]
  }
].map(mission => Object.freeze({ ...mission, universe: 'Nexus de Convergence', version: 1,
  steps: Object.freeze(mission.steps.map(step => Object.freeze(step))) })));

const record = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const identifier = value => typeof value === 'string' && value.trim() && value.length < 180 ? value : null;
const own = (value, id) => Object.hasOwn(record(value), id) ? value[id] : undefined;

/** Preserve absent DLC records and their unknown fields; availability is a view. */
export function normalizeMosaicCharacterMissions(saved) {
  const source = record(saved);
  const records = Object.fromEntries(Object.entries(record(source.records)).flatMap(([id, raw]) => {
    const value = record(raw);
    if (!identifier(id) || !identifier(value.heroId) || !identifier(value.universe) || !identifier(value.districtId)) return [];
    return [[id, { ...value, heroId: value.heroId, universe: value.universe, districtId: value.districtId,
      completedStepIds: Array.isArray(value.completedStepIds) ? value.completedStepIds.filter(identifier).slice(0, 32) : [],
      choiceId: identifier(value.choiceId), completed: value.completed === true }]];
  }));
  return { ...source, version: 1, activeId: identifier(source.activeId), records };
}

export function getMosaicCharacterMissionCatalog({ district, residents = [], exhibits = [], anchor, unlockedHeroIds = [] } = {}) {
  if (!district?.id || !district.universe || anchor?.action !== 'anchor' || anchor.universe !== district.universe) return [];
  const owned = new Set(unlockedHeroIds), people = new Set(residents.map(hero => hero.id)), items = new Set(exhibits.map(item => item.id));
  return MOSAIC_CHARACTER_MISSIONS.filter(mission => mission.universe === district.universe && owned.has(mission.heroId)
    && mission.steps.every(step => step.type !== 'npc' || people.has(step.targetId))
    && mission.steps.every(step => step.type !== 'exhibit' || items.has(step.targetId)))
    .map(mission => ({ ...mission, districtId: district.id, anchorId: anchor.id }));
}

function validSaved(mission, saved) {
  if (!saved || saved.heroId !== mission.heroId || saved.universe !== mission.universe || saved.districtId !== mission.districtId
    || !Array.isArray(saved.completedStepIds) || saved.completedStepIds.length > mission.steps.length) return false;
  if (!saved.completedStepIds.every((id, index) => id === mission.steps[index].id)) return false;
  const resolutionIndex = mission.steps.findIndex(step => step.type === 'decision');
  if (saved.completedStepIds.length > resolutionIndex && !mission.steps[resolutionIndex].choices.some(item => item.valid && item.id === saved.choiceId)) return false;
  return saved.completed === (saved.completedStepIds.length === mission.steps.length);
}

export function getMosaicCharacterMissionObjective(progress, mission, lang = 'fr') {
  if (!mission) return null;
  const saved = own(progress?.records, mission.id), compatible = !saved || validSaved(mission, saved);
  const index = compatible ? saved?.completedStepIds.length || 0 : 0;
  const step = compatible ? mission.steps[index] : null;
  const targetType = step?.type === 'npc' ? 'npc' : ['exhibit', 'anchor', 'marker'].includes(step?.type) ? 'zone' : null;
  const targetId = step?.type === 'npc' ? step.targetId : step?.type === 'exhibit' ? `${mission.districtId}::exhibit::${step.targetId}`
    : step?.type === 'anchor' ? mission.anchorId : step?.type === 'marker' ? `${mission.id}::${step.id}` : null;
  const resolution = mission.steps.find(item => item.type === 'decision')?.choices.find(item => item.id === saved?.choiceId && item.valid);
  return { missionId: mission.id, index, total: mission.steps.length, step, targetType, targetId,
    status: !compatible ? 'unavailable' : !saved ? 'available' : saved.completed ? 'completed' : progress.activeId === mission.id ? 'active' : 'paused',
    text: !compatible ? localizeCityMission(text('Le dossier conservé ne correspond pas à cette version de la mission.', 'The retained case does not match this mission version.'), lang)
      : step ? localizeCityMission(step.text, lang) : localizeCityMission(resolution?.result, lang),
    resolution: localizeCityMission(resolution?.result, lang) };
}

export function getMosaicCharacterMissionZones(progress, missions, lang = 'fr') {
  const mission = missions.find(item => item.id === progress?.activeId);
  const objective = getMosaicCharacterMissionObjective(progress, mission, lang);
  if (objective?.status !== 'active' || objective.step?.type !== 'marker') return [];
  const step = objective.step;
  return [{ id: objective.targetId, missionId: mission.id, stepId: step.id, universe: mission.universe,
    action: 'character-mission', x: step.x - 32, y: step.y - 32, w: 64, h: 64,
    label: localizeCityMission(step.text, lang), role: localizeCityMission(mission.title, lang), color: '#dfb85b' }];
}

const feedback = {
  unavailable: text('Ce contrat est indisponible. Le dossier conservé reste enregistré.', 'This contract is unavailable. The retained case stays saved.'),
  active: text('Ce contrat est déjà suivi.', 'This contract is already tracked.'),
  completed: text('Dossier transmis et archivé.', 'Case submitted and archived.'),
  inactive: text('Accepte ou reprends ce contrat avant de poursuivre.', 'Accept or resume this contract before continuing.'),
  wrong_target: text('Cette interaction ne correspond pas à l’étape suivie.', 'This interaction does not match the tracked step.'),
  out_of_range: text('Approche la cible pour recueillir cette preuve.', 'Approach the target to collect this evidence.'),
  started: text('Contrat suivi. Chaque étape de terrain est enregistrée.', 'Contract tracked. Each field step is saved.'),
  advanced: text('Étape consignée. La suite est disponible dans le journal.', 'Step recorded. The next step is available in the journal.')
};
function outcome(progress, next, reason, lang, extra) {
  return { progress: next, changed: next !== progress, reason, feedback: localizeCityMission(extra || feedback[reason], lang) };
}
export function startMosaicCharacterMission(progress, mission, lang = 'fr') {
  if (!mission) return outcome(progress, progress, 'unavailable', lang);
  const saved = own(progress?.records, mission.id);
  if (saved && !validSaved(mission, saved)) return outcome(progress, progress, 'unavailable', lang);
  if (saved?.completed) return outcome(progress, progress, 'completed', lang);
  if (saved && progress.activeId === mission.id) return outcome(progress, progress, 'active', lang);
  const next = normalizeMosaicCharacterMissions(progress);
  next.activeId = mission.id;
  next.lastMissionId = mission.id;
  next.records[mission.id] = saved || { heroId: mission.heroId, universe: mission.universe, districtId: mission.districtId,
    completedStepIds: [], choiceId: null, completed: false };
  return outcome(progress, next, 'started', lang);
}

/** Only a resolved in-world interaction advances evidence; menu selection
 * and directory previews never call this function. */
export function advanceMosaicCharacterMission(progress, mission, interaction, lang = 'fr') {
  const objective = getMosaicCharacterMissionObjective(progress, mission, lang);
  if (!objective || objective.status === 'unavailable') return outcome(progress, progress, 'unavailable', lang);
  if (objective.status === 'completed') return outcome(progress, progress, 'completed', lang);
  if (objective.status !== 'active') return outcome(progress, progress, 'inactive', lang);
  const range = MOSAIC_INTERACTION_RANGE[interaction?.type];
  if (!Number.isFinite(interaction?.distance) || interaction.distance < 0 || !Number.isFinite(range)
    || interaction.distance > range) return outcome(progress, progress, 'out_of_range', lang);
  const step = objective.step, target = interaction.target;
  if (objective.targetType !== interaction.type || objective.targetId !== interaction.id) return outcome(progress, progress, 'wrong_target', lang);
  const matching = step.type === 'npc' ? target?.hero?.id === step.targetId && target.hero.universe === mission.universe
    : target?.id === interaction.id && target.universe === mission.universe && (
      step.type === 'exhibit' ? target.action === 'exhibit' && target.exhibitId === step.targetId
        : step.type === 'anchor' ? target.action === 'anchor'
          : step.type === 'marker' && target.action === 'character-mission' && target.missionId === mission.id && target.stepId === step.id);
  if (!matching) return outcome(progress, progress, 'wrong_target', lang);
  return completeStep(progress, mission, step, lang, null, step.finding);
}

function completeStep(progress, mission, step, lang, choiceId, message) {
  const next = normalizeMosaicCharacterMissions(progress), saved = next.records[mission.id];
  next.records[mission.id] = { ...saved, completedStepIds: [...saved.completedStepIds, step.id],
    choiceId: choiceId || saved.choiceId, completed: saved.completedStepIds.length + 1 === mission.steps.length };
  if (next.records[mission.id].completed) next.activeId = null;
  return outcome(progress, next, next.records[mission.id].completed ? 'completed' : 'advanced', lang, message);
}
export function resolveMosaicCharacterMission(progress, mission, choiceId, lang = 'fr') {
  const objective = getMosaicCharacterMissionObjective(progress, mission, lang);
  if (objective?.status !== 'active' || objective.step?.type !== 'decision') return outcome(progress, progress, 'inactive', lang);
  const selected = objective.step.choices.find(item => item.id === choiceId);
  if (!selected) return outcome(progress, progress, 'wrong_target', lang);
  if (!selected.valid) return outcome(progress, progress, 'wrong_target', lang, selected.result);
  return completeStep(progress, mission, objective.step, lang, selected.id, selected.result);
}
