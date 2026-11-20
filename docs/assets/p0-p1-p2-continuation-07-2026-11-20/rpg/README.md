# RPG · Commandes de possession et secours du Medi Gun

Le verrou J2 appartient à l’acteur qui exécute la commande. Libérer le Slig d’Abe pendant une attaque de Kirito laisse la réserve attendre la fin de cette attaque. Quand le Slig lui-même a armé son fusil, une libération ou l’expiration de la possession annule le tir et rend la commande à l’équipe. Les trois scénarios échouaient avant correction et passent dans la suite de 54 tests de contrôle. [Scénarios moteur](../../../../scripts/rpgSourceControlWave16.test.mjs)

Si la planche cinématique de l’ÜberCharge manque, le moteur dessine le vrai Medic en formation et son faisceau vers le patient réel. Quand la planche est disponible, la scène dessine le Medic une fois depuis sa cellule cinématique. Quatre essais Chromium couvrent les deux camps avec le fichier réel puis avec une réponse 404 forcée. Ils vérifient un seul faisceau à l’impact, le même patient et une simulation intacte. Une texture du mannequin de la fixture a manqué pendant un essai. [Mesures Canvas et empreinte](uber-browser.json)

Les 70 tests des invocations et des mécaniques W17 passent. Deux régressions en J1 et J2 couvrent le secours d’image et le lien avec le patient. [Tests RPG](../../../../scripts/rpgSummon.test.mjs)
