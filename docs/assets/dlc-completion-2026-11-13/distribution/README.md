# Distribution DLC — 13 novembre 2026

Les exports gardent les chemins publics et les octets des sources canoniques.
Aucun PNG de remplacement générique, raccord de sprite ou changement du
publisher n’est introduit par cette revue.

## Correctifs

- Les références locales de médias commençant par `/` dans `index.html` rejoignent le contrôle des
  ressources communes : favicon, images, vidéo et styles littéraux. Un média
  non déclaré ou appartenant à un DLC omis bloque l’export avant publication.
  La recherche ignore les commentaires, corps de scripts, URL distantes et
  expressions dynamiques. Query et fragment servent à l’URL d’origine ; seul
  le chemin de recherche est normalisé. Le HTML exporté reste identique.
- Le build refuse un `dist` préexistant qui serait un lien symbolique ou un
  fichier, avant de laisser Vite vider ce chemin. La vérification des médias
  publiés contrôle aussi leurs répertoires parents et compare leurs octets et
  SHA-256 avec le reçu.
- Le mode documentaire explicite `runtime` conserve les dépendances des
  imports de production, y compris les JSON et modules transitifs dans `docs/`.
  Les sources `src`, API, DLC sélectionnés et configuration Vite sont examinées
  après transformation du profil. Une dépendance statique introuvable, un import
  calculé non qualifié, un glob, une sortie du dépôt ou un lien symbolique bloque
  cette fermeture. Le profil d’installation généré est traité séparément.

## Export documentaire explicite

```sh
node scripts/exportDlcDistribution.mjs \
  --profile config/dlc-profiles/halo.json \
  --out /tmp/multiverse-halo \
  --documentation runtime
```

L’API accepte `documentation: 'runtime'`. Le défaut `all` conserve le comportement
historique : copie des JSON de recherche. La sortie indique le nombre et le
poids des documents copiés ainsi que des JSON omis.

Le relevé physique initial trouvait 7 400 JSON dans `docs/`, soit
3 743 865 330 octets. Il s’agit d’un relevé de fichiers, pas d’une preuve
d’hydratation des médias. Les archives canoniques déjà contenues dans `src` ou
dans les modules DLC sélectionnés restent inchangées ; les chaînes de provenance
dans leurs JSON ne sont pas transformées en imports. `runtime` ne promet pas de
livrer tous les tests de recherche, outils de génération ou audits historiques.

## Vérification réalisée

172 tests ciblés passent avec Node 22, un heap de 2 Gio et une concurrence de 1.
Ils couvrent exports base/Halo/mixte/all sur fixtures, imports JSON/MJS réels,
mode CLI, intégrité des PNG, refus de chemins dangereux et régressions des
deltas, dépendances partagées et inventaires.

Ces fixtures ne valident pas la portabilité des quatre éditions canoniques
complètes. Aucun build Vite ou parcours SSR de production n’a été exécuté par
cette revue. Leur vérification dépend de la matérialisation des médias et du
contrôle des profils réels réalisé séparément. Le détail est enregistré dans
[`review.json`](review.json).

## Inspection des sources canoniques

`inspectDlcExportSources({ root, profile, documentation: 'runtime' })` utilise le
même inventaire et la même transformation que l’export, sans reçu de médias,
copie de fichiers ou compilation. Les cinq profils réels passent :

| Profil | Packs | Sources | Octets source canoniques |
| --- | ---: | ---: | ---: |
| Tout | 505 | 5 334 | 111 488 740 |
| Base | 0 | 1 789 | 102 612 868 |
| Halo | 1 | 1 813 | 102 744 928 |
| Halo + Half-Life | 2 | 1 839 | 102 825 124 |
| Pirates of the Caribbean | 1 | 1 797 | 102 652 142 |

Ces nombres précèdent la réduction des contributions optionnelles dans les
fichiers transformés. Aucun document de `docs/` n’est nécessaire à leur fermeture
d’import actuelle ; 7 426 JSON représentant 3 745 275 764 octets sont omis. Les
empreintes du diff des sources avant/après restent identiques. Cette inspection
prouve la fermeture statique des sources actuelles, sans conclure à la présence
de leurs médias ni à leur fonctionnement en jeu. Les résultats et le périmètre
exact figurent dans
[`canonical-source-inspection.json`](canonical-source-inspection.json).
