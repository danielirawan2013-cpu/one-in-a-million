import {clamp,distance,stageFor,rollLoot,moveBody,validSave} from './core.mjs';
import {makeArea,isSolid} from './world.mjs';

export class Adventure{
  constructor({random=Math.random,onEvent=()=>{}}={}){
    this.random=random;this.onEvent=onEvent;this.mode='title';this.inventory=[];this.opened=new Set();this.defeated=new Set();this.rescued=false;this.returned=false;
    this.player={x:352,y:340,hp:100,xp:0,coins:0,potions:3,weapon:5,boots:false,pendant:false,facing:{x:0,y:1},attackTime:0,attackCd:0,powerCd:0,dodgeTime:0,dodgeCd:0,invulnerable:0};
    this.area=makeArea('hollow');this.effects=[];this.particles=[];this.time=0;this.shake=0;this.hint=null;this.dirty=true;
  }
  get stage(){return stageFor(this.player.xp);}
  get attackDamage(){return this.player.weapon+[0,3,6,9][this.stage];}
  emit(type,data={}){this.dirty=true;this.onEvent({type,...data});}
  start(){this.mode='playing';this.emit('started');}
  snapshot(){
    const {x,y,hp,xp,coins,potions,weapon,boots,pendant}=this.player;
    return {version:1,area:this.area.id,player:{x,y,hp,xp,coins,potions,weapon,boots,pendant},inventory:this.inventory,opened:[...this.opened],defeated:[...this.defeated],rescued:this.rescued,returned:this.returned};
  }
  restore(data){
    if(!validSave(data))return false;
    this.inventory=data.inventory.map(i=>({...i}));this.opened=new Set(data.opened);this.defeated=new Set(data.defeated);this.rescued=data.rescued;this.returned=!!data.returned;
    for(const key of ['x','y','hp','xp','coins','potions','weapon','boots','pendant'])this.player[key]=data.player[key];
    this.loadArea(data.area,null);this.mode=this.returned?'complete':'playing';this.emit('restored');return true;
  }
  loadArea(id,spawn){
    this.area=makeArea(id);if(spawn){this.player.x=spawn.x;this.player.y=spawn.y;}
    if(isSolid(this.area,this.player.x,this.player.y)){this.player.x=this.area.spawn.x;this.player.y=this.area.spawn.y;}
    for(const e of this.area.enemies)e.dead=this.defeated.has(e.id);
    for(const c of this.area.chests)c.opened=this.opened.has(c.id);
    this.player.invulnerable=1.1;this.effects=[];this.particles=[];this.hint=null;this.emit('area',{area:id});
  }
  tick(dt,input={}){
    dt=clamp(dt,0,.05);this.time+=dt;this.shake=Math.max(0,this.shake-dt*18);
    this.effects=this.effects.filter(e=>(e.life-=dt)>0);this.particles=this.particles.filter(p=>{p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=20*dt;return p.life>0;});
    if(this.mode!=='playing')return;
    const p=this.player;
    for(const k of ['attackTime','attackCd','powerCd','dodgeTime','dodgeCd','invulnerable'])p[k]=Math.max(0,p[k]-dt);
    let dx=(input.right?1:0)-(input.left?1:0),dy=(input.down?1:0)-(input.up?1:0);
    const len=Math.hypot(dx,dy);
    if(len){dx/=len;dy/=len;if(!p.dodgeTime)p.facing={x:dx,y:dy};}
    if(p.dodgeTime){dx=p.facing.x;dy=p.facing.y;}
    const speed=p.dodgeTime?230:p.boots?90:74;
    moveBody(p,dx*dt*speed,dy*dt*speed,(x,y)=>isSolid(this.area,x,y));
    for(const e of this.area.enemies){
      if(e.dead)continue;
      e.cooldown=Math.max(0,e.cooldown-dt);e.stun=Math.max(0,e.stun-dt);e.flash=Math.max(0,e.flash-dt);
      const d=distance(e,p),boss=e.kind==='boss';
      if(e.kind!=='practice'&&d<(boss?190:145)&&d>17&&!e.stun){
        const speed=boss?28:36;moveBody(e,(p.x-e.x)/d*dt*speed,(p.y-e.y)/d*dt*speed,(x,y)=>isSolid(this.area,x,y));
      }
      if(d<(boss?29:21)&&!e.cooldown&&!e.stun){
        e.cooldown=boss?1.3:1.1;this.effects.push({kind:'enemy-swing',x:e.x,y:e.y,life:.22,maxLife:.22,r:boss?30:20});
        if(!p.invulnerable){p.hp=Math.max(0,p.hp-e.damage);p.invulnerable=.8;this.shake=2.5;this.burst(p.x,p.y,'#ec8c79',8);this.emit('hurt');
          if(p.hp===0){this.mode='dead';this.emit('death');return;}
        }
      }
    }
    const options=[...this.area.chests.filter(c=>!c.opened),...this.area.npcs,...this.area.exits];
    this.hint=options.filter(o=>distance(o,p)<31).sort((a,b)=>distance(a,p)-distance(b,p))[0]||null;
  }
  burst(x,y,color,count=18){
    for(let i=0;i<count;i++){const angle=this.random()*Math.PI*2,speed=15+this.random()*65;this.particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-15,color,life:.35+this.random()*.6,size:this.random()>.5?2:1});}
  }
  gainResolve(amount){
    const before=this.stage;this.player.xp+=amount;
    if(this.stage>before){this.player.hp=Math.min(100,this.player.hp+25);this.shake=4;this.effects.push({kind:'unlock',x:this.player.x,y:this.player.y,life:.8,maxLife:.8,r:80});this.burst(this.player.x,this.player.y,'#f6d98d',36);this.emit('unlock',{stage:this.stage});}
    this.dirty=true;
  }
  damageEnemy(enemy,damage){
    if(enemy.dead)return;
    enemy.hp=Math.max(0,enemy.hp-damage);enemy.stun=.27;enemy.flash=.13;
    const d=Math.max(1,distance(enemy,this.player));moveBody(enemy,(enemy.x-this.player.x)/d*8,(enemy.y-this.player.y)/d*8,(x,y)=>isSolid(this.area,x,y));
    this.effects.push({kind:'number',x:enemy.x,y:enemy.y-20,text:String(damage),life:.6,maxLife:.6,color:'#f7d58e'});this.burst(enemy.x,enemy.y,'#b5b6c0',7);
    if(!enemy.hp){enemy.dead=true;this.defeated.add(enemy.id);this.player.coins+=enemy.coins;this.gainResolve(enemy.xp);this.emit('defeated',{id:enemy.id,name:enemy.name});}
  }
  attack(){
    const p=this.player;if(this.mode!=='playing'||p.attackCd)return false;
    p.attackTime=.18;p.attackCd=.33;this.emit('swing');
    for(const e of this.area.enemies){const d=distance(p,e);if(!e.dead&&d<37){const dot=d<17?1:((e.x-p.x)*p.facing.x+(e.y-p.y)*p.facing.y)/d;if(dot>-.12)this.damageEnemy(e,this.attackDamage);}}
    return true;
  }
  power(){
    const p=this.player;if(this.mode!=='playing')return false;
    if(!this.stage){this.emit('message',{text:'Your power is sleeping. Defeat the practice armour to find your first spark.'});return false;}
    if(p.powerCd>0)return false;
    p.powerCd=p.pendant?4.5:7;p.invulnerable=.5;this.shake=4;
    const r=45+this.stage*14;this.effects.push({kind:'power',x:p.x,y:p.y,life:.55,maxLife:.55,r});this.burst(p.x,p.y,'#f2d591',30);
    for(const e of this.area.enemies)if(!e.dead&&distance(p,e)<r)this.damageEnemy(e,17+this.stage*16);
    this.emit('power');return true;
  }
  dodge(){if(this.mode!=='playing'||this.player.dodgeCd)return false;this.player.dodgeTime=.16;this.player.dodgeCd=.8;this.player.invulnerable=.26;this.emit('dodge');return true;}
  heal(){
    const p=this.player;if(this.mode!=='playing')return false;
    if(!p.potions){this.emit('message',{text:'No potions left. Buy one at the family shop for 8 coins.'});return false;}
    if(p.hp>=100){this.emit('message',{text:'Already feeling your best. Save that potion for later.'});return false;}
    p.potions--;p.hp=Math.min(100,p.hp+40);this.burst(p.x,p.y,'#a8cbaa',16);this.emit('healed');return true;
  }
  interact(){
    if(this.mode!=='playing')return false;
    const options=[...this.area.chests.filter(c=>!c.opened),...this.area.npcs,...this.area.exits];
    const o=options.filter(o=>distance(o,this.player)<33).sort((a,b)=>distance(a,this.player)-distance(b,this.player))[0];
    if(!o){this.emit('message',{text:'Get a little closer to a chest, doorway, or family member.'});return false;}
    if(o.type){
      if(o.locked&&!this.defeated.has('warden')){this.emit('message',{text:'The golden chest is sealed by the iron warden.'});return false;}
      const loot=rollLoot(o.type,this.random);o.opened=true;this.opened.add(o.id);this.inventory.push(loot);
      const p=this.player;
      if(loot.id==='potion')p.potions++;
      if(loot.id==='coins')p.coins+=12;
      if(loot.id==='sword')p.weapon=Math.max(8,p.weapon);
      if(loot.id==='blade')p.weapon=12;
      if(loot.id==='boots')p.boots=true;
      if(loot.id==='pendant')p.pendant=true;
      this.burst(o.x,o.y,loot.rarity==='rare'?'#c29be5':'#ebbf72',22);this.emit('loot',{loot,chest:o.type});return true;
    }
    if(o.to){
      if(this.area.id==='hollow'&&o.id==='north'&&!this.stage){this.emit('message',{text:'First, practice on the wayward armour in the courtyard. Space to swing your sword.'});return false;}
      if(this.area.id==='moss'&&o.id==='north'&&this.area.enemies.some(e=>!e.dead)){this.emit('message',{text:'The crypt is sealed. Defeat all three mossway guards to open it.'});return false;}
      this.loadArea(o.to,o.spawn);return true;
    }
    if(o.id==='shop'){this.mode='dialog';this.emit('shop');return true;}
    if(o.id==='uncle'){
      if(!this.defeated.has('warden')){this.mode='dialog';this.emit('uncle-locked');return true;}
      this.rescued=true;this.mode='dialog';this.emit('rescue');return true;
    }
    return false;
  }
  sellJunk(){
    const junk=this.inventory.filter(i=>i.rarity==='trash');const value=junk.reduce((v,i)=>v+i.value,0);
    this.inventory=this.inventory.filter(i=>i.rarity!=='trash');this.player.coins+=value;this.emit('sold',{value,count:junk.length});return value;
  }
  buyPotion(){if(this.player.coins<8){this.emit('message',{text:'A potion costs 8 coins. Sell some junk or defeat a guard first.'});return false;}this.player.coins-=8;this.player.potions++;this.emit('bought');return true;}
  returnHome(){if(!this.rescued)return false;this.returned=true;this.loadArea('hollow',{x:203,y:173});this.mode='complete';this.emit('complete');return true;}
  recover(){this.player.hp=100;this.player.attackCd=0;this.player.powerCd=0;this.loadArea('hollow',{x:352,y:340});this.mode='playing';this.emit('recovered');}
}
