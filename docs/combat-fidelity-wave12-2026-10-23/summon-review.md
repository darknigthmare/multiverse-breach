# Renforts RPG du lot 12

Sept partenaires du catalogue possèdent une nouvelle planche native de seize poses : arrivée, préparation, action et retour, quatre dessins distincts par phase. Sept appels `image_gen` ont fourni les sept sources ; aucun refus et aucune pose réutilisée ne sont comptés dans les **112 nouvelles poses**. Les partenaires sont des adaptations de mise en scène, pas des invocations canoniques ni des frames officielles certifiées 1:1.

| Partenaire | Version retenue | Action et règle |
| --- | --- | --- |
| Cybil Bennett | Silent Hill original, 1999 | Pistolet de police physique, tir de couverture |
| Regina | Dino Crisis original, 1999 | Pistolet physique, tir précis ; aucune lame énergétique ancienne réutilisée |
| Dutch Schaefer | Predator, 1987 | M16A1 avec M203 sous le canon ; seul le canon du fusil est utilisé, sans minigun ni laser |
| Ash Williams | Army of Darkness, 1992 | Tronçonneuse sur le bras anatomique droit, boomstick rangé dans le harnais ; approche physique jusqu’au contact |
| Isaac Clarke | Dead Space original, 2008 | RIG d’ingénieur bronze niveau 3, trois barres cyan horizontales ; Plasma Cutter physique |
| Leela | Futurama, période Fox 1999–2003 | Œil unique, tenue classique et enchaînement martial au contact, sans arme |
| Birdperson | Rick and Morty, saison 2, 2015, avant Phoenixperson | Ailes biologiques et garde alliée, aucun dégât ni faisceau |

## Dessins et normalisation

Les prompts exacts sont archivés dans `summon-*-initial.prompt.txt`, les réponses dans `summon-*-initial-result.json`, les sources originales sous `summon-sources/` et les métadonnées dans [summon-generation-records.json](summon-generation-records.json). Les sources et résultats conservent leurs empreintes SHA-256 dans la [provenance](summon-provenance.json).

Le builder reconstruit les planches à partir des sources archivées : découpage aux séparations transparentes, extraction alpha et **une seule mise à l’échelle uniforme par personnage**, sans redessiner l’anatomie, une arme ou une plume. Les cellules finales mesurent **512 × 256**, avec une ligne de pieds à **244** et dix pixels de marge transparente. Les sept calibrations donnent un corps de référence de **190 pixels** sans compression par l’enveloppe. Les sept planches ont seize cellules distinctes ; les séparations ne coupent aucun pixel visible au seuil de contrôle.

Les aperçus `summon-previews/` servent uniquement à la mesure. Les croix magenta des vues d’armes sont des annotations de contrôle ; elles ne sont pas dans les PNG publics. Les couleurs RGB de pixels dont l’alpha vaut zéro ne constituent pas un fond visible. Les planches de contact présentent les pixels sur un fond de contrôle explicite.

Le builder offre deux opérations distinctes :

```bash
node scripts/buildSummonAnimationsWave12.mjs --prepare
node scripts/buildSummonAnimationsWave12.mjs --check
```

`--prepare` écrit seulement les aperçus de mesure, sans ressource publique, registre ou livraison. `--check` reconstruit les sept ressources et vérifie leur égalité exacte avec les PNG et registres livrés ; il n’écrit pas de nouvelle ressource.

## Contact et origine des effets

Les quatre partenaires armés possèdent **24 ancres mesurées** dans leurs pixels natifs : les deux dernières préparations et les quatre poses d’action de chaque arme. Chaque centre est visible dans l’alpha et a été ouvert avec sa croix de contrôle. L’arrivée, la préparation avec arme baissée et le retour n’activent aucun départ de tir.

Ash et Leela utilisent les trajectoires d’approche physique déjà prises en charge : leur position atteint respectivement 48 et 38 pixels du point de contact. Aucune lame, main ou arme n’est reconstruite par Canvas. Birdperson montre sa garde avec ses vrais dessins d’ailes ; son repère ne dessine ni bouclier artificiel, ni vent, ni projectile. Le moteur reste l’unique source des effets de jeu et de leur coût.

Les contacts visuels offensifs suivent seulement les impacts qui ont effectivement réduit les PV. Une cible protégée, déjà morte ou retirée ne crée pas de faux contact. Les coordonnées acceptées sont conservées si la cible est ensuite déplacée ou mise KO. L’adaptateur de projection délègue toutes les anciennes entrées au chemin W11 inchangé.

## Revue et vérification

La revue visuelle a couvert les seize dessins de chaque partenaire, les chaussures, équipements, costumes, positions et gestes. Une revue indépendante de la partie B a confirmé Dutch, son M16A1 à poignée supérieure avec M203, la tenue de 1987 et les six repères à la bouche physique du canon ; les préparations avec l’arme baissée restent sans ancre. Une revue indépendante de la partie C a confirmé Ash et Isaac, notamment la latéralité de la tronçonneuse et les trois barres horizontales du casque. Une revue indépendante de la partie D a confirmé Leela et Birdperson ; la référence RPG de Birdperson a également servi à clarifier la coiffe blanche du dessin de présentation de cette partie. Ces revues ne constituent pas une certification de fidélité source 1:1.

La première passe de contrôle comprend :

- **14 parcours SSR du vrai moteur**, sept appelants dans les deux camps : annulation sans coût, coût unique, pause, effet unique, garde sans soin ni dégât, origine native, fin de scène et commande déjà consommée. Les cas offensifs ajoutent les protections, les cibles mortes et retirées ; tous les partenaires ajoutent les interruptions par mort ou retrait de l’appelant.
- **14 parcours Chromium à travers GameCanvas**, boutons, clavier, panneau de ciblage et propriété de pause réelle : 112 cellules natives vues dans chaque camp, 224 contrôles de réflexion des pixels, douze impacts offensifs uniques et deux gardes sans dégât. Aucun `pageerror` observé.
- Les empreintes des **465 PNG historiques et 93 registres historiques** correspondent à l’instantané d’avant le lot.

Ces premières preuves restent archivées sous leurs noms **préliminaires**. Les rapports JSON de la première passe finale, antérieure à une correction de compatibilité des anciennes présentations Fighter, sont conservés dans `../combat-fidelity-wave12-2026-10-23-before-legacy-compatibility-fix/`. Douze anciennes captures ont été conservées à l’identique ; les octets de deux autres avaient déjà été remplacés avant archivage. Cette [limite de conservation](legacy-compatibility-screenshot-retention.json) concerne seulement la passe candidate : ses observations JSON restent disponibles, et les quatorze captures du rejeu final ci-dessous sont complètes et liées à leurs propres empreintes. Après le gel de production du **23 octobre 2026 à 21:31:54.397 UTC**, les deux commandes suivantes ont été exécutées en parallèle et se sont réellement terminées avec le **code 0** :

```bash
node docs/combat-fidelity-wave12-2026-10-23/summon-runtime-validation.mjs --after-production-freeze
node docs/combat-fidelity-wave12-2026-10-23/summon-wave12-browser.mjs --after-production-freeze
```

Le [rapport SSR final](summon-runtime-result.json) confirme **14 tests réussis, aucun échec**, douze cas de protection, douze cibles mortes, douze cibles retirées et vingt-huit interruptions de l’appelant. Le [rapport GameCanvas final](summon-wave12-result.json) confirme **14 parcours**, 112 cellules dans chaque camp, **224 vérifications de réflexion**, douze impacts offensifs uniques et deux gardes sans dégât ni soin. Aucun `pageerror` n’a été observé ; les sources et ressources sont restées identiques pendant chaque exécution.

Le navigateur a réellement fermé à **21:33:47.231 UTC**, puis son rapport a été écrit avec `allBrowserWindowsClosed: true`. Les **14 captures finales** sont liées dans `artifacts[]` par leur chemin, leur taille et leur SHA-256 mesurés immédiatement après leur écriture. Les deux rapports enregistrent les empreintes des entrées et du harnais exécuté, ainsi que leurs horaires ; les 465 PNG et 93 registres historiques restent inchangés. La seule transition ultérieure permise par l’intégration concerne le registre Rift, régénéré après fermeture des fenêtres et lié séparément à ses propres reçus.
