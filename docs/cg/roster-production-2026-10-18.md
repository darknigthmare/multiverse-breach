# Production CG — roster complet, 18 octobre 2026

Périmètre : **1911 héros de HEROES_DB + l’Ancre séparée = 1912 sujets**, répartis dans 525 univers. Les six personnages du pilote sont inclus. Aucun boss non jouable n’est ajouté.

- 83 CG publiées réutilisées pour les six sujets pilotes. Leur existence ne valide pas automatiquement la nouvelle demande de fidélité 1:1 ou de décor distinct.
- 1906 nouveaux CG01 characterSolo constituent le socle du reste du roster; 40 CG01 et 547 CG de séries supplémentaires sont réellement livrées dans le registre dédié.
- Statuts : **670 generated, 0 ready, 1866 needs-reference**. Aucun ancien sprite, numéro de décor, URL historique ou miniature de dossier n’est déclaré nouvelle CG terminée.
- 2536 décors distincts associés, chacun avec backgroundId et description spatiale explicite; 587 sont déjà liés à une nouvelle image livrée et revue. Les autres restent des propositions à confronter aux références puis à l’image finale, sans affirmation de nouveaux lieux canoniques.
- Les **25 P0** de l’audit Wave4 passent en tête de production. Leurs substitutions historiques ne constituent pas une référence fidèle.
- Matrice conservée : 15 emplacements × 1912 sujets = **28680 cellules**; 26136 extensions restent en needs-theme/reference et 8 N/A sont documentés (7 du pilote et 1 issus de la revue source du roster). Les choix CG13 et CG15 restent alternatifs. Chaque cellule applicable porte une pose distincte, un thème ou template documenté, sa source et un backgroundId. Les décors d’extension combinent leur template physique et environmentSourceId; ils attendent la résolution d’un thème propre au personnage avant génération. Au total, 28002 emplacements demandés restent non produits; le socle CG01 ne réduit pas ce périmètre.

Les incarnations, équipements verrouillés, sources publiques, candidats visuels historiques, manques de référence et identifiants de dossier figurent par sujet dans [le manifeste JSON](./roster-production-2026-10-18.json). Les thèmes spéciaux du pilote restent ceux de leurs prompts documentés. Les thèmes livrés des nouveaux personnages portent leur source et leur statut Canon, Fan Art ou What If; les autres restent des propositions à résoudre; un template ne devient pas un thème canonique. Les poses proposées ne prétendent pas modifier une image déjà livrée. Les références distantes historiques ne sont ni téléchargées ni présentées comme images actuellement chargées. Les métadonnées de qualité bitmap ne certifient pas la ressemblance.

## Ordre P0

| Personnage | Univers | Incarnation | État CG01 |
|---|---|---|---|
| Saturnin the Duck | Les Aventures de Saturnin | Les Aventures de Saturnin (ORTF, 1965-1970) - real duckling in a miniature animal village | generated |
| Lilo Pelekai | Lilo & Stitch | Lilo & Stitch (2002 animated film) - Lilo Pelekai on Kauai | needs-reference |
| Stitch | Lilo & Stitch | Lilo & Stitch — film animé Disney 2002, Stitch/Expérience 626 en forme terrestre à deux bras | needs-reference |
| King of Pop Avatar | Michael Jackson | Multiverse Breach original tribute persona - King of Pop Avatar | needs-reference |
| Rhythm Guard | Michael Jackson | Multiverse Breach original companion - Rhythm Guard | needs-reference |
| Bob | Minions | Minions (2015) - Bob, London crown-heist adventure | needs-reference |
| Kevin | Minions | Minions (2015) - Kevin, London crown-heist adventure | needs-reference |
| Stuart | Minions | Minions (2015) - Stuart, London rock-star finale | needs-reference |
| Jack Sparrow | Pirates of the Caribbean | Pirates of the Caribbean: The Curse of the Black Pearl (2003) — Jack Sparrow, upper-body identity from official film stills only | needs-reference |
| Roger Rabbit | Roger Rabbit | Who Framed Roger Rabbit (1988) - Roger, Maroon Cartoon Studio toon | needs-reference |
| Cybernetic Spider - Electro-Beam Loadout | Spider: The Video Game | Spider: The Video Game (PlayStation, 1997) - Dr. Michael Kelly cybernetic-spider loadout | needs-reference |
| Cybernetic Spider - Flamethrower Loadout | Spider: The Video Game | Spider: The Video Game (PlayStation, 1997) - Dr. Michael Kelly cybernetic-spider loadout | needs-reference |
| Raven | Teen Titans | Teen Titans — série animée2003–2006, modèle Warner Bros RAVEN BODY TURNS MM.004.05 FINAL12/9/02 | generated |
| Starfire | Teen Titans | Teen Titans animated series2003–2006 — original Jump City team Starfire, main model finalized11/19/2002 and ©2003Warner Bros. | needs-reference |
| Batman | The Dark Knight | The Dark Knight (2008) - Nolan s Bruce Wayne, segmented Batsuit | needs-reference |
| Harry Potter | Harry Potter | Harry Potter and the Order of the Phoenix (2007 film) — fifth-year Dumbledore’s Army | needs-reference |
| Hermione Granger | Harry Potter | Harry Potter and the Order of the Phoenix (2007 film) - fifth-year Dumbledore s Army | needs-reference |
| Batman New 52 | Joker New 52 | DC Comics The New52 — Batman: Endgame, Batman (2011) #35–40 (2014–2015), standard Batsuit | needs-reference |
| Harley Quinn New 52 | Joker New 52 | Suicide Squad (The New 52, volume 4 #1, 2011) - Harley Quinn | needs-reference |
| Joker New 52 | Joker New 52 | Batman: Endgame (The New 52, Batman #35-40, 2014-2015) - the Joker | needs-reference |
| Han Solo | Star Wars | Star Wars: A New Hope (1977) - Mos Eisley / Death Star escape | needs-reference |
| Luke Skywalker | Star Wars | Star Wars: Return of the Jedi (1983) — Death Star II Jedi Knight | needs-reference |
| Darth Vader | Star Wars | Star Wars: The Empire Strikes Back (1980) - Bespin Sith Lord | needs-reference |
| The Grim Knight | The Batman Who Laughs | The Batman Who Laughs: The Grim Knight #1 (2019) - armed Dark Multiverse Bruce Wayne | needs-reference |
| Cybernetic Spider (Dr. Michael Kelly) | Spider: The Video Game | Spider: The Video Game (PlayStation, 1997) - Dr. Michael Kelly cybernetic-spider loadout | needs-reference |

## Reproduction

`node scripts/buildCgRosterProductionPlan.mjs` produit JSON et rapport.
`node scripts/buildCgRosterProductionPlan.mjs --check` vérifie leur synchronisation.
`node --test scripts/cgRosterProductionPlan.test.mjs` vérifie couverture, matrice, priorités, décors et absence de fausses livraisons.

Le registre [cgRosterArtwork.generated.json](../../src/game/cg/cgRosterArtwork.generated.json) n’accepte que des CG réellement générées avec trois fichiers existants, empreintes SHA-256, prompt et compte rendu de référence. La galerie et le catalogue des 83 CG restent gérés séparément.
