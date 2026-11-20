# Animations de boss en partie personnalisée

Les cloches des Twelve Bell Judges, le vortex de Lord Pneuma et les cristaux de Vaelgor s’animent quand le boss est choisi comme adversaire dans une partie Mêlée personnalisée. Le moteur recherche l’identité d’origine derrière l’emplacement de l’adversaire local ou CPU et vérifie l’univers, l’arme et la planche de cette identité.

Dans l’Atelier de l’Astrarium, le changement de préférence d’animations s’applique au boss pendant le même combat Tactics. Le réglage réduit dessine la planche entière. Le retour au réglage système relance les deux cloches si le système autorise les mouvements.

Les **14 tests Node** et **8 scénarios Chromium** passent. Dans GameCanvas, les relevés avant et après observent les découpes des trois PNG exacts, les changements de préférence sans recréer le moteur, les PV et le démontage de l’arène. Les revues de planches dessinées pour ces trois boss restent ouvertes. [Reçu](verification.json)
