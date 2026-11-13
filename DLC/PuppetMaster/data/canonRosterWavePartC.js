// Puppet Master — definitions consumed by src/game/canonRosterWavePartC.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPuppetMaster() {
  return (Object.freeze({
  key: 'puppet_master',
  universe: 'Puppet Master',
  url: 'https://www.fullmoonfeatures.com/puppet-master-series'
}));
}

export function createPuppetMaster2({ PUPPET_MASTER, definePack, stageVariant }) {
  return (definePack(PUPPET_MASTER, {
  aliases: ['Puppetmaster'],
  mediaType: 'movie', faction: 'horror', mode: 'RPG', difficulty: 'Very Hard',
  colors: ['#32231d', '#070403', '#b64938'], motif: 'puppetworkshop',
  theme: 'Full Moon’s Toulon puppet continuity and battles against supernatural or human controllers',
  continuity: 'Puppet Master film series; individual threats labelled by their film arc',
  adaptationRule: 'Blade, Pinhead and Six Shooter are Toulon puppets at their precise puppet scale, not generic killer dolls. Preserve their differing tools and shifting heroic allegiance. Sutekh/Sutec is the supernatural world threat.',
  visualAnchor: 'Bodega Bay Inn corridors and Toulon workshop at puppet scale, dark wood, brass mechanisms, stop-motion framing and small practical props.',
  canonStatus: 'Full Moon film-series roster with film-specific threat labels',
  fr: 'Blade, Pinhead et Six Shooter défendent l’héritage de Toulon contre les totems de Sutekh et ceux qui cherchent à détourner son secret d’animation.',
  en: 'Blade, Pinhead and Six Shooter defend Toulon’s legacy against Sutekh’s Totems and people seeking to exploit his animation secret.',
  referenceUrls: [PUPPET_MASTER.url, 'https://www.fullmoonfeatures.com/videos/puppet-master-4', 'https://www.fullmoonfeatures.com/videos/puppet-master-5', 'https://www.fullmoonfeatures.com/puppet-master-6-curse', 'https://www.fullmoonfeatures.com/puppet-master-10-axis-rising'],
  characters: [
    { id: 'blade', runtimeId: 'blade_puppet', name: 'Blade', role: 'slayer', weapon: 'Hook and knife hands', weaponType: 'blade', simple: 'Knife-hand slash', secondary: 'Hook pull', defense: 'Puppet-scale sidestep', special: 'Toulon ambush', visualAnchor: 'Small puppet in black trench coat and wide-brim hat, pale skull-like face, one knife hand and one hook hand; maintain puppet scale.', fr: 'Blade est le chef silencieux reconnaissable à ses mains-lame et crochet.', en: 'Blade is the silent leader recognized by his knife and hook hands.' },
    { id: 'pinhead', runtimeId: 'pinhead_puppet', name: 'Pinhead', role: 'marine', weapon: 'Oversized puppet fists', weaponType: 'fists', simple: 'Heavy punch', secondary: 'Puppet grapple', defense: 'Compact brace', special: 'Pinhead lift', visualAnchor: 'Small puppet with tiny bald porcelain head, broad fabric torso, huge humanlike hands and brown knit clothing; maintain puppet scale.', fr: 'Pinhead concentre une force disproportionnée dans ses grandes mains.', en: 'Pinhead concentrates disproportionate strength in his enormous hands.' },
    { id: 'six_shooter', runtimeId: 'six_shooter_puppet', name: 'Six Shooter', role: 'marine', weapon: 'Six miniature revolvers', weaponType: 'gun', simple: 'Single revolver volley', secondary: 'Six-arm crossfire', defense: 'Cowboy spin', special: 'Full six-gun salvo', visualAnchor: 'Six-armed cowboy puppet with brown hat, red neckerchief, blue shirt and one miniature revolver in each hand; maintain puppet scale.', fr: 'Le cow-boy à six bras couvre la pièce avec ses six revolvers.', en: 'The six-armed cowboy covers the room with six revolvers.' }
  ],
  monsters: [
    { id: 'totem_puppet', name: 'Totem Puppet', weapon: 'Claws and fangs', special: 'Sutekh essence drain', visualAnchor: 'Small demonic Totem creature with rough brown-green skin, pointed head and glowing eyes, scaled against workshop tools.', fr: 'Les Totems de Puppet Master 4 et 5 servent Sutekh et chassent le secret de Toulon.', en: 'The Totems in Puppet Master 4 and 5 serve Sutekh and hunt Toulon’s secret.', canonStatus: 'canon Puppet Master 4–5 creature' },
    { id: 'blitzkrieg', name: 'Blitzkrieg', weapon: 'Mounted guns', special: 'Axis puppet barrage', visualAnchor: 'Axis-made mechanical puppet with military metal shell and integrated miniature guns, no real-world hate symbols.', fr: 'Blitzkrieg appartient aux poupées Axis de la continuité Axis Rising.', en: 'Blitzkrieg belongs to the Axis puppets in the Axis Rising continuity.', canonStatus: 'canon Axis Rising enemy puppet', symbolPolicy: 'Omit real-world extremist insignia.' },
    { id: 'weremacht', name: 'Weremacht', weapon: 'Wolf claws', special: 'Mechanical lunge', visualAnchor: 'Small mechanical werewolf soldier puppet with gray fur plates and steel jaw, no real-world hate symbols.', fr: 'Weremacht est une poupée Axis à forme de loup mécanique.', en: 'Weremacht is an Axis puppet built as a mechanical wolf.', canonStatus: 'canon Axis Rising enemy puppet', symbolPolicy: 'Omit real-world extremist insignia.' }
  ],
  bosses: [
    { id: 'dr_jennings', name: 'Dr. Jennings', weapon: 'Stolen animation formula', special: 'Puppet laboratory betrayal', visualAnchor: 'Human researcher in a dark 1990s suit at a puppet-scale laboratory bench, no actor likeness.', fr: 'Jennings cherche à exploiter et vendre le secret d’animation dans Puppet Master 5.', en: 'Jennings seeks to exploit and sell the animation secret in Puppet Master 5.', canonStatus: 'canon Puppet Master 5 human antagonist' },
    { id: 'dr_magrew', name: 'Dr. Magrew', weapon: 'Puppet experimentation', special: 'Curse workshop trap', visualAnchor: 'Older puppet maker in worn workshop apron surrounded by unfinished wooden bodies, no actor likeness or gore.', fr: 'Magrew mène des expériences meurtrières dans Curse of the Puppet Master.', en: 'Magrew conducts lethal experiments in Curse of the Puppet Master.', canonStatus: 'canon Curse of the Puppet Master antagonist' },
    { id: 'commandant_moebius', name: 'Commandant Moebius', weapon: 'Axis command weapons', special: 'Axis puppet deployment', visualAnchor: 'Human Axis commander in period military silhouette at a miniature-puppet command table, no actor likeness or extremist insignia.', fr: 'Moebius commande les forces opposées aux poupées dans l’arc Axis.', en: 'Moebius commands forces opposing the puppets in the Axis arc.', canonStatus: 'canon Axis Rising human antagonist', symbolPolicy: 'Omit real-world extremist insignia.' }
  ],
  worldBoss: { id: 'sutekh', name: 'Sutekh / Sutec', weapon: 'Totem creation', special: 'Life-force extraction', visualAnchor: 'Immense otherworldly demon shown through a portal above tiny Totem puppets, ancient angular face and green-gold supernatural energy.', fr: 'Sutekh, nommé Sutec sur la page officielle de Puppet Master 5, envoie ses Totems voler le secret de l’animation.', en: 'Sutekh, written Sutec on the official Puppet Master 5 page, sends Totems to steal the animation secret.', canonStatus: 'canon Puppet Master 4–5 overarching antagonist', entityType: 'supernatural-world-boss', aliases: ['Sutec'], objective: 'Defeat the Totems and close Sutekh’s portal before the animation secret is drained.' },
  stage: { name: 'Bodega Bay Inn — atelier à l’échelle des poupées', visualAnchor: 'Dark wood hotel workshop viewed from floor height, giant human-scale furniture, brass puppet tools and small hidden passages.', fr: 'Les poupées traversent l’atelier de Toulon à leur échelle réelle.', en: 'The puppets cross Toulon’s workshop at their true scale.' },
  stageVariants: [
    stageVariant('Smash', 'Atelier du Dr Magrew', 'Very Hard', 'Dr. Magrew', { objective: 'Free unfinished puppets and stop the human-scale machinery.' }),
    stageVariant('RPG', 'Tombeau de Sutekh — portail des Totems', 'Expert', 'Sutekh / Sutec', { objective: 'Break each Totem link, then close the portal.' })
  ],
  gear: [
    { id: 'toulon_formula', enName: 'Toulon Animation Formula', frName: 'Formule d’animation de Toulon', boost: { atk: 7, spd: 1 }, visualAnchor: 'Small green-glowing vial held in puppet-scale brass cradle, no copied label.', fr: 'Le secret qui donne vie aux poupées de Toulon.', en: 'The secret that gives Toulon’s puppets life.' },
    { id: 'blade_hook', enName: 'Blade’s Hook Hand', frName: 'Main-crochet de Blade', boost: { def: 6, hp: 45 }, visualAnchor: 'Tiny polished metal hook with black puppet cuff and visible stop-motion joint pin.', fr: 'Le crochet caractéristique de Blade.', en: 'Blade’s characteristic hook.' },
    { id: 'six_revolvers', enName: 'Six Shooter Revolver Set', frName: 'Jeu de revolvers de Six Shooter', boost: { hp: 55, atk: 5 }, visualAnchor: 'Six matching miniature western revolvers arranged in a puppet-scale leather rack.', fr: 'Les six armes miniatures du cow-boy.', en: 'The cowboy puppet’s six miniature weapons.' }
  ],
  event: { id: 'toulon_awakening', enName: 'Toulon Puppet Awakening', frName: 'Éveil des poupées de Toulon', en: 'The formula reactivates every loyal puppet at true scale while the workshop itself becomes their cover.', fr: 'La formule réactive chaque poupée fidèle à sa véritable échelle tandis que l’atelier devient leur couverture.', visualAnchor: 'Tiny puppet eyes activating one by one among oversized brass workshop tools.' }
}));
}
