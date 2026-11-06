// Half-Life — definitions consumed by src/game/canonicalArchiveLore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalArchiveEnemyLore({ notice }) {
  return (Object.freeze({
    'Vortigaunt Shock Trooper': notice(
      'Vortigaunt', 'Half-Life (1998)',
      'https://combineoverwiki.net/wiki/Vortigaunt',
      'Dans le premier Half-Life, le Vortigaunt de Xen porte des entraves et attaque avec une décharge d’énergie verte. Il est alors asservi par Nihilanth ; ce rôle diffère de celui des Vortigaunts alliés de Gordon Freeman dans Half-Life 2.',
      'In the original Half-Life, the Xen Vortigaunt wears shackles and attacks with a green energy discharge. It is enslaved by Nihilanth; this role differs from that of Gordon Freeman’s Vortigaunt allies in Half-Life 2.'
    ),
    'Alien Nihilanth Core': notice(
      'Nihilanth', 'Half-Life (1998)',
      'https://combineoverwiki.net/wiki/Nihilanth',
      'Nihilanth est l’immense créature en lévitation affrontée dans la dernière chambre de Xen. Des cristaux alimentent sa réserve d’énergie ; il lance des projectiles et des sphères de téléportation. Sa tête s’ouvre et expose son point faible cérébral pendant la phase finale.',
      'Nihilanth is the immense levitating creature fought in Xen’s final chamber. Crystals replenish its energy reserve; it launches projectiles and teleportation spheres. Its head opens and exposes its brain weak point during the final phase.'
    )
  }));
}
