import json,pathlib,hashlib
R=pathlib.Path('/workspace/multiverse-breach');D=R/'docs/combat-fidelity-wave15-2026-10-26/part-b';p=json.loads((D/'source-plan-effective.json').read_text());rows=p['entries'];S=R/'src/game/combat'
j=lambda a:json.dumps(a,ensure_ascii=False,indent=2)
# All values are explicit source selections, not generated from roster category.
source={e['heroId']:{k:v for k,v in e.items() if k not in ['heroId','simpleName','secondaryName','defenseName','alreadyAuthored','nameAction']} for e in rows}
(S/'combatSourceDefinitionsWave15PartB.js').write_text('// Source selections frozen before native generation. Generated adaptations, never certified official frames.\nexport const COMBAT_SOURCE_DEFINITIONS_WAVE15_PART_B = Object.freeze('+j(source)+');\n')
abilities={}
for i,e in enumerate(rows):
 id=e['heroId'];d=e['delivery'];eff=e['effect'];melee=d=='melee';support=d=='support'
 def act(name,mult,effect,delivery,ran,**more):
  return {'name':name,'type':'guard' if effect=='guard' else 'buff' if effect=='buff' else 'melee' if delivery=='melee' else 'projectile','dmg':mult,'animationDuration':.55,'hitAt':.2,'targeting':{'effect':effect,'delivery':delivery,'shape':'group' if effect in ['guard','buff'] and ran>1 else 'single','range':ran,'targetSide':'enemy' if effect=='damage' else 'self' if ran==1 else 'ally',**more}}
 if support:
  opts={'duration':3,'reduce':.22} if eff=='guard' else {'duration':3,'buffMultiplier':1.12}
  simple=act(e['simpleName'],0,eff,'support',760,**opts)
  secondary=act(e['secondaryName'],0,eff,'support',760,**({'duration':3.5,'reduce':.28} if eff=='guard' else {'duration':3.5,'buffMultiplier':1.18}))
  special=act(e['actionName'],0,eff,'support',760,**({'duration':4,'reduce':.38} if eff=='guard' else {'duration':4,'buffMultiplier':1.25}))
 else:
  ran=(70 if id=='gon_tekken' else 105 if id in ['true_ogre_tekken','nightmare_sc','siegfried_sc'] else 85) if melee else 480
  srange=(120 if id=='gon_tekken' else 185 if id in ['true_ogre_tekken','nightmare_sc','siegfried_sc','ivy_sc'] else 165) if melee else 640
  simple=act(e['simpleName'],1.1 if melee else 1.15,'damage',d,ran)
  secondary=act(e['secondaryName'],1.9 if melee else 1.85,'damage',d,ran+20 if melee else 520)
  special=act(e['actionName'],4.65,'damage',d,srange)
 secondary['cd']=6 if not support else 8
 defense=act(e['defenseName'],0,'guard','support',1,duration=1.2,reduce=.5)
 defense.update({'reduce':.5,'dur':1.2})
 special.update({'animationDuration':1.1,'hitAt':.451,'meterCost':100})
 if id=='borderlands_2_maya_phaselock':
  simple=act(e['simpleName'],1.1,'damage','melee',85)
  secondary={'name':e['secondaryName'],'type':'control','dmg':0,'cd':8,'animationDuration':.7,'hitAt':.26,'targeting':{'effect':'control','delivery':'control','shape':'single','range':480,'targetSide':'enemy','minTargets':1,'controlKind':'phaselock','controlDuration':1.2,'controlTurns':1}}
  special={'name':e['actionName'],'type':'control','dmg':0,'animationDuration':1.1,'hitAt':.451,'meterCost':100,'targeting':{'effect':'control','delivery':'control','shape':'single','range':480,'targetSide':'enemy','minTargets':1,'controlKind':'phaselock','controlDuration':2.4,'controlTurns':1}}

 abilities[id]={'sourceHeroId':id,'universe':e['universe'],'sourceWork':e['sourceWork'],'sourceUrl':e['sourceReference'],'sourceReference':e['sourceWork']+'. '+e['appearance']+'. '+e['notes'],'identityBasis':'canonical-role','canonicalVerified':False,'networkVerified':False,'source1to1Verified':False,'gameplayAdaptation':True,'simple':simple,'secondary':secondary,'defense':defense,'defenseName':defense['name'],'special':special}
(S/'abilities/abilitiesWave15PartB.js').write_text('// All40 selected kits. Central W15 composition separates new records and source revisions from the frozen plan.\nexport const ABILITIES_WAVE15_PART_B = Object.freeze('+j(abilities)+');\nexport const ABILITY_REVISIONS_WAVE15_PART_B = Object.freeze({});\n')
recipes=[]
for e in rows:
 n=e['displayName'];a=e['actionName'];support=e['delivery']=='support'
 recipes.append([e['heroId'],e['universe'],e['sourceWork']+'. '+e['sourceReference']+'. Selected generated adaptation; source 1:1 not certified.',a,[n+' : préparation de '+e['weapon'],n+' : relâchement de la posture',a+(', consigne sans dégât' if support else ', démonstration locale sans adversaire'),n+' : retour au calme après victoire',n+' : reprise d’appui après défaite',n+' : préparation de la manche suivante',n+' : récupération entre deux manches'],['nativeWave15Scene']*7,e['kind'],[]])
(S/'presentationCatalogWave15PartB.js').write_text('export const WAVE_15_PART_B_PRESENTATION_DEFINITIONS = '+j(recipes)+';\n')
# Explicit same-universe partner selection. Alternate-era versions remain declared gameplay relays.
partners={
'baiken':'millia_rage','millia_rage':'baiken','yoshimitsu_tekken':'gon_tekken','true_ogre_tekken':'yoshimitsu_tekken','gon_tekken':'yoshimitsu_tekken',
'nightmare_sc':'siegfried_sc','siegfried_sc':'ivy_sc','ivy_sc':'siegfried_sc','axel_sor':'blaze_sor','blaze_sor':'axel_sor','adam_sor':'axel_sor',
'like_a_dragon_kazuma_kiryu':'like_a_dragon_goro_majima','like_a_dragon_ichiban_kasuga':'like_a_dragon_kazuma_kiryu','like_a_dragon_goro_majima':'like_a_dragon_kazuma_kiryu',
'yorha_2b':'yorha_9s','yorha_9s':'yorha_2b','yorha_a2':'yorha_2b','brutal_legend_eddie_riggs':'brutal_legend_lars_halford','brutal_legend_ophelia':'brutal_legend_eddie_riggs','brutal_legend_lars_halford':'brutal_legend_eddie_riggs',
'killer_instinct_jago_epee':'killer_instinct_orchid_tonfas','killer_instinct_orchid_tonfas':'killer_instinct_t_j_combo_boxe','killer_instinct_t_j_combo_boxe':'killer_instinct_orchid_tonfas',
'magicka_blue_wizard_foudre':'magicka_red_wizard_feu','magicka_red_wizard_feu':'magicka_yellow_wizard_froid','magicka_yellow_wizard_froid':'magicka_blue_wizard_foudre',
'metal_slug_marco_rossi':'metal_slug_tarma_roving','metal_slug_tarma_roving':'metal_slug_eri_kasamoto','metal_slug_eri_kasamoto':'metal_slug_marco_rossi',
'goemons_great_adventure_goemon':'goemons_great_adventure_ebisumaru','goemons_great_adventure_ebisumaru':'goemons_great_adventure_yae','goemons_great_adventure_yae':'goemons_great_adventure_goemon',
'sir_daniel_fortesque':'medievil_kiya','medievil_kiya':'sir_daniel_fortesque','borderlands_2_maya_phaselock':'borderlands_2_zer0_decepti0n','borderlands_2_zer0_decepti0n':'borderlands_2_salvador_gunzerking','borderlands_2_salvador_gunzerking':'borderlands_2_maya_phaselock','turok_tal_set_turok':'turok_adon','turok_joshua_fireseed_turok':'turok_adon','turok_adon':'turok_joshua_fireseed_turok'}
assert len(partners)==40
byid={e['heroId']:e for e in rows}
assert all(k!=v and byid[k]['universe']==byid[v]['universe'] for k,v in partners.items())
(S/'rosterReinforcementsWave15PartB.js').write_text('// Same-universe non-self engine relays; not claims of canonical invocation or historical alliance.\nexport const ROSTER_REINFORCEMENTS_WAVE15_PART_B = Object.freeze('+j({k:{'universe':byid[k]['universe'],'performerHeroId':v,'slot':'special','sourceWave':15} for k,v in partners.items()})+');\n')
for n in ['characterAnimationsWave15PartB.generated.json','characterSpriteCorrectionsWave15PartB.generated.json']:
 f=S/n
 if not f.exists():f.write_text(j({'schemaVersion':1,'source':'OpenAI','entries':[]})+'\n')
f=S/'nativeSuperAnchorsWave15PartB.generated.json'
if not f.exists():f.write_text('{}\n')
(D/'kit-targeting.json').write_text(j({'sourcePlanSha256':hashlib.sha256((D/'source-plan.json').read_bytes()).hexdigest(),'records':abilities})+'\n')
print('40 source definitions,40 kits/160slots,40recipes,40nonself partners written')
