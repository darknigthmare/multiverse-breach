# Mirelle Suture — série complète de quinze CG

Les quinze CG individuelles ont été générées avec ImageGen, inspectées et comparées au pack canon interne `MIRELLE_COMPLETE_SPRITES`. Le reçu `mirelle-complete-2026-10-18.json` contient les entrées, poses obtenues, thèmes, cinq champs de décor, sources, revue et hashes des 45 fichiers.

Les sources PNG publiques sont opaques RGB, 1086 × 1448 ; les masters WebP mesurent 1536 × 2048 et les vignettes 384 × 512. Quatorze natifs sont déjà au format exact ; le natif CG15 mesure 1087 × 1447, soit 0,1613 % de dérive de ratio, et a reçu uniquement le conditionnement de format autorisé sans recadrage. Tous les natifs ImageGen sont conservés.

## Identité et source

Le portrait HUD, la collection, la planche de combat et les objets/VFX ont été vus avant génération. Ils verrouillent le visage à peau chaude, les longs cheveux noirs et yeux brun/ambre, le grand chapeau noir pointu recourbé à bord large et ornements or, le manteau sombre à filigranes or, la cravate ivoire et broche, le pantalon teal et les bottes. Les cartes de données turquoise à croix blanche et bord or constituent l’outil signature. Les gantelets et le casque de l’Ancre n’ont pas été transférés à Mirelle.

CG02 représente les cartes et leur boîtier seuls ; CG03 représente les Archives statiques sans personnage. CG05 illustre explicitement l’aptitude de jeu `Suture du Voile`, documentée dans `src/game/heroes.js`, avec cartes, fils turquoise et déchirure corail. Les autres décors sont des compositions originales de quartiers A.R.C.A., compatibles avec le canon interne.

L’âge de Mirelle n’est pas établi dans les sources examinées. Toute la série conserve `unknown-family-safe-only`, `no-romance` et `family`. Les scènes plage, service et comique restent familiales et habillées. Les transformations et l’avenir hypothétique sont explicitement séparés du canon : carte vierge du Sans-Auteur en CG12, présentation masculine subtile en CG13, effacement mémoriel non graphique en CG14, avenir alternatif cinq ans après l’ouverture de la campagne en CG15. Ce futur et ce rendu ne certifient pas un âge ou un vieillissement canonique.

## Revue et corrections

Chaque CG a une pose et un décor distincts. Le premier essai CG04 a été rejeté car son fond ressemblait trop à l’Atrium de CG01. Le second a obtenu une cabine fermée, mais avait remplacé la croix principale de la carte par un diagramme de deux nœuds. La contrelecture indépendante a demandé de rétablir la grande croix blanche ; une correction ciblée par ImageGen l’a réintroduite sans régression de silhouette, pose ou décor. Les deux essais rejetés restent dans les preuves privées.

Une seconde revue visuelle a contrôlé les quinze CG et confirmé l’absence de défaut bloquant ; son rapport est conservé dans `reviews/complete-2026-10-18/mirelle-independent-review.json`, avec zéro issue ouverte. Les petits filigranes, boucles, broches et détails de pixels agrandis sont des interprétations : aucune certification mathématique de ressemblance 1:1 n’est inférée. CG12 conserve volontairement des cartes vierges au titre de son thème What If.

Aucun ancien sprite ou asset n’a été remplacé. Aucun registre global n’a été écrit par ce lot. La planche de lecture est `reviews/complete-2026-10-18/mirelle-delivered.webp`.
