# RPG et mécanismes source W17

Six nouveaux personnages de renfort disposent chacun d'un atlas natif16, quatre poses distinctes pour l'arrivée, la préparation, l'attaque et le retour. Les requêtes réellement envoyées, réponses, originaux et mesures anatomiques sont conservés ici. `source-plan.json` et son reçu ont été figés avant les appels. Le builder extrait uniquement les pixels RGBA natifs et les normalise sans repeindre les corps. `source1to1Verified` reste `false` : les dessins générés et les adaptations de combat ne sont pas des animations originales certifiées.

| Appelant | Performer et œuvre retenue | Mécanisme exécuté |
| --- | --- | --- |
| Pey'j | Jade, Beyond Good & Evil2003 | Contact physique du Daï-Jo ; aucune photographie offensive |
| Globox | Rayman, Legends2013 | Poing chargé à courte portée ; aucune boule d'énergie de Rayman2 |
| Sweet Autumn | Skye Autumn, Sanctum2/2013 | Fusil d'assaut tenu à deux mains, origine au canon mesuré |
| Momo | Okarun, anime saison1/2024 | Charge physique en forme Turbo Granny, sans rayon inventé |
| Cadence | Melody, Crypt of the NecroDancer | Vrai pas cardinal de Melody avant toute résonance de la Golden Lute |
| Scout ou Soldier | Un Medic allié déjà présent, Team Fortress2 | Activation de son vrai faisceau stock chargé,8 s d'ÜberCharge |

Jade appelle aussi le véritable ground pound des Jet Boots de Pey'j via ses ressources natives. La route Spyro→Sparx applique zéro dégât et zéro soin ; sa réduction de25 % pendant2s est explicitement une adaptation d'arène.

## Mouvement de Melody

`sourceMechanicsWave17.js` résout uniquement un déplacement cardinal accepté d'une case. Les voisins cardinaux du départ et de l'arrivée, au même niveau, reçoivent les contacts. Attaque immobile, diagonale, téléportation, saut, cible distante, allié ou Cadence tenant la lute d'une autre personne ne produisent aucun contact. Dans les arènes, une case représente64 unités de sol et le déclenchement rythmique est une adaptation ; Smash vérifie la plateforme réellement supportée et Fighter le sol réel. En Tactics, la transition porte les vrais identifiants de surface et la hauteur. L'invocation RPG déplace réellement le corps logique et visuel de Melody ; elle ne rejoue pas un impact générique à distance.

## Medi Gun stock

Le Medic et son patient doivent être deux alliés vivants, distincts, présents et connectés à portée220 unités d'arène. Le soin de base est24 HP/s, limité à150 % desHP maximaux. Le soin accéléré hors combat du jeu source n'est pas revendiqué. La charge avance seulement pendant un faisceau valide :2,5 %/s sous142,5 % de santé,1,25 %/s au-dessus. Une activation, un saut de temps système ou un patient absent ne créent aucune charge. La charge100 % exige donc au moins40 secondes de simulation connectée. L'ÜberCharge dure8secondes et protège uniquement ce Medic et son patient connecté. Mort, retrait, interruption, capture, changement d'arme ou rupture de portée retirent la protection. L'arène annule alors l'activation et dépense son reste de charge ; elle ne conserve pas gratuitement les secondes d'invulnérabilité inutilisées. Le surplus de santé décroît en15 secondes après rupture sans jamais soigner gratuitement un patient repassé sous son maximum.

Le faisceau normal part du canon natif32 col2 du Medi Gun mesuré par le sidecar PartB ; la cinématique utilise les mesures propres de ses quatre poses d'attaque RPG16. La ligne Syringe Gun du base16 n'est pas utilisée comme pose de soin. Le Medic déjà présent remplace son propre corps pendant la cinématique ; aucun second Medic ni bonus de dégâts n'est créé. La limite d'une invocation par appelant et combat est une règle RPG adaptée. Les horloges sont suspendues pendant la cinématique et la pause.

## Photographie, Gyrodisk et Okarun

La photographie de Jade révèle la cible sélectionnée pendant3s, sans dégâts, soin, garde ni multiplicateur d'attaque. Le Daï-Jo chargé utilise son profil de contact ; la caméra ne devient pas un projectile. Le Gyrodisk possède son propre atlas16, progresse sur l'horloge réelle et lance depuis le gant mesuré à la pose d'émission. Son rendu est un petit disque plat ; dommages reçus avant émission, mort, retrait et contrôle interrompent l'action sans frappe fantôme. Les attaques all-out d'Okarun marquées par le kit source sont limitées à deux engagements par combattant ; les quatre moteurs consultent le compteur avant d'engager le coût. Son invocation par Momo partage ce compteur si Okarun est dans l'équipe ; sinon le camp possède un compteur de renfort hors équipe de deux usages. Une prévisualisation ne modifie aucun compteur, et Momo ne devient jamais propriétaire biologique de sa transformation.

## Capture du chaton de Tail Concerto

Un seul corps de chaton est ajouté, hors cohorte des120 héros et hors six personnages RPG. Le manuel primaire USA, PDFpage21/numéro imprimé19, montre sa fourrure beige, ses yeux bleus, son gilet rouge, son sous-vêtement rayé, son pantalon vert, ses gants blancs et ses bottes bordeaux. Il précise que ces chatons courent, rient, se cachent et font des graffitis, sans attaquer en général. Le NPC a donc0attaque et ne récupère aucune arme d'un héros de fixture.

Le Police Robo de Waffle ne capture qu'un adversaire explicitement admissible ; les adversaires des autres univers restent inadmissibles par défaut. Le contrôle conserve le vrai corps, lesHP, la hauteur et le camp, sans proxy de commandes. Il dure1,25 s dans les arènes et RPG ou jusqu'au tour capturé en Tactics, adaptations annoncées. Mort/retrait de Waffle libère immédiatement. Les quatre poses de capture utilisent une horloge visuelle de simulation distincte de la durée d'autorité d'un tour ; les quatre poses de libération disposent de0,5 s. Idle et course lisent eux aussi le temps de simulation et restent gelés à la pause. Le builder vérifie les16 poses uniques ; les rapports navigateur distinguent les poses réellement observées de cette couverture d'assets.

## Vérification reproductible

Les tests `scripts/sourceMechanicsWave17.test.mjs`, `scripts/sourceBubbleCaptureWave17.test.mjs` et `scripts/sourceEngineWave17.test.mjs` importent les moteurs et modules de production. Les drivers `summon-wave17-browser.mjs` et `capture-npc/rpg-smash.browser.mjs` montent le vrai `GameCanvas`, utilisent les clics et touches des deux camps, puis observent les vrais ticks, coûts,HP et appelsCanvas. Ils ne remplacent pas les fonctions d'impact ni la validation des cibles. Les tentatives préliminaires échouées restent archivées avec leur erreur. Les rapports finaux exigent le gel de production du parent et l'égalité des empreintes avant/après ; seul un rapport final effectivement produit établit cette dernière étape.
