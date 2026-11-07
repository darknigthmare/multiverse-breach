import { getFieldOperationPreferences } from './fieldOperationPreferences.js';
import { MOSAIC_INTERACTION_RANGE } from './mosaicCityRuntime.js';

const identifier = value => typeof value === 'string' && value.trim() ? value : null;
const record = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const own = (value, key) => Object.hasOwn(record(value), key) ? value[key] : undefined;
const localize = (fr, en, lang) => lang === 'fr' ? fr : en;

/** Inputs are the current district's owned residents and enabled archive displays. */
export function buildMosaicReconnaissanceDossier({ district, residents = [], exhibits = [], anchor } = {}) {
  const districtId = identifier(district?.id), universe = identifier(district?.universe);
  if (!districtId || !universe || anchor?.action !== 'anchor'
    || anchor.universe !== universe || !identifier(anchor.id)) return null;
  const residentIds = [...new Set((Array.isArray(residents) ? residents : [])
    .filter(hero => identifier(hero?.id) && hero.id !== 'player_anchor' && hero.universe === universe)
    .map(hero => hero.id))];
  const exhibitIds = [...new Set((Array.isArray(exhibits) ? exhibits : [])
    .filter(item => identifier(item?.id) && item.universe === universe).map(item => item.id))];
  if (!residentIds.length || !exhibitIds.length) return null;
  return Object.freeze({
    id: `mosaic-recon:${districtId}`, districtId, universe, anchorId: anchor.id,
    residentIds: Object.freeze(residentIds), exhibitIds: Object.freeze(exhibitIds),
    exhibitTargetIds: Object.freeze(exhibitIds.map(id => `${districtId}::exhibit::${id}`))
  });
}

/** No catalog filtering here: an uninstalled district keeps its recorded progress. */
export function normalizeMosaicReconnaissance(saved = {}) {
  const source = record(saved);
  const dossiers = Object.fromEntries(Object.entries(record(source.dossiers)).flatMap(([id, raw]) => {
    const value = record(raw), universe = identifier(value.universe);
    if (!identifier(id) || !universe) return [];
    const residentId = identifier(value.residentId);
    const crossCheck = value.exhibitGoal === 2;
    const evidenceIds = crossCheck && residentId && Array.isArray(value.evidenceIds)
      ? [...new Set(value.evidenceIds.map(identifier).filter(Boolean))].slice(0, 2) : [];
    const exhibitId = residentId && (!crossCheck || evidenceIds.length === 2)
      ? (crossCheck ? evidenceIds[1] : identifier(value.exhibitId)) : null;
    return [[id, { universe, residentId, exhibitId, completed: Boolean(exhibitId && value.completed === true),
      ...(crossCheck ? { exhibitGoal: 2, evidenceIds } : {}) }]];
  }));
  const activeDistrictId = identifier(source.activeDistrictId);
  return {
    version: 1,
    activeDistrictId: activeDistrictId && own(dossiers, activeDistrictId) && !dossiers[activeDistrictId].completed
      ? activeDistrictId : null,
    dossiers
  };
}

export function getMosaicReconnaissanceObjective(progress, dossier, lang = 'fr') {
  if (!dossier) return {
    status: 'unavailable', step: 'unavailable', index: 0, total: 3,
    title: localize('Reconnaissance de quartier', 'District reconnaissance', lang),
    text: localize('Ce quartier ne propose pas de dossier accessible.', 'This district has no available dossier.', lang),
    targetType: null, targetIds: []
  };
  const saved = own(progress?.dossiers, dossier.districtId);
  const incompatible = saved && saved.universe !== dossier.universe;
  const step = incompatible ? 'unavailable' : !saved ? 'accept' : saved.completed ? 'done'
    : !saved.residentId ? 'resident' : !saved.exhibitId ? 'exhibit' : 'report';
  const texts = {
    unavailable: ['Le dossier conservé ne correspond pas au quartier disponible.', 'The retained dossier does not match the available district.'],
    accept: ['Accepte ce dossier pour rencontrer un habitant, examiner une relique et faire ton rapport.', 'Accept this dossier to meet a resident, inspect a relic, and report back.'],
    resident: [`Parle à un habitant de ${dossier.universe} dans ce quartier.`, `Talk to a ${dossier.universe} resident in this district.`],
    exhibit: [`Examine une relique de ${dossier.universe} dans une vitrine du quartier.`, `Inspect a ${dossier.universe} relic in a district display.`],
    report: ['Rejoins l’ancre locale et transmets ton rapport.', 'Reach the local anchor and submit your report.'],
    done: ['Rapport transmis. Cette reconnaissance est archivée.', 'Report submitted. This reconnaissance is archived.']
  };
  const evidenceIds = saved?.exhibitGoal === 2 ? saved.evidenceIds || [] : [];
  if (step === 'exhibit' && saved?.exhibitGoal === 2) texts.exhibit = [
    `Enquête croisée : examine deux reliques distinctes de ${dossier.universe} (${evidenceIds.length}/2).`,
    `Cross-check: inspect two distinct ${dossier.universe} relics (${evidenceIds.length}/2).`
  ];
  const [fr, en] = texts[step];
  return {
    districtId: dossier.districtId, universe: dossier.universe,
    status: incompatible ? 'unavailable' : !saved ? 'available' : saved.completed ? 'completed'
      : progress.activeDistrictId === dossier.districtId ? 'active' : 'paused',
    step, index: ({ accept: 0, resident: 0, exhibit: 1, report: 2, done: 3, unavailable: 0 })[step], total: 3,
    title: localize(`Reconnaissance — ${dossier.universe}`, `Reconnaissance — ${dossier.universe}`, lang),
    text: localize(fr, en, lang),
    targetType: step === 'resident' ? 'npc' : ['exhibit', 'report'].includes(step) ? 'zone' : null,
    targetIds: step === 'resident' ? [...dossier.residentIds] : step === 'exhibit'
      ? dossier.exhibitIds.filter(id => !evidenceIds.includes(id)).map(id => `${dossier.districtId}::exhibit::${id}`) : step === 'report' ? [dossier.anchorId] : []
  };
}

const feedback = {
  insufficient_exhibits: ['L’enquête croisée exige deux reliques accessibles. Choisis un autre quartier ou le mode standard.', 'Cross-check requires two accessible relics. Choose another district or standard mode.'],
  evidence_recorded: ['Première trace recueillie. Examine une autre relique du quartier.', 'First trace recorded. Inspect a different district relic.'],
  already_examined: ['Cette relique a déjà été examinée. Cherche une autre trace.', 'This relic has already been inspected. Find a different trace.'],
  unavailable: ['Ce dossier n’est pas disponible. Ta progression est conservée.', 'This dossier is unavailable. Your progress is retained.'],
  started: ['Dossier accepté. Rencontre un habitant du quartier.', 'Dossier accepted. Meet a district resident.'],
  resumed: ['Reconnaissance reprise à la dernière étape validée.', 'Reconnaissance resumed from the last completed step.'],
  active: ['Ce dossier est déjà suivi.', 'This dossier is already active.'],
  inactive: ['Accepte ou reprends ce dossier avant de poursuivre.', 'Accept or resume this dossier before continuing.'],
  out_of_range: ['Approche la cible et interagis pour poursuivre.', 'Move near the target and interact to continue.'],
  wrong_target: ['Cette interaction ne correspond pas à l’objectif actuel.', 'This interaction does not match the current objective.'],
  resident_recorded: ['Témoignage recueilli. Examine maintenant une relique du quartier.', 'Testimony recorded. Now inspect a district relic.'],
  exhibit_recorded: ['Relique examinée. Transmets ton rapport à l’ancre locale.', 'Relic inspected. Submit your report at the local anchor.'],
  completed: ['Rapport transmis : reconnaissance du quartier achevée.', 'Report submitted: district reconnaissance complete.'],
  already_completed: ['Ce rapport a déjà été archivé.', 'This report has already been archived.']
};

function outcome(previous, progress, dossier, reason, lang) {
  const [fr, en] = feedback[reason];
  return { progress, changed: progress !== previous, reason,
    feedback: localize(fr, en, lang), objective: getMosaicReconnaissanceObjective(progress, dossier, lang) };
}

export function startMosaicReconnaissance(progress, dossier, lang = 'fr', options = {}) {
  const previous = own(progress?.dossiers, dossier?.districtId);
  if (!dossier || (previous && previous.universe !== dossier.universe)) return outcome(progress, progress, dossier, 'unavailable', lang);
  if (previous?.completed) return outcome(progress, progress, dossier, 'already_completed', lang);
  if (previous && progress.activeDistrictId === dossier.districtId) return outcome(progress, progress, dossier, 'active', lang);
  // Lock the contract at acceptance; changing preferences never rewrites a dossier.
  const crossCheck = !previous && (options.exhibitGoal === undefined
    ? getFieldOperationPreferences().reconnaissance === 'cross-check' : options.exhibitGoal === 2);
  if (crossCheck && dossier.exhibitIds.length < 2) return outcome(progress, progress, dossier, 'insufficient_exhibits', lang);
  const next = normalizeMosaicReconnaissance(progress);
  next.activeDistrictId = dossier.districtId;
  next.dossiers = { ...next.dossiers, [dossier.districtId]: previous
    ? { ...next.dossiers[dossier.districtId] }
    : { universe: dossier.universe, residentId: null, exhibitId: null, completed: false,
      ...(crossCheck ? { exhibitGoal: 2, evidenceIds: [] } : {}) } };
  return outcome(progress, next, dossier, previous ? 'resumed' : 'started', lang);
}

/** Pass only the result of resolveMosaicInteraction, never a directory selection. */
export function advanceMosaicReconnaissance(progress, dossier, interaction, lang = 'fr') {
  const saved = own(progress?.dossiers, dossier?.districtId);
  if (!dossier || (saved && saved.universe !== dossier.universe)) return outcome(progress, progress, dossier, 'unavailable', lang);
  if (saved?.completed) return outcome(progress, progress, dossier, 'already_completed', lang);
  if (!saved || progress.activeDistrictId !== dossier.districtId) return outcome(progress, progress, dossier, 'inactive', lang);
  const range = MOSAIC_INTERACTION_RANGE[interaction?.type];
  if (!Number.isFinite(interaction?.distance) || interaction.distance < 0
    || !Number.isFinite(range) || interaction.distance > range) return outcome(progress, progress, dossier, 'out_of_range', lang);
  const target = interaction.target;
  let update, reason;
  if (!saved.residentId && interaction.type === 'npc'
    && target?.hero?.id === interaction.id && target.hero.universe === dossier.universe
    && dossier.residentIds.includes(interaction.id)) {
    update = { residentId: interaction.id }; reason = 'resident_recorded';
  } else if (saved.residentId && !saved.exhibitId && interaction.type === 'zone'
    && target?.action === 'exhibit' && target.id === interaction.id && target.universe === dossier.universe
    && dossier.exhibitIds.includes(target.exhibitId)
    && interaction.id === `${dossier.districtId}::exhibit::${target.exhibitId}`) {
    if (saved.exhibitGoal === 2) {
      const evidenceIds = [...new Set(saved.evidenceIds || [])];
      if (evidenceIds.includes(target.exhibitId)) return outcome(progress, progress, dossier, 'already_examined', lang);
      evidenceIds.push(target.exhibitId);
      update = { evidenceIds, exhibitId: evidenceIds.length >= 2 ? target.exhibitId : null };
      reason = evidenceIds.length >= 2 ? 'exhibit_recorded' : 'evidence_recorded';
    } else { update = { exhibitId: target.exhibitId }; reason = 'exhibit_recorded'; }
  } else if (saved.exhibitId && interaction.type === 'zone' && target?.action === 'anchor'
    && target.id === interaction.id && target.universe === dossier.universe && interaction.id === dossier.anchorId) {
    update = { completed: true }; reason = 'completed';
  } else return outcome(progress, progress, dossier, 'wrong_target', lang);
  const next = normalizeMosaicReconnaissance(progress);
  next.dossiers = { ...next.dossiers, [dossier.districtId]: { ...next.dossiers[dossier.districtId], ...update } };
  if (update.completed) next.activeDistrictId = null;
  return outcome(progress, next, dossier, reason, lang);
}
