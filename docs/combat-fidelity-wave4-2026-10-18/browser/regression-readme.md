# Régression des composants réels — vague 4

Chromium et Playwright ont monté les vrais `GameCanvas` et `FighterMode` sur le serveur local `http://127.0.0.1:5188/`. Les imports du moteur utilisent l’URL HMR exacte du composant, comme dans le script de contrôle initial.

Les deux parcours passent, sans erreur de page :

- RPG FF7 : bouton Ifrit, choix des cibles, annulation sans coût, touche U, confirmation, consommation des ressources, pause sans progression, scène native, impact et interdiction d’une seconde invocation.
- Fighter Cloud/Tifa : intro, première manche, résultat sans callback final, reprise de la deuxième manche, finale, victoire et outro, puis un unique callback de résultat.

Le [résultat JSON](regression-result.json) conserve les valeurs observées, les empreintes du script et des quatre captures. Les événements bruts sont dans [regression-run.jsonl](regression-run.jsonl), le journal stderr est vide. Aucun défaut matériel n’a été observé sur ces deux parcours.

```sh
node docs/combat-fidelity-wave4-2026-10-18/browser/regression-harness.mjs
```

Le [script archivé](regression-harness.mjs) conserve les assertions de [l’original](regression-original-harness.mjs). Seuls les chemins des captures et une attente du rafraîchissement React avant les captures Fighter ont été ajoutés. Cette attente évite de photographier un HUD encore sur le snapshot précédent après les avancées synthétiques du moteur. Aucune source de production n’a été modifiée.

Les combattants et leurs ressources sont préparés dans la page pour rendre le parcours déterministe ; les KO de test sont imposés au moteur. Ce contrôle valide l’intégration des composants et leurs scènes, sans certifier les autres personnages ni la fidélité visuelle 1:1 aux œuvres.
