# PR 7 — correction complémentaire de la provenance des dossiers

Le build complet `40171071370` sur `e5810d2e` a franchi `rift:audit`, puis
échoué dans `test:rift` : 84 tests réussis sur 85. Le catalogue régénéré possède
le texte actualisé de la suite Sulaco, mais le registre historique du 1er octobre
conserve l'ancienne empreinte `cfa92430...`. Le nouveau texte produit `9f5a12d8...`.

## Correction

Le fichier historique `canon-remediation-2026-10-01.json` reste strictement
inchangé, empreinte SHA-256
`559d1dba89470e9c34dae5b9b1710441a75abca5ac9ce7a5a74f4f57fe896a30`.
Une révision distincte documente la transition pour la seule scène 3 : empreintes
avant/après, adaptation avant/après, chemin d'asset inchangé, commit source et
commit de régénération. Aucune image, génération ou validation artistique ajoutée.

Le test de provenance suit cette transition explicite avant de vérifier le
catalogue actuel. Les contrôles des anciens fichiers, du journal de génération,
des empreintes d'images et du statut disponible/en attente restent conservés.
Un ancien prompt ne suffit jamais à certifier un bitmap pour le nouveau texte.

Deux tests supplémentaires vérifient l'intégrité du registre historique, la
reconstruction exacte de l'ancien prompt par substitution de la seule phrase
modifiée et le rejet des transitions cassées, répétées, des chemins d'images
modifiés ou des prétendues approbations graphiques. Les autres scènes n'utilisent
pas cette révision. Aucun test supprimé et aucun statut forcé à disponible.

## Validation

Les deux nouveaux tests ciblés passent localement ; lint du test sans erreur ni
avertissement. Le checkout partiel n'a pas toutes les images historiques : le
succès de toute la suite de provenance et du build complet reste à lire dans la
CI du nouveau commit. Les résultats complets antérieurs sur `e5810d2e` sont
conservés séparément : réaudit 1040/1040, signatures 1064/1064, recettes Fighter
16/16 et recettes source 30/30. Ils ne certifient pas ce nouveau commit.

Cette correction ne change ni les treize adaptations Fighter, ni les costumes,
les sauvegardes, les mouvements ou les images du jeu. Aucun merge ni déploiement
de production n'est initié.
