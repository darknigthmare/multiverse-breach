# Registre OpenAI ImageGen — Leon et Ancre, CG06 à CG08

Date de génération : 2026-08-01

Outil : OpenAI ImageGen intégré à Codex, exclusivement en mode built-in. Six appels initiaux distincts ont été effectués, un par asset. Aucune CLI ni génération groupée à variantes n'a été utilisée.

Les six compositions sont originales et non officielles. Les PNG locaux CG01 servent uniquement de références strictes d'identité, de version, d'équipement et de style. Aucun bitmap officiel Capcom n'a été fourni à ImageGen.

## Autorités et faits

Références officielles Capcom utilisées uniquement pour les faits concernant Leon :

- https://game.capcom.com/residentevil/uk/re-history.html — Resident Evil 2 se déroule le 29 septembre 1998 ; Leon entre dans Raccoon City pour commencer son nouveau travail de policier.
- https://game.capcom.com/residentevil/uk/exfile-2-5.html — Leon a vingt et un ans pendant RE2, sort de l'académie de police et est affecté au Raccoon City Police Department.
- https://game.capcom.com/residentevil/en/exfile-2-6.html — le R.P.D. possède un hall principal grandiose, des statues de pierre et une architecture plus extravagante qu'un commissariat ordinaire.
- https://game.capcom.com/residentevil/it/umbrella-20200828110000.html — l'histoire de Leon commence dans RE2 comme policier débutant arrivant à Raccoon City.

Références locales d'autorité :

- public/cg/resident-evil/leon/character-solo-openai-v1.png — CG01 stricte de Leon pour les six invariants identité/version/style de ses trois poses.
- public/cg/nexus-de-convergence/player-anchor/character-solo-openai-v1.png — CG01 stricte de l'Ancre pour les six invariants identité/armure/gantelet/style de ses trois poses.
- docs/cg/CG_PILOT_PROMPTS.md — continuités, silhouettes, équipements et règles visuelles approuvés des deux CG01.
- docs/cg/wave-approvals.json — autorisation CG06–CG08 et obligation de réutiliser exactement la CG01 approuvée.
- src/game/characterPlaques.js, entrée player_anchor — l'Ancre n'est pas invoquée par portail ; elle reste entière lorsque plusieurs Trames se superposent.
- .tmp-specs-multiverse-breach-2026-07-31/Multiverse_Breach_Extension_Specs_2026-07-31/11_FICHES_PAR_PERSONNAGE/0453_nexus-de-convergence__player-anchor.txt — fiche locale de doctrine et tests d'acceptation de l'Ancre.

## Résultats retenus

Chaque source acceptée est nativement au format PNG RGB 24 bits, 1086 × 1448 pixels, soit un portrait 3:4 exact. Chaque destination est une copie binaire exacte de sa source ImageGen, sans recadrage, redimensionnement, interpolation ni retouche.

| Asset | Destination | Source ImageGen retenue | Octets | SHA-256 |
| --- | --- | --- | ---: | --- |
| Leon CG06 introPose | public/cg/resident-evil/leon/intro-pose-openai-v1.png | C:\Users\chuck\.codex\generated_images\019fbcaa-571b-7071-a290-577322f40a7e\exec-a61926ae-7ee5-47e7-9deb-a2883cffef03.png | 2337196 | 127d0e23da0aec3372969ea5a603da278b7463b306ceab0b0feb49d4fd159ea3 |
| Leon CG07 victoryPose | public/cg/resident-evil/leon/victory-pose-openai-v1.png | C:\Users\chuck\.codex\generated_images\019fbcaa-571b-7071-a290-577322f40a7e\exec-bd244fe2-4c88-48d9-ab0b-c2b69d712425.png | 2329641 | a9013530e83a7b167c7ea1ac9a4fcf220cb6657a65a1675a19d3f84ede40ecc9 |
| Leon CG08 defeatPose | public/cg/resident-evil/leon/defeat-pose-openai-v1.png | C:\Users\chuck\.codex\generated_images\019fbcaa-571b-7071-a290-577322f40a7e\exec-c439f2db-cd9f-42cf-a988-31a11b478ef5.png | 2389147 | 2bd5bd066e0b26b35c6d1c805c3a77f876087802d172c0ffd836cbe801b5d939 |
| Ancre CG06 introPose | public/cg/nexus-de-convergence/player-anchor/intro-pose-openai-v1.png | C:\Users\chuck\.codex\generated_images\019fbcaa-571b-7071-a290-577322f40a7e\exec-9d21bead-7df5-45ee-a231-9944d7fa5d3e.png | 2530865 | 574ac162b8b12620d21deaad61e0f113529dc1be170e813182b3f2b843d0991e |
| Ancre CG07 victoryPose | public/cg/nexus-de-convergence/player-anchor/victory-pose-openai-v1.png | C:\Users\chuck\.codex\generated_images\019fbcaa-571b-7071-a290-577322f40a7e\exec-0f9940bc-24c1-4a68-b93d-cd1d93585015.png | 2277448 | 0422dc99c37ad971c5280fb0d555507587b105b0adc92a95d78594a035de67f5 |
| Ancre CG08 defeatPose | public/cg/nexus-de-convergence/player-anchor/defeat-pose-openai-v1.png | C:\Users\chuck\.codex\generated_images\019fbcaa-571b-7071-a290-577322f40a7e\exec-a4b1d0e6-3369-4455-820b-33062238e867.png | 2183190 | 170eb6c5745152d59049041792f7ca5771283554b5c063e92c666e92363df735 |

## Leon CG06 — arrivée prudente

Rôle de l'image d'entrée : public/cg/resident-evil/leon/character-solo-openai-v1.png est la référence stricte approuvée d'identité, de continuité 1998, de tenue, d'équipement, de proportions, de palette et de style. Ce n'est pas une cible d'édition.

Prompt exact envoyé :

~~~text
Use case: identity-preserve
Asset type: CG06 introPose gallery art for the fan-made browser game Multiverse Breach
Input images: Image 1 is the strict approved CG01 identity, 1998 continuity, outfit, equipment, proportions, palette and handcrafted pixel-art reference for Leon S. Kennedy. It is a reference image only, not an edit target. Create a wholly new original composition and do not copy its background, pose or camera.
Primary request: Create one coherent original scene of exactly the same young rookie Leon cautiously entering the Raccoon Police Department's former-museum main hall for the first time during the September 1998 Raccoon City incident.
Scene/backdrop: an empty grand late-1990s civic hall adapted from a former museum, worn pale stone arches, dark carved wood, split staircases, rain streaking tall windows, wet reflected blue light near the entrance and restrained red emergency lamps; original architecture and camera, no recognizable screenshot, no readable signs, no people, zombies, creatures or human-shaped statue.
Subject: exactly one Leon, alive and uninjured, complete full body from ash-blond side-parted hair to both black combat boots, same youthful stylized face, navy original-era rookie police uniform, gray protective long sleeves, black tactical vest and shoulder armor with completely blank neutral panels, fingerless gloves, utility belt, pouches, thigh holster, knee pads and boots as Image 1. He holds exactly one complete compact late-1990s Matilda-style service handgun in a prudent two-handed low-ready grip, fully visible from muzzle to grip with no readable markings. His posture communicates first-arrival caution and limited experience, not veteran confidence.
Style/medium: preserve Image 1's premium handcrafted high-detail 32-bit pixel art, dense deliberate pixel clusters, crisp stepped edges, hand-placed material highlights, rich fabric, leather, metal, stone and rain textures, cinematic survival-horror gallery polish; unmistakably raster pixel art, not photorealistic, not a smooth 3D render, not vector and not painterly.
Composition/framing: exact 3:4 portrait canvas; original three-quarter entrance viewpoint; one centered complete head-to-boots figure at useful narrative scale, both hands, entire handgun, belt, holster, knees and boots fully inside the frame with generous padding on every edge; one image, no panels or variants.
Lighting/mood: cold rainy blue ambience, small red emergency rim light and restrained warm interior fill; tense, cautious and resource-scarce.
Identity and continuity invariants: preserve Leon's exact CG01 youthful face, age, ash-blond hair shape and color, body proportions, original blue 1998 uniform construction, gray sleeves, armor placement, gloves, belt, pouches, holster, knee pads, boots, handgun scale and palette. Do not modernize or redesign him.
Constraints: original unofficial fan-art composition based only on factual official Capcom continuity references; no official bitmap supplied or copied; exactly one person and one handgun; no readable text, letters, numbers, logo, police insignia, badge, shoulder marking, watermark, signature, poster, UI, actor likeness, real-person likeness or scan-model likeness.
Avoid: Resident Evil 4 Leon, later federal agent, experienced action hero, modern remake body-camera gear, brown jacket, extra person, survivor, zombie, creature, dominant statue, portal, second weapon, knife, flashlight, duplicate handgun, cropped body, cropped boots, cropped weapon, incomplete hand, extra limb or finger, gore, blood, death, humiliation, collage, sprite sheet, smooth airbrushing or anti-aliased vector edges.
~~~

QA : accepté dès l'appel initial. Exactement un jeune Leon en tenue bleue CG01, corps et deux bottes entiers, deux mains cohérentes, une Matilda complète tenue bas, aucune autre personne, arme, créature, inscription ou insigne. L'ancien hall sous la pluie est original et la pose lit clairement comme une première arrivée prudente.

## Leon CG07 — victoire vigilante

Rôle de l'image d'entrée : public/cg/resident-evil/leon/character-solo-openai-v1.png est la référence stricte approuvée d'identité, de continuité 1998, de tenue, d'équipement, de proportions, de palette et de style. Ce n'est pas une cible d'édition.

Prompt exact envoyé :

~~~text
Use case: identity-preserve
Asset type: CG07 victoryPose gallery art for the fan-made browser game Multiverse Breach
Input images: Image 1 is the strict approved CG01 identity, 1998 continuity, outfit, equipment, proportions, palette and handcrafted pixel-art reference for Leon S. Kennedy. It is a reference image only, not an edit target. Create a wholly new original composition and do not copy its background, pose or camera.
Primary request: Create one coherent original scene of exactly the same young rookie Leon immediately after securing a safe evacuation route for survivors during the September 1998 Raccoon City incident, visibly relieved but still vigilant.
Scene/backdrop: an original secured side route connecting the former-museum police hall to a rain-dark service passage, worn stone and carved wood behind Leon, a raised plain metal security gate, restrained emergency lamps and faint cool pre-dawn rain light; the route is visibly clear and stable, with no people, bodies, zombies, creatures, trophies, readable signs or copied game layout.
Subject: exactly one Leon, alive and uninjured, complete full body from ash-blond side-parted hair to both black combat boots, same youthful stylized face, navy original-era rookie police uniform, gray protective long sleeves, black tactical vest and shoulder armor with completely blank neutral panels, fingerless gloves, utility belt, pouches, thigh holster, knee pads and boots as Image 1. He holds exactly one complete compact late-1990s Matilda-style service handgun safely lowered alongside his leg, fully visible from muzzle to grip with no readable markings. His shoulders release a little while his gaze remains alert toward the next corridor; calm earned relief, not a boastful triumph.
Style/medium: preserve Image 1's premium handcrafted high-detail 32-bit pixel art, dense deliberate pixel clusters, crisp stepped edges, hand-placed material highlights, rich fabric, leather, metal, stone and rain textures, cinematic survival-horror gallery polish; unmistakably raster pixel art, not photorealistic, not a smooth 3D render, not vector and not painterly.
Composition/framing: exact 3:4 portrait canvas; original eye-level three-quarter viewpoint; one centered complete head-to-boots figure at useful narrative scale, both hands, entire handgun, belt, holster, knees and boots fully inside the frame with generous padding on every edge; one image, no panels or variants.
Lighting/mood: cool rain-muted pre-dawn light with restrained warm emergency-lamp highlights; relieved, humane and vigilant under continuing danger.
Identity and continuity invariants: preserve Leon's exact CG01 youthful face, age, ash-blond hair shape and color, body proportions, original blue 1998 uniform construction, gray sleeves, armor placement, gloves, belt, pouches, holster, knee pads, boots, handgun scale and palette. Do not modernize or redesign him.
Constraints: original unofficial fan-art composition based only on factual official Capcom continuity references; no official bitmap supplied or copied; exactly one person and one handgun; no readable text, letters, numbers, logo, police insignia, badge, shoulder marking, watermark, signature, poster, UI, actor likeness, real-person likeness or scan-model likeness.
Avoid: Resident Evil 4 Leon, later federal agent, experienced action hero, modern remake body-camera gear, brown jacket, raised victory fist, celebratory shooting, trophy, monster corpse, extra survivor, extra person, zombie, creature, portal, second weapon, knife, duplicate handgun, cropped body, cropped boots, cropped weapon, incomplete hand, extra limb or finger, gore, blood, death, humiliation, collage, sprite sheet, smooth airbrushing or anti-aliased vector edges.
~~~

QA : accepté dès l'appel initial. Un seul Leon complet, même identité et uniforme 1998, Matilda entière et abaissée, route visiblement sécurisée, posture soulagée mais regard vigilant. Aucun survivant ajouté, trophée, corps, gore, texte, logo ou insigne.

## Leon CG08 — repli tactique

Rôle de l'image d'entrée : public/cg/resident-evil/leon/character-solo-openai-v1.png est la référence stricte approuvée d'identité, de continuité 1998, de tenue, d'équipement, de proportions, de palette et de style. Ce n'est pas une cible d'édition.

Prompt exact envoyé :

~~~text
Use case: identity-preserve
Asset type: CG08 defeatPose gallery art for the fan-made browser game Multiverse Breach
Input images: Image 1 is the strict approved CG01 identity, 1998 continuity, outfit, equipment, proportions, palette and handcrafted pixel-art reference for Leon S. Kennedy. It is a reference image only, not an edit target. Create a wholly new original composition and do not copy its background, pose or camera.
Primary request: Create one coherent original non-gory tactical-retreat scene of exactly the same young rookie Leon down on one knee, exhausted but alive, preserving his strength to withdraw from an unsafe route during the September 1998 Raccoon City incident.
Scene/backdrop: an original dim side hall of the former-museum police station, worn stone, dark wood, rain-muted high windows, a plain heavy security shutter partly lowered in the distance and sparse emergency light; the route ahead is unsafe only through broken masonry and failing lamps, with no attacker, person, body, zombie, creature, readable sign or copied game layout.
Subject: exactly one Leon, alive, conscious, non-humiliated and without visible wound, complete kneeling body from ash-blond side-parted hair through the grounded knee to both complete black combat boots, same youthful stylized face, navy original-era rookie police uniform, gray protective long sleeves, black tactical vest and shoulder armor with completely blank neutral panels, fingerless gloves, utility belt, pouches, thigh holster, knee pads and boots as Image 1. He keeps exactly one complete compact late-1990s Matilda-style service handgun safely lowered in one hand, fully visible from muzzle to grip with no readable markings, while the other hand braces naturally on his raised thigh. His posture communicates fatigue, tactical reassessment and imminent withdrawal, not surrender, injury or death.
Style/medium: preserve Image 1's premium handcrafted high-detail 32-bit pixel art, dense deliberate pixel clusters, crisp stepped edges, hand-placed material highlights, rich fabric, leather, metal, stone and rain textures, cinematic survival-horror gallery polish; unmistakably raster pixel art, not photorealistic, not a smooth 3D render, not vector and not painterly.
Composition/framing: exact 3:4 portrait canvas; original slightly elevated three-quarter viewpoint; one centered complete kneeling figure at useful narrative scale, both hands, entire handgun, belt, holster, grounded knee and both boots fully inside the frame with generous padding on every edge; one image, no panels or variants.
Lighting/mood: cold rainy blue shadow with restrained red emergency edge light and faint warm survival light; depleted, pressured but dignified and still capable of escape.
Identity and continuity invariants: preserve Leon's exact CG01 youthful face, age, ash-blond hair shape and color, body proportions, original blue 1998 uniform construction, gray sleeves, armor placement, gloves, belt, pouches, holster, knee pads, boots, handgun scale and palette. Do not modernize, injure or redesign him. Keep all equipment intact.
Constraints: original unofficial fan-art composition based only on factual official Capcom continuity references; no official bitmap supplied or copied; exactly one person and one handgun; zero gore, zero death and zero humiliation; no readable text, letters, numbers, logo, police insignia, badge, shoulder marking, watermark, signature, poster, UI, actor likeness, real-person likeness or scan-model likeness.
Avoid: Resident Evil 4 Leon, later federal agent, experienced action hero, modern remake body-camera gear, brown jacket, corpse pose, unconsciousness, severe injury, blood, bite, gore, dismemberment, hands over face, begging, captivity, extra person, zombie, creature, portal, broken equipment, missing gear, second weapon, knife, duplicate handgun, cropped body, cropped boots, cropped weapon, incomplete hand, extra limb or finger, collage, sprite sheet, smooth airbrushing or anti-aliased vector edges.
~~~

QA : accepté dès l'appel initial. Un seul Leon vivant, conscient et sans blessure visible, à un genou, corps et équipement intacts, Matilda complète abaissée, aucune humiliation ni mort. Aucun attaquant, corps, zombie, sang, texte ou insigne.

## Ancre CG06 — Trames superposées

Rôle de l'image d'entrée : public/cg/nexus-de-convergence/player-anchor/character-solo-openai-v1.png est la référence stricte approuvée d'identité, d'armure, de casque, de gantelet, d'équipement, de proportions, de palette et de style. Ce n'est pas une cible d'édition.

Prompt exact envoyé :

~~~text
Use case: identity-preserve
Asset type: CG06 introPose gallery art for the fan-made browser game Multiverse Breach
Input images: Image 1 is the strict approved project-canon CG01 identity, armor, helmet, gauntlet, equipment, proportions, palette and handcrafted pixel-art reference for the original character the Anchor. It is a reference image only, not an edit target. Create a wholly new original composition and do not copy its background, pose or camera.
Primary request: Create one coherent original scene of exactly the same single Anchor remaining completely whole and physically stable while several causal Threads begin to overlap across Mosaic City Central Atrium. This is the Anchor's introduction as the player's living stabilizing signature, explicitly not a summoning and not a portal arrival.
Scene/backdrop: original Mosaic City archive architecture superposes in three restrained translucent palimpsest layers across one continuous black-blue atrium platform: offset ivory ceramic ribs, dark archive stacks, archive-gold seams and thin cyan causal filaments crossing in depth. The layers overlap like simultaneous architectural memories, with no circular portal aperture, gateway, hole, vortex, teleportation beam, second person, statue, silhouette, creature or reflection.
Subject: exactly one Anchor, alive, solid and fully intact, complete full body from smooth enclosed helmet to both armored boots, same narrow yellow visor, deep midnight-blue and anthracite segmented armor, restrained archive-gold and yellow accents, long split charcoal coat, utility belt, leg armor and exactly the same single bright cyan mechanical anchor-gauntlet on the same arm as Image 1. Calm cautious three-quarter stance, existing gauntlet raised slightly to read the overlapping Threads while the other hand stays naturally empty. Add no weapon, tool, wearable, trophy or companion.
Style/medium: preserve Image 1's premium handcrafted high-detail 32-bit pixel art, dense deliberate pixel clusters, crisp stepped edges, hand-placed material highlights, rich ceramic, metal, coat and energy textures, cinematic project-gallery polish; unmistakably raster pixel art, not photorealistic, not a smooth 3D render, not vector and not painterly.
Composition/framing: exact 3:4 portrait canvas; original eye-level three-quarter atrium viewpoint; exactly one centered complete helmet-to-boots figure at useful narrative scale, both hands, single gauntlet, coat tails, belt, legs and boots fully inside the frame with generous padding on every edge; one image, no panels or variants.
Lighting/mood: controlled cyan causal light against near-black and midnight-blue archives, narrow warm yellow visor glow and restrained archive-gold practical lamps; uncanny overlap but stable, lucid and quietly commanding.
Identity and equipment invariants: do not redesign the Anchor. Preserve CG01 helmet shape and opacity, visor size and color, anonymous identity, body proportions, armor construction and placement, deep navy-charcoal palette, gold/yellow accents, coat construction and length, belt, leg armor, boots, exact single cyan gauntlet design and gauntlet arm. The non-gauntlet hand remains a normal armored glove. Add no equipment.
Constraints: entirely project-original composition; exactly one character and exactly one cyan gauntlet; no visible face; no summoning, portal invocation or teleportation; no readable text, letters, numbers, pseudo-glyphs, logo, insignia, anchor symbol, watermark, signature, poster or UI.
Avoid: portal ring, glowing doorway, vortex, character emerging from energy, duplicate Anchor, extra person, companion, enemy, human-shaped statue, humanoid reflection, second gauntlet, gun, sword, shield, staff, backpack, cape redesign, trophy, new wearable, transparent helmet, cropped body, cropped boots, cropped gauntlet, incomplete hand, extra limb or finger, explosive action, collage, sprite sheet, smooth airbrushing or anti-aliased vector edges.
~~~

QA : accepté dès l'appel initial. Une seule Ancre, parfaitement entière et solide, casque opaque, armure, manteau, bottes et unique gantelet cyan conformes à CG01. Les couches architecturales et fils se superposent sans ouverture de portail, invocation ou téléportation. Aucun équipement, personnage, reflet, texte ou insigne ajouté.

## Ancre CG07 — stabilisation victorieuse

Rôle de l'image d'entrée : public/cg/nexus-de-convergence/player-anchor/character-solo-openai-v1.png est la référence stricte approuvée d'identité, d'armure, de casque, de gantelet, d'équipement, de proportions, de palette et de style. Ce n'est pas une cible d'édition.

Prompt exact envoyé :

~~~text
Use case: identity-preserve
Asset type: CG07 victoryPose gallery art for the fan-made browser game Multiverse Breach
Input images: Image 1 is the strict approved project-canon CG01 identity, armor, helmet, gauntlet, equipment, proportions, palette and handcrafted pixel-art reference for the original character the Anchor. It is a reference image only, not an edit target. Create a wholly new original composition and do not copy its background, pose or camera.
Primary request: Create one coherent original scene of exactly the same single Anchor in a calm victory state immediately after successfully stabilizing several separate causal Threads in Mosaic City Central Atrium.
Scene/backdrop: an original restored black-blue archive dais with broad ivory ceramic ribs, restrained archive-gold seams, dark stacks and several thin cyan and turquoise causal filaments now running steadily into separate suspended registry rings; repaired architectural seams glow softly, with no portal aperture, gateway, person, companion, enemy, statue, silhouette, creature, reflection, trophy or readable interface.
Subject: exactly one Anchor, alive, solid and fully intact, complete full body from smooth enclosed helmet to both armored boots, same narrow yellow visor, deep midnight-blue and anthracite segmented armor, restrained archive-gold and yellow accents, long split charcoal coat, utility belt, leg armor and exactly the same single bright cyan mechanical anchor-gauntlet on the same arm as Image 1. Calm upright stance after the stabilization, existing gauntlet safely lowered but still softly energized while the helmet turns toward the now-stable Threads. The other hand stays naturally empty. Quiet earned control, not celebratory boasting. Add no weapon, tool, wearable, trophy or companion.
Style/medium: preserve Image 1's premium handcrafted high-detail 32-bit pixel art, dense deliberate pixel clusters, crisp stepped edges, hand-placed material highlights, rich ceramic, metal, coat and energy textures, cinematic project-gallery polish; unmistakably raster pixel art, not photorealistic, not a smooth 3D render, not vector and not painterly.
Composition/framing: exact 3:4 portrait canvas; original eye-level three-quarter atrium viewpoint; exactly one centered complete helmet-to-boots figure at useful narrative scale, both hands, single gauntlet, coat tails, belt, legs and boots fully inside the frame with generous padding on every edge; one image, no panels or variants.
Lighting/mood: calm cyan and turquoise stabilization glow, narrow warm yellow visor light and restrained archive-gold lamps against near-black and midnight-blue architecture; measured relief, continuity restored and vigilance maintained.
Identity and equipment invariants: do not redesign the Anchor. Preserve CG01 helmet shape and opacity, visor size and color, anonymous identity, body proportions, armor construction and placement, deep navy-charcoal palette, gold/yellow accents, coat construction and length, belt, leg armor, boots, exact single cyan gauntlet design and gauntlet arm. The non-gauntlet hand remains a normal armored glove. Add no equipment.
Constraints: entirely project-original composition; exactly one character and exactly one cyan gauntlet; no visible face; no portal invocation or teleportation; no readable text, letters, numbers, pseudo-glyphs, logo, insignia, anchor symbol, watermark, signature, poster or UI.
Avoid: portal ring, glowing gateway, duplicate Anchor, extra person, companion, enemy, human-shaped statue, humanoid reflection, second gauntlet, gun, sword, shield, staff, backpack, cape redesign, trophy, medal, banner, new wearable, raised victory fist, transparent helmet, cropped body, cropped boots, cropped gauntlet, incomplete hand, extra limb or finger, explosive action, collage, sprite sheet, smooth airbrushing or anti-aliased vector edges.
~~~

QA : accepté dès l'appel initial. Une seule Ancre complète et calme, même casque, silhouette, armure et unique gantelet. Les fils causaux séparés sont stables, sans portail actif, compagnon, ennemi, trophée, nouvel équipement, texte ou symbole.

## Ancre CG08 — repli à genou

Rôle de l'image d'entrée : public/cg/nexus-de-convergence/player-anchor/character-solo-openai-v1.png est la référence stricte approuvée d'identité, d'armure, de casque, de gantelet, d'équipement, de proportions, de palette et de style. Ce n'est pas une cible d'édition.

Prompt exact envoyé :

~~~text
Use case: identity-preserve
Asset type: CG08 defeatPose gallery art for the fan-made browser game Multiverse Breach
Input images: Image 1 is the strict approved project-canon CG01 identity, armor, helmet, gauntlet, equipment, proportions, palette and handcrafted pixel-art reference for the original character the Anchor. It is a reference image only, not an edit target. Create a wholly new original composition and do not copy its background, pose or camera.
Primary request: Create one coherent original dignified tactical-retreat scene of exactly the same single Anchor down on one knee, depleted but alive, while withdrawing from causal instability in Mosaic City Central Atrium. The Anchor is not dead, broken, humiliated, summoned or trapped.
Scene/backdrop: an original damaged black-blue archive side platform with broad ivory ceramic ribs, restrained archive-gold seams, dark stacks, several fading cyan causal filaments and small misaligned architectural palimpsest layers; a stable withdrawal path remains clearly open behind the Anchor. No portal aperture, gateway, vortex, person, companion, enemy, statue, silhouette, creature, reflection, body or readable interface.
Subject: exactly one Anchor, alive, conscious, solid and fully intact, complete kneeling body from smooth enclosed helmet through the grounded knee to both complete armored boots, same narrow yellow visor, deep midnight-blue and anthracite segmented armor, restrained archive-gold and yellow accents, long split charcoal coat, utility belt, leg armor and exactly the same single cyan mechanical anchor-gauntlet on the same arm as Image 1. The existing gauntlet gives only a weak controlled cyan glow close to its coils; gauntlet hand lowered near the floor without damage, while the normal armored hand braces naturally on the raised thigh. Posture communicates exhaustion, tactical reassessment and imminent withdrawal, not surrender or death. Add no weapon, tool, wearable, trophy or companion.
Style/medium: preserve Image 1's premium handcrafted high-detail 32-bit pixel art, dense deliberate pixel clusters, crisp stepped edges, hand-placed material highlights, rich ceramic, metal, coat and faint energy textures, cinematic project-gallery polish; unmistakably raster pixel art, not photorealistic, not a smooth 3D render, not vector and not painterly.
Composition/framing: exact 3:4 portrait canvas; original slightly elevated three-quarter atrium viewpoint; exactly one centered complete kneeling figure at useful narrative scale, both hands, single gauntlet, coat tails, belt, grounded knee and both boots fully inside the frame with generous padding on every edge; one image, no panels or variants.
Lighting/mood: deep midnight-blue archive shadow, weak cyan gauntlet light, narrow yellow visor glow and restrained archive-gold survival light; exhausted, pressured but dignified, alive and capable of retreat.
Identity and equipment invariants: do not redesign, injure or break the Anchor. Preserve CG01 helmet shape and opacity, visor size and color, anonymous identity, body proportions, armor construction and placement, deep navy-charcoal palette, gold/yellow accents, coat construction and length, belt, leg armor, boots, exact single cyan gauntlet design and gauntlet arm. The non-gauntlet hand remains a normal armored glove. Keep all equipment intact and add none.
Constraints: entirely project-original composition; exactly one character and exactly one cyan gauntlet; zero gore, zero death and zero humiliation; no visible face; no portal invocation or teleportation; no readable text, letters, numbers, pseudo-glyphs, logo, insignia, anchor symbol, watermark, signature, poster or UI.
Avoid: corpse pose, unconsciousness, broken armor, severed or missing limb, blood, gore, exposed face, begging, captivity, portal ring, glowing gateway, vortex, duplicate Anchor, extra person, companion, enemy, human-shaped statue, humanoid reflection, second gauntlet, gun, sword, shield, staff, backpack, cape redesign, trophy, new wearable, transparent helmet, cropped body, cropped boots, cropped gauntlet, incomplete hand, extra limb or finger, giant explosion, collage, sprite sheet, smooth airbrushing or anti-aliased vector edges.
~~~

QA : accepté dès l'appel initial. Une seule Ancre à genou, vivante, consciente, digne et sans dommage, corps, bottes, manteau et équipement entiers. Le gantelet unique reste intact avec un rayonnement cyan contenu ; aucun portail, ennemi, compagnon, trophée, nouvel équipement, gore, texte ou insigne.

## Rejets, corrections et contrôle final

- Rejet : aucun. Les six appels initiaux ont été acceptés après inspection à la résolution originale.
- Correction ciblée : aucune, donc aucun appel ImageGen supplémentaire.
- Les deux CG01 locales ont été inspectées à la résolution originale avant génération.
- Les six sources ImageGen et les six destinations finales ont été inspectées visuellement à la résolution originale.
- Métadonnées vérifiées : PNG RGB 24 bits, 1086 × 1448, ratio exact 3:4 pour les six fichiers.
- SHA-256 vérifié avant et après copie : source et destination identiques pour chaque asset.
- Leon reste la version RE2 de 1998, jeune policier débutant en uniforme bleu, avec une seule Matilda complète et aucun mélange RE4 ou agent fédéral.
- L'Ancre reste le personnage original CG01 avec un seul gantelet canonique, sans nouvel équipement ; l'introduction montre des Trames superposées, jamais une invocation de portail.
- Les deux poses de repli sont vivantes, dignes, sans gore, mort, humiliation ni démembrement.
- Aucun texte, logo, insigne, watermark, acteur, personne réelle, scan-model, collage, doublon ou recadrage n'est visible.
