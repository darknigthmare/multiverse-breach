import test from 'node:test';
import assert from 'node:assert/strict';
import { UNIVERSE_HUB_PLACES, getUniverseHubPlace } from '../src/game/mosaicUniversePlaces.js';
for(const [name,source] of Object.entries(UNIVERSE_HUB_PLACES)) test(`city ambience localized without changing geometry: ${name}`,()=>{
 const fr=getUniverseHubPlace(name,'fr'),en=getUniverseHubPlace(name,'en');
 assert.equal(fr.name,source.fr);assert.equal(en.name,source.en);
 assert.equal(fr.type,en.type);assert.equal(fr.mood,source.mood);assert.notEqual(fr.mood,en.mood);
});
test('family fallback moods follow the language while preserving the current names',()=>{
 for(const name of ['Stargate Atlantis','Final Fantasy VIII','Resident Evil 2']){
  const fr=getUniverseHubPlace(name,'fr'),en=getUniverseHubPlace(name,'en');assert.notEqual(fr.mood,en.mood);assert.equal(fr.type,en.type);
 }
});
test('unknown names stay generic and never inherit object prototype entries',()=>{
 for(const name of [null,'Unknown Thread','__proto__','constructor']) assert.equal(getUniverseHubPlace(name,'en').type,'generic');
});
