import test from 'node:test';
import assert from 'node:assert/strict';
import {rollLoot,stageFor,validSave,moveBody,LOOT_ODDS} from './dist/core.mjs?v=0.2.0';
import {Adventure} from './dist/engine.mjs';
import {isSolid,AREAS} from './dist/world.mjs?v=0.2.0';

function step(g,seconds,input={}){for(let t=0;t<seconds-1e-6;t+=.01)g.tick(Math.min(.01,seconds-t),input);}
function beat(g,e){
  let hits=0;
  while(!e.dead&&hits++<100){
    g.player.x=e.x;g.player.y=e.y+20;g.player.facing={x:0,y:-1};g.player.invulnerable=99;
    assert.ok(g.attack());step(g,.5);
  }
  assert.ok(e.dead,e.id);
}
function interactAt(g,o){g.player.x=o.x;g.player.y=o.y;return g.interact();}

test('chest rarity boundaries match all three agreed loot tables',()=>{
  for(const [type,[trash,useful,rare]] of Object.entries(LOOT_ODDS)){
    assert.equal(trash+useful+rare,100);
    for(const [r,expected] of [[0,'trash'],[(trash-.01)/100,'trash'],[trash/100,'useful'],[(trash+useful-.01)/100,'useful'],[(trash+useful)/100,'rare'],[.9999,'rare']]){
      const values=[r,0];assert.equal(rollLoot(type,()=>values.shift()).rarity,expected,type+' at '+r);
    }
  }
});
test('resolve thresholds unlock independently of random items',()=>{
  assert.deepEqual([0,11,12,37,38,79,80,200].map(stageFor),[0,0,1,1,2,2,3,3]);
});
test('movement respects collisions and slides along walls',()=>{
  const b={x:10,y:10};moveBody(b,10,5,(x)=>x>22);assert.equal(b.x,10);assert.equal(b.y,15);
});
test('chests open once, and junk converts into coins at the shop',()=>{
  const g=new Adventure({random:()=>0});g.start();const c=g.area.chests[0];g.player.x=c.x;g.player.y=c.y;
  assert.equal(g.interact(),true);assert.equal(g.inventory.length,1);assert.ok(g.opened.has(c.id));
  assert.equal(g.interact(),false);assert.equal(g.inventory.length,1);
  assert.equal(g.sellJunk(),3);assert.equal(g.player.coins,3);assert.equal(g.inventory.length,0);
});
test('rare loot equips automatically, without stacking duplicate bonuses',()=>{
  const seq=[.99,0];const g=new Adventure({random:()=>seq.shift()??.5});g.start();const c=g.area.chests[0];g.player.x=c.x;g.player.y=c.y;g.interact();
  assert.equal(g.player.weapon,12);assert.equal(g.inventory[0].rarity,'rare');assert.equal(g.stage,0);
});
test('all three chapters follow the family, customer, bounty, reveal and team-up story without rare loot',()=>{
  const events=[];const g=new Adventure({random:()=>0,onEvent:e=>events.push(e)});g.start();
  interactAt(g,g.area.npcs.find(n=>n.id==='customer'));assert.equal(events.at(-1).type,'knight-intro');g.mode='playing';
  beat(g,g.area.enemies[0]);assert.equal(g.stage,1);assert.ok(g.power());assert.equal(g.power(),false);
  g.player.x=352;g.player.y=64;assert.ok(g.interact());assert.equal(g.area.id,'moss');
  g.player.x=352;g.player.y=49;assert.equal(g.interact(),false,'guards seal the crypt');
  for(const e of g.area.enemies)beat(g,e);
  g.player.x=352;g.player.y=49;assert.ok(g.interact());assert.equal(g.area.id,'crypt');
  const gold=g.area.chests.find(c=>c.type==='gold');g.player.x=gold.x;g.player.y=gold.y;assert.equal(g.interact(),false,'boss guards golden chest');
  for(const e of g.area.enemies)beat(g,e);assert.equal(g.stage,3);assert.equal(g.player.weapon,5);
  g.player.x=352;g.player.y=94;assert.ok(g.interact());assert.equal(g.rescued,true);assert.ok(g.returnHome());assert.equal(g.mode,'dialog');assert.equal(g.area.id,'hollow');assert.equal(g.chapter,2);
  assert.equal(events.some(e=>e.type==='complete'),false,'Uncle Bones is not the ending');
  assert.ok(g.meetKnight());const coins=g.player.coins;g.meetKnight();assert.equal(g.player.coins,coins,'customer purchase only rewards once');
  assert.ok(g.continueStory());assert.equal(g.area.id,'thorn');
  assert.equal(interactAt(g,g.area.exits.find(e=>e.id==='north')),false,'road guards block archive');
  for(const e of g.area.enemies)beat(g,e);
  assert.ok(interactAt(g,g.area.exits.find(e=>e.id==='north')));assert.equal(g.area.id,'tower');
  interactAt(g,g.area.npcs[0]);assert.equal(g.familyProof,false);assert.equal(events.at(-1).type,'portrait-locked');g.mode='playing';
  assert.equal(interactAt(g,g.area.exits.find(e=>e.id==='north')),false,'portrait required before meeting Rowan');
  for(const e of g.area.enemies)beat(g,e);
  assert.ok(interactAt(g,g.area.npcs[0]));assert.ok(g.familyProof);assert.equal(g.chapter,3);
  assert.ok(g.continueStory());assert.equal(g.area.id,'ember');
  const official=g.area.enemies.find(e=>e.id==='collector');assert.ok(official.dormant);
  g.player.x=official.x;g.player.y=official.y;g.player.powerCd=0;g.power();assert.equal(official.hp,official.maxHp,'official cannot fight before the reveal');
  assert.ok(interactAt(g,g.area.npcs.find(n=>n.id==='rowan')));assert.equal(events.at(-1).type,'reveal');assert.equal(g.truthRevealed,false);
  assert.ok(g.revealTruth());assert.equal(official.dormant,false);assert.ok(g.area.npcs.some(n=>n.id==='ally'));
  assert.equal(g.finishStory(),false,'team must stop the official');
  for(const e of g.area.enemies)beat(g,e);
  assert.ok(interactAt(g,g.area.npcs.find(n=>n.id==='grandma')));assert.equal(events.at(-1).type,'grandma-rescued');
  assert.ok(g.finishStory());assert.equal(g.mode,'complete');assert.equal(g.area.id,'hollow');assert.ok(g.storyDone);
  assert.ok(g.area.npcs.some(n=>n.id==='grandma-home'));assert.ok(g.area.npcs.some(n=>n.id==='ally'));
  assert.ok(events.some(e=>e.type==='unlock'));assert.ok(events.some(e=>e.type==='complete'));assert.equal(g.inventory.length,0);assert.equal(g.player.weapon,5);
});
test('all region exits and spawns are walkable',()=>{
  const g=new Adventure();for(const id of Object.keys(AREAS)){g.loadArea(id,null);assert.equal(isSolid(g.area,g.area.spawn.x,g.area.spawn.y),false,id);for(const e of g.area.exits)assert.equal(isSolid(g.area,e.x,e.y),false,id+' '+e.id);for(const o of [...g.area.npcs,...g.area.chests])assert.equal(isSolid(g.area,o.x,o.y),false,id+' '+o.id);}
});
test('save and restore preserve loot, cleared foes, power and chapter completion',()=>{
  const g=new Adventure();g.start();g.player.xp=80;g.player.weapon=12;g.player.boots=true;g.player.coins=25;g.defeated.add('warden');g.rescued=true;g.returnHome();
  const snapshot=JSON.parse(JSON.stringify(g.snapshot()));assert.ok(validSave(snapshot));const restored=new Adventure();assert.ok(restored.restore(snapshot));assert.equal(restored.stage,3);assert.equal(restored.mode,'dialog');assert.equal(restored.chapter,2);assert.equal(restored.player.weapon,12);assert.ok(restored.defeated.has('warden'));assert.ok(restored.player.boots);
  assert.equal(restored.restore({...snapshot,player:{...snapshot.player,x:NaN}}),false);assert.equal(restored.restore({...snapshot,inventory:[{rarity:'rare'}]}),false);
});
test('death recovery keeps progression and loot, restoring full health',()=>{
  const g=new Adventure();g.start();g.player.xp=38;g.player.hp=1;g.player.invulnerable=0;const e=g.area.enemies[0];g.player.x=e.x;g.player.y=e.y;e.cooldown=0;step(g,.4);assert.equal(g.mode,'dead');g.recover();assert.equal(g.player.hp,100);assert.equal(g.stage,2);assert.equal(g.area.id,'hollow');
});

test('existing chapter-one saves continue into chapter two without losing equipment or progress',()=>{
  const g=new Adventure();g.rescued=true;g.returned=true;g.player.xp=80;g.player.weapon=12;g.player.coins=51;g.opened.add('crypt-gold');g.defeated.add('warden');
  const old={...g.snapshot(),version:1};for(const k of ['knightMet','familyProof','truthRevealed','chapter2Started','storyDone'])delete old[k];
  const restored=new Adventure();assert.ok(restored.restore(old));assert.equal(restored.chapter,2);assert.equal(restored.storyDone,false);assert.equal(restored.mode,'dialog');assert.equal(restored.player.weapon,12);assert.equal(restored.player.coins,51);assert.ok(restored.opened.has('crypt-gold'));restored.meetKnight();assert.ok(restored.continueStory());assert.equal(restored.area.id,'thorn');
});
test('sword winds up, hits only in front once, and locks its direction until recovery',()=>{
  const g=new Adventure();g.start();const front=g.area.enemies[0];g.player.x=382;g.player.y=288;g.player.facing={x:0,y:-1};
  const behind={...front,id:'behind',y:309};g.area.enemies.push(behind);
  assert.ok(g.attack());assert.equal(front.hp,20);step(g,.08,{down:true});assert.equal(front.hp,20,'wind-up has no damage');assert.equal(g.player.facing.y,-1);
  step(g,.06);assert.equal(front.hp,15);assert.equal(behind.hp,20,'rear targets untouched');assert.equal(g.attack(),false,'cannot spam mid-swing');
  step(g,.39);assert.equal(front.hp,15,'one hit per swing');assert.ok(g.attack());
});
test('dodging cancels a sword before impact, and enemy wind-ups can be escaped',()=>{
  const g=new Adventure();g.start();const e=g.area.enemies[0];g.player.x=e.x;g.player.y=e.y+20;g.player.facing={x:0,y:-1};g.attack();step(g,.04);g.dodge();step(g,.15);assert.equal(e.hp,20);assert.equal(g.attack(),false,'no attack during dodge');
  step(g,.7);g.player.x=e.x;g.player.y=e.y+20;g.player.invulnerable=0;e.cooldown=0;step(g,.01);assert.ok(e.windup);assert.equal(g.player.hp,100,'telegraph precedes damage');
  g.player.y=e.y-20;step(g,.36);assert.equal(g.player.hp,100,'moving behind locked attack avoids it');
});
test('final chapter saves preserve the reveal, ally and ending',()=>{
  const g=new Adventure();g.start();g.returned=true;g.knightMet=true;g.chapter2Started=true;g.familyProof=true;g.loadArea('ember',g.area.spawn);g.revealTruth();
  const restored=new Adventure();assert.ok(restored.restore(g.snapshot()));assert.equal(restored.area.id,'ember');assert.equal(restored.truthRevealed,true);assert.equal(restored.area.enemies.find(e=>e.id==='collector').dormant,false);assert.ok(restored.area.npcs.some(n=>n.id==='ally'));
  restored.defeated.add('collector');restored.finishStory();const done=new Adventure();assert.ok(done.restore(restored.snapshot()));assert.equal(done.mode,'complete');assert.equal(done.chapter,3);assert.ok(done.storyDone);
});
test('potions only consume when injured, and purchases require coins',()=>{
  const g=new Adventure();g.start();assert.equal(g.heal(),false);assert.equal(g.player.potions,3);g.player.hp=30;assert.ok(g.heal());assert.equal(g.player.hp,70);assert.equal(g.player.potions,2);assert.equal(g.buyPotion(),false);g.player.coins=8;assert.ok(g.buyPotion());assert.equal(g.player.coins,0);assert.equal(g.player.potions,3);
});
