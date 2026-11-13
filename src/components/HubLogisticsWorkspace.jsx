import React, { useId } from 'react';
import './HubLogisticsWorkspace.css';

const text = (lang, fr, en) => lang === 'fr' ? fr : en;

export function HubLogisticsHero({ hero, selected, lang, onSelect }) {
  return (
    <button type="button" className="hub-logistics-hero" aria-pressed={selected} onClick={onSelect}>
      <span className="hub-logistics-hero-heading">
        <strong>{hero.name}</strong>
        {selected && <span className="hub-logistics-state" data-state="equipped">{text(lang, 'Sélectionné', 'Selected')}</span>}
      </span>
      <span className="hub-logistics-meta">{hero.universe}</span>
    </button>
  );
}

export function HubEquipmentSlot({ kind, label, name, summary, lore, lang, onUnequip }) {
  const headingId = useId();
  return (
    <section className="hub-logistics-slot" data-kind={kind} data-filled={Boolean(name)} aria-labelledby={headingId}>
      <div className="hub-logistics-slot-heading">
        <h4 id={headingId}>{label}</h4>
        <span className="hub-logistics-state" data-state={name ? 'equipped' : 'empty'}>
          {name ? text(lang, 'Équipé', 'Equipped') : text(lang, 'Libre', 'Empty')}
        </span>
      </div>
      <strong className="hub-logistics-slot-name">{name || text(lang, 'Emplacement libre', 'Empty slot')}</strong>
      {name ? (
        <>
          {summary && <p className="hub-logistics-effect">{summary}</p>}
          {lore && <details className="hub-logistics-lore"><summary>{text(lang, 'Histoire de l’objet', 'Item lore')}</summary><p>{lore}</p></details>}
          <button type="button" className="hub-logistics-action" data-tone="remove" onClick={onUnequip}
            aria-label={text(lang, `Retirer ${name} de cet emplacement`, `Unequip ${name} from this slot`)}>
            {text(lang, 'Retirer', 'Unequip')}
          </button>
          <p className="hub-logistics-hint">{text(lang, 'L’objet reste dans votre inventaire.', 'The item stays in your inventory.')}</p>
        </>
      ) : <p className="hub-logistics-hint">{text(lang, 'Choisissez un objet compatible dans l’armurerie ci-dessous.', 'Choose a compatible item from the armory below.')}</p>}
    </section>
  );
}

export function HubLogisticsItem({ name, meta, effect, status, statusLabel, kind, children, action }) {
  const headingId = useId();
  return (
    <article className="hub-logistics-item" data-kind={kind} aria-labelledby={headingId}>
      <div className="hub-logistics-item-content">
        <div className="hub-logistics-item-heading">
          <h5 id={headingId}>{name}</h5>
          {statusLabel && <span className="hub-logistics-state" data-state={status}>{statusLabel}</span>}
        </div>
        {effect && <p className="hub-logistics-effect">{effect}</p>}
        {meta && <p className="hub-logistics-meta">{meta}</p>}
        {children}
      </div>
      {action && <div className="hub-logistics-item-action">{action}</div>}
    </article>
  );
}

export function HubRelicFusionCard({ name, copies, canAfford, balance, onFuse, lang, cost }) {
  const headingId = useId();
  const statusId = useId();
  const missing = Math.max(0, cost - balance);
  return (
    <article className="hub-logistics-fusion-card" aria-labelledby={headingId}>
      <div>
        <h5 id={headingId}>{name}</h5>
        <p className="hub-logistics-effect">{text(lang, `${copies} exemplaires disponibles`, `${copies} copies available`)}</p>
        <p className="hub-logistics-meta">{text(lang, `Résultat : ${name} + · bonus doublés`, `Result: ${name} + · doubled boosts`)}</p>
      </div>
      <div className="hub-logistics-fusion-action">
        <p id={statusId} className="hub-logistics-hint">
          {text(lang, `Consomme 3 exemplaires et ${cost} Or.`, `Consumes 3 copies and ${cost} Gold.`)}
          {!canAfford && <strong> {text(lang, `Il manque ${missing} Or.`, `${missing} more Gold needed.`)}</strong>}
        </p>
        <button type="button" className="hub-logistics-action" data-tone="fusion" onClick={onFuse} disabled={!canAfford}
          aria-describedby={statusId} aria-label={text(lang, `Fusionner ${name} pour ${cost} Or`, `Fuse ${name} for ${cost} Gold`)}>
          {text(lang, 'Fusionner', 'Fuse')} · {cost} {text(lang, 'Or', 'Gold')}
        </button>
      </div>
    </article>
  );
}

export function HubLogisticsEmpty({ title, children, actionLabel, onAction }) {
  return (
    <div className="hub-logistics-empty">
      <strong>{title}</strong>
      <p>{children}</p>
      {onAction && <button type="button" className="hub-logistics-action" onClick={onAction}>{actionLabel}</button>}
    </div>
  );
}

export function HubShopCard({ item, lang, owned, canBuy, balance, accent, universe, mediaType, summary, boost, backdropSrc, onBuy, visual }) {
  const headingId = useId();
  const priceId = useId();
  const statusId = useId();
  const name = item.name[lang] || item.name.en || item.name.fr;
  const missing = Math.max(0, item.tokenCost - balance);
  const status = owned ? text(lang, 'Déjà possédé', 'Already owned')
    : canBuy ? text(lang, 'Disponible à l’achat', 'Available to buy')
      : text(lang, `Il manque ${missing} jetons événement.`, `${missing} more Event Tokens needed.`);
  const mediaBackground = backdropSrc
    ? `linear-gradient(rgba(0,0,0,0.08), rgba(0,0,0,0.62)), url(${backdropSrc})`
    : `radial-gradient(circle at 50% 34%, ${accent}66, #060b13 76%)`;
  return (
    <article className="hub-logistics-shop-card" data-owned={owned} style={{ '--logistics-accent': accent }} aria-labelledby={headingId}>
      <div className="hub-logistics-shop-art" style={{ backgroundImage: mediaBackground }}>
        <span className="hub-logistics-shop-kind">{item.isCombatEvent ? text(lang, 'Événement de combat', 'Combat event') : text(lang, 'Relique', 'Relic')}</span>
        <div className="hub-logistics-shop-diamond">{visual}</div>
      </div>
      <div className="hub-logistics-shop-content">
        <p className="hub-logistics-shop-origin">{universe || text(lang, 'Prototype Nexus', 'Nexus prototype')}{mediaType && <span> · {mediaType}</span>}</p>
        <h4 id={headingId}>{name}</h4>
        <p className="hub-logistics-effect">{boost}</p>
        <div className="hub-logistics-shop-purchase">
          <p id={priceId} className="hub-logistics-price"><strong>{item.tokenCost}</strong> {text(lang, 'jetons événement', 'Event Tokens')}</p>
          <p id={statusId} className="hub-logistics-shop-status" data-state={owned ? 'equipped' : canBuy ? 'available' : 'blocked'}>{status}</p>
          <button type="button" className="hub-logistics-action" disabled={!canBuy} onClick={onBuy}
            aria-describedby={`${priceId} ${statusId}`} aria-label={owned ? text(lang, `${name} : déjà possédé`, `${name}: already owned`)
              : text(lang, `Acheter ${name} pour ${item.tokenCost} jetons événement`, `Buy ${name} for ${item.tokenCost} Event Tokens`)}>
            {owned ? text(lang, 'Dans l’inventaire', 'In inventory') : canBuy ? text(lang, 'Acheter', 'Buy') : text(lang, 'Jetons insuffisants', 'Not enough tokens')}
          </button>
        </div>
        <details className="hub-logistics-lore">
          <summary>{text(lang, 'Histoire et origine', 'Lore and origin')}</summary>
          <p>{summary}</p>
        </details>
      </div>
    </article>
  );
}
