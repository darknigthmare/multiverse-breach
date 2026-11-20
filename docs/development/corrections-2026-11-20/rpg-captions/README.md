# Légendes des invocations RPG

Le nom de l’invocation ou du renfort s’affiche dans l’en-tête pendant la scène. Le nom de la technique apparaît aussi quand il est distinct, comme Hellfire pour Ifrit. Le titre de mission revient à la fin. Le statut accessible garde le même contenu pendant les changements de pose et la pause. Les appels directs au moteur conservent les légendes sur Canvas.

Le vrai GameCanvas, avec des jauges préparées et un adversaire de test, passe sur ordinateur en français, sur mobile en portrait et après rotation vers le paysage en anglais. À 390 px de large, la reproduction mesure 4,125 px pour la légende Canvas. Le texte HTML fait 22,5 px lors du réglage à 150 % dans le menu d’affichage. Les essais contrôlent l’absence de recouvrement du dock et de la barre de commandes, l’absence de double légende, la pause, la reprise et le démontage. Aucun échec JavaScript. Le 404 du mannequin synthétique figure dans les résultats. [Mesures et essais](browser.json) · [Capture](mobile-150.jpg).

Les 47 tests RPG ciblés passent sous Node 22.23.5.

```sh
node --test --test-concurrency=1 scripts/rpgSummon.test.mjs scripts/auditRpgLifecycle.test.mjs
```
