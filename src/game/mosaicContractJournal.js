import { paginateCatalog } from './catalogPagination.js';
import { getMosaicCharacterMissionObjective, getMosaicCharacterMissionStep, localizeCityMission } from './mosaicCharacterMissions.js';

export const CITY_CONTRACT_FILTERS = Object.freeze(['all', 'available', 'in-progress', 'completed', 'locked', 'unavailable']);
const copy = {
  all: ['Tous', 'All'], available: ['À commencer', 'Not started'], 'in-progress': ['En cours', 'In progress'],
  completed: ['Accomplies', 'Completed'], locked: ['À débloquer', 'Locked'], unavailable: ['Indisponibles', 'Unavailable'],
  active: ['Suivie', 'Tracked'], paused: ['En pause', 'Paused']
};

export const cityContractStatusLabel = (status, lang = 'fr') => (copy[status] || copy.unavailable)[lang === 'fr' ? 0 : 1];
const bucket = status => ['active', 'paused'].includes(status) ? 'in-progress' : CITY_CONTRACT_FILTERS.includes(status) ? status : 'unavailable';
const translations = value => typeof value === 'string' ? value : Object.values(value || {}).filter(text => typeof text === 'string').join(' ');
const residentName = (id, names, lang) => names.get(id) || (id === 'player_anchor'
  ? (lang === 'fr' ? 'Ton Ancre' : 'Your Anchor') : (lang === 'fr' ? 'Un habitant' : 'A resident'));

/** A read-only view of available district contracts. Source order, checkpoint
 * records and the followed mission remain unchanged by filtering or paging. */
export function getCityContractJournal({ missions = [], progress, heroes = [], lang = 'fr', query = '', status = 'all', page = 1 } = {}) {
  const names = new Map(heroes.map(hero => [hero.id, hero.name]));
  const entries = missions.map(mission => {
    const heroName = residentName(mission.heroId, names, lang);
    const objective = getMosaicCharacterMissionObjective(progress, mission, lang);
    return { mission, objective, heroName, title: objective?.storyTitle || localizeCityMission(mission.title, lang),
      statusLabel: cityContractStatusLabel(objective?.status, lang), bucket: bucket(objective?.status) };
  });
  const counts = Object.fromEntries(CITY_CONTRACT_FILTERS.map(key => [key, key === 'all' ? entries.length : entries.filter(entry => entry.bucket === key).length]));
  const selectedStatus = CITY_CONTRACT_FILTERS.includes(status) ? status : 'all';
  const view = paginateCatalog(entries, { query, page, pageSize: 12,
    predicate: entry => selectedStatus === 'all' || entry.bucket === selectedStatus,
    getSearchText: entry => [entry.heroName, entry.mission.heroId, entry.mission.universe,
      ...['title', 'premise', 'request', 'location'].map(key => translations(entry.mission[key])),
      ...entry.mission.steps.map(step => translations(step.operation?.propName))].join(' ') });
  return { ...view, entries, counts, status: selectedStatus };
}

/** Only completed steps become memories. Reading a request never invents a
 * conversation, an operation result, or a future branch of the adventure. */
export function getCityContractStory({ mission, progress, objective, heroes = [], lang = 'fr' }) {
  if (!mission || !objective) return null;
  const names = new Map(heroes.map(hero => [hero.id, hero.name]));
  const steps = mission.steps.map((_, index) => {
    const step = getMosaicCharacterMissionStep(progress, mission, index);
    return { ...step, index, done: index < objective.index,
      speaker: residentName(step.type === 'npc' ? step.targetId : mission.heroId, names, lang) };
  });
  const latest = [...steps].reverse().find(step => step.done && (step.dialogue || step.finding));
  const previous = progress?.records?.[mission.id]?.previousStory;
  let previousVisit = null;
  if (previous?.heroId === mission.heroId && previous.universe === mission.universe && previous.districtId === mission.districtId
    && Array.isArray(previous.completedStepIds) && previous.completedStepIds.length <= mission.steps.length
    && previous.completedStepIds.every((id, index) => id === mission.steps[index].id)) {
    const previousProgress = { ...progress, activeId: null, records: { ...progress.records, [mission.id]: previous } };
    const previousSteps = previous.completedStepIds.map((_, index) => getMosaicCharacterMissionStep(previousProgress, mission, index));
    const selected = previousSteps.find(step => step.type === 'decision')?.choices.find(choice => choice.id === previous.choiceId && choice.valid);
    previousVisit = { title: getMosaicCharacterMissionObjective(previousProgress, mission, lang).storyTitle || localizeCityMission(mission.title, lang),
      completed: previous.completed, steps: previousSteps, choice: localizeCityMission(selected?.label, lang),
      resolution: localizeCityMission(selected?.result, lang) };
  }
  return {
    request: localizeCityMission(mission.request, lang),
    location: localizeCityMission(mission.location, lang),
    history: steps.filter(step => step.done || (step.index === objective.index && ['active', 'paused'].includes(objective.status))),
    latest: latest ? { ...latest, dialogue: localizeCityMission(latest.dialogue, lang), finding: localizeCityMission(latest.finding, lang) } : null,
    previousVisit,
    approach: localizeCityMission(objective.step?.actionLabel, lang)
      || (objective.step?.type === 'npc' && names.has(objective.step.targetId)
        ? `${lang === 'fr' ? 'Rejoindre' : 'Find'} ${names.get(objective.step.targetId)}`
        : lang === 'fr' ? 'Aller sur place' : 'Go there')
  };
}
