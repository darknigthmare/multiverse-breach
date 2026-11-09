# Liquid Snake, Mistral et True Ogre : corrections des personnages existants

Ces trois héros utilisent désormais de nouveaux PNG transparents, avec seize poses par personnage et quatre rangées : repos, déplacement, attaque et recul. Le résolveur du jeu sélectionne les nouvelles planches dans ses différents contextes. Les anciens fichiers restent les témoins de leurs enregistrements historiques ; ils ne sont plus les sprites sélectionnés pour ces trois héros.

| Personnage et incarnation | Écart corrigé dans le sprite | Kit jouable corrigé |
| --- | --- | --- |
| Liquid Snake, duel final de Metal Gear Solid (1998) | Torse nu et poings nus ; manteau, lunettes, pistolet et effets verts supprimés | Coups de poing, coups de pied et contacts physiques ; aucun soutien du Hind D dans ce duel |
| Mistral, Metal Gear Rising: Revengeance (2013) | Bras articulés Dwarf Gekko et lance L’Étranger présents dans les seize poses | Frappes de lance et de bras articulés ; défense magnétique générique et pouvoirs de classe supprimés |
| True Ogre, Tekken 3 | Forme bestiale cornue et ailée, tête distincte du bras-serpent dans les seize poses ; ornements de guerrier inventés supprimés | Griffe, bras-serpent et contacts du corps ; aucun équipement ajouté |

Les actions offensives utilisent une présentation physique et un ciblage de contact monocible en RPG, Tactics et Smash. Les statistiques, dégâts, coûts et délais existants sont conservés. Les trois kits restent des adaptations des gestes décrits, sans reproduire toute la liste de coups ni leurs timings d’origine.

Les sources natives, demandes exactes et identifiants de génération restent privés. Le [manifeste public](corrected-canon-character-png-2026-10-02.json) contient les empreintes des fichiers, les mesures de la grille et la distinction entre une ancienne image fournie comme cible d’édition et une référence canonique indépendante. Les trois PNG installés sont RGBA 1024×1024, avec seize cellules non vides et distinctes et une marge visible minimale mesurée de quinze pixels. L’empaquetage utilise le normaliseur existant ; aucun corps ni équipement n’est dessiné par script.

La revue visuelle du résultat et une revue indépendante confirment ces améliorations. Aucune image canonique indépendante n’a pu être consultée pour cette correction. Les proportions, couleurs, détails et animations exacts restent à comparer aux sources originales ; **la fidélité 1:1 n’est pas certifiée**. Les liens de sources dans les kits sont des candidats, explicitement marqués comme non lus pour cette correction.

Validation locale : **101 tests ciblés passent**, dont 41 nouveaux tests et 27 exécutions des attaques dans les trois moteurs ; lint et compilation Vite passent. Le prébuild complet local a été arrêté par six erreurs `spawnSync ... EPERM` dans les tests de fichiers de déploiement : la sandbox interdit les sous-processus utilisés par leurs fixtures. Les assertions et les contrôles requis du projet restent actifs, y compris l’audit de ces trois PNG et les nouveaux tests dans le prébuild Vercel. Le succès local des 1 364 tests de la vague précédente reste une preuve de cette version précédente, pas de la présente correction.

Ces remplacements ne comblent pas de nouveaux chemins de boss ou d’ennemis : le bilan de la vague de 179 personnages conserve **1 526 chemins de personnages absents**, dont Pachakuti du Soleil Noir sans référence corporelle identifiable. Les **25 substitutions visuelles P0** du suivi antérieur restent ouvertes ; ces trois héros appartiennent à une revue supplémentaire. Les refus de génération déjà documentés restent des blocages, sans substitut déclaré fidèle.

La publication suit la branche de corrections et la PR en brouillon. Une URL Vercel READY ou un PNG techniquement valide ne constitue pas une approbation canonique ni une preuve de partie jouée en ligne.
