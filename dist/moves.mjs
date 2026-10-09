import {SWORDS} from './swords.mjs?v=0.4.0';
import {SWORD_SWING,inFront,distance,moveBody} from './core.mjs?v=0.4.0';
import {isSolid} from './world.mjs?v=0.4.0';
import {ultimateKey} from './ultimates.mjs?v=0.4.0';

export const ABILITY_KEYS=['sweep','guard','charge','mend','cyclone','stars'];
export const ABILITY_LEVELS={sweep:1,guard:2,charge:3,mend:1,cyclone:2,stars:3};
const move=(name,kind,options={})=>({name,kind,scale:1.6,radius:58,...options});
const kit=(basic,names,moves,ultimate)=>({basic,moves:Object.fromEntries(ABILITY_KEYS.map((key,i)=>[key,{...moves[i],name:names[i],cooldown:[4,10,6,14,7,12][i]}])),ultimate});
const arc=o=>move('','arc',o),ring=o=>move('','ring',o),line=o=>move('','line',{range:125,width:17,...o}),field=o=>move('','field',{duration:3,pulses:4,scale:.45,...o}),dash=o=>move('','dash',{travel:60,...o}),heal=o=>move('','heal',{heal:20,...o}),ward=o=>move('','ward',{duration:3,...o}),chain=o=>move('','chain',{range:140,jumps:4,...o});

// Every row is a fighting style, not a recolour. J/K/L and C/X/B keep their
// existing unlocks; equipment changes their geometry, timing and effects.
export const WEAPON_KITS={
  battered:kit({},['Sweep','Guard','Rush','Mending Light','Cyclone','Starcall'],[arc(),ward(),dash({scale:2}),heal(),ring({radius:52,scale:1.3}),ring({radius:100,scale:2})],move('Underdog Awakening','ring',{radius:150,scale:3})),
  ironshort:kit({reach:39,halfAngle:.35,cooldown:.4},['Iron Thrust','Steel Stance','Shieldbreaker','Second Wind','Crosscut','Piercing Verdict'],[line({range:85}),ward({duration:4}),dash({travel:45,scale:2.6}),heal({heal:15,guard:2}),arc({radius:45,scale:2.2}),line({range:180,scale:3})],move('Ironheart Verdict','line',{range:240,width:24,scale:5})),
  classicdawn:kit({reach:38,halfAngle:1.2},['First Light','Warm Shelter','Bright Advance','Kindle Heart','Sunwheel','Sunrise'],[arc({heal:3}),ward({heal:10}),dash({travel:65}),heal({heal:25}),ring({radius:60}),line({range:165,width:30})],move('First-Light Reckoning','ring',{radius:150,scale:3,heal:30})),
  dawnblade:kit({reach:38,heal:1},['Sunbeam','Solar Shelter','Radiant Charge','Daybreak Renewal','Halo Flare','Dawn Pillar'],[line({range:155,width:12}),ward({heal:12}),dash({travel:75,heal:5}),heal({heal:28}),ring({radius:72}),field({radius:42,offset:70,pulses:3,scale:1.1})],move('Daybreak Judgement','line',{range:260,width:42,scale:4.2,heal:25})),
  moonfang:kit({cooldown:.34,duration:.3,windup:.06,hitAt:.1,activeUntil:.16,reach:39,halfAngle:.45},['Crescent Cast','Lunar Veil','Moonstep','Moonwell','Orbiting Moons','Twin Eclipse'],[line({range:145,width:28,delay:.18}),ward({invulnerable:.45}),dash({travel:90,invulnerable:.3}),heal({heal:16,invulnerable:.5}),ring({radius:85,inner:30,scale:2}),line({range:185,width:30,repeat:2})],move('Lunar Judgement','line',{range:260,width:45,scale:2,repeat:3,delay:.2})),
  emberfang:kit({burn:2,cooldown:.52},['Flame Fan','Cinder Armour','Blazing Trail','Stoke the Fire','Firebed','Volcanic Eruption'],[arc({burn:3,radius:75}),ward({aura:'burn'}),dash({travel:70,trail:true,burn:3}),heal({heal:12,field:true,burn:2}),field({radius:62,burn:2}),field({radius:38,offset:85,pulses:5,burn:3,scale:.8})],move('Inferno Judgement','eruption',{radius:38,scale:1.2,burn:4,pulses:5})),
  frostbite:kit({slow:2,reach:36},['Ice Lance','Frozen Shell','Frostslide','Snowmelt','Permafrost','Glacier Prison'],[line({range:150,freeze:1}),ward({aura:'slow',duration:4}),dash({travel:75,trail:true,slow:3}),heal({heal:20,slow:2,field:true}),field({radius:75,slow:3}),ring({radius:100,freeze:1.6,scale:1.3})],move('Glacial Judgement','ring',{radius:180,freeze:3,scale:2.5})),
  thornheart:kit({root:.45,halfAngle:1.2},['Vine Lash','Briar Guard','Rootpath','Bloom','Briar Garden','Ancient Roots'],[line({range:105,width:22,root:1.5}),ward({aura:'root'}),dash({travel:50,root:2,radius:65}),heal({heal:25,field:true,root:1}),field({radius:80,root:1}),ring({radius:120,root:2,scale:1.5})],move('Briar Judgement','field',{radius:160,duration:5,pulses:6,root:1.2,scale:.7})),
  voidbreaker:kit({reach:43,halfAngle:.5,cooldown:.6},['Rift Cut','Null Barrier','Voidstep','Consume Shadow','Gravity Well','Event Horizon'],[line({range:170,width:10,scale:2.3}),ward({invulnerable:.6,duration:2}),dash({travel:100,scale:2.3}),ring({radius:65,drain:.3,scale:1}),field({radius:110,pull:65}),ring({radius:130,scale:2.5,pull:50})],move('Void Judgement','field',{radius:190,duration:3,pulses:5,pull:100,scale:.8})),
  stormsplitter:kit({chain:1,cooldown:.4},['Chain Spark','Static Shield','Boltstep','Recharge','Thunder Ring','Sky Spear'],[chain({jumps:4}),ward({aura:'shock'}),dash({travel:85,scale:1.3,shock:.5}),heal({heal:10,charge:25}),ring({radius:90,shock:.7}),line({range:210,width:14,shock:1,scale:2.5})],move('Storm Judgement','chain',{range:230,jumps:8,scale:3.5,shock:1.4})),
  dragonfang:kit({reach:42,halfAngle:1.15,knock:120,cooldown:.58},['Dragon Breath','Scaleguard','Fang Rush','Dragon Heart','Wingbeat','Elder Roar'],[arc({radius:115,halfAngle:.5,burn:2}),ward({duration:5}),dash({travel:80,scale:2.7,knock:180}),heal({heal:18,guard:3}),ring({radius:95,knock:220}),arc({radius:165,halfAngle:1,scale:3,knock:160})],move('Dragon Judgement','arc',{radius:240,halfAngle:.6,scale:4.5,burn:4,knock:240})),
  bloodmoon:kit({drain:.12,cooldown:.43},['Crimson Fang','Blood Pact','Red Hunt','Sanguine Feast','Scarlet Circle','Blood Reaping'],[arc({drain:.25,radius:65}),ward({duration:2,drain:.2,aura:'drain'}),dash({travel:70,drain:.2}),ring({radius:75,drain:.5,scale:.8}),ring({radius:80,drain:.15,scale:2}),line({range:140,width:35,drain:.3,scale:2.5})],move('Crimson Judgement','ring',{radius:180,scale:3.5,drain:.35})),
  starfall:kit({reach:38,star:true,cooldown:.55},['Comet Lance','Astral Ward','Comet Ride','Starlight Rest','Constellation','Meteor Rain'],[line({range:180,width:12,delay:.25,scale:2}),ward({charge:15}),dash({travel:95,trail:true}),heal({heal:15,charge:20}),field({radius:95,offset:40,pulses:3,scale:.7}),move('','meteors',{radius:32,pulses:5,range:160,scale:1.1})],move('Celestial Judgement','meteors',{radius:45,pulses:9,range:240,scale:1.2})),
  ghostveil:kit({reach:37,halfAngle:.45,phase:.08,cooldown:.35},['Wisp Shot','Ghost Form','Phantom Step','Soul Return','Haunting','Spectral Company'],[line({range:145,width:15}),ward({duration:1.5,invulnerable:1}),dash({travel:105,invulnerable:.45}),heal({heal:12,invulnerable:.7}),field({radius:95,slow:2,scale:.6}),line({range:180,width:22,repeat:3,delay:.2})],move('Phantom Judgement','phantoms',{range:200,scale:1.2,repeat:4,invulnerable:1.2})),
  thunderhammer:kit({reach:36,halfAngle:1.4,shock:.35,cooldown:.72,duration:.6,windup:.18,hitAt:.26,activeUntil:.34},['Thunderclap','Storm Shelter','Hammerfall','Rain Renewal','Charged Ground','Lightning Barrage'],[ring({radius:65,shock:.5}),ward({aura:'shock',duration:4}),dash({travel:40,radius:70,shock:.8,scale:2.3}),heal({heal:24}),field({radius:85,shock:.3}),move('','meteors',{radius:35,pulses:4,range:160,shock:.6,scale:1.2})],move('Tempest Judgement','eruption',{radius:65,pulses:4,scale:1.4,shock:1})),
  'scrap-king':kit({reach:44,halfAngle:1.3},['Scrap Cleave','Iron Throne','Royal Advance','Reforge','Scrap Tornado','Royal Decree'],[arc({radius:90}),ward({duration:6}),dash({travel:90}),heal({heal:40}),ring({radius:130}),line({range:240,width:35})],move('King’s Verdict','ring',{radius:1000,scale:1}))
};
export function weaponKit(p){return WEAPON_KITS[ultimateKey(p)];}
export function weaponSwing(p){return {...SWORD_SWING,...weaponKit(p).basic};}
export function weaponColor(p){return p.scrapKing?'#e4ab6c':SWORDS[p.weaponSkin]?.color??'#dbe7d7';}
const living=g=>g.area.enemies.filter(e=>!e.dead&&!e.dormant);
function hit(g,e,spec,damage){
  if(e.dead||e.dormant)return;
  const before=e.hp;g.damageEnemy(e,damage,{charge:spec.chargeHit!==false});
  const dealt=before-e.hp,p=g.player;
  if(spec.drain)p.hp=Math.min(100,p.hp+Math.ceil(dealt*spec.drain));
  if(e.dead)return;
  for(const key of ['slow','freeze','root','shock'])if(spec[key])e[key]=Math.max(e[key]??0,spec[key]);
  if(spec.burn)e.burn={time:spec.burn,next:.5,damage:Math.max(1,Math.round(damage*.18))};
  if(spec.knock){const d=Math.max(1,distance(e,p));e.knockback={x:(e.x-p.x)/d*spec.knock,y:(e.y-p.y)/d*spec.knock,time:.2};}
}
function select(g,spec,origin,facing){
  return living(g).filter(e=>{
    if(spec.kind==='line'||spec.kind==='dash'){const dx=e.x-origin.x,dy=e.y-origin.y,along=dx*facing.x+dy*facing.y;return along>=-5&&along<=(spec.range??spec.radius)&&Math.abs(dx*facing.y-dy*facing.x)<=(spec.width??20);}
    if(spec.kind==='arc')return inFront(origin,e,facing,spec.radius,spec.halfAngle??Math.PI*.5);
    return distance(origin,e)<=spec.radius&&distance(origin,e)>=(spec.inner??0);
  });
}
function visual(g,spec,origin,facing,color,life=.65){
  const key=ultimateKey(g.player);
  g.effects.push({kind:'weapon-move',x:origin.x,y:origin.y,face:{...facing},style:key,shape:spec.kind,r:spec.radius,range:spec.range??spec.radius,width:spec.width??20,color,life,maxLife:life});
}
export function performMove(g,spec,{origin={x:g.player.x,y:g.player.y},facing={...g.player.facing},damage=Math.round(g.attackDamage*spec.scale),color=weaponColor(g.player),delayed=false}={}){
  const p=g.player;
  if(spec.heal)p.hp=Math.min(100,p.hp+spec.heal);
  if(spec.charge)p.ultimateCharge=Math.min(100,p.ultimateCharge+spec.charge);
  if(spec.invulnerable)p.invulnerable=Math.max(p.invulnerable,spec.invulnerable);
  if(spec.guard)p.guardTime=Math.max(p.guardTime,spec.guard);
  if(spec.kind==='heal'){visual(g,{...spec,kind:'heal',radius:30},origin,facing,color);if(spec.field)performMove(g,{...spec,kind:'field',heal:0,field:false,radius:55,scale:.3,duration:2,pulses:3},{origin,facing,damage:Math.round(g.attackDamage*.3),color});return;}
  if(spec.kind==='ward'){p.guardTime=spec.duration;p.weaponWard=spec.aura?{kind:spec.aura,time:spec.duration,next:.4,damage:g.attackDamage,color}:null;visual(g,{...spec,radius:25},origin,facing,color,spec.duration);return;}
  if(!delayed&&spec.delay){for(let i=0;i<(spec.repeat??1);i++)schedule(g,{...spec,delay:0,repeat:1,heal:0,invulnerable:0},origin,facing,damage,color,spec.delay+i*.18);return;}
  if(spec.kind==='field'){const center={x:origin.x+facing.x*(spec.offset??0),y:origin.y+facing.y*(spec.offset??0)};for(let i=0;i<spec.pulses;i++)schedule(g,{...spec,kind:'ring',pull:spec.pull,heal:0,invulnerable:0},center,facing,damage,color,.05+i*spec.duration/spec.pulses);visual(g,spec,center,facing,color,spec.duration);return;}
  if(spec.kind==='meteors'||spec.kind==='eruption'||spec.kind==='phantoms'){
    const targets=living(g).filter(e=>distance(origin,e)<=(spec.range??180));
    const count=spec.pulses??spec.repeat??4;
    for(let i=0;i<count;i++){
      const target=targets[i%Math.max(1,targets.length)];let center;
      if(spec.kind==='eruption')center={x:origin.x+facing.x*(32+i*35),y:origin.y+facing.y*(32+i*35)};
      else center=target?{x:target.x,y:target.y}:{x:origin.x+facing.x*60+Math.cos(i*2.4)*35,y:origin.y+facing.y*60+Math.sin(i*2.4)*35};
      const strike={...spec,kind:spec.kind==='phantoms'?'arc':'ring',radius:spec.radius??46,halfAngle:Math.PI,heal:0,invulnerable:0};
      schedule(g,strike,center,facing,damage,color,.3+i*.16);
      g.effects.push({kind:'strike-warning',style:ultimateKey(p),x:center.x,y:center.y,r:strike.radius,color,life:.3+i*.16,maxLife:.3+i*.16});
    }return;
  }
  if(spec.kind==='chain'){
    let from=origin;const visited=new Set();
    for(let i=0;i<spec.jumps;i++){const target=living(g).filter(e=>!visited.has(e)&&distance(from,e)<=(i?90:spec.range)).sort((a,b)=>distance(from,a)-distance(from,b))[0];if(!target)break;visited.add(target);g.effects.push({kind:'chain-bolt',x:from.x,y:from.y,to:{x:target.x,y:target.y},color,life:.5,maxLife:.5});hit(g,target,spec,Math.round(damage*Math.pow(.85,i)));from={x:target.x,y:target.y};}return;
  }
  if(spec.kind==='dash'){
    const start={...origin};for(let i=0;i<Math.ceil(spec.travel/5);i++)moveBody(p,facing.x*Math.min(5,spec.travel-i*5),facing.y*Math.min(5,spec.travel-i*5),(x,y)=>isSolid(g.area,x,y));
    const travelled=distance(start,p);spec={...spec,range:travelled+(spec.radius??30),width:24};
    if(spec.trail)performMove(g,{...spec,kind:'field',radius:30,pulses:3,duration:2,scale:.4,heal:0,travel:0},{origin:{x:(start.x+p.x)/2,y:(start.y+p.y)/2},facing,damage:Math.round(damage*.35),color});
  }
  visual(g,spec,origin,facing,color);
  for(const e of select(g,spec,origin,facing)){
    if(spec.pull){const d=Math.max(1,distance(e,origin));moveBody(e,(origin.x-e.x)/d*Math.min(d-10,spec.pull*.35),(origin.y-e.y)/d*Math.min(d-10,spec.pull*.35),(x,y)=>isSolid(g.area,x,y));}
    hit(g,e,spec,damage);
  }
  if(spec.repeat>1&&!delayed)for(let i=1;i<spec.repeat;i++)schedule(g,{...spec,repeat:1,heal:0,invulnerable:0},origin,facing,damage,color,i*.18);
}
function schedule(g,spec,origin,facing,damage,color,delay){if(g.pendingMoves.length<80)g.pendingMoves.push({spec:{...spec,chargeHit:false},origin:{...origin},facing:{...facing},damage,color,time:delay});}
export function tickWeaponMoves(g,dt){
  const pending=g.pendingMoves;g.pendingMoves=[];
  for(const action of pending){action.time-=dt;if(action.time<=0)performMove(g,action.spec,{...action,delayed:true});else g.pendingMoves.push(action);}
  const ward=g.player.weaponWard;
  if(ward){ward.time-=dt;ward.next-=dt;if(ward.time<=0)g.player.weaponWard=null;else if(ward.next<=0){ward.next=.5;performMove(g,{kind:'ring',radius:38,scale:.2,chargeHit:false,[ward.kind==='drain'?'drain':ward.kind]:ward.kind==='drain'?.15:ward.kind==='shock'?.25:1},{damage:Math.round(ward.damage*.2),color:ward.color});}}
  for(const e of living(g)){
    for(const key of ['slow','freeze','root','shock'])e[key]=Math.max(0,(e[key]??0)-dt);
    if(e.burn){e.burn.time-=dt;e.burn.next-=dt;if(e.burn.time<=0)e.burn=null;else if(e.burn.next<=0){e.burn.next=.5;g.damageEnemy(e,e.burn.damage,{charge:false});}}
  }
}
export function basicWeaponHit(g,enemy,damage){
  const spec=weaponKit(g.player).basic;hit(g,enemy,spec,damage);
  if(spec.heal)g.player.hp=Math.min(100,g.player.hp+spec.heal);
  if(spec.phase)g.player.invulnerable=Math.max(g.player.invulnerable,spec.phase);
  if(spec.chain){const other=living(g).find(e=>e!==enemy&&distance(e,enemy)<65);if(other){g.effects.push({kind:'chain-bolt',x:enemy.x,y:enemy.y,to:{x:other.x,y:other.y},color:weaponColor(g.player),life:.3,maxLife:.3});hit(g,other,{chargeHit:false},Math.round(damage*.35));}}
  if(spec.star)schedule(g,{kind:'ring',radius:16,chargeHit:false},{x:enemy.x,y:enemy.y},g.player.attackFacing,Math.round(damage*.3),weaponColor(g.player),.3);
}
