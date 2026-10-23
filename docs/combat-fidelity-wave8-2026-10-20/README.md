# Lot W8 — vingt personnages, 20 octobre 2026

Les vingt identités du [plan figé avant travail](batch-plan-before.json) sont traitées en parallèle : cinq Teen Titans2003, cinq Yakuza (Kiwami2016 / Like a Dragon2020 / Yakuza5), cinq Metal Gear Rising2013 et cinq membres humains de Dungeon Meshi2024. Le lot livre **16 nouvelles planches complètes32 et 1 planche partielle (8 poses)**, **17 bases16**, **un manifeste complet Kiryu45 états** et **quatre renforts RPG16** : **1036 poses réellement utilisées dans 44 PNG supplémentaires**. Vingt recettes et vingt projections de super sont enregistrées. Beast Boy reçoit uniquement ses huit poses T-Rex pour la finale et le super ; ses vingt-quatre poses humaines écartées ne sont jamais exposées. Ses autres scènes emploient la base gorille. Les volumes artistiques comptent uniquement les images acceptées et contrôlées.

Robin, Raven et Starfire n’ont pas reçu de nouvelle planche après les refus du générateur d’images. Les actions et scripts emploient les visuels existants ; les refus et limites du groupe A sont conservés. La fidélité source1:1 n’est certifiée pour aucun personnage. Les œuvres choisies, écarts de palette/proportions et adaptations de mécanique restent documentés.

| Couverture cumulée | État mesuré |
| --- | --- |
| Actions simples, secondaires, défenses | 1449 héros, 4243 actions, 1376 kits complets et 73 partiels |
| Libellés strictement génériques résolus | 0 ; ce compteur ne certifie pas les animations |
| Présentations natives32 | 96/1911 héros, 1815 encore sans planche dédiée |
| Mêlée45 états | 7/1911 héros, 1904 encore sans manifeste complet |
| Bases corrigées16 | 44 héros |
| Recettes de présentation | 103 héros du roster, 721 paires héros/phase |
| Invocations et renforts16 | 11 atlas, dont 4 partenaires réels du roster |
| Décors | 201 mécanismes, 104/525 univers ciblés ; 421 avec ambiance de base seule |

Les protections de Raven, Saejima et Chilchuck et les soins de Senshi et Falin gardent leur rôle sans infliger de dégâts aux ennemis. Beast Boy utilise des corps animaux natifs selon le chargement sélectionné. Les armes propres de Sam, Mistral, Monsoon, Blade Wolf et Laios restent distinctes. Starfire suit son projectile physique dans Fighter ; Mêlée et RPG projettent son vol sur leur propre horloge d’impact, sans événement de dégâts supplémentaire.

Kiryu est documenté dans [ses preuves natives](kiryu-sources/native-evidence.json). Les nouveaux partenaires sont Cyborg (appelé par Robin), Kiryu (Majima), Raiden (Blade Wolf) et Laios (Marcille). Leurs cellules 512×256 maintiennent une stature 190 et la portée complète des armes ; le renderer respecte cet aspect. Le coût, le temps et l’impact unique restent ceux du moteur existant. [Provenance des renforts](summon-provenance.json).

Les [décors](stage-coverage.md) ajoutent quarante mécanismes pour vingt univers auparavant sans mécanisme ciblé. Les 161 profils et 322 signatures de commandes Canvas précédents restent identiques. Les sources ouvertes et simples extraits indexés sont distingués dans [le registre d’accès](stage-source-access.json).

Les sources natives, prompts exacts, références, correctifs et refus sont archivés par groupe : [A](part-a-provenance.json), [B](part-b-provenance.json), [C](part-c-provenance.json), [D](part-d-provenance.json). Sharp ne sert qu’à segmenter, nettoyer l’alpha, calibrer et emballer les dessins générés. Les poses et corrections anatomiques proviennent du générateur d’images.

[Mesures détaillées](current.json) · [Lecture des mesures](current.md) · [Couverture des 1911 héros](coverage.csv) · [Preuves Chromium](browser-checks.json). Les [mesures précédentes](baseline.json) et [métadonnées avant intégration](runtime-baseline.json) sont immuables.

Build complet passé : 1234 tests dans 17 groupes ; lint et contrôle du diff passés. Les preuves Chromium et les fichiers de production sont détaillés dans [validation.json](validation.json).

Reproduire : `node scripts/combatFidelityAudit.mjs --check` puis `node docs/combat-fidelity-wave8-2026-10-20/build-coverage.mjs`.
