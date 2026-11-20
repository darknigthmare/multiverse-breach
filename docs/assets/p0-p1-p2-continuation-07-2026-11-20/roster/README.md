# Quarante techniques des adversaires ordinaires

Le RPG remplace le tir secondaire générique de 40 menaces des campagnes originales par des commandes liées à leur arme et à leur signature. Huit univers fournissent cinq acteurs chacun. L’éligibilité vérifie l’identité, l’univers et la signature du registre. Les commandes fournies par un combat custom ou un scénario restent prioritaires. Les 160 profils des autres actions ont été comparés sur les mêmes acteurs. [Comparaison par acteur](actors-reviewed.json) · [Signatures de campagne](../../../../src/game/originalUniversesManifest.json) · [Registre RPG](../../../../src/game/originalCampaignEnemyActions.js)

| Effets ajoutés aux commandes secondaires | Acteurs | Exemples joués |
| --- | ---: | --- |
| Dégâts | 30 | La Matraque pneumatique frappe au contact, le Rayon réfracté touche en ligne et la Mite irradie les cibles proches. L’explosion du Molosse se centre sur la cible choisie. |
| Protection | 6 | Le Shabti protège un allié choisi et l’Automate de la défense civile protège son groupe proche. |
| Soin | 2 | Le Serviteur domestique soigne ses alliés blessés à portée. L’Automate de tranchée répare l’allié choisi. |
| Renfort | 2 | Le Prêtre d’Isfet et le Cultiste lié au sel augmentent l’attaque des alliés proches. |

Les tests montent chacun des 40 acteurs dans le moteur RPG, ouvrent la sélection J2 et vérifient les cibles, le coût et l’impact. En campagne, le CPU déclenche aussi la garde du Légionnaire et la réparation du Serviteur. Le plafond d’irradiation limite le soin et déclenche le repli du CPU vers son attaque de base si la réparation devient impossible. [Tests moteur](../../../../scripts/originalCampaignEnemyActions.test.mjs)

Les deux essais Chromium chargent les planches originales. Au clavier sur ordinateur, la Mite irradie les deux héros affichés et épargne le troisième. Au tactile sur mobile, le Serviteur rend les **18 PV annoncés** au Radglass Mutant irradié, qui atteint son plafond de 58 PV. Aucun des deux parcours ne produit d’erreur JavaScript. Certaines icônes de consommables n’étaient pas disponibles dans le checkout de test. [Mesures du jeu](verification.json)

Les 40 clés figurent déjà dans les lots précédents pour la revue des fiches ou des poses. Ce passage couvre leur commande secondaire. Les phases avancées des fiches, comme la réflexion des rayons, les chaînes d’explosion ou la réécriture d’objectifs, restent au suivi. Les états et dessins dédiés restent à valider dans les modes concernés. [Reçu](verification.json)
