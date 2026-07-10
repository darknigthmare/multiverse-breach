import React, { useState } from 'react';

export default function AuthPanel({
  lang,
  account,
  cloudStatus,
  onSignIn,
  onSignUp,
  onSignOut,
  onLoadCloud,
  onSaveCloud,
  onToggleLanguage,
  onExportSave,
  onImportSave,
  onResetSave,
  variant = 'floating'
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const embedded = variant === 'embedded';
  const panelOpen = embedded || open;

  const t = {
    account: lang === 'fr' ? 'SIGNATURE' : 'SIGNATURE',
    connected: lang === 'fr' ? 'ANCREE' : 'ANCHORED',
    guest: lang === 'fr' ? 'LOCALE' : 'LOCAL',
    email: 'Email',
    password: lang === 'fr' ? 'Mot de passe' : 'Password',
    signIn: lang === 'fr' ? 'Ancrer' : 'Anchor',
    signUp: lang === 'fr' ? 'Creer la signature' : 'Create signature',
    signOut: lang === 'fr' ? 'Detacher' : 'Detach',
    load: lang === 'fr' ? 'Lire le cloud' : 'Read cloud',
    save: lang === 'fr' ? 'Graver le cloud' : 'Engrave cloud'
  };

  const run = async (fn) => {
    if (!fn) return;
    setBusy(true);
    setError('');
    try {
      await fn(email.trim(), password);
      setPassword('');
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setBusy(false);
    }
  };

  const canSubmit = Boolean(email.trim()) && password.length >= 6 && !busy;

  return (
    <section className={`auth-panel-shell ${embedded ? 'auth-panel-embedded' : 'auth-panel-floating'} ${panelOpen ? 'is-open' : ''}`}>
      {embedded ? (
        <header className="auth-panel-heading">
          <span>A.R.C.A.</span>
          <strong>{lang === 'fr' ? 'SIGNATURE CLOUD' : 'CLOUD SIGNATURE'}</strong>
        </header>
      ) : (
        <div className="auth-panel-toolbar">
          <button
            type="button"
            onClick={() => setOpen(prev => !prev)}
            className="btn-retro auth-panel-toggle"
            aria-expanded={panelOpen}
            title={lang === 'fr' ? 'Ouvre le compte, la synchronisation et les outils de sauvegarde.' : 'Open account, synchronization, and save tools.'}
          >
            {t.account}: {account ? t.connected : t.guest}
          </button>
          {onToggleLanguage && (
            <button
              type="button"
              onClick={onToggleLanguage}
              className="btn-retro auth-language-toggle"
              title={lang === 'fr' ? 'Passe toute l interface en anglais.' : 'Switch the whole interface to French.'}
            >
              {lang.toUpperCase()}
            </button>
          )}
        </div>
      )}

      {panelOpen && (
        <div className="glass-panel auth-panel-content">
          {account ? (
            <>
              <div className="auth-account-id">{account.user?.email || account.user?.id}</div>
              <div className="auth-cloud-status" role="status" aria-live="polite">{cloudStatus}</div>
              <div className="auth-action-grid">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => run(onLoadCloud)}
                  className="btn-retro"
                  title={lang === 'fr' ? 'Remplace la progression locale par la sauvegarde Supabase.' : 'Replace local progress with the Supabase save.'}
                >
                  {t.load}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => run(onSaveCloud)}
                  className="btn-retro"
                  title={lang === 'fr' ? 'Envoie la progression locale actuelle vers Supabase.' : 'Upload current local progress to Supabase.'}
                >
                  {t.save}
                </button>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() => run(onSignOut)}
                className="btn-retro auth-signout-button"
                title={lang === 'fr' ? 'Deconnecte ce compte sur cet appareil sans effacer la trace locale.' : 'Sign this account out on this device without deleting the local trace.'}
              >
                {t.signOut}
              </button>
            </>
          ) : (
            <>
              <label className="auth-field">
                <span>{t.email}</span>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="ancre@exemple.fr"
                  type="email"
                  autoComplete="email"
                />
              </label>
              <label className="auth-field">
                <span>{t.password}</span>
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={lang === 'fr' ? '6 caracteres minimum' : '6 characters minimum'}
                  type="password"
                  autoComplete="current-password"
                />
              </label>
              <div className="auth-action-grid">
                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={() => run(onSignIn)}
                  className="btn-retro"
                  title={lang === 'fr' ? 'Connecte un compte existant puis charge sa progression.' : 'Sign into an existing account, then load its progress.'}
                >
                  {t.signIn}
                </button>
                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={() => run(onSignUp)}
                  className="btn-retro auth-signup-button"
                  title={lang === 'fr' ? 'Cree un compte Supabase et lance le prologue pour cette nouvelle Ancre.' : 'Create a Supabase account and start the prologue for this new Anchor.'}
                >
                  {t.signUp}
                </button>
              </div>
              <div className="auth-cloud-status" role="status" aria-live="polite">{cloudStatus}</div>
            </>
          )}

          {!embedded && (onExportSave || onImportSave || onResetSave) && (
            <details className="auth-save-tools">
              <summary>{lang === 'fr' ? 'OUTILS DE TRACE LOCALE' : 'LOCAL TRACE TOOLS'}</summary>
              <div className="auth-save-grid">
                <button
                  type="button"
                  onClick={onExportSave}
                  className="btn-retro"
                  title={lang === 'fr' ? 'Copie la sauvegarde locale complete dans le presse-papiers.' : 'Copy the complete local save to the clipboard.'}
                >
                  {lang === 'fr' ? 'EXPORTER' : 'EXPORT'}
                </button>
                <button
                  type="button"
                  onClick={onImportSave}
                  className="btn-retro"
                  title={lang === 'fr' ? 'Colle une sauvegarde exportee et remplace la progression locale.' : 'Paste an exported save and replace local progress.'}
                >
                  {lang === 'fr' ? 'IMPORTER' : 'IMPORT'}
                </button>
                <button
                  type="button"
                  onClick={onResetSave}
                  className="btn-retro auth-reset-button"
                  title={lang === 'fr' ? 'Efface la progression locale apres confirmation.' : 'Delete local progress after confirmation.'}
                >
                  {lang === 'fr' ? 'PURGER' : 'PURGE'}
                </button>
              </div>
            </details>
          )}

          {error && <div className="auth-error" role="alert">{error}</div>}
        </div>
      )}
    </section>
  );
}
