import { useEffect, useId, useRef } from 'react';

/** A completed battle is a single, modal decision. Escape cannot turn a
 * completed result into a retreat, and focus cannot reach the live HUD. */
export default function CombatResultDialog({ children, label, className = '' }) {
  const ref = useRef(null);
  const labelId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog.open) dialog.showModal();
    dialog.querySelector('button')?.focus({ preventScroll: true });
    return () => { if (dialog.open) dialog.close(); };
  }, []);
  return <dialog ref={ref} className={`combat-result-dialog ${className}`}
    aria-labelledby={labelId} aria-modal="true"
    onCancel={event => event.preventDefault()}
    onKeyDown={event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); }
    }}>
    <div className="combat-result-content">
      <span id={labelId} className="combat-result-label">{label}</span>
      {children}
    </div>
  </dialog>;
}
