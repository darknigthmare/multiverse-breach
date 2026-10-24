import React,{useState,useEffect,useRef} from 'react';
import {createRoot} from 'react-dom/client';
import CharacterWardrobe from '../../src/components/CharacterWardrobe.jsx';
import {HEROES_DB} from '../../src/game/heroes.js';
import {applyActorAppearance} from '../../src/game/wardrobe.js';
import {drawWardrobeEffect} from '../../src/game/wardrobeEffects.js';
const lang=new URLSearchParams(location.search).get('lang')==='en'?'en':'fr';
const options=['leon','snake','big_boss','glados'];
function Fixture(){
 const [id,setId]=useState('leon'),[selected,setSelected]=useState({});
 const base=HEROES_DB.find(h=>h.id===id),actor=applyActorAppearance(base,selected[id]);const canvas=useRef();
 useEffect(()=>{const c=canvas.current,ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);drawWardrobeEffect(ctx,140,70,actor,160);
   window.__wardrobeProbe={id,selected:{...selected},effect:actor.wardrobeEffect||null,unchanged:JSON.stringify(base.stats)===JSON.stringify(actor.stats),sourceLocked:!applyActorAppearance(base,selected[id],{},{sourceLocked:true}).wardrobeEffect};
 },[id,selected]);
 return <main style={{maxWidth:1024,margin:'0 auto',padding:12,boxSizing:'border-box'}}>
  <h1 style={{fontSize:22}}>Vestiaire R5 / fixture</h1>
  <label>Actor <select aria-label="Actor" value={id} onChange={e=>setId(e.target.value)}>{options.map(x=><option key={x}>{x}</option>)}</select></label>
  <p>Preview: ground effect only. No costume art in this fixture.</p>
  <canvas ref={canvas} width="280" height="100" style={{maxWidth:'100%',border:'1px solid #3d5664'}}/>
  <CharacterWardrobe actor={actor} lang={lang} selectedId={selected[id]} onSelect={value=>setSelected(p=>({...p,[id]:value}))}/>
  <section data-testid="enemy"><h2>Enemy archive (read only)</h2><CharacterWardrobe actor={{name:'Alien Queen',universe:'Alien'}} lang={lang} readOnly/></section>
 </main>;
}
createRoot(document.getElementById('root')).render(<Fixture/>);
