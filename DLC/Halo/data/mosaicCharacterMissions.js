/** Original Mosaic City contracts, not additional events in Halo's campaign.
 * Builders are injected so a profile can omit this entire DLC contribution. */
export function createLegacyMosaicCharacterMissions({ text, person, marker, decision, choice, report }) {
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

/** Original incidents at the City's UNSC Outpost, not additional Halo campaign events.
 * Installation 04 establishes the Chief's methods and period, not this incident's history.
 * Only new physical actions create operation receipts; the legacy factory preserves old saves. */
export function createMosaicCharacterMissions({ text, person, marker, decision, choice, report }) {
  const operate = (step, kind, propFr, propEn) => ({ ...step, operation: {
    kind, label: step.text, propName: text(propFr, propEn), completedText: step.finding
  } });
  const contact = (fr, en, dialogueFr, dialogueEn) => ({
    ...person('masterchief', fr, en), dialogue: text(dialogueFr, dialogueEn)
  });
  const finish = (fr, en, resultFr, resultEn) => operate({
    ...report, text: text(fr, en), finding: text(resultFr, resultEn)
  }, 'beacon', 'Liaison de l’avant-poste UNSC', 'UNSC outpost uplink');
  return [
    {
      id: 'city-chief-unsc-route-v1', heroId: 'masterchief', universe: 'Halo', contentFile: 'DLC/Halo/data/mosaicCharacterMissions.js',
      title: text('Le canal des survivants', 'The survivors’ channel'),
      location: text('Avant-poste UNSC — relais et rampe d’extraction', 'UNSC Outpost — relay and extraction ramp'),
      request: text('Rétablissez la liaison. Posez une balise à couvert. Je veux que chacun sache par où rentrer.', 'Restore the link. Set a beacon under cover. I want everyone to know the way back.'),
      premise: text('Une secousse de la Brèche a coupé le relais de l’avant-poste. Les appels se perdent entre les hangars et une rampe exposée. Le Chief veut une liaison courte et un point de repli avant d’engager une équipe hors du couvert.', 'A tremor from the Breach has knocked out the outpost relay. Calls are being lost between the hangars and an exposed ramp. The Chief needs a short radio link and a fallback point before sending a team out of cover.'),
      source: 'DLC/Halo/data/characterPlaques.js#masterchief; DLC/Halo/data/heroes.js#masterchief; DLC/Halo/data/mosaicUniversePlaces.js',
      continuity: text('Incident original de Cité à l’avant-poste UNSC. John-117 reste rattaché à Installation 04 ; les relais et cette extraction locale n’ajoutent aucune scène à Halo: Combat Evolved.', 'Original City incident at the UNSC Outpost. John-117 remains tied to Installation 04; these relays and this local extraction add no scene to Halo: Combat Evolved.'),
      references: ['https://www.halowaypoint.com/news/thats-so-raven'],
      steps: [contact('Prendre les consignes du Chief au poste UNSC.', 'Get the Chief’s orders at the UNSC post.',
          'Le relais est au pied du hangar. Remettez-le en service, puis balisez le passage couvert. Mon bouclier ne couvrira pas ceux qui resteront derrière.', 'The relay is beside the hangar. Bring it online, then mark the covered passage. My shield won’t cover the people behind me.'),
        operate(marker('unsc-observed-route', 620, 570, 'Rebrancher le relais UNSC sous couvert.', 'Reconnect the UNSC relay under cover.',
          'Le relais s’allume. Une porteuse stable remplace les parasites ; le poste peut de nouveau joindre l’aire de repli.', 'The relay lights up. A steady carrier replaces the static; the post can reach the fallback area again.'),
        'repair', 'Relais radio UNSC', 'UNSC radio relay'),
        operate(marker('unsc-uncertain-shortcut', 1340, 770, 'Déployer la balise au pied abrité de la rampe.', 'Deploy the beacon at the sheltered foot of the ramp.',
          'La balise répond au relais. Depuis la rampe, son signal indique le passage abrité entre les hangars ; la traversée directe reste exposée.', 'The beacon answers the relay. From the ramp, its signal marks the sheltered passage between the hangars; the direct crossing remains exposed.'),
        'beacon', 'Balise de repli UNSC', 'UNSC fallback beacon'),
        decision('Quelle consigne envoyer à l’équipe ?', 'Which order should the team receive?', [
          choice('mark-unverified', 'Faire suivre le passage couvert balisé, en laissant la rampe libre.', 'Use the marked covered passage and keep the ramp clear.', 'Le Chief fait préparer le repli par les hangars. La balise reste tournée vers le couvert.', 'The Chief has the fallback through the hangars prepared. The beacon stays aimed towards cover.'),
          choice('request-recon', 'Garder l’équipe à l’abri et demander une reconnaissance de la rampe.', 'Keep the team sheltered and request a sweep of the ramp.', 'Le Chief garde la liaison ouverte. Personne ne s’engage sur la rampe avant le retour de la reconnaissance.', 'The Chief keeps the link open. No one commits to the ramp before the reconnaissance returns.'),
          choice('shield-guarantee', 'Faire traverser la rampe à découvert derrière le bouclier du Chief.', 'Cross the exposed ramp behind the Chief’s shield.', '« Mon bouclier est sur mon armure. Trouvez du couvert pour les autres. »', '“My shield is on my armor. Find cover for everyone else.”', false)
        ]),
        finish('Ouvrir le canal de repli depuis l’ancre du poste.', 'Open the fallback channel from the outpost anchor.',
          'Le canal de repli est ouvert. Le Chief vérifie la porteuse : « Reçu. On garde cette ligne. »', 'The fallback channel is open. The Chief checks the carrier: “Copy. Keep this line up.”')]
    },
    {
      id: 'city-chief-return-corridor-v1', heroId: 'masterchief', universe: 'Halo', contentFile: 'DLC/Halo/data/mosaicCharacterMissions.js',
      title: text('Le dernier relais', 'The last relay'),
      location: text('Avant-poste UNSC — poste H-2 et hangar de repli', 'UNSC Outpost — post H-2 and fallback hangar'),
      request: text('Le poste avancé ne peut plus émettre. Prenez le module de réserve et rétablissez le retour radio. Nous partirons quand la ligne tiendra.', 'The forward post can’t transmit. Take the spare module and restore the return link. We move when the line holds.'),
      premise: text('Le relais du hangar reçoit les ordres du Chief, mais son canal de retour reste muet. Une équipe qui s’y replie pourrait recevoir des ordres sans pouvoir appeler à l’aide. Le module radio de réserve attend au poste H-2.', 'The hangar relay receives the Chief’s orders, but its return channel is silent. A team falling back there could receive orders without being able to call for help. A spare radio module is waiting at post H-2.'),
      source: 'DLC/Halo/data/characterPlaques.js#masterchief; DLC/Halo/data/mosaicUniversePlaces.js; src/game/mosaicCityRuntime.js#MOSAIC_WELCOME',
      continuity: text('Opération originale Multiverse Breach dans l’avant-poste de Cité. H-2 et la panne appartiennent à ce quartier ; aucun équipement de Halo 3 ni bataille supplémentaire n’est attribué à Installation 04.', 'Original Multiverse Breach operation at the City outpost. H-2 and the fault belong to this district; no Halo 3 equipment or additional battle is assigned to Installation 04.'),
      references: ['https://www.halowaypoint.com/news/thats-so-raven'],
      steps: [contact('Rejoindre le Chief avant de partir vers le hangar.', 'Join the Chief before heading to the hangar.',
          'Prenez le module à H-2. Le relais est de l’autre côté du hangar. Revenez par le même poste pour ouvrir le canal de retour. Une radio qui ne fait qu’écouter ne suffit pas.', 'Take the module at H-2. The relay is across the hangar. Come back through the same post to open the return channel. A radio that only listens isn’t enough.'),
        operate(marker('cover-origin', 520, 760, 'Prendre le module radio de réserve au poste H-2.', 'Collect the spare radio module at post H-2.',
          'Le module est débranché de son banc de charge et prêt à être monté dans le relais du hangar.', 'The module is disconnected from its charging rack and ready to fit into the hangar relay.'),
        'recover', 'Module radio de réserve', 'Spare radio module'),
        operate(marker('cover-alternate', 1370, 580, 'Installer le module dans le relais de repli.', 'Fit the module into the fallback relay.',
          'Le module se verrouille dans son logement. Le relais reçoit le poste H-2 ; son émission attend la remise en ligne du retour.', 'The module locks into its socket. The relay receives post H-2; transmission awaits the return link being brought online.'),
        'repair', 'Relais du hangar de repli', 'Fallback hangar relay'),
        operate(marker('cover-return', 520, 760, 'Revenir au poste H-2 et raccorder le retour radio.', 'Return to post H-2 and connect the return link.',
          'Les deux indicateurs s’allument à H-2. La liaison fonctionne dans les deux sens ; un appel du hangar peut maintenant atteindre le poste.', 'Both indicators light up at H-2. The link works in both directions; a call from the hangar can now reach the post.'),
        'repair', 'Raccord de retour H-2', 'H-2 return connection'),
        decision('Comment tenir le repli ?', 'How should the fallback be held?', [
          choice('keep-fallback', 'Laisser le relais actif jusqu’au dernier passage.', 'Keep the relay active until the last passage.', 'Le Chief réserve le canal au repli. Le module reste en place pour ceux qui suivent.', 'The Chief reserves the channel for the fallback. The module stays in place for those following.'),
          choice('repeat-fallback', 'Maintenir le regroupement à H-2 et garder une veille radio.', 'Hold the rally at H-2 and maintain a radio watch.', 'Le Chief maintient le regroupement sous couvert. La radio reste ouverte pendant l’attente.', 'The Chief holds the rally under cover. The radio remains open while they wait.'),
          choice('discard-fallback', 'Récupérer le module dès le premier appel reçu.', 'Retrieve the module as soon as the first call comes through.', '« Il reste des gens derrière. Le relais reste avec eux. »', '“There are still people behind us. The relay stays with them.”', false)
        ]),
        finish('Relier la veille H-2 à l’ancre de l’avant-poste.', 'Connect the H-2 watch to the outpost anchor.',
          'La veille H-2 est raccordée. Le Chief prend le canal : « Liaison reçue. Maintenez l’écoute. »', 'The H-2 watch is connected. The Chief takes the channel: “Link received. Keep listening.”')]
    }
  ];
}
