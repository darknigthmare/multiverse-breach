// SCP Foundation — definitions consumed by src/game/canonRosterWavePartB.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createScp() {
  return (Object.freeze({
  key: 'scp_foundation',
  universe: 'SCP Foundation',
  url: 'https://scp-wiki.wikidot.com/'
}));
}

export function createScpFoundation({ SCP, character, definePack, event, fidelity, gear, lore, scpExtra, scpLicense, stageMeta, stageVariant, threat }) {
  return (definePack(SCP, {
  aliases: ['SCP Wiki'],
  mediaType: 'collaborative-fiction',
  faction: 'horror',
  mode: 'Tactics',
  difficulty: 'Expert',
  colors: ['#28302d', '#050707', '#d7dfd9'],
  motif: 'facility',
  theme: 'containment procedures, secure facilities, Mobile Task Forces, anomalous hazards and restoration of containment',
  continuity: 'SCP Wiki collaborative canon; no single global continuity is asserted',
  adaptationRule: 'Victory means securing, evacuating or recontaining anomalies. Visuals are original text-led interpretations and never reuse the former SCP-173 photograph.',
  visualAnchor: 'Original brutalist containment facility, concrete, hazard markings, red emergency light and anonymous Foundation-style personnel; no former SCP-173 image and no copied fan art.',
  canonStatus: 'CC BY-SA 3.0 derivative adaptation of collaborative fiction',
  lore: lore('Une brèche de confinement réunit des rôles de la Fondation face à des anomalies issues de pages distinctes ; l’objectif final reste la reconfinement.', 'A containment breach brings Foundation roles against anomalies from separate pages; the final objective remains recontainment.'),
  licensing: scpLicense,
  referenceUrls: [SCP.url, scpLicense.guideUrl, 'https://scp-wiki.wikidot.com/secure-facilities-locations', 'https://scp-wiki.wikidot.com/site-19-dossier', 'https://scp-wiki.wikidot.com/task-forces', 'https://scp-wiki.wikidot.com/security-clearance-levels'],
  hero: character(SCP, 'mtf_epsilon_11', 'MTF Epsilon-11 Operative', 'marine', 'Anonymous Nine-Tailed Fox containment operative in original dark tactical equipment, sealed respirator, red facility light and no identifiable real-world unit patches.', lore('Un opérateur d’Epsilon-11 intervient lorsque les protocoles internes échouent.', 'An Epsilon-11 operative responds when internal protocols fail.'), 'canon organisational role', { ...scpExtra('https://scp-wiki.wikidot.com/task-forces'), runtimeId: 'mtf_commander_scp', weapon: 'Containment Carbine', weaponType: 'gun', simple: 'Controlled Burst', secondary: 'Containment Foam', defense: 'Seal Position', special: 'Nine-Tailed Fox Advance' }),
  allies: [
    character(SCP, 'researcher', 'Foundation Researcher', 'hacker', 'Anonymous researcher in practical lab coat, facility badge with unreadable details, tablet and sample case; original face and no named author-avatar likeness.', lore('Le chercheur identifie les procédures utiles sans prétendre représenter un personnage unique.', 'The researcher identifies useful procedures without claiming to be one unique character.'), 'canon-derived organisational role', { ...scpExtra('https://scp-wiki.wikidot.com/security-clearance-levels'), runtimeId: 'researcher_scp', simple: 'Procedure Scan', secondary: 'Anomaly Index', defense: 'Emergency Protocol', special: 'Containment Revision' }),
    character(SCP, 'scp_999', 'SCP-999', 'tactical', 'Text-led friendly orange gelatinous mass with a soft amorphous body, rounded pseudopods and playful posture; original design based on the article description, with no copied fan illustration.', lore('SCP-999 coopère par curiosité et diffuse son effet euphorisant pour calmer la zone d’évacuation.', 'SCP-999 cooperates out of curiosity and uses its euphoric effect to calm the evacuation zone.'), 'article-derived friendly anomaly', { ...scpExtra('https://scp-wiki.wikidot.com/scp-999'), runtimeId: 'scp_999_echo', simple: 'Joyful Bounce', secondary: 'Euphoric Contact', defense: 'Gelatinous Cushion', special: 'Orange Tickle Wave' })
  ],
  monsters: [
    threat(SCP, 'scp_049', 'SCP-049', 'lethal touch and medical instruments', 'Pestilence Diagnosis', 'Text-led original interpretation of a humanoid plague-doctor silhouette in black robes with the pale beaked facial structure described by its article; no copied illustration.', lore('SCP-049 cherche à traiter ce qu’il nomme la Pestilence.', 'SCP-049 seeks to treat what it calls the Pestilence.'), 'article-derived anomaly', scpExtra('https://scp-wiki.wikidot.com/scp-049')),
    threat(SCP, 'scp_939', 'SCP-939', 'voice mimicry and pack ambush', 'Mimicked Call', 'Text-led original red quadrupedal predator with elongated limbs, exposed translucent tissues and eyeless head, avoiding any single fan-art pose.', lore('SCP-939 attire ses proies en imitant des voix humaines.', 'SCP-939 lures prey by mimicking human voices.'), 'article-derived anomaly', scpExtra('https://scp-wiki.wikidot.com/scp-939')),
    threat(SCP, 'scp_008', 'SCP-008 Exposure Cloud', 'infectious aerosol zone', 'Quarantine Spread', 'Sealed green sample vial and translucent biohazard cloud inside an original containment chamber; no humanoid mascot or gore.', lore('Une fuite de SCP-008 devient une zone à isoler plutôt qu’un personnage inventé.', 'An SCP-008 leak becomes a zone to isolate rather than an invented character.'), 'article-derived environmental anomaly', scpExtra('https://scp-wiki.wikidot.com/scp-008'))
  ],
  bosses: [
    threat(SCP, 'scp_096', 'SCP-096', 'high-speed pursuit after facial exposure', 'Triggered Pursuit', 'Text-led pale, emaciated humanoid with very long limbs, crouched with face completely hidden by its hands; never show the face.', lore('SCP-096 entre dans un état de poursuite lorsqu’un visage est observé.', 'SCP-096 enters a pursuit state when its face is observed.'), 'article-derived anomaly', scpExtra('https://scp-wiki.wikidot.com/scp-096')),
    threat(SCP, 'scp_106', 'SCP-106', 'corrosive passage and pocket dimension', 'Corrosion Breach', 'Text-led elderly humanoid silhouette coated in black corrosive residue, emerging from a rusted concrete wall; no copied fan art.', lore('SCP-106 traverse la matière corrodée et entraîne ses cibles dans sa dimension de poche.', 'SCP-106 crosses corroded matter and draws targets into its pocket dimension.'), 'article-derived anomaly', scpExtra('https://scp-wiki.wikidot.com/scp-106')),
    threat(SCP, 'scp_079', 'SCP-079', 'facility-system control', 'Old AI Lockdown', 'Original 1970s microcomputer terminal inspired by the article’s Exidy Sorcerer hardware, green monochrome display and cable-controlled security doors; no trademark logo.', lore('SCP-079 détourne les systèmes de la zone pendant la brèche.', 'SCP-079 hijacks facility systems during the breach.'), 'article-derived anomaly', scpExtra('https://scp-wiki.wikidot.com/scp-079'))
  ],
  worldBoss: threat(SCP, 'scp_682', 'SCP-682', 'adaptive reptilian body and structural breach', 'Containment Adaptation', 'Text-led massive reptilian anomaly with heavily scarred, repeatedly regenerating anatomy in a damaged acid-resistant chamber; original design rather than any one fan image.', lore('SCP-682 profite de la brèche ; la mission restaure sa cellule et le ramène sous contrôle.', 'SCP-682 exploits the breach; the mission restores its cell and brings it back under control.'), 'article-derived recontainment objective', { ...scpExtra('https://scp-wiki.wikidot.com/scp-682'), layout: 'kaiju', objective: 'Restore the containment systems, immobilise SCP-682 and recontain it in the secured chamber.', objectiveFr: 'Rétablir les systèmes de confinement, immobiliser SCP-682 puis le reconfiner dans la chambre sécurisée.', phases: ['Seal the breached perimeter and restore acid-delivery controls', 'Immobilise the adapting anomaly and complete reconfinement'] }),
  stage: 'Site-19 Containment Breach',
  stageMeta: stageMeta(SCP, 'Original concrete SCP facility with sealed numbered doors, red alarms, observation glass and modular containment corridors; no SCP-173 imagery.', 'Le site est une interprétation originale des installations décrites sur le wiki.', 'The site is an original interpretation of facilities described across the wiki.', 'CC BY-SA derivative facility',),
  stageVariants: [
    stageVariant('Tactics', 'Old AI Containment Wing', 'Expert', 'SCP-079', fidelity(SCP, '1970s terminal chamber linked to red-lit security doors and green monochrome monitors.', lore('L’aile isole le matériel ancien de SCP-079.', 'The wing isolates SCP-079’s old hardware.'), 'CC BY-SA derivative stage', scpExtra('https://scp-wiki.wikidot.com/scp-079'))),
    stageVariant('Smash', 'SCP-682 Emergency Reconfinement', 'Expert', 'SCP-682', fidelity(SCP, 'Huge reinforced chamber with damaged acid-resistant basin, layered blast doors and remote restraint systems.', lore('L’arène sert uniquement à la reconfinement de SCP-682.', 'The arena exists solely to recontain SCP-682.'), 'CC BY-SA derivative stage', scpExtra('https://scp-wiki.wikidot.com/scp-682')))
  ],
  gear: [
    gear(SCP, 'containment_foam', 'Containment Foam Canister', 'Bonbonne de mousse de confinement', { def: 8, hp: 40 }, 'Original industrial canister with blank hazard bands and foam nozzle; no copied prop.', lore('La mousse ralentit une brèche le temps de fermer les portes.', 'The foam slows a breach while doors close.'), 'canon-inspired gameplay tool'),
    gear(SCP, 'scramble_visor', 'Censored Observation Visor', 'Visière d’observation censurée', { def: 6, spd: 1 }, 'Original sealed visor displaying a solid facial-censor block, with no claim of perfect anomaly protection.', lore('La visière matérialise une procédure d’observation prudente.', 'The visor represents cautious observation procedure.'), 'fan-made containment tool'),
    gear(SCP, 'access_card', 'Facility Access Card', 'Carte d’accès du site', { spd: 2, hp: 45 }, 'Original blank Foundation-style access card with geometric clearance bars and unreadable personal data.', lore('La carte ouvre les itinéraires d’urgence autorisés.', 'The card opens authorised emergency routes.'), 'canon-derived facility prop')
  ],
  event: event(SCP, 'site_lockdown', 'Site Lockdown', 'Confinement général du site', 'Every restored door shortens the breach and advances the final recontainment procedure.', 'Chaque porte restaurée réduit la brèche et fait avancer la procédure finale de reconfinement.', 'Original concrete control room with red lockdown lamps and a clean containment-map diagram.', 'CC BY-SA derivative event')
}));
}
