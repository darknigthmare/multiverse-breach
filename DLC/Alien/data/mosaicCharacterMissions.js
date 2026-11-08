/** Ripley's Alien (1979) incarnation stays distinct from ripley_aliens.
 * These are original City investigations and inert evacuation exercises. */
export function createMosaicCharacterMissions({ text, person, marker, decision, choice, report }) {
  return [
    {
      id: 'city-ripley-narcissus-route-v1', heroId: 'ripley', universe: 'Alien', contentFile: 'DLC/Alien/data/mosaicCharacterMissions.js',
      title: text('La route du Narcissus', 'The Narcissus route'),
      premise: text('Dans le quartier Alien, une archive du Nostromo confond une alerte et un ordre de déplacement. Ripley veut préserver le chemin vers le Narcissus sans transformer cette lecture en nouvelle chasse.', 'In the Alien district, a Nostromo archive confuses an alarm with a movement order. Ripley wants to preserve the route towards the Narcissus without turning this reading into another hunt.'),
      source: 'DLC/Alien/data/heroes.js#ripley.incarnation; DLC/Alien/data/characterPlaques.js#ripley',
      continuity: text('Ripley, Alien (1979). Reconstitution documentaire de Cité, sans M41A, power loader ni rencontre ajoutée au film.', 'Ripley, Alien (1979). City documentary reconstruction, without an M41A, power loader or encounter added to the film.'),
      references: ['https://www.20thcenturystudios.com/movies/alien'],
      steps: [person('ripley', 'Demander à Ripley quel objectif le dossier doit conserver.', 'Ask Ripley which objective the case must preserve.'),
        marker('nostromo-warning', 610, 570, 'Lire le panneau d’alerte de la reconstitution.', 'Read the reconstruction’s alarm panel.', 'Le signal indique un danger, pas une sortie. La flèche d’itinéraire a été masquée par la couche d’alerte.', 'The signal indicates danger, not an exit. The route arrow has been hidden by the alarm layer.'),
        marker('narcissus-route', 1340, 770, 'Retrouver le repère du chemin vers le Narcissus.', 'Find the marker for the route towards the Narcissus.', 'Le dossier conserve un repère de navette et un détour identifié. Rien ne demande de poursuivre une menace dans les coursives.', 'The case retains a shuttle marker and an identified detour. Nothing calls for pursuing a threat through the corridors.'),
        decision('Quelle lecture restituer ?', 'Which reading should be restored?', [
          choice('preserve-escape', 'Rendre la sortie lisible en conservant l’alerte.', 'Make the exit readable while retaining the warning.', 'L’archive sépare danger et destination. La priorité reste la fuite, sans inventer de combat supplémentaire.', 'The archive separates danger from destination. Escape remains the priority, without inventing an additional fight.'),
          choice('hold-route', 'Garder les traces et suspendre la signalétique ambiguë.', 'Keep the traces and suspend the ambiguous signage.', 'Le panneau reste hors service jusqu’à relecture ; les indices du trajet sont préservés.', 'The panel stays out of service pending review; the route clues are preserved.'),
          choice('follow-alarm', 'Présenter l’alarme comme une consigne de poursuivre.', 'Present the alarm as an instruction to pursue.', 'Une alerte ne donne pas une destination et ne transforme pas une fuite en chasse.', 'An alarm does not provide a destination or turn an escape into a hunt.', false)
        ]), report]
    },
    {
      id: 'city-ripley-alarm-exit-v1', heroId: 'ripley', universe: 'Alien', contentFile: 'DLC/Alien/data/mosaicCharacterMissions.js',
      title: text('L’alarme et la sortie', 'The alarm and the exit'),
      premise: text('A.R.C.A. teste une alarme dans l’annexe Alien, sans organisme ni danger réel. Ripley demande un trajet aller-retour et des panneaux lisibles avant de rouvrir l’exercice au public.', 'A.R.C.A. is testing an alarm in the Alien annex, with no organism or actual danger. Ripley asks for a round trip and readable signs before reopening the exercise to visitors.'),
      source: 'DLC/Alien/data/heroes.js#ripley; src/game/mosaicCityRuntime.js#MOSAIC_WELCOME',
      continuity: text('Exercice original Multiverse Breach avec l’incarnation de 1979 ; aucun équipement ni souvenir d’Aliens transféré.', 'Original Multiverse Breach exercise with the 1979 incarnation; no equipment or memory transferred from Aliens.'),
      steps: [person('ripley', 'Écouter la consigne d’évacuation de Ripley.', 'Listen to Ripley’s evacuation instruction.'),
        marker('alarm-origin', 520, 760, 'Lire la consigne au départ de l’exercice.', 'Read the instruction at the exercise entrance.', 'L’alarme est annoncée comme un exercice. L’issue A-3 doit rester visible même lorsque le signal lumineux s’allume.', 'The alarm is announced as a drill. Exit A-3 must remain visible even when the warning light turns on.'),
        marker('exit-reading', 1370, 580, 'Examiner le panneau de sortie A-3.', 'Examine the A-3 exit sign.', 'Une couche rouge recouvre la flèche. Le texte d’alerte et le repère de sortie peuvent être séparés sans masquer le danger.', 'A red layer covers the arrow. The alarm text and exit marker can be separated without hiding the danger.'),
        marker('return-reading', 520, 760, 'Revenir au départ en suivant les repères du trajet.', 'Return to the entrance following the route markers.', 'Le retour est effectué. Le relevé distingue le signal d’alerte, l’issue et le point de rassemblement.', 'The return is complete. The reading distinguishes the warning signal, exit and assembly point.'),
        decision('Quelle correction proposer ?', 'Which correction should be proposed?', [
          choice('separate-signals', 'Séparer alerte et flèche, puis conserver le trajet vérifié.', 'Separate warning and arrow, then retain the verified route.', 'Le dossier propose deux signaux lisibles et conserve la preuve du retour à pied.', 'The case proposes two readable signals and retains evidence of the return on foot.'),
          choice('close-drill', 'Fermer l’exercice jusqu’à une nouvelle lecture des panneaux.', 'Close the drill until the signs are checked again.', 'L’exercice attend une correction ; la fermeture n’efface ni l’alerte ni le relevé.', 'The drill awaits correction; closure erases neither the warning nor the reading.'),
          choice('silence-warning', 'Éteindre l’alerte pour rendre la sortie visible.', 'Turn off the warning to make the exit visible.', 'Une issue lisible ne doit pas faire disparaître l’information de danger.', 'A readable exit must not remove the danger information.', false)
        ]), report]
    }
  ];
}
