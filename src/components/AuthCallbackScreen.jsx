import React, { useEffect, useRef, useState } from 'react';
import { authRecoveryMessage, validateRecoveryPassword } from '../game/authRecovery.js';
import './AuthCallbackScreen.css';

export default function AuthCallbackScreen({ flow, onExit, initialLang = 'fr' }) {
  const [lang, setLang] = useState(initialLang === 'en' ? 'en' : 'fr');
  const [phase, setPhase] = useState('checking');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState(null);
  const busyRef = useRef(false);
  const mountedRef = useRef(true);
  const fr = lang === 'fr';
  useEffect(() => {
    mountedRef.current = true;
    let active = true;
    // The flow shares one verification across StrictMode's effect replay.
    flow.verify().then(identity => {
      if (!active) return;
      setEmail(identity.email);
      setPhase(identity.type === 'recovery' ? 'password' : 'confirmed');
    }).catch(failure => { if (active) { setError(failure); setPhase('error'); } });
    return () => { active = false; mountedRef.current = false; };
  }, [flow]);
  const submit = async event => {
    event.preventDefault();
    if (busyRef.current || phase !== 'password') return;
    const code = validateRecoveryPassword(password, confirmation);
    if (code) { setError({ code }); return; }
    busyRef.current = true;
    setError(null); setPhase('saving');
    try {
      await flow.changePassword(password, confirmation);
      if (mountedRef.current) { setPassword(''); setConfirmation(''); setPhase('done'); }
    } catch (failure) {
      if (mountedRef.current) { setError(failure); setPhase('password'); }
    } finally { busyRef.current = false; }
  };
  const leave = () => { if (busyRef.current) return; flow.dispose(); setPassword(''); setConfirmation(''); onExit(); };
  return <main className="auth-callback-screen" lang={lang}>
    <section className="glass-panel auth-callback-card" aria-labelledby="auth-callback-title" aria-busy={phase === 'saving' || phase === 'checking'}>
      <div className="auth-callback-kicker">A.R.C.A. / NEXUS</div>
      <button className="btn-retro auth-callback-language" type="button" onClick={() => setLang(fr ? 'en' : 'fr')} aria-label={fr ? 'Passer en anglais' : 'Switch to French'}>{lang.toUpperCase()}</button>
      <h1 id="auth-callback-title">{fr ? 'Acces au compte' : 'Account access'}</h1>
      <p>{fr ? 'La progression locale reste intacte. Ce lien ne charge et ne remplace aucune sauvegarde.' : 'Local progress stays intact. This link does not load or replace any save.'}</p>
      {email && <p className="auth-callback-email">{email}</p>}
      {phase === 'checking' && <p role="status">{fr ? 'Verification du lien…' : 'Verifying link…'}</p>}
      {['password', 'saving'].includes(phase) && <form onSubmit={submit}>
        <label htmlFor="recovery-password">{fr ? 'Nouveau mot de passe' : 'New password'}</label>
        <input id="recovery-password" type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={password} onChange={event => setPassword(event.target.value)} disabled={phase === 'saving'} aria-describedby="recovery-hint" />
        <label htmlFor="recovery-confirmation">{fr ? 'Confirmer le mot de passe' : 'Confirm password'}</label>
        <input id="recovery-confirmation" type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={confirmation} onChange={event => setConfirmation(event.target.value)} disabled={phase === 'saving'} />
        <p id="recovery-hint">{fr ? '8 a 128 caracteres. Les exigences de securite du serveur restent applicables.' : '8 to 128 characters. Server password security requirements also apply.'}</p>
        <button className="btn-retro" type="submit" disabled={phase === 'saving'}>{phase === 'saving' ? (fr ? 'Enregistrement…' : 'Saving…') : (fr ? 'Changer le mot de passe' : 'Change password')}</button>
      </form>}
      {phase === 'done' && <p role="status">{fr ? 'Mot de passe modifie. Tu peux te connecter avec ton nouveau mot de passe.' : 'Password changed. You can sign in with your new password.'}</p>}
      {phase === 'confirmed' && <p role="status">{fr ? 'Adresse email confirmee. Tu peux maintenant te connecter.' : 'Email address confirmed. You can now sign in.'}</p>}
      {error && <p className="auth-callback-error" role="alert">{authRecoveryMessage(error, lang)}</p>}
      <button className="btn-retro auth-callback-back" type="button" disabled={phase === 'saving'} onClick={leave}>{fr ? 'Retour au jeu / connexion' : 'Return to game / sign-in'}</button>
    </section>
  </main>;
}
