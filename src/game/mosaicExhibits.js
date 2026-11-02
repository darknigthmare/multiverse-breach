/** Archive displays, not inventory grants or canonical 3D props. */
const localized = (v, lang) => typeof v === 'string' ? v : v?.[lang] || v?.fr || v?.en || '';
const searchKey = v => String(v || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
export function getMosaicExhibits(items = [], universe, { inventory = [], disabled = [], lang = 'fr' } = {}) {
  if (typeof universe !== 'string' || !universe) return [];
  const owned = new Set(inventory), hidden = new Set(disabled), seen = new Set();
  return items.filter(item => item?.id && item.universe === universe && !hidden.has(item.id)
    && !seen.has(item.id) && (seen.add(item.id), true)).map(item => ({
      id: item.id, universe, name: localized(item.name, lang) || item.id,
      description: localized(item.desc, lang), owned: owned.has(item.id) || owned.has(`${item.id}_plus`),
      source: item, presentation: 'ARCHIVE_DISPLAY_NOT_WORLD_ASSET'
    }));
}
export function getMosaicExhibitView(entries, { query = '', page = 0, size = 3 } = {}) {
  const count = Number.isFinite(size) ? Math.max(1, Math.min(9, Math.floor(size))) : 3;
  const q = searchKey(query).trim();
  const found = entries.filter(e => searchKey(`${e.id} ${e.name} ${e.description}`).includes(q));
  const pages = Math.max(1, Math.ceil(found.length / count));
  const current = Math.max(0, Math.min(pages - 1, Number.isFinite(page) ? Math.floor(page) : 0));
  return { items: found.slice(current * count, (current + 1) * count), page: current, pages, matching: found.length, total: entries.length };
}
export function getMosaicExhibitZones(district, exhibits, lang = 'fr') {
  if (!district?.universe) return [];
  return exhibits.slice(0, 3).map((entry, index) => ({
    id: `${district.id}::exhibit::${entry.id}`, universe: district.universe, action: 'exhibit', exhibitId: entry.id,
    label: entry.name, role: lang === 'fr' ? 'Vitrine d archive' : 'Archive display',
    x: 568 + index * 240, y: 618, w: 64, h: 64, color: '#d9b86b'
  }));
}
/** Distinct A.R.C.A. service silhouettes; footprint remains 44 x 10. */
export function drawMosaicService(ctx, zone, anchor) {
  const { x, y } = anchor;
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#101d2a'; ctx.strokeStyle = zone.color || '#39c5bb'; ctx.lineWidth = 2;
  ctx.fillRect(-22, -18, 44, 36); ctx.strokeRect(-22, -18, 44, 36);
  ctx.fillStyle = zone.color || '#39c5bb';
  if (zone.action === 'codex' || zone.action === 'journal' || zone.action === 'arcs') {
    ctx.strokeRect(-15, -11, 30, 22); ctx.beginPath(); ctx.moveTo(0, -11); ctx.lineTo(0, 11); ctx.stroke();
    for (let y = -6; y < 9; y += 6) { ctx.fillRect(-11, y, 7, 2); ctx.fillRect(4, y, 7, 2); }
  } else if (zone.action === 'mission') {
    ctx.beginPath(); ctx.moveTo(-13, 9); ctx.lineTo(0, -10); ctx.lineTo(13, 9); ctx.closePath(); ctx.stroke();
    ctx.fillRect(-1, -4, 2, 7); ctx.fillRect(-1, 6, 2, 2);
  } else if (zone.action === 'anchor' || zone.action === 'exhibit') {
    ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(12, 0); ctx.lineTo(0, 12); ctx.lineTo(-12, 0); ctx.closePath(); ctx.stroke();
    if (zone.action === 'exhibit') { ctx.fillRect(-22, 12, 44, 6); ctx.strokeRect(-18, -15, 36, 27); }
  } else if (zone.action === 'party') {
    for (const x of [-11, 0, 11]) { ctx.beginPath(); ctx.arc(x, -5, 4, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(x - 3, 2, 6, 9); }
  } else if (zone.action === 'inventory') {
    ctx.strokeRect(-14, -5, 28, 17); ctx.strokeRect(-6, -12, 12, 7); ctx.fillRect(-2, 0, 4, 7);
  } else { ctx.fillRect(-13, -2, 26, 4); ctx.fillRect(-2, -13, 4, 26); }
  ctx.restore();
}
