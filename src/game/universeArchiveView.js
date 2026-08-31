const list = value => Array.isArray(value) ? value.filter(entry => entry != null) : [];
const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};

export const canInspectUniverseArchive = (universe, loreDb, isVisible = () => true) => (
  typeof universe === 'string' && Boolean(loreDb && Object.hasOwn(loreDb, universe) && loreDb[universe]) && isVisible(universe)
);

export const getArchiveNeighbour = (universes, current, direction) => {
  if (!Array.isArray(universes) || ![-1, 1].includes(direction)) return null;
  const index = universes.indexOf(current);
  if (index < 0) return null;
  return universes[index + Math.sign(direction)] || null;
};

// Missing optional world fields remain empty: never fabricate lore to fill a UI.
export const normalizeArchiveLivingWorld = value => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const population = object(value.population);
  const society = object(value.society);
  const economy = object(society.economy);
  const ecology = object(value.ecology);
  return {
    ...value,
    locations: list(value.locations),
    dialogues: list(value.dialogues),
    heroRelationships: list(value.heroRelationships),
    sideQuests: list(value.sideQuests),
    randomEvents: list(value.randomEvents),
    codexEntries: list(value.codexEntries),
    population: Object.fromEntries([
      ...Object.entries(population),
      ...['inhabitants', 'leaders', 'supportNpcs', 'neutralCreatures'].map(key => [key, list(population[key])])
    ]),
    society: {
      ...society,
      ...Object.fromEntries(['minorFactions', 'beliefs', 'professions', 'resources', 'food', 'vehicles'].map(key => [key, list(society[key])])),
      economy: { ...economy, exports: list(economy.exports), imports: list(economy.imports) }
    },
    ecology: { ...ecology, ...Object.fromEntries(['flora', 'fauna', 'threats'].map(key => [key, list(ecology[key])])) }
  };
};
