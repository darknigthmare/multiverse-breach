# Reprise des médias Doom

L’assemblage Doom atteint **192 lots sur 317** et **5 542 médias sur 7 693**. La reprise ajoute **20 lots et 369 rasters décodés**, pour 639 014 612 octets. Git LFS a fourni 493 670 856 octets sur 122 fichiers. [Lots et empreintes](coverage.json)

Le plan épingle la révision `31c3639d86b67f1f6cb22659d46d06b5ed2016e5`. Le contrôle d’entrée relit les 172 reçus précédents. L’audit indépendant final compare les 5 542 SHA-256 et les 192 reçus aux entrées du plan. L’assemblage garde son journal sans lot en attente. Les 84 tests DLC passent sous Node 22.23.5. [Vérifications](coverage.json)

Il reste **125 lots et 2 151 médias**, soit **4,09 Go**. Parmi eux, 1 037 médias LFS restent à récupérer selon le relevé des copies locales. Le contrôle strict refuse l’export complet avant de créer un dossier de sortie. [Couverture restante et preuve de refus](coverage.json)

Les 1 011 manifestes et inventaires de la passe ont les empreintes du plan gelé. Le reçu relève 15 écarts dans l’ensemble des 1 142 fichiers épinglés au moment du contrôle. Les lots sont réutilisables dans `/tmp/mvb-pass06-doom/assembly` avec ce plan gelé.
