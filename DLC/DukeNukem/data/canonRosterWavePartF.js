// Duke Nukem — definitions consumed by src/game/canonRosterWavePartF.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDukeNukem() {
  return (Object.freeze({ key: 'duke_nukem', universe: 'Duke Nukem', url: 'https://www.gamesdatabase.org/Media/SYSTEM/Microsoft_DOS/manual/Formated/Duke_Nukem_3D.pdf' }));
}

export function createDukeNukem2({ DUKE_NUKEM, definePack, stageVariant }) {
  return (definePack(DUKE_NUKEM, {
  aliases: ['Duke Nukem franchise', 'Duke Nukem 3D', 'Duke Nukem Forever'],
  mediaType: 'video-game', faction: 'sciFi', mode: 'Smash', difficulty: 'Very Hard',
  colors: ['#333b45', '#08090b', '#df3f38'], motif: 'edf',
  theme: 'Duke and EDF allies repelling the Cycloid invasion',
  continuity: 'Duke Nukem 3D: Atomic Edition core threats; Captain Dylan and EDF ally explicitly tagged from Duke Nukem Forever',
  adaptationRule: 'Keep Duke’s red tank, blond flattop, sunglasses and 3D arsenal. Dylan and the EDF trooper are DNF allies, not retroactively inserted into 3D scenes. Remove sexualized environments, captured-woman imagery and actor likenesses while preserving the alien-defense plot.',
  visualAnchor: '1990s Los Angeles action-movie ruins, red EDF accents, chunky alien technology, hazard stripes and oversized Build-engine weapons.',
  canonStatus: 'franchise composite with title-specific tags and project-safe presentation',
  fr: 'Duke repousse les envahisseurs de Los Angeles puis coordonne une percée avec Dylan et les soldats EDF lorsque les Cycloïdes reviennent.',
  en: 'Duke repels the Los Angeles invasion and later coordinates a breakthrough with Dylan and EDF soldiers when the Cycloids return.',
  referenceUrls: [DUKE_NUKEM.url, 'https://www.gamesdatabase.org/Media/SYSTEM/Microsoft_Xbox_360/Manual/formated/Duke_Nukem_Forever_-_2011_-_2K_Games.pdf', 'https://www.gog.com/en/game/duke_nukem_3d_atomic_edition'],
  characters: [
    { id: 'duke', runtimeId: 'duke_nukem', name: 'Duke Nukem', role: 'marine', weapon: 'Mighty Boot and pistol', weaponType: 'gun', simple: 'Pistol burst', secondary: 'Mighty Boot', defense: 'Jetpack evade', special: 'Devastator salvo', visualAnchor: 'Muscular blond action hero with flattop, opaque sunglasses, red sleeveless combat top, blue trousers, black boots and large sci-fi pistol; original face.', fr: 'Le héros central de la franchise et combattant de terrain.', en: 'The franchise’s central hero and field fighter.' },
    { id: 'captain_dylan', name: 'Captain Dylan', role: 'marine', weapon: 'EDF assault rifle', weaponType: 'gun', simple: 'EDF burst', secondary: 'Dam route cover', defense: 'Squad brace', special: 'Captain’s portal push', visualAnchor: 'Fictional EDF captain in gray-red combat armor with beret, rifle and original face; no voice-actor likeness.', fr: 'Vieil ami de Duke et capitaine EDF rencontré au barrage dans Forever.', en: 'Duke’s old friend and an EDF captain encountered at the dam in Forever.', canonStatus: 'canon Duke Nukem Forever combat ally' },
    { id: 'edf_trooper', name: 'EDF Trooper', role: 'tactical', weapon: 'EDF carbine', weaponType: 'gun', simple: 'Carbine fire', secondary: 'Alien-tech scan', defense: 'Portable EDF cover', special: 'Squad extraction', visualAnchor: 'Anonymous Earth Defense Force soldier in full gray armor, red shoulder lights, opaque visor and compact carbine.', fr: 'Un soldat EDF représentatif des alliés armés de Forever.', en: 'An EDF soldier representing the armed allies in Forever.', canonStatus: 'canon allied faction archetype' }
  ],
  monsters: [
    { id: 'assault_trooper', name: 'Assault Trooper', weapon: 'Laser pistol', special: 'Jetpack flank', visualAnchor: 'Brown-green Cycloid infantry alien in dark harness with red visor and compact laser pistol.', fr: 'Le fantassin cycloïde de base.', en: 'The basic Cycloid infantryman.' },
    { id: 'pig_cop', name: 'Pig Cop', weapon: 'Shotgun', special: 'Police-car ambush', visualAnchor: 'Large alien-mutated boar officer in blue tactical uniform with abstract badge, shotgun and no real police insignia.', fr: 'Un officier transformé par les extraterrestres.', en: 'An officer transformed by the aliens.' },
    { id: 'octabrain', name: 'Octabrain', weapon: 'Psychic blast', special: 'Tentacle flight', visualAnchor: 'Floating orange-brown brainlike alien with one eye and trailing tentacles, stylized and non-gory.', fr: 'Une créature volante qui attaque par impulsion psychique.', en: 'A floating creature attacking with psychic pulses.' }
  ],
  bosses: [
    { id: 'battlelord', name: 'Battlelord', weapon: 'Chaingun and grenade launcher', special: 'Abyss canyon barrage', visualAnchor: 'Giant tan alien warlord in spiked black armor with integrated chaingun-grenade weapon.', fr: 'Le commandant géant qui clôt L.A. Meltdown.', en: 'The giant commander ending L.A. Meltdown.' },
    { id: 'overlord', name: 'Overlord', weapon: 'Rocket launcher', special: 'Lunar reactor assault', visualAnchor: 'Huge pale-green one-eyed alien with metal lower body and shoulder rocket system inside a moon reactor.', fr: 'Le chef de l’assaut lunaire.', en: 'The leader of the lunar assault.' },
    { id: 'cycloid_emperor', name: 'Cycloid Emperor', weapon: 'Cycloid rockets', special: 'Hollywood stadium barrage', visualAnchor: 'Towering one-eyed horned emperor with brown hide, black mechanical legs and twin arm launchers in a ruined stadium.', fr: 'L’empereur cycloïde conduit l’invasion de Duke Nukem 3D.', en: 'The Cycloid Emperor leads the Duke Nukem 3D invasion.' }
  ],
  worldBoss: { id: 'alien_queen', name: 'Alien Queen', weapon: 'Acid spit', special: 'The Birth hive summon', visualAnchor: 'Colossal brown-green alien queen with elongated armored body and egglike hive chamber, no captive people or sexual imagery.', fr: 'La Reine extraterrestre est la finale de l’épisode The Birth.', en: 'The Alien Queen is the finale of The Birth episode.', canonStatus: 'canon Atomic Edition final boss' },
  stage: { name: 'Hollywood Holocaust — Los Angeles occupée', visualAnchor: 'Ruined cinema rooftops, red night sky, EDF barricades, burning alien craft and no adult signage.', fr: 'Duke revient à Los Angeles au début de l’invasion.', en: 'Duke returns to Los Angeles at the invasion’s start.' },
  stageVariants: [
    stageVariant('Smash', 'Stadium — Cycloid Emperor', 'Very Hard', 'Cycloid Emperor', { objective: 'Break the rocket cadence and clear the stadium invasion node.' }),
    stageVariant('RPG', 'The Birth — ruche de la Reine', 'Expert', 'Alien Queen', { objective: 'Destroy hive relays and stop the Queen without depicting captives.' })
  ],
  gear: [
    { id: 'devastator', enName: 'Devastator', frName: 'Devastator', boost: { atk: 8 }, visualAnchor: 'Pair of compact black-red wrist rocket launchers with multiple small barrels.', fr: 'L’arme à salves de roquettes de Duke 3D.', en: 'Duke 3D’s rapid rocket-salvo weapon.' },
    { id: 'jetpack', enName: 'Jetpack', frName: 'Jetpack', boost: { spd: 3, def: 3 }, visualAnchor: 'Chunky gray twin-thruster jetpack with red controls and folded harness.', fr: 'Le jetpack ouvre les routes verticales.', en: 'The jetpack opens vertical routes.' },
    { id: 'shrink_ray', enName: 'Shrink Ray', frName: 'Rayon réducteur', boost: { atk: 5, spd: 2 }, visualAnchor: 'Bulky silver-blue ray gun with green coil and flared emitter, no logo.', fr: 'Une arme extraterrestre retournée contre les envahisseurs.', en: 'Alien technology turned against the invaders.' }
  ],
  event: { id: 'edf_breakthrough', enName: 'EDF Dam Breakthrough', frName: 'Percée EDF au barrage', en: 'Dylan’s squad opens a brief route while Duke carries the push toward the portal controls.', fr: 'L’escouade de Dylan ouvre brièvement la route pendant que Duke progresse vers les commandes du portail.', visualAnchor: 'Gray-red EDF formation creating a corridor through alien fire at a concrete dam.', canonStatus: 'canon-inspired DNF squad event' }
}));
}
