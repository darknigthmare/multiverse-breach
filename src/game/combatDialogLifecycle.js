/** Keep a native dialog's top-layer mode in sync without losing its invoker. */
export function createCombatDialogLifecycle(dialog) {
  let opener = null;
  let openedAsModal = null;
  const restoreFocus = () => {
    const target = opener;
    opener = null;
    if (target?.isConnected && !target.closest?.('[inert]')) {
      target.focus?.({ preventScroll: true });
    }
  };
  return {
    sync(open, modal = false) {
      if (!open) {
        if (dialog.open) dialog.close();
        openedAsModal = null;
        restoreFocus();
        return;
      }
      // showModal() cannot promote a dialog already opened using show().
      // Do not recapture focus when moving between live and paused panels.
      if (!dialog.open && openedAsModal === null) {
        opener = dialog.ownerDocument.activeElement;
      }
      if (dialog.open && openedAsModal !== modal) dialog.close();
      if (!dialog.open) {
        if (modal) dialog.showModal();
        else dialog.show();
        openedAsModal = modal;
        dialog.querySelector('[data-drawer-close]')?.focus({ preventScroll: true });
      }
    },
    dispose() {
      if (dialog.open) dialog.close();
      openedAsModal = null;
      restoreFocus();
    }
  };
}
