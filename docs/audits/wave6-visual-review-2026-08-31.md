# Vague 6 : revue visuelle et fidélité

Ce journal complète le manifeste de production. Il ne remplace ni le ledger OpenAI ni le contrôle d'installation : seuls les fichiers acceptés, intégrés et vérifiés peuvent être comptés comme terminés.

## Dossier 34421 — Dynamic Weather Extraction

Référence officielle consultée le 31 août 2026 : [Interstellar Marines, description du développeur sur Steam](https://store.steampowered.com/app/236370/Interstellar_Marines/). The Vault est le centre militaire souterrain ITO sous Groom Lake. SARA est l'IA centrale qui organise l'entraînement, la météo artificielle et les robots de combat. « SARA Final Evaluation » est le libellé de menace du projet, pas une autorisation de lui inventer un corps monstrueux.

### Première génération rejetée

- Interface : outil intégré OpenAI image_gen.
- Génération : `exec-4a67a0ac-4af1-453d-a748-0be8f6a224f4`.
- SHA-256 du PNG source : `f6ffb09d57f84e6fd622bcd2034d359a6d020ccd794fac88a09b5725b63b37b2`.
- Prompt utilisé : prompt canonique initial du dossier 34421, avant correction de fidélité.
- Défaut constaté : SARA représentée comme une créature humanoïde géante ; scène extérieure générique ne montrant pas clairement le dispositif d'entraînement de The Vault.
- Décision : rejet ; aucun fichier runtime remplacé, aucune preuve d'installation ajoutée, aucun crédit dans la complétion des 500 dossiers.
- Correction demandée : préserver le plan de combat RPG, montrer un vaste espace d'entraînement fermé avec météo artificielle, des CTR de taille humaine et SARA suggérée uniquement par l'infrastructure de contrôle.

### Deuxième génération acceptée visuellement

- Génération : `exec-eaec6000-27b4-4342-b255-624a4364ef8f`.
- SHA-256 source : `5da13500124156e49143a5f7effd5b31eebef76fea0ba019fa853a550b2091c6`.
- SHA-256 du prompt canonique corrigé : `c1f7fb72474372f200384c73d2362ce677a470be8a8e65f338317e937dd5488f`.
- Revue : plafond et générateurs de pluie clairement visibles ; entraînement militaire fermé ; CTR et soldats de taille cohérente ; aucune personnification de SARA ; voie de combat horizontale lisible ; aucune inscription ou interface incrustée.
- Statut : source acceptée ; installation et preuve runtime à vérifier séparément dans le suivi technique Wave6.

## Trois autres essais génériques rejetés

| Stage | Génération | SHA-256 source | Motif |
| --- | --- | --- | --- |
| 34430, Ultratech Industries | `exec-d1e4f674-d7dc-4ada-ae54-88eb623f7fa1` | `ab28ab08e719006655a3ff59d145d0d7f97f734d427b3d468b63919f1d433eb5` | Eyedol générique à deux têtes portant une hache ; mélange de personnages/époques sans continuité visuelle explicitée. |
| 34431, Astral Plane | `exec-48ff7e1b-0252-47e9-ac1b-406cae7ee84a` | `b971c1c500cbd2fb06244e51ebbeb349a5ac3e9f613671f7db3de5901fa911ae` | Mélange littéral du Tiger Lair et d'une usine Ultratech ; le lieu ciblé n'est pas distinct. |
| 34440, Biotics Lab | `exec-aa20fbb6-391e-4208-b4b5-137fdc0250ef` | `32cc47f776d92072bf4088535e54b74676db44da654f78722f3aaaa6bcdadefd` | Matriarch dessinée en reine démoniaque ; Paris ajouté au laboratoire à partir d'une ancre sans rapport direct avec l'opération. |

Aucune de ces trois images n'est intégrée ni comptée terminée. Leurs prompts nécessitent des références primaires et une description de sujet et de lieu spécifiques, pas une accumulation des noms présents dans l'univers.

## Reprise vérifiée après correction des quatre prompts

Les quatre versions corrigées ont été inspectées en pleine définition puis au format final 640×360. Elles sont intégrées via `asset-batch-500-wave-6-install-001-004.json` et vérifiées par le ledger OpenAI, les empreintes des prompts/sources/sorties et le suivi Wave6. Les WebP sont RGB, trois canaux, sans alpha. Ce contrôle d'images n'est pas une recette navigateur.

| Stage | Génération acceptée | Résultat de la revue |
| --- | --- | --- |
| 34421 | `exec-eaec6000-27b4-4342-b255-624a4364ef8f` | The Vault fermé, météo artificielle, SARA non personnifiée. |
| 34430 | `exec-0fd893b8-1b56-4ea5-be56-78ebca5ce8f2` | Eyedol seul, crâne fendu et massue ; usine Ultratech unique. |
| 34431 | `exec-d6fcc925-801b-44c2-b195-100f97ad901a` | Gargos seul sur une plateforme du plan astral, sans mélange de lieux. |
| 34440 | `exec-c7d24fca-4f14-400e-b6db-363d308312e4` | Matriarch biomécanique, canon/griffe/appareillage dorsal ; laboratoire fermé. |

Les attributions d'Eyedol à Ultratech et de Matriarch à Biotics Lab restent les scénarios de Multiverse Breach, pas une affirmation de leur lieu d'origine officiel. Les références primaires et le choix de continuité sont conservés dans chaque prompt et dans le journal de revue structuré.

État du point de reprise : **4/500 complets**, 482 nouvelles images en attente et 14 remplacements explicitement requis ; 496 revues de sujet/scène restent à effectuer avant génération. Le registre global passe de 994 à **998 dossiers disponibles sur 3 199**, soit **2 201 encore en attente**. Les quatre essais rejetés ne sont comptés nulle part comme réalisations.

Validation : 45 nouveaux tests ciblés réussis, vérification du manifeste figé et du statut réel après installation. Aucun remplissage silencieux de la sélection, aucun ancien manifeste Wave5 modifié.

## État de livraison de ce point de reprise

La validation complète locale `npm run build` réussit : 598 tests Node dans 14 suites, audits du prébuild et compilation Vite. Le lint réussit également. Les quatre images, prompts corrigés, preuves et outils Wave6 constituent ce point de reprise validé ; la publication de ce lot fait l'objet d'un contrôle séparé.

Le premier `git add` avait échoué avec `No space left on device` sur le magasin d'objets historique du volume I:. Après autorisation explicite de l'utilisateur, un magasin complémentaire `.git/objects-wave6-20260831` a été créé sur C:. L'ancienne jonction est conservée sous `.git/objects-before-wave6-20260831` et la jonction active `.git/objects` pointe désormais vers le magasin complémentaire. Son fichier `info/alternates` conserve l'accès à `I:/CodexRepoStorage/lively-darwin/git-objects-local-20260828` et aux magasins historiques transitifs. Aucun objet ni historique n'a été supprimé ou déplacé ; les anciens volumes restent nécessaires pour lire l'historique.

Le contrôle `git fsck --connectivity-only --no-dangling --no-reflogs --no-progress` réussit après cette réparation. La lecture de `1b08596` et des commits précédents réussit également. La contre-vérification Wave6 confirme les quatre sources, hashes, revues et images installées ; le manifeste figé et Wave5 restent inchangés. Le correctif gameplay/hub `1b08596` était déjà poussé et publié ; la reprise Wave6 doit être livrée comme un lot distinct, sans la présenter comme 500 dossiers terminés.
