La passe finale, exécutée après le dernier gel production incluant la correction des deux PNG de Lilith, les trois identités de repli clonées et la suppression du feedback projectile sur les actions ordinaires bénéfiques W11, passe **28 tests Node**, **240 fixtures moteurs/rendu** (40 personnages × 3 modes × 2 camps) et **26 vols physiques Fighter**. Les 78 captures départ/vol/impact sont regroupées dans native-super-projectile-grid.png. Les 100 empreintes de code, registres et PNG sont identiques avant/après cette passe ; aucun fichier de production n’a été modifié par ces contrôles. Les navigateurs sont fermés.

| Contrôle | Résultat |
| --- | --- |
| Corps au moment de l’impact | 222 crops native32 dédiés, colonne2 ; 18 replis historiques explicites |
| Trois générations refusées | Harry, Hermione et Snape sans nouvel atlas ni phase native ; Hermione et Snape emploient les poses calmes déclarées, Snape colonne0 |
| Coût et répétition | Refus à99%, coût100% payé une fois ; aucun engagement ou effet rejoué |
| 17 soutiens / 23 attaques | 102 fixtures de soutien sans dégâts ennemis ; 138 fixtures offensives avec contacts acceptés |
| 13 projectiles | 24 départs depuis des orifices natifs mesurés ; 2 Harry depuis l’origine historique x±58/y−64, sans fausse ancre native |
| Pause et garde | Action/vol figés ; direction entrante conservée après croisement du propriétaire |
| Collision et mémoire | Aucun dégât avant collision, un impact accepté, point visuel conservé après déplacement et KO de la cible |
| Ratés et annulation | Portée, direction, hauteur, cible morte, invulnérabilité/garde et interruption contrôlées dans les moteurs |
| Deux attaques de zone | Dumbledore et Lilith sans faux trait balistique ; feedback cible uniquement après contact confirmé |
| Lecture seule | Rendu répété et captures sans modification des PV, acteurs, files, horloges ou projectiles |

Les quatre planches native-super-runtime-part-{a,b,c,d}-review.png et la planche des projectiles ont été relues visuellement. Les 78 captures comprennent 48 crops native32, 24 crops base16 et6 crops historiques Harry. Le corps et son équipement sont visibles au départ ; pendant le vol la caméra suit la position physique du projectile. Le propriétaire traverse volontairement la cible pour tester la direction entrante et peut alors être hors champ. À l’impact son action peut être achevée et sa vraie base16 prend le relais. Aucune pose supplémentaire n’est comptée.

Les tests Node vérifient également les centres alpha>24 et ROI9×9 visibles des 58 ouvertures actives, soit232 projections avec phase/rangée/facing/échelle, et952 points inactifs. Ils vérifient que les trois personnages bloqués exposent toujours une phase native nulle. L’unique requête échouée est la police Google indisponible via le tunnel, consignée dans le rapport ; tous les PNG utilisés sont décodés avec Image.decode.

Les passes intermédiaires vertes sont préservées sous ../initial-runtime-before-support-routing/, ../intermediate-runtime-before-clone-routing/ et ../before-support-projectile-fix/ et ../before-lilith-native-correction/. La passe finale a été relancée après la correction du routage des actions ordinaires de soutien vers les gestes calmes, puis des trois identités historiques clonées et du retrait de la particule laser_line des actions ordinaires bénéfiques W11. Les groupesA/B/D et la planche des projectiles sont identiques SHA à la passe avant correction de Lilith. Le groupeC, le détail native-super-runtime-lilith-final-review.png et les deux PNG corrigés ont été relus après correction ; seuls les deux PNG de Lilith et leurs deux registresC ont changé parmi les100 entrées suivies, sans modification des mécaniques JS. Cette preuve importe les vrais moteurs par les URL Vite exactes des composants, avec des pas de simulation contrôlés. Elle ne revendique aucun parcours clavier UI. Les gestes, sprites et mécanismes restent des adaptations : source1to1Verified=false.
