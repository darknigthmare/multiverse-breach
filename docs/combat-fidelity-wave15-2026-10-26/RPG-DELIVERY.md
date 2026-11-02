# Invocations RPG et actions de soutien W15

Les six nouveaux atlas d’invocation contiennent chacun seize dessins natifs distincts. Les sources, requêtes exactes, résultats de génération, sélections et exclusions sont archivés dans `summon-sources`, `summon-prompts`, `summon-tool-receipts`, `summon-provenance.json` et `summon-source-selection.json`. Le registre de production est `src/game/combat/summonAnimationsWave15.generated.json` et le constructeur reproductible est `scripts/buildSummonAnimationsWave15.mjs`.

| Appelant de la cohorte | Partenaire animé | Version et action retenues | Effet réel |
| --- | --- | --- | --- |
| Parias | Baratus | Hexen (1995), Timon’s Axe | Contact physique |
| Bitterman | Ranger | Quake (1996), hache initiale | Contact physique |
| Kiya | Sir Daniel Fortesque | MediEvil (1998), épée courte | Contact physique |
| Blaze | Axel | Streets of Rage 2 (1992), Grand Upper | Contact physique |
| Vortigaunt | Dog | Half-Life 2 (2004), bras mécaniques | Contact physique |
| Zach Hammond | Kendra Daniels | Dead Space (2008), diagnostic sur son pad | Renforcement sans dégâts |

Chaque relais reste dans son univers, avec un partenaire distinct de l’appelant. Il s’agit de coopérations de gameplay, sans prétendre qu’une alliance narrative existe entre toutes ces versions. La chorégraphie garde le grand gabarit de Dog et rapproche réellement les cinq partenaires physiques avant le contact accepté. Kendra ne reçoit ni arme ni attaque inventée.

Une source Cortana de seize dessins est conservée et entièrement exclue : aucun appelant retenu de cette cohorte ne sélectionne Cortana sans s’appeler elle-même. Les sept générations observées représentent donc 112 dessins, dont 96 retenus et 16 exclus. Adon n’a pas été demandé pour ce registre lorsque sa référence visuelle restait insuffisamment étayée. Les 49 atlas RPG antérieurs restent conservés ; le catalogue composé en contient 55.

Les tests SSR exécutent les six relais dans les deux camps : dix contacts offensifs et deux renforcements sans dégâts, avec contrôle des ressources, annulations, pauses, interruptions, contacts uniques et protection des cibles. La vérification navigateur utilise le vrai `GameCanvas`, les commandes visibles et les PNG décodés. Les rapports préliminaires portent explicitement ce statut ; les rapports finaux ne sont produits qu’après le gel de production et la vérification des empreintes avant/après.

## Phaselock et Healing Burst jouables

Maya utilise un contrôle ennemi sans dégâts : portée réelle 480, durée 2,4 secondes pour le super et 1,2 seconde pour la secondaire. Le contrôle suspend et interrompt temporairement la cible, puis expire avec l’horloge de simulation ; il ne crée pas de protection, ne modifie pas les PV et ne relance pas une action interrompue. Le moteur Tactics le traduit en un tour propre à la victime. Les cibles mortes, immunisées, invulnérables, déjà contrôlées ou hors conditions de portée/visibilité sont refusées selon le moteur.

Val déclenche le Healing Burst d’Evolve (2015) depuis son équipement médical : soin de groupe borné à 220 pixels, soi inclus, sans rayon Medgun. Les alliés éloignés ne reçoivent pas un soin à distance illimitée. Tactics traduit cette portée en deux cases et conserve la distance spatiale et la visibilité. La source initiale Medgun reçue pendant la correction est archivée et exclue ; la chronologie de l’erratum C indique honnêtement que la correction précède la génération corrective, et non toute génération de Val.

Le contrôle UI vérifie quatre parcours Phaselock et deux Healing Burst, avec sélection, annulation sans coût, confirmation, effet réel, pause, expiration et douze captures. Ses scènes placent explicitement Noble Six à moins de 480 pixels, Markov à moins de 220 et Maggie au-delà de 220. Certaines formations RPG ordinaires peuvent placer l’ennemi au-delà de la portée de Phaselock ; cette preuve ne démontre pas une approche automatique ni une portée illimitée.

Dans le Fighter, le projectile de Vortessence part de la vraie paume native levée et vise le torse adverse au moment du relâchement. Sa vitesse reste bornée et sa trajectoire se termine au rayon déclaré autour de la position initiale du lanceur. Une cible qui se déplace peut l’esquiver ; le projectile ne la suit pas. Les autres armes conservent leurs trajectoires précédentes.

Les poses produites sont des adaptations natives documentées, pas une certification de reproduction 1:1 des animations originales. Le relâchement des supers se cale sur la colonne 2 au `hitAt` de production ; les projectiles physiques Fighter utilisent leurs ancres mesurées. Les attaques ordinaires des atlas de base n’ont pas toutes un recalage individuel de leur flash sur le contact : cette limite reste ouverte et ne doit pas être présentée comme résolue par l’ajout des seize poses.
