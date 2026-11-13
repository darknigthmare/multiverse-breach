import React, { useId, useMemo, useState } from 'react';
import { ANCHOR_STYLE_SLOTS, equipAnchorUnlock } from '../game/anchorCustomization';
import { getUnlockableById } from '../game/universeUnlockables';
import { getUniverseCosmeticVisuals } from '../game/cosmeticVisualAssets';
import './AnchorCustomizationPanel.css';

const localize = (value, lang) => typeof value === 'string' ? value : value?.[lang] || value?.fr || value?.en || '';
const searchText = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function AnchorCustomizationPanel({ lang, portalCollection = {}, setPortalCollection }) {
  const id = useId();
  const french = lang === 'fr';
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
    const helpId = `${id}-${slot.kind}-help`;
    return <div key={slot.kind} className={`anchor-customization-slot ${active ? 'is-equipped' : ''}`}>
      <div className="anchor-customization-slot-heading"><label htmlFor={`${id}-${slot.kind}`}>{localize(slot.label, lang)}</label><span>{slot.options.length} {french ? 'possédé(s)' : 'owned'}</span></div>
      <select id={`${id}-${slot.kind}`} value={activeId} onChange={event => equip(slot.kind, event.target.value)} disabled={slot.options.length === 0} aria-describedby={helpId}>
        <option value="">{french ? 'Standard / aucun' : 'Default / none'}</option>
        {options.map(option => <option key={option.id} value={option.id}>{localize(option.name, lang)} · {option.universe}</option>)}
      </select>
      <p id={helpId} className="anchor-customization-slot-help">{active ? localize(active.desc, lang) : slot.options.length === 0 ? (french ? 'Aucune récompense possédée pour cet emplacement.' : 'No owned reward for this slot yet.') : (french ? 'Choisis une récompense pour l’équiper sur ton Ancre.' : 'Choose a reward to equip it on your Anchor.')}</p>
      {active && <span className="anchor-customization-equipped">{french ? 'Équipé' : 'Equipped'} · {active.universe}</span>}
      {query && options.every(option => option.id === activeId) && slot.options.some(option => option.id !== activeId) && <p className="anchor-customization-slot-help">{french ? 'Aucun autre résultat. Le choix équipé reste visible.' : 'No other matches. Your equipped choice stays visible.'}</p>}
    </div>;
  };
  const hudThemes = portalCollection.hudThemes || [];
  const activeHud = hudThemes.find(theme => theme.id === portalCollection.activeHudTheme);
  const hudArt = activeHud ? getUniverseCosmeticVisuals(activeHud.universe)?.hudTheme?.image || activeHud.frame : null;
  const visualSlots = slots.filter(slot => slot.kind !== 'npcAssist');
  const visualRewardCount = hudThemes.length + visualSlots.reduce((total, slot) => total + slot.options.length, 0);
  const equippedVisualCount = Number(Boolean(activeHud)) + visualSlots.filter(slot => slot.options.some(option => option.id === portalCollection.customLoadout?.[slot.kind])).length;
  return <section className="anchor-customization" aria-labelledby={`${id}-title`}>
    <header className="anchor-customization-header"><div><span className="anchor-customization-kicker">{french ? 'Atelier de signature' : 'Signature workshop'}</span><h4 id={`${id}-title`}>{french ? 'Personnalisation de l’Ancre' : 'Anchor customization'}</h4><p>{french ? 'Bannière, titre, HUD et effets visuels. Les apparences de héros restent dans leur fiche, les karts dans le garage.' : 'Banner, title, HUD and visual effects. Hero appearances remain in hero records; karts remain in the garage.'}</p></div><dl className="anchor-customization-summary"><div><dt>{french ? 'Récompenses visuelles' : 'Visual rewards'}</dt><dd>{visualRewardCount}</dd></div><div><dt>{french ? 'Emplacements équipés' : 'Equipped slots'}</dt><dd>{equippedVisualCount}/{visualSlots.length + 1}</dd></div></dl></header>
    <div className="anchor-customization-search"><label htmlFor={`${id}-search`}>{french ? 'Rechercher un nom ou un univers' : 'Search by name or universe'}</label><input id={`${id}-search`} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={french ? 'Nom d’une récompense, univers…' : 'Reward name, universe…'} aria-describedby={`${id}-search-help`} /><p id={`${id}-search-help`}>{french ? 'La recherche filtre les choix possédés et conserve toujours le choix équipé.' : 'Search filters owned choices and always keeps your equipped choice visible.'}</p></div>
    <div className="anchor-customization-grid">
      <div className={`anchor-customization-slot anchor-customization-hud ${activeHud ? 'is-equipped' : ''}`}>
        <div className="anchor-customization-slot-heading"><label htmlFor={`${id}-hud`}>HUD</label><span>{hudThemes.length} {french ? 'possédé(s)' : 'owned'}</span></div>
        <select id={`${id}-hud`} value={portalCollection.activeHudTheme || ''} onChange={event => equip('hud', event.target.value)} aria-describedby={`${id}-hud-help`}>
          <option value="">Nexus</option>
          {hudThemes.filter(theme => theme.id === portalCollection.activeHudTheme || searchText(theme.universe).includes(needle)).map(theme => <option key={theme.id} value={theme.id}>{theme.universe}</option>)}
        </select>
        {hudArt ? <img src={hudArt} alt={activeHud.universe} loading="lazy" /> : <div className="anchor-customization-hud-default" aria-hidden="true"><span>N</span><strong>NEXUS</strong><i /></div>}
        <p id={`${id}-hud-help`} className="anchor-customization-slot-help">{activeHud ? activeHud.universe : (french ? 'Interface Nexus standard.' : 'Standard Nexus interface.')}</p>
      </div>
      {visualSlots.map(renderSlot)}
    </div>
    <section className="anchor-customization-support" aria-labelledby={`${id}-support-title`}><div><span className="anchor-customization-kicker">{french ? 'Effet de gameplay' : 'Gameplay effect'}</span><h4 id={`${id}-support-title`}>{french ? 'Soutien de combat' : 'Combat support'}</h4><p>{french ? 'Ce soutien intervient dans les combats personnalisés. Le super de terrain se choisit dans la préparation de ces combats.' : 'This support acts in custom battles. Choose the field super in custom battle setup.'}</p></div>{slots.filter(slot => slot.kind === 'npcAssist').map(renderSlot)}</section>
  </section>;
}
