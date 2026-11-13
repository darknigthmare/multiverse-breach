// Extreme Ghostbusters — definitions consumed by src/game/canonRosterWavePartF.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExtremeGhostbusters() {
  return (Object.freeze({ key: 'extreme_ghostbusters', universe: 'Extreme Ghostbusters', url: 'https://www.sonypictures.com/tv/extremeghostbustersthecompleteseries' }));
}

export function createExtremeGhostbusters2({ EXTREME_GHOSTBUSTERS, definePack, stageVariant }) {
  return (definePack(EXTREME_GHOSTBUSTERS, {
  aliases: ['Extreme Ggostbuster', 'Extrême Ghostbusters', 'Extreme Ghostbusters: The Complete Series'],
  mediaType: 'animated-series', faction: 'occult', mode: 'RPG', difficulty: 'Hard',
  colors: ['#362b47', '#08070d', '#8be35b'], motif: 'firehouse',
  theme: 'Egon’s next-generation New York team containing episodic supernatural threats',
  continuity: 'Extreme Ghostbusters 1997 animated series',
  adaptationRule: 'Use the 1997 students and Egon-era equipment. Ghosts are trapped or banished according to each episode, not killed. Keep Garrett’s sports wheelchair integral and capable; omit actor likenesses and the franchise logo.',
  visualAnchor: 'Gritty 1990s New York, angular dark uniforms, green ectoplasm, Ecto-1 and rebuilt proton equipment in Firehouse 23.',
  canonStatus: 'Sony animated-series canon with capture-focused combat adaptation',
  fr: 'Kylie, Eduardo et Garrett appliquent les cours d’Egon sur le terrain lorsque les phénomènes surnaturels reviennent à New York.',
  en: 'Kylie, Eduardo and Garrett put Egon’s classes into practice when supernatural activity returns to New York.',
  referenceUrls: [EXTREME_GHOSTBUSTERS.url, 'https://www.spookcentral.tk/media/sclib/egb_script_grundelesque.pdf', 'https://www.spookcentral.tk/media/sclib/egb_script_dreams_1997-03-24.pdf'],
  characters: [
    { id: 'kylie_griffin', name: 'Kylie Griffin', role: 'hacker', weapon: 'Proton pistol', weaponType: 'gun', simple: 'Proton pistol pulse', secondary: 'Occult counter-sign', defense: 'Trap-pack roll', special: 'Spirit Guide seal', visualAnchor: 'Small goth occult expert with black bob, dark fitted field uniform, compact proton pistol and backpack ghost trap.', fr: 'Experte de l’occulte qui porte un pistolet à protons et le piège dorsal.', en: 'The team’s occult expert, carrying a proton pistol and backpack trap.' },
    { id: 'eduardo_rivera', name: 'Eduardo Rivera', role: 'slayer', weapon: 'Proton pack', weaponType: 'gun', simple: 'Proton stream', secondary: 'Improvised distraction', defense: 'Firehouse sidestep', special: 'Rivera containment sweep', visualAnchor: 'Lean young Latino Ghostbuster with long dark hair, red shirt under asymmetrical dark gear and rebuilt proton pack; original face.', fr: 'Le sceptique sarcastique du groupe se montre fiable lorsque l’équipe est menacée.', en: 'The team’s sarcastic skeptic proves dependable when the others are threatened.' },
    { id: 'garrett_miller', name: 'Garrett Miller', role: 'marine', weapon: 'Proton pack', weaponType: 'gun', simple: 'Wheelchair proton sweep', secondary: 'Athletic ram turn', defense: 'Wheel pivot', special: 'Adrenaline containment run', visualAnchor: 'Muscular young athlete in a rugged custom sports wheelchair, dark Ghostbuster field jacket and proton pack mounted without obscuring the chair.', fr: 'Athlète téméraire, Garrett manœuvre son fauteuil avec autant d’assurance que le matériel à protons.', en: 'A fearless athlete, Garrett handles his wheelchair as confidently as the proton gear.', representationRule: 'Never depict the wheelchair as damage, weakness or temporary equipment.' }
  ],
  monsters: [
    { id: 'mole_people_parasite', name: 'Mole-People Power Parasite', weapon: 'Electrical drain', special: 'Grid feeding', visualAnchor: 'Pale subterranean paranormal parasite wrapped around power cables beneath Manhattan.', fr: 'Une menace des tunnels qui se nourrit du réseau électrique.', en: 'A tunnel threat feeding on the electrical grid.', canonStatus: 'canon episodic supernatural threat' },
    { id: 'grease_entity', name: 'Living Grease Entity', weapon: 'Adhesive sludge', special: 'Kitchen-spread surge', visualAnchor: 'Amber-black animated grease mass crawling through industrial kitchen vents, no food branding.', fr: 'Une masse surnaturelle de graisse vivante qui envahit les conduits.', en: 'A supernatural living grease mass spreading through vents.', canonStatus: 'canon Grease episode entity' },
    { id: 'fear_manifestation', name: 'Fear Manifestation', weapon: 'Phobia projection', special: 'Personal nightmare form', visualAnchor: 'Abstract shifting shadow composed of several angular phobia silhouettes, no realistic victim harm.', fr: 'La créature de Fear Itself prend la forme de peurs personnelles.', en: 'The Fear Itself creature takes the shape of personal fears.', canonStatus: 'canon episodic entity' }
  ],
  bosses: [
    { id: 'grundel', name: 'The Grundel', weapon: 'Childhood corruption', special: 'Grundelesque disguise', visualAnchor: 'Tall gaunt folklore ghost with long coatlike shadow, clawed silhouette and cold blue eyes; no child victim shown.', fr: 'Le Grundel revient en exploitant les failles d’une famille.', en: 'The Grundel returns by exploiting fractures within a family.', canonStatus: 'canon recurring Ghostbusters entity' },
    { id: 'tempus', name: 'Tempus', weapon: 'Time displacement', special: 'Future-New-York rewrite', visualAnchor: 'Clockwork spectral figure framed by fractured New York timelines and amber temporal arcs.', fr: 'Tempus projette l’équipe dans un futur où les fantômes dominent la ville.', en: 'Tempus throws the team into a future where ghosts dominate the city.', canonStatus: 'canon Ghost Apocalyptic Future antagonist' },
    { id: 'achira', name: 'Achira', weapon: 'Plague aura', special: 'Subway awakening', visualAnchor: 'Ancient angular demon rising through green vapor beneath an abandoned subway platform.', fr: 'Le démon réveillé au début de la série provoque le retour de l’activité paranormale.', en: 'The demon awakened at the start of the series triggers the return of paranormal activity.', canonStatus: 'canon Darkness at Noon antagonist', aliases: ['Akira'] }
  ],
  worldBoss: { id: 'samhain', name: 'Samhain', weapon: 'Night eternal', special: 'Ghost army release', visualAnchor: 'Pumpkin-headed spectral lord in tattered dark robes above the Firehouse containment glow, distinct from any generic jack-o-lantern mascot.', fr: 'Samhain revient lorsque les deux générations de Ghostbusters se réunissent.', en: 'Samhain returns when both Ghostbuster generations reunite.', canonStatus: 'canon Back in the Saddle overarching return threat' },
  stage: { name: 'Firehouse 23 — unité de confinement', visualAnchor: 'Brick firehouse basement with angular 1990s containment machinery, green warning glow and wheelchair-accessible ramps.', fr: 'Le retour des phénomènes met sous pression l’ancienne unité de confinement.', en: 'The paranormal resurgence puts the old containment unit under pressure.' },
  stageVariants: [
    stageVariant('RPG', 'Métro condamné — réveil d’Achira', 'Very Hard', 'Achira', { objective: 'Seal plague vents, cross the abandoned platform and trap Achira.' }),
    stageVariant('Tactics', 'New York d’Halloween — nuit de Samhain', 'Expert', 'Samhain', { objective: 'Restore the containment relays while both teams hold the ghost army.' })
  ],
  gear: [
    { id: 'proton_pistol', enName: 'Kylie’s Proton Pistol', frName: 'Pistolet à protons de Kylie', boost: { atk: 6, spd: 2 }, visualAnchor: 'Compact angular proton sidearm with green power cell and dark hand guard.', fr: 'La variante compacte utilisée par Kylie.', en: 'The compact proton variant used by Kylie.' },
    { id: 'backpack_trap', enName: 'Backpack Ghost Trap', frName: 'Piège à fantômes dorsal', boost: { def: 7, hp: 35 }, visualAnchor: 'Dark backpack trap with hinged intake and green containment lamp.', fr: 'Kylie transporte le piège principal sur son dos.', en: 'Kylie carries the main ghost trap on her back.' },
    { id: 'spirit_guide', enName: 'Spengler’s Spirit Guide', frName: 'Guide des esprits de Spengler', boost: { hp: 50, def: 4 }, visualAnchor: 'Thick battered occult reference book with abstract clasps and handwritten tabs, no readable title.', fr: 'Le manuel d’Egon aide Kylie à identifier les entités.', en: 'Egon’s manual helps Kylie identify entities.' }
  ],
  event: { id: 'two_generations', enName: 'Two Ghostbuster Generations', frName: 'Deux générations de Ghostbusters', en: 'Roland rebuilds the containment route while Egon coordinates the original and Extreme teams against Samhain.', fr: 'Roland reconstruit la route de confinement tandis qu’Egon coordonne les équipes originale et Extreme contre Samhain.', visualAnchor: 'Firehouse workshop with old and new proton silhouettes converging around a repaired containment relay.' }
}));
}
