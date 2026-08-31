// These ten authored routes deliberately bypass language/type guessing. Keep
// corrections local: older, already-reviewed dossier contracts must not drift.
const objective = (fr, en) => Object.freeze({ fr, en });
const marker = (id, kind, fr, en, x, order, extra = {}) => Object.freeze({
  id, kind, label: objective(fr, en), position: Object.freeze({ x, y: 0.76 }), order, ...extra
});
const switches = (prefix, count = 3) => Array.from({ length: count }, (_, index) => marker(
  `${prefix}-${index + 1}`, 'switch', `Mécanisme ${index + 1}`, `Mechanism ${index + 1}`,
  0.2 + index * 0.28, index + 1
));
const route = (prefix, fr, en, count = 4, extra = {}) => Array.from({ length: count }, (_, index) => marker(
  `${prefix}-${index + 1}`, 'checkpoint', `${fr} ${index + 1}`, `${en} ${index + 1}`,
  0.18 + index * (0.7 / (count - 1)), index + 1, extra
));
const definition = (stageId, fr, en, type, trial = {}) => Object.freeze({
  stageId, objective: objective(fr, en), trialType: type,
  nonCombatTrial: Object.freeze({ type, ...trial })
});

export const WAVE6_NON_COMBAT_OBJECTIVES = Object.freeze({
  'Runner Bag Delivery': definition(34480, 'Livrer les trois sacs de messager.', 'Deliver all three messenger bags.', 'collect', {
    orderedObjects: true,
    objects: Object.freeze(Array.from({ length: 3 }, (_, index) => [
      marker(`bag-${index + 1}`, 'collectible', `Sac ${index + 1}`, `Bag ${index + 1}`, 0.17 + index * 0.28, index * 2 + 1),
      marker(`delivery-${index + 1}`, 'checkpoint', `Livraison ${index + 1}`, `Delivery ${index + 1}`, 0.31 + index * 0.28, index * 2 + 2, { gatedBy: `bag-${index + 1}` })
    ]).flat())
  }),
  'The Shard Route Puzzle': definition(34481, 'Ouvrir la route verticale et atteindre la sortie.', 'Open the vertical route and reach the exit.', 'escape', {
    orderedObjects: true,
    objects: Object.freeze([
      marker('route-switch-1', 'switch', 'Accès inférieur', 'Lower access', 0.2, 1),
      marker('route-checkpoint', 'checkpoint', 'Passage supérieur', 'Upper passage', 0.46, 2, { position: Object.freeze({ x: 0.46, y: 0.66 }) }),
      marker('route-switch-2', 'switch', 'Accès de sortie', 'Exit access', 0.72, 3),
      marker('route-exit', 'extraction', 'Sortie', 'Exit', 0.9, 4)
    ])
  }),
  'Secret Rooms Puzzle': definition(34510, 'Ouvrir les passages secrets.', 'Open the hidden passages.', 'switches', {
    objects: Object.freeze(switches('passage'))
  }),
  'Banishment Trial': definition(34511, 'Placer les artefacts, puis atteindre la sortie.', 'Place the artifacts, then reach the exit.', 'escape', {
    orderedObjects: true,
    objects: Object.freeze([
      ...Array.from({ length: 3 }, (_, index) => marker(`artifact-${index + 1}`, 'switch', `Artefact ${index + 1}`, `Artifact ${index + 1}`, 0.2 + index * 0.22, index + 1)),
      marker('banishment-exit', 'extraction', 'Sortie', 'Exit', 0.9, 4)
    ])
  }),
  'Erangel Driving Course': definition(34540, 'Terminer le parcours de slalom.', 'Complete the slalom course.', 'escape', {
    objects: Object.freeze(route('slalom', 'Porte de slalom', 'Slalom gate', 5))
  }),
  'Final Circle Survival Trial': definition(34541, 'Rester à couvert sans attaquer.', 'Stay behind cover without attacking.', 'survive', {
    forbidAttacks: true, durationFrames: 900, requiredParticipationRatio: 0.9,
    // A single stable cover preserves the 90% requirement without impossible
    // cross-arena transfers. It is reachable from the normal spawn in time.
    objects: Object.freeze([
      marker('circle-cover', 'safety-zone', 'Couvert', 'Cover', 0.2, 1, { requiredProgress: 900 })
    ])
  }),
  'Le salon de 1695': definition(34550, 'Résoudre le protocole de la cour.', 'Solve the court protocol puzzle.', 'switches', {
    orderedObjects: true,
    objects: Object.freeze([
      marker('court-invitation', 'switch', 'Invitation', 'Invitation', 0.2, 1),
      marker('court-precedence', 'switch', 'Ordre de préséance', 'Order of precedence', 0.48, 2),
      marker('court-audience', 'switch', 'Audience royale', 'Royal audience', 0.76, 3)
    ])
  }),
  'L auberge de 1810': definition(34551, 'Associer les bagages aux chambres des voyageurs.', 'Match the luggage to the guest rooms.', 'collect', {
    orderedObjects: true,
    objects: Object.freeze(Array.from({ length: 3 }, (_, index) => [
      marker(`luggage-${index + 1}`, 'collectible', `Bagage ${index + 1}`, `Luggage ${index + 1}`, 0.17 + index * 0.28, index * 2 + 1),
      marker(`room-${index + 1}`, 'checkpoint', `Chambre ${index + 1}`, `Guest room ${index + 1}`, 0.31 + index * 0.28, index * 2 + 2, { gatedBy: `luggage-${index + 1}` })
    ]).flat())
  }),
  'Strode Compound Traps': definition(34560, 'Activer les mécanismes dans le bon ordre.', 'Activate the mechanisms in the correct order.', 'switches', {
    orderedObjects: true, objects: Object.freeze(switches('trap', 3))
  }),
  'Sewer Pursuit': definition(34561, 'Suivre les balises sans être repéré.', 'Follow the markers without being detected.', 'escape', {
    forbidAttacks: true,
    objects: Object.freeze(route('quiet-marker', 'Balise discrète', 'Quiet marker', 4, { requiresGuard: true }))
  })
});

export function authoredWave6NonCombatStage(name, fallbackObjective) {
  const correction = WAVE6_NON_COMBAT_OBJECTIVES[name];
  if (!correction) return { name, nonCombat: true, objective: fallbackObjective };
  return {
    name, nonCombat: true, objective: correction.objective,
    stageObjectiveOverride: true, trialType: correction.trialType,
    nonCombatTrial: correction.nonCombatTrial
  };
}
