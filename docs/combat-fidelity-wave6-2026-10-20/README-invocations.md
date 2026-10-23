# Invocations et renfort — vague 6, 20 octobre 2026

Trois nouvelles identités disposent de **16 poses natives chacune**, soit **48 poses et 3 PNG** : quatre poses pour l’arrivée, la préparation, l’attaque et le retrait. Le catalogue contient désormais quatre atlas détaillés avec Ifrit, soit 64 poses. Les 28 anciens PNG à quatre poses et le registre Ifrit de la vague 5 sont conservés octet par octet.

| Appelant réellement branché | Entité et action | Version choisie | Type |
| --- | --- | --- | --- |
| Tifa Lockhart | Shiva — Diamond Dust | Final Fantasy VII (1997) | Invocation |
| Jotaro Kujo | Star Platinum — Ora Ora | JoJo’s Bizarre Adventure, partie 3 | Invocation de Stand |
| Sonic | Tails et le Tornado — Tornado Machine Gun | Sonic Adventure (1998), Sky Chase Act 1, biplan rouge original | Renfort matériel |

Cloud conserve Ifrit. Le parcours Shiva utilise Tifa, son appelante effective. Le Tornado garde le type `reinforcement`, son approche en vol, ses tirs et sa sortie ; il n’est pas présenté comme une créature magique.

**La fidélité visuelle 1:1 n’est pas certifiée.** Les dessins et chorégraphies sont des adaptations générées pour le projet, sans frames officielles importées. Les prompts exacts, références locales, trois sorties natives, normalisations et SHA figurent dans la [provenance](summon-provenance.json), les [enregistrements de génération](summon-generation-records.json) et le dossier [des sources](summon-sources/). Les identifiants de modèle, génération et tâche non fournis restent à `null`. Cette vérification porte sur l’intégration et la traçabilité ; elle ne certifie pas la géométrie ou les timings des œuvres.

Les atlas sont RGBA 1024 × 1024, avec cellules 256 × 256, marges transparentes de dix pixels et ligne de base 244. Une même échelle de corps s’applique aux quatre phases d’une entité ; une pose accroupie ou un avion incliné ne déclenche pas un redimensionnement indépendant. Les 48 cellules ont des pixels distincts, des sources identifiées et des empreintes concordantes. La reconstruction par le builder reproduit exactement les trois PNG et leur registre.

Les **7 tests dédiés passent**, ainsi que le lint ciblé et le contrôle de reconstruction. Ils couvrent les trois clés exactes univers/entité/action, le type invocation ou renfort et le refus des identités croisées. Les scènes des deux côtés sélectionnent les seize cellules dans le renderer réel, conservent les transformations du Canvas et ne modifient pas le gameplay par leur dessin. La colonne 2 de la rangée d’attaque, index 10, commence exactement sur `impactTick` ; les colonnes 0 et 1 préparent le contact.

Les trois entités exigent 100 ATB et 100 de charge spéciale. La sélection et son annulation restent gratuites ; la confirmation dépense une seule fois et pose le verrou d’utilisation par combat. La pause fige scènes et actions en attente. Les tests vérifient l’impact unique, l’absence de remplacement d’une cible morte après confirmation et l’absence d’impact tardif après fin explicite de scène, défaite, suppression ou mort de l’appelant, et `dispose`. Les anciens tests généraux d’invocation restent distincts de ce contrôle des trois ajouts.

Le [parcours Chromium](browser/summon-result.json) monte le vrai `GameCanvas` pour les trois appelants : bouton d’invocation ou de renfort, annulation sans coût, touche U, bouton de confirmation des cibles, pause, reprise et commande désactivée après utilisation. Il résout les URL Vite exactes du moteur et de React depuis les modules de l’application. Le contrôle de pause du petit hôte de test transmet le vrai paramètre `sessionPaused` à GameCanvas. Pour capturer toutes les poses sans les sauter pendant les échanges avec le navigateur, le harness arrête le moteur à la confirmation puis avance ses vraies mises à jour de manière déterministe ; aucun calcul de coût, de dégâts ou d’impact n’est remplacé.

Chromium a enregistré **48 cellules en J1, 48 en J2 et 48 comparaisons miroir RGBA exactes**, avec un seul changement de PV à l’impact pour chaque entité et **aucune erreur JavaScript de page**. Les trois rendus d’impact ont été inspectés : [Shiva](browser/summon-shiva-impact.png), [Star Platinum](browser/summon-star-platinum-impact.png), [Tornado](browser/summon-tornado-impact.png). Le [harness reproductible](browser/summon-browser.mjs) et le JSON conservent les sélections de cellules, les ticks et les coûts observés. La validation globale et la compilation restent à la charge du bilan principal.

Une première tentative du harness chargeait une seconde instance de React en omettant le paramètre Vite de son URL. Le [diagnostic](browser/summon-harness-diagnostic.json) est conservé. Seul le harness a été corrigé pour réutiliser les URL de l’application ; le parcours final ci-dessus passe sans erreur et aucun fichier de production n’a été modifié par ce sous-lot.

Commandes depuis la racine du dépôt :

```sh
node scripts/buildSummonAnimationsWave6.mjs --check
node --test scripts/summonAnimationWave6.test.mjs
npx oxlint scripts/summonAnimationWave6.test.mjs docs/combat-fidelity-wave6-2026-10-20/browser/summon-browser.mjs
node docs/combat-fidelity-wave6-2026-10-20/browser/summon-browser.mjs
```

Le navigateur utilise le serveur local 5188 ; `SUMMON_ANIMATION_REVIEW_URL` permet de choisir une autre URL de test.
