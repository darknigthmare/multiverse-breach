/** Original Nexus continuations. A previous decision changes the physical route;
 * the current decision also needs an in-world verification before its report.
 * These cases preserve the first chapter and never grant campaign rewards. */
export function createMosaicCharacterFollowups({ text, person, exhibit, marker, decision, choice, report }) {
  const route = (x, y, fr, en, findingFr, findingEn) => ({ x, y, text: text(fr, en), finding: text(findingFr, findingEn) });
  const branchingMarker = (id, routes, field) => ({ ...marker(id, 520, 570,
    'Suivre le relevé indiqué par le dossier.', 'Follow the reading identified by the case.',
    'Le relevé est conservé avec sa provenance.', 'The reading is retained with its provenance.'), [field]: routes });
  const build = entry => ({
    id: entry.id, heroId: entry.heroId, requiresMissionId: entry.requiresMissionId, chapter: 2,
    contentFile: 'src/game/mosaicCharacterFollowups.js',
    title: text(...entry.title), premise: text(...entry.premise),
    source: entry.heroId === 'arca_mirelle' ? 'src/game/heroes.js#arca_mirelle' : `src/game/characterPlaques.js#${entry.heroId}`,
    steps: [entry.heroId === 'player_anchor'
      ? exhibit('nexus_anchor_coil', 'Reprendre la référence de la Bobine d’Ancre.', 'Retrieve the Anchor Coil reference.')
      : person(entry.heroId, 'Reprendre le dossier avec son auteur.', 'Reopen the case with its author.'),
    branchingMarker('inherited-route', entry.originRoutes, 'byOriginChoice'),
    marker('crosscheck', ...entry.crosscheck),
    decision(...entry.question, [
      choice('apply', ...entry.apply), choice('hold', ...entry.hold), choice('shortcut', ...entry.shortcut, false)
    ]), branchingMarker('verify-intervention', entry.resultRoutes, 'byChoice'), report]
  });
  return [
    {
      id: 'city-anchor-trace-return-v1', heroId: 'player_anchor', requiresMissionId: 'city-anchor-signature-v1',
      title: ['La signature au retour', 'The signature on return'],
      premise: ['Le registre a gardé ta décision. A.R.C.A. demande maintenant de vérifier comment la signature traverse un relais sans devenir une identité de remplacement.', 'The ledger has retained your decision. A.R.C.A. now asks how the signature crosses a relay without becoming a replacement identity.'],
      originRoutes: {
        'retain-origin': route(490, 580, 'Comparer les deux observations conservées au relais ouest.', 'Compare the two retained observations at the west relay.', 'Les deux entrées citent la même origine et deux observations distinctes. Aucune n’a été promue en personne supplémentaire.', 'Both entries name the same origin and two distinct observations. Neither has become an additional person.'),
        'ask-review': route(1380, 660, 'Retrouver les traces suspendues au poste de relecture.', 'Retrieve the suspended traces at the review station.', 'La fusion est restée suspendue. Les traces peuvent être comparées sans remplacer l’origine de l’Ancre.', 'The merge remains suspended. The traces can be compared without replacing the Anchor’s origin.')
      },
      crosscheck: [700, 790, 'Contrôler le reçu du retour de signal.', 'Check the signal-return receipt.', 'Le retour conserve la référence initiale. Le relais renseigne une observation, pas un nouvel individu.', 'The return retains the original reference. The relay reports an observation, not a new individual.'],
      question: ['Quel usage autoriser pour ce relais ?', 'What use should this relay permit?'],
      apply: ['Raccorder le relais avec sa référence d’origine.', 'Connect the relay with its origin reference.', 'Le trajet est vérifié avec l’origine et ses observations séparées.', 'The route is verified with its origin and separate observations.'],
      hold: ['Conserver le relais en lecture seule.', 'Keep the relay read-only.', 'La référence reste consultable sans transfert de signature.', 'The reference remains readable without transferring the signature.'],
      shortcut: ['Remplacer l’Ancre par la copie la plus stable.', 'Replace the Anchor with the most stable copy.', 'La stabilité d’une trace ne décide pas de l’identité du joueur.', 'A trace’s stability does not decide the player’s identity.'],
      resultRoutes: {
        apply: route(1280, 780, 'Vérifier le raccord portant la référence d’origine.', 'Verify the connection bearing the origin reference.', 'Le raccord retourne l’identifiant initial et conserve les observations annexes.', 'The connection returns the initial identifier and retains the attached observations.'),
        hold: route(540, 770, 'Vérifier le verrou de lecture seule.', 'Verify the read-only lock.', 'La lecture fonctionne ; le transfert reste fermé. Ce verrou est consigné dans le dossier.', 'Reading works; transfer remains closed. This lock is recorded in the case.')
      }
    },
    {
      id: 'city-mirelle-relay-followup-v1', heroId: 'arca_mirelle', requiresMissionId: 'city-mirelle-suture-v1',
      title: ['Après la suture', 'After the suture'],
      premise: ['Mirelle revient sur le relais réparé ou isolé. Elle veut tester sa sortie avec un signal d’essai avant d’y laisser passer les voix conservées.', 'Mirelle revisits the repaired or isolated relay. She wants to test its output with a test signal before letting the retained voices through.'],
      originRoutes: {
        'separate-traces': route(1210, 680, 'Contrôler les deux canaux rétablis.', 'Check the two restored channels.', 'Les canaux sont séparés, mais le journal de sortie doit encore être comparé à la sauvegarde.', 'The channels are separate, but the output log still needs comparison with the backup.'),
        'isolate-relay': route(540, 770, 'Reprendre la sauvegarde du relais isolé.', 'Retrieve the isolated relay’s backup.', 'L’isolement a conservé les deux identifiants. Un signal d’essai peut être utilisé sans déplacer les voix.', 'Isolation preserved both identifiers. A test signal can be used without moving the voices.')
      },
      crosscheck: [1320, 580, 'Comparer l’entrée et la sortie du signal d’essai.', 'Compare the test signal’s input and output.', 'Le signal d’essai garde son identifiant. Cette mesure ne vaut que pour ce circuit.', 'The test signal retains its identifier. This measurement applies only to this circuit.'],
      question: ['Comment poursuivre la réparation ?', 'How should the repair continue?'],
      apply: ['Ouvrir un canal surveillé avec retour vérifié.', 'Open one monitored channel with a verified return.', 'Un canal surveillé est consigné ; la sauvegarde reste distincte.', 'One monitored channel is recorded; the backup stays separate.'],
      hold: ['Isoler le circuit et conserver le test.', 'Isolate the circuit and retain the test.', 'Le résultat d’essai reste disponible pour une reprise ultérieure.', 'The test result remains available for a later resumption.'],
      shortcut: ['Supprimer la sauvegarde après le premier test.', 'Delete the backup after the first test.', 'Un test réussi ne rend pas les voix conservées inutiles.', 'One successful test does not make the retained voices expendable.'],
      resultRoutes: {
        apply: route(1380, 660, 'Vérifier le retour du canal surveillé.', 'Verify the monitored channel’s return.', 'Le témoin de retour porte l’identifiant testé. La sauvegarde n’a pas été remplacée.', 'The return indicator bears the tested identifier. The backup has not been replaced.'),
        hold: route(490, 580, 'Vérifier le scellé d’isolement et sa sauvegarde.', 'Verify the isolation seal and its backup.', 'Le circuit est isolé et les deux traces restent présentes.', 'The circuit is isolated and both traces remain present.')
      }
    },
    {
      id: 'city-bastion-tenth-witness-v1', heroId: 'arca_bastion', requiresMissionId: 'city-bastion-tenth-route-v1',
      title: ['Une place pour le témoin', 'A place for the witness'],
      premise: ['Une notice revient au Rempart après la publication du premier dossier. Bastion demande d’examiner ce qu’elle prouve avant d’ajouter un nom à la dixième route.', 'A notice returns to the Bulwark after the first case is published. Bastion asks what it proves before adding a name to the tenth route.'],
      originRoutes: {
        'name-debt': route(1340, 580, 'Recueillir la notice du registre public.', 'Collect the notice from the public ledger.', 'La collecte a reçu un témoignage signé, mais son lien à la route reste à établir.', 'The collection received signed testimony, but its link to the route remains unproven.'),
        'attach-unknowns': route(540, 770, 'Retrouver la notice jointe à la fermeture.', 'Retrieve the notice attached to the closure.', 'La notice décrit une fermeture sans identifier les personnes absentes.', 'The notice describes a closure without identifying the absent people.')
      },
      crosscheck: [1280, 780, 'Comparer l’heure de fermeture et le témoignage.', 'Compare the closure time with the testimony.', 'Les horaires concordent. Le témoin décrit une porte, pas la liste des personnes derrière elle.', 'The times match. The witness describes a door, not the people behind it.'],
      question: ['Quelle place donner au témoignage ?', 'How should the testimony be recorded?'],
      apply: ['Joindre le témoignage sans combler les noms manquants.', 'Attach the testimony without filling missing names.', 'La route conserve une preuve supplémentaire et ses inconnus.', 'The route retains an additional piece of evidence and its unknowns.'],
      hold: ['Garder la notice en attente d’un second témoin.', 'Hold the notice for a second witness.', 'La fermeture reste reconnue ; la nouvelle attribution reste en attente.', 'The closure remains acknowledged; the new attribution stays pending.'],
      shortcut: ['Inventer les noms pour fermer le registre.', 'Invent names to close the ledger.', 'Bastion ne remplace pas les absents par une liste commode.', 'Bastion does not replace the absent with a convenient list.'],
      resultRoutes: {
        apply: route(620, 570, 'Vérifier l’annexe du registre public.', 'Verify the public ledger’s annex.', 'L’annexe cite le témoin et laisse les noms inconnus explicitement ouverts.', 'The annex cites the witness and explicitly leaves unknown names open.'),
        hold: route(1320, 710, 'Vérifier la notice en attente au Rempart.', 'Verify the pending notice at the Bulwark.', 'La notice reste accessible avec sa raison de suspension.', 'The notice remains accessible with the reason it was held.')
      }
    },
    {
      id: 'city-nova-return-measurement-v1', heroId: 'arca_nova', requiresMissionId: 'city-nova-measured-exit-v1',
      title: ['Le retour mesurable', 'The measurable return'],
      premise: ['Nova propose enfin un relevé de retour. La nouvelle mesure doit compléter le dossier sans transformer une possibilité locale en promesse universelle.', 'Nova offers a return reading at last. The new measurement must complete the case without turning a local possibility into a universal promise.'],
      originRoutes: {
        'mark-uncertainty': route(1280, 780, 'Reprendre la limite indiquée à la sonde distante.', 'Review the limit noted at the distant probe.', 'Le dossier signalait un retour inconnu. La sonde attend un témoin de retour distinct.', 'The case marked an unknown return. The probe awaits a separate return observation.'),
        'require-return': route(620, 570, 'Relever le départ resté en attente.', 'Read the departure that remained on hold.', 'Aucun départ n’a été certifié. Le relevé peut commencer avec une référence préservée.', 'No departure was certified. The reading can begin with a retained reference.')
      },
      crosscheck: [700, 790, 'Mesurer le retour à la référence de départ.', 'Measure the return at the departure reference.', 'La signature revient avec un délai mesuré. Le délai varie assez pour exclure une garantie absolue.', 'The signature returns with a measured delay. Its variation rules out an absolute guarantee.'],
      question: ['Comment présenter cette route ?', 'How should this route be presented?'],
      apply: ['Publier le trajet et son intervalle de mesure.', 'Publish the route and its measured interval.', 'La route devient une option documentée avec ses limites.', 'The route becomes a documented option with its limits.'],
      hold: ['Demander une nouvelle mesure à une autre heure.', 'Request another reading at a different time.', 'Le relevé reste conservé et la route attend une comparaison.', 'The reading stays saved and the route awaits comparison.'],
      shortcut: ['Certifier toutes les issues sur un seul retour.', 'Certify every exit from one return.', 'Le monocle de Nova ne transforme pas un échantillon en prophétie.', 'Nova’s monocle does not turn a sample into prophecy.'],
      resultRoutes: {
        apply: route(1380, 660, 'Vérifier la borne qui publie l’intervalle.', 'Verify the terminal publishing the interval.', 'La borne affiche le délai et l’heure de mesure avec la route.', 'The terminal displays the delay and measurement time with the route.'),
        hold: route(490, 580, 'Vérifier la référence de la seconde mesure.', 'Verify the reference for the second reading.', 'La référence est prête pour une seconde mesure à effectuer. Le premier relevé est conservé sans être écrasé.', 'The reference is ready for a second reading still to be performed. The first reading is retained without being overwritten.')
      }
    },
    {
      id: 'city-sable-map-detour-v1', heroId: 'arca_sable', requiresMissionId: 'city-sable-signed-map-v1',
      title: ['Le détour signé', 'The signed detour'],
      premise: ['Un accès a changé depuis les trois relevés de Sable. La carte doit montrer un détour vérifié et la date de la correction.', 'An access route changed after Sable’s three readings. The map needs a verified detour and the date of its correction.'],
      originRoutes: {
        'signed-correction': route(1380, 660, 'Comparer l’accès avec la correction signée.', 'Compare the access with the signed correction.', 'La correction était exacte lors du relevé. Une nouvelle barrière impose de dater le changement.', 'The correction was accurate when measured. A new barrier requires the change to be dated.'),
        'annotated-original': route(490, 580, 'Reprendre l’original et ses annotations.', 'Retrieve the original and its annotations.', 'Les deux versions montrent quand le passage a changé ; aucune ne suffit à certifier le détour.', 'Both versions show when the passage changed; neither is enough to certify the detour.')
      },
      crosscheck: [1320, 710, 'Parcourir et relever le débouché du détour.', 'Walk to and record the detour exit.', 'Le débouché rejoint le quartier sans traverser la barrière. Sa largeur est mesurée sur place.', 'The exit rejoins the district without crossing the barrier. Its width is measured in person.'],
      question: ['Quelle modification publier ?', 'Which change should be published?'],
      apply: ['Publier le détour mesuré avec la date et le témoin.', 'Publish the measured detour with its date and witness.', 'Le détour conserve ses mesures, son auteur et la limite du passage.', 'The detour retains its measurements, author and passage limit.'],
      hold: ['Fermer l’ancien accès en attendant un contrôle croisé.', 'Close the old access pending a cross-check.', 'L’accès ancien reste signalé fermé et le détour attend un second relevé.', 'The old access stays marked closed while the detour awaits a second reading.'],
      shortcut: ['Garder la vieille carte pour éviter une nouvelle version.', 'Keep the old map to avoid a new version.', 'Une carte signée n’autorise pas à cacher un changement constaté.', 'A signed map does not permit a witnessed change to be hidden.'],
      resultRoutes: {
        apply: route(700, 790, 'Contrôler la balise du détour publié.', 'Check the published detour marker.', 'La balise renvoie à la correction signée et à son relevé de terrain.', 'The marker points to the signed correction and its field reading.'),
        hold: route(620, 570, 'Contrôler l’avertissement devant l’ancien accès.', 'Check the warning at the old access.', 'L’avertissement donne la fermeture et l’état du contrôle, sans fausse route sûre.', 'The warning states the closure and review status without inventing a safe route.')
      }
    },
    {
      id: 'city-loom-receiving-end-v1', heroId: 'arca_loom', requiresMissionId: 'city-loom-return-thread-v1',
      title: ['L’autre bout du fil', 'The other end of the thread'],
      premise: ['Le fil de retour existe, mais Loom n’a encore aucune preuve de la capacité du refuge à recevoir une voix. Un signal d’essai suffit pour cette visite.', 'The return thread exists, but Loom has no evidence that the refuge can receive a voice. A test signal is enough for this visit.'],
      originRoutes: {
        'verify-thread': route(1370, 580, 'Reprendre le trajet de retour vérifié.', 'Retrieve the verified return route.', 'Le trajet conserve sa tension. La borne d’accueil n’a pas encore donné d’accusé de réception.', 'The route retains its tension. The receiving terminal has not yet acknowledged receipt.'),
        'retain-local': route(520, 760, 'Vérifier les voix gardées dans le drone.', 'Check the voices retained in the drone.', 'Les voix sont restées ici. Le relevé transmis ne contient aucune copie de leur mémoire.', 'The voices remained here. The transmitted reading contains no copy of their memory.')
      },
      crosscheck: [1280, 780, 'Lire le retour du signal d’essai au refuge.', 'Read the test signal’s return from the refuge.', 'La borne accuse réception du signal technique. Elle ne documente pas l’accueil d’une conscience.', 'The terminal acknowledges the technical signal. It does not document receiving a consciousness.'],
      question: ['Que permettre sur ce fil ?', 'What should this thread permit?'],
      apply: ['Autoriser les relevés techniques seulement.', 'Allow technical readings only.', 'Le fil porte des relevés ; les voix restent dans le drone de Loom.', 'The thread carries readings; the voices remain in Loom’s drone.'],
      hold: ['Garder le fil fermé jusqu’à une vérification du refuge.', 'Keep the thread closed until the refuge is verified.', 'La route est archivée et son usage reste suspendu.', 'The route is archived and its use remains suspended.'],
      shortcut: ['Envoyer une voix pour voir si elle revient.', 'Send a voice to see whether it returns.', 'Loom ne traite pas une conscience conservée comme un signal d’essai.', 'Loom does not treat a retained consciousness as a test signal.'],
      resultRoutes: {
        apply: route(620, 570, 'Vérifier le filtre des relevés techniques.', 'Verify the technical-reading filter.', 'Le filtre accepte la télémétrie et refuse le transfert des voix.', 'The filter accepts telemetry and refuses voice transfer.'),
        hold: route(540, 770, 'Contrôler la fermeture du fil au départ.', 'Check the thread closure at departure.', 'Le départ est fermé sans effacer le relevé de retour.', 'Departure is closed without deleting the return reading.')
      }
    },
    {
      id: 'city-marrow-independent-answers-v1', heroId: 'arca_marrow', requiresMissionId: 'city-marrow-distinct-choices-v1',
      title: ['Deux réponses propres', 'Two independent answers'],
      premise: ['Les deux empreintes ont formulé des demandes différentes. Marrow veut en conserver la provenance avant de juger un éventuel remplacement.', 'The two imprints have made different requests. Marrow wants to retain their provenance before judging any possible replacement.'],
      originRoutes: {
        'separate-testimony': route(560, 580, 'Relire les témoignages restés séparés.', 'Reread the testimonies kept separate.', 'La première empreinte demande un accès au registre. La seconde demande un espace distinct.', 'The first imprint asks for access to the ledger. The second asks for a separate space.'),
        'request-dialogue': route(1320, 710, 'Recueillir les réponses après la proposition de dialogue.', 'Collect the answers after the dialogue proposal.', 'Une empreinte accepte un échange, l’autre demande un délai. Le silence n’est pas une revendication de remplacement.', 'One imprint accepts an exchange, the other asks for time. Silence is not a claim to replace anyone.')
      },
      crosscheck: [700, 790, 'Vérifier séparément l’origine des deux demandes.', 'Verify the origin of both requests separately.', 'Les demandes portent deux signatures distinctes. Aucune ne demande la suppression de l’autre.', 'The requests bear two distinct signatures. Neither asks for the other’s deletion.'],
      question: ['Quelle réponse enregistrer ?', 'What response should be recorded?'],
      apply: ['Préserver deux réponses et deux espaces de témoignage.', 'Preserve two answers and two testimony spaces.', 'Les continuations gardent une réponse attribuée sans jugement sur le seul visage.', 'The continuations retain attributed answers without judgment based only on appearance.'],
      hold: ['Suspendre la confrontation et conserver les demandes.', 'Suspend the confrontation and retain the requests.', 'Les demandes sont préservées pendant la suspension décidée.', 'The requests are retained during the agreed suspension.'],
      shortcut: ['Forcer un duel pour désigner l’original.', 'Force a duel to identify the original.', 'Un duel ne démontre ni l’identité ni le droit d’exister.', 'A duel proves neither identity nor the right to exist.'],
      resultRoutes: {
        apply: route(1380, 660, 'Vérifier les deux emplacements attribués.', 'Verify the two assigned spaces.', 'Chaque emplacement garde la demande et la signature correspondantes.', 'Each space retains the matching request and signature.'),
        hold: route(490, 580, 'Vérifier la suspension au poste de rencontre.', 'Verify the suspension at the meeting station.', 'La suspension indique qu’un nouvel échange reste à organiser ; aucun refus n’est converti en culpabilité.', 'The suspension records that a new exchange still needs arranging; no refusal becomes guilt.')
      }
    },
    {
      id: 'city-tessera-caption-review-v1', heroId: 'arca_tessera', requiresMissionId: 'city-tessera-two-accounts-v1',
      title: ['La notice choisie', 'The chosen caption'],
      premise: ['Tessera veut relire la notice destinée aux nouveaux arrivants. Les deux souvenirs doivent rester attribués selon sa décision précédente.', 'Tessera wants to review the caption for new arrivals. Both memories must remain attributed according to her previous decision.'],
      originRoutes: {
        'parallel-accounts': route(610, 570, 'Relire les deux notices conservées.', 'Reread the two retained captions.', 'Les notices présentent les deux provenances sans déclarer Tessera remplaçante.', 'The captions present both origins without declaring Tessera a replacement.'),
        'hold-display': route(1320, 680, 'Retrouver la notice suspendue pour relecture.', 'Retrieve the caption held for review.', 'La notice attend toujours la relecture de Tessera. Aucune publication n’a été ajoutée en son nom.', 'The caption still awaits Tessera’s review. No publication was added in her name.')
      },
      crosscheck: [700, 790, 'Comparer la version d’accueil avec les deux sources.', 'Compare the welcome version with both sources.', 'La version courte a perdu une attribution. Elle peut être corrigée sans fusionner les souvenirs.', 'The short version lost one attribution. It can be corrected without merging the memories.'],
      question: ['Quelle notice laisser à l’accueil ?', 'Which caption should remain at reception?'],
      apply: ['Publier la notice corrigée avec les deux attributions.', 'Publish the corrected caption with both attributions.', 'La notice conserve le nom choisi et les deux provenances.', 'The caption preserves the chosen name and both origins.'],
      hold: ['Garder la notice courte en attente de relecture.', 'Hold the short caption for review.', 'La version courte reste en attente ; les notices sources restent accessibles.', 'The short version remains pending; source captions remain available.'],
      shortcut: ['Choisir l’origine la plus facile à raconter.', 'Choose whichever origin is easiest to tell.', 'La simplicité d’une notice n’autorise pas l’effacement d’un souvenir.', 'A caption’s simplicity does not authorize erasing a memory.'],
      resultRoutes: {
        apply: route(490, 580, 'Vérifier la notice corrigée à l’accueil.', 'Verify the corrected caption at reception.', 'Les deux attributions figurent sur la notice présentée aux arrivants.', 'Both attributions appear on the caption shown to arrivals.'),
        hold: route(1380, 660, 'Vérifier le renvoi vers les notices sources.', 'Verify the link to the source captions.', 'Le renvoi affiche la relecture en attente et conserve les deux sources.', 'The link shows the pending review and retains both sources.')
      }
    },
    {
      id: 'city-quillon-delivery-check-v1', heroId: 'arca_quillon', requiresMissionId: 'city-quillon-single-receipt-v1',
      title: ['La remise vérifiée', 'The verified handover'],
      premise: ['Quillon suit la restitution après le premier contrôle du reçu. Il faut vérifier la réception réelle sans compter la copie comme un second objet.', 'Quillon follows the restitution after the first receipt check. Actual delivery must be verified without counting the copy as a second item.'],
      originRoutes: {
        'link-copy': route(1320, 710, 'Reprendre la remise unique enregistrée.', 'Retrieve the recorded single handover.', 'Le registre ne compte qu’une remise. Son destinataire attend encore une confirmation locale.', 'The ledger counts one handover. Its recipient still awaits local confirmation.'),
        'hold-account': route(540, 770, 'Reprendre le compte laissé provisoire.', 'Retrieve the account left provisional.', 'Q-17 avait déjà été remis à la Galerie. Seul le total est en attente ; les deux reçus ne créent pas un second outil.', 'Q-17 had already been handed to the Gallery. Only the total is pending; two receipts do not create a second tool.')
      },
      crosscheck: [620, 570, 'Comparer l’accusé de réception avec le reçu d’origine.', 'Compare the acknowledgement with the original receipt.', 'L’accusé cite le même objet et la même remise. La copie reste une pièce documentaire.', 'The acknowledgement cites the same item and handover. The copy remains documentary evidence.'],
      question: ['Comment clôturer le contrôle ?', 'How should this check be closed?'],
      apply: ['Confirmer la remise unique avec son accusé.', 'Confirm the single handover with its acknowledgement.', 'La remise est rapprochée du reçu sans nouvelle création d’objet.', 'The handover is reconciled with its receipt without creating another item.'],
      hold: ['Garder le compte provisoire jusqu’à une confirmation en personne.', 'Keep the account provisional pending in-person confirmation.', 'Le total reste provisoire ; aucune dette ni nouvelle remise n’est créée.', 'The total remains provisional; no debt or new handover is created.'],
      shortcut: ['Payer une seconde remise avec la copie.', 'Pay for a second handover with the copy.', 'Quillon refuse de transformer une preuve copiée en ressource supplémentaire.', 'Quillon refuses to turn copied evidence into an additional resource.'],
      resultRoutes: {
        apply: route(1380, 660, 'Vérifier le rapprochement au comptoir.', 'Verify the reconciliation at the counter.', 'Le comptoir indique une remise et un accusé lié au reçu d’origine.', 'The counter shows one handover and an acknowledgement linked to the original receipt.'),
        hold: route(490, 580, 'Vérifier le statut provisoire du compte.', 'Verify the account’s provisional status.', 'Le compte cite la confirmation manquante. L’outil reste à la Galerie et le reçu conserve son origine.', 'The account names the missing confirmation. The tool stays at the Gallery and the receipt retains its origin.')
      }
    },
    {
      id: 'city-nadir-second-threshold-v1', heroId: 'arca_nadir', requiresMissionId: 'city-nadir-return-probe-v1',
      title: ['Le seuil suivant', 'The next threshold'],
      premise: ['Un second seuil apparaît sur le relevé de Nadir. Le trajet vérifié ne peut pas lui être étendu sans mesurer son propre retour.', 'A second threshold appears in Nadir’s readings. The verified route cannot be extended to it without measuring its own return.'],
      originRoutes: {
        'bounded-return': route(1370, 580, 'Reprendre la limite du retour certifié.', 'Retrieve the limit of the certified return.', 'Le reçu s’arrête au premier seuil. Il n’inclut aucune mesure du passage suivant.', 'The receipt ends at the first threshold. It includes no measurement of the next passage.'),
        'repeat-probe': route(520, 760, 'Reprendre la répétition demandée au départ.', 'Retrieve the repeat requested at departure.', 'La répétition reste à effectuer. Le premier seuil est toujours fermé et son reçu ne couvre pas le seuil nouveau.', 'The repeat is still to be performed. The first threshold remains closed and its receipt does not cover the new threshold.')
      },
      crosscheck: [1280, 780, 'Relever la limite du second seuil.', 'Read the second threshold’s boundary.', 'La limite répond au signal de proximité, mais aucun accusé de retour ne vient de l’autre côté.', 'The boundary responds to the proximity signal, but no return acknowledgement arrives from the other side.'],
      question: ['Que montrer sur la carte des seuils ?', 'What should the threshold map show?'],
      apply: ['Marquer une limite observée et un passage non vérifié.', 'Mark an observed boundary and an unverified passage.', 'Le premier trajet garde le statut du dossier précédent ; le second seuil reste distinct et non certifié.', 'The first route keeps its previous case status; the second threshold stays separate and uncertified.'],
      hold: ['Garder le second seuil hors de la route publiée.', 'Keep the second threshold off the published route.', 'La route publiée s’arrête à son dernier retour vérifié.', 'The published route stops at its last verified return.'],
      shortcut: ['Étendre automatiquement le reçu au second seuil.', 'Automatically extend the receipt to the second threshold.', 'Un retour mesuré ne se transmet pas par voisinage à un autre passage.', 'A measured return does not transfer to another passage by proximity.'],
      resultRoutes: {
        apply: route(1380, 660, 'Vérifier les deux états sur la carte.', 'Verify both states on the map.', 'La carte sépare trajet vérifié et seuil observé sans retour.', 'The map separates the verified route from the observed threshold with no return.'),
        hold: route(620, 570, 'Vérifier le point d’arrêt de la route publiée.', 'Verify the endpoint of the published route.', 'Le point d’arrêt cite le dernier reçu valide et conserve le nouveau relevé à part.', 'The endpoint cites the last valid receipt and retains the new reading separately.')
      }
    },
    {
      id: 'city-elyra-renewed-passage-v1', heroId: 'arca_elyra', requiresMissionId: 'city-elyra-consented-door-v1',
      title: ['Une nouvelle demande', 'A new request'],
      premise: ['La borne reçoit une nouvelle demande de passage. Elyra veut vérifier qu’un accord neuf ne réactive pas automatiquement les permissions retirées.', 'The terminal receives a new passage request. Elyra wants to verify that fresh agreement does not automatically reactivate withdrawn permissions.'],
      originRoutes: {
        'honour-both': route(1320, 680, 'Relire les décisions conservées par la borne.', 'Reread the decisions retained by the terminal.', 'L’accord ancien et son retrait restent distincts. La demande nouvelle possède son propre identifiant.', 'The old agreement and its withdrawal remain separate. The new request has its own identifier.'),
        'close-terminal': route(540, 770, 'Vérifier la fermeture de la borne.', 'Verify the terminal closure.', 'La borne est restée fermée. La nouvelle demande peut être examinée sans rouvrir les anciennes permissions.', 'The terminal remained closed. The new request can be examined without reopening old permissions.')
      },
      crosscheck: [700, 790, 'Contrôler la portée et la durée de la nouvelle demande.', 'Check the scope and duration of the new request.', 'Le volontaire a confirmé explicitement cette nouvelle demande pour un passage précis, avec sa durée et son droit de retrait. Les autorisations antérieures restent séparées.', 'The volunteer explicitly confirmed this new request for one specific passage, with its duration and right to withdraw. Earlier authorizations remain separate.'],
      question: ['Quelle réponse appliquer ?', 'Which response should be applied?'],
      apply: ['Enregistrer ce seul accord avec sa possibilité de retrait.', 'Record this agreement alone with its withdrawal option.', 'La nouvelle autorisation reste limitée à sa demande et révocable.', 'The new authorization stays limited to its request and can be withdrawn.'],
      hold: ['Garder la demande en attente d’une confirmation.', 'Hold the request pending confirmation.', 'Aucun passage n’est ouvert pendant l’attente.', 'No passage opens while confirmation is pending.'],
      shortcut: ['Réactiver toutes les anciennes permissions.', 'Reactivate every former permission.', 'Une nouvelle demande ne supprime pas les refus et retraits antérieurs.', 'A new request does not erase earlier refusals and withdrawals.'],
      resultRoutes: {
        apply: route(1380, 660, 'Vérifier l’autorisation limitée et son retrait.', 'Verify the limited authorization and its withdrawal.', 'La borne lie l’accord à cette demande et conserve la commande de retrait.', 'The terminal links the agreement to this request and retains its withdrawal control.'),
        hold: route(490, 580, 'Vérifier que la borne reste fermée en attente.', 'Verify that the terminal stays closed while waiting.', 'La demande reste consultable et aucune ancienne permission n’a repris effet.', 'The request stays readable and no former permission has taken effect again.')
      }
    },
    {
      id: 'city-oryn-manifest-delivery-v1', heroId: 'arca_oryn', requiresMissionId: 'city-oryn-separate-voices-v1',
      title: ['La tournée des voix', 'The voices’ round'],
      premise: ['Une copie du manifeste arrive à l’accueil. Oryn vérifie les signatures et le retrait jusque dans cette nouvelle copie.', 'A copy of the manifest reaches reception. Oryn verifies the signatures and withdrawal in this new copy as well.'],
      originRoutes: {
        'separate-voices': route(1340, 580, 'Comparer la copie avec le manifeste attribué.', 'Compare the copy with the attributed manifest.', 'La copie conserve les deux signatures. Le texte retiré doit aussi être absent de son index.', 'The copy retains both signatures. The withdrawn text must also be absent from its index.'),
        'hold-attribution': route(540, 770, 'Retrouver la copie mise en attente de relecture.', 'Retrieve the copy held for review.', 'La copie porte la même attente. Aucun nom n’a été rempli à la place des témoins.', 'The copy carries the same pending status. No name was filled in for the witnesses.')
      },
      crosscheck: [1280, 780, 'Vérifier l’index de la copie d’accueil.', 'Verify the reception copy’s index.', 'L’index contient encore une ancienne entrée. Elle cite le retrait mais pointe vers un texte qui ne doit plus être public.', 'The index still contains an old entry. It cites the withdrawal but points to text that must no longer be public.'],
      question: ['Comment corriger cette diffusion ?', 'How should this distribution be corrected?'],
      apply: ['Retirer le lien public et conserver la notice de retrait.', 'Remove the public link and retain the withdrawal notice.', 'La copie respecte le retrait tout en gardant la trace de la correction.', 'The copy respects the withdrawal while retaining a record of the correction.'],
      hold: ['Suspendre la copie entière pour une relecture volontaire.', 'Suspend the whole copy for voluntary review.', 'La diffusion reste suspendue sans fusionner ni réattribuer les voix.', 'Distribution stays suspended without merging or reattributing voices.'],
      shortcut: ['Garder le texte retiré sous le nom d’Oryn.', 'Keep the withdrawn text under Oryn’s name.', 'Changer la signature ne rétablit pas une autorisation retirée.', 'Changing the signature does not restore a withdrawn authorization.'],
      resultRoutes: {
        apply: route(620, 570, 'Vérifier l’index public corrigé.', 'Verify the corrected public index.', 'La notice de retrait reste visible et le lien vers le texte est absent.', 'The withdrawal notice remains visible and the link to the text is absent.'),
        hold: route(1380, 660, 'Vérifier la suspension à l’accueil.', 'Verify the suspension at reception.', 'L’accueil indique la relecture en attente sans republier les contributions.', 'Reception shows the pending review without republishing the contributions.')
      }
    }
  ].map(build);
}
