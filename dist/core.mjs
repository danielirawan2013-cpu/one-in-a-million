export const LOOT_ODDS = Object.freeze({wood:[65,30,5],iron:[35,50,15],gold:[10,60,30]});
export const LOOT = {
  trash:[{id:'sock',name:'One lonely sock',value:3},{id:'potato',name:'Questionable potato',value:2},{id:'rock',name:'“Legendary” rock',value:4},{id:'scrap',name:'Bent sword scrap',value:5}],
  useful:[{id:'potion',name:'Healing potion',value:8},{id:'coins',name:'A pouch of 12 coins',value:12},{id:'sword',name:'Iron shortsword',value:15}],
  rare:[{id:'blade',name:'Dawnblade',value:40},{id:'boots',name:'Ghoststep boots',value:35},{id:'pendant',name:'Heartkeeper pendant',value:35}]
};
export function rollLoot(type, random=Math.random){
  const odds=LOOT_ODDS[type]; if(!odds) throw new Error('Unknown chest type');
  const roll=Math.max(0,Math.min(0.999999,random()))*100;
  const rarity=roll<odds[0]?'trash':roll<odds[0]+odds[1]?'useful':'rare';
  const pool=LOOT[rarity]; const index=Math.min(pool.length-1,Math.floor(Math.max(0,random())*pool.length));
  return {...pool[index],rarity};
}
export const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function stageFor(xp){return xp>=80?3:xp>=38?2:xp>=12?1:0;}
export function moveBody(body,dx,dy,isSolid){
  const blocked=(x,y)=>[[-5,-3],[5,-3],[-5,3],[5,3]].some(([ox,oy])=>isSolid(x+ox,y+oy));
  if(!blocked(body.x+dx,body.y)) body.x+=dx;
  if(!blocked(body.x,body.y+dy)) body.y+=dy;
}
export const SAVE_KEY='one-in-a-million:v1';
export function validSave(s){
  return !!s && s.version===1 && ['hollow','moss','crypt'].includes(s.area)
    && s.player && ['x','y','hp','xp','coins','potions','weapon'].every(k=>Number.isFinite(s.player[k]))
    && s.player.hp>0 && s.player.hp<=100 && s.player.x>=0 && s.player.x<704 && s.player.y>=0 && s.player.y<480
    && s.player.xp>=0 && s.player.coins>=0 && s.player.potions>=0 && s.player.weapon>=5 && s.player.weapon<=12
    && typeof s.player.boots==='boolean' && typeof s.player.pendant==='boolean'
    && Array.isArray(s.inventory) && s.inventory.length<=200 && s.inventory.every(i=>i && ['trash','useful','rare'].includes(i.rarity) && typeof i.name==='string' && typeof i.id==='string' && Number.isFinite(i.value) && i.value>=0)
    && Array.isArray(s.opened) && s.opened.every(i=>typeof i==='string')
    && Array.isArray(s.defeated) && s.defeated.every(i=>typeof i==='string')
    && typeof s.rescued==='boolean';
}
