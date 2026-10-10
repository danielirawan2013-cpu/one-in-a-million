import {REGION_STYLES} from './region-art.mjs?v=0.5.0';
import {GOD_IDS,godArea} from './gods.mjs?v=0.5.0';
import {CAMPAIGN_IDS,campaignArea} from './campaign.mjs?v=0.5.0';
export const TILE=16, COLS=44, ROWS=30, WIDTH=COLS*TILE, HEIGHT=ROWS*TILE;
export const AREAS={
  oathhall:{name:'The Broken Oath Hall',note:'The door Rowan locked herself.',caption:'Watch the marked attacks. Dodge sideways; face the attacker to parry.',palette:['#393b45','#444651','#50525e','#827c73'],ground:'stone',spawn:{x:352,y:390},exits:[],chests:[],npcs:[],enemies:[{id:'rowan-betrayer',name:'Rowan · The Broken Oath',kind:'boss',x:352,y:205,hp:250,damage:15,xp:50,coins:75}]},
  hollow:{name:'Bramble Hollow',note:'Home, sweet slightly haunted home.',caption:'Find the practice armour. Even small swings count.',palette:['#29463c','#345344','#3f614b','#6c7650'],ground:'grass',spawn:{x:352,y:340},
    exits:[{id:'shop-door',x:247,y:271,to:'shop',spawn:{x:352,y:398},label:'Enter the family shop'},{id:'north',x:352,y:64,to:'moss',spawn:{x:352,y:417},label:'Enter the mossway'},{id:'east',x:466,y:387,to:'thorn',spawn:{x:352,y:415},requires:'returned',label:'Take the old dungeon road'}],
    chests:[{id:'hollow-wood',type:'wood',x:255,y:341},{id:'hollow-iron',type:'iron',x:455,y:218}],
    enemies:[{id:'practice',kind:'practice',x:382,y:268,hp:20,damage:4,xp:12,coins:6,name:'Wayward practice armour'}],
    npcs:[{id:'customer',kind:'knight',x:342,y:324,label:'Talk to Rowan, your regular customer'}]},
  shop:{name:'The Family Shop',note:'Tea, treasure, and questionable potatoes.',caption:'Talk to Silk at the counter to sell junk and buy potions.',palette:['#76583f','#806045','#8b684b','#ab8158'],ground:'wood',spawn:{x:352,y:398},exits:[{id:'south',x:352,y:433,to:'hollow',spawn:{x:247,y:283},label:'Leave the family shop'}],chests:[],enemies:[],npcs:[{id:'shop',kind:'spider',x:352,y:215,label:'Talk to Silk at the counter'}]},
  moss:{name:'The Mossway',note:'Someone really ought to weed this place.',caption:'Clear the enchanted guards to open the crypt.',palette:['#263d38','#304b3f','#3c5649','#69794e'],ground:'grass',spawn:{x:352,y:418},
    exits:[{id:'south',x:352,y:441,to:'hollow',spawn:{x:352,y:92},label:'Return to the hollow'},{id:'north',x:352,y:49,to:'crypt',spawn:{x:352,y:415},label:'Enter the old crypt'}],
    chests:[{id:'moss-wood',type:'wood',x:226,y:325},{id:'moss-iron',type:'iron',x:453,y:163}],
    enemies:[{id:'guard-1',kind:'guard',x:337,y:324,hp:29,damage:7,xp:13,coins:7,name:'Enchanted guard'},{id:'guard-2',kind:'guard',x:406,y:211,hp:31,damage:7,xp:13,coins:7,name:'Enchanted guard'},{id:'guard-3',kind:'guard',x:290,y:139,hp:29,damage:7,xp:13,coins:7,name:'Enchanted guard'}],npcs:[]},
  crypt:{name:'The Old Crypt',note:'Please keep your sword inside the ride.',caption:'The iron warden stands between you and Uncle Bones.',palette:['#343442','#3d3e4b','#464553','#53505c'],ground:'stone',spawn:{x:352,y:418},
    exits:[{id:'south',x:352,y:440,to:'moss',spawn:{x:352,y:79},label:'Return to the mossway'}],
    chests:[{id:'crypt-iron',type:'iron',x:220,y:324},{id:'crypt-gold',type:'gold',x:446,y:112,locked:true}],
    enemies:[{id:'crypt-guard',kind:'guard',x:270,y:289,hp:34,damage:8,xp:13,coins:8,name:'Crypt sentinel'},{id:'warden',kind:'boss',x:352,y:180,hp:145,damage:12,xp:30,coins:25,name:'The Iron Warden'}],
    npcs:[{id:'uncle',kind:'skeleton',x:352,y:94,label:'Talk to Uncle Bones'}]},
  thorn:{name:'Thornwood Road',note:'Get to Grandma before the knight does.',caption:'Head north to the archive. Find proof that monsters are family.',palette:['#263d45','#344f50','#406359','#759272'],ground:'grass',spawn:{x:352,y:416},
    exits:[{id:'south',x:352,y:441,to:'hollow',spawn:{x:466,y:355},label:'Return to the family shop'},{id:'north',x:352,y:49,to:'tower',spawn:{x:352,y:416},label:'Enter the forgotten archive'}],
    chests:[{id:'thorn-wood',type:'wood',x:228,y:325},{id:'thorn-iron',type:'iron',x:454,y:163}],
    enemies:[{id:'thorn-1',kind:'guard',x:337,y:323,hp:51,damage:8,xp:14,coins:10,name:'Royal sentry'},{id:'thorn-2',kind:'guard',x:406,y:212,hp:51,damage:8,xp:14,coins:10,name:'Royal sentry'},{id:'thorn-3',kind:'guard',x:293,y:140,hp:51,damage:8,xp:14,coins:10,name:'Royal sentry'}],npcs:[]},
  tower:{name:'The Forgotten Archive',note:'Grandma never throws anything away. Especially portraits.',caption:'Defeat the archive guardian and collect the family portrait.',palette:['#343d50','#3d495b','#465469','#637186'],ground:'stone',spawn:{x:352,y:416},
    exits:[{id:'south',x:352,y:441,to:'thorn',spawn:{x:352,y:79},label:'Return to Thornwood Road'},{id:'north',x:352,y:49,to:'ember',spawn:{x:352,y:416},label:'Reach Grandma before Rowan'}],
    chests:[{id:'tower-iron',type:'iron',x:220,y:324},{id:'tower-gold',type:'gold',x:446,y:112,lockedBy:'archivist'}],
    enemies:[{id:'tower-guard',kind:'guard',x:270,y:289,hp:57,damage:9,xp:15,coins:12,name:'Archive sentinel'},{id:'archivist',kind:'boss',x:352,y:180,hp:210,damage:13,xp:35,coins:30,name:'The Archive Guardian'}],
    npcs:[{id:'portrait',kind:'portrait',x:352,y:94,label:'Collect the family portrait'}]},
  ember:{name:'Ember Vault',note:'Grandma’s treasure is mostly birthday presents.',caption:'Stop the royal collector. Protect Grandma’s home.',palette:['#4b3540','#59414b','#634c50','#8e6560'],ground:'stone',spawn:{x:352,y:416},
    exits:[{id:'south',x:352,y:441,to:'tower',spawn:{x:352,y:79},label:'Return to the archive'}],
    chests:[{id:'ember-iron',type:'iron',x:220,y:324},{id:'ember-gold',type:'gold',x:458,y:116,lockedBy:'collector'}],
    enemies:[{id:'ember-1',kind:'guard',x:270,y:314,hp:65,damage:10,xp:18,coins:14,name:'Treasure construct'},{id:'ember-2',kind:'guard',x:438,y:287,hp:65,damage:10,xp:18,coins:14,name:'Treasure construct'},{id:'collector',kind:'boss',x:352,y:187,hp:300,damage:16,xp:50,coins:60,name:'The Royal Collector'}],
    npcs:[{id:'grandma',kind:'dragon',x:352,y:99,label:'Talk to Grandma'},{id:'rowan',kind:'knight',x:352,y:146,label:'Tell Rowan the truth'}]}
};
export function noise(x,y,seed=0){const v=Math.sin(x*127.1+y*311.7+seed*51.3)*43758.5453;return v-Math.floor(v);}
export function makeArea(id){
  const definition=AREAS[id]??(GOD_IDS.includes(id)?godArea(GOD_IDS.indexOf(id)+1):campaignArea(CAMPAIGN_IDS.indexOf(id)+1));
  const objects=[];
  if(id==='shop'){
    objects.push({kind:'counter',x:295,y:218,w:114,h:20,solid:true});
    for(const x of [190,454])for(const y of [110,290])objects.push({kind:'shelf',x,y,w:60,h:42,solid:true});
    objects.push({kind:'lantern',x:282,y:212,solid:false},{kind:'lantern',x:422,y:212,solid:false},{kind:'family-frame',x:352,y:108,solid:false});
  }else if(definition.ground==='grass'){
    for(let y=2;y<28;y+=3)for(let x=1;x<43;x+=3){
      if(x>11&&x<32)continue;
      if(id==='hollow'&&x<13&&y<11)continue;
      if(id==='hollow'&&x>9&&x<21&&y>7&&y<19)continue;
      if(id==='hollow'&&x<11&&y>11&&y<24)continue;
      if(noise(x,y,id==='hollow'?1:3)>.19)objects.push({kind:'tree',x:x*16+8,y:y*16+14,solid:true,r:13});
    }
    for(let i=0;i<26;i++){
      const x=32+noise(i,2,6)*640,y=72+noise(i,4,6)*342;
      if(x>285&&x<425)continue;
      if(id==='hollow'&&x<205)continue;
      objects.push({kind:i%3===0?'mushroom':'bush',x:Math.round(x),y:Math.round(y),solid:false});
    }
    if(id==='hollow'){
      objects.push({kind:'house',x:184,y:160,w:128,h:98,solid:true});
      objects.push({kind:'sign',x:323,y:282,solid:false},{kind:'cart',x:204,y:292,solid:true,r:10},{kind:'lantern',x:317,y:317,solid:false},{kind:'lantern',x:451,y:341,solid:false});
    }else{
      for(const [x,y] of [[252,240],[466,294],[245,102],[465,86]])objects.push({kind:'ruin',x,y,solid:true,r:14});
      objects.push({kind:'lantern',x:299,y:399,solid:false},{kind:'lantern',x:403,y:399,solid:false});
    }
  }else{
    for(const y of [140,260,369])for(const x of [181,523])objects.push({kind:'pillar',x,y,solid:true,r:13});
    for(const [x,y] of [[213,145],[490,146],[213,387],[491,387]])objects.push({kind:'torch',x,y,solid:false});
    for(const [x,y] of [[215,217],[496,218],[230,70],[481,72]])objects.push({kind:'tomb',x,y,solid:true,r:14});
    if(id==='ember')for(const [x,y] of [[199,187],[505,339],[208,329],[500,106]])objects.push({kind:'crystal',x,y,solid:false});
  }
  return {...definition,id,objects:REGION_STYLES[id]&&definition.ground==='stone'?objects.filter(o=>!['tomb','pillar','torch'].includes(o.kind)):objects,enemies:definition.enemies.map(e=>({...e,maxHp:e.hp,homeX:e.x,homeY:e.y,cooldown:1,stun:0,flash:0,windup:0,swingTime:0,dead:false})),chests:definition.chests.map(c=>({...c,opened:false})),npcs:definition.npcs.map(n=>({...n}))};
}
export function isSolid(area,x,y){
  if(x<24||x>WIDTH-24||y<24||y>HEIGHT-24)return true;
  if(area.ground!=='grass'&&(x<158||x>546||y<39))return true;
  if(area.id==='hollow'&&x>46&&x<169&&y>227&&y<389&&!(area.divinePortal&&x>113&&y>296&&y<328))return true;
  return area.objects.some(o=>o.solid&&(o.kind==='counter'||o.kind==='shelf'?x>o.x&&x<o.x+o.w&&y>o.y&&y<o.y+o.h:o.kind==='house'?x>o.x-4&&x<o.x+o.w+4&&y>o.y-8&&y<o.y+o.h:Math.abs(x-o.x)<o.r&&Math.abs(y-o.y)<o.r*.65));
}
