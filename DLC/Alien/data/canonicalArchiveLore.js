// Alien — definitions consumed by src/game/canonicalArchiveLore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalArchiveEnemyLore({ notice }) {
  return (Object.freeze({
    'Warrior Xenomorph': notice(
      'Warrior Xenomorph', 'Aliens (1986)',
      'https://www.20thcenturystudios.com/movies/aliens',
      'Le guerrier xénomorphe d’Aliens possède un crâne allongé aux reliefs visibles, une mâchoire interne, des griffes et une longue queue. Les guerriers infestent les installations de Hadley’s Hope et la ruche du processeur atmosphérique de LV-426.',
      'The Aliens warrior xenomorph has an elongated ridged head, an inner jaw, claws and a long tail. Warriors infest Hadley’s Hope and the atmosphere processor hive on LV-426.'
    ),
    'Skittering Facehugger': notice(
      'Facehugger', 'Aliens (1986)',
      'https://imsdb.com/scripts/Aliens.html',
      'Le facehugger est le parasite à doigts articulés et longue queue qui sort d’un œuf xénomorphe et se fixe au visage d’un hôte. Dans Aliens, des spécimens sont étudiés à Hadley’s Hope et les œufs occupent la ruche du processeur.',
      'The facehugger is the parasite with articulated finger-like limbs and a long tail that emerges from a xenomorph egg and attaches to a host’s face. In Aliens, specimens are studied at Hadley’s Hope and eggs occupy the processor hive.'
    ),
    'Egg Chamber Sac': notice(
      'Xenomorph Egg', 'Aliens (1986)',
      'https://imsdb.com/scripts/Aliens.html',
      'L’œuf xénomorphe, ou ovomorphe, s’ouvre pour libérer un facehugger. La Reine pond ces œufs dans son nid du processeur atmosphérique ; ce sont des organismes du cycle reproductif, pas des soldats armés.',
      'The xenomorph egg, or ovomorph, opens to release a facehugger. The Queen lays these eggs in her atmosphere processor nest; they are organisms in the reproductive cycle rather than armed soldiers.'
    ),
    'Alien Queen': notice(
      'Alien Queen', 'Aliens (1986)',
      'https://www.20thcenturystudios.com/movies/aliens',
      'La Reine d’Aliens possède une large crête crânienne, deux grands bras, deux petits bras thoraciques et une longue queue. Ripley la rencontre dans le nid du processeur en sauvant Newt. La confrontation au power loader et l’expulsion dans le vide ont lieu plus tard à bord du Sulaco.',
      'The Aliens Queen has a broad cranial crest, two large arms, two small chest arms and a long tail. Ripley encounters her in the processor nest while rescuing Newt. The power-loader confrontation and expulsion into space occur later aboard the Sulaco.'
    )
  }));
}
