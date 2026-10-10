// Optional continuation: the family story remains intact whichever arc is played first.
export const GOD_EPISODES=[
 {id:'skythreshold',name:'The Frozen Sky',chapter:'The Banished Child',boss:'Rimewyrm · Dragon God of Frost',color:'#a9e0c8',pattern:'frost',palette:['#253f4b','#31515b','#41656b','#95bfb3'],
 arrival:['The lake folds upwards. Water hangs above Pip like a second sky, and a road of pale stone rises through it. The lantern on his belt begins to hum.','A voice crosses the empty bridge. “The Tempest was a jailer, little one. You have broken the lock.” An ice dragon unfolds its wings, wearing a crown of frozen stars. “Why has the banished child returned?”'],
 ending:['Rimewyrm lowers its frost-covered wings. “They told us you could never wake. Your strength was sealed before you could speak.”','Pip grips his oversized apron. “I’m a shopkeeper. I think you have the wrong person.” The dragon looks at the tiny lantern hanging from his belt. “Then why does the sky remember your hand?”','A staircase appears beyond the bridge. At its top waits the tribunal that ordered a child forgotten.'],note:'“I came looking for a hammer. This is a lot of paperwork.”'},
 {id:'oathtribunal',name:'The Silent Tribunal',chapter:'The Banished Child',boss:'Oras · God of Oaths',color:'#e8c28c',pattern:'oath',palette:['#493f3b','#5d5046','#746454','#c6af88'],
 arrival:['The walls carry thousands of promises carved in gold. One tablet has been scraped clean. Pip can still see the outline of a tiny hand.','Oras lifts a chain made of words. “You were born between a mortal life and divine fire. A demigod. One such child in a million births—and the only one whose touch could undo our binding oaths.”','“Veyr feared you,” the god says. “So we banished you into the mortal dungeon and sealed your memories. You were supposed to remain weak.”'],
 ending:['The chain snaps. Names return to the blank tablet: Pip, the child of two worlds. Below them is the order that cast him out, signed by the Crown of Heaven.','“You voted to throw a baby away?” Pip asks. Oras cannot meet his eyes. “I obeyed the crown.” “Uncle Bones has bad knees. He still carried me home.”','For the first time, the tribunal’s doors open without an oath of obedience. Pip walks through them on his own terms.'],note:'“A god wrote me off. My family taught me to stand up.”'},
 {id:'sunforge',name:'The Sunforge',chapter:'What the Gods Hid',boss:'Aurel · God of the Sun',color:'#f4b079',pattern:'sun',palette:['#573b34','#714b3b','#8b6046','#e4b781'],
 arrival:['A furnace burns with the light of stolen dawns. The seals on its doors look like the ones that trapped Uncle Bones. Pip recognises the same command: stay silent.','Aurel steps out of the blaze. “Power belongs to those who can bear it. Show me what a child raised by monsters has learned.” Pip draws his sword. “Mostly how to make tea. And how to protect people.”'],
 ending:['Aurel’s fire dims. Pip finds a record of his first night in the dungeon. The divine seal extinguished a million lanterns. One kept glowing beneath a baby’s hand.','His gift had reached for the dungeon heart, asking for shelter. Grandma answered by warming him in her wings. Silk knitted the apron. Bones stayed awake until morning.','“They didn’t steal a demigod,” Pip says. “They saved a child.” Aurel opens the furnace gate and lets the stolen dawns go home.'],note:'“Grandma’s wings were warmer than this entire sun.”'},
 {id:'mooncourt',name:'The Court of Tides',chapter:'What the Gods Hid',boss:'Nym · Goddess of the Moon',color:'#b9c9f4',pattern:'moon',palette:['#313e59','#425575','#536c8c','#b6c8df'],
 arrival:['Moonlight lies in pools across a room without a roof. In each reflection Pip sees a different life: a prince, a weapon, a child alone. None wears an apron.','Nym offers him a crown. “We can give you the childhood you deserved. Forget the dungeon. Forget those who taught you to be small.” Pip looks away from the reflections. “They taught me to be kind.”'],
 ending:['The false reflections break. One remains: a dragon trying to wrap a birthday present while a spider laughs and a skeleton pretends not to cry. Pip touches the water.','Nym lowers her hands. “Veyr removed every memory that might lead you back. We called it mercy.” Pip shakes his head. “You don’t get to choose what home means for someone else.”','Beyond the moon pool, the forbidden archive opens. The last page of his banishment is waiting there.'],note:'“No crown has ever remembered my birthday.”'},
 {id:'exilearchive',name:'The Archive of Exile',chapter:'A Home Beyond Heaven',boss:'Mnemos · God of Memory',color:'#d0a8e5',pattern:'memory',palette:['#42354f','#574667','#705b82','#bda0cb'],
 arrival:['Shelves float above a floor of star glass. Each book holds a life that heaven ordered erased. Pip’s book is thin. The pages after his banishment were never written here.','Mnemos reaches for it. “Without your divine past, you are nothing.” Pip thinks of shop deliveries, shared tea, and every frightened person he brought home. “You missed a lot of chapters.”'],
 ending:['The archive returns Pip’s first memory: not a throne, but a lullaby. Someone held him while the crown’s guards approached. “When you find a home,” the voice whispered, “let it make you kind.”','The record reveals Veyr’s fear. Pip could break the oaths that kept heaven in power. The crown did not banish him for anything he had done. It banished him for what he might choose.','Pip closes the book. He is a demigod. He is also Bones’s nephew, Silk’s little brother, and Grandma’s grandson. Neither truth erases the other.'],note:'“My old memories are back. I’m keeping the new ones too.”'},
 {id:'crownsummit',name:'The Crown Above the Lake',chapter:'A Home Beyond Heaven',boss:'Veyr · Sovereign of Heaven',color:'#f1d38d',pattern:'crown',palette:['#3b3b54','#51536e','#6b6e88','#d5c59b'],
 arrival:['At the summit, Veyr stands beneath a crown larger than the family shop. Chains of light run from it to every realm below.','“I made you weak,” the sovereign says. “I can make you a god. Take your place beside me, and leave the creatures who kept you.”','Pip draws his sword. “They didn’t keep me. They raised me.” The lantern at his belt answers, and the chains begin to tremble.'],
 ending:['Veyr’s crown breaks. Pip lays his hand on the final oath and gives it a new ending: no child will be banished for what they might become. The chains dissolve into stars.','The gods offer him a throne. Pip asks for a door. On the other side are a skeleton’s chair, Silk’s till, Grandma’s presents, and a kettle that has probably boiled dry.','He steps back through the lake, small and human-looking, still wearing his apron. “Anything interesting happen?” Bones asks. “A bit,” Pip says. “Is there tea?”','He was born a demigod and banished from heaven. His family made him someone worth coming home to. Tomorrow, the shop opens as usual.'],note:'“They offered me heaven. I asked for home.”'}
];
export const GOD_IDS=GOD_EPISODES.map(e=>e.id);
export function godArea(step){
 const e=GOD_EPISODES[step-1];if(!e)throw new Error('Unknown divine realm');const bossId=e.id+'-god';
 return {...e,ground:'stone',divineStep:step,caption:'Defeat '+e.boss+', then read the memory beside the northern stair.',spawn:{x:352,y:414},
 exits:[{id:'divine-return',x:352,y:441,to:'hollow',spawn:{x:181,y:310},label:'Return through the lake · Family shop'},...(step<GOD_EPISODES.length?[{id:'north',x:352,y:49,to:GOD_EPISODES[step].id,spawn:{x:352,y:414},label:'Climb to the next divine realm'}]:[])],
 chests:[{id:e.id+'-iron',type:'iron',x:228,y:326},{id:e.id+'-gold',type:'gold',x:458,y:112,lockedBy:bossId}],
 enemies:[{id:e.id+'-sentinel',kind:'guard',x:414,y:300,hp:65+step*12,damage:10+step,xp:18,coins:20,name:'Celestial sentinel'},{id:bossId,kind:'boss',x:352,y:180,hp:280+step*40,damage:13+step,xp:45,coins:65,divine:true,color:e.color,pattern:e.pattern,divineCd:2,divineCast:null,castIndex:0,name:e.boss}],
 npcs:[{id:'divine-lore',kind:'portrait',x:352,y:94,label:'Read the recovered memory'}]};
}
const circle=(x,y,r)=>({kind:'circle',x,y,r});
export function divineZones(e,p){
 const n=e.castIndex??0;
 switch(e.pattern){
 case 'frost':return [-48,0,48].map(d=>circle(Math.max(185,Math.min(519,p.x+d)),p.y,21));
 case 'oath':return [{kind:'column',x:p.x,y:248,width:13},{kind:'row',x:352,y:p.y,width:13}];
 case 'sun':return [{kind:'ring',x:e.x,y:e.y,r:76,width:15}];
 case 'moon':return [circle(p.x,p.y,30),circle(704-p.x,Math.max(75,480-p.y),30)];
 case 'memory':return [circle(p.x,p.y,23),...(e.memories??[]).slice(-2).map(q=>circle(q.x,q.y,23))];
 case 'crown':return [248+(n%2)*32,352+(n%2)*32,456+(n%2)*32].map(x=>({kind:'column',x,y:248,width:18}));
 default:return [];
 }
}
export function inDivineZone(p,z){const d=Math.hypot(p.x-z.x,p.y-z.y);return z.kind==='circle'?d<z.r:z.kind==='ring'?Math.abs(d-z.r)<z.width:z.kind==='column'?Math.abs(p.x-z.x)<z.width:Math.abs(p.y-z.y)<z.width;}
export function tickDivine(g,e,dt){
 if(e.stun||e.freeze||e.shock)return;
 e.divineCd=Math.max(0,(e.divineCd??2)-dt);
 if(e.divineCast){
  e.divineCast.time-=dt;if(e.divineCast.time>0)return;
  const zones=e.divineCast.zones;e.divineCast=null;e.divineCd=3.1;e.castIndex=(e.castIndex??0)+1;
  for(const z of zones){g.effects.push({...z,shape:z.kind,kind:'divine-strike',pattern:e.pattern,color:e.color,life:.5,maxLife:.5});g.burst(z.x,z.y,e.color,12);}
  const p=g.player;if(!p.invulnerable&&zones.some(z=>inDivineZone(p,z))){p.hp=Math.max(0,p.hp-(p.guardTime?10:20));p.invulnerable=.65;p.hurtFlash=.15;g.shake=2;g.emit('hurt');if(!p.hp){g.mode='dead';g.emit('death');}}
 }else if(!e.divineCd){e.divineCast={time:1.05,zones:divineZones(e,g.player)};e.memories=[...(e.memories??[]).slice(-1),{x:g.player.x,y:g.player.y}];}
}
