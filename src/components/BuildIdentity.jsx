import React from 'react';
const identity = typeof __MULTIVERSE_BUILD__ !== 'undefined' ? __MULTIVERSE_BUILD__
  : {commit:null,shortCommit:'unknown',environment:'local'};
/** Build identity is displayed only on the title screen, never over combat. */
export default function BuildIdentity({lang='fr'}) {
  return <details data-build-identity={identity.shortCommit} style={{position:'fixed',left:12,bottom:8,zIndex:5,
    maxWidth:'min(360px, calc(100vw - 24px))',padding:'5px 9px',borderRadius:6,background:'#101824',color:'#d1e2ee',fontSize:12,overflowWrap:'anywhere'}}>
    <summary>{lang==='fr'?'Version':'Build'} · {identity.shortCommit}</summary>
    <p>{identity.commit || (lang==='fr'?'Source sans identifiant Git':'Source without Git identity')} · {identity.environment}</p>
  </details>;
}
