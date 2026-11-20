# The Twelve Bell Judges

Deux cloches du boss de Meridian Clockwork se balancent légèrement au repos et entraînent leur halo lors des déplacements. Elles oscillent plus franchement à l’attaque et reculent au choc. Le moteur découpe ces deux régions dans le PNG déjà livré et garde le corps à son point d’appui. L’identifiant, les 640 PV de la fiche, la collision et la case occupée restent ceux du boss. La préférence de mouvements réduits utilise le dessin statique. [Rendu](../../../../src/game/twelveBellJudgesMotion.js).

Les masques ont été comparés aux deux îlots du fichier dont l’alpha atteint au moins 8. Ils couvrent respectivement 10 584 et 10 914 pixels sans prélever de pixel d’un autre îlot à ce seuil. Le cache charge le [PNG original](../../../../public/sprites/generated/bosses/meridian-clockwork/the-twelve-bell-judges.png), contrôlé par son empreinte. Les poses dessinées de l’atlas restent à produire. Le P1 `STATIC_GAMEPLAY_REVIEW` et les P0 historiques demeurent ouverts. [Mesures](alpha-review.json) · [Revue P0](../../p0-p1-p2-continuation-04-2026-11-20/p0-media-review/README.md).

Le vrai GameCanvas a chargé l’Atelier de l’Astrarium en Tactics, avec un combat custom qui sélectionne le boss du catalogue. Le navigateur a observé les deux découpes sur ordinateur et sur mobile, les transformations propres aux quatre états et le dessin complet en mode réduit. Un impact du moteur passe le boss en état de choc et conserve sa case. Les trois cas ont confirmé le démontage. Cinq icônes LFS d’objets sont absentes du checkout et aucune erreur JavaScript de page n’a été relevée. À 390 px, le cadrage du plateau réduit la taille à laquelle le détail des cloches se distingue. [Résultats](browser-results.json) · [Ordinateur](1280-animated.jpg) · [Mobile](390-animated.jpg).

Deux tests propres aux cloches passent, ainsi que cinq contrôles voisins de Pachakuti et d’Aether Mite. La fixture compile avec Vite sans copie du répertoire public. [Tests](unit.tap).

```sh
node --loader ./scripts/sourceSceneTestLoader.mjs --test scripts/twelveBellJudgesMotion.test.mjs
node docs/assets/p0-p1-p2-continuation-05-2026-11-20/bell-judges/build_fixture.mjs
python docs/assets/p0-p1-p2-continuation-05-2026-11-20/bell-judges/browser_review.py
```
