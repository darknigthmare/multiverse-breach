import { CANON_PRIORITY_STAGES } from './canonPriorityStages.js';

// These notices do not certify the historical sprites. Other episodes of each
// franchise retain their own entries instead of inheriting this mission's era.
const notice = (name, incarnation, referenceUrl, fr, en) => Object.freeze({
  name, incarnation, referenceUrl, lore: Object.freeze({ fr, en })
});

export const CANONICAL_ARCHIVE_ENEMY_LORE = Object.freeze({
  'Gears of War': Object.freeze({
    'Locust Drone': notice(
      'Locust Drone', 'Gears of War (2006)',
      'https://gearsofwar.fandom.com/wiki/Drone',
      'Fantassin de la Horde Locuste sur Sera, le Drone combat avec les armes de la Horde, notamment le fusil Hammerburst. Sur le train de la bombe Lightmass, il appartient aux forces de RAAM.',
      'A Locust Horde infantryman on Sera, the Drone uses Horde weapons including the Hammerburst rifle. On the Lightmass Bomb train, it belongs to RAAM’s forces.'
    ),
    'Theron Guard': notice(
      'Theron Guard', 'Gears of War (2006)',
      'https://gearsofwar.fandom.com/wiki/Theron_Guard',
      'Garde d’élite Locuste en armure rouge sombre, le Theron utilise le Torque Bow et ses traits explosifs. Il est présent dans le premier Gears of War, pendant l’offensive contre la Horde.',
      'A Locust elite guard in dark red armor, the Theron uses the Torque Bow and its explosive bolts. It appears in the original Gears of War during the offensive against the Horde.'
    ),
    'General RAAM': notice(
      'General RAAM', 'Gears of War (2006)',
      'https://gearsofwar.fandom.com/wiki/RAAM',
      'Le général Locuste affronte Marcus Fenix et Dominic Santiago sur le train de la bombe Lightmass. Il porte une lourde armure et une mitrailleuse Troika ; les Kryll qui l’entourent le protègent et peuvent attaquer ses adversaires.',
      'The Locust general confronts Marcus Fenix and Dominic Santiago aboard the Lightmass Bomb train. He carries heavy armor and a Troika machine gun; the Kryll surrounding him provide protection and can attack his opponents.'
    )
  }),
  Halo: Object.freeze({
    'Covenant Grunt': notice(
      'Covenant Grunt', 'Halo 2 (2004)',
      'https://www.halopedia.org/Unggoy',
      'L’Unggoy, surnommé Grunt, est un fantassin du Covenant équipé d’un masque respiratoire et d’un réservoir de méthane dorsal. À New Mombasa, il utilise notamment le pistolet à plasma sous le commandement des Sangheili.',
      'The Unggoy, nicknamed Grunt, is a Covenant infantryman equipped with a breathing mask and a dorsal methane tank. In New Mombasa it uses weapons including the plasma pistol under Sangheili command.'
    ),
    'Jackal Sniper': notice(
      'Jackal Sniper', 'Halo 2 (2004)',
      'https://www.halopedia.org/Kig-Yar_Sniper',
      'Le tireur d’élite Kig-Yar du Covenant utilise le Beam Rifle dans Halo 2. Les rues et positions surélevées de New Mombasa lui permettent de couvrir l’avancée des forces Covenant.',
      'The Covenant Kig-Yar sniper uses the Beam Rifle in Halo 2. New Mombasa’s streets and elevated positions allow it to cover the advance of Covenant forces.'
    ),
    'Elite Minor': notice(
      'Elite Minor', 'Halo 2 (2004)',
      'https://www.halopedia.org/Sangheili_Minor',
      'Le Sangheili Minor porte une armure de combat bleue et un bouclier énergétique personnel. Ce rang d’Elite du Covenant emploie notamment le fusil à plasma et dirige des fantassins pendant l’invasion de New Mombasa.',
      'The Sangheili Minor wears blue combat armor and a personal energy shield. This Covenant Elite rank uses weapons including the plasma rifle and leads infantry during the invasion of New Mombasa.'
    ),
    'Covenant Scarab Mech': notice(
      'Protos-pattern Scarab', 'Halo 2 (2004)',
      'https://www.halopedia.org/Protos-pattern_Scarab',
      'Le Scarab Protos de Metropolis est le grand marcheur Covenant à quatre pattes qui traverse New Mombasa. Son armement comprend un canon à concentration ultra-lourd et des répéteurs à plasma. Master Chief l’aborde depuis les passerelles et neutralise son équipage ; cette scène n’utilise pas le réacteur arrière du Scarab de Halo 3.',
      'The Protos Scarab in Metropolis is the large four-legged Covenant walker advancing through New Mombasa. Its armament includes an ultra-heavy focus cannon and plasma repeaters. Master Chief boards it from the walkways and neutralizes its crew; this encounter does not use the Halo 3 Scarab’s rear reactor.'
    )
  }),
  Alien: Object.freeze({
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
  }),
  'Half-Life': Object.freeze({
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
  }),
  'Metal Gear': Object.freeze({
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
  }),
  Fallout: Object.freeze({
    'Legate Lanius General': notice(
      'Legate Lanius', 'Fallout: New Vegas (2010)',
      'https://fallout.fandom.com/wiki/Legate_Lanius',
      'Le Légat Lanius commande l’assaut de la Légion de César pendant la seconde bataille de Hoover Dam. Il porte une lourde armure et un masque d’acier, et manie la Blade of the East. Le Courrier le rencontre dans le camp du Légat à l’est du barrage et peut le combattre ou le convaincre de se retirer.',
      'Legate Lanius commands Caesar’s Legion assault during the Second Battle of Hoover Dam. He wears heavy armor and a steel mask, and wields the Blade of the East. The Courier meets him at the Legate’s camp east of the dam and can fight him or persuade him to withdraw.'
    )
  })
});

export const getCanonicalArchiveEnemyLore = (universe, enemy) => {
  if (
    enemy?.incarnation && enemy.referenceUrl?.startsWith('https://')
    && enemy.sourceLore?.fr && enemy.sourceLore?.en
  ) {
    return notice(enemy.canonicalName || enemy.name, enemy.incarnation, enemy.referenceUrl, enemy.sourceLore.fr, enemy.sourceLore.en);
  }
  if (!Object.hasOwn(CANONICAL_ARCHIVE_ENEMY_LORE, universe)) return null;
  const entries = CANONICAL_ARCHIVE_ENEMY_LORE[universe];
  if (!Object.hasOwn(entries, enemy?.name)) return null;
  const entry = entries[enemy.name];
  if (enemy.incarnation && (
    typeof enemy.incarnation !== 'string' || !enemy.incarnation.startsWith(entry.incarnation)
  )) return null;
  return entry;
};

const stageNotice = (source, fr, en, adaptationFr, adaptationEn) => Object.freeze({
  source, lore: Object.freeze({ fr, en }),
  adaptation: Object.freeze({ fr: adaptationFr, en: adaptationEn })
});

export const CANONICAL_STAGE_ARCHIVE_LORE = Object.freeze([
  stageNotice(
    CANON_PRIORITY_STAGES.lightmassTrain,
    'Le train transporte la bombe Lightmass dans les profondeurs de Sera. Marcus Fenix et Dominic Santiago progressent de wagon en wagon, puis affrontent General RAAM, sa Troika et sa protection de Kryll.',
    'The train carries the Lightmass Bomb into Sera’s depths. Marcus Fenix and Dominic Santiago advance through its cars before confronting General RAAM, his Troika and his Kryll protection.',
    'Les Kryll bloquent les dégâts ordinaires. Les grenades frag et les départs de l’essaim exposent RAAM ; la lumière protège de l’essaim. Les commandes ATB, la réserve partagée de grenades et les durées adaptent le combat original.',
    'Kryll block ordinary damage. Frag grenades and swarm departures expose RAAM; light protects from the swarm. ATB commands, shared grenade supply and timings adapt the original fight.'
  ),
  stageNotice(
    CANON_PRIORITY_STAGES.metropolisScarab,
    'À Metropolis, Master Chief traverse les rues et canaux de New Mombasa envahis par le Covenant. Il rejoint les passerelles au-dessus du Scarab Protos, l’aborde et neutralise son équipage.',
    'In Metropolis, Master Chief crosses Covenant-occupied New Mombasa streets and canals. He reaches the walkways above the Protos Scarab, boards it and neutralizes its crew.',
    'Rejoignez la passerelle d’abordage puis neutralisez le Grunt et l’Élite de l’équipage. La coque du Scarab est invulnérable. La grille, le véhicule immobile et le nombre d’occupants adaptent Metropolis ; aucun cœur arrière de Halo 3 n’est ajouté.',
    'Reach the boarding catwalk, then neutralize the Grunt and Elite crew. The Scarab hull is invulnerable. The grid, stationary walker and crew count adapt Metropolis; no Halo 3 rear core is added.'
  ),
  stageNotice(
    CANON_PRIORITY_STAGES.hadleysQueen,
    'Ripley entre dans la ruche du processeur atmosphérique de Hadley’s Hope, sur LV-426, pour sauver Newt. Elle découvre les œufs et la Reine, puis quitte le processeur avant son explosion. Le duel au power loader se déroule ensuite à bord du Sulaco.',
    'Ripley enters Hadley’s Hope’s atmosphere processor hive on LV-426 to rescue Newt. She discovers the eggs and the Queen, then leaves the processor before it explodes. The power-loader duel takes place afterward aboard the Sulaco.',
    'Libérez Newt au repère du nid, puis atteignez la sortie avec son porteur vivant. Les coups repoussent la Reine sans la tuer ; sa défaite ne remplace pas le sauvetage. Les vagues, la route 2D, les repères et l’échec si le porteur tombe adaptent la scène. Le duel ultérieur au power loader reste à réaliser séparément à bord du Sulaco.',
    'Free Newt at the nest marker, then reach the exit with her living carrier. Hits repel the Queen without killing her; defeating her cannot replace the rescue. Waves, the 2D route, markers and failure if the carrier falls adapt the scene. The later power-loader duel remains to be implemented separately aboard the Sulaco.'
  ),
  stageNotice(
    CANON_PRIORITY_STAGES.xenNihilanth,
    'Dans la dernière chambre de Xen, Gordon Freeman affronte Nihilanth, une créature en lévitation alimentée par des cristaux. Ses sphères de téléportation peuvent envoyer Freeman dans d’autres salles ; sa tête ouverte révèle son point faible cérébral.',
    'In Xen’s final chamber, Gordon Freeman confronts Nihilanth, a levitating creature sustained by crystals. Its teleportation spheres can send Freeman into other rooms; its opened head exposes its brain weak point.',
    'Détruisez les trois cristaux, affaiblissez le boss et sa réserve de sphères de soin, puis visez le cerveau lorsque la tête s’ouvre. Le corps ne peut pas recevoir le coup fatal. Les plateformes et durées sont adaptées au mode Smash ; les salles de téléportation et les renforts invoqués restent à réaliser.',
    'Destroy the three crystals, weaken the boss and its healing-sphere reserve, then aim at the brain when the head opens. Body hits cannot deliver the lethal blow. Platforms and timings adapt the fight to Smash; teleport rooms and summoned reinforcements remain to be implemented.'
  ),
  stageNotice(
    CANON_PRIORITY_STAGES.shadowMoses,
    'Dans le hangar souterrain de Shadow Moses, Solid Snake affronte le Metal Gear REX piloté par Liquid Snake. Le radôme détruit prive REX de ses capteurs, oblige le cockpit à s’ouvrir et expose le pilote à la seconde phase.',
    'In Shadow Moses’s underground hangar, Solid Snake confronts the Metal Gear REX piloted by Liquid Snake. Destroying the radome deprives REX of its sensors, forces the cockpit open and exposes the pilot in the second phase.',
    'Le terrain Tactics et son objectif de commandant représentent la confrontation contre REX.',
    'The Tactics battlefield and its commander objective represent the REX confrontation.'
  ),
  stageNotice(
    CANON_PRIORITY_STAGES.legatesCamp,
    'Pendant la seconde bataille de Hoover Dam, le Courrier atteint le camp du Légat à l’est du barrage. Lanius y commande les forces de la Légion de César, porte son masque d’acier et manie la Blade of the East. Le jeu original permet le combat ou une résolution par le dialogue.',
    'During the Second Battle of Hoover Dam, the Courier reaches the Legate’s camp east of the dam. Lanius commands Caesar’s Legion, wears his steel mask and wields the Blade of the East. The original game permits combat or a dialogue resolution.',
    'La mission Smash choisit le duel contre Lanius ; les résidus de brèche des vagues ordinaires appartiennent à Multiverse Breach.',
    'The Smash mission selects the Lanius duel; the regular waves’ breach residue belongs to Multiverse Breach.'
  )
]);

export const getCanonicalArchiveStageLore = stage => {
  if (
    stage?.incarnation && stage.referenceUrl?.startsWith('https://')
    && stage.sourceSceneLore?.fr && stage.sourceSceneLore?.en
    && stage.sourceSceneAdaptation?.fr && stage.sourceSceneAdaptation?.en
    && !stage.characterArc && !stage.fusionMission && !stage.originalContent
  ) {
    return { source: stage, lore: stage.sourceSceneLore, adaptation: stage.sourceSceneAdaptation };
  }
  return CANONICAL_STAGE_ARCHIVE_LORE.find(entry => (
    stage?.id === entry.source.id
    && stage.universe === entry.source.universe
    && stage.incarnation === entry.source.incarnation
    && !stage.characterArc && !stage.fusionMission && !stage.originalContent
  )) || null;
};

// Explicit names are authoritative. Never substitute a different world boss
// when a mission asks for a local opponent, including a disabled/missing one.
export const resolveStageArchiveBoss = (stage, universeEnemies = {}) => {
  if (!stage) return null;
  const candidates = [
    ...(universeEnemies.bosses || []),
    universeEnemies.worldBoss,
    ...(universeEnemies.monsters || [])
  ].filter(Boolean);
  const requestedNames = [stage.bossName, stage.canonicalBossName].filter(Boolean);
  if (requestedNames.length) {
    return candidates.find(enemy => requestedNames.includes(enemy.name))
      || candidates.find(enemy => requestedNames.includes(enemy.canonicalName))
      || null;
  }
  return universeEnemies.worldBoss || universeEnemies.bosses?.[0] || null;
};
