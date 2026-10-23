# Vague9 — Part B Mass Effect

Cinq présentations32 et cinq bases16 : **10 PNG / 240 poses natives distinctes**. Dix appels image_gen réels ont tous retourné une source, sans correction native ni refus. Tous les originaux, arguments exacts, références inspectées, prompts et SHA sont archivés. Modèle, génération et job inconnus restent null.

Versions : Shepard masculin par défaut ME2(2010), Soldier N7/M-8 Avenger ; Garrus ME2 recruté et marqué, armure bleue et visor gauche/M-92 Mantis ; Liara DLC Lair of the Shadow Broker2010 blanc/bleu, pistolet M-3 Predator et vraies biotiques ; Tali ME2 en combinaison violette scellée/M-23 Katana et drone technique natif ; Wrex ME1(2007), massif Krogan en armure rouge.

Shepard et Garrus utilisent Concussive Shot monocible. Adrenaline Rush est une adaptation explicite en buff personnel borné, sans ralentissement global. Liara emploie Warp et Singularity, sans Data Storm. Le drone natif de Tali est une projection technique sphérique violette, pas un alien synthétisé par le renderer ; son choc Attack Drone reste ciblé, distinct de la destruction Explosive Drone. Barrier de Wrex protège seulement Wrex : zéro dégâts, soin ou bouclier de groupe. Les autres personnages Mass Effect appellent le véritable Soldier Shepard et son tir, sans recevoir sa classe ni un buff personnel.

Les sources32 mesurent887×1774, les sources16 1254×1254. Sharp effectue seulement extraction alpha, découpe, redimensionnement uniforme, transparence et packing. Les PNG finaux sont RGBA1024×2048/1024×1024, cellules256², marge10, baseline244. Aucun corps, arme, main ou pose n’est dessiné par script. Toutes les séparations gardent les pixels opaques ; les rares pixels semi-transparents de traînée sur seam sont consignés dans les mesures.

Les60 ROI mesurées de corps excluent armes, flashs, drone et champs biotiques. Un seul facteur par source calibre un corps debout à190px ; genoux fléchis, course digitigrade et recul conservent leurs proportions natives. Le rapport de densité887/1254 est explicitement retenu. Les contacts calibrated-first-cells montrent exactement la projection appliquée par row.renderScale.

Les points d’émission sont mesurés dans les cellules natives normalisées avant renderScale : bouche physique des armes, paume de Liara et foyer du drone. Les poses sans émission sont null. Une première sérialisation en tableaux xy était incompatible avec le contrat runtime ; le fichier source de mesures et le builder régénèrent désormais les objets {x,y} et --check refuse les tableaux. Coordonnées et PNG inchangés. Annotation entière à précision visuelle1–2px, pas coordonnées officielles du jeu source.

Les sources effectivement ouvertes et leurs courts extraits sont dans part-b-source-facts.json, séparés des échecs réseau et résultats seulement indexés. Les limites mécaniques sont explicites : pas de reproduction complète du time-dilation original, de physique persistante de Singularity ou de l’IA du drone. Fidélité globale/frames1:1 non certifiée.

| Personnage | Poses | Dimensions | SHA256 |
|---|---:|---|---|
| shepard | 32 | 1024×2048 | d23f840cbafcbd365896e90f433511832b7aaa591e93946d19608d5ad90f0ed2 |
| garrus | 32 | 1024×2048 | d277069c5206870cb2757e86179353c4eea5e7f6cd2a7f0875066d6ae5743042 |
| liara | 32 | 1024×2048 | f6ec455eb1482eb45c398110f812b74c0a5c85434475588067bb7d469e23a86a |
| tali | 32 | 1024×2048 | 8a6332a16eeb184029b02984453f42f23e270373dc55e14bdb1cedfe23c51e90 |
| wrex | 32 | 1024×2048 | 762219fcd9e397847de76fd13c7c10571098fbf215a3967beaafe0ad7e54893c |
| shepard | 16 | 1024×1024 | 90f7e39c957e58146786b0550bb8dd156689401eeffd3ebae9d63ad064bc88ba |
| garrus | 16 | 1024×1024 | a088ac9a27421c0ace756122bcb414216b9f77a379258f9c402248cfde579607 |
| liara | 16 | 1024×1024 | af004a9ad729bef072cfde3e0dafe55964165781fa8d7faabd578a94dacb6ed7 |
| tali | 16 | 1024×1024 | f7f3f558ed73695388efb300da33e63dde51c93f782a54a2d6944fbd16daaf66 |
| wrex | 16 | 1024×1024 | d45e32a21aeada37fb49e3fc672a3273c52e4a2c6575a7b44a3dfe0b7cea0e79 |

Les deux builders --check reconstruisent exactement les PNG à partir des rangées natives et contrôlent marges, poses, métadonnées et sources. Aucun ancien PNG, catalogue partagé, moteur ou package n’a été édité par ce lot. Les tests des renforts et le parcours navigateur sont archivés séparément.
