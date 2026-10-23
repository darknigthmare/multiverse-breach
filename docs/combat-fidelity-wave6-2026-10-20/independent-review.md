# Revue indépendante Wave6 — 20 octobre2026

Portée :15 kits et supers, `abilitiesWave6.js`, types d’arme, présentations, effets natifs, dessin des nouvelles bases et sélection stricte des animations d’invocation. Lecture du code et reproductions ponctuelles via ViteSSR ; aucun nouvel art. Les collisions et chronologies détaillées restent couvertes par les autres suites Wave6.

## Défaut corrigé : Otacon CPU infligeait un coup générique

**Avant :** en Smash custom CPU avec `singleRoster:true`, Cloud à x200 et Otacon à x240 au sol, états idle, cooldown et jauge CPU à0, un update déclenchait la branche ennemie historique. Reproduction observée : Cloud105→94PV, Otacon `state:'attack'`, `action:null`, +10jauge, sons slash/hit. Le montant varie légèrement avec l’aléa normal des dégâts. Le simple résolu était pourtant `Codec Support Ping / buff / ally / dmg0`.

**Après :** cette seule branche consulte le simple authored d’un roster custom. Un effet autre que damage démarre avec `triggerAuthoredMeleeAbility` ; un démarrage refusé ne retombe jamais sur un coup offensif. Otacon engage une vraie action temporisée, garde les PV adverses inchangés et applique son buff1,08 à son camp au moment de l’impact. Un impact répété n’attribue ni second effet ni seconde récompense de jauge.

Les attaques damage CPU historiques gardent leur routage, leurs PV, leur récupération et leur cooldown. Le spread de `template.defense` dans la copie P2 est conservé. Aucun rôle ou type d’arme global supplémentaire n’a été modifié.

Validation initiale : `node --test --test-concurrency=1 scripts/meleeSupportCpuWave6.test.mjs scripts/engineSmashSuper.test.mjs scripts/meleeCombatRuntime.test.mjs` — **23/23 passés**. Les quatre régressions de soutien couvrent soutien CPU, camps joueur/P2 et copies d’identité, garde de Snake préservée, attaque damage voisine inchangée à variance fixée, unicité de l’impact/jauge/cooldown et pause via l’horloge de production. Après la correction audio ci-dessous, `node --test scripts/meleeSupportCpuWave6.test.mjs` passe **5/5**, dont le nouveau groupe de trois reproductions audio. Test et rapport figés après cette validation.

## Défaut audio corrigé : son de tir de trois CPU

Avant, Knuckles, Giorno et Joseph CPU custom jouaient `shoot` lors du coup de contact historique. Les champs bruts sont respectivement `weapon:'gun'/'laser'/'gun'`, tandis que `weaponType:'melee'` est corrigé. La branche ennemie offensive lisait encore `e.weapon` pour le son. Trois reproductions donnaient `['shoot','hit']` et `state:'attack'`, sans projectile créé.

La correction appliquée par sequences_fighter donne priorité à `e.weaponType || e.weapon` pour cette seule sélection audio. Le nouveau test groupé exécute un vrai update du moteur pour chacun des trois personnages : exactement `['slash','hit']`, aucun `shoot`, dégâts de contact effectifs, `action:null`, effectifs inchangés et seulement des particules d’impact text/spark. Aucun projectile ou effet laser n’est émis. Le routage offensif, les PV, l’IA et la physique restent inchangés.

Dans Fighter, `ranged` peut encore refléter un ancien `simple.type`, mais les15 actions authored remplacent les spécifications et la livraison au moment de l’engagement : cette valeur historique ne transforme pas leurs coups résolus en projectiles. Dans RPG, le fallback fondé sur `actor.weapon` ne s’applique pas à ces15 actions authored. Le rendu du personnage procédural utilise `weaponType`, et les nouveaux PNG montrent directement les armes.

## Cohérence des15 profils

Les15 noms de super et univers concordent entre `resolveMeleeSuper`, `presentationCatalogWave6` et `supportsNativeSuperWave6` ; aucun échec de résolution relevé.

| Personnage | Continuité retenue | Super et effet résolu |
|---|---|---|
| Sonic | SonicAdventure1, normal bleu | LightSpeedAttack, damage/melee |
| Tails | SonicAdventure2, Cyclone piloté | CyclonePowerLaser, damage/beam |
| Knuckles | SonicAdventure2 | ThunderArrow, damage/area |
| Jotaro | StardustCrusaders, Part3 | StarPlatinum—OraOra, damage/melee |
| Giorno | GoldenWind, Part5 | GoldExperience—MudaMuda, damage/melee |
| Joseph | StardustCrusaders, âgé | HermitPurple—Hamon, damage/melee |
| Dante | DevilMayCry5 | SinDevilTrigger—Judgement, damage/melee |
| Nero | Fin de DevilMayCry5 | DevilTrigger—Showdown, damage/melee |
| Lady | DevilMayCry3 | KalinaAnn, damage/projectile |
| Parasoul | Skullgirls2ndEncore | InfernoBrigade, damage/projectile |
| BigBand | Skullgirls2ndEncore | Super-SonicJazz, damage/melee |
| Beowulf | Skullgirls2ndEncore | ThreeWulfMoonsault, damage/melee |
| Snake | MetalGearSolid1998, adulte | Combo de coups de Snake, damage/melee |
| Raiden | MetalGearRisingRevengeance | ZandatsuOverdrive, damage/melee |
| Otacon | MGS1/MGS2, soutien technique | PhilanthropyUpload, buff/support |

Les trois actions d’Otacon simple/secondary/special sont des buffs alliés à multiplicateur de dégâts0 ; sa défense est guard/self. Les quatre profils RPG donnent exactement ces effets. Les commandes PhilanthropyUpload et MetalGearDataHack restent explicitement des libellés adaptés du projet, pas des armes canoniques ou une infection. Le soin secondaire de Giorno reste heal/support. Les profils JoJo n’ajoutent ni arrêt mécanique du temps ni Requiem ; les scènes de fin ne créent pas de règle d’exécution.

## Rendu et invocations

Les six nouvelles bases déclarent une baseline244 et leurs facteurs par rangée. `drawGeneratedSpriteSheet` applique le facteur au dessin de la cellule entière autour de cette baseline ; aucun recadrage supplémentaire n’est introduit par cette intégration. Le rendu dédié32 emploie le même principe. Les autres bases gardent leur fallback précédent. Sonic32 inclut sa référence rendue190px et conserve les rapports natifs des postures/roulades.

Vérification pure des quatre clés natives actuellement installées :

- FFVII::Ifrit::Hellfire : summon,3 appelants.
- FFVII::Shiva::DiamondDust : summon,2 appelants.
- JoJo::StarPlatinum::OraOra : summon,1 appelant.
- Sonic::Tails et le Tornado::TornadoMachineGun : reinforcement,1 appelant.

Les clés réelles emploient les noms d’univers et d’action complets du registre. Pour chaque clé, résolution positive avec son descripteur réel ; inverser summon/reinforcement, changer l’univers ou changer `entityRender.asset.key` renvoie null. Le Tornado physique ne devient donc pas une invocation surnaturelle. Le Cyclone et le Tornado sont deux actifs distincts.

## Limites constatées

Les fact-checks d’identité et les contrôles de dessin ne certifient pas une reproduction image par image des œuvres. La référence externe illustrée du Cyclone n’a pas pu être retenue : le connecteur ne transmettait qu’un marqueur d’image et l’archivage direct renvoyait403 ; les extraits textuels consultés sont détaillés dans `part-a-source-facts.json`. Les nouvelles postures/tempos et les échelles restent des adaptations explicites. Certaines poses natives ont une légère variation verticale des semelles par rapport au pivot commun ; le facteur de dessin conserve cette variation plutôt que déplacer individuellement les corps.
