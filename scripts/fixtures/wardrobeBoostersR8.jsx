import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import PortalScreen from '../../src/components/PortalScreen.jsx';
import CharacterWardrobe from '../../src/components/CharacterWardrobe.jsx';
import { HEROES_DB } from '../../src/game/heroes.js';
import { PERMANENT_OC_BOOSTERS } from '../../src/game/portalBoosterCatalog.js';
import { getWardrobeBoosterPool } from '../../src/game/wardrobeBoosterRewards.js';
import { buildCardSetId } from '../../src/game/cards/cardSchema.js';
import '../../src/index.css';
const params = new URLSearchParams(location.search);
const lang = params.get('lang') === 'en' ? 'en' : 'fr';
const scenario = params.get('scenario') || 'paid';
const universe = 'Nexus de Convergence';
const visible = [universe, 'Alien', 'Metal Gear Rising'];
const hidden = [...new Set(HEROES_DB.map(h => h.universe))].filter(u => !visible.includes(u));
const disabled = {};
const initialPool = getWardrobeBoosterPool({banner:PERMANENT_OC_BOOSTERS[0],visibleUniverses:visible});
const setId = buildCardSetId({universe});
function Fixture() {
  const [shards, setShards] = useState(scenario === 'insufficient' ? 0 : 10000);
  const [inventory, setInventory] = useState(scenario === 'complete' ? initialPool.map(e=>e.id) : []);
  const [heroes, setHeroes] = useState(['player_anchor']);
  const [stats, setStats] = useState({history:[],packsOpened:0,pulls:0});
  const [collection, setCollection] = useState({cards:{},freeBoosterCredits:scenario === 'free' ? {[setId]:1} : {}});
  const [epoch,setEpoch] = useState(0);
  useEffect(() => {
    window.__r8Probe = {shards,inventory,heroes,stats,collection,
      rights:inventory.filter(id=>id.startsWith('wardrobe-v1:')),pool:initialPool.map(e=>e.id)};
    window.__r8Remount = () => setEpoch(x=>x+1);
  },[shards,inventory,heroes,stats,collection]);
  const actor = HEROES_DB.find(h=>h.id==='arca_mirelle');
  return <main><div data-testid="wardrobe-owned"><CharacterWardrobe actor={actor} lang={lang} inventory={inventory} readOnly/></div>
    <PortalScreen key={epoch} lang={lang} breachShards={shards} setBreachShards={setShards}
      portalStats={stats} setPortalStats={setStats} portalCollection={collection} setPortalCollection={setCollection}
      unlockedHeroes={heroes} setUnlockedHeroes={setHeroes} inventory={inventory} setInventory={setInventory}
      hiddenUniverses={hidden} disabledAssets={disabled} onBack={()=>{}}/>
  </main>;
}
createRoot(document.getElementById('root')).render(<Fixture/>);
