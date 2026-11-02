import { getSpriteSheetLayout } from '../../game/spriteAssets.js';

/** Select one existing pose; retain the original sheet for the provenance viewer. */
export function getCardArtPresentation(art = {}) {
  const src = art.thumbnail || art.image || art.sheet || null;
  if (!src) return { src: null, sheet: null, style: null };
  const isSheet = !art.thumbnail && (Boolean(art.sheet) || art.source === 'project-sprite');
  if (!isSheet) return { src, sheet: null, style: null };
  const layout = art.columns && art.rows ? art : getSpriteSheetLayout(src);
  const columns = Math.max(1, Number(layout.columns) || 1);
  const rows = Math.max(1, Number(layout.rows) || 1);
  const row = Math.max(0, Math.min(rows - 1, Number(art.row ?? layout.rowByState?.idle) || 0));
  const col = Math.max(0, Math.min(columns - 1, Number(art.column) || 0));
  if (columns === 1 && rows === 1) return { src, sheet: null, style: null };
  return {
    src, sheet: src,
    style: {
      backgroundImage: `url("${src}")`,
      backgroundSize: `${columns * 100}% ${rows * 100}%`,
      backgroundPosition: `${columns > 1 ? col / (columns - 1) * 100 : 0}% ${rows > 1 ? row / (rows - 1) * 100 : 0}%`
    }
  };
}
