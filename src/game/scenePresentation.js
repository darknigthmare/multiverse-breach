/** Presentation only: never replace the stable gameplay IDs with translated text. */
const ENEMY_LABELS = Object.freeze({
  Traqueur: { fr: 'Traqueur', en: 'Stalker' },
  Sniper: { fr: 'Tireur', en: 'Sniper' },
  Briseur: { fr: 'Briseur', en: 'Breaker' },
  Essaim: { fr: 'Essaim', en: 'Swarm' },
  'Champion de Trame': { fr: 'Champion de Trame', en: 'Thread Champion' },
  'Drone Protecteur': { fr: 'Drone Protecteur', en: 'Shield Drone' }
});
const OBJECTIVE_LABELS = Object.freeze({
  podium: { fr: 'Finir dans le podium', en: 'Finish on the podium' },
  beatRival: { fr: 'Battre le rival cible', en: 'Beat the target rival' },
  collectFragments: { fr: 'Recuperer les fragments', en: 'Collect fragments' },
  closePortals: { fr: 'Fermer les portails', en: 'Close the portals' },
  timeLimit: { fr: 'Sceller avant surcharge', en: 'Seal before overload' }
});
const locale = lang => lang === 'en' ? 'en' : 'fr';
export const extinctionEnemyLabel = (kind, lang = 'fr') => ENEMY_LABELS[kind]?.[locale(lang)] || String(kind || '');
export const raceObjectiveLabel = (type, lang = 'fr') => OBJECTIVE_LABELS[type]?.[locale(lang)] || (locale(lang) === 'fr' ? 'Objectif de course' : 'Race objective');
export function formatRaceObjective(objective, time = 0, lang = 'fr') {
  if (!objective) return locale(lang) === 'fr' ? 'Objectif libre' : 'Free race';
  const label = OBJECTIVE_LABELS[objective.type] ? raceObjectiveLabel(objective.type, lang) : objective.label || raceObjectiveLabel('', lang);
  if (['collectFragments', 'closePortals'].includes(objective.type)) return `${label}: ${objective.collected}/${objective.required}`;
  if (objective.type === 'timeLimit') return `${label}: ${Math.max(0, objective.seconds - time).toFixed(0)}s`;
  if (objective.type === 'beatRival') return `${label}: ${objective.rivalName || objective.rivalId}`;
  return label;
}
/** A deliberately short teaser; the full, unchanged transmission stays in the terminal. */
export function sceneJournalPreview(message, maxLength = 88) {
  const text = String(message || '').replace(/\s+/g, ' ').trim();
  const limit = Number.isFinite(maxLength) ? Math.max(16, Math.floor(maxLength)) : 88;
  const characters = Array.from(text);
  if (characters.length <= limit) return text;
  const excerpt = characters.slice(0, limit - 1).join('');
  const lastSpace = excerpt.lastIndexOf(' ');
  return `${lastSpace > limit * .6 ? excerpt.slice(0, lastSpace) : excerpt}…`;
}
