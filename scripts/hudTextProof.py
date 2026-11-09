"""Shared DOM measurement for the text actually painted in a HUD control.

The responsive full/compact labels both remain in the DOM. A display:none
branch is deliberately not rendered and must not be mistaken for clipped text.
Opacity, visibility, zero geometry and overflow remain failed measurements.
This is browser instrumentation only; it does not modify controls or game state.
"""

BUTTON_TEXT_PROOF_JS = """button => {
  const rect=node=>{const r=node.getBoundingClientRect();return {
    x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
  const within=(a,b)=>a.x>=b.x-1&&a.y>=b.y-1&&a.right<=b.right+1&&a.bottom<=b.bottom+1;
  const viewport={x:0,y:0,right:innerWidth,bottom:innerHeight};
  const buttonBox=rect(button),fragments=[],excludedFragments=[];
  const walker=document.createTreeWalker(button,NodeFilter.SHOW_TEXT);
  let node;
  while((node=walker.nextNode())){
    if(!node.textContent.trim()||node.parentElement.closest('svg'))continue;
    const ancestors=[];
    for(let ancestor=node.parentElement;ancestor;ancestor=ancestor.parentElement){
      ancestors.push({node:ancestor,css:getComputedStyle(ancestor)});
    }
    const suppressed=ancestors.find(ancestor=>ancestor.css.display==='none');
    if(suppressed){
      excludedFragments.push({text:node.textContent.trim(),reason:'display-none',
        tag:suppressed.node.tagName,className:suppressed.node.className});
      continue;
    }
    const clip={x:Math.max(buttonBox.x,viewport.x),y:Math.max(buttonBox.y,viewport.y),
      right:Math.min(buttonBox.right,viewport.right),bottom:Math.min(buttonBox.bottom,viewport.bottom)};
    const clipSources=[];
    let ellipsized=false;
    // A range can fit inside the button while a nested strong/small
    // clips it. Intersect every effective ancestor overflow clip too.
    for(const {node:ancestor,css} of ancestors){
      const clipX=css.overflowX!=='visible',clipY=css.overflowY!=='visible';
      if(!clipX&&!clipY)continue;
      const box=rect(ancestor),left=box.x+ancestor.clientLeft,top=box.y+ancestor.clientTop;
      const paddingBox={x:left,y:top,right:left+ancestor.clientWidth,bottom:top+ancestor.clientHeight};
      if(clipX){clip.x=Math.max(clip.x,paddingBox.x);clip.right=Math.min(clip.right,paddingBox.right);}
      if(clipY){clip.y=Math.max(clip.y,paddingBox.y);clip.bottom=Math.min(clip.bottom,paddingBox.bottom);}
      const overflowed=ancestor.scrollWidth>ancestor.clientWidth+1;
      if(clipX&&css.textOverflow==='ellipsis'&&overflowed)ellipsized=true;
      clipSources.push({tag:ancestor.tagName,className:ancestor.className,overflowX:css.overflowX,
        overflowY:css.overflowY,textOverflow:css.textOverflow,overflowed,paddingBox});
    }
    const range=document.createRange();range.selectNodeContents(node);
    const boxes=Array.from(range.getClientRects()).filter(box=>box.width&&box.height)
      .map(box=>({x:box.x,y:box.y,right:box.right,bottom:box.bottom}));
    const hidden=ancestors.some(({css})=>css.visibility==='hidden'||css.visibility==='collapse'||Number(css.opacity)===0);
    fragments.push({text:node.textContent.trim(),boxes,clip,clipSources,ellipsized,
      fullyVisible:!hidden&&boxes.length>0&&!ellipsized&&boxes.every(box=>within(box,clip))});
  }
  return {fragments,excludedFragments,
    fullyVisible:fragments.length>0&&fragments.every(fragment=>fragment.fullyVisible)};
}"""
