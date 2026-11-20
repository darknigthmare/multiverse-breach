# Reprise des médias Doom

L’assemblage Doom atteint **209 lots sur 317** et **5 799 médias sur 7 693**. La reprise ajoute **17 lots et 257 rasters décodés**, pour 538 368 651 octets. Git LFS a fourni 494 562 278 octets sur 181 fichiers. [Lots et empreintes](coverage.json)

Le plan épingle la révision `31c3639d86b67f1f6cb22659d46d06b5ed2016e5`. Le contrôle d’entrée relit les 192 reçus précédents. L’audit indépendant final compare les 5 799 SHA-256 et les 209 reçus aux entrées du plan. L’assemblage garde son journal sans lot en attente. Les 84 tests DLC passent sous Node 22.23.5. [Vérifications](coverage.json)

Après une interruption Git LFS, le lot `00196` a été récupéré au second essai. Les 7 lots déjà validés ont été relus à partir de leurs reçus.

Il reste **108 lots et 1 894 médias**, soit **3,56 Go**. Parmi eux, 856 médias LFS restent à récupérer selon le relevé des copies locales. Le contrôle strict refuse l’export complet avant de créer un dossier de sortie. [Couverture restante et preuve de refus](coverage.json)

Les 1 011 manifestes et inventaires de la passe ont les empreintes du plan gelé. Le contrôle sur le code publié relève 16 écarts de source dans l’ensemble des 1 142 fichiers épinglés. Les lots sont réutilisables dans `/tmp/mvb-pass06-doom/assembly` avec ce plan gelé. Un seul lot transite à la fois avec une réserve de 200 Mio sur le volume temporaire. Le lot `00204`, mis en attente au premier passage faute de place de copie, a été assemblé après la libération d’espace. [Comparaison avec la révision de cette passe](frozen-inputs.json)
