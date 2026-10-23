# Audit réel des feuilles d’animation des personnages

Audit des fichiers résolus pour les 1 911 héros, avant production des nouvelles animations dédiées. La présence de quatre rangées ne démontre aucune animation dédiée aux présentations ou aux supers. Les anciennes conclusions de QA sont des documents historiques, pas un résultat repris par cet audit.

Reproduction : `node scripts/auditCombatCharacterAnimations.mjs`.

- rosterHeroes : 1911
- rosterUniverses : 525
- dedicatedMeleeManifestHeroes : 0
- completeContextPackHeroes : 11
- uniqueResolvedSheets : 1914
- decodedSheets : 1914
- pixelHashedSheets : 1905
- nonIntegralGridSheets : 9
- missingSheets : 0
- invalidSheets : 0
- heroesWithMissingOrInvalidSheet : 0
- heroesWithExactRepeatedTiles : 0
- sheetsWithExactRepeatedTiles : 0
- sheetsWithSingleUniqueVisibleFrame : 0
- sheetsWithStaticRows : 0
- playerAnchorIsOutsideRoster : true

Les hashes ignorent les couleurs invisibles à alpha nul. Une cellule différente en pixels peut néanmoins rester une variante d’une pose générique ; cet audit ne certifie pas une chorégraphie ou une fidélité 1:1.

| Héros | Univers | Feuilles | Frames uniques / total | Problèmes |
| --- | --- | ---: | --- | --- |
| Mirelle Suture (arca_mirelle) | Nexus de Convergence | 2 | non-integral-grid, 24/24 | grille fractionnaire à revoir; aucun manifeste mêlée dédié |
| Bastion Korr (arca_bastion) | Nexus de Convergence | 1 | non-integral-grid | grille fractionnaire à revoir; aucun manifeste mêlée dédié |
| Nova Vey (arca_nova) | Nexus de Convergence | 1 | non-integral-grid | grille fractionnaire à revoir; aucun manifeste mêlée dédié |
| Marrow Kade (arca_marrow) | Nexus de Convergence | 1 | non-integral-grid | grille fractionnaire à revoir; aucun manifeste mêlée dédié |
| Sable Orison (arca_sable) | Nexus de Convergence | 1 | 16/16 | aucun manifeste mêlée dédié |
| Loom Ivara (arca_loom) | Nexus de Convergence | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tessera Vale (arca_tessera) | Nexus de Convergence | 1 | 16/16 | aucun manifeste mêlée dédié |
| Quillon Rusk (arca_quillon) | Nexus de Convergence | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nadir Kest (arca_nadir) | Nexus de Convergence | 1 | 16/16 | aucun manifeste mêlée dédié |
| Elyra Null (arca_elyra) | Nexus de Convergence | 1 | 16/16 | aucun manifeste mêlée dédié |
| Oryn Xile (arca_oryn) | Nexus de Convergence | 1 | 16/16 | aucun manifeste mêlée dédié |
| Marcus Fenix (marcus) | Gears of War | 1 | 16/16 | aucun manifeste mêlée dédié |
| Master Chief (masterchief) | Halo | 1 | non-integral-grid | grille fractionnaire à revoir; aucun manifeste mêlée dédié |
| Ellen Ripley (ripley) | Alien | 1 | 16/16 | aucun manifeste mêlée dédié |
| Yautja Hunter (predator) | Predator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Leon S. Kennedy (leon) | Resident Evil | 1 | 16/16 | aucun manifeste mêlée dédié |
| Pyramid Head (pyramidhead) | Silent Hill | 1 | 16/16 | aucun manifeste mêlée dédié |
| Regina (regina) | Dino Crisis | 1 | 16/16 | aucun manifeste mêlée dédié |
| Neo (neo) | The Matrix | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jack O'Neill (oneill) | Stargate | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gordon Freeman (freeman) | Half-Life | 1 | 16/16 | aucun manifeste mêlée dédié |
| Chell (chell) | Portal | 1 | 16/16 | aucun manifeste mêlée dédié |
| Solid Snake (snake) | Metal Gear | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dallas (dallas) | Payday | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hatsune Miku (miku) | Vocaloid | 1 | 16/16 | aucun manifeste mêlée dédié |
| Yugi Muto (yugi) | Yu-Gi-Oh | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sol Badguy (solbadguy) | Guilty Gear | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ragna the Bloodedge (ragna) | BlazBlue | 1 | 16/16 | aucun manifeste mêlée dédié |
| Slender Survivor (survivor) | Slender Man | 1 | 16/16 | aucun manifeste mêlée dédié |
| Andy Barclay (andy) | Chucky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kirsty Cotton (kirsty) | Hellraiser | 1 | 16/16 | aucun manifeste mêlée dédié |
| Commander Shepard (shepard) | Mass Effect | 1 | 16/16 | aucun manifeste mêlée dédié |
| Vault Dweller (valtweller) | Fallout | 1 | 16/16 | aucun manifeste mêlée dédié |
| Doom Slayer (doomslayer) | Doom | 1 | 16/16 | aucun manifeste mêlée dédié |
| Harry Potter (harry) | Harry Potter | 1 | 16/16 | aucun manifeste mêlée dédié |
| Luke Skywalker (luke) | Star Wars | 1 | 16/16 | aucun manifeste mêlée dédié |
| Korben Dallas (korben) | Le Cinquième Element | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cindy Campbell (cindy) | Scary Movie | 1 | 16/16 | aucun manifeste mêlée dédié |
| Isaac Clarke (isaac) | Dead Space | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rick Sanchez (rick) | Rick & Morty | 1 | 16/16 | aucun manifeste mêlée dédié |
| Digital Circus (pomni) | Digital Circus | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tai & Agumon (taichi) | Digimon | 1 | 16/16 | aucun manifeste mêlée dédié |
| Moka Akashiya (tsukune) | Rosario + Vampire | 1 | 16/16 | aucun manifeste mêlée dédié |
| Negi Springfield (negi) | Negima | 1 | 16/16 | aucun manifeste mêlée dédié |
| Motoko Kusanagi (motoko) | Ghost in the Shell | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mad Max (max) | Mad Max | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dom Santiago (dom) | Gears of War | 1 | 16/16 | aucun manifeste mêlée dédié |
| Augustus Cole (cole) | Gears of War | 1 | 16/16 | aucun manifeste mêlée dédié |
| Damon Baird (baird) | Gears of War | 1 | 16/16 | aucun manifeste mêlée dédié |
| Anya Stroud (anya_stroud) | Gears of War | 1 | 16/16 | aucun manifeste mêlée dédié |
| Colonel Hoffman (hoffman_cog) | Gears of War | 1 | 16/16 | aucun manifeste mêlée dédié |
| Carmine (carmine_cog) | Gears of War | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kait Diaz (kait_diaz) | Gears of War | 1 | 16/16 | aucun manifeste mêlée dédié |
| The Arbiter (arbiter) | Halo | 1 | non-integral-grid | grille fractionnaire à revoir; aucun manifeste mêlée dédié |
| Sgt. Avery Johnson (johnson) | Halo | 1 | non-integral-grid | grille fractionnaire à revoir; aucun manifeste mêlée dédié |
| Cortana (cortana) | Halo | 1 | 16/16 | aucun manifeste mêlée dédié |
| Noble Six (noble_six) | Halo | 1 | 16/16 | aucun manifeste mêlée dédié |
| Edward Buck (buck_odst) | Halo | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kelly-087 (kelly_087) | Halo | 1 | 16/16 | aucun manifeste mêlée dédié |
| Linda-058 (linda_058) | Halo | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cortana Fragment (cortana_fragment) | Halo | 1 | 16/16 | aucun manifeste mêlée dédié |
| Edward Buck (buck) | Halo | 1 | 16/16 | aucun manifeste mêlée dédié |
| Corporal Hicks (hicks) | Alien | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bishop (bishop) | Alien | 1 | 16/16 | aucun manifeste mêlée dédié |
| Captain Dallas (dallas_alien) | Alien | 1 | 16/16 | aucun manifeste mêlée dédié |
| Parker (parker_alien) | Alien | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lambert (lambert_alien) | Alien | 1 | 16/16 | aucun manifeste mêlée dédié |
| Newt (newt_aliens) | Alien | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ash (ash_alien) | Alien | 1 | 16/16 | aucun manifeste mêlée dédié |
| Amanda Ripley (amanda_ripley) | Alien | 1 | 16/16 | aucun manifeste mêlée dédié |
| City Hunter (city_hunter) | Predator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dutch Schaefer (dutch) | Predator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Anna Gonsalves (anna_predator) | Predator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Billy Sole (billy_predator) | Predator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mac Eliot (mac_predator) | Predator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mike Harrigan (harrigan_predator) | Predator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Greyback Elder (greyback_yautja) | Predator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Naru (naru) | Predator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mike Harrigan (harrigan_p2_core) | Predator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Royce (royce_predators_core) | Predator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jill Valentine (jill) | Resident Evil | 1 | 16/16 | aucun manifeste mêlée dédié |
| Albert Wesker (wesker) | Resident Evil | 1 | 16/16 | aucun manifeste mêlée dédié |
| Chris Redfield (chris_redfield) | Resident Evil | 1 | 16/16 | aucun manifeste mêlée dédié |
| Claire Redfield (claire_redfield) | Resident Evil | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ada Wong (ada_wong) | Resident Evil | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rebecca Chambers (rebecca_chambers) | Resident Evil | 1 | 16/16 | aucun manifeste mêlée dédié |
| Barry Burton (barry_burton) | Resident Evil | 1 | 16/16 | aucun manifeste mêlée dédié |
| Carlos Oliveira (carlos_oliveira) | Resident Evil | 1 | 16/16 | aucun manifeste mêlée dédié |
| James Sunderland (james_s) | Silent Hill | 1 | 16/16 | aucun manifeste mêlée dédié |
| Heather Mason (heather) | Silent Hill | 1 | 16/16 | aucun manifeste mêlée dédié |
| Harry Mason (harry_mason) | Silent Hill | 1 | 16/16 | aucun manifeste mêlée dédié |
| Alessa Gillespie (alessa_gillespie) | Silent Hill | 1 | 16/16 | aucun manifeste mêlée dédié |
| Maria (maria_sh2) | Silent Hill | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cybil Bennett (cybil_bennett) | Silent Hill | 1 | 16/16 | aucun manifeste mêlée dédié |
| Claudia Wolf (claudia_wolf) | Silent Hill | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dylan Morton (dylan) | Dino Crisis | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rick (rick_dc) | Dino Crisis | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gail (gail_dc) | Dino Crisis | 1 | 16/16 | aucun manifeste mêlée dédié |
| Paula (paula_dc2) | Dino Crisis | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dr. Kirk (dr_kirk) | Dino Crisis | 1 | 16/16 | aucun manifeste mêlée dédié |
| David Fork (david_dc2) | Dino Crisis | 1 | 16/16 | aucun manifeste mêlée dédié |
| David Folk (david_folk_dc2) | Dino Crisis | 1 | 16/16 | aucun manifeste mêlée dédié |
| Trinity (trinity) | The Matrix | 1 | 16/16 | aucun manifeste mêlée dédié |
| Morpheus (morpheus) | The Matrix | 1 | 16/16 | aucun manifeste mêlée dédié |
| Agent Smith (agent_smith) | The Matrix | 1 | 16/16 | aucun manifeste mêlée dédié |
| Niobe (niobe_matrix) | The Matrix | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tank (tank_matrix) | The Matrix | 1 | 16/16 | aucun manifeste mêlée dédié |
| The Oracle (oracle_matrix) | The Matrix | 1 | 16/16 | aucun manifeste mêlée dédié |
| Niobe (niobe) | The Matrix | 1 | 16/16 | aucun manifeste mêlée dédié |
| Link (link_matrix) | The Matrix | 1 | 16/16 | aucun manifeste mêlée dédié |
| Seraph (seraph) | The Matrix | 1 | 16/16 | aucun manifeste mêlée dédié |
| Teal'c (tealc) | Stargate | 1 | 16/16 | aucun manifeste mêlée dédié |
| Samantha Carter (sam_carter) | Stargate | 1 | 16/16 | aucun manifeste mêlée dédié |
| Daniel Jackson (daniel_jackson) | Stargate | 1 | 16/16 | aucun manifeste mêlée dédié |
| General Hammond (hammond_sgc) | Stargate | 1 | 16/16 | aucun manifeste mêlée dédié |
| Vala Mal Doran (vala_mal_doran) | Stargate | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cameron Mitchell (cam_mitchell) | Stargate | 1 | 16/16 | aucun manifeste mêlée dédié |
| General Hammond (hammond) | Stargate | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cameron Mitchell (cameron_mitchell) | Stargate | 1 | 16/16 | aucun manifeste mêlée dédié |
| Master Bra'tac (bratac) | Stargate | 1 | 16/16 | aucun manifeste mêlée dédié |
| Barney Calhoun (barney) | Half-Life | 1 | 16/16 | aucun manifeste mêlée dédié |
| Adrian Shephard (shephard) | Half-Life | 1 | 16/16 | aucun manifeste mêlée dédié |
| Alyx Vance (alyx_vance) | Half-Life | 1 | 16/16 | aucun manifeste mêlée dédié |
| Eli Vance (eli_vance) | Half-Life | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dr. Kleiner (kleiner) | Half-Life | 1 | 16/16 | aucun manifeste mêlée dédié |
| Vortigaunt Ally (vortigaunt_ally) | Half-Life | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dog (dog_hl2) | Half-Life | 1 | 16/16 | aucun manifeste mêlée dédié |
| Atlas (atlas) | Portal | 1 | 16/16 | aucun manifeste mêlée dédié |
| P-Body (pbody) | Portal | 1 | 16/16 | aucun manifeste mêlée dédié |
| GLaDOS (glados) | Portal | 1 | 16/16 | aucun manifeste mêlée dédié |
| Wheatley (wheatley) | Portal | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cave Johnson (cave_johnson) | Portal | 1 | 16/16 | aucun manifeste mêlée dédié |
| Caroline (caroline_portal) | Portal | 1 | 16/16 | aucun manifeste mêlée dédié |
| Doug Rattmann (doug_rattmann) | Portal | 1 | 16/16 | aucun manifeste mêlée dédié |
| GLaDOS Potato Core (glados_core) | Portal | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cave Johnson Echo (cave_johnson_echo) | Portal | 1 | 16/16 | aucun manifeste mêlée dédié |
| Raiden (raiden) | Metal Gear | 1 | 16/16 | aucun manifeste mêlée dédié |
| Otacon (otacon) | Metal Gear | 1 | 16/16 | aucun manifeste mêlée dédié |
| Meryl Silverburgh (meryl_mgs) | Metal Gear | 1 | 16/16 | aucun manifeste mêlée dédié |
| Liquid Snake (liquid_snake) | Metal Gear | 1 | 16/16 | aucun manifeste mêlée dédié |
| The Boss (the_boss_mgs) | Metal Gear | 1 | 16/16 | aucun manifeste mêlée dédié |
| Revolver Ocelot (ocelot_mgs) | Metal Gear | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gray Fox (gray_fox) | Metal Gear | 1 | 16/16 | aucun manifeste mêlée dédié |
| Big Boss (big_boss) | Metal Gear | 1 | 16/16 | aucun manifeste mêlée dédié |
| Wolf (wolf_pd) | Payday | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hoxton (hoxton) | Payday | 1 | 16/16 | aucun manifeste mêlée dédié |
| Chains (chains_pd) | Payday | 1 | 16/16 | aucun manifeste mêlée dédié |
| Houston (houston_pd) | Payday | 1 | 16/16 | aucun manifeste mêlée dédié |
| Clover (clover_pd) | Payday | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bain (bain_pd) | Payday | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kagamine Rin (rin) | Vocaloid | 1 | 16/16 | aucun manifeste mêlée dédié |
| Megurine Luka (luka) | Vocaloid | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kagamine Len (len) | Vocaloid | 1 | 16/16 | aucun manifeste mêlée dédié |
| MEIKO (meiko) | Vocaloid | 1 | 16/16 | aucun manifeste mêlée dédié |
| KAITO (kaito) | Vocaloid | 1 | 16/16 | aucun manifeste mêlée dédié |
| GUMI (gumi) | Vocaloid | 1 | 16/16 | aucun manifeste mêlée dédié |
| Seto Kaiba (kaiba) | Yu-Gi-Oh | 1 | 16/16 | aucun manifeste mêlée dédié |
| Joey Wheeler (joey) | Yu-Gi-Oh | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tea Gardner (tea_ygo) | Yu-Gi-Oh | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ryo Bakura (bakura_ygo) | Yu-Gi-Oh | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mai Valentine (mai_ygo) | Yu-Gi-Oh | 1 | 16/16 | aucun manifeste mêlée dédié |
| Maximillion Pegasus (pegasus_ygo) | Yu-Gi-Oh | 1 | 16/16 | aucun manifeste mêlée dédié |
| Pharaoh Atem (atem) | Yu-Gi-Oh | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tea Gardner (tea_gardner) | Yu-Gi-Oh | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mai Valentine (mai_valentine) | Yu-Gi-Oh | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ky Kiske (ky) | Guilty Gear | 1 | 16/16 | aucun manifeste mêlée dédié |
| May (may_gg) | Guilty Gear | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dizzy (dizzy_gg) | Guilty Gear | 1 | 16/16 | aucun manifeste mêlée dédié |
| Millia Rage (millia_gg) | Guilty Gear | 1 | 16/16 | aucun manifeste mêlée dédié |
| Axl Low (axl_gg) | Guilty Gear | 1 | 16/16 | aucun manifeste mêlée dédié |
| Baiken (baiken_gg) | Guilty Gear | 1 | 16/16 | aucun manifeste mêlée dédié |
| Baiken (baiken) | Guilty Gear | 1 | 16/16 | aucun manifeste mêlée dédié |
| Millia Rage (millia_rage) | Guilty Gear | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jin Kisaragi (jin) | BlazBlue | 1 | 16/16 | aucun manifeste mêlée dédié |
| Noel Vermillion (noel) | BlazBlue | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rachel Alucard (rachel_bb) | BlazBlue | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hazama (hazama_bb) | BlazBlue | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tsubaki Yayoi (tsubaki_bb) | BlazBlue | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hakumen (hakumen_bb) | BlazBlue | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rachel Alucard (rachel_alucard) | BlazBlue | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hakumen (hakumen) | BlazBlue | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hazama (hazama) | BlazBlue | 1 | 16/16 | aucun manifeste mêlée dédié |
| Masky (masky) | Slender Man | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hoody (hoody) | Slender Man | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kate (kate_slender) | Slender Man | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lauren (lauren_slender) | Slender Man | 1 | 16/16 | aucun manifeste mêlée dédié |
| Charlie Matheson (charlie_slender) | Slender Man | 1 | 16/16 | aucun manifeste mêlée dédié |
| Charlie Matheson Echo (charlie_matheson) | Slender Man | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tiffany Valentine (tiffany) | Chucky | 1 | non-integral-grid | grille fractionnaire à revoir; aucun manifeste mêlée dédié |
| Glen / Glenda (glen) | Chucky | 1 | non-integral-grid | grille fractionnaire à revoir; aucun manifeste mêlée dédié |
| Kyle (kyle_chucky) | Chucky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nica Pierce (nica_chucky) | Chucky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jake Wheeler (jake_chucky) | Chucky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nica Pierce (nica_pierce) | Chucky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jake Wheeler (jake_wheeler) | Chucky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tiffany Valentine - Human (Bride) (tiffany_human_bride) | Chucky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tiffany Valentine - Gothic Bride (tiffany_human_wedding) | Chucky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tiffany Valentine - All-Black Gothic (1998) (tiffany_human_all_black_1998) | Chucky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tiffany Valentine - Voluptuous Original (Adult AU) (tiffany_voluptuous_original_au) | Chucky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tiffany Doll - Leather Jacket Bride (1998) (tiffany_leather_jacket_bride_1998) | Chucky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tiffany Doll - Dark-Haired Wedding Belle (AU) (tiffany_dark_haired_wedding_belle_au) | Chucky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tiffany Doll - Burned and Bald (Damage AU) (tiffany_burned_bald_damage_au) | Chucky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tiffany Valentine - Two-Piece Bikini (Adult AU) (tiffany_human_two_piece_bikini_au) | Chucky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tiffany Doll - Two-Piece Bikini (Adult AU) (tiffany_doll_two_piece_bikini_au) | Chucky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tiffany Valentine - Street Siren (Adult AU) (tiffany_street_siren_au) | Chucky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tiffany Valentine - Synthetic Doll (Adult AU) (tiffany_synthetic_companion_doll_au) | Chucky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tiffany Valentine - Leather Mistress (Adult AU) (tiffany_leather_mistress_au) | Chucky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tiffany Doll - Street Siren (Adult AU) (tiffany_street_siren_doll_au) | Chucky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tiffany Doll - Synthetic Companion (Adult AU) (tiffany_synthetic_companion_doll_form_au) | Chucky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tiffany Doll - Leather Mistress (Adult AU) (tiffany_leather_mistress_doll_au) | Chucky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jennifer Tilly (Seed of Chucky) (jennifer_tilly_seed) | Chucky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jennifer Tilly - Seed Glamour Costume (jennifer_tilly_seed_glamour) | Chucky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Female Cenobite (female_cenobite) | Hellraiser | 1 | 16/16 | aucun manifeste mêlée dédié |
| Butterball (butterball) | Hellraiser | 1 | 16/16 | aucun manifeste mêlée dédié |
| Pinhead (pinhead) | Hellraiser | 1 | 16/16 | aucun manifeste mêlée dédié |
| Chatterer (chatterer) | Hellraiser | 1 | 16/16 | aucun manifeste mêlée dédié |
| Julia Cotton (julia_cotton) | Hellraiser | 1 | 16/16 | aucun manifeste mêlée dédié |
| Joey Summerskill (joey_summerskill) | Hellraiser | 1 | 16/16 | aucun manifeste mêlée dédié |
| Riley McKendry (riley_mckendry) | Hellraiser | 1 | 16/16 | aucun manifeste mêlée dédié |
| The Priest (2022) (the_priest_2022) | Hellraiser | 1 | 16/16 | aucun manifeste mêlée dédié |
| Garrus Vakarian (garrus) | Mass Effect | 1 | 16/16 | aucun manifeste mêlée dédié |
| Liara T'Soni (liara) | Mass Effect | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tali Zorah (tali) | Mass Effect | 1 | 16/16 | aucun manifeste mêlée dédié |
| Urdnot Wrex (wrex) | Mass Effect | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ashley Williams (ashley_williams) | Mass Effect | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mordin Solus (mordin) | Mass Effect | 1 | 16/16 | aucun manifeste mêlée dédié |
| Paladin Danse (paladin) | Fallout | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nick Valentine (nick_v) | Fallout | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dogmeat (dogmeat) | Fallout | 1 | 16/16 | aucun manifeste mêlée dédié |
| Piper Wright (piper_wright) | Fallout | 1 | 16/16 | aucun manifeste mêlée dédié |
| Preston Garvey (preston_garvey) | Fallout | 1 | 16/16 | aucun manifeste mêlée dédié |
| Craig Boone (boone_fnv) | Fallout | 1 | 16/16 | aucun manifeste mêlée dédié |
| Courier Six (courier_six) | Fallout | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lone Wanderer (lone_wanderer) | Fallout | 1 | 16/16 | aucun manifeste mêlée dédié |
| Samuel Hayden (hayden) | Doom | 1 | 16/16 | aucun manifeste mêlée dédié |
| UAC Marine (doom_marine) | Doom | 1 | 16/16 | aucun manifeste mêlée dédié |
| VEGA (vega_doom) | Doom | 1 | 16/16 | aucun manifeste mêlée dédié |
| Night Sentinel (night_sentinel) | Doom | 1 | 16/16 | aucun manifeste mêlée dédié |
| Classic Doom Marine (doom_marine_classic) | Doom | 1 | 16/16 | aucun manifeste mêlée dédié |
| VEGA (vega) | Doom | 1 | 16/16 | aucun manifeste mêlée dédié |
| The Betrayer (betrayer_doom) | Doom | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gina (unreal_1998_gina) | Unreal | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dante (unreal_1998_dante) | Unreal | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kurgan (unreal_1998_kurgan) | Unreal | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hermione Granger (hermione) | Harry Potter | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ron Weasley (ron) | Harry Potter | 1 | 16/16 | aucun manifeste mêlée dédié |
| Harry Potter (harry_potter) | Harry Potter | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hermione Granger (hermione_granger) | Harry Potter | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ron Weasley (ron_weasley) | Harry Potter | 1 | 16/16 | aucun manifeste mêlée dédié |
| Albus Dumbledore (dumbledore) | Harry Potter | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sirius Black (sirius_black) | Harry Potter | 1 | 16/16 | aucun manifeste mêlée dédié |
| Severus Snape (snape) | Harry Potter | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lord Voldemort (voldemort) | Harry Potter | 1 | 16/16 | aucun manifeste mêlée dédié |
| Neville Longbottom (neville) | Harry Potter | 1 | 16/16 | aucun manifeste mêlée dédié |
| Darth Vader (vader) | Star Wars | 1 | 16/16 | aucun manifeste mêlée dédié |
| Han Solo (han_solo) | Star Wars | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ahsoka Tano (Padawan) (ahsoka_padawan) | Star Wars | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ahsoka Tano (Adult) (ahsoka_adult) | Star Wars | 1 | 16/16 | aucun manifeste mêlée dédié |
| Aayla Secura (aayla_secura) | Star Wars | 1 | 16/16 | aucun manifeste mêlée dédié |
| Darth Revan (darth_revan) | Star Wars | 1 | 16/16 | aucun manifeste mêlée dédié |
| Darth Talon (darth_talon) | Star Wars | 1 | 16/16 | aucun manifeste mêlée dédié |
| Leia Organa (leia_organa) | Star Wars | 1 | 16/16 | aucun manifeste mêlée dédié |
| Obi-Wan Kenobi (obi_wan) | Star Wars | 1 | 16/16 | aucun manifeste mêlée dédié |
| Yoda (yoda) | Star Wars | 1 | 16/16 | aucun manifeste mêlée dédié |
| Darth Maul (darth_maul) | Star Wars | 1 | 16/16 | aucun manifeste mêlée dédié |
| Leia Organa (leia) | Star Wars | 1 | 16/16 | aucun manifeste mêlée dédié |
| Obi-Wan Kenobi (obiwan) | Star Wars | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ahsoka Tano (Siege of Mandalore) (ahsoka) | Star Wars | 1 | 16/16 | aucun manifeste mêlée dédié |
| Leeloo (leeloo) | Le Cinquième Element | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ruby Rhod (ruby_rhod) | Le Cinquième Element | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jean-Baptiste Emanuel Zorg (zorg) | Le Cinquième Element | 1 | 16/16 | aucun manifeste mêlée dédié |
| Vito Cornelius (cornelius) | Le Cinquième Element | 1 | 16/16 | aucun manifeste mêlée dédié |
| General Munro (munro_fifth) | Le Cinquième Element | 1 | 16/16 | aucun manifeste mêlée dédié |
| Vito Cornelius (vito_cornelius) | Le Cinquième Element | 1 | 16/16 | aucun manifeste mêlée dédié |
| Diva Plavalaguna (diva_plavalaguna) | Le Cinquième Element | 1 | 16/16 | aucun manifeste mêlée dédié |
| David (david_fifth) | Le Cinquième Element | 1 | 16/16 | aucun manifeste mêlée dédié |
| Shorty Meeks (shorty) | Scary Movie | 1 | 16/16 | aucun manifeste mêlée dédié |
| Brenda Meeks (brenda_meeks) | Scary Movie | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ray Wilkins (ray_wilkins) | Scary Movie | 1 | 16/16 | aucun manifeste mêlée dédié |
| Doofy Gilmore (doofy) | Scary Movie | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gail Hailstorm (gail_hailstorm) | Scary Movie | 1 | 16/16 | aucun manifeste mêlée dédié |
| John Carver (carver) | Dead Space | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ellie Langford (ellie) | Dead Space | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nicole Brennan (nicole_brennan) | Dead Space | 1 | 16/16 | aucun manifeste mêlée dédié |
| Zach Hammond (zach_hammond) | Dead Space | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kendra Daniels (kendra_daniels) | Dead Space | 1 | 16/16 | aucun manifeste mêlée dédié |
| Zach Hammond (hammond_ds) | Dead Space | 1 | 16/16 | aucun manifeste mêlée dédié |
| Morty Smith (morty) | Rick & Morty | 1 | 16/16 | aucun manifeste mêlée dédié |
| Summer Smith (summer) | Rick & Morty | 1 | 16/16 | aucun manifeste mêlée dédié |
| Birdperson (birdperson) | Rick & Morty | 1 | 16/16 | aucun manifeste mêlée dédié |
| Beth Smith (beth_smith) | Rick & Morty | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mr. Meeseeks (mr_meeseeks) | Rick & Morty | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jerry Smith (jerry_smith) | Rick & Morty | 1 | 16/16 | aucun manifeste mêlée dédié |
| Space Beth (space_beth) | Rick & Morty | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jax (jax) | Digital Circus | 1 | 16/16 | aucun manifeste mêlée dédié |
| Caine (caine) | Digital Circus | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ragatha (ragatha) | Digital Circus | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kinger (kinger) | Digital Circus | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gangle (gangle) | Digital Circus | 1 | 16/16 | aucun manifeste mêlée dédié |
| Zooble (zooble) | Digital Circus | 1 | 16/16 | aucun manifeste mêlée dédié |
| Matt & Gabumon (matt) | Digimon | 1 | 16/16 | aucun manifeste mêlée dédié |
| Izzy & Tentomon (izzy) | Digimon | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sora & Biyomon (sora_biyomon) | Digimon | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mimi & Palmon (mimi_palmon) | Digimon | 1 | 16/16 | aucun manifeste mêlée dédié |
| Joe & Gomamon (joe_gomamon) | Digimon | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kari & Gatomon (kari_gatomon) | Digimon | 1 | 16/16 | aucun manifeste mêlée dédié |
| T.K. & Patamon (tk_patamon) | Digimon | 1 | 16/16 | aucun manifeste mêlée dédié |
| Adam Stanheight (adam_stanheight) | Saw | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dr. Lawrence Gordon (lawrence_gordon) | Saw | 1 | 16/16 | aucun manifeste mêlée dédié |
| Detective David Tapp (detective_tapp) | Saw | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kurumu Kurono (kurumu) | Rosario + Vampire | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tsukune Aono (tsukune_aono) | Rosario + Vampire | 1 | 16/16 | aucun manifeste mêlée dédié |
| Yukari Sendo (yukari_rv) | Rosario + Vampire | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mizore Shirayuki (mizore_rv) | Rosario + Vampire | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gin Morioka (gin_rv) | Rosario + Vampire | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mizore Shirayuki (mizore_shirayuki) | Rosario + Vampire | 1 | 16/16 | aucun manifeste mêlée dédié |
| Yukari Sendo (yukari_sendo) | Rosario + Vampire | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gin Morioka (gin_morioka) | Rosario + Vampire | 1 | 16/16 | aucun manifeste mêlée dédié |
| Asuna Kagurazaka (asuna) | Negima | 1 | 16/16 | aucun manifeste mêlée dédié |
| Evangeline McDowell (evangeline) | Negima | 1 | 16/16 | aucun manifeste mêlée dédié |
| Konoka Konoe (konoka_negima) | Negima | 1 | 16/16 | aucun manifeste mêlée dédié |
| Setsuna Sakurazaki (setsuna_negima) | Negima | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nodoka Miyazaki (nodoka_negima) | Negima | 1 | 16/16 | aucun manifeste mêlée dédié |
| Konoka Konoe (konoka_konoe) | Negima | 1 | 16/16 | aucun manifeste mêlée dédié |
| Setsuna Sakurazaki (setsuna_sakurazaki) | Negima | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kotaro Inugami (kotaro_inugami_hero) | Negima | 1 | 16/16 | aucun manifeste mêlée dédié |
| Batou (batou) | Ghost in the Shell | 1 | 16/16 | aucun manifeste mêlée dédié |
| Togusa (togusa) | Ghost in the Shell | 1 | 16/16 | aucun manifeste mêlée dédié |
| Daisuke Aramaki (aramaki) | Ghost in the Shell | 1 | 16/16 | aucun manifeste mêlée dédié |
| Saito (saito_gits) | Ghost in the Shell | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ishikawa (ishikawa_gits) | Ghost in the Shell | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tachikoma (tachikoma) | Ghost in the Shell | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tachikoma Unit (tachikoma_unit) | Ghost in the Shell | 1 | 16/16 | aucun manifeste mêlée dédié |
| Furiosa (furiosa) | Mad Max | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nux (nux) | Mad Max | 1 | 16/16 | aucun manifeste mêlée dédié |
| Toast the Knowing (toast_mm) | Mad Max | 1 | 16/16 | aucun manifeste mêlée dédié |
| Capable (capable_mm) | Mad Max | 1 | 16/16 | aucun manifeste mêlée dédié |
| Chumbucket (chumbucket_mm) | Mad Max | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jim Goose (goose_mm) | Mad Max | 1 | 16/16 | aucun manifeste mêlée dédié |
| Feral Kid (feral_kid) | Mad Max | 1 | 16/16 | aucun manifeste mêlée dédié |
| Praetorian Jack (praetorian_jack) | Mad Max | 1 | 16/16 | aucun manifeste mêlée dédié |
| Korvo (korvo_solar) | Solar Opposites | 1 | 16/16 | aucun manifeste mêlée dédié |
| Terry (terry_solar) | Solar Opposites | 1 | 16/16 | aucun manifeste mêlée dédié |
| Yumyulack (yumyulack_solar) | Solar Opposites | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jesse (jesse_solar) | Solar Opposites | 1 | 16/16 | aucun manifeste mêlée dédié |
| Siren Head (siren_head) | Siren Head | 1 | 16/16 | aucun manifeste mêlée dédié |
| Long Horse (long_horse) | Siren Head | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cartoon Cat (cartoon_cat) | Siren Head | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rincewind (rincewind_dw) | Discworld | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sam Vimes (vimes_dw) | Discworld | 1 | 16/16 | aucun manifeste mêlée dédié |
| Granny Weatherwax (granny_dw) | Discworld | 1 | 16/16 | aucun manifeste mêlée dédié |
| Twoflower (twoflower_dw) | Discworld | 1 | 16/16 | aucun manifeste mêlée dédié |
| Death (death_dw) | Discworld | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lord Vetinari (vetinari_dw) | Discworld | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nanny Ogg (nanny_ogg_dw) | Discworld | 1 | 16/16 | aucun manifeste mêlée dédié |
| Joker New 52 (joker_n52) | Joker New 52 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Harley Quinn New 52 (harley_n52) | Joker New 52 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Batman New 52 (batman_n52) | Joker New 52 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Batman Who Laughs (batman_laughs) | The Batman Who Laughs | 1 | 16/16 | aucun manifeste mêlée dédié |
| The Grim Knight (grim_knight) | The Batman Who Laughs | 1 | 16/16 | aucun manifeste mêlée dédié |
| The Red Death (red_death) | The Batman Who Laughs | 1 | 16/16 | aucun manifeste mêlée dédié |
| Arthur Pendragon (arthur_kaamelott) | Kaamelott | 2 | 48/48, 24/24 | aucun manifeste mêlée dédié |
| Perceval (perceval_kaamelott) | Kaamelott | 1 | 16/16 | aucun manifeste mêlée dédié |
| Karadoc (karadoc_kaamelott) | Kaamelott | 1 | 16/16 | aucun manifeste mêlée dédié |
| Leodagan (leodagan_kaamelott) | Kaamelott | 1 | 16/16 | aucun manifeste mêlée dédié |
| Guenièvre (guenievre_kaamelott) | Kaamelott | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lancelot (lancelot_kaamelott) | Kaamelott | 1 | 16/16 | aucun manifeste mêlée dédié |
| Merlin (merlin_kaamelott) | Kaamelott | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bohort (bohort_kaamelott) | Kaamelott | 1 | 16/16 | aucun manifeste mêlée dédié |
| Elizabeth Shaw (shaw_prometheus) | Prometheus | 1 | 16/16 | aucun manifeste mêlée dédié |
| David 8 (david8_prometheus) | Prometheus | 1 | 16/16 | aucun manifeste mêlée dédié |
| Captain Janek (janek_prometheus) | Prometheus | 1 | 16/16 | aucun manifeste mêlée dédié |
| Corporal Hicks (hicks_aliens) | Aliens | 1 | 16/16 | aucun manifeste mêlée dédié |
| Vasquez (vasquez_aliens) | Aliens | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bishop (bishop_aliens) | Aliens | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ellen Ripley Aliens (ripley_aliens) | Aliens | 1 | 16/16 | aucun manifeste mêlée dédié |
| Newt (newt_hadley) | Aliens | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hudson (hudson_aliens) | Aliens | 1 | 16/16 | aucun manifeste mêlée dédié |
| Apone (apone_aliens) | Aliens | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ellen Ripley A3 (ripley_a3) | Alien 3 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dillon (dillon_a3) | Alien 3 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Morse (morse_a3) | Alien 3 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ripley 8 (ripley8) | Alien Resurrection | 1 | 16/16 | aucun manifeste mêlée dédié |
| Annalee Call (call_resurrection) | Alien Resurrection | 1 | 16/16 | aucun manifeste mêlée dédié |
| Christie (christie_resurrection) | Alien Resurrection | 1 | 16/16 | aucun manifeste mêlée dédié |
| Daniels (daniels_covenant) | Alien: Covenant | 1 | 16/16 | aucun manifeste mêlée dédié |
| Walter (walter_covenant) | Alien: Covenant | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tennessee (tennessee_covenant) | Alien: Covenant | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rain Carradine (rain_romulus) | Alien: Romulus | 1 | 16/16 | aucun manifeste mêlée dédié |
| Andy (andy_romulus) | Alien: Romulus | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tyler (tyler_romulus) | Alien: Romulus | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mike Harrigan (harrigan_p2) | Predator 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| City Hunter (city_hunter_p2) | Predator 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Peter Keyes (keyes_p2) | Predator 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Royce (royce_predators) | Predators | 1 | 16/16 | aucun manifeste mêlée dédié |
| Berserker Predator (berserker_predator) | Predators | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hanzo (hanzo_predators) | Predators | 1 | 16/16 | aucun manifeste mêlée dédié |
| Quinn McKenna (quinn_predator) | The Predator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Casey Bracket (casey_predator) | The Predator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Fugitive Predator (fugitive_predator) | The Predator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Naru (naru_prey) | Prey | 1 | 16/16 | aucun manifeste mêlée dédié |
| Taabe (taabe_prey) | Prey | 1 | 16/16 | aucun manifeste mêlée dédié |
| Feral Predator (feral_predator) | Prey | 1 | 16/16 | aucun manifeste mêlée dédié |
| Viking Shieldmaiden (viking_kok) | Predator: Killer of Killers | 1 | 16/16 | aucun manifeste mêlée dédié |
| Shadow Ninja (ninja_kok) | Predator: Killer of Killers | 1 | 16/16 | aucun manifeste mêlée dédié |
| War Pilot (pilot_kok) | Predator: Killer of Killers | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dek (dek_badlands) | Predator: Badlands | 1 | 16/16 | aucun manifeste mêlée dédié |
| Thia (thia_badlands) | Predator: Badlands | 1 | 16/16 | aucun manifeste mêlée dédié |
| Badlands Scout (badlands_scout) | Predator: Badlands | 1 | 16/16 | aucun manifeste mêlée dédié |
| Alexa Woods (lex_avp) | Alien vs Predator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Scar Predator (scar_avp) | Alien vs Predator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sebastian De Rosa (sebastian_avp) | Alien vs Predator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Wolf Predator (wolf_avpr) | Aliens vs Predator: Requiem | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dallas Howard (dallas_avpr) | Aliens vs Predator: Requiem | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kelly O Brien (kelly_avpr) | Aliens vs Predator: Requiem | 1 | 16/16 | aucun manifeste mêlée dédié |
| Laios Touden (laios_meshi) | Dungeon Meshi | 1 | 16/16 | aucun manifeste mêlée dédié |
| Marcille (marcille_meshi) | Dungeon Meshi | 1 | 16/16 | aucun manifeste mêlée dédié |
| Senshi (senshi_meshi) | Dungeon Meshi | 1 | 16/16 | aucun manifeste mêlée dédié |
| Chilchuck (chilchuck_meshi) | Dungeon Meshi | 1 | 16/16 | aucun manifeste mêlée dédié |
| Falin (falin_meshi) | Dungeon Meshi | 1 | 16/16 | aucun manifeste mêlée dédié |
| Izutsumi (izutsumi_meshi) | Dungeon Meshi | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sparadrap (sparadrap_noob) | Noob | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gaea (gloglo_noob) | Noob | 1 | 16/16 | aucun manifeste mêlée dédié |
| Omega Zell (omega_zell_noob) | Noob | 1 | 16/16 | aucun manifeste mêlée dédié |
| Till Lindemann (till_lindemann) | Rammstein | 1 | 16/16 | aucun manifeste mêlée dédié |
| Richard Z. Kruspe (richard_kruspe) | Rammstein | 1 | 16/16 | aucun manifeste mêlée dédié |
| Paul Landers (paul_landers) | Rammstein | 1 | 16/16 | aucun manifeste mêlée dédié |
| Oliver Riedel (oliver_riedel) | Rammstein | 1 | 16/16 | aucun manifeste mêlée dédié |
| Christoph Schneider (christoph_schneider) | Rammstein | 1 | 16/16 | aucun manifeste mêlée dédié |
| Christian "Flake" Lorenz (flake_lorenz) | Rammstein | 1 | 16/16 | aucun manifeste mêlée dédié |
| Serj Tankian (serj_tankian) | System of a Down | 2 | 48/48, 24/24 | aucun manifeste mêlée dédié |
| Daron Malakian (daron_malakian) | System of a Down | 1 | 16/16 | aucun manifeste mêlée dédié |
| Shavo Odadjian (shavo_odadjian) | System of a Down | 1 | 16/16 | aucun manifeste mêlée dédié |
| John Dolmayan (john_dolmayan) | System of a Down | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rob Zombie (rob_zombie) | Rob Zombie | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mike Riggs (mike_riggs) | Rob Zombie | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rob "Blasko" Nicholson (rob_blasko_nicholson) | Rob Zombie | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ginger Fish (ginger_fish) | Rob Zombie | 1 | 16/16 | aucun manifeste mêlée dédié |
| Thomas Bangalter (thomas_bangalter) | Daft Punk | 1 | 16/16 | aucun manifeste mêlée dédié |
| Guy-Manuel de Homem-Christo (guy_manuel) | Daft Punk | 1 | 16/16 | aucun manifeste mêlée dédié |
| Stella (Interstella 5555) (stella_interstella) | Daft Punk | 1 | 16/16 | aucun manifeste mêlée dédié |
| Shep (Interstella 5555) (shep_interstella) | Daft Punk | 1 | 16/16 | aucun manifeste mêlée dédié |
| Oliver Tree (oliver_tree) | Oliver Tree | 1 | 16/16 | aucun manifeste mêlée dédié |
| Turbo Oliver (turbo_oliver_tree) | Oliver Tree | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cowboy Tears Oliver (cowboy_tears_oliver) | Oliver Tree | 1 | 16/16 | aucun manifeste mêlée dédié |
| Charlie Morningstar (hazbin_hotel_charlie_morningstar) | Hazbin Hotel | 1 | 16/16 | aucun manifeste mêlée dédié |
| Vaggie (hazbin_hotel_vaggie) | Hazbin Hotel | 1 | 16/16 | aucun manifeste mêlée dédié |
| Angel Dust (hazbin_hotel_angel_dust) | Hazbin Hotel | 1 | 16/16 | aucun manifeste mêlée dédié |
| Elsa Kast (elsa_splice) | Splice | 1 | 16/16 | aucun manifeste mêlée dédié |
| Clive Nicoli (clive_splice) | Splice | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dren (dren_splice) | Splice | 1 | 16/16 | aucun manifeste mêlée dédié |
| Frank Drebin (frank_drebin) | Police Squad | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ed Hocken (ed_hocken) | Police Squad | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nordberg (nordberg) | Police Squad | 1 | 16/16 | aucun manifeste mêlée dédié |
| Walter White (walter_white) | Breaking Bad | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jesse Pinkman (jesse_pinkman) | Breaking Bad | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mike Ehrmantraut (mike_ehrmantraut) | Breaking Bad | 1 | 16/16 | aucun manifeste mêlée dédié |
| Saul Goodman (saul_goodman) | Breaking Bad | 1 | 16/16 | aucun manifeste mêlée dédié |
| John Sheppard (sheppard_sga) | Stargate Atlantis | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rodney McKay (mckay_sga) | Stargate Atlantis | 1 | 16/16 | aucun manifeste mêlée dédié |
| Teyla Emmagan (teyla_sga) | Stargate Atlantis | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ronon Dex (ronon_dex) | Stargate Atlantis | 1 | 16/16 | aucun manifeste mêlée dédié |
| Elizabeth Weir (elizabeth_weir) | Stargate Atlantis | 1 | 16/16 | aucun manifeste mêlée dédié |
| Carson Beckett (carson_beckett) | Stargate Atlantis | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nicholas Rush (rush_sgu) | Stargate Universe | 1 | 16/16 | aucun manifeste mêlée dédié |
| Everett Young (young_sgu) | Stargate Universe | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ronald Greer (greer_sgu) | Stargate Universe | 1 | 16/16 | aucun manifeste mêlée dédié |
| Chloe Armstrong (chloe_sgu) | Stargate Universe | 1 | 16/16 | aucun manifeste mêlée dédié |
| Matthew Scott (matt_scott_sgu) | Stargate Universe | 1 | 16/16 | aucun manifeste mêlée dédié |
| Eli Wallace (eli_wallace_sgu) | Stargate Universe | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gus Bonner (gus_bonner) | Stargate Infinity | 1 | 16/16 | aucun manifeste mêlée dédié |
| Stacey Bonner (stacey_bonner) | Stargate Infinity | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ecgab (ecgab_infinity) | Stargate Infinity | 1 | 16/16 | aucun manifeste mêlée dédié |
| Toaster (toaster_brave) | The Brave Little Toaster | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lampy (lampy_brave) | The Brave Little Toaster | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kirby (kirby_brave) | The Brave Little Toaster | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ira Kane (ira_kane) | Evolution | 1 | 16/16 | aucun manifeste mêlée dédié |
| Harry Block (harry_block) | Evolution | 1 | 16/16 | aucun manifeste mêlée dédié |
| Wayne Grey (wayne_green) | Evolution | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ira Kane Animated (ira_evo_anim) | Evolution: The Animated Series | 1 | 16/16 | aucun manifeste mêlée dédié |
| Harry Block Animated (harry_evo_anim) | Evolution: The Animated Series | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gassie (gassie_evo_anim) | Evolution: The Animated Series | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gary Hobson (gary_hobson) | Early Edition | 1 | 16/16 | aucun manifeste mêlée dédié |
| Marissa Clark (marissa_clark) | Early Edition | 1 | 16/16 | aucun manifeste mêlée dédié |
| Chuck Fishman (chuck_fishman) | Early Edition | 1 | 16/16 | aucun manifeste mêlée dédié |
| Prue Halliwell (prue_halliwell) | Charmed | 1 | 16/16 | aucun manifeste mêlée dédié |
| Piper Halliwell (piper_halliwell) | Charmed | 1 | 16/16 | aucun manifeste mêlée dédié |
| Phoebe Halliwell (phoebe_halliwell) | Charmed | 1 | 16/16 | aucun manifeste mêlée dédié |
| Prue Halliwell (prue_charmed) | Charmed | 1 | 16/16 | aucun manifeste mêlée dédié |
| Paige Matthews (paige_charmed) | Charmed | 1 | 16/16 | aucun manifeste mêlée dédié |
| Leo Wyatt (leo_charmed) | Charmed | 1 | 16/16 | aucun manifeste mêlée dédié |
| Buffy Summers (buffy_summers) | Buffy the Vampire Slayer | 1 | 16/16 | aucun manifeste mêlée dédié |
| Willow Rosenberg (willow_rosenberg) | Buffy the Vampire Slayer | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rupert Giles (giles_buffy) | Buffy the Vampire Slayer | 1 | 16/16 | aucun manifeste mêlée dédié |
| Xander Harris (xander_buffy) | Buffy the Vampire Slayer | 1 | 16/16 | aucun manifeste mêlée dédié |
| Angel (angel_buffy) | Buffy the Vampire Slayer | 1 | 16/16 | aucun manifeste mêlée dédié |
| Willow Rosenberg (willow_buffy) | Buffy the Vampire Slayer | 1 | 16/16 | aucun manifeste mêlée dédié |
| Spike (spike_buffy) | Buffy the Vampire Slayer | 1 | 16/16 | aucun manifeste mêlée dédié |
| Eren Yeager (eren_yeager) | Attack on Titan | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mikasa Ackerman (mikasa_ackerman) | Attack on Titan | 1 | 16/16 | aucun manifeste mêlée dédié |
| Armin Arlert (armin_arlert) | Attack on Titan | 1 | 16/16 | aucun manifeste mêlée dédié |
| Levi Ackerman (levi_aot) | Attack on Titan | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hange Zoe (hange_aot) | Attack on Titan | 1 | 16/16 | aucun manifeste mêlée dédié |
| Erwin Smith (erwin_aot) | Attack on Titan | 1 | 16/16 | aucun manifeste mêlée dédié |
| Light Yagami (light_yagami) | Death Note | 1 | 16/16 | aucun manifeste mêlée dédié |
| L Lawliet (l_lawliet) | Death Note | 1 | 16/16 | aucun manifeste mêlée dédié |
| Misa Amane (misa_amane) | Death Note | 1 | 16/16 | aucun manifeste mêlée dédié |
| Misa Amane (misa_dn) | Death Note | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ryuk (ryuk_dn) | Death Note | 1 | 16/16 | aucun manifeste mêlée dédié |
| Near (near_dn) | Death Note | 1 | 16/16 | aucun manifeste mêlée dédié |
| Red Blood Cell AE3803 (red_blood_cell) | Cells at Work! | 1 | 16/16 | aucun manifeste mêlée dédié |
| White Blood Cell U-1146 (white_blood_cell) | Cells at Work! | 1 | 16/16 | aucun manifeste mêlée dédié |
| Platelet Squad (platelet_cells) | Cells at Work! | 1 | 16/16 | aucun manifeste mêlée dédié |
| Red Blood Cell Courier AE3803 (red_blood_cell_courier_ae3803) | Cells at Work! | 1 | 16/16 | aucun manifeste mêlée dédié |
| White Blood Cell Long-Hair Defender (white_blood_cell_long_hair) | Cells at Work! | 1 | 16/16 | aucun manifeste mêlée dédié |
| White Blood Cell Short-Hair Defender (white_blood_cell_short_hair) | Cells at Work! | 1 | 16/16 | aucun manifeste mêlée dédié |
| Neutrophil U-1146 Combat (neutrophil_u1146_combat) | Cells at Work! | 1 | 16/16 | aucun manifeste mêlée dédié |
| Platelet Squad Leader (platelet_squad_leader) | Cells at Work! | 1 | 16/16 | aucun manifeste mêlée dédié |
| Macrophage Cleaner (macrophage_cleaner) | Cells at Work! | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ichiro Inuyashiki (ichiro_inuyashiki) | Inuyashiki | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hiro Shishigami (hiro_shishigami) | Inuyashiki | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mari Inuyashiki (mari_inuyashiki) | Inuyashiki | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lilith (lilith_borderlands) | Borderlands | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mordecai (mordecai_borderlands) | Borderlands | 1 | 16/16 | aucun manifeste mêlée dédié |
| Claptrap (claptrap_borderlands) | Borderlands | 1 | 16/16 | aucun manifeste mêlée dédié |
| Roland (roland_bl) | Borderlands | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mordecai (mordecai_bl) | Borderlands | 1 | 16/16 | aucun manifeste mêlée dédié |
| Brick (brick_bl) | Borderlands | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tiny Tina (tiny_tina_bl) | Borderlands | 1 | 16/16 | aucun manifeste mêlée dédié |
| Doug Jones Pastor (doug_velocipastor) | VelociPastor | 1 | 16/16 | aucun manifeste mêlée dédié |
| Carol (carol_velocipastor) | VelociPastor | 1 | 16/16 | aucun manifeste mêlée dédié |
| Frankie Mermaid (frankie_velocipastor) | VelociPastor | 1 | 16/16 | aucun manifeste mêlée dédié |
| Robert Tire (robert_rubber) | Rubber | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rubber Sheriff (sheriff_rubber) | Rubber | 1 | 16/16 | aucun manifeste mêlée dédié |
| Desert Spectator (spectator_rubber) | Rubber | 1 | 16/16 | aucun manifeste mêlée dédié |
| Boyd Stevens (boyd_from) | From | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tabitha Matthews (tabitha_from) | From | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jade Herrera (jade_from) | From | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kirie Goshima (kirie_uzumaki) | Uzumaki | 1 | 16/16 | aucun manifeste mêlée dédié |
| Shuichi Saito (shuichi_uzumaki) | Uzumaki | 1 | 16/16 | aucun manifeste mêlée dédié |
| Azami Spiral Echo (azami_uzumaki) | Uzumaki | 1 | 16/16 | aucun manifeste mêlée dédié |
| Toxie (toxie_avenger) | Toxic Avenger | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sara Tromaville (sara_toxic) | Toxic Avenger | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tromaville Cop (tromaville_cop) | Toxic Avenger | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lost Commuter (commuter_exit8) | Exit 8 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sign Watcher (sign_watcher_exit8) | Exit 8 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Corridor Runner (corridor_runner_exit8) | Exit 8 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Alex Taylor (alex_hellhouse) | Hell House LLC | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sara Havel (sara_hellhouse) | Hell House LLC | 1 | 16/16 | aucun manifeste mêlée dédié |
| Paul Camera Lead (paul_hellhouse) | Hell House LLC | 1 | 16/16 | aucun manifeste mêlée dédié |
| Frank (frank_sausage) | Sausage Party | 1 | 16/16 | aucun manifeste mêlée dédié |
| Brenda Bunson (brenda_bun) | Sausage Party | 1 | 16/16 | aucun manifeste mêlée dédié |
| Barry (barry_sausage) | Sausage Party | 1 | 16/16 | aucun manifeste mêlée dédié |
| Simen (simen_spermageddon) | Spermageddon | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cumilla (cumilla_spermageddon) | Spermageddon | 1 | 16/16 | aucun manifeste mêlée dédié |
| Body Guard Cell (body_guard_cell) | Spermageddon | 1 | 16/16 | aucun manifeste mêlée dédié |
| Loid Forger (loid_forger) | Spy x Family | 1 | 16/16 | aucun manifeste mêlée dédié |
| Yor Forger (yor_forger) | Spy x Family | 1 | 16/16 | aucun manifeste mêlée dédié |
| Anya Forger (anya_forger) | Spy x Family | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bond Forger (bond_spy) | Spy x Family | 1 | 16/16 | aucun manifeste mêlée dédié |
| Fiona Frost (fiona_spy) | Spy x Family | 1 | 16/16 | aucun manifeste mêlée dédié |
| Yuri Briar (yuri_spy) | Spy x Family | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sienna Shaw (sienna_terrifier) | Terrifier | 1 | 16/16 | aucun manifeste mêlée dédié |
| Victoria Heyes (victoria_terrifier) | Terrifier | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jonathan Shaw (jonathan_terrifier) | Terrifier | 1 | 16/16 | aucun manifeste mêlée dédié |
| Crysta (crysta_ferngully) | Zak et Crysta | 1 | 16/16 | aucun manifeste mêlée dédié |
| Zak (zak_ferngully) | Zak et Crysta | 1 | 16/16 | aucun manifeste mêlée dédié |
| Batty Koda (batty_ferngully) | Zak et Crysta | 1 | 16/16 | aucun manifeste mêlée dédié |
| Richard Tyler (richard_pagemaster) | Richard au pays des livres magiques | 1 | 16/16 | aucun manifeste mêlée dédié |
| Adventure (adventure_book) | Richard au pays des livres magiques | 1 | 16/16 | aucun manifeste mêlée dédié |
| Fantasy (fantasy_book) | Richard au pays des livres magiques | 1 | 16/16 | aucun manifeste mêlée dédié |
| Le Visiteur (visiteur_futur) | Les Visiteurs du Futur | 1 | 16/16 | aucun manifeste mêlée dédié |
| Raph (raph_visiteur) | Les Visiteurs du Futur | 1 | 16/16 | aucun manifeste mêlée dédié |
| Constance (constance_visiteur) | Les Visiteurs du Futur | 1 | 16/16 | aucun manifeste mêlée dédié |
| JB (jb_tenacious) | Tenacious D | 1 | 16/16 | aucun manifeste mêlée dédié |
| KG (kg_tenacious) | Tenacious D | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lee Superfan (lee_tenacious) | Tenacious D | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gemma (gemma_m3gan) | M3GAN | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cady (cady_m3gan) | M3GAN | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bruce Robot (bruce_robot) | M3GAN | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jean-Claude Convenant (jean_claude_camera) | Camera Cafe | 1 | 16/16 | aucun manifeste mêlée dédié |
| Herve Dumont (herve_camera) | Camera Cafe | 1 | 16/16 | aucun manifeste mêlée dédié |
| Maeva Capucin (maeva_camera) | Camera Cafe | 1 | 16/16 | aucun manifeste mêlée dédié |
| Samantha (samantha_oups) | Samantha Oups! | 1 | 16/16 | aucun manifeste mêlée dédié |
| Chantal (chantal_oups) | Samantha Oups! | 1 | 16/16 | aucun manifeste mêlée dédié |
| Voisine Oups (voisine_oups) | Samantha Oups! | 1 | 16/16 | aucun manifeste mêlée dédié |
| Agent Municipal (municipal_agent_fiel) | Les Chevaliers du Fiel | 1 | 16/16 | aucun manifeste mêlée dédié |
| Brigadier Municipal (brigadier_fiel) | Les Chevaliers du Fiel | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mairie Clerk (mairie_fiel) | Les Chevaliers du Fiel | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mado la Nicoise (mado_perna) | Noelle Perna | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cafe de Nice Regular (cafe_nice_regular) | Noelle Perna | 1 | 16/16 | aucun manifeste mêlée dédié |
| Theater Stagehand (theater_stagehand) | Noelle Perna | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ray Ferrier (ray_wotw) | War of the Worlds | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rachel Ferrier (rachel_wotw) | War of the Worlds | 1 | 16/16 | aucun manifeste mêlée dédié |
| Robbie Ferrier (robbie_wotw) | War of the Worlds | 1 | 16/16 | aucun manifeste mêlée dédié |
| Peter Venkman (venkman_gb) | Ghostbusters | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ray Stantz (stantz_gb) | Ghostbusters | 1 | 16/16 | aucun manifeste mêlée dédié |
| Winston Zeddemore (zeddemore_gb) | Ghostbusters | 1 | 16/16 | aucun manifeste mêlée dédié |
| Egon Spengler (spengler_gb) | Ghostbusters | 1 | 16/16 | aucun manifeste mêlée dédié |
| Janine Melnitz (janine_gb) | Ghostbusters | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dana Barrett (dana_barrett_gb) | Ghostbusters | 1 | 16/16 | aucun manifeste mêlée dédié |
| Louis Tully (louis_tully_gb) | Ghostbusters | 1 | 16/16 | aucun manifeste mêlée dédié |
| Aya (aya_onechanbara) | Onechanbara | 1 | 16/16 | aucun manifeste mêlée dédié |
| Saki (saki_onechanbara) | Onechanbara | 1 | 16/16 | aucun manifeste mêlée dédié |
| Reiko (reiko_onechanbara) | Onechanbara | 1 | 16/16 | aucun manifeste mêlée dédié |
| The Chosen One (chosen_one_kungpow) | Kung Pow | 1 | 16/16 | aucun manifeste mêlée dédié |
| Master Tang (woah_kungpow) | Kung Pow | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ling (ling_kungpow) | Kung Pow | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gordon Hauge (gordon_despiser) | Despicer | 1 | 16/16 | aucun manifeste mêlée dédié |
| Maggie (maggie_despiser) | Despicer | 1 | 16/16 | aucun manifeste mêlée dédié |
| Afterlife Guard (afterlife_guard) | Despicer | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sol (sol_howmonster) | How to Make a Monster | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bug (bug_howmonster) | How to Make a Monster | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hardcore (hardcore_howmonster) | How to Make a Monster | 1 | 16/16 | aucun manifeste mêlée dédié |
| Shilo Wallace (shilo_repo) | Repo! The Genetic Opera | 1 | 16/16 | aucun manifeste mêlée dédié |
| Repo Man (repo_man) | Repo! The Genetic Opera | 1 | 16/16 | aucun manifeste mêlée dédié |
| Blind Mag (blind_mag) | Repo! The Genetic Opera | 1 | 16/16 | aucun manifeste mêlée dédié |
| Valentine McKee (val_tremors) | Tremors | 1 | 16/16 | aucun manifeste mêlée dédié |
| Earl Bassett (earl_tremors) | Tremors | 1 | 16/16 | aucun manifeste mêlée dédié |
| Burt Gummer (burt_tremors) | Tremors | 1 | 16/16 | aucun manifeste mêlée dédié |
| Elvira (elvira_mistress) | Elvira | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gonk Familiar (gonk_elvira) | Elvira | 1 | 16/16 | aucun manifeste mêlée dédié |
| Macabre Handyman (mansion_handyman) | Elvira | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jarrod (jarrod_skyline) | Skyline | 1 | 16/16 | aucun manifeste mêlée dédié |
| Elaine (elaine_skyline) | Skyline | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rose Corley (rose_skyline) | Skyline | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rachel Keller (rachel_ring) | The Ring | 1 | 16/16 | aucun manifeste mêlée dédié |
| Aidan Keller (aiden_ring) | The Ring | 1 | 16/16 | aucun manifeste mêlée dédié |
| Noah Clay (noah_ring) | The Ring | 1 | 16/16 | aucun manifeste mêlée dédié |
| Karen Davis (karen_grudge) | The Grudge | 1 | 16/16 | aucun manifeste mêlée dédié |
| Detective Nakagawa (detective_nakagawa) | The Grudge | 1 | 16/16 | aucun manifeste mêlée dédié |
| Aubrey Davis (aubrey_grudge) | The Grudge | 1 | 16/16 | aucun manifeste mêlée dédié |
| Julie (julie_hm2000) | Heavy Metal 2000 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Odin (odin_hm2000) | Heavy Metal 2000 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Zeek (zeek_hm2000) | Heavy Metal 2000 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Wilbur Finletter (wilbur_tomatoes) | Killer Tomatoes from Outer Space | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tara Boumdeay (tara_tomatoes) | Killer Tomatoes from Outer Space | 1 | 16/16 | aucun manifeste mêlée dédié |
| F.T. (ft_tomato) | Killer Tomatoes from Outer Space | 1 | 16/16 | aucun manifeste mêlée dédié |
| Commander Joseph A. “Joe” Hendricksson (hendricksson_screamers) | Planete Hurlante | 1 | 16/16 | aucun manifeste mêlée dédié |
| Private Michael “Ace” Jefferson (ace_screamers) | Planete Hurlante | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jessica Hanson (jessica_screamers) | Planete Hurlante | 1 | 16/16 | aucun manifeste mêlée dédié |
| Fin Shepard (fin_sharknado) | Sharknado | 1 | 16/16 | aucun manifeste mêlée dédié |
| April Wexler (april_sharknado) | Sharknado | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nova Clarke (nova_sharknado) | Sharknado | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nick Tatopoulos (nick_tatopoulos_tas) | Godzilla The Animated Series | 1 | 16/16 | aucun manifeste mêlée dédié |
| Elsie Chapman (elsie_chapman_tas) | Godzilla The Animated Series | 1 | 16/16 | aucun manifeste mêlée dédié |
| Godzilla Junior (godzilla_jr_tas) | Godzilla The Animated Series | 1 | 16/16 | aucun manifeste mêlée dédié |
| Pee-wee Herman (peewee_herman) | Pee-wee | 1 | 16/16 | aucun manifeste mêlée dédié |
| Chairry (chairry_playhouse) | Pee-wee | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cowboy Curtis (cowboy_curtis) | Pee-wee | 1 | 16/16 | aucun manifeste mêlée dédié |
| Malcolm (malcolm_wilkerson) | Malcolm in the Middle | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lois (lois_malcolm) | Malcolm in the Middle | 1 | 16/16 | aucun manifeste mêlée dédié |
| Reese (reese_malcolm) | Malcolm in the Middle | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tanya Degurechaff (tanya_degurechaff) | Tanya the Evil | 1 | 16/16 | aucun manifeste mêlée dédié |
| Viktoriya Serebryakov (viktoriya_serebryakov) | Tanya the Evil | 1 | 16/16 | aucun manifeste mêlée dédié |
| Weiss (weiss_203rd) | Tanya the Evil | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kit Foster (kit_foster_virus) | Virus | 1 | 16/16 | aucun manifeste mêlée dédié |
| Steve Baker (steve_baker_virus) | Virus | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nadia Vinogradova (nadia_virus) | Virus | 1 | 16/16 | aucun manifeste mêlée dédié |
| Thomas Rogan (thomas_rogan_hotd) | House of the Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Agent G (g_hotd) | House of the Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sophie Richards (sophie_hotd) | House of the Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| James Taylor (james_taylor_hotd2) | House of the Dead 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gary Stewart (gary_stewart_hotd2) | House of the Dead 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Amy Crystal (amy_crystal_hotd2) | House of the Dead 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lisa Rogan (lisa_rogan_hotd3) | House of the Dead 3 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Agent G Veteran (g_hotd3) | House of the Dead 3 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dan Taylor (dan_taylor_hotd3) | House of the Dead 3 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tin Commander (tin_commander) | Toy Soldiers | 1 | 16/16 | aucun manifeste mêlée dédié |
| Plastic Gunner (plastic_gunner) | Toy Soldiers | 1 | 16/16 | aucun manifeste mêlée dédié |
| Wind-Up Sapper (windup_sapper) | Toy Soldiers | 1 | 16/16 | aucun manifeste mêlée dédié |
| Shaun (shaun_sotd) | Shaun of the Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ed (ed_sotd) | Shaun of the Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Liz (liz_sotd) | Shaun of the Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Blade (blade_puppet) | Puppet Master | 1 | 16/16 | aucun manifeste mêlée dédié |
| Pinhead (pinhead_puppet) | Puppet Master | 1 | 16/16 | aucun manifeste mêlée dédié |
| Six Shooter (six_shooter_puppet) | Puppet Master | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ginger (ginger_chickenrun) | Chicken Run | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rocky Rhodes (rocky_chickenrun) | Chicken Run | 1 | 16/16 | aucun manifeste mêlée dédié |
| Fowler (fowler_chickenrun) | Chicken Run | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mei Misaki (mei_misaki) | Another | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kouichi Sakakibara (kouichi_sakakibara) | Another | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tatsuji Chibiki (tatsuji_chibiki) | Another | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gally (gally_gunnm) | Gunnm | 1 | 16/16 | aucun manifeste mêlée dédié |
| Daisuke Ido (ido_gunnm) | Gunnm | 1 | 16/16 | aucun manifeste mêlée dédié |
| Yugo (yugo_gunnm) | Gunnm | 1 | 16/16 | aucun manifeste mêlée dédié |
| Shuya Nanahara (shuya_nanahara) | Battle Royale | 1 | 16/16 | aucun manifeste mêlée dédié |
| Noriko Nakagawa (noriko_nakagawa) | Battle Royale | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kazuo Kiriyama (kazuo_kiriyama) | Battle Royale | 1 | 16/16 | aucun manifeste mêlée dédié |
| Spawn (al_simmons_spawn) | Spawn | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cogliostro (cogliostro_spawn) | Spawn | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sam and Twitch (sam_twitch_spawn) | Spawn | 1 | 16/16 | aucun manifeste mêlée dédié |
| Pingu (pingu) | Pingu | 1 | 16/16 | aucun manifeste mêlée dédié |
| Pinga (pinga) | Pingu | 1 | 16/16 | aucun manifeste mêlée dédié |
| Roby (roby_pingu) | Pingu | 1 | 16/16 | aucun manifeste mêlée dédié |
| Chester Echo (chester_lp) | Linkin Park | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mike Signal (mike_lp) | Linkin Park | 1 | 16/16 | aucun manifeste mêlée dédié |
| Turntable Operator (mr_hahn_lp) | Linkin Park | 1 | 16/16 | aucun manifeste mêlée dédié |
| Moonwalker (moonwalker_hero) | Moonwalker | 1 | 16/16 | aucun manifeste mêlée dédié |
| Annie (annie_moonwalker) | Moonwalker | 1 | 16/16 | aucun manifeste mêlée dédié |
| Club Dancer (club_dancer_moonwalker) | Moonwalker | 1 | 16/16 | aucun manifeste mêlée dédié |
| King of Pop Avatar (mj_performer) | Michael Jackson | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rhythm Guard (rhythm_guard_mj) | Michael Jackson | 1 | 16/16 | aucun manifeste mêlée dédié |
| Stage Light Tech (stage_light_mj) | Michael Jackson | 1 | 16/16 | aucun manifeste mêlée dédié |
| R.J. MacReady (macready_thing) | The Thing | 1 | 16/16 | aucun manifeste mêlée dédié |
| Childs (childs_thing) | The Thing | 1 | 16/16 | aucun manifeste mêlée dédié |
| Blair (blair_thing) | The Thing | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ash Williams (ash_williams) | Evil Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Annie Knowby (annie_knowby) | Evil Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Henry the Red (henry_red_ed) | Evil Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Pablo Bolivar (pablo_evil_dead) | Evil Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kelly Maxwell (kelly_evil_dead) | Evil Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ruby Knowby (ruby_evil_dead) | Evil Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ninja (ninja_da) | Die Antwoord | 1 | 16/16 | aucun manifeste mêlée dédié |
| Yo-Landi (yolandi_da) | Die Antwoord | 1 | 16/16 | aucun manifeste mêlée dédié |
| DJ Hi-Tek (dj_hi_tek_da) | Die Antwoord | 1 | 16/16 | aucun manifeste mêlée dédié |
| Chappie (chappie_ai) | Chappie | 1 | 16/16 | aucun manifeste mêlée dédié |
| Deon Wilson (deon_chappie) | Chappie | 1 | 16/16 | aucun manifeste mêlée dédié |
| Yolandi (yolandi_chappie) | Chappie | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gizmo (gizmo_gremlins) | Gremlins | 1 | 16/16 | aucun manifeste mêlée dédié |
| Billy Peltzer (billy_peltzer) | Gremlins | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kate Beringer (kate_gremlins) | Gremlins | 1 | 16/16 | aucun manifeste mêlée dédié |
| Frank-N-Furter (frank_n_furter) | Rocky Horror Picture Show | 1 | 16/16 | aucun manifeste mêlée dédié |
| Janet Weiss (janet_rhps) | Rocky Horror Picture Show | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rocky Horror (rocky_rhps) | Rocky Horror Picture Show | 1 | 16/16 | aucun manifeste mêlée dédié |
| Pascal Legitimus (inconnus_trio) | Les Inconnus | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bernard Campan (bernard_inconnus) | Les Inconnus | 1 | 16/16 | aucun manifeste mêlée dédié |
| Didier Bourdon (didier_inconnus) | Les Inconnus | 1 | 16/16 | aucun manifeste mêlée dédié |
| Pierre - Chef des Cheveux Propres (pierre_rrr) | RRRrrrr!!! | 1 | 16/16 | aucun manifeste mêlée dédié |
| Guy (guy_rrr) | RRRrrrr!!! | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tonton - Chef des Cheveux Sales (chef_cheveux_sales) | RRRrrrr!!! | 1 | 16/16 | aucun manifeste mêlée dédié |
| Odile Deray (odile_deray) | La Cite de la Peur | 1 | 16/16 | aucun manifeste mêlée dédié |
| Simon Jeremi (simon_jeremi) | La Cite de la Peur | 1 | 16/16 | aucun manifeste mêlée dédié |
| Serge Karamazov (serge_karamazov) | La Cite de la Peur | 1 | 16/16 | aucun manifeste mêlée dédié |
| Joshua Nolan (nolan_defiance) | Defiance | 1 | 16/16 | aucun manifeste mêlée dédié |
| Irisa (irisa_defiance) | Defiance | 1 | 16/16 | aucun manifeste mêlée dédié |
| Datak Tarr (datak_tarr) | Defiance | 1 | 16/16 | aucun manifeste mêlée dédié |
| Byron Williams (byron_mars) | Mars Attacks | 1 | 16/16 | aucun manifeste mêlée dédié |
| Richie Norris (ritchie_mars) | Mars Attacks | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nathalie Lake (nathalie_mars) | Mars Attacks | 1 | 16/16 | aucun manifeste mêlée dédié |
| Momo Ayase (momo_ayase) | Dandadan | 1 | 16/16 | aucun manifeste mêlée dédié |
| Okarun (oken_dandadan) | Dandadan | 1 | 16/16 | aucun manifeste mêlée dédié |
| Aira Shiratori (aira_dandadan) | Dandadan | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jiji (jiji_dandadan) | Dandadan | 1 | 16/16 | aucun manifeste mêlée dédié |
| Seiko Ayase (seiko_dandadan) | Dandadan | 1 | 16/16 | aucun manifeste mêlée dédié |
| Turbo Granny - Maneki-neko (turbo_granny_cat) | Dandadan | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ogami Itto (ogami_itto) | Baby Cart | 1 | 16/16 | aucun manifeste mêlée dédié |
| Daigoro (daigoro_babycart) | Baby Cart | 1 | 16/16 | aucun manifeste mêlée dédié |
| Roadside Assassin (azami_assassin) | Baby Cart | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rob Hawkins (rob_cloverfield) | Cloverfield | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hud Platt (hud_cloverfield) | Cloverfield | 1 | 16/16 | aucun manifeste mêlée dédié |
| Marlena Diamond (marlena_cloverfield) | Cloverfield | 1 | 16/16 | aucun manifeste mêlée dédié |
| Arkin (arkin_collector) | The Collector | 1 | 16/16 | aucun manifeste mêlée dédié |
| Elena Peters (elena_collector) | The Collector | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lucello (lucello_collector) | The Collector | 1 | 16/16 | aucun manifeste mêlée dédié |
| Arthur Dent (arthur_dent_h2g2) | H2G2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ford Prefect (ford_prefect) | H2G2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Trillian (trillian_h2g2) | H2G2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jeff Tuche (jeff_tuche) | Les Tuche | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cathy Tuche (cathy_tuche) | Les Tuche | 1 | 16/16 | aucun manifeste mêlée dédié |
| Coin-Coin (coincoin_tuche) | Les Tuche | 1 | 16/16 | aucun manifeste mêlée dédié |
| Renate Richter (renate_ironsky) | Iron Sky | 1 | 16/16 | aucun manifeste mêlée dédié |
| James Washington (james_ironsky) | Iron Sky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sasha (sasha_ironsky) | Iron Sky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Angela Vidal (angela_vidal) | REC | 1 | 16/16 | aucun manifeste mêlée dédié |
| Manu (manu_rec) | REC | 1 | 16/16 | aucun manifeste mêlée dédié |
| Pablo Camera (pablo_rec) | REC | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ellison Oswalt (ellison_sinister) | Sinister | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tracy Oswalt (tracy_sinister) | Sinister | 1 | 16/16 | aucun manifeste mêlée dédié |
| Deputy So-and-So (deputy_so_and_so) | Sinister | 1 | 16/16 | aucun manifeste mêlée dédié |
| Godefroy de Montmirail (godefroy_visiteurs) | Les Visiteurs | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jacquouille la Fripouille (jacquouille) | Les Visiteurs | 1 | 16/16 | aucun manifeste mêlée dédié |
| Beatrice (beatrice_visiteurs) | Les Visiteurs | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kazaam (kazaam_genie) | Kazaam | 1 | 16/16 | aucun manifeste mêlée dédié |
| Max Connor (max_kazaam) | Kazaam | 1 | 16/16 | aucun manifeste mêlée dédié |
| Malik (malik_kazaam) | Kazaam | 1 | 16/16 | aucun manifeste mêlée dédié |
| Chihiro (chihiro_ogino) | Voyage de Chihiro | 1 | 16/16 | aucun manifeste mêlée dédié |
| Haku (haku_spirited) | Voyage de Chihiro | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lin (lin_spirited) | Voyage de Chihiro | 1 | 16/16 | aucun manifeste mêlée dédié |
| Heidi (heidi_feebles) | Meet the Feebles | 1 | 16/16 | aucun manifeste mêlée dédié |
| Wynyard (wynyard_feebles) | Meet the Feebles | 1 | 16/16 | aucun manifeste mêlée dédié |
| Robert (robert_feebles) | Meet the Feebles | 1 | 16/16 | aucun manifeste mêlée dédié |
| Roger Rabbit (roger_rabbit) | Roger Rabbit | 1 | 16/16 | aucun manifeste mêlée dédié |
| Eddie Valiant (eddie_valiant) | Roger Rabbit | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jessica Rabbit (jessica_rabbit) | Roger Rabbit | 1 | 16/16 | aucun manifeste mêlée dédié |
| Johnny Rico (starship_troopers_1997_johnny_rico) | Starship Troopers | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dizzy Flores (starship_troopers_1997_dizzy_flores) | Starship Troopers | 1 | 16/16 | aucun manifeste mêlée dédié |
| Carmen Ibanez (starship_troopers_1997_carmen_ibanez) | Starship Troopers | 1 | 16/16 | aucun manifeste mêlée dédié |
| Leito (leito_b13) | Banlieue 13 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Damien Tomaso (damien_b13) | Banlieue 13 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lola (lola_b13) | Banlieue 13 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Baby Firefly (baby_firefly) | House of 1000 Corpses | 1 | 16/16 | aucun manifeste mêlée dédié |
| Otis Driftwood (otis_driftwood) | House of 1000 Corpses | 1 | 16/16 | aucun manifeste mêlée dédié |
| Captain Spaulding (captain_spaulding) | House of 1000 Corpses | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ainz Ooal Gown (ainz_overlord) | Overlord Anime | 1 | 16/16 | aucun manifeste mêlée dédié |
| Albedo (albedo_overlord) | Overlord Anime | 1 | 16/16 | aucun manifeste mêlée dédié |
| Demiurge (demiurge_overlord) | Overlord Anime | 1 | 16/16 | aucun manifeste mêlée dédié |
| MTF Epsilon-11 Operative (mtf_commander_scp) | SCP Foundation | 1 | 16/16 | aucun manifeste mêlée dédié |
| Foundation Researcher (researcher_scp) | SCP Foundation | 1 | 16/16 | aucun manifeste mêlée dédié |
| SCP-999 (scp_999_echo) | SCP Foundation | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cendar (Ashtray) (spoof_survivor) | Spoof Movie | 1 | 16/16 | aucun manifeste mêlée dédié |
| Loc Dog (parody_detective) | Spoof Movie | 1 | 16/16 | aucun manifeste mêlée dédié |
| Preach (slapstick_fighter) | Spoof Movie | 1 | 16/16 | aucun manifeste mêlée dédié |
| Raiden (raiden_mgr) | Metal Gear Rising | 1 | 16/16 | aucun manifeste mêlée dédié |
| Blade Wolf (blade_wolf_mgr) | Metal Gear Rising | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jetstream Sam (jetstream_sam) | Metal Gear Rising | 1 | 16/16 | aucun manifeste mêlée dédié |
| Senator Armstrong (armstrong_mgr) | Metal Gear Rising | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mistral (mistral_mgr) | Metal Gear Rising | 1 | 16/16 | aucun manifeste mêlée dédié |
| Monsoon (monsoon_mgr) | Metal Gear Rising | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jack (bioshock_rapture_jack) | BioShock | 1 | 16/16 | aucun manifeste mêlée dédié |
| Brigid Tenenbaum (bioshock_rapture_tenenbaum) | BioShock | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bouncer Big Daddy (bioshock_rapture_bouncer) | BioShock | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sweet Tooth (sweet_tooth_tm) | Twisted Metal | 1 | 16/16 | aucun manifeste mêlée dédié |
| Outlaw (outlaw_tm) | Twisted Metal | 1 | 16/16 | aucun manifeste mêlée dédié |
| Roadkill (roadkill_tm) | Twisted Metal | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cybernetic Spider (Dr. Michael Kelly) (cyber_spider_kelly) | Spider: The Video Game | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cybernetic Spider - Flamethrower Loadout (cyber_spider_flamethrower) | Spider: The Video Game | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cybernetic Spider - Electro-Beam Loadout (cyber_spider_electro_beam) | Spider: The Video Game | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tomba (tomba_hero) | Tomba | 1 | 16/16 | aucun manifeste mêlée dédié |
| Charles (charles_tomba) | Tomba | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tabby (tabby_tomba) | Tomba | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cloud Strife (cloud_ff7) | Final Fantasy VII | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tifa Lockhart (tifa_ff7) | Final Fantasy VII | 1 | 16/16 | aucun manifeste mêlée dédié |
| Aerith Gainsborough (aerith_ff7) | Final Fantasy VII | 1 | 16/16 | aucun manifeste mêlée dédié |
| Barret Wallace (barret_ff7) | Final Fantasy VII | 1 | 16/16 | aucun manifeste mêlée dédié |
| Red XIII (redxiii_ff7) | Final Fantasy VII | 1 | 16/16 | aucun manifeste mêlée dédié |
| Yuffie Kisaragi (yuffie_ff7) | Final Fantasy VII | 1 | 16/16 | aucun manifeste mêlée dédié |
| Vincent Valentine (vincent_ff7) | Final Fantasy VII | 1 | 16/16 | aucun manifeste mêlée dédié |
| Squall Leonhart (squall_ff8) | Final Fantasy VIII | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rinoa Heartilly (rinoa_ff8) | Final Fantasy VIII | 1 | 16/16 | aucun manifeste mêlée dédié |
| Quistis Trepe (quistis_ff8) | Final Fantasy VIII | 1 | 16/16 | aucun manifeste mêlée dédié |
| Seifer Almasy (seifer_ff8) | Final Fantasy VIII | 1 | 16/16 | aucun manifeste mêlée dédié |
| Laguna Loire (laguna_ff8) | Final Fantasy VIII | 1 | 16/16 | aucun manifeste mêlée dédié |
| Zell Dincht (zell_ff8) | Final Fantasy VIII | 1 | 16/16 | aucun manifeste mêlée dédié |
| Selphie Tilmitt (selphie_ff8) | Final Fantasy VIII | 1 | 16/16 | aucun manifeste mêlée dédié |
| Irvine Kinneas (irvine_ff8) | Final Fantasy VIII | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lightning (lightning_ff13) | Final Fantasy XIII | 1 | 16/16 | aucun manifeste mêlée dédié |
| Fang (fang_ff13) | Final Fantasy XIII | 1 | 16/16 | aucun manifeste mêlée dédié |
| Vanille (vanille_ff13) | Final Fantasy XIII | 1 | 16/16 | aucun manifeste mêlée dédié |
| Snow Villiers (snow_ff13) | Final Fantasy XIII | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sazh Katzroy (sazh_ff13) | Final Fantasy XIII | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hope Estheim (hope_ff13) | Final Fantasy XIII | 1 | 16/16 | aucun manifeste mêlée dédié |
| Noctis Lucis Caelum (noctis_ff15) | Final Fantasy XV | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gladiolus (gladiolus_ff15) | Final Fantasy XV | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ignis (ignis_ff15) | Final Fantasy XV | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lunafreya (lunafreya_ff15) | Final Fantasy XV | 1 | 16/16 | aucun manifeste mêlée dédié |
| Prompto Argentum (prompto_ff15) | Final Fantasy XV | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ardyn Izunia (ardyn_ff15) | Final Fantasy XV | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cor Leonis (cor_ff15) | Final Fantasy XV | 1 | 16/16 | aucun manifeste mêlée dédié |
| Crash Bandicoot (crash_bandicoot) | Crash Bandicoot | 1 | 16/16 | aucun manifeste mêlée dédié |
| Coco Bandicoot (coco_bandicoot) | Crash Bandicoot | 1 | 16/16 | aucun manifeste mêlée dédié |
| Aku Aku (aku_aku) | Crash Bandicoot | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lara Croft (lara_croft_tr) | Tomb Raider | 1 | 16/16 | aucun manifeste mêlée dédié |
| Winston (winston_tr) | Tomb Raider | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jonah Maiava (jonah_tr) | Tomb Raider | 1 | 16/16 | aucun manifeste mêlée dédié |
| Yoshimitsu (yoshimitsu_tekken) | Tekken | 1 | 16/16 | aucun manifeste mêlée dédié |
| True Ogre (true_ogre_tekken) | Tekken | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gon (gon_tekken) | Tekken | 1 | 16/16 | aucun manifeste mêlée dédié |
| Spyro (spyro_spyro) | Spyro | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sparx (spyro_sparx) | Spyro | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hunter (spyro_hunter) | Spyro | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rayman (rayman_rayman) | Rayman | 1 | 16/16 | aucun manifeste mêlée dédié |
| Globox (rayman_globox) | Rayman | 1 | 16/16 | aucun manifeste mêlée dédié |
| Barbara (rayman_barbara) | Rayman | 1 | 16/16 | aucun manifeste mêlée dédié |
| Croc (croc_hero) | Croc | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gobbo Chief (gobbo_chief) | Croc | 1 | 16/16 | aucun manifeste mêlée dédié |
| Beany Bird (beany_bird) | Croc | 1 | 16/16 | aucun manifeste mêlée dédié |
| Aya Brea (aya_brea) | Parasite Eve | 1 | 16/16 | aucun manifeste mêlée dédié |
| Daniel Dollis (daniel_dollis) | Parasite Eve | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kunihiko Maeda (maeda_pe) | Parasite Eve | 1 | 16/16 | aucun manifeste mêlée dédié |
| Abe - possession (oddworld_abe_possession) | Oddworld | 1 | 16/16 | aucun manifeste mêlée dédié |
| Munch - telecommande (oddworld_munch_telecommande) | Oddworld | 1 | 16/16 | aucun manifeste mêlée dédié |
| Stranger - Live Ammo (oddworld_stranger_live_ammo) | Oddworld | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kain (legacy_of_kain_kain) | Legacy of Kain | 1 | 16/16 | aucun manifeste mêlée dédié |
| Raziel (legacy_of_kain_raziel) | Legacy of Kain | 1 | 16/16 | aucun manifeste mêlée dédié |
| Vorador (legacy_of_kain_vorador) | Legacy of Kain | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tommy Pickles (tommy_pickles) | Rugrats | 1 | 16/16 | aucun manifeste mêlée dédié |
| Chuckie Finster (chuckie_finster) | Rugrats | 1 | 16/16 | aucun manifeste mêlée dédié |
| Angelica Pickles (angelica_pickles) | Rugrats | 1 | 16/16 | aucun manifeste mêlée dédié |
| Guitar Hero (guitar_hero_avatar) | Guitar Hero | 1 | 16/16 | aucun manifeste mêlée dédié |
| Judy Nails (judy_nails) | Guitar Hero | 1 | 16/16 | aucun manifeste mêlée dédié |
| Axel Steel (axel_steel) | Guitar Hero | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bean (bean_disenchantment) | Disenchantment | 1 | 16/16 | aucun manifeste mêlée dédié |
| Elfo (elfo_disenchantment) | Disenchantment | 1 | 16/16 | aucun manifeste mêlée dédié |
| Luci (luci_disenchantment) | Disenchantment | 1 | 16/16 | aucun manifeste mêlée dédié |
| Homer Simpson (homer_simpson) | The Simpsons | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bart Simpson (bart_simpson) | The Simpsons | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lisa Simpson (lisa_simpson) | The Simpsons | 1 | 16/16 | aucun manifeste mêlée dédié |
| Marge Simpson (marge_simpsons) | The Simpsons | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lisa Simpson (lisa_simpsons) | The Simpsons | 1 | 16/16 | aucun manifeste mêlée dédié |
| Maggie Simpson (maggie_simpsons) | The Simpsons | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ned Flanders (ned_flanders) | The Simpsons | 1 | 16/16 | aucun manifeste mêlée dédié |
| Philip J. Fry (fry_futurama) | Futurama | 1 | 16/16 | aucun manifeste mêlée dédié |
| Leela (leela_futurama) | Futurama | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bender (bender_futurama) | Futurama | 1 | 16/16 | aucun manifeste mêlée dédié |
| Amy Wong (amy_futurama) | Futurama | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hermes Conrad (hermes_futurama) | Futurama | 1 | 16/16 | aucun manifeste mêlée dédié |
| Zoidberg (zoidberg_futurama) | Futurama | 1 | 16/16 | aucun manifeste mêlée dédié |
| Maury the Hormone Monster (maury_hm) | Big Mouth | 1 | 16/16 | aucun manifeste mêlée dédié |
| Connie the Hormone Monstress (connie_hm) | Big Mouth | 1 | 16/16 | aucun manifeste mêlée dédié |
| Shame Wizard (shame_wizard_hm) | Big Mouth | 1 | 16/16 | aucun manifeste mêlée dédié |
| Peter Griffin (peter_griffin) | Family Guy | 1 | 16/16 | aucun manifeste mêlée dédié |
| Stewie Griffin (stewie_griffin) | Family Guy | 1 | 16/16 | aucun manifeste mêlée dédié |
| Brian Griffin (brian_griffin) | Family Guy | 1 | 16/16 | aucun manifeste mêlée dédié |
| Stan Smith (stan_smith) | American Dad | 1 | 16/16 | aucun manifeste mêlée dédié |
| Roger (roger_alien) | American Dad | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hayley Smith (hayley_smith) | American Dad | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sev (sev_killzone) | Killzone | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rico (rico_killzone) | Killzone | 1 | 16/16 | aucun manifeste mêlée dédié |
| Echo (echo_killzone) | Killzone | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kazuma Kiryu (kiryu_yakuza) | Yakuza | 1 | 16/16 | aucun manifeste mêlée dédié |
| Goro Majima (majima_yakuza) | Yakuza | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ichiban Kasuga (ichiban_yakuza) | Yakuza | 1 | 16/16 | aucun manifeste mêlée dédié |
| Taiga Saejima (saejima_yakuza) | Yakuza | 1 | 16/16 | aucun manifeste mêlée dédié |
| Shun Akiyama (akiyama_yakuza) | Yakuza | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nightmare (nightmare_sc) | Soul Calibur | 1 | 16/16 | aucun manifeste mêlée dédié |
| Siegfried (siegfried_sc) | Soul Calibur | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ivy (ivy_sc) | Soul Calibur | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ellie (ellie_tlou) | The Last of Us | 1 | 16/16 | aucun manifeste mêlée dédié |
| Joel (joel_tlou) | The Last of Us | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tess (tess_tlou) | The Last of Us | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tommy Miller (tommy_tlou) | The Last of Us | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dina (dina_tlou2) | The Last of Us | 1 | 16/16 | aucun manifeste mêlée dédié |
| Abby Anderson (abby_tlou2) | The Last of Us | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sackboy (sackboy_lbp) | LittleBigPlanet | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sackgirl (sackgirl_lbp) | LittleBigPlanet | 1 | 16/16 | aucun manifeste mêlée dédié |
| Toggle (toggle_lbp) | LittleBigPlanet | 1 | 16/16 | aucun manifeste mêlée dédié |
| SAS Operator (counter_strike_sas) | Counter-Strike | 1 | 16/16 | aucun manifeste mêlée dédié |
| GIGN Operator (counter_strike_gign) | Counter-Strike | 1 | 16/16 | aucun manifeste mêlée dédié |
| FBI HRT Operator (counter_strike_fbi) | Counter-Strike | 1 | 16/16 | aucun manifeste mêlée dédié |
| Zoey (zoey_l4d) | Left 4 Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bill (bill_l4d) | Left 4 Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ellis (ellis_l4d) | Left 4 Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Coach (coach_l4d) | Left 4 Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rochelle (rochelle_l4d) | Left 4 Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nick (nick_l4d) | Left 4 Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Scout (team_fortress_2_scout) | Team Fortress 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Soldier (team_fortress_2_soldier) | Team Fortress 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Medic (team_fortress_2_medic) | Team Fortress 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Snow Pirate Gunner (lost_planet_2_snow_pirate_gunner) | Lost Planet 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jungle Pirate Scout (lost_planet_2_jungle_pirate_scout) | Lost Planet 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ex-NEVEC Defector (lost_planet_2_ex_nevec_defector) | Lost Planet 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Seaman (seaman_oracle) | Seaman | 1 | 16/16 | aucun manifeste mêlée dédié |
| Aquarium Keeper (aquarium_keeper) | Seaman | 1 | 16/16 | aucun manifeste mêlée dédié |
| Frogman Echo (frogman_seaman) | Seaman | 1 | 16/16 | aucun manifeste mêlée dédié |
| Beat - casque vert (jet_set_radio_beat_casque_vert) | Jet Set Radio | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gum - tenue verte (jet_set_radio_gum_tenue_verte) | Jet Set Radio | 1 | 16/16 | aucun manifeste mêlée dédié |
| Corn - bonnet et veste (jet_set_radio_corn_bonnet_et_veste) | Jet Set Radio | 1 | 16/16 | aucun manifeste mêlée dédié |
| Duke (dynamite_duke) | Dynamite Duke | 1 | 16/16 | aucun manifeste mêlée dédié |
| Arcade Commando (arcade_commando_duke) | Dynamite Duke | 1 | 16/16 | aucun manifeste mêlée dédié |
| Intel Operator (intel_duke) | Dynamite Duke | 1 | 16/16 | aucun manifeste mêlée dédié |
| Beast Centurion (centurion_ab) | Altered Beast | 1 | 16/16 | aucun manifeste mêlée dédié |
| Werewolf Form (werewolf_ab) | Altered Beast | 1 | 16/16 | aucun manifeste mêlée dédié |
| Zeus Signal (zeus_ab) | Altered Beast | 1 | 16/16 | aucun manifeste mêlée dédié |
| Axel Stone (axel_sor) | Streets of Rage | 1 | 16/16 | aucun manifeste mêlée dédié |
| Blaze Fielding (blaze_sor) | Streets of Rage | 1 | 16/16 | aucun manifeste mêlée dédié |
| Adam Hunter (adam_sor) | Streets of Rage | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cool Spot (cool_spot) | Cool Spot | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bubble Spot (bubble_spot) | Cool Spot | 1 | 16/16 | aucun manifeste mêlée dédié |
| Beach Guard (lifeguard_spot) | Cool Spot | 1 | 16/16 | aucun manifeste mêlée dédié |
| Earthworm Jim (earthworm_jim) | Earthworm Jim | 1 | 16/16 | aucun manifeste mêlée dédié |
| Peter Puppy (peter_puppy) | Earthworm Jim | 1 | 16/16 | aucun manifeste mêlée dédié |
| Princess Whats-Her-Name (princess_whats_her_name) | Earthworm Jim | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ecco (ecco_dolphin) | Ecco the Dolphin | 1 | 16/16 | aucun manifeste mêlée dédié |
| Atlantean Glyph (atlantean_ecco) | Ecco the Dolphin | 1 | 16/16 | aucun manifeste mêlée dédié |
| Orca Echo (orca_echo) | Ecco the Dolphin | 1 | 16/16 | aucun manifeste mêlée dédié |
| Conrad B. Hart (conrad_flashback) | Flashback | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ian (ian_flashback) | Flashback | 1 | 16/16 | aucun manifeste mêlée dédié |
| Resistance Agent (agent_flashback) | Flashback | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ristar (ristar_hero) | Ristar | 1 | 16/16 | aucun manifeste mêlée dédié |
| Star Handle (star_handle) | Ristar | 1 | 16/16 | aucun manifeste mêlée dédié |
| Planet Guardian (planet_guardian_ristar) | Ristar | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rick Taylor (rick_splatterhouse) | Splatterhouse | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jennifer Willis (jennifer_splatterhouse) | Splatterhouse | 1 | 16/16 | aucun manifeste mêlée dédié |
| Terror Mask (terror_mask) | Splatterhouse | 1 | 16/16 | aucun manifeste mêlée dédié |
| Woodruff (woodruff_hero) | Woodruff | 1 | 16/16 | aucun manifeste mêlée dédié |
| Professor Azimuth (professor_azimuth) | Woodruff | 1 | 16/16 | aucun manifeste mêlée dédié |
| Boozook Master (master_boozook) | Woodruff | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cameraman (cameraman_skibidi) | Skibidi | 1 | 16/16 | aucun manifeste mêlée dédié |
| Speakerman (speakerman_skibidi) | Skibidi | 1 | 16/16 | aucun manifeste mêlée dédié |
| TV Man (tvman_skibidi) | Skibidi | 1 | 16/16 | aucun manifeste mêlée dédié |
| Seong Gi-hun (gi_hun_squid) | Squid Game | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sae-byeok (sae_byeok_squid) | Squid Game | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ali Abdul (ali_squid) | Squid Game | 1 | 16/16 | aucun manifeste mêlée dédié |
| The Professor (professor_casa) | La Casa de Papel | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tokyo (tokyo_casa) | La Casa de Papel | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nairobi (nairobi_casa) | La Casa de Papel | 1 | 16/16 | aucun manifeste mêlée dédié |
| Skrillex Avatar (skrillex_avatar) | Skrillex | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bass Rider (bass_rider_skrillex) | Skrillex | 1 | 16/16 | aucun manifeste mêlée dédié |
| Laser DJ (laser_dj_skrillex) | Skrillex | 1 | 16/16 | aucun manifeste mêlée dédié |
| 2-D (2d_gorillaz) | Gorillaz | 1 | 16/16 | aucun manifeste mêlée dédié |
| Noodle (noodle_gorillaz) | Gorillaz | 1 | 16/16 | aucun manifeste mêlée dédié |
| Russel (russel_gorillaz) | Gorillaz | 1 | 16/16 | aucun manifeste mêlée dédié |
| Indila Avatar (indila_avatar) | Indila | 1 | 16/16 | aucun manifeste mêlée dédié |
| Danse Echo (danse_echo) | Indila | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mini World Spirit (mini_world_spirit) | Indila | 1 | 16/16 | aucun manifeste mêlée dédié |
| Guybrush Threepwood (guybrush_threepwood) | Secret of Monkey Island | 1 | 16/16 | aucun manifeste mêlée dédié |
| Elaine Marley (elaine_marley) | Secret of Monkey Island | 1 | 16/16 | aucun manifeste mêlée dédié |
| Stan (stan_monkey) | Secret of Monkey Island | 1 | 16/16 | aucun manifeste mêlée dédié |
| Zeke (zeke_zamn) | Zombies Ate My Neighbors | 1 | 16/16 | aucun manifeste mêlée dédié |
| Julie (julie_zamn) | Zombies Ate My Neighbors | 1 | 16/16 | aucun manifeste mêlée dédié |
| Neighbor Rescue (neighbor_rescue) | Zombies Ate My Neighbors | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jessie Burlingame (jessie_wrongturn) | Wrong Turn | 1 | 16/16 | aucun manifeste mêlée dédié |
| Chris Flynn (chris_wrongturn) | Wrong Turn | 1 | 16/16 | aucun manifeste mêlée dédié |
| Carly (carly_wrongturn) | Wrong Turn | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kyary Avatar (kyary_avatar) | Kyary Pamyu Pamyu | 1 | 16/16 | aucun manifeste mêlée dédié |
| PonPon Dancer (ponpon_dancer) | Kyary Pamyu Pamyu | 1 | 16/16 | aucun manifeste mêlée dédié |
| Fashion Spirit (fashion_spirit_kyary) | Kyary Pamyu Pamyu | 1 | 16/16 | aucun manifeste mêlée dédié |
| Calne Ca (karune_cal_avatar) | Karune Cal | 1 | 16/16 | aucun manifeste mêlée dédié |
| Calcium Endoskeleton (calcium_endoskeleton) | Karune Cal | 1 | 16/16 | aucun manifeste mêlée dédié |
| Chibi Cal-san (chibi_cal_san) | Karune Cal | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sub Urban Avatar (sub_urban_avatar) | Sub Urban | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cradles Echo (cradles_echo) | Sub Urban | 1 | 16/16 | aucun manifeste mêlée dédié |
| Freak Dancer (freak_dancer_sub) | Sub Urban | 1 | 16/16 | aucun manifeste mêlée dédié |
| Billie Avatar (billie_avatar) | Billie Eilish | 1 | 16/16 | aucun manifeste mêlée dédié |
| Neon Shadow (neon_shadow_billie) | Billie Eilish | 1 | 16/16 | aucun manifeste mêlée dédié |
| Whisper Beat (whisper_beat_billie) | Billie Eilish | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bella Avatar (bella_poarch_avatar) | Bella Poarch | 1 | 16/16 | aucun manifeste mêlée dédié |
| Doll Guard (doll_guard_bella) | Bella Poarch | 1 | 16/16 | aucun manifeste mêlée dédié |
| Inferno Dancer (inferno_dancer_bella) | Bella Poarch | 1 | 16/16 | aucun manifeste mêlée dédié |
| Wolfhead Vocalist (mwam_avatar) | Man with a Mission | 1 | 16/16 | aucun manifeste mêlée dédié |
| DJ Santa Monica (dj_santa_monica) | Man with a Mission | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rock Commando (rock_commando_mwam) | Man with a Mission | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rose Stage Avatar (gnr_frontman) | Guns N Roses | 1 | 16/16 | aucun manifeste mêlée dédié |
| Top Hat Guitarist (slash_avatar) | Guns N Roses | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jungle Drummer (jungle_drummer_gnr) | Guns N Roses | 1 | 16/16 | aucun manifeste mêlée dédié |
| Maid Rocker (bandmaid_avatar) | Band-Maid | 1 | 16/16 | aucun manifeste mêlée dédié |
| Guitar Maid (guitar_maid) | Band-Maid | 1 | 16/16 | aucun manifeste mêlée dédié |
| Drum Maid (drum_maid) | Band-Maid | 1 | 16/16 | aucun manifeste mêlée dédié |
| Post-Human Vocalist (bmth_avatar) | Bring Me the Horizon | 1 | 16/16 | aucun manifeste mêlée dédié |
| Amo Signal (amo_signal) | Bring Me the Horizon | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mosh Guard (mosh_guard_bmth) | Bring Me the Horizon | 1 | 16/16 | aucun manifeste mêlée dédié |
| Blackpink Unit (blackpink_avatar) | Blackpink | 1 | 16/16 | aucun manifeste mêlée dédié |
| Pink Venom Dancer (pink_venom_dancer) | Blackpink | 1 | 16/16 | aucun manifeste mêlée dédié |
| Blink Guard (blink_guard) | Blackpink | 1 | 16/16 | aucun manifeste mêlée dédié |
| Montero Avatar (lilnasx_avatar) | Lil Nas X | 1 | 16/16 | aucun manifeste mêlée dédié |
| Star Walkin Echo (star_walkin_echo) | Lil Nas X | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rodeo Guard (rodeo_guard) | Lil Nas X | 1 | 16/16 | aucun manifeste mêlée dédié |
| Slim Shady Avatar (eminem_avatar) | Eminem | 1 | 16/16 | aucun manifeste mêlée dédié |
| Stan Echo (stan_echo) | Eminem | 1 | 16/16 | aucun manifeste mêlée dédié |
| Detroit Cipher (detroit_cipher) | Eminem | 1 | 16/16 | aucun manifeste mêlée dédié |
| Atarashii Unit (atarashii_unit) | Atarashii Gakko | 1 | 16/16 | aucun manifeste mêlée dédié |
| School Dancer (school_dancer_ag) | Atarashii Gakko | 1 | 16/16 | aucun manifeste mêlée dédié |
| Megaphone Signal (megaphone_ag) | Atarashii Gakko | 1 | 16/16 | aucun manifeste mêlée dédié |
| Queen Bee Avatar (queen_bee_avatar) | Queen Bee | 1 | 16/16 | aucun manifeste mêlée dédié |
| Honey Dancer (honey_dancer_qb) | Queen Bee | 1 | 16/16 | aucun manifeste mêlée dédié |
| Velvet Signal (velvet_signal_qb) | Queen Bee | 1 | 16/16 | aucun manifeste mêlée dédié |
| Papa Emeritus (papa_emeritus) | Ghost | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nameless Ghoul (nameless_ghoul) | Ghost | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sister Imperator (sister_imperator) | Ghost | 1 | 16/16 | aucun manifeste mêlée dédié |
| Babymetal Unit (babymetal_unit) | Babymetal | 1 | 16/16 | aucun manifeste mêlée dédié |
| Fox God Signal (fox_god_signal) | Babymetal | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kami Band Guard (kami_band_guard) | Babymetal | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ladybaby Unit (ladybaby_unit) | Ladybaby | 1 | 16/16 | aucun manifeste mêlée dédié |
| Idol Guard (idol_guard_ladybaby) | Ladybaby | 1 | 16/16 | aucun manifeste mêlée dédié |
| Metal Cute Signal (metal_cute_signal) | Ladybaby | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bigflo & Oli (bigflo_oli_unit) | Bigflo & Oli | 1 | 16/16 | aucun manifeste mêlée dédié |
| Toulouse Crowd (toulouse_crowd) | Bigflo & Oli | 1 | 16/16 | aucun manifeste mêlée dédié |
| Verse Guard (verse_guard_bfo) | Bigflo & Oli | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ilya Ilich Prusikin (ilya_prusikin_lb) | Little Big | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sonya Tayurskaya (sonya_tayurskaya_lb) | Little Big | 1 | 16/16 | aucun manifeste mêlée dédié |
| Danny Zuckerman (danny_zuckerman_lb) | Little Big | 1 | 16/16 | aucun manifeste mêlée dédié |
| Viktor Sibrinin (viktor_sibrinin_lb) | Little Big | 1 | 16/16 | aucun manifeste mêlée dédié |
| After Hours Avatar (weeknd_avatar) | The Weeknd | 1 | 16/16 | aucun manifeste mêlée dédié |
| Neon Driver (neon_driver_weeknd) | The Weeknd | 1 | 16/16 | aucun manifeste mêlée dédié |
| Starboy Echo (starboy_echo) | The Weeknd | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hoshi Avatar (hoshi_avatar) | Hoshi | 1 | 16/16 | aucun manifeste mêlée dédié |
| Parapluie Echo (parapluie_echo) | Hoshi | 1 | 16/16 | aucun manifeste mêlée dédié |
| Coeur Guard (coeur_guard_hoshi) | Hoshi | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ado Avatar (ado_avatar) | Ado | 1 | 16/16 | aucun manifeste mêlée dédié |
| Uta Echo (uta_echo_ado) | Ado | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rebellion Dancer (rebellion_dancer_ado) | Ado | 1 | 16/16 | aucun manifeste mêlée dédié |
| TANAKA (asmrz_avatar) | ASMRZ | 1 | 16/16 | aucun manifeste mêlée dédié |
| NEEDMORECASH (whisper_operator) | ASMRZ | 1 | 16/16 | aucun manifeste mêlée dédié |
| GWANA (microphone_guard) | ASMRZ | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gaga Avatar (gaga_avatar) | Lady Gaga | 1 | 16/16 | aucun manifeste mêlée dédié |
| Little Monster Guard (little_monster_guard) | Lady Gaga | 1 | 16/16 | aucun manifeste mêlée dédié |
| Chromatica Dancer (chromatica_dancer) | Lady Gaga | 1 | 16/16 | aucun manifeste mêlée dédié |
| Symphonic Guardian (within_temptation_avatar) | Within Temptation | 1 | 16/16 | aucun manifeste mêlée dédié |
| Angelic Guitar (angelic_guitar_wt) | Within Temptation | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cathedral Drum (cathedral_drum_wt) | Within Temptation | 1 | 16/16 | aucun manifeste mêlée dédié |
| Imaginaerum Bard (nightwish_avatar) | Nightwish | 1 | 16/16 | aucun manifeste mêlée dédié |
| Opera Voice (opera_voice_nightwish) | Nightwish | 1 | 16/16 | aucun manifeste mêlée dédié |
| Metal Ship (metal_ship_nightwish) | Nightwish | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ultra Vomit Avatar (ultravomit_avatar) | Ultra Vomit | 1 | 16/16 | aucun manifeste mêlée dédié |
| Parody Riffer (parody_riffer_uv) | Ultra Vomit | 1 | 16/16 | aucun manifeste mêlée dédié |
| Blast Joke (blast_joke_uv) | Ultra Vomit | 1 | 16/16 | aucun manifeste mêlée dédié |
| PSY Avatar (psy_avatar) | PSY | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gangnam Dancer (gangnam_dancer) | PSY | 1 | 16/16 | aucun manifeste mêlée dédié |
| K-Pop Crowd (kpop_crowd_psy) | PSY | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tommy Heavenly6 (tommy_heavenly_avatar) | Tommy Heavenly6 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Goth Candy Echo (goth_candy_echo) | Tommy Heavenly6 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Punk Bunny Guard (punk_bunny_guard) | Tommy Heavenly6 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Black Eyed Peas Unit (bep_unit) | Black Eyed Peas | 1 | 16/16 | aucun manifeste mêlée dédié |
| Boom Dancer (boom_dancer_bep) | Black Eyed Peas | 1 | 16/16 | aucun manifeste mêlée dédié |
| Party Signal (party_signal_bep) | Black Eyed Peas | 1 | 16/16 | aucun manifeste mêlée dédié |
| Shaka Ponk Unit (shaka_ponk_avatar) | Shaka Ponk | 1 | 16/16 | aucun manifeste mêlée dédié |
| Goz Signal (goz_signal) | Shaka Ponk | 1 | 16/16 | aucun manifeste mêlée dédié |
| Punk Drum (punk_drum_shaka) | Shaka Ponk | 1 | 16/16 | aucun manifeste mêlée dédié |
| Shakira Avatar (shakira_avatar) | Shakira | 1 | 16/16 | aucun manifeste mêlée dédié |
| She Wolf Echo (she_wolf_echo) | Shakira | 1 | 16/16 | aucun manifeste mêlée dédié |
| Waka Guard (waka_guard) | Shakira | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mau5head Avatar (deadmau5_avatar) | Deadmau5 | 1 | 16/16 | aucun manifeste mêlée dédié |
| EDM Grid Mouse (edm_grid_mouse) | Deadmau5 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Laser Sync (laser_sync_mau5) | Deadmau5 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mythos Investigator (investigator_cthulhu) | Cthulhu | 1 | 16/16 | aucun manifeste mêlée dédié |
| Deep One Hybrid (deep_one_hybrid) | Cthulhu | 1 | 16/16 | aucun manifeste mêlée dédié |
| Miskatonic Scholar (miskatonic_scholar) | Cthulhu | 1 | 16/16 | aucun manifeste mêlée dédié |
| Occult Reader (occult_reader_necro) | Necronomicon | 1 | 16/16 | aucun manifeste mêlée dédié |
| Deadite Scribe (deadite_scribe) | Necronomicon | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ritual Guard (ritual_guard_necro) | Necronomicon | 1 | 16/16 | aucun manifeste mêlée dédié |
| Herbert West (herbert_west) | Re-Animator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dan Cain (dan_cain) | Re-Animator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Megan Halsey (megan_halsey) | Re-Animator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Angewomon (angewomon_digi) | Digimon Celestial Rift | 1 | 16/16 | aucun manifeste mêlée dédié |
| LadyDevimon (lady_devimon_digi) | Digimon Celestial Rift | 1 | 16/16 | aucun manifeste mêlée dédié |
| Beelzemon (beelzemon_digi) | Digimon Celestial Rift | 1 | 16/16 | aucun manifeste mêlée dédié |
| Darcmon (darcmon_digi) | Digimon Celestial Rift | 1 | 16/16 | aucun manifeste mêlée dédié |
| EXO-CHIKA (exo_chika_av) | Aural Vampire | 1 | 16/16 | aucun manifeste mêlée dédié |
| RAVEMAN (raveman_av) | Aural Vampire | 1 | 16/16 | aucun manifeste mêlée dédié |
| Wu-CHY (wu_chy_av) | Aural Vampire | 1 | 16/16 | aucun manifeste mêlée dédié |
| Higuchuuhei (higuchuuhei_av) | Aural Vampire | 1 | 16/16 | aucun manifeste mêlée dédié |
| ZEN (zen_av) | Aural Vampire | 1 | 16/16 | aucun manifeste mêlée dédié |
| IZU (izu_av) | Aural Vampire | 1 | 16/16 | aucun manifeste mêlée dédié |
| Buckethead Persona (buckethead_avatar) | Buckethead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Death Cube K Echo (death_cube_k_echo) | Buckethead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Pike Riff Signal (pike_riff_signal) | Buckethead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Korn Avatar (korn_avatar) | Korn | 1 | 16/16 | aucun manifeste mêlée dédié |
| Seven String Riff (seven_string_riff) | Korn | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bagpipe Signal (bagpipe_signal) | Korn | 1 | 16/16 | aucun manifeste mêlée dédié |
| Shock Rock Avatar (manson_avatar) | Marilyn Manson | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mechanical Animal (mechanical_animal) | Marilyn Manson | 1 | 16/16 | aucun manifeste mêlée dédié |
| Pale Emperor Echo (pale_emperor_echo) | Marilyn Manson | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hinako Shimizu (hinako_shf) | Silent Hill f | 1 | 16/16 | aucun manifeste mêlée dédié |
| Shu Iwai (shu_iwai_shf) | Silent Hill f | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rinko Nishida (rinko_nishida_shf) | Silent Hill f | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sakuko Igarashi (sakuko_igarashi_shf) | Silent Hill f | 1 | 16/16 | aucun manifeste mêlée dédié |
| Aragorn (aragorn_lotr) | The Lord of the Rings | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gandalf (gandalf_lotr) | The Lord of the Rings | 1 | 16/16 | aucun manifeste mêlée dédié |
| Legolas (legolas_lotr) | The Lord of the Rings | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gimli (gimli_lotr) | The Lord of the Rings | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jack Cooper (jack_cooper_tf2) | Titanfall 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| BT-7274 (bt_7274_tf2) | Titanfall 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sarah Briggs (sarah_briggs_tf2) | Titanfall 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jack Sparrow (jack_sparrow_potc) | Pirates of the Caribbean | 1 | 16/16 | aucun manifeste mêlée dédié |
| Elizabeth Swann (elizabeth_swann_potc) | Pirates of the Caribbean | 1 | 16/16 | aucun manifeste mêlée dédié |
| Will Turner (will_turner_potc) | Pirates of the Caribbean | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ben Peterson (ben_peterson_them) | Them! | 1 | 16/16 | aucun manifeste mêlée dédié |
| Pat Medford (pat_medford_them) | Them! | 1 | 16/16 | aucun manifeste mêlée dédié |
| Robert Graham (robert_graham_them) | Them! | 1 | 16/16 | aucun manifeste mêlée dédié |
| V (v_cyberpunk) | Cyberpunk | 1 | 16/16 | aucun manifeste mêlée dédié |
| Johnny Silverhand (johnny_silverhand_cp) | Cyberpunk | 1 | 16/16 | aucun manifeste mêlée dédié |
| Panam Palmer (panam_palmer_cp) | Cyberpunk | 1 | 16/16 | aucun manifeste mêlée dédié |
| Joshua Taylor (joshua_taylor_creator) | The Creator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Alphie (alphie_creator) | The Creator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Harun (harun_creator) | The Creator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sarah Bowman (sarah_bowman_dotd) | Day of the Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| John (john_dotd) | Day of the Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bill McDermott (bill_mcdemott_dotd) | Day of the Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ben (ben_nold) | Night of the Living Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Barbra (barbra_nold) | Night of the Living Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tom (tom_nold) | Night of the Living Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Riley Denbo (riley_denbo_lotd) | Land of the Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Slack (slack_lotd) | Land of the Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Charlie (charlie_lotd) | Land of the Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Peter West (peter_west_zombi) | Zombi | 1 | 16/16 | aucun manifeste mêlée dédié |
| Anne Bowles (anne_bowles_zombi) | Zombi | 1 | 16/16 | aucun manifeste mêlée dédié |
| Brian Hull (brian_hull_zombi) | Zombi | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sarah Connor (terminator_sarah_connor) | Terminator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kyle Reese (terminator_kyle_reese) | Terminator | 1 | 16/16 | aucun manifeste mêlée dédié |
| T-800 Model 101 — T2 Protector (t800_protector_t2) | Terminator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Alex Murphy / RoboCop (alex_murphy_robocop) | RoboCop | 1 | 16/16 | aucun manifeste mêlée dédié |
| Officer Anne Lewis (robocop_anne_lewis) | RoboCop | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sergeant Warren Reed (robocop_warren_reed) | RoboCop | 1 | 16/16 | aucun manifeste mêlée dédié |
| Batman (batman_tdk) | The Dark Knight | 1 | 16/16 | aucun manifeste mêlée dédié |
| James Gordon (jim_gordon_tdk) | The Dark Knight | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lucius Fox (lucius_fox_tdk) | The Dark Knight | 1 | 16/16 | aucun manifeste mêlée dédié |
| Beatrix Kiddo (beatrix_kiddo_kb) | Kill Bill | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hattori Hanzo (hattori_hanzo_kb) | Kill Bill | 1 | 16/16 | aucun manifeste mêlée dédié |
| Pai Mei (kill_bill_pai_mei) | Kill Bill | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rocky Balboa (rocky_balboa) | Rocky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Apollo Creed (apollo_creed) | Rocky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Adrian Balboa (adrian_balboa) | Rocky | 1 | 16/16 | aucun manifeste mêlée dédié |
| John Rambo (john_rambo) | Rambo | 1 | 16/16 | aucun manifeste mêlée dédié |
| Colonel Trautman (sam_trautman) | Rambo | 1 | 16/16 | aucun manifeste mêlée dédié |
| Co Bao (co_bao) | Rambo | 1 | 16/16 | aucun manifeste mêlée dédié |
| John Matrix (john_matrix_commando) | Commando | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cindy (cindy_commando) | Commando | 1 | 16/16 | aucun manifeste mêlée dédié |
| General Kirby (general_kirby_commando) | Commando | 1 | 16/16 | aucun manifeste mêlée dédié |
| Clarice Starling (clarice_starling) | The Silence of the Lambs | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jack Crawford (jack_crawford_sotl) | The Silence of the Lambs | 1 | 16/16 | aucun manifeste mêlée dédié |
| Barney Matthews (barney_matthews_sotl) | The Silence of the Lambs | 1 | 16/16 | aucun manifeste mêlée dédié |
| Robert Langdon (robert_langdon_dvc) | The Da Vinci Code | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sophie Neveu (sophie_neveu_dvc) | The Da Vinci Code | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bezu Fache (bezu_fache_dvc) | The Da Vinci Code | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mia Allen (mia_allen_ed2013) | Evil Dead (2013) | 1 | 16/16 | aucun manifeste mêlée dédié |
| David Allen (david_allen_ed2013) | Evil Dead (2013) | 1 | 16/16 | aucun manifeste mêlée dédié |
| Eric (eric_ed2013) | Evil Dead (2013) | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ash Williams (ash_williams_aveds) | Ash vs Evil Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Pablo Simon Bolivar (pablo_bolivar_aveds) | Ash vs Evil Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kelly Maxwell (kelly_maxwell_aveds) | Ash vs Evil Dead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Diego de la Vega (diego_de_la_vega_zorro) | Zorro | 1 | 16/16 | aucun manifeste mêlée dédié |
| Alejandro Murrieta (alejandro_murrieta_zorro) | Zorro | 1 | 16/16 | aucun manifeste mêlée dédié |
| Elena Montero (elena_montera_zorro) | Zorro | 1 | 16/16 | aucun manifeste mêlée dédié |
| Commissaire Juve (commissaire_juve_fantomas) | Fantomas | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jerome Fandor (fandor_fantomas) | Fantomas | 1 | 16/16 | aucun manifeste mêlée dédié |
| Helene (helene_fantomas) | Fantomas | 1 | 16/16 | aucun manifeste mêlée dédié |
| Agent J (agent_j_mib) | Men in Black | 1 | 16/16 | aucun manifeste mêlée dédié |
| Agent K (agent_k_mib) | Men in Black | 1 | 16/16 | aucun manifeste mêlée dédié |
| Agent L (agent_l_mib) | Men in Black | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jim (jim_28dl) | 28 Days Later | 1 | 16/16 | aucun manifeste mêlée dédié |
| Selena (selena_28dl) | 28 Days Later | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hannah (hannah_28dl) | 28 Days Later | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kevin McCallister (kevin_mccallister) | Home Alone | 1 | 16/16 | aucun manifeste mêlée dédié |
| Old Man Marley (old_man_marley) | Home Alone | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kate McCallister (kate_mccallister) | Home Alone | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jack Slater (jack_slater_lah) | Last Action Hero | 1 | 16/16 | aucun manifeste mêlée dédié |
| Danny Madigan (danny_madigan_lah) | Last Action Hero | 1 | 16/16 | aucun manifeste mêlée dédié |
| Whiskers (whiskers_lah) | Last Action Hero | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kevin (kevin_minions) | Minions | 1 | 16/16 | aucun manifeste mêlée dédié |
| Stuart (stuart_minions) | Minions | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bob (bob_minions) | Minions | 1 | 16/16 | aucun manifeste mêlée dédié |
| Stitch (stitch_626) | Lilo & Stitch | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lilo Pelekai (lilo_pelekai) | Lilo & Stitch | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nani Pelekai (nani_pelekai) | Lilo & Stitch | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ben Tennyson (ben_tennyson) | Ben 10 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gwen Tennyson (gwen_tennyson) | Ben 10 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kevin Levin (kevin_levin) | Ben 10 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sonic (sonic_hedgehog) | Sonic | 1 | 16/16 | aucun manifeste mêlée dédié |
| Miles Tails Prower (miles_tails_prower) | Sonic | 1 | 16/16 | aucun manifeste mêlée dédié |
| Knuckles (knuckles_echidna) | Sonic | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jake Sully (jake_sully_avatar) | Avatar (Na'vi) | 1 | 16/16 | aucun manifeste mêlée dédié |
| Neytiri (neytiri_avatar) | Avatar (Na'vi) | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kiri (kiri_avatar) | Avatar (Na'vi) | 1 | 16/16 | aucun manifeste mêlée dédié |
| Manny (manny_iceage) | Ice Age | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sid (sid_iceage) | Ice Age | 1 | 16/16 | aucun manifeste mêlée dédié |
| Diego (diego_iceage) | Ice Age | 1 | 16/16 | aucun manifeste mêlée dédié |
| Stan Helsing (stan_helsing) | Stan Helsing | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nadine (nadine_helsing) | Stan Helsing | 1 | 16/16 | aucun manifeste mêlée dédié |
| Teddy (teddy_helsing) | Stan Helsing | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rick Riker / Dragonfly (rick_riker_sm) | Superhero Movie | 1 | 16/16 | aucun manifeste mêlée dédié |
| Trey (trey_sm) | Superhero Movie | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jill Johnson (jill_johnson_sm) | Superhero Movie | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ezio Auditore (ezio_auditore_ac) | Assassin's Creed | 1 | 16/16 | aucun manifeste mêlée dédié |
| Desmond Miles (desmond_miles_ac) | Assassin's Creed | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kassandra (kassandra_ac) | Assassin's Creed | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sheldon Cooper (sheldon_cooper_tbbt) | The Big Bang Theory | 1 | 16/16 | aucun manifeste mêlée dédié |
| Leonard Hofstadter (leonard_hofstadter_tbbt) | The Big Bang Theory | 1 | 16/16 | aucun manifeste mêlée dédié |
| Penny (penny_tbbt) | The Big Bang Theory | 1 | 16/16 | aucun manifeste mêlée dédié |
| Steve (steve_minecraft) | Minecraft | 1 | 16/16 | aucun manifeste mêlée dédié |
| Alex (alex_minecraft) | Minecraft | 1 | 16/16 | aucun manifeste mêlée dédié |
| Librarian Villager (villager_librarian_mc) | Minecraft | 1 | 16/16 | aucun manifeste mêlée dédié |
| Papa Smurf (papa_smurf) | The Smurfs | 1 | 16/16 | aucun manifeste mêlée dédié |
| Smurfette (smurfette) | The Smurfs | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hefty Smurf (hefty_smurf) | The Smurfs | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tintin (tintin_hero) | Tintin | 1 | 16/16 | aucun manifeste mêlée dédié |
| Captain Haddock (captain_haddock) | Tintin | 1 | 16/16 | aucun manifeste mêlée dédié |
| Professor Calculus (professor_calculus) | Tintin | 1 | 16/16 | aucun manifeste mêlée dédié |
| Asterix (asterix_gaul) | Asterix & Obelix | 1 | 16/16 | aucun manifeste mêlée dédié |
| Obelix (obelix_gaul) | Asterix & Obelix | 1 | 16/16 | aucun manifeste mêlée dédié |
| Getafix (getafix_gaul) | Asterix & Obelix | 1 | 16/16 | aucun manifeste mêlée dédié |
| Judy Hopps (judy_hopps) | Zootopia | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nick Wilde (nick_wilde) | Zootopia | 1 | 16/16 | aucun manifeste mêlée dédié |
| Chief Bogo (chief_bogo) | Zootopia | 1 | 16/16 | aucun manifeste mêlée dédié |
| Joy (joy_insideout) | Inside Out | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sadness (sadness_insideout) | Inside Out | 1 | 16/16 | aucun manifeste mêlée dédié |
| Anger (anger_insideout) | Inside Out | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lorraine Warren (lorraine_warren) | The Conjuring | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ed Warren (ed_warren) | The Conjuring | 1 | 16/16 | aucun manifeste mêlée dédié |
| Carolyn Perron (carolyn_perron) | The Conjuring | 1 | 16/16 | aucun manifeste mêlée dédié |
| Josh Lambert (josh_lambert) | Insidious | 1 | 16/16 | aucun manifeste mêlée dédié |
| Elise Rainier (elise_rainier) | Insidious | 1 | 16/16 | aucun manifeste mêlée dédié |
| Renai Lambert (renai_lambert) | Insidious | 1 | 16/16 | aucun manifeste mêlée dédié |
| Max Rockatansky (max_rockatansky_fr) | Mad Max: Fury Road | 1 | 16/16 | aucun manifeste mêlée dédié |
| Imperator Furiosa (furiosa_fr) | Mad Max: Fury Road | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nux (nux_fr) | Mad Max: Fury Road | 1 | 16/16 | aucun manifeste mêlée dédié |
| John Wick (john_wick) | John Wick | 1 | 16/16 | aucun manifeste mêlée dédié |
| Caine (caine_jw) | John Wick | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bowery King (bowery_king_jw) | John Wick | 1 | 16/16 | aucun manifeste mêlée dédié |
| Carmen Cortez (carmen_cortez) | Spy Kids | 1 | 16/16 | aucun manifeste mêlée dédié |
| Juni Cortez (juni_cortez) | Spy Kids | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gregorio Cortez (gregorio_cortez) | Spy Kids | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rick O Connell (rick_oconnell_mummy) | The Mummy | 1 | 16/16 | aucun manifeste mêlée dédié |
| Evelyn Carnahan (evelyn_carnahan_mummy) | The Mummy | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ardeth Bay (ardeth_bay_mummy) | The Mummy | 1 | 16/16 | aucun manifeste mêlée dédié |
| Luc Deveraux (luc_deveraux_us) | Universal Soldier | 1 | 16/16 | aucun manifeste mêlée dédié |
| Veronica Roberts (veronica_roberts_us) | Universal Soldier | 1 | 16/16 | aucun manifeste mêlée dédié |
| Maggie (maggie_us) | Universal Soldier | 1 | 16/16 | aucun manifeste mêlée dédié |
| James Sandin (the_purge_2013_james_sandin) | The Purge | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mary Sandin (the_purge_2013_mary_sandin) | The Purge | 1 | 16/16 | aucun manifeste mêlée dédié |
| Zoey Sandin (the_purge_2013_zoey_sandin) | The Purge | 1 | 16/16 | aucun manifeste mêlée dédié |
| Barney Ross (barney_ross_exp) | The Expendables | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lee Christmas (lee_christmas_exp) | The Expendables | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gunner Jensen (gunner_jensen_exp) | The Expendables | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rick Deckard (rick_deckard_br) | Blade Runner | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rachael (rachael_br) | Blade Runner | 1 | 16/16 | aucun manifeste mêlée dédié |
| K (k_br2049) | Blade Runner | 1 | 16/16 | aucun manifeste mêlée dédié |
| Melanie Ballard (melanie_ballard_gom) | Ghosts of Mars | 1 | 16/16 | aucun manifeste mêlée dédié |
| Desolation Williams (desolation_williams_gom) | Ghosts of Mars | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bashira Kincaid (bashira_kincaid_gom) | Ghosts of Mars | 1 | 16/16 | aucun manifeste mêlée dédié |
| Archer (archer_gorgonite) | Small Soldiers | 1 | 16/16 | aucun manifeste mêlée dédié |
| Alan Abernathy (alan_abernathy_ss) | Small Soldiers | 1 | 16/16 | aucun manifeste mêlée dédié |
| Christy Fimple (christy_fimple_ss) | Small Soldiers | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ally McCabe (ally_mccabe_he) | Heart Eyes | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jay Simmonds (jay_simmonds_he) | Heart Eyes | 1 | 16/16 | aucun manifeste mêlée dédié |
| Monica (monica_he) | Heart Eyes | 1 | 16/16 | aucun manifeste mêlée dédié |
| Denji (denji_chainsaw) | Chainsaw Man | 1 | 16/16 | aucun manifeste mêlée dédié |
| Power (power_blood_fiend) | Chainsaw Man | 1 | 16/16 | aucun manifeste mêlée dédié |
| Aki Hayakawa (aki_hayakawa) | Chainsaw Man | 1 | 16/16 | aucun manifeste mêlée dédié |
| David Martinez (david_martinez) | Cyberpunk: Edgerunners | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lucy (lucy_edgerunners) | Cyberpunk: Edgerunners | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rebecca (rebecca_edgerunners) | Cyberpunk: Edgerunners | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tanjiro Kamado (tanjiro_kamado) | Demon Slayer | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nezuko Kamado (nezuko_kamado) | Demon Slayer | 1 | 16/16 | aucun manifeste mêlée dédié |
| Zenitsu Agatsuma (zenitsu_agatsuma) | Demon Slayer | 1 | 16/16 | aucun manifeste mêlée dédié |
| Shinichi Izumi and Migi (shinichi_migi) | Parasyte | 1 | 16/16 | aucun manifeste mêlée dédié |
| Satomi Murano (satomi_murano) | Parasyte | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mamoru Uda and Jaw (mamoru_uda) | Parasyte | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rintaro Okabe (rintaro_okabe) | Steins;Gate | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kurisu Makise (kurisu_makise) | Steins;Gate | 1 | 16/16 | aucun manifeste mêlée dédié |
| Itaru Hashida (itaru_hashida) | Steins;Gate | 1 | 16/16 | aucun manifeste mêlée dédié |
| Junpei Tenmyouji (junpei_tenmyouji) | Zero Escape: The Nonary Games | 1 | 16/16 | aucun manifeste mêlée dédié |
| Akane Kurashiki (akane_kurashiki) | Zero Escape: The Nonary Games | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sigma Klim (sigma_klim) | Zero Escape: The Nonary Games | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jotaro Kujo (jotaro_kujo) | JoJo's Bizarre Adventure | 1 | 16/16 | aucun manifeste mêlée dédié |
| Joseph Joestar (joseph_joestar) | JoJo's Bizarre Adventure | 1 | 16/16 | aucun manifeste mêlée dédié |
| Giorno Giovanna (giorno_giovanna) | JoJo's Bizarre Adventure | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kenshin Himura (kenshin_himura) | Rurouni Kenshin | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kaoru Kamiya (kaoru_kamiya) | Rurouni Kenshin | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sanosuke Sagara (sanosuke_sagara) | Rurouni Kenshin | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ken Kaneki (ken_kaneki) | Tokyo Ghoul | 1 | 16/16 | aucun manifeste mêlée dédié |
| Touka Kirishima (touka_kirishima) | Tokyo Ghoul | 1 | 16/16 | aucun manifeste mêlée dédié |
| Koutarou Amon (koutarou_amon) | Tokyo Ghoul | 1 | 16/16 | aucun manifeste mêlée dédié |
| Spike Spiegel (spike_spiegel) | Cowboy Bebop | 1 | 16/16 | aucun manifeste mêlée dédié |
| Faye Valentine (faye_valentine) | Cowboy Bebop | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jet Black (jet_black) | Cowboy Bebop | 1 | 16/16 | aucun manifeste mêlée dédié |
| Son Goku (goku_dbz) | Dragon Ball Z | 1 | 16/16 | aucun manifeste mêlée dédié |
| Vegeta (vegeta_dbz) | Dragon Ball Z | 1 | 16/16 | aucun manifeste mêlée dédié |
| Piccolo (piccolo_dbz) | Dragon Ball Z | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lucy / Nyu (elfen_lied_lucy) | Elfen Lied | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kouta (elfen_lied_kouta) | Elfen Lied | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nana (elfen_lied_nana) | Elfen Lied | 1 | 16/16 | aucun manifeste mêlée dédié |
| Edward Elric (edward_elric) | Fullmetal Alchemist | 1 | 16/16 | aucun manifeste mêlée dédié |
| Alphonse Elric (alphonse_elric) | Fullmetal Alchemist | 1 | 16/16 | aucun manifeste mêlée dédié |
| Roy Mustang (roy_mustang) | Fullmetal Alchemist | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kei Kurono (kei_kurono) | Gantz | 1 | 16/16 | aucun manifeste mêlée dédié |
| Masaru Kato (masaru_kato) | Gantz | 1 | 16/16 | aucun manifeste mêlée dédié |
| Reika Shimohira (reika_shimohira) | Gantz | 1 | 16/16 | aucun manifeste mêlée dédié |
| Akane Tsunemori (akane_tsunemori) | Psycho-Pass | 1 | 16/16 | aucun manifeste mêlée dédié |
| Shinya Kogami (shinya_kogami) | Psycho-Pass | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nobuchika Ginoza (nobuchika_ginoza) | Psycho-Pass | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mash Burnedead (mash_burnedead) | Mashle | 1 | 16/16 | aucun manifeste mêlée dédié |
| Finn Ames (finn_ames) | Mashle | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lance Crown (lance_crown) | Mashle | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sung Jinwoo (sung_jinwoo) | Solo Leveling | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cha Hae-In (cha_haein) | Solo Leveling | 1 | 16/16 | aucun manifeste mêlée dédié |
| Yoo Jinho (yoo_jinho) | Solo Leveling | 1 | 16/16 | aucun manifeste mêlée dédié |
| Frieren (frieren_elf) | Frieren: Beyond Journeys End | 1 | 16/16 | aucun manifeste mêlée dédié |
| Fern (fern_mage) | Frieren: Beyond Journeys End | 1 | 16/16 | aucun manifeste mêlée dédié |
| Stark (stark_warrior) | Frieren: Beyond Journeys End | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ganta Igarashi (ganta_igarashi) | Deadman Wonderland | 1 | 16/16 | aucun manifeste mêlée dédié |
| Shiro (shiro_deadman) | Deadman Wonderland | 1 | 16/16 | aucun manifeste mêlée dédié |
| Senji Kiyomasa Crow (senji_kiyomasa) | Deadman Wonderland | 1 | 16/16 | aucun manifeste mêlée dédié |
| Akira Fudo Devilman (akira_fudo) | Devilman | 1 | 16/16 | aucun manifeste mêlée dédié |
| Miki Makimura (miki_makimura) | Devilman | 1 | 16/16 | aucun manifeste mêlée dédié |
| Miko Kuroda (miko_kuroda) | Devilman | 1 | 16/16 | aucun manifeste mêlée dédié |
| Shinji Ikari and EVA-01 (shinji_ikari) | Neon Genesis Evangelion | 1 | 16/16 | aucun manifeste mêlée dédié |
| Asuka Langley and EVA-02 (asuka_langley) | Neon Genesis Evangelion | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rei Ayanami and EVA-00 (rei_ayanami) | Neon Genesis Evangelion | 1 | 16/16 | aucun manifeste mêlée dédié |
| Naruto Uzumaki (naruto_uzumaki_young) | Naruto | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sasuke Uchiha (sasuke_uchiha_young) | Naruto | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sakura Haruno (sakura_haruno_young) | Naruto | 1 | 16/16 | aucun manifeste mêlée dédié |
| Naruto Uzumaki Shippuden (naruto_six_paths) | Naruto Shippuden | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sasuke Uchiha Shippuden (sasuke_rinnegan) | Naruto Shippuden | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kakashi Hatake (kakashi_war) | Naruto Shippuden | 1 | 16/16 | aucun manifeste mêlée dédié |
| Boruto Uzumaki (boruto_uzumaki) | Boruto: Naruto Next Generations | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sarada Uchiha (sarada_uchiha) | Boruto: Naruto Next Generations | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mitsuki (mitsuki_boruto) | Boruto: Naruto Next Generations | 1 | 16/16 | aucun manifeste mêlée dédié |
| Boruto Uzumaki Two Blue Vortex (boruto_tbv) | Boruto: Two Blue Vortex | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sarada Uchiha Two Blue Vortex (sarada_tbv) | Boruto: Two Blue Vortex | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kawaki (kawaki_tbv) | Boruto: Two Blue Vortex | 1 | 16/16 | aucun manifeste mêlée dédié |
| Saitama (saitama_opm) | One Punch Man | 1 | 16/16 | aucun manifeste mêlée dédié |
| Genos (genos_opm) | One Punch Man | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tatsumaki (tatsumaki_opm) | One Punch Man | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sinon (sinon_ggo) | Sword Art Online: Gun Gale Online | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kirito GGO (kirito_ggo) | Sword Art Online: Gun Gale Online | 1 | 16/16 | aucun manifeste mêlée dédié |
| LLENN (llenn_ggo) | Sword Art Online: Gun Gale Online | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kirito (kirito_sao) | Sword Art Online | 1 | 16/16 | aucun manifeste mêlée dédié |
| Asuna (asuna_sao) | Sword Art Online | 1 | 16/16 | aucun manifeste mêlée dédié |
| Klein (klein_sao) | Sword Art Online | 1 | 16/16 | aucun manifeste mêlée dédié |
| Saturnin the Duck (saturnin_duck) | Les Aventures de Saturnin | 1 | 16/16 | aucun manifeste mêlée dédié |
| Police Dog (police_dog_saturnin) | Les Aventures de Saturnin | 1 | 16/16 | aucun manifeste mêlée dédié |
| Professor Popof (professor_popof) | Les Aventures de Saturnin | 1 | 16/16 | aucun manifeste mêlée dédié |
| MagiC JacK (magic_jack_ginolin) | MagiC JacK | 1 | 16/16 | aucun manifeste mêlée dédié |
| Max Rage (max_rage_ginolin) | MagiC JacK | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sapiens Witness (sapiens_witness) | MagiC JacK | 1 | 16/16 | aucun manifeste mêlée dédié |
| Robin (robin_tt) | Teen Titans | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cyborg (cyborg_tt) | Teen Titans | 1 | 16/16 | aucun manifeste mêlée dédié |
| Raven (raven_tt) | Teen Titans | 1 | 16/16 | aucun manifeste mêlée dédié |
| Starfire (starfire_tt) | Teen Titans | 1 | 16/16 | aucun manifeste mêlée dédié |
| Beast Boy (beast_boy_tt) | Teen Titans | 1 | 16/16 | aucun manifeste mêlée dédié |
| Original Godzilla 1954 (godzilla_1954) | Godzilla | 1 | 16/16 | aucun manifeste mêlée dédié |
| Godzilla Millennium (godzilla_millennium) | Godzilla | 1 | 16/16 | aucun manifeste mêlée dédié |
| Legendary Godzilla (legendary_godzilla) | Godzilla | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nancy Thompson (nightmare_elm_street_nancy_thompson) | A Nightmare on Elm Street | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kristen Parker (nightmare_elm_street_kristen_parker) | A Nightmare on Elm Street | 1 | 16/16 | aucun manifeste mêlée dédié |
| Glen Lantz (nightmare_elm_street_glen) | A Nightmare on Elm Street | 1 | 16/16 | aucun manifeste mêlée dédié |
| Neris Vale (neris_vale) | Thalassa Mnémique | 1 | 16/16 | aucun manifeste mêlée dédié |
| Oryn Pell (oryn_pell) | Thalassa Mnémique | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sio Lume (sio_lume) | Thalassa Mnémique | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kael Venn (kael_venn) | Méridien Creux | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ysolde Quarz (ysolde_quarz) | Méridien Creux | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bramm Treize (bramm_treize) | Méridien Creux | 1 | 16/16 | aucun manifeste mêlée dédié |
| Eira Solenne (eira_solenne) | Viridienne Ultime | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cael Rhizome (cael_rhizome) | Viridienne Ultime | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mousse-Nœud (mousse_noeud) | Viridienne Ultime | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nyra Vale (nyra_vale) | Neon Requiem | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jax Rook (jax_rook) | Neon Requiem | 1 | 16/16 | aucun manifeste mêlée dédié |
| Imani Quell (imani_quell) | Neon Requiem | 1 | 16/16 | aucun manifeste mêlée dédié |
| Elara Voss (elara_voss) | The Aether Crown | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bram Quill (bram_quill) | The Aether Crown | 1 | 16/16 | aucun manifeste mêlée dédié |
| Merek Flint (merek_flint) | The Aether Crown | 1 | 16/16 | aucun manifeste mêlée dédié |
| Seraphine Meridius (seraphine_meridius) | Meridian Clockwork | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lio Ferrante (lio_ferrante) | Meridian Clockwork | 1 | 16/16 | aucun manifeste mêlée dédié |
| Frère Ors (brother_ors) | Meridian Clockwork | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mara Veylan (mara_veylan) | Iron Tempest | 1 | 16/16 | aucun manifeste mêlée dédié |
| Anton Rook (anton_rook) | Iron Tempest | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ilya Cross (ilya_cross) | Iron Tempest | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dr Celeste Ray (celeste_ray) | Helios 56 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nova Bell (nova_bell) | Helios 56 | 1 | 16/16 | aucun manifeste mêlée dédié |
| AURA-7 (aura_7) | Helios 56 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nefra de la Balance (nefra_balance) | Kemet: The Devoured Sun | 1 | 16/16 | aucun manifeste mêlée dédié |
| Khepri-Sen (khepri_sen) | Kemet: The Devoured Sun | 1 | 16/16 | aucun manifeste mêlée dédié |
| Taset la Lionne (taset_lioness) | Kemet: The Devoured Sun | 1 | 16/16 | aucun manifeste mêlée dédié |
| Aurelia Marcellina (aurelia_marcellina) | Imperium Aeternum | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cassian Varro (cassian_varro) | Imperium Aeternum | 1 | 16/16 | aucun manifeste mêlée dédié |
| Numa Corvinus (numa_corvinus) | Imperium Aeternum | 1 | 16/16 | aucun manifeste mêlée dédié |
| Thaleia de Naxos (thaleia_naxos) | Aegea: War of the Moirai | 1 | 16/16 | aucun manifeste mêlée dédié |
| Melantho l’Inachevée (melantho_seer) | Aegea: War of the Moirai | 1 | 16/16 | aucun manifeste mêlée dédié |
| Doros Main-de-Bronze (doros_bronzehand) | Aegea: War of the Moirai | 1 | 16/16 | aucun manifeste mêlée dédié |
| Eira Hrafnsdóttir (eira_hrafnsdottir) | Nine Realms: Last Twilight | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sten Ulfsson (sten_ulfsson) | Nine Realms: Last Twilight | 1 | 16/16 | aucun manifeste mêlée dédié |
| Yrsa Lieuse-de-Runes (yrsa_rune_binder) | Nine Realms: Last Twilight | 1 | 16/16 | aucun manifeste mêlée dédié |
| Killa Mayu (killa_mayu) | Tawantinsuyu: The Split Sun | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rumi Illa (rumi_illa) | Tawantinsuyu: The Split Sun | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sumaq Khipu (sumaq_khipu) | Tawantinsuyu: The Split Sun | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rei Kagetsu (rei_kagetsu) | Yomi no Kage | 1 | 16/16 | aucun manifeste mêlée dédié |
| Aoi Mikazuki (aoi_mikazuki) | Yomi no Kage | 1 | 16/16 | aucun manifeste mêlée dédié |
| Daichi Kurogane (daichi_kurogane) | Yomi no Kage | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lin Yue (lin_yue) | Mandate of Nine Heavens | 1 | 16/16 | aucun manifeste mêlée dédié |
| Wei Long (wei_long) | Mandate of Nine Heavens | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mei Zhen (mei_zhen) | Mandate of Nine Heavens | 1 | 16/16 | aucun manifeste mêlée dédié |
| Astra Vey (astra_vey) | Mythos Primordia | 1 | 16/16 | aucun manifeste mêlée dédié |
| Korun Né-de-Pierre (korun_stoneborn) | Mythos Primordia | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nyme du Premier Chant (nyme_first_song) | Mythos Primordia | 1 | 16/16 | aucun manifeste mêlée dédié |
| Capitaine Ysara Flint (ysara_flint) | The Crownless Sea | 1 | 16/16 | aucun manifeste mêlée dédié |
| Milo Quill (milo_quill) | The Crownless Sea | 1 | 16/16 | aucun manifeste mêlée dédié |
| Brann Crow (brann_crow) | The Crownless Sea | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lyra Hexwind (lyra_hexwind) | Aetherion: Seven Laws of Magic | 1 | 16/16 | aucun manifeste mêlée dédié |
| Orin Vale (orin_vale) | Aetherion: Seven Laws of Magic | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nessa Vire (nessa_vire) | Aetherion: Seven Laws of Magic | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mercy Ash (mercy_ash) | Infernum: Nine Pits | 1 | 16/16 | aucun manifeste mêlée dédié |
| Azael Vorn (azael_vorn) | Infernum: Nine Pits | 1 | 16/16 | aucun manifeste mêlée dédié |
| Morcant l’Enchaîné (morcant_bound) | Infernum: Nine Pits | 1 | 16/16 | aucun manifeste mêlée dédié |
| Seyra Tal (seyra_tal) | Ilyr Concordat | 1 | 16/16 | aucun manifeste mêlée dédié |
| Korr Venn (korr_venn) | Ilyr Concordat | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ixo-9 (ixo_9) | Ilyr Concordat | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dr Mara Ell (mara_ell) | The Drowned Testament | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jonas Mire (jonas_mire) | The Drowned Testament | 1 | 16/16 | aucun manifeste mêlée dédié |
| Oona Vell (oona_vell) | The Drowned Testament | 1 | 16/16 | aucun manifeste mêlée dédié |
| Aelwen Starbough (aelwen_starbough) | Valedor: The Shattered Crown | 1 | 16/16 | aucun manifeste mêlée dédié |
| Brokk Embervein (brokk_embervein) | Valedor: The Shattered Crown | 1 | 16/16 | aucun manifeste mêlée dédié |
| Goruk Ash-Tusk (goruk_ash_tusk) | Valedor: The Shattered Crown | 1 | 16/16 | aucun manifeste mêlée dédié |
| Élise Varenne (elise_varenne) | Aevum Fracture | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tomas Grey (tomas_grey) | Aevum Fracture | 1 | 16/16 | aucun manifeste mêlée dédié |
| Safiya Nadir (safiya_nadir) | Aevum Fracture | 1 | 16/16 | aucun manifeste mêlée dédié |
| The Player (poppy_player) | Poppy Playtime | 1 | 16/16 | aucun manifeste mêlée dédié |
| Poppy (poppy_doll) | Poppy Playtime | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kissy Missy (kissy_missy) | Poppy Playtime | 1 | 16/16 | aucun manifeste mêlée dédié |
| Peashooter (pvz_peashooter) | Plants vs. Zombies | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sunflower (pvz_sunflower) | Plants vs. Zombies | 1 | 16/16 | aucun manifeste mêlée dédié |
| Wall-nut (pvz_wallnut) | Plants vs. Zombies | 1 | 16/16 | aucun manifeste mêlée dédié |
| Wheelchair Guy (hw_wheelchair_guy) | Happy Wheels | 1 | 16/16 | aucun manifeste mêlée dédié |
| Business Guy (hw_business_guy) | Happy Wheels | 1 | 16/16 | aucun manifeste mêlée dédié |
| Irresponsible Dad (hw_irresponsible_dad) | Happy Wheels | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jay Merrick (mh_jay_merrick) | Marble Hornets | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tim Wright (mh_tim_wright) | Marble Hornets | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jessica Locke (mh_jessica_locke) | Marble Hornets | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jack Cucchiaio (ginosaji_jack) | The Horribly Slow Murderer | 1 | 16/16 | aucun manifeste mêlée dédié |
| The Mystic (ginosaji_mystic) | The Horribly Slow Murderer | 1 | 16/16 | aucun manifeste mêlée dédié |
| The Doctor (ginosaji_doctor) | The Horribly Slow Murderer | 1 | 16/16 | aucun manifeste mêlée dédié |
| Aseptic Production Operator (sartorius_aseptic_operator) | Sartorius Stedim Biotech | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bioprocess Technician (sartorius_process_technician) | Sartorius Stedim Biotech | 1 | 16/16 | aucun manifeste mêlée dédié |
| Quality Controller (sartorius_quality_controller) | Sartorius Stedim Biotech | 1 | 16/16 | aucun manifeste mêlée dédié |
| Eduard Khil — Archival Performer (trololo_eduard_khil) | Trololo | 1 | 16/16 | aucun manifeste mêlée dédié |
| Television Orchestra (trololo_tv_orchestra) | Trololo | 1 | 16/16 | aucun manifeste mêlée dédié |
| Audience Chorus (trololo_audience_chorus) | Trololo | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rick Astley (rick_astley_rick) | Rick Astley | 1 | 16/16 | aucun manifeste mêlée dédié |
| Live Band (rick_astley_live_band) | Rick Astley | 1 | 16/16 | aucun manifeste mêlée dédié |
| Audience Chorus (rick_astley_audience_chorus) | Rick Astley | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nyan Cat (nyan_cat_classic) | Nyan Cat | 1 | 16/16 | aucun manifeste mêlée dédié |
| Supernyan (nyan_cat_supernyan) | Nyan Cat | 1 | 16/16 | aucun manifeste mêlée dédié |
| Zombienyan (nyan_cat_zombienyan) | Nyan Cat | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mr. Bean (mr_bean_bean) | Mr. Bean | 1 | 16/16 | aucun manifeste mêlée dédié |
| Teddy (mr_bean_teddy) | Mr. Bean | 1 | 16/16 | aucun manifeste mêlée dédié |
| Irma Gobb (mr_bean_irma) | Mr. Bean | 1 | 16/16 | aucun manifeste mêlée dédié |
| Victor Mac Bernik (famille_pirate_victor) | Famille Pirate | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lucile Mac Bernik (famille_pirate_lucile) | Famille Pirate | 1 | 16/16 | aucun manifeste mêlée dédié |
| Scampi Mac Bernik (famille_pirate_scampi) | Famille Pirate | 1 | 16/16 | aucun manifeste mêlée dédié |
| Eliza Thornberry (wild_thornberrys_eliza) | The Wild Thornberrys | 1 | 16/16 | aucun manifeste mêlée dédié |
| Darwin (wild_thornberrys_darwin) | The Wild Thornberrys | 1 | 16/16 | aucun manifeste mêlée dédié |
| Donnie Thornberry (wild_thornberrys_donnie) | The Wild Thornberrys | 1 | 16/16 | aucun manifeste mêlée dédié |
| Groucha (telechat_groucha) | Téléchat | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lola (telechat_lola) | Téléchat | 1 | 16/16 | aucun manifeste mêlée dédié |
| Léguman (telechat_leguman) | Téléchat | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nicolas (nicolas_pimprenelle_nicolas) | Nicolas et Pimprenelle | 1 | 16/16 | aucun manifeste mêlée dédié |
| Pimprenelle (nicolas_pimprenelle_pimprenelle) | Nicolas et Pimprenelle | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gros Nounours (nicolas_pimprenelle_gros_nounours) | Nicolas et Pimprenelle | 1 | 16/16 | aucun manifeste mêlée dédié |
| Le Ranger (naheulbeuk_ranger) | Le Donjon de Naheulbeuk | 1 | 16/16 | aucun manifeste mêlée dédié |
| La Magicienne (naheulbeuk_magicienne) | Le Donjon de Naheulbeuk | 1 | 16/16 | aucun manifeste mêlée dédié |
| Le Nain (naheulbeuk_nain) | Le Donjon de Naheulbeuk | 1 | 16/16 | aucun manifeste mêlée dédié |
| Capitaine Bleûten (survivaure_bleuten) | Les Aventuriers du Survivaure | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sergent Johnson (survivaure_johnson) | Les Aventuriers du Survivaure | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ingénieur Thobias Rasmusen (survivaure_rasmusen) | Les Aventuriers du Survivaure | 1 | 16/16 | aucun manifeste mêlée dédié |
| Capitaine Jean-Claude Gloomy (adoprixtoxis_gloomy) | Adoprixtoxis | 1 | 16/16 | aucun manifeste mêlée dédié |
| Professeur Albert Kellogs (adoprixtoxis_kellogs) | Adoprixtoxis | 1 | 16/16 | aucun manifeste mêlée dédié |
| K.R.O.T.E. (adoprixtoxis_krote) | Adoprixtoxis | 1 | 16/16 | aucun manifeste mêlée dédié |
| Wrandrall (reflets_acide_wrandrall) | Reflets d’Acide | 1 | 16/16 | aucun manifeste mêlée dédié |
| Zehirmahnn (reflets_acide_zehirmahnn) | Reflets d’Acide | 1 | 16/16 | aucun manifeste mêlée dédié |
| Zarakaï (reflets_acide_zarakai) | Reflets d’Acide | 1 | 16/16 | aucun manifeste mêlée dédié |
| Malcom (unreal_tournament_malcom) | Unreal Tournament | 1 | 16/16 | aucun manifeste mêlée dédié |
| Brock (unreal_tournament_brock) | Unreal Tournament | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lauren (unreal_tournament_lauren) | Unreal Tournament | 1 | 16/16 | aucun manifeste mêlée dédié |
| Skye Autumn (sanctum_skye_autumn) | Sanctum | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sweet Autumn (sanctum_sweet_autumn) | Sanctum | 1 | 16/16 | aucun manifeste mêlée dédié |
| SiMo UNIT 025-58 (sanctum_simo) | Sanctum | 1 | 16/16 | aucun manifeste mêlée dédié |
| Pilgor (goat_simulator_pilgor) | Goat Simulator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tall Goat (goat_simulator_tall_goat) | Goat Simulator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tony Shark (goat_simulator_tony_shark) | Goat Simulator | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ranger (quake_franchise_ranger) | Quake | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bitterman (quake_franchise_bitterman) | Quake | 1 | 16/16 | aucun manifeste mêlée dédié |
| Corporal Matthew Kane (quake_franchise_matthew_kane) | Quake | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kazuma Kiryu (like_a_dragon_kazuma_kiryu) | Like a Dragon | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ichiban Kasuga (like_a_dragon_ichiban_kasuga) | Like a Dragon | 1 | 16/16 | aucun manifeste mêlée dédié |
| Goro Majima (like_a_dragon_goro_majima) | Like a Dragon | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tralalero Tralala (italian_brainrot_tralalero_tralala) | Italian Brainrot | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ballerina Cappuccina (italian_brainrot_ballerina_cappuccina) | Italian Brainrot | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lirilì Larilà (italian_brainrot_lirili_larila) | Italian Brainrot | 1 | 16/16 | aucun manifeste mêlée dédié |
| Domasi “Tommy” Tawodi (prey_2006_tommy_tawodi) | Prey (2006) | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jen (prey_2006_jen) | Prey (2006) | 1 | 16/16 | aucun manifeste mêlée dédié |
| Enisi (prey_2006_enisi) | Prey (2006) | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jade (beyond_good_evil_jade) | Beyond Good & Evil | 1 | 16/16 | aucun manifeste mêlée dédié |
| Pey’j (beyond_good_evil_peyj) | Beyond Good & Evil | 1 | 16/16 | aucun manifeste mêlée dédié |
| Double H (beyond_good_evil_double_h) | Beyond Good & Evil | 1 | 16/16 | aucun manifeste mêlée dédié |
| The Unknown (metal_hellsinger_unknown) | Metal: Hellsinger | 1 | 16/16 | aucun manifeste mêlée dédié |
| Paz (metal_hellsinger_paz) | Metal: Hellsinger | 1 | 16/16 | aucun manifeste mêlée dédié |
| The Unknown’s Stolen Voice (metal_hellsinger_stolen_voice) | Metal: Hellsinger | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dwight Fairfield (dead_by_daylight_dwight_fairfield) | Dead by Daylight | 1 | 16/16 | aucun manifeste mêlée dédié |
| Meg Thomas (dead_by_daylight_meg_thomas) | Dead by Daylight | 1 | 16/16 | aucun manifeste mêlée dédié |
| Claudette Morel (dead_by_daylight_claudette_morel) | Dead by Daylight | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dante (dantes_inferno_dante) | Dante's Inferno | 1 | 16/16 | aucun manifeste mêlée dédié |
| Beatrice Portinari (dantes_inferno_beatrice) | Dante's Inferno | 1 | 16/16 | aucun manifeste mêlée dédié |
| Virgil (dantes_inferno_virgil) | Dante's Inferno | 1 | 16/16 | aucun manifeste mêlée dédié |
| Michael LeRoi / Shadow Man (shadow_man_michael_leroi) | Shadow Man | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mama Nettie (shadow_man_mama_nettie) | Shadow Man | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jaunty (shadow_man_jaunty) | Shadow Man | 1 | 16/16 | aucun manifeste mêlée dédié |
| Croc (croc_croc) | Croc: Legend of the Gobbos | 1 | 16/16 | aucun manifeste mêlée dédié |
| Beany the Bird (croc_beany_bird) | Croc: Legend of the Gobbos | 1 | 16/16 | aucun manifeste mêlée dédié |
| King Rufus (croc_king_rufus) | Croc: Legend of the Gobbos | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gex (gex_gex) | Gex | 1 | 16/16 | aucun manifeste mêlée dédié |
| Agent Xtra (gex_agent_xtra) | Gex | 1 | 16/16 | aucun manifeste mêlée dédié |
| Alfred (gex_alfred) | Gex | 1 | 16/16 | aucun manifeste mêlée dédié |
| YoRHa No. 2 Type B — 2B (yorha_2b) | NieR | 1 | 16/16 | aucun manifeste mêlée dédié |
| YoRHa No. 9 Type S — 9S (yorha_9s) | NieR | 1 | 16/16 | aucun manifeste mêlée dédié |
| YoRHa Type A No. 2 — A2 (yorha_a2) | NieR | 1 | 16/16 | aucun manifeste mêlée dédié |
| Takurou Hayami (discipline_takurou_hayami) | Discipline: The Record of a Crusade | 1 | 16/16 | aucun manifeste mêlée dédié |
| Saori Otokawa (discipline_saori_otokawa) | Discipline: The Record of a Crusade | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ruri Nonomiya (discipline_ruri_nonomiya) | Discipline: The Record of a Crusade | 1 | 16/16 | aucun manifeste mêlée dédié |
| Taki Minase (bible_black_taki_minase) | Bible Black | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kurumi Imari (bible_black_kurumi_imari) | Bible Black | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hiroko Takashiro (bible_black_hiroko_takashiro) | Bible Black | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jacket (hotline_miami_jacket) | Hotline Miami | 1 | 16/16 | aucun manifeste mêlée dédié |
| Biker (hotline_miami_biker) | Hotline Miami | 1 | 16/16 | aucun manifeste mêlée dédié |
| Richter (hotline_miami_richter) | Hotline Miami | 1 | 16/16 | aucun manifeste mêlée dédié |
| Captain Demetrian Titus (space_marine_titus) | Warhammer 40,000: Space Marine | 1 | 16/16 | aucun manifeste mêlée dédié |
| Veteran Sergeant Sidonus (space_marine_sidonus) | Warhammer 40,000: Space Marine | 1 | 16/16 | aucun manifeste mêlée dédié |
| Battle-Brother Leandros (space_marine_leandros) | Warhammer 40,000: Space Marine | 1 | 16/16 | aucun manifeste mêlée dédié |
| Marty McFly (marty_mcfly) | Back to the Future | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dr. Emmett “Doc” Brown (emmett_brown) | Back to the Future | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jennifer Parker (jennifer_parker) | Back to the Future | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lee Everett (walking_dead_telltale_lee_everett) | The Walking Dead — Telltale | 1 | 16/16 | aucun manifeste mêlée dédié |
| Clementine — Final Season (clementine_final_season) | The Walking Dead — Telltale | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kenny (walking_dead_telltale_kenny) | The Walking Dead — Telltale | 1 | 16/16 | aucun manifeste mêlée dédié |
| Aloy (horizon_zero_dawn_aloy) | Horizon Zero Dawn | 1 | 16/16 | aucun manifeste mêlée dédié |
| Varl (horizon_zero_dawn_varl) | Horizon Zero Dawn | 1 | 16/16 | aucun manifeste mêlée dédié |
| Erend (horizon_zero_dawn_erend) | Horizon Zero Dawn | 1 | 16/16 | aucun manifeste mêlée dédié |
| John Mullins (soldier_of_fortune_john_mullins) | Soldier of Fortune | 1 | 16/16 | aucun manifeste mêlée dédié |
| Aaron “Hawk” Parsons (soldier_of_fortune_hawk_parsons) | Soldier of Fortune | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sam Gladstone (soldier_of_fortune_sam_gladstone) | Soldier of Fortune | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kylie Griffin (extreme_ghostbusters_kylie_griffin) | Extreme Ghostbusters | 1 | 16/16 | aucun manifeste mêlée dédié |
| Eduardo Rivera (extreme_ghostbusters_eduardo_rivera) | Extreme Ghostbusters | 1 | 16/16 | aucun manifeste mêlée dédié |
| Garrett Miller (extreme_ghostbusters_garrett_miller) | Extreme Ghostbusters | 1 | 16/16 | aucun manifeste mêlée dédié |
| Andy (heart_of_darkness_andy) | Heart of Darkness | 1 | 16/16 | aucun manifeste mêlée dédié |
| Whisky — Rescue Route (heart_of_darkness_whisky_rescue) | Heart of Darkness | 1 | 16/16 | aucun manifeste mêlée dédié |
| Amigo Evacuation (heart_of_darkness_amigo_evacuation) | Heart of Darkness | 1 | 16/16 | aucun manifeste mêlée dédié |
| Batsu Ichimonji (rival_schools_batsu) | Rival Schools | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hinata Wakaba (rival_schools_hinata) | Rival Schools | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kyosuke Kagami (rival_schools_kyosuke) | Rival Schools | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sir Daniel Fortesque (sir_daniel_fortesque) | MediEvil | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kiya (medievil_kiya) | MediEvil | 1 | 16/16 | aucun manifeste mêlée dédié |
| Al-Zalam — Guidance Route (medievil_al_zalam) | MediEvil | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jersey Devil (jersey_devil_jersey_devil) | Jersey Devil | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jersey City Hostage Rescue (jersey_devil_hostage_rescue) | Jersey Devil | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jersey City Police Arrest Route (jersey_devil_police_arrest) | Jersey Devil | 1 | 16/16 | aucun manifeste mêlée dédié |
| Goemon (goemons_great_adventure_goemon) | Goemon's Great Adventure | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ebisumaru (goemons_great_adventure_ebisumaru) | Goemon's Great Adventure | 1 | 16/16 | aucun manifeste mêlée dédié |
| Yae (goemons_great_adventure_yae) | Goemon's Great Adventure | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kurt Hectic (mdk_kurt_hectic) | MDK | 1 | 16/16 | aucun manifeste mêlée dédié |
| Max (max_mdk) | MDK | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dr. Fluke Hawkins (mdk_dr_hawkins) | MDK | 1 | 16/16 | aucun manifeste mêlée dédié |
| Waffle Ryebread (tail_concerto_waffle) | Tail Concerto | 1 | 16/16 | aucun manifeste mêlée dédié |
| Alicia Pris (tail_concerto_alicia) | Tail Concerto | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cyan Garland (tail_concerto_cyan) | Tail Concerto | 1 | 16/16 | aucun manifeste mêlée dédié |
| Leonard (redneck_rampage_leonard) | Redneck Rampage | 1 | 16/16 | aucun manifeste mêlée dédié |
| Find Bubba — Level Exit (redneck_rampage_bubba_route) | Redneck Rampage | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bessie Rescue (redneck_rampage_bessie_rescue) | Redneck Rampage | 1 | 16/16 | aucun manifeste mêlée dédié |
| Baratus (hexen_baratus) | Hexen | 1 | 16/16 | aucun manifeste mêlée dédié |
| Parias (hexen_parias) | Hexen | 1 | 16/16 | aucun manifeste mêlée dédié |
| Daedolon (hexen_daedolon) | Hexen | 1 | 16/16 | aucun manifeste mêlée dédié |
| Duke Nukem (duke_nukem) | Duke Nukem | 1 | 16/16 | aucun manifeste mêlée dédié |
| Captain Dylan (duke_nukem_captain_dylan) | Duke Nukem | 1 | 16/16 | aucun manifeste mêlée dédié |
| EDF Trooper (duke_nukem_edf_trooper) | Duke Nukem | 1 | 16/16 | aucun manifeste mêlée dédié |
| UESC Marathon Security Officer (marathon_classic_security_officer) | Marathon | 1 | 16/16 | aucun manifeste mêlée dédié |
| Robert Blake (marathon_classic_robert_blake) | Marathon | 1 | 16/16 | aucun manifeste mêlée dédié |
| S’pht’Kr Defender (marathon_classic_sphtkr_defender) | Marathon | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cadence (crypt_necrodancer_cadence) | Crypt of the NecroDancer | 1 | 16/16 | aucun manifeste mêlée dédié |
| Melody (crypt_necrodancer_melody) | Crypt of the NecroDancer | 1 | 16/16 | aucun manifeste mêlée dédié |
| Aria (crypt_necrodancer_aria) | Crypt of the NecroDancer | 1 | 16/16 | aucun manifeste mêlée dédié |
| The Captain (subverse_safe_rebellion_captain) | Subverse — Safe Galactic Rebellion | 1 | 16/16 | aucun manifeste mêlée dédié |
| DEMI (subverse_safe_rebellion_demi) | Subverse — Safe Galactic Rebellion | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lily (subverse_safe_rebellion_lily) | Subverse — Safe Galactic Rebellion | 1 | 16/16 | aucun manifeste mêlée dédié |
| The Traveller (no_mans_sky_traveller) | No Man's Sky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Priest Entity Nada (no_mans_sky_nada) | No Man's Sky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Specialist Polo (no_mans_sky_polo) | No Man's Sky | 1 | 16/16 | aucun manifeste mêlée dédié |
| Frontiersman Marine (natural_selection_2_marine) | Natural Selection 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jetpack Marine (natural_selection_2_jetpack_marine) | Natural Selection 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Exosuit Marine (natural_selection_2_exosuit) | Natural Selection 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Soldier (nemesis_awaken_realms_soldier) | Nemesis — Awaken Realms | 1 | 16/16 | aucun manifeste mêlée dédié |
| Scientist (nemesis_awaken_realms_scientist) | Nemesis — Awaken Realms | 1 | 16/16 | aucun manifeste mêlée dédié |
| Scout (nemesis_awaken_realms_scout) | Nemesis — Awaken Realms | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gorge (unreal_tournament_2004_gorge) | Unreal Tournament 2004 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sapphire (unreal_tournament_2004_sapphire) | Unreal Tournament 2004 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Frostbite (unreal_tournament_2004_frostbite) | Unreal Tournament 2004 | 1 | 16/16 | aucun manifeste mêlée dédié |
| ULA Rifleman (angels_fall_first_ula_rifleman) | Angels Fall First | 1 | 16/16 | aucun manifeste mêlée dédié |
| ULA Pilot (angels_fall_first_ula_pilot) | Angels Fall First | 1 | 16/16 | aucun manifeste mêlée dédié |
| ULA Fleet Commander (angels_fall_first_ula_commander) | Angels Fall First | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cathy (beat_banger_safe_cathy) | Beat Banger — Safe Rhythm Studio | 1 | 16/16 | aucun manifeste mêlée dédié |
| Zoe (beat_banger_safe_zoe) | Beat Banger — Safe Rhythm Studio | 1 | 16/16 | aucun manifeste mêlée dédié |
| Elaine Claire (beat_banger_safe_elaine) | Beat Banger — Safe Rhythm Studio | 1 | 16/16 | aucun manifeste mêlée dédié |
| Yamato (doom_sweeper_safe_yamato) | Doom Sweeper — Safe Apocalypse | 1 | 16/16 | aucun manifeste mêlée dédié |
| Roche (doom_sweeper_safe_roche) | Doom Sweeper — Safe Apocalypse | 1 | 16/16 | aucun manifeste mêlée dédié |
| Doom Sweeper Armored Van (doom_sweeper_safe_armored_van) | Doom Sweeper — Safe Apocalypse | 1 | 16/16 | aucun manifeste mêlée dédié |
| Colony Captain (stellar_dream_safe_captain) | Stellar Dream — Safe Colony Mission | 1 | 16/16 | aucun manifeste mêlée dédié |
| Maria (stellar_dream_safe_maria) | Stellar Dream — Safe Colony Mission | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ronda (stellar_dream_safe_ronda) | Stellar Dream — Safe Colony Mission | 1 | 16/16 | aucun manifeste mêlée dédié |
| Windfall Prospect (absolver_downfall_windfall) | Absolver: Downfall | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kahlt Prospect (absolver_downfall_khalt) | Absolver: Downfall | 1 | 16/16 | aucun manifeste mêlée dédié |
| Forsaken Prospect (absolver_downfall_forsaken) | Absolver: Downfall | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nimrod’s Soul (agony_2018_nimrod_soul) | Agony | 1 | 16/16 | aucun manifeste mêlée dédié |
| Martyr Vessel (agony_2018_martyr_vessel) | Agony | 1 | 16/16 | aucun manifeste mêlée dédié |
| Armored Demon Vessel (agony_2018_demon_vessel) | Agony | 1 | 16/16 | aucun manifeste mêlée dédié |
| Major Sergey “P-3” Nechaev (atomic_heart_p3) | Atomic Heart | 1 | 16/16 | aucun manifeste mêlée dédié |
| Granny Zina (atomic_heart_granny_zina) | Atomic Heart | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tereshkova (atomic_heart_tereshkova) | Atomic Heart | 1 | 16/16 | aucun manifeste mêlée dédié |
| Henry Stein (bendy_ink_machine_henry) | Bendy and the Ink Machine | 1 | 16/16 | aucun manifeste mêlée dédié |
| Boris the Wolf (bendy_ink_machine_boris) | Bendy and the Ink Machine | 1 | 16/16 | aucun manifeste mêlée dédié |
| Allison Angel (bendy_ink_machine_allison) | Bendy and the Ink Machine | 1 | 16/16 | aucun manifeste mêlée dédié |
| Putt-Putt — purple car (putt_putt_putt_putt_purple_car) | Putt-Putt | 1 | 16/16 | aucun manifeste mêlée dédié |
| Pep — brown puppy (putt_putt_pep_brown_puppy) | Putt-Putt | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rover — moon rover (putt_putt_rover_moon_rover) | Putt-Putt | 1 | 16/16 | aucun manifeste mêlée dédié |
| Maya — Phaselock (borderlands_2_maya_phaselock) | Borderlands 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Zer0 — Decepti0n (borderlands_2_zer0_decepti0n) | Borderlands 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Salvador — Gunzerking (borderlands_2_salvador_gunzerking) | Borderlands 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Resistance Medic (brink_resistance_medic) | BRINK | 1 | 16/16 | aucun manifeste mêlée dédié |
| Resistance Engineer (brink_resistance_engineer) | BRINK | 1 | 16/16 | aucun manifeste mêlée dédié |
| Resistance Operative (brink_resistance_operative) | BRINK | 1 | 16/16 | aucun manifeste mêlée dédié |
| Eddie Riggs (brutal_legend_eddie_riggs) | Brütal Legend | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ophelia (brutal_legend_ophelia) | Brütal Legend | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lars Halford (brutal_legend_lars_halford) | Brütal Legend | 1 | 16/16 | aucun manifeste mêlée dédié |
| Challenger — adult 20+, closed jacket (buckshot_roulette_challenger_adult_20_closed_jacket) | Buckshot Roulette | 1 | 16/16 | aucun manifeste mêlée dédié |
| Spotter — adult 20+, utility coat (buckshot_roulette_spotter_adult_20_utility_coat) | Buckshot Roulette | 1 | 16/16 | aucun manifeste mêlée dédié |
| Technician — adult 20+, coveralls (buckshot_roulette_technician_adult_20_coveralls) | Buckshot Roulette | 1 | 16/16 | aucun manifeste mêlée dédié |
| Archivist (choo_choo_charles_archivist) | Choo-Choo Charles | 1 | 16/16 | aucun manifeste mêlée dédié |
| Paul (choo_choo_charles_paul) | Choo-Choo Charles | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sgt. Flint (choo_choo_charles_sgt_flint) | Choo-Choo Charles | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nomad (crysis_nomad) | Crysis | 1 | 16/16 | aucun manifeste mêlée dédié |
| Prophet (crysis_prophet) | Crysis | 1 | 16/16 | aucun manifeste mêlée dédié |
| Psycho (crysis_psycho) | Crysis | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cuphead (cuphead_cuphead) | Cuphead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mugman (cuphead_mugman) | Cuphead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ms. Chalice (cuphead_ms_chalice) | Cuphead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hiro Miyamoto (daikatana_hiro_miyamoto) | Daikatana | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mikiko Ebihara (daikatana_mikiko_ebihara) | Daikatana | 1 | 16/16 | aucun manifeste mêlée dédié |
| Superfly Johnson (daikatana_superfly_johnson) | Daikatana | 1 | 16/16 | aucun manifeste mêlée dédié |
| Chosen Undead (dark_souls_chosen_undead) | Dark Souls | 1 | 16/16 | aucun manifeste mêlée dédié |
| Solaire (dark_souls_solaire) | Dark Souls | 1 | 16/16 | aucun manifeste mêlée dédié |
| Siegmeyer (dark_souls_siegmeyer) | Dark Souls | 1 | 16/16 | aucun manifeste mêlée dédié |
| Frank West (dead_rising_frank_west) | Dead Rising | 1 | 16/16 | aucun manifeste mêlée dédié |
| Chuck Greene (dead_rising_chuck_greene) | Dead Rising | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nick Ramos (dead_rising_nick_ramos) | Dead Rising | 1 | 16/16 | aucun manifeste mêlée dédié |
| Rufus (deponia_rufus) | Deponia | 1 | 16/16 | aucun manifeste mêlée dédié |
| Goal (deponia_goal) | Deponia | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bozo (deponia_bozo) | Deponia | 1 | 16/16 | aucun manifeste mêlée dédié |
| Adam Jensen (deus_ex_adam_jensen) | Deus Ex | 1 | 16/16 | aucun manifeste mêlée dédié |
| Faridah Malik (deus_ex_faridah_malik) | Deus Ex | 1 | 16/16 | aucun manifeste mêlée dédié |
| Alex Vega (deus_ex_alex_vega) | Deus Ex | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dante (devil_may_cry_dante) | Devil May Cry | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nero (devil_may_cry_nero) | Devil May Cry | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lady (devil_may_cry_lady) | Devil May Cry | 1 | 16/16 | aucun manifeste mêlée dédié |
| A-Sync Researcher (backrooms_kane_a_sync_researcher) | The Backrooms — Kane Pixels | 1 | 16/16 | aucun manifeste mêlée dédié |
| Missing Cameraperson (backrooms_kane_missing_cameraperson) | The Backrooms — Kane Pixels | 1 | 16/16 | aucun manifeste mêlée dédié |
| Threshold Technician (backrooms_kane_threshold_technician) | The Backrooms — Kane Pixels | 1 | 16/16 | aucun manifeste mêlée dédié |
| Markov (evolve_markov) | Evolve | 1 | 16/16 | aucun manifeste mêlée dédié |
| Val (evolve_val) | Evolve | 1 | 16/16 | aucun manifeste mêlée dédié |
| Maggie (evolve_maggie) | Evolve | 1 | 16/16 | aucun manifeste mêlée dédié |
| Culter Dei Operative (eye_divine_culter_dei_operative) | E.Y.E: Divine Cybermancy | 1 | 16/16 | aucun manifeste mêlée dédié |
| The Mentor (eye_divine_the_mentor) | E.Y.E: Divine Cybermancy | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dutch (eye_divine_dutch) | E.Y.E: Divine Cybermancy | 1 | 16/16 | aucun manifeste mêlée dédié |
| Point Man (fear_point_man) | F.E.A.R. | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jin Sun-Kwon (fear_jin_sun_kwon) | F.E.A.R. | 1 | 16/16 | aucun manifeste mêlée dédié |
| Douglas Holiday (fear_douglas_holiday) | F.E.A.R. | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lucky Contestant (finding_frankie_lucky_contestant) | Finding Frankie | 1 | 16/16 | aucun manifeste mêlée dédié |
| Deputy Duck (finding_frankie_deputy_duck) | Finding Frankie | 1 | 16/16 | aucun manifeste mêlée dédié |
| Noob Noob (finding_frankie_noob_noob) | Finding Frankie | 1 | 16/16 | aucun manifeste mêlée dédié |
| Freddi Fish (freddi_fish_freddi) | Freddi Fish | 1 | 16/16 | aucun manifeste mêlée dédié |
| Luther (freddi_fish_luther) | Freddi Fish | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cousin Calico (freddi_fish_cousin_calico) | Freddi Fish | 1 | 16/16 | aucun manifeste mêlée dédié |
| Woods (gtfo_woods) | GTFO | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dauda (gtfo_dauda) | GTFO | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hackett (gtfo_hackett) | GTFO | 1 | 16/16 | aucun manifeste mêlée dédié |
| CR-T Recruit (hawken_crt_recruit) | HAWKEN | 1 | 16/16 | aucun manifeste mêlée dédié |
| Assault Pilot (hawken_assault_pilot) | HAWKEN | 1 | 16/16 | aucun manifeste mêlée dédié |
| Technician Pilot (hawken_technician_pilot) | HAWKEN | 1 | 16/16 | aucun manifeste mêlée dédié |
| Haydee — Green-Zone Loadout (haydee_safe_green_loadout) | Haydee — Safe Adaptation | 1 | 16/16 | aucun manifeste mêlée dédié |
| Haydee — Red-Zone Loadout (haydee_safe_red_loadout) | Haydee — Safe Adaptation | 1 | 16/16 | aucun manifeste mêlée dédié |
| Haydee — Blue-Zone Loadout (haydee_safe_blue_loadout) | Haydee — Safe Adaptation | 1 | 16/16 | aucun manifeste mêlée dédié |
| Senua (hellblade_senua) | Hellblade: Senua’s Sacrifice | 1 | 16/16 | aucun manifeste mêlée dédié |
| Druth (hellblade_druth) | Hellblade: Senua’s Sacrifice | 1 | 16/16 | aucun manifeste mêlée dédié |
| Dillion (hellblade_dillion) | Hellblade: Senua’s Sacrifice | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nicky Roth (hello_neighbor_nicky_roth) | Hello Neighbor | 1 | 16/16 | aucun manifeste mêlée dédié |
| Aaron Peterson (hello_neighbor_aaron_peterson) | Hello Neighbor | 1 | 16/16 | aucun manifeste mêlée dédié |
| Quentin (hello_neighbor_quentin) | Hello Neighbor | 1 | 16/16 | aucun manifeste mêlée dédié |
| Agent 47 (hitman_woa_agent_47) | HITMAN — World of Assassination | 1 | 16/16 | aucun manifeste mêlée dédié |
| Diana Burnwood (hitman_woa_diana_burnwood) | HITMAN — World of Assassination | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lucas Grey (hitman_woa_lucas_grey) | HITMAN — World of Assassination | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sam Fisher (splinter_cell_sam_fisher) | Tom Clancy’s Splinter Cell | 1 | 16/16 | aucun manifeste mêlée dédié |
| Anna “Grim” Grímsdóttir (splinter_cell_anna_grim) | Tom Clancy’s Splinter Cell | 1 | 16/16 | aucun manifeste mêlée dédié |
| Isaac Briggs (splinter_cell_isaac_briggs) | Tom Clancy’s Splinter Cell | 1 | 16/16 | aucun manifeste mêlée dédié |
| Meat Boy (super_meat_boy_meat_boy) | Super Meat Boy | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bandage Girl (super_meat_boy_bandage_girl) | Super Meat Boy | 1 | 16/16 | aucun manifeste mêlée dédié |
| Brownie (super_meat_boy_brownie) | Super Meat Boy | 1 | 16/16 | aucun manifeste mêlée dédié |
| CommanderVideo (bit_trip_commander_video) | BIT.TRIP | 1 | 16/16 | aucun manifeste mêlée dédié |
| CommandGirlVideo (bit_trip_commandgirl_video) | BIT.TRIP | 1 | 16/16 | aucun manifeste mêlée dédié |
| Radbot (bit_trip_radbot) | BIT.TRIP | 1 | 16/16 | aucun manifeste mêlée dédié |
| Marine Rifleman - armure ITO (interstellar_marines_marine_rifleman_armure_ito) | Interstellar Marines | 1 | 16/16 | aucun manifeste mêlée dédié |
| Marine Medic - soutien (interstellar_marines_marine_medic_soutien) | Interstellar Marines | 1 | 16/16 | aucun manifeste mêlée dédié |
| Marine Recon - capteurs (interstellar_marines_marine_recon_capteurs) | Interstellar Marines | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jago - epee (killer_instinct_jago_epee) | Killer Instinct | 1 | 16/16 | aucun manifeste mêlée dédié |
| Orchid - tonfas (killer_instinct_orchid_tonfas) | Killer Instinct | 1 | 16/16 | aucun manifeste mêlée dédié |
| T.J. Combo - boxe (killer_instinct_t_j_combo_boxe) | Killer Instinct | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mr Foster - masque a gaz (killing_floor_2_mr_foster_masque_a_gaz) | Killing Floor 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ana Larive - punk violette (killing_floor_2_ana_larive_punk_violette) | Killing Floor 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| DJ Scully - DJ masque (killing_floor_2_dj_scully_dj_masque) | Killing Floor 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Blue Wizard - foudre (magicka_blue_wizard_foudre) | Magicka | 1 | 16/16 | aucun manifeste mêlée dédié |
| Red Wizard - feu (magicka_red_wizard_feu) | Magicka | 1 | 16/16 | aucun manifeste mêlée dédié |
| Yellow Wizard - froid (magicka_yellow_wizard_froid) | Magicka | 1 | 16/16 | aucun manifeste mêlée dédié |
| Max Payne - Bullet Time (max_payne_2_max_payne_bullet_time) | Max Payne 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Mona Sax - sniper (max_payne_2_mona_sax_sniper) | Max Payne 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jim Bravura - enquete (max_payne_2_jim_bravura_enquete) | Max Payne 2 | 1 | 16/16 | aucun manifeste mêlée dédié |
| Marco Rossi (metal_slug_marco_rossi) | Metal Slug | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tarma Roving (metal_slug_tarma_roving) | Metal Slug | 1 | 16/16 | aucun manifeste mêlée dédié |
| Eri Kasamoto (metal_slug_eri_kasamoto) | Metal Slug | 1 | 16/16 | aucun manifeste mêlée dédié |
| Faith Connors - gant rouge (mirrors_edge_faith_connors_gant_rouge) | Mirror's Edge | 1 | 16/16 | aucun manifeste mêlée dédié |
| Celeste - Runner sombre (mirrors_edge_celeste_runner_sombre) | Mirror's Edge | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kate Connors - soutien (mirrors_edge_kate_connors_soutien) | Mirror's Edge | 1 | 16/16 | aucun manifeste mêlée dédié |
| Turner - lapin brun (overgrowth_turner_lapin_brun) | Overgrowth | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sky - lapine grise (overgrowth_sky_lapine_grise) | Overgrowth | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sun - lapine doree (overgrowth_sun_lapine_doree) | Overgrowth | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lamball (palworld_lamball) | Palworld | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cattiva (palworld_cattiva) | Palworld | 1 | 16/16 | aucun manifeste mêlée dédié |
| Lifmunk (palworld_lifmunk) | Palworld | 1 | 16/16 | aucun manifeste mêlée dédié |
| Adrienne Delaney - illustree (phantasmagoria_adrienne_delaney_illustree) | Phantasmagoria | 1 | 16/16 | aucun manifeste mêlée dédié |
| Harriet - illustree (phantasmagoria_harriet_illustree) | Phantasmagoria | 1 | 16/16 | aucun manifeste mêlée dédié |
| Malcolm Wyrmshadow - illustre (phantasmagoria_malcolm_wyrmshadow_illustre) | Phantasmagoria | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sam - deduction (sam_and_max_sam_deduction) | Sam & Max | 1 | 16/16 | aucun manifeste mêlée dédié |
| Max - chaos (sam_and_max_max_chaos) | Sam & Max | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sybil Pandemik - expertise (sam_and_max_sybil_pandemik_expertise) | Sam & Max | 1 | 16/16 | aucun manifeste mêlée dédié |
| Postal Dude - Classic (postal_postal_dude_classic) | Postal | 1 | 16/16 | aucun manifeste mêlée dédié |
| Postal Dude - Apocalypse Weekend (postal_postal_dude_apocalypse_weekend) | Postal | 1 | 16/16 | aucun manifeste mêlée dédié |
| Postal Dude - Brain-Damaged (postal_postal_dude_brain_damaged) | Postal | 1 | 16/16 | aucun manifeste mêlée dédié |
| Assault Survivor (pubg_assault_survivor) | PUBG | 1 | 16/16 | aucun manifeste mêlée dédié |
| Scout Survivor (pubg_scout_survivor) | PUBG | 1 | 16/16 | aucun manifeste mêlée dédié |
| Medic Survivor (pubg_medic_survivor) | PUBG | 1 | 16/16 | aucun manifeste mêlée dédié |
| Francois d Arc - 1430 (la_petite_histoire_de_france_francois_d_arc_1430) | La Petite Histoire de France | 1 | 16/16 | aucun manifeste mêlée dédié |
| Philippe Honore de Roche Saint-Pierre - 1695 (la_petite_histoire_de_france_philippe_honore_de_roche_saint_pierre_1695) | La Petite Histoire de France | 1 | 16/16 | aucun manifeste mêlée dédié |
| Renata Plancher - 1810 (la_petite_histoire_de_france_renata_plancher_1810) | La Petite Histoire de France | 1 | 16/16 | aucun manifeste mêlée dédié |
| Laurie Strode - survivante (halloween_2018_laurie_strode_survivante) | Halloween | 1 | 16/16 | aucun manifeste mêlée dédié |
| Karen Nelson - defense (halloween_2018_karen_nelson_defense) | Halloween | 1 | 16/16 | aucun manifeste mêlée dédié |
| Allyson Nelson - evasion (halloween_2018_allyson_nelson_evasion) | Halloween | 1 | 16/16 | aucun manifeste mêlée dédié |
| Parker - mineur rebelle (red_faction_parker_mineur_rebelle) | Red Faction | 1 | 16/16 | aucun manifeste mêlée dédié |
| Eos - resistance (red_faction_eos_resistance) | Red Faction | 1 | 16/16 | aucun manifeste mêlée dédié |
| Alec Mason - demolition (red_faction_alec_mason_demolition) | Red Faction | 1 | 16/16 | aucun manifeste mêlée dédié |
| Nilin - chasseuse de memoires (remember_me_nilin_chasseuse_de_memoires) | Remember Me | 1 | 16/16 | aucun manifeste mêlée dédié |
| Edge - liaison Errorist (remember_me_edge_liaison_errorist) | Remember Me | 1 | 16/16 | aucun manifeste mêlée dédié |
| Bad Request - infiltration (remember_me_bad_request_infiltration) | Remember Me | 1 | 16/16 | aucun manifeste mêlée dédié |
| Orange Semibot (repo_orange_semibot) | R.E.P.O. | 1 | 16/16 | aucun manifeste mêlée dédié |
| Blue Semibot (repo_blue_semibot) | R.E.P.O. | 1 | 16/16 | aucun manifeste mêlée dédié |
| Green Semibot (repo_green_semibot) | R.E.P.O. | 1 | 16/16 | aucun manifeste mêlée dédié |
| B.J. Blazkowicz (wolfenstein_machinegames_b_j_blazkowicz) | Wolfenstein | 1 | 16/16 | aucun manifeste mêlée dédié |
| Anya Oliwa (wolfenstein_machinegames_anya_oliwa) | Wolfenstein | 1 | 16/16 | aucun manifeste mêlée dédié |
| Set Roth (wolfenstein_machinegames_set_roth) | Wolfenstein | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sisyphus (rock_of_ages_sisyphus) | Rock of Ages | 1 | 16/16 | aucun manifeste mêlée dédié |
| Atlas (rock_of_ages_atlas) | Rock of Ages | 1 | 16/16 | aucun manifeste mêlée dédié |
| Elpenor (rock_of_ages_elpenor) | Rock of Ages | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sam Stone (serious_sam_sam_stone) | Serious Sam | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hellfire (serious_sam_hellfire) | Serious Sam | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kenny (serious_sam_kenny) | Serious Sam | 1 | 16/16 | aucun manifeste mêlée dédié |
| Parasoul (skullgirls_parasoul) | Skullgirls | 1 | 16/16 | aucun manifeste mêlée dédié |
| Big Band (skullgirls_big_band) | Skullgirls | 1 | 16/16 | aucun manifeste mêlée dédié |
| Beowulf (skullgirls_beowulf) | Skullgirls | 1 | 16/16 | aucun manifeste mêlée dédié |
| Eric LeBlanc (the_forest_eric_leblanc) | The Forest | 1 | 16/16 | aucun manifeste mêlée dédié |
| Co-op Survivor A (the_forest_co_op_survivor_a) | The Forest | 1 | 16/16 | aucun manifeste mêlée dédié |
| Co-op Survivor B (the_forest_co_op_survivor_b) | The Forest | 1 | 16/16 | aucun manifeste mêlée dédié |
| Spy Fox (spy_fox_spy_fox) | Spy Fox | 1 | 16/16 | aucun manifeste mêlée dédié |
| Monkey Penny (spy_fox_monkey_penny) | Spy Fox | 1 | 16/16 | aucun manifeste mêlée dédié |
| Professor Quack (spy_fox_professor_quack) | Spy Fox | 1 | 16/16 | aucun manifeste mêlée dédié |
| Squirrel - Pistol Build (squirrel_with_a_gun_squirrel_pistol_build) | Squirrel with a Gun | 1 | 16/16 | aucun manifeste mêlée dédié |
| Squirrel - SMG Build (squirrel_with_a_gun_squirrel_smg_build) | Squirrel with a Gun | 1 | 16/16 | aucun manifeste mêlée dédié |
| Squirrel - Shotgun Build (squirrel_with_a_gun_squirrel_shotgun_build) | Squirrel with a Gun | 1 | 16/16 | aucun manifeste mêlée dédié |
| Hotswitch Build (superhot_hotswitch_build) | SUPERHOT | 1 | 16/16 | aucun manifeste mêlée dédié |
| Charge Build (superhot_charge_build) | SUPERHOT | 1 | 16/16 | aucun manifeste mêlée dédié |
| Recall Build (superhot_recall_build) | SUPERHOT | 1 | 16/16 | aucun manifeste mêlée dédié |
| Unnamed Archaeologist (the_ball_unnamed_archaeologist) | The Ball | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ball Push Configuration (the_ball_ball_push_configuration) | The Ball | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ball Pull Configuration (the_ball_ball_pull_configuration) | The Ball | 1 | 16/16 | aucun manifeste mêlée dédié |
| Isaac (binding_of_isaac_rebirth_isaac) | The Binding of Isaac: Rebirth | 1 | 16/16 | aucun manifeste mêlée dédié |
| Magdalene (binding_of_isaac_rebirth_magdalene) | The Binding of Isaac: Rebirth | 1 | 16/16 | aucun manifeste mêlée dédié |
| Cain (binding_of_isaac_rebirth_cain) | The Binding of Isaac: Rebirth | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jackie Estacado (the_darkness_jackie_estacado) | The Darkness | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jenny Romano - soutien (the_darkness_jenny_romano_soutien) | The Darkness | 1 | 16/16 | aucun manifeste mêlée dédié |
| Johnny Powell - soutien (the_darkness_johnny_powell_soutien) | The Darkness | 1 | 16/16 | aucun manifeste mêlée dédié |
| Warren (the_surge_warren) | The Surge | 1 | 16/16 | aucun manifeste mêlée dédié |
| Irina Beckett (the_surge_irina_beckett) | The Surge | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sally - AI support (the_surge_sally_ai_support) | The Surge | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tal’Set — Turok (turok_tal_set_turok) | Turok | 1 | 16/16 | aucun manifeste mêlée dédié |
| Joshua Fireseed — Turok (turok_joshua_fireseed_turok) | Turok | 1 | 16/16 | aucun manifeste mêlée dédié |
| Adon (turok_adon) | Turok | 1 | 16/16 | aucun manifeste mêlée dédié |
| Wallace (wallace_gromit_wallace) | Wallace & Gromit | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gromit (wallace_gromit_gromit) | Wallace & Gromit | 1 | 16/16 | aucun manifeste mêlée dédié |
| Wendolene Ramsbottom (wallace_gromit_wendolene_ramsbottom) | Wallace & Gromit | 1 | 16/16 | aucun manifeste mêlée dédié |
| Boggy B (worms_boggy_b) | Worms | 1 | 16/16 | aucun manifeste mêlée dédié |
| Spadge (worms_spadge) | Worms | 1 | 16/16 | aucun manifeste mêlée dédié |
| Clagnut (worms_clagnut) | Worms | 1 | 16/16 | aucun manifeste mêlée dédié |
| La Petite Patate (amazing_patate_show_la_petite_patate) | The Amazing Patate Show | 1 | 16/16 | aucun manifeste mêlée dédié |
| La Patate Musicienne (amazing_patate_show_la_patate_musicienne) | The Amazing Patate Show | 1 | 16/16 | aucun manifeste mêlée dédié |
| La Patate Danseuse (amazing_patate_show_la_patate_danseuse) | The Amazing Patate Show | 1 | 16/16 | aucun manifeste mêlée dédié |
| Blitzo (helluva_boss_blitzo) | Helluva Boss | 1 | 16/16 | aucun manifeste mêlée dédié |
| Moxxie (helluva_boss_moxxie) | Helluva Boss | 1 | 16/16 | aucun manifeste mêlée dédié |
| Millie (helluva_boss_millie) | Helluva Boss | 1 | 16/16 | aucun manifeste mêlée dédié |
| Uzi Doorman (murder_drones_uzi_doorman) | Murder Drones | 1 | 16/16 | aucun manifeste mêlée dédié |
| Serial Designation N (murder_drones_serial_designation_n) | Murder Drones | 1 | 16/16 | aucun manifeste mêlée dédié |
| V (murder_drones_v) | Murder Drones | 1 | 16/16 | aucun manifeste mêlée dédié |
| Magia Magenta — Adult 20+ Reinterpretation (gushing_magical_girls_safe_magenta_adult) | Gushing over Magical Girls — Safe Adult Reinterpretation | 1 | 16/16 | aucun manifeste mêlée dédié |
| Magia Azure — Adult 20+ Reinterpretation (gushing_magical_girls_safe_azure_adult) | Gushing over Magical Girls — Safe Adult Reinterpretation | 1 | 16/16 | aucun manifeste mêlée dédié |
| Magia Sulfur — Adult 20+ Reinterpretation (gushing_magical_girls_safe_sulfur_adult) | Gushing over Magical Girls — Safe Adult Reinterpretation | 1 | 16/16 | aucun manifeste mêlée dédié |
| Peepoodo — Safe Mascot (peepoodo_safe_peepoodo_safe_mascot) | Peepoodo — Safe Educational Adaptation | 1 | 16/16 | aucun manifeste mêlée dédié |
| Evelyn — Safe Mascot (peepoodo_safe_evelyn_safe_mascot) | Peepoodo — Safe Educational Adaptation | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kevin — Safe Mascot (peepoodo_safe_kevin_safe_mascot) | Peepoodo — Safe Educational Adaptation | 1 | 16/16 | aucun manifeste mêlée dédié |
| L’Assistante sociale (les_kassos_l_assistante_sociale) | Les Kassos | 1 | 16/16 | aucun manifeste mêlée dédié |
| Serge le Lapin — Original Parody (les_kassos_serge_le_lapin_original_parody) | Les Kassos | 1 | 16/16 | aucun manifeste mêlée dédié |
| Monsieur Patatos — Original Parody (les_kassos_monsieur_patatos_original_parody) | Les Kassos | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ms. Marvel (marvel_zombies_mcu_ms_marvel) | Marvel Zombies — MCU Animation | 1 | 16/16 | aucun manifeste mêlée dédié |
| Kate Bishop (marvel_zombies_mcu_kate_bishop) | Marvel Zombies — MCU Animation | 1 | 16/16 | aucun manifeste mêlée dédié |
| Blade Knight (marvel_zombies_mcu_blade_knight) | Marvel Zombies — MCU Animation | 1 | 16/16 | aucun manifeste mêlée dédié |
| Eleven (stranger_things_eleven) | Stranger Things | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jim Hopper (stranger_things_jim_hopper) | Stranger Things | 1 | 16/16 | aucun manifeste mêlée dédié |
| Joyce Byers (stranger_things_joyce) | Stranger Things | 1 | 16/16 | aucun manifeste mêlée dédié |
| Invincible (invincible_invincible) | Invincible | 1 | 16/16 | aucun manifeste mêlée dédié |
| Atom Eve (invincible_atom_eve) | Invincible | 1 | 16/16 | aucun manifeste mêlée dédié |
| Robot (invincible_robot) | Invincible | 1 | 16/16 | aucun manifeste mêlée dédié |
| Yugo (wakfu_yugo) | Wakfu | 1 | 16/16 | aucun manifeste mêlée dédié |
| Amalia Sheran Sharm (wakfu_amalia_sheran_sharm) | Wakfu | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sir Percedal of Sadlygrove (wakfu_sir_percedal_of_sadlygrove) | Wakfu | 1 | 16/16 | aucun manifeste mêlée dédié |
| Oggy (oggy_cockroaches_oggy) | Oggy et les Cafards | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jack (oggy_cockroaches_jack) | Oggy et les Cafards | 1 | 16/16 | aucun manifeste mêlée dédié |
| Olivia (oggy_cockroaches_olivia) | Oggy et les Cafards | 1 | 16/16 | aucun manifeste mêlée dédié |
| Etno Polino (zinzins_espace_etno_polino) | Les Zinzins de l’espace | 1 | 16/16 | aucun manifeste mêlée dédié |
| Candy Caramella (zinzins_espace_candy_caramella) | Les Zinzins de l’espace | 1 | 16/16 | aucun manifeste mêlée dédié |
| Gorgious Klatoo (zinzins_espace_gorgious_klatoo) | Les Zinzins de l’espace | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sally Hardesty (texas_chain_saw_sally_hardesty) | The Texas Chain Saw Massacre | 1 | 16/16 | aucun manifeste mêlée dédié |
| Franklin Hardesty (texas_chain_saw_franklin) | The Texas Chain Saw Massacre | 1 | 16/16 | aucun manifeste mêlée dédié |
| Jerry (texas_chain_saw_jerry) | The Texas Chain Saw Massacre | 1 | 16/16 | aucun manifeste mêlée dédié |
| Alice Hardy (friday_13th_alice_hardy) | Friday the 13th | 1 | 16/16 | aucun manifeste mêlée dédié |
| Tommy Jarvis (friday_13th_tommy_jarvis) | Friday the 13th | 1 | 16/16 | aucun manifeste mêlée dédié |
| Ginny Field (friday_13th_ginny) | Friday the 13th | 1 | 16/16 | aucun manifeste mêlée dédié |
| Truman Burbank (truman_show_truman_burbank) | The Truman Show | 1 | 16/16 | aucun manifeste mêlée dédié |
| Sylvia / Lauren Garland (truman_show_sylvia_lauren_garland) | The Truman Show | 1 | 16/16 | aucun manifeste mêlée dédié |
| Marlon (truman_show_marlon) | The Truman Show | 1 | 16/16 | aucun manifeste mêlée dédié |
| Torbahead Reel Persona (torbahead_torbahead_reel_persona) | Torbahead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Daily Greeting Caption (torbahead_daily_greeting_caption) | Torbahead | 1 | 16/16 | aucun manifeste mêlée dédié |
| Community Remix Curator (torbahead_community_remix_curator) | Torbahead | 1 | 16/16 | aucun manifeste mêlée dédié |
