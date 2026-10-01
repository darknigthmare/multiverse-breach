import { CANON_PRIORITY_STAGES } from './canonPriorityStages.js';
import { isCanonPiratesCurseStage } from './canonPiratesCurseEncounter.js';
import { isCanonRexStage } from './canonRexEncounter.js';

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
  3: {
    fr: { objective: 'Traversez la ruche, rejoignez le repère NEWT puis libérez-la. Rejoignez ensuite la sortie avec son porteur vivant et évacuez. La Reine peut être repoussée ; la tuer ne constitue pas l’objectif.',
      adaptation: 'Les vagues et la route 2D condensent le sauvetage dans le processeur. Newt est un repère non ciblable. La défaite du porteur fait échouer l’évacuation. Le duel au power loader à bord du Sulaco reste une scène distincte à réaliser.' },
    en: { objective: 'Cross the hive, reach the NEWT marker and free her. Then reach the exit with her living carrier and evacuate. The Queen can be repelled; killing her is not the objective.',
      adaptation: 'Waves and the 2D route condense the processor rescue. Newt is a non-targetable marker. Losing her carrier fails the evacuation. The power-loader duel aboard the Sulaco remains a separate scene to implement.' }
  },
  10: {
    fr: { objective: 'Détruisez les trois cristaux de soin pour empêcher la recharge des vingt sphères. Affaiblissez Nihilanth ou sa réserve d’énergie, puis montez sur les plateformes pour frapper le cerveau lorsque sa tête s’ouvre. Les coups sur le corps ne peuvent pas le tuer.',
      adaptation: 'Plateformes, durées et PV des cristaux sont adaptés au mode Smash. Les projectiles violets sont actifs ; les téléportations et renforts invoqués restent à réaliser.' },
    en: { objective: 'Destroy the three healing crystals to prevent recharging the twenty spheres. Weaken Nihilanth or its energy reserve, then climb the platforms and hit the brain when its head opens. Body hits cannot kill it.',
      adaptation: 'Platforms, timings and crystal HP adapt the encounter to Smash. Purple projectiles are active; teleportation and summoned reinforcements remain to be implemented.' }
  },
  12: {
    fr: { objective: 'Préparez le Stinger de mission, puis cliquez sur la case de REX pour viser son radôme. Après l’aide de Gray Fox, visez le cockpit ouvert jusqu’à désactiver REX. Les attaques ordinaires sur la coque ne permettent pas de gagner.',
      adaptation: 'La grille, le Stinger partagé avec réapprovisionnement, la portée de 2 à 6 cases et les deux réserves de 360 PV adaptent le duel. Gray Fox intervient hors champ ; les soldats Genome représentent l’approche. Liquid survit et son duel à mains nues reste hors mission.' },
    en: { objective: 'Prepare the mission Stinger, then click REX’s cell to target its radome. After Gray Fox’s assistance, target the open cockpit until REX is disabled. Ordinary body attacks cannot win the encounter.',
      adaptation: 'The grid, shared resupplied Stinger, range of 2 to 6 cells and two 360-HP target pools adapt the duel. Gray Fox assists offscreen; Genome soldiers represent the approach. Liquid survives and his fistfight is outside this mission.' }
  },
  269: {
    fr: { objective: 'Barbossa et les pirates maudits ne peuvent pas mourir. Récupérez les deux dernières pièces, coordonnez les offrandes de Will Turner, fils de Bootstrap Bill, et de Jack Sparrow, puis faites restituer les 882 pièces par Will. Jack tire avant que Will restitue les pièces : Barbossa meurt lorsque la malédiction se lève.',
      adaptation: 'Trois commandes ATB font intervenir Will et Jack auprès de l’équipe crossover. Les offrandes ne coûtent pas de PV ; Jack jouable de 2003 devient immortel s’il prend sa pièce vivant et redevient mortel à la restitution. Will et les autres héros restent mortels. Barbossa et deux pirates partagent une seule rencontre ; les autres pirates restent vivants et mortels. La reddition sur le Dauntless reste hors scène.' },
    en: { objective: 'Barbossa and the cursed pirates cannot die. Recover the final two coins, coordinate the offerings from Will Turner, Bootstrap Bill’s son, and Jack Sparrow, then have Will restore all 882 pieces. Jack fires before Will returns the coins: Barbossa dies when the curse lifts.',
      adaptation: 'Three ATB commands bring source Will and Jack to assist the crossover squad. The offerings do not cost HP; living playable 2003 Jack becomes immortal when taking his coin and becomes mortal at restitution. Will and other heroes remain mortal. Barbossa and two pirates share one encounter; the other pirates remain alive and mortal. The Dauntless surrender is outside this scene.' }
  }
});

export function getCanonicalEncounterBriefing(stage, lang = 'fr') {
  if (!stage || stage.customBattle || stage.isCustomBattle || stage.isCustom) return null;
  if (isCanonPiratesCurseStage(stage)) return briefings[269][lang === 'fr' ? 'fr' : 'en'];
  if (Number(stage.id) === 12) return isCanonRexStage(stage) ? briefings[12][lang === 'fr' ? 'fr' : 'en'] : null;
  const source = Object.values(CANON_PRIORITY_STAGES).find(entry => entry.id === Number(stage.id));
  if (!source || stage.universe !== source.universe || stage.mode !== source.mode
    || stage.incarnation !== source.incarnation) return null;
  return briefings[source.id]?.[lang === 'fr' ? 'fr' : 'en'] || null;
}
