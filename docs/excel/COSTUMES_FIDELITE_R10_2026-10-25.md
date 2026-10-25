# R10 — Costumes Mass Effect / Leon et vérification réelle des preuves PNG

Date : 25 octobre 2026. Base de la PR nº6 : `8ce15c779db1e911f0db8723c681a6b0b740bd78`. Les scènes, déblocages et identifiants des passes précédentes sont conservés. Aucun merge ni déploiement de production.

## 18 variantes ajoutées au catalogue et aux boosters

| Porteur | Édition | Ajouts |
|---|---|---|
| Shepard | Mass Effect 2 (2010) | Cerberus Assault, Kestrel, Inferno, Collector, Terminus Assault et Blood Dragon Armor |
| Shepard | Mass Effect 2 (2010) | Capacitor Helmet, Archon Visor, Umbra Visor, Sentry Interface et Recon Hood — cinq pièces de tête, pas cinq tenues complètes |
| Garrus | Mass Effect 2 (2010) | Apparence du pack alternatif nº1 |
| Tali | Mass Effect 2 (2010) | Apparence du pack alternatif nº2 |
| Shepard | Mass Effect 3 (2012) | N7 Defender Armor et apparence du pack alternatif |
| Garrus et Liara | Mass Effect 3 (2012) | Une apparence du pack alternatif pour chacun |
| Leon | Resident Evil 4 (2023) | Romantic |

Les cinq apparences de packs sont désignées par porteur et édition : la description éditeur confirme ces associations mais ne donne pas de nom individuel de tenue. Aucune palette, détail de casque ou nom d'armure non observé n'est inventé. Les consignes FR/EN sont des instructions de fabrication, pas une revue des pixels. Les modèles ME2, ME3 et Legendary Edition ne sont pas confondus.

Shepard garde son identité, sa morphologie et son visage choisis. Les armes, ressources et bonus des packs ne sont pas transférés. Les cinq accessoires de tête sont distingués des treize entrées de tenue/armure. L'équipement simultané de pièces incompatibles n'est pas supposé.

**Aucune nouvelle planche de costume, animation ni validation artistique 1:1 n'est livrée.** Les nouvelles entrées sont obtenables comme droits via le système R8 mais restent non équipables, même possédées, tant que leur art n'est pas produit.

## Sources primaires consultées

- EA / BioWare, liste des DLC et porteurs de Mass Effect 2 : https://store.steampowered.com/app/24980/
- EA / BioWare, N7 Warfare Gear et Alternate Appearance Pack de Mass Effect 3 : https://store.steampowered.com/app/1238020/
- Capcom, Leon & Ashley Costumes: Romantic : https://store.steampowered.com/dlc/2050650/

Le niveau de preuve est textuel : existence et porteur. Aucun turnaround officiel n'a été inspecté pour les nouveaux costumes. Thane, Jack, Grunt, Miranda, EDI et Ashley Graham sont suivis séparément comme porteurs sans rattachement exact retrouvé ; ils ne deviennent pas des récompenses attribuées à un homonyme. Jack de BioShock n'est pas Jack de Mass Effect et Ashley Williams n'est pas Ashley Graham. Les trois recherches non liées antérieures sont conservées.

## Fidélité : correction concrète du contrôle des preuves

Le précédent lecteur acceptait des métadonnées d'en-tête sans décoder l'image. Le nouveau `scripts/pngEvidence.mjs` contrôle et décode les PNG statiques 8 bits non entrelacés : ordre des chunks, CRC, IHDR/IDAT/IEND, palette et transparence, flux décompressé et cinq filtres de ligne. Il refuse les troncatures, données supplémentaires, images complètement transparentes et tailles hors budget.

Un SHA-256 des échantillons RGBA décodés complète l'empreinte du fichier. Une image réenregistrée avec une autre compression ou des métadonnées différentes ne devient plus une seconde vue de référence, une capture en jeu ou une animation distincte. Le RGB caché sous un alpha nul est neutralisé dans cette comparaison.

Limites explicites : pas de conversion de profil couleur, pas de comparaison perceptuelle, pas de jugement de ressemblance, pas d'inspection artistique des personnages. Les PNG 16 bits, entrelacés ou animés demandent un réexport dans le format pris en charge ; ils ne sont pas qualifiés d'artistiquement incorrects. Limites : 25 MiB, 8 192 pixels par côté et 16 mégapixels. FPS et karts demandent toujours une revue séparée.

Même un dossier complet à 100/100 reste seulement `READY_FOR_MANUAL_REVIEW`, `artApproved:false`, `equippable:false`. Les dossiers de test sont synthétiques et ne sont pas présentés comme des preuves d'un costume réel.

Références techniques : PNG W3C https://www.w3.org/TR/png-3/ et API zlib Node https://nodejs.org/api/zlib.html. Exécution locale sur Node 22.16.0.

## Totaux et boosters

106 designs officiels, 109 associations sur 32 identités ; 19 913 droits de costumes et 530 routes. Les 18 ajouts rejoignent leur booster Mass Effect ou Resident Evil et le multivers. Cinq cartes, prix et garanties précédents inchangés. La possession ne débloque ni personnage ni arme.

4 936 acteurs restent suivis. Le registre recalculé contient 30 678 actions ouvertes : ce n'est ni autant de défauts visuels observés ni un inventaire exhaustif de toutes les franchises. Les 312 identités originales restent distinguées des 4 624 externes/non résolues ; 4 592 de ces dernières n'ont pas encore de variante officielle documentée. Les 60 concepts personnalisés et quatre collections originales restent inchangés.

Les 22 P0 historiques et 1 477 acteurs avec chemin de raster absent restent ouverts. Aucune nouvelle image du jeu n'est examinée par cette passe. Le contrôle d'existence utilise l'arbre public de référence conservé ; ce n'est pas une collecte Vercel. Aucun acteur ni stage ajouté.

## Vérification réellement exécutée

- Base R9 : 919 tests locaux relancés et réussis avant modification.
- R10 final : **985 tests locaux réussis**, zéro échec/ignoré/annulé, soit les 919 précédents et 66 nouveaux. Ne pas additionner les deux exécutions.
- **20 contre-vérifications** d'images encodées par Pillow, cinq formats × quatre compressions : les empreintes RGBA correspondent à celles calculées indépendamment en Python. Ces images sont des fixtures, pas de nouveaux sprites.
- Génération du modèle Shepard/Kestrel, puis rejet correct de son dossier vide avec code 2.
- Syntaxe JS/MJS et script Python vérifiés. Le test navigateur a été actualisé pour les huit entrées de Leon, mais **n'a pas été exécuté**.
- Les onze fichiers existants touchés ont été vérifiés contre le parent par reconstruction d'arbre ; les quinze fichiers source/tests R10 correspondent aux blobs locaux, arbre de code `e158bf241dfb9d92f8965ccbf4b1a9ab2cf4b612`.
- **Aucun nouveau lint, build global, parcours navigateur, contrôle Vercel ou succès CI revendiqué.** Les résultats R8 gardent leur périmètre historique.

## Livraison et reproduction

Le XLSX R10 contient dix onglets : synthèse, acteurs, catalogue officiel cumulé, ajouts R10, boosters, recherches, concepts personnalisés, contrôle PNG, grille 1:1 et sources. Scores artistiques laissés vides. Intégrité ZIP/XML et 48 formules contrôlées, aucune cellule d'erreur, aperçu inspecté.

Le classeur, le CSV complet des tâches et le pack source/exports/tests sont fournis dans la conversation. **Le nouveau XLSX n'est pas publié comme binaire dans le dépôt ; les anciens XLSX ne sont pas remplacés.** Le présent rapport, les sources et le CSV des 18 ajouts sont dans la PR. Le pack n'est pas une archive du jeu complet.

```sh
node --no-warnings --experimental-loader ./scripts/sourceSceneTestLoader.mjs --test scripts/wardrobe.test.mjs scripts/wardrobeRoster.test.mjs scripts/reauditWardrobeCatalog.test.mjs scripts/reauditWardrobeCoverage.test.mjs scripts/reauditWardrobeFidelityR7.test.mjs scripts/wardrobeBoosters.test.mjs scripts/reauditSourceScenes.test.mjs scripts/actorFidelityR9.test.mjs scripts/pngEvidence.test.mjs scripts/wardrobeR10.test.mjs
node --no-warnings --experimental-loader ./scripts/sourceSceneTestLoader.mjs scripts/reviewWardrobeFidelity.mjs --actor shepard --universe 'Mass Effect' --entry me2-kestrel --template /tmp/revue-shepard-kestrel.json
```

Le modèle ne remplace aucun fichier existant. Une revue lit les fichiers locaux sous le dossier autorisé, sans accès réseau ni mutation de sauvegarde. Aucun compte, secret, workflow de transfert ou réglage administratif ajouté.
