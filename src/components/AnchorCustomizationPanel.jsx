import React, { useMemo, useState } from 'react';
import { ANCHOR_STYLE_SLOTS, equipAnchorUnlock } from '../game/anchorCustomization';
import { getUnlockableById } from '../game/universeUnlockables';
import { getUniverseCosmeticVisuals } from '../game/cosmeticVisualAssets';

const localize = (value, lang) => typeof value === 'string' ? value : value?.[lang] || value?.fr || value?.en || '';
const searchText = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function AnchorCustomizationPanel({ lang, portalCollection = {}, setPortalCollection }) {
  const [query, setQuery] = useState('');
  const needle = searchText(query);
  const slots = useMemo(() => Object.entries({ ...ANCHOR_STYLE_SLOTS, npcAssist: { key: 'npcAssists', label: { fr: 'Soutien de combat', en: 'Combat support' } } }).map(([kind, slot]) => ({
    kind, ...slot, options: (portalCollection[slot.key] || []).map(id => getUnlockableById(kind, id)).filter(Boolean)
  })), [portalCollection]);
  const equip = (kind, id) => setPortalCollection(previous => equipAnchorUnlock(previous, kind, id));
  const renderSlot = slot => {
    const activeId = portalCollection.customLoadout?.[slot.kind] || '';
    const options = slot.options.filter(option => option.id === activeId || searchText(`${localize(option.name, lang)} ${option.universe}`).includes(needle));
    const active = slot.options.find(option => option.id === activeId);
    return <label key={slot.kind} style={{ display: 'grid', gap: 6 }}>
      <span>{localize(slot.label, lang)}</span>
      <select value={activeId} onChange={event => equip(slot.kind, event.target.value)} disabled={slot.options.length === 0} style={{ minHeight: 40, width: '100%', background: '#101b27', color: '#f0ffff' }}>
        <option value="">{lang === 'fr' ? 'Standard / aucun' : 'Default / none'}</option>
        {options.map(option => <option key={option.id} value={option.id}>{localize(option.name, lang)} · {option.universe}</option>)}
      </select>
      <small style={{ color: '#a4bdc5' }}>{active ? localize(active.desc, lang) : `${slot.options.length} ${lang === 'fr' ? 'choix possédés' : 'owned choices'}`}</small>
    </label>;
  };
  const hudThemes = portalCollection.hudThemes || [];
  const activeHud = hudThemes.find(theme => theme.id === portalCollection.activeHudTheme);
  const hudArt = activeHud ? getUniverseCosmeticVisuals(activeHud.universe)?.hudTheme?.image || activeHud.frame : null;
  return <section aria-labelledby="anchor-customization-title" style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid #39656b' }}>
    <h4 id="anchor-customization-title">{lang === 'fr' ? 'Personnalisation de l’Ancre' : 'Anchor customization'}</h4>
    <p>{lang === 'fr' ? 'Bannière, titre, HUD et effets visuels. Les apparences de héros restent dans leur fiche, les karts dans le garage.' : 'Banner, title, HUD and visual effects. Hero appearances remain in hero records; karts remain in the garage.'}</p>
    <label style={{ display: 'grid', gap: 6, marginBottom: 16 }}>{lang === 'fr' ? 'Rechercher un nom ou un univers' : 'Search by name or universe'}
      <input type="search" value={query} onChange={event => setQuery(event.target.value)} style={{ minHeight: 38 }} />
    </label>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 16 }}>
      <label style={{ display: 'grid', gap: 6 }}>
        <span>HUD</span>
        <select value={portalCollection.activeHudTheme || ''} onChange={event => equip('hud', event.target.value)} style={{ minHeight: 40, background: '#101b27', color: '#f0ffff' }}>
          <option value="">Nexus</option>
          {hudThemes.filter(theme => theme.id === portalCollection.activeHudTheme || searchText(theme.universe).includes(needle)).map(theme => <option key={theme.id} value={theme.id}>{theme.universe}</option>)}
        </select>
        {hudArt && <img src={hudArt} alt={activeHud.universe} loading="lazy" style={{ width: '100%', height: 92, objectFit: 'contain' }} />}
      </label>
      {slots.filter(slot => slot.kind !== 'npcAssist').map(renderSlot)}
    </div>
    <h4>{lang === 'fr' ? 'Soutien de combat — effet de gameplay' : 'Combat support — gameplay effect'}</h4>
    <p>{lang === 'fr' ? 'Ce soutien n’est pas un simple habillage : il intervient dans les combats personnalisés. Le super de terrain se choisit dans la préparation de ces combats.' : 'This support is not merely cosmetic: it acts in custom battles. Choose the field super in custom battle setup.'}</p>
    {slots.filter(slot => slot.kind === 'npcAssist').map(renderSlot)}
  </section>;
}
