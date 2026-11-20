# Ambiance des combats personnalisés

En Mêlée, Naruto Shippuden dessinait un rectangle du fond Naruto par-dessus son propre décor procédural. Le recadrage est désormais appliqué lorsque le moteur a dessiné le bitmap dont il est issu. Naruto garde son WebP et le recadrage de sa cascade. Naruto Shippuden garde les filets et les remous procéduraux.

Le contrôle passe par le vrai menu Combat custom, puis par GameCanvas et EngineSmash. Les trois cas avant/après couvrent Naruto Shippuden sur ordinateur et avec mouvement réduit sur mobile, ainsi que Naruto sur mobile. Les mesures Canvas sont relevées après la fin de l’introduction. Elles vérifient l’origine de l’image, le mouvement des filets et le démontage du moteur. Les fonds, textures et sprites servis aux essais sont ceux du dépôt. [Mesures](verification.json) · [Avant](shippuden-before.jpg) · [Après](shippuden-after.jpg)

Les 20 tests ciblés du catalogue et des ambiances passent sous Node 22.23.5. La régression prépare un vrai stage personnalisé et passe par le même rendu d’arène que GameCanvas. Le contrôle des quatre atlas de portail sur disque a été écarté de cette commande ciblée, les quatre médias étant omis par le checkout sparse. [Test de régression](../../../../scripts/stageAnimationCatalog.test.mjs)

```sh
node --test --test-concurrency=1 --test-skip-pattern='^four-phase local effect atlases' \
  scripts/stageAnimationCatalog.test.mjs scripts/stageAtmosphere.test.mjs
```
