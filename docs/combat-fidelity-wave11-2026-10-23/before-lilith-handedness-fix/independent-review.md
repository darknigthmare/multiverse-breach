# Revue indépendante du runtime W11

La [revue exécutable](independent-review.mjs) passe ses **16 domaines**, sans attente ni échec, sur le dernier gel de production. Le [résultat détaillé](independent-review.json) conserve les SHA des sources et les cas réellement exécutés. Reproduction : `node docs/combat-fidelity-wave11-2026-10-23/independent-review.mjs --after-production-freeze`.

Les vrais moteurs RPG et Fighter vérifient les coûts, pauses, annulations, boucliers, cibles mortes ou retirées et coordonnées de contact conservées après déplacement/KO. Le parcours comprend 184 actions spéciales offensives, 34 supers de soutien et 88 actions simples/secondaires bénéfiques. Ces dernières observent la vraie méthode d’émission en la laissant s’exécuter : aucun projectile ciblé ni particule `laser_line` ne doit partir vers un allié. Les soutiens n’ajoutent ni dégâts ni soin inventé.

Les 26 vols Fighter distinguent 24 départs sur bouche native et deux départs historiques pour Harry. Les 58 points visibles des atlas donnent 232 projections J1/J2 contrôlées ; aucun point natif n’est inventé pour Harry, Hermione ou Rogue. Les renforts couvrent sept partenaires natifs et le repli de protection d’Hermione, avec interruption, impact unique, absence de contact sur bouclier et absence de trajet après impact.

Les sept planches de renforts et cinq planches d’ancres ont été vues directement ; leurs SHA sont inscrits dans la revue. La limite des deux pixels de halo au bord de la source Roland reste documentée, sans retouche. Les 23 anciens atlas d’entités, 28 chorégraphies historiques et 72 anciens liens d’appelants sont préservés ; les dix remplacements historiques sélectionnés restent explicites.

Il s’agit de fixtures SSR indépendantes et d’une inspection visuelle des artefacts retenus. Les parcours Chromium sont consignés séparément dans [browser-checks.json](browser-checks.json). Cette revue ne certifie aucune fidélité source 1:1.
