import {distance,inFront,moveBody} from './core.mjs?v=0.4.0';
import {isSolid} from './world.mjs?v=0.4.0';

export const BETRAYAL={
  title:'Chapter nine · The Broken Oath',
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

function addGuards(g,phase){
  const points=phase===2?[[249,147],[455,147]]:[[241,315],[463,315],[352,117]];
  points.forEach(([x,y],i)=>{const id='oath-guard-'+phase+'-'+i;if(!g.defeated.has(id)&&!g.area.enemies.some(e=>e.id===id))g.area.enemies.push({id,name:'Royal remnant knight',kind:'guard',x,y,hp:phase===2?65:80,maxHp:phase===2?65:80,damage:10,xp:0,coins:15,cooldown:1.5,stun:0,flash:0,windup:0,swingTime:0});});
}
function hurt(g,damage){
  const p=g.player;if(p.invulnerable)return;
  if(p.parryTime){p.parryTime=0;p.riposteTime=1.5;p.ultimateCharge=Math.min(100,p.ultimateCharge+20);p.invulnerable=.35;g.effects.push({kind:'parry',x:p.x,y:p.y,life:.4,maxLife:.4,r:27});g.emit('parried');return;}
  p.hp=Math.max(0,p.hp-(p.guardTime?Math.ceil(damage*.5):damage));p.invulnerable=.6;p.hurtFlash=.15;g.emit('hurt');if(!p.hp){g.mode='dead';g.emit('death');}
}
export function tickRowan(g,e,dt){
  const phase=e.hp<=e.maxHp*.33?3:e.hp<=e.maxHp*.66?2:1;
  if(phase>(e.phase??1)){e.phase=phase;addGuards(g,phase);g.emit('rowan-phase',{phase});}
  e.skillCd=Math.max(0,(e.skillCd??3)-dt);e.guardCd=Math.max(0,(e.guardCd??7)-dt);e.guardTime=Math.max(0,(e.guardTime??0)-dt);
  if(!e.guardCd&&!e.cast){e.guardCd=phase===3?7:10;e.guardTime=1.25;}
  if(e.cast){
    e.cast.time-=dt;if(e.cast.time>0)return true;
    const cast=e.cast;e.cast=null;e.skillCd=phase===3?3.7:5.5;
    const spec={kind:'weapon-move',style:'bloodmoon',shape:cast.kind==='sweep'?'arc':'line',x:cast.x,y:cast.y,face:cast.facing,range:cast.kind==='rush'?135:180,r:cast.kind==='sweep'?105:70,width:18,color:'#edb28d',life:.5,maxLife:.5};g.effects.push(spec);
    if(cast.kind==='sweep'){if(inFront(cast,g.player,cast.facing,105,Math.PI*.75))hurt(g,18);}
    else{const dx=g.player.x-cast.x,dy=g.player.y-cast.y,along=dx*cast.facing.x+dy*cast.facing.y;if(along>=-8&&along<spec.range&&Math.abs(dx*cast.facing.y-dy*cast.facing.x)<20)hurt(g,phase===3?22:18);if(cast.kind==='rush')for(let i=0;i<22;i++)moveBody(e,cast.facing.x*5,cast.facing.y*5,(x,y)=>isSolid(g.area,x,y));}
    e.cooldown=.8;return true;
  }
  if(!e.skillCd&&!e.stun&&!e.freeze&&!e.shock&&distance(e,g.player)<220){
    const d=Math.max(1,distance(e,g.player)),facing={x:(g.player.x-e.x)/d,y:(g.player.y-e.y)/d};
    e.sequence=(e.sequence??0)+1;const kind=phase===1?'rush':phase===2?(e.sequence%2?'sweep':'rush'):(['sweep','beam','rush'][e.sequence%3]);
    e.cast={kind,x:e.x,y:e.y,facing,time:phase===3?.65:.85,maxTime:phase===3?.65:.85};e.windup=0;return true;
  }return false;
}
export function restoreRowanWaves(g){const e=g.area.enemies.find(e=>e.id==='rowan-betrayer');if(!e)return;if(e.dead){addGuards(g,2);addGuards(g,3);}e.dormant=!g.defeated.has('betrayal-duel');}
