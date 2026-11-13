# Nettoyage WebGL et réemploi du canvas

`KartRenderer3D.dispose()` doit permettre la séquence suivante sur le même canvas
et le même contexte, y compris après une frame réellement dessinée :

```js
const first = new KartRenderer3D(canvas);
first.draw(engine);
first.dispose();
const next = new KartRenderer3D(canvas);
next.draw(engine);
```

Supprimer un buffer détache ses pointeurs du tableau de sommets courant, mais
ne désactive pas ses attributs. Le premier dessin du nouveau renderer est le
ciel, qui ne réattache que la position. Des attributs de normale ou de couleur
encore activés sans buffer provoqueraient alors `INVALID_OPERATION` (`0x502`),
même si le shader du ciel ne les utilise pas. Voir les spécifications Khronos :
[No Client Side Arrays](https://registry.khronos.org/webgl/specs/latest/1.0/)
et [suppression des buffers liés au VAO](https://registry.khronos.org/webgl/extensions/OES_vertex_array_object/).

Le renderer mémorise donc les indices qu’il a activés et les désactive avant de
supprimer ses buffers. Il vide ce suivi lors d’une restauration de contexte,
dont l’état des attributs repart des valeurs initiales. Il ne force pas la perte
du contexte, ce qui permet notamment le remontage React StrictMode.

Le test existant de remontage dans `scripts/kart/kartRenderer3D.test.mjs` suit
maintenant l’activation des attributs, leurs pointeurs, le détachement à la
suppression et le drapeau d’erreur WebGL. Le 8 novembre 2026, ce test renforcé a
échoué contre le renderer précédent avec `Kart WebGL draw failed (0x502)`, puis
réussi après le nettoyage des attributs. Il vérifie aussi l’annulation des
callbacks d’images tardifs et l’absence de ressources restantes.

Ce mock valide le protocole d’état et le cycle de vie. La compilation GLSL et
l’exécution du même scénario sur un contexte natif sont des contrôles distincts.
`scripts/kart/browserKart3D.py` exécute aussi dessin, destruction et nouveau
dessin sur le même canvas Chromium, puis consigne l’identité du contexte et
les erreurs GL. Le résultat de ce contrôle natif est rattaché à sa révision
dans la PR.
