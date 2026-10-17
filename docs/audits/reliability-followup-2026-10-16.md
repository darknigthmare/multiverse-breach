# Suite de la PR 2 — récupération de compte, revue et combat

Base de cette passe : `990d9690c1eb4bf7765ec9ac9e48ea12935805ec`, branche `codex/audit-corrections-2026-10-16`.

## Corrections vérifiées

Le prébuild Vercel échouait dans `progressionRuntimeIntegration.test.mjs`, car le test cherchait l'ancien appel non protégé à `localStorage.removeItem`. Le contrat vérifie désormais le helper réellement branché, l'ordre écriture → secours → suppression, et la conservation de la carrière historique lorsque l'écriture principale ou la copie de secours échoue. Aucun contrôle n'est supprimé. La commande `test:polish` complète entre dans la CI permanente.

Les trois retours de revue sont traités : remplacement atomique de l'index de sprites (fichier temporaire voisin puis renommage), échec d'import avec diagnostic de secours distinct sans changement d'état cloud, et initialisation de l'identité de session en mémoire avant les événements inter-onglets. Un rafraîchissement du même compte conserve la version serveur d'un PATCH en cours ; changement de compte, déconnexion et stockage corrompu invalident toujours les opérations précédentes.

En Smash, la perte d'un allié ne compte plus comme un ennemi vaincu. Dégâts infligés/subis et valeur retournée sont limités à la vie réellement perdue. Frapper un mort ne recompte pas le résultat. Les protections des rencontres source sont conservées. Le helper de soins refuse désormais les PV non numériques/non finis sans les convertir en `NaN` ou concaténer du texte.

## Récupération de compte réellement branchée

Le panneau de compte propose « Mot de passe oublié » et « Renvoyer la confirmation » en français et en anglais, avec validation email, blocage des doubles demandes et délai de renvoi. La réponse ne révèle pas l'existence d'un compte. Les réponses HTTP 429 conservent le délai `Retry-After` borné.

Le point d'entrée lit et nettoie les paramètres Auth avant de monter le jeu. Un écran séparé vérifie l'identité auprès d'Auth puis propose le nouveau mot de passe avec confirmation. Il accepte les retours implicites `type=recovery` / `type=signup` et les liens `token_hash` correctement typés. Les liens mixtes, expirés, ambigus ou d'un autre type sont refusés ; un code PKCE isolé est refusé car ce client REST n'initie pas ce flux.

Le traitement est partagé entre les relectures d'effets React StrictMode. Les preuves restent éphémères : aucun refresh token du lien n'est enregistré, aucune session de jeu n'est adoptée, aucune table de sauvegarde n'est appelée. Le mot de passe ne change qu'après soumission explicite ; les PUT ambigus après timeout ne sont pas répétés automatiquement. Le retour au jeu reste une action explicite. Un échec de chargement de module montre un rechargement au lieu d'un écran blanc.

### Configuration externe conservée

La destination Auth est l'origine et le chemin de l'application, sans redirection fournie par l'URL. Pour qu'un email réel revienne au bon endroit, cette adresse doit être autorisée dans les Redirect URLs Supabase ; les règles SMTP, limites d'envoi, exigences de mots de passe et éventuel CAPTCHA du projet restent applicables. Cette passe ne change pas les paramètres Supabase, n'envoie aucun email réel et ne modifie aucun compte. Les templates personnalisés doivent fournir un type explicite et un jeton compatible.

Références officielles consultées le 16 octobre 2026 :
- https://supabase.com/docs/guides/auth/passwords
- https://github.com/supabase/auth/blob/master/openapi.yaml
- https://playwright.dev/python/docs/ci

## Vérifications et méthode

Commandes de cette passe :

```sh
npm run sprites:availability:check
npm run test:audit-reliability
npm run test:audit-followup
npm run test:polish
node --test --test-concurrency=1 scripts/combatEffectRegressions.test.mjs scripts/tacticsMissionObjectives.test.mjs scripts/customBattle.test.mjs scripts/canonRexAttackPatterns.test.mjs scripts/localSaveGuard.test.mjs scripts/cloudSaveConflictPolicy.test.mjs scripts/smashCanonAbilityProfiles.test.mjs scripts/smashObjectiveResolution.test.mjs scripts/canonEncounterExternalDamage.test.mjs
node node_modules/vite/bin/vite.js build
```

En local : 61/61 nouveaux cas de récupération/revue/Smash, 88/88 cas de fiabilité existants, 39/39 cas de `test:polish`, 203/203 contrats élargis de combat/sauvegarde. Ces commandes ont des recouvrements : ne pas additionner leurs comptes pour annoncer un nombre de tests uniques. Le test rouge préalable a reproduit trois problèmes de PV invalides et trois défauts de score/KO Smash ; les nouveaux cas sont ensuite verts. Le lint ciblé des 14 fichiers JavaScript modifiés dans cette passe ne signale aucune erreur ni aucun avertissement.

La compilation des sources réussit. Le bundle d'entrée est désormais séparé du jeu pour le traitement Auth ; Hub et `game-data` restent volumineux. Les bitmaps ne sont pas rapatriés dans la copie locale ; une exécution élargie `test:conversation` a été interrompue après le délai de l'environnement et comportait des échecs de rendu Newt dus aux images non présentes localement. Elle n'est pas annoncée verte. Le prébuild complet des assets reste inchangé et fait foi pour la publication.

`browserAuditFollowup.py` exerce le vrai écran et le vrai panneau React en Chromium desktop/mobile sur un serveur local, avec transport Auth simulé. Il contrôle la conservation octet par octet d'une sauvegarde et d'une session synthétiques, la suppression des paramètres sensibles, les confirmations, les erreurs, les doubles clics, le stockage refusé et les renvois email. Il bloque les sorties réseau hors du serveur local et du faux Auth intercepté. La CI archive ses résultats et captures. Il s'agit de QA de compte, pas d'une recette artistique ou d'une partie complète. Le navigateur de l'environnement local refuse la navigation (`ERR_BLOCKED_BY_ADMINISTRATOR`) ; les résultats de la CI navigateur doivent donc être lus avant de revendiquer une validation interactive.

## Hors périmètre

Aucun nouvel asset, aucune certification visuelle 1:1, aucun boss étendu, aucune refonte du tutoriel complet et aucun test sur comptes de production. Aucun merge ni changement SQL/configuration de production. Les résultats exacts de la livraison distante sont ajoutés à la PR après leur lecture.
