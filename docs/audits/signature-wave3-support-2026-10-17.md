# Vague 3 — soutien Medic et huit identités supplémentaires

Base de cette passe : `b06349d9d1c48b50e5d8ea34146accd373be5d3a`, branche de la PR 2.
Aucun merge, aucune sauvegarde ou donnée de compte modifiée. Aucun nouveau bitmap.

## Huit profils

- Medic TF2 : l’ancienne `ÜberCharge` offensive générique devient une protection liée, pas une attaque de zone. Medi Gun standard uniquement ; Kritzkrieg, Quick-Fix et Vaccinator refusés.
- Dog : coup mécanique rapproché. Son attaque de base générique au fusil est corrigée si elle n’a pas été personnalisée ; les profils personnels sont préservés.
- Hicks : coup de fusil à pompe ; Hudson : rafale de fusil à impulsion ; Vasquez : balayage au smartgun. Associations explicites à leurs IDs Aliens, pas à toutes les incarnations.
- Makron Quake II : famille hyperblaster, limitée à l’ID et à la continuité Quake II 1997. Ce n’est pas une implémentation du combat complet Jorg/Makron.
- Pinky classique : morsure ; Centaur Hexen : coup d’épée. Ni projectile inventé, ni reflection de bouclier annoncée comme implémentée.

## Protection stock-Medi-Gun

Une activation réserve une seule fois 100 % de jauge spéciale, et une ATB pleine en RPG. Après manifestation, le Medic et une seule cible alliée sont protégés contre les impacts transmis par un combattant du roster au répartiteur de dégâts. La protection dure 480 ticks de gameplay (huit secondes à 60 Hz), pas huit secondes d’horloge murale. Pause, attente de ciblage et scène cinématique suspendent cette durée.

La protection ne soigne pas, ne ressuscite pas, n’attribue pas de critiques, ne consomme pas les boucliers existants et ne donne pas d’immunité au recul. Une troisième unité reste vulnérable. Les dégâts directs de statuts, dégâts du monde, chutes et scripts extérieurs au répartiteur restent autoritaires. Les événements qui emploient un attaquant synthétique hors roster ne sont pas bloqués : ce périmètre est volontairement explicite, pas une invulnérabilité source intégrale.

La cible est choisie manuellement en RPG ; en Smash, un équipier admissible proche est préféré au Medic lui-même. Sans équipier à portée, l’auto-protection reste possible. La portée de 320 pixels est un réglage Nexus ; le lien est définitivement détaché lorsque le patient meurt, quitte son camp/roster ou dépasse la portée. Un retour en portée, une résurrection ou un nouvel allié ne réattribue pas silencieusement le lien. Le Medic conserve sa propre protection restante.

Mort du Medic, changement d’identité, d’univers, d’arme ou d’action, fin de combat et démontage annulent son lien. Une attaque dommageable du Medic le termine avant d’infliger ses dégâts ; elle ne supprime pas une protection appartenant à un autre Medic. Une seconde activation ne prolonge pas gratuitement la première.

L’aperçu RPG indique zéro dégât sur une cible protégée, sans consommer l’effet. Le panneau décrit les règles avant confirmation. Une ligne, des anneaux et la durée restante sont dessinés autour des acteurs réels ; aucun nouveau modèle ou animation 1:1 de Medi Gun n’est livré.

## Sources et adaptation

Les URLs du registre `signatureSourceWave3.js` renvoient aux implémentations Valve du Medi Gun et de Dog, au Makron d’id Software, au code Doom, à l’implémentation Hexen issue de Raven dans Chocolate Doom, et à la représentation sous licence Super7 des armes d’Aliens. Le code Valve sépare les types de charge et fixe par défaut une décharge stock de huit secondes. Ces sources ne certifient pas nos distances, contacts, animations ou équilibrages.

Ne pas appeler cela un kit Medic complet : absence d’overheal, soin continu complet, économie de charge TF2, changement/maintien de patients (« flashing »), règles de capture et comportement de toutes les armes alternatives. Les attaques secondaires historiques non traitées restent à compléter. Pas d’IA autonome d’invocation ni d’animation source certifiée dans cette vague. Aucun `canonicalFidelityApproved=true`.

## Validation et conservation des anciens contrôles

Localement : 62 nouveaux tests/sous-tests de vague 3 ; groupe de 513 tests exécutés avec `signatureCombat`, `signatureExpansion`, `signatureWave2`, `signatureWave3`, tous réussis ; zéro erreur et zéro avertissement de lint ciblé. La copie locale reste partielle : elle ne prouve ni la compilation intégrale du jeu ni la disponibilité de toutes les images.

La matrice existante continue d’exécuter tous les profils dans les deux moteurs et des deux côtés ; elle vérifie désormais aussi un effet `guard` non dommageable. Le test des 88 anciens profils conserve ce sous-ensemble exact, sans interdire l’extension du registre. Medic et Makron quittent les anciennes assertions « non implémenté » avec de nouvelles assertions de soutien non dommageable et de continuité ; les boss à énigmes restent exclus.

Dix recettes Chromium supplémentaires sont intégrées à la CI permanente : Medic P1/P2 dans les deux modes, liaison à Soldier et exclusion du troisième allié, pause, perte de portée, démontage ; Dog RPG, Vasquez Smash, Makron RPG P2, Hicks Smash, Pinky Smash P2 et Centaur RPG P2. Ces scénarios sont des états synthétiques dans une entrée QA isolée avec les vrais composants et moteurs. Les scripts ne visitent que le serveur loopback ; aucun compte, email ou déploiement réel n’est utilisé.

Les résultats distants et hashes du commit publié doivent être consultés dans les artefacts de la CI correspondante et le corps de PR mis à jour. Les succès locaux ne sont pas une extrapolation de ces résultats.

## Couverture

L’inventaire v4 ajoute `sourceEffect`, `sourceProtection`, `sourceDurationTicks` et un compteur séparé de soutiens durables. Un super de protection n’est pas une attaque offensive ni une invocation de créature. Les catégories de capacité se recoupent ; le nombre de manquants doit être recalculé, pas diminué arbitrairement de huit (plusieurs Marines disposaient déjà d’un artefact associé).
