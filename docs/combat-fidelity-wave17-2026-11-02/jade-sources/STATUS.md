# État de transmission — Jade W17

Production locale prête : **45 états / 180 dessins natifs**, plus **16 dessins d’action Gyrodisk**, soit **7 PNG / 3 registres / 196 dessins retenus**. Douze appels ont donné 232 candidats ;36 sont exclus, dont 4 figures tronquées. Les champs de complétude distinguent désormais les 16 études complètes et 4 figures incomplètes exclues du full 45. Les reçus et plans initiaux restent inchangés. Aucun PNG n’a changé lors de cette clarification.

Le dernier passage ciblé avec `server.watch:null` a terminé avec **17 tests réussis, zéro échec, exit 0** : `tests-final-watch-null.log`. Les builders `--check`, les 12 paumes/12 poignets et les 18 extrémités de bâton ont passé leurs vérifications.

Les deux moteurs Smash/Fighter utilisent les capsules Daï-Jo mesurées ; le chargé/lourd de Jade utilise son Daï-Jo, le secondaire garde le Gyrodisk, et le super reste la photographie informative sans HP ni augmentation d’attaque. Le rendu charge déjà le PNG du gant au démarrage ; les 12 flux clavier ont montré toutes ses 16 cellules dans les deux camps. Les sphères génériques ont été remplacées par des disques aplatis. Les derniers changements des moteurs appartiennent à l’agent RPG et du renderer à root.

## Preuves préliminaires conservées

- Ensemble complet 14 flux : `browser/attempts/preliminary-20261102061310646/jade-evidence.json`. Il est antérieur au dernier remplacement des sphères ; son instantané global a aussi changé pendant le développement parallèle. Il ne vaut pas preuve finale gelée.
- Dernier ensemble après ce remplacement : `browser/attempts/preliminary-20261102062835189/runner-failure.json` contient 13 flux réussis et le dernier P2 Gyrodisk interrompu pour une seule cellule 5 sautée au rendu.
- Reprise P2 inchangée réussie : `browser/attempts/preliminary-gyrodisk-cpu-unchanged-retry/jade-gyrodisk-cpu-result.json`. Toutes 16 cellules, premier dessin 0, un impact et vrai émetteur du gant y passent.
- Revue préliminaire réellement effectuée : `browser/jade-preliminary-visual-review.json` décrit 16 images QA ouvertes représentant 29 captures brutes, avec le correctif visuel du disque dans les deux camps. **Aucune preuve finale après gel n’est encore revendiquée.**

## Suite après le gel global

Le serveur Jade 5231 est **arrêté**, sans processus propre laissé en arrière-plan. Son helper utilise désormais `watch:null` et `hmr:false`.

1. Inclure tous les `resourcePaths` exportés par `browser/jade-browser-support.mjs` dans le gel global ; ils couvrent les vraies sources, registres, PNG, helpers, tests et fichiers de démarrage. Les Markdown et sorties navigateur sont exclus de ces entrées.
2. Démarrer un nouveau serveur via `node docs/combat-fidelity-wave17-2026-11-02/jade-sources/browser/start-jade-server.mjs`.
3. Exécuter **seul** `node docs/combat-fidelity-wave17-2026-11-02/jade-sources/browser/run-jade-browser-checks.mjs --after-production-freeze` ; conserver toute tentative échouée. Il observe les véritables sorties de 14 processus et la fermeture des navigateurs.
4. Exécuter `node docs/combat-fidelity-wave17-2026-11-02/jade-sources/browser/build-jade-review-contacts.mjs --after-final-browser`.
5. Ouvrir réellement les 15 images QA ainsi produites, couvrant 27 captures brutes, puis écrire la revue finale liée à leurs SHA. Le script de préparation inscrit volontairement zéro inspection et ne la simule jamais.
6. Arrêter le serveur propre après les preuves.

Les chiffres du domaine final sont 14 flux :12 flux clavier réels de six types dans les deux camps, et 2 études contrôlées distinctes. Ils vérifient 360 dessins de cellules,8 prises contrôlées,20 cas physiques de rebord et 28 dessins attachés. Le dernier dessin de montée relâche la prise ; ne pas recopier le 32 historique de Senua.

La chronologie Gyrodisk demeure explicite : plan local 05:33:22.585 Z, cliché des arguments initiaux 05:33:32.659 Z, annexe globale 05:33:33.811 Z ; l’art accepté correctif suit son plan correctif et l’annexe globale. `source1to1Verified` reste faux, avec adaptations et limitations documentées dans le README.
