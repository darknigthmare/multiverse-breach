/** Original Mosaic City contracts, not additional events in Halo's campaign.
 * Builders are injected so a profile can omit this entire DLC contribution. */
export function createMosaicCharacterMissions({ text, person, marker, decision, choice, report }) {
  return [
    {
      id: 'city-chief-unsc-route-v1', heroId: 'masterchief', universe: 'Halo', contentFile: 'DLC/Halo/data/mosaicCharacterMissions.js',
      title: text('La trace UNSC retrouvée', 'The recovered UNSC trace'),
      premise: text('Dans le quartier Halo, un relevé d’Installation 04 mélange un trajet observé et un raccourci non vérifié. Le Chief demande de confronter les deux bornes de cette reconstitution avant de transmettre la carte.', 'In the Halo district, an Installation 04 record mixes an observed route with an unverified shortcut. The Chief asks you to compare both stations in this reconstruction before submitting the map.'),
      source: 'DLC/Halo/data/characterPlaques.js#masterchief; DLC/Halo/data/heroes.js#masterchief',
      continuity: text('Enquête originale de Cité sur un relevé d’Installation 04 ; aucune nouvelle bataille ni équipement d’une autre période.', 'Original City investigation of an Installation 04 record; no additional battle or equipment from another era.'),
      references: ['https://www.halowaypoint.com/en-us/news/thats-so-raven'],
      steps: [person('masterchief', 'Demander au Chief les limites du relevé UNSC.', 'Ask the Chief about the limits of the UNSC record.'),
        marker('unsc-observed-route', 620, 570, 'Lire la balise du trajet observé.', 'Read the observed-route beacon.', 'La trace porte un identifiant UNSC et décrit un couvert avant la sortie. Elle n’atteste pas que la zone suivante soit libre.', 'The trace bears a UNSC identifier and describes cover before the exit. It does not attest that the next area is clear.'),
        marker('unsc-uncertain-shortcut', 1340, 770, 'Comparer le raccourci ajouté à la carte.', 'Compare the shortcut added to the map.', 'Le raccourci n’a ni retour enregistré ni observation de sa ligne d’approche. Le logiciel l’a relié parce qu’il paraît plus court.', 'The shortcut has neither a recorded return nor an observed approach line. The software connected it because it looks shorter.'),
        decision('Quelle trace transmettre au quartier ?', 'Which trace should be submitted to the district?', [
          choice('mark-unverified', 'Garder le trajet attesté et marquer le raccourci non vérifié.', 'Keep the attested route and mark the shortcut unverified.', 'Le relevé conserve sa provenance et ses limites. Un bouclier ne remplace pas la reconnaissance d’un passage.', 'The record keeps its provenance and limits. A shield does not replace reconnaissance of a passage.'),
          choice('request-recon', 'Suspendre la carte publique et demander un nouveau relevé.', 'Hold the public map and request a new survey.', 'Les deux traces restent au dossier. Aucune équipe n’est envoyée sur la seule promesse du raccourci.', 'Both traces stay in the case. No team is sent on the shortcut’s promise alone.'),
          choice('shield-guarantee', 'Déclarer le raccourci sûr grâce au bouclier MJOLNIR.', 'Declare the shortcut safe because of the MJOLNIR shield.', 'Le bouclier n’atteste ni la géométrie du passage ni la sécurité de ceux qui suivent.', 'The shield attests neither the passage geometry nor the safety of those following.', false)
        ]), report]
    },
    {
      id: 'city-chief-return-corridor-v1', heroId: 'masterchief', universe: 'Halo', contentFile: 'DLC/Halo/data/mosaicCharacterMissions.js',
      title: text('Le couloir de retour', 'The return corridor'),
      premise: text('Le Chief prépare pour A.R.C.A. un exercice sans cible vivante dans l’annexe Halo. Une balise annonce l’aller réussi alors que le retour reste à mesurer.', 'The Chief prepares a target-free exercise for A.R.C.A. in the Halo annex. A beacon announces outbound success while the return still needs to be measured.'),
      source: 'DLC/Halo/data/characterPlaques.js#masterchief; src/game/mosaicCityRuntime.js#MOSAIC_WELCOME',
      continuity: text('Exercice original Multiverse Breach : balises inertes, aucun tir ni pouvoir supplémentaire attribué au Chief.', 'Original Multiverse Breach exercise: inert beacons, no firing or additional power assigned to the Chief.'),
      steps: [person('masterchief', 'Écouter la consigne de retour du Chief.', 'Listen to the Chief’s return instruction.'),
        marker('cover-origin', 520, 760, 'Relever la borne de départ sous couvert.', 'Record the departure station under cover.', 'Le départ est identifié H-2. Le trajet de retour doit rejoindre cette borne, pas seulement une zone qui lui ressemble.', 'The departure point is identified H-2. The return route must reach this station, not merely an area that resembles it.'),
        marker('cover-alternate', 1370, 580, 'Vérifier la balise de repli.', 'Check the fallback beacon.', 'La balise conserve une seconde direction de sortie. L’affichage du bouclier ne dit rien du passage derrière elle.', 'The beacon retains a second exit direction. The shield display says nothing about the passage behind it.'),
        marker('cover-return', 520, 760, 'Ramener physiquement le relevé au point H-2.', 'Physically bring the reading back to point H-2.', 'Le point H-2 est rejoint par le trajet réel. L’essai vérifie ce retour, sans simuler une invulnérabilité.', 'Point H-2 is reached by the actual route. The trial verifies this return without simulating invulnerability.'),
        decision('Comment conclure l’exercice ?', 'How should the exercise be concluded?', [
          choice('keep-fallback', 'Certifier le retour et garder la voie de repli indiquée.', 'Certify the return and keep the fallback route marked.', 'L’équipe reçoit un trajet observé et une consigne de repli lisible.', 'The team receives an observed route and a readable fallback instruction.'),
          choice('repeat-fallback', 'Conserver les relevés et refaire l’exercice avant ouverture.', 'Keep the readings and repeat the exercise before opening.', 'Le corridor reste en exercice ; le relevé acquis n’est pas effacé.', 'The corridor remains a practice route; the recorded reading is not erased.'),
          choice('discard-fallback', 'Supprimer le repli parce que l’aller a réussi.', 'Remove the fallback route because the outbound trip succeeded.', 'Le retour faisait partie de la mission. Un aller réussi ne justifie pas sa suppression.', 'The return was part of the mission. A successful outbound trip does not justify removing it.', false)
        ]), report]
    }
  ];
}
