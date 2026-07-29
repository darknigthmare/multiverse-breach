const OPENAI_COSMETIC_ROOT = '/visuals/cosmetics/openai';

const makeImageAsset = (file, width = 1536, height = 1024) => Object.freeze({
  image: `${OPENAI_COSMETIC_ROOT}/${file}`,
  width,
  height,
  source: 'openai'
});

const makeAtlasAsset = (file, rowByStyle) => Object.freeze({
  sheet: `${OPENAI_COSMETIC_ROOT}/${file}`,
  width: 1024,
  height: 1024,
  columns: 4,
  rows: 4,
  frames: 4,
  rowByStyle: Object.freeze(rowByStyle),
  source: 'openai'
});

export const OPENAI_COSMETIC_VISUALS = Object.freeze({
  hudTheme: makeImageAsset('hud-theme-frame-v1.png'),
  profileTitle: makeImageAsset('profile-title-badge-v1.png'),
  profileBanner: makeImageAsset('profile-banner-frame-v1.png'),
  portalEffect: makeAtlasAsset('portal-effects-atlas-v1.png', {
    ring: 0,
    iris: 1,
    fracture: 2,
    gate: 3
  }),
  koEffect: makeAtlasAsset('ko-effects-atlas-v1.png', {
    shards: 0,
    scanline: 1,
    rift: 2,
    sigil: 3
  }),
  introPose: makeAtlasAsset('intro-poses-atlas-v1.png', {
    ready: 0,
    breach: 1,
    duel: 2,
    echo: 3
  }),
  victoryPose: makeAtlasAsset('victory-poses-atlas-v1.png', {
    ready: 0,
    breach: 1,
    duel: 2,
    echo: 3
  })
});

export const resolveActiveHudTheme = (portalCollection = {}) => {
  const activeId = portalCollection?.activeHudTheme;
  if (!activeId) return null;
  const themes = Array.isArray(portalCollection?.hudThemes)
    ? portalCollection.hudThemes
    : [];
  const activeTheme = themes.find(theme => theme?.id === activeId);
  if (!activeTheme) return null;
  return {
    ...activeTheme,
    frame: activeTheme.frame || OPENAI_COSMETIC_VISUALS.hudTheme.image,
    source: activeTheme.source || OPENAI_COSMETIC_VISUALS.hudTheme.source
  };
};

export const getOpenAiCosmeticAtlas = (kind, style) => {
  const asset = OPENAI_COSMETIC_VISUALS[kind];
  if (!asset?.sheet) return null;
  return {
    sheet: asset.sheet,
    width: asset.width,
    height: asset.height,
    columns: asset.columns,
    rows: asset.rows,
    frames: asset.frames,
    row: asset.rowByStyle?.[style] ?? 0,
    source: asset.source
  };
};

export const getCosmeticAtlasPreviewStyle = (atlas, frame = 2) => {
  if (!atlas?.sheet) return undefined;
  const columns = Math.max(1, Number(atlas.columns) || 1);
  const rows = Math.max(1, Number(atlas.rows) || 1);
  const safeFrame = Math.max(0, Math.min(columns - 1, Number(frame) || 0));
  const safeRow = Math.max(0, Math.min(rows - 1, Number(atlas.row) || 0));
  return {
    backgroundImage: `url(${atlas.sheet})`,
    backgroundPosition: `${columns > 1 ? (safeFrame / (columns - 1)) * 100 : 0}% ${rows > 1 ? (safeRow / (rows - 1)) * 100 : 0}%`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${columns * 100}% ${rows * 100}%`,
    imageRendering: 'pixelated'
  };
};
