// The Purge — definitions consumed by src/game/canonRosterWavePartC.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPurge() {
  return (Object.freeze({
  key: 'the_purge_2013',
  universe: 'The Purge',
  url: 'https://www.universalpicturesathome.com/movies/the-purge'
}));
}

export function createThePurge({ PURGE, definePack, stageVariant }) {
  return (definePack(PURGE, {
  aliases: ['American Nightmare', 'American Nightmare (The Purge)', 'The Purge (2013)'],
  mediaType: 'movie', faction: 'horror', mode: 'Tactics', difficulty: 'Expert',
  colors: ['#1c2741', '#030406', '#d84d42'], motif: 'suburbanhouse',
  theme: 'the Sandin family’s twelve-hour siege in the first 2013 film',
  continuity: 'The Purge (2013) first film only; excludes later-film protagonists and television continuity',
  adaptationRule: 'Use only the 2013 Sandin-house continuity. The world boss is the legal and social event “Purge Night,” not an invented supervillain. Victory means protecting the family and surviving until the morning siren.',
  visualAnchor: 'Affluent suburban home under blue security light, reinforced shutters, masked intruders outside and blue Purge-support flowers used as an ominous social symbol.',
  canonStatus: '2013 first-film canon with systemic noncombat finale',
  fr: 'James, Mary et Zoey Sandin défendent leur famille pendant les douze heures où tout crime est légal, jusqu’à la sirène du matin.',
  en: 'James, Mary and Zoey Sandin protect their family through the twelve hours when all crime is legal, until the morning siren.',
  referenceUrls: [PURGE.url, 'https://assets.scriptslug.com/live/pdf/scripts/the-purge-2013.pdf', 'https://www.imdb.com/title/tt2184339/fullcredits/'],
  characters: [
    { id: 'james_sandin', name: 'James Sandin', role: 'tactical', weapon: 'Home security controls', weaponType: 'focus', simple: 'Shutter reroute', secondary: 'Defensive flashlight', defense: 'Family cover', special: 'Emergency security reset', visualAnchor: 'Affluent father in a dark home shirt and trousers using a compact security remote; no actor likeness.', fr: 'James a vendu les systèmes de sécurité du quartier et doit désormais protéger sa propre maison.', en: 'James sold the neighborhood’s security systems and now must protect his own home.' },
    { id: 'mary_sandin', name: 'Mary Sandin', role: 'horror', weapon: 'Household defense', weaponType: 'improvised', simple: 'Defensive strike', secondary: 'Hidden-route rescue', defense: 'Protect the children', special: 'Refuse the neighbors’ purge', visualAnchor: 'Mother in practical pale home clothes moving through dark corridors with a flashlight; no actor likeness.', fr: 'Mary maintient ses enfants en vie et refuse finalement la logique meurtrière des voisins.', en: 'Mary keeps her children alive and ultimately rejects the neighbors’ murderous logic.' },
    { id: 'zoey_sandin', name: 'Zoey Sandin', role: 'hacker', weapon: 'House intercom', weaponType: 'focus', simple: 'Intercom diversion', secondary: 'Camera blind spot', defense: 'Secret hiding place', special: 'Family route signal', visualAnchor: 'Teenage daughter in casual home clothes with a small intercom tablet, presented without actor likeness or sexualization.', fr: 'Zoey utilise sa connaissance des cachettes et des angles morts de la maison.', en: 'Zoey uses her knowledge of the house’s hiding places and blind spots.' }
  ],
  monsters: [
    { id: 'interrupting_freak_purger', name: 'Interrupting Freak Purger', weapon: 'Intruder weapon', special: 'Masked doorway rush', visualAnchor: 'Young masked intruder in formal prep-school-style clothing, mask based on the film’s unsettling smile without actor likeness.', fr: 'Un assaillant nommé ainsi au générique du premier film.', en: 'An attacker identified by this credit label in the first film.', canonStatus: 'canon 2013 credited Purger' },
    { id: 'blonde_female_freak_purger', name: 'Blonde Female Freak Purger', weapon: 'Intruder blade', special: 'Hallway ambush', visualAnchor: 'Female masked intruder in dark formal clothing and a fixed-smile Purger mask, no actor likeness.', fr: 'Une assaillante identifiée par son intitulé de générique.', en: 'An attacker identified by her credit label.', canonStatus: 'canon 2013 credited Purger' },
    { id: 'hostile_neighbors', name: 'Hostile Sandin Neighbors', weapon: 'Household weapons', special: 'False rescue', visualAnchor: 'Small suburban neighbor group in tidy evening clothes carrying blue-flower emblems, faces kept original and non-identical to actors.', fr: 'Les voisins menés par Grace Ferrin feignent le secours avant de retourner la violence contre les Sandin.', en: 'The neighbors led by Grace Ferrin pretend to rescue the Sandins before turning violence against them.', canonStatus: 'canon 2013 neighbor group', members: ['Mr. Cali', 'Mr. Halverson', 'Mr. Ferrin'] }
  ],
  bosses: [
    { id: 'henry', name: 'Henry', weapon: 'Handgun', special: 'Zoey bedroom confrontation', visualAnchor: 'Zoey’s older boyfriend in ordinary clothes with a concealed handgun, no actor likeness and no glamorized pose.', fr: 'Henry révèle son intention hostile à l’intérieur de la maison.', en: 'Henry reveals his hostile intent inside the house.', canonStatus: 'canon 2013 antagonist' },
    { id: 'grace_ferrin', name: 'Mrs. Grace Ferrin', weapon: 'Neighbor conspiracy', special: 'Jealousy-fueled betrayal', visualAnchor: 'Wealthy neighbor in neat suburban evening wear with blue flowers and a cold social smile; no actor likeness.', fr: 'Grace conduit les voisins jaloux contre la famille après le premier siège.', en: 'Grace leads the jealous neighbors against the family after the first siege.', canonStatus: 'canon 2013 secondary antagonist', entityType: 'social-antagonist' },
    { id: 'polite_leader', name: 'Polite Leader', weapon: 'Firearm and siege command', special: 'Security breach ultimatum', visualAnchor: 'Preppy young Purger in dark blazer with a smiling translucent mask carried or worn, no actor likeness.', fr: 'Le chef poli dirige le groupe masqué et impose son ultimatum aux Sandin.', en: 'The Polite Leader commands the masked group and delivers his ultimatum to the Sandins.', canonStatus: 'canon 2013 principal human attacker' }
  ],
  worldBoss: { id: 'purge_night', name: 'Purge Night — 12-Hour Siege', weapon: 'Systemic legal violence', special: 'Citywide countdown', visualAnchor: 'The Sandin house in blackout with security map, clock progression and distant emergency siren; represent an event, not a humanoid monster.', fr: 'La véritable épreuve finale est de garder la famille en vie jusqu’à la fin légale de la Purge.', en: 'The true final trial is keeping the family alive until the Purge legally ends.', canonStatus: 'canon systemic event; explicitly noncombat world objective', entityType: 'systemic-survival-event', nonCombat: true, objective: 'Protect the Sandin family and survive until the 7:00 a.m. siren.', objectiveFr: 'Protéger la famille Sandin et survivre jusqu’à la sirène de 7 h.', victoryCondition: 'survive-until-morning', spritePrompt: 'Original fan-made pixel-art objective sheet: fortified suburban house through four night-to-dawn states, security shutters and clock lighting only. No person, logo, text, gore or actor likeness.' },
  stage: { name: 'Maison Sandin — système verrouillé', visualAnchor: 'Dark modern suburban interior, reinforced metal shutters, blue security monitors and hidden passages.', fr: 'La maison sécurisée devient un labyrinthe lorsque les intrus percent le périmètre.', en: 'The secured home becomes a maze when intruders breach the perimeter.' },
  stageVariants: [
    stageVariant('RPG', 'Sous-sol et passages de sécurité', 'Very Hard', 'Polite Leader', { objective: 'Move the family between safe rooms and prevent a full breach.' }),
    stageVariant('Tactics', 'Compte à rebours jusqu’à la sirène', 'Expert', 'Purge Night — 12-Hour Siege', { objective: 'Survive and protect every family member until 7:00 a.m.', nonCombat: true })
  ],
  gear: [
    { id: 'security_remote', enName: 'Sandin Security Remote', frName: 'Télécommande de sécurité Sandin', boost: { atk: 5, spd: 2 }, visualAnchor: 'Compact house-security remote with shutter diagram and original unreadable interface.', fr: 'La télécommande contrôle les volets et les zones sûres.', en: 'The remote controls shutters and safe zones.' },
    { id: 'reinforced_shutter', enName: 'Reinforced Security Shutter', frName: 'Volet de sécurité renforcé', boost: { def: 8, hp: 50 }, visualAnchor: 'Ribbed steel home shutter with visible locking bolts and damaged hinge.', fr: 'Une barrière temporaire, pas une garantie absolue.', en: 'A temporary barrier, not an absolute guarantee.' },
    { id: 'morning_siren', enName: 'Morning Siren Timer', frName: 'Minuteur de la sirène du matin', boost: { hp: 75 }, visualAnchor: 'Simple emergency timer shifting from dark blue to dawn amber, no copied UI text.', fr: 'Le compte à rebours qui définit la condition de victoire.', en: 'The countdown that defines the victory condition.' }
  ],
  event: { id: 'morning_ceasefire', enName: 'Morning Ceasefire', frName: 'Cessez-le-feu du matin', en: 'The legal window closes, the siren sounds and every remaining attacker must stand down.', fr: 'La fenêtre légale se ferme, la sirène retentit et tous les assaillants restants doivent cesser le combat.', visualAnchor: 'Cold blue house lighting turning to sunrise amber as reinforced shutters unlock.' }
}));
}
