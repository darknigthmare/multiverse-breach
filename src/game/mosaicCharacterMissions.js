import { MOSAIC_INTERACTION_RANGE, getMosaicZoneAnchor } from './mosaicCityRuntime.js';
import { createMosaicCharacterFollowups } from './mosaicCharacterFollowups.js';
import { MOSAIC_CHARACTER_STORIES } from './mosaicCharacterStories.js';
import { MOSAIC_CITY_DELIVERIES } from './mosaicCityDeliveries.js';
import { MOSAIC_CITY_ROUTES } from './mosaicCityRoutes.js';
import { getMosaicMissionWalkSpec, getMosaicMissionWalkProgress, recordMosaicMissionWalk } from './mosaicMissionWalks.js';
import { getMosaicMissionCargoTransfers, resolveMosaicMissionCargo } from './mosaicMissionCargo.js';
import { getMosaicMissionOperation, getMosaicMissionCargoSpec, createMosaicMissionOperationReceipt, matchesMosaicMissionOperationReceipt, getMosaicMissionObjectView } from './mosaicMissionOperations.js';
import * as dlcHalo from '../../DLC/Halo/data/mosaicCharacterMissions.js';
import * as dlcAlien from '../../DLC/Alien/data/mosaicCharacterMissions.js';

const text = (fr, en) => ({ fr, en });
export const localizeCityMission = (value, lang = 'fr') => value?.[lang === 'fr' ? 'fr' : 'en'] || '';
const person = (id, fr, en) => ({ id: `meet-${id}`, type: 'npc', targetId: id, text: text(fr, en) });
const exhibit = (id, fr, en) => ({ id: `inspect-${id}`, type: 'exhibit', targetId: id, text: text(fr, en) });
const marker = (id, x, y, fr, en, findingFr, findingEn) => ({ id, type: 'marker', x, y,
  text: text(fr, en), finding: text(findingFr, findingEn) });
const decision = (fr, en, choices) => ({ id: 'resolution', type: 'decision', text: text(fr, en), choices });
const choice = (id, fr, en, resultFr, resultEn, valid = true) => ({ id, label: text(fr, en), result: text(resultFr, resultEn), valid });
const report = { id: 'report', type: 'anchor', text: text('Transmettre le dossier à l’ancre locale.', 'Submit the case at the local anchor.') };

/** Original City stories grounded in the existing character dossiers. These
 * contracts do not retroactively complete campaign acts or award inventory. */
const originalMissions = [
  {
    id: 'city-anchor-signature-v1', heroId: 'player_anchor',
    title: text('Une signature qui reste', 'A signature that remains'),
    premise: text('Une balise confond deux traces de l’Ancre. Compare les outils d’A.R.C.A. avant de lui confier une identité.', 'A beacon confuses two Anchor traces. Compare A.R.C.A.’s tools before entrusting an identity to it.'),
    source: 'src/game/characterPlaques.js#player_anchor; src/game/heroes.js#nexus_anchor_coil',
    steps: [exhibit('nexus_anchor_coil', 'Lire la fonction de la Bobine d’Ancre dans sa vitrine.', 'Read the Anchor Coil’s purpose at its display.'),
      exhibit('arca_signal_lens', 'Examiner la Lentille de Signal : cibler une trace ne prouve pas son identité.', 'Inspect the Signal Lens: targeting a trace does not prove its identity.'),
      decision('Que faut-il conserver dans le registre ?', 'What should the ledger preserve?', [
        choice('retain-origin', 'Conserver l’origine et les deux observations.', 'Keep the origin and both observations.', 'L’Ancre garde son origine. Les deux outils sont décrits avec leurs limites.', 'The Anchor retains its origin. Both tools are recorded with their limits.'),
        choice('ask-review', 'Suspendre la fusion et demander une relecture.', 'Suspend the merge and request a review.', 'Les traces restent séparées jusqu’à une relecture par A.R.C.A.', 'The traces stay separate pending an A.R.C.A. review.'),
        choice('replace-origin', 'Remplacer l’origine par le signal le plus fort.', 'Replace the origin with the strongest signal.', 'Un signal plus fort ne donne pas le droit de réécrire une origine.', 'A stronger signal does not grant permission to rewrite an origin.', false)
      ]), report]
  },
  {
    id: 'city-mirelle-suture-v1', heroId: 'arca_mirelle',
    title: text('Une suture sans effacement', 'A suture without erasure'),
    premise: text('Un relais répète la même voix sous deux noms. Mirelle demande une réparation qui garde les traces distinctes.', 'A relay repeats the same voice under two names. Mirelle asks for a repair that keeps the traces distinct.'),
    source: 'src/game/heroes.js#arca_mirelle; src/game/mosaicCityRuntime.js#MOSAIC_WELCOME',
    steps: [person('arca_mirelle', 'Écouter Mirelle dans le quartier Nexus.', 'Listen to Mirelle in the Nexus district.'),
      exhibit('nexus_anchor_coil', 'Vérifier le stabilisateur dans la vitrine.', 'Check the stabilizer at the display.'),
      marker('suture-relay', 1210, 680, 'Diagnostiquer le relais de suture.', 'Diagnose the suture relay.', 'La boucle de sauvegarde conserve deux identifiants. Le relais a seulement dupliqué leur message.', 'The backup loop retains two identifiers. The relay has only duplicated their message.'),
      decision('Comment réparer la répétition ?', 'How should the repetition be repaired?', [
        choice('separate-traces', 'Rétablir deux canaux avec leurs identifiants.', 'Restore two channels with their identifiers.', 'Deux canaux rendent les voix lisibles sans supprimer leurs différences.', 'Two channels make the voices readable without erasing their differences.'),
        choice('isolate-relay', 'Isoler le relais et conserver la sauvegarde.', 'Isolate the relay and retain the backup.', 'Le relais reste isolé ; les traces sont préservées pour la réparation.', 'The relay remains isolated; the traces are preserved for repair.'),
        choice('erase-copy', 'Effacer la voix répétée et son identifiant.', 'Erase the repeated voice and its identifier.', 'Une répétition technique ne prouve pas qu’une identité est fausse.', 'A technical repetition does not prove that an identity is false.', false)
      ]), report]
  },
  {
    id: 'city-bastion-tenth-route-v1', heroId: 'arca_bastion',
    title: text('Les noms de la dixième route', 'The names of the tenth route'),
    premise: text('Un registre du Rempart omet encore une voie condamnée. Bastion veut une décision dont le coût reste visible.', 'A Bulwark record still omits a condemned route. Bastion wants a decision whose cost remains visible.'),
    source: 'src/game/characterPlaques.js#arca_bastion',
    steps: [person('arca_bastion', 'Recueillir le témoignage de Bastion.', 'Collect Bastion’s testimony.'),
      marker('east-record', 1340, 580, 'Lire la plaque du Rempart Est.', 'Read the East Bulwark plaque.', 'La plaque compte neuf cellules évacuées et laisse une ligne sans noms.', 'The plaque records nine evacuated cells and leaves one line without names.'),
      marker('route-register', 540, 770, 'Comparer le registre de fermeture.', 'Compare the closure record.', 'La dixième route a bien été condamnée. Une ligne vide ne signifie pas qu’elle n’a jamais existé.', 'The tenth route was condemned. A blank line does not mean it never existed.'),
      decision('Comment publier cette fermeture ?', 'How should the closure be published?', [
        choice('name-debt', 'Publier la dette et ouvrir la collecte des noms.', 'Publish the debt and open a collection of names.', 'Le registre reconnaît la dixième route et laisse une place à chaque témoin.', 'The ledger acknowledges the tenth route and leaves room for every witness.'),
        choice('attach-unknowns', 'Conserver les inconnus avec la preuve de fermeture.', 'Retain the unknowns alongside the closure evidence.', 'Les noms manquants restent signalés ; aucun nom inventé ne remplace les absents.', 'Missing names remain marked; no invented name replaces the absent.'),
        choice('perfect-report', 'Retirer la ligne pour ne garder que les évacués.', 'Remove the line and keep only those evacuated.', 'Bastion refuse un rapport parfait qui efface le prix de sa décision.', 'Bastion rejects a perfect report that erases the cost of his decision.', false)
      ]), report]
  },
  {
    id: 'city-nova-measured-exit-v1', heroId: 'arca_nova',
    title: text('Deux relevés, aucune prophétie', 'Two readings, no prophecy'),
    premise: text('Deux sondes annoncent une issue parfaite. Nova demande des mesures comparables, pas une promesse sur l’avenir.', 'Two probes announce a perfect exit. Nova asks for comparable measurements, not a promise about the future.'),
    source: 'src/game/characterPlaques.js#arca_nova',
    steps: [person('arca_nova', 'Demander à Nova ce que son monocle mesure.', 'Ask Nova what her monocle measures.'),
      exhibit('arca_signal_lens', 'Examiner la Lentille de Signal.', 'Inspect the Signal Lens.'),
      marker('near-reading', 620, 570, 'Relever la sonde de départ.', 'Read the departure probe.', 'La sonde donne une cause mesurable et une heure de départ.', 'The probe reports a measurable cause and a departure time.'),
      marker('far-reading', 1280, 780, 'Comparer la sonde distante.', 'Compare the distant probe.', 'La sonde distante donne une arrivée, mais aucun retour mesuré.', 'The distant probe reports an arrival, but no measured return.'),
      decision('Quelle option transmettre à l’Ancre ?', 'Which option should be sent to the Anchor?', [
        choice('mark-uncertainty', 'Décrire l’issue et son retour encore inconnu.', 'Describe the exit and its still unknown return.', 'Nova transmet une possibilité avec sa limite, sans choisir à la place de l’Ancre.', 'Nova transmits a possibility with its limit, without deciding for the Anchor.'),
        choice('require-return', 'Demander un relevé de retour avant tout départ.', 'Request a return reading before departure.', 'La route reste en observation jusqu’à un relevé bidirectionnel.', 'The route remains under observation pending a two-way reading.'),
        choice('guarantee-future', 'Garantir que personne ne sera perdu.', 'Guarantee that no one will be lost.', 'Le monocle compare des causes ; il ne garantit ni l’avenir ni la justice.', 'The monocle compares causes; it guarantees neither the future nor justice.', false)
      ]), report]
  },
  {
    id: 'city-sable-signed-map-v1', heroId: 'arca_sable',
    title: text('La carte porte ses témoins', 'The map names its witnesses'),
    premise: text('Une carte sans signature circule dans le Nexus. Sable te confie trois relevés de terrain à attribuer.', 'An unsigned map is circulating through the Nexus. Sable entrusts you with three field readings that need attribution.'),
    source: 'src/game/characterPlaques.js#arca_sable',
    steps: [person('arca_sable', 'Recueillir la méthode de Sable.', 'Learn Sable’s method.'),
      marker('map-west', 490, 580, 'Mesurer le repère ouest.', 'Measure the western marker.', 'Premier repère : bord du passage mesuré sur place, relevé de l’Ancre.', 'First marker: passage edge measured in person, Anchor’s reading.'),
      marker('map-east', 1380, 660, 'Mesurer le repère est.', 'Measure the eastern marker.', 'Deuxième repère : la largeur réelle diffère de la carte anonyme.', 'Second marker: the actual width differs from the anonymous map.'),
      marker('map-return', 700, 790, 'Vérifier le repère de retour.', 'Check the return marker.', 'Troisième repère : retour observé ; la carte peut citer ses mesures et leur auteur.', 'Third marker: return observed; the map can name its measurements and their author.'),
      decision('Quelle carte archiver ?', 'Which map should be archived?', [
        choice('signed-correction', 'Signer les trois mesures et la correction.', 'Sign the three readings and the correction.', 'La carte indique les écarts, les lieux et la personne qui les a mesurés.', 'The map records the differences, places, and person who measured them.'),
        choice('annotated-original', 'Garder l’original avec les relevés signés.', 'Keep the original with the signed readings.', 'Les deux versions restent comparables ; l’original ne devient pas une preuve de terrain.', 'The two versions remain comparable; the original does not become field evidence.'),
        choice('anonymous-perfect', 'Publier une carte parfaite sans témoins.', 'Publish a perfect map without witnesses.', 'Sable exige que quelqu’un puisse répondre des mesures et de leurs limites.', 'Sable requires someone to answer for the measurements and their limits.', false)
      ]), report]
  },
  {
    id: 'city-loom-return-thread-v1', heroId: 'arca_loom',
    title: text('Ce qui revient avec le fil', 'What returns along the thread'),
    premise: text('Un relais promet un refuge intact. Loom veut vérifier le fil dans les deux sens avant de lui confier une voix.', 'A relay promises an intact refuge. Loom wants the thread checked both ways before entrusting a voice to it.'),
    source: 'src/game/characterPlaques.js#arca_loom',
    steps: [person('arca_loom', 'Écouter les consignes de Loom.', 'Listen to Loom’s instructions.'),
      marker('thread-departure', 520, 760, 'Poser la référence du fil de retour.', 'Set the return-thread reference.', 'Référence posée : les voix restent dans le drone, sans copie transférée.', 'Reference set: the voices stay in the drone, with no copy transferred.'),
      marker('thread-distance', 1370, 580, 'Vérifier la tension du fil au relais distant.', 'Check thread tension at the distant relay.', 'La tension reste mesurable. Il faut encore revenir à la référence.', 'Tension remains measurable. You still need to return to the reference.'),
      marker('thread-home', 520, 760, 'Revenir physiquement au point de référence.', 'Physically return to the reference point.', 'Le retour est observé : la signature et la tension ont été conservées.', 'Return observed: the signature and tension were retained.'),
      decision('Que certifier dans le dossier ?', 'What should the case certify?', [
        choice('verify-thread', 'Certifier ce fil, sans promettre un monde restauré.', 'Certify this thread without promising a restored world.', 'Loom conserve les voix et inscrit un trajet de retour vérifié.', 'Loom retains the voices and records a verified return route.'),
        choice('retain-local', 'Garder les voix ici et transmettre seulement le relevé.', 'Keep the voices here and send only the reading.', 'Les voix restent protégées ; seule la mesure du trajet est transmise.', 'The voices remain protected; only the route measurement is transmitted.'),
        choice('send-unverified', 'Envoyer toutes les voix vers le refuge annoncé.', 'Send all voices to the announced refuge.', 'Vérifier un fil ne prouve pas que le refuge peut accueillir les témoins.', 'Verifying a thread does not prove that the refuge can receive the witnesses.', false)
      ]), report]
  },
  {
    id: 'city-marrow-distinct-choices-v1', heroId: 'arca_marrow',
    title: text('Une ressemblance ne prouve rien', 'Resemblance proves nothing'),
    premise: text('Deux empreintes portent le même visage. Marrow refuse de les condamner sur cette seule ressemblance.', 'Two imprints bear the same face. Marrow refuses to condemn them on resemblance alone.'),
    source: 'src/game/characterPlaques.js#arca_marrow',
    steps: [person('arca_marrow', 'Écouter la réserve de Marrow.', 'Listen to Marrow’s reservation.'),
      marker('first-imprint', 560, 580, 'Lire la première empreinte.', 'Read the first imprint.', 'La première empreinte veut conserver son nom et sa mémoire.', 'The first imprint wants to retain its name and memory.'),
      marker('second-imprint', 1320, 710, 'Lire la seconde empreinte.', 'Read the second imprint.', 'La seconde reconnaît une mémoire partagée, mais ne revendique aucune place à prendre.', 'The second acknowledges shared memory, but claims no place to usurp.'),
      decision('Comment distinguer ces continuations ?', 'How should these continuations be distinguished?', [
        choice('separate-testimony', 'Conserver deux témoignages distincts.', 'Keep two distinct testimonies.', 'Chaque continuation peut témoigner sans être réduite à son visage.', 'Each continuation may testify without being reduced to its face.'),
        choice('request-dialogue', 'Demander un dialogue sans jugement d’identité.', 'Request a dialogue without an identity judgment.', 'Le dossier demande un échange et suspend toute accusation de remplacement.', 'The case requests a dialogue and suspends any accusation of replacement.'),
        choice('erase-double', 'Supprimer la seconde empreinte parce qu’elle ressemble.', 'Delete the second imprint because it resembles the first.', 'Marrow refuse une exécution fondée sur une ressemblance.', 'Marrow refuses an execution based on resemblance.', false)
      ]), { ...person('arca_marrow', 'Rapporter les deux témoignages à Marrow.', 'Bring both testimonies back to Marrow.'), id: 'return-marrow' }, report]
  },
  {
    id: 'city-tessera-two-accounts-v1', heroId: 'arca_tessera',
    title: text('La vitrine à deux récits', 'The display with two accounts'),
    premise: text('La Galerie veut raconter Tessera avec une seule origine. Elle demande de conserver ses deux souvenirs sans la présenter comme le remplacement d’une autre personne.', 'The Gallery wants to describe Tessera through a single origin. She asks to keep both memories without presenting her as another person’s replacement.'),
    source: 'src/game/characterPlaques.js#arca_tessera',
    steps: [person('arca_tessera', 'Demander à Tessera comment elle souhaite être présentée.', 'Ask Tessera how she wishes to be presented.'),
      marker('childhood-caption', 610, 570, 'Lire la notice du souvenir d’enfance.', 'Read the childhood memory caption.', 'La notice porte le nom choisi par Tessera et la provenance de son témoignage. Elle ne prouve pas une identité antérieure.', 'The caption bears Tessera’s chosen name and the provenance of her testimony. It does not prove a previous identity.'),
      marker('foundry-caption', 1320, 680, 'Comparer la notice de l’Éclat de Forge.', 'Compare the Foundry Shard caption.', 'La seconde notice décrit une création récente. L’éditeur a coché « remplacer la première » sans l’accord de Tessera.', 'The second caption describes a recent creation. The editor selected “replace the first” without Tessera’s agreement.'),
      decision('Quelle présentation remettre à la Galerie ?', 'Which presentation should be submitted to the Gallery?', [
        choice('parallel-accounts', 'Garder les deux récits attribués à Tessera.', 'Keep both accounts attributed to Tessera.', 'Deux notices séparées conservent leur contradiction et le nom qu’elle a choisi. Aucune vie n’est déclarée remplaçable.', 'Two separate captions retain their contradiction and her chosen name. No life is declared replaceable.'),
        choice('hold-display', 'Suspendre l’exposition et garder les notices séparées.', 'Hold the display and retain the separate captions.', 'Le dossier attend une nouvelle présentation consentie ; les deux souvenirs restent distincts.', 'The case awaits a newly agreed presentation; the two memories remain distinct.'),
        choice('replace-memory', 'Garder la version la plus simple et effacer l’autre.', 'Keep the simplest version and erase the other.', 'La simplicité d’une notice n’autorise pas à remplacer une mémoire ou une personne.', 'A simpler caption does not authorize replacing a memory or a person.', false)
      ]), report]
  },
  {
    id: 'city-quillon-single-receipt-v1', heroId: 'arca_quillon',
    title: text('Le reçu et le témoin', 'The receipt and the witness'),
    premise: text('Deux reçus annoncent la restitution du même outil. Quillon veut retrouver les remises réelles avant qu’un total juste sur le papier crée une dette pour un absent.', 'Two receipts report the return of the same tool. Quillon wants to trace the actual handovers before a total that looks correct assigns a debt to someone absent.'),
    source: 'src/game/characterPlaques.js#arca_quillon',
    steps: [person('arca_quillon', 'Consulter le contre-registre avec Quillon.', 'Consult the counter-ledger with Quillon.'),
      marker('intake-receipt', 540, 770, 'Lire le reçu de l’accueil.', 'Read the intake receipt.', 'L’accueil a remis un seul outil marqué Q-17 à la Galerie. Le témoin de cette remise a signé une seule fois.', 'Intake handed one tool marked Q-17 to the Gallery. The witness signed that handover once.'),
      marker('gallery-receipt', 1340, 580, 'Vérifier l’exemplaire de la Galerie.', 'Check the Gallery copy.', 'Même outil, même heure et même signature : la seconde feuille est une copie de transmission, pas une seconde restitution.', 'Same tool, time and signature: the second sheet is a transmission copy, not a second return.'),
      decision('Comment arrêter le compte ?', 'How should the account be closed?', [
        choice('link-copy', 'Relier la copie à l’unique remise attestée.', 'Link the copy to the single witnessed handover.', 'Une remise est comptée. Les deux reçus restent consultables avec leur rôle et leur provenance.', 'One handover is counted. Both receipts remain readable with their role and provenance.'),
        choice('hold-account', 'Geler le total et demander une vérification contradictoire.', 'Hold the total and request an independent check.', 'Le total reste provisoire. Aucune dette n’est attribuée avant la vérification des témoins.', 'The total remains provisional. No debt is assigned before the witnesses are checked.'),
        choice('charge-absent', 'Compter deux remises et imputer l’écart à un absent.', 'Count two handovers and charge the difference to someone absent.', 'Deux feuilles ne prouvent pas deux objets. Quillon refuse une dette sans remise vérifiable.', 'Two sheets do not prove two objects. Quillon rejects a debt without a verifiable handover.', false)
      ]), report]
  },
  {
    id: 'city-nadir-return-probe-v1', heroId: 'arca_nadir',
    title: text('L’autre côté du seuil', 'The other side of the threshold'),
    premise: text('Un seuil d’exercice annonce un passage réussi après le seul trajet aller. Nadir exige une mesure de retour avant d’y engager un groupe.', 'A practice threshold announces a successful passage after the outbound trip alone. Nadir requires a return reading before committing a group.'),
    source: 'src/game/characterPlaques.js#arca_nadir',
    steps: [person('arca_nadir', 'Recueillir le protocole de sonde de Nadir.', 'Collect Nadir’s probe protocol.'),
      marker('probe-origin', 520, 760, 'Relever la signature de départ de la sonde.', 'Record the probe’s departure signature.', 'Signature N-4, usure et horodatage consignés. Le voyant vert n’atteste encore que le départ.', 'Signature N-4, wear and timestamp recorded. The green light only confirms departure so far.'),
      marker('probe-far-side', 1370, 580, 'Vérifier le relais de l’autre côté.', 'Check the relay on the far side.', 'Le relais reconnaît N-4. Son compteur affiche une arrivée, mais aucune mesure ne confirme le retour au poste initial.', 'The relay recognizes N-4. Its counter records an arrival, but no reading confirms a return to the starting post.'),
      marker('probe-return', 520, 760, 'Revenir à la sonde et comparer la signature.', 'Return to the probe and compare the signature.', 'Le retour conserve N-4 et la trace d’usure. L’horodatage ferme ce seul aller-retour d’exercice.', 'The return preserves N-4 and its wear trace. The timestamp closes this practice round trip only.'),
      decision('Quelle route Nadir peut-il annoncer ?', 'Which route can Nadir announce?', [
        choice('bounded-return', 'Attester ce retour mesuré et maintenir la sonde.', 'Attest this measured return and keep the probe active.', 'Le dossier décrit un aller-retour vérifié. La sonde reste en place jusqu’au dernier passage.', 'The case describes a verified round trip. The probe remains in place until the last passage.'),
        choice('repeat-probe', 'Maintenir le seuil fermé en attendant une seconde mesure.', 'Keep the threshold closed pending a second reading.', 'La preuve est conservée, mais le groupe attend une vérification supplémentaire.', 'The evidence is retained, but the group waits for an additional check.'),
        choice('guarantee-all-routes', 'Déclarer tous les seuils sûrs après cet essai.', 'Declare every threshold safe after this trial.', 'Une sonde mesure un trajet précis ; elle ne garantit ni les autres seuils ni leur avenir.', 'A probe measures a specific route; it guarantees neither other thresholds nor their future.', false)
      ]), report]
  },
  {
    id: 'city-elyra-consented-door-v1', heroId: 'arca_elyra',
    title: text('La porte consentie', 'The consented door'),
    premise: text('Une borne transforme le silence en autorisation et tente de réutiliser un accord retiré. Elyra prépare deux essais inertes pour rendre le refus aussi lisible que l’acceptation.', 'A terminal treats silence as authorization and tries to reuse a withdrawn agreement. Elyra prepares two inert trials to make refusal as readable as acceptance.'),
    source: 'src/game/characterPlaques.js#arca_elyra',
    steps: [person('arca_elyra', 'Faire préciser à Elyra les limites de l’exercice.', 'Ask Elyra to define the limits of the exercise.'),
      marker('explicit-acceptance', 610, 570, 'Lire le résultat de l’essai d’acceptation explicite.', 'Read the explicit acceptance trial result.', 'Le premier volontaire a accepté ce passage précis. Le jeton est limité à l’essai et ne couvre aucune ouverture ultérieure.', 'The first volunteer accepted this specific passage. The token is limited to the trial and covers no later opening.'),
      marker('withdrawn-token', 1210, 680, 'Contrôler le résultat du refus et du retrait.', 'Check the refusal and withdrawal result.', 'Le second volontaire a refusé. Le premier a retiré son accord après l’essai : le registre Null rend son jeton inutilisable.', 'The second volunteer refused. The first withdrew their agreement after the trial: the Null record makes that token unusable.'),
      decision('Quelle règle remettre au service des passages ?', 'Which rule should be submitted to the passage service?', [
        choice('honour-both', 'Conserver les deux décisions et interdire la réutilisation.', 'Retain both decisions and prohibit reuse.', 'L’acceptation passée et le refus restent lisibles. Tout nouveau passage exige un choix explicite.', 'Past acceptance and refusal remain readable. Every new passage requires an explicit choice.'),
        choice('close-terminal', 'Fermer la borne jusqu’à la correction de ses autorisations.', 'Close the terminal until its authorization handling is fixed.', 'La borne reste fermée ; les décisions sont conservées sans ouvrir un passage contre leur sens.', 'The terminal remains closed; decisions are retained without opening a passage against their meaning.'),
        choice('reuse-consent', 'Réutiliser l’ancien accord pour éviter un blocage.', 'Reuse the old agreement to avoid a blockage.', 'Un accord retiré n’est plus une autorisation. Le refus ne doit pas devenir un obstacle à contourner.', 'Withdrawn agreement is no longer authorization. Refusal must not become an obstacle to bypass.', false)
      ]), report]
  },
  {
    id: 'city-oryn-separate-voices-v1', heroId: 'arca_oryn',
    title: text('Le manifeste des voix', 'The manifest of voices'),
    premise: text('Une borne d’atelier a fusionné trois contributions en une seule voix signée Oryn. Il demande de rendre à chaque témoin sa place et son droit de retrait.', 'A workshop terminal has merged three contributions into a single voice signed by Oryn. He asks to restore each witness’s place and right to withdraw.'),
    source: 'src/game/characterPlaques.js#arca_oryn',
    steps: [person('arca_oryn', 'Demander à Oryn ce qu’il accepte de porter.', 'Ask Oryn what he agrees to carry.'),
      marker('workshop-signatures', 1340, 580, 'Comparer les signatures de l’atelier.', 'Compare the workshop signatures.', 'Deux contributions portent des signatures distinctes. Une troisième attribution est incomplète ; aucun nom ne peut être déduit de sa seule ressemblance.', 'Two contributions bear distinct signatures. A third attribution is incomplete; no name can be inferred from resemblance alone.'),
      marker('withdrawal-notice', 540, 770, 'Lire les autorisations de dépôt encore valides.', 'Read the deposit authorizations still valid.', 'Un témoin a retiré sa contribution. La notice de retrait reste au registre, tandis que son texte sort du dépôt public.', 'One witness withdrew their contribution. The withdrawal notice stays in the ledger while their text is removed from the public deposit.'),
      decision('Quel manifeste déposer ?', 'Which manifest should be deposited?', [
        choice('separate-voices', 'Déposer les voix autorisées avec leurs signatures distinctes.', 'Deposit the authorized voices with their distinct signatures.', 'Oryn porte un manifeste attribué, pas une voix collective inventée. Le retrait est respecté et le nom incomplet reste inconnu.', 'Oryn carries an attributed manifest, not an invented collective voice. Withdrawal is respected and the incomplete name stays unknown.'),
        choice('hold-attribution', 'Suspendre le dépôt et inviter les témoins à relire.', 'Hold the deposit and invite the witnesses to review it.', 'Les contributions restent séparées en attente d’une relecture volontaire. Personne ne parle à la place des absents.', 'Contributions stay separate pending a voluntary review. No one speaks for those absent.'),
        choice('one-spokesperson', 'Signer toutes les voix du nom d’Oryn pour combler les blancs.', 'Sign every voice with Oryn’s name to fill the gaps.', 'Porter des noms ne donne pas le droit de les remplacer. Oryn n’est pas le porte-parole de tous les disparus.', 'Carrying names does not grant permission to replace them. Oryn is not the spokesperson for everyone lost.', false)
      ]), report]
  },
  ...dlcHalo.createMosaicCharacterMissions({ text, person, exhibit, marker, decision, choice, report }),
  ...dlcAlien.createMosaicCharacterMissions({ text, person, exhibit, marker, decision, choice, report }),
  ...createMosaicCharacterFollowups({ text, person, exhibit, marker, decision, choice, report })
];

const factoryTools = { text, person, exhibit, marker, decision, choice, report };
const legacyGuestMissions = new Map([
  ...dlcHalo.createLegacyMosaicCharacterMissions(factoryTools),
  ...dlcAlien.createLegacyMosaicCharacterMissions(factoryTools)
].map(mission => [mission.id, mission]));
const freezeMission = mission => Object.freeze({ ...mission, universe: mission.universe || 'Nexus de Convergence', version: 1,
  steps: Object.freeze(mission.steps.map(step => Object.freeze(step))) });

/** Previous visits remain readable in their own words. A saved observation is
 * never silently upgraded into a repair or a rescue introduced by this revision. */
export const MOSAIC_CHARACTER_MISSION_LEGACY = Object.freeze(originalMissions.map(mission =>
  freezeMission(legacyGuestMissions.get(mission.id) || mission)));
const legacyById = new Map(MOSAIC_CHARACTER_MISSION_LEGACY.map(mission => [mission.id, mission]));

const storyFields = ['text', 'finding', 'dialogue', 'actionLabel', 'operation', 'cargo', 'walk'];
const narrativePatch = value => Object.fromEntries(storyFields.filter(key => value && Object.hasOwn(value, key)).map(key => [key, value[key]]));
function applyStory(mission) {
  const story = MOSAIC_CHARACTER_STORIES[mission.id];
  if (!story) return freezeMission({ ...mission, ...(mission.request ? { storyRevision: 2 } : {}) });
  return freezeMission({ ...mission, title: story.title, premise: story.premise, request: story.request,
    location: story.location, sourceRefs: story.sourceRefs, contentFile: 'src/game/mosaicCharacterStories.js', storyRevision: 2,
    steps: mission.steps.map(step => {
      const patch = story.steps?.[step.id];
      if (!patch) return step;
      const next = { ...step, ...narrativePatch(patch) };
      if (step.choices) next.choices = step.choices.map(option => ({ ...option,
        ...(patch.choices?.[option.id] ? { label: patch.choices[option.id].label, result: patch.choices[option.id].result } : {}) }));
      for (const branchKey of ['byOriginChoice', 'byChoice']) if (step[branchKey]) {
        next[branchKey] = Object.fromEntries(Object.entries(step[branchKey]).map(([id, branch]) =>
          [id, { ...branch, ...narrativePatch(patch[branchKey]?.[id]) }]));
      }
      return next;
    }) });
}
export const MOSAIC_CHARACTER_MISSIONS = Object.freeze([...originalMissions.map(applyStory), ...MOSAIC_CITY_DELIVERIES.map(freezeMission), ...MOSAIC_CITY_ROUTES.map(freezeMission)]);

const record = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const identifier = value => typeof value === 'string' && value.trim() && value.length < 180 ? value : null;
const own = (value, id) => Object.hasOwn(record(value), id) ? value[id] : undefined;

/** Preserve absent DLC records and their unknown fields; availability is a view. */
export function normalizeMosaicCharacterMissions(saved) {
  const source = record(saved);
  const records = Object.fromEntries(Object.entries(record(source.records)).flatMap(([id, raw]) => {
    const value = record(raw);
    if (!identifier(id) || !identifier(value.heroId) || !identifier(value.universe) || !identifier(value.districtId)) return [];
    return [[id, { ...value, heroId: value.heroId, universe: value.universe, districtId: value.districtId,
      completedStepIds: Array.isArray(value.completedStepIds) ? value.completedStepIds.filter(identifier).slice(0, 32) : [],
      ...(Object.hasOwn(value, 'storyStepIds') ? { storyStepIds: Array.isArray(value.storyStepIds) ? [...new Set(value.storyStepIds.filter(identifier))].slice(0, 32) : [] } : {}),
      choiceId: identifier(value.choiceId), completed: value.completed === true }]];
  }));
  return { ...source, version: 1, activeId: identifier(source.activeId), records };
}

export function getMosaicCharacterMissionCatalog({ district, residents = [], exhibits = [], anchor, unlockedHeroIds = [] } = {}) {
  if (!district?.id || !district.universe || anchor?.action !== 'anchor' || anchor.universe !== district.universe) return [];
  const owned = new Set(unlockedHeroIds), people = new Set(residents.map(hero => hero.id)), items = new Set(exhibits.map(item => item.id));
  return MOSAIC_CHARACTER_MISSIONS.filter(mission => mission.universe === district.universe && owned.has(mission.heroId)
    && mission.steps.every(step => step.type !== 'npc' || people.has(step.targetId))
    && mission.steps.every(step => step.type !== 'exhibit' || items.has(step.targetId)))
    .map(mission => ({ ...mission, districtId: district.id, anchorId: anchor.id }));
}

function validSaved(mission, saved) {
  if (!saved || saved.heroId !== mission.heroId || saved.universe !== mission.universe || saved.districtId !== mission.districtId
    || !Array.isArray(saved.completedStepIds) || saved.completedStepIds.length > mission.steps.length) return false;
  if (!saved.completedStepIds.every((id, index) => id === mission.steps[index].id)) return false;
  const resolutionIndex = mission.steps.findIndex(step => step.type === 'decision');
  if (resolutionIndex < 0 || (saved.completedStepIds.length <= resolutionIndex && saved.choiceId != null)) return false;
  if (saved.completedStepIds.length > resolutionIndex && !mission.steps[resolutionIndex].choices.some(item => item.valid && item.id === saved.choiceId)) return false;
  if (mission.requiresMissionId) {
    const previous = MOSAIC_CHARACTER_MISSIONS.find(item => item.id === mission.requiresMissionId);
    if (!previous || !previous.steps.find(step => step.type === 'decision')?.choices.some(item => item.valid && item.id === saved.originChoiceId)) return false;
  }
  return saved.completed === (saved.completedStepIds.length === mission.steps.length);
}

/** A follow-up requires the complete, compatible report, not a bare completed flag.
 * The check never changes retained records when a prerequisite is unavailable. */
function prerequisiteForOrigin(progress, mission, lang, originChoiceId, originStoryRevision) {
  if (!mission?.requiresMissionId) return null;
  const source = MOSAIC_CHARACTER_MISSIONS.find(item => item.id === mission.requiresMissionId);
  const previous = source && { ...source, districtId: mission.districtId, anchorId: mission.anchorId };
  const current = own(progress?.records, mission.requiresMissionId);
  // Replaying a parent never takes away the route an existing sequel followed.
  // New stories prefer the latest completed parent; existing ones keep the
  // completed parent with their own recorded origin choice.
  const candidates = previous ? [current, current?.previousStory].filter(entry => validSaved(previous, entry) && entry.completed) : [];
  const resolutionIndex = previous?.steps.findIndex(step => step.type === 'decision');
  const revision = entry => isLegacyStep(previous, entry, previous.steps[resolutionIndex].id) ? 1 : previous.storyRevision || 1;
  const matching = candidates.filter(entry => !originChoiceId || entry.choiceId === originChoiceId);
  const saved = matching.find(entry => !originStoryRevision || revision(entry) === originStoryRevision) || matching[0] || candidates[0];
  const completed = Boolean(previous && previous.heroId === mission.heroId && previous.universe === mission.universe
    && saved);
  const sourceProgress = completed ? { ...progress, records: { ...progress.records, [previous.id]: saved } } : progress;
  const selected = completed && getMosaicCharacterMissionStep(sourceProgress, previous, resolutionIndex)?.choices.find(item => item.id === saved.choiceId && item.valid);
  const title = completed && isLegacyStep(previous, saved, previous.steps[resolutionIndex].id) ? legacyById.get(previous.id)?.title : source?.title;
  return { missionId: mission.requiresMissionId, title: localizeCityMission(title, lang), completed,
    choiceId: completed ? saved.choiceId : null, storyRevision: completed ? revision(saved) : null,
    resolution: localizeCityMission(selected?.result, lang) };
}
export function getMosaicCharacterMissionPrerequisite(progress, mission, lang = 'fr') {
  const saved = own(progress?.records, mission?.id);
  const originStoryRevision = saved?.originStoryRevision || (saved && mission?.storyRevision === 2 && saved.storyRevision !== 2 ? 1 : null);
  return prerequisiteForOrigin(progress, mission, lang, saved?.originChoiceId, originStoryRevision);
}

function isLegacyStep(mission, saved, stepId) {
  return Boolean(mission?.storyRevision === 2 && legacyById.has(mission.id) && saved
    && saved.storyRevision !== 2 && saved.completedStepIds?.includes(stepId)
    && !(Array.isArray(saved.storyStepIds) && saved.storyStepIds.includes(stepId)));
}

/** Branches change place, dialogue and the operation at that place. Identity,
 * type, target and step ordering always come from the source contract. */
export function getMosaicCharacterMissionStep(progress, mission, index) {
  const currentStep = mission?.steps[index];
  if (!currentStep) return null;
  const saved = own(progress?.records, mission.id);
  const step = isLegacyStep(mission, saved, currentStep.id)
    ? legacyById.get(mission.id).steps[index] : currentStep;
  const prerequisite = getMosaicCharacterMissionPrerequisite(progress, mission);
  const origin = saved?.originChoiceId || prerequisite?.choiceId;
  const branch = own(step.byOriginChoice, origin) || own(step.byChoice, saved?.choiceId);
  return branch ? { ...step, x: branch.x, y: branch.y, ...narrativePatch(branch) } : step;
}

/** Carrying persists across districts, mission selection and remounts. Only the
 * current authored records with actual physical receipts own an object. */
export function getMosaicCharacterMissionCargo(progress, lang = 'fr') {
  const transfers = [];
  for (const source of MOSAIC_CHARACTER_MISSIONS) {
    if (!source.steps.some(step => step.cargo)) continue;
    const saved = own(progress?.records, source.id);
    if (!saved?.districtId) continue;
    const mission = { ...source, districtId: saved.districtId };
    if (!validSaved(mission, saved)) continue;
    const steps = source.steps.map((_, index) => getMosaicCharacterMissionStep(progress, mission, index));
    transfers.push(...getMosaicMissionCargoTransfers(mission, saved, steps, lang));
  }
  return resolveMosaicMissionCargo(transfers);
}

export function getMosaicCharacterMissionObjective(progress, mission, lang = 'fr') {
  if (!mission) return null;
  const saved = own(progress?.records, mission.id), prerequisite = getMosaicCharacterMissionPrerequisite(progress, mission, lang);
  const compatible = !saved || (validSaved(mission, saved)
    && (!prerequisite?.completed || saved.originChoiceId === prerequisite.choiceId));
  const locked = Boolean(prerequisite && !prerequisite.completed);
  const index = compatible ? saved?.completedStepIds.length || 0 : 0;
  const step = compatible && !locked ? getMosaicCharacterMissionStep(progress, mission, index) : null;
  const targetType = step?.type === 'npc' ? 'npc' : ['exhibit', 'anchor', 'marker'].includes(step?.type) ? 'zone' : null;
  const targetId = step?.type === 'npc' ? step.targetId : step?.type === 'exhibit' ? `${mission.districtId}::exhibit::${step.targetId}`
    : step?.type === 'anchor' ? mission.anchorId : step?.type === 'marker' ? `${mission.id}::${step.id}` : null;
  const resolutionIndex = mission.steps.findIndex(item => item.type === 'decision');
  const resolution = getMosaicCharacterMissionStep(progress, mission, resolutionIndex)?.choices.find(item => item.id === saved?.choiceId && item.valid);
  const legacy = mission.steps.some(item => isLegacyStep(mission, saved, item.id));
  const storyTitle = legacy && !saved?.storyStepIds?.length ? localizeCityMission(legacyById.get(mission.id)?.title, lang) : localizeCityMission(mission.title, lang);
  const walk = getMosaicMissionWalkProgress(mission, step, saved);
  return { missionId: mission.id, index, total: mission.steps.length, step, targetType, targetId,
    prerequisite, originResolution: prerequisite?.resolution || '', legacy, storyTitle, walk,
    canReplayStory: Boolean(legacy && validSaved(mission, saved) && !locked),
    status: !compatible ? 'unavailable' : locked ? 'locked' : !saved ? 'available' : saved.completed ? 'completed' : progress.activeId === mission.id ? 'active' : 'paused',
    text: !compatible ? localizeCityMission(text('Cette aventure ne peut pas reprendre ici. Ta première visite reste conservée.', 'This adventure cannot resume here. Your first visit remains saved.'), lang)
      : locked ? (lang === 'fr' ? `Termine d’abord « ${prerequisite.title || prerequisite.missionId} ».`
        : `First finish “${prerequisite.title || prerequisite.missionId}”.`)
        : walk && !walk.completed ? `${localizeCityMission(step.text, lang)} — ${walk.visited}/${walk.total} · ${localizeCityMission(walk.next.label, lang)}`
          : step ? localizeCityMission(step.text, lang) : localizeCityMission(resolution?.result, lang),
    resolution: localizeCityMission(resolution?.result, lang) };
}

export function getMosaicCharacterMissionZones(progress, missions, lang = 'fr') {
  const mission = missions.find(item => item.id === progress?.activeId);
  const objective = getMosaicCharacterMissionObjective(progress, mission, lang);
  if (objective?.status !== 'active' || objective.step?.type !== 'marker') return [];
  const step = objective.step, position = objective.walk?.next || step;
  return [{ id: objective.targetId, missionId: mission.id, stepId: step.id, universe: mission.universe,
    action: 'character-mission', x: position.x - 32, y: position.y - 32, w: 64, h: 64,
    label: objective.walk && !objective.walk.completed ? localizeCityMission(position.label, lang)
      : localizeCityMission(step.operation?.label || step.text, lang), role: localizeCityMission(mission.title, lang), color: '#dfb85b' }];
}

/** Residents' interventions leave their worked-on equipment in the district. Only
 * matching, completed operation receipts can light it up or empty a crate.
 * Old checkpoints and absent DLC cannot create a new repair by implication. */
export function getMosaicCharacterMissionWorldObjects(progress, missions, zones = [], lang = 'fr') {
  const positions = new Map();
  let activeObject = null;
  for (const mission of missions) {
    const objective = getMosaicCharacterMissionObjective(progress, mission, lang);
    if (['unavailable', 'locked', 'available'].includes(objective.status)) continue;
    const saved = own(progress?.records, mission.id);
    for (let index = 0; index < mission.steps.length; index++) {
    const step = getMosaicCharacterMissionStep(progress, mission, index), operation = getMosaicMissionOperation(step);
    if (!operation) continue;
    const targetId = step.type === 'marker' ? `${mission.id}::${step.id}`
      : step.type === 'exhibit' ? `${mission.districtId}::exhibit::${step.targetId}` : mission.anchorId;
    const receipt = own(saved.operationReceipts, step.id);
    const completed = saved.completedStepIds.includes(step.id)
      && matchesMosaicMissionOperationReceipt(receipt, mission, step, targetId, saved);
    const active = objective.status === 'active' && objective.index === index;
    if (!completed && !active) continue;
    const zone = zones.find(item => item.id === targetId && item.universe === mission.universe);
    const position = step.type === 'marker' ? active && objective.walk ? objective.walk.next : { x: step.x, y: step.y } : zone ? getMosaicZoneAnchor(zone) : null;
    if (!position || !Number.isFinite(position.x) || !Number.isFinite(position.y)) continue;
    const object = { id: `${mission.id}::${step.id}`, missionId: mission.id,
      stepId: step.id, targetId, sourceType: step.type, universe: mission.universe, ...position,
      ...getMosaicMissionObjectView(operation, { lang, completed }), active, sequence: receipt?.sequence || 0 };
    if (active && objective.walk && !objective.walk.completed) {
      object.propName = localizeCityMission(objective.walk.next.label, lang);
      object.statusLabel = lang === 'fr' ? `Parcours ${objective.walk.visited}/${objective.walk.total} · rejoindre ce repère`
        : `Route ${objective.walk.visited}/${objective.walk.total} · reach this marker`;
    }
    const key = `${position.x}:${position.y}`;
    const prior = positions.get(key);
    if (active && object.appearance === 'lamp' && prior?.missionId === mission.id
      && prior.appearance === 'lamp' && prior.kind === 'beacon' && prior.completed) {
      // Testing an already installed lamp must not visually switch it off.
      // The new test remains unfinished and owns no receipt until interaction.
      object.powered = true;
    }
    if (active) activeObject = { key, object };
    else if (!positions.has(key) || positions.get(key).sequence < object.sequence) positions.set(key, object);
    }
  }
  if (activeObject) positions.set(activeObject.key, activeObject.object);
  return [...positions.values()];
}

export function getMosaicCharacterMissionPropZones(objects, zones = []) {
  const existing = new Set(zones.map(zone => zone.id));
  return objects.filter(object => object.sourceType === 'marker' && !existing.has(object.targetId)).map(object => ({
    id: object.targetId, universe: object.universe, action: 'mission-prop',
    x: object.x - 32, y: object.y - 32, w: 64, h: 64
  }));
}

const feedback = {
  unavailable: text('Cette aventure est indisponible. Ta visite reste conservée.', 'This adventure is unavailable. Your visit stays saved.'),
  active: text('Tu aides déjà cet habitant.', 'You are already helping this resident.'),
  completed: text('Tu as tenu ta promesse. Tu peux reprendre ton chemin.', 'You kept your promise. You can continue on your way.'),
  inactive: text('Reprends cette aventure dans ton carnet avant de continuer.', 'Resume this adventure in your journal before continuing.'),
  wrong_target: text('Ce n’est pas l’endroit que tu cherches.', 'This is not the place you are looking for.'),
  cargo_missing: text('Tu dois porter l’objet demandé pour le déposer ici. Reprends sa récupération dans ton carnet.', 'You must be carrying the requested object to leave it here. Check its collection in your journal.'),
  walk_pending: text('Le trajet reste à parcourir. Rejoins les repères dans l’ordre avant de fixer le dernier.', 'The route still needs to be walked. Reach its markers in order before fastening the last one.'),
  write_failed: text('Cette action ne peut pas être enregistrée pour le moment. Ta progression reste conservée.', 'This action cannot be recorded right now. Your progress stays saved.'),
  out_of_range: text('Rapproche-toi pour intervenir.', 'Move closer to work on it.'),
  started: text('La demande est dans ton carnet. En route.', 'The request is in your journal. Time to go.'),
  advanced: text('Tu peux poursuivre. Ton carnet indique la suite.', 'You can continue. Your journal shows the next step.')
};
function outcome(progress, next, reason, lang, extra) {
  return { progress: next, changed: next !== progress, reason, feedback: localizeCityMission(extra || feedback[reason], lang) };
}
export function startMosaicCharacterMission(progress, mission, lang = 'fr') {
  if (!mission) return outcome(progress, progress, 'unavailable', lang);
  const objective = getMosaicCharacterMissionObjective(progress, mission, lang);
  if (objective.status === 'locked') return outcome(progress, progress, 'locked', lang,
    text(getMosaicCharacterMissionObjective(progress, mission, 'fr').text, getMosaicCharacterMissionObjective(progress, mission, 'en').text));
  if (objective.status === 'unavailable') return outcome(progress, progress, 'unavailable', lang);
  const saved = own(progress?.records, mission.id);
  if (saved?.completed) return outcome(progress, progress, 'completed', lang);
  if (saved && progress.activeId === mission.id) return outcome(progress, progress, 'active', lang);
  const next = normalizeMosaicCharacterMissions(progress);
  next.activeId = mission.id;
  next.lastMissionId = mission.id;
  next.records[mission.id] = saved || { heroId: mission.heroId, universe: mission.universe, districtId: mission.districtId,
    completedStepIds: [], choiceId: null, completed: false,
    ...(mission.storyRevision === 2 ? { storyRevision: 2, operationReceipts: {} } : {}),
    ...(objective.prerequisite ? { originChoiceId: objective.prerequisite.choiceId, originStoryRevision: objective.prerequisite.storyRevision } : {}) };
  return outcome(progress, next, 'started', lang);
}

/** An explicit replay keeps the complete earlier record, including unknown
 * fields. Opening a journal or loading a save never restarts a story. */
export function restartMosaicCharacterMission(progress, mission, lang = 'fr') {
  const objective = getMosaicCharacterMissionObjective(progress, mission, lang);
  if (!objective?.canReplayStory) return outcome(progress, progress, 'unavailable', lang);
  const saved = own(progress.records, mission.id), next = normalizeMosaicCharacterMissions(progress);
  const prerequisite = prerequisiteForOrigin(progress, mission, lang);
  next.activeId = mission.id;
  next.lastMissionId = mission.id;
  next.records[mission.id] = { ...saved, previousStory: saved, storyRevision: 2, storyStepIds: [], operationReceipts: {}, walkReceipts: {},
    completedStepIds: [], choiceId: null, completed: false,
    ...(prerequisite ? { originChoiceId: prerequisite.choiceId, originStoryRevision: prerequisite.storyRevision } : {}) };
  return outcome(progress, next, 'started', lang);
}

/** Saying yes in a resident's conversation is a real meeting. Recheck the live
 * actor before accepting, and only finish the current step if it is this actor. */
export function acceptMosaicCharacterMissionRequest(progress, mission, interaction, lang = 'fr') {
  if (!mission || interaction?.type !== 'npc' || interaction.id !== mission.heroId
    || interaction.target?.hero?.id !== mission.heroId || interaction.target.hero.universe !== mission.universe) {
    return outcome(progress, progress, 'wrong_target', lang);
  }
  if (!Number.isFinite(interaction.distance) || interaction.distance < 0 || interaction.distance > MOSAIC_INTERACTION_RANGE.npc) {
    return outcome(progress, progress, 'out_of_range', lang);
  }
  const accepted = startMosaicCharacterMission(progress, mission, lang);
  if (!accepted.changed) return accepted;
  const nextStep = getMosaicCharacterMissionObjective(accepted.progress, mission, lang).step;
  if (nextStep?.type !== 'npc' || nextStep.targetId !== interaction.id) return accepted;
  return advanceMosaicCharacterMission(accepted.progress, mission, interaction, lang);
}

/** Only a resolved in-world interaction advances evidence; menu selection
 * and directory previews never call this function. */
export function advanceMosaicCharacterMission(progress, mission, interaction, lang = 'fr') {
  const objective = getMosaicCharacterMissionObjective(progress, mission, lang);
  if (!objective || objective.status === 'unavailable') return outcome(progress, progress, 'unavailable', lang);
  if (objective.status === 'completed') return outcome(progress, progress, 'completed', lang);
  if (objective.status !== 'active') return outcome(progress, progress, 'inactive', lang);
  const range = MOSAIC_INTERACTION_RANGE[interaction?.type];
  if (!Number.isFinite(interaction?.distance) || interaction.distance < 0 || !Number.isFinite(range)
    || interaction.distance > range) return outcome(progress, progress, 'out_of_range', lang);
  const step = objective.step, target = interaction.target;
  if (objective.targetType !== interaction.type || objective.targetId !== interaction.id) return outcome(progress, progress, 'wrong_target', lang);
  if (step.walk && (!getMosaicMissionWalkSpec(step) || !objective.walk?.completed)) return outcome(progress, progress, 'walk_pending', lang);
  const matching = step.type === 'npc' ? target?.hero?.id === step.targetId && target.hero.universe === mission.universe
    : target?.id === interaction.id && target.universe === mission.universe && (
      step.type === 'exhibit' ? target.action === 'exhibit' && target.exhibitId === step.targetId
        : step.type === 'anchor' ? target.action === 'anchor'
          : step.type === 'marker' && target.action === 'character-mission' && target.missionId === mission.id && target.stepId === step.id
            && target.x + target.w / 2 === step.x && target.y + target.h / 2 === step.y);
  if (!matching) return outcome(progress, progress, 'wrong_target', lang);
  if (step.cargo) {
    const cargo = getMosaicMissionCargoSpec(step), held = getMosaicCharacterMissionCargo(progress, lang);
    if (!cargo) return outcome(progress, progress, 'unavailable', lang);
    if (cargo.action === 'take' && held) return outcome(progress, progress, 'cargo_occupied', lang,
      text(`Tu portes déjà « ${getMosaicCharacterMissionCargo(progress, 'fr').label} ». Termine sa remise avant de prendre autre chose.`,
        `You are already carrying “${getMosaicCharacterMissionCargo(progress, 'en').label}”. Deliver it before taking something else.`));
    if (cargo.action === 'deliver' && (!held || held.id !== cargo.id || held.missionId !== mission.id
      || held.universe !== mission.universe || held.districtId !== mission.districtId)) return outcome(progress, progress, 'cargo_missing', lang);
  }
  const operation = getMosaicMissionOperation(step);
  return completeStep(progress, mission, step, lang, null, step.dialogue || operation?.completedText || step.finding, interaction);
}

/** The movement loop publishes only an earned checkpoint. It does not complete
 * an operation, transfer cargo, make a decision, or advance another contract. */
export function advanceMosaicCharacterMissionWalk(progress, mission, movement, lang = 'fr') {
  const objective = getMosaicCharacterMissionObjective(progress, mission, lang);
  if (objective?.status !== 'active' || !objective.walk || objective.walk.completed) return { changed: false, progress };
  const saved = own(progress.records, mission.id);
  const receipt = recordMosaicMissionWalk(mission, objective.step, saved, movement);
  if (!receipt) return { changed: false, progress };
  const next = normalizeMosaicCharacterMissions(progress);
  next.records[mission.id] = { ...saved, walkReceipts: { ...record(saved.walkReceipts), [objective.step.id]: receipt } };
  return { changed: true, progress: next, walk: getMosaicMissionWalkProgress(mission, objective.step, next.records[mission.id]) };
}

function lastPhysicalOperationSequence(progress) {
  let latest = 0;
  for (const source of MOSAIC_CHARACTER_MISSIONS) {
    const saved = own(progress?.records, source.id);
    if (!saved?.districtId) continue;
    const mission = { ...source, districtId: saved.districtId };
    if (!validSaved(mission, saved)) continue;
    for (let index = 0; index < saved.completedStepIds.length; index++) {
      const step = getMosaicCharacterMissionStep(progress, mission, index);
      const receipt = own(saved.operationReceipts, step.id);
      const targetId = step.type === 'marker' ? `${mission.id}::${step.id}`
        : step.type === 'exhibit' ? `${mission.districtId}::exhibit::${step.targetId}` : receipt?.targetId;
      if (matchesMosaicMissionOperationReceipt(receipt, mission, step, targetId, saved)) latest = Math.max(latest, receipt.sequence);
    }
  }
  return latest;
}

function completeStep(progress, mission, step, lang, choiceId, message, interaction = null) {
  const next = normalizeMosaicCharacterMissions(progress), saved = next.records[mission.id];
  // Dormant/unknown pack data is retained verbatim, but cannot govern the order
  // of new physical actions. Never advance a take without a usable receipt.
  const operation = getMosaicMissionOperation(step);
  const sequence = operation ? lastPhysicalOperationSequence(next) + 1 : 1;
  if (!Number.isSafeInteger(sequence)) return outcome(progress, progress, 'write_failed', lang);
  const receipt = createMosaicMissionOperationReceipt(mission, step, interaction, sequence, saved);
  if (operation && !receipt) return outcome(progress, progress, 'wrong_target', lang);
  next.records[mission.id] = { ...saved, completedStepIds: [...saved.completedStepIds, step.id],
    choiceId: choiceId || saved.choiceId, completed: saved.completedStepIds.length + 1 === mission.steps.length,
    ...(mission.storyRevision === 2 ? { storyStepIds: [...(saved.storyStepIds || []), step.id] } : {}),
    ...(receipt ? { operationReceipts: { ...record(saved.operationReceipts), [step.id]: receipt } } : {}) };
  if (next.records[mission.id].completed) next.activeId = null;
  return outcome(progress, next, next.records[mission.id].completed ? 'completed' : 'advanced', lang, message);
}
export function resolveMosaicCharacterMission(progress, mission, choiceId, lang = 'fr') {
  const objective = getMosaicCharacterMissionObjective(progress, mission, lang);
  if (objective?.status !== 'active' || objective.step?.type !== 'decision') return outcome(progress, progress, 'inactive', lang);
  const selected = objective.step.choices.find(item => item.id === choiceId);
  if (!selected) return outcome(progress, progress, 'wrong_target', lang);
  if (!selected.valid) return outcome(progress, progress, 'wrong_target', lang, selected.result);
  return completeStep(progress, mission, objective.step, lang, selected.id, selected.result);
}
