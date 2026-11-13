import { MOSAIC_CHARACTER_MISSIONS, normalizeMosaicCharacterMissions } from '../../src/game/mosaicCharacterMissions.js';

// Dense presentation data only. These copies never enter a production roster.
const district = { districtId: 'universe-nexus-de-convergence', anchorId: 'universe-nexus-de-convergence-core' };
const original = MOSAIC_CHARACTER_MISSIONS.find(item => item.id === 'city-anchor-signature-v1');
const followup = MOSAIC_CHARACTER_MISSIONS.find(item => item.requiresMissionId === original.id);
if (!followup) throw new Error('The journal fixture requires the actual Anchor follow-up contract');
export const prerequisiteCase = { ...original, ...district };
export const followupCase = { ...followup, ...district };
export const journalCases = [
  ...Array.from({ length: 61 }, (_, index) => {
    const number = index + 1;
    return { ...structuredClone(original), ...district, id: `qa-case-${number}`, heroId: `qa-resident-${number}`,
      title: { fr: `Relevé signé ${number}`, en: `Signed reading ${number}` },
      premise: { fr: `Dossier de présentation synthétique ${number}. ${number === 61 ? 'Le dernier témoin conserve une mémoire attribuée.' : 'Comparer deux témoignages sans les confondre.'}`,
        en: `Synthetic presentation case ${number}. ${number === 61 ? 'The final witness retains an attributed memory.' : 'Compare two accounts without conflating them.'}` },
      steps: original.steps.map((step, i) => ({ ...structuredClone(step), ...(i === 0 ? { finding: { fr: `Constat synthétique enregistré ${number}.`, en: `Recorded synthetic finding ${number}.` } } : {}) })) };
  }), prerequisiteCase, followupCase
];
export const journalHeroes = journalCases.filter(item => item.id.startsWith('qa-case-')).map((mission, index) => ({ id: mission.heroId,
  name: index === 60 ? 'Émissaire Zénith 61' : `Habitant QA ${index + 1}` }));

export function journalRecord(mission, index, choiceId = null) {
  return { heroId: mission.heroId, universe: mission.universe, districtId: mission.districtId,
    completedStepIds: mission.steps.slice(0, index).map(step => step.id), choiceId, completed: index === mission.steps.length };
}

export function journalProgress({ prerequisiteComplete = false } = {}) {
  const decisions = original.steps.find(step => step.type === 'decision').choices.filter(choice => choice.valid);
  const records = {
    'qa-case-1': journalRecord(journalCases[0], original.steps.length, decisions[0].id),
    'qa-case-2': journalRecord(journalCases[1], 1),
    'qa-case-3': journalRecord(journalCases[2], 2),
    'qa-case-4': { ...journalRecord(journalCases[3], 0), universe: 'Unavailable fixture universe', futureField: 'preserved' },
    'absent-dlc-case': { heroId: 'absent-guest', universe: 'Absent fixture DLC', districtId: 'absent-district', completedStepIds: ['prepared-evidence'], choiceId: null, completed: false, futureField: 'preserved' }
  };
  if (prerequisiteComplete) records[prerequisiteCase.id] = journalRecord(prerequisiteCase, prerequisiteCase.steps.length, decisions[1].id);
  return normalizeMosaicCharacterMissions({ activeId: 'qa-case-3', records });
}
