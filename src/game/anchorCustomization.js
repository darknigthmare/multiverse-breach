export const ANCHOR_STYLE_SLOTS = Object.freeze({
  profileBanner: { key: 'profileBanners', label: { fr: 'Bannière du Dossier', en: 'Record banner' } },
  profileTitle: { key: 'profileTitles', label: { fr: 'Titre', en: 'Title' } },
  portalEffect: { key: 'portalEffects', label: { fr: 'Effet de portail', en: 'Portal effect' } },
  koEffect: { key: 'koEffects', label: { fr: 'Effet de K.O.', en: 'K.O. effect' } },
  introPose: { key: 'introPoses', label: { fr: 'Entrée en combat', en: 'Combat entrance' } },
  victoryPose: { key: 'victoryPoses', label: { fr: 'Pose de victoire', en: 'Victory pose' } }
});

export function equipAnchorUnlock(collection, kind, id) {
  if (kind === 'hud') {
    if (id && !(collection.hudThemes || []).some(theme => theme.id === id)) return collection;
    return { ...collection, activeHudTheme: id || null };
  }
  const key = ANCHOR_STYLE_SLOTS[kind]?.key || (kind === 'npcAssist' ? 'npcAssists' : null);
  if (!key || (id && !(collection[key] || []).includes(id))) return collection;
  return { ...collection, customLoadout: { ...collection.customLoadout, [kind]: id || null } };
}
