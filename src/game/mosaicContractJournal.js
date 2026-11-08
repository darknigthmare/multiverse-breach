import { paginateCatalog } from './catalogPagination.js';
import { getMosaicCharacterMissionObjective, localizeCityMission } from './mosaicCharacterMissions.js';

export const CITY_CONTRACT_FILTERS = Object.freeze(['all', 'available', 'in-progress', 'completed', 'locked', 'unavailable']);
const copy = {
  all: ['Tous', 'All'], available: ['À commencer', 'Not started'], 'in-progress': ['En cours', 'In progress'],
  completed: ['Transmis', 'Submitted'], locked: ['À débloquer', 'Locked'], unavailable: ['À vérifier', 'Needs review'],
  active: ['Suivi', 'Tracked'], paused: ['En pause', 'Paused']
};

export const cityContractStatusLabel = (status, lang = 'fr') => (copy[status] || copy.unavailable)[lang === 'fr' ? 0 : 1];
const bucket = status => ['active', 'paused'].includes(status) ? 'in-progress' : CITY_CONTRACT_FILTERS.includes(status) ? status : 'unavailable';
const translations = value => typeof value === 'string' ? value : Object.values(value || {}).filter(text => typeof text === 'string').join(' ');

/** A read-only view of available district contracts. Source order, checkpoint
 * records and the followed mission remain unchanged by filtering or paging. */
export function getCityContractJournal({ missions = [], progress, heroes = [], lang = 'fr', query = '', status = 'all', page = 1 } = {}) {
  const names = new Map(heroes.map(hero => [hero.id, hero.name]));
  const entries = missions.map(mission => {
    const heroName = names.get(mission.heroId) || (mission.heroId === 'player_anchor' ? (lang === 'fr' ? 'Ton Ancre' : 'Your Anchor') : mission.heroId);
    const objective = getMosaicCharacterMissionObjective(progress, mission, lang);
    return { mission, objective, heroName, title: localizeCityMission(mission.title, lang),
      statusLabel: cityContractStatusLabel(objective?.status, lang), bucket: bucket(objective?.status) };
  });
  const counts = Object.fromEntries(CITY_CONTRACT_FILTERS.map(key => [key, key === 'all' ? entries.length : entries.filter(entry => entry.bucket === key).length]));
  const selectedStatus = CITY_CONTRACT_FILTERS.includes(status) ? status : 'all';
  const view = paginateCatalog(entries, { query, page, pageSize: 12,
    predicate: entry => selectedStatus === 'all' || entry.bucket === selectedStatus,
    getSearchText: entry => [entry.heroName, entry.mission.heroId, entry.mission.universe, translations(entry.mission.title), translations(entry.mission.premise)].join(' ') });
  return { ...view, entries, counts, status: selectedStatus };
}
