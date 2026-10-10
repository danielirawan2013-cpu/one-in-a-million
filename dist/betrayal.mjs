import {distance,inFront,moveBody} from './core.mjs?v=0.5.0';
import {isSolid} from './world.mjs?v=0.5.0';

export const BETRAYAL={
  title:'The Broken Oath',
  arrival:[
    'Three weeks after the dungeon heart is saved, Rowan sends Pip a letter. “Come to the old oath hall. Please come alone. I need your help.” He brings the tea she always orders.',
    'The royal remnant has taken her mother and brother. Their captain offers a bargain: deliver the keeper of the dungeon heart, and her family goes free. They want Pip’s gift to rebuild the treasure machine.',
    'Rowan has already accepted. She leads Pip past the iron doors and turns the key herself. There is no spell controlling her. This is her choice.',
    '“You can survive their prison,” she says. “Mum can’t. Please put down your sword.” Pip looks at the untouched tea. “You knew I would come because I trusted you.”',
    '“I know.” Rowan draws her blade. Pip takes one step back. “I won’t let them use me to hurt my family. And you don’t get to decide which family matters.”'
  ],
  aftermath:[
    'Rowan’s sword falls from her hand. The remnant’s soldiers lie defeated around the broken oath seal. Pip could strike again. Instead, he kicks her sword out of reach.',
    '“I was frightened,” Rowan says. Pip’s hands are shaking. “So was I. You still locked the door.” She tries to tell him there was no other way. He answers, “You never asked us.”',
    'Silk and Bones followed the royal courier from the shop. While the remnant guarded the duel, they opened the cells beneath the hall. Rowan’s mother and brother are alive. Grandma brought the prisoners home.',
    '“We helped them because they needed us,” Pip says. “Not because you earned it. You’re going to tell them what you did. Then you’re going to help every prisoner they left behind.”',
    'Rowan gives Pip the prison keys. “Will you ever trust me again?” He picks up the cold tea. “I don’t know. You don’t get that back with one apology.”',
    'The hall doors open. Pip walks home with his family. Rowan stays to free the remaining prisoners and testify against the remnant. Her place at the shop table is empty. For now, Pip leaves it that way.'
  ]
};


export const ROWAN_PHASES=[
  {hp:250,name:'The locked door',line:'“Please, Pip. Don’t make me choose again.”',hint:'Dodge her marked rush. Parry while facing her.'},
  {hp:290,name:'The remnant arrives',line:'“You promised they would be safe!”',hint:'Spear guards join Rowan. Step out of their narrow thrusts.'},
  {hp:340,name:'A broken promise',line:'“I can’t lose them. I can’t lose you either.”',hint:'Crossbow soldiers cover the hall. Watch the locked aim lines.'}
];
function addGuards(g,phase){
  const points=phase===2?[[249,147],[455,147]]:[[241,315],[463,315],[352,117]];
  points.forEach(([x,y],i)=>{
    const id='oath-guard-'+phase+'-'+i,role=phase===2?'spear':'crossbow';
    if(g.defeated.has(id)||g.area.enemies.some(e=>e.id===id))return;
    const hp=role==='spear'?85:65;
    g.area.enemies.push({id,name:role==='spear'?'Remnant shield lancer':'Remnant masked arbalist',kind:'guard',remnant:role,x,y,hp,maxHp:hp,damage:role==='spear'?12:14,xp:0,coins:15,cooldown:2,stun:0,flash:0,windup:0,swingTime:0,dead:false});
    g.effects.push({kind:'oath-arrival',x,y,life:1,maxLife:1,r:28});g.burst(x,y,'#d7b58e',12);
  });
}
export function restoreRowanWaves(g){
  const e=g.area.enemies.find(e=>e.id==='rowan-betrayer');if(!e)return;
  e.phase=Math.max(1,Math.min(3,g.betrayalStage-1));e.hp=e.maxHp=ROWAN_PHASES[e.phase-1].hp;
  if(g.defeated.has(e.id)){e.dead=true;e.hp=0;}
  e.dormant=g.betrayalStage<2;e.skillCd=2;e.guardCd=6;
  for(let phase=2;phase<=e.phase;phase++)addGuards(g,phase);
  checkBetrayalClear(g,false);
}
export function advanceRowan(g,e){
  if(e.phase>=3)return false;
  e.phase++;e.hp=e.maxHp=ROWAN_PHASES[e.phase-1].hp;e.cast=null;e.windup=0;e.guardTime=0;e.freeze=0;e.shock=0;e.root=0;e.burn=null;e.phaseRest=1.2;e.skillCd=2.5;e.cooldown=1.5;
  g.betrayalStage=e.phase+1;addGuards(g,e.phase);g.effects.push({kind:'oath-break',x:e.x,y:e.y,life:1.2,maxLife:1.2,r:115});g.burst(e.x,e.y,'#edb28d',32);g.shake=4;g.emit('rowan-phase',{phase:e.phase});return true;
}
export function checkBetrayalClear(g,announce=true){
  if(g.area.id!=='oathhall'||g.betrayalStage<2||g.area.enemies.some(e=>!e.dead))return false;
  const changed=g.betrayalStage<5;g.betrayalStage=Math.max(5,g.betrayalStage);
  const rowan=g.area.enemies.find(e=>e.id==='rowan-betrayer');
  if(!g.area.npcs.some(n=>n.id==='rowan-aftermath'))g.area.npcs.push({id:'rowan-aftermath',kind:'invisible',x:rowan.x,y:rowan.y,label:'Speak to Rowan · The aftermath'});
  if(changed&&announce)g.emit('betrayal-cleared');return true;
}
function hurt(g,e,cast,damage){
  const p=g.player;if(p.invulnerable)return;
  // Locked aim makes direction matter for both the hit and the parry.
  const source={x:p.x-cast.facing.x*24,y:p.y-cast.facing.y*24};
  if(p.parryTime&&inFront(p,source,p.parryFacing,48,Math.PI*.4)){
    p.parryTime=0;p.riposteTime=1.5;p.ultimateCharge=Math.min(100,p.ultimateCharge+20);p.invulnerable=.35;e.stun=1.1;e.guardTime=0;e.cooldown=1.8;
    g.effects.push({kind:'parry',x:p.x,y:p.y,life:.4,maxLife:.4,r:27});g.burst(p.x,p.y,'#f8e0a0',16);g.emit('parried');return;
  }
  p.hp=Math.max(0,p.hp-(p.guardTime?Math.ceil(damage*.5):damage));p.invulnerable=.65;p.hurtFlash=.15;g.shake=2;g.burst(p.x,p.y,'#edb28d',12);g.emit('hurt');if(!p.hp){g.mode='dead';g.emit('death');}
}
function resolveCast(g,e,cast,damage){
  g.effects.push({...cast,attackKind:cast.kind,kind:'oath-strike',life:.45,maxLife:.45});
  if(cast.kind==='sweep'){if(inFront(cast,g.player,cast.facing,cast.range,Math.PI*.75))hurt(g,e,cast,damage);}
  else{const dx=g.player.x-cast.x,dy=g.player.y-cast.y,along=dx*cast.facing.x+dy*cast.facing.y;if(along>=-8&&along<=cast.range&&Math.abs(dx*cast.facing.y-dy*cast.facing.x)<cast.width)hurt(g,e,cast,damage);}
  g.burst(cast.x+cast.facing.x*cast.range,cast.y+cast.facing.y*cast.range,cast.kind==='bolt'?'#d7c9ae':'#edb28d',14);
}
function aim(e,p,kind,time,range,width){const d=Math.max(1,distance(e,p));return {kind,x:e.x,y:e.y,facing:{x:(p.x-e.x)/d,y:(p.y-e.y)/d},time,maxTime:time,range,width};}
export function tickRowan(g,e,dt){
  e.phaseRest=Math.max(0,(e.phaseRest??0)-dt);if(e.phaseRest||e.stun||e.freeze||e.shock)return true;
  const phase=e.phase;e.skillCd=Math.max(0,(e.skillCd??2)-dt);e.guardCd=Math.max(0,(e.guardCd??7)-dt);e.guardTime=Math.max(0,(e.guardTime??0)-dt);
  if(!e.guardCd&&!e.cast){e.guardCd=phase===3?7:10;e.guardTime=1.25;}
  if(e.cast){
    e.cast.time-=dt;if(e.cast.time>0)return true;
    const cast=e.cast;e.cast=null;e.skillCd=phase===3?3.7:5.5;resolveCast(g,e,cast,phase===3?22:18);
    if(cast.kind==='rush'&&!e.root)for(let i=0;i<22;i++)moveBody(e,cast.facing.x*5,cast.facing.y*5,(x,y)=>isSolid(g.area,x,y));
    e.cooldown=Math.max(e.cooldown,.8);return true;
  }
  if(!e.skillCd&&distance(e,g.player)<220){
    e.sequence=(e.sequence??0)+1;const kind=phase===1?'rush':phase===2?(e.sequence%2?'sweep':'rush'):(['sweep','beam','rush'][e.sequence%3]);
    e.cast=aim(e,g.player,kind,phase===3?.75:.95,kind==='sweep'?105:kind==='rush'?135:185,kind==='beam'?17:20);e.windup=0;return true;
  }return false;
}
export function tickRemnant(g,e,dt){
  if(e.stun||e.freeze||e.shock)return;
  if(e.cast){e.cast.time-=dt;if(e.cast.time>0)return;const cast=e.cast;e.cast=null;resolveCast(g,e,cast,e.damage);e.cooldown=e.remnant==='spear'?2.2:3.2;return;}
  const d=Math.max(1,distance(e,g.player)),ranged=e.remnant==='crossbow',reach=ranged?220:82;
  if(d<reach&&!e.cooldown){e.cast=aim(e,g.player,ranged?'bolt':'thrust',ranged?1.15:.8,reach,ranged?8:13);return;}
  if(!e.root){const direction=ranged&&d<95?-1:d>(ranged?150:58)?1:0;moveBody(e,(g.player.x-e.x)/d*direction*dt*27,(g.player.y-e.y)/d*direction*dt*27,(x,y)=>isSolid(g.area,x,y));}
}
