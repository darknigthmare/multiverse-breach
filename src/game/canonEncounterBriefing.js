import { CANON_PRIORITY_STAGES } from './canonPriorityStages.js';

const briefings = Object.freeze({
  1: {
    fr: { objective: 'Les Kryll protègent RAAM. Dispersez-les avec une grenade frag ou attaquez quand l’essaim le quitte. Rejoignez le couvert éclairé pour éviter les Kryll ; les tirs de la Troika restent dangereux.',
      adaptation: 'Les commandes utilisent l’ATB. Quatre grenades sont partagées par l’équipe ; une grenade ouvre une fenêtre d’attaque de douze secondes. Lumière et positions de couvert sont adaptées au terrain RPG.' },
    en: { objective: 'Kryll protect RAAM. Disperse them with a frag grenade or attack when the swarm leaves him. Take lit cover to avoid the Kryll; Troika gunfire remains dangerous.',
      adaptation: 'Commands use ATB. The squad shares four grenades; each grenade opens a twelve-second attack window. Light and cover positions adapt the encounter to the RPG battlefield.' }
  },
  2: {
    fr: { objective: 'Rejoignez la passerelle d’abordage du Scarab, puis neutralisez le Grunt et l’Élite de son équipage. La coque est invulnérable. Le sniper d’approche ne conditionne pas la victoire.',
      adaptation: 'La grille tactique, le véhicule immobile et deux membres d’équipage condensent Metropolis de Halo 2. La victoire exige l’abordage et l’équipage neutralisé.' },
    en: { objective: 'Reach the Scarab boarding catwalk, then neutralize its Grunt and Elite crew. The hull is invulnerable. Defeating the approach sniper is not required for victory.',
      adaptation: 'The tactical grid, stationary walker and two crew members condense Halo 2 Metropolis. Victory requires both boarding and neutralizing the crew.' }
  },
  10: {
    fr: { objective: 'Détruisez les trois cristaux de soin pour empêcher la recharge des vingt sphères. Affaiblissez Nihilanth ou sa réserve d’énergie, puis montez sur les plateformes pour frapper le cerveau lorsque sa tête s’ouvre. Les coups sur le corps ne peuvent pas le tuer.',
      adaptation: 'Plateformes, durées et PV des cristaux sont adaptés au mode Smash. Les projectiles violets sont actifs ; les téléportations et renforts invoqués restent à réaliser.' },
    en: { objective: 'Destroy the three healing crystals to prevent recharging the twenty spheres. Weaken Nihilanth or its energy reserve, then climb the platforms and hit the brain when its head opens. Body hits cannot kill it.',
      adaptation: 'Platforms, timings and crystal HP adapt the encounter to Smash. Purple projectiles are active; teleportation and summoned reinforcements remain to be implemented.' }
  }
});

export function getCanonicalEncounterBriefing(stage, lang = 'fr') {
  if (!stage || stage.customBattle || stage.isCustomBattle) return null;
  const source = Object.values(CANON_PRIORITY_STAGES).find(entry => entry.id === Number(stage.id));
  if (!source || stage.universe !== source.universe || stage.mode !== source.mode
    || stage.incarnation !== source.incarnation) return null;
  return briefings[source.id]?.[lang === 'fr' ? 'fr' : 'en'] || null;
}
