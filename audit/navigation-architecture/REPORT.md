# Audit de navigation - Multiverse Breach

Date: 2026-07-11

## Perimetre

Audit de l architecture de l information du titre, du hub, du Portail de Breche, du compte et des principaux sous-ecrans sur ordinateur et mobile.

## Architecture retenue

1. Operations
   - Carte des Failles: campagnes, arcs et missions.
   - Zone d Extinction: mode FPS de survie.
   - Course A.R.C.A.: mode kart et garage.
2. Nexus
   - Cite-Mosaique: exploration RPG.
   - Resonance Heros: fiches, niveaux, talents et lore.
   - Dossier d Ancre: identite joueur, partage, code ami et progression publique.
3. Portail de Breche
   - Recrutement gacha et gestion des fragments.
4. Arsenal
   - Cellule d Ancre: composition et lecture tactique de l equipe.
   - Equipement des Heros: reliques, artefacts et fusion.
   - Echange de Signaux: boutique et rotation de prototypes.
5. Archives
   - Collection: progression de collection et dossiers d univers accessibles.
   - Codex & Lore: canon, univers, groupes, personnages et fusions.
   - Regulation A.R.C.A.: visibilite des Trames, diagnostic et couverture des contenus.

## Corrections realisees

- Deplacement de la gestion d equipe de Nexus vers Arsenal.
- Creation d un Dossier d Ancre distinct pour le profil et le futur multijoueur.
- Retrait de la carte publique de l ecran de composition d equipe.
- Deplacement des diagnostics d univers caches ou incomplets vers la Regulation.
- Libelles de filtres adaptes aux missions, aux heros ou aux archives.
- Remplacement des libelles meta visibles Admin/DLC par le vocabulaire Trame/Regulation.
- Suppression des emojis decoratifs dans les commandes auditees.
- Correction du chevauchement Audio/Compte avec Retour au Nexus et Fragments.
- Remise a zero du defilement lors de l ouverture du Portail.
- Verification du reflow mobile a 390 x 844.

## Parcours verifies

| Etape | Ecran | Etat |
| --- | --- | --- |
| 1 | Titre et reprise de trace | Bon |
| 2 | Operations / Carte des Failles | Bon apres correction du filtre |
| 3 | Operations / Zone d Extinction | Bon |
| 4 | Operations / Course A.R.C.A. | Bon |
| 5 | Nexus / Cite-Mosaique | Bon |
| 6 | Nexus / Resonance Heros | Bon apres correction du filtre |
| 7 | Nexus / Dossier d Ancre | Bon, nouvel emplacement logique |
| 8 | Arsenal / Cellule d Ancre | Bon, equipe visible immediatement |
| 9 | Arsenal / Equipement des Heros | Bon |
| 10 | Arsenal / Echange de Signaux | Bon |
| 11 | Archives / Collection | Bon, diagnostics techniques retires |
| 12 | Archives / Codex & Lore | Bon |
| 13 | Archives / Regulation A.R.C.A. | Bon, diagnostics regroupes ici |
| 14 | Portail de Breche | Bon, retour fonctionnel |
| 15 | Navigation mobile | Bon |

## Captures principales

- [Titre](01-title.png)
- [Operations avant correction](02-operations-missions.png)
- [Nexus - Dossier d Ancre](16-after-anchor-record.png)
- [Arsenal - Cellule d Ancre](17-after-arsenal-team.png)
- [Portail corrige](19-after-portal.png)
- [Hub mobile](20-mobile-hub.png)
- [Portail mobile](21-mobile-portal.png)

## Limites et risques restants

- Le chunk HubScreen depasse 1,2 Mo minifie. La navigation fonctionne, mais une future passe de decoupage par onglet ameliorerait le chargement initial.
- HubScreen contient encore du JSX historique masque pour une ancienne vue d equipe. Il ne s affiche pas, mais devrait etre supprime lors d une passe de maintenance dediee.
- Les captures ne prouvent pas une conformite WCAG complete. Le focus visible est present; une verification clavier et lecteur d ecran exhaustive reste separee.
