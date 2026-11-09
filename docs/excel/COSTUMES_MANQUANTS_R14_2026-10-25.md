# R14 — costumes oubliés et contrôles de complétude indépendants
Date : 25 octobre 2026.

## Reprise depuis la version fusionnée
La PR nº6 a été fusionnée le 25 octobre. Cette continuation part du master `b8b2c326da45ce11ed8bd8868fca0bf266dfd31a`, conserve R4–R13 et les travaux de combat, et ouvre une PR distincte.
Code R14 : `2601d4334862f5264b48220bb2f73f92782ea38d`. Arbre source : `6f4a9916bcab127e9ca33027c908a07f049803cf`.

## Quatorze ajouts réellement enregistrés
Treize tenues pour `HITMAN — World of Assassination / hitman_woa_agent_47` :
The Splitter Boxer Suit ; The Club Boom DJ Suit ; The Banker King of Cards Suit ; The Zig-Zag Suit ; MVP Coach Tracksuit ; Home Kit ; Away Kit ; The Blue Lagoon Suit ; The Sundown Casual Suit ; The Riviera Retro Suit ; The Entrepreneur Fur Coat ; The Hustler Tracksuit ; Rapacious Suit.

Un modèle corporel pour `RoboCop / alex_murphy_robocop` : **Damaged**, de Rogue City, décrit par Nacon comme inspiré de la fin du premier film.

Les entrées déclarent porteur exact, œuvre/édition, nature, composant, mode source et instructions de fabrication bilingues. Les références visuelles propres aux porteurs restent à collecter. Les noms des tenues ne suffisent pas à déduire leurs matériaux, motifs ou accessoires. Les cibles et célébrités des packs ne remplacent pas Agent 47 ; armes, gadgets, voix, accès aux missions et bonus ne sont pas transférés.

**Aucun PNG de jeu ni animation de costume créé. Aucune approbation artistique 1:1. Les droits acquis restent non équipables tant que les graphismes dédiés manquent.**

### Sources éditeur consultées
| Source | Portée attestée |
|---|---|
| https://store.steampowered.com/app/3254350/ | The Splitter Boxer Suit |
| https://store.steampowered.com/app/3110360/ | The Club Boom DJ Suit |
| https://store.steampowered.com/app/3711140/ | The Banker King of Cards Suit |
| https://store.steampowered.com/app/4621250/ | The Zig-Zag Suit, pack 2026 |
| https://store.steampowered.com/app/4542910/ | MVP Coach Tracksuit, Home Kit, Away Kit |
| https://store.steampowered.com/app/4944070/ | Blue Lagoon, Sundown Casual, Riviera Retro, pack 2026 |
| https://store.steampowered.com/app/4911210/ | Entrepreneur Fur Coat, Hustler Tracksuit, pack 2026 |
| https://ioi.dk/hitman/news/2021/seven-deadly-sins | Rapacious Suit de l'acte Greed uniquement, pas les six autres tenues |
| https://www.nacongaming.com/en-US/robocop-rogue-city | Damaged ; aucune affirmation de disponibilité/prix d'une édition |

Quatre pistes restent hors des droits : six autres tenues des péchés à identifier ; Breach Response Gear à classifier (https://store.steampowered.com/app/4328240/) ; détails Vanguard non confirmés au-delà du titre (https://store.steampowered.com/app/2436840/) ; huit costumes Legends à identifier par nom et porteur (https://store.steampowered.com/dlc/1235140/). Le manque de détail n'est pas une preuve d'inexistence.

## Correction d'un vrai oubli silencieux
Dans R13, certaines listes attendues étaient calculées depuis les entrées livrées de `OFFICIAL_COSTUMES_R13`. Une omission avant l'évaluation du module pouvait donc supprimer aussi sa propre exigence : le contrôle restait complet à tort.

Les attentes PAYDAY sont maintenant tirées du manifeste de source, et celles de Magicka de listes indépendantes. Les neuf périmètres R14 appliquent la même séparation. Trois tests de mutation retirent une entrée avant la construction du module et vérifient que cette entrée reste attendue et signalée manquante. Cela ne vérifie pas automatiquement la ressemblance, ni la totalité d'une garde-robe.

## Boosters, acquis et périmètre préservés
Les 20 139 droits précédents et leurs descripteurs complets sont identiques (empreintes vérifiées). Les pools de HITMAN et RoboCop gagnent exactement 13 et 1 droits, plus la route multivers. Un pool anciennement terminé reçoit seulement ses nouveaux droits, sans répétition.

Les cinq cartes, prix, probabilités de cartes, garanties et règles R8 restent inchangés. Pas de personnage, arme, pouvoir ou statistique offert. Masquages et désactivations, copies d'équipement, sauvegardes et identifiants futurs sont contrôlés. Aucun compte ou fichier de sauvegarde réel modifié.

## Totaux du suivi
- 4 936 acteurs, 525 univers ; 3 206 stages conservés, sans nouvel acteur/stage.
- 190 définitions officielles, 349 associations sur 55 identités ; 20 153 droits et 530 routes.
- 60 concepts personnalisés et quatre collections communes conservés, sans nouveaux dessins.
- 34 listes de source sur 12 identités ; 31 pistes ciblées et 22 candidats sans porteur exact.
- 30 726 tâches individuelles : 17 332 P1 et 13 394 P2 de travail. Le nouveau dossier graphique et les quatre pistes expliquent les cinq tâches supplémentaires, pas une régression de graphismes.
- 312 identités originales distinguées des 4 624 externes/non résolues. 4 569 de ces dernières restent sans variante officielle documentée.
- Les 22 P0 visuels historiques et les 1 477 acteurs avec raster résolu absent restent ouverts.

Ces compteurs ne prouvent pas un inventaire exhaustif des œuvres. Les tâches sont issues des données et des chemins, pas d'une inspection manuelle de chaque pixel. La planche présente ne vaut pas validation artistique, et un chemin absent peut avoir un rendu de secours.

## Vérifications exécutées
Run dédié **40171107033 réussi, publication comprise** : https://github.com/darknigthmare/multiverse-breach/actions/runs/40171107033
- 1 254 tests Node réussis, zéro échec/ignoré/annulé : 1 204 régressions et 50 nouveaux contrôles. Même suite locale et CI, ne pas additionner les exécutions.
- Lint ciblé : zéro avertissement/erreur sur quatre fichiers.
- Compilation Vite des sources réussie. Prébuild intégral de la bibliothèque bitmap non exécuté ; gros blocs JavaScript toujours signalés.
- Les quinze sources/tests publiés correspondent aux blobs locaux ; tous les exports JSON de catalogue et boosters concordent entre local et CI.
- Artefact 12590945093 téléchargé et SHA-256 vérifié : `1697b505fb7109c7543e8e02110dd0af96ba20a57326c528c9ec856dd30419ba`.
- 691 fichiers source/configuration de la base collectée vérifiés. Workflow permanent de régression en lecture seule ; le workflow temporaire de publication n'est ni dans le diff ni dans l'ascendance de la PR.
- Pas de nouveau parcours navigateur, contrôle Vercel, téléphone physique ou revue artistique globale. La suite de signatures distincte n'est pas revendiquée comme rejouée.

## Livrables
Le classeur `Multiverse_Costumes_Manquants_R14_2026-10-25.xlsx` contient neuf onglets : synthèse, acteurs, ajouts, catalogue officiel cumulé, boosters, recherches, périmètres de source, sources et méthode. Le CSV joint contient le détail des 30 726 tâches.
Classeur : 469 043 octets ; SHA-256 `d34e7f54047489442acbefc50ee06b73478352068aefec7b713aaa6759c5128f` ; 894 formules ; aucune cellule d'erreur détectée. Intégrité ZIP/XML et aperçu de synthèse contrôlés.

**Le code, le présent rapport, les preuves et le CSV des 14 ajouts sont dans la PR. Le XLSX et le CSV intégral des tâches sont livrés dans la conversation, pas publiés comme binaires dans le dépôt.** Les anciens Excel ne sont pas écrasés. Le pack est un complément sources/exports/preuves, pas le jeu complet. Aucun merge ni déploiement de production effectué par cette passe.
