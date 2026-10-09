export const TILE=16, COLS=44, ROWS=30, WIDTH=COLS*TILE, HEIGHT=ROWS*TILE;
export const AREAS={
  hollow:{name:'Bramble Hollow',note:'Home, sweet slightly haunted home.',caption:'Find the practice armour. Even small swings count.',palette:['#29463c','#345344','#3f614b','#6c7650'],ground:'grass',spawn:{x:352,y:340},
    exits:[{id:'north',x:352,y:64,to:'moss',spawn:{x:352,y:417},label:'Enter the mossway'}],
    chests:[{id:'hollow-wood',type:'wood',x:255,y:341},{id:'hollow-iron',type:'iron',x:455,y:218}],
    enemies:[{id:'practice',kind:'practice',x:382,y:268,hp:20,damage:4,xp:12,coins:6,name:'Wayward practice armour'}],
    npcs:[{id:'shop',kind:'spider',x:271,y:284,label:'Visit the family shop'}]},
  moss:{name:'The Mossway',note:'Someone really ought to weed this place.',caption:'Clear the enchanted guards to open the crypt.',palette:['#263d38','#304b3f','#3c5649','#69794e'],ground:'grass',spawn:{x:352,y:418},
    exits:[{id:'south',x:352,y:441,to:'hollow',spawn:{x:352,y:92},label:'Return to the hollow'},{id:'north',x:352,y:49,to:'crypt',spawn:{x:352,y:415},label:'Enter the old crypt'}],
    chests:[{id:'moss-wood',type:'wood',x:226,y:325},{id:'moss-iron',type:'iron',x:453,y:163}],
    enemies:[{id:'guard-1',kind:'guard',x:337,y:324,hp:29,damage:7,xp:13,coins:7,name:'Enchanted guard'},{id:'guard-2',kind:'guard',x:406,y:211,hp:31,damage:7,xp:13,coins:7,name:'Enchanted guard'},{id:'guard-3',kind:'guard',x:290,y:139,hp:29,damage:7,xp:13,coins:7,name:'Enchanted guard'}],npcs:[]},
  crypt:{name:'The Old Crypt',note:'Please keep your sword inside the ride.',caption:'The iron warden stands between you and Uncle Bones.',palette:['#343442','#3d3e4b','#464553','#53505c'],ground:'stone',spawn:{x:352,y:418},
    exits:[{id:'south',x:352,y:440,to:'moss',spawn:{x:352,y:79},label:'Return to the mossway'}],
    chests:[{id:'crypt-iron',type:'iron',x:220,y:324},{id:'crypt-gold',type:'gold',x:446,y:112,locked:true}],
    enemies:[{id:'crypt-guard',kind:'guard',x:270,y:289,hp:34,damage:8,xp:13,coins:8,name:'Crypt sentinel'},{id:'warden',kind:'boss',x:352,y:180,hp:145,damage:12,xp:30,coins:25,name:'The Iron Warden'}],
    npcs:[{id:'uncle',kind:'skeleton',x:352,y:94,label:'Talk to Uncle Bones'}]}
};
export function noise(x,y,seed=0){const v=Math.sin(x*127.1+y*311.7+seed*51.3)*43758.5453;return v-Math.floor(v);}
export function makeArea(id){
  const definition=AREAS[id];
  const objects=[];
  if(id!=='crypt'){
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
  }
  return {...definition,id,objects,enemies:definition.enemies.map(e=>({...e,maxHp:e.hp,homeX:e.x,homeY:e.y,cooldown:1,stun:0,flash:0,dead:false})),chests:definition.chests.map(c=>({...c,opened:false})),npcs:definition.npcs.map(n=>({...n}))};
}
export function isSolid(area,x,y){
  if(x<24||x>WIDTH-24||y<24||y>HEIGHT-24)return true;
  if(area.id==='crypt'&&(x<158||x>546||y<39))return true;
  if(area.id==='hollow'&&x>46&&x<169&&y>227&&y<389)return true;
  return area.objects.some(o=>o.solid&&(o.kind==='house'?x>o.x-4&&x<o.x+o.w+4&&y>o.y-8&&y<o.y+o.h:Math.abs(x-o.x)<o.r&&Math.abs(y-o.y)<o.r*.65));
}
