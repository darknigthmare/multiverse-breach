# Renforts natifs W9 — preuve GameCanvas

Après le signal final de gel des imports, les onze tests SSR ont passé (code 0), puis les huit parcours GameCanvas ont passé (code 0) pour Dom, Garrus, Batou et Leon, chacun J1 et J2.

Le rapport [summon-wave9-result.json](summon-wave9-result.json) mesure 64 cellules natives dans chaque sens, 128 miroirs pixel par pixel, un seul impact par parcours au tick 99 (attaque colonne 2), annulation sans coût, dépense unique de 100 ATB et 100 charge, pause sans mutation et commande déjà utilisée désactivée. Aucune pageerror n’est survenue. Les huit captures d’impact ont été inspectées. Le résumé [summon-wave9-validation.json](summon-wave9-validation.json) conserve les empreintes des entrées, captures et résultat.

Les tests conservent à l’identique les onze entités natives précédentes, les 28 anciennes feuilles à quatre poses et leurs 280 géométries échantillonnées. Les quatre autres membres Mass Effect appellent bien le Soldier Shepard avec Concussive Shot, sans transmettre une classe ou un buff personnel au lanceur.

Le premier parcours a été interrompu par une recharge Vite pendant l’intégration de correctifs root ; son diagnostic et ses cinq captures partielles restent dans [summon-wave9-attempt-1](summon-wave9-attempt-1/cause.json). Il ne constitue pas un défaut moteur ni une preuve finale.

Le harnais configure une rencontre d’entraînement et met le moteur en pause à l’engagement pour observer toutes les images, puis emploie les vrais update/draw, coûts, ciblages et dégâts. Cette preuve de développement ne remplace pas un contrôle HTTP après compilation et ne certifie aucune fidélité globale 1:1. Aucun fichier de production n’a été modifié.
