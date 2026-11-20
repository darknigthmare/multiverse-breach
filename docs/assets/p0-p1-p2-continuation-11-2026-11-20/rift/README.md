# Contrôler Rift avec une copie de médias

`RIFT_DOSSIER_MEDIA_ROOT` indique un dossier contenant les routes `images/`. L’audit et les tests suivent d’abord les images du checkout. Une image absente ou encore sous forme de pointeur Git LFS peut être vérifiée dans la copie. Le registre calcule les SHA-256 et contrôle les preuves de génération et l’unicité.

```bash
RIFT_DOSSIER_MEDIA_ROOT=/volume/medias-rift/public npm run rift:audit
RIFT_DOSSIER_MEDIA_ROOT=/volume/medias-rift/public npm run test:rift
```

La copie utilisée pour cette passe complète le checkout avec **60 PNG**. Les deux fichiers ajoutés correspondent à la fonderie de la Couronne d’Éther et au Forum d’Imperium. Ils se décodent à 1 672 × 941 et occupent 6 526 167 octets. Les 58 empreintes antérieures ont été revérifiées et les deux pointeurs du checkout sont intacts. [Reçu des deux PNG](pointer-overlay-receipt.json) · [Reçu de la copie initiale](../../p0-p1-p2-continuation-10-2026-11-20/rift/portable-verification.json)

Le contrôle natif valide les **3 199 dossiers**, dont **1 017 illustrations disponibles et 2 182 dossiers en attente**. Les trois illustrations remises en attente ont un reçu de génération antérieur à leur référence de source actuelle. Une copie de test avec un PNG altéré a été refusée et le contrôle a identifié le dossier 60011. Aucun fichier du checkout ou de la copie vérifiée n’a été remplacé pour ce test. [Registre actif](../../../../src/game/riftDossierAssets.json) · [Écart de provenance](status-changes.json)
