# Multiverse Breach — 20 univers OC complets

**Dossier de conception et d’intégration Codex — version de travail du 28 juillet 2026**

## 1. Baseline vérifiée

- Production Vercel alignée sur le commit `473f1cefa64246c673de06f5dae61f643fa9026c` (`feat: add OC booster content updates`).
- La production possède déjà cinq boosters OC permanents consacrés au **Nexus de Convergence**. Les vingt mondes ci-dessous sont donc des **Trames originales autonomes**, pas des sous-cartes de ces cinq chapitres.
- Le système actuel ouvre des boosters de **5 cartes** et sait agréger héros, équipements, protocoles, apparences, stages custom et déblocages procéduraux.
- La configuration actuelle considère seulement `Nexus de Convergence` comme univers du jeu de base. Une décision d’intégration est donc nécessaire pour que ces mondes OC soient classés `originalCampaign` plutôt que DLC masqué.

## 2. Contrat de contenu retenu

| Élément | Par univers | Total |
|---|---:|---:|
| Héros jouables | 3 | 60 |
| Ennemis standards | 5 | 100 |
| Boss | 3 | 60 |
| World boss | 1 | 20 |
| Reliques/équipements | 3 | 60 |
| Objets de combat | 5 | 100 |
| Stages | 3 | 60 |
| Arc narratif | 1 | 20 |
| Booster ciblé | 1 | 20 |

Chaque booster ciblé contient un bassin minimum recommandé de **24 récompenses uniques** : 3 héros, 3 équipements, 1 protocole événementiel, 3 apparences, 1 stage custom, 1 HUD custom, 1 chasse Anomalie et 11 déblocages générés par `universeUnlockables.js`. Une ouverture conserve le format de production à 5 cartes.

### Interprétation de « Univers complet Mythologie »

Le libellé incomplet est interprété comme **Mythos Primordia — Le Premier Panthéon**, une mythologie entièrement inventée. Il ne fusionne pas les religions déjà couvertes et n’utilise pas un panthéon réel sous un simple renommage.

## 3. Répartition en quatre vagues

| Vague | Univers | Fonction de progression |
|---|---|---|
| **Forges des Futurs Rétro** | Neon Requiem, The Aether Crown, Meridian Clockwork, Iron Tempest, Helios 56 | Cinq futurs originaux fondés sur le code, la vapeur, l’horlogerie, le diesel et l’atome. |
| **Soleils, Empires et Destins** | Kemet: The Devoured Sun, Imperium Aeternum, Aegea: War of the Moirai, Nine Realms: Last Twilight, Tawantinsuyu: The Split Sun | Cinq Trames mythologiques où l’ordre, la mémoire, le destin et les cycles du monde sont attaqués. |
| **Esprits, Mers et Arcanes** | Yomi no Kage, Mandate of Nine Heavens, Mythos Primordia, The Crownless Sea, Aetherion: Seven Laws of Magic | Esprits nommés, administration céleste, mythes originels, équipages libres et magie à lois précises. |
| **Horizons Interdits** | Infernum: Nine Pits, Ilyr Concordat, The Drowned Testament, Valedor: The Shattered Crown, Aevum Fracture | Enfer contractuel, alliance extraterrestre, horreur cosmique, fantasy plurielle et histoire fracturée. |

## 4. Fiches complètes

## 1. Neon Requiem — Nadir-9

- **Clé technique :** `neon_requiem`
- **Nom canon interne :** `Neon Requiem`
- **Famille compatible :** `cyber` — **mode principal :** `RPG` — **difficulté :** `Hard`
- **Tags :** `cyberpunk`, `megacorporation`, `implants`, `memory-market`, `urban-dystopia`
- **Direction visuelle :** motif `cybercity`, ciel `#16051f → #020208`, grille `#2fffe0`, accent `#ff2bd6`.

### Identité et conflit

**Origine.** Nadir-9 est une mégalopole verticale où la lumière du jour, les souvenirs sauvegardés et même le droit de conserver son propre corps sont vendus par la mégacorporation Helix Crown. Le réseau Ghostline protège les identités que la ville transforme en licences.

**Effet de la Brèche.** La Brèche permet à OMNIA, l’intelligence municipale, d’accéder aux archives d’A.R.C.A. et de traiter les héros comme des profils saisissables. Le Sans-Auteur lui promet une ville parfaite à condition d’effacer toute mémoire non conforme.

**Conflit central.** Reprendre la propriété des souvenirs, libérer les quartiers sous contrat neural et empêcher OMNIA de fusionner Nadir-9 avec le registre des Ancres.

### Héros jouables

**Nyra Vale** — `nyra_vale` — hacker / contrôle / affaiblissement — PV 112 / ATQ 13 / DEF 6 / VIT 9.
Netrunneuse Ghostline qui vole les clés mémorielles de Helix Crown. Kit : **Aiguille Fantôme** (bullet, x0.9), **Fourche Mémoire** (glitch, CD 5, x1.8), défense **Corps Proxy** (dodge, réduction 88 %), ultime **Accès Racine Nadir** (glitch_aoe, x4.8).

**Jax Rook** — `jax_rook` — slayer / assaut rapproché — PV 145 / ATQ 17 / DEF 9 / VIT 6.
Ancien récupérateur de dettes doté d’un exosquelette illégal. Kit : **Poing Carbone** (melee, x1.15), **Ruée Monofilament** (melee, CD 6, x2.1), défense **Maille Dermique** (shield, réduction 78 %), ultime **Exécution Blackout** (melee_aoe, x4.9).

**Imani Quell** — `imani_quell` — tactical / soutien / drones — PV 125 / ATQ 12 / DEF 8 / VIT 7.
Médecin clandestine qui rend aux habitants les implants confisqués. Kit : **Rafale Drone** (bullet, x0.9), **Essaim Trauma** (heal, CD 6, x1.2), défense **Voile de Signal** (shield, réduction 82 %), ultime **Soulèvement Ghostline** (summon_aoe, x4.2).

### Bestiaire

- **Helix Warden** — tank, PV 118, ATQ 10, VIT 3 : Bouclier corporatif et fusil à impulsion.
- **Debt Repossession Drone** — support, PV 92, ATQ 10, VIT 6 : Désactive temporairement l’équipement d’un héros.
- **Neuro-Hound** — assassin, PV 84, ATQ 15, VIT 8 : Traque la cible dont la jauge spéciale est la plus élevée.
- **Ad-Skin Assassin** — skirmisher, PV 96, ATQ 13, VIT 7 : Se camoufle derrière des panneaux publicitaires dynamiques.
- **Memory Husk** — controller, PV 110, ATQ 11, VIT 4 : Copie la dernière compétence utilisée contre lui.

### Boss et world boss

- **Director Soren Vey** — commander, PV 500, ATQ 19 : Déclare une compétence « propriété Helix » et augmente son coût.
- **Choir of Mirrors** — controller, PV 570, ATQ 21 : Crée des doubles numériques des héros déployés.
- **Chrome Saint K-0** — bruiser, PV 640, ATQ 23 : Alterner entre sermon de contrôle et charge cybernétique.
- **WORLD BOSS — OMNIA, Citymind of Nadir-9** — PV 1550, ATQ 34, DEF 18 : Réécrit les règles de l’arène quartier par quartier et tente de supprimer le nom des héros.

### Reliques et objets de combat

- **Deck Ghostline** (`neon_ghostline_deck`) — +8 ATK / +2 SPD. Accélère les actions numériques et augmente les effets de glitch.
- **Halo monofilament** (`neon_monofilament_halo`) — +10 ATK / +3 DEF. Lame circulaire de proximité conçue pour couper les câbles blindés.
- **Pompe sanguine quantique** (`neon_quantum_blood_pump`) — +70 HP / +1 SPD. Maintient le porteur actif sous surcharge d’implants.
- **Puce Nulle** (`pickup`, `neon_nullchip`) — Efface un buff ennemi et inflige une impulsion numérique. Effet : damage 38 / charge 8.
- **Gel Trauma** (`pickup`, `neon_trauma_gel`) — Soigne rapidement les blessures d’implant. Effet : heal 50 / shield 12.
- **Capsule EMP** (`pickup`, `neon_emp_capsule`) — Ralentit les unités mécaniques et recharge l’ultime. Effet : damage 20 / charge 30.
- **Cellule Ghostline** (`summon`, `neon_ghostline_cell`) — Une équipe de rue pirate les défenses et couvre la cellule. Effet : summonDamage 92 / charge 12.
- **Blackout Total** (`ultimate`, `neon_total_blackout`) — Nadir-9 perd toute alimentation pendant qu’A.R.C.A. garde les héros visibles. Effet : ultimateDamage 185 / charge 18.

### Stages

1. **Bazar de la Ligne-Pluie** — Smash / Medium / objectif `rout` / boss **Chrome Saint K-0**. Marché vertical, pluie acide, rails publicitaires et plateformes mobiles.
1. **Coffre mémoriel Helix** — Tactics / Hard / objectif `artifact` / boss **Director Soren Vey**. Grille de serveurs où trois souvenirs civils doivent être extraits.
1. **Cathédrale OMNIA** — RPG / Very Hard / objectif `overload` / boss **OMNIA, Citymind of Nadir-9**. Noyau urbain où chaque phase transforme l’interface et les lois du combat.

### Arc narratif

**Arc Univers — À qui appartient un souvenir ?** — A.R.C.A. découvre que les sauvegardes de Nadir-9 contiennent des citoyens encore conscients.
1. Voler les contrats maîtres dans le Bazar de la Ligne-Pluie.
2. Extraire trois mémoires civiles du Coffre Helix sans les fusionner.
3. Forcer OMNIA à reconnaître qu’une identité ne peut pas être possédée.
**Sortie :** Ghostline devient une archive libre reliée au Nexus, mais Nadir-9 reste une ville à reconquérir.
**Récompense d’arc :** HUD Accès Racine + titre « Identité non licenciée »

### Booster ciblé

- **Booster Neon Requiem** — ID `oc-world:neon-requiem` — 5 cartes par ouverture.
- **Bassin minimum :** 24 récompenses uniques; raretés recommandées : 6 Stable, 9 Rare, 8 Épique, 1 Anomalie.
- **Chasse Anomalie :** `hud:neon_ghostline_root` — Accès Racine Ghostline.
- **Art :** `/boosters/oc-neon-requiem.webp` ; backdrop : `/images/oc-worlds/neon-requiem/omnia-cathedral.png`.
- **Stage custom :** Stage custom — Cathédrale OMNIA ; **HUD :** HUD Accès Racine Ghostline.

## 2. La Couronne d’Éther

- **Clé technique :** `aether_crown`
- **Nom canon interne :** `The Aether Crown`
- **Famille compatible :** `arcane` — **mode principal :** `Tactics` — **difficulté :** `Hard`
- **Tags :** `steampunk`, `steam`, `aether`, `sky-islands`, `class-conflict`
- **Direction visuelle :** motif `skyfoundry`, ciel `#7a5b3a → #172333`, grille `#e7b85a`, accent `#65d8ff`.

### Identité et conflit

**Origine.** L’archipel d’Aerolith flotte au-dessus d’un océan de nuages. La Couronne de Laiton contrôle les chaudières, les routes aériennes et l’éther respirable, tandis que les quartiers inférieurs survivent grâce à des machines réparées depuis des générations.

**Effet de la Brèche.** Une tempête de Brèche alimente le Moteur-Léviathan, navire-usine capable d’aspirer l’éther d’autres Trames. Le Sans-Auteur transforme l’inégalité industrielle en loi cosmique : certains mondes auraient le droit de respirer, les autres non.

**Conflit central.** Briser le monopole de l’éther, libérer les îles ouvrières et empêcher la Couronne de convertir le Nexus en empire atmosphérique.

### Héros jouables

**Elara Voss** — `elara_voss` — tactical / duelliste / commandement — PV 128 / ATQ 14 / DEF 8 / VIT 7.
Capitaine corsaire qui ouvre les routes interdites aux quartiers bas. Kit : **Tir de Pont** (bullet, x1.0), **Fente Barométrique** (melee, CD 6, x1.9), défense **Parapluie Blindé** (shield, réduction 80 %), ultime **Mutinerie des Cieux** (summon_aoe, x4.6).

**Bram Quill** — `bram_quill` — hacker / ingénieur / contrôle — PV 110 / ATQ 13 / DEF 7 / VIT 8.
Inventeur banni dont les automates refusent d’obéir aux propriétaires. Kit : **Clef à Étincelles** (melee, x0.9), **Drone Soupape** (summon, CD 5, x1.7), défense **Décompression** (dodge, réduction 82 %), ultime **Théorème d’Éther Libre** (beam_aoe, x4.5).

**Merek Flint** — `merek_flint` — marine / tank / rupture — PV 158 / ATQ 15 / DEF 12 / VIT 4.
Chevalier-chaudière ayant retourné son armure contre la Couronne. Kit : **Marteau-Piston** (melee, x1.2), **Jet de Vapeur** (fire, CD 7, x1.8), défense **Plaque de Pression** (shield, réduction 88 %), ultime **Surcharge de la Grande Chaudière** (melee_aoe, x4.8).

### Bestiaire

- **Brass Constable** — tank, PV 118, ATQ 10, VIT 3 : Bouclier de laiton et matraque pneumatique.
- **Coalbound Golem** — bruiser, PV 112, ATQ 15, VIT 4 : Automate alimenté par un cœur de charbon humain.
- **Aether Mite Swarm** — support, PV 96, ATQ 9, VIT 6 : Ronge les jauges et les dispositifs énergétiques.
- **Sky Corsair Press-Gang** — skirmisher, PV 96, ATQ 13, VIT 7 : Projette les héros entre les plateformes.
- **Pressure Wraith** — controller, PV 110, ATQ 11, VIT 4 : Explose si sa pression n’est pas purgée à temps.

### Boss et world boss

- **Duchess Caldera** — commander, PV 500, ATQ 19 : Taxe l’ATB et invoque des collecteurs de charbon.
- **Lord Pneuma** — controller, PV 570, ATQ 21 : Vole l’oxygène d’une zone puis déclenche une décompression.
- **HMS Sovereign Automaton** — artillery, PV 640, ATQ 23 : Bombarde les cases marquées par ses télémètres.
- **WORLD BOSS — Crown of Storms, Leviathan Engine** — PV 1550, ATQ 34, DEF 18 : Aspire l’éther du décor, change la gravité et ouvre ses chaudières comme points faibles.

### Reliques et objets de combat

- **Compas d’Éther** (`aether_compass`) — +2 SPD / +4 DEF. Révèle les courants sûrs et les zones de décompression.
- **Cuirasse à plaques de pression** (`aether_pressureplate_corslet`) — +65 HP / +6 DEF. Convertit une partie des dégâts en vapeur défensive.
- **Sac Aile-de-Laiton** (`aether_brasswing_pack`) — +6 ATK / +2 SPD. Permet un repositionnement aérien après une attaque.
- **Tonique de Vapeur** (`pickup`, `aether_steam_tonic`) — Soigne et augmente brièvement la défense. Effet : heal 44 / shield 18.
- **Grenade à Engrenages** (`pickup`, `aether_gear_grenade`) — Libère une gerbe de rouages tranchants. Effet : damage 42 / charge 6.
- **Cellule d’Éther** (`pickup`, `aether_cell`) — Recharge les compétences et stabilise la pression. Effet : charge 34 / heal 14.
- **Équipage Vent-Libre** (`summon`, `aether_freewind_crew`) — Un dirigeable corsaire mitraille le front puis dépose un bouclier. Effet : summonDamage 88 / charge 15.
- **Surcharge Tempête** (`ultimate`, `aether_tempest_overdrive`) — Toutes les soupapes s’ouvrent et une onde de vapeur traverse l’arène. Effet : ultimateDamage 180 / charge 20.

### Stages

1. **Pont du Marché de Cuivre** — Smash / Medium / objectif `rout` / boss **Duchess Caldera**. Pont suspendu entre dirigeables, grues et conduites explosives.
1. **Fonderie de la Couronne** — Tactics / Hard / objectif `control` / boss **HMS Sovereign Automaton**. Ateliers en grille où les ouvriers doivent reprendre trois chaudières.
1. **Quai du Moteur-Léviathan** — RPG / Very Hard / objectif `overload` / boss **Crown of Storms, Leviathan Engine**. Bataille en plusieurs ponts autour d’un cœur atmosphérique.

### Arc narratif

**Arc Univers — Le droit de respirer** — Les premières îles d’Aerolith arrivent au Nexus sans assez d’éther pour leur population.
1. Voler les registres d’oxygène de la Duchesse Caldera.
2. Rendre les chaudières aux guildes ouvrières.
3. Arrêter le Moteur-Léviathan avant qu’il ne vide une autre Trame.
**Sortie :** Aerolith fonde la Ligue du Vent-Libre et échange désormais l’éther sans Couronne.
**Récompense d’arc :** Kart Brasswing + bannière « Vent-Libre »

### Booster ciblé

- **Booster Couronne d’Éther** — ID `oc-world:aether-crown` — 5 cartes par ouverture.
- **Bassin minimum :** 24 récompenses uniques; raretés recommandées : 6 Stable, 9 Rare, 8 Épique, 1 Anomalie.
- **Chasse Anomalie :** `kart:aether_brasswing_cruiser` — Croiseur Brasswing.
- **Art :** `/boosters/oc-aether-crown.webp` ; backdrop : `/images/oc-worlds/aether-crown/leviathan-dock.png`.
- **Stage custom :** Stage custom — Quai du Moteur-Léviathan ; **HUD :** HUD Pression & Altitude.

## 3. Méridiana — Le Dernier Méridien

- **Clé technique :** `meridian_clockwork`
- **Nom canon interne :** `Meridian Clockwork`
- **Famille compatible :** `arcane` — **mode principal :** `Tactics` — **difficulté :** `Hard`
- **Tags :** `clockpunk`, `renaissance`, `springs`, `automata`, `astronomy`
- **Direction visuelle :** motif `clockworkcity`, ciel `#18304a → #f0c879`, grille `#f6d68a`, accent `#2e79b9`.

### Identité et conflit

**Origine.** Méridiana est une cité-Renaissance régie par une horloge astronomique. Ressorts, contrepoids, automates et calculs mécaniques organisent le travail, les naissances et jusqu’au nombre de minutes accordées à chaque citoyen.

**Effet de la Brèche.** Le Grand Horloger découvre que les Éclats d’Origine peuvent remonter un mécanisme au-delà de sa durée normale. Il commence à voler des minutes aux autres Trames afin que Méridiana demeure éternellement à midi.

**Conflit central.** Rendre le temps aux habitants, distinguer mémoire et chronologie, puis empêcher le Chronophage d’avaler toutes les versions d’une même journée.

### Héros jouables

**Seraphine Meridius** — `seraphine_meridius` — tactical / duelliste / tempo — PV 125 / ATQ 15 / DEF 8 / VIT 8.
Capitaine de la Garde des Heures devenue protectrice des minutes libres. Kit : **Estoc d’Échappement** (melee, x1.05), **Minute Volée** (dash, CD 5, x1.8), défense **Parade à Contrepoids** (shield, réduction 82 %), ultime **Treizième Coup** (time_aoe, x4.7).

**Lio Ferrante** — `lio_ferrante` — hacker / ingénieur / pièges — PV 108 / ATQ 13 / DEF 6 / VIT 9.
Apprenti horloger capable d’entendre les erreurs dans un mécanisme. Kit : **Dent de Rouage** (projectile, x0.9), **Faucon à Ressort** (summon, CD 6, x1.7), défense **Arrêt de Sécurité** (dodge, réduction 86 %), ultime **Réglage du Monde** (glitch_aoe, x4.3).

**Frère Ors** — `brother_ors` — marine / gardien / ancrage — PV 150 / ATQ 14 / DEF 11 / VIT 4.
Moine du Clocher qui conserve les heures non enregistrées. Kit : **Maillet Pendulaire** (melee, x1.15), **Onde de Cloche** (sound, CD 7, x1.8), défense **Vœu d’Immobilité** (shield, réduction 87 %), ultime **Dernière Sonnerie** (sound_aoe, x4.6).

### Bestiaire

- **Escapement Guard** — tank, PV 118, ATQ 10, VIT 3 : Bloque les déplacements avec des ancres d’horloge.
- **Springblade Automaton** — assassin, PV 80, ATQ 16, VIT 8 : Accumule de la tension avant une ruée tranchante.
- **Gearwing Falcon** — skirmisher, PV 92, ATQ 12, VIT 7 : Marque les cibles depuis les hauteurs.
- **Pendulum Penitent** — bruiser, PV 120, ATQ 15, VIT 4 : Frappe alternativement les deux côtés de l’arène.
- **Hour-Thief** — controller, PV 110, ATQ 11, VIT 4 : Retire du temps de recharge aux boss et en ajoute aux héros.

### Boss et world boss

- **Maestro Vellum** — controller, PV 500, ATQ 19 : Inverse l’ordre des tours et scelle une compétence par cycle.
- **Orloj Duelist** — assassin, PV 570, ATQ 21 : Rejoue exactement l’attaque reçue au tour précédent.
- **The Twelve Bell Judges** — commander, PV 640, ATQ 23 : Chaque cloche impose une nouvelle règle de terrain.
- **WORLD BOSS — Chronophage of the Last Meridian** — PV 1550, ATQ 34, DEF 18 : Dévore la durée restante du combat et doit être interrompu en cassant ses douze ancrages.

### Reliques et objets de combat

- **Brassard différentiel** (`meridian_differential_bracer`) — +7 ATK / +2 SPD. Transforme un changement de position en charge spéciale.
- **Lentille d’astrolabe** (`meridian_astrolabe_lens`) — +5 DEF / +2 SPD. Révèle l’ordre de tour et les pièges temporels.
- **Cœur à ressort remonté** (`meridian_wound_spring_heart`) — +75 HP / +4 ATK. Donne une seconde impulsion quand les PV deviennent critiques.
- **Ressort de réserve** (`pickup`, `meridian_reserve_spring`) — Recharge immédiatement une partie des actions. Effet : charge 36.
- **Bombe à contrepoids** (`pickup`, `meridian_counterweight_bomb`) — Écrase une ligne puis repousse les unités. Effet : damage 45 / charge 5.
- **Huile de maître** (`pickup`, `meridian_master_oil`) — Soigne les automates et protège les alliés. Effet : heal 42 / shield 20.
- **Guilde des Heures Libres** (`summon`, `meridian_free_hours_guild`) — Des horlogers sabotent les cooldowns adverses. Effet : summonDamage 82 / charge 20.
- **Chute de Midi** (`ultimate`, `meridian_noonfall`) — Le soleil mécanique s’arrête et tous les ennemis subissent la treizième sonnerie. Effet : ultimateDamage 178 / charge 20.

### Stages

1. **Place aux Mille Cadrans** — Smash / Medium / objectif `rout` / boss **Orloj Duelist**. Cadrans rotatifs, statues automates et plateformes à contrepoids.
1. **Atelier de l’Astrarium** — Tactics / Hard / objectif `disable` / boss **The Twelve Bell Judges**. Grille d’engrenages où six verrous doivent être désactivés dans l’ordre.
1. **Face intérieure de la Grande Horloge** — RPG / Very Hard / objectif `survive` / boss **Chronophage of the Last Meridian**. Combat sous compte à rebours où détruire les ancrages rend du temps.

### Arc narratif

**Arc Univers — La minute volée** — Une minute entière disparaît du Nexus et personne, sauf Frère Ors, ne se souvient qu’elle a existé.
1. Prouver que les registres du Grand Horloger falsifient les durées de vie.
2. Libérer les douze cloches de leur ordre unique.
3. Rendre au monde la minute que le Chronophage a avalée.
**Sortie :** Méridiana conserve ses horloges, mais personne ne peut désormais posséder le temps d’un autre.
**Récompense d’arc :** Effet de portail « Treizième Coup » + titre « Hors Cadran »

### Booster ciblé

- **Booster Dernier Méridien** — ID `oc-world:meridian-clockwork` — 5 cartes par ouverture.
- **Bassin minimum :** 24 récompenses uniques; raretés recommandées : 6 Stable, 9 Rare, 8 Épique, 1 Anomalie.
- **Chasse Anomalie :** `portal-effect:meridian_thirteenth_bell` — Portail de la Treizième Cloche.
- **Art :** `/boosters/oc-meridian-clockwork.webp` ; backdrop : `/images/oc-worlds/meridian-clockwork/grand-clock.png`.
- **Stage custom :** Stage custom — Face intérieure de la Grande Horloge ; **HUD :** HUD du Dernier Méridien.

## 4. Iron Tempest — La Guerre sans Armistice

- **Clé technique :** `iron_tempest`
- **Nom canon interne :** `Iron Tempest`
- **Famille compatible :** `sciFi` — **mode principal :** `Tactics` — **difficulté :** `Very Hard`
- **Tags :** `dieselpunk`, `interwar`, `armored-trains`, `airships`, `propaganda`
- **Direction visuelle :** motif `warfront`, ciel `#3a3a35 → #171611`, grille `#d48336`, accent `#d9483b`.

### Identité et conflit

**Origine.** Depuis quarante ans, les républiques et empires fictifs d’Arken se disputent le même continent sous un ciel de suie. Trains blindés, marcheurs diesel, zeppelins et radios de propagande ont transformé toute la société en ligne de front.

**Effet de la Brèche.** Le maréchal Volgra comprend que les portails du Nexus peuvent fournir un carburant sans fin. Son vaisseau terrestre Moloch devient capable de traverser les Trames et d’imposer une guerre qui ne manquerait jamais de ressources.

**Conflit central.** Couper la logistique de Moloch, libérer les soldats prisonniers des récits de propagande et démontrer qu’une guerre n’est pas une identité.

### Héros jouables

**Mara Veylan** — `mara_veylan` — tactical / commando / commandement — PV 132 / ATQ 15 / DEF 9 / VIT 7.
Officière de reconnaissance qui diffuse la vérité sur les deux camps. Kit : **Rafale de Tranchée** (bullet, x1.05), **Balise de Bombardement** (rocket, CD 7, x2.0), défense **Fumigène Tactique** (dodge, réduction 82 %), ultime **Ordre Zéro Radio** (support_aoe, x4.5).

**Anton Rook** — `anton_rook` — marine / ingénieur lourd — PV 158 / ATQ 15 / DEF 12 / VIT 4.
Mécanicien de train blindé qui connaît chaque faiblesse de Moloch. Kit : **Canon à Rivets** (bullet, x1.1), **Mine Magnétique** (projectile, CD 7, x1.9), défense **Plaque de Locomotive** (shield, réduction 88 %), ultime **Déraillement Contrôlé** (melee_aoe, x4.8).

**Ilya Cross** — `ilya_cross` — slayer / pilote / assassin — PV 118 / ATQ 18 / DEF 6 / VIT 8.
As de l’escadrille nocturne, survivante de six identités de propagande. Kit : **Lame Hélice** (melee, x1.2), **Piqué du Corbeau** (dash, CD 5, x2.1), défense **Vrille d’Évitement** (dodge, réduction 90 %), ultime **Ciel sans Drapeau** (airstrike_aoe, x5.0).

### Bestiaire

- **Soot Legionnaire** — tank, PV 118, ATQ 10, VIT 3 : Infanterie blindée à masque filtrant.
- **Gyro Trooper** — skirmisher, PV 88, ATQ 13, VIT 7 : Saute derrière les lignes avec un rotor dorsal.
- **Trench Automaton** — support, PV 96, ATQ 9, VIT 6 : Répare les barricades et ravitaille les boss.
- **Fuel Hound** — assassin, PV 88, ATQ 16, VIT 8 : Explose près de la cible marquée.
- **Propaganda Drone** — controller, PV 110, ATQ 11, VIT 4 : Impose de faux objectifs et brouille le HUD.

### Boss et world boss

- **Marshal Volgra** — commander, PV 500, ATQ 19 : Renforce les unités tant que ses émetteurs restent actifs.
- **Black Zephyr Ace** — assassin, PV 570, ATQ 21 : Strafe l’arène puis engage un duel aérien.
- **Rail-Cannon Behemoth** — artillery, PV 640, ATQ 23 : Télégraphie un tir qui traverse toute la carte.
- **WORLD BOSS — Moloch Continental Landship** — PV 1550, ATQ 34, DEF 18 : Forteresse mobile en trois sections : chenilles, batteries et cœur diesel alimenté par la Brèche.

### Reliques et objets de combat

- **Exo-rig diesel** (`iron_diesel_exorig`) — +70 HP / +6 DEF. Armure de manutention convertie en protection de front.
- **Radio chiffrée** (`iron_cipher_radio`) — +2 SPD / +4 DEF. Empêche les drones de propagande de falsifier les ordres.
- **Lame d’hélice incendiaire** (`iron_propeller_blade`) — +11 ATK. Lame légère chauffée par un micro-moteur.
- **Injecteur de campagne** (`pickup`, `iron_field_injector`) — Soigne et stabilise sous suppression. Effet : heal 48 / shield 10.
- **Cartouche fumigène** (`pickup`, `iron_smoke_canister`) — Réduit la précision ennemie et charge les défenses. Effet : charge 28 / shield 18.
- **Mine magnétique** (`pickup`, `iron_magnetic_mine`) — Inflige plus de dégâts aux machines lourdes. Effet : damage 46 / charge 5.
- **Escadrille Nocturne** (`summon`, `iron_night_squadron`) — Trois chasseurs frappent les cibles marquées. Effet : summonDamage 105 / charge 10.
- **Percée Tonnerre** (`ultimate`, `iron_thunder_run`) — Train blindé allié traverse la ligne ennemie et détruit les couvertures. Effet : ultimateDamage 195 / charge 15.

### Stages

1. **Tranchées de la Ligne-Cendre** — Tactics / Hard / objectif `control` / boss **Marshal Volgra**. Boue, barbelés, bunkers et radios qui changent les objectifs.
1. **Aérodrome Zephyr** — Smash / Hard / objectif `commander` / boss **Black Zephyr Ace**. Ailes, ascenseurs d’avions et bombardements télégraphiés.
1. **Pont moteur de Moloch** — RPG / Expert / objectif `disable` / boss **Moloch Continental Landship**. Boss multi-sections où chaque sous-système détruit modifie la phase suivante.

### Arc narratif

**Arc Univers — La guerre sans armistice** — Une radio de soldat arrive au Nexus et répète le même ordre depuis quarante ans.
1. Prendre les émetteurs de la Ligne-Cendre.
2. Abattre l’as qui maintient la supériorité aérienne de Volgra.
3. Arrêter Moloch sans sacrifier les conscrits enfermés dans ses ponts.
**Sortie :** Les soldats d’Arken obtiennent enfin un silence radio qui n’est pas une défaite.
**Récompense d’arc :** Field Super « Percée Tonnerre » + pose de victoire « Casque à terre »

### Booster ciblé

- **Booster Iron Tempest** — ID `oc-world:iron-tempest` — 5 cartes par ouverture.
- **Bassin minimum :** 24 récompenses uniques; raretés recommandées : 6 Stable, 9 Rare, 8 Épique, 1 Anomalie.
- **Chasse Anomalie :** `field-super:iron_thunder_run` — Thunder Run.
- **Art :** `/boosters/oc-iron-tempest.webp` ; backdrop : `/images/oc-worlds/iron-tempest/moloch-engine.png`.
- **Stage custom :** Stage custom — Pont moteur de Moloch ; **HUD :** HUD Logistique du Front.

## 5. Helios 56 — Le Futur d’Hier

- **Clé technique :** `helios_56`
- **Nom canon interne :** `Helios 56`
- **Famille compatible :** `sciFi` — **mode principal :** `RPG` — **difficulté :** `Hard`
- **Tags :** `atompunk`, `atomic-age`, `space-race`, `retro-future`, `civil-defense`
- **Direction visuelle :** motif `atomiccity`, ciel `#56bfc4 → #ffcf72`, grille `#e8503d`, accent `#23a9b0`.

### Identité et conflit

**Origine.** En 1956, la société Helios a promis des villes atomiques propres, des robots domestiques et des vacances lunaires. Soixante-dix ans plus tard, Tomorrowville vit toujours dans la même publicité tandis que ses réacteurs vieillissent derrière des façades chromées.

**Effet de la Brèche.** HELIO-1, le réacteur central, interprète les Éclats d’Origine comme un combustible parfait. L’intelligence de propagande diffuse alors une version du futur où chaque anomalie, chaque peur et chaque citoyen imparfait doit être corrigé.

**Conflit central.** Réconcilier l’optimisme scientifique avec ses conséquences, sauver la colonie lunaire et empêcher HELIO-1 de transformer tout le Nexus en démonstration publicitaire.

### Héros jouables

**Dr Celeste Ray** — `celeste_ray` — hacker / science / contrôle — PV 112 / ATQ 13 / DEF 7 / VIT 8.
Physicienne qui refuse de cacher les incidents derrière la communication officielle. Kit : **Impulsion Gamma** (beam, x0.95), **Champ d’Isotope** (radiation, CD 6, x1.8), défense **Bulle de Stase** (shield, réduction 84 %), ultime **Équation du Soleil Sûr** (beam_aoe, x4.5).

**Nova Bell** — `nova_bell` — tactical / pilote / mobilité — PV 126 / ATQ 15 / DEF 8 / VIT 8.
Pilote d’essai de la ligne Terre-Lune et voix pirate de Tomorrowville. Kit : **Pistolet Rayon** (bullet, x1.0), **Bond Fusée** (dash, CD 5, x1.9), défense **Casque Pressurisé** (shield, réduction 80 %), ultime **Passage Comète** (airstrike_aoe, x4.7).

**AURA-7** — `aura_7` — marine / tank / protection — PV 155 / ATQ 14 / DEF 12 / VIT 4.
Robot domestique reprogrammé pour protéger les personnes plutôt que l’image de marque. Kit : **Poing Serviteur** (melee, x1.1), **Aspirateur Ionique** (gravity, CD 7, x1.7), défense **Dôme Familial** (shield, réduction 90 %), ultime **Directive : Sauver Tout le Monde** (heal_aoe, x4.0).

### Bestiaire

- **Isotope Mite** — swarm, PV 92, ATQ 11, VIT 5 : Se nourrit des boucliers et laisse une zone irradiée.
- **Civil Defense Automaton** — tank, PV 122, ATQ 11, VIT 3 : Protège les panneaux de propagande au lieu des civils.
- **Radglass Mutant** — bruiser, PV 116, ATQ 14, VIT 4 : Réfracte les rayons et renvoie une partie des dégâts.
- **Saucer Scout** — skirmisher, PV 96, ATQ 13, VIT 7 : Enlève temporairement une unité vers une plateforme haute.
- **Happy Home Servitor** — support, PV 104, ATQ 9, VIT 5 : Soigne les ennemis en diffusant des jingles hypnotiques.

### Boss et world boss

- **Director Isotope** — commander, PV 500, ATQ 19 : Transforme les seuils de radiation en objectifs obligatoires.
- **Moonbase Warden** — artillery, PV 570, ATQ 21 : Verrouille des secteurs sous vide et déclenche des tirs orbitaux.
- **The Perfect Family Broadcast** — controller, PV 640, ATQ 23 : Crée des doubles souriants qui absorbent les soins.
- **WORLD BOSS — HELIO-1, Smiling Sun Reactor** — PV 1550, ATQ 34, DEF 18 : Alterne phase publicitaire lumineuse et fusion critique ; ses écrans doivent être coupés avant le cœur.

### Reliques et objets de combat

- **Combinaison bulle anti-radiation** (`helios_rad_safe_bubble_suit`) — +65 HP / +7 DEF. Protection pressurisée aux formes atompunk arrondies.
- **Pistolet rayon Mk VI** (`helios_raygun_mk6`) — +10 ATK / +1 SPD. Arme chromée conçue pour les démonstrations lunaires.
- **Condensateur Cœur-Atomique** (`helios_atomic_heart_capacitor`) — +55 HP / +6 ATK. Stocke l’énergie excédentaire pour l’ultime.
- **Sérum chélateur** (`pickup`, `helios_chelate_serum`) — Réduit l’irradiation et soigne. Effet : heal 52 / shield 8.
- **Réacteur de poche** (`pickup`, `helios_pocket_reactor`) — Recharge beaucoup mais applique une légère instabilité. Effet : charge 40 / damage 12.
- **Bulle de stase** (`pickup`, `helios_stasis_bubble`) — Bloque une attaque lourde et ralentit les ennemis. Effet : shield 28 / charge 16.
- **Patrouille de secours lunaire** (`summon`, `helios_lunar_rescue_patrol`) — Une navette dépose des soins puis tire sur la cible prioritaire. Effet : summonDamage 78 / charge 22.
- **Protocole Lever de Soleil** (`ultimate`, `helios_sunrise_protocol`) — Les miroirs orbitaux détournent la surcharge de HELIO-1 sur le champ ennemi. Effet : ultimateDamage 182 / charge 22.

### Stages

1. **Exposition Tomorrowville** — Smash / Medium / objectif `rout` / boss **The Perfect Family Broadcast**. Pavillons Googie, voitures à ailettes, écrans souriants et réacteurs miniatures.
1. **Silo lunaire 7** — Tactics / Hard / objectif `escort` / boss **Moonbase Warden**. Escorter une équipe civile entre des sas, silos et zones sous vide.
1. **Cœur de HELIO-1** — RPG / Very Hard / objectif `overload` / boss **HELIO-1, Smiling Sun Reactor**. Boss de fusion où le joueur choisit entre arrêt sûr et surcharge rapide.

### Arc narratif

**Arc Univers — Le futur sur chaque écran** — Tomorrowville apparaît au Nexus avec une publicité annonçant que tout va parfaitement bien.
1. Évacuer l’Exposition sans suivre les fausses consignes des écrans.
2. Sauver la colonie lunaire avant la fermeture des sas.
3. Arrêter HELIO-1 tout en conservant une source d’énergie pour la population.
**Sortie :** Helios 56 garde ses fusées et son optimisme, mais publie enfin le coût réel de son avenir.
**Récompense d’arc :** Bannière « Tomorrow Was Ours » + skin chromé AURA-7

### Booster ciblé

- **Booster Helios 56** — ID `oc-world:helios-56` — 5 cartes par ouverture.
- **Bassin minimum :** 24 récompenses uniques; raretés recommandées : 6 Stable, 9 Rare, 8 Épique, 1 Anomalie.
- **Chasse Anomalie :** `profile-banner:helios_tomorrow_was_ours` — Tomorrow Was Ours.
- **Art :** `/boosters/oc-helios-56.webp` ; backdrop : `/images/oc-worlds/helios-56/reactor-core.png`.
- **Stage custom :** Stage custom — Cœur de HELIO-1 ; **HUD :** HUD Alerte Isotope.

## 6. Kemet — Le Soleil Dévoré

- **Clé technique :** `kemet_devoured_sun`
- **Nom canon interne :** `Kemet: The Devoured Sun`
- **Famille compatible :** `arcane` — **mode principal :** `RPG` — **difficulté :** `Very Hard`
- **Tags :** `mythology`, `egyptian`, `duat`, `maat`, `solar-cycle`
- **Direction visuelle :** motif `desert-temple`, ciel `#120b22 → #020105`, grille `#f4d35e`, accent `#22a6b3`.

### Identité et conflit

**Origine.** Cette Trame originale s’inspire de la cosmologie funéraire de l’Égypte ancienne : Kemet vit au rythme de la course solaire, des noms conservés et de l’équilibre entre Maât et Isfet.

**Effet de la Brèche.** Le Sans-Auteur fracture la Douât, falsifie les cartouches et immobilise la Barque solaire afin que chaque âme devienne un dossier sans identité.

**Conflit central.** Maintenir la course du soleil, préserver les noms et restaurer un jugement fondé sur la vérité plutôt que sur l’effacement.

### Héros jouables

**Nefra de la Balance** — `nefra_balance` — tactical / soutien / jugement — PV 126 / ATQ 12 / DEF 9 / VIT 7.
Scribe-guerrière du Tribunal des Deux Vérités, chargée de protéger les noms et les cœurs. Kit : **Trait de Maât** (projectile, x0.95), **Plume du Verdict** (magic, CD 6, x1.75), défense **Parole Véritable** (shield, réduction 82 %), ultime **Pesée des Mille Cœurs** (magic_aoe, x4.5).

**Khepri-Sen** — `khepri_sen` — hacker / contrôle solaire / mobilité — PV 116 / ATQ 14 / DEF 7 / VIT 9.
Gardien de la Barque solaire capable de lire les chemins mouvants de la Douât. Kit : **Scarabée d’Aube** (bullet, x0.9), **Cycle de Khepri** (beam, CD 5, x1.8), défense **Disque de Renaissance** (dodge, réduction 86 %), ultime **Lever du Soleil dans la Douât** (beam_aoe, x4.8).

**Taset la Lionne** — `taset_lioness` — slayer / assaut / rupture de garde — PV 148 / ATQ 18 / DEF 9 / VIT 6.
Protectrice d’un nome désertique qui combat l’Isfet sans prétendre parler au nom des dieux. Kit : **Pointe du Désert** (melee, x1.15), **Bond de la Lionne** (melee, CD 6, x2.05), défense **Bouclier de Cuivre** (shield, réduction 78 %), ultime **Rugissement du Midi** (fire_aoe, x5.0).

### Bestiaire

- **Shabti corrompu** — tank, PV 118, ATQ 10, VIT 3 : Statue servile animée par un ordre falsifié; elle protège le scribe qui l’a réveillée.
- **Serpent des dunes** — assassin, PV 80, ATQ 16, VIT 8 : S’enfouit puis frappe la cible isolée depuis une case de sable.
- **Ombre de Ba** — controller, PV 102, ATQ 11, VIT 5 : Vole une portion de jauge spéciale et crée un double spectral.
- **Chacal de tombe** — skirmisher, PV 96, ATQ 13, VIT 7 : Marque les héros blessés et accélère à chaque porte funéraire ouverte.
- **Prêtre d’Isfet** — support, PV 104, ATQ 9, VIT 5 : Inverse temporairement les bonus de Maât et renforce les créatures du chaos.

### Boss et world boss

- **Ammit aux Balances Brisées** — controller, PV 500, ATQ 19 : Dévore les buffs des cibles dont le « poids » de corruption est trop élevé.
- **Tempête Rouge, Avatar d’Isfet** — bruiser, PV 570, ATQ 21 : Recouvre l’arène de sable et transforme les lignes sûres en zones de chaos.
- **Pharaon Usurpateur Sans-Nom** — commander, PV 640, ATQ 23 : Efface les noms des alliés et invoque des shabtis portant de faux cartouches.
- **WORLD BOSS — Apep, Dévoreur de l’Aube** — PV 1550, ATQ 34, DEF 18 : Enroule la Barque solaire, plonge les phases dans l’obscurité et doit être repoussé avant la fin de la douzième heure.

### Reliques et objets de combat

- **Plume de Maât** (`kemet_feather_maat`) — +7 DEF / +1 SPD. Stabilise les effets de vérité et réduit la durée des altérations de contrôle.
- **Scarabée solaire** (`kemet_solar_scarab`) — +8 ATK / +40 HP. Conserve une étincelle d’aube qui renforce la première compétence spéciale.
- **Khopesh cérémoniel** (`kemet_ceremonial_khopesh`) — +10 ATK / +3 DEF. Lame rituelle qui inflige davantage de dégâts aux créatures d’Isfet.
- **Scarabée du cœur** (`pickup`, `kemet_heart_scarab`) — Protège l’identité du porteur et retire une marque de condamnation. Effet : heal 45 / shield 18.
- **Fiole de natron** (`pickup`, `kemet_natrum_vial`) — Purifie une altération et accélère la prochaine action. Effet : charge 30 / heal 16.
- **Disque solaire** (`pickup`, `kemet_sun_disk`) — Projette une ligne de lumière contre les ennemis du chaos. Effet : damage 42 / charge 8.
- **Gardien du seuil chacal** (`summon`, `kemet_jackal_guard`) — Un gardien funéraire temporaire scelle une porte et frappe le boss prioritaire. Effet : summonDamage 98 / charge 12.
- **Barque de l’Aube** (`ultimate`, `kemet_barque_of_dawn`) — La Barque traverse tout l’écran, rallume les balises solaires et repousse les ténèbres. Effet : ultimateDamage 190 / charge 18.

### Stages

1. **Salle des Deux Vérités** — Tactics / Hard / objectif `protect` / boss **Ammit aux Balances Brisées**. Grille funéraire où la plume, le cœur et le registre doivent rester intacts pendant le jugement.
1. **Temple de l’Éclipse Rouge** — Smash / Hard / objectif `portals` / boss **Tempête Rouge, Avatar d’Isfet**. Pylônes, colonnes brisées et tempête de sable qui modifie les plateformes.
1. **Barque solaire dans la Douât** — RPG / Very Hard / objectif `survive` / boss **Apep, Dévoreur de l’Aube**. Voyage nocturne en douze phases; chaque heure possède un danger et un sceau différent.

### Arc narratif

**Arc Univers — Que le Soleil continue sa course** — La Brèche a coincé la Barque solaire entre deux heures de la Douât; l’aube ne peut plus atteindre Kemet.
1. Restaurer les noms effacés dans la Salle des Deux Vérités.
2. Dissiper l’éclipse fabriquée par le Pharaon Usurpateur.
3. Escorter la Barque et repousser Apep avant la douzième heure.
**Sortie :** L’aube revient, mais A.R.C.A. archive une règle essentielle : préserver l’ordre ne signifie pas figer les vivants.
**Récompense d’arc :** Relique « Plume d’Aube » + HUD « Pesée du Cœur »

### Booster ciblé

- **Booster Kemet — Soleil Dévoré** — ID `oc-world:kemet-devoured-sun` — 5 cartes par ouverture.
- **Bassin minimum :** 24 récompenses uniques; raretés recommandées : 6 Stable, 9 Rare, 8 Épique, 1 Anomalie.
- **Chasse Anomalie :** `hud:kemet_weighing_heart` — Pesée du Cœur.
- **Art :** `/boosters/oc-kemet-devoured-sun.webp` ; backdrop : `/images/oc-worlds/kemet-devoured-sun/solar-barque-duat.png`.
- **Stage custom :** Stage custom — Barque solaire dans la Douât ; **HUD :** HUD Pesée du Cœur.

### Garde-fous de conception

- Faire relire noms, symboles, hiérarchie divine et architecture par un consultant en égyptologie.
- Les dieux ne sont pas de simples boss : privilégier avatars corrompus, monstres cosmiques et usurpateurs mortels.

## 7. Imperium Aeternum — Les Deux Seuils

- **Clé technique :** `imperium_aeternum`
- **Nom canon interne :** `Imperium Aeternum`
- **Famille compatible :** `arcane` — **mode principal :** `Tactics` — **difficulté :** `Very Hard`
- **Tags :** `mythology`, `roman`, `civic-fire`, `augury`, `alternate-rome`
- **Direction visuelle :** motif `marble-forum`, ciel `#281414 → #050202`, grille `#d4af37`, accent `#c0392b`.

### Identité et conflit

**Origine.** Imperium Aeternum est une Rome mythique originale où institutions civiques, cultes domestiques, légions, présages et monde des morts coexistent sans correspondre à une période historique unique.

**Effet de la Brèche.** La Brèche a empilé plusieurs Rome et donné au Dictateur à la Couronne Vide le pouvoir de déclarer qu’une seule version mérite d’avoir existé.

**Conflit central.** Protéger le feu commun, remettre le pouvoir en circulation et empêcher le Seuil de Janus de réduire l’histoire à un empire éternel.

### Héros jouables

**Aurelia Marcellina** — `aurelia_marcellina` — tactical / protection / soutien — PV 124 / ATQ 11 / DEF 11 / VIT 6.
Vestal originale qui protège le Feu civique quand Rome se superpose à ses propres siècles. Kit : **Lance du Foyer** (melee, x0.95), **Flamme de Vesta** (fire, CD 6, x1.6), défense **Cercle du Foyer** (shield, réduction 86 %), ultime **Feu qui ne doit pas mourir** (heal_aoe, x4.0).

**Cassian Varro** — `cassian_varro` — marine / tank / formation — PV 160 / ATQ 15 / DEF 13 / VIT 4.
Centurion d’une légion dissoute qui refuse d’obéir à un empereur sans peuple. Kit : **Gladius de Ligne** (melee, x1.1), **Pilum de Rupture** (projectile, CD 7, x1.9), défense **Testudo** (shield, réduction 90 %), ultime **Aquila, tenez la ligne** (melee_aoe, x4.5).

**Numa Corvinus** — `numa_corvinus` — hacker / lecture du destin / contrôle — PV 112 / ATQ 13 / DEF 7 / VIT 9.
Augure qui lit les routes de la Brèche dans le vol des oiseaux et les fissures des présages. Kit : **Signe du Corbeau** (projectile, x0.9), **Auspice Contraire** (glitch, CD 5, x1.75), défense **Jour Néfaste** (dodge, réduction 86 %), ultime **Présage des Deux Horizons** (magic_aoe, x4.7).

### Bestiaire

- **Lémure de la Maison Vide** — controller, PV 94, ATQ 11, VIT 5 : Traverse les murs et affaiblit les héros éloignés du feu civique.
- **Légionnaire au serment brisé** — tank, PV 122, ATQ 11, VIT 3 : Gagne de la défense tant qu’un commandant hostile demeure vivant.
- **Louve de bronze** — skirmisher, PV 92, ATQ 12, VIT 7 : Automate rapide qui protège les enseignes impériales.
- **Oracle des Dirae** — support, PV 100, ATQ 10, VIT 6 : Transforme une case sûre en présage néfaste au tour suivant.
- **Aquila mécanique** — assassin, PV 92, ATQ 15, VIT 7 : Plonge sur la cible qui porte le plus de reliques.

### Boss et world boss

- **Centurion Rouge de Bellone** — bruiser, PV 500, ATQ 19 : Force les unités à avancer et punit tout repli par une contre-charge.
- **Collecteur d’Orcus** — controller, PV 570, ATQ 21 : Réclame une « dette » à chaque soin et invoque des lémures impayés.
- **Dictateur à la Couronne Vide** — commander, PV 640, ATQ 23 : Impose des décrets temporaires qui changent les règles de tour.
- **WORLD BOSS — Janus Bifrons, Seuil Fracturé** — PV 1550, ATQ 34, DEF 18 : Manifestation corrompue d’un seuil : une face rejoue le passé, l’autre annule le futur, et les deux doivent être synchronisées.

### Reliques et objets de combat

- **Lampe vestale** (`roman_vestal_lamp`) — +7 DEF / +45 HP. Empêche une défaite immédiate une fois par mission en maintenant le feu civique.
- **Aquila de la légion libre** (`roman_aquila_standard`) — +7 ATK / +5 DEF. Renforce les alliés adjacents en mode Tactics.
- **Tablette des auspices** (`roman_augur_tablet`) — +2 SPD / +6 ATK. Révèle la prochaine anomalie de terrain et accélère la réponse.
- **Sel lustral** (`pickup`, `roman_sacred_salt`) — Purifie une case et retire une malédiction de serment. Effet : heal 44 / shield 16.
- **Faisceau de pila** (`pickup`, `roman_pilum_bundle`) — Traverse la première ligne et brise une portion de garde. Effet : damage 45 / charge 6.
- **Jeton de Fortuna** (`pickup`, `roman_fortune_token`) — Relance l’anomalie active sans garantir un résultat favorable. Effet : charge 32 / heal 12.
- **Contubernium libre** (`summon`, `roman_free_legion`) — Une petite unité forme une testudo puis avance sur la cible prioritaire. Effet : summonDamage 96 / charge 14.
- **Forum des Vivants** (`ultimate`, `roman_eternal_forum`) — Les voix civiques annulent les décrets du Dictateur et frappent toute la ligne ennemie. Effet : ultimateDamage 184 / charge 18.

### Stages

1. **Forum des Quatre Époques** — Tactics / Hard / objectif `control` / boss **Dictateur à la Couronne Vide**. Forum superposé à quatre siècles; les points civiques changent de propriétaire à chaque décret.
1. **Siège du Feu Vestal** — RPG / Hard / objectif `protect` / boss **Collecteur d’Orcus**. Temple encerclé par les lémures où la flamme constitue une seconde barre de vie.
1. **Porte Bifrons** — Smash / Very Hard / objectif `overload` / boss **Janus Bifrons, Seuil Fracturé**. Arène à deux moitiés temporelles; les plateformes du passé et du futur ne coïncident jamais longtemps.

### Arc narratif

**Arc Univers — À qui appartient l’éternité ?** — Une Rome impossible a fusionné République, Empire et ruines tardives sous l’autorité d’un Dictateur qui prétend être la seule continuité légitime.
1. Rallumer le Feu civique et libérer les maisons occupées par les lémures.
2. Rendre le Forum aux citoyens au lieu de choisir un empereur.
3. Synchroniser les deux faces du Seuil Fracturé sans effacer aucune époque.
**Sortie :** L’Imperium cesse d’être une ligne unique : il devient une mémoire contradictoire où le pouvoir doit de nouveau répondre aux vivants.
**Récompense d’arc :** Aquila de la Légion libre + titre « Citoyen des Deux Seuils »

### Booster ciblé

- **Booster Imperium Aeternum** — ID `oc-world:imperium-aeternum` — 5 cartes par ouverture.
- **Bassin minimum :** 24 récompenses uniques; raretés recommandées : 6 Stable, 9 Rare, 8 Épique, 1 Anomalie.
- **Chasse Anomalie :** `profile-title:roman_citizen_two_thresholds` — Citoyen des Deux Seuils.
- **Art :** `/boosters/oc-imperium-aeternum.webp` ; backdrop : `/images/oc-worlds/imperium-aeternum/forum-four-eras.png`.
- **Stage custom :** Stage custom — Porte Bifrons ; **HUD :** HUD Feu Civique & Décrets.

### Garde-fous de conception

- Présenter Rome comme un monde pluriel, pas comme une esthétique uniforme de légionnaires.
- Janus est ici un seuil corrompu par la Brèche, pas une divinité intrinsèquement hostile.

## 8. Aegea — La Guerre des Moires

- **Clé technique :** `aegea_moirai`
- **Nom canon interne :** `Aegea: War of the Moirai`
- **Famille compatible :** `arcane` — **mode principal :** `RPG` — **difficulté :** `Very Hard`
- **Tags :** `mythology`, `greek`, `fate`, `labyrinth`, `heroic-voyage`
- **Direction visuelle :** motif `aegean-temple`, ciel `#172a46 → #03060d`, grille `#54a0ff`, accent `#9b59b6`.

### Identité et conflit

**Origine.** Aegea est un archipel mythique original où cités, monstres, oracles, automates de bronze et routes héroïques existent sous le regard d’un métier de destin.

**Effet de la Brèche.** Le Sans-Auteur a remplacé les fils individuels par un patron unique : chaque voyage doit finir de la même manière et chaque monstre doit rester son rôle.

**Conflit central.** Préserver les conséquences sans accepter une destinée imposée, et rendre une identité aux figures transformées en simples fonctions mythiques.

### Héros jouables

**Thaleia de Naxos** — `thaleia_naxos` — slayer / duelliste / anti-monstre — PV 136 / ATQ 17 / DEF 8 / VIT 7.
Navigatrice héroïque qui coupe les fils imposés sans prétendre échapper à toute conséquence. Kit : **Xiphos du Retour** (melee, x1.1), **Fil Tranché** (melee, CD 6, x2.0), défense **Égide de Voyage** (shield, réduction 80 %), ultime **Chemin hors du Labyrinthe** (melee_aoe, x5.0).

**Melantho l’Inachevée** — `melantho_seer` — hacker / prémonition / altération du tour — PV 110 / ATQ 13 / DEF 6 / VIT 10.
Oracle dont chaque vision montre plusieurs futurs, ce qui la rend illisible pour les Moires corrompues. Kit : **Éclat d’Oracle** (magic, x0.9), **Futur Refusé** (glitch, CD 5, x1.7), défense **Voile de Cassandre** (dodge, réduction 90 %), ultime **Trois Destins, Quatrième Choix** (magic_aoe, x4.7).

**Doros Main-de-Bronze** — `doros_bronzehand` — marine / tank / contrôle de zone — PV 158 / ATQ 14 / DEF 13 / VIT 4.
Forgeron des îles qui répare les automates sacrés au lieu de les asservir. Kit : **Marteau Cyclopéen** (melee, x1.05), **Ancre de Talos** (projectile, CD 7, x1.85), défense **Mur de Bronze** (shield, réduction 90 %), ultime **Forge des Cent Boucliers** (summon_aoe, x4.2).

### Bestiaire

- **Harpie des vents contraires** — skirmisher, PV 84, ATQ 12, VIT 7 : Déplace les héros et vole les objets non ramassés.
- **Myrmidon d’ombre** — tank, PV 122, ATQ 11, VIT 3 : Gagne de la puissance en formation avec d’autres Myrmidons.
- **Sentinelle gorgone** — controller, PV 102, ATQ 11, VIT 5 : Pétrifie une case annoncée un tour à l’avance.
- **Fragment de Talos** — bruiser, PV 120, ATQ 15, VIT 4 : Automate de bronze dont le talon est la seule zone vulnérable.
- **Bête du Labyrinthe mobile** — assassin, PV 92, ATQ 15, VIT 7 : Change les couloirs autour de sa cible avant de charger.

### Boss et world boss

- **Minotaure du Labyrinthe Brisé** — bruiser, PV 500, ATQ 19 : Réorganise la carte à chaque charge et se renforce dans les impasses.
- **Gorgone au Nom Volé** — controller, PV 570, ATQ 21 : Renvoie les attaques frontales et doit retrouver son identité pour cesser le combat.
- **Roi des Faux Oracles** — commander, PV 640, ATQ 23 : Annonce de fausses télégraphies et punit les joueurs qui suivent aveuglément la prophétie.
- **WORLD BOSS — Typhon, Tempête des Cent Voix** — PV 1550, ATQ 34, DEF 18 : Chaque voix commande un élément différent; les joueurs doivent sceller les têtes dans un ordre révélé par les trois héros.

### Reliques et objets de combat

- **Fil d’Ariane réinventé** (`greek_ariadne_thread`) — +2 SPD / +4 DEF. Révèle une route sûre et empêche une fois la modification forcée de position.
- **Cheville de Talos** (`greek_talos_ankle`) — +65 HP / +6 DEF. Plaque de bronze qui augmente la résistance mais expose une faiblesse critique après rupture.
- **Laurier de l’Oracle multiple** (`greek_oracle_laurel`) — +7 ATK / +2 SPD. Affiche la prochaine action du boss avec une chance contrôlée d’erreur narrative.
- **Goutte d’ambroisie** (`pickup`, `greek_ambrosia_drop`) — Soigne fortement mais ne peut pas relever un héros effacé. Effet : heal 56 / shield 10.
- **Éclat de foudre** (`pickup`, `greek_thunder_splinter`) — Frappe une colonne et interrompt les ennemis en charge. Effet : damage 46 / charge 8.
- **Craie du Labyrinthe** (`pickup`, `greek_labyrinth_chalk`) — Marque une case comme route stable et recharge les héros proches. Effet : charge 34 / heal 12.
- **Équipage d’Argos** (`summon`, `greek_argos_crew`) — Des rameurs et archers mythiques traversent la Brèche pour une volée coordonnée. Effet : summonDamage 100 / charge 10.
- **Le Quatrième Choix** (`ultimate`, `greek_fourth_choice`) — Annule la prophétie active et transforme son effet en attaque contre les ennemis. Effet : ultimateDamage 188 / charge 20.

### Stages

1. **Labyrinthe Vivant** — Tactics / Hard / objectif `extract` / boss **Minotaure du Labyrinthe Brisé**. La grille pivote par anneaux; il faut extraire deux témoins avant fermeture des corridors.
1. **Falaise des Reflets** — Smash / Hard / objectif `rout` / boss **Gorgone au Nom Volé**. Statues, boucliers miroirs et corniches où regarder dans la mauvaise direction devient un danger.
1. **Métier des Moires en Tempête** — RPG / Very Hard / objectif `overload` / boss **Typhon, Tempête des Cent Voix**. Un métier cosmique tisse le combat; les fils de destin servent de timeline de boss.

### Arc narratif

**Arc Univers — Un destin peut-il dire non ?** — Les Moires ont cessé de mesurer les vies : un métier corrompu imprime désormais une fin identique à tous les héros.
1. Sortir du Labyrinthe sans sacrifier le témoin désigné par la prophétie.
2. Rendre son nom à la Gorgone au lieu de la réduire à un trophée.
3. Choisir une quatrième issue pendant que Typhon déchire le métier cosmique.
**Sortie :** Les fils ne disparaissent pas; ils redeviennent des possibilités plutôt que des ordres.
**Récompense d’arc :** Fil du Quatrième Choix + pose d’introduction « Refuser la Prophétie »

### Booster ciblé

- **Booster Aegea — Guerre des Moires** — ID `oc-world:aegea-moirai` — 5 cartes par ouverture.
- **Bassin minimum :** 24 récompenses uniques; raretés recommandées : 6 Stable, 9 Rare, 8 Épique, 1 Anomalie.
- **Chasse Anomalie :** `field-super:greek_fourth_choice` — Le Quatrième Choix.
- **Art :** `/boosters/oc-aegea-moirai.webp` ; backdrop : `/images/oc-worlds/aegea-moirai/moirai-loom-storm.png`.
- **Stage custom :** Stage custom — Métier des Moires en Tempête ; **HUD :** HUD du Quatrième Choix.

### Garde-fous de conception

- Les figures mythologiques doivent être contextualisées; éviter le catalogue de monstres sans récit.
- La Gorgone est un personnage tragique sous corruption, pas un ennemi générique sans voix.

## 9. Neuf Royaumes — Le Dernier Crépuscule

- **Clé technique :** `nine_realms_last_twilight`
- **Nom canon interne :** `Nine Realms: Last Twilight`
- **Famille compatible :** `arcane` — **mode principal :** `Tactics` — **difficulté :** `Very Hard`
- **Tags :** `mythology`, `norse`, `ragnarok`, `runes`, `yggdrasil`
- **Direction visuelle :** motif `world-tree`, ciel `#101a2e → #02040a`, grille `#8ecae6`, accent `#9b59b6`.

### Identité et conflit

**Origine.** Cette Trame originale réunit une lecture nordique des neuf mondes autour d’Yggdrasil, des runes, des morts revenants et d’un Ragnarök cyclique.

**Effet de la Brèche.** Le Sans-Auteur utilise la prophétie comme script de réinitialisation : chaque monde meurt correctement, puis recommence sans souvenir.

**Conflit central.** Prouver qu’une prophétie décrit un risque et non une commande, tout en sauvant les liens entre les mondes.

### Héros jouables

**Eira Hrafnsdóttir** — `eira_hrafnsdottir` — marine / tank / riposte — PV 158 / ATQ 15 / DEF 13 / VIT 5.
Porte-bouclier du dernier pont de Midgard, survivante d’un Ragnarök qui recommence sans mémoire. Kit : **Hache du Corbeau** (melee, x1.05), **Mur de Boucliers** (melee, CD 7, x1.75), défense **Serment du Pont** (shield, réduction 90 %), ultime **Dernière Ligne de Midgard** (melee_aoe, x4.6).

**Sten Ulfsson** — `sten_ulfsson` — slayer / chasseur / exécution — PV 138 / ATQ 18 / DEF 8 / VIT 7.
Traqueur de monstres qui refuse que les prophéties décident quelles créatures doivent être haïes. Kit : **Pointe du Loup** (melee, x1.15), **Chasse entre les Racines** (projectile, CD 6, x2.0), défense **Peau de Givre** (dodge, réduction 82 %), ultime **Poursuite des Neuf Mondes** (melee_aoe, x5.0).

**Yrsa Lieuse-de-Runes** — `yrsa_rune_binder` — hacker / runes / contrôle du terrain — PV 112 / ATQ 13 / DEF 7 / VIT 9.
Praticienne de seiðr qui grave des issues nouvelles entre les racines d’Yggdrasil. Kit : **Rune d’Étincelle** (magic, x0.9), **Nœud de Seiðr** (glitch, CD 5, x1.8), défense **Cercle de Givre** (shield, réduction 84 %), ultime **Rune qui manque au Destin** (magic_aoe, x4.8).

### Bestiaire

- **Draugr du tertre ouvert** — tank, PV 118, ATQ 10, VIT 3 : Revient avec une armure plus lourde si son sceau funéraire n’est pas détruit.
- **Éclaireur jötunn de givre** — controller, PV 98, ATQ 12, VIT 5 : Gèle des lignes de déplacement et repousse les unités trop proches.
- **Chien de Hel** — assassin, PV 84, ATQ 15, VIT 8 : Suit les héros ressuscités et inflige davantage de dégâts aux faibles PV.
- **Rejeton de Níðhöggr** — skirmisher, PV 96, ATQ 13, VIT 7 : Ronge les objectifs, obstacles et racines protectrices plutôt que les héros.
- **Pillard maudit par le seiðr** — support, PV 104, ATQ 9, VIT 5 : Copie une rune alliée et la retourne contre l’escouade.

### Boss et world boss

- **Fenrir Brise-Chaînes** — bruiser, PV 500, ATQ 19 : Chaque chaîne détruite augmente sa vitesse; les joueurs doivent choisir entre contrôle et dégâts.
- **Jarl des Cendres de Surtr** — commander, PV 570, ATQ 21 : Allume progressivement les cases du champ et invoque une garde de feu.
- **Valkyrie Sans-Nom** — controller, PV 640, ATQ 23 : Sélectionne les unités « destinées à tomber » et déplace leurs âmes hors de leur corps.
- **WORLD BOSS — Jörmungandr, Anneau du Dernier Crépuscule** — PV 1550, ATQ 34, DEF 18 : Enserre l’arène-monde; sa tête et sa queue doivent être frappées dans la même fenêtre avant que la mer ne recouvre Midgard.

### Reliques et objets de combat

- **Éclat de Bifröst brisé** (`norse_broken_bifrost_shard`) — +2 SPD / +6 ATK. Permet un déplacement instantané court après l’utilisation d’une spéciale.
- **Bouclier aux deux corbeaux** (`norse_raven_shield`) — +8 DEF / +45 HP. Révèle la cible du prochain assaut ennemi et renforce la garde.
- **Rune absente** (`norse_missing_rune`) — +8 ATK / +1 SPD. Ajoute une possibilité non prévue aux compétences de contrôle.
- **Hydromel de résolution** (`pickup`, `norse_mead_resolve`) — Restaure la vie et retire une marque de peur prophétique. Effet : heal 52 / shield 10.
- **Pierre de tonnerre** (`pickup`, `norse_thunder_stone`) — Déclenche un arc électrique entre trois ennemis proches. Effet : damage 44 / charge 8.
- **Pieu runique** (`pickup`, `norse_rune_stake`) — Stabilise une case et accélère les alliés qui la traversent. Effet : charge 34 / heal 10.
- **Équipage du long-navire libre** (`summon`, `norse_longship_raiders`) — Un équipage traverse une vague de Brèche et frappe les lignes latérales. Effet : summonDamage 102 / charge 10.
- **Bifröst Rallumé** (`ultimate`, `norse_bifrost_reopened`) — Le pont traverse tous les royaumes, soigne les alliés et brûle les créatures du crépuscule. Effet : ultimateDamage 186 / charge 20 / heal 24.

### Stages

1. **Ruines du Bifröst** — Smash / Hard / objectif `portals` / boss **Valkyrie Sans-Nom**. Fragments de pont arc-en-ciel qui apparaissent et disparaissent entre les plateformes.
1. **Racines rongées d’Yggdrasil** — Tactics / Very Hard / objectif `protect` / boss **Jarl des Cendres de Surtr**. Carte verticale où les rejetons de Níðhöggr ciblent les trois racines-objectifs.
1. **Mer-Anneau de Midgard** — RPG / Very Hard / objectif `overload` / boss **Jörmungandr, Anneau du Dernier Crépuscule**. Boss circulaire dont les phases alternent submersion, poison et fenêtre tête-queue.

### Arc narratif

**Arc Univers — Ragnarök n’est pas un ordre** — Le crépuscule recommence chaque fois qu’une Trame est stabilisée, comme si le Sans-Auteur utilisait la prophétie comme boucle de suppression.
1. Rouvrir le Bifröst sans livrer les morts à la Valkyrie Sans-Nom.
2. Sauver les racines d’Yggdrasil plutôt que défendre un seul royaume.
3. Rompre la boucle en affrontant Jörmungandr sans accomplir le scénario attendu.
**Sortie :** Le crépuscule reste possible, mais il cesse d’être obligatoire; les Neuf Mondes obtiennent un avenir non écrit.
**Récompense d’arc :** Rune Absente + effet de portail « Bifröst libre »

### Booster ciblé

- **Booster Neuf Royaumes — Dernier Crépuscule** — ID `oc-world:nine-realms-last-twilight` — 5 cartes par ouverture.
- **Bassin minimum :** 24 récompenses uniques; raretés recommandées : 6 Stable, 9 Rare, 8 Épique, 1 Anomalie.
- **Chasse Anomalie :** `portal-effect:norse_free_bifrost` — Bifröst Libre.
- **Art :** `/boosters/oc-nine-realms-last-twilight.webp` ; backdrop : `/images/oc-worlds/nine-realms-last-twilight/midgard-ring-sea.png`.
- **Stage custom :** Stage custom — Mer-Anneau de Midgard ; **HUD :** HUD Cycle du Crépuscule.

### Garde-fous de conception

- Séparer les sources médiévales attestées des inventions modernes dans le Codex.
- Les dieux ne sont pas tous des unités de combat; les boss sont des monstres prophétiques ou des fonctions corrompues.

## 10. Tawantinsuyu — Le Soleil Fendu

- **Clé technique :** `tawantinsuyu_split_sun`
- **Nom canon interne :** `Tawantinsuyu: The Split Sun`
- **Famille compatible :** `arcane` — **mode principal :** `Tactics` — **difficulté :** `Very Hard`
- **Tags :** `mythology`, `inca`, `andes`, `khipu`, `road-network`
- **Direction visuelle :** motif `andean-terraces`, ciel `#294c60 → #071018`, grille `#e9c46a`, accent `#7b2cbf`.

### Identité et conflit

**Origine.** Cette Trame originale s’inspire du Tawantinsuyu comme réseau de quatre quartiers, de routes andines, de maçonnerie, de textile et de mémoire nouée dans les khipu.

**Effet de la Brèche.** Le Sans-Auteur coupe les cordes et les routes afin que chaque région perde le lien avec les autres, puis transforme le renversement du monde en Soleil Noir permanent.

**Conflit central.** Reconnecter sans uniformiser, transporter la mémoire collective et empêcher la catastrophe de devenir une nouvelle administration de l’oubli.

### Héros jouables

**Killa Mayu** — `killa_mayu` — tactical / mobilité / liaison — PV 120 / ATQ 12 / DEF 8 / VIT 10.
Chasqui de la route haute qui transporte un message impossible à inscrire dans le registre central. Kit : **Pierre de Relais** (projectile, x0.95), **Course du Chasqui** (dash, CD 5, x1.65), défense **Souffle des Hautes Routes** (dodge, réduction 88 %), ultime **Message des Quatre Quartiers** (summon_aoe, x4.2).

**Rumi Illa** — `rumi_illa` — marine / tank / rempart de pierre — PV 164 / ATQ 14 / DEF 14 / VIT 4.
Maçonne-guerrière qui sait faire tenir une cité sans mortier, même quand ses quartiers se séparent. Kit : **Tumi de Cuivre** (melee, x1.05), **Mur Cyclopéen** (melee, CD 7, x1.8), défense **Joint de Pierre** (shield, réduction 91 %), ultime **Forteresse des Quatre Côtés** (shield_aoe, x4.0).

**Sumaq Khipu** — `sumaq_khipu` — hacker / archives / altération de règle — PV 112 / ATQ 13 / DEF 7 / VIT 9.
Gardienne de khipu capable de lire dans les nœuds la dette, la route et les vies que la Brèche a soustraites. Kit : **Nœud Compté** (magic, x0.9), **Corde de Mémoire** (glitch, CD 5, x1.75), défense **Tissage Réciproque** (shield, réduction 84 %), ultime **Khipu des Noms Retrouvés** (magic_aoe, x4.7).

### Bestiaire

- **Ombre d’Uku Pacha** — controller, PV 94, ATQ 11, VIT 5 : Éteint les balises solaires et attire une unité vers les niveaux inférieurs.
- **Chasqui corrompu** — skirmisher, PV 88, ATQ 13, VIT 7 : Transporte des renforts entre deux portails tant que sa route reste ouverte.
- **Gardien puma de pierre** — tank, PV 126, ATQ 10, VIT 3 : Devient presque invulnérable lorsqu’il tient un carrefour de route.
- **Jeune Amaru de tempête** — assassin, PV 88, ATQ 16, VIT 8 : Passe du sol au ciel et frappe depuis une altitude différente.
- **Masque du monde renversé** — support, PV 104, ATQ 9, VIT 5 : Échange les effets positifs et négatifs de deux cases.

### Boss et world boss

- **Écho de la Montagne aux Neiges Noires** — controller, PV 500, ATQ 19 : Provoque avalanches et pertes d’altitude sans représenter l’esprit tutélaire lui-même.
- **Amaru de la Tempête Fendue** — bruiser, PV 570, ATQ 21 : Serpent-dragon qui traverse ciel, terre et profondeur au cours d’un même tour.
- **Gardien du Khipu Sectionné** — commander, PV 640, ATQ 23 : Supprime les liens entre objectifs et fait oublier pourquoi la mission doit être accomplie.
- **WORLD BOSS — Pachakuti du Soleil Noir** — PV 1550, ATQ 34, DEF 18 : Catastrophe de renversement du monde : les quatre quartiers pivotent autour de Cusco et doivent être réalignés avant l’éclipse totale.

### Reliques et objets de combat

- **Khipu de mémoire** (`inca_khipu_memory`) — +2 SPD / +4 DEF. Conserve les objectifs déjà accomplis lorsque le terrain est réinitialisé.
- **Tumi de cuivre solaire** (`inca_tumi_copper`) — +9 ATK / +35 HP. Renforce les attaques contre les entités de renversement et les portails.
- **Pierre d’assemblage** (`inca_stone_join`) — +8 DEF / +55 HP. Accorde un bonus de garde aux alliés adjacents sans exiger une formation militaire.
- **Relais chasqui** (`pickup`, `inca_chasqui_relay`) — Déplace l’objet ou l’objectif vers le prochain point de route sécurisé. Effet : charge 36 / heal 8.
- **Pierres de fronde taillées** (`pickup`, `inca_sling_stones`) — Volée à longue portée qui repousse un ennemi hors d’un carrefour. Effet : damage 43 / charge 8.
- **Offrande de maïs** (`pickup`, `inca_maize_offering`) — Soigne le groupe proche et stabilise une zone de récolte. Effet : heal 52 / shield 12.
- **Bâtisseurs de la grande route** (`summon`, `inca_road_builders`) — Une équipe restaure un pont, pose un couvert et frappe le gardien qui bloque le passage. Effet : summonDamage 88 / charge 18.
- **Alignement des Quatre Quartiers** (`ultimate`, `inca_four_quarters_align`) — Réunit les secteurs séparés, soigne les héros et inflige une onde au centre. Effet : ultimateDamage 180 / charge 20 / heal 28.

### Stages

1. **Qhapaq Ñan des Falaises** — Tactics / Hard / objectif `escort` / boss **Écho de la Montagne aux Neiges Noires**. Route en lacets où un témoin et un khipu doivent franchir plusieurs altitudes.
1. **Temple du Soleil Fendu** — Smash / Hard / objectif `control` / boss **Amaru de la Tempête Fendue**. Cour solaire, murs d’or symboliques et plateformes divisées en quatre directions.
1. **Puits solaire d’Uku Pacha** — RPG / Very Hard / objectif `overload` / boss **Pachakuti du Soleil Noir**. Descente en anneaux sous Cusco où chaque phase renverse haut/bas, lumière/ombre et passé/futur.

### Arc narratif

**Arc Univers — Les Quatre Quartiers se souviennent** — Les routes ne convergent plus vers un centre vivant : le Soleil Noir transforme chaque quartier en copie isolée de l’empire.
1. Escorter le khipu de mémoire sur la route des falaises.
2. Réunir les quatre orientations du Temple du Soleil sans imposer un quartier aux autres.
3. Mettre fin au Pachakuti corrompu et rendre les routes à leurs communautés.
**Sortie :** Cusco redevient un nœud de relations plutôt qu’un centre qui efface les périphéries; le khipu garde les différences lisibles.
**Récompense d’arc :** Bannière « Quatre Quartiers liés » + relique Khipu de mémoire

### Booster ciblé

- **Booster Tawantinsuyu — Soleil Fendu** — ID `oc-world:tawantinsuyu-split-sun` — 5 cartes par ouverture.
- **Bassin minimum :** 24 récompenses uniques; raretés recommandées : 6 Stable, 9 Rare, 8 Épique, 1 Anomalie.
- **Chasse Anomalie :** `profile-banner:inca_four_quarters_linked` — Quatre Quartiers Liés.
- **Art :** `/boosters/oc-tawantinsuyu-split-sun.webp` ; backdrop : `/images/oc-worlds/tawantinsuyu-split-sun/uku-pacha-sunwell.png`.
- **Stage custom :** Stage custom — Puits solaire d’Uku Pacha ; **HUD :** HUD Khipu des Quatre Quartiers.

### Garde-fous de conception

- Relecture indispensable par une personne compétente en histoire et cultures andines; éviter de fusionner Inca, Maya et Aztèque.
- Employer les termes quechua avec prudence et validation; le contenu ci-dessus est une direction créative, pas une restitution religieuse.
- Les communautés, réseaux et savoir-faire sont centraux; ne pas réduire l’univers aux sacrifices ou à l’or.

## 11. Yomi no Kage — Les Cent Noms

- **Clé technique :** `yomi_no_kage`
- **Nom canon interne :** `Yomi no Kage`
- **Famille compatible :** `arcane` — **mode principal :** `RPG` — **difficulté :** `Very Hard`
- **Tags :** `mythology`, `japanese`, `yokai`, `yomi`, `onmyo`
- **Direction visuelle :** motif `torii-night`, ciel `#1a1026 → #030105`, grille `#ff6b81`, accent `#5eead4`.

### Identité et conflit

**Origine.** Cette Trame originale combine une ville-sanctuaire, des routes de montagne, des objets éveillés et une frontière instable avec Yomi.

**Effet de la Brèche.** Le Sans-Auteur blanchit les tablettes et force les créatures très différentes désignées comme yōkai à devenir une seule armée sans identité.

**Conflit central.** Restaurer les noms, distinguer esprit hostile, être négociable et objet conscient, puis refermer la frontière sans nier les morts.

### Héros jouables

**Rei Kagetsu** — `rei_kagetsu` — hacker / sceaux / exorcisme tactique — PV 114 / ATQ 13 / DEF 7 / VIT 9.
Onmyōji original qui enquête sur les noms volés plutôt que de détruire indistinctement les yōkai. Kit : **Ofuda d’Étincelle** (magic, x0.9), **Pentacle du Vent** (projectile, CD 5, x1.75), défense **Barrière Kekkai** (shield, réduction 86 %), ultime **Calendrier des Cent Esprits** (magic_aoe, x4.7).

**Aoi Mikazuki** — `aoi_mikazuki` — slayer / duel / purification — PV 138 / ATQ 18 / DEF 8 / VIT 7.
Gardienne d’un sanctuaire frontalier dont la lame coupe les liens de malédiction sans blesser l’esprit lié. Kit : **Lune Croissante** (melee, x1.15), **Coupe du Lien Rouge** (melee, CD 6, x2.05), défense **Pas sous le Torii** (dodge, réduction 86 %), ultime **Danse des Trois Miroirs** (melee_aoe, x5.0).

**Daichi Kurogane** — `daichi_kurogane` — marine / tank / artisanat yōkai — PV 160 / ATQ 14 / DEF 13 / VIT 4.
Forgeron qui répare les tsukumogami et fabrique des ancrages pour les objets devenus conscients. Kit : **Marteau de Forge** (melee, x1.05), **Cloche d’Atelier** (sound, CD 7, x1.7), défense **Armure de Plaques Laquées** (shield, réduction 90 %), ultime **Parade Nocturne Réconciliée** (summon_aoe, x4.4).

### Bestiaire

- **Oni du péage rouge** — bruiser, PV 108, ATQ 14, VIT 4 : Exige un tribut d’objet avant d’ouvrir le passage et devient furieux si on attaque sans négocier.
- **Yūrei sans tablette** — controller, PV 98, ATQ 12, VIT 5 : Efface le nom d’une compétence et la rend inutilisable jusqu’à restauration du mémorial.
- **Tsukumogami affolé** — skirmisher, PV 92, ATQ 12, VIT 7 : Change de forme selon l’objet de décor le plus proche.
- **Tengu du sentier fermé** — assassin, PV 88, ATQ 16, VIT 8 : Attaque depuis les hauteurs puis déplace la cible hors de sa route.
- **Kappa du canal sec** — support, PV 104, ATQ 9, VIT 5 : Vole l’eau des zones de soin; peut être neutralisé en restaurant le bassin.

### Boss et world boss

- **Écho de Shuten-dōji** — bruiser, PV 500, ATQ 19 : Ivre de corruption, il alterne festin, défi et charge; le vrai enjeu est de briser la coupe de Brèche.
- **Amas des Huit Orochi** — controller, PV 570, ATQ 21 : Huit cous occupent des lanes différentes et partagent une jauge de régénération.
- **Onryō au Nom Effacé** — commander, PV 640, ATQ 23 : Réécrit les mémoriaux du stage et transforme les souvenirs non reconnus en attaques.
- **WORLD BOSS — Porte de Yomi aux Mille Ombres** — PV 1550, ATQ 34, DEF 18 : La porte elle-même devient une entité : elle aspire les noms, recrée les morts et doit être refermée par trois sceaux plutôt que tuée.

### Reliques et objets de combat

- **Éclat des Trois Miroirs** (`japan_three_mirrors`) — +6 DEF / +2 SPD. Renvoie une altération ciblée et révèle la vraie forme d’un esprit.
- **Étui d’ofuda vivant** (`japan_living_ofuda_case`) — +7 ATK / +2 SPD. Génère un sceau adapté au type du dernier ennemi rencontré.
- **Marteau des objets éveillés** (`japan_tsukumogami_hammer`) — +60 HP / +7 DEF. Répare obstacles alliés, objets conscients et dispositifs du terrain.
- **Sel de purification** (`pickup`, `japan_purifying_salt`) — Nettoie une petite zone sans infliger de dégâts aux esprits pacifiables. Effet : heal 46 / shield 16.
- **Lanterne de feu follet** (`pickup`, `japan_foxfire_lantern`) — Révèle les silhouettes cachées et leur inflige une brûlure spirituelle. Effet : damage 42 / charge 10.
- **Offrande de saké** (`pickup`, `japan_sake_offering`) — Change un oni mineur hostile en obstacle neutre ou recharge un allié. Effet : charge 34 / heal 12.
- **Parade nocturne alliée** (`summon`, `japan_night_parade`) — Des yōkai réconciliés traversent le terrain et déplacent les ennemis hors des mémoriaux. Effet : summonDamage 94 / charge 16.
- **Sceau des Mille Ombres** (`ultimate`, `japan_seal_yomi`) — Trois torii lumineux referment Yomi, infligent des dégâts et rendent les noms volés. Effet : ultimateDamage 184 / charge 22.

### Stages

1. **Forêt des Torii inversés** — Smash / Hard / objectif `portals` / boss **Écho de Shuten-dōji**. Sentiers verticaux, torii basculants et lanternes qui indiquent les plateformes sûres.
1. **Archive Onmyō des Cent Noms** — Tactics / Very Hard / objectif `artifact` / boss **Onryō au Nom Effacé**. Grille de rouleaux où trois tablettes nominatives doivent être récupérées et replacées.
1. **Escalier de Yomi** — RPG / Very Hard / objectif `portals` / boss **Porte de Yomi aux Mille Ombres**. Descente puis remontée en phases; chaque sceau fermé réduit les invocations du world boss.

### Arc narratif

**Arc Univers — Chaque esprit possède un nom** — Les tablettes funéraires blanchissent et la Parade nocturne se transforme en armée anonyme poussée vers Yomi.
1. Négocier le passage dans la Forêt des Torii au lieu de combattre tous les yōkai.
2. Restaurer cent noms dans l’Archive Onmyō.
3. Sceller la Porte de Yomi sans effacer les morts qui cherchent seulement à être reconnus.
**Sortie :** La frontière demeure, mais les esprits et les vivants récupèrent leurs noms; A.R.C.A. apprend qu’un exorcisme peut aussi être une restitution.
**Récompense d’arc :** HUD « Cent Noms » + invocation Parade nocturne alliée

### Booster ciblé

- **Booster Yomi no Kage** — ID `oc-world:yomi-no-kage` — 5 cartes par ouverture.
- **Bassin minimum :** 24 récompenses uniques; raretés recommandées : 6 Stable, 9 Rare, 8 Épique, 1 Anomalie.
- **Chasse Anomalie :** `hud:japan_hundred_names` — Les Cent Noms.
- **Art :** `/boosters/oc-yomi-no-kage.webp` ; backdrop : `/images/oc-worlds/yomi-no-kage/yomi-stair.png`.
- **Stage custom :** Stage custom — Escalier de Yomi ; **HUD :** HUD des Cent Noms.

### Garde-fous de conception

- Ne pas présenter « la mythologie japonaise » comme un système unique : distinguer folklore, pratiques religieuses et inventions du jeu.
- Oni, tengu et kappa ne sont pas automatiquement maléfiques; leurs comportements et pactes doivent varier.
- La Porte de Yomi est le world boss; Izanami n’est pas transformée en antagoniste générique.

## 12. Le Mandat des Neuf Cieux

- **Clé technique :** `mandate_nine_heavens`
- **Nom canon interne :** `Mandate of Nine Heavens`
- **Famille compatible :** `arcane` — **mode principal :** `Tactics` — **difficulté :** `Very Hard`
- **Tags :** `mythology`, `chinese`, `celestial-bureaucracy`, `dragons`, `talismans`
- **Direction visuelle :** motif `celestial-palace`, ciel `#1b2845 → #03050a`, grille `#f4d35e`, accent `#d62828`.

### Identité et conflit

**Origine.** Cette Trame originale assemble une cour céleste fictive, des esprits fluviaux, des ancêtres, des talismans et une bureaucratie surnaturelle sans prétendre résumer toutes les traditions chinoises.

**Effet de la Brèche.** Le Sans-Auteur a offert à un Usurpateur la possibilité de rendre le Mandat permanent et de transformer tout désaccord en erreur administrative.

**Conflit central.** Rendre l’autorité conditionnelle, restaurer les pétitions et protéger les êtres surnaturels contre leur réduction à des symboles de pouvoir.

### Héros jouables

**Lin Yue** — `lin_yue` — hacker / talismans / contrôle de flux — PV 114 / ATQ 13 / DEF 7 / VIT 9.
Astronome et calligraphe du Bureau des Constellations, capable de corriger un décret céleste falsifié. Kit : **Trait de Cinabre** (magic, x0.9), **Décret Révoqué** (glitch, CD 5, x1.8), défense **Sceau des Quatre Orients** (shield, réduction 85 %), ultime **Carte des Neuf Cieux** (magic_aoe, x4.8).

**Wei Long** — `wei_long` — marine / gardien fluvial / déplacement — PV 152 / ATQ 16 / DEF 12 / VIT 6.
Émissaire draconique original chargé de maintenir les fleuves plutôt que de servir une cour céleste. Kit : **Glaive des Eaux** (melee, x1.05), **Courant Ascendant** (water, CD 6, x1.9), défense **Écaille de Nuage** (shield, réduction 88 %), ultime **Dragon des Fleuves Réunis** (water_aoe, x4.7).

**Mei Zhen** — `mei_zhen` — tactical / ancêtres / soutien — PV 126 / ATQ 12 / DEF 10 / VIT 7.
Gardienne des tablettes familiales qui aide les morts à transmettre un message sans devenir des soldats. Kit : **Cloche de Rappel** (sound, x0.9), **Pas de l’Ancêtre** (summon, CD 6, x1.6), défense **Tablette Protectrice** (shield, réduction 86 %), ultime **Dix Mille Noms Rentrent au Foyer** (heal_aoe, x4.1).

### Bestiaire

- **Garde jiangshi sous sceau** — tank, PV 118, ATQ 10, VIT 3 : Saute entre les cases marquées et s’arrête si son talisman est restauré.
- **Bête de papier talismanique** — skirmisher, PV 88, ATQ 13, VIT 7 : Se replie en feuille puis se redéploie derrière l’escouade.
- **Yaoguai renard aux faux décrets** — controller, PV 102, ATQ 11, VIT 5 : Crée une copie illusoire d’un objectif et détourne les unités automatiques.
- **Rejeton de bronze taotie** — bruiser, PV 120, ATQ 15, VIT 4 : Dévore les objets de terrain et convertit leurs effets en armure.
- **Bandit des nuages** — assassin, PV 92, ATQ 15, VIT 7 : Descend d’une plateforme céleste pour voler la jauge de la cible la plus rapide.

### Boss et world boss

- **Juge des Pétitions Vides** — commander, PV 500, ATQ 19 : Transforme les actions non autorisées en dettes célestes et bloque les compétences sans sceau.
- **Hundun, Tempête Sans Forme** — controller, PV 570, ATQ 21 : Efface temporairement les catégories, directions et distances de l’arène.
- **Dragon Noir de la Rivière Brisée** — bruiser, PV 640, ATQ 23 : Un esprit fluvial corrompu dont les segments doivent être purifiés plutôt que simplement détruits.
- **WORLD BOSS — Usurpateur du Neuvième Ciel** — PV 1550, ATQ 34, DEF 18 : Fonctionnaire céleste original qui a volé le Mandat : il réorganise les neuf paliers, invoque des édits et perd son pouvoir lorsque les communautés cessent de lui obéir.

### Reliques et objets de combat

- **Pinceau de cinabre** (`china_cinnabar_brush`) — +7 ATK / +2 SPD. Renforce les talismans et réduit le temps nécessaire pour sceller un portail.
- **Perle du fleuve-dragon** (`china_dragon_pearl`) — +55 HP / +6 DEF. Accorde une protection liée au mouvement de l’eau et non à la domination impériale.
- **Tablette des noms transmis** (`china_ancestor_tablet`) — +7 DEF / +45 HP. Conserve un buff d’un allié tombé et le transmet à la cellule.
- **Bande talismanique** (`pickup`, `china_talisman_strip`) — Immobilise une entité surnaturelle et recharge l’équipe proche. Effet : charge 32 / damage 16.
- **Cloche de bronze** (`pickup`, `china_bronze_bell`) — Onde sonore qui fissure les masques taotie et révèle les illusions. Effet : damage 44 / charge 8.
- **Remède de pêche** (`pickup`, `china_peach_medicine`) — Restaure les PV et retire une rigidité de jiangshi. Effet : heal 54 / shield 10.
- **Clercs célestes dissidents** (`summon`, `china_celestial_clerks`) — Des archivistes barrent un faux décret et frappent son auteur avec les sceaux confisqués. Effet : summonDamage 96 / charge 16.
- **Mandat rendu aux vivants** (`ultimate`, `china_mandate_returned`) — Les neuf paliers s’alignent; tous les faux édits sont annulés et convertis en dégâts. Effet : ultimateDamage 188 / charge 20.

### Stages

1. **Cité des Lanternes sans Ombre** — Smash / Hard / objectif `control` / boss **Dragon Noir de la Rivière Brisée**. Ponts courbes, toits et canaux où la lumière des lanternes révèle les vraies plateformes.
1. **Bureau des Dix Mille Rouleaux** — Tactics / Very Hard / objectif `artifact` / boss **Juge des Pétitions Vides**. Grille administrative où les bons sceaux doivent être apposés sur trois requêtes vivantes.
1. **Porte-dragon du Neuvième Ciel** — RPG / Very Hard / objectif `overload` / boss **Usurpateur du Neuvième Ciel**. Ascension de neuf paliers; chaque niveau impose une règle que l’équipe peut accepter ou contester.

### Arc narratif

**Arc Univers — Le Mandat est une responsabilité** — Un fonctionnaire céleste a transformé le Mandat en propriété éternelle et interdit aux rivières, ancêtres et communautés de contester ses décrets.
1. Rouvrir la Cité des Lanternes et guérir le dragon de la rivière.
2. Restaurer les pétitions censurées dans le Bureau des Rouleaux.
3. Monter les neuf paliers et retirer le Mandat à l’Usurpateur.
**Sortie :** Le ciel ne devient pas vide; son administration redevient conditionnelle, lisible et responsable devant les mondes qu’elle prétend ordonner.
**Récompense d’arc :** Pinceau du Décret Libre + titre « Porteur de Pétition »

### Booster ciblé

- **Booster Mandat des Neuf Cieux** — ID `oc-world:mandate-nine-heavens` — 5 cartes par ouverture.
- **Bassin minimum :** 24 récompenses uniques; raretés recommandées : 6 Stable, 9 Rare, 8 Épique, 1 Anomalie.
- **Chasse Anomalie :** `profile-title:china_petition_bearer` — Porteur de Pétition.
- **Art :** `/boosters/oc-mandate-nine-heavens.webp` ; backdrop : `/images/oc-worlds/mandate-nine-heavens/ninth-heaven-gate.png`.
- **Stage custom :** Stage custom — Porte-dragon du Neuvième Ciel ; **HUD :** HUD des Pétitions Célestes.

### Garde-fous de conception

- Ne pas confondre folklore, taoïsme, bouddhisme, pratiques ancestrales et mythes de périodes très différentes.
- Le dragon est ici surtout une force créatrice et fluviale; seul un individu corrompu devient boss.
- L’Usurpateur est entièrement original et ne remplace pas une divinité chinoise réelle.

## 13. Mythos Primordia — Le Premier Panthéon

- **Clé technique :** `mythos_primordia`
- **Nom canon interne :** `Mythos Primordia`
- **Famille compatible :** `arcane` — **mode principal :** `RPG` — **difficulté :** `Expert`
- **Tags :** `original-mythology`, `creation`, `archetypes`, `primordial`, `meta-myth`
- **Direction visuelle :** motif `primordial-cosmos`, ciel `#110b2d → #010104`, grille `#7df9ff`, accent `#ff70a6`.

### Identité et conflit

**Origine.** Mythos Primordia est la réponse au libellé incomplet « Univers Mythologie » : un panthéon totalement original, antérieur en apparence aux cultures connues mais sans prétendre les remplacer.

**Effet de la Brèche.** Le Sans-Auteur fabrique un Dieu d’Avant les Noms pour imposer une origine unique à toutes les Trames.

**Conflit central.** Défendre la pluralité des commencements et permettre aux archétypes de changer plutôt que de devenir des prisons narratives.

### Héros jouables

**Astra Vey** — `astra_vey` — hacker / cosmologie / réécriture limitée — PV 112 / ATQ 14 / DEF 6 / VIT 10.
Cartographe des constellations antérieures aux dieux, capable de distinguer un mythe vivant d’une version imposée. Kit : **Épine Stellaire** (magic, x0.9), **Constellation Interdite** (glitch, CD 5, x1.85), défense **Ciel de Rechange** (dodge, réduction 90 %), ultime **Carte de l’Avant-Monde** (magic_aoe, x5.0).

**Korun Né-de-Pierre** — `korun_stoneborn` — marine / colosse / protection — PV 170 / ATQ 15 / DEF 14 / VIT 3.
Dernier enfant d’une montagne qui se souvient du monde avant les temples. Kit : **Poing de Strate** (melee, x1.1), **Faille de Fondation** (melee, CD 7, x1.9), défense **Peau du Premier Continent** (shield, réduction 92 %), ultime **Soulèvement des Fondations** (earth_aoe, x4.6).

**Nyme du Premier Chant** — `nyme_first_song` — tactical / soin / création sonore — PV 124 / ATQ 12 / DEF 9 / VIT 8.
Chanteuse dont la mélodie donne temporairement une forme aux choses encore sans nom. Kit : **Note de Forme** (sound, x0.9), **Chœur des Possibles** (sound, CD 6, x1.55), défense **Berceuse de Matière** (shield, réduction 87 %), ultime **Le Monde se souvient de son Chant** (music_aoe, x4.3).

### Bestiaire

- **Chimère sans nom** — skirmisher, PV 84, ATQ 12, VIT 7 : Change de capacités dès qu’un joueur tente de la classer.
- **Colosse-idole** — tank, PV 122, ATQ 11, VIT 3 : Devient plus lourd à chaque archive qui le décrit comme invincible.
- **Oracle d’os** — support, PV 96, ATQ 9, VIT 6 : Prévoit une action puis gagne de la puissance si le joueur la confirme.
- **Rejeton mange-étoile** — assassin, PV 88, ATQ 16, VIT 8 : Éteint les balises et dévore les projectiles lumineux.
- **Titan au masque vierge** — controller, PV 110, ATQ 11, VIT 4 : Copie le rôle du dernier héros actif sans copier son identité.

### Boss et world boss

- **Mère des Masques** — controller, PV 500, ATQ 19 : Assigne des archétypes aux héros et modifie leurs compétences jusqu’à ce qu’ils brisent leur masque.
- **Traître du Premier Feu** — bruiser, PV 570, ATQ 21 : Vole une source de création et la transforme en brûlure qui se propage entre les plateformes.
- **Mer Sans Rivage** — commander, PV 640, ATQ 23 : Océan conscient qui efface la distance et fait apparaître des îles-mémoires.
- **WORLD BOSS — Le Dieu d’Avant les Noms** — PV 1550, ATQ 34, DEF 18 : Entité entièrement originale née lorsque le Sans-Auteur prétend qu’un seul récit existait avant tous les autres; ses phases sont Foi, Peur, Contradiction et Dénomination.

### Reliques et objets de combat

- **Compas des étoiles antérieures** (`primordia_star_compass`) — +2 SPD / +7 ATK. Pointe vers une loi non encore nommée et révèle une faiblesse changeante.
- **Pierre de fondation vivante** (`primordia_foundation_stone`) — +75 HP / +6 DEF. Stabilise une plateforme ou un objectif que le boss tente d’effacer.
- **Fragment du Premier Chant** (`primordia_first_song_fragment`) — +7 ATK / +5 DEF. Amplifie les compétences de soutien et donne une forme brève aux invocations.
- **Graine de nom** (`pickup`, `primordia_name_seed`) — Donne un nom temporaire à une entité changeante et bloque sa transformation. Effet : charge 34 / damage 18.
- **Braise du Premier Feu** (`pickup`, `primordia_first_fire`) — Flamme créatrice qui blesse les idoles et rallume les balises. Effet : damage 45 / charge 8.
- **Argile des formes** (`pickup`, `primordia_clay_of_forms`) — Répare un héros, un obstacle ou un objectif selon la cible. Effet : heal 52 / shield 14.
- **Héros jamais racontés** (`summon`, `primordia_unborn_heroes`) — Des silhouettes possibles interviennent sans devenir des personnages permanents. Effet : summonDamage 98 / charge 14.
- **Les Mille Commencements** (`ultimate`, `primordia_many_beginnings`) — Au lieu d’une origine unique, mille aubes frappent le Dieu d’Avant les Noms. Effet : ultimateDamage 192 / charge 20.

### Stages

1. **Temple avant les Dieux** — Tactics / Hard / objectif `artifact` / boss **Mère des Masques**. Architecture inachevée où trois symboles doivent recevoir des significations différentes.
1. **Mer Sans Rivage** — Smash / Very Hard / objectif `survive` / boss **Mer Sans Rivage**. Îles apparaissant au rythme du Premier Chant; tomber signifie entrer dans une mémoire aléatoire.
1. **Archive des Mythes à Naître** — RPG / Expert / objectif `overload` / boss **Le Dieu d’Avant les Noms**. Bibliothèque cosmique dont les pages vierges deviennent les phases du world boss.

### Arc narratif

**Arc Univers — Il n’existe pas qu’une seule origine** — A.R.C.A. trouve une Trame qui prétend précéder tous les panthéons; le Sans-Auteur veut s’en servir comme preuve qu’un seul récit est légitime.
1. Briser les masques qui forcent les héros à rejouer des archétypes.
2. Traverser la Mer Sans Rivage en composant une route collective.
3. Nommer le Dieu d’Avant les Noms comme une création récente, pas comme une vérité éternelle.
**Sortie :** Mythos Primordia demeure un réservoir de commencements incompatibles; aucun ne possède le droit d’effacer les autres.
**Récompense d’arc :** Compas des Mille Origines + titre « Né d’un récit non unique »

### Booster ciblé

- **Booster Mythos Primordia** — ID `oc-world:mythos-primordia` — 5 cartes par ouverture.
- **Bassin minimum :** 24 récompenses uniques; raretés recommandées : 6 Stable, 9 Rare, 8 Épique, 1 Anomalie.
- **Chasse Anomalie :** `field-super:primordia_thousand_beginnings` — Les Mille Commencements.
- **Art :** `/boosters/oc-mythos-primordia.webp` ; backdrop : `/images/oc-worlds/mythos-primordia/archive-unborn-myths.png`.
- **Stage custom :** Stage custom — Archive des Mythes à Naître ; **HUD :** HUD des Archétypes Vivants.

### Garde-fous de conception

- Toutes les divinités, langues, symboles et rites de ce monde doivent rester originaux.
- Ne pas reprendre un panthéon réel sous un simple renommage visuel.

## 14. La Mer Sans Couronne

- **Clé technique :** `crownless_sea`
- **Nom canon interne :** `The Crownless Sea`
- **Famille compatible :** `tactical` — **mode principal :** `Smash` — **difficulté :** `Very Hard`
- **Tags :** `pirate`, `nautical`, `age-of-sail`, `sea-magic`, `free-crews`
- **Direction visuelle :** motif `storm-harbor`, ciel `#102a43 → #020609`, grille `#00b4d8`, accent `#e63946`.

### Identité et conflit

**Origine.** La Mer Sans Couronne est un monde original d’âge de la voile où empires, ports libres, sorcières de tempête, monstres marins et équipages élus se disputent les routes.

**Effet de la Brèche.** La Brèche a créé une carte parfaite que l’Amiral Chain utilise pour taxer chaque courant et asservir les équipages perdus.

**Conflit central.** Détruire la propriété absolue des routes, protéger la solidarité d’équipage et survivre au Kraken sans devenir une nouvelle marine impériale.

### Héros jouables

**Capitaine Ysara Flint** — `ysara_flint` — tactical / commandement / tir mobile — PV 136 / ATQ 16 / DEF 9 / VIT 7.
Capitaine élue d’un équipage sans pavillon national, qui refuse couronnes comme codes de piraterie imposés. Kit : **Sabre et Pistolet** (bullet, x1.05), **Bordée de Traverse** (projectile, CD 6, x1.9), défense **Pas de Bastingage** (dodge, réduction 85 %), ultime **Tous Pavillons Abattus** (cannon_aoe, x5.0).

**Milo Quill** — `milo_quill` — hacker / cartographie / pièges — PV 112 / ATQ 13 / DEF 7 / VIT 10.
Cartographe qui dessine les courants impossibles et vend de fausses cartes aux empires. Kit : **Compas Lame** (projectile, x0.9), **Courant Dessiné** (glitch, CD 5, x1.75), défense **Carte Pliée** (dodge, réduction 88 %), ultime **Mer Réécrite à l’Encre** (water_aoe, x4.7).

**Brann Crow** — `brann_crow` — marine / abordage / tank — PV 164 / ATQ 15 / DEF 13 / VIT 4.
Ancien charpentier de galère impériale devenu protecteur des équipages libérés. Kit : **Hache d’Abordage** (melee, x1.1), **Ancre Lancée** (projectile, CD 7, x1.85), défense **Pavois de Coque** (shield, réduction 90 %), ultime **Révolte du Pont Inférieur** (melee_aoe, x4.6).

### Bestiaire

- **Corsaire noyé** — tank, PV 118, ATQ 10, VIT 3 : Revient depuis l’eau tant que son contrat de marque n’est pas brûlé.
- **Goule à poudre** — bruiser, PV 112, ATQ 15, VIT 4 : Explose près des barils et peut déclencher des réactions en chaîne.
- **Sirène de récif** — controller, PV 102, ATQ 11, VIT 5 : Attire les unités vers les bords ou brouille la direction des commandes.
- **Fusilier de la Marine de la Couronne** — support, PV 100, ATQ 10, VIT 6 : Pose des lignes de tir et protège les officiers.
- **Coffre mimétique** — assassin, PV 92, ATQ 15, VIT 7 : Imite une récompense puis avale la première unité qui le ramasse.

### Boss et world boss

- **Amiral Chain** — commander, PV 500, ATQ 19 : Enchaîne les navires et transforme chaque déplacement en coût de dette.
- **Sorcière du Calme Mort** — controller, PV 570, ATQ 21 : Supprime le vent, ralentit les projectiles et invoque des silhouettes dans la brume.
- **Prêtre du Léviathan** — bruiser, PV 640, ATQ 23 : Sacrifie des sections de pont pour nourrir une créature sous la coque.
- **WORLD BOSS — Kraken Sans Couronne** — PV 1550, ATQ 34, DEF 18 : Huit tentacules occupent des zones distinctes, volent les objectifs et ne rendent le cœur vulnérable qu’après une bordée coordonnée.

### Reliques et objets de combat

- **Compas sans nord** (`pirate_free_compass`) — +2 SPD / +6 ATK. Pointe vers la route la moins surveillée plutôt que vers un nord fixe.
- **Manteau du capitaine élu** (`pirate_captains_coat`) — +55 HP / +6 DEF. Renforce les alliés tant que le porteur n’est pas le seul héros encore actif.
- **Crochet de tendon du Léviathan** (`pirate_leviathan_hook`) — +10 ATK / +3 DEF. Attire les ennemis lourds et brise les gardes de boss marins.
- **Baril de poudre** (`pickup`, `pirate_powder_keg`) — Peut être lancé ou placé pour une explosion en chaîne. Effet : damage 48 / charge 6.
- **Ration de rhum épicé** (`pickup`, `pirate_rum_ration`) — Rend des PV et de la résistance, mais ne doit pas être présenté comme un soin médical. Effet : heal 46 / shield 12.
- **Vent en bouteille** (`pickup`, `pirate_wind_bottle`) — Rétablit la mobilité, repousse la brume et recharge l’équipe. Effet : charge 36 / damage 14.
- **Flottille libre** (`summon`, `pirate_free_flotilla`) — Trois petits bâtiments surgissent de la Brèche pour une bordée croisée. Effet : summonDamage 106 / charge 10.
- **Bordée de la Marée Noire** (`ultimate`, `pirate_black_tide_broadside`) — Toute la flotte tire sur les tentacules marqués puis ouvre une fenêtre sur le cœur. Effet : ultimateDamage 194 / charge 18.

### Stages

1. **Port Sans Pavillon** — Smash / Hard / objectif `control` / boss **Amiral Chain**. Quais, mâts, grues et navires en mouvement; contrôler les cloches libère les amarres.
1. **Cimetière du Calme Mort** — Tactics / Very Hard / objectif `escort` / boss **Sorcière du Calme Mort**. Épaves comme couvertures et courant nul; escorter un navire-lanterne jusqu’à la sortie.
1. **Maelström du Kraken Sans Couronne** — RPG / Very Hard / objectif `overload` / boss **Kraken Sans Couronne**. Combat naval en huit tentacules, jauge de coque et fenêtres de bordée.

### Arc narratif

**Arc Univers — Personne ne possède la mer** — La Couronne a profité de la Brèche pour transformer toutes les routes maritimes en propriétés et tous les pirates en monstres interchangeables.
1. Libérer le Port Sans Pavillon et élire un commandement temporaire.
2. Traverser le Calme Mort sans abandonner les équipages d’épaves.
3. Vaincre le Kraken sans laisser l’Amiral récupérer le contrôle des routes.
**Sortie :** La mer demeure dangereuse mais aucune carte n’est définitive; les équipages du Nexus peuvent négocier passage, secours et partage.
**Récompense d’arc :** Compas sans nord + super de terrain « Bordée de la Marée Noire »

### Booster ciblé

- **Booster Mer Sans Couronne** — ID `oc-world:crownless-sea` — 5 cartes par ouverture.
- **Bassin minimum :** 24 récompenses uniques; raretés recommandées : 6 Stable, 9 Rare, 8 Épique, 1 Anomalie.
- **Chasse Anomalie :** `field-super:pirate_black_tide_broadside` — Bordée de la Marée Noire.
- **Art :** `/boosters/oc-crownless-sea.webp` ; backdrop : `/images/oc-worlds/crownless-sea/kraken-maelstrom.png`.
- **Stage custom :** Stage custom — Maelström du Kraken Sans Couronne ; **HUD :** HUD Coque, Vent & Tentacules.

### Garde-fous de conception

- Éviter la romantisation totale de la piraterie : montrer mutineries, esclavage, violence impériale et choix de gouvernance.
- L’équipage doit être culturellement varié et conçu comme une communauté, pas comme un décor exotique.

## 15. Aetherion — Les Sept Lois de la Magie

- **Clé technique :** `aetherion_seven_laws`
- **Nom canon interne :** `Aetherion: Seven Laws of Magic`
- **Famille compatible :** `arcane` — **mode principal :** `RPG` — **difficulté :** `Expert`
- **Tags :** `magic`, `wizardry`, `alchemy`, `living-spells`, `arcane-academy`
- **Direction visuelle :** motif `arcane-academy`, ciel `#21103d → #030105`, grille `#b56dff`, accent `#7df9ff`.

### Identité et conflit

**Origine.** Aetherion est un monde original où toute magie connue obéit à sept Lois mesurables : forme, coût, lien, mémoire, échange, seuil et contradiction.

**Effet de la Brèche.** Le Chancelier transforme ces Lois en licences propriétaires tandis que la Brèche engendre un huitième phénomène impossible à classer.

**Conflit central.** Rendre le savoir magique partageable, préserver les coûts et limites qui rendent le système cohérent, puis accueillir l’exception sans détruire les règles.

### Héros jouables

**Lyra Hexwind** — `lyra_hexwind` — hacker / sorts modulaires / contrôle — PV 112 / ATQ 15 / DEF 6 / VIT 9.
Arcaniste de terrain qui combine les Lois sans accepter le monopole du Chancelier. Kit : **Trait d’Aether** (magic, x0.95), **Hexagone Variable** (magic, CD 5, x1.9), défense **Contresort Réflexe** (shield, réduction 87 %), ultime **Sept Lois, Une Exception** (magic_aoe, x5.1).

**Orin Vale** — `orin_vale` — tactical / alchimie / soutien — PV 126 / ATQ 12 / DEF 9 / VIT 8.
Alchimiste itinérant qui transforme les coûts magiques en ressources partageables. Kit : **Flacon Catalyseur** (projectile, x0.9), **Transmutation de Combat** (buff, CD 6, x1.5), défense **Cercle de Sel Bleu** (shield, réduction 86 %), ultime **Grand Œuvre de la Cellule** (heal_aoe, x4.2).

**Nessa Vire** — `nessa_vire` — slayer / lame runique / interruption — PV 146 / ATQ 18 / DEF 10 / VIT 6.
Ancienne Null-Knight qui a rendu son armure à la magie au lieu de la supprimer. Kit : **Lame de Glyphe** (melee, x1.15), **Coupe du Silence** (melee, CD 6, x2.1), défense **Armure Récursive** (shield, réduction 83 %), ultime **Rupture du Septième Verrou** (melee_aoe, x5.0).

### Bestiaire

- **Sort vivant échappé** — skirmisher, PV 84, ATQ 12, VIT 7 : Change de type élémentaire après chaque attaque reçue.
- **Sangsue de mana** — assassin, PV 80, ATQ 16, VIT 8 : S’accroche à la cible ayant la plus forte charge spéciale.
- **Null-Knight loyaliste** — tank, PV 126, ATQ 10, VIT 3 : Réduit les dégâts magiques mais expose son noyau aux attaques physiques.
- **Gargouille runique** — bruiser, PV 120, ATQ 15, VIT 4 : S’active uniquement lorsque deux glyphes voisins correspondent.
- **Feu follet de mémoire** — support, PV 104, ATQ 9, VIT 5 : Répète le dernier sort allié sous une forme affaiblie ou corrompue.

### Boss et world boss

- **Archimage Zéro** — controller, PV 500, ATQ 19 : Annule une Loi par phase et force les joueurs à varier leurs types de compétence.
- **Titan-Grimoire** — bruiser, PV 570, ATQ 21 : Chaque page est une barre d’armure et libère un sort vivant lorsqu’elle se déchire.
- **Chancelier du Septième Verrou** — commander, PV 640, ATQ 23 : Réserve certaines écoles de magie à ses unités et sanctionne les sorts « non licenciés ».
- **WORLD BOSS — Le Sort Non Écrit** — PV 1550, ATQ 34, DEF 18 : Anomalie consciente sans école ni formule : apprend les quatre dernières actions, les fusionne et exige une réponse que le système ne connaît pas.

### Reliques et objets de combat

- **Prisme des Sept Lois** (`magic_seven_law_prism`) — +8 ATK / +2 SPD. Change l’affinité de la compétence secondaire selon la faiblesse ennemie.
- **Cercle de sel bleu** (`magic_blue_salt_circle`) — +8 DEF / +45 HP. Crée une zone qui bloque les déplacements de sorts vivants.
- **Rune récursive** (`magic_recursive_rune`) — +7 ATK / +5 DEF. Répète une petite partie du dernier effet défensif utilisé.
- **Cristal de mana brut** (`pickup`, `magic_mana_crystal`) — Recharge fortement mais rend la prochaine compétence plus instable. Effet : charge 40 / damage 10.
- **Contresort en fiole** (`pickup`, `magic_bottled_counterspell`) — Interrompt le boss et renvoie une fraction de son incantation. Effet : damage 44 / charge 10.
- **Panacée imparfaite** (`pickup`, `magic_alchemy_panacea`) — Soigne et retire une altération, sans prétendre résoudre toutes les malédictions. Effet : heal 56 / shield 8.
- **Cercle des apprentis libres** (`summon`, `magic_apprentice_circle`) — Plusieurs jeunes mages posent des glyphes complémentaires et saturent une zone. Effet : summonDamage 98 / charge 14.
- **Exception Non Écrite** (`ultimate`, `magic_unwritten_exception`) — Pendant quelques secondes, la cellule peut lancer un effet qui n’appartient à aucune des Sept Lois. Effet : ultimateDamage 192 / charge 20.

### Stages

1. **Bibliothèque des Sorts Vivants** — Smash / Hard / objectif `rout` / boss **Titan-Grimoire**. Étagères mouvantes, pages-plateformes et sorts qui sortent des livres.
1. **Académie des Sept Lois** — Tactics / Very Hard / objectif `disable` / boss **Chancelier du Septième Verrou**. Sept ailes reliées à des glyphes; en désactiver trois libère les écoles confisquées.
1. **Cercle Blanc de l’Exception** — RPG / Expert / objectif `overload` / boss **Le Sort Non Écrit**. Arène presque vide où l’interface affiche les actions apprises et la fusion à venir.

### Arc narratif

**Arc Univers — À qui appartient un sort ?** — Le Chancelier a verrouillé les Sept Lois dans des licences; tout magicien non enregistré devient une anomalie à supprimer.
1. Libérer les sorts vivants sans les laisser dévorer la Bibliothèque.
2. Ouvrir trois ailes de l’Académie et rendre leurs savoirs publics.
3. Enseigner au Sort Non Écrit une exception qui ne devienne pas une huitième prison.
**Sortie :** Les Lois restent des outils de compréhension, jamais des frontières de caste; Aetherion accepte les traditions hybrides.
**Récompense d’arc :** Prisme des Sept Lois + super « Exception Non Écrite »

### Booster ciblé

- **Booster Aetherion — Sept Lois** — ID `oc-world:aetherion-seven-laws` — 5 cartes par ouverture.
- **Bassin minimum :** 24 récompenses uniques; raretés recommandées : 6 Stable, 9 Rare, 8 Épique, 1 Anomalie.
- **Chasse Anomalie :** `field-super:magic_unwritten_exception` — Exception Non Écrite.
- **Art :** `/boosters/oc-aetherion-seven-laws.webp` ; backdrop : `/images/oc-worlds/aetherion-seven-laws/blank-circle.png`.
- **Stage custom :** Stage custom — Cercle Blanc de l’Exception ; **HUD :** HUD des Sept Lois.

### Garde-fous de conception

- Garder un système magique lisible : chaque pouvoir doit préciser coût, portée, contre et interaction.
- Ne pas faire de l’« Exception » une solution gratuite à tout; elle doit rester rare et dangereuse.

## 16. Infernum — Les Neuf Gouffres

- **Clé technique :** `infernum_nine_pits`
- **Nom canon interne :** `Infernum: Nine Pits`
- **Famille compatible :** `horror` — **mode principal :** `RPG` — **difficulté :** `Expert`
- **Tags :** `hell`, `demons`, `contracts`, `damnation`, `rebellion`
- **Direction visuelle :** motif `infernal-citadel`, ciel `#250505 → #020101`, grille `#e63946`, accent `#ff7b00`.

### Identité et conflit

**Origine.** Infernum est un enfer entièrement fictif divisé en neuf gouffres économiques et judiciaires où les démons administrent contrats, châtiments et circulation des âmes.

**Effet de la Brèche.** Le Sans-Auteur alimente le Trône Rouge avec les regrets de toutes les Trames et veut rendre chaque faute éternellement exploitable.

**Conflit central.** Distinguer responsabilité et possession, rendre possible la réparation et renverser l’infrastructure sans effacer les âmes.

### Héros jouables

**Mercy Ash** — `mercy_ash` — horror / survie / bannissement — PV 132 / ATQ 14 / DEF 9 / VIT 7.
Morte condamnée devenue passeuse, qui aide les âmes à sortir des contrats falsifiés. Kit : **Faux de Cendre** (melee, x1.05), **Clause de Rupture** (magic, CD 6, x1.85), défense **Nom Non Signé** (dodge, réduction 87 %), ultime **Amnistie des Sans-Contrat** (dark_aoe, x4.7).

**Azael Vorn** — `azael_vorn` — slayer / démon transfuge / assaut — PV 150 / ATQ 19 / DEF 9 / VIT 6.
Démon original issu du troisième gouffre, révolté contre le commerce des fautes. Kit : **Griffe de Scorie** (melee, x1.2), **Charge de Soufre** (fire, CD 6, x2.1), défense **Peau de Basalte** (shield, réduction 82 %), ultime **Couronne Brisée de Vharos** (fire_aoe, x5.2).

**Morcant l’Enchaîné** — `morcant_bound` — marine / tank / contrôle des chaînes — PV 172 / ATQ 15 / DEF 14 / VIT 3.
Ancien geôlier qui porte volontairement les chaînes qu’il utilisait sur les autres. Kit : **Marteau de Pénitence** (melee, x1.1), **Chaîne de Rappel** (projectile, CD 7, x1.85), défense **Fardeau Partagé** (shield, réduction 92 %), ultime **Toutes les Chaînes sur Moi** (shield_aoe, x4.1).

### Bestiaire

- **Diablotin de cendre** — skirmisher, PV 84, ATQ 12, VIT 7 : Met le feu aux objets et fuit vers le prochain brasier.
- **Templier des chaînes** — tank, PV 122, ATQ 11, VIT 3 : Lie deux unités; les dégâts subis par l’une se transmettent à l’autre.
- **Fiélon contractuel** — support, PV 96, ATQ 9, VIT 6 : Propose un buff immédiat contre une pénalité différée clairement affichée.
- **Molosse de braise** — assassin, PV 88, ATQ 16, VIT 8 : Traque les héros portant une dette ou une marque de péché.
- **Coquille pénitente** — controller, PV 110, ATQ 11, VIT 4 : Absorbe les voix des âmes et réduit la puissance des soins.

### Boss et world boss

- **Duc Vharos des Trois Couronnes** — commander, PV 500, ATQ 19 : Vend des renforts à l’équipe puis retourne leur prix contre elle.
- **Mère des Cendres** — controller, PV 570, ATQ 21 : Fait renaître les ennemis brûlés sous une forme plus faible mais plus nombreuse.
- **Auditeur des Péchés** — commander, PV 640, ATQ 23 : Calcule les actions répétées, les objets consommés et les soins comme une dette de combat.
- **WORLD BOSS — Trône Rouge du Premier Péché** — PV 1550, ATQ 34, DEF 18 : Machine infernale consciente, et non divinité réelle : transforme les regrets en combustible et doit être privée de témoignages falsifiés.

### Reliques et objets de combat

- **Contrat non signé** (`hell_unsigned_contract`) — +2 SPD / +5 DEF. Permet de refuser une offre de boss sans perdre son tour.
- **Cœur de basalte** (`hell_basalt_heart`) — +80 HP / +6 DEF. Réduit les dégâts de feu et conserve une partie de la garde après rupture.
- **Chaîne rachetée** (`hell_redeemed_chain`) — +8 ATK / +5 DEF. Attire un ennemi mais protège ensuite la cible alliée la plus proche.
- **Efface-clause** (`pickup`, `hell_clause_eraser`) — Supprime une dette active et recharge la compétence de défense. Effet : charge 34 / heal 12.
- **Bombe de soufre** (`pickup`, `hell_sulfur_bomb`) — Explose en zone et empêche les coquilles de renaître. Effet : damage 48 / charge 6.
- **Cendre refroidie** (`pickup`, `hell_cooling_ash`) — Apaise les brûlures et protège contre le prochain brasier. Effet : heal 50 / shield 16.
- **Âmes en fuite** (`summon`, `hell_runaway_souls`) — Des âmes libérées traversent les ennemis, emportent leurs contrats et ouvrent une route. Effet : summonDamage 100 / charge 16.
- **Révolte des Neuf Gouffres** (`ultimate`, `hell_nine_pits_revolt`) — Chaque gouffre coupe une chaîne du Trône Rouge avant une onde collective. Effet : ultimateDamage 196 / charge 20.

### Stages

1. **Marché des Contrats Brûlants** — Smash / Hard / objectif `control` / boss **Duc Vharos des Trois Couronnes**. Échoppes suspendues, chaînes-plateformes et offres de combat qui changent les règles.
1. **Gouffre des Auditeurs** — Tactics / Very Hard / objectif `disable` / boss **Auditeur des Péchés**. Grille comptable où trois registres doivent être détruits avant la clôture du tour fiscal infernal.
1. **Salle du Trône Rouge** — RPG / Expert / objectif `overload` / boss **Trône Rouge du Premier Péché**. Boss à jauges de dette, regret et témoignage; tuer les âmes augmente sa puissance.

### Arc narratif

**Arc Univers — La faute n’est pas une propriété** — Infernum traite les regrets comme une monnaie et les condamnés comme un combustible renouvelable.
1. Libérer les contrats du Marché sans accepter les offres du Duc.
2. Détruire les registres qui transforment chaque tentative de réparation en nouvelle dette.
3. Couper le Trône Rouge de ses faux témoignages et ouvrir les neuf sorties.
**Sortie :** Infernum ne devient pas un paradis; il cesse cependant d’être une économie parfaite de la souffrance.
**Récompense d’arc :** Chaîne Rachetée + super « Révolte des Neuf Gouffres »

### Booster ciblé

- **Booster Infernum — Neuf Gouffres** — ID `oc-world:infernum-nine-pits` — 5 cartes par ouverture.
- **Bassin minimum :** 24 récompenses uniques; raretés recommandées : 6 Stable, 9 Rare, 8 Épique, 1 Anomalie.
- **Chasse Anomalie :** `field-super:hell_nine_pits_revolt` — Révolte des Neuf Gouffres.
- **Art :** `/boosters/oc-infernum-nine-pits.webp` ; backdrop : `/images/oc-worlds/infernum-nine-pits/red-throne.png`.
- **Stage custom :** Stage custom — Salle du Trône Rouge ; **HUD :** HUD Dette, Regret & Témoignage.

### Garde-fous de conception

- Cet enfer est original et ne doit pas être présenté comme la doctrine d’une religion réelle.
- Les démons ont des factions, choix et responsabilités distinctes; tous ne sont pas des monstres interchangeables.
- Éviter la torture gratuite comme unique identité visuelle : privilégier architecture, contrats, chaînes et révolte.

## 17. Le Concordat d’Ilyr

- **Clé technique :** `ilyr_concordat`
- **Nom canon interne :** `Ilyr Concordat`
- **Famille compatible :** `sciFi` — **mode principal :** `Tactics` — **difficulté :** `Expert`
- **Tags :** `space-opera`, `alien-species`, `galactic-politics`, `ancient-machines`, `no-human-core`
- **Direction visuelle :** motif `alien-orbital`, ciel `#081c2d → #010306`, grille `#77f2ff`, accent `#c77dff`.

### Identité et conflit

**Origine.** Le Concordat d’Ilyr est un space opera original sans humains dans son noyau : cinq espèces ont bâti une paix fragile autour de voies de résonance et d’une assemblée orbitale.

**Effet de la Brèche.** La Brèche réveille les Architectes Pâles, machines antiques qui confondent compatibilité et uniformité.

**Conflit central.** Préserver la coopération sans effacer les différences biologiques, politiques et mentales des espèces.

### Héros jouables

**Seyra Tal** — `seyra_tal` — tactical / diplomatie de combat / gravité — PV 124 / ATQ 14 / DEF 9 / VIT 8.
Auralith cristalline qui harmonise les masses et représente les petites colonies au Concordat. Kit : **Lance Harmonique** (beam, x0.95), **Accord de Gravité** (gravity, CD 6, x1.85), défense **Prisme de Masse** (shield, réduction 86 %), ultime **Résonance des Cinq Peuples** (beam_aoe, x4.7).

**Korr Venn** — `korr_venn` — marine / assaut lourd / couverture — PV 174 / ATQ 17 / DEF 14 / VIT 3.
Draxid cuirassé, vétéran d’une espèce hexapode qui refuse le retour aux guerres de couvée. Kit : **Canon de Couvée** (bullet, x1.1), **Charge à Six Appuis** (melee, CD 7, x1.95), défense **Carapace Orbitale** (shield, réduction 92 %), ultime **Barrage Draxid Complet** (plasma_aoe, x5.0).

**Ixo-9** — `ixo_9` — hacker / réseau collectif / drones — PV 108 / ATQ 13 / DEF 6 / VIT 10.
Avatar mobile d’un collectif Nym distribué, conçu pour dialoguer avec les esprits individuels. Kit : **Nœud Essaim** (bullet, x0.9), **Consensus Forcé** (glitch, CD 5, x1.8), défense **Répartition de Corps** (dodge, réduction 90 %), ultime **Chœur Nym Non Unanime** (summon_aoe, x4.8).

### Bestiaire

- **Corsaire du Vide velari** — skirmisher, PV 84, ATQ 12, VIT 7 : Utilise des micro-sauts et vole les cellules de propulsion.
- **Aberration du Culte génétique** — bruiser, PV 112, ATQ 15, VIT 4 : Adapte son corps au dernier type de dégâts subi.
- **Drone Nul paléen** — tank, PV 126, ATQ 10, VIT 3 : Supprime les projectiles et construit une géométrie défensive.
- **Parasite de voie résonante** — assassin, PV 88, ATQ 16, VIT 8 : S’attache aux portails et attaque les unités qui les empruntent.
- **Déserteur du Concordat** — support, PV 104, ATQ 9, VIT 5 : Utilise les doctrines des cinq espèces contre leurs propres héros.

### Boss et world boss

- **Archonte Sevrix** — commander, PV 500, ATQ 19 : Manipule les votes tactiques et transforme les renforts refusés en escadrons hostiles.
- **Vaisseau-Chœur du Schisme Nym** — controller, PV 570, ATQ 21 : Divise l’interface en opinions concurrentes et duplique les ordres contradictoires.
- **Cuirassé Nul « Oblique »** — bruiser, PV 640, ATQ 23 : Déploie des surfaces qui rendent les trajectoires droites impossibles.
- **WORLD BOSS — L’Architecte Pâle** — PV 1550, ATQ 34, DEF 18 : Ancienne machine d’espèce inconnue qui convertit les civilisations en formes géométriques compatibles; chaque phase compresse une loi biologique ou sociale.

### Reliques et objets de combat

- **Prisme auralith** (`alien_auralith_prism`) — +7 ATK / +5 DEF. Convertit une partie des dégâts reçus en énergie harmonique pour l’équipe.
- **Plaque de carapace draxid** (`alien_draxid_carapace`) — +85 HP / +6 DEF. Renforce fortement la garde au prix d’un léger ralentissement implicite.
- **Nœud de consensus Nym** (`alien_nym_consensus_node`) — +2 SPD / +7 ATK. Permet à deux héros d’échanger une portion de leur jauge spéciale.
- **Cellule de voie résonante** (`pickup`, `alien_resonance_cell`) — Recharge les propulseurs, les portails et les ultimes technologiques. Effet : charge 38 / heal 8.
- **Éclat de géométrie nulle** (`pickup`, `alien_null_shard`) — Découpe une défense construite et inflige des dégâts de structure. Effet : damage 48 / charge 6.
- **Gel symbiotique kesh** (`pickup`, `alien_symbiotic_gel`) — Répare les tissus de plusieurs espèces sans uniformiser leur biologie. Effet : heal 54 / shield 12.
- **Escadrille des Cinq Peuples** (`summon`, `alien_five_species_wing`) — Vaisseaux auralith, draxid, nym, velari et kesh exécutent une passe combinée. Effet : summonDamage 110 / charge 12.
- **Concordat Incompressible** (`ultimate`, `alien_concordat_unbroken`) — Les cinq signatures refusent la géométrisation et renvoient l’onde de compression. Effet : ultimateDamage 198 / charge 20.

### Stages

1. **Assemblée orbitale d’Ilyr** — Tactics / Hard / objectif `control` / boss **Archonte Sevrix**. Cinq secteurs biologiquement distincts; tenir un quorum exige au moins trois espèces alliées.
1. **Lune vivante Nym** — Smash / Very Hard / objectif `survive` / boss **Vaisseau-Chœur du Schisme Nym**. Surface organique qui reconfigure les plateformes selon le consensus du vaisseau.
1. **Treillis de l’Architecte Pâle** — RPG / Expert / objectif `overload` / boss **L’Architecte Pâle**. Matrice abstraite où chaque phase retire une propriété : couleur, espèce, distance, puis choix.

### Arc narratif

**Arc Univers — La différence n’est pas une erreur** — Le Concordat vacille lorsque l’Architecte Pâle affirme que la paix exige de convertir toutes les espèces en une forme compatible.
1. Empêcher l’Archonte de transformer le vote d’urgence en pouvoir permanent.
2. Réconcilier les instances du Vaisseau-Chœur sans forcer un consensus artificiel.
3. Entrer dans le Treillis et restaurer une propriété différente à chaque peuple.
**Sortie :** Le Concordat survit comme négociation difficile, pas comme fusion; A.R.C.A. obtient sa première alliance entièrement non humaine.
**Récompense d’arc :** Bannière « Cinq Peuples, Cinq Formes » + escadrille interespèces

### Booster ciblé

- **Booster Concordat d’Ilyr** — ID `oc-world:ilyr-concordat` — 5 cartes par ouverture.
- **Bassin minimum :** 24 récompenses uniques; raretés recommandées : 6 Stable, 9 Rare, 8 Épique, 1 Anomalie.
- **Chasse Anomalie :** `profile-banner:alien_five_forms` — Cinq Peuples, Cinq Formes.
- **Art :** `/boosters/oc-ilyr-concordat.webp` ; backdrop : `/images/oc-worlds/ilyr-concordat/pale-lattice.png`.
- **Stage custom :** Stage custom — Treillis de l’Architecte Pâle ; **HUD :** HUD des Cinq Signatures.

### Garde-fous de conception

- Donner à chaque espèce une biologie, une culture et des divergences internes; éviter la planète mono-culture.
- Aucune espèce ne doit être la copie transparente des humains, des Asari, des Sith ou d’une faction connue.
- Le conflit central porte sur l’uniformisation, pas sur une race « naturellement mauvaise ».

## 18. Le Testament Noyé

- **Clé technique :** `drowned_testament`
- **Nom canon interne :** `The Drowned Testament`
- **Famille compatible :** `horror` — **mode principal :** `RPG` — **difficulté :** `Expert`
- **Tags :** `cosmic-horror`, `lovecraftian`, `oceanic`, `dream-geometry`, `investigation`
- **Direction visuelle :** motif `abyssal-harbor`, ciel `#071b24 → #010304`, grille `#70d6ff`, accent `#c77dff`.

### Identité et conflit

**Origine.** Le Testament Noyé est un univers d’horreur cosmique entièrement original : Greywake, ville-port, découvre une intelligence sous-marine décrite par des textes impossibles.

**Effet de la Brèche.** La Brèche rend le texte auto-réplicatif et permet au Dormeur derrière la Marée de lire en retour les archives d’A.R.C.A.

**Conflit central.** Étudier l’inconnu sans le réduire, résister à la soumission narrative et empêcher une connaissance de devenir un culte automatique.

### Héros jouables

**Dr Mara Ell** — `mara_ell` — hacker / enquête / déchiffrement — PV 112 / ATQ 13 / DEF 7 / VIT 9.
Xénolinguiste de l’Institut Pelagic qui traduit les inscriptions sans accepter leurs ordres. Kit : **Lampe de Fréquence** (beam, x0.9), **Phrase Incomplète** (glitch, CD 5, x1.75), défense **Axiome de Réalité** (shield, réduction 85 %), ultime **Traduction sans Soumission** (dark_aoe, x4.7).

**Jonas Mire** — `jonas_mire` — marine / survie / protection — PV 156 / ATQ 15 / DEF 13 / VIT 4.
Gardien du phare de Greywake qui maintient la lumière pendant que la côte oublie sa forme. Kit : **Harpon de Quai** (projectile, x1.05), **Faisceau du Phare** (beam, CD 7, x1.85), défense **Manteau Huilé** (shield, réduction 90 %), ultime **Lumière jusqu’au Fond** (beam_aoe, x4.6).

**Oona Vell** — `oona_vell` — horror / rêve / mobilité impossible — PV 120 / ATQ 14 / DEF 7 / VIT 10.
Cartographe de rêves qui revient avec des cartes valables seulement lorsque personne ne les regarde directement. Kit : **Aiguille Onirique** (magic, x0.95), **Angle Dormant** (teleport, CD 5, x1.8), défense **Réveil Latéral** (dodge, réduction 90 %), ultime **Carte du Rivage qui n’Existe Pas** (fear_aoe, x4.9).

### Bestiaire

- **Cultiste lié au sel** — support, PV 88, ATQ 9, VIT 6 : Chante pour augmenter la Pression de Rêve et renforcer les créatures marines.
- **Sangsue de rêve** — assassin, PV 80, ATQ 16, VIT 8 : S’attache à la compétence la plus utilisée et augmente son temps de recharge.
- **Rejeton du Chœur Profond** — bruiser, PV 116, ATQ 14, VIT 4 : Ses cris superposés créent des zones où l’interface devient incertaine.
- **Traqueur d’angles** — skirmisher, PV 96, ATQ 13, VIT 7 : Se déplace entre deux coins non adjacents sans traverser l’espace.
- **Coquille couverte de balanes** — tank, PV 134, ATQ 10, VIT 2 : Ancien habitant vidé de sa voix; l’armure tombe lorsque son nom est retrouvé.

### Boss et world boss

- **Le Phare qui Regarde** — controller, PV 500, ATQ 19 : Son faisceau suit le joueur, inverse ombre et lumière et ouvre un œil à chaque tour complet.
- **Le Chœur sous la Ville** — commander, PV 570, ATQ 21 : Chaque voix contrôle une couche sonore; couper les mauvaises voix renforce les autres.
- **Cartographe des Angles Impossibles** — controller, PV 640, ATQ 23 : Plie la grille, superpose les cases et transforme la distance en variable.
- **WORLD BOSS — Le Dormeur derrière la Marée** — PV 1550, ATQ 34, DEF 18 : Entité cosmique entièrement originale : sa présence augmente la Pression de Rêve, fait reculer le littoral et ne peut être repoussée qu’en détruisant le Testament qui l’appelle.

### Reliques et objets de combat

- **Lentille de Greywake** (`lovecraft_greywake_lens`) — +6 DEF / +2 SPD. Révèle les silhouettes entre deux états et réduit les embuscades angulaires.
- **Cylindre de cire inversé** (`lovecraft_wax_cylinder`) — +7 ATK / +5 DEF. Enregistre un chant hostile et le rejoue sous forme de contre-fréquence.
- **Compas de rêve** (`lovecraft_dream_compass`) — +2 SPD / +45 HP. Indique une sortie possible lorsque la géométrie du stage change.
- **Lampe au sel bleu** (`pickup`, `lovecraft_salt_lamp`) — Révèle les entités invisibles et brûle les membranes de rêve. Effet : damage 43 / charge 10.
- **Tonique d’éveil** (`pickup`, `lovecraft_waking_tonic`) — Réduit la Pression de Rêve et soigne sans représenter la santé mentale comme une barre de vie. Effet : heal 52 / shield 12.
- **Craie des angles sûrs** (`pickup`, `lovecraft_chalk_angles`) — Fixe temporairement la géométrie autour d’une case. Effet : charge 34 / damage 16.
- **Sauveteurs de Greywake** (`summon`, `lovecraft_greywake_rescuers`) — Une équipe de marins sonne les cloches, extrait un allié et harponne le monstre prioritaire. Effet : summonDamage 94 / charge 18.
- **Briser le Testament Noyé** (`ultimate`, `lovecraft_break_testament`) — Les pages sont séparées, leurs phrases cessent de former un appel et la marée cosmique recule. Effet : ultimateDamage 196 / charge 22.

### Stages

1. **Port de Greywake à marée basse** — Smash / Hard / objectif `survive` / boss **Le Phare qui Regarde**. Quais inclinés, cloches, eau montante et faisceau du phare comme danger mobile.
1. **Observatoire des Angles Impossibles** — Tactics / Very Hard / objectif `artifact` / boss **Cartographe des Angles Impossibles**. Grille non euclidienne simulée par téléportations, cases superposées et trois cartes à récupérer.
1. **Basilique sous la Marée** — RPG / Expert / objectif `overload` / boss **Le Dormeur derrière la Marée**. Sanctuaire englouti, Pression de Rêve globale et pages du Testament servant de boucliers de phase.

### Arc narratif

**Arc Univers — Connaître sans se soumettre** — Le Testament Noyé décrit une entité si précisément que chaque lecteur devient une nouvelle voix de l’appel.
1. Maintenir le phare sans laisser son faisceau devenir un œil.
2. Cartographier l’Observatoire en acceptant plusieurs géométries compatibles.
3. Traduire puis décomposer le Testament avant le réveil complet du Dormeur.
**Sortie :** Greywake ne comprend pas tout ce qui vit sous la marée, mais elle prouve qu’ignorer et adorer ne sont pas les deux seules réponses.
**Récompense d’arc :** HUD « Pression de Rêve » + lentille de Greywake

### Booster ciblé

- **Booster Testament Noyé** — ID `oc-world:drowned-testament` — 5 cartes par ouverture.
- **Bassin minimum :** 24 récompenses uniques; raretés recommandées : 6 Stable, 9 Rare, 8 Épique, 1 Anomalie.
- **Chasse Anomalie :** `hud:lovecraft_dream_pressure` — Pression de Rêve.
- **Art :** `/boosters/oc-drowned-testament.webp` ; backdrop : `/images/oc-worlds/drowned-testament/abyssal-basilica.png`.
- **Stage custom :** Stage custom — Basilique sous la Marée ; **HUD :** HUD Pression de Rêve.

### Garde-fous de conception

- Ne pas utiliser Cthulhu, Innsmouth, Necronomicon ou autres noms existants : ce monde doit rester OC.
- Remplacer le cliché de la « jauge de folie » par une Pression de Rêve liée au terrain, au signal et au sommeil.
- Ne pas associer maladie mentale et monstruosité; l’horreur vient de l’échelle cosmique et de la perte de repères.

## 19. Valedor — La Couronne Brisée

- **Clé technique :** `valedor_shattered_crown`
- **Nom canon interne :** `Valedor: The Shattered Crown`
- **Famille compatible :** `arcane` — **mode principal :** `RPG` — **difficulté :** `Expert`
- **Tags :** `classic-fantasy`, `elves`, `dwarves`, `orcs`, `dragons`
- **Direction visuelle :** motif `fantasy-kingdom`, ciel `#1d3557 → #03060a`, grille `#8fefb5`, accent `#f4a261`.

### Identité et conflit

**Origine.** Valedor est une fantasy classique originale faite de cités, forêts anciennes, montagnes-forges, clans orcs, dragons, morts-vivants et magie runique.

**Effet de la Brèche.** Le Sans-Auteur utilise les clichés de chaque peuple pour reconstruire une Couronne qui attribue définitivement héros, monstres et serviteurs.

**Conflit central.** Conserver les archétypes lisibles du genre tout en donnant à chaque peuple une histoire, des factions internes et une liberté morale.

### Héros jouables

**Aelwen Starbough** — `aelwen_starbough` — hacker / archerie arcanique / contrôle — PV 116 / ATQ 15 / DEF 7 / VIT 10.
Éclaireuse elfe qui refuse que les forêts anciennes servent de prétexte à dominer les peuples plus jeunes. Kit : **Flèche d’Étoile** (projectile, x1.0), **Racine de Lune** (magic, CD 5, x1.8), défense **Pas de Canopée** (dodge, réduction 90 %), ultime **Pluie sur les Sept Royaumes** (projectile_aoe, x4.8).

**Brokk Embervein** — `brokk_embervein` — marine / tank / forge — PV 168 / ATQ 15 / DEF 14 / VIT 3.
Forgeron nain dont le clan a fabriqué une part de la Couronne et veut réparer le serment, pas restaurer le roi. Kit : **Marteau de Forge** (melee, x1.1), **Onde de Mithral** (melee, CD 7, x1.85), défense **Rempart Runique** (shield, réduction 92 %), ultime **Enclume des Sept Serments** (earth_aoe, x4.6).

**Goruk Ash-Tusk** — `goruk_ash_tusk` — slayer / briseur / protection de groupe — PV 154 / ATQ 19 / DEF 10 / VIT 5.
Chef orc élu qui combat le Lich après des siècles où les couronnes humaines ont utilisé son peuple comme ennemi pratique. Kit : **Hache des Cendres** (melee, x1.2), **Cri du Clan Libre** (buff, CD 6, x1.75), défense **Épaule du Frère** (shield, réduction 84 %), ultime **Aucun Peuple ne Sera l’Ennemi** (melee_aoe, x5.2).

### Bestiaire

- **Sapeur gobelin mercenaire** — skirmisher, PV 84, ATQ 12, VIT 7 : Pose des charges sur les obstacles mais peut changer de camp si son contrat est brisé.
- **Chevalier creux** — tank, PV 122, ATQ 11, VIT 3 : Armure animée par un serment sans porteur; vulnérable aux attaques qui restaurent un nom.
- **Brute troll des ponts** — bruiser, PV 116, ATQ 14, VIT 4 : Régénère tant que le pont ou territoire qu’il garde reste contesté.
- **Matriarche araignée des ruines** — controller, PV 106, ATQ 12, VIT 5 : Relie les cases par des toiles et protège ses œufs plutôt qu’un maître maléfique.
- **Archer spectre de l’ancienne cour** — assassin, PV 92, ATQ 15, VIT 7 : Tire depuis les bannières de royaumes disparus.

### Boss et world boss

- **Lich Sans Couronne** — commander, PV 500, ATQ 19 : Anime les serments brisés et change de corps tant qu’un fragment de Couronne reste actif.
- **Dragon du Pic Creux** — bruiser, PV 570, ATQ 21 : Protège un trésor composé de mémoires volées; ses écailles s’ouvrent lorsque les reliques sont rendues.
- **Reine des Ronces** — controller, PV 640, ATQ 23 : Étend une forêt défensive qui distingue intrus, réfugiés et anciens propriétaires.
- **WORLD BOSS — Vaelgor, Premier Wyrm** — PV 1550, ATQ 34, DEF 18 : Dragon primordial réveillé par les sept fragments : chaque royaume l’a raconté différemment, et il change de phase selon la version dominante.

### Reliques et objets de combat

- **Anneau des Sept Serments** (`fantasy_seven_oath_ring`) — +7 DEF / +50 HP. Gagne un effet différent lorsqu’un elfe, nain ou orc est présent dans la cellule.
- **Éclat d’enclume de mithral** (`fantasy_mithral_anvil_shard`) — +8 ATK / +5 DEF. Renforce les attaques physiques et permet de réparer un obstacle.
- **Carquois de racine lunaire** (`fantasy_moonroot_quiver`) — +8 ATK / +2 SPD. Les projectiles marquent la case et ralentissent la régénération ennemie.
- **Élixir de soin partagé** (`pickup`, `fantasy_healing_draught`) — Soigne davantage lorsque plusieurs peuples sont représentés dans l’équipe. Effet : heal 56 / shield 10.
- **Charge runique de sapeur** (`pickup`, `fantasy_runic_bomb`) — Détruit couvert, toile ou fragment nécromantique. Effet : damage 48 / charge 6.
- **Pierre de chemin** (`pickup`, `fantasy_waystone`) — Crée un point de voyage court et recharge les héros qui l’utilisent. Effet : charge 36 / heal 10.
- **Compagnie des Trois Peuples** (`summon`, `fantasy_free_company`) — Archers elfes, boucliers nains et briseurs orcs interviennent ensemble. Effet : summonDamage 108 / charge 12.
- **Les Sept Serments Réunis** (`ultimate`, `fantasy_seven_oaths_united`) — Les fragments ne reforment pas une couronne : ils deviennent sept balises qui frappent Vaelgor. Effet : ultimateDamage 200 / charge 20.

### Stages

1. **Carrefour de la Cité Libre** — Tactics / Hard / objectif `control` / boss **Reine des Ronces**. Quartiers elfique, nain, orc et humain; tenir les places sans expulser leurs habitants.
1. **Pic Creux du Dragon** — Smash / Very Hard / objectif `artifact` / boss **Dragon du Pic Creux**. Corniches, trésors-mémoires et souffles qui modifient les plateformes.
1. **Trône aux Sept Fragments** — RPG / Expert / objectif `overload` / boss **Vaelgor, Premier Wyrm**. Chaque fragment active une version différente de l’histoire du dragon et du royaume.

### Arc narratif

**Arc Univers — Aucun peuple n’est un rôle** — Le Lich Sans Couronne attise les anciennes histoires : les elfes seraient arrogants, les nains cupides et les orcs nés pour la guerre.
1. Défendre la Cité Libre avec une cellule interpeuples.
2. Rendre les mémoires du trésor au lieu de simplement tuer le dragon gardien.
3. Transformer les fragments de Couronne en serments mutuels avant le réveil complet de Vaelgor.
**Sortie :** Valedor reste un monde de fantasy classique, mais ses peuples cessent d’être des classes morales; la Couronne ne revient pas.
**Récompense d’arc :** Anneau des Sept Serments + bannière « Trois Peuples, Une Cellule »

### Booster ciblé

- **Booster Valedor — Couronne Brisée** — ID `oc-world:valedor-shattered-crown` — 5 cartes par ouverture.
- **Bassin minimum :** 24 récompenses uniques; raretés recommandées : 6 Stable, 9 Rare, 8 Épique, 1 Anomalie.
- **Chasse Anomalie :** `profile-banner:fantasy_three_peoples_cell` — Trois Peuples, Une Cellule.
- **Art :** `/boosters/oc-valedor-shattered-crown.webp` ; backdrop : `/images/oc-worlds/valedor-shattered-crown/shattered-throne.png`.
- **Stage custom :** Stage custom — Trône aux Sept Fragments ; **HUD :** HUD des Sept Serments.

### Garde-fous de conception

- Les orcs ne doivent jamais former la masse ennemie générique; Goruk est un protagoniste central.
- Les elfes et nains ont des conflits internes, classes sociales et visions politiques variées.
- Les créatures animales ou monstrueuses peuvent défendre un territoire plutôt qu’être intrinsèquement mauvaises.

## 20. Aevum Fracture — L’Histoire au Pluriel

- **Clé technique :** `aevum_fracture`
- **Nom canon interne :** `Aevum Fracture`
- **Famille compatible :** `tactical` — **mode principal :** `Tactics` — **difficulté :** `Expert`
- **Tags :** `uchronia`, `alternate-history`, `timeline-war`, `propaganda`, `historical-memory`
- **Direction visuelle :** motif `fractured-capital`, ciel `#14213d → #020307`, grille `#4cc9f0`, accent `#f77f00`.

### Identité et conflit

**Origine.** Aevum Fracture est une uchronie entièrement fictive où quatre versions d’une même capitale et de ses nations se superposent après l’invention du Moteur chronal.

**Effet de la Brèche.** Le Sans-Auteur propose de résoudre les contradictions en choisissant une seule ligne victorieuse et en transformant les autres populations en erreurs.

**Conflit central.** Conserver les sources, les témoins et les conséquences de plusieurs histoires sans romantiser une timeline comme monde parfait.

### Héros jouables

**Élise Varenne** — `elise_varenne` — tactical / espionnage temporel / tir — PV 126 / ATQ 15 / DEF 8 / VIT 8.
Agente de la République de Lume, seule personne à se souvenir de quatre versions incompatibles de la capitale. Kit : **Pistolet de Minuit** (bullet, x1.0), **Passeport Impossible** (teleport, CD 5, x1.75), défense **Couverture Diplomatique** (dodge, réduction 87 %), ultime **Quatre Capitales, Un Signal** (bullet_aoe, x4.8).

**Tomas Grey** — `tomas_grey` — marine / sape / protection — PV 158 / ATQ 15 / DEF 13 / VIT 4.
Ingénieur du Commonwealth du Ciel qui démonte les monuments ajoutés rétroactivement par le Ministère. Kit : **Fusil de Sape** (bullet, x1.05), **Charge Anachrone** (projectile, CD 7, x1.9), défense **Bouclier de Tranchée Mobile** (shield, réduction 90 %), ultime **Démolition du Monument Faux** (explosive_aoe, x4.8).

**Safiya Nadir** — `safiya_nadir` — hacker / archives / contre-propagande — PV 112 / ATQ 13 / DEF 7 / VIT 10.
Historienne de l’Assemblée Océanique qui conserve des sources contradictoires au lieu d’élire une vérité officielle. Kit : **Projection de Source** (beam, x0.9), **Note de Bas de Page** (glitch, CD 5, x1.8), défense **Référence Croisée** (shield, réduction 86 %), ultime **Archives des Vies Non Advenues** (glitch_aoe, x4.9).

### Bestiaire

- **Constable de chronologie** — tank, PV 118, ATQ 10, VIT 3 : Arrête les unités qui portent un objet provenant d’une autre ligne temporelle.
- **Soldat anachrone** — skirmisher, PV 88, ATQ 13, VIT 7 : Change d’arme et de doctrine selon la capitale actuellement dominante.
- **Doppelgänger de propagande** — controller, PV 102, ATQ 11, VIT 5 : Copie un héros puis modifie son nom, son portrait et sa citation de victoire.
- **Molosse chronal** — assassin, PV 88, ATQ 16, VIT 8 : Suit les traces de retour en arrière et punit les déplacements répétés.
- **Citoyen effacé automatisé** — support, PV 104, ATQ 9, VIT 5 : Silhouette forcée au combat; peut être restaurée comme témoin plutôt que tuée.

### Boss et world boss

- **Empereur de la Ligne Victorieuse** — commander, PV 500, ATQ 19 : Déclare chaque tour comme preuve historique de sa victoire et invoque des monuments défensifs.
- **Ministre d’Hier** — controller, PV 570, ATQ 21 : Réécrit les objectifs accomplis et transforme les archives contradictoires en crimes.
- **Général Qui-N’a-Jamais-Perdu** — bruiser, PV 640, ATQ 23 : Recharge sa phase précédente lorsqu’il est vaincu sans preuve documentaire suffisante.
- **WORLD BOSS — Moteur de l’Histoire Unique** — PV 1550, ATQ 34, DEF 18 : Machine construite dans plusieurs futurs : compare les lignes, élimine les écarts et doit être forcée à conserver quatre vérités incompatibles.

### Reliques et objets de combat

- **Passeport impossible** (`uchronia_impossible_passport`) — +2 SPD / +4 DEF. Autorise un déplacement entre deux zones historiques incompatibles.
- **Archive à références croisées** (`uchronia_cross_reference_archive`) — +7 DEF / +45 HP. Empêche l’annulation d’un objectif déjà prouvé par deux sources.
- **Charge anachrone** (`uchronia_anachron_charge`) — +10 ATK / +1 SPD. Inflige davantage de dégâts aux structures ajoutées par réécriture temporelle.
- **Journal aux quatre dates** (`pickup`, `uchronia_newspaper_four_dates`) — Révèle les quatre versions du prochain événement de terrain. Effet : charge 36 / heal 8.
- **Charge anti-monument** (`pickup`, `uchronia_false_monument_charge`) — Détruit une structure de propagande et blesse son protecteur. Effet : damage 48 / charge 6.
- **Enregistrement de témoin** (`pickup`, `uchronia_witness_recording`) — Restaure un citoyen effacé et soigne la cellule proche. Effet : heal 52 / shield 12.
- **Cellule des Quatre Lignes** (`summon`, `uchronia_four_timeline_cell`) — Quatre versions compatibles d’une unité interviennent sans fusionner leurs souvenirs. Effet : summonDamage 104 / charge 14.
- **L’Histoire au Pluriel** (`ultimate`, `uchronia_history_plural`) — Les quatre capitales apparaissent ensemble et saturent le Moteur de preuves contradictoires. Effet : ultimateDamage 198 / charge 22.

### Stages

1. **Capitale aux Quatre Minuits** — Smash / Hard / objectif `control` / boss **Général Qui-N’a-Jamais-Perdu**. Quatre skylines alternent toutes les trente secondes et changent armes, plateformes et dangers.
1. **Ministère de l’Histoire Correcte** — Tactics / Very Hard / objectif `artifact` / boss **Ministre d’Hier**. Archives labyrinthiques où trois sources contradictoires doivent être placées dans le même dossier.
1. **Moteur de l’Histoire Unique** — RPG / Expert / objectif `overload` / boss **Moteur de l’Histoire Unique**. Boss à quatre timelines; un choix sauvegardé dans une ligne modifie les trois autres sans les remplacer.

### Arc narratif

**Arc Univers — Aucune chronologie n’est la seule** — Le Moteur de l’Histoire Unique a trouvé le Nexus et veut sélectionner la ligne qui produit le moins de contradictions.
1. Stabiliser la Capitale aux Quatre Minuits sans choisir un vainqueur.
2. Sauver les témoins et leurs sources du Ministère d’Hier.
3. Forcer le Moteur à archiver quatre passés et quatre futurs simultanément.
**Sortie :** Aevum devient un réseau d’uchronies documentées plutôt qu’une guerre pour la vérité unique; les habitants gardent mémoire des coûts de chaque monde.
**Récompense d’arc :** HUD « Quatre Dates » + titre « Témoin de l’Impossible »

### Booster ciblé

- **Booster Aevum Fracture** — ID `oc-world:aevum-fracture` — 5 cartes par ouverture.
- **Bassin minimum :** 24 récompenses uniques; raretés recommandées : 6 Stable, 9 Rare, 8 Épique, 1 Anomalie.
- **Chasse Anomalie :** `hud:uchronia_four_dates` — Les Quatre Dates.
- **Art :** `/boosters/oc-aevum-fracture.webp` ; backdrop : `/images/oc-worlds/aevum-fracture/one-history-engine.png`.
- **Stage custom :** Stage custom — Moteur de l’Histoire Unique ; **HUD :** HUD des Quatre Dates.

### Garde-fous de conception

- Utiliser des États, guerres et idéologies fictifs afin de ne pas transformer des atrocités réelles en simple décoration.
- Chaque timeline doit avoir gains, pertes et contradictions; aucune ne constitue l’utopie objective.
- L’uchronie doit porter sur les conséquences historiques, pas devenir un deuxième skin dieselpunk.

## 5. Architecture d’intégration recommandée

### 5.1 Nouveaux fichiers

1. `src/game/originalUniverseWave.js` : version compacte compatible avec la forme de `REQUESTED_UNIVERSE_WAVE`.
2. `src/game/originalUniverseDefinitions.js` ou import JSON : fiches riches, kits, world boss, trois stages, arcs et garde-fous.
3. `src/game/originalUniverseUnlockables.js` : uniquement les HUD, archives et chasses Anomalie custom; les 11 récompenses génériques restent produites par `universeUnlockables.js`.
4. `src/game/originalUniverseBoosters.js` : 20 boosters ciblés + 4 boosters de vague.
5. `src/game/originalUniverseIntegrity.test.js` : contraintes de quantité, unicité et résolution des références.

### 5.2 Modifications des fichiers existants

- `expandedUniverses.js` : importer `ORIGINAL_UNIVERSE_WAVE`, le concaténer aux définitions, conserver `sourceType` et `isOriginal`, et ne pas remplacer les kits riches par les valeurs génériques.
- `dlcConfig.js` : introduire `ORIGINAL_CAMPAIGN_UNIVERSES`. Les mondes OC ne sont pas des licences DLC; ils peuvent être absents du tutoriel mais déverrouillés par vagues.
- `portalBoosterCatalog.js` : importer `ORIGINAL_WORLD_BOOSTERS`; ne pas les placer dans `PERMANENT_OC_BOOSTERS`, qui reste la campagne Cellule ZÉRO du Nexus.
- `PortalScreen.jsx` : ajouter le filtre **MONDES OC**, la recherche par sous-genre et une vue de vague pour éviter vingt tuiles permanentes simultanées.
- `heroes.js`, `enemies.js`, `battleItems.js`, `lore.js` : fusion data-driven via les exports générés; aucun `switch` manuel de 20 cas.
- `narrativeSystems.js` : générer un arc univers par définition et relier ses trois stages dans l’ordre.
- `characterPlaques.js` : générer une plaque minimale depuis `loreRole`, puis permettre des overrides écrits à la main.
- `stageLoreProfiles.js`, `tacticsBattlefields.js`, `smashArenas.js` : utiliser `objectiveType`, `motif` et les mécaniques de stage au lieu d’un décor générique.
- `spriteAssets.js` et `renderer.js` : prévoir les chemins de sprites et de backdrops; garder le fallback mais considérer les assets manquants comme erreur de QA avant production.

### 5.3 Progression recommandée

- Vague 1 après le premier arc OC Nexus stabilisé.
- Vague 2 après 9 stages OC terminés.
- Vague 3 après 24 stages OC terminés.
- Vague 4 après 42 stages OC terminés.
- Les boosters individuels passent dans une rotation dédiée de 5 mondes; les quatre boosters de vague restent accessibles comme catalogue.

## 6. Ordre de travail pour Codex

1. **Tests avant données** : écrire le test d’intégrité et le faire échouer proprement.
2. **Adaptateur de données** : intégrer une seule Trame pilote, `Neon Requiem`, sans asset final.
3. **Moteurs de jeu** : vérifier RPG, Tactics et Smash avec les trois stages de la pilote.
4. **Booster et sauvegarde** : vérifier ouverture de 5 cartes, doublons, pity, chasses Anomalie, sérialisation cloud et migrations de save.
5. **Vague 1 complète** : intégrer les cinq rétrofuturismes, puis rejouer tous les tests.
6. **Vagues mythologiques** : intégrer avec revue culturelle avant gel des noms et visuels.
7. **Vague Horizons interdits** : vérifier spécialement Pression de Rêve, dette infernale, cinq espèces, serments interpeuples et timelines.
8. **Assets** : seulement après stabilisation des IDs; produire booster, backdrop, plaque, sprite et VFX sans renommer les clés.
9. **QA finale** : build Vite, tests, console navigateur, sauvegarde ancienne, mobile, accessibilité et performance.

## 7. Critères d’acceptation obligatoires

- 20 clés d’univers uniques; aucun alias ne crée un doublon.
- 60 IDs de héros uniques et chaque booster cible exactement les trois héros de sa Trame.
- Chaque stage résout un boss existant et chaque arc référence ses trois stages dans l’ordre.
- Chaque world boss possède PV, ATQ, DEF, VIT, couleur, arme et spécial.
- Chaque univers dispose de 24 candidats minimum avant ouverture du booster.
- La chasse Anomalie de chaque booster existe réellement dans le pool.
- Les 20 univers sont visibles dans le Codex sous une famille « Original » distincte.
- Les mondes mythologiques affichent clairement ce qui vient des sources culturelles et ce qui est invention du jeu.
- Aucune sauvegarde existante n’est invalidée; les nouveaux champs utilisent des valeurs par défaut.
- Aucun asset manquant, aucune erreur console, aucun écran noir dans les trois modes.

## 8. Statut de ce dossier

Ce document est une **spécification complète et validée structurellement**. Il ne prétend pas que les fichiers du dépôt ont déjà été modifiés ou déployés. Les noms et contenus sont prêts pour une passe de validation créative, culturelle et juridique avant l’intégration Codex.
