// Unreal Tournament — definitions consumed by src/game/canonRosterWavePartC.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createUnrealTournament() {
  return (Object.freeze({
  key: 'unreal_tournament',
  universe: 'Unreal Tournament',
  url: 'https://unrealarchive.org/wikis/the-liandri-archives/UT_Single_Player.html'
}));
}

export function createUnrealTournament2({ UNREAL_TOURNAMENT, definePack, stageVariant }) {
  return (definePack(UNREAL_TOURNAMENT, {
  aliases: ['Unreal Tournament 99', 'UT99'],
  mediaType: 'game', faction: 'cyber', mode: 'Smash', difficulty: 'Expert',
  colors: ['#152342', '#03050b', '#55c8ff'], motif: 'arena',
  theme: 'Liandri Grand Tournament arena ladder and shared weapon pickups',
  continuity: 'Unreal Tournament (1999) PC ladder; Damien, Rampage and Dominator are explicitly sourced from the PS2/Dreamcast Final Challenge only',
  adaptationRule: 'Spell UT99’s champion Malcom with one L. Competitors are cosmetic player avatars with a shared arena arsenal, not heroes with canon superpowers. Console-only Final Challenge bosses must remain labelled as a port adaptation.',
  visualAnchor: 'Industrial Liandri arenas, blue-red team lighting, chunky late-1990s combat armor and weapon pickups on glowing pads.',
  canonStatus: 'UT99 PC roster with disclosed console-port boss sequence',
  fr: 'Malcom, Brock et Lauren gravissent une échelle du Grand Tournoi où les combattants partagent le même arsenal Liandri avant la finale contre Xan.',
  en: 'Malcom, Brock and Lauren climb the Grand Tournament ladder, where competitors share the same Liandri arsenal before the final against Xan.',
  referenceUrls: [UNREAL_TOURNAMENT.url, 'https://device.report/m/888837c9efe43e5436728fd6cae4a7b1f06dfac401acb46e8064871338c90b20.pdf', 'https://unrealarchive.org/wikis/the-liandri-archives/Thunder_Crash.html', 'https://unrealarchive.org/wikis/the-liandri-archives/Iron_Guard.html', 'https://unrealarchive.org/wikis/the-liandri-archives/The_Corrupt.html', 'https://unreal.fandom.com/wiki/Unreal_Tournament/Character_Cards'],
  characters: [
    { id: 'malcom', name: 'Malcom', role: 'marine', stats: { hp: 125, atk: 12, def: 7, spd: 5 }, weapon: 'Shared Tournament Arsenal', weaponType: 'gun', simple: 'Tournament Enforcer', secondary: 'Shared Arena Pickup', defense: 'Tournament Dodge', special: 'Liandri Arsenal Cycle', visualAnchor: 'Malcom in bulky blue-gray Thunder Crash armor, dark skin, close-cropped hair and no later-game costume additions.', fr: 'Malcom est le combattant de Thunder Crash présenté sous cette orthographe dans UT99.', en: 'Malcom is the Thunder Crash fighter presented with this spelling in UT99.', canonStatus: 'canon UT99 selectable competitor', team: 'Thunder Crash', uniqueAbility: false, adaptationNotice: 'Moves represent shared UT99 pickups, not character-exclusive powers.' },
    { id: 'brock', name: 'Brock', role: 'marine', stats: { hp: 125, atk: 12, def: 7, spd: 5 }, weapon: 'Shared Tournament Arsenal', weaponType: 'gun', simple: 'Tournament Enforcer', secondary: 'Shared Arena Pickup', defense: 'Tournament Dodge', special: 'Liandri Arsenal Cycle', visualAnchor: 'Brock in heavy Iron Guard combat armor with broad shoulder plates and late-1990s arena silhouette.', fr: 'Brock participe au tournoi au sein d’Iron Guard.', en: 'Brock competes in the tournament as part of Iron Guard.', canonStatus: 'canon UT99 selectable competitor', team: 'Iron Guard', uniqueAbility: false, adaptationNotice: 'Moves represent shared UT99 pickups, not character-exclusive powers.' },
    { id: 'lauren', name: 'Lauren', role: 'tactical', stats: { hp: 125, atk: 12, def: 7, spd: 5 }, weapon: 'Shared Tournament Arsenal', weaponType: 'gun', simple: 'Tournament Enforcer', secondary: 'Shared Arena Pickup', defense: 'Tournament Dodge', special: 'Liandri Arsenal Cycle', visualAnchor: 'Lauren in streamlined Iron Guard arena armor, tied-back hair and the same grounded late-1990s equipment language as Brock.', fr: 'Lauren est une compétitrice d’Iron Guard utilisant les mêmes armes ramassées que les autres joueurs.', en: 'Lauren is an Iron Guard competitor using the same pickups as every other player.', canonStatus: 'canon UT99 selectable competitor', team: 'Iron Guard', uniqueAbility: false, adaptationNotice: 'Moves represent shared UT99 pickups, not character-exclusive powers.' }
  ],
  monsters: [
    { id: 'vector', name: 'Vector', weapon: 'Shared Tournament Arsenal', special: 'Corrupt aim routine', visualAnchor: 'Vector as a sleek metallic The Corrupt combat android with glowing face panel and UT99 armor geometry.', fr: 'Vector est un combattant cybernétique de The Corrupt.', en: 'Vector is a cybernetic competitor from The Corrupt.', canonStatus: 'canon UT99 opponent', team: 'The Corrupt' },
    { id: 'cathode', name: 'Cathode', weapon: 'Shared Tournament Arsenal', special: 'Synchronized android dodge', visualAnchor: 'Cathode as a feminine-profile The Corrupt android with polished segmented plates and narrow luminous visor.', fr: 'Cathode appartient à l’équipe cybernétique The Corrupt.', en: 'Cathode belongs to the cybernetic team The Corrupt.', canonStatus: 'canon UT99 opponent', team: 'The Corrupt' },
    { id: 'matrix', name: 'Matrix', weapon: 'Shared Tournament Arsenal', special: 'Machine crossfire', visualAnchor: 'Matrix as a heavy The Corrupt android with angular silver-black plating and glowing optic strip.', fr: 'Matrix complète la ligne d’adversaires de The Corrupt.', en: 'Matrix completes the line of The Corrupt opponents.', canonStatus: 'canon UT99 opponent', team: 'The Corrupt' }
  ],
  bosses: [
    { id: 'damien', name: 'Damien', weapon: 'Shared Tournament Arsenal', special: 'Final Challenge pressure', visualAnchor: 'Console-port arena competitor card translated into an original full-body UT99-style armored fighter.', fr: 'Damien appartient à la séquence Final Challenge des versions console.', en: 'Damien belongs to the console versions’ Final Challenge sequence.', canonStatus: 'console-port-only Final Challenge boss', continuityScope: 'PlayStation 2 and Dreamcast ports only' },
    { id: 'rampage', name: 'Rampage', weapon: 'Shared Tournament Arsenal', special: 'Final Challenge assault', visualAnchor: 'Console-port War Machine leader rendered as a heavy combat robot with angular plated frame and late-1990s arena weapon mounts.', fr: 'Rampage est le robot chef de War Machine dans la Final Challenge des portages console.', en: 'Rampage is the robot leader of War Machine in the console ports’ Final Challenge.', canonStatus: 'console-port-only Final Challenge boss', continuityScope: 'PlayStation 2 and Dreamcast ports only', species: 'robot', team: 'War Machine' },
    { id: 'dominator', name: 'Dominator', weapon: 'Shared Tournament Arsenal', special: 'Final Challenge domination route', visualAnchor: 'Pure-blood Skaarj console challenger with digitigrade alien posture, angular head crest and tournament armor, no invented supernatural effects.', fr: 'Dominator est le Skaarj pur-sang qui clôt la sous-séquence console avant la véritable finale.', en: 'Dominator is the pure-blood Skaarj closing the console-only sub-sequence before the true final.', canonStatus: 'console-port-only Final Challenge boss', continuityScope: 'PlayStation 2 and Dreamcast ports only', species: 'Skaarj' }
  ],
  worldBoss: { id: 'xan', name: 'Xan Kriegor', weapon: 'Shared Tournament Arsenal', special: 'HyperBlast championship duel', visualAnchor: 'Xan’s imposing gold-and-black cybernetic champion armor, narrow glowing face and HyperBlast starship arena backdrop.', fr: 'Xan est le champion final du ladder original sur HyperBlast.', en: 'Xan is the original ladder’s final champion on HyperBlast.', canonStatus: 'canon UT99 final champion', entityType: 'tournament-finalist', uniqueAbility: false, objective: 'Defeat Xan under standard tournament rules using the shared arsenal.' },
  stage: { name: 'Deck16][ — arène Liandri', visualAnchor: 'Multi-level industrial Deck16][ arena with ramps, toxic channels, weapon pads and blue-orange utility light.', fr: 'Le ladder commence dans une arène Liandri où le contrôle des armes et des hauteurs prime.', en: 'The ladder begins in a Liandri arena where controlling pickups and high ground is decisive.' },
  stageVariants: [
    stageVariant('Tactics', 'Final Challenge — portages console', 'Expert', 'Dominator', { continuityScope: 'PS2/Dreamcast only', objective: 'Complete the disclosed console-only three-opponent sequence.' }),
    stageVariant('Smash', 'HyperBlast — finale contre Xan', 'Expert', 'Xan Kriegor', { objective: 'Win the championship duel under standard tournament rules.' })
  ],
  gear: [
    { id: 'shock_rifle', enName: 'Shock Rifle', frName: 'Fusil Shock', boost: { atk: 8, spd: 1 }, visualAnchor: 'UT99 angular blue-gray Shock Rifle with glowing energy core, recreated without UI logos.', fr: 'Une arme ramassable partagée de l’arène.', en: 'A shared arena weapon pickup.' },
    { id: 'flak_cannon', enName: 'Flak Cannon', frName: 'Canon Flak', boost: { def: 6, hp: 45 }, visualAnchor: 'Bulky industrial UT99 Flak Cannon with cylindrical chamber and hazard-yellow detail.', fr: 'Le canon projette des éclats à courte portée.', en: 'The cannon projects fragments at short range.' },
    { id: 'redeemer', enName: 'Redeemer', frName: 'Redeemer', boost: { hp: 50, atk: 6 }, visualAnchor: 'Large UT99 tactical missile launcher pickup with heavy tube and compact guidance screen.', fr: 'L’arme rare de l’arène, jamais un pouvoir personnel.', en: 'The arena’s rare weapon, never a personal power.' }
  ],
  event: { id: 'liandri_countdown', enName: 'Liandri Match Countdown', frName: 'Compte à rebours Liandri', en: 'The match reset restores shared pickups and scores the next elimination under tournament rules.', fr: 'La remise à zéro restaure les armes communes et comptabilise la prochaine élimination selon les règles du tournoi.', visualAnchor: 'Arena lights switch from neutral to blue-red as pickup pads activate; no logos or HUD text.' }
}));
}
