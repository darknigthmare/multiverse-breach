const identityOf = entry => `${entry.kind}:${entry.id}`;

export const SPRITE_OUTPUT_ALIAS_CONTRACTS = Object.freeze([
  Object.freeze({
    output: '/sprites/generated/heroes/chucky/tiffany.png',
    canonical: 'hero:tiffany',
    aliases: Object.freeze(['boss:chucky-tiffany-doll-bride']),
    reason: 'Tiffany Valentine is intentionally playable and encounter-capable in the same Chucky continuity.'
  }),
  Object.freeze({
    output: '/sprites/generated/heroes/hellraiser/the-priest-2022.png',
    canonical: 'hero:the_priest_2022',
    aliases: Object.freeze(['boss:hellraiser-the-priest-2022']),
    reason: 'The Priest (2022) intentionally keeps one visual identity across playable and encounter roles.'
  })
]);

// These aliases preserve lookups made by older production reports or saves
// after an ambiguous lower-priority role was removed from the runtime roster.
export const LEGACY_SPRITE_ID_ALIASES = Object.freeze({
  'boss:the-simpsons-mr-burns-nuclear-scheme': 'trial:the-simpsons-legacy-simpsons-boss-mr-burns-nuclear-scheme-trial',
  'enemy:stargate-universe-drone-command-ship': 'boss:stargate-universe-drone-command-ship',
  'enemy:roger-rabbit-smart-ass': 'boss:roger-rabbit-smart-ass',
  'enemy:ecco-the-dolphin-vortex-drone': 'boss:ecco-the-dolphin-vortex-drone',
  'enemy:cthulhu-shoggoth': 'boss:cthulhu-shoggoth'
});

const groupBy = (entries, selector) => {
  const grouped = new Map();
  for (const entry of entries) {
    const key = selector(entry);
    const group = grouped.get(key) || [];
    group.push(entry);
    grouped.set(key, group);
  }
  return grouped;
};

const sameIdentitySet = (actual, expected) => (
  actual.length === expected.length
  && actual.every((value, index) => value === expected[index])
);

export const resolveSpriteCatalogIdentity = identity => (
  LEGACY_SPRITE_ID_ALIASES[identity] || identity
);

export const applySpriteCatalogContracts = (entries, { strict = false } = {}) => {
  const duplicateIdentities = [...groupBy(entries, identityOf)]
    .filter(([, owners]) => owners.length > 1);
  if (duplicateIdentities.length > 0) {
    throw new Error(`Duplicate sprite identities: ${duplicateIdentities.map(([identity]) => identity).join(', ')}`);
  }

  const aliasContractsByOutput = new Map(
    SPRITE_OUTPUT_ALIAS_CONTRACTS.map(contract => [contract.output, contract])
  );
  const entriesByIdentity = new Map(entries.map(entry => [identityOf(entry), entry]));
  if (strict) {
    for (const contract of SPRITE_OUTPUT_ALIAS_CONTRACTS) {
      for (const identity of [contract.canonical, ...contract.aliases]) {
        const owner = entriesByIdentity.get(identity);
        if (!owner) throw new Error(`Missing declared sprite output alias owner: ${identity}`);
        if (owner.output !== contract.output) {
          throw new Error(`Declared sprite output alias moved for ${identity}: ${owner.output}`);
        }
      }
    }
    for (const [legacy, canonical] of Object.entries(LEGACY_SPRITE_ID_ALIASES)) {
      if (entriesByIdentity.has(legacy)) {
        throw new Error(`Legacy sprite identity still owns a catalog entry: ${legacy}`);
      }
      if (!entriesByIdentity.has(canonical)) {
        throw new Error(`Missing canonical sprite identity for ${legacy}: ${canonical}`);
      }
    }
  }

  const aliasOwners = new Map();
  for (const [output, owners] of groupBy(entries, entry => entry.output)) {
    const ownerIdentities = [...new Set(owners.map(identityOf))];
    if (ownerIdentities.length < 2) continue;
    const contract = aliasContractsByOutput.get(output);
    if (!contract) {
      throw new Error(`Undeclared sprite output owners for ${output}: ${ownerIdentities.join(', ')}`);
    }
    const actual = [...ownerIdentities].sort();
    const expected = [contract.canonical, ...contract.aliases].sort();
    if (!sameIdentitySet(actual, expected)) {
      throw new Error(`Sprite output alias mismatch for ${output}: ${actual.join(', ')}`);
    }
    for (const alias of contract.aliases) {
      aliasOwners.set(alias, contract);
    }
  }

  return entries.map(entry => {
    const contract = aliasOwners.get(identityOf(entry));
    if (!contract) return entry;
    return {
      ...entry,
      outputAliasOf: contract.canonical,
      outputAliasReason: contract.reason
    };
  });
};
