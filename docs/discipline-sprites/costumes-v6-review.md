# Reprise et récupération des tenues v6

## Résultat

La PR nº12 contenait 197 sprites à la tête `f9a9c1db7bbea3312e53341e5fbbdcf79c504851`. Cette reprise réunit 166 sorties acceptées, récupérées ou nouvellement terminées, portant le catalogue à 363 PNG pour 36 identités. Les 197 objets de catalogue, 197 objets du manifeste et 197 PNG antérieurs sont conservés strictement. Les résultats détaillés figurent dans le rapport de conservation.

## Lots auparavant non publiés

Les fichiers les plus récents avaient été partiellement intégrés : le catalogue déclarait 238 images, alors que d’autres PNG acceptés existaient déjà. Un lot antérieur de 30 tenues maid et de bataille personnalisées était également absent de la PR. Les deux lots sont réunis sans supprimer les variantes différentes partageant un personnage et une famille.

Les identifiants `maid-service-adapted-v6` conservent le modèle de vêtement OVA transmis en deuxième entrée, lorsqu’il était utilisé. Les corrections de Kaori et Karen préservent les prompts et empreintes de leurs tentatives intermédiaires : le modèle de vêtement n’est pas attribué à tort comme unique entrée de la correction finale.

Les nouvelles tenues infirmières de Manami et Maya sont terminées. Le brouillon infirmière de Yuri est recadré par génération : le dernier appel utilise le brouillon seul. Son sprite d’identité d’origine figure comme source ancestrale dans la chaîne documentée. Le prompt initial, l’essai de correction rejeté pour style et halo, puis le prompt de correction accepté sont conservés avec les empreintes des fichiers.

## Catégories et attentes

Les nouvelles tenues de bain sont des maillots une pièce, des shorts de bain ou des combinaisons courtes de triathlon. Les 35 vêtements aquatiques antérieurs restent accessibles et sont exclus de cette couverture. Les tenues maid et infirmières sont des adaptations de vêtements de service et de soins. Les batailles personnalisées sont des tenues de jeu adaptées, sans revendication de costume canonique.

Après la précision du besoin, la continuation ajoute des maillots sportifs brillants à effet latex pour 30 identités. Ils reprennent une direction rouge brillante dans des versions opaques et non sexualisées, sans copier la tenue de bondage de Leona. La figure monochrome garde ses niveaux de gris. Les combinaisons intégrales rouges et les anciennes variantes noir et or restent distinctes ; elles ne sont pas déclarées équivalentes à la nouvelle coupe de maillot.

Une nouvelle demande précise que les personnages sont adultes et demande une copie plus fidèle. Ce contexte est explicitement fourni au générateur dans un pilote Leona, avec le sprite neutre d’identité et la photographie Q-six du costume noir comme seconde entrée. La construction visible est demandée en rouge, avec une couverture opaque et une pose neutre. Le système d’images refuse cette entrée (`moderation_blocked`, catégorie `sexual`) : aucune sortie n’est comptée, aucun autre essai n’est lancé. Le journal conserve le prompt réel, les deux références et l’erreur reçue.

## Fidélité et provenance

La référence d’identité réellement fournie au générateur, les références de vêtement et les tentatives intermédiaires sont séparées dans les preuves. Chaque nouveau PNG est identique, par SHA-256, à sa sortie générée. L’intégration ne retouche, ne redimensionne et ne découpe aucun pixel.

Le visage, la coiffure, la silhouette et le cadrage ont fait l’objet de revues visuelles enregistrées. Cela ne certifie pas une reproduction canonique intégrale 1:1. Les références partielles ne prouvent pas les parties masquées du corps ou du costume. Les figures anonymes gardent leurs identifiants descriptifs et aucun personnage jouable supplémentaire n’est créé.

Les variantes provenant de planches monochromes sont signalées comme telles. Une faible teinte résiduelle d’un rendu généré ne prouve aucune palette officielle ; aucune nouvelle couleur canonique n’est revendiquée.

## États non résolus

Les demandes interrompues sans fichier accepté sont indiquées comme interrompues. Les refus et sorties à corriger ne sont pas comptés comme livrés. La présence d’une autre variante de la même famille est documentée pour éviter de répéter à tort que cette famille est absente.

Les manques d’uniformes scolaires attestés, les attributions OVA incertaines et l’absence de référence exploitable pour Miyuki demeurent visibles dans le manifeste. Aucune tenue inventée n’est transformée en preuve officielle.

## Validation

Le script de récupération vérifie unicité des identifiants et chemins, concordance des SHA-256, provenance des entrées, format PNG RGBA, transparence, dimensions natives, marges visibles et conservation des 197 entrées initiales. Les tests du jeu, le contrôle navigateur et le statut GitHub sont consignés séparément pour la tête effectivement publiée.
