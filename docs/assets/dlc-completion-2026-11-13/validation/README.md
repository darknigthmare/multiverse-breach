# Vérifications de la reprise DLC

Les reçus enregistrent la commande, le code de sortie et les sources du contrôle concerné. Les échecs préalables restent conservés comme preuves de régression ; ils ne sont pas présentés comme des résultats finaux.

| Contrôle | Résultat et preuve |
| --- | --- |
| Suite standard DLC | `npm run test:dlc`, sortie 0 en 261,84 s ; groupes TAP 113/113 puis 234/234. Voir [reçu](dlc-standard-suite.json) et `dlc-standard-suite.log`. Ces groupes ne constituent pas un décompte de tests uniques. |
| Provider, reprise et décodeur v2 | 31/31 tests, sortie 0. [Reçu](batch-tests-v2.json) et `batch-tests-v2.log`. La course de renommage du cache LFS est reproduite avant correction. |
| Application complète, cinq profils | Complète, base, Halo, Halo + Steins;Gate + Trololo, Pirates : cinq compilations réussies après le dernier ajustement du panneau. [Matrice](app-bundle-matrix.json), 5 245 empreintes source identiques avant/après. |
| Contrat Pirates absent | Le bundle du vrai composant échouait dans les éditions base/Halo ; quatre cas passent après ajout de l’export nullable. [Avant](pirates-absence-before.json), [après](pirates-absence-after.json). |
| Sauvegardes | 21/21 tests des trois suites standard, dont l’aller-retour réel de normalisation/sérialisation d’App. [Rapport](../installation/README.md). |
| Interface | 8/8 cas sur quatre éditions, 48 captures finales, contrôle mobile/texte à 150 % et clavier. [Preuves](../ui/AFTER/VALIDATION.md). |
| Lint des sources modifiées | Sortie 0, zéro erreur, trois avertissements conservés : une expression de contrôle de caractères et deux imports inutilisés. [Reçu](changed-source-lint.json), `changed-source-lint.log`. |
| Textures AvP | Deux PNG mal nommés deviennent des WebP lossless ; comparaison intégrale RGBA et revue Pillow/libwebp indépendante. [Preuves](../batches/findings/AVP_FORMAT_CORRECTION.md). |
| Médias par lots | 490/490 lots, 19 582/19 582 fichiers, 15 276 034 454 octets : 17 087 rasters décodés et 2 495 fichiers contrôlés pour l’intégrité des octets. [Résultat final](../batches/verified-v2/final-summary.json). Le premier échec réseau et sa reprise sont conservés séparément. |
| Audit indépendant | Sortie 0, 16 983 blobs Git natifs uniques relus (8 502 875 611 octets), 17 631 SHA-256 natifs comparés et 1 951 payloads LFS liés aux pointeurs canoniques. 490 reçus et l’archive avant reprise concordent. [Rapport](../batches/receipt-audit/final-audit.json). |
| Continuité des sources finales | Les 5 245 fichiers de la matrice de compilation gardent leurs empreintes sur disque après la passe exhaustive. [Reçu](final-source-continuity.json). |

Les compilations contrôlent les modules de la vraie application et l’absence des packs exclus. Elles ne copient pas les médias et ne déclenchent pas le prébuild complet. La première matrice, antérieure à l’ajustement final du panneau, reste sous `app-bundle-before-final-ui/`.

`profile-runtime-before.*` et `pirates-absence-probe-entry-stripping.*` distinguent le défaut d’export réel d’une première sonde dont le point d’entrée avait été éliminé. `batch-smoke-*` conserve le refus correct d’un plan lorsque le code du vérificateur avait changé. Aucun de ces contrôles intermédiaires n’est réécrit en succès.

Le résultat exhaustif des médias figure dans les [reçus v2](../batches/verified-v2/) et l’[audit indépendant](../batches/receipt-audit/README.md). Un contrôle de bytes ou un décodage ne constitue pas une approbation artistique, un parcours de campagne complet ou un déploiement.
