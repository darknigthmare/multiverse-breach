# Contrôle navigateur des présentations et bases — vague7

Les deux harnesses passent dans Chromium avec le renderer réellement importé par GameCanvas : **80 présentations,640 phases et5120 appels drawImage**, puis **27 bases RPG et864 appels**. Les bases comprennent14 nouveaux personnages448 appels et13 antérieurs416 appels. Leia n’a aucune nouvelle base approuvée et n’est pas remplacée par un autre personnage.

Les5120 dessins natifs sélectionnent le vrai PNG et la cellule256² attendue, conservent baseline244 et le facteur renderScale de leur rangée, et respectent le miroir P1/P2. Le registre et les acteurs restent immuables ;160 identités avec univers/source erronés sont refusées. Un progrès de présentation fixé conserve sa cellule malgré une autre heure de rendu.

Les20 bases W6/W7 appliquent baseline244 et leurs facteurs de stature ; les7 bases pré-W6 conservent leur géométrie historique à232. Les864 acteurs restent immuables et leurs coordonnées de pieds projetées correspondent à leur pivot réel. Le contexte RPG garantit que les bases sont testées directement, y compris Ragna dont le manifeste45 a priorité en mêlée.

Les trois montages de présentations ont été relus pour les15 nouveaux héros aux phases intro/finale/super, sur les deux côtés. Les trois montages de bases couvrent les14 nouveaux héros dans idle/run/attack/hit. Aucun nouvel écart de sélection, miroir ou taille de corps n’a été observé. Les armes, familiers et gardiens visibles appartiennent au bon personnage ; les flexions naturelles restent plus basses. Les15 captures intégrales et la capture des27 bases sont conservées.

Ce parcours teste le dessin des personnages seuls. Les projectiles/VFX séparés (notamment Yamada et Thor), Ragna45 et les invocations relèvent de leurs harnesses distincts. Le contrôle de progrès fixé ne remplace pas une partie complète ou un parcours du menu pause. Les images et chorégraphies sont adaptées, sans certification visuelle1:1. Aucune erreur JavaScript ni requête de sprite échouée ; seule la police externe Google Fonts est refusée par le proxy, comme dans la vague précédente.

Les fichiers JSON de résultats et `presentation-and-base-evidence.json` contiennent les nombres réels, les traces, les chemins des captures et les SHA des sources/harnesses contrôlés.
