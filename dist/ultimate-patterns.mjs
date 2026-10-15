// One authored sequence per weapon. Coordinates are locked when V is pressed.
export const ULTIMATE_PATTERNS={
 shadowfangs:{duration:3.4,impact:.53,description:'Arise: summon fifteen shadows, then lead a royal crosscut. N summons or dismisses your army.'},
 battered:{duration:1.9,impact:.53,description:'Three expanding shockwaves around Pip.'},
 ironshort:{duration:2.1,impact:.62,description:'A narrow piercing thrust, followed by crossing steel cuts. Aim forward.'},
 classicdawn:{duration:2.5,impact:.6,description:'Restore 35 health and raise three protective rings around Pip.'},
 dawnblade:{duration:2.7,impact:.58,description:'Fire a sustained, straight solar cannon. Aim down the beam.'},
 moonfang:{duration:2.6,impact:.46,description:'Twin crescent blades fly apart, cross and return for a final cut.'},
 emberfang:{duration:2.8,impact:.55,description:'Rip open a line of five burning eruptions in front of you.'},
 frostbite:{duration:2.4,impact:.52,description:'Freeze nearby enemies, then launch eight ice lances outwards.'},
 thornheart:{duration:3,impact:.48,description:'Roots trap enemies where they stand, then vines strike those spots again.'},
 voidbreaker:{duration:3.2,impact:.42,description:'Pull enemies into a forward gravity well before its final implosion.'},
 stormsplitter:{duration:2.1,impact:.67,description:'Lightning leaps between nearby enemies, then shocks the final target.'},
 dragonfang:{duration:3,impact:.5,description:'Summon a dragon for three widening breaths of fire in front of you.'},
 bloodmoon:{duration:2.6,impact:.56,description:'Reap three sweeping cuts around Pip and steal health from enemies hit.'},
 starfall:{duration:3.2,impact:.4,description:'Mark enemies for nine falling meteors. Impacts land after a short warning.'},
 ghostveil:{duration:2.8,impact:.5,description:'Four phantom swordsmen strike inward from the corners around you.'},
 thunderhammer:{duration:2.8,impact:.64,description:'Slam the ground, then call three aimed thunderbolts onto enemy positions.'},
 'scrap-king':{duration:3.2,impact:.73,description:'Forge an enormous royal cleaver, then deliver one arena-wide verdict.'},
 rimecrown:{duration:3.1,impact:.45,description:'An ice dragon surrounds enemies with frozen teeth, then breathes a blizzard.'},
 oathbreaker:{duration:2.9,impact:.46,description:'Binding chains root marked enemies before a delayed judgement strikes each one.'},
 solstice:{duration:3.2,impact:.49,description:'A phoenix spreads two burning wings and restores 25 health as dawn returns.'},
 tidemirror:{duration:2.8,impact:.52,description:'Two tidal walls close in from opposite sides, then burst in the centre.'},
 recollection:{duration:3.3,impact:.4,description:'Recover recently lost health and replay sword cuts along your recent path.'},
 heavensfall:{duration:3.4,impact:.51,description:'Sever the sky with three descending columns, then three crossing heavenly blades.'}
};
export function buildUltimateSequence(skin,{origin,facing,targets=[],history=[]}){
 if(!ULTIMATE_PATTERNS[skin])throw new Error('Unknown ultimate weapon');
 const o={...origin},f={...facing},side={x:-f.y,y:f.x},actions=[];
 const at=(forward=0,lateral=0)=>({x:o.x+f.x*forward+side.x*lateral,y:o.y+f.y*forward+side.y*lateral});
 const turn=a=>({x:f.x*Math.cos(a)-f.y*Math.sin(a),y:f.x*Math.sin(a)+f.y*Math.cos(a)});
 const add=(kind,options={},delay=0,position=o,dir=f,power=1)=>actions.push({spec:{kind,...options},delay,origin:{...position},facing:{...dir},power});
 const marks=targets.filter(e=>!e.dead&&!e.dormant&&Math.hypot(e.x-o.x,e.y-o.y)<=260).sort((a,b)=>Math.hypot(a.x-o.x,a.y-o.y)-Math.hypot(b.x-o.x,b.y-o.y)).slice(0,6);
 const points=marks.length?marks.map(e=>({x:e.x,y:e.y})):Array.from({length:3},(_,i)=>at(55+i*35,(i-1)*35));
 switch(skin){
 case 'shadowfangs':for(let i=0;i<3;i++)add('arc',{radius:120+i*45,halfAngle:1.1,shock:.6},i*.28,o,turn((i-1)*.4),.35);break;
 case 'battered':for(let i=0;i<3;i++)add('ring',{radius:48+i*50,knock:80},i*.23,o,f,.42);break;
 case 'ironshort':add('line',{range:245,width:12,knock:140},0,o,f,.8);for(const a of [-.32,.32])add('line',{range:175,width:10},.27,o,turn(a),.35);break;
 case 'classicdawn':add('heal',{heal:35},0,o,f,0);for(let i=0;i<3;i++)add('ring',{radius:55+i*38,guard:2},.12+i*.3,o,f,.34);break;
 case 'dawnblade':for(let i=0;i<4;i++)add('line',{range:290,width:25+i*3},i*.22,o,f,.36);break;
 case 'moonfang':for(let i=0;i<4;i++)add('line',{range:210,width:16},i*.17,at(i<2?0:170,(i%2?1:-1)*20),i<2?turn(i%2?.22:-.22):{x:-f.x,y:-f.y},.36);add('arc',{radius:75,halfAngle:1.5},.85,o,f,.5);break;
 case 'emberfang':for(let i=0;i<5;i++)add('ring',{radius:30,burn:4},i*.18,at(35+i*35),f,.48);break;
 case 'frostbite':add('ring',{radius:100,freeze:1.4},0,o,f,.25);for(let i=0;i<8;i++)add('line',{range:180,width:10,freeze:1.4},.3,o,turn(i*Math.PI/4),.48);break;
 case 'thornheart':for(const p of points)for(let i=0;i<3;i++)add('ring',{radius:29,root:1.3},i*.55,p,f,.38);break;
 case 'voidbreaker':for(let i=0;i<4;i++)add('ring',{radius:145,pull:100,slow:1},i*.3,at(65),f,.15);add('ring',{radius:95,knock:70},1.4,at(65),f,1.5);break;
 case 'stormsplitter':add('chain',{range:240,jumps:8,shock:1.2},0,o,f,1);add('ring',{radius:35,shock:.8},.55,points.at(-1),f,.55);break;
 case 'dragonfang':for(let i=0;i<3;i++)add('arc',{radius:140+i*45,halfAngle:.32+i*.13,burn:4,knock:90},i*.28,o,f,.52);break;
 case 'bloodmoon':for(let i=0;i<3;i++)add('arc',{radius:170,halfAngle:1.12,drain:.32},i*.22,o,turn(i*Math.PI*2/3),.55);break;
 case 'starfall':for(let i=0;i<9;i++){const p=points[i%points.length];add('ring',{radius:31},.2+i*.13,{x:p.x+Math.sin(i*2.4)*12,y:p.y+Math.cos(i*2.4)*12},f,.38);}break;
 case 'ghostveil':for(let i=0;i<4;i++){const a=i*Math.PI/2+Math.PI/4,p={x:o.x+Math.cos(a)*90,y:o.y+Math.sin(a)*90},target=marks[i%Math.max(1,marks.length)]??o,d=Math.max(1,Math.hypot(target.x-p.x,target.y-p.y));add('line',{range:Math.min(350,d+25),width:18,invulnerable:.25},i*.2,p,{x:(target.x-p.x)/d,y:(target.y-p.y)/d},.55);}break;
 case 'thunderhammer':add('ring',{radius:75,shock:.5,knock:140},0,o,f,.65);for(let i=0;i<3;i++)add('ring',{radius:40,shock:.9},.35+i*.3,points[i%points.length],f,.6);break;
 case 'scrap-king':add('ring',{radius:1000},0,o,f,1);break;
 case 'rimecrown':for(let i=0;i<6;i++){const p=points[i%points.length],a=i*Math.PI/3;add('ring',{radius:37,freeze:1.5},i*.12,{x:p.x+Math.cos(a)*22,y:p.y+Math.sin(a)*22},f,.32);}add('arc',{radius:240,halfAngle:.65,slow:3},1,o,f,.7);break;
 case 'oathbreaker':for(const p of points){add('ring',{radius:33,root:2},0,p,f,.12);add('ring',{radius:40,knock:160},1.15,p,f,.95);}break;
 case 'solstice':add('heal',{heal:25},0,o,f,0);for(const a of [-Math.PI/2,Math.PI/2])add('arc',{radius:180,halfAngle:.75,burn:5},.1,o,turn(a),.6);for(let i=0;i<3;i++)add('line',{range:225,width:20,burn:4},.45+i*.18,at(0,(i-1)*52),f,.38);break;
 case 'tidemirror':for(const s of [-1,1])for(let i=0;i<4;i++)add('line',{range:160,width:18,slow:2},i*.22,at(-80,s*(120-i*32)),f,.26);add('ring',{radius:80,knock:160},1,o,f,.7);break;
 case 'recollection':{
  const trail=history.length?history.filter((_,i)=>i%Math.max(1,Math.floor(history.length/5))===0).slice(-5):[at(-30),at(0,-40),at(40),at(0,40),o];
  const oldHealth=history.length?Math.max(...history.map(h=>h.hp)):0;
  actions.push({restoreHealth:oldHealth,delay:0});
  for(let i=0;i<trail.length;i++)add('arc',{radius:95,halfAngle:Math.PI},i*.22,trail[trail.length-1-i],f,.36);break;
 }
 case 'heavensfall':for(let i=-1;i<=1;i++){add('line',{range:385,width:18,shock:.7},(i+1)*.2,{x:Math.max(175,Math.min(529,o.x+i*70)),y:55},{x:0,y:1},.45);add('line',{range:365,width:16,knock:200},.7+(i+1)*.12,{x:170,y:Math.max(65,Math.min(428,o.y+i*60))},{x:1,y:0},.45);}break;
 }
 return actions;
}
