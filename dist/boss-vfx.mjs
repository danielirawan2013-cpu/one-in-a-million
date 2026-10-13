import {BOSS_DESIGNS} from './boss-art.mjs?v=0.5.1';
const pixel=(c,color,x,y,w=2,h=2)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
function line(c,color,x,y,xx,yy,w=1){const n=Math.max(1,Math.ceil(Math.max(Math.abs(xx-x),Math.abs(yy-y))));for(let i=0;i<=n;i++)pixel(c,color,x+(xx-x)*i/n,y+(yy-y)*i/n,w,w);}
function mark(c,pattern,color,x,y,size,t){
 const r=size;
 if(pattern==='frost'){line(c,color,x,y-r,x-r*.45,y+r,2);line(c,color,x,y-r,x+r*.45,y+r,2);line(c,'#edfaff',x,y-r,x,y+r);line(c,color,x-r*.45,y+r,x+r*.45,y+r);}
 else if(pattern==='oath'){for(let i=0;i<3;i++){const yy=y-r+i*r*.8;line(c,color,x-3,yy,x+3,yy);line(c,color,x-3,yy,x-3,yy+5);line(c,color,x+3,yy,x+3,yy+5);}line(c,'#fff0d0',x-r,y+4,x+r,y-4);}
 else if(pattern==='sun'){for(let i=0;i<r;i++){const w=Math.max(1,Math.round(Math.sin(i/r*Math.PI)*r*.4));pixel(c,i<r/2?color:'#ffe4a5',x-w,y-i,w*2,2);}line(c,color,x-r*.5,y-4,x-r,y-10,2);line(c,color,x+r*.5,y-4,x+r,y-10,2);}
 else if(pattern==='moon'){for(let i=0;i<18;i++){const a=-Math.PI*.6+i*Math.PI*1.2/17;pixel(c,color,x-Math.cos(a)*r,y+Math.sin(a)*r,2,2);}line(c,'#edf0ff',x-r*.5,y-r*.35,x-r*.5,y+r*.35);}
 else if(pattern==='memory'){pixel(c,'#42354f',x-r*.6,y-r*.5,r*1.2,r);pixel(c,color,x-r*.6,y-r*.5,r*1.2,2);line(c,'#f2d8ee',x,y-r*.4,x,y+r*.5);line(c,color,x-r*.4,y,x-2,y-2);line(c,color,x+2,y-2,x+r*.4,y);}
 else {line(c,color,x-r,y+5,x+r,y+5,2);for(const dx of [-r,0,r]){line(c,color,x+dx,y+5,x+dx,y-r*.6,2);pixel(c,'#fff0d0',x+dx-1,y-r*.6-2,3,3);}line(c,color,x-r,y+8,x+r,y+8);}
}
export function drawBossCharge(c,e,time,{reducedMotion=false}={}){
 if(e.kind!=='boss'||e.dead||e.dormant)return;
 if(!e.divineCast){
  const charge=e.windup?Math.max(0,1-e.windup/.5):e.stormCast?1-e.stormCast.time/.85:0;
  if(!charge)return;const col=e.color??bossVisualColor(e.id),pattern=BOSS_FX_THEMES[e.id]??'metal';c.save();c.globalAlpha=.65;
  const count=reducedMotion?3:7;for(let i=0;i<count;i++){const a=i*Math.PI*2/count+(reducedMotion?0:time*.7),r=reducedMotion?25:42-20*charge;fragment(c,pattern,col,e.x+Math.cos(a)*r,e.y-24+Math.sin(a)*r*.5,7);}
  c.restore();return;
 }
 const t=1-e.divineCast.time/1.05,spin=reducedMotion?0:time*.4,color=e.color,pattern=e.pattern;c.save();
 for(let i=0;i<6;i++){const a=i*Math.PI/3+spin,r=35+25*(1-t);mark(c,pattern,color,e.x+Math.cos(a)*r,e.y-24+Math.sin(a)*r*.5,8+3*t,t);}
 // Sparks converge on the caster; damage is still only in the marked zones.
 if(!reducedMotion)for(let i=0;i<8;i++){const a=i*Math.PI/4,d=60*(1-t);line(c,color,e.x+Math.cos(a)*d,e.y-20+Math.sin(a)*d*.6,e.x+Math.cos(a)*(d+6),e.y-20+Math.sin(a)*(d+6)*.6);}
 c.restore();
}
export function drawBossVFX(c,e,{reducedMotion=false}={}){
 if(drawBossSpectacle(c,e,{reducedMotion}))return true;
 if(!['divine-strike','boss-impact'].includes(e.kind))return false;
 const t=1-e.life/e.maxLife;c.save();c.globalAlpha=Math.max(0,1-t);
 if(e.kind==='boss-impact'){
  for(let i=0;i<8;i++){const a=i*Math.PI/4,r=8+22*t;line(c,e.color,e.x+Math.cos(a)*r*.45,e.y+Math.sin(a)*r*.45,e.x+Math.cos(a)*r,e.y+Math.sin(a)*r,2);}
 }else{
  const count=e.pattern==='crown'?5:8;
  for(let i=0;i<count;i++){
   const a=i*Math.PI*2/count,spread=(e.r??32)*(.6+t*.8),x=e.shape==='column'?e.x+Math.cos(a)*e.width:e.shape==='row'?e.x+(i-count/2)*38:e.x+Math.cos(a)*spread,y=e.shape==='column'?75+i*68:e.shape==='row'?e.y+Math.sin(a)*e.width:e.y+Math.sin(a)*spread;
   mark(c,e.pattern,e.color,x,y-(reducedMotion?0:t*25),e.pattern==='sun'?22:12,t);
   if(e.pattern==='crown'||e.pattern==='frost')line(c,e.color,x,y-40*(1-t),x,y,2);
  }
 }
 c.restore();return e.kind==='boss-impact';
}

// Bounded combat feedback. These effects never create a damage zone or change AI.
export const BOSS_FX_LIMIT=64;
export const BOSS_FX_THEMES={warden:'metal',archivist:'memory','workyard-boss':'metal','foundry-boss':'sun','rootgrove-boss':'leaf','weaverhall-boss':'silk','stormshore-boss':'moon','beacon-boss':'prism','starpass-boss':'meteor','starvault-boss':'star','heartgate-boss':'metal','heartcore-boss':'oath','lake-storm':'lightning','skythreshold-god':'frost','oathtribunal-god':'oath','sunforge-god':'sun','mooncourt-god':'moon','exilearchive-god':'memory','crownsummit-god':'crown',collector:'coin','rowan-betrayer':'metal'};
export function bossEffect(game,boss,phase,origin=boss){
 if(boss.kind!=='boss'||boss.dormant||!['arrival','strike','fracture','defeat'].includes(phase))return false;
 if(game.effects.filter(e=>e.kind==='boss-spectacle').length>=BOSS_FX_LIMIT)return false;
 const life={arrival:1,strike:.55,fracture:.85,defeat:1.8}[phase],pattern=BOSS_FX_THEMES[boss.id]??boss.pattern??'metal';
 game.effects.push({kind:'boss-spectacle',phase,pattern,color:pattern==='frost'?'#5b94b3':boss.color??bossVisualColor(boss.id),x:origin.x,y:origin.y,face:{...(boss.attackFacing??{x:0,y:1})},life,maxLife:life});return true;
}
const bossVisualColor=id=>BOSS_DESIGNS[id]?.color??({warden:'#b6c7cf',archivist:'#dec69b','rootgrove-boss':'#bed49a','weaverhall-boss':'#dcbcea','foundry-boss':'#f3b776','stormshore-boss':'#a0d3d0','lake-storm':'#a2e4e9',collector:'#f0cd7d'})[id]??'#e0bb9c';
function sparkRing(c,color,x,y,r,width=1){for(let i=0;i<60;i++){const a=i*Math.PI/30;pixel(c,color,x+Math.cos(a)*r,y+Math.sin(a)*r*.65,width,width);}}
function bolt(c,color,x,y,xx,yy){let px=x,py=y;for(let i=1;i<=5;i++){const qx=x+(xx-x)*i/5+(i===5?0:i%2?4:-4),qy=y+(yy-y)*i/5;line(c,color,px,py,qx,qy,2);px=qx;py=qy;}}
function fragment(c,pattern,col,x,y,size){
 if(pattern==='lightning')bolt(c,col,x-3,y-8,x+2,y+7);
 else if(pattern==='leaf'){line(c,col,x-5,y+4,x+5,y-4,3);line(c,'#edf3bc',x-3,y+2,x+3,y-2);}
 else if(pattern==='silk'){line(c,col,x-7,y-4,x+7,y+4);line(c,col,x-7,y+4,x+7,y-4);}
 else if(pattern==='prism'||pattern==='meteor'||pattern==='star'||pattern==='frost')mark(c,'frost',col,x,y,size,0);
 else if(pattern==='coin'){sparkRing(c,col,x,y,5,2);pixel(c,'#ffefb6',x,y-2,1,5);}
 else if(pattern==='metal'){pixel(c,'#4b515b',x-4,y-3,8,6);pixel(c,col,x-3,y-3,6,2);pixel(c,'#f6e4c0',x-1,y-2,2,2);}
 else mark(c,pattern,col,x,y,size,0);
}
export function drawBossSpectacle(c,e,{reducedMotion=false}={}){
 if(e.kind!=='boss-spectacle')return false;
 const t=Math.max(0,Math.min(1,1-e.life/e.maxLife)),motion=reducedMotion?0:t,large=e.phase==='defeat',radius=large?88:e.phase==='fracture'?50:e.phase==='arrival'?43:32;
 c.save();c.globalAlpha=(1-t)*(reducedMotion?.55:.85);
 // An impact ring stays low on the floor, leaving the boss and Pip readable.
 const rr=reducedMotion?radius*.65:10+radius*(1-Math.pow(1-motion,3));
 sparkRing(c,e.color,e.x,e.y,rr,large?2:1);
 if(large&&!reducedMotion)sparkRing(c,e.color,e.x,e.y,rr*.72);
 const count=reducedMotion?5:large?18:10;
 for(let i=0;i<count;i++){
  const a=i*Math.PI*2/count+(e.phase==='strike'?Math.atan2(e.face.y,e.face.x):0),distance=reducedMotion?radius*.45:radius*(.2+motion*.85);
  let x=e.x+Math.cos(a)*distance,y=e.y-16+Math.sin(a)*distance*.55;
  if(e.phase==='strike'){x=e.x+e.face.x*(10+motion*35)+Math.cos(a)*15;y=e.y-10+e.face.y*(10+motion*35)+Math.sin(a)*10;}
  if(large&&!reducedMotion)y-=motion*36;
  fragment(c,e.pattern,e.color,x,y,large?12:7);
  if(!reducedMotion&&['defeat','fracture'].includes(e.phase))line(c,e.color,x-Math.cos(a)*6,y-Math.sin(a)*6,x,y,1);
 }
 if(large&&e.pattern==='lightning'&&!reducedMotion)for(let i=-1;i<=1;i++)bolt(c,i?'#76b7cf':'#e3f9f8',e.x+i*28,e.y-125*(1-motion),e.x+i*14,e.y-8);
 if(large&&e.pattern==='silk')for(let i=0;i<8;i++){const a=i*Math.PI/4;line(c,e.color,e.x,e.y-14,e.x+Math.cos(a)*rr,e.y-14+Math.sin(a)*rr*.6);}
 c.restore();return true;
}
