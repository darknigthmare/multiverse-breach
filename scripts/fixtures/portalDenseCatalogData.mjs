// Synthetic labels/art stress layout only. These are not proposed game rewards.
export const denseBanner = Object.freeze({
  id: 'qa:reading-room', universe: 'Nexus de Convergence', scope: 'core', priceTier: 'targeted', color: '#78e3d1',
  label: { fr: 'Archives de contrôle — Les très longues expéditions des bibliothécaires de la Cité-Mosaïque', en: 'Verification archives — The very long expeditions of the librarians of the Mosaic City' },
  desc: { fr: 'Catalogue synthétique de vérification. Les descriptions, taux et identités sont conservés quand la lecture change de page.', en: 'Synthetic verification catalogue. Descriptions, rates and identities survive page navigation.' },
  meta: { fr: 'Ce dossier de contrôle ne débite aucune ressource.', en: 'This verification dossier does not spend resources.' },
  guaranteeNonHeroRare: true
});
export const denseRarities = Object.freeze({
  common: { id: 'common', label: { fr: 'Stable', en: 'Stable' }, color: '#bce3e2', weight: 58 },
  rare: { id: 'rare', label: { fr: 'Rare', en: 'Rare' }, color: '#80c7ff', weight: 28 },
  epic: { id: 'epic', label: { fr: 'Épique', en: 'Epic' }, color: '#ddb0ff', weight: 11 },
  anomaly: { id: 'anomaly', label: { fr: 'Anomalie', en: 'Anomaly' }, color: '#ffda80', weight: 3 }
});
export const denseKindLabels = Object.freeze({
  hero: { fr: 'PERSONNAGE', en: 'CHARACTER' },
  equipment: { fr: 'ÉQUIPEMENT', en: 'EQUIPMENT' },
  event: { fr: 'PROTOCOLE', en: 'PROTOCOL' }
});
export const denseKindOrder = Object.freeze(['hero', 'equipment', 'event']);
export const denseCandidates = Object.freeze(Array.from({ length: 53 }, (_, index) => Object.freeze({
  id: `qa-dossier-${index + 1}`, rewardId: `qa-reward-${index + 1}`,
  universe: denseBanner.universe, kind: denseKindOrder[index % 3],
  name: index === 52
    ? { fr: 'Éclaireuse des bibliothèques de la Cité-Mosaïque et des archives des expéditions lointaines', en: 'Pathfinder of the Mosaic City libraries and the archives of distant expeditions' }
    : { fr: `Archive de contrôle ${index + 1}`, en: `Verification archive ${index + 1}` },
  desc: { fr: `Description complète de l’archive ${index + 1}. Le dossier garde tous les détails nécessaires à sa consultation.`, en: `Full description of archive ${index + 1}. The dossier keeps every detail needed to inspect it.` },
  rarity: Object.values(denseRarities)[index % 4], dropWeight: 1
})));
export const denseOwned = reward => Number(reward.id.split('-').at(-1)) <= 17;
export const denseDetail = (reward, lang) => reward.desc[lang];
