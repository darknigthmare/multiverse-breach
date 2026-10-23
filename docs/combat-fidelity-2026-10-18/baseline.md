# État initial avant les nouveaux scripts de fidélité

La référence immuable est [baseline.json](baseline.json). Elle couvre les 1 911 héros du catalogue et 525 univers. Les onze empreintes de fichiers conservées dans `inputHashes` identifient le code observé avant les modifications de cette passe.

Un nom renseigné, une image disponible et une animation fidèle sont trois preuves différentes. Les compteurs ci-dessous séparent les éléments utilisables, les adaptations et ce qui manque encore à une séquence dédiée.

| Domaine | Mesure observée | Limite de cette preuve |
| --- | --- | --- |
| Attaques simples | 1 330 noms génériques | La capacité a un format utilisable, mais ne décrit pas encore une action propre au personnage. |
| Actions secondaires | 1 387 noms génériques | Le remplacement des seuls supers n'a pas corrigé ces actions. |
| Défenses | 1 535 noms génériques | Détection large, incluant les libellés qui se terminent par `Guard` ; les noms précis peuvent être conservés après examen. |
| Bitmaps des héros | 1 911 chemins résolus, aucun fichier absent | La présence d'un atlas ne prouve ni la diversité des cellules ni leur fidélité à une œuvre. |
| États de Mêlée | 85 995 associations, soit 45 états × 1 911 héros | 80 254 états aboutissent implicitement à la ligne d'attente ; 5 700 utilisent une pose standard et 41 une ligne explicitement déclarée. |
| Manifestes dédiés | Aucun pour les 1 911 héros du catalogue | `player_anchor` possède un manifeste de 45 états, mais cet avatar est hors de ce catalogue. |
| Présentations | 13 377 paires héros/phase utilisent sept modèles partagés | Aucun script de keyframes propre au personnage ; entrées et sorties glissent, les autres phases réemploient `idle`, `hit` ou `special`. |
| Invocations et déploiements | 28 PNG, 112 poses distinctes, 82 profils appelants | Les images existent ; les 28 entités partagent encore la même famille de déplacement latéral et de timeline. Aucun script de chorégraphie distinct. |
| Ambiances | 525 univers configurés, 28 familles d'effets | Les fonctions de dessin sont partagées. Ce compteur ne représente pas 525 animations de scènes sources. |
| Comparaisons source validées | 0 | Aucune certification 1:1 n'est déduite d'un nom, d'un script, d'un atlas généré ou d'un test réussi. |

Les associations d'états ont été calculées avec les fonctions réelles de `spriteAssets.js` et le manifeste de Mêlée. Les groupes de routes dans le JSON gardent les 45 résolutions, tandis que chaque héros conserve ses chemins réels. Cette mesure porte sur le routage ; l'audit indépendant `character-animation-pixel-audit.json` mesure séparément les cellules RGBA répétées et l'alpha des images.

La détection conserve chaque identité, univers, slot et action d'origine. Les 4 252 entrées sont des **candidats issus de l’heuristique initiale** : le suffixe `Guard` inclut 118 défenses portant déjà un nom concret, à examiner séparément. Une classification stricte conserve 1 330 attaques simples, 1 387 secondaires et 1 417 défenses, soit 4 134 libellés génériques : pour la défense, `Signature Guard`, `defensive action`, ou exactement le nom du héros suivi de ` Guard`. Cette distinction est mesurée par `combatFidelityAudit.mjs` sans réécrire le JSON initial. Elle permet de vérifier qu'une correction remplace bien les anciens slots et qu'un simple changement de compteur ne masque pas les manques. Les capacités de soutien doivent également conserver leur ciblage allié, leur effet et leur absence de dégâts.

Pour les futurs scripts, les vérifications portent sur les poses et trajectoires réellement échantillonnées, le rendu de différentes étapes, l'impact unique, la reprise après pause, le respect des coordonnées de la scène et l'absence de modification du gameplay par un fond décoratif. Une animation native dédiée, une transformation d'une image statique et un effet procédural doivent continuer à être comptés séparément.

Le script `scripts/captureCombatFidelityBaseline.mjs --write-baseline` refuse d'écraser cette référence. Il ne faut pas le rejouer pour remplacer le JSON après implémentation : les évolutions doivent être comparées à cet état initial.
