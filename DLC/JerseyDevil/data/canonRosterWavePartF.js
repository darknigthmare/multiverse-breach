// Jersey Devil — definitions consumed by src/game/canonRosterWavePartF.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createJerseyDevil() {
  return (Object.freeze({ key: 'jersey_devil', universe: 'Jersey Devil', url: 'https://www.videogamemanual.com/ps1/Jersey%20Devil%20%28USA%29.pdf' }));
}

export function createJerseyDevil2({ JERSEY_DEVIL, definePack, stageVariant }) {
  return (definePack(JERSEY_DEVIL, {
  aliases: ['Devil', 'Jersey Devil (1997)', 'Jersey Devil game'],
  mediaType: 'video-game', faction: 'cartoon', mode: 'RPG', difficulty: 'Hard',
  colors: ['#39285c', '#09060e', '#f08a28'], motif: 'halloweentown',
  theme: 'the Jersey Devil freeing Jersey City from Dr. Knarf’s mutant army',
  continuity: 'Behaviour Interactive / Megatoon Jersey Devil (PlayStation and PC)',
  adaptationRule: 'The ambiguous request “devil” is resolved as Jersey Devil because it sits among mascot platform games. The original has one silent playable hero: hostages and city police remain non-combat rescue/arrest Trials, never invented sidekick fighters. Preserve Knarf’s named assistant Dennis and mutant bestiary.',
  visualAnchor: 'Late-1990s cartoon Halloween city, purple batlike hero, orange pumpkins, crooked museum and oversized mutant vegetables.',
  canonStatus: 'single-game canon with transparent solo-hero limitation',
  fr: 'Le Jersey Devil libère les otages de Jersey City et remonte la piste de Dennis jusqu’au laboratoire du Dr Knarf.',
  en: 'The Jersey Devil frees Jersey City’s hostages and follows Dennis’s trail to Dr. Knarf’s laboratory.',
  referenceUrls: [JERSEY_DEVIL.url, 'https://www.gamesdatabase.org/game/sony-playstation/jersey-devil.aspx/', 'https://www.mobygames.com/game/14697/jersey-devil/'],
  characters: [
    { id: 'jersey_devil', name: 'Jersey Devil', role: 'slayer', weapon: 'Tail whip', weaponType: 'fists', simple: 'Punch', secondary: 'Jumping tail spin', defense: 'Wing glide', special: 'Nitro-powered tail sweep', visualAnchor: 'Small silent purple devil mascot with huge pointed ears, long tail, tiny black wings, white gloves and dark superhero-like body suit; no Batman emblem.', fr: 'Le héros silencieux frappe, tournoie et plane avec ses petites ailes.', en: 'The silent hero punches, spins and glides with his small wings.' },
    { id: 'hostage_rescue', name: 'Jersey City Hostage Rescue', role: 'trial', nonCombat: true, objective: 'Find each cage switch and release every canonical hostage in the district.', objectiveFr: 'Trouver chaque interrupteur de cage et libérer tous les otages canoniques du quartier.', victoryCondition: 'all-hostages-released', visualAnchor: 'Cartoon city residents in hanging cages with clear switch-to-cage routes across four rescue states.', fr: 'Les habitants en cage sont des objectifs de sauvetage, jamais des combattants.', en: 'The caged residents are rescue objectives, never fighters.', canonStatus: 'canon collectible rescue Trial' },
    { id: 'police_arrest', name: 'Jersey City Police Arrest Route', role: 'trial', nonCombat: true, objective: 'Open the forest-lair exit so city police can arrest Dr. Knarf after his defeat.', objectiveFr: 'Ouvrir la sortie du repaire forestier pour que la police puisse arrêter le Dr Knarf après sa défaite.', victoryCondition: 'knarf-in-custody', visualAnchor: 'Cartoon police wagon approaching Knarf’s ruined forest lab through an opened gate, no weapons or combat pose.', fr: 'La police arrête Knarf dans la conclusion ; elle n’est pas inventée comme équipe jouable.', en: 'Police arrest Knarf in the ending; they are not invented as a playable squad.', canonStatus: 'canon ending-resolution Trial' }
  ],
  monsters: [
    { id: 'mutant_pumpkin', name: 'Mutant Pumpkin', weapon: 'Thrown bomb', special: 'Rolling chase', visualAnchor: 'Grinning orange humanoid pumpkin mutant with leafy limbs and a small cartoon bomb.', fr: 'Une citrouille mutante de l’armée de Knarf.', en: 'A mutant pumpkin from Knarf’s army.' },
    { id: 'giant_carrot', name: 'Giant Carrot', weapon: 'Body slam', special: 'Little-carrot scatter', visualAnchor: 'Towering orange carrot with green top, cartoon eyes and several tiny carrot offshoots.', fr: 'Une carotte géante qui libère de petites carottes lorsqu’elle est frappée.', en: 'A giant carrot that sheds small carrots when struck.' },
    { id: 'pterodactyl', name: 'Knarf Pterodactyl', weapon: 'Aerial bite', special: 'Museum dive', visualAnchor: 'Cartoon prehistoric flying reptile with green-brown hide circling museum rafters.', fr: 'Une créature préhistorique lâchée par les expériences de Knarf.', en: 'A prehistoric creature released by Knarf’s experiments.' }
  ],
  bosses: [
    { id: 'dennis', name: 'Dennis the Pumpkin-Head', weapon: 'Wooden mallet', special: 'Dizzy tornado charge', visualAnchor: 'Tall lanky humanoid with oversized orange pumpkin head, striped clothes and wooden mallet, visibly Knarf’s clumsy assistant.', fr: 'Dennis, l’assistant de Knarf, revient dans plusieurs rencontres.', en: 'Dennis, Knarf’s assistant, returns in several encounters.', canonStatus: 'canon recurring boss and assistant' },
    { id: 'skeleton_dinosaur', name: 'Skeleton Dinosaur', weapon: 'Bone jaws', special: 'Museum fossil charge', visualAnchor: 'Reanimated cartoon dinosaur museum skeleton under moonlit exhibition glass, no gore.', fr: 'Un fossile animé protège le parcours du musée.', en: 'An animated fossil guards the museum route.', canonStatus: 'canon game boss' },
    { id: 'giant_octopus', name: 'Giant Octopus', weapon: 'Tentacles', special: 'Seaport platform sweep', visualAnchor: 'Huge purple-green cartoon octopus emerging among dock pylons and cargo cranes.', fr: 'Le poulpe géant verrouille la progression du port.', en: 'The giant octopus locks down the seaport route.', canonStatus: 'canon game boss' }
  ],
  worldBoss: { id: 'dr_knarf', name: 'Dr. Knarf', weapon: 'Mutagen bottles', special: 'Forest-lab machine barrage', visualAnchor: 'Wild-haired cartoon mad scientist in white coat and green gloves operating a crooked laboratory contraption, original face.', fr: 'Le savant qui a créé les légumes mutants et terrorise la ville.', en: 'The scientist who created the mutant vegetables and terrorizes the city.' },
  stage: { name: 'Jersey City — musée nocturne', visualAnchor: 'Cartoon stone museum, giant fossil halls, purple night sky, pumpkin lamps and Knarf-letter locks.', fr: 'Dennis entraîne le héros dans le musée rempli d’expériences.', en: 'Dennis leads the hero into a museum filled with experiments.' },
  stageVariants: [
    stageVariant('Trial', 'Jersey City — réseau de cages', 'Hard', 'Jersey City Hostage Rescue', { nonCombat: true, trialType: 'Trial', objective: 'Find switches and free all residents before leaving the district.' }),
    stageVariant('RPG', 'Forêt de Knarf — laboratoire final', 'Very Hard', 'Dr. Knarf', { objective: 'Cross the mutant forest, defeat Dennis and stop Knarf’s machine.' })
  ],
  gear: [
    { id: 'nitro_bottle', enName: 'Nitroglycerin Bottle', frName: 'Bouteille de nitroglycérine', boost: { atk: 7 }, visualAnchor: 'Round cartoon chemistry bottle with orange liquid, cork and an original abstract hazard mark.', fr: 'Le nitro détruit les installations de Knarf et augmente la puissance.', en: 'Nitro destroys Knarf’s installations and increases power.' },
    { id: 'golden_pumpkin', enName: 'Golden Pumpkin', frName: 'Citrouille dorée', boost: { hp: 65 }, visualAnchor: 'Small polished golden pumpkin with curled green stem and warm glow.', fr: 'La citrouille dorée restaure le héros.', en: 'The golden pumpkin restores the hero.' },
    { id: 'devil_tail', enName: 'Devil Tail', frName: 'Queue de Devil', boost: { spd: 2, def: 4 }, visualAnchor: 'Purple curved collectible tail with pointed tip floating above a small pedestal.', fr: 'La queue violette est un objet de vie supplémentaire.', en: 'The purple tail is an extra-life collectible.' }
  ],
  event: { id: 'knarf_letters', enName: 'KNARF Lock Hunt', frName: 'Chasse aux verrous KNARF', en: 'Five letter tokens open each Knarf lock while cages and nitro crates make the district route fully clearable.', fr: 'Cinq jetons-lettres ouvrent chaque verrou de Knarf tandis que cages et caisses de nitro rendent le quartier entièrement nettoyable.', visualAnchor: 'Five abstract letter-shaped token silhouettes slotting into a crooked laboratory gate; no copied UI font.', canonStatus: 'canon collection-loop adaptation' }
}));
}
