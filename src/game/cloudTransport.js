/** A bounded, abortable JSON request. Never consumes a Response body twice. */
export class CloudHttpError extends Error {
  constructor(message, status = 0, code = 'CLOUD_REQUEST_FAILED') {
    super(message);
    this.name = 'CloudHttpError';
    this.status = status;
    this.code = code;
  }
}

export async function readCloudResponse(response) {
  const text = await response.text();
  let data = null;
  let parsed = false;
  if (text.trim()) {
    try { data = JSON.parse(text); parsed = true; } catch { /* Non-JSON error bodies are valid. */ }
  }
  if (!response.ok) {
    const detail = data && typeof data === 'object'
      ? data.error_description || data.message || data.msg || data.error
      : null;
    const plainText = !/^\s*</.test(text) ? text.trim() : '';
    const message = typeof detail === 'string' && detail.trim()
      ? detail.slice(0, 300)
      : plainText.slice(0, 300) || `Service cloud indisponible (HTTP ${response.status}).`;
    const error = new CloudHttpError(message, response.status, data?.error_code || data?.code || 'HTTP_ERROR');
    const retryAfter = response.headers?.get?.('Retry-After');
    if (retryAfter && /^\d+$/.test(retryAfter)) error.retryAfterSeconds = Math.min(3600, Number(retryAfter));
    throw error;
  }
  if (!text.trim()) return null;
  if (!parsed) throw new CloudHttpError('Reponse cloud invalide.', response.status, 'INVALID_JSON');
  return data;
}

export async function requestCloudJson(url, options = {}, {
  fetchImpl = globalThis.fetch,
  timeoutMs = 12000
} = {}) {
  const controller = new AbortController();
  const externalSignal = options.signal;
  const abortFromCaller = () => controller.abort(externalSignal.reason);
  let rejectAbort;
  const aborted = new Promise((_, reject) => { rejectAbort = reject; });
  const onAbort = () => rejectAbort(controller.signal.reason || new DOMException('Requete annulee.', 'AbortError'));
  controller.signal.addEventListener('abort', onAbort, { once: true });
  externalSignal?.addEventListener('abort', abortFromCaller, { once: true });
  const timeout = setTimeout(() => controller.abort(
    new CloudHttpError('Le service cloud ne repond pas. La progression locale est conservee.', 0, 'REQUEST_TIMEOUT')
  ), Math.max(1, Number(timeoutMs) || 12000));
  try {
    if (externalSignal?.aborted) abortFromCaller();
    const request = Promise.resolve().then(() => {
      if (controller.signal.aborted) throw controller.signal.reason;
      return fetchImpl(url, { ...options, signal: controller.signal });
    }).then(readCloudResponse);
    return await Promise.race([request, aborted]);
  } finally {
    clearTimeout(timeout);
    externalSignal?.removeEventListener('abort', abortFromCaller);
    controller.signal.removeEventListener('abort', onAbort);
  }
}
