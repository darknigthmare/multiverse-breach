/** Original Nexus follow-ups: a local repair is followed by a route actually
 * walked in the City. These preparations do not simulate absent evacuees. */
const t = (fr, en) => ({ fr, en });
const talk = (id, heroId, fr, en, answerFr, answerEn) => ({ id, type: 'npc', targetId: heroId,
  text: t(fr, en), dialogue: t(answerFr, answerEn) });
const work = (id, x, y, kind, nameFr, nameEn, fr, en, resultFr, resultEn, appearance) => ({
  id, type: 'marker', x, y, text: t(fr, en), finding: t(resultFr, resultEn), actionLabel: t(fr, en),
  operation: { kind, propName: t(nameFr, nameEn), label: t(fr, en), completedText: t(resultFr, resultEn),
    ...(appearance ? { appearance } : {}) }
});
const fork = (id, key, routes) => ({ ...Object.values(routes)[0], id, [key]: routes });
const carry = (step, action, id, labelFr, labelEn, appearance) => ({ ...step,
  cargo: { action, id, label: t(labelFr, labelEn), appearance } });
const option = (id, fr, en, resultFr, resultEn, valid = true) => ({ id, label: t(fr, en), result: t(resultFr, resultEn), valid });
const decide = (fr, en, choices) => ({ id: 'resolution', type: 'decision', text: t(fr, en), choices });
const route = (id, points, nameFr, nameEn, fr, en, resultFr, resultEn) => ({
  ...work(id, points.at(-1)[1], points.at(-1)[2], 'route', nameFr, nameEn, fr, en, resultFr, resultEn),
  walk: { points: points.map(([pointId, x, y, labelFr, labelEn]) => ({ id: pointId, x, y, label: t(labelFr, labelEn) })) }
});
const story = (heroId, id, requiresMissionId, title, premise, request, location, steps) => ({
  id, heroId, requiresMissionId, chapter: 2, title, premise, request, location, steps, storyRevision: 2,
  source: `src/game/characterPlaques.js#${heroId}; src/game/lore.js; src/game/ocCampaign.js`,
  sourceRefs: ['src/game/lore.js', `src/game/characterPlaques.js#${heroId}`, `src/game/heroes.js#${heroId}`, 'src/game/ocCampaign.js'],
  contentFile: 'src/game/mosaicCityRoutes.js'
});

export const MOSAIC_CITY_ROUTES = Object.freeze([
  story('player_anchor', 'city-anchor-shared-beacon-v1', 'city-anchor-signature-v1',
    t('Une place dans le faisceau', 'A place in the beam'),
    t('La balise retrouve l’Ancre, mais son faisceau écrase la petite lumière que Mirelle a laissée au bord de l’accueil. Elle prépare une place pour quelqu’un qui n’a pas ta signature.',
      'The beacon finds the Anchor, but its beam overwhelms the small light Mirelle left at the edge of intake. She is preparing a place for someone who does not share your signature.'),
    t('Quand tu passes, regarde cette petite lampe : on ne la voit plus. Tu peux me porter celle de la réserve ? Je veux que quelqu’un puisse rentrer ici sans avoir à marcher dans ton ombre.',
      'Watch that little lamp when you pass: it disappears. Could you bring the spare? I want someone to be able to come back here without walking in your shadow.'),
    t('Nexus — balise de l’Ancre et bord de l’accueil', 'Nexus — Anchor beacon and intake edge'), [
      talk('meet-arca_mirelle', 'arca_mirelle', 'Écouter Mirelle devant la petite lumière de l’accueil.', 'Listen to Mirelle beside the little intake light.',
        'Ta lumière tient. Maintenant, laisse-moi une place à côté. La lampe à poignée est sur l’établi.',
        'Your light holds. Now leave me a place beside it. The handled lamp is on the workbench.'),
      fork('separate-beacon-feed', 'byOriginChoice', {
        'retain-origin': work('', 1180, 580, 'secure', 'dérivation de la signature conservée', 'retained-signature spur',
          'Séparer la dérivation de l’accueil sans toucher à ta signature.', 'Separate the intake spur without changing your signature.',
          'La balise garde ton origine et ses deux traces. La lampe de l’accueil aura son propre départ.',
          'The beacon keeps your origin and both traces. The intake lamp will have its own feed.'),
        'ask-review': work('', 520, 580, 'secure', 'dérivation en attente de relecture', 'spur awaiting review',
          'Isoler le départ de l’accueil sans relancer la fusion suspendue.', 'Isolate the intake feed without restarting the suspended merge.',
          'La relecture reste en attente. La petite lumière peut fonctionner sans décider à sa place.',
          'The review remains pending. The small light can work without deciding its outcome.')
      }),
      carry(work('take-intake-lamp', 620, 570, 'recover', 'lampe de l’accueil', 'intake lamp',
        'Prendre la lampe de réserve destinée à l’accueil.', 'Take the spare lamp intended for intake.',
        'Tu portes la lampe. Son départ est distinct de celui qui reconnaît l’Ancre.',
        'You carry the lamp. Its feed is separate from the one that recognises the Anchor.'),
        'take', 'anchor-intake-lamp', 'Lampe de l’accueil', 'Intake lamp', 'lamp'),
      carry(work('place-intake-lamp', 1100, 680, 'beacon', 'seconde lumière de l’accueil', 'second intake light',
        'Poser la lampe au bord du faisceau de l’Ancre.', 'Set the lamp at the edge of the Anchor beam.',
        'La lampe éclaire le bord de l’accueil sur son propre circuit. Il reste à vérifier le chemin qui y conduit.',
        'The lamp lights the edge of intake on its own circuit. The path leading there still needs checking.', 'lamp'),
        'deliver', 'anchor-intake-lamp', 'Lampe de l’accueil', 'Intake lamp', 'lamp'),
      decide('Par quel bord rendre la seconde lumière visible ?', 'From which side should the second light be made visible?', [
        option('apply', 'Revenir par la rue de l’est.', 'Return along the eastern street.',
          'Tu vas éprouver les repères de l’est, puis leur retour vers l’accueil.', 'You will test the eastern markers and their return toward intake.'),
        option('hold', 'Prendre le détour du côté de la réserve.', 'Take the detour beside the stores.',
          'Tu vas vérifier le bord ouest sans modifier la signature de la balise.', 'You will check the western edge without changing the beacon signature.'),
        option('shortcut', 'Faire passer l’arrivant sous ton nom.', 'Let the arrival pass under your name.',
          '« Je t’ai demandé une lampe, pas une autre personne à ta place. »', '“I asked you for a lamp, not someone else in your place.”', false)
      ]),
      fork('walk-shared-light', 'byChoice', {
        apply: route('', [
          ['intake-edge', 1120, 790, 'Bord de l’accueil', 'Intake edge'],
          ['eastern-turn', 1420, 790, 'Tournant de la rue est', 'Eastern street turn'],
          ['upper-street', 1420, 550, 'Haut de la rue est', 'Upper eastern street'],
          ['light-return', 1100, 550, 'Retour face aux deux lumières', 'Return facing both lights']
        ], 'repère du retour est', 'eastern return marker',
        'Parcourir les quatre repères, puis orienter le dernier vers l’accueil.', 'Walk the four markers, then aim the last toward intake.',
        'Tu as rejoint les quatre repères dans l’ordre. La flèche du retour pointe vers l’accueil aux deux lumières.',
        'You reached all four markers in order. The return arrow points toward the intake with its two lights.'),
        hold: route('', [
          ['intake-edge', 1120, 790, 'Bord de l’accueil', 'Intake edge'],
          ['stores-turn', 820, 790, 'Tournant de la réserve', 'Stores turn'],
          ['western-edge', 510, 760, 'Bord ouest de la rue', 'Western street edge'],
          ['light-return', 510, 550, 'Retour de la réserve', 'Return from the stores']
        ], 'repère du retour ouest', 'western return marker',
        'Parcourir le détour de la réserve, puis orienter son dernier repère.', 'Walk the stores detour, then aim its final marker.',
        'Les quatre repères du détour ont été rejoints. La dernière flèche indique l’accueil sans demander de changer de nom.',
        'All four detour markers were reached. The last arrow points to intake without asking anyone to change their name.')
      }),
      talk('report', 'arca_mirelle', 'Revenir à Mirelle près des deux lumières.', 'Return to Mirelle beside the two lights.',
        'Voilà. Ta lumière, et une place qui n’emprunte le nom de personne. Quand quelqu’un viendra, je lui demanderai quel repère il veut garder. Aujourd’hui, le chemin est prêt.',
        'There. Your light, and a place that borrows nobody’s name. When someone comes, I will ask which marker they want to keep. Today, the path is ready.')
    ]),

  story('arca_bastion', 'city-bastion-bulwark-relief-v1', 'city-bastion-tenth-route-v1',
    t('La relève du Rempart', 'Relief at the Bulwark'),
    t('Bastion a dégagé la grille de service, mais sa poignée tire encore sur son bras. Deux étais attendent à la réserve. Il veut pouvoir desserrer la main sans laisser le battant retomber sur le passage.',
      'Bastion cleared the service gate, but its handle still pulls at his arm. Two braces wait in the stores. He wants to loosen his grip without letting the gate fall across the passage.'),
    t('Je peux tenir encore. Ce n’est pas une raison pour me laisser ici toute la nuit. Apporte les deux étais, un de chaque côté, et regarde derrière le premier : le métal a plié là où on le voit mal.',
      'I can hold a little longer. That is no reason to leave me here all night. Bring both braces, one on each side, and look behind the first: the metal bent where it is hard to see.'),
    t('Nexus — grille de service du Rempart', 'Nexus — Bulwark service gate'), [
      talk('meet-arca_bastion', 'arca_bastion', 'Rejoindre Bastion à la poignée du Rempart.', 'Join Bastion at the Bulwark handle.',
        'On ne rouvre pas la dixième. On donne une sortie à ceux qui sont de notre côté, et une relève à celui qui tient la porte.',
        'We are not reopening the tenth. We are giving those on our side a way out, and the one holding the door some relief.'),
      fork('keep-tenth-shut', 'byOriginChoice', {
        'name-debt': work('', 1380, 660, 'secure', 'verrou près des noms retrouvés', 'lock beside the recovered names',
          'Reprendre le verrou sans décrocher la plaque des noms.', 'Check the lock without taking down the name plaque.',
          'La dixième route reste fermée et les noms restent à leur place. Les étais iront sous la grille de service.',
          'The tenth route stays shut and the names stay in place. The braces will go beneath the service gate.'),
        'attach-unknowns': work('', 520, 580, 'secure', 'verrou près des noms manquants', 'lock beside the missing names',
          'Vérifier le verrou en gardant la place des noms manquants.', 'Check the lock while keeping the space for missing names.',
          'La dixième route reste fermée. La place laissée aux absents n’est ni comblée ni retirée.',
          'The tenth route stays shut. The space left for the absent is neither filled nor removed.')
      }),
      carry(work('take-first-brace', 620, 570, 'recover', 'premier étai du Rempart', 'first Bulwark brace',
        'Prendre le premier étai dans la réserve.', 'Take the first brace from the stores.',
        'Tu portes le premier étai. Le second reste à la réserve.', 'You carry the first brace. The second stays in the stores.'),
        'take', 'bastion-first-brace', 'Premier étai', 'First brace', 'brace'),
      carry(work('set-first-brace', 1340, 600, 'repair', 'étai côté poignée', 'handle-side brace',
        'Poser le premier étai du côté de la poignée.', 'Set the first brace on the handle side.',
        'Le premier appui est en place. Il ne reprend pas seul la charge du battant.',
        'The first support is in place. It cannot take the gate load alone.', 'brace'),
        'deliver', 'bastion-first-brace', 'Premier étai', 'First brace', 'brace'),
      work('check-bent-seat', 1170, 580, 'scan', 'siège faussé derrière la poignée', 'bent seat behind the handle',
        'Dégager la poussière du siège caché derrière la poignée.', 'Clear the dust from the seat behind the handle.',
        'Le siège est fendu sur son bord. Le second étai doit porter sur la traverse intacte, plus bas.',
        'The seat is split at its edge. The second brace must bear on the intact crosspiece below.'),
      carry(work('take-second-brace', 700, 790, 'recover', 'second étai du Rempart', 'second Bulwark brace',
        'Revenir chercher le second étai.', 'Return for the second brace.',
        'Tu portes le second étai. Le premier reste posé du côté de Bastion.',
        'You carry the second brace. The first stays fitted on Bastion’s side.'),
        'take', 'bastion-second-brace', 'Second étai', 'Second brace', 'brace'),
      carry(work('set-second-brace', 1340, 740, 'repair', 'étai de la traverse intacte', 'intact-crosspiece brace',
        'Caler le second étai sous la traverse intacte.', 'Brace the intact crosspiece with the second support.',
        'Les deux appuis reprennent les deux côtés. Le siège fendu reste déchargé ; rien ne rouvre la dixième route.',
        'The two supports take both sides. The split seat stays unloaded; nothing reopens the tenth route.', 'brace'),
        'deliver', 'bastion-second-brace', 'Second étai', 'Second brace', 'brace'),
      decide('Quel chemin vérifier pour la relève ?', 'Which path should be checked for the relief?', [
        option('apply', 'Faire le tour par la sortie de service.', 'Go around by the service exit.',
          'Tu vas rejoindre les repères de service et revenir par le bord dégagé.', 'You will reach the service markers and return along the clear edge.'),
        option('hold', 'Garder le détour large de la réserve.', 'Keep the wide stores detour.',
          'La traverse reste soutenue ; tu vas vérifier le détour avant de l’indiquer à la relève.',
          'The crosspiece stays supported; you will check the detour before pointing the relief toward it.'),
        option('shortcut', 'Retirer un étai pour forcer la dixième route.', 'Remove a brace to force the tenth route.',
          '« Non. Je ne vais pas soulager mon bras en mettant quelqu’un derrière cette porte. »',
          '“No. I am not easing my arm by putting someone behind that door.”', false)
      ]),
      fork('walk-relief-route', 'byChoice', {
        apply: route('', [
          ['lower-gate', 1120, 790, 'Pied de la grille de service', 'Foot of the service gate'],
          ['outer-turn', 1480, 790, 'Tournant extérieur du Rempart', 'Outer Bulwark turn'],
          ['upper-gate', 1480, 550, 'Bord haut du passage', 'Upper passage edge'],
          ['relief-return', 1120, 550, 'Retour vers la poignée', 'Return toward the handle']
        ], 'repère de relève', 'relief marker',
        'Parcourir les quatre points de la sortie de service, puis fixer le repère de relève.',
        'Walk the four service-exit points, then fasten the relief marker.',
        'Le tour de service a été parcouru. Le repère conduit vers la poignée par le côté dégagé.',
        'The service loop has been walked. The marker leads toward the handle from the clear side.'),
        hold: route('', [
          ['stores-departure', 820, 790, 'Départ du détour large', 'Wide-detour departure'],
          ['lower-stores', 490, 790, 'Bas de la réserve', 'Lower stores'],
          ['upper-stores', 490, 550, 'Haut de la réserve', 'Upper stores'],
          ['relief-return', 820, 550, 'Retour de la relève', 'Relief return']
        ], 'repère de relève par la réserve', 'stores relief marker',
        'Faire le détour large, puis fixer le repère pour la relève.', 'Walk the wide detour, then fasten the relief marker.',
        'Les quatre points du détour ont été rejoints. La relève dispose d’un chemin vérifié sans passer sous le siège fendu.',
        'All four detour points were reached. The relief has a checked path that avoids the split seat.')
      }),
      talk('report', 'arca_bastion', 'Revenir voir si Bastion peut desserrer la main.', 'Return to see whether Bastion can loosen his grip.',
        'Les deux étais tiennent. Je peux desserrer les doigts. Pour une fois, la relève n’aura pas besoin de reprendre ma place avant même de me dire bonsoir.',
        'Both braces hold. I can loosen my fingers. For once, the relief will not have to take my place before even saying good evening.')
    ]),

  story('arca_nova', 'city-nova-present-pulse-v1', 'city-nova-measured-exit-v1',
    t('Le battement d’aujourd’hui', 'Today’s pulse'),
    t('Le diapason de Nova vibre de nouveau près du raccord. Le premier relevé existe toujours ; il ne décrit pas la poussière tombée depuis. Elle demande une sonde à la hauteur du sol et un retour parcouru aujourd’hui.',
      'Nova’s tuner vibrates again near the seam. The first reading still exists; it does not describe the dust that fell since. She asks for a probe at ground level and a return walked today.'),
    t('Ce battement-là n’était pas sur le premier relevé. Apporte la sonde basse, puis marche sur le bord stable. Je peux regarder la faille ; je ne peux pas prétendre avoir fait tes pas.',
      'That beat was not in the first reading. Bring the low probe, then walk along the stable edge. I can watch the breach; I cannot pretend to have taken your steps.'),
    t('Nexus — raccord de l’Observatoire et rue stable', 'Nexus — Observatory seam and stable street'), [
      talk('meet-arca_nova', 'arca_nova', 'Écouter le battement du diapason avec Nova.', 'Listen to the tuner’s beat with Nova.',
        'La sonde repose à l’établi. Garde le raccord fermé le temps de la poser ; la rue, elle, existe des deux côtés.',
        'The probe is on the workbench. Keep the seam closed while you place it; the street exists on both sides.'),
      fork('retain-earlier-reading', 'byOriginChoice', {
        'mark-uncertainty': work('', 1180, 580, 'secure', 'barre du retour resté incertain', 'bar on the uncertain return',
          'Barrer le raccord sans effacer l’incertitude du premier relevé.', 'Bar the seam without erasing the uncertainty in the first reading.',
          'L’ancienne mesure conserve sa limite. Le raccord reste fermé pendant la nouvelle observation.',
          'The earlier reading retains its limit. The seam stays closed during the new observation.'),
        'require-return': work('', 520, 580, 'secure', 'barre gardée en observation', 'bar kept under observation',
          'Contrôler la barre laissée fermée dans l’attente du retour.', 'Check the bar left shut while awaiting a return.',
          'La barre reste fermée. La marche par la rue ne sera pas confondue avec un retour à travers la faille.',
          'The bar stays shut. A walk along the street will not be confused with a return through the breach.')
      }),
      carry(work('take-low-probe', 620, 570, 'recover', 'sonde basse de Nova', 'Nova’s low probe',
        'Prendre la sonde basse de Nova sur l’établi.', 'Take Nova’s low probe from the workbench.',
        'Tu portes la sonde. Le diapason reste auprès de Nova pour comparer sa réponse.',
        'You carry the probe. The tuner stays with Nova so she can compare its response.'),
        'take', 'nova-low-probe', 'Sonde basse de Nova', 'Nova’s low probe', 'probe'),
      carry(work('place-low-probe', 1300, 680, 'scan', 'sonde au bord du raccord', 'probe beside the seam',
        'Poser la sonde du côté stable, au ras du raccord.', 'Set the probe on the stable side, beside the seam.',
        'La sonde est en place hors du raccord. Elle répond au diapason ; aucune traversée n’a encore été tentée.',
        'The probe is in place outside the seam. It answers the tuner; no crossing has been attempted.', 'probe'),
        'deliver', 'nova-low-probe', 'Sonde basse de Nova', 'Nova’s low probe', 'probe'),
      decide('Quel bord parcourir pour le retour ?', 'Which edge should be walked for the return?', [
        option('apply', 'Suivre la rue qui longe le raccord.', 'Follow the street beside the seam.',
          'Tu vas rejoindre les deux extrémités par la rue, puis revenir au repère de départ.',
          'You will reach both ends along the street, then return to the departure marker.'),
        option('hold', 'Prendre la rue de la réserve, plus éloignée.', 'Take the stores street farther away.',
          'Tu vas éprouver le détour éloigné ; le raccord restera fermé.', 'You will test the farther detour; the seam will stay shut.'),
        option('shortcut', 'Ouvrir la faille puisque la sonde répond.', 'Open the breach because the probe answers.',
          '« Elle répond à mon diapason. Elle ne vient pas de ramener quelqu’un. »', '“It answers my tuner. It has not just brought someone back.”', false)
      ]),
      fork('walk-current-return', 'byChoice', {
        apply: route('', [
          ['departure-mark', 1110, 790, 'Repère de départ de Nova', 'Nova’s departure marker'],
          ['far-street', 1460, 790, 'Rue au-delà de la sonde', 'Street beyond the probe'],
          ['upper-street', 1460, 550, 'Bord stable opposé', 'Opposite stable edge'],
          ['return-mark', 1110, 790, 'Retour au repère de départ', 'Return to the departure marker']
        ], 'repère du retour présent', 'present-return marker',
        'Parcourir la rue par ses trois bords et revenir fixer le repère de départ.',
        'Walk the three street edges and return to fasten the departure marker.',
        'Le retour par la rue a été parcouru aujourd’hui. Il n’atteste ni une traversée du raccord ni le prochain battement.',
        'The street return was walked today. It proves neither a crossing of the seam nor the next pulse.'),
        hold: route('', [
          ['departure-mark', 820, 790, 'Repère du détour de Nova', 'Nova’s detour marker'],
          ['lower-stores', 490, 790, 'Rue basse de la réserve', 'Lower stores street'],
          ['upper-stores', 490, 550, 'Rue haute de la réserve', 'Upper stores street'],
          ['return-mark', 820, 790, 'Retour au départ du détour', 'Return to the detour departure']
        ], 'repère du détour présent', 'present-detour marker',
        'Parcourir le détour éloigné et revenir fixer son repère de départ.',
        'Walk the farther detour and return to fasten its departure marker.',
        'L’aller-retour par la réserve a été parcouru. Ce chemin reste distinct du raccord gardé fermé.',
        'The stores round trip has been walked. This path remains separate from the seam kept closed.')
      }),
      talk('report', 'arca_nova', 'Retrouver Nova en revenant par la rue.', 'Return to Nova along the street.',
        'Je t’ai vu revenir. Ça, je peux le dire. Le prochain battement sera une autre question ; le premier relevé, lui, reste avec nous.',
        'I saw you come back. I can say that. The next pulse will be another question; the first reading stays with us.')
    ]),

  story('arca_sable', 'city-sable-night-signs-v1', 'city-sable-signed-map-v1',
    t('Une nuit sans panneaux', 'A night without signs'),
    t('De la poussière de Trame a terni les panneaux de Sable. Une vieille flèche brille encore vers le tronçon coupé, tandis que le carrefour de l’accueil reste noir. Sable ne veut pas laisser sa signature conduire quelqu’un là-bas.',
      'Trame dust has dulled Sable’s signs. An old arrow still shines toward the broken stretch, while the intake junction stays dark. Sable will not let her signature lead someone there.'),
    t('On voit encore mon nom sur la mauvaise flèche. Viens, on la décroche. Puis on marche jusqu’au bout avant d’en remettre une seule. Apporte la lampe : le carrefour est dans le noir.',
      'You can still see my name on the wrong arrow. Come, let us take it down. Then we walk to the end before putting even one back. Bring the lamp: the junction is dark.'),
    t('Nexus — carrefour de l’accueil et panneaux du retour', 'Nexus — intake junction and return signs'), [
      talk('meet-arca_sable', 'arca_sable', 'Retrouver Sable auprès du panneau couvert de poussière.', 'Meet Sable beside the dust-covered sign.',
        'Je savais où cette route allait quand je l’ai signée. Je dois savoir où elle va ce soir.',
        'I knew where this road led when I signed it. I need to know where it leads tonight.'),
      fork('unhook-old-arrow', 'byOriginChoice', {
        'signed-correction': work('', 1380, 660, 'secure', 'ancienne flèche signée', 'old signed arrow',
          'Décrocher la flèche signée qui pointe vers le tronçon coupé.', 'Unhook the signed arrow pointing toward the broken stretch.',
          'La flèche est rabattue. L’ancien relevé reste daté, mais il ne guide plus les pas de ce soir.',
          'The arrow is folded down. The earlier reading keeps its date, but no longer guides tonight’s steps.'),
        'annotated-original': work('', 520, 580, 'secure', 'panneau des deux tracés', 'paired-route sign',
          'Rabattre le panneau sans jeter les deux anciennes cartes.', 'Fold down the sign without discarding the two earlier maps.',
          'Les deux cartes restent comparables. Le panneau ne promet plus un passage dans le tronçon interrompu.',
          'The two maps remain comparable. The sign no longer promises a passage through the broken stretch.')
      }),
      carry(work('take-crossroads-lamp', 620, 570, 'recover', 'lampe du carrefour', 'junction lamp',
        'Prendre la lampe destinée au carrefour de Sable.', 'Take the lamp intended for Sable’s junction.',
        'Tu portes la lampe. Aucun nouveau panneau n’est encore installé.', 'You carry the lamp. No new sign has been fitted yet.'),
        'take', 'sable-crossroads-lamp', 'Lampe du carrefour', 'Junction lamp', 'lamp'),
      carry(work('light-crossroads', 720, 750, 'beacon', 'lampe du carrefour de l’accueil', 'intake-junction lamp',
        'Installer la lampe au carrefour de l’accueil.', 'Install the lamp at the intake junction.',
        'Le carrefour est éclairé. Il reste à marcher jusqu’au débouché avant de choisir le sens de la flèche.',
        'The junction is lit. The exit still needs to be reached on foot before the arrow is aimed.', 'lamp'),
        'deliver', 'sable-crossroads-lamp', 'Lampe du carrefour', 'Junction lamp', 'lamp'),
      decide('Quel trajet marcher avant de le montrer ?', 'Which route should be walked before showing it?', [
        option('apply', 'Reprendre la rue par le bord de l’accueil.', 'Take the street along the intake edge.',
          'Tu vas vérifier le trajet est de bout en bout, à partir du carrefour éclairé.',
          'You will check the eastern route end to end, from the lit junction.'),
        option('hold', 'Passer par le bord de la réserve.', 'Go along the stores edge.',
          'Tu vas vérifier le trajet ouest ; l’ancien tronçon restera barré.', 'You will check the western route; the old stretch will stay barred.'),
        option('shortcut', 'Redresser l’ancienne flèche sans y retourner.', 'Raise the old arrow without walking back there.',
          '« Si mon nom ne veut plus dire que j’y suis allée, autant enlever mon nom aussi. »',
          '“If my name no longer means I have been there, we might as well take my name off too.”', false)
      ]),
      fork('walk-before-signing', 'byChoice', {
        apply: route('', [
          ['lit-junction', 820, 790, 'Départ du carrefour éclairé', 'Departure from the lit junction'],
          ['intake-street', 1120, 790, 'Rue de l’accueil', 'Intake street'],
          ['eastern-exit', 1450, 790, 'Débouché de la rue est', 'Eastern street exit'],
          ['visible-return', 1450, 550, 'Dernier panneau du retour', 'Final return sign']
        ], 'flèche du retour parcouru', 'walked-return arrow',
        'Rejoindre les quatre repères avant de signer et fixer la flèche du retour.',
        'Reach all four markers before signing and fastening the return arrow.',
        'La flèche indique le chemin parcouru depuis le carrefour. L’ancien tronçon reste barré.',
        'The arrow points along the path walked from the junction. The old stretch stays barred.'),
        hold: route('', [
          ['lit-junction', 820, 790, 'Départ du carrefour éclairé', 'Departure from the lit junction'],
          ['western-street', 490, 790, 'Rue ouest de la réserve', 'Western stores street'],
          ['stores-exit', 490, 550, 'Débouché de la réserve', 'Stores exit'],
          ['visible-return', 820, 550, 'Panneau du retour ouest', 'Western return sign']
        ], 'flèche du détour parcouru', 'walked-detour arrow',
        'Marcher jusqu’au débouché ouest avant de fixer la flèche du retour.',
        'Walk to the western exit before fastening the return arrow.',
        'Les quatre repères ont été rejoints. La flèche suit le détour réellement parcouru, sans rouvrir le tronçon coupé.',
        'All four markers were reached. The arrow follows the detour actually walked, without reopening the broken stretch.')
      }),
      talk('report', 'arca_sable', 'Revenir à Sable après avoir fixé le panneau.', 'Return to Sable after fastening the sign.',
        'Ce soir, je sais où elle mène. S’il faut la décrocher demain, je reviendrai avec toi. Une carte, ça s’use aussi par les semelles.',
        'Tonight, I know where it leads. If it has to come down tomorrow, I will come back with you. A map wears out through the soles of your feet too.')
    ])
]);
