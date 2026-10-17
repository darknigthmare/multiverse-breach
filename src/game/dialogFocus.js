/** Keep keyboard focus inside an open modal, including disclosed source links. */
export function getDialogControls(root) {
  if (!root) return [];
  return [...root.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], summary, [tabindex]')]
    .filter(element => element.tabIndex >= 0 && !element.closest('[inert], [hidden]')
      && element.getClientRects().length > 0
      && getComputedStyle(element).visibility !== 'hidden');
}

export function trapDialogTab(event, root) {
  if (event.key !== 'Tab' || !root) return;
  const controls = getDialogControls(root);
  const first = controls[0], last = controls.at(-1);
  const active = root.ownerDocument.activeElement;
  if (!first) { event.preventDefault(); root.focus(); return; }
  if (event.shiftKey && (active === first || !controls.includes(active))) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && (active === last || !controls.includes(active))) {
    event.preventDefault(); first.focus();
  }
}
