// Rival Schools — definitions consumed by src/game/canonRosterWavePartF.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRivalSchools() {
  return (Object.freeze({ key: 'rival_schools', universe: 'Rival Schools', url: 'https://game.capcom.com/cfn/sfv/column-130231?lang=en' }));
}

export function createRivalSchools2({ RIVAL_SCHOOLS, definePack, stageVariant }) {
  return (definePack(RIVAL_SCHOOLS, {
  aliases: ['Rival School', 'Rival Schools: United by Fate', 'Project Justice'],
  mediaType: 'video-game', faction: 'martial', mode: 'Smash', difficulty: 'Very Hard',
  colors: ['#1c4677', '#080b12', '#f1c54b'], motif: 'schoolyard',
  theme: 'school teams investigating kidnappings, brainwashing and the Imawano conspiracies',
  continuity: 'Rival Schools: United by Fate and Project Justice game continuity',
  adaptationRule: 'Preserve Taiyo High’s Batsu–Hinata–Kyosuke team, school-specific uniforms and team-up attacks. Akira, Roy and Shoma are sporting rivals, not evil minions. Label Raizo’s brainwashing and Demon Hyo’s possession instead of flattening either man into a generic villain.',
  visualAnchor: 'Bright Japanese school grounds, bold 1990s Capcom silhouettes, team-up impacts and uniforms unique to each academy.',
  canonStatus: 'Capcom two-game continuity with rivals separated from villains',
  fr: 'Batsu, Hinata et Kyosuke réunissent les écoles pour enquêter sur les enlèvements puis sur la crise qui divise les équipes dans Project Justice.',
  en: 'Batsu, Hinata and Kyosuke unite the schools to investigate the kidnappings and later the crisis dividing teams in Project Justice.',
  referenceUrls: ['https://game.capcom.com/cfn/sfv/column-130231?lang=en', 'https://captown.capcom.com/fr/museums/histories', 'https://news.capcomusa.com/lets/browse/capcom-fighting-collection-2-game-spotlights'],
  characters: [
    { id: 'batsu', name: 'Batsu Ichimonji', role: 'slayer', weapon: 'Ichimonji martial arts', weaponType: 'fists', simple: 'Guts Bullet', secondary: 'Air Guts Bullet', defense: 'Taiyo counter', special: 'Maximum Batsu', visualAnchor: 'Fiery Japanese high-school fighter with spiky dark hair, open blue Taiyo jacket, chain-mail shirt and red gloves.', fr: 'Élève transféré de Taiyo qui recherche sa mère enlevée.', en: 'Taiyo transfer student searching for his kidnapped mother.' },
    { id: 'hinata', name: 'Hinata Wakaba', role: 'tactical', weapon: 'Ken Masters correspondence martial arts', weaponType: 'fists', simple: 'Rengekiken', secondary: 'Shōyōken', defense: 'Cheerful evade', special: 'Taiyo team-up', visualAnchor: 'Energetic schoolgirl martial artist with short brown hair, blue blazer, yellow bow and practical skirt-over-shorts movement.', fr: 'Hinata rejoint immédiatement l’enquête et maîtrise un style martial appris par correspondance.', en: 'Hinata immediately joins the investigation and masters a correspondence-taught martial art.' },
    { id: 'kyosuke', name: 'Kyosuke Kagami', role: 'tactical', weapon: 'Kagami martial arts', weaponType: 'fists', simple: 'Cross Cutter', secondary: 'Shadow Cut Kick', defense: 'Disciplinary parry', special: 'Final Symphony', visualAnchor: 'Calm silver-haired Taiyo morals-committee student with round glasses, buttoned blue uniform and precise kicking stance.', fr: 'Le stratège du trio est lié aux Imawano et choisit finalement Taiyo contre Hyo.', en: 'The trio’s strategist is tied to the Imawano and ultimately chooses Taiyo over Hyo.' }
  ],
  monsters: [
    { id: 'akira_rival', name: 'Akira Kazama — Rival Match', weapon: 'Motorcycle-style martial arts', special: 'Daigo team-up', visualAnchor: 'Teen biker martial artist in white skull motorcycle helmet and dark Gedo riding gear, no realistic school violence.', fr: 'Akira affronte les équipes pendant sa propre enquête ; elle n’est pas une sbire.', en: 'Akira faces teams during her own investigation; she is not a minion.', canonStatus: 'canon rival fighter, not villain' },
    { id: 'roy_rival', name: 'Roy Bromwell — Rival Match', weapon: 'American football strikes', special: 'Pacific team-up', visualAnchor: 'Blond Pacific High athlete in red-white varsity uniform with football-inspired stance.', fr: 'Roy représente Pacific High dans un affrontement interscolaire.', en: 'Roy represents Pacific High in an interschool match.', canonStatus: 'canon rival fighter, not villain' },
    { id: 'shoma_rival', name: 'Shoma Sawamura — Rival Match', weapon: 'Baseball bat techniques', special: 'Gorin team-up', visualAnchor: 'Hot-blooded teen baseball player in white-blue Gorin uniform, cap and stylized wooden bat.', fr: 'Shoma est un rival sportif de Gorin, pas un ennemi moral.', en: 'Shoma is a sporting Gorin rival, not a moral enemy.', canonStatus: 'canon rival fighter, not villain' }
  ],
  bosses: [
    { id: 'raizo_brainwashed', name: 'Raizo Imawano — Brainwashed', weapon: 'Imawano claw style', special: 'Justice High power rush', visualAnchor: 'Massive Justice High principal with swept gray hair, dark formal uniform and clawed martial stance, eyes marked by mind control.', fr: 'Raizo est présenté comme responsable avant que son contrôle mental et Hyo ne soient révélés.', en: 'Raizo appears responsible before his mind control and Hyo’s role are revealed.', canonStatus: 'canon brainwashed apparent boss' },
    { id: 'hyo', name: 'Hyo Imawano', weapon: 'Imawano sword arts', special: 'True-mastermind assault', visualAnchor: 'Tall white-haired swordsman in immaculate black Justice uniform with long katana and severe posture.', fr: 'Hyo est le véritable organisateur de la crise du premier jeu.', en: 'Hyo is the true organizer of the first game’s crisis.', canonStatus: 'canon United by Fate true boss' },
    { id: 'kurow', name: 'Kurow Kirishima', weapon: 'Wire and knife techniques', special: 'Project Justice school manipulation', visualAnchor: 'Pale teen conspirator with dark tied hair, black-purple school clothes, thin wire and concealed knives.', fr: 'Kurow manipule les écoles dans Project Justice.', en: 'Kurow manipulates the schools in Project Justice.', canonStatus: 'canon Project Justice antagonist' }
  ],
  worldBoss: { id: 'demon_hyo', name: 'Demon Hyo — Mugen Possession', weapon: 'Possessed Imawano blade', special: 'Mugen spirit eruption', visualAnchor: 'Hyo’s uniform and sword overwhelmed by red-violet ancestral spirit energy, visibly the possessed Hyo rather than a generic demon.', fr: 'Dans la finale de Project Justice, l’esprit de Mugen possède Hyo.', en: 'In Project Justice’s finale, Mugen’s spirit possesses Hyo.', canonStatus: 'canon possessed final form', identityRule: 'Keep distinct from unpossessed Hyo boss entry.' },
  stage: { name: 'Taiyo High — cour du tournoi', visualAnchor: 'Sunny school courtyard, blue Taiyo banners as original abstract motifs, chain-link fence and cheering students.', fr: 'Les équipes se retrouvent dans la cour pour un duel en formation.', en: 'Teams meet in the courtyard for a formation match.' },
  stageVariants: [
    stageVariant('Smash', 'Justice High — salle du proviseur', 'Very Hard', 'Raizo Imawano — Brainwashed', { objective: 'Break Raizo’s control state, then reveal the real mastermind.' }),
    stageVariant('Smash', 'Project Justice — sanctuaire Imawano', 'Expert', 'Demon Hyo — Mugen Possession', { objective: 'Unite three school teams and sever Mugen’s possession.' })
  ],
  gear: [
    { id: 'taiyo_gloves', enName: 'Batsu’s Red Gloves', frName: 'Gants rouges de Batsu', boost: { atk: 6, spd: 1 }, visualAnchor: 'Pair of fingerless red martial gloves beside a blue uniform cuff.', fr: 'Les gants du style direct de Batsu.', en: 'The gloves of Batsu’s direct fighting style.' },
    { id: 'kyosuke_glasses', enName: 'Kyosuke’s Glasses', frName: 'Lunettes de Kyosuke', boost: { def: 5, spd: 2 }, visualAnchor: 'Thin round silver glasses with one reflected team formation.', fr: 'Les lunettes caractéristiques du tacticien de Taiyo.', en: 'The Taiyo tactician’s characteristic glasses.' },
    { id: 'team_vigor', enName: 'Team Vigor Emblem', frName: 'Emblème de vigueur d’équipe', boost: { hp: 55, atk: 3 }, visualAnchor: 'Original three-part interlocking school-team charm, no Capcom or school logo.', fr: 'Une adaptation matérielle de la jauge qui alimente les attaques en équipe.', en: 'A physical adaptation of the gauge powering team-up attacks.', canonStatus: 'transparent gameplay-system adaptation' }
  ],
  event: { id: 'team_up', enName: 'Taiyo Team-Up Attack', frName: 'Attaque combinée de Taiyo', en: 'Batsu calls Hinata and Kyosuke into a precise three-person formation, echoing Rival Schools’ defining team mechanic.', fr: 'Batsu appelle Hinata et Kyosuke dans une formation à trois qui reprend la mécanique fondatrice de Rival Schools.', visualAnchor: 'Three distinct Taiyo silhouettes entering from separate screen edges into one impact frame.' }
}));
}
