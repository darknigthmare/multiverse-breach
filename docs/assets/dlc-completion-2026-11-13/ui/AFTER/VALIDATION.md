# Vérification du registre DLC

Les quatre éditions ont été compilées avec le véritable transformateur de profils et le menu Système de production. La matrice finale passe **8/8 cas** : desktop 1440 × 1000 en français, puis mobile 390 × 844 en anglais avec texte 150 % et marge 32 px, pour chaque édition.

| Édition | Packs inclus observés | Halo | Pirates |
| --- | ---: | --- | --- |
| Complète | 505/505 | Inclus | Inclus |
| Base | 0/505 | Non inclus | Non inclus |
| Halo | 1/505 | Inclus | Non inclus |
| Pirates | 1/505 | Non inclus | Inclus |

Les identités incluses sont comparées au profil réel de chaque compilation, sans changer `DLC/distribution.json` dans le dépôt. Les reçus des fixtures et leurs empreintes sont dans les quatre fichiers `*-fixture-profile.json`.

## Résultats observables

- Le déclencheur Système annonce désormais les DLC dans son nom accessible.
- Les listes présentent douze packs par page. Suivant change la plage annoncée en conservant le focus ; Réinitialiser retrouve la première page et le champ de recherche.
- `meridien creux` retrouve le dossier `Méridien Creux`.
- Les dossiers Halo et Pirates s’ouvrent et se replient avec Enter/Space. Leur état inclus/absent suit chaque édition.
- Le filtre Illustrations isole Cloud Meadow et son dossier explique qu’il ne déclare pas d’univers jouable.
- Une recherche vide de résultats et les filtres sans pack inclus/absent affichent une explication et une remise à zéro utilisable.
- La notice de conservation des données reste consultable dans un `<details>` natif. À 390 px et 150 %, la recherche est entièrement visible initialement : haut 597,66 px, bas 655,66 px, sans défilement préalable.
- Les options courtes Included/Not included sont entièrement lisibles. Le texte du panneau mesure 15 px à 100 %, 22,5 px à 150 %.
- La tabulation reste dans le tiroir. Escape le ferme et rend le focus au déclencheur ; l’arrière-plan retrouve son état interactif.
- Le brouillon contrôlé du parent et les sentinelles de stockage préparées restent identiques, y compris les préférences de terrain et la trace contenant une préférence de réserve.
- Les huit cas n’ont montré aucune erreur JavaScript, réponse HTTP échouée ou largeur débordante du document, du panneau et du dialogue dans les états mesurés.

Le [rapport final](matrix-report.json) et les 48 captures détaillent ces huit parcours. Le [rapport intermédiaire](intermediate-ux-matrix-report.json) conserve séparément le premier 8/8 et les empreintes d’avant la notice repliable et les libellés courts ; les images nommées correspondent à la version finale.

## Exemples

- [Édition complète, desktop](all-desktop-fr-edition.png)
- [Recherche immédiatement visible, mobile 150 %](all-mobile-en-150-edition.png)
- [Notice de conservation ouverte](all-mobile-en-150-preservation-guidance.png)
- [Halo absent de l’édition de base](base-mobile-en-150-halo-detail.png)
- [Halo inclus dans son édition](halo-mobile-en-150-halo-detail.png)
- [Dossier Pirates inclus](pirates-mobile-en-150-pirates-detail.png)
- [Cloud Meadow, illustrations uniquement](pirates-mobile-en-150-artwork-only.png)
- [Aucun pack absent de l’édition complète](all-mobile-en-150-inclusion-filter.png)

## Portée

Les captures BEFORE utilisent le titre de l’application complète. Les captures AFTER préparent un arrière-plan parent simple et rendent le vrai tiroir Système ; la comparaison visuelle concerne son contenu DLC. Les fontes Google sont bloquées dans les captures.

Cette matrice vérifie l’interface et ses interactions avec un brouillon et des sentinelles locales préparés. Elle ne valide pas un compte distant, une installation de distribution, une migration de sauvegarde réelle, une campagne complète ou les médias de chaque univers. Les contenus de dossier décrivent les familles de données déclarées par les manifestes. Aucun faux bouton de téléchargement ou d’installation n’est introduit.

Le broker QA distribue maintenant l’URL exacte `/favicon.png` depuis la véritable source Git. Le contrôle HTTP retourne 200, `image/png`, 116871 octets identiques au blob natif : [preuve séparée](favicon-broker.json). Ce correctif concerne le serveur de contrôle.

## Rejouer

Sous Node 22, compiler séquentiellement les profils `all`, `base`, `halo` et `pirates` :

```sh
SYSTEM_PROFILE=all NODE_OPTIONS=--max-old-space-size=8192 node scripts/buildDlcEditionFixture.mjs
```

Le builder produit `/tmp/dlc-edition-fixture-matrix/<profil>`. Puis lancer :

```sh
python scripts/browserDlcEditionMatrix.py
```

Le navigateur utilise Chromium local et les fichiers compilés ; il ne demande aucun serveur de jeu, export ou téléchargement de média.
