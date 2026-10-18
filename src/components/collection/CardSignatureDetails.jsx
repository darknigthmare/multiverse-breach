import React from 'react';
import { HEROES_DB } from '../../game/heroes.js';
import { getSignatureCodex, resolveCardSignatureActor, synchronizeSignatureText } from '../../game/signatureCodex.js';
import SignatureCodexPanel from '../SignatureCodexPanel.jsx';

export default function CardSignatureDetails({ definition, lore, lang }) {
  const actor = resolveCardSignatureActor(definition, HEROES_DB);
  const codex = actor && getSignatureCodex(actor);
  return <><p>{synchronizeSignatureText(lore, codex)}</p>
    {codex && <SignatureCodexPanel codex={codex} lang={lang} />}
  </>;
}
