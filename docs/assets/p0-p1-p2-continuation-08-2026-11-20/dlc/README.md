# Nouveau lot d’assemblage Doom

Doom atteint **172 lots sur 317** et **5 173 médias sur 7 693**, pour 3 831 232 514 octets assemblés. Cette passe ajoute **20 lots et 365 médias décodés**. L’assemblage a reçu 617 475 674 octets, dont 484 722 598 transférés via Git LFS sur 121 fichiers. [Reçu de couverture](coverage.json)

Le contrôle d’entrée a relu les 152 reçus existants et vérifié leurs fichiers. Les lots ont été choisis selon le volume LFS à transférer, avec deux exports au plus et une seule application à la fois. L’audit indépendant final a recalculé les empreintes des 5 173 fichiers et des 172 reçus. Les 84 tests DLC passent sous Node 22.23.5. Le dossier de travail reste `/tmp/mvb-pass06-doom/assembly`. [Empreintes et résultats](coverage.json)

Il reste **145 lots et 2 520 fichiers**, soit 4 732 930 371 octets à assembler. Le relevé compte 1 159 payloads LFS sans copie locale identifiée. Le contrôle strict et l’export de la distribution complète ont refusé la sortie. [Lots manquants et contrôle strict](coverage.json)

Les 172 reçus correspondent au plan gelé à `31c3639d86b67f1f6cb22659d46d06b5ed2016e5`. Ses 1 011 manifestes et inventaires conservent leurs empreintes. Quinze fichiers d’interface ou de moteur diffèrent dans le code courant, dont le panneau des packs déjà modifié avant cette passe. Le contrôle strict de cet assemblage utilise la révision gelée du plan. [Comparaison des entrées gelées](frozen-inputs.json)
