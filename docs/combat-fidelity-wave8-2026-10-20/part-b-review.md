# Vague8 — lotB Yakuza

Cinq présentations32 et cinq bases16 livrées : **10PNG,240poses**. Dix appels image_gen réels ont tous retourné une source ; aucune correction native ou tentative refusée n’est comptée. Les32/16cellules de chaque atlas sont distinctes, inspectées visuellement puis contrôlées par empreintes RGBA et reconstruction exacte des rangées natives.

Versions : Kiryu et Majima Kiwami2016 ; Ichiban Like a Dragon2020 ; Saejima et Akiyama Yakuza5(2012). Kiryu : combinaison de poings physique adaptée ; Majima : tantō ; Ichiban : batte Hero/GigaSwing ; Saejima : garde personnelle HerculeanSpirit sans projectile, soin ni dégâts ; Akiyama : coups de pied LaunchStrike. Les finales sont des démonstrations non graphiques. Le pantalon d’Akiyama reste sombre, illustré en anthracite éclairé : interprétation de palette explicitement acceptée, pas une certification de couleur canonique.

Les sources natives32 mesurent887×1774 ; les16 mesurent1254×1254. Les archives demeurent inchangées. Sharp ne dessine rien : extraction alpha, découpe, redimensionnement uniforme, transparence et packing uniquement. Les dix PNG finaux sont RGBA1024×2048 ou1024×1024, cellules256², marge10 et baseline244. Zéro pixel opaque sur le bord extérieur des sources et zéro pixel opaque coupé aux seams.

Les60mesures de corps excluent la hauteur ajoutée des armes/traînées/aura. Chaque source possède **un seul facteur de stature**, étalonné sur le corps debout à190px. Le facteur de chaque rangée compense seulement son packing ; les flexions et les phases aériennes conservent leurs rapports natifs. Les deux densités natives et leur rapport887/1254 sont consignés pour les bases. Les contacts 'part-b-contacts/calibrated-first-cells.png' et 'base-part-b-contacts/calibrated-first-cells.png' appliquent exactement cette projection pour revue.

Les pages effectivement lues sont séparées des extraits de recherche et des refus réseau dans 'part-b-source-facts.json'. Les identifiants de modèle/génération/job non fournis valent null. Fidélité globale et images1:1 **non certifiées**, cadres/timings adaptés. Aucun ancien bitmap, moteur, index ou package n’est édité par ce lot.

| Personnage | Poses | Dimensions | SHA256 |
|---|---:|---|---|
| kiryu_yakuza | 32 | 1024×2048 | 3ae89df3053d49aa678a6e2e9b521a0245e923f9b7769c3a0233fd61b4f35915 |
| majima_yakuza | 32 | 1024×2048 | 1875e481f9a456ed97aa6b88e189bf33879376add29f845387467d2a6427b449 |
| ichiban_yakuza | 32 | 1024×2048 | 49dbe8192185ee35331c07b00c88f24f57c1b3e7c8f6077d19d129b6bf6b0e2f |
| saejima_yakuza | 32 | 1024×2048 | 81042532a2e88c9a1aacd8aae45c2c663d1afe989a6873df319b6e1e96dd2a85 |
| akiyama_yakuza | 32 | 1024×2048 | 755057bf68ab7f3a620c39ac6a16c228efecfe2de48b0c4d0941db8c56067b5f |
| kiryu_yakuza | 16 | 1024×1024 | d958830dda17d5fcd840ef7f61a7b04d88591a28bd51d2b2ab6ece55bfca6a3f |
| majima_yakuza | 16 | 1024×1024 | c5b854660e10ce92fb7d74f6953027d0d0b7c53510d11bc0453b6eeaf838549f |
| ichiban_yakuza | 16 | 1024×1024 | 95c8ace3a8d067ca3bdef6cce420312875b7cc8b5816858e0145be505a056732 |
| saejima_yakuza | 16 | 1024×1024 | 78484c700c2aa1f9d71cc54f961df71cce1c95ed62c9e2dd0fc4789cd9328002 |
| akiyama_yakuza | 16 | 1024×1024 | f1bea38cd83faad461656b2f09b8ad7bfb5793f97f3e21ca5d12138851dca76d |

Les deux builders avec '--check' contrôlent sources/prompts/références, marges, poses et reconstruction exacte. Leur lint est exécuté séparément. Les registres et empreintes de livraison sont dans 'part-b-delivery.json'.
