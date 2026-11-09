// Source-scene definitions consumed by src/game/sourceSceneStages.js.
// Inject shared builders without importing back into the aggregate catalog.

export function createSourceSceneStages({ base, command, commonAdaptation }) {
  return ({
    ...base(50106, 'prey_1719_naru_feral_bog', 'Prey', 'naru_prey',
      'Prey (2022) — 1719 Comanche territory, Naru versus Feral Predator bog finale',
      'Prey — Naru and the Bog', 'Prey — Naru et le marécage'),
    bossName: 'Feral Predator', enemyRoster: ['Feral Predator'],
    referenceUrl: 'https://www.20thcenturystudios.com/movies/prey',
    referenceUrls: [
      'https://www.20thcenturystudios.com/movies/prey',
      'https://www.whattowatch.com/features/prey-ending-explained'
    ],
    visualAnchor: 'Prey (2022), Comanche territory in 1719: young Naru in period-accurate earth-toned clothing with rope-tethered hatchet and Raphael’s flintlock, Sarii the dog remaining a noncombat companion during the hunt; Feral Predator has lean body, bone/skull biomask, archaic projectile bolt launcher and distinctive shield, not Jungle Hunter silver mask or City Hunter smart disc. Bog and positioned targeting mask turn Feral’s own projectile against its head. No flying plasma cannon, Yautja starship duel or crossover adversaries.',
    sceneLead: { id: 'naru_prey', universe: 'Prey' }, threatName: 'Feral Predator',
    briefing: {
      fr: {
        objective: 'Naru seule, en 1719 : après avoir compris les limites de la vision thermique du Feral Predator et perdu Taabe, mange la plante médicinale refroidissante, prépare le piège avec le trappeur survivant, utilise le pistolet de Raphaël pour distraire et blesser le chasseur, récupère son masque de visée en os, place-le face au marécage, attire-y le chasseur et détourne son propre projectile grâce aux pointeurs du masque. Reprends la preuve du duel et rejoins le village avec Sarii. Aucun adversaire crossover et aucune victoire par simple baisse de PV.',
        adaptation: commonAdaptation.fr + ' Le duel final et le retour au village sont condensés en une grille 9×7. Le marécage a déjà été découvert auparavant ; le masque dirige les projectiles, il ne lance pas de tir de plasma. La plante réduit la signature thermique sans supprimer les autres moyens de repérage. Sarii rapporte la hache reliée à Naru pendant le duel, sans devenir un héros jouable. La dernière case est une sortie vers le village, pas un village dans le marécage. Total adapté : 48 tours ; positions, vitesse et dégâts non certifiés cinématographiquement.'
      },
      en: {
        objective: 'Naru alone, in 1719: after learning the Feral Predator’s thermal weakness and losing Taabe, eat the cooling medicinal herb, arrange a trap using the surviving French trapper, use Raphael’s flintlock to wound and distract the hunter, steal its bone targeting mask, aim that mask at the bog, draw the hunter into the mire and let its own guided projectile return to its head. Recover proof of the duel and return to the Comanche village with Sarii. No crossover enemies or HP-only victory.',
        adaptation: commonAdaptation.en + ' The film finale and village return are compressed to one 9×7 grid. Naru previously discovered the bog; the bone mask GUIDES the Feral Predator’s projectiles, it does not fire plasma. The herb lowers thermal visibility without preventing hearing or direct sight. Sarii returns Naru’s rope-tethered hatchet during the duel without becoming a playable fighter. The last cell represents the route back to the village, not a village inside the bog. Adapted limit: 48 turns; geometry, speeds and damage are not film-certified.'
      }
    },
    turnLimit: 48,
    // Only one of three player-selectable mask directions intersects the bog.
    // Aiming uses a native turn rather than an automatic correct lock.
    maskAimCandidates: [[5,4],[6,4],[7,4]],
    field: {
      rows: 7, cols: 9, heroSpawns: [{ x: 0, y: 3 }],
      blocked: [[2,0],[4,0],[7,0],[0,6],[3,6],[8,6]],
      props: [
        { id: 'herb', x: 1, y: 3, label: 'HERB', kind: 'herb' },
        { id: 'trapper', x: 2, y: 4, label: 'TRAPPER', kind: 'bait' },
        { id: 'flintlock', x: 3, y: 3, label: 'FLINTLOCK', kind: 'flintlock' },
        { id: 'mask', x: 4, y: 3, label: 'BONE MASK', kind: 'bone_mask' },
        { id: 'mask_mount', x: 6, y: 2, label: 'AIMING MASK', kind: 'target' },
        { id: 'bog', x: 6, y: 4, label: 'BOG', kind: 'bog' },
        { id: 'trophy', x: 6, y: 4, label: 'PROOF', kind: 'trophy' },
        { id: 'sarii', x: 1, y: 4, label: 'SARII', kind: 'companion' },
        { id: 'village', x: 0, y: 2, label: 'RETURN PATH', kind: 'exit' }
      ]
    },
    commands: [
      command('herb', 1, 3, 'Prendre la plante refroidissante', 'Take the cooling medicinal herb'),
      command('bait', 2, 4, 'Préparer le piège avec le trappeur', 'Set bait using the surviving trapper', ['herb']),
      command('flintlock', 3, 3, 'Tirer avec le pistolet de Raphaël', 'Fire Raphael’s flintlock', ['bait']),
      command('take_mask', 4, 3, 'Récupérer le masque de visée en os', 'Recover the bone targeting mask', ['flintlock']),
      command('set_mask', 6, 2, 'Placer le masque face au marécage', 'Set the targeting mask facing the bog', ['take_mask']),
      command('sarii_hatchet', 5, 3, 'Récupérer la hache rapportée par Sarii', 'Recover the rope-hatchet brought back by Sarii', ['set_mask']),
      command('bog', 6, 4, 'Attirer le Feral Predator dans la vase', 'Lure the Feral Predator into the bog', ['sarii_hatchet']),
      command('redirect', 5, 4, 'Détourner son propre projectile vers sa tête', 'Redirect its guided bolt into its head', ['bog']),
      command('trophy', 6, 4, 'Récupérer le trophée du duel', 'Recover the victory trophy', ['redirect']),
      command('return', 0, 2, 'Retourner au village avec Sarii', 'Return to the village with Sarii', ['trophy'], {final:true})
    ],
    dangerPatterns: [
      [[3,3],[4,3]], [[5,3],[5,4]], [[5,4],[6,4]], [[3,4],[4,4]]
    ],
    threatCell: { x: 7, y: 3 }, accent: '#c9a66a', material: 'prey'
  });
}
