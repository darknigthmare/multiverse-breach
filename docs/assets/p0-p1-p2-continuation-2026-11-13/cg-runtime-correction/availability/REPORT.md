# Disponibilité bornée des références d’identité CG

L’amendement conserve le plan historique complet épinglé à `ce0e0a87c4308f39207b550721b94a1c6cd117775be853ba93f2336863b6132e`. Il intervient après les anciens amendements de candidats et descripteurs et l’amendement de métadonnées source. Le validateur appelant compare toujours ensuite la sérialisation intégrale et le rapport historiques ; aucune empreinte antérieure n’est réinitialisée.

La fixture ferme 58 propriétaires, leurs stages source, leurs entrées publiques HEROES/dossier/pilote/P0, leurs receipts source et leurs receipts du ledger d’images. Chaque portrait possède une empreinte SHA-256, un chemin, un format, une taille en octets et des dimensions exacts. Il s’agit de 58 PNG : 57 de 1086 × 1448 et AURA-7 de 1086 × 1449. Leurs tailles historiques totalisent 143 332 172 octets. Ces nombres décrivent des pins de sources ; aucune de ces images n’a été récupérée ou déclarée livrée ici.

L’inventaire antérieur de 49 références était incomplet : Numa Corvinus, Doros Bronzehand, Eira Hrafnsdóttir, Yrsa Rune Binder, Killa Mayu, Sumaq Khipu, Wei Long, Azael Vorn et Oona Vell avaient également un portrait absent. Leurs neuf couples SHA/chemin possèdent eux aussi un receipt exact du ledger existant. La fixture comprend ces 58 sujets, sans élargissement à d’autres propriétaires.

Pour chaque sujet, le helper autorise seulement deux états dérivés de l’état physique courant :

- La cible historique exacte avec le sous-ensemble de ses références d’identité réellement attestées par l’unique lecteur partagé `isCgReferenceImageAttested`. Les pins de taille, format et dimensions proviennent du ledger vérifié.
- Le fallback négatif exact, sans référence d’identité ni approbation, lorsque l’image est absente ou ne peut pas être attestée. Une absence n’est pas figée : la réhydratation ultérieure des octets exacts est prise en charge. Une traversée de chemin, un lien symbolique ou un ancêtre qui n’est pas un dossier provoque une erreur, sans être assimilé à une absence.

AURA-7 est une restriction distincte de l’état initial : l’image Sonic de soutien de costume CG13 ne peut établir l’identité d’AURA, même si elle est lisible. Le portrait du corps reste nécessaire. Après réhydratation, seule la référence du corps peut entrer dans les références d’identité ; le soutien de costume reste une provenance de costume.

Seules cinq CG01 non livrées ont des champs dépendants projetés : `themeSource`, `themeContinuity`, `missing` et la copie de `themeSource` dans leur matrice CG01. Une cellule générée, enregistrée en galerie ou munie d’assets ne peut emprunter ce chemin. Les champs hors périmètre restent présents pour le contrôle intégral final. Les clés connues reprennent l’ordre de sérialisation historique, sans supprimer des champs supplémentaires.

## Validation

Le premier passage des huit tests est conservé dans `before-shared-decoder.{tap,json}` : cinq réussites et trois échecs. Deux échecs reproduisent le défaut réel du lecteur limité aux signatures de fichiers : dimensions ignorées et PNG tronqué accepté malgré une empreinte correspondant aux octets tronqués. Le troisième provenait d’une assertion de test utilisant le JSON indenté au lieu du sérialiseur canonique du dépôt ; le test utilise désormais `serializeCgRosterProductionPlan`, avec la même empreinte historique attendue.

Le passage final standard est vert : **8/8**, aucun échec, aucun skip, **11,917 s**, avec Node 22, heap 2048 MiB et concurrence 1 sur CPU 0–1. `final-standard.{tap,json}` conserve le TAP complet, la commande exacte et les empreintes des sources suivies, restées inchangées pendant le passage. Les tests utilisent le lecteur Sharp complet partagé, et couvrent la transition absence/réhydratation, les tailles et empreintes erronées, les dimensions, les pointeurs LFS, HTML et PNG tronqués, les chemins et liens, la séparation corps/costume AURA, les fallbacks fermés, les modifications interdites, l’absence de mutation des entrées et le maintien de la sérialisation historique complète.

L’état physique courant est détaillé dans `current-image-pin-availability.json` : **58 portraits absents, zéro portrait attesté, zéro image récupérée ou générée**. Les transitions positives des tests utilisent uniquement un minuscule PNG technique créé dans un répertoire temporaire, puis supprimé. Elles prouvent le comportement de réhydratation du lecteur ; elles ne prétendent pas avoir réhydraté les 58 portraits historiques.

Après ce passage, le propriétaire du producteur a modifié son routage CLI et deux pilotes hors de ces 58 sujets. Il a confirmé que le sérialiseur utilisé par ces tests, les 58 cas et le lecteur partagé restent identiques. Le reçu conserve honnêtement l’empreinte du producteur à l’heure du passage ; la chaîne complète du producteur est vérifiée séparément par son propriétaire.

La projection directe est un contrôle de contrat. Elle ne remplace pas l’exécution du vrai producteur, les contrôles physiques de toutes les CG publiées, leur revue visuelle ou une certification de fidélité 1:1. Aucun serveur Vite, build, bulk fetch, nouveau média de jeu, adaptation de personnage, manifeste DLC ou fichier sous `src/` et `DLC/` n’a été créé ou modifié par cette sous-tâche.
