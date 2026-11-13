/** Ripley's Alien (1979) incarnation stays distinct from ripley_aliens.
 * These are original City investigations and inert evacuation exercises. */
export function createLegacyMosaicCharacterMissions({ text, person, marker, decision, choice, report }) {
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

/** Original City incidents with Ripley's Alien (1979) incarnation.
 * The Nostromo/Narcissus references do not add scenes to the released film.
 * Only new physical actions create operation receipts; the legacy factory preserves old saves. */
export function createMosaicCharacterMissions({ text, person, marker, decision, choice, report }) {
  const operate = (step, kind, propFr, propEn) => ({ ...step, operation: {
    kind, label: step.text, propName: text(propFr, propEn), completedText: step.finding
  } });
  const contact = (fr, en, dialogueFr, dialogueEn) => ({
    ...person('ripley', fr, en), dialogue: text(dialogueFr, dialogueEn)
  });
  const finish = (fr, en, resultFr, resultEn) => operate({
    ...report, text: text(fr, en), finding: text(resultFr, resultEn)
  }, 'beacon', 'Liaison de secours du quartier Alien', 'Alien district emergency link');
  return [
    {
      id: 'city-ripley-narcissus-route-v1', heroId: 'ripley', universe: 'Alien', contentFile: 'DLC/Alien/data/mosaicCharacterMissions.js',
      title: text('L’accès au Narcissus', 'The way to the Narcissus'),
      location: text('Quartier Alien — coursive du Nostromo et accès Narcissus', 'Alien District — Nostromo passage and Narcissus access'),
      request: text('Coupez le départ qui chauffe. Ensuite, ouvrez l’accès à la navette. La cargaison peut attendre ; nous, non.', 'Cut the feed that’s overheating. Then open the shuttle access. The cargo can wait. We can’t.'),
      premise: text('Une coursive du Nostromo arrachée par la Brèche aboutit dans le quartier Alien. Un départ électrique brûlé bloque l’accès balisé Narcissus. Ripley veut isoler la panne et libérer le passage sans entraîner quelqu’un dans les conduits.', 'A Nostromo passage torn loose by the Breach ends in the Alien district. A burned electrical feed has locked the access marked Narcissus. Ripley wants the fault isolated and the passage opened without sending anyone into the ducts.'),
      source: 'DLC/Alien/data/heroes.js#ripley.incarnation; DLC/Alien/data/characterPlaques.js#ripley; DLC/Alien/data/sourceSceneStages.js#narcissus_escape_1979',
      continuity: text('Incident original Multiverse Breach dans un fragment de Nostromo intégré à la Cité. Ripley reste celle d’Alien (1979) ; la panne ne rejoue pas l’évasion du film et ne lui donne ni M41A, ni power loader, ni souvenirs d’Aliens.', 'Original Multiverse Breach incident in a Nostromo fragment embedded in the City. Ripley remains her Alien (1979) incarnation; the fault does not replay the film’s escape or give her an M41A, power loader or memories of Aliens.'),
      references: ['https://www.20thcenturystudios.com/movies/alien'],
      steps: [contact('Rejoindre Ripley devant l’accès fermé.', 'Join Ripley by the locked access.',
          'Le panneau à gauche alimente la section brûlée. Isolez-la avant de toucher au verrou. Et si vous entendez quelque chose dans les conduits, vous revenez. Vous n’allez pas voir.', 'The panel on the left feeds the burned section. Isolate it before touching the lock. And if you hear something in the ducts, come back. Don’t go looking.'),
        operate(marker('nostromo-warning', 610, 570, 'Couper le départ en court-circuit au panneau du Nostromo.', 'Cut the shorted feed at the Nostromo panel.',
          'Le coupe-circuit tombe. L’indicateur de chauffe s’éteint ; la section endommagée est isolée du verrou de secours.', 'The breaker drops. The heat indicator goes dark; the damaged section is isolated from the emergency lock.'),
        'secure', 'Coupe-circuit du Nostromo', 'Nostromo circuit breaker'),
        operate(marker('narcissus-route', 1340, 770, 'Déverrouiller manuellement l’accès balisé Narcissus.', 'Manually release the access marked Narcissus.',
          'Le verrou cède sous la commande manuelle. Le repère Narcissus reste allumé et la poignée de secours est accessible depuis le passage.', 'The lock releases under manual control. The Narcissus marker stays lit and the emergency handle can be reached from the passage.'),
        'route', 'Verrou d’accès Narcissus', 'Narcissus access lock'),
        decision('Quelle consigne donner à la sortie ?', 'Which instruction should be given at the exit?', [
          choice('preserve-escape', 'Garder le passage ouvert et la section brûlée isolée.', 'Keep the passage open and the burned section isolated.', 'Ripley garde l’accès à la navette dégagé. Personne n’a besoin de remettre le circuit défectueux sous tension pour sortir.', 'Ripley keeps the shuttle access clear. No one needs to power the faulty circuit to get out.'),
          choice('hold-route', 'Tenir l’entrée à distance de la panne et laisser la commande manuelle prête.', 'Hold at the entrance away from the fault and leave the manual control ready.', 'Ripley tient l’entrée avec la commande de secours à portée. Le circuit reste isolé pendant l’attente.', 'Ripley holds at the entrance with the emergency control within reach. The circuit remains isolated while they wait.'),
          choice('follow-alarm', 'Suivre le bruit dans les conduits avant de repartir.', 'Follow the noise into the ducts before leaving.', '« Non. Nous avons une sortie. Je ne vais pas perdre quelqu’un dans un conduit pour savoir ce qui s’y cache. »', '“No. We have a way out. I’m not losing someone in a duct to find out what’s in it.”', false)
        ]),
        finish('Brancher le canal d’évacuation sur l’ancre du quartier.', 'Connect the evacuation channel to the district anchor.',
          'Le canal d’évacuation répond. Ripley reste sur la ligne : « Je vous entends. Gardez la sortie libre. »', 'The evacuation channel answers. Ripley stays on the line: “I hear you. Keep the exit clear.”')]
    },
    {
      id: 'city-ripley-alarm-exit-v1', heroId: 'ripley', universe: 'Alien', contentFile: 'DLC/Alien/data/mosaicCharacterMissions.js',
      title: text('Fermez ce conduit', 'Seal that duct'),
      location: text('Quartier Alien — maintenance du Nostromo et sas A-3', 'Alien District — Nostromo maintenance and airlock A-3'),
      request: text('Quelque chose racle derrière cette grille. Prenez le relais de réserve, condamnez le conduit et remettez la commande du sas ici. Je veux pouvoir le fermer de ce côté.', 'Something is scraping behind that grille. Take the spare relay, seal the duct and restore the airlock control here. I want to be able to close it from this side.'),
      premise: text('Dans le fragment de maintenance du Nostromo, le clapet d’un conduit est resté ouvert après une panne. Le sas A-3 du quartier a perdu sa commande extérieure. Ripley prépare l’isolement du conduit et le rétablissement du sas ; elle ne demande à personne de traquer ce qui fait du bruit.', 'In the Nostromo maintenance fragment, a duct damper has stayed open after a power fault. The district’s A-3 airlock has lost its exterior control. Ripley is preparing to isolate the duct and restore the airlock; she is not asking anyone to hunt whatever is making the noise.'),
      source: 'DLC/Alien/data/heroes.js#ripley.incarnation; DLC/Alien/data/characterPlaques.js#ripley; src/game/mosaicCityRuntime.js#MOSAIC_WELCOME',
      continuity: text('Incident de Cité original avec Ripley (1979). A-3, la panne et le bruit indéterminé appartiennent au quartier, pas au plan canonique du Nostromo. Aucun détecteur M314, Marine colonial ni événement d’Aliens n’est transféré.', 'Original City incident with Ripley (1979). A-3, the fault and the unidentified noise belong to the district, not the canonical Nostromo layout. No M314 tracker, Colonial Marine or event from Aliens is transferred.'),
      references: ['https://www.20thcenturystudios.com/movies/alien'],
      steps: [contact('Prendre les instructions de Ripley au poste du sas.', 'Get Ripley’s instructions at the airlock post.',
          'Le relais de réserve est dans l’armoire. Fermez d’abord le clapet à la main. Ensuite seulement, rétablissez la commande extérieure. L’alarme reste allumée jusqu’à notre retour.', 'The spare relay is in the cabinet. Close the damper by hand first. Only then restore the exterior control. The alarm stays on until we return.'),
        operate(marker('alarm-origin', 520, 760, 'Récupérer le relais dans l’armoire de maintenance.', 'Recover the relay from the maintenance cabinet.',
          'Le relais de réserve sort de son logement. Ses contacts sont intacts ; il pourra remplacer celui de la commande extérieure.', 'The spare relay comes out of its socket. Its contacts are intact; it can replace the exterior control relay.'),
        'recover', 'Relais de commande de secours', 'Spare control relay'),
        operate(marker('exit-reading', 1370, 580, 'Rabattre et verrouiller le clapet du conduit.', 'Lower and lock the duct damper.',
          'Le clapet descend et son verrou mécanique s’enclenche. Le conduit est isolé ; l’alarme du secteur reste active.', 'The damper lowers and its mechanical latch engages. The duct is isolated; the sector alarm remains active.'),
        'secure', 'Clapet du conduit de maintenance', 'Maintenance duct damper'),
        operate(marker('return-reading', 520, 760, 'Revenir au poste et remplacer le relais du sas A-3.', 'Return to the post and replace the A-3 airlock relay.',
          'La commande extérieure s’allume. Le sas A-3 peut être fermé depuis le poste, sans retourner dans le conduit isolé.', 'The exterior control lights up. Airlock A-3 can be closed from the post without returning to the isolated duct.'),
        'repair', 'Commande extérieure du sas A-3', 'A-3 exterior airlock control'),
        decision('Comment garder le secteur isolé ?', 'How should the sector stay isolated?', [
          choice('separate-signals', 'Garder l’alarme active et le sas sous commande extérieure.', 'Keep the alarm active and the airlock under exterior control.', 'Ripley garde une main près de la commande. Le clapet reste verrouillé et l’alarme continue de signaler le secteur fermé.', 'Ripley keeps a hand near the control. The damper stays locked and the alarm continues to mark the closed sector.'),
          choice('close-drill', 'Tenir le poste extérieur et attendre avant d’utiliser le sas.', 'Hold the exterior post and wait before using the airlock.', 'Ripley fait maintenir l’isolement depuis le poste. Le sas garde sa commande de secours et personne ne retourne dans le conduit.', 'Ripley has isolation maintained from the post. The airlock keeps its emergency control and no one returns to the duct.'),
          choice('silence-warning', 'Éteindre l’alarme et rouvrir la grille pour regarder.', 'Silence the alarm and reopen the grille to look inside.', '« Nous venons de fermer ce passage. Il reste fermé. »', '“We just sealed that passage. It stays sealed.”', false)
        ]),
        finish('Relier l’alarme du sas à l’ancre du quartier.', 'Link the airlock alarm to the district anchor.',
          'L’ancre reçoit l’alarme du secteur isolé. Ripley vérifie la commande : « Ça répond. Nous restons de ce côté. »', 'The anchor receives the isolated sector’s alarm. Ripley checks the control: “It’s responding. We stay on this side.”')]
    }
  ];
}
