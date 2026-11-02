# Invocations et renforts RPG W16

Sept atlas transparents ajoutent **112 dessins natifs distincts** : quatre arrivées, quatre préparations, quatre attaques et quatre récupérations par sujet. Les originaux, arguments effectifs, prompts et reçus sont archivés. Les 55 atlas RPG précédents restent inchangés.

| Appelant | Sujet et version retenue | Action |
| --- | --- | --- |
| Coco | Crash, *Warped* (1998) | Spin physique |
| Cuphead | Mugman, *Cuphead* (2017) | Super Art II, invulnérabilité de 4,85 s |
| Spike | Faye, anime *Cowboy Bebop* (1998) | Glock 30 tenu en main |
| Edward | Alphonse, *Brotherhood* (2009) | Poing de l’armure |
| Raven | Starfire, série *Teen Titans* (2003) | Starbolt vert depuis la paume |
| Sarah Briggs | BT-7274, *Titanfall 2* (2016), Expedition | Tir du XO-16 tenu à deux bras |
| Aki | Fox Devil, anime *Chainsaw Man* (2022) | Tête distincte et morsure Kon |

Le plan initial est conservé dans [source-plan.json](source-plan.json). La durée de Mugman a été corrigée **avant sa génération**, avec la citation de 4,85 secondes après l’animation dans [source-plan-errata.json](source-plan-errata.json). Dans l’œuvre, cette protection est personnelle. Son relais vers Cuphead uniquement est une adaptation déclarée : aucun dégât, soin ou bonus offensif.

Robin a produit un véritable refus de génération RPG. Le [reçu brut](../rpg-tool-receipts/robin-error-verbatim.json) est conservé, sans nouvelle tentative. Starfire est une identité distincte autorisée par un [plan complémentaire](source-plan-complement-starfire.json) fixé avant son premier appel. Ce refus RPG ne constitue pas un refus d’un atlas natif 32 poses jamais demandé. Au total : huit appels réels, sept images acceptées et un refus sans image.

Le packing ne redessine pas les personnages : segmentation par transparence, découpe et redimensionnement uniforme au plus proche voisin. La même échelle est employée pour les seize poses d’un sujet. Les cellules rectangulaires gardent les armes et membres entiers. BT conserve un rapport de hauteur de 570 contre 190 pour une humaine, grâce à la compensation de l’échelle de packing dans la chorégraphie.

Les [36 ancrages anatomiques](native-contact-anchor-selections.json) ont été mesurés et réellement inspectés sur des grilles et des zooms : gants, poing d’armure, canons, paume et seize positions de bouche du Fox Devil. Au contact accepté, la projection visuelle du poing ou de la bouche rejoint le point cible figé. Les émissions à distance commencent sur la pose d’attaque 2 ; les phases précédentes n’inventent pas de projectile. Les coûts, collisions, protections et événements de jeu restent résolus par le moteur.

Ces images sont des adaptations nouvellement dessinées, avec des choix de timing et de relais explicités. Elles ne sont pas des images officielles ni une certification de fidélité 1:1 ; les indicateurs `source1to1Verified` et `canon1to1Verified` restent à `false`. La vérification de l’art dans [summon-artwork-verification.json](../summon-artwork-verification.json) est distincte des preuves SSR et GameCanvas, et des contrôles finaux après gel des fichiers de production.
