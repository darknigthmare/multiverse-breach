# Validation finale du lot 12

Le build réel `npm run build` s’est terminé avec le code **0**, puis le contrôle HTTP de la production a réussi. Le reçu provient de l’événement `close` du processus et lie le journal ainsi que l’audit gelé.

- **1460 tests dans 17 groupes**, aucun échec, test annulé, ignoré ou en attente ; lint et contrôle des espaces validés.
- **39 personnages en 32 poses**, **39 bases de 16 poses**, **1 personnage avec 45 états Mêlée et 180 poses (4 par état)** (isaac) et **7 renforts RPG de 16 poses** : **2164 poses et 91 nouveaux PNG** réellement livrés.
- **14 scènes de décor ajoutées** ; variation du nombre d’univers couverts : **0**.
- **556 PNG et 104 registres** vérifiés ; les 465 PNG et 93 registres historiques conservent leurs empreintes. Chaque PNG a été décodé localement et dans Chromium, avec identité des octets public / dist / HTTP.
- **14 parcours RPG SSR et 14 parcours GameCanvas finaux**, 224 contrôles de réflexion des pixels, douze impacts offensifs uniques et deux gardes sans dégât. Les autres parcours de présentation et de décor sont liés dans [browser-checks.json](browser-checks.json).
- Les cinq commandes Rift ont réellement réussi dans l’ordre. Les 40 références sont liées à leurs SHA actuels, le Python et ses seuils restent inchangés ; l’autorisation de référence initiale est distincte de la barrière finale de production.
- Les **2098 entrées gelées** correspondent toujours à l’audit. Le finaliseur lui-même était gelé avant le build ; aucune adaptation de source après build n’a été nécessaire.

Morty conserve son ancienne ressource après un refus explicite d’image ; aucune nouvelle pose, base ou partenaire de remplacement n’est compté pour lui. Les images sont des adaptations générées et revues : **la fidélité officielle 1:1 n’est pas certifiée**. Une référence de personnage approuvée ne garantit pas la disponibilité du dossier Rift correspondant ; les statuts `pending` réellement observés sont conservés.

Les mesures, empreintes et limites sont détaillées dans [validation.json](validation.json), [deliverables.json](deliverables.json), [les preuves RPG](summon-review.md), [le reçu du build](build-exit.json), [la preuve HTTP](browser/production-assets-http.json) et [le bilan Rift](rift-refresh/summary.json). Le [document Tactics](../tactics-terrain-verticality.md) et son [démonstrateur autonome](../tactics-terrain-demo.html) décrivent une évolution séparée du moteur actuel.
