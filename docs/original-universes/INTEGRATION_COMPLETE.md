# Intégration complète de la conversation « Ajout d'univers OC »

Conversation source : `6a67d5ed-1c3c-83eb-8d03-ea02b3384dc4`, projet ChatGPT « Multiverse ».

Le document `MULTIVERSE_BREACH_20_UNIVERS_OC_CODEX.md` et le manifeste
`multiverse_breach_original_universes_manifest.json` conservent intégralement le pack fourni
dans la conversation. Le manifeste runtime enrichi est
`src/game/originalUniversesManifest.json`.

## Les vingt univers intégrés

1. Neon Requiem
2. Aether Crown
3. Meridian Clockwork
4. Iron Tempest
5. Helios 56
6. Kemet
7. Imperium
8. Aegea
9. Nine Realms
10. Tawantinsuyu
11. Yomi
12. Mandate Nine Heavens
13. Mythos Primordia
14. Crownless Sea
15. Aetherion
16. Infernum
17. Ilyr
18. Drowned Testament
19. Valedor
20. Aevum Fracture

Chaque monde possède trois héros, cinq ennemis, trois boss, un world boss, trois équipements,
cinq objets de combat, trois stages, un arc de trois missions et un booster ciblé de cinq
cartes. Les cinq boosters permanents de la Cellule ZÉRO restent indépendants.

## Écarts de production signalés dans la conversation et traitement

- Terrains : les 60 stages possèdent désormais layouts, coordonnées, plateformes ou grilles,
  spawns, couvertures, destructibles, caméras, zones de mort, checkpoints, objets, phases et
  pièges adaptés au mode.
- Héros : combos Smash, attaques aériennes, saisies, esquives, charges, passifs, arbres de
  talents, IA alliée, kits RPG/Tactics, hitboxes finales et animations contractuelles pour
  RPG, Tactics, Smash, FPS et Kart sont décrits dans les données de production.
- Ennemis : les 100 ennemis ont un identifiant stable, une machine à états, une détection, un
  ciblage, des priorités, cooldowns, télégraphes, résistances, faiblesses et adaptations de
  mode, groupe et difficulté.
- Boss : les 60 boss et 20 world boss ont leurs seuils, phases, ordre d'attaques, fenêtres de
  vulnérabilité, invocations, transitions, cinématiques, rage, récompenses et adaptations de
  mode.
- Objets : chaque monde expose aussi un catalogue vivant de douze archétypes couvrant
  consommable, arme secondaire, armure, accessoire, matériau, quête, objet maudit, soin,
  recette, amélioration, ensemble et légendaire.
- Récompenses : les onze récompenses procédurales de chaque monde ont un nom, un motif, une
  palette et une animation propres, tout en restant reliées aux systèmes fonctionnels du jeu.
- Mondes vivants : villes, régions, village-relais, habitants, créatures neutres, marchands,
  soigneurs, archivistes, dirigeants, factions mineures, croyances, métiers, ressources,
  économie, architecture, nourriture, véhicules, flore, faune, dialogues, quêtes secondaires,
  événements, codex et relations entre héros sont accessibles dans le dossier d'univers.
- Audiovisuel : les vingt boosters, vingt décors, soixante cartes de stage, soixante portraits
  de héros, cent quatre-vingts portraits de menaces et cent soixante icônes d'objet sont
  500 PNG distincts générés individuellement avec l'interface OpenAI `image_gen`. Chaque image
  possède un prompt propre dérivé du manifeste, des références lore précises et un sidecar de
  provenance vérifiable. Le runtime ne référence plus les anciens SVG. Les portails, K.-O.,
  HUD, armes, ambiances et musiques utilisent les contrats VFX/SFX et les plans procéduraux
  originaux du moteur existant.

## Surfaces jouables

- Écran « UNIVERS OC » : 60 missions, soit 20 premières opérations ouvertes et 40 opérations
  séquentiellement scellées.
- Parcours narratif : chaque arc pointe vers ses trois stages réels.
- Combat : les statistiques, boss, world boss et cinq objets de combat du manifeste riche
  atteignent les moteurs de jeu.
- Archives : les trois missions, les héros, les neuf menaces, le monde vivant et les douze
  objets locaux sont consultables pour chaque univers.
- Portail : chaque booster d'univers résout exactement 24 candidats et ouvre cinq cartes avec
  les garanties du portail.

## Validation

- Validation structurelle du manifeste : 20 univers, 60 héros, 100 ennemis, 60 boss,
  20 world boss, 60 équipements, 100 objets de combat, 60 stages, 20 arcs et 20 boosters.
- Tests spécialisés : 18/18.
- Audit OpenAI Image v2 : 500/500 PNG distincts, 500/500 sidecars de provenance,
  parité exacte plan/runtime et 38 notes de sensibilité reprises dans 375 prompts.
- Revue documentaire Kemet/Tawantinsuyu : 27 visuels régénérés avec garde-fous
  institutionnels ciblés, sans revendiquer de consultation humaine.
- Validation pré-build complète et build Vite de production : réussis.
- Parcours navigateur vérifié : écran 60 missions sans vue vide, trois missions Neon Requiem
  filtrées, stage PNG v2 chargé dans le répertoire, introduction affichée, combat lancé, puis ouverture
  réelle d'un booster Aevum Fracture de cinq cartes sans ressource OC legacy.
