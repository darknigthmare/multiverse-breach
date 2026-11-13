// Metal Gear — definitions consumed by src/game/canonicalArchiveLore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalArchiveEnemyLore({ notice }) {
  return (Object.freeze({
    'Genome Soldier Patrol': notice(
      'Genome Soldier', 'Metal Gear Solid (1998)',
      'https://metalgear.fandom.com/wiki/Genome_Soldier',
      'Les Genome Soldiers sont les soldats des forces spéciales qui participent à l’insurrection de FOXHOUND à Shadow Moses. Ils patrouillent dans les installations de l’île avec leur équipement militaire ; ils ne sont pas les FROG ou les Gekko des jeux ultérieurs.',
      'The Genome Soldiers are the special forces soldiers participating in FOXHOUND’s Shadow Moses uprising. They patrol the island’s facilities with military equipment; they are not the FROGs or Gekko of later games.'
    ),
    'Metal Gear REX Shadow': notice(
      'Metal Gear REX', 'Metal Gear Solid (1998)',
      'https://www.konami.com/mg/history/us/en/',
      'Le REX de Shadow Moses est le mécha nucléaire bipède piloté par Liquid Snake. Il possède un railgun, un radôme et des lance-missiles. Solid Snake endommage le radôme, puis affronte le cockpit exposé ; REX n’est pas le Metal Gear RAY des épisodes suivants.',
      'The Shadow Moses REX is the bipedal nuclear mech piloted by Liquid Snake. It has a railgun, a radome and missile launchers. Solid Snake damages the radome and then attacks the exposed cockpit; REX is not the Metal Gear RAY of later installments.'
    )
  }));
}
