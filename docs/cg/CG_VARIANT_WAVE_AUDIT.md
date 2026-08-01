# Audit de production — vague CG09–CG15

## Périmètre ouvert par `Continue`

La vague part de la baseline approuvée CG01–CG08 (48 entrées) et ajoute **35 variantes** sur les 42 emplacements théoriques. Les sept autres emplacements restent `N/A` afin de respecter les clauses « non applicable si incohérent » des fiches personnage.

| Personnage | CG09 | CG10 | CG11 | CG12 | CG13 | CG14 | CG15 | Ajouts |
|---|---|---|---|---|---|---|---|---:|
| L’Ancre | N/A | N/A | goofy | alignmentSwap | N/A | zombieVersion | firstStep | 4 |
| Master Chief | N/A | N/A | goofy | alignmentSwap | iconicOutfitSwap | zombieVersion | firstStep | 5 |
| Arbiter | N/A | N/A | goofy | alignmentSwap | iconicOutfitSwap | zombieVersion | futureExperienced | 5 |
| Wesker | beachFamily | maidService | goofy | alignmentSwap | genderSwap | zombieVersion | firstStep | 7 |
| Jill | beachFamily | maidService | goofy | alignmentSwap | genderSwap | zombieVersion | futureExperienced | 7 |
| Leon | beachFamily | maidService | goofy | alignmentSwap | genderSwap | zombieVersion | futureExperienced | 7 |

Le choix CG13 est toujours une seule variante autonome : `genderSwap` pour Resident Evil, `iconicOutfitSwap` pour Halo. Les deux concepts ne sont jamais fusionnés. `furryHuman`, les romances et les nouveaux personnages restent hors périmètre.

## Âge, consentement et ton

- Wesker, Jill, Leon, Chief et Arbiter : `adult-confirmed` vérifié manuellement pour cette vague.
- L’Ancre : `unknown-family-safe-only`; son armure et son casque restent fermés. Ses CG09, CG10 et CG13 restent bloquées.
- CG09–CG11 : `Fan Art`, contenu `family`, aucune romance, aucun baiser, aucune pose sexualisée ou soumise.
- CG12–CG15 : `What If`, y compris les versions temporelles réelles relativement à la référence pilote; la galerie ne les présente jamais comme la continuité de la CG01.
- Infections/corruptions : lecture visuelle autorisée, mais aucun gore, organe exposé, démembrement, morsure ouverte ou humiliation.

Le registre machine qui matérialise ces décisions est [`variant-wave-approvals.json`](./variant-wave-approvals.json).

## Références factuelles officielles

Les pages ci-dessous servent à verrouiller les faits, silhouettes, époques et rôles. **Aucun bitmap officiel, screenshot, poster, scan-model ou visage d’acteur n’est utilisé comme entrée ImageGen ou copié dans le projet.**

### Halo

- [Halo Waypoint — Master Class](https://www.halowaypoint.com/news/master-class) : progression des armures de John-117 et ancrage Mark V/Combat Evolved de `firstStep`.
- [Halo Waypoint — Of Protocols and Prisons](https://www.halowaypoint.com/news/canon-fodder-of-protocols-and-prisons) : contexte Created/Cortana utilisé uniquement pour rendre `alignmentSwap` intelligible.
- [Halo Waypoint — Halo 2 Twentieth Anniversary](https://www.halowaypoint.com/news/halo-2-twentieth-anniversary) et [Fighting Words](https://www.halowaypoint.com/news/canon-fodder-fighting-words) : période Halo 2 et identité classique de Thel ’Vadam.
- [Halo Waypoint — Great Journey customization](https://www.halowaypoint.com/news/customization-overview-great-journey) et [Feet First Into Fall](https://www.halowaypoint.com/news/canon-fodder-feet-first-into-fall) : livrée Kaidon/Swords of Sanghelios pour `futureExperienced`.
- [Halo Waypoint — Flood of Flavor](https://www.halowaypoint.com/news/flood-of-flavor) : langage organique Flood, réinterprété ici de façon originale et non graphique.

### Resident Evil

- [Capcom — Albert Wesker EX file](https://game.capcom.com/residentevil/uk/exfile-2-9.html) et [Evolution of Wesker](https://news.capcomusa.com/lets/browse/resident-evil-20th-anniversary-the-evolution-of-wesker) : capitaine S.T.A.R.S. en 1998 et trajectoire vers RE5.
- [Capcom — Jill Valentine history](https://game.capcom.com/residentevil/en/umbrella-20240607180000.html) et [Jill/BSAA archive](https://game.capcom.com/residentevil/it/umbrella-20220630110000.html) : S.T.A.R.S., BSAA et période Revelations.
- [Capcom — Leon history](https://game.capcom.com/residentevil/en/umbrella-20230324110000.html) : passage du rookie de 1998 à l’agent fédéral expérimenté.
- [Capcom — Resident Evil history](https://game.capcom.com/residentevil/uk/re-history.html) : contrôle chronologique transversal.

### Projet original

L’Ancre est fondée uniquement sur sa CG01 approuvée, le sprite projet et `src/game/ocCampaign.js`. Sa `firstStep` reste une scène originale de première brèche A.R.C.A., sans emprunt à une franchise tierce.

## Contrat de livraison et QA

Chaque illustration distincte doit provenir d’un appel distinct à ImageGen intégré, être inspectée en résolution originale, puis seulement si elle est acceptée être copiée sous `public/cg`. Les trois livrables runtime restent : PNG source exact 3:4, WebP 1536×2048, miniature WebP 384×512. Les hashes doivent être uniques et le manifeste doit conserver le prompt, les références, l’âge et le statut de consentement.
