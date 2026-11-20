# Reprise des médias Doom

L’assemblage Doom atteint **213 lots sur 317** et **5 871 médias sur 7 693**. La reprise ajoute **4 lots et 72 médias**, pour 128 647 077 octets. Elle décode 64 rasters et vérifie les octets de 8 fichiers dans les autres formats. Git LFS a fourni 114 446 134 octets sur 40 fichiers. [Lots et empreintes](coverage.json)

Le plan épingle la révision `31c3639d86b67f1f6cb22659d46d06b5ed2016e5`. Le contrôle d’entrée relit les 209 reçus précédents. L’audit indépendant final compare les 5 871 SHA-256 et les 213 reçus aux entrées du plan. L’assemblage garde son journal sans lot en attente. Les 84 tests DLC passent sous Node 22.23.5. [Vérifications](coverage.json)

Il reste **104 lots et 1 822 médias**, soit **3,43 Go**. Parmi eux, 816 médias LFS restent à récupérer selon le relevé des copies locales. Le contrôle strict refuse l’export complet avant de créer un dossier de sortie. [Couverture restante et preuve de refus](coverage.json)

Les 1 011 manifestes et inventaires du commit de code ont les empreintes du plan gelé. Les 16 écarts parmi les 1 142 fichiers épinglés concernent le code et les styles. Les lots sont réutilisables dans `/tmp/mvb-pass06-doom/assembly` avec ce plan gelé. L’installation conserve la réserve prévue de 200 Mio sur le volume temporaire. Après la libération d’espace, l’assembleur a relu les trois premiers reçus de cette reprise avant d’installer le lot `00178`. [Comparaison des objets Git](frozen-inputs.json)
