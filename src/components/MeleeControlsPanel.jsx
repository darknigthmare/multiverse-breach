import { useId, useMemo, useState } from 'react';
import {
  MELEE_REMAPPABLE_SLOTS,
  formatMeleeInputCode,
  normalizeMeleeInputMaps
} from '../game/melee/meleeInputMap';
import { CHARGED_ATTACK_DATA } from '../game/melee/meleeStateMachine';

const SLOT_LABELS = Object.freeze({
  moveLeft: { fr: 'GAUCHE', en: 'LEFT' },
  moveRight: { fr: 'DROITE', en: 'RIGHT' },
  moveUp: { fr: 'HAUT', en: 'UP' },
  moveDown: { fr: 'BAS', en: 'DOWN' },
  jump: { fr: 'SAUT', en: 'JUMP' },
  crouch: { fr: 'ACCROUPI', en: 'CROUCH' },
  attackLight: { fr: 'ATTAQUE LÉGÈRE', en: 'LIGHT ATTACK' },
  chargedAttack: { fr: 'ATTAQUE CHARGÉE', en: 'CHARGED ATTACK' },
  special: { fr: 'SPÉCIALE', en: 'SPECIAL' },
  shield: { fr: 'GARDE', en: 'GUARD' },
  taunt: { fr: 'PROVOCATION', en: 'TAUNT' },
  climb: { fr: 'GRIMPER', en: 'CLIMB' },
  drop: { fr: 'LÂCHER', en: 'DROP' },
  ledgeAttack: { fr: 'ATTAQUE AU BORD', en: 'LEDGE ATTACK' },
  pause: { fr: 'PAUSE', en: 'PAUSE' }
});

const TRIAL_SLOT_LABELS = Object.freeze({
  attackLight: { fr: 'ACTION RAPIDE', en: 'QUICK ACTION' },
  chargedAttack: { fr: 'ACTION CHARGÉE', en: 'CHARGED ACTION' },
  special: { fr: 'INTERAGIR', en: 'INTERACT' },
  shield: { fr: 'SE PROTÉGER', en: 'PROTECT' },
  taunt: { fr: 'SIGNALER', en: 'SIGNAL' },
  ledgeAttack: { fr: 'ACTION AU BORD', en: 'LEDGE ACTION' }
});

const STATE_LABELS = Object.freeze({
  idle: { fr: 'PRÊT', en: 'READY' },
  walk: { fr: 'MARCHE', en: 'WALK' },
  run: { fr: 'COURSE', en: 'RUN' },
  crouchIdle: { fr: 'ACCROUPI', en: 'CROUCHING' },
  jumpStart: { fr: 'SAUT', en: 'JUMP' },
  jumpRise: { fr: 'ASCENSION', en: 'RISING' },
  fall: { fr: 'CHUTE', en: 'FALLING' },
  chargeStart: { fr: 'AMORCE DE CHARGE', en: 'CHARGE START' },
  chargeLoop: { fr: 'CHARGE', en: 'CHARGING' },
  shieldHold: { fr: 'EN GARDE', en: 'GUARDING' },
  shieldBreak: { fr: 'GARDE BRISÉE', en: 'GUARD BROKEN' },
  ledgeCatch: { fr: 'PRISE DU BORD', en: 'LEDGE CATCH' },
  ledgeHang: { fr: 'SUSPENDU', en: 'LEDGE HANG' },
  hitStun: { fr: 'ÉTOURDI', en: 'STUNNED' },
  dead: { fr: 'HORS COMBAT', en: 'DOWN' }
});

const TOUCH_CONTROLS = Object.freeze([
  { id: 'moveLeft', glyph: '\u25c0' },
  { id: 'moveRight', glyph: '\u25b6' },
  { id: 'jump', glyph: '\u2191' },
  { id: 'crouch', glyph: '\u2193' },
  { id: 'attackLight', glyph: 'L' },
  { id: 'chargedAttack', glyph: 'C' },
  { id: 'shield', glyph: 'G' },
  { id: 'special', glyph: 'S' },
  { id: 'taunt', glyph: 'T' }
]);

const panelStyle = {
  color: '#dffcff',
  background: 'linear-gradient(180deg, rgba(5, 18, 24, 0.97), rgba(1, 7, 11, 0.96))',
  border: '1px solid rgba(57, 197, 187, 0.48)',
  borderRadius: 5,
  boxShadow: 'inset 0 0 24px rgba(57, 197, 187, 0.06), 0 8px 22px rgba(0, 0, 0, 0.3)',
  display: 'grid',
  gap: 9,
  maxWidth: 760,
  padding: 10,
  fontFamily: "'Share Tech Mono', 'Courier New', monospace",
  fontSize: 10,
  lineHeight: 1.25
};

const retroButtonStyle = {
  minHeight: 34,
  border: '1px solid rgba(57, 197, 187, 0.42)',
  borderRadius: 3,
  color: '#dffcff',
  background: 'rgba(5, 20, 26, 0.9)',
  font: "700 9px 'Share Tech Mono', 'Courier New', monospace",
  letterSpacing: '0.04em',
  cursor: 'pointer'
};

const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));

const bindingCodes = (sideMap, slot) => {
  const source = slot.polarity
    ? sideMap?.[slot.action]?.[slot.polarity]
    : sideMap?.[slot.action];
  return (Array.isArray(source) ? source : [source]).filter(Boolean);
};

const formatCode = (code, isFrench) => {
  const formatted = formatMeleeInputCode(code);
  if (isFrench) return formatted;
  return formatted
    .replace(/^FLECHE /, 'ARROW ')
    .replace('ESPACE', 'SPACE')
    .replace('SHIFT G', 'LEFT SHIFT')
    .replace('SHIFT D', 'RIGHT SHIFT');
};

const readableState = (actor, isFrench) => {
  if (!actor) return isFrench ? 'EN ATTENTE' : 'STANDBY';
  if (Number(actor.shieldBreakTimer) > 0) return STATE_LABELS.shieldBreak[isFrench ? 'fr' : 'en'];
  if (actor.guarding) return isFrench ? 'EN GARDE' : 'GUARDING';
  if (actor.charging) return isFrench ? 'CHARGE' : 'CHARGING';
  if (actor.ledge) return isFrench ? 'SUSPENDU' : 'LEDGE HANG';
  const state = String(actor.state || 'idle');
  const localized = STATE_LABELS[state]?.[isFrench ? 'fr' : 'en'];
  return localized || state.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase();
};

export default function MeleeControlsPanel({
  lang = 'fr',
  maps,
  localP2 = false,
  onRemap,
  onReset,
  runtimeActor,
  onTouchAction,
  trial = false
}) {
  const isFrench = lang === 'fr';
  const copy = isFrench
    ? {
        title: 'COMMANDES MÊLÉE / P4',
        guard: 'GARDE',
        state: 'ÉTAT',
        charge: 'CHARGE',
        reset: 'RÉINITIALISER',
        bindings: 'AFFECTATIONS',
        touch: 'COMMANDES TACTILES',
        press: 'APPUYEZ SUR UNE TOUCHE',
        cancelled: 'Remappage annule.',
        instructions: 'Sélectionnez une affectation pour changer sa touche.',
        resetDone: 'Réinitialisation des commandes demandée.',
        player: 'JOUEUR 1',
        player2: 'JOUEUR 2'
      }
    : {
        title: 'MELEE CONTROLS / P4',
        guard: 'GUARD',
        state: 'STATE',
        charge: 'CHARGE',
        reset: 'RESET',
        bindings: 'BINDINGS',
        touch: 'TOUCH CONTROLS',
        press: 'PRESS A KEY',
        cancelled: 'Remapping cancelled.',
        instructions: 'Select a binding to change its key.',
        resetDone: 'Control reset requested.',
        player: 'PLAYER 1',
        player2: 'PLAYER 2'
      };
  if (trial) {
    copy.title = isFrench ? 'COMMANDES ÉPREUVE' : 'TRIAL CONTROLS';
    copy.guard = isFrench ? 'PROTECTION' : 'PROTECTION';
    copy.instructions = isFrench
      ? 'Utilise l action adaptée à l objectif affiché, sans chercher un adversaire.'
      : 'Use the action required by the displayed objective; there is no opponent.';
  }
  const titleId = useId();
  const liveId = useId();
  const normalizedMaps = useMemo(() => normalizeMeleeInputMaps(maps), [maps]);
  const [capture, setCapture] = useState(null);
  const [announcement, setAnnouncement] = useState('');

  const guardMaximum = Math.max(1, Number(runtimeActor?.guardMeterMax) || 100);
  const guardValue = clamp(Number(runtimeActor?.guardMeter) || 0, 0, guardMaximum);
  const guardPercent = Math.round((guardValue / guardMaximum) * 100);
  const chargeSeconds = clamp(Number(runtimeActor?.chargeHoldSeconds) || 0, 0, CHARGED_ATTACK_DATA.maxHoldSeconds);
  const chargePercent = Math.round((chargeSeconds / CHARGED_ATTACK_DATA.maxHoldSeconds) * 100);

  const slotLabel = slot => (
    (trial ? TRIAL_SLOT_LABELS[slot.id] : null)?.[isFrench ? 'fr' : 'en']
    || SLOT_LABELS[slot.id]?.[isFrench ? 'fr' : 'en']
    || slot.id
  );
  const sideLabel = side => side === 'cpu' ? copy.player2 : copy.player;

  const beginCapture = (side, slot) => {
    if (capture?.side === side && capture?.slot === slot.id) {
      setCapture(null);
      setAnnouncement(copy.cancelled);
      return;
    }
    setCapture({ side, slot: slot.id });
    setAnnouncement(`${sideLabel(side)} / ${slotLabel(slot)}: ${copy.press}. Escape ${isFrench ? 'annule' : 'cancels'}.`);
  };

  const handleCaptureKey = event => {
    if (!capture) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.code === 'Escape') {
      setCapture(null);
      setAnnouncement(copy.cancelled);
      return;
    }
    if (!event.code || event.code === 'Unidentified') return;
    const targetSlot = MELEE_REMAPPABLE_SLOTS.find(slot => slot.id === capture.slot);
    const label = targetSlot ? slotLabel(targetSlot) : capture.slot;
    onRemap?.(capture.side, capture.slot, event.code);
    setCapture(null);
    setAnnouncement(`${sideLabel(capture.side)} / ${label}: ${formatCode(event.code, isFrench)}.`);
  };

  const resetBindings = () => {
    setCapture(null);
    setAnnouncement(copy.resetDone);
    onReset?.();
  };

  const emitTouch = (event, action, phase) => {
    event.preventDefault();
    if (phase === 'down') event.currentTarget.setPointerCapture?.(event.pointerId);
    if (phase === 'up' && event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    onTouchAction?.(action, phase);
  };

  const emitTouchFromKey = (event, action, phase) => {
    if (event.key !== ' ' && event.key !== 'Enter') return;
    if (phase === 'down' && event.repeat) return;
    event.preventDefault();
    onTouchAction?.(action, phase);
  };

  const renderBindings = (side, label) => (
    <fieldset
      style={{
        minWidth: 0,
        margin: 0,
        padding: '7px 8px 8px',
        border: '1px solid rgba(57, 197, 187, 0.22)',
        borderRadius: 4
      }}
    >
      <legend style={{ padding: '0 5px', color: side === 'cpu' ? '#ffbd69' : '#62f3e8', letterSpacing: '0.1em' }}>
        {label} / {copy.bindings}
      </legend>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 4 }}>
        {MELEE_REMAPPABLE_SLOTS.map(slot => {
          const active = capture?.side === side && capture?.slot === slot.id;
          const codes = bindingCodes(normalizedMaps[side], slot);
          const codeLabel = codes.map(code => formatCode(code, isFrench)).join(' / ') || '\u2014';
          const labelText = slotLabel(slot);
          return (
            <button
              key={`${side}-${slot.id}`}
              type="button"
              aria-pressed={active}
              aria-describedby={liveId}
              aria-label={`${label} / ${labelText}: ${active ? copy.press : codeLabel}`}
              onClick={() => beginCapture(side, slot)}
              style={{
                ...retroButtonStyle,
                minWidth: 0,
                minHeight: 31,
                padding: '4px 6px',
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) auto',
                alignItems: 'center',
                gap: 5,
                borderColor: active ? '#ffe66d' : 'rgba(57, 197, 187, 0.32)',
                color: active ? '#fff7b2' : '#dffcff',
                boxShadow: active ? 'inset 0 0 10px rgba(255, 230, 109, 0.16)' : 'none'
              }}
            >
              <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', whiteSpace: 'nowrap' }}>
                {labelText}
              </span>
              <kbd
                style={{
                  maxWidth: 96,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  padding: '2px 4px',
                  color: active ? '#ffe66d' : '#62f3e8',
                  background: 'rgba(0, 0, 0, 0.45)',
                  border: '1px solid currentColor',
                  borderRadius: 2,
                  font: 'inherit',
                  whiteSpace: 'nowrap'
                }}
              >
                {active ? '\u2026' : codeLabel}
              </kbd>
            </button>
          );
        })}
      </div>
    </fieldset>
  );

  return (
    <section
      aria-labelledby={titleId}
      onKeyDownCapture={handleCaptureKey}
      onBlur={event => {
        if (capture && !event.currentTarget.contains(event.relatedTarget)) {
          setCapture(null);
          setAnnouncement(copy.cancelled);
        }
      }}
      style={panelStyle}
    >
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <h2 id={titleId} style={{ margin: 0, color: '#62f3e8', fontSize: 12, letterSpacing: '0.12em' }}>
          {copy.title}
        </h2>
        <button type="button" onClick={resetBindings} style={{ ...retroButtonStyle, minHeight: 29, padding: '4px 8px', color: '#ffbd69', borderColor: 'rgba(255, 189, 105, 0.5)' }}>
          {copy.reset}
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 5 }}>
        <div style={{ padding: 6, border: '1px solid rgba(57, 197, 187, 0.18)', background: 'rgba(0, 0, 0, 0.22)' }}>
          <span style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: '#9db8bc' }}>
            <b>{copy.guard}</b><output>{guardPercent}%</output>
          </span>
          <progress aria-label={copy.guard} value={guardValue} max={guardMaximum} style={{ width: '100%', height: 8, accentColor: guardPercent < 25 ? '#ff6868' : '#62f3e8' }} />
        </div>
        <div style={{ padding: 6, border: '1px solid rgba(57, 197, 187, 0.18)', background: 'rgba(0, 0, 0, 0.22)' }}>
          <span style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: '#9db8bc' }}>
            <b>{copy.charge}</b><output>{chargePercent}%</output>
          </span>
          <progress aria-label={copy.charge} value={chargePercent} max={100} style={{ width: '100%', height: 8, accentColor: '#ffe66d' }} />
        </div>
        <div style={{ minWidth: 0, padding: 6, border: '1px solid rgba(57, 197, 187, 0.18)', background: 'rgba(0, 0, 0, 0.22)' }}>
          <span style={{ display: 'block', marginBottom: 4, color: '#9db8bc' }}><b>{copy.state}</b></span>
          <output style={{ display: 'block', overflow: 'hidden', color: '#ffe66d', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {readableState(runtimeActor, isFrench)}
          </output>
        </div>
      </div>

      <p id={liveId} role="status" aria-live="polite" aria-atomic="true" style={{ minHeight: 13, margin: 0, color: capture ? '#ffe66d' : '#8fa8ad' }}>
        {announcement || copy.instructions}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: localP2 ? 'repeat(auto-fit, minmax(270px, 1fr))' : '1fr', gap: 7 }}>
        {renderBindings('player', copy.player)}
        {localP2 && renderBindings('cpu', copy.player2)}
      </div>

      <fieldset style={{ margin: 0, padding: '7px 8px 8px', border: '1px solid rgba(57, 197, 187, 0.22)', borderRadius: 4 }}>
        <legend style={{ padding: '0 5px', color: '#62f3e8', letterSpacing: '0.1em' }}>{copy.touch}</legend>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 5 }}>
          {TOUCH_CONTROLS.map(control => {
            const label = (trial ? TRIAL_SLOT_LABELS[control.id] : null)?.[isFrench ? 'fr' : 'en']
              || SLOT_LABELS[control.id]?.[isFrench ? 'fr' : 'en']
              || control.id;
            return (
              <button
                key={control.id}
                type="button"
                aria-label={label}
                title={label}
                draggable={false}
                onPointerDown={event => emitTouch(event, control.id, 'down')}
                onPointerUp={event => emitTouch(event, control.id, 'up')}
                onPointerCancel={event => emitTouch(event, control.id, 'cancel')}
                onKeyDown={event => emitTouchFromKey(event, control.id, 'down')}
                onKeyUp={event => emitTouchFromKey(event, control.id, 'up')}
                style={{
                  ...retroButtonStyle,
                  minHeight: 42,
                  padding: '5px 6px',
                  display: 'grid',
                  placeItems: 'center',
                  gap: 2,
                  touchAction: 'none',
                  userSelect: 'none'
                }}
              >
                <b aria-hidden="true" style={{ color: '#62f3e8', fontSize: 14 }}>{control.glyph}</b>
                <small style={{ font: 'inherit', fontSize: 8 }}>{label}</small>
              </button>
            );
          })}
        </div>
      </fieldset>
    </section>
  );
}
