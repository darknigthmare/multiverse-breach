# Dossier de pause A.R.C.A.

Maintenir Échap ouvrait puis refermait la pause de mission. Le même maintien dans la confirmation de repli annulait le repli, puis reprenait la mission. Dans **Options**, les deux actions de mission sortaient aussi du cadre à 150 % sur chacun des trois écrans mesurés.

La fenêtre active intercepte les répétitions d’Échap. Une nouvelle pression ferme la confirmation et rend le focus au bouton de repli. Une autre pression reprend la mission et rend le focus à la commande de pause. Le dossier, les options et les commandes défilent ensemble. Les actions **Reprendre** et **Repli vers le Nexus** restent visibles dans la marge d’affichage choisie.

Les essais Chromium couvrent le portrait 390 × 700, le paysage 740 × 390 et le bureau 1280 × 900, en français ou en anglais, avec texte à 150 %, contraste renforcé et mouvements réduits. Ils utilisent les vrais composants de pause et de confirmation, la file de dialogues du jeu et les options d’affichage. Le parent de test reproduit la règle d’ouverture clavier de l’application et conserve un état de pause contrôlé. Le parcours vérifie l’ordre Tab, l’annulation sans repli, la variation du volume au clavier, la reprise, puis une confirmation de repli unique. [Reçu avant et après](verification.json) · [Portrait](pause-options-portrait.jpg) · [Paysage](pause-options-landscape.jpg)
