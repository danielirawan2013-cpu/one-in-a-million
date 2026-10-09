export const HAMMER_ID='thunderhammer';
export const HAMMER_LOOT={id:HAMMER_ID,skin:HAMMER_ID,name:'Thunderwake hammer',rarity:'rare',value:90};
export function lightningBoss(){return {id:'lake-storm',name:'The Lake Tempest · Lightning God',kind:'boss',x:190,y:379,hp:380,maxHp:380,damage:16,xp:35,coins:60,cooldown:1,stun:0,flash:0,swingTime:0,windup:0,stormCd:2.2,stormCast:null};}
export function canSummonStorm(game){const p=game.player,tip={x:p.x+p.attackFacing.x*32,y:p.y+p.attackFacing.y*32};return game.area.id==='hollow'&&game.rescued&&!game.defeated.has('storm-summoned')&&tip.x>=43&&tip.x<=170&&tip.y>=224&&tip.y<=393;}
