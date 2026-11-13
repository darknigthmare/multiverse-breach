// Fallout — definitions consumed by src/game/canonicalArchiveLore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalArchiveEnemyLore({ notice }) {
  return (Object.freeze({
    'Legate Lanius General': notice(
      'Legate Lanius', 'Fallout: New Vegas (2010)',
      'https://fallout.fandom.com/wiki/Legate_Lanius',
      'Le Légat Lanius commande l’assaut de la Légion de César pendant la seconde bataille de Hoover Dam. Il porte une lourde armure et un masque d’acier, et manie la Blade of the East. Le Courrier le rencontre dans le camp du Légat à l’est du barrage et peut le combattre ou le convaincre de se retirer.',
      'Legate Lanius commands Caesar’s Legion assault during the Second Battle of Hoover Dam. He wears heavy armor and a steel mask, and wields the Blade of the East. The Courier meets him at the Legate’s camp east of the dam and can fight him or persuade him to withdraw.'
    )
  }));
}
