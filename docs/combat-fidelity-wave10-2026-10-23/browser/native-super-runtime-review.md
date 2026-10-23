La dernière passe est verte : **240 fixtures moteurs/rendu** (40 personnages ×3 modes ×2 camps), **34 vols physiques Fighter** (17 personnages ×2 camps) et **102 captures** départ/vol/impact. Le rapport native-super-runtime.json contient passed=true, aucun échec de page et22 empreintes de sources/métadonnées identiques avant/après. La police Google indisponible via le tunnel réseau est consignée séparément ; les images utilisées sont décodées avec Image.decode.

| Contrôle | Résultat |
| --- | --- |
| Corps au moment de l’impact |234 crops dédiés native32, colonne2 |
| Janine |6 replis adapted-existing-pose sur ses24 poses acceptées ; aucune fausse phase super/finale ni base16 |
| Coût et répétition |100%, refus à99%, aucun second engagement ni effet rejoué |
|15 supers de soutien |Garde/buff réel, aucun dégât ennemi |
|17 supers à projectile |34 départs depuis l’orifice physique mesuré, aucun dégât avant collision |
| Pause et direction |Horloge d’action/vol figée ; garde selon direction entrante conservée après croisement du propriétaire |
| Impact |Un seul contact accepté ; effet fixé au point mémorisé après déplacement/KO de la cible |
| Lecture seule |Dessins et captures ne modifient ni PV, ni acteurs, ni files, ni projectiles |

Les quatre planches native-super-runtime-part-{a,b,c,d}-review.png ont été relues, ainsi que les trois planches native-super-projectile-{a,b,c}-review.png. Les corps, équipements et sensJ1/J2 sont visibles au départ et à l’impact. Pendant le vol la caméra suit la vraie position du projectile ; le propriétaire a délibérément traversé la cible pour éprouver la direction entrante et peut être hors champ. À l’impact l’action peut être terminée : son corps utilise alors la vraie base16, sans inventer une nouvelle pose native de super. Les102 captures comprennent68 crops native32 et34 crops base16 ; toutes viennent des vrais PNG et méthodes de rendu.

Le contrôle Node distinct passe **27/27** dans ../native-super-runtime.log : les40 supers sur trois moteurs/deux camps, ratés (portée, direction, hauteur, mort, invulnérabilité/garde), annulation, pause, position de collision, projection par rangée/phase/facing et pixels centraux des103 orifices actifs. Il inclut412 projections actives et836 points inactifs, ainsi que le repli explicite Janine.

Les premiers résultats sont préservés sous *-initial.json/log/png. L’audit initial native-aperture-before-fix.json documente neuf ancres A/C hors pixels, puis remesurées par leurs propriétaires avant cette passe. Le premier ajout de captures appelait drawPersonalSuper après expiration de l’action ; cette erreur du harness a été corrigée pour respecter la même garde que FighterMode, sans modifier la production. Son diagnostic exact est conservé dans native-super-runtime-capture-harness-failure.json. Les semelles Nick corrigées n’ont modifié que sa rangée super ; les sept autres rangées sont identiques RGBA.

Cette preuve emploie les vrais moteurs importés par les URL Vite exactes des composants, avec pas de simulation contrôlés. Elle ne revendique aucun parcours clavier UI. Les sprites/chorégraphies sont des adaptations dessinées ; source1to1Verified reste false.
