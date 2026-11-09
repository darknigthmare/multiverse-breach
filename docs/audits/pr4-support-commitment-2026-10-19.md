# PR 4 — soins différés et remplacements après KO

Base vérifiée : `ddaefe2a7d9ca9d04586fae96b2030b32427d795`.
880 fichiers sources et manifests du snapshot comparés à leurs blobs Git,
sans différence. Le snapshot ne contient pas tous les bitmaps du dépôt.

## Défauts reproduits et correction

### Tactics : ne pas transformer un soutien pendant sa préparation

L'IA conserve maintenant l'identité de la compétence choisie, ses paramètres
de jeu (effet, portée, cibles, puissance, soin, purification, durée, réduction,
ligne de vue et coût de recharge), le camp et l'identité source du lanceur,
ainsi que la génération de vie de chaque bénéficiaire confirmé.

Avant cette correction, remplacer `secondary` pendant ses 500 ms de préparation,
modifier sa puissance sur le même objet ou tuer puis ressusciter le patient
avant le pas suivant pouvait appliquer un autre soin. Une jauge `Infinity`
ou `'100'`, ou un cooldown `-Infinity` / `'0'` étaient aussi acceptés au moment
final malgré les validations numériques faites au choix initial.

Le soin devenu invalide ne s'applique pas et ne dépense ni recharge ni jauge.
Le déplacement déjà effectué n'est pas remboursé et le tour se termine selon
la règle précédente : pas de tour supplémentaire gratuit.

Les PV manquants, les buffs et la géométrie ne sont pas figés. Un soin valide
peut toujours récupérer seulement les PV qui manquent à l'impact. Les cibles
retirées ne sont pas remplacées ; une altération d'un autre allié non concerné
ne bloque pas le soin. Les compétences personnalisées restent utilisables.
Cette protection vise l'IA de soutien des deux camps, pas un nouveau moveset.

### Fighter : une entrée marquée morte n'est pas un remplaçant vivant

Les transitions de KO, les soins d'assistance/de terrain, la régénération de
réserve et les indications de roster partagent le prédicat d'un combattant
vivant. Modifier uniquement les PV ne retire plus son état mort via la mise
à jour passive. Une entrée morte est ignorée par le remplacement et ne compte
ni comme survivant ni dans l'avantage de santé au chronomètre.

Le remplaçant est identifié par son véritable emplacement dans l'équipe,
pas par un champ `index` périmé de l'acteur. Le remplacement automatique
fonctionne aussi lorsque le délai de KO atteint exactement zéro. Sans réserve
admissible, le résultat est produit sans attendre l'expiration des 99 secondes.

Le résolveur respecte la pause, le gel d'impact, l'introduction, la fermeture
et la fin du match ; il arrête de traiter l'autre camp après une fin terminale.
Il ne change pas la politique existante d'égalité/simultanéité et n'ajoute
aucune résurrection. Les états contradictoires sont des cas synthétiques
contrôlés, pas un incident observé sur une sauvegarde réelle de l'utilisateur.

## Tests et preuve locale

- Première série de 22 scénarios : **18 échecs sur la base**, puis **22/22**
  après correction. Les quatre autres scénarios sont des contrôles préservés.
- Extension finale : **60/60** nouveaux tests, sur les deux camps.
- `npm run test:reaudit` : **218/218**, sans test ignoré.
- Soutien/cycle de vie tactiques et contrôles Fighter existants : **143/143**.
- `scripts/signature*.test.mjs` : **940/940**.
- Lint des cinq fichiers JavaScript concernés : zéro erreur/avertissement.
- Compilation Vite des sources réussie ; `git diff --check` propre.

Les groupes se recouvrent et ne doivent pas être additionnés. Les tests emploient
les vrais moteurs, des états de combat synthétiques et leurs ordonnanceurs
natifs. Le résultat GitHub du commit publié fait foi pour le build complet
avec images. Les recettes navigateur permanentes sont conservées ; cette passe
n'ajoute pas de nouvelle recette navigateur et ne revendique aucune navigation
locale. Un premier lancement du groupe local a dépassé la limite du processus ;
le relancement complet enregistré a terminé normalement avec 218 succès.

## Limites et publication

Aucun merge, promotion de production, changement de compte, sauvegarde réelle,
SQL, secret, quota ou protection administrative. Aucun nouvel asset, personnage,
invocation ou certification 1:1. Les chantiers d'animation, de campagne, de
mouvements avancés, de performances et du classeur original restent ouverts.

La branche de travail temporaire transporte uniquement le snapshot, les
dépendances de test et le patch vérifié. Ses workflows et fichiers de transport
ne doivent figurer ni dans l'arbre ni dans l'ascendance de la PR livrée.
