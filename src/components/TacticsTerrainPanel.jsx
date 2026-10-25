import React from 'react';

const panelStyle = {
  display: 'grid', gap: 10, padding: 12, marginBottom: 10,
  border: '1px solid #497f91', borderRadius: 6,
  background: 'rgba(7, 22, 31, 0.96)', color: '#e4f5f7',
  fontSize: 12, lineHeight: 1.5, minWidth: 0
};
const controlStyle = {
  minHeight: 40, padding: '7px 10px', color: '#e4f5f7',
  border: '1px solid #547a85', borderRadius: 4,
  background: '#102e3a', font: 'inherit', maxWidth: '100%'
};
const coordinate = surface => {
  if (!surface) return '—';
  const x = surface.x ?? surface.gridX;
  const y = surface.y ?? surface.gridY;
  return `${Number.isFinite(x) ? String.fromCharCode(65 + x) : '?'}${Number.isFinite(y) ? y + 1 : '?'} · Z ${surface.z ?? 0}`;
};
const MATERIAL_NAMES = {
  'nexus-floor': ['Dalles du Nexus', 'Nexus tiles'],
  'nexus-metal': ['Alliage du Nexus', 'Nexus alloy'],
  'ancient-stone': ['Pierre ancienne', 'Ancient stone'],
  'weathered-stone': ['Pierre érodée', 'Weathered stone'],
  'cyber-floor': ['Dalles techniques', 'Technical panels'],
  'cyber-grate': ['Caillebotis métallique', 'Metal grating'],
  'cyber-metal': ['Métal industriel', 'Industrial metal'],
  grass: ['Herbe', 'Grass'], earth: ['Terre', 'Earth'],
  wood: ['Bois', 'Wood'], water: ['Eau', 'Water'],
  stone: ['Pierre', 'Stone'], metal: ['Métal', 'Metal'],
  'nibel-rock': ['Roche de Nibel', 'Nibel rock'],
  'mako-metal': ['Métal du réacteur', 'Reactor metal'],
  'steppe-grass': ['Herbe de la steppe', 'Steppe grass'],
  'meadow-grass': ['Herbe de prairie', 'Meadow grass'],
  'pine-earth': ['Sol forestier', 'Forest soil'],
  'swamp-mud': ['Vase du marais', 'Marsh mud'],
  'shallow-water': ['Eau peu profonde', 'Shallow water'],
  snow: ['Neige', 'Snow'], 'alpine-rock': ['Roche alpine', 'Alpine rock'],
  'darkroot-moss': ['Mousse de Noiresouche', 'Darkroot moss'],
  'darkroot-stone': ['Pierre de Noiresouche', 'Darkroot stone'],
  basalt: ['Basalte', 'Basalt'], lava: ['Lave', 'Lava'],
  'prothean-concrete': ['Béton du site de fouilles', 'Excavation-site concrete'],
  'halo-grass': ['Herbe de Valhalla', 'Valhalla grass'],
  'forerunner-alloy': ['Alliage Forerunner', 'Forerunner alloy']
};
const materialLabel = (surface, lang) => surface?.materialLabel?.[lang]
  || MATERIAL_NAMES[surface?.materialId]?.[lang === 'fr' ? 0 : 1]
  || surface?.materialId || '—';
const ENGLISH_REASONS = {
  'Combat terminé': 'Battle complete',
  'Tour de l’adversaire': 'Opponent turn',
  'Combat en pause': 'Battle paused',
  'Déplacement en cours': 'Movement in progress',
  'Surface impraticable': 'Surface is not walkable',
  'Surface occupée': 'Surface occupied',
  'Hors budget ou aucun passage praticable': 'Beyond movement budget or no walkable route',
  'Hors portée ou ligne de vue obstruée': 'Out of range or line of sight blocked'
};

export default function TacticsTerrainPanel({
  terrain, lang = 'fr', disabled = false, zoom = 1,
  onLevelChange, onLevelCycle, onSurfaceSelect, onSurfaceCycle, onConfirm, onZoom, onResetCamera
}) {
  if (!terrain?.vertical) return null;
  const french = lang === 'fr';
  const levels = terrain.levels || [];
  const selected = terrain.selectedSurface;
  const stacked = terrain.stackedSurfaces || [];
  const selectedId = selected?.id || terrain.selectedSurfaceId || '';
  const material = materialLabel(selected, lang);
  const rawReason = selected?.reason || terrain.reason;
  const reasonText = typeof rawReason === 'string' ? rawReason : rawReason?.[lang] || '';
  const reason = french ? reasonText : ENGLISH_REASONS[reasonText] || reasonText;
  const moveCost = selected?.moveCost ?? selected?.cost;
  const blocked = selected?.walkable === false || selected?.reachable === false;
  const place = terrain.battlefieldInfo;
  const text = value => typeof value === 'string' ? value : value?.[lang] || value?.fr || value?.en || '';
  return (
    <section aria-label={french ? 'Hauteurs et cases du terrain' : 'Terrain heights and cells'} style={panelStyle} data-tactics-terrain-panel="true">
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <strong>{french ? 'TERRAIN · HAUTEURS' : 'TERRAIN · HEIGHTS'}</strong>
        <span style={{ color: '#b8d8df', fontSize: 11 }}>{french ? 'Flèches : case · Page préc./suiv. : coupe · [ / ] : étage · Entrée : confirmer' : 'Arrows: cell · Page Up/Down: cut · [ / ]: level · Enter: confirm'}</span>
      </div>
      {place && (
        <div data-tactics-location="true" style={{ display: 'grid', gap: 3, padding: '8px 10px', borderLeft: '3px solid #79bda8', background: 'rgba(25, 53, 58, 0.48)' }}>
          <strong style={{ color: '#f1f3d7' }}>{text(place.label) || text(place.location)}</strong>
          <span style={{ color: '#b7cfc7' }}>{[text(place.universe), text(place.work)].filter(Boolean).join(' · ')}</span>
          <span style={{ color: '#dfdbaf' }}>{text(place.objectiveText)}</span>
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'end', gap: 8 }}>
        <label style={{ display: 'grid', gap: 4, flex: '1 1 180px', minWidth: 0 }}>
          <span>{french ? 'Coupe du terrain' : 'Terrain cut'}</span>
          <select aria-label={french ? 'Coupe du terrain' : 'Terrain cut'} value={terrain.visibleLevel == null ? 'all' : String(terrain.visibleLevel)} disabled={disabled} onChange={event => onLevelChange?.(event.target.value === 'all' ? null : Number(event.target.value))} style={{ ...controlStyle, width: '100%' }}>
            <option value="all">{french ? 'Tous les niveaux' : 'All levels'}</option>
            {levels.map(level => <option value={level} key={level}>{french ? `Jusqu’à Z ${level}` : `Through Z ${level}`}</option>)}
          </select>
        </label>
        <button type="button" style={controlStyle} disabled={disabled || !levels.length} onClick={() => onLevelCycle?.(-1)} aria-label={french ? 'Abaisser la coupe du terrain' : 'Lower terrain cut'}>↓ {french ? 'Coupe' : 'Cut'}</button>
        <button type="button" style={controlStyle} disabled={disabled || !levels.length} onClick={() => onLevelCycle?.(1)} aria-label={french ? 'Relever la coupe du terrain' : 'Raise terrain cut'}>↑ {french ? 'Coupe' : 'Cut'}</button>
        <button type="button" style={controlStyle} disabled={disabled} onClick={() => onZoom?.(1 / 1.15)} aria-label={french ? 'Dézoomer le plateau' : 'Zoom board out'}>− Zoom</button>
        <button type="button" style={controlStyle} disabled={disabled} onClick={() => onZoom?.(1.15)} aria-label={french ? 'Zoomer le plateau' : 'Zoom board in'}>+ Zoom</button>
        <button type="button" style={controlStyle} disabled={disabled} onClick={() => onResetCamera?.()}>{french ? 'Recadrer' : 'Recenter'} · {Math.round(zoom * 100)} %</button>
      </div>
      <div aria-live="polite" aria-atomic="true" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', color: selected ? '#f1f9fb' : '#bbd0d5' }}>
        <span>{french ? 'Case' : 'Cell'} : <strong>{coordinate(selected)}</strong></span>
        {selected && <span>{french ? 'Matière' : 'Material'} : {material}</span>}
        {selected && Number.isFinite(moveCost) && <span>{french ? 'Coût' : 'Cost'} : {moveCost} AP</span>}
        {reason && <span role={blocked ? 'status' : undefined} style={{ width: '100%', color: blocked ? '#ffce94' : '#b9e5d5' }}>{reason}</span>}
        {!selected && <span>{french ? 'Cliquer une surface ou utiliser les commandes du plateau pour l’inspecter.' : 'Click a surface or use the board controls to inspect it.'}</span>}
      </div>
      {stacked.length > 1 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'end', gap: 8 }}>
          <label style={{ display: 'grid', gap: 4, flex: '1 1 180px', minWidth: 0 }}>
            <span>{french ? 'Surfaces à cette coordonnée' : 'Surfaces at this coordinate'}</span>
            <select aria-label={french ? 'Surfaces à cette coordonnée' : 'Surfaces at this coordinate'} value={selectedId} disabled={disabled} onChange={event => onSurfaceSelect?.(event.target.value)} style={{ ...controlStyle, width: '100%' }}>
              {stacked.map(surface => <option value={surface.id} key={surface.id}>{coordinate(surface)} · {materialLabel(surface, lang)}</option>)}
            </select>
          </label>
          <button type="button" style={controlStyle} disabled={disabled} onClick={() => onSurfaceCycle?.(-1)} aria-label={french ? 'Inspecter la surface inférieure' : 'Inspect lower surface'}>↓ {french ? 'Case' : 'Cell'}</button>
          <button type="button" style={controlStyle} disabled={disabled} onClick={() => onSurfaceCycle?.(1)} aria-label={french ? 'Inspecter la surface supérieure' : 'Inspect upper surface'}>↑ {french ? 'Case' : 'Cell'}</button>
        </div>
      )}
      {selected && (
        <button type="button" style={{ ...controlStyle, borderColor: '#79cbb1', background: '#174c43', justifySelf: 'start' }} disabled={disabled} onClick={() => onConfirm?.(selectedId)}>
          {french ? 'ALLER / CIBLER CETTE CASE' : 'MOVE / TARGET THIS CELL'} · {coordinate(selected)}
        </button>
      )}
      <span style={{ color: '#aac6ce', fontSize: 11 }}>{french ? 'La coupe change la vue. Les escaliers et rampes restent nécessaires pour changer de hauteur. Sélectionner une surface dans la liste ne consomme aucun AP.' : 'The cut changes the view. Stairs and ramps remain necessary to change height. Selecting a surface in the list costs no AP.'}</span>
    </section>
  );
}
