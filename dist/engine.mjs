import {ULTIMATES} from './ultimates.mjs?v=0.3.0';
import {HAMMER_LOOT,lightningBoss,canSummonStorm} from './lightning.mjs?v=0.3.0';
import {EPISODES,CAMPAIGN_IDS} from './campaign.mjs?v=0.3.0';
import {SWORDS} from './swords.mjs?v=0.3.0';
import {clamp,distance,stageFor,rollLoot,moveBody,validSave,SWORD_SWING,inFront} from './core.mjs?v=0.3.0';
import {makeArea,isSolid} from './world.mjs?v=0.3.0';

export class Adventure{
  constructor({random=Math.random,onEvent=()=>{}}={}){
    this.random=random;this.onEvent=onEvent;this.mode='title';this.inventory=[];this.opened=new Set();this.defeated=new Set();this.rescued=false;this.returned=false;this.knightMet=false;this.familyProof=false;this.truthRevealed=false;this.chapter2Started=false;this.storyDone=false;this.campaignStep=0;this.campaignDone=false;
    this.player={x:352,y:340,hp:100,xp:0,coins:0,potions:3,weapon:5,scrapKing:false,scrapKingOwned:false,ultimateCharge:0,weaponSkin:null,specialUnlocked:false,specialCd:0,lightningCd:0,sweepCd:0,guardCd:0,chargeCd:0,guardTime:0,mendCd:0,cycloneCd:0,starsCd:0,boots:false,pendant:false,facing:{x:0,y:1},attackFacing:{x:0,y:1},attackHit:false,attackTime:0,attackCd:0,parryTime:0,parryCd:0,riposteTime:0,parryFacing:{x:0,y:1},powerCd:0,dodgeTime:0,dodgeCd:0,invulnerable:0,hurtFlash:0};
    this.area=makeArea('hollow');this.effects=[];this.particles=[];this.time=0;this.shake=0;this.specialScene=null;this.hint=null;this.dirty=true;
  }
  get stage(){return stageFor(this.player.xp);}
  get attackDamage(){return this.player.scrapKing?999:(SWORDS[this.player.weaponSkin]?.damage??this.player.weapon)+[0,3,6,9][this.stage];}
  get chapter(){return this.campaignStep?3+Math.ceil(this.campaignStep/2):this.familyProof?3:this.returned?2:1;}
  get exits(){return this.area.exits.filter(e=>!e.requires||this[e.requires]);}
  emit(type,data={}){this.dirty=true;this.onEvent({type,...data});}
  start(){this.mode='playing';this.emit('started');}
  snapshot(){
    const {x,y,hp,xp,coins,potions,weapon,scrapKing,scrapKingOwned,ultimateCharge,weaponSkin,specialUnlocked,boots,pendant}=this.player;
    return {version:3,campaignStep:this.campaignStep,campaignDone:this.campaignDone,area:this.area.id,player:{x,y,hp,xp,coins,potions,weapon,scrapKing,scrapKingOwned,ultimateCharge,weaponSkin,specialUnlocked,boots,pendant},inventory:this.inventory,opened:[...this.opened],defeated:[...this.defeated],rescued:this.rescued,returned:this.returned,knightMet:this.knightMet,familyProof:this.familyProof,truthRevealed:this.truthRevealed,chapter2Started:this.chapter2Started,storyDone:this.storyDone};
  }
  restore(data){
    if(!validSave(data))return false;
    this.inventory=data.inventory.map(i=>({...i}));this.opened=new Set(data.opened);this.defeated=new Set(data.defeated);this.rescued=data.rescued;this.returned=!!data.returned;this.knightMet=!!data.knightMet;this.familyProof=!!data.familyProof;this.truthRevealed=!!data.truthRevealed;this.chapter2Started=!!data.chapter2Started;this.storyDone=!!data.storyDone;this.campaignStep=data.campaignStep??0;this.campaignDone=!!data.campaignDone;
    for(const key of ['x','y','hp','xp','coins','potions','weapon','boots','pendant'])this.player[key]=data.player[key];
    this.player.scrapKing=data.player.scrapKing===true;this.player.scrapKingOwned=!!data.player.scrapKingOwned||this.player.scrapKing;this.player.ultimateCharge=data.player.ultimateCharge??0;this.player.weaponSkin=data.player.weaponSkin??null;this.player.specialUnlocked=data.player.specialUnlocked===true;
    this.loadArea(data.area,null);this.mode=this.campaignDone||this.storyDone&&!this.campaignStep?'complete':this.returned&&!this.chapter2Started?'dialog':'playing';this.emit('restored');return true;
  }
  loadArea(id,spawn){
    this.area=makeArea(id);if(id==='hollow'&&this.defeated.has('storm-summoned')){this.area.enemies.push(lightningBoss());if(this.defeated.has('lake-storm')&&!this.opened.has('storm-hammer'))this.area.chests.push({id:'storm-hammer',type:'gold',x:190,y:379,loot:HAMMER_LOOT});}if(spawn){this.player.x=spawn.x;this.player.y=spawn.y;}
    if(isSolid(this.area,this.player.x,this.player.y)){this.player.x=this.area.spawn.x;this.player.y=this.area.spawn.y;}
    for(const e of this.area.enemies)e.dead=this.defeated.has(e.id);
    for(const c of this.area.chests)c.opened=this.opened.has(c.id);
    if(CAMPAIGN_IDS.includes(id)){this.campaignStep=CAMPAIGN_IDS.indexOf(id)+1;this.area.npcs.push({id:'ally',kind:'knight',x:412,y:405,label:'Talk to Rowan'});}
    if(id==='hollow'&&this.returned)this.area.npcs.push({id:'bones-home',kind:'skeleton',x:294,y:335,label:'Talk to Uncle Bones'});
    if(id==='hollow'&&this.storyDone)this.area.npcs=this.area.npcs.filter(n=>n.id!=='customer');
    if(id==='hollow'&&this.storyDone)this.area.npcs.push({id:'grandma-home',kind:'dragon',x:404,y:302,label:'Talk to Grandma'},{id:'ally',kind:'knight',x:436,y:338,label:'Talk to your knight friend'});
    if(id==='ember'){this.area.enemies.find(e=>e.id==='collector').dormant=!this.truthRevealed;if(this.truthRevealed){const ally=this.area.npcs.find(n=>n.id==='rowan');ally.id='ally';ally.x=471;ally.y=390;}}
    this.player.invulnerable=1.1;this.player.attackTime=0;this.player.attackCd=0;this.player.dodgeTime=0;this.player.parryTime=0;this.player.riposteTime=0;this.player.guardTime=0;this.specialScene=null;this.effects=[];this.particles=[];this.hint=null;this.emit('area',{area:id});
  }
  tick(dt,input={}){
    dt=clamp(dt,0,.05);this.time+=dt;this.shake=Math.max(0,this.shake-dt*18);
    this.effects=this.effects.filter(e=>(e.life-=dt)>0);this.particles=this.particles.filter(p=>{p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=20*dt;return p.life>0;});
    if(this.mode==='special'){const scene=this.specialScene;scene.elapsed+=dt;if(!scene.hit&&scene.elapsed>=scene.duration*.68){scene.hit=true;for(const e of this.area.enemies)if(!e.dead&&!e.dormant)this.damageEnemy(e,scene.damage);this.effects.push({kind:'power',x:this.player.x,y:this.player.y,life:.7,maxLife:.7,r:180,color:scene.color});this.burst(this.player.x,this.player.y,scene.color,70);this.shake=7;this.emit('special-impact');}if(scene.elapsed>=scene.duration){this.specialScene=null;this.mode='playing';this.player.specialCd=12;this.emit('special-end');}return;}
    if(this.mode!=='playing')return;
    const p=this.player;
    for(const k of ['attackTime','attackCd','parryTime','parryCd','riposteTime','specialCd','lightningCd','sweepCd','guardCd','chargeCd','guardTime','mendCd','cycloneCd','starsCd','powerCd','dodgeTime','dodgeCd','invulnerable','hurtFlash'])p[k]=Math.max(0,p[k]-dt);
    let dx=(input.right?1:0)-(input.left?1:0),dy=(input.down?1:0)-(input.up?1:0);
    const len=Math.hypot(dx,dy);
    if(len){dx/=len;dy/=len;if(!p.dodgeTime&&!p.attackTime&&!p.parryTime)p.facing={x:dx,y:dy};}
    if(p.dodgeTime){dx=p.facing.x;dy=p.facing.y;}
    if(input.charge&&!p.attackTime&&!p.dodgeTime&&!p.parryTime){p.ultimateCharge=Math.min(100,p.ultimateCharge+18*dt);dx=0;dy=0;}
    const speed=p.dodgeTime?230:(p.boots?90:74)*(p.attackTime?.45:1);
    moveBody(p,dx*dt*speed,dy*dt*speed,(x,y)=>isSolid(this.area,x,y));
    const elapsed=SWORD_SWING.duration-p.attackTime;
    if(p.attackTime&&!p.attackHit&&elapsed>=SWORD_SWING.hitAt){
      p.attackHit=true;if(canSummonStorm(this)){this.defeated.add('storm-summoned');this.area.enemies.push(lightningBoss());this.effects.push({kind:'lightning',x:190,y:379,life:.55,maxLife:.55,r:38,color:'#91dce9'});this.emit('storm-summoned');}this.emit('swing');this.effects.push({kind:'slash',x:p.x,y:p.y-8,angle:Math.atan2(p.attackFacing.y,p.attackFacing.x),life:.25,maxLife:.25,r:p.scrapKing?44:32,color:p.scrapKing?'#e4ab6c':SWORDS[p.weaponSkin]?.color??'#dbe7d7'});
      moveBody(p,p.attackFacing.x*3,p.attackFacing.y*3,(x,y)=>isSolid(this.area,x,y));
      for(const e of this.area.enemies)if(!e.dead&&!e.dormant&&inFront(p,e,p.attackFacing,p.scrapKing?44:SWORD_SWING.reach,SWORD_SWING.halfAngle))this.damageEnemy(e,Math.round(this.attackDamage*(p.riposteTime?1.5:1)));
      p.riposteTime=0;
    }
    for(const e of this.area.enemies){
      if(e.dead||e.dormant)continue;
      e.cooldown=Math.max(0,e.cooldown-dt);e.stun=Math.max(0,e.stun-dt);e.flash=Math.max(0,e.flash-dt);e.swingTime=Math.max(0,e.swingTime-dt);
      const d=distance(e,p),boss=e.kind==='boss';
      if(e.id==='lake-storm'){
        e.stormCd=Math.max(0,e.stormCd-dt);
        if(e.stormCast){e.stormCast.time-=dt;if(e.stormCast.time<=0){const strike=e.stormCast;e.stormCast=null;e.stormCd=2.5;this.effects.push({kind:'lightning',x:strike.x,y:strike.y,life:.45,maxLife:.45,r:28,color:'#91dce9'});this.burst(strike.x,strike.y,'#91dce9',24);if(!p.invulnerable&&distance(p,strike)<26){p.hp=Math.max(0,p.hp-(p.guardTime?9:18));p.invulnerable=.65;this.emit('hurt');if(!p.hp){this.mode='dead';this.emit('death');return;}}}}
        else if(!e.stormCd&&d<230)e.stormCast={x:p.x,y:p.y,time:.85};
      }
      if(e.knockback){moveBody(e,e.knockback.x*dt,e.knockback.y*dt,(x,y)=>isSolid(this.area,x,y));e.knockback.time-=dt;if(e.knockback.time<=0)e.knockback=null;}
      if(e.windup>0){
        e.windup=Math.max(0,e.windup-dt);
        if(e.windup===0){
          e.swingTime=.18;e.cooldown=boss?1.2:.9;
          if(inFront(e,p,e.attackFacing,boss?38:28)&&p.parryTime&&inFront(p,e,p.parryFacing,48,Math.PI*.4)){
            this.damageEnemy(e,Math.ceil(this.attackDamage*.5));e.stun=1.1;e.cooldown=1.6;p.parryTime=0;p.riposteTime=1.5;p.ultimateCharge=Math.min(100,p.ultimateCharge+20);this.effects.push({kind:'parry',x:p.x,y:p.y,life:.4,maxLife:.4,r:27});this.burst(p.x,p.y,'#f8e0a0',14);this.emit('parried');
          }else if(!p.invulnerable&&inFront(e,p,e.attackFacing,boss?38:28)){
            p.hp=Math.max(0,p.hp-(p.guardTime?Math.ceil(e.damage*.5):e.damage));p.invulnerable=.65;p.hurtFlash=.12;this.shake=2;this.burst(p.x,p.y,'#ec8c79',6);this.emit('hurt');
            if(p.hp===0){this.mode='dead';this.emit('death');return;}
          }
        }
        continue;
      }
      if(e.kind!=='practice'&&d<(boss?190:145)&&d>19&&!e.stun&&!e.swingTime){
        const speed=boss?28:36;moveBody(e,(p.x-e.x)/d*dt*speed,(p.y-e.y)/d*dt*speed,(x,y)=>isSolid(this.area,x,y));
      }
      if(d<(boss?34:25)&&!e.cooldown&&!e.stun&&!e.swingTime){
        e.windup=boss?.5:.34;e.attackFacing={x:d?(p.x-e.x)/d:0,y:d?(p.y-e.y)/d:1};
      }
    }
    if((this.area.id==='ember'||this.area.campaignStep)&&this.truthRevealed){
      const ally=this.area.npcs.find(n=>n.id==='ally');
      if(ally){
        ally.cooldown=Math.max(0,(ally.cooldown||0)-dt);ally.swingTime=Math.max(0,(ally.swingTime||0)-dt);
        const targets=this.area.enemies.filter(e=>!e.dead&&!e.dormant).sort((a,b)=>distance(a,ally)-distance(b,ally));
        const target=targets[0];
        if(target){const d=distance(ally,target);if(d>25)moveBody(ally,(target.x-ally.x)/d*42*dt,(target.y-ally.y)/d*42*dt,(x,y)=>isSolid(this.area,x,y));else if(!ally.cooldown){ally.cooldown=1.2;ally.swingTime=.25;ally.attackFacing={x:d?(target.x-ally.x)/d:0,y:d?(target.y-ally.y)/d:-1};this.effects.push({kind:'number',x:target.x,y:target.y-29,text:'Rowan',life:.5,maxLife:.5,color:'#c5d9e2'});this.damageEnemy(target,8);}}
      }
    }
    if(p.dodgeTime){this.particles.push({kind:'trail',x:p.x,y:p.y-5,vx:0,vy:0,color:'#b5d8cf',life:.18,size:3});}
    const options=[...this.area.chests.filter(c=>!c.opened),...this.area.npcs,...this.exits];
    this.hint=options.filter(o=>distance(o,p)<31).sort((a,b)=>distance(a,p)-distance(b,p))[0]||null;
  }
  burst(x,y,color,count=18){
    if(this.particles.length>=280)return;count=Math.min(count,280-this.particles.length);for(let i=0;i<count;i++){const angle=this.random()*Math.PI*2,speed=15+this.random()*65;this.particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-15,color,life:.35+this.random()*.6,size:this.random()>.5?2:1});}
  }
  gainResolve(amount){
    const before=this.stage;this.player.xp+=amount;
    if(this.stage>before){this.player.hp=Math.min(100,this.player.hp+25);this.shake=4;this.effects.push({kind:'unlock',x:this.player.x,y:this.player.y,life:.8,maxLife:.8,r:80});this.burst(this.player.x,this.player.y,'#f6d98d',36);this.emit('unlock',{stage:this.stage});}
    this.dirty=true;
  }
  damageEnemy(enemy,damage){
    if(enemy.dead||enemy.dormant)return;
    if(this.mode!=='special')this.player.ultimateCharge=Math.min(100,this.player.ultimateCharge+12);enemy.hp=Math.max(0,enemy.hp-damage);enemy.stun=enemy.kind==='boss'?.06:.16;enemy.flash=.1;if(enemy.kind!=='boss')enemy.windup=0;
    const d=Math.max(1,distance(enemy,this.player));enemy.knockback={x:(enemy.x-this.player.x)/d*65,y:(enemy.y-this.player.y)/d*65,time:.12};this.shake=Math.max(this.shake,1.2);
    this.effects.push({kind:'impact',x:enemy.x,y:enemy.y-10,life:.18,maxLife:.18,r:this.player.scrapKing?16:10,color:this.player.scrapKing?'#e4ab6c':SWORDS[this.player.weaponSkin]?.color??'#f5e4b6'});
    this.effects.push({kind:'number',x:enemy.x,y:enemy.y-20,text:String(damage),life:.6,maxLife:.6,color:'#f7d58e'});this.burst(enemy.x,enemy.y,'#b5b6c0',7);
    if(!enemy.hp){enemy.dead=true;this.effects.push({kind:'shatter',x:enemy.x,y:enemy.y-10,life:.55,maxLife:.55,r:enemy.kind==='boss'?42:24,color:'#adc4c7'});this.burst(enemy.x,enemy.y-10,'#a8b8b4',enemy.kind==='boss'?32:16);this.defeated.add(enemy.id);this.player.coins+=enemy.coins;this.gainResolve(enemy.xp);this.emit('defeated',{id:enemy.id,name:enemy.name});if(enemy.id==='lake-storm'){if(this.inventory.length<200){this.inventory.push({...HAMMER_LOOT});this.player.weaponSkin=HAMMER_LOOT.skin;this.opened.add('storm-hammer');this.emit('hammer-earned');}else{this.area.chests.push({id:'storm-hammer',type:'gold',x:enemy.x,y:enemy.y,loot:HAMMER_LOOT});this.emit('message',{text:'The Tempest dropped Thunderwake! Make room, then open its chest.'});}}}
  }
  attack(){
    const p=this.player;if(this.mode!=='playing'||p.attackCd)return false;
    if(p.dodgeTime||p.parryTime)return false;
    p.attackTime=SWORD_SWING.duration;p.attackCd=SWORD_SWING.cooldown;p.attackFacing={...p.facing};p.attackHit=false;
    return true;
  }
  ability(kind){
    const p=this.player;if(this.mode!=='playing'||p.attackTime||p.dodgeTime)return false;
    const requirement={sweep:1,guard:2,charge:3,mend:1,cyclone:2,stars:3}[kind],cd=kind+'Cd';if(requirement===undefined||this.stage<requirement||p[cd])return false;
    p[cd]={sweep:4,guard:10,charge:6,mend:14,cyclone:7,stars:12}[kind];
    if(kind==='mend'){p.hp=Math.min(100,p.hp+20);this.effects.push({kind:'heal',x:p.x,y:p.y-8,life:1,maxLife:1,r:28,color:'#a8d5b1'});this.burst(p.x,p.y,'#a8d5b1',30);}
    else if(kind==='cyclone'||kind==='stars'){const radius=kind==='stars'?100:52;this.effects.push({kind:'power',x:p.x,y:p.y,life:.65,maxLife:.65,r:radius,color:kind==='stars'?'#d3bbf5':'#b8e4f5'});for(const e of this.area.enemies)if(!e.dead&&!e.dormant&&distance(p,e)<radius){if(kind==='stars')this.effects.push({kind:'lightning',x:e.x,y:e.y,life:.65,maxLife:.65,r:30,color:'#d3bbf5'});this.damageEnemy(e,Math.round(this.attackDamage*(kind==='stars'?2:1.3)));}this.burst(p.x,p.y,kind==='stars'?'#d3bbf5':'#b8e4f5',40);}
    else if(kind==='guard'){p.guardTime=3;this.effects.push({kind:'heal',x:p.x,y:p.y-8,life:.6,maxLife:.6,r:25,color:'#a8d5b1'});}
    else{
      if(kind==='charge')for(let i=0;i<12;i++)moveBody(p,p.facing.x*5,p.facing.y*5,(x,y)=>isSolid(this.area,x,y));
      this.effects.push({kind:'slash',x:p.x,y:p.y-8,angle:Math.atan2(p.facing.y,p.facing.x),life:.4,maxLife:.4,r:kind==='charge'?64:58,color:'#f5da91'});
      for(const e of this.area.enemies)if(!e.dead&&!e.dormant&&inFront(p,e,p.facing,kind==='charge'?64:58,Math.PI*.5))this.damageEnemy(e,Math.round(this.attackDamage*(kind==='charge'?2:1.6)));
      this.burst(p.x,p.y-8,'#f5da91',24);
    }
    this.emit('ability',{kind});return true;
  }
  lightning(){
    const p=this.player;if(this.mode!=='playing'||p.scrapKing||p.weaponSkin!=='thunderhammer'||p.lightningCd)return false;
    p.lightningCd=8;const target=this.area.enemies.filter(e=>!e.dead&&!e.dormant&&distance(p,e)<180).sort((a,b)=>distance(p,a)-distance(p,b))[0]??{x:p.x+p.facing.x*50,y:p.y+p.facing.y*50};
    this.effects.push({kind:'lightning',x:target.x,y:target.y,life:.65,maxLife:.65,r:38,color:'#91dce9'});this.burst(target.x,target.y,'#91dce9',40);this.shake=4;
    for(const e of this.area.enemies)if(!e.dead&&!e.dormant&&distance(target,e)<38)this.damageEnemy(e,65);
    this.emit('ability',{kind:'lightning'});return true;
  }
  special({reducedMotion=false}={}){
    const p=this.player;if(this.mode!=='playing'||p.specialCd||p.ultimateCharge<100||p.weaponSkin==='thunderhammer'&&!p.scrapKing)return false;
    if(p.scrapKing?!p.specialUnlocked:!this.stage)return false;
    const skin=p.scrapKing?'scrap-king':p.weaponSkin??'normal',theme=ULTIMATES[skin];
    p.ultimateCharge=0;p.attackTime=0;p.parryTime=0;p.dodgeTime=0;p.attackHit=true;
    this.specialScene={elapsed:0,duration:reducedMotion?.65:2.6,hit:false,reducedMotion,skin,theme,color:p.scrapKing?'#e4ab6c':SWORDS[p.weaponSkin]?.color??'#f5da91',damage:p.scrapKing?999:Math.round(this.attackDamage*3)};
    this.mode='special';this.emit('special-start',{theme,skin});return true;
  }
  parry(){const p=this.player;if(this.mode!=='playing'||p.parryCd||p.dodgeTime)return false;p.attackTime=0;p.attackHit=true;p.parryTime=.2;p.parryCd=.7;p.parryFacing={...p.facing};this.emit('parry-start');return true;}
  equipSword(skin){if(!Object.hasOwn(SWORDS,skin)||!this.inventory.some(i=>i.skin===skin))return false;this.player.weaponSkin=skin;this.player.scrapKing=false;this.emit('equipped',{skin});return true;}
  power(){
    const p=this.player;if(this.mode!=='playing')return false;
    if(!this.stage){this.emit('message',{text:'Your power is sleeping. Defeat the practice armour to find your first spark.'});return false;}
    if(p.powerCd>0)return false;
    p.attackTime=0;p.attackHit=true;p.powerCd=p.pendant?4.5:7;p.invulnerable=.5;this.shake=4;
    const r=45+this.stage*14;this.effects.push({kind:'power',x:p.x,y:p.y,life:.55,maxLife:.55,r});this.burst(p.x,p.y,'#f2d591',30);
    for(const e of this.area.enemies)if(!e.dead&&!e.dormant&&distance(p,e)<r)this.damageEnemy(e,17+this.stage*16);
    this.emit('power');return true;
  }
  dodge(){if(this.mode!=='playing'||this.player.dodgeCd)return false;this.player.attackTime=0;this.player.attackHit=true;this.player.parryTime=0;this.player.dodgeTime=.16;this.player.dodgeCd=.8;this.player.invulnerable=.3;this.effects.push({kind:'dust',x:this.player.x,y:this.player.y,life:.3,maxLife:.3,r:14,color:'#b6ceb7'});this.emit('dodge');return true;}
  heal(){
    const p=this.player;if(this.mode!=='playing')return false;
    if(!p.potions){this.emit('message',{text:'No potions left. Buy one at the family shop for 8 coins.'});return false;}
    if(p.hp>=100){this.emit('message',{text:'Already feeling your best. Save that potion for later.'});return false;}
    p.potions--;p.hp=Math.min(100,p.hp+40);this.effects.push({kind:'heal',x:p.x,y:p.y-8,life:.8,maxLife:.8,r:25,color:'#a8d5b1'});this.burst(p.x,p.y,'#a8cbaa',24);this.emit('healed');return true;
  }
  interact(){
    if(this.mode!=='playing')return false;
    const options=[...this.area.chests.filter(c=>!c.opened),...this.area.npcs,...this.exits];
    const o=options.filter(o=>distance(o,this.player)<33).sort((a,b)=>distance(a,this.player)-distance(b,this.player))[0];
    if(!o){this.emit('message',{text:'Get a little closer to a chest, doorway, or family member.'});return false;}
    if(o.type){
      if((o.locked||o.lockedBy)&&!this.defeated.has(o.lockedBy||'warden')){this.emit('message',{text:'Defeat this area’s boss to unseal the golden chest.'});return false;}
      if(this.inventory.length>=200){this.emit('message',{text:'Your satchel is full. Sell some junk first.'});return false;}const loot=o.loot?{...o.loot}:rollLoot(o.type,this.random);o.opened=true;this.opened.add(o.id);this.inventory.push(loot);
      const p=this.player;
      if(loot.skin&&Object.hasOwn(SWORDS,loot.skin)){const current=SWORDS[p.weaponSkin]?.damage??p.weapon;if(SWORDS[loot.skin].damage>=current)p.weaponSkin=loot.skin;}
      if(loot.id==='potion')p.potions++;
      if(loot.id==='coins')p.coins+=12;
      if(loot.id==='sword')p.weapon=Math.max(8,p.weapon);
      if(loot.id==='blade')p.weapon=12;
      if(loot.id==='boots')p.boots=true;
      if(loot.id==='pendant')p.pendant=true;
      this.effects.push({kind:'treasure',x:o.x,y:o.y-10,life:loot.rarity==='rare'?1.6:.8,maxLife:loot.rarity==='rare'?1.6:.8,r:loot.rarity==='rare'?44:24,color:loot.rarity==='rare'?'#c29be5':'#ebbf72'});this.burst(o.x,o.y,loot.rarity==='rare'?'#c29be5':'#ebbf72',loot.rarity==='rare'?48:24);this.emit('loot',{loot,chest:o.type});return true;
    }
    if(o.to){
      if(this.area.id==='hollow'&&o.id==='north'&&!this.stage){this.emit('message',{text:'First, practice on the wayward armour in the courtyard. Space to swing your sword.'});return false;}
      if(this.area.id==='moss'&&o.id==='north'&&this.area.enemies.some(e=>!e.dead)){this.emit('message',{text:'The crypt is sealed. Defeat all three mossway guards to open it.'});return false;}
      if(this.area.id==='thorn'&&o.id==='north'&&this.area.enemies.some(e=>!e.dead)){this.emit('message',{text:'Clear the sentries to reach the family archive.'});return false;}
      if(this.area.id==='tower'&&o.id==='north'&&!this.familyProof){this.emit('message',{text:'Collect the family portrait first. Rowan needs to see the truth.'});return false;}
      if(this.area.campaignStep&&o.id==='north'){if(!this.defeated.has(this.area.id+'-read')){this.emit('message',{text:'Clear the room and talk to '+this.area.speaker+' before continuing.'});return false;}}
      if(o.id==='east'&&this.storyDone&&!this.campaignDone){this.beginCampaign();return true;}
      if(o.to==='thorn'&&!this.knightMet){this.mode='dialog';this.emit('knight-customer');return false;}
      if(o.to==='thorn')this.chapter2Started=true;
      this.loadArea(o.to,o.spawn);if(this.area.campaignStep&&!this.defeated.has(this.area.id+'-visited')){this.mode='dialog';this.emit('campaign-arrival',{episode:EPISODES[this.area.campaignStep-1]});}return true;
    }
    if(o.id==='campaign-lore'){if(this.area.enemies.some(e=>!e.dead)){this.emit('message',{text:'Defeat the constructs before meeting '+this.area.speaker+'.'});return false;}this.defeated.add(this.area.id+'-read');this.mode='dialog';this.emit('campaign-lore',{episode:EPISODES[this.area.campaignStep-1]});return true;}
    if(o.id==='shop'){this.mode='dialog';this.emit('shop');return true;}
    if(o.id==='bones-home'||o.id==='grandma-home'){this.mode='dialog';this.emit('family-home',{who:o.id});return true;}
    if(o.id==='uncle'){
      if(!this.defeated.has('warden')){this.mode='dialog';this.emit('uncle-locked');return true;}
      this.rescued=true;this.mode='dialog';this.emit('rescue');return true;
    }
    if(o.id==='customer'){this.mode='dialog';this.emit(this.returned?'knight-customer':'knight-intro');return true;}
    if(o.id==='portrait'){this.mode='dialog';if(!this.defeated.has('archivist')){this.emit('portrait-locked');return true;}this.familyProof=true;this.emit('family-proof');return true;}
    if(o.id==='rowan'){this.mode='dialog';if(!this.familyProof){this.emit('message',{text:'Bring the family portrait from the archive first.'});this.mode='playing';return false;}this.emit('reveal');return true;}
    if(o.id==='ally'){this.mode='dialog';this.emit('ally');return true;}
    if(o.id==='grandma'){
      this.mode='dialog';
      if(!this.truthRevealed){this.emit('reveal');return true;}
      if(!this.defeated.has('collector')){this.emit('grandma-locked');return true;}
      this.emit('grandma-rescued');return true;
    }
    return false;
  }
  sellJunk(){
    const junk=this.inventory.filter(i=>i.rarity==='trash');const value=junk.reduce((v,i)=>v+i.value,0);
    this.inventory=this.inventory.filter(i=>i.rarity!=='trash');this.player.coins+=value;this.emit('sold',{value,count:junk.length});return value;
  }
  buyPotion(){if(this.player.coins<8){this.emit('message',{text:'A potion costs 8 coins. Sell some junk or defeat a guard first.'});return false;}this.player.coins-=8;this.player.potions++;this.emit('bought');return true;}
  returnHome(){if(!this.rescued)return false;this.returned=true;this.loadArea('hollow',{x:330,y:310});this.mode='dialog';this.emit('chapter');return true;}
  meetKnight(){if(!this.returned)return false;if(!this.knightMet){this.player.coins+=8;this.knightMet=true;}this.chapter2Started=true;this.mode='dialog';this.emit('knight-customer');return true;}
  continueStory(){if(!this.returned||!this.knightMet)return false;this.chapter2Started=true;this.player.hp=100;this.player.potions=Math.max(3,this.player.potions);this.loadArea(this.familyProof?'ember':'thorn',{x:352,y:416});this.mode='playing';this.emit('continued');return true;}
  revealTruth(){if(!this.familyProof||this.area.id!=='ember')return false;this.truthRevealed=true;const official=this.area.enemies.find(e=>e.id==='collector');official.dormant=false;official.cooldown=1;const rowan=this.area.npcs.find(n=>n.id==='rowan');if(rowan){rowan.id='ally';rowan.x=428;rowan.y=235;rowan.cooldown=.8;}this.mode='playing';this.emit('truth-revealed');return true;}
  finishStory(){if(!this.truthRevealed||!this.defeated.has('collector'))return false;this.storyDone=true;this.loadArea('hollow',{x:330,y:310});this.mode='complete';this.emit('complete');return true;}
  beginCampaign(){if(!this.storyDone||this.campaignDone)return false;const next=this.campaignStep||1;this.loadArea(EPISODES[next-1].id,{x:352,y:414});this.player.hp=100;this.player.potions=Math.max(3,this.player.potions);this.mode='dialog';this.emit('campaign-arrival',{episode:EPISODES[next-1]});return true;}
  advanceCampaign(){if(!this.area.campaignStep||!this.defeated.has(this.area.id+'-read'))return false;if(this.area.campaignStep===EPISODES.length){this.campaignDone=true;this.loadArea('hollow',{x:330,y:310});this.mode='complete';this.emit('campaign-complete');return true;}const next=this.area.campaignStep+1;this.loadArea(EPISODES[next-1].id,{x:352,y:414});this.player.hp=Math.min(100,this.player.hp+35);this.player.potions=Math.max(2,this.player.potions);this.mode='dialog';this.emit('campaign-arrival',{episode:EPISODES[next-1]});return true;}
  buyMysteryChest(){if(this.inventory.length>=200){this.emit('message',{text:'Your satchel is full. Sell some junk first.'});return false;}if(this.player.coins<50)return false;this.player.coins-=50;const chest={id:'shop-crate-'+this.opened.size,type:'gold',x:this.player.x,y:this.player.y,opened:false};this.area.chests.push(chest);const previous=this.mode;this.mode='playing';this.interact();this.mode=previous;return true;}
  replayCampaign(){if(!this.campaignDone)return false;for(const id of [...this.defeated])if(CAMPAIGN_IDS.some(prefix=>id.startsWith(prefix+'-')))this.defeated.delete(id);for(const id of [...this.opened])if(CAMPAIGN_IDS.some(prefix=>id.startsWith(prefix+'-')))this.opened.delete(id);this.campaignDone=false;this.campaignStep=1;return this.beginCampaign();}
  recover(){this.player.hp=100;this.player.attackCd=0;this.player.powerCd=0;this.loadArea('hollow',{x:352,y:340});this.mode='playing';this.emit('recovered');}
}
