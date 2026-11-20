# Vérification des médias Rift en copie isolée

Les 58 rasters suivis par Git LFS et absents du checkout ont été transférés sous `/tmp/mvb-pass10-rift/verified-overlay/public`. Ils totalisent 156 490 179 octets et chaque SHA-256 correspond au pointeur Git. Les 58 décodages PNG passent. Les pointeurs ont le même objet Git à la révision épinglée et à la révision courante contrôlée. [Reçu des fichiers](portable-verification.json)

Le registre combiné avec la copie isolée vérifie 3 199 déclarations, dont 1 020 médias disponibles avec des empreintes distinctes. Le contrôle ne relève aucun fichier manquant sur les médias déclarés disponibles. Les 2 179 entrées en attente de génération restent enregistrées comme telles. Les quatre tests du registre passent avec la copie isolée en premier dans la recherche des fichiers. Le checkout conserve son constat local de 58 fichiers absents. [Résultats du test](assets-overlay.tap)
