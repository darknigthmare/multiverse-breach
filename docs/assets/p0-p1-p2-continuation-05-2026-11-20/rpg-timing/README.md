# RPG · Continuité des actions pendant une invocation

L’ÜberCharge de Scout exige un faisceau valide au moment de la sélection. Un coup reçu par le Medic désactive la commande immédiatement, même avant le prochain tick. Une fois l’invocation confirmée, la scène garde l’identité du Medic et du faisceau. Si le canal est interrompu avant l’impact, la scène s’arrête. Une nouvelle connexion conserve sa propre charge et ne reçoit aucun effet de la scène précédente. Sur un canal intact, l’impact active huit secondes de protection pour le Medic et son patient.

Le Slig possédé et une alliée peuvent engager leurs commandes successivement. Quand Mei Zhen invoque l’Ancre ancestrale pendant l’armement du fusil, le délai du tir et la pose du Slig avancent ensemble après la scène. Le test lance les deux commandes par le ciblage RPG. À la sortie de la scène, le fusil est toujours au quatrième tick. Le tir part au quinzième tick depuis le point de bouche prévu et touche la cible.

Les deux régressions du Medic et celle du Slig échouaient sur le moteur précédent. Les suites RPG et mécaniques valident aussi la construction normale de la charge, le maintien de la protection, l’interruption du chant et le retrait d’une cible.

```bash
node --test --test-concurrency=1 scripts/sourceMechanicsWave17.test.mjs scripts/sourceEngineWave17.test.mjs
node --test scripts/rpgSourceControlWave16.test.mjs
```
