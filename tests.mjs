import test from 'node:test';
import assert from 'node:assert/strict';
import {rollLoot,stageFor,validSave,moveBody,LOOT_ODDS} from './dist/core.mjs';
import {Adventure} from './dist/engine.mjs';
import {isSolid} from './dist/world.mjs';

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
test('a complete chapter is winnable with only the starting sword and no loot',()=>{
  const events=[];const g=new Adventure({random:()=>0,onEvent:e=>events.push(e)});g.start();
  const beat=(e)=>{let hits=0;while(!e.dead&&hits++<100){g.player.x=e.x;g.player.y=e.y+19;g.player.facing={x:0,y:-1};g.player.attackCd=0;g.attack();}assert.ok(e.dead,e.id);};
  beat(g.area.enemies[0]);assert.equal(g.stage,1);assert.ok(g.power());assert.equal(g.power(),false);
  g.player.x=352;g.player.y=64;assert.ok(g.interact());assert.equal(g.area.id,'moss');
  g.player.x=352;g.player.y=49;assert.equal(g.interact(),false,'guards seal the crypt');
  for(const e of g.area.enemies)beat(e);
  g.player.x=352;g.player.y=49;assert.ok(g.interact());assert.equal(g.area.id,'crypt');
  const gold=g.area.chests.find(c=>c.type==='gold');g.player.x=gold.x;g.player.y=gold.y;assert.equal(g.interact(),false,'boss guards golden chest');
  for(const e of g.area.enemies)beat(e);assert.equal(g.stage,3);assert.equal(g.player.weapon,5);
  g.player.x=352;g.player.y=94;assert.ok(g.interact());assert.equal(g.rescued,true);assert.ok(g.returnHome());assert.equal(g.mode,'complete');assert.equal(g.area.id,'hollow');
  assert.ok(events.some(e=>e.type==='unlock'));assert.ok(events.some(e=>e.type==='complete'));assert.equal(g.inventory.length,0);
});
test('all region exits and spawns are walkable',()=>{
  const g=new Adventure();for(const id of ['hollow','moss','crypt']){g.loadArea(id,null);assert.equal(isSolid(g.area,g.area.spawn.x,g.area.spawn.y),false);for(const e of g.area.exits)assert.equal(isSolid(g.area,e.x,e.y),false);}
});
test('save and restore preserve loot, cleared foes, power and chapter completion',()=>{
  const g=new Adventure();g.start();g.player.xp=80;g.player.weapon=12;g.player.boots=true;g.player.coins=25;g.defeated.add('warden');g.rescued=true;g.returnHome();
  const snapshot=JSON.parse(JSON.stringify(g.snapshot()));assert.ok(validSave(snapshot));const restored=new Adventure();assert.ok(restored.restore(snapshot));assert.equal(restored.stage,3);assert.equal(restored.mode,'complete');assert.equal(restored.player.weapon,12);assert.ok(restored.defeated.has('warden'));assert.ok(restored.player.boots);
  assert.equal(restored.restore({...snapshot,player:{...snapshot.player,x:NaN}}),false);assert.equal(restored.restore({...snapshot,inventory:[{rarity:'rare'}]}),false);
});
test('death recovery keeps progression and loot, restoring full health',()=>{
  const g=new Adventure();g.start();g.player.xp=38;g.player.hp=1;g.player.invulnerable=0;const e=g.area.enemies[0];g.player.x=e.x;g.player.y=e.y;e.cooldown=0;g.tick(.05);assert.equal(g.mode,'dead');g.recover();assert.equal(g.player.hp,100);assert.equal(g.stage,2);assert.equal(g.area.id,'hollow');
});
test('potions only consume when injured, and purchases require coins',()=>{
  const g=new Adventure();g.start();assert.equal(g.heal(),false);assert.equal(g.player.potions,3);g.player.hp=30;assert.ok(g.heal());assert.equal(g.player.hp,70);assert.equal(g.player.potions,2);assert.equal(g.buyPotion(),false);g.player.coins=8;assert.ok(g.buyPotion());assert.equal(g.player.coins,0);assert.equal(g.player.potions,3);
});
