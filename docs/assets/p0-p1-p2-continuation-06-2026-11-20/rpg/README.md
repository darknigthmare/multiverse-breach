# RPG · Protection et commandes simultanées

L’ÜberCharge protège le Medic et son patient contre les dégâts périodiques d’infection tant que leur faisceau est valide. Le compteur de l’infection continue. Après une rupture de portée, le prochain tick inflige ses dégâts normalement. Le calcul utilise le même contrôle de faisceau que les dégâts directs, pour les deux camps.

Les scénarios passent par le ciblage du Medi Gun et la confirmation de l’ÜberCharge sur le vrai moteur. La fixture remplit le faisceau après le raccordement pour isoler le tick testé. Sur la révision précédente, le patient passait de 157,5 à 154,5 PV et le Medic de 120 à 117 PV, en J1 comme en J2. Après correction, ils conservent ces PV tandis que l’infection passe de 61 à 60 ticks. Une fois le Medic déplacé hors de portée, les deux perdent 3 PV au tick suivant. [Tests](../../../../scripts/rpgSummon.test.mjs)

Les 53 tests des trois suites passent sous Node 22.23.5. La validation couvre la simulation du RPG, les invocations et leurs profils d’action ainsi que le calcul du Medi Gun.

```bash
node --test --test-concurrency=1 scripts/rpgSummon.test.mjs scripts/rpgAuthoredSpecial.test.mjs scripts/sourceMechanicsWave17.test.mjs
```

Le Paralyzer d’Akane libère la commande J2 uniquement si sa cible possède cette commande. Quand Kirito est engagé dans sa séquence et qu’Akane atteint Kogami, un combattant de réserve avec l’ATB plein attend la fin de la séquence. Si Kogami a engagé sa propre attaque, sa paralysie libère la prochaine commande et l’ancien tir est annulé. Avant correction, la réserve pouvait attaquer dès la paralysie de Kogami, pendant l’action de Kirito. Les 51 tests des contrôles et des invocations W16 passent. [Deux scénarios moteur](../../../../scripts/rpgSourceControlWave16.test.mjs)

```bash
node --test --test-concurrency=1 scripts/rpgSourceControlWave16.test.mjs scripts/rpgControlWave15.test.mjs scripts/rpgSummonWave16.test.mjs
```
