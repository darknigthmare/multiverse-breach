import React from 'react';
import './HubCommandDeck.css';

const text = (value, lang) => typeof value === 'string' ? value : value?.[lang] || value?.fr || value?.en || '';

export function HeroRosterList({ lang, heroes, selectedId, activeIds, levels, getPlaque, onSelect }) {
  const french = lang === 'fr';
  return <div className="hub-command-roster-list" aria-label={french ? 'Choisir une signature' : 'Choose a signature'}>
    {heroes.map(hero => {
      const selected = hero.id === selectedId;
      const active = activeIds.includes(hero.id);
      const plaque = getPlaque(hero);
      return <button type="button" key={hero.id} className={`hub-command-roster-entry ${selected ? 'is-selected' : ''}`} aria-pressed={selected} onClick={() => onSelect(hero.id)} style={{ '--signature-color': hero.primaryColor }}>
        <span className="hub-command-roster-identity">
          <span className="hub-command-kicker">{plaque.clearance} · {hero.universe}</span>
          <strong>{hero.name}</strong>
          <span>{text(plaque.role, lang)}</span>
        </span>
        <span className="hub-command-roster-state">
          <span>{french ? 'Niv.' : 'Lv.'} {levels[hero.id] || 1}</span>
          <span className={active ? 'is-active' : ''}>{active ? (french ? 'Déployé' : 'Deployed') : (french ? 'Réserve' : 'Reserve')}</span>
          {selected && <span className="hub-command-selected-mark">{french ? 'Sélectionné' : 'Selected'}</span>}
        </span>
      </button>;
    })}
  </div>;
}

export function HeroTrainingControls({ lang, heroName, gold, fragments, cost, goldLabel, fragmentLabel, onGold, onFragments }) {
  const french = lang === 'fr';
  return <section className="hub-command-training" aria-label={french ? `Progression de ${heroName}` : `${heroName} progression`}>
    <div className="hub-command-section-heading"><strong>{french ? 'Améliorer la signature' : 'Upgrade signature'}</strong><span>+1 {french ? 'niveau' : 'level'}</span></div>
    <div className="hub-command-training-options">
      <button type="button" className="hub-command-action" disabled={gold < cost} onClick={onGold}>
        <span>{goldLabel}</span><strong>{cost} {french ? 'or' : 'gold'}</strong>
      </button>
      <button type="button" className="hub-command-action is-fragment" disabled={fragments < 20} onClick={onFragments}>
        <span>{fragmentLabel}</span><strong>20 {french ? 'fragments' : 'shards'}</strong>
      </button>
    </div>
    <p className="hub-command-note">{french ? `Disponible : ${gold} or · ${fragments} fragments. Chaque action dépense le coût indiqué.` : `Available: ${gold} gold · ${fragments} shards. Each action spends the displayed cost.`}</p>
  </section>;
}

function HeroPortrait({ hero, reserve, drawSprite }) {
  const width = reserve ? 76 : 112;
  const height = reserve ? 82 : 118;
  return <div className={reserve ? 'squad-reserve-frame' : 'squad-hero-frame'}>
    <canvas width={width} height={height} aria-hidden="true" ref={element => {
      if (!element) return;
      const context = element.getContext('2d');
      if (!context) return;
      context.clearRect(0, 0, width, height);
      drawSprite(context, reserve ? 38 : 56, reserve ? 70 : 98, hero, 0, 1, reserve ? 62 : 88, 'hud');
    }} />
  </div>;
}

function HeroActions({ lang, hero, onOpen }) {
  return <div className="squad-slot-actions hub-command-hero-actions">
    <button type="button" className="btn-retro" onClick={() => onOpen(hero.id, 'roster')} aria-label={lang === 'fr' ? `Résonance de ${hero.name}` : `${hero.name} resonance`}>{lang === 'fr' ? 'Résonance' : 'Resonance'}</button>
    <button type="button" className="btn-retro" onClick={() => onOpen(hero.id, 'inventory')} aria-label={lang === 'fr' ? `Équipement de ${hero.name}` : `${hero.name} equipment`}>{lang === 'fr' ? 'Équipement' : 'Gear'}</button>
  </div>;
}

export function SquadMemberCard({ lang, slot, hero, stats, gear, eventItem, categoryLabel, memberCount, onToggle, onOpen, drawSprite }) {
  const french = lang === 'fr';
  if (!hero) return <article className="squad-slot empty hub-command-member-card" style={{ '--slot-color': '#647d89' }}>
    <span className="hub-command-kicker">{french ? 'Emplacement' : 'Slot'} {slot + 1}</span>
    <strong>{french ? 'Signature libre' : 'Open signature'}</strong>
    <p>{french ? 'Déploie un héros depuis la réserve ci-dessous.' : 'Deploy a hero from the reserve below.'}</p>
  </article>;
  return <article className="squad-slot filled hub-command-member-card" style={{ '--slot-color': hero.primaryColor }} aria-label={french ? `${hero.name}, équipe active, emplacement ${slot + 1}` : `${hero.name}, active team, slot ${slot + 1}`}>
    <div className="squad-slot-top"><span>{french ? 'Emplacement' : 'Slot'} {slot + 1} · {french ? 'Actif' : 'Active'}</span>
      <button type="button" className="hub-command-bench" onClick={() => onToggle(hero.id)} disabled={memberCount <= 1} aria-label={french ? `Retirer ${hero.name} de l’équipe` : `Bench ${hero.name}`} title={memberCount <= 1 ? (french ? 'Au moins un héros doit rester actif.' : 'At least one hero must remain active.') : undefined}>{french ? 'Retirer' : 'Bench'}</button>
    </div>
    <div className="squad-hero-row"><HeroPortrait hero={hero} drawSprite={drawSprite} /><div className="squad-hero-info"><strong>{hero.name}</strong><small>{hero.universe}</small><em>{categoryLabel}</em></div></div>
    <div className="squad-mini-stats"><span>HP {stats.hp}</span><span>ATK {stats.atk}</span><span>DEF {stats.def}</span><span>SPD {stats.spd}</span></div>
    <dl className="hub-command-loadout"><div><dt>{french ? 'Relique' : 'Relic'}</dt><dd>{gear ? text(gear.name, lang) : (french ? 'Non équipée' : 'Not equipped')}</dd></div><div><dt>{french ? 'Objet de scène' : 'Scene item'}</dt><dd>{eventItem ? text(eventItem.name, lang) : (french ? 'Non équipé' : 'Not equipped')}</dd></div></dl>
    <HeroActions lang={lang} hero={hero} onOpen={onOpen} />
  </article>;
}

export function SquadReserveCard({ lang, hero, stats, gear, categoryLabel, level, active, memberCount, wouldPair, onToggle, onOpen, drawSprite }) {
  const french = lang === 'fr';
  const lastMember = active && memberCount <= 1;
  const full = !active && memberCount >= 3;
  return <article className={`squad-reserve-card hub-command-reserve-card ${active ? 'active' : ''}`} style={{ '--slot-color': hero.primaryColor }}>
    <div className="squad-reserve-head"><strong>{hero.name}</strong><span>{active ? (french ? 'Déployé' : 'Deployed') : (french ? 'En réserve' : 'Reserve')}</span></div>
    <div className="squad-reserve-body"><HeroPortrait hero={hero} reserve drawSprite={drawSprite} /><div><small>{hero.universe}</small><em>{categoryLabel}</em></div></div>
    <div className="squad-reserve-stats"><span>HP {stats.hp}</span><span>ATK {stats.atk}</span><span>DEF {stats.def}</span><span>SPD {stats.spd}</span></div>
    <div className="squad-reserve-tags"><span>{french ? 'Niv.' : 'Lv.'} {level}</span><span>{gear ? text(gear.name, lang) : (french ? 'Sans relique' : 'No relic')}</span>{wouldPair && <span>{french ? 'Résonance possible' : 'Potential resonance'}</span>}</div>
    <button type="button" className={`hub-command-action hub-command-deploy ${active ? 'is-deployed' : ''}`} aria-pressed={active} disabled={lastMember || full} onClick={() => onToggle(hero.id)} aria-label={french ? `${active ? 'Retirer' : 'Déployer'} ${hero.name}` : `${active ? 'Bench' : 'Deploy'} ${hero.name}`}>{active ? (french ? 'Retirer de l’équipe' : 'Bench hero') : (french ? 'Déployer dans l’équipe' : 'Deploy hero')}</button>
    {(full || lastMember) && <p className="hub-command-note">{lastMember ? (french ? 'Au moins un héros doit rester actif.' : 'At least one hero must remain active.') : (french ? 'Équipe complète : retire un héros pour libérer une place.' : 'Team full: bench a hero to open a slot.')}</p>}
    <HeroActions lang={lang} hero={hero} onOpen={onOpen} />
  </article>;
}

export function AnchorIdentityPanel({ lang, name, profile, title, titleImage, titleColor, collection }) {
  const french = lang === 'fr';
  const metrics = [[french ? 'Héros stabilisés' : 'Stabilized heroes', `${collection.heroes}/${collection.totalHeroes}`], [french ? 'Mondes' : 'Worlds', collection.worlds], ['Arcs', collection.arcs], [french ? 'Apparences' : 'Appearances', collection.skins]];
  return <div className="hub-command-identity-grid">
    <section className="hub-command-identity-card"><div className="hub-command-kicker">{french ? 'Signature de commandement' : 'Commander signature'}</div><div className="hub-command-identity-name"><span className="hub-command-monogram" aria-hidden="true">{String(name || 'A').slice(0, 2).toUpperCase()}</span><div><h4>{name || (french ? 'Ancre' : 'Anchor')}</h4><p className={titleImage ? 'hub-command-title-art' : ''} style={titleImage ? { '--title-color': titleColor || '#39c5bb', backgroundImage: `linear-gradient(90deg, #04101e55, #04101e88), url(${titleImage})` } : undefined}>{title || 'Prime Anchor'}</p></div></div><span className={`hub-command-visibility ${profile?.visibility === 'public' ? 'is-public' : ''}`}>{profile?.visibility === 'public' ? (french ? 'Profil public' : 'Public profile') : (french ? 'Profil privé' : 'Private profile')}</span></section>
    <section className="hub-command-identity-card"><div className="hub-command-kicker">{french ? 'Code ami' : 'Friend code'}</div><p className="hub-command-share-code">{profile?.shareCode || (french ? 'Non généré' : 'Not generated')}</p><p className="hub-command-note">{french ? 'Le code est conservé dans ton dossier. Les contacts et le matchmaking seront disponibles ultérieurement.' : 'The code is saved in your record. Contacts and matchmaking will become available later.'}</p></section>
    <section className="hub-command-identity-card"><div className="hub-command-kicker">{french ? 'Registre de collection' : 'Collection record'}</div><dl className="hub-command-collection">{metrics.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
  </div>;
}
