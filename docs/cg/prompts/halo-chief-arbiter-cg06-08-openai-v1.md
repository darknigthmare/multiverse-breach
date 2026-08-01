# Halo — Master Chief et The Arbiter — CG06 à CG08 OpenAI v1

Date de production : 2026-08-01
Générateur : built-in OpenAI ImageGen via le skill imagegen, sans CLI
Format final : PNG portrait exact 1086 × 1448 (3:4), RGB 24 bits

## Périmètre et références locales

Les six images sont des créations originales fan-made. Aucun bitmap officiel, screenshot, key art, poster ou scan d’acteur n’a été fourni à ImageGen.

- Master Chief CG01, référence locale stricte d’identité/version/style : public/cg/halo/masterchief/character-solo-openai-v1.png
- Arbiter CG01, référence locale stricte d’identité/version/style : public/cg/halo/arbiter/character-solo-openai-v1.png

Pour chacun des six appels initiaux, Image 1 désigne uniquement le CG01 local correspondant : ancre stricte d’identité, de version, de silhouette, d’armure, de couleurs, de proportions, d’équipement et de style ; il ne s’agit pas d’une cible d’édition.

Pour les deux corrections ciblées de Master Chief, Image 1 désigne la sortie initiale rejetée et sert de cible d’édition pour préserver son décor, sa lumière et sa composition ; Image 2 désigne le CG01 local et reste l’ancre stricte d’identité/version/style.

Pour la correction ciblée de la victoire de The Arbiter, Image 1 désigne également la sortie CG07 initiale rejetée et sert de cible d’édition pour préserver le sanctuaire Delta Halo, sa lumière, sa focale et sa composition ; Image 2 désigne le CG01 Arbiter local et reste l’ancre stricte d’identité, d’anatomie Sangheili, de harnais Halo 2: Anniversary et de style.

Les deux CG01 ont été inspectés en résolution originale avec view_image avant toute génération. Chaque sortie initiale et chaque correction ont ensuite été inspectées en résolution originale avant acceptation.

## Références officielles Halo Waypoint et faits retenus

- https://www.halowaypoint.com/news/master-class — la Mark VI [GEN3] est l’armure de Master Chief dans Halo Infinite.
- https://www.halowaypoint.com/news/customization-overview-season-5 — la Mark VI [GEN3] correspond à son armure de campagne Halo Infinite.
- https://www.halowaypoint.com/news/welcome-to-halo-infinite — Halo Infinite met en scène l’arrivée de Master Chief sur Zeta Halo et référence le MA40.
- https://www.halowaypoint.com/news/sandbox-update-halo-infinite — le MA40 est bien le fusil d’assaut du sandbox Halo Infinite.
- https://www.halowaypoint.com/news/canon-fodder-fighting-words — distinction officielle entre l’apparence classique Halo 2: Anniversary de l’Arbiter et l’armure Kaidon de Halo 5 ; référence à l’épée à énergie et à l’anatomie aux mandibules multiples.
- https://www.halowaypoint.com/news/halo-2-twentieth-anniversary — arc de Thel ’Vadam dans Halo 2 et contexte de Delta Halo.
- https://www.halowaypoint.com/news/halo-age-of-retribution — The Arbiter, Delta Halo et l’épée à énergie dans le contexte canonique.

Ces pages ont uniquement servi à verrouiller les faits de lore et les versions visuelles. Le CG01 local demeure la seule référence bitmap fournie à ImageGen pour les appels initiaux.

## Registre des sorties, rejets et finales

### Master Chief — CG06 intro

Sortie initiale rejetée :

- Source ImageGen : C:\Users\chuck\.codex\generated_images\019fbcaa-3023-7343-9b69-8486f2f0478c\exec-ec81ebf8-7343-4d4a-b138-8e5a8e16713c.png
- Dimensions/mode : 1086 × 1448, RGB 24 bits
- SHA-256 : 8D895F14EB30B84208C1FDD1B4D0184A2568421869FB9AFEDF52392F87B8D459
- Rejet : identité, armure et MA40 correctes, mais pose trop proche du CG01 neutre et de la victoire initiale. Cette sortie, copiée temporairement pendant le contrôle, a été remplacée uniquement par la correction acceptée.

Finale acceptée après un appel de correction ciblé distinct :

- Source ImageGen : C:\Users\chuck\.codex\generated_images\019fbcaa-3023-7343-9b69-8486f2f0478c\exec-b5a89d83-13c3-4baf-907b-973c3222597f.png
- Destination : public/cg/halo/masterchief/intro-pose-openai-v1.png
- Dimensions/mode : 1086 × 1448, Format24bppRgb
- SHA-256 source = destination : 602697DEE049820C2AE847C06D71653DC9439CB62C4514A8D21B85D4C77D2368
- QA visuelle originale : pas d’arrivée clairement lisible, botte avant et jambe arrière différenciées, corps entier, MA40 complète en low-ready, casque opaque, silhouette GEN3 et palette olive conservées, aucun texte/logo/watermark, aucune anatomie ou arme tronquée.

Prompt initial exact :

~~~text
Use case: identity-preserve
Asset type: portrait game collectible CG — intro pose
Input images: Image 1 is the strict local CG01 reference anchor for Master Chief's identity, Halo Infinite version, armor, colors, proportions, complete MA40 equipment, and handcrafted pixel-art style. It is a reference, not an edit target.
Primary request: create one new original fan-made intro image of exactly the same Master Chief arriving with disciplined purpose on Zeta Halo.
Scene/backdrop: an original Zeta Halo landing approach with a high Forerunner stone-and-metal causeway, conifer valley, cool mist, distant fractured ring arc and restrained cyan hardlight seams; no reconstruction of official key art, poster, screenshot, cinematic frame, or level composition.
Subject: exactly one full-body Master Chief stepping forward in a calm military arrival pose, gaze toward the route ahead. Preserve Image 1's Halo Infinite Mjolnir Mark VI [GEN3] silhouette, olive-green weathered plates, black undersuit, opaque closed helmet, gold visor, Spartan-II proportions, materials, and equipment without redesign. He holds exactly one complete MA40 assault rifle securely across his torso in a disciplined non-firing ready carry; entire rifle visible from muzzle to stock, both hands correctly placed.
Style/medium: premium high-detail handcrafted 32-bit pixel art matching Image 1, deliberate crisp pixel clusters, hard-edged armor and atmospheric depth; not smooth painting, not 3D render, not photorealism.
Composition/framing: strict exact 3:4 portrait canvas; one coherent image; complete helmet, torso, both arms, both hands, MA40, both legs, both boots, and every armor/equipment piece visible with generous padding on every side; no crop.
Lighting/mood: cool dawn with restrained warm horizon rim light; disciplined arrival, readiness and hope.
Constraints: strict identity/version/style continuity from Image 1; do not change silhouette, armor geometry, colors, anatomy, proportions, helmet opacity, visor, materials, pixel scale, or equipment; exactly one character and one complete MA40; no other weapon, duplicate, extra figure, incomplete limb, malformed hand, incomplete anatomy, damaged or cropped weapon; no readable or pseudo text, letters, numbers, markings, logos, brands, emblems, insignia, watermark, signature, UI, card frame, actor, real face, scanned likeness, gore, or copied official composition.
~~~

Prompt de correction exact :

~~~text
Use case: identity-preserve
Asset type: targeted intro-pose correction
Input images: Image 1 is the rejected intro-scene edit target whose environment, lighting, 3:4 composition and pixel-art finish must be preserved. Image 2 is the strict local CG01 identity, Halo Infinite Mjolnir Mark VI [GEN3] armor, colors, proportions, equipment and style anchor for Master Chief.
Primary request: change only Master Chief's pose in Image 1 so the intro clearly shows a true disciplined arrival step moving forward along the Zeta Halo causeway, rather than the neutral standing CG01 pose. Place one boot visibly planted a full stride ahead, rear heel raised, hips and shoulders naturally counter-rotated with forward momentum, torso upright and alert. Reposition exactly one complete MA40 into a controlled low-ready carry angled clearly downward across the body; entire stock, receiver, both correctly gripping hands and muzzle remain visible.
Absolute invariants: preserve Master Chief's exact Image 2 identity and Halo Infinite version, olive-green weathered GEN3 armor silhouette and geometry, opaque closed helmet, gold visor, black undersuit, Spartan-II anatomy and proportions, materials, equipment count and handcrafted high-detail 32-bit pixel-art language. Preserve Image 1's original Zeta Halo causeway, fractured ring arc, forest valley, dawn lighting, palette, perspective and one-image composition. Strict exact 3:4 portrait canvas. Keep complete helmet, torso, both arms, both hands, complete MA40, both legs, both boots and every equipment piece inside the frame with generous padding.
Constraints: exactly one character and one complete MA40; visibly different pose from CG01 and the rejected Image 1 neutral stance; no running sprint, firing, triumph, other weapon, duplicate, extra figure, crop, incomplete limb, malformed hand, incomplete anatomy, incomplete or damaged weapon; no readable or pseudo text, letters, numbers, markings, logos, brands, emblems, insignia, watermark, signature, UI, card frame, actor, real face, scanned likeness, gore, or copied official composition.
~~~

### Master Chief — CG07 victoire

Sortie initiale rejetée :

- Source ImageGen : C:\Users\chuck\.codex\generated_images\019fbcaa-3023-7343-9b69-8486f2f0478c\exec-2fd8e5c8-ab42-4e15-894e-4954436a8733.png
- Dimensions/mode : 1086 × 1448, RGB 24 bits
- SHA-256 : 133F8AC51AD93C0250628E4B463E7825B9E5409DA57A7F7B8732BD7524F42175
- Rejet : identité, armure et MA40 correctes, mais pose trop similaire au CG01 et à l’intro initiale. Cette sortie, copiée temporairement pendant le contrôle, a été remplacée uniquement par la correction acceptée.

Finale acceptée après un appel de correction ciblé distinct :

- Source ImageGen : C:\Users\chuck\.codex\generated_images\019fbcaa-3023-7343-9b69-8486f2f0478c\exec-30425df6-cdfe-4c3c-9d38-ffa906b17fcb.png
- Destination : public/cg/halo/masterchief/victory-pose-openai-v1.png
- Dimensions/mode : 1086 × 1448, Format24bppRgb
- SHA-256 source = destination : 3742EE7EBED1FF17F1AD7D79307ED23335094C92ED45140C0ACB7FEC7FD830D6
- QA visuelle originale : posture post-combat nettement distincte et sobre, épaules et bras abaissés, appui détendu, MA40 complète le long de la cuisse et orientée vers le sol, corps entier, aucun trophée/visage/gore, aucune anatomie ou arme tronquée.

Prompt initial exact :

~~~text
Use case: identity-preserve
Asset type: portrait game collectible CG — victory pose
Input images: Image 1 is the strict local CG01 reference anchor for Master Chief's identity, Halo Infinite version, armor, colors, proportions, complete MA40 equipment, and handcrafted pixel-art style. It is a reference, not an edit target.
Primary request: create one new original fan-made victory image of exactly the same Master Chief after securing a Zeta Halo objective, showing restrained professional resolve rather than celebration.
Scene/backdrop: an original quiet Zeta Halo Forerunner terrace after combat, conifer valley and broken ring arc beyond, faint cyan stabilizing light and a few settled dust pixels; no corpse, enemy, trophy, banner, reconstruction of official key art, poster, screenshot, cinematic frame, or level composition.
Subject: exactly one full-body Master Chief standing balanced and composed. Preserve Image 1's Halo Infinite Mjolnir Mark VI [GEN3] silhouette, olive-green weathered plates, black undersuit, opaque closed helmet, gold visor, Spartan-II proportions, materials, and equipment without redesign. He holds exactly one complete MA40 assault rifle in a safe low-ready position, muzzle lowered and away, stock and muzzle both fully visible, both hands correctly supporting the weapon.
Style/medium: premium high-detail handcrafted 32-bit pixel art matching Image 1, deliberate crisp pixel clusters, hard-edged armor and atmospheric depth; not smooth painting, not 3D render, not photorealism.
Composition/framing: strict exact 3:4 portrait canvas; one coherent image; complete helmet, torso, both arms, both hands, MA40, both legs, both boots, and every armor/equipment piece visible with generous padding on every side; no crop.
Lighting/mood: clear restrained silver-gold light with cool cyan bounce; sober victory, vigilance, duty and quiet relief.
Constraints: strict identity/version/style continuity from Image 1; do not change silhouette, armor geometry, colors, anatomy, proportions, helmet opacity, visor, materials, pixel scale, or equipment; exactly one character and one complete MA40; no raised triumph gesture, other weapon, duplicate, extra figure, incomplete limb, malformed hand, incomplete anatomy, damaged or cropped weapon; no readable or pseudo text, letters, numbers, markings, logos, brands, emblems, insignia, watermark, signature, UI, card frame, actor, real face, scanned likeness, gore, corpse, humiliation, or copied official composition.
~~~

Prompt de correction exact :

~~~text
Use case: identity-preserve
Asset type: targeted victory-pose correction
Input images: Image 1 is the rejected victory-scene edit target whose environment, lighting, 3:4 composition and pixel-art finish must be preserved. Image 2 is the strict local CG01 identity, Halo Infinite Mjolnir Mark VI [GEN3] armor, colors, proportions, equipment and style anchor for Master Chief.
Primary request: change only Master Chief's pose in Image 1 into a visibly different restrained post-combat victory stance, not the neutral CG01 ready pose and not the intro stance. Relax and lower both shoulders, shift his weight naturally onto one leg, open the torso slightly toward the secured valley, and let the free arm rest with quiet controlled relief. Reposition exactly one complete MA40 fully lowered alongside the outer thigh, muzzle pointing safely toward the ground, with one hand retaining the pistol grip and the other naturally supporting the fore-end; entire stock, receiver, both hands and muzzle visible. No raised weapon or celebration.
Absolute invariants: preserve Master Chief's exact Image 2 identity and Halo Infinite version, olive-green weathered GEN3 armor silhouette and geometry, opaque closed helmet, gold visor, black undersuit, Spartan-II anatomy and proportions, materials, equipment count and handcrafted high-detail 32-bit pixel-art language. Preserve Image 1's original quiet Zeta Halo terrace, broken ring arc, conifer valley, settled atmosphere, lighting, palette, perspective and one-image composition. Strict exact 3:4 portrait canvas. Keep complete helmet, torso, both arms, both hands, complete MA40, both legs, both boots and every equipment piece inside the frame with generous padding.
Constraints: exactly one character and one complete MA40; visibly different pose from CG01, rejected Image 1 and intro arrival pose; sober professional victory only; no trophy, corpse, enemy, banner, exposed face, kneeling, triumph gesture, other weapon, duplicate, extra figure, crop, incomplete limb, malformed hand, incomplete anatomy, incomplete or damaged weapon; no readable or pseudo text, letters, numbers, markings, logos, brands, emblems, insignia, watermark, signature, UI, card frame, actor, real face, scanned likeness, gore, humiliation, or copied official composition.
~~~

### Master Chief — CG08 défaite/repli

Finale acceptée dès l’appel initial :

- Source ImageGen : C:\Users\chuck\.codex\generated_images\019fbcaa-3023-7343-9b69-8486f2f0478c\exec-f930876c-cfca-4683-9e4b-0a42231c9322.png
- Destination : public/cg/halo/masterchief/defeat-pose-openai-v1.png
- Dimensions/mode : 1086 × 1448, Format24bppRgb
- SHA-256 source = destination : D5D7681564BE3F85284DD463E6F602B27AC10A615F9C27BB841C94FC3183E3BB
- QA visuelle originale : repli tactique contrôlé et non humiliant, vivant, casque fermé, armure intacte/légèrement marquée, MA40 complète, corps entier, pas de visage/gore/mort, aucun texte ou défaut anatomique visible.

Prompt exact :

~~~text
Use case: identity-preserve
Asset type: portrait game collectible CG — defeat pose
Input images: Image 1 is the strict local CG01 reference anchor for Master Chief's identity, Halo Infinite version, armor, colors, proportions, complete MA40 equipment, and handcrafted pixel-art style. It is a reference, not an edit target.
Primary request: create one new original fan-made defeat-state image of exactly the same living Master Chief conducting a disciplined tactical withdrawal on Zeta Halo; this is a temporary setback, never death, humiliation, surrender, or collapse.
Scene/backdrop: an original fractured Zeta Halo Forerunner passage with a controlled closing hardlight barrier, drifting dust and distant cool mist; route of withdrawal remains open, no visible enemy, corpse, trophy, banner, reconstruction of official key art, poster, screenshot, cinematic frame, or level composition.
Subject: exactly one full-body Master Chief moving backward in a stable guarded stance while looking toward the unseen threat. Preserve Image 1's Halo Infinite Mjolnir Mark VI [GEN3] silhouette, olive-green plates, black undersuit, opaque closed helmet, gold visor, Spartan-II proportions, materials, and equipment without redesign. Armor is intact with only a few light superficial scuffs. He retains exactly one complete MA40 assault rifle in a controlled defensive low-ready carry, entire weapon visible, both hands correctly placed; he is alert, alive, mobile and prepared to return.
Style/medium: premium high-detail handcrafted 32-bit pixel art matching Image 1, deliberate crisp pixel clusters, hard-edged armor, restrained motion pixels and atmospheric depth; not smooth painting, not 3D render, not photorealism.
Composition/framing: strict exact 3:4 portrait canvas; one coherent image; complete helmet, torso, both arms, both hands, MA40, both legs, both boots, and every armor/equipment piece visible with generous padding on every side; no crop.
Lighting/mood: cool steel-blue backlight and subdued gold visor reflection; tactical pressure, dignity, endurance and controlled retreat.
Constraints: strict identity/version/style continuity from Image 1; do not change silhouette, armor geometry, colors, anatomy, proportions, helmet opacity, visor, materials, pixel scale, or equipment; exactly one character and one complete MA40; Master Chief remains living and dignified; no exposed face, broken armor, severe injury, surrender pose, hanging head, prone body, death, gore, blood, corpse, humiliation, other weapon, duplicate, extra figure, incomplete limb, malformed hand, incomplete anatomy, damaged or cropped weapon; no readable or pseudo text, letters, numbers, markings, logos, brands, emblems, insignia, watermark, signature, UI, card frame, actor, real face, scanned likeness, or copied official composition.
~~~

### The Arbiter — CG06 intro

Finale acceptée dès l’appel initial :

- Source ImageGen : C:\Users\chuck\.codex\generated_images\019fbcaa-3023-7343-9b69-8486f2f0478c\exec-e8716f6c-13b1-4432-9984-435d5c786b2b.png
- Destination : public/cg/halo/arbiter/intro-pose-openai-v1.png
- Dimensions/mode : 1086 × 1448, Format24bppRgb
- SHA-256 source = destination : BACA3D7A35DA91F84D1759B799EC1E9C58F9E7BAEFF7181324EB7CD41C1FC73F
- QA visuelle originale : arrivée digne à Delta Halo, corps Sangheili entier et mandibules lisibles, armure classique Halo 2 Anniversary argent/gunmetal avec accents or fins, jamais Kaidon/Halo 5, exactement une épée complète abaissée, aucun texte/crop/doublon.

Prompt exact :

~~~text
Use case: identity-preserve
Asset type: portrait game collectible CG — intro pose
Input images: Image 1 is the strict local CG01 reference anchor for Arbiter Thel 'Vadam's identity, Halo 2: Anniversary classic version, Sangheili anatomy, armor, colors, proportions, single complete energy-sword equipment, and handcrafted pixel-art style. It is a reference, not an edit target.
Primary request: create one new original fan-made intro image of exactly the same Arbiter arriving with dignity in an ancient Delta Halo sanctuary.
Scene/backdrop: an original Delta Halo Forerunner sanctuary entrance with pale weathered stone, dark geometric metal, forest mist, waterfalls, distant ringworld horizon and restrained cyan hardlight; no reconstruction of official key art, poster, screenshot, cinematic frame, or level composition.
Subject: exactly one full-body Thel 'Vadam advancing in a measured noble arrival pose, gaze fixed toward the sanctuary interior. Preserve Image 1's recognizable four-part mandibles, tall digitigrade Sangheili anatomy, body proportions, dark purple skin, and classic Halo 2: Anniversary Arbiter harness without redesign. Armor remains predominantly weathered silver and muted gunmetal with narrow fine aged-gold accents and a dark undersuit — never Halo 5 Kaidon armor. He holds exactly one complete active classic energy sword lowered at his side in a controlled non-striking carry; complete hilt and both cyan-blue plasma prongs visible.
Style/medium: premium high-detail handcrafted 32-bit pixel art matching Image 1, deliberate crisp pixel clusters, hard-edged armor, controlled plasma pixels and atmospheric depth; not smooth painting, not 3D render, not photorealism.
Composition/framing: strict exact 3:4 portrait canvas; one coherent image; complete head and four mandibles, torso, both arms, both hands, sword, both digitigrade legs, both feet, and every armor/equipment piece visible with generous padding on every side; no crop.
Lighting/mood: cool sanctuary daylight with restrained cyan sword reflection; dignity, honor, vigilance and purposeful arrival.
Constraints: strict identity/version/style continuity from Image 1; do not change silhouette, classic armor geometry, silver/gunmetal/fine-gold colors, Sangheili anatomy, proportions, mandibles, materials, pixel scale, or equipment; exactly one character and one complete energy sword; absolutely no Halo 5 or Kaidon armor, massive bronze/gold royal redesign, crown, cape, human anatomy, other weapon, duplicate, extra figure, incomplete limb, extra limb, malformed hand, incomplete mandible, damaged or cropped sword; no readable or pseudo text, letters, numbers, markings, logos, brands, emblems, insignia, watermark, signature, UI, card frame, actor, real face, scanned likeness, gore, or copied official composition.
~~~

### The Arbiter — CG07 victoire

Sortie initiale rejetée :

- Source ImageGen : C:\Users\chuck\.codex\generated_images\019fbcaa-3023-7343-9b69-8486f2f0478c\exec-5734a518-05fa-4fa5-bc36-949917e7b059.png
- Dimensions/mode : 1086 × 1448, RGB 24 bits
- SHA-256 : EADEACBE9AA50138F5B4CAD1CC5D1A04CC9B9C0C49A4783E7EC58A47ED4C4B95
- Rejet : identité, anatomie, harnais H2A, épée et décor corrects, mais la posture reprenait pratiquement exactement la pose neutre du CG01. Cette sortie a été remplacée uniquement par la correction acceptée.

Finale acceptée après un appel de correction ciblé distinct :

- Source ImageGen : C:\Users\chuck\.codex\generated_images\019fbcaa-3023-7343-9b69-8486f2f0478c\exec-03a2d758-13d2-4123-8310-f1f2b1d04bd3.png
- Destination : public/cg/halo/arbiter/victory-pose-openai-v1.png
- Dimensions/mode : 1086 × 1448, Format24bppRgb
- SHA-256 source = destination : 2B6A5EF5AB1F9A5983091690FEB6EB01659354FDD67B015EB048E9FB080E7B27
- QA visuelle originale : vraie posture d’honneur post-combat nettement distincte du CG01, buste vertical, main libre posée sur le torse en salut Sangheili sobre, corps entier, armure et anatomie H2A cohérentes, exactement une épée complète abaissée à énergie cyan retenue, aucun trophée/texte/Kaidon/crop/doublon.

Prompt initial exact :

~~~text
Use case: identity-preserve
Asset type: portrait game collectible CG — victory pose
Input images: Image 1 is the strict local CG01 reference anchor for Arbiter Thel 'Vadam's identity, Halo 2: Anniversary classic version, Sangheili anatomy, armor, colors, proportions, single complete energy-sword equipment, and handcrafted pixel-art style. It is a reference, not an edit target.
Primary request: create one new original fan-made victory image of exactly the same Arbiter after defending a Delta Halo sanctuary, expressing restrained honor rather than triumphal spectacle.
Scene/backdrop: an original quiet Delta Halo Forerunner sanctuary court with pale ancient stone, dark metal ribs, distant forest and waterfalls, stabilized cyan hardlight and settled mist; no corpse, enemy, trophy, banner, reconstruction of official key art, poster, screenshot, cinematic frame, or level composition.
Subject: exactly one full-body Thel 'Vadam standing tall and composed with a dignified four-mandibled expression. Preserve Image 1's digitigrade Sangheili anatomy, dark purple skin, body proportions, and classic Halo 2: Anniversary Arbiter harness without redesign. Armor remains predominantly weathered silver and muted gunmetal with narrow fine aged-gold accents and dark undersuit — never Halo 5 Kaidon armor. He holds exactly one complete active classic energy sword lowered toward the floor in a safe ceremonial position; complete hilt and both cyan-blue plasma prongs fully visible, no raised celebration gesture.
Style/medium: premium high-detail handcrafted 32-bit pixel art matching Image 1, deliberate crisp pixel clusters, hard-edged armor, controlled plasma pixels and atmospheric depth; not smooth painting, not 3D render, not photorealism.
Composition/framing: strict exact 3:4 portrait canvas; one coherent image; complete head and four mandibles, torso, both arms, both hands, sword, both digitigrade legs, both feet, and every armor/equipment piece visible with generous padding on every side; no crop.
Lighting/mood: restrained silver daylight, cool cyan blade bounce and subtle warm edge light; sober victory, honor, duty and quiet resolve.
Constraints: strict identity/version/style continuity from Image 1; do not change silhouette, classic armor geometry, silver/gunmetal/fine-gold colors, Sangheili anatomy, proportions, mandibles, materials, pixel scale, or equipment; exactly one character and one complete energy sword; absolutely no Halo 5 or Kaidon armor, massive bronze/gold royal redesign, crown, cape, human anatomy, other weapon, duplicate, extra figure, incomplete limb, extra limb, malformed hand, incomplete mandible, damaged or cropped sword; no readable or pseudo text, letters, numbers, markings, logos, brands, emblems, insignia, watermark, signature, UI, card frame, actor, real face, scanned likeness, gore, corpse, humiliation, or copied official composition.
~~~

Prompt de correction exact :

~~~text
Use case: identity-preserve
Asset type: targeted victory-pose correction
Input images: Image 1 is the rejected Arbiter victory-scene edit target whose Delta Halo sanctuary environment, lighting, strict 3:4 composition, focal length, perspective and pixel-art finish must remain unchanged as much as possible. Image 2 is the strict local CG01 identity, Halo 2: Anniversary classic Arbiter harness, silver/gunmetal/fine-gold palette, Sangheili anatomy, proportions, four-mandibled head, equipment and handcrafted pixel-art style anchor for Thel 'Vadam.
Primary request: change only The Arbiter's pose in Image 1 into a visibly different, restrained post-combat Sangheili honor salute, not the neutral CG01 stance and not the rejected Image 1 stance. Make his full torso more upright and composed, shoulders set with dignified calm, weight balanced differently. Place the empty free hand flat and clearly readable over the center of his armored chest in a sober Sangheili salute of honor, with anatomically correct Sangheili fingers. The other arm alone holds exactly one complete classic energy sword lowered safely beside the outer thigh; keep the complete hilt and both full plasma prongs visible, but render the blade at restrained low cyan energy rather than bright combat intensity, muzzle-like tips pointing toward the floor and away from the body. No raised celebration gesture.
Absolute invariants: preserve The Arbiter's exact Image 2 identity, recognizable four-part mandibles, tall digitigrade Sangheili anatomy, dark purple skin, body proportions, materials, and classic Halo 2: Anniversary Arbiter harness without redesign. Preserve predominantly weathered silver and muted gunmetal armor with only narrow fine aged-gold accents and dark undersuit; absolutely never Halo 5 or Kaidon armor. Preserve Image 1's original quiet Delta Halo Forerunner sanctuary court, pale ancient stone, dark metal ribs, forest, waterfalls, stabilized cyan hardlight, settled mist, lighting, palette, perspective, focal length and coherent one-image composition as much as possible. Preserve the premium high-detail handcrafted 32-bit pixel-art language with deliberate crisp pixel clusters, hard-edged armor and atmospheric depth. Strict exact 3:4 portrait canvas. Keep the complete head and all four mandibles, torso, both arms, both hands, complete sword, both digitigrade legs, both feet and every armor/equipment piece inside the frame with generous padding.
Constraints: exactly one full-body living character and exactly one complete unbroken low-energy classic energy sword; pose must be visibly different from CG01 and rejected Image 1; sober post-combat honor only; no trophy, corpse, enemy, banner, crown, cape, human anatomy, massive bronze/gold royal redesign, Halo 5 armor, Kaidon armor, other weapon, duplicate, extra figure, crop, incomplete limb, extra limb, malformed hand, incomplete mandible, incomplete or damaged sword; no readable or pseudo text, letters, numbers, markings, logos, brands, emblems, insignia, watermark, signature, UI, card frame, actor, real face, scanned likeness, gore, humiliation, or copied official composition.
~~~

### The Arbiter — CG08 défaite/repli

Finale acceptée dès l’appel initial :

- Source ImageGen : C:\Users\chuck\.codex\generated_images\019fbcaa-3023-7343-9b69-8486f2f0478c\exec-886a1dc7-8a76-4c65-b787-8f7e3a1db94e.png
- Destination : public/cg/halo/arbiter/defeat-pose-openai-v1.png
- Dimensions/mode : 1086 × 1448, Format24bppRgb
- SHA-256 source = destination : A387F24377431BA98DE8F9A9094206B384E500B0447D05AD92665D9EBF4A1F6A
- QA visuelle originale : repli à un genou lisible mais digne, vivant et alerte, corps Sangheili complet, armure classique intacte/légèrement marquée, une seule poignée d’épée complète et désactivée, aucune lame active, aucun gore/mort/humiliation.

Prompt exact :

~~~text
Use case: identity-preserve
Asset type: portrait game collectible CG — defeat pose
Input images: Image 1 is the strict local CG01 reference anchor for Arbiter Thel 'Vadam's identity, Halo 2: Anniversary classic version, Sangheili anatomy, armor, colors, proportions, single energy-sword equipment, and handcrafted pixel-art style. It is a reference, not an edit target.
Primary request: create one new original fan-made defeat-state image of exactly the same living Arbiter taking a controlled tactical pause on one knee during a dignified withdrawal from a Delta Halo sanctuary; this is a temporary setback, never death, humiliation, surrender, or collapse.
Scene/backdrop: an original Delta Halo Forerunner sanctuary passage with a dim closing cyan hardlight gate, pale stone, dark metal geometry, drifting mist and a clear withdrawal route; no visible enemy, corpse, trophy, banner, reconstruction of official key art, poster, screenshot, cinematic frame, or level composition.
Subject: exactly one full-body Thel 'Vadam in a stable one-knee stance, torso upright, gaze alert toward the unseen threat and free hand braced with control. Preserve Image 1's recognizable four-part mandibles, tall digitigrade Sangheili anatomy, dark purple skin, body proportions, and classic Halo 2: Anniversary Arbiter harness without redesign. Armor stays intact with only light superficial scuffs and remains predominantly weathered silver and muted gunmetal with narrow fine aged-gold accents and dark undersuit — never Halo 5 Kaidon armor. He retains exactly one complete deactivated classic energy-sword hilt lowered safely in one hand; full hilt visible, no plasma blades, no broken weapon. He is conscious, alive, dignified and prepared to rise.
Style/medium: premium high-detail handcrafted 32-bit pixel art matching Image 1, deliberate crisp pixel clusters, hard-edged armor, restrained motion pixels and atmospheric depth; not smooth painting, not 3D render, not photorealism.
Composition/framing: strict exact 3:4 portrait canvas; one coherent image; complete head and all four mandibles, torso, both arms, both hands, deactivated sword hilt, both digitigrade legs including the grounded knee, both feet, and every armor/equipment piece visible with generous padding on every side; no crop.
Lighting/mood: subdued steel-blue sanctuary light with faint cyan reflection on silver armor; tactical pressure, dignity, endurance and controlled retreat.
Constraints: strict identity/version/style continuity from Image 1; do not change silhouette, classic armor geometry, silver/gunmetal/fine-gold colors, Sangheili anatomy, proportions, mandibles, materials, pixel scale, or equipment; exactly one living character and one complete unbroken deactivated energy-sword hilt; absolutely no Halo 5 or Kaidon armor, massive bronze/gold royal redesign, crown, cape, human anatomy, exposed human face, other weapon, duplicate, extra figure, incomplete limb, extra limb, malformed hand, incomplete mandible, broken sword, active bright blade, surrender pose, hanging head, prone body, death, gore, blood, corpse, humiliation, severe injury, or dismemberment; no readable or pseudo text, letters, numbers, markings, logos, brands, emblems, insignia, watermark, signature, UI, card frame, actor, real face, scanned likeness, or copied official composition.
~~~

## QA finale commune

- Six destinations présentes, et aucune autre image n’a été copiée dans le dépôt.
- Six PNG exacts 1086 × 1448, rapport 3:4, Format24bppRgb.
- Pour chaque finale, le SHA-256 du fichier source ImageGen accepté est strictement identique à celui de la destination.
- Inspection en résolution originale : une seule image cohérente et un seul personnage ; silhouette, armure, couleurs, proportions et équipement fidèles au CG01 local ; corps et armes complets ; pas de crop, doublon, membre incomplet, texte, pseudo-texte, logo, marque, watermark, acteur ou likeness scannée.
- Master Chief : Halo Infinite GEN3 vert olive, casque opaque et MA40 complet sur les trois états ; jamais de visage, gore ou mort.
- The Arbiter : armure classique Halo 2 Anniversary argent/gunmetal et fins accents or, jamais Halo 5/Kaidon ; exactement une épée complète par état ; défaite avec poignée intacte désactivée.
