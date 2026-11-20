# Pause et reprise du Combat custom

Le plateau, l’escouade et les règles sont fixés au moment du lancement. Actualiser une archive ou une collection pendant la pause conserve l’instance du combat. Le lobby prépare les choix courants pour le prochain lancement. Pendant une suspension, le bouton de lancement explique comment reprendre la session. Le retour rend le focus au bouton de lancement ou à l’onglet courant si le bouton est indisponible.

Le scénario de régression échoue dans six fenêtres avant la correction. Après la correction, six parcours Chromium couvrent les fenêtres 390 × 844, 844 × 390 et 1 365 × 900 en français et en anglais. Chaque parcours vérifie le départ, la pause, la reprise et le retour pour RPG, Tactics, Mêlée et Duel. Ces 24 lancements utilisent des enfants de combat instrumentés pour vérifier les paramètres transmis par le vrai menu. [Vérification du menu](verification.json)

Un parcours supplémentaire lance le vrai moteur Tactics dans `GameCanvas`. Mara Veylan dépense un PA pour passer à la case 1:5 de Ligne-Cendre. Après pause, rafraîchissement de la collection et reprise, le même moteur conserve le tour 1, le PA dépensé et la case occupée. La sortie produit un seul abandon, vide les minuteries et rend le focus au bouton de lancement. [Parcours réel](actual-battle.json)

### Reproduire le parcours moteur

```sh
PLAYWRIGHT_MODULE_PATH=/chemin/vers/playwright/index.mjs \
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/chemin/vers/chromium \
node docs/assets/p0-p1-p2-continuation-12-2026-11-20/lobby/browser.mjs
```
