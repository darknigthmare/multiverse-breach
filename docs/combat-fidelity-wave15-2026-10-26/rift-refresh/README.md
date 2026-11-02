# Préparation du rafraîchissement Rift W15

Les quatre copies `*-before` proviennent de l’état final validé de W14 et restent immuables. Le Python original conserve l’empreinte `de13d252fb7675b3715be22c6c0bcf5d51d02675ae35c62be622a6606db14edb`. La préparation ne lance aucune commande de production.

D’abord, `node docs/combat-fidelity-wave15-2026-10-26/prepare-rift-refresh.mjs --snapshot-baseline` conserve les quatre états W14 sans lancer une commande de production. Cette étape refuse un catalogue, un registre ou un script historique qui aurait déjà changé.

Après confirmation par le responsable du gel de `package.json` et des 120 références base16 :

1. `node docs/combat-fidelity-wave15-2026-10-26/prepare-rift-authorization.mjs --all-reference-owners-finished`
2. `python docs/combat-fidelity-wave15-2026-10-26/rift-refresh/run-sequential-refresh.py --references-only`

Cette première phase exécute seulement le catalogue de références puis l’audit Python historique. Elle conserve leurs véritables journaux et s’arrête après les deux sorties réussies.

Après le gel de production, tous les parcours navigateur finaux et leur fermeture effective :

1. `node docs/combat-fidelity-wave15-2026-10-26/release-rift-final-writes.mjs --all-final-browsers-closed`
2. `python docs/combat-fidelity-wave15-2026-10-26/rift-refresh/run-sequential-refresh.py --final-writes`
3. `python docs/combat-fidelity-wave15-2026-10-26/rift-refresh/summarize-refresh.py`
4. `python docs/combat-fidelity-wave15-2026-10-26/rift-refresh/verify-refresh-integrity.py`

La seconde phase préserve le reçu des étapes 1–2, vérifie les journaux, références et fichiers gelés, puis exécute les trois commandes restantes. Elle ne répète pas les premières étapes. Les constantes, seuils et approbations manuelles du Python restent inchangés. Les différences de statut et de prompt sont mesurées ; aucun statut `pending` n’est restauré manuellement. Une référence approuvée ne certifie pas la disponibilité d’une image de dossier.

L’option `--check-only` des helpers valide les entrées disponibles en mémoire sans publier de rapport ni lancer de commande de production. La fidélité officielle 1:1 reste non certifiée.
