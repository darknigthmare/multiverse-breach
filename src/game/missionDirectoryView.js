import { paginateCatalog } from './catalogPagination.js';

export const MISSION_DIRECTORY_PAGE_SIZE = 12;
export const MISSION_DIRECTORY_STATUSES = ['all', 'available', 'completed', 'composition', 'locked'];
export const missionDirectoryText = (value, lang, fallback = '') => typeof value === 'string' ? value : value?.[lang] || value?.fr || value?.en || fallback;

// Projection only: the existing deployment resolver remains the access authority.
export function getMissionDirectoryView({ stages = [], completedStages = [], isStageUnlocked,
  getMissionDeployment, statusFilter = 'all', query = '', page = 1 }) {
  const completedIds = new Set(completedStages);
  const counts = { all: stages.length, available: 0, completed: 0, composition: 0, locked: 0 };
  const rows = stages.map(stage => {
    const completed = completedIds.has(stage.id), unlocked = isStageUnlocked(stage);
    const deployment = getMissionDeployment?.(stage) || { allowed: unlocked, baseUnlocked: unlocked };
    const canDeploy = deployment.allowed;
    if (canDeploy && !completed) counts.available += 1;
    if (completed) counts.completed += 1;
    if (unlocked && !canDeploy) counts.composition += 1;
    if (!unlocked) counts.locked += 1;
    return { stage, completed, unlocked, deployment, canDeploy,
      status: completed ? 'completed' : canDeploy ? 'available' : unlocked ? 'composition' : 'locked' };
  });
  const matches = row => statusFilter === 'all'
    || statusFilter === 'available' && row.canDeploy && !row.completed
    || statusFilter === 'completed' && row.completed
    || statusFilter === 'composition' && row.unlocked && !row.canDeploy
    || statusFilter === 'locked' && !row.unlocked;
  return { ...paginateCatalog(rows, { page, pageSize: MISSION_DIRECTORY_PAGE_SIZE, query, predicate: matches,
    getSearchText: ({ stage }) => [stage.id, stage.name, stage.displayName?.fr, stage.displayName?.en,
      stage.universe, ...(stage.sourceUniverses || []), stage.bossName, stage.mode].filter(Boolean).join(' ') }), counts };
}

export function getMissionDirectoryBlockReason(row, lang = 'fr') {
  if (row.canDeploy) return '';
  return missionDirectoryText(row.deployment.message, lang) || (row.unlocked
    ? (lang === 'fr' ? 'Consulte le briefing pour préparer une cellule compatible.' : 'Open the briefing to prepare a compatible squad.')
    : (lang === 'fr' ? 'Cette mission est encore scellée. Consulte ses prérequis dans le briefing.' : 'This mission is still sealed. Check its requirements in the briefing.'));
}
