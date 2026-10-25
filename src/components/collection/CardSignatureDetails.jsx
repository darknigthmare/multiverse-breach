import React from 'react';
import { HEROES_DB } from '../../game/heroes.js';
import { getSignatureCodex, resolveCardSignatureActor, synchronizeSignatureText } from '../../game/signatureCodex.js';
import { getCharacterPlaque } from '../../game/characterPlaques.js';
import SignatureCodexPanel from '../SignatureCodexPanel.jsx';

export default function CardSignatureDetails({ definition, lore, lang }) {
  const actor = resolveCardSignatureActor(definition, HEROES_DB);
  const codex = actor && getSignatureCodex(actor);
  const dossier = actor ? getCharacterPlaque(actor)?.dossier : null;
  const authoredLore = lore || (typeof dossier === 'string' ? dossier : dossier?.[lang] || dossier?.fr || '');
  return <>{authoredLore && <p>{synchronizeSignatureText(authoredLore, codex)}</p>}
    {codex && <SignatureCodexPanel codex={codex} lang={lang} />}
  </>;
}
