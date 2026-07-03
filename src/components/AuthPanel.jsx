import React, { useState } from 'react';

export default function AuthPanel({
  lang,
  account,
  cloudStatus,
  onSignIn,
  onSignUp,
  onSignOut,
  onLoadCloud,
  onSaveCloud
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const t = {
    account: lang === 'fr' ? 'SIGNATURE' : 'SIGNATURE',
    connected: lang === 'fr' ? 'ANCREE' : 'ANCHORED',
    guest: lang === 'fr' ? 'LOCALE' : 'LOCAL',
    email: lang === 'fr' ? 'Email' : 'Email',
    password: lang === 'fr' ? 'Mot de passe' : 'Password',
    signIn: lang === 'fr' ? 'Ancrer' : 'Anchor',
    signUp: lang === 'fr' ? 'Creer signature' : 'Create signature',
    signOut: lang === 'fr' ? 'Detacher' : 'Detach',
    load: lang === 'fr' ? 'Lire Nexus' : 'Read Nexus',
    save: lang === 'fr' ? 'Graver Nexus' : 'Engrave Nexus'
  };

  const run = async (fn) => {
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

  return (
    <div className="auth-panel-shell" style={{
      width: open ? '280px' : 'auto',
      fontFamily: '"Share Tech Mono", monospace'
    }}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="btn-retro"
        style={{
          width: open ? '100%' : 'auto',
          fontSize: '11px',
          padding: '7px 11px',
          borderColor: account ? '#2ecc71' : '#39c5bb',
          color: account ? '#2ecc71' : '#39c5bb'
        }}
      >
        {t.account}: {account ? t.connected : t.guest}
      </button>

      {open && (
        <div className="glass-panel" style={{
          marginTop: '8px',
          padding: '12px',
          background: 'rgba(8, 6, 16, 0.92)',
          borderColor: account ? 'rgba(46,204,113,0.35)' : 'rgba(57,197,187,0.25)'
        }}>
          {account ? (
            <>
              <div style={{ fontSize: '11px', color: '#2ecc71', fontWeight: 'bold', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {account.user?.email || account.user?.id}
              </div>
              <div style={{ fontSize: '10px', color: '#aaa', lineHeight: 1.35, marginBottom: '10px' }}>
                {cloudStatus}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <button disabled={busy} onClick={() => run(onLoadCloud)} className="btn-retro" style={{ fontSize: '10px', padding: '6px' }}>
                  {t.load}
                </button>
                <button disabled={busy} onClick={() => run(onSaveCloud)} className="btn-retro" style={{ fontSize: '10px', padding: '6px' }}>
                  {t.save}
                </button>
              </div>
              <button
                disabled={busy}
                onClick={() => run(onSignOut)}
                className="btn-retro"
                style={{ width: '100%', marginTop: '6px', fontSize: '10px', padding: '6px', borderColor: '#e74c3c', color: '#e74c3c' }}
              >
                {t.signOut}
              </button>
            </>
          ) : (
            <>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.email}
                type="email"
                style={inputStyle}
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.password}
                type="password"
                style={inputStyle}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '8px' }}>
                <button disabled={busy || !email || !password} onClick={() => run(onSignIn)} className="btn-retro" style={{ fontSize: '10px', padding: '6px' }}>
                  {t.signIn}
                </button>
                <button disabled={busy || !email || !password} onClick={() => run(onSignUp)} className="btn-retro" style={{ fontSize: '10px', padding: '6px' }}>
                  {t.signUp}
                </button>
              </div>
              <div style={{ fontSize: '10px', color: '#aaa', lineHeight: 1.35, marginTop: '8px' }}>
                {cloudStatus}
              </div>
            </>
          )}

          {error && (
            <div style={{ marginTop: '8px', fontSize: '10px', color: '#ff7675', lineHeight: 1.35 }}>
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  marginBottom: '6px',
  padding: '8px',
  background: 'rgba(0,0,0,0.45)',
  border: '1px solid rgba(57,197,187,0.35)',
  borderRadius: '4px',
  color: '#fff',
  fontFamily: '"Share Tech Mono", monospace',
  fontSize: '12px'
};
