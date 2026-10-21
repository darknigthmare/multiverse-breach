# PR 5 — véritables supers de contact dans Fighter

Base exacte : `ce225b4e24a5f99820a0eaaecf2854ed52fd1fe9`, tree
`bea06789c7e7f9a687b4714dff56624e5d6d35f8`. 903 fichiers source/manifests
comparés à leurs blobs Git, sans écart ; le snapshot local ne contient pas tous
les bitmaps. Aucun compte ou sauvegarde réelle utilisé.

## Défaut reproduit

Six tests échouent sur la base, des deux côtés du combat : Beat Rush est
utilisable à l'autre bout de l'arène, Omnislash produit un seul impact générique,
et Rasengan frappe malgré une sortie de portée pendant sa préparation.
Le moteur employait le même super de portée écran pour ces attaques.

## Intégration

39 profils de contact **déjà existants** ont maintenant un adaptateur Fighter
explicite, listé dans `FIGHTER_MELEE_SIGNATURE_KEYS`. Leurs noms, portées et
nombres de contacts viennent du registre source. Aucun ajout par similarité de
nom ou simple appartenance à une franchise, aucun déblocage de personnage.

Cela inclut les profils concernés de FFVII/VIII, Naruto, Star Wars, Resident
Evil, Predator, Halo, Half-Life, Doom, Quake et Hexen. Les entrées ennemies sont
validées au moteur ; cette passe ne les ajoute pas au sélecteur de héros.

- Coût natif : 100, engagé une fois. Refus sans dépense hors portée ou pendant
  les verrouillages. Une action engagée puis esquivée/interrompue n'est pas
  remboursée.
- Duel Fighter : **un adversaire actif confirmé**, jamais les réservistes.
  Même Omnislash, dont la répartition RPG est aléatoire, suit cet adversaire
  unique dans ce mode. Aucune téléportation de l'attaquant ou de la victime.
- Préparation de 0,45 seconde et récupération de 0,47 seconde propres à Fighter ;
  intervalle des contacts issu du profil source, en temps de jeu actif.
- Omnislash : quinze contacts ; Renzokuken : huit. Chaque contact revérifie
  portée, hauteur, orientation fixée au lancement et invulnérabilité native.
  Un contact manqué n'est pas redistribué sur une autre cible.
- Budget offensif Fighter conservé : base totale 43, répartie après défense,
  difficulté et garde. Le minimum natif de dégâts n'est pas répété quinze fois.
  Les dixièmes sont répartis pour conserver exactement le budget à défense
  constante. Les défenses, buffs, PV et positions restent dynamiques.
- Pression sur la garde répartie, projection finale seulement. Les impacts
  intermédiaires n'éjectent pas leur propre victime hors du combo. La garde
  et sa rupture restent gérées par le vrai répartiteur de dégâts.
- Identité, camp, incarnation, compétence, génération de vie et objet d'action
  sont suivis. KO/résurrection immédiate, remplacement aller-retour, changement
  de compétence ou interruption ne permettent pas de récupérer une ancienne
  séquence. Pause/gel d'impact suspendent l'exécution ; fin et démontage nettoient.
- Plans en WeakMap : diagnostics d'acteurs toujours sérialisables, aucune
  référence circulaire introduite. Catalogue et profils Fighter personnalisés
  préservés. L'IA, les boutons et les touches utilisent `canUseSuper` commun.
- Codex FR/EN : indique la portée fonctionnelle de l'adaptation Fighter et ses
  limites, sans changer les profils RPG, Smash et Tactics.

Les invocations, projectiles, Smart Disc, Wraithverge, soins et protections ne
sont pas transformés en frappes de contact. Aucun nouveau profil source, move
set complet, bitmap, animation ou certification visuelle/canonique 1:1.

## Validation locale

- Six échecs reproduits sur la base, puis six succès après intégration.
- 133 nouveaux tests et sous-tests, dont les 39 identités sur les deux camps.
  Couverture supplémentaire : budgets normaux/minimaux, garde, hauteur,
  orientation, immunité, coût, pause, gel d'impact, interruption, changement de
  vie/équipe/incarnation, réserve, personnalisation et exécution par la vraie
  boucle temporelle. Codex et absence de mutation du catalogue vérifiés.
- `npm run test:reaudit` : 587/587 ; groupe signatures : 940/940.
- Lint ciblé sans erreur/avertissement. Compilation Vite des sources réussie,
  avec les avertissements préexistants de taille des blocs.
- Les quatre recettes Chromium locales sont bloquées dès la navigation par
  `ERR_BLOCKED_BY_ADMINISTRATOR`. Aucun succès navigateur local revendiqué.
  Les recettes permanentes ajoutées à la CI feront foi sur le commit publié.

Les groupes se recouvrent, ne pas les additionner. Pas de tests ignorés dans
les suites Node citées. Le prébuild complet avec images reste une vérification
séparée en CI, pas une conséquence du build Vite local.

## Recettes navigateur et limites

Quatre situations avec les vrais FighterMode/moteur/commandes, FR/EN,
390/1280 px, P1/P2 : Cloud, Squall, Tifa et Naruto. Chaque recette contrôle
le refus à distance, le lancement clavier ou bouton, une pause pendant la
préparation, tous les contacts, les PV et le score, puis une retraite déclenchée
par les vraies touches adverses. Le stockage reste inchangé, le démontage
n'accorde pas de récompense de campagne. Les données initiales sont préparées,
pas une campagne jouée ni un test sur téléphone physique.

Les rendus utilisent les sprites et particules existants, sans nouvelle
chorégraphie source. Les portées sont en unités d'arène, pas en mètres réels.
Les écritures externes qui changent puis restaurent un objet sans passer par
une transition du moteur ne peuvent pas être détectées rétroactivement.
Aucun merge, promotion de production, réglage administratif, compte, SQL ou
secret modifié. Le transport de patch reste sur une branche temporaire isolée,
absente de l'arbre et de l'ascendance de la PR.
