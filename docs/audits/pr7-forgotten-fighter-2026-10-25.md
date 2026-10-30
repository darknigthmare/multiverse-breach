# Suite de la PR 6 : treize adaptations Fighter oubliées et catalogue de livraison

Base vérifiée : `b8b2c326da45ce11ed8bd8868fca0bf266dfd31a`, après fusion de la PR 6.
La continuation utilise une nouvelle branche ; elle ne réécrit pas la PR fusionnée.

## Intégration réelle, sans nouveau pouvoir de catalogue

Treize profils source existaient dans RPG/Smash mais n'étaient pas adaptés à
Fighter : ils retombaient sur le super générique de ce mode.

| Entrées exactes | Action | Contacts | Portée adaptée |
| --- | --- | ---: | ---: |
| `leia_organa`, `leia` | Leia Blaster Volley | 3 | 310 |
| Stormtrooper Patrol / Squad / Fireteam | E-11 Blaster Volley | 3 | 310 |
| Droideka Shield Droid / Shield Unit | Droideka Twin Blasters | 4 | 330 |
| `doom_marine_classic` | Classic Plasma Rifle Burst | 5 | 350 |
| Assassin / Upgrade Predator | Assassin — Wrist Cannon | 1 | 340 |
| Covenant Grunt | Grunt — Plasma Pistol Burst | 3 | 260 |
| Elite Minor | Elite — Plasma Rifle Burst | 4 | 320 |
| Makron — Quake II | Makron — Hyperblaster Sweep | 5 | 390 |
| `zell_ff8` | My Final Heaven | 1 | 120 |

Les références et limitations de chaque définition sont conservées dans le
registre source existant. Cette passe n'ajoute aucune nouvelle affirmation de lore.
Les nombres de contacts et distances sont des adaptations, pas des mesures en
mètres ni une chorégraphie 1:1. Les tirs/plasmas sont des impacts directs différés,
pas des projectiles autonomes. Le bouclier/roulement des Droidekas, les transformations,
les munitions et les autres phases de boss ne sont pas ajoutés arbitrairement.

Le coût de 100 reste réservé une fois, avec préparation, impacts successifs,
récupération et pause natives. Un seul adversaire actif est confirmé en duel ;
les réservistes ne sont pas touchés. Portée, hauteur et orientation engagée sont
revérifiées à chaque impact. Le budget de dégâts est partagé après les défenses,
sans multiplier les minimums par le nombre de coups. Le dernier contact seulement
projette, pour ne pas éjecter automatiquement la cible après le premier impact.

Les changements d'identité/camp/vie, le KO, la résurrection immédiate, l'interruption
et la fermeture conservent les protections du moteur. Les coups perdus ne sont ni
redistribués ni remboursés. La charge normalement gagnée grâce à un impact ou un
coup reçu n'est pas effacée : ce n'est pas un remboursement de la jauge engagée.
Les capacités personnalisées et la continuité Quake II du Makron restent prioritaires.
Les ennemis sont testés comme combattants du moteur, pas ajoutés au sélecteur héros.

Les cohortes historiques restent exportées sans modification (39 corps-à-corps,
30 tirs). La cohorte supplémentaire comporte 12 tirs et 1 corps-à-corps :
**82 signatures offensives Fighter explicitement adaptées**, plus les deux soutiens
existants Aerith/Medic. Les 124 profils source du registre global sont inchangés.
Aucun nouveau personnage, déblocage, costume, asset ou certification artistique.

## Fiches cohérentes avec l'adaptation réellement applicable

Le codex expose `fighterDelivery` depuis le résolveur réellement utilisé par le
moteur, pas seulement depuis une liste de noms. Une capacité Fighter personnalisée
ne se voit plus attribuer la description de l'adaptateur standard offensif. Les
anciens exports sans ce champ conservent leur description du contrat de base.
Les explications FR/EN distinguent contacts proches et impacts directs à distance.

## Blocage oublié du build complet

Les générateurs existants du catalogue et du registre ont été exécutés sur un
checkout complet. `rift:audit` passe après régénération. Seul
`docs/rift-dossiers/catalog.json` diffère : deux textes décrivaient encore le Sulaco
comme non implémenté alors que la scène 50101 existe. Le registre d'assets régénéré
est identique ; aucune image, approbation ou provenance n'est inventée.

Le workflow de maintenance est limité aux branches `codex/`, avec liste autorisée
de deux fichiers dérivés et refus d'une branche modifiée entre-temps. Les scripts
ne reçoivent pas le jeton d'écriture ; seule la publication dédiée le reçoit.
Aucun accès à des sauvegardes, secrets de compte ou paramètres administratifs.
Le déclenchement initial automatique est retiré ; la version livrée se lance
manuellement. Le build complet final reste à vérifier sur la tête publiée.

## Vérifications locales

- Six scénarios comportementaux échouent avec le résolveur du parent : Leia/Zell
  acceptent une attaque à l'autre bout de l'arène et Leia n'a qu'un impact générique,
  des deux côtés. Les six passent après l'adaptation.
- **83/83 nouveaux tests/sous-tests** : 13 identités, deux camps, vrais impacts,
  portée/coût, pause, garde, hauteur, interruption, KO/résurrection, fermeture,
  profils personnalisés et codex. Aucun ignoré ou annulé.
- Lint des cinq fichiers JS/JSX/MJS concernés : zéro erreur/avertissement.
- Dix recettes navigateur supplémentaires sont ajoutées au script permanent,
  qui conserve ses six anciennes recettes. Elles utilisent le vrai FighterMode
  et les commandes natives ; les ennemis y sont des sélections synthétiques de QA.

Le moteur Fighter, les résolveurs source, le catalogue source et les deux anciens
adaptateurs ont été comparés aux blobs du parent avant modification. Le checkout
local reste partiel et certaines dépendances non concernées sont historiques :
la CI de la tête exacte est autoritaire pour l'intégration complète. Aucun build
intégral, parcours navigateur local, compte réel ou appareil physique n'est revendiqué.
Les résultats définitifs sont joints à la livraison et à la description de PR.

## Reste ouvert

Les autres signatures et modes, les invocations autonomes de Fighter, les sprites,
chorégraphies, transformations/Gestalt, fins de rencontres, tutoriel, Cité et
performances restent des travaux distincts. Les scènes Sulaco/Narcissus/Blast Pit
existantes et les costumes R13 sont préservés, sans nouvelle validation artistique.
La couverture globale RPG/Smash et le nombre d'acteurs ne changent pas dans ce lot.
