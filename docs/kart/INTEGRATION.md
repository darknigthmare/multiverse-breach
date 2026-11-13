# Kart : intégration 3D et sprites

## Parcours dans le jeu

Le garage permet de chercher un pilote, de filtrer son univers et de choisir un
circuit. Les personnages non possédés restent identifiés et verrouillés ; les
univers absents de la distribution ou masqués ne sont pas proposés. L’Ancre
reprend le profil du joueur. Les améliorations et la carrière existantes restent
la source des performances et des récompenses.

La vue **3D**, active par défaut, utilise WebGL : karts volumétriques, roues
animées, chaussée, décors, lumière et brouillard. Le conducteur est le sprite
du personnage sélectionné, placé dans le siège. Le menu **Garage / commandes**
permet de passer de la caméra poursuite à la vue aérienne pendant une pause.

La vue **2D · sprites** utilise les huit vues PNG du même châssis. Le conducteur
reste une couche séparée. Les peintures de collection s’appliquent au châssis
personnel dans les deux vues ; elles ne changent ni son conducteur ni ses
performances. La vue 2D peut être choisie depuis la grille si WebGL échoue.

### Décors en vue 2D

Les circuits d’univers reprennent le même profil de décor que la vue 3D :
palette du ciel et du sol, couleurs de chaussée et repères. Le renderer Canvas
dessine des silhouettes simplifiées des volumes, dont l’anneau et l’entrée
Forerunner de Halo, les cloisons du Nostromo et les reliefs à damier de Green
Hill. Le décor Nexus n’est plus appliqué à ces circuits. Les six pistes Nexus
historiques conservent leur présentation. Cette adaptation 2D ne constitue
pas une validation de fidélité 1:1 et ne modifie pas la simulation.

Les commandes clavier et tactiles, l’accélération assistée, le frein, le drift,
les objets, le réancrage, les objectifs et le classement utilisent `EngineRace`.
Les deux présentations observent la même simulation. Quitter, recommencer ou
rencontrer une erreur invalide le reçu de course précédent et nettoie les
commandes maintenues. Une erreur de rendu ne distribue pas de récompense.

## Couverture et état artistique

| Élément | État de cette livraison |
| --- | --- |
| Pilotes | 1 911 personnages du catalogue et l’Ancre, soit 1 912 identités |
| Exports | 1 912 GLB autonomes et 1 912 atlas RGBA, soit 15 296 vues |
| Identités de véhicules | 525 fiches d’univers explicites, exceptions par personnage et aucun repli sur le rôle ; comptes détaillés dans `kart-identity-review.json` |
| Circuits | 525 circuits d’univers et six circuits Nexus historiques |
| Décors | 30 adaptations rédigées individuellement, 20 autres univers originaux, 475 prototypes |
| Univers sans combat | 39 rallyes sans objets offensifs ni dangers de contact |
| Fidélité graphique 1:1 validée | Zéro ; ce statut exige encore une comparaison artistique aux références |

Les châssis sont des adaptations de véhicules de référence ou des créations de crossover explicitement distinguées. Les pistes adaptées ne sont pas
des plans canoniques reproduits à l’échelle. Les matériaux, détails et
proportions demandent encore un travail spécifique par univers. Le catalogue
et le classeur de production conservent ces tâches ouvertes ; le succès d’un
test ne les coche pas.

Le rendu est véritablement tridimensionnel, mais la conduite garde son plan
X/Z et ses sauts existants. La suspension, les dévers, les ponts superposés et
la collision physique volumique ne sont pas implémentés par cette passe. Les
conducteurs utilisent leurs poses idle recadrées ; les poses assises et huit
directions dédiées restent à produire.

## Ressources et distributions

Les 1 840 jeux d’assets appartenant à des DLC ont leur source dans
`DLC/<Pack>/assets/kart/`. Les 72 autres sont dans `public/kart/`. La publication
existante des packs conserve les URLs `/kart/...` et exclut les fichiers des
packs absents. Les manifestes d’assets et règles de publication sont recalculés.

Les briefs de décor restent dans le catalogue central `kartTrackDesigns.js`.
Le filtrage d’installation est fonctionnel ; leur séparation en modules de
données propres à chaque pack constitue encore un travail distinct.

## Vérification reproductible

```bash
npm run test:kart
npm run kart:assets:check
npm run test:dlc
```

`kart:assets:check` relit tous les GLB et PNG, leurs empreintes et les limites
alpha des huit vues. Les tests kart exécutent aussi le vrai moteur de course,
les contrôles et les règles de carrière. Les assertions de renderer utilisent
un enregistreur d’appels GL : elles ne prouvent pas la compilation GPU.

La recette native est `scripts/kart/browserKart3D.py`, lancée par le workflow
**Kart 3D models and races**. Elle ouvre les vrais composants React dans
Chromium/SwiftShader, charge les vrais sprites Nexus/Halo/Alien, vérifie les
deux caméras, la pause, les commandes, une arrivée après trois tours réellement
parcourus, le redémarrage, la perte du contexte et le retour en 2D. Elle produit
son rapport, ses captures et la révision testée. Les formats portrait et paysage
restent des viewports de navigateur, pas un benchmark sur téléphone physique.

Le workflow **Race immersive UI** conserve la recette historique en vue 2D.
Les résultats natifs et leurs limites sont consignés dans la PR avec leurs
révisions exactes, après exécution.

## Documents de production

- [Véhicules, cohérence des incarnations et planches](VEHICLE_IDENTITIES.md)
- [Modèles et sprites](KART_ASSETS.md)
- [Rendu et cycle de vie WebGL](RENDERER_3D.md)
- [Circuits, lieux et références](tracks.md)
- [Inventaire des modèles et images](kart-assets.json)
- [Inventaire des circuits](kart-tracks.json)
