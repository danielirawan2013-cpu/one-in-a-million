import {HAMMER_LOOT} from './lightning.mjs?v=0.3.2';
import {LOOT} from './core.mjs?v=0.3.2';
import {SWORDS,SWORD_IDS} from './swords.mjs?v=0.3.2';
// Local single-player tools, not server/account administration.
export const ADMIN_ITEMS=[HAMMER_LOOT,...Object.entries(LOOT).flatMap(([rarity,items])=>items.map(i=>({...i,name:i.id==='blade'?'Dawnblade (classic)':i.name,rarity}))),...SWORD_IDS.map(id=>({id,skin:id,name:SWORDS[id].name,rarity:'rare',value:60})),{id:'scrap-king',name:'Scrap King · Admin',rarity:'admin',value:0}];
export class AdminTools{
  constructor(){this.unlocked=false;}
  unlock(password){this.unlocked=password==='3275';return this.unlocked;}
  lock(){this.unlocked=false;}
  run(action,game){
    if(!this.unlocked||game.mode==='title'||game.player.hp<=0)return false;
    switch(action){
      case 'equip':game.player.scrapKing=true;game.player.scrapKingOwned=true;break;
      case 'unequip':game.player.scrapKing=false;break;
      case 'heal':game.player.hp=100;game.player.potions=Math.max(3,game.player.potions);break;
      case 'coins':game.player.coins=Math.min(999999,game.player.coins+100);break;
      case 'potential':game.gainResolve(Math.max(0,80-game.player.xp));break;
      case 'charge':game.player.ultimateCharge=100;break;
      case 'special':game.player.specialUnlocked=true;game.player.ultimateCharge=100;break;
      default:return false;
    }
    game.dirty=true;return true;
  }
  grant(id,quantity,game){
    if(!this.unlocked||game.mode==='title'||game.player.hp<=0||!Number.isInteger(quantity)||quantity<1||quantity>99)return false;
    const item=ADMIN_ITEMS.find(i=>i.id===id);if(!item)return false;
    if(id==='scrap-king'){game.player.scrapKing=true;game.player.scrapKingOwned=true;return true;}
    if(game.inventory.length+quantity>200)return false;
    for(let i=0;i<quantity;i++)game.inventory.push({...item});
    const p=game.player;
    if(item.skin){p.weaponSkin=item.skin;p.scrapKing=false;}
    if(id==='potion')p.potions+=quantity;
    if(id==='coins')p.coins=Math.min(999999,p.coins+12*quantity);
    if(id==='sword'||id==='blade'){p.weapon=Math.max(id==='blade'?12:8,p.weapon);p.weaponSkin=null;p.scrapKing=false;}
    if(id==='boots')p.boots=true;
    if(id==='pendant')p.pendant=true;
    game.dirty=true;return true;
  }
}
