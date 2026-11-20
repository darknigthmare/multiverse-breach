# Légendes du duel

L’interface réserve une ligne au-dessus de l’arène pour l’entrée, les résultats et la sortie. Les légendes utilisent la taille de texte des réglages, reviennent à la ligne dans la zone sûre et gardent une seule annonce accessible avec le score. Les quatre protagonistes originaux ont leurs légendes en français et en anglais. Le nom propre « Accès Racine Nadir » est conservé et annoncé en français. Le moteur conserve ses légendes Canvas lorsqu’il est utilisé hors de l’interface.

Les commandes sans focus s’effacent pendant la scène et reviennent au compte à rebours ou au duel actif. Les commandes qui détiennent déjà le focus restent visibles. Le lobby tient désormais dans la largeur du téléphone, y compris avec ses marges internes. Le bouton d’ouverture répond au tap sur le portrait compact.

La fixture lance le vrai `FighterMode`, applique le réglage de texte à 150 %, puis prépare le dernier point de vie de chaque manche et appelle la résolution réelle du coup. Les transitions, les durées et la fin se déroulent dans la boucle normale du moteur. La vérification couvre le focus, les marges et le retour à la ligne en français et en anglais dans Chromium, avec émulation tactile et rotation. [Reçu](verification.json) · [Entrée en portrait](portrait.jpg).
