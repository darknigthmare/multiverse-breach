# Preuves du démonstrateur Tactics

Le [document](../../tactics-terrain-verticality.md) et le [prototype](../../tactics-terrain-demo.html) sont séparés du moteur du jeu. Les trois captures proviennent de la vraie exécution Chromium résumée dans [result.json](result.json). Le script réellement exécuté est conservé sans modification dans [verify-tactics-terrain-demo.mjs](verify-tactics-terrain-demo.mjs) ; il sert le document sur `127.0.0.1:5193` et écrit ses sorties initiales sous `/tmp`.

[archive-provenance.json](archive-provenance.json) relie chaque fichier source à son archive par SHA256. Les captures archivées gardent exactement les octets des captures originales. Aucun atlas de personnage ni nouvelle fonctionnalité runtime n’est compté dans ces preuves.
