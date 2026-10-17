# Liaison des fiches de capacites et suivi Excel reconstitue

Base de travail : PR 2, `a6b90e01d54d997ba7421055d29c94ccd25f2f5d`.

## Origine et perimetre

Le classeur Excel d'origine mentionne par l'utilisateur n'a pas ete identifie
apres recherches dans les fichiers visibles, la Library, Google Drive et les
documents du depot. Aucun classeur d'un autre jeu n'a ete utilise. Le suivi livre
est explicitement RECONSTITUE depuis le registre de couverture de cette PR ; ce
n'est pas une mise a jour du fichier original, ni une preuve d'integration de ses
lignes inconnues.

Cette passe integre un manque confirme : les cartes, dossiers de boosters et
archives ennemies decrivaient encore parfois les anciennes capacites generiques,
alors que le moteur prepare deja une capacite source propre a l'identite.

## Integration dans le jeu

- Vue en lecture seule des 118 profils explicites : meme preparation que le
  combat, sur une copie de l'acteur. Aucun changement de jauge, equipement,
  sauvegarde, cout, drop rate, unlock ou catalogue partage.
- Cartes de collection : association exacte characterId/rewardId/univers,
  exclusion des skins et correspondances ambigues ; fiche chargee a la demande.
- Dossiers des boosters : nouvelle fiche et recherche par nom de capacite
  integree, sur des copies de recherche conservant identite et probabilites.
- Remplacement de l'ancien libelle uniquement lorsqu'un contrat source est
  resolu. La biographie et les autres techniques ne sont pas reecrites.
- Archives ennemies : action de combat affichee au lieu de l'ancien pattern ;
  les objets d'action avec un champ name restent du texte lisible. Le lore
  canonique et les descriptions de stages/objets sont conserves.
- Fiches FR/EN : couts, limites, incarnation connue, references HTTPS et
  distinction entre coups programmes, spectres autonomes, disque aller-retour,
  soins et soutien Medic. Tactics est explicitement exclu de cette harmonisation
  des kits de combat. Une consultation n'accorde aucun pouvoir.
- Provenance d'une carte : accepte un objet historique ou une liste ; l'ancien
  acces optionnel a .at() sur un objet pouvait lever une exception.
- Clavier : Tab et Shift+Tab restent dans la fenetre, y compris les summaries et
  liens de references visibles ; Escape ferme une seule fois et restaure le
  focus. Les rendus de favoris ne reinitialisent plus le focus de la fenetre.

## Export reproductible

`node scripts/signatureCoverage.mjs /tmp/coverage.json`

`node scripts/signatureWorkbookData.mjs /tmp/coverage.json <SHA-complet> /tmp/suivi`

Le JSON et le CSV contiennent la cle exacte d'inventaire, un commit source et
l'empreinte SHA-256 de la couverture. Le CSV utilise UTF-8 BOM, separateurs
point-virgule et neutralisation des chaines pouvant etre interpretees comme
formules. Aucun import de feuille n'ecrit dans les capacites du jeu.

Les etats NON_COMBATTANT / CONTRAT_PARTIEL / A_INTEGRER sont independants de la
certification artistique, qui reste NON_CERTIFIEE. Les 4 650 signatures absentes
restent absentes : aucun nouveau profil ou asset n'est revendique par cette passe.

## Validation

Avant publication : 206 tests locaux selectionnes reussis, dont 146 nouveaux
tests/sous-tests (118 identites, comportement de lecture, export et focus).
Lint cible : zero erreur et avertissement. Compilation locale des sources :
reussie, mais checkout partiel, pas un prebuild integral des images.

Huit recettes navigateur sont ajoutees a la CI permanente : collection/boosters,
FR/EN, 390/1280 pixels, descriptions, recherche, favoris, modalite clavier,
provenance historique et stockage inchange. La navigation Chromium locale est
bloquee par l'environnement : aucun succes de navigation locale n'est revendique.
Les resultats finaux de GitHub font foi et sont a consulter sur le commit publie.

Le test statique historique des onglets de booster pointe maintenant vers le
helper de focus reel et verifie son appel ; ses controles economiques restent
conserves. Aucun test de regression supprime.

## Limites

Pas de nouveau moveset, animation, invocation, correction exhaustive de tout le
codex ni certification 1:1. Les profils non verifies conservent leurs descriptions.
Pas de modification du classeur original non retrouve, ni de comptes/SQL/secrets,
ni de fusion de PR ou publication volontaire en production.
