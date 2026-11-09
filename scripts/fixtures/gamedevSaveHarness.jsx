import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SAVE_KEY, BACKUP_KEY, loadAppSave, initializeAppSave } from 'virtual:gamedev-save-init';

export default function SaveHarness() {
  const [snapshot, setSnapshot] = useState(null);
  const [session, setSession] = useState(null);
  const [issue, setIssue] = useState(null);
  const [result, setResult] = useState(null);
  const [injectedReadErrors, setInjectedReadErrors] = useState(0);

  const load = (injectFailure = false) => {
    const original = Storage.prototype.getItem;
    let failures = 0;
    if (injectFailure) {
      // A one-shot test fault, not a native browser permission-denial test.
      // All reads after this call and all data writes use real localStorage.
      Storage.prototype.getItem = function (key) {
        if (key === SAVE_KEY && failures === 0) {
          failures++;
          throw new DOMException('Injected first save read failure', 'SecurityError');
        }
        return original.call(this, key);
      };
    }
    let loaded;
    try { loaded = loadAppSave(); }
    finally { if (injectFailure) Storage.prototype.getItem = original; }
    setSnapshot(loaded);
    setIssue(loaded.issue);
    setInjectedReadErrors(failures);
    setSession(null);
    setResult(null);
  };

  const persist = payload => setResult(session.persistLocalSave(payload));
  const importSave = () => {
    const imported = session.applySave({ ...snapshot.payload, gold: 900 }, {
      existing: true, navigateTo: null, acceptExternalChange: true
    });
    setSnapshot({ ...snapshot, payload: imported });
    persist(imported);
  };

  return <main data-testid="save-fixture" data-save-key={SAVE_KEY} data-backup-key={BACKUP_KEY}>
    <h1>Local save initialization</h1>
    <p>This isolated fixture executes the current App save closures and storage helpers.
      Loading and writer initialization are separate controls so another browser tab can
      change native localStorage between them. Catalog migration and navigation are stubbed.</p>
    <button onClick={() => load()}>Load saved progression</button>
    <button onClick={() => load(true)}>Load with one injected read error</button>
    <button disabled={!snapshot || !!session} onClick={() => setSession(initializeAppSave(snapshot, setIssue))}>
      Initialize writer
    </button>
    <button disabled={!session} onClick={() => persist(snapshot.payload)}>Save loaded progression</button>
    <button disabled={!session} onClick={() => persist({ ...snapshot.payload, gold: snapshot.payload.gold + 25 })}>
      Add 25 gold
    </button>
    <button disabled={!session} onClick={importSave}>Explicitly import 900 gold</button>
    <pre data-testid="save-state">{JSON.stringify({
      loaded: snapshot !== null,
      initialized: session !== null,
      loadedGold: snapshot?.payload.gold ?? null,
      initialIssue: snapshot?.issue ?? null,
      issue,
      result,
      injectedReadErrors
    })}</pre>
  </main>;
}

createRoot(document.getElementById('root')).render(<SaveHarness />);
