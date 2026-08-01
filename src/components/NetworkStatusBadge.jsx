import React from 'react';

export default function NetworkStatusBadge({ lang = 'fr', isOnline = true }) {
  return (
    <div
      className={`network-status-badge ${isOnline ? 'is-online' : 'is-offline'}`}
      role="status"
      aria-live="polite"
      data-network-status={isOnline ? 'online' : 'offline'}
    >
      <span aria-hidden="true" />
      {isOnline
        ? (lang === 'fr' ? 'CONNEXION DETECTEE' : 'CONNECTION DETECTED')
        : (lang === 'fr' ? 'HORS LIGNE — TRACE LOCALE DISPONIBLE' : 'OFFLINE — LOCAL TRACE AVAILABLE')}
    </div>
  );
}
