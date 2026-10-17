import { getSupabaseConfig } from './cloudSave.js';
import { CloudHttpError, requestCloudJson } from './cloudTransport.js';

const AUTH_KEYS = ['access_token', 'refresh_token', 'token', 'token_hash', 'token_type', 'expires_in', 'expires_at', 'provider_token', 'provider_refresh_token', 'code', 'error', 'error_code', 'error_description', 'type'];
const TYPES = new Set(['recovery', 'signup']);
export const AUTH_EMAIL_COOLDOWN_MS = 60000;
export const isValidAuthEmail = email => typeof email === 'string' && email.trim().length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

/** Parse first; remove credentials before React, analytics or the game can mount. */
export function consumeAuthCallback(location, history) {
  if (!location?.href) return null;
  const url = new URL(location.href);
  const hash = new URLSearchParams(url.hash.slice(1));
  const query = url.searchParams;
  const isCallback = [hash, query].some(params =>
    AUTH_KEYS.filter(key => key !== 'type').some(key => params.has(key))
    || TYPES.has(params.get('type')));
  if (!isCallback) return null;
  let ambiguous = false;
  const get = key => {
    const values = [...hash.getAll(key), ...query.getAll(key)];
    if (values.length > 1) ambiguous = true;
    return values[0] || '';
  };
  const type = get('type');
  const accessToken = get('access_token');
  const tokenHash = get('token_hash');
  const code = get('code');
  const error = get('error') || get('error_code') || get('error_description');
  const callback = { type, accessToken, tokenHash,
    invalid: ambiguous || !TYPES.has(type) || Boolean(code || error) || Boolean(accessToken) === Boolean(tokenHash) };
  AUTH_KEYS.forEach(key => { hash.delete(key); query.delete(key); });
  url.hash = hash.toString() ? `#${hash}` : '';
  try {
    if (!history?.replaceState) throw new Error('History unavailable');
    history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`);
  } catch {
    // Never use a credential that cannot be removed from the visible URL.
    return { type, invalid: true, accessToken: '', tokenHash: '', cleanupFailed: true };
  }
  return callback;
}

export function getAuthReturnUrl(location = globalThis.location) {
  const url = new URL(location?.href || '');
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && local)) {
    throw new CloudHttpError('Adresse de retour non securisee.', 0, 'INVALID_AUTH_REDIRECT');
  }
  // Never inherit a caller-controlled redirect, credential, query or fragment.
  return `${url.origin}${url.pathname}`;
}

export function validateRecoveryPassword(password, confirmation) {
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) return 'PASSWORD_LENGTH';
  if (password !== confirmation) return 'PASSWORD_MISMATCH';
  return null;
}

export function authRecoveryMessage(error, lang = 'fr') {
  const fr = lang !== 'en';
  if (error?.code === 'PASSWORD_MISMATCH') return fr ? 'Les mots de passe ne correspondent pas.' : 'The passwords do not match.';
  if (error?.code === 'PASSWORD_LENGTH') return fr ? 'Utilise entre 8 et 128 caracteres.' : 'Use between 8 and 128 characters.';
  if (error?.code === 'INVALID_EMAIL') return fr ? 'Renseigne une adresse email valide.' : 'Enter a valid email address.';
  if (error?.status === 429 || error?.code === 'EMAIL_COOLDOWN') return fr ? 'Trop de demandes. Patiente avant un nouvel envoi.' : 'Too many requests. Please wait before sending again.';
  if (error?.code === 'REQUEST_TIMEOUT' || error?.name === 'TypeError') return fr ? 'Connexion interrompue. Aucun succes ne peut etre confirme.' : 'Connection interrupted. Success cannot be confirmed.';
  if (error?.code === 'weak_password' || error?.code === 'same_password') return fr ? 'Choisis un nouveau mot de passe plus robuste et different du precedent.' : 'Choose a stronger password different from your previous one.';
  if (error?.status === 401 || error?.status === 403 || error?.code === 'INVALID_AUTH_CALLBACK' || error?.code === 'otp_expired') return fr ? 'Ce lien est invalide ou expire. Demande un nouveau lien depuis la connexion.' : 'This link is invalid or expired. Request a new link from sign-in.';
  return fr ? 'Operation non confirmee. Reessaie ou demande un nouveau lien.' : 'Operation not confirmed. Try again or request a new link.';
}

/** Only public Auth endpoints. No game storage, account adoption or save-table access. */
export function createAuthRecoveryService({
  configFactory = getSupabaseConfig, fetchImpl = (...args) => globalThis.fetch(...args),
  locationFactory = () => globalThis.location, now = () => Date.now(), timeoutMs = 12000
} = {}) {
  const pendingEmails = new Map();
  const deadlines = new Map();
  const request = async (path, { token, ...options } = {}) => {
    const config = await configFactory();
    const base = new URL(config.supabaseUrl);
    if (base.protocol !== 'https:' && !(base.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(base.hostname))) {
      throw new CloudHttpError('Configuration Auth non securisee.', 0, 'INVALID_AUTH_CONFIG');
    }
    return requestCloudJson(`${config.supabaseUrl.replace(/\/$/, '')}/auth/v1${path}`, {
      ...options, headers: { 'Content-Type': 'application/json', apikey: config.supabaseAnonKey,
        Authorization: `Bearer ${token || config.supabaseAnonKey}` }
    }, { fetchImpl, timeoutMs });
  };
  const emailRequest = (kind, input) => {
    const email = String(input || '').trim();
    if (!isValidAuthEmail(email)) return Promise.reject(new CloudHttpError('Email invalide.', 0, 'INVALID_EMAIL'));
    const key = email.toLowerCase();
    if (pendingEmails.has(key)) return pendingEmails.get(key);
    if ((deadlines.get(key) || 0) > now()) {
      const error = new CloudHttpError('Demande deja envoyee.', 429, 'EMAIL_COOLDOWN');
      error.retryAt = deadlines.get(key);
      return Promise.reject(error);
    }
    const operation = Promise.resolve().then(async () => {
      try {
        const redirect = getAuthReturnUrl(locationFactory());
        await request(`${kind === 'recovery' ? '/recover' : '/resend'}?redirect_to=${encodeURIComponent(redirect)}`, {
          method: 'POST', body: JSON.stringify(kind === 'recovery' ? { email } : { email, type: 'signup' })
        });
        const retryAt = now() + AUTH_EMAIL_COOLDOWN_MS;
        deadlines.set(key, retryAt);
        return { accepted: true, retryAt }; // Deliberately does not reveal whether the email exists.
      } catch (error) {
        if (error.status === 429) {
          error.retryAt = now() + Math.max(AUTH_EMAIL_COOLDOWN_MS, (error.retryAfterSeconds || 0) * 1000);
          deadlines.set(key, error.retryAt);
        }
        throw error;
      } finally {
        pendingEmails.delete(key);
        for (const [entry, deadline] of deadlines) if (deadline <= now()) deadlines.delete(entry);
        if (deadlines.size > 64) deadlines.delete(deadlines.keys().next().value);
      }
    });
    pendingEmails.set(key, operation);
    return operation;
  };

  const createFlow = input => {
    let proof = input ? { ...input } : null;
    let accessToken = '';
    let user = null;
    let verified = null;
    let changing = null;
    let completed = false;
    let disposed = false;
    const controller = new AbortController();
    const assertActive = () => { if (disposed) throw new DOMException('Operation annulee.', 'AbortError'); };
    const verify = () => {
      if (verified) return verified;
      verified = (async () => {
        assertActive();
        if (!proof || proof.invalid || !TYPES.has(proof.type)) throw new CloudHttpError('Lien invalide.', 401, 'INVALID_AUTH_CALLBACK');
        const kind = proof.type;
        if (proof.tokenHash) {
          const data = await request('/verify', { method: 'POST', body: JSON.stringify({ type: kind, token_hash: proof.tokenHash }), signal: controller.signal });
          assertActive();
          accessToken = data?.access_token || data?.session?.access_token || '';
        } else accessToken = proof.accessToken || '';
        proof = { type: kind }; // Discard tokens from the original URL once consumed.
        if (!accessToken) throw new CloudHttpError('Lien invalide.', 401, 'INVALID_AUTH_CALLBACK');
        user = await request('/user', { token: accessToken, signal: controller.signal });
        assertActive();
        if (!user?.id || !user?.email || (kind === 'signup' && !user.email_confirmed_at && !user.confirmed_at)) {
          throw new CloudHttpError('Compte non confirme.', 401, 'INVALID_AUTH_CALLBACK');
        }
        return { type: kind, email: user.email };
      })();
      return verified;
    };
    const changePassword = (password, confirmation) => {
      if (changing) return changing;
      const issue = validateRecoveryPassword(password, confirmation);
      if (issue) return Promise.reject(new CloudHttpError('Mot de passe invalide.', 0, issue));
      changing = (async () => {
        assertActive();
        const identity = await verify();
        if (completed || identity.type !== 'recovery') throw new CloudHttpError('Lien inutilisable.', 401, 'INVALID_AUTH_CALLBACK');
        const updated = await request('/user', { method: 'PUT', token: accessToken, signal: controller.signal, body: JSON.stringify({ password }) });
        assertActive();
        if (updated?.id !== user.id) throw new CloudHttpError('Modification non confirmee.', 401, 'INVALID_AUTH_CALLBACK');
        completed = true;
        accessToken = '';
        return { changed: true };
      })().finally(() => { changing = null; });
      return changing;
    };
    return { verify, changePassword, dispose: () => { disposed = true; accessToken = ''; proof = null; user = null; controller.abort(); } };
  };
  return { requestPasswordReset: email => emailRequest('recovery', email), resendConfirmation: email => emailRequest('signup', email), createFlow };
}

export const authRecovery = createAuthRecoveryService();
