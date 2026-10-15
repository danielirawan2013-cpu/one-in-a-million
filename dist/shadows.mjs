import {distance,moveBody,clamp} from './core.mjs?v=0.7.0';
import {isSolid} from './world.mjs?v=0.7.0';
export const SHADOW_BLADE='shadowfangs';
export const SHADOW_COMMANDERS=Object.freeze([
 {id:'igris',name:'Igris',kind:'knight',color:'#b99cff',accent:'#dd6e91',damage:25,reach:34,speed:90,cooldown:1.4},
 {id:'beru',name:'Beru',kind:'ant',color:'#ae9cf3',accent:'#87e8ef',damage:30,reach:30,speed:125,cooldown:1.5},
 {id:'bellion',name:'Bellion',kind:'marshal',color:'#cab4fa',accent:'#9fcdff',damage:28,reach:94,speed:80,cooldown:1.8},
 {id:'tusk',name:'Tusk',kind:'mage',color:'#b99bff',accent:'#f0a3c6',damage:24,reach:145,speed:70,cooldown:2.4},
 {id:'iron',name:'Iron',kind:'tank',color:'#9b99d5',accent:'#8ecbe4',damage:20,reach:38,speed:67,cooldown:2},
 {id:'tank',name:'Tank',kind:'bear',color:'#a49bdf',accent:'#8ae5ef',damage:24,reach:34,speed:82,cooldown:1.9},
 {id:'kaisel',name:'Kaisel',kind:'wyvern',color:'#b09df3',accent:'#8dd9eb',damage:26,reach:105,speed:98,cooldown:2.3},
 {id:'greed',name:'Greed',kind:'axes',color:'#b39ce9',accent:'#bce9c5',damage:23,reach:35,speed:91,cooldown:1.6},
 {id:'jima',name:'Jima',kind:'naga',color:'#9fa9f2',accent:'#b5e5ed',damage:22,reach:130,speed:72,cooldown:2.2}
]);
export const SHADOW_ROSTER=Object.freeze([...SHADOW_COMMANDERS,...Array.from({length:6},(_,i)=>({id:'soldier-'+i,name:i%3===1?'Shadow archer':i%3===2?'Shadow mage':'Shadow knight',kind:i%3===1?'archer':i%3===2?'acolyte':'soldier',color:'#9984cd',accent:'#ada7f0',damage:10,reach:i%3?120:28,speed:85,cooldown:1.9,infantry:true}))]);
export function hasShadowBlade(g){return !g.player.scrapKing&&g.player.weaponSkin===SHADOW_BLADE&&g.inventory.some(i=>i.skin===SHADOW_BLADE);}
function safePoint(g,origin,index){
 for(let tries=0;tries<36;tries++){const a=index*2.39996+tries*.53,r=54+Math.floor(index/5)*29+Math.floor(tries/12)*10,x=clamp(origin.x+Math.cos(a)*r,30,674),y=clamp(origin.y+Math.sin(a)*r,45,445);if(!isSolid(g.area,x,y))return {x,y};}
 return {x:origin.x,y:origin.y};
}
function effect(g,kind,p,extra={}){if(g.effects.filter(e=>e.kind.startsWith('shadow-')).length>=48)return;g.effects.push({kind,x:p.x,y:p.y,color:p.color??'#bca3ff',life:.6,maxLife:.6,...extra});}
export function relocateShadows(g){for(const [i,s] of (g.shadowArmy??[]).entries()){Object.assign(s,safePoint(g,g.player,i));s.target=null;s.stuck=0;}}
export function dismissShadows(g,announce=true){
 if(!g.shadowArmy?.length)return false;for(const s of g.shadowArmy)effect(g,'shadow-gate',s,{closing:true});g.shadowArmy=[];g.shadowRemaining=0;if(announce)g.emit('shadows-dismissed');return true;
}
export function summonShadows(g,{ultimate=false}={}){
 if(!hasShadowBlade(g)||!(g.mode==='playing'||ultimate&&g.mode==='special'))return false;
 if(!ultimate&&g.shadowArmy?.length)return dismissShadows(g);
 if(!ultimate&&g.player.shadowCd>0)return false;
 g.player.shadowCd=20;g.shadowRemaining=ultimate?60:45;
 // Refresh the existing formation instead of duplicating an army.
 g.shadowArmy=SHADOW_ROSTER.map((s,i)=>({...s,...safePoint(g,g.player,i),cd:.25+i*.08,attackTime:0,stuck:0,facing:{x:0,y:-1}}));
 for(const s of g.shadowArmy)effect(g,'shadow-gate',s,{life:1,maxLife:1});g.burst(g.player.x,g.player.y,'#a699ef',30);g.emit('shadows-summoned',{count:g.shadowArmy.length,ultimate});return true;
}
export function tickShadowArmy(g,dt){
 if(!g.shadowArmy?.length||!['playing','special'].includes(g.mode))return;
 if(!hasShadowBlade(g)){dismissShadows(g);return;}
 g.shadowRemaining=Math.max(0,g.shadowRemaining-dt);if(!g.shadowRemaining){dismissShadows(g);return;}
 const foes=()=>g.area.enemies.filter(e=>!e.dead&&!e.dormant&&!e.phaseRest&&e.hp>0);
 for(const [i,s] of g.shadowArmy.entries()){
  s.cd=Math.max(0,s.cd-dt);s.attackTime=Math.max(0,s.attackTime-dt);
  let target=null,best=Infinity;for(const e of foes()){if(distance(e,g.player)>265)continue;const d=distance(e,s);if(d<best){best=d;target=e;}}
  const anchor=safePoint(g,g.player,i),goal=target??anchor,d=distance(goal,s);
  if(distance(s,g.player)>230){Object.assign(s,anchor);effect(g,'shadow-gate',s);continue;}
  if(d>1)s.facing={x:(goal.x-s.x)/d,y:(goal.y-s.y)/d};
  const stop=target?s.reach-6:8;
  if(d>stop){const old={x:s.x,y:s.y};moveBody(s,s.facing.x*s.speed*dt,s.facing.y*s.speed*dt,(x,y)=>isSolid(g.area,x,y));s.stuck=distance(old,s)<dt*5?s.stuck+dt:0;if(s.stuck>.8){Object.assign(s,safePoint(g,target??g.player,i));s.stuck=0;effect(g,'shadow-gate',s);}}
  if(!target||distance(s,target)>s.reach||s.cd)continue;
  s.cd=s.cooldown;s.attackTime=.3;s.target={x:target.x,y:target.y};
  effect(g,'shadow-strike',s,{to:{...s.target},style:s.kind});
  // Shadows neither farm the ultimate meter nor strike protected story actors.
  g.damageEnemy(target,s.damage,{charge:false});
  if(s.kind==='mage'||s.kind==='wyvern'||s.kind==='acolyte')for(const e of foes())if(e!==target&&distance(e,target)<29)g.damageEnemy(e,Math.ceil(s.damage*.55),{charge:false});
  if(!target.dead&&!target.phaseRest){
   if(s.kind==='naga')target.slow=Math.max(target.slow??0,1.4);
   if(s.kind==='bear'||s.kind==='tank'){const len=Math.max(1,distance(s,target));target.knockback={x:(target.x-s.x)/len*120,y:(target.y-s.y)/len*120,time:.14};}
   if(s.kind==='axes')target.shock=Math.max(target.shock??0,.2);
  }
  if(s.kind==='tank'&&distance(s,g.player)<65)g.player.guardTime=Math.max(g.player.guardTime,.4);
  if(s.kind==='ant'){effect(g,'shadow-claw',target);}
 }
}
