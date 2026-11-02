# PR 6 — six signatures Final Fantasy et cibles des rafales

Base visée : `73a3088adcd87199aab35065754c3b95576d5ead` (R11 de la PR 6).
Cette passe complète les personnages non couverts par le registre de signatures.
Elle conserve les costumes, droits de boosters et scènes R4–R11. Aucun acteur
ni objet n'est ajouté à la sauvegarde et aucune apparence n'accorde une capacité.

## Capacités intégrées en RPG et Smash

| Identité exacte | Capacité | Contrat livré |
| --- | --- | --- |
| `seifer_ff8` | No Mercy | Un impact sur les ennemis confirmés du groupe ; portée de 330 en Smash. |
| `laguna_ff8` | Desperado | Un impact de groupe ; portée de 380. La rafale visuelle n'est pas six dégâts supplémentaires. |
| `zell_ff8` | My Final Heaven | Impact de groupe à courte portée (120) ; pas de frappe automatique sur toute l'arène. |
| `irvine_ff8` | Quick Shot | Six contacts sur un ennemi confirmé ; portée de 370. Six est une adaptation bornée, pas le nombre variable de tirs du jeu source. |
| `Final Fantasy VII::Midgar Zolom` | Beta | Attaque de groupe ; portée de 400. Pas d'apprentissage Enemy Skill ni de projection hors du combat. |
| `Final Fantasy VII::Sweeper Machine` | W Machine Gun | Un contact sur une cible ; portée de 330. Aucun aveuglement ajouté. |

Coût existant : 100 points de spéciale, et une ATB pleine en RPG. Préparation,
manifestation, impacts différés, récupération, pause et interruption passent par
le directeur existant. La puissance existante est conservée ; pour Quick Shot,
elle est répartie sur les contacts, qui utilisent chacun les défenses natives.
Aucun inventaire de munitions, système de MP ou nouveau bonus élémentaire ajouté.

**Fighter et Tactics ne sont pas déclarés adaptés par ce lot.** Les profils et
supers déjà présents dans ces moteurs sont conservés. Pas de nouveau personnage,
planche d'animation, invocation autonome, transformation ou certification 1:1.
Selphie/The End et les transformations de Vincent ne sont pas remplacées par une
attaque arbitraire pour augmenter le compteur.

## Références et niveau de preuve

Pages secondaires de Gamer Corner Guides lues le 25 octobre 2026. Elles documentent
les associations personnage/technique et les cibles, pas nos pixels ou timings.
La convention de ciblage de My Final Heaven suit cette référence secondaire ;
aucune comparaison vidéo image par image ni certification canonique n'est faite.

- Seifer : https://guides.gamercorner.net/ffviii/limit-breaks/no-mercy
- Laguna : https://guides.gamercorner.net/ffviii/limit-breaks/desperado
- Zell : https://guides.gamercorner.net/ffviii/limit-breaks/my-final-heaven
- Irvine : https://guides.gamercorner.net/ffviii/limit-breaks/quick-shot
- Midgar Zolom : https://guides.gamercorner.net/ffvii/monsters/midgar-zolom
- Sweeper : https://guides.gamercorner.net/ffvii/monsters/sweeper

Les mêmes liens, les limites et `evidenceLevel=secondary-gameplay-reference` sont
conservés dans le module. Les anciennes descriptions personnalisées, univers
incompatibles et non-combattants ne reçoivent pas ces profils.

## Défaut reproduit et corrigé : une nouvelle vie n'hérite pas d'une rafale

Huit scénarios échouaient avec les anciennes règles : RPG/Smash, P1/P2, cible tuée
puis immédiatement ressuscitée ou identité de cible modifiée sur le même objet.
Les tirs suivants pouvaient toucher cette nouvelle vie/incarnation.

Chaque cible confirmée possède maintenant un témoin d'identité, de camp et de vie.
Le répartiteur de dégâts signale le KO immédiatement ; une résurrection avant la
frame suivante ne restaure pas l'ancien témoin. Une cible invalide perd ses coups
sans transfert sur un autre ennemi. Les autres cibles d'un groupe restent actives.
Les PV, positions et défenses ne sont pas figés. Une nouvelle action peut viser
une vie ressuscitée normalement. Les pièces de rencontres non présentes dans la
liste ordinaire des ennemis restent admissibles via les règles natives.

Cela protège les contacts de signatures source, y compris avant la libération
d'un projectile ou d'un groupe de spectres. Leurs contrôleurs propres gardent
leur nettoyage après lancement. Pas de promesse d'interception des écritures
arbitraires directes de PV qui ne passent par aucun répartiteur de dégâts.

## Blocage de build déjà présent sur R11

Le run `40145884484` échouait sur le test LV-426 de
`scripts/canonPriorityCorrections.test.mjs` : l'assertion exigeait encore
`Sulaco.*separate and unimplemented`. Or R4 a ajouté la scène 50101.
Le test vérifie désormais que la scène Sulaco est distincte, exige la mission
LV-426, reste tactique et requiert Ripley Aliens. Les contrôles Queen non létale,
Newt, univers sauvegardé et bestiaire d'origine sont conservés. Aucun test supprimé.

## Validation et limites de l'environnement local

- 57 tests dédiés : six identités, exécution sur deux moteurs/deux camps, portée,
  coûts, pauses, contacts uniques/groupés et générations de vie.
- Huit échecs reproduits avant le correctif de cible, puis aucun après.
- Groupe local `scripts/signature*.test.mjs` : **1 027 réussites**, aucun échec,
  ignoré ou annulé. Il comprend les nouveaux tests et les régressions : ne pas
  additionner les groupes. Les 118 profils historiques sont toujours vérifiés.
- Lint des huit modules/tests ciblés : zéro erreur, zéro avertissement.
- Douze recettes ajoutées au navigateur existant : six profils dans les deux
  moteurs, français/anglais, 390/1 280 pixels ; ennemis via les commandes P2.
- La fixture refuse une identité inconnue au lieu de remplacer silencieusement
  par Cloud ; les erreurs de rendu interceptées et erreurs de capture sont tracées.

Les sources locales viennent d'un snapshot antérieur. Les blobs des fichiers
modifiés, de heroes.js, expandedUniverses.js et du runtime source ont été
comparés au parent R11 avant modification. Les moteurs locaux ne reproduisent
pas tous les ajouts ultérieurs de la PR 5/6 : ces résultats locaux sont préliminaires.
La CI sur la tête publiée fait foi pour l'intégration complète, les douze recettes
navigateur et le correctif du prébuild. Aucun succès local de build complet,
parcours navigateur, appareil physique ou compte réel n'est revendiqué.

Le recompte local passe de 118 à 124 profils source, de 148 à 154 supers Smash
profilés, de 185 à 191 entrées partiellement couvertes, et de 4 650 à 4 644 entrées
sans signature. Ces nombres ne mesurent pas les movesets complets ou la fidélité.
Le total reste 4 936 entrées, 525 univers et 101 non-combattants préservés.

## Livraison

Les CSV décrivent cette passe ; ils ne remplacent pas le classeur original perdu
ni les classeurs de costumes. Aucune fusion, promotion de production, nouvelle
image ou modification de compte/configuration administrative dans ce lot.
