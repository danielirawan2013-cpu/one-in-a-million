// Bosses have individually drawn anatomy, palettes and attack poses.
// Coordinates stay on the pixel grid; all drawings share only pen primitives.
export const BOSS_DESIGNS={
 warden:{shape:'iron-behemoth',height:65,width:82,color:'#b6c7cf',attack:'slam'},
 archivist:{shape:'archive-owl',height:78,width:94,color:'#dec69b',attack:'talon'},
 'workyard-boss':{shape:'salvage-scorpion',height:68,width:100,color:'#d09d6e',attack:'pincer'},
 'foundry-boss':{shape:'furnace-salamander',height:64,width:106,color:'#f3b776',attack:'bite'},
 'rootgrove-boss':{shape:'elder-stag',height:88,width:84,color:'#bed49a',attack:'antler'},
 'weaverhall-boss':{shape:'silk-matriarch',height:58,width:110,color:'#dcbcea',attack:'fang'},
 'stormshore-boss':{shape:'tide-crustacean',height:56,width:96,color:'#a0d3d0',attack:'pincer'},
 'beacon-boss':{shape:'prism-moth',height:80,width:100,color:'#c5eaf2',attack:'shard'},
 'starpass-boss':{shape:'meteor-armadillo',height:66,width:88,color:'#e3b6a6',attack:'slam'},
 'starvault-boss':{shape:'astral-ray',height:76,width:110,color:'#d8c7f4',attack:'star'},
 'heartgate-boss':{shape:'brass-minotaur',height:86,width:86,color:'#e0bb7f',attack:'fist'},
 'heartcore-boss':{shape:'command-nautilus',height:76,width:88,color:'#f0c8a3',attack:'tendril'},
 'lake-storm':{shape:'thunder-wyvern',height:90,width:108,color:'#a2e4e9',attack:'lightning'},
 'skythreshold-god':{shape:'glacial-wyrm',height:110,width:112,color:'#def5f4',attack:'frost'},
 'oathtribunal-god':{shape:'oath-basilisk',height:87,width:102,color:'#ebce91',attack:'judgement'},
 'sunforge-god':{shape:'solar-phoenix',height:105,width:120,color:'#ffcf84',attack:'flame'},
 'mooncourt-god':{shape:'lunar-medusa',height:98,width:82,color:'#cdddf5',attack:'tide'},
 'exilearchive-god':{shape:'memory-cuttlefish',height:83,width:94,color:'#dec0ee',attack:'memory'},
 'crownsummit-god':{shape:'crowned-griffin',height:106,width:122,color:'#f5dd9f',attack:'crown'}
};
const ink='#192b37';
function box(c,col,x,y,w,h){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function line(c,col,x,y,xx,yy,w=1){const n=Math.max(1,Math.ceil(Math.max(Math.abs(xx-x),Math.abs(yy-y))));for(let i=0;i<=n;i++)box(c,col,x+(xx-x)*i/n-w/2,y+(yy-y)*i/n-w/2,w,w);}
function poly(c,col,pts){
 const min=Math.ceil(Math.min(...pts.map(p=>p[1]))),max=Math.floor(Math.max(...pts.map(p=>p[1])));
 for(let y=min;y<=max;y++){const cuts=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))cuts.push(a[0]+(y-a[1])/(b[1]-a[1])*(b[0]-a[0]));}cuts.sort((a,b)=>a-b);for(let i=0;i+1<cuts.length;i+=2)box(c,col,Math.ceil(cuts[i]),y,Math.floor(cuts[i+1])-Math.ceil(cuts[i])+1,1);}
}
function body(c,col,pts){poly(c,col,pts);for(let i=0;i<pts.length;i++)line(c,ink,...pts[i],...pts[(i+1)%pts.length],2);}
function oval(c,col,x,y,rx,ry){for(let yy=-ry;yy<=ry;yy++){const w=Math.floor(rx*Math.sqrt(Math.max(0,1-yy*yy/(ry*ry))));box(c,col,x-w,y+yy,w*2+1,1);}}
function gem(c,col,x,y,w,h){body(c,col,[[x,y-h],[x+w,y-h*.4],[x+w*.6,y+h*.35],[x-w*.6,y+h*.35],[x-w,y-h*.4]]);poly(c,'#f2fbef',[[x,y-h+2],[x+2,y],[x-w*.6,y-h*.3]]);line(c,'#7396a7',x,y-h,x+w*.6,y+h*.3);}
function star(c,col,x,y,r=4){line(c,col,x-r,y,x+r,y,1);line(c,col,x,y-r,x,y+r,1);box(c,'#f4f9da',x-1,y-1,3,3);}
function eye(c,x,y,col='#f5dc8c',w=5){box(c,ink,x-1,y-1,w+2,4);box(c,col,x,y,w,2);box(c,'#fff8df',x,y,1,1);}
function joint(c,col,x,y,r=5){oval(c,ink,x,y,r+1,r+1);oval(c,col,x,y,r,r);box(c,'#dfe6c9',x-2,y-3,3,1);}
function chain(c,pts,col,w=3){for(let i=0;i+1<pts.length;i++)line(c,ink,...pts[i],...pts[i+1],w+2);for(let i=0;i+1<pts.length;i++)line(c,col,...pts[i],...pts[i+1],w);}
function feather(c,col,x,y,xx,yy,width=4){const dx=xx-x,dy=yy-y,d=Math.max(1,Math.hypot(dx,dy)),nx=-dy/d*width,ny=dx/d*width;body(c,col,[[x-nx,y-ny],[xx,yy],[x+nx,y+ny]]);line(c,'#f9e1a3',x,y,xx,yy);}
function bolts(c,col,pts,w=2){for(let i=0;i+1<pts.length;i++)line(c,col,...pts[i],...pts[i+1],w);}

function ironBehemoth(c,a){
 // A low, broad iron creature with an empty helmet, shield arm and four feet.
 for(const x of [-24,16]){body(c,'#526777',[[x,-20],[x+12,-18],[x+13,-4],[x+16,-2],[x+16,2],[x-3,2]]);box(c,'#a6bcc3',x-1,-4,14,3);}
 body(c,'#566c7d',[[-30,-39],[-19,-49],[16,-49],[28,-36],[25,-12],[-24,-12]]);
 poly(c,'#8ba2ad',[[-24,-38],[-17,-44],[13,-44],[21,-34],[17,-18],[-19,-18]]);
 for(let i=0;i<3;i++){box(c,'#506573',-19,-36+i*8,37,3);box(c,'#bdccd0',-18,-37+i*8,34,1);}
 body(c,'#9cb2bb',[[-17,-49],[-12,-60],[11,-60],[17,-49],[12,-39],[-13,-39]]);
 box(c,ink,-11,-50,23,5);eye(c,-7,-49,'#f1c478',4);eye(c,4,-49,'#f1c478',4);
 body(c,'#647d8b',[[-29,-42],[-39,-38],[-40,-15],[-29,-8],[-22,-14],[-21,-31]]);
 poly(c,'#bbcbd0',[[-34,-33],[-28,-36],[-25,-17],[-30,-12],[-35,-17]]);box(c,'#6f8994',-32,-32,2,18);
 body(c,'#465f73',[[25,-40],[35,-36],[38,-18+a],[33,-10+a],[22,-12+a],[18,-22+a]]);
 joint(c,'#b7c9c8',29,-31,6);box(c,'#d7c58b',-3,-32,7,10);box(c,'#fff0b0',-1,-30,3,6);
 for(const x of [-18,17]){poly(c,'#d4d9ca',[[x,-44],[x-2,-56],[x+5,-46]]);}
}
function archiveOwl(c,a,t){
 // Parchment feather plates, a hooked beak and a book-shaped facial disc.
 for(const s of [-1,1]){c.save();c.scale(s,1);body(c,'#6c5575',[[9,-38],[32,-57-a],[45,-38],[41,-13],[27,-7],[14,-17]]);for(let i=0;i<4;i++)feather(c,i%2?'#ceb690':'#a99284',16+i*5,-37,28+i*4,-11+i*2,4);line(c,'#f0d7a0',15,-35,35,-46);c.restore();}
 body(c,'#8b7083',[[-18,-40],[-16,-17],[-7,-7],[7,-7],[18,-19],[17,-43]]);poly(c,'#dfc89d',[[-10,-37],[10,-37],[13,-20],[0,-12],[-12,-22]]);
 for(let i=0;i<4;i++)poly(c,'#b09c82',[[-7+i*4,-27],[-4+i*4,-23],[-2+i*4,-27]]);
 body(c,'#b69a85',[[-22,-61],[-14,-70],[-12,-57],[12,-57],[15,-72],[22,-62],[22,-42],[12,-33],[-12,-33],[-22,-44]]);
 oval(c,'#eee0bb',-9,-49,9,12);oval(c,'#eee0bb',9,-49,9,12);oval(c,'#625575',-9,-49,5,7);oval(c,'#625575',9,-49,5,7);eye(c,-11,-50,'#edc775',5);eye(c,7,-50,'#edc775',5);
 poly(c,'#c49360',[[0,-49],[5,-42],[0,-35],[-4,-42]]);line(c,'#f6dbaf',0,-46,0,-39);
 for(const x of [-8,8]){line(c,'#ba996a',x,-10,x,-4,3);for(let i=-1;i<=1;i++)line(c,'#eed6a1',x,-5,x+i*4,0,2);}
 box(c,'#785772',-14,-63,28,2);star(c,'#f4e1aa',0,-66,3);
}
function salvageScorpion(c,a){
 chain(c,[[15,-26],[30,-41],[30,-55],[16,-64],[6,-57]],'#846950',6);joint(c,'#c49a71',30,-43,5);body(c,'#d3b084',[[6,-59],[0,-57],[1,-49],[8,-51],[14,-57],[16,-66],[8,-65]]);
 for(const s of [-1,1]){c.save();c.scale(s,1);for(let i=0;i<3;i++)chain(c,[[10,-21+i*5],[27+i*3,-20+i*8],[33+i*4,2]],i%2?'#84989a':'#b19a7b',3);chain(c,[[15,-29],[32,-31],[38,-43+a]],'#ae815c',5);body(c,'#b98d66',[[33,-48+a],[29,-55+a],[35,-61+a],[45,-58+a],[48,-48+a],[44,-36+a],[35,-34+a],[31,-39+a],[37,-42+a],[40,-48+a],[39,-53+a],[35,-51+a]]);poly(c,'#e0b98d',[[35,-59+a],[42,-56+a],[44,-48+a],[40,-43+a],[40,-53+a]]);c.restore();}
 body(c,'#536b70',[[-23,-32],[-13,-40],[14,-38],[24,-25],[20,-10],[-19,-9],[-26,-20]]);
 body(c,'#be8d66',[[-17,-33],[12,-33],[17,-19],[-15,-19]]);box(c,'#dbb182',-13,-31,24,3);box(c,'#514d49',-11,-24,23,2);
 joint(c,'#bfceca',-16,-15,4);joint(c,'#bfceca',17,-15,4);eye(c,-9,-15,'#f2d888');eye(c,4,-15,'#f2d888');
 for(const [x,y] of [[-7,-35],[5,-28],[-13,-22]])box(c,'#f0dcb1',x,y,2,2);
}
function furnaceSalamander(c,a,t){
 body(c,'#693c3c',[[14,-27],[29,-26],[42,-33],[47,-41],[50,-35],[49,-21],[37,-13],[16,-13]]);poly(c,'#ba6245',[[22,-22],[39,-25],[46,-35],[43,-22],[31,-17],[20,-17]]);
 for(const x of [-21,10]){body(c,'#623b3a',[[x,-19],[x-6,-11],[x-11,-5],[x-10,1],[x+3,1],[x+6,-12]]);for(let i=0;i<3;i++)box(c,'#d2ac77',x-9+i*4,-2,2,3);}
 body(c,'#8e4a40',[[-29,-34],[-11,-42],[13,-40],[28,-29],[24,-14],[-22,-13],[-34,-23]]);
 poly(c,'#ad6d4c',[[-17,-34],[12,-34],[18,-26],[11,-17],[-19,-18]]);body(c,'#2e3033',[[-12,-32],[11,-31],[16,-23],[9,-17],[-13,-19]]);
 oval(c,'#df744d',1,-24,10,6);oval(c,'#ffd180',-1,-25,6,4);for(let i=0;i<5;i++)line(c,'#70463d',-12+i*6,-32,-11+i*6,-17,2);
 body(c,'#ab674c',[[-26,-33],[-38,-34],[-49,-28],[-49,-20],[-33,-16],[-23,-20]]);poly(c,'#dc9e63',[[-37,-31],[-46,-27],[-43,-23],[-29,-23],[-28,-29]]);eye(c,-35,-28,'#fff0ad');box(c,ink,-47,-23,2,2);line(c,'#423536',-45,-20,-29,-18,2);
 for(let i=0;i<5;i++){const x=-12+i*8,h=10+(i%2)*7+a;poly(c,'#b9563e',[[x-6,-39],[x-2,-39-h],[x+1,-45],[x+5,-40-h*.7],[x+7,-37]]);poly(c,'#ffcf75',[[x-2,-39],[x,-46-h*.5],[x+3,-38]]);}
 for(const [x,y] of [[-25,-16],[20,-16],[28,-26]])box(c,'#edbe7d',x,y,3,2);
}
function elderStag(c,a){
 for(const s of [-1,1]){c.save();c.scale(s,1);chain(c,[[8,-57],[19,-66],[24,-79],[34,-82]],'#8b8062',3);chain(c,[[19,-66],[32,-65],[37,-72]],'#8b8062',2);line(c,'#c5b794',24,-78,22,-86,2);line(c,'#c5b794',19,-66,14,-78,2);for(const [x,y] of [[29,-73],[35,-62],[15,-78]])poly(c,'#97b779',[[x,y],[x+8,y-5],[x+7,y+2],[x+2,y+4]]);c.restore();}
 for(const x of [-17,13]){body(c,'#4e6452',[[x,-28],[x+8,-27],[x+7,-9],[x+3,-2],[x+5,2],[x-4,2],[x-3,-12]]);line(c,'#b5c08d',x+2,-21,x,-6,2);}
 body(c,'#536d55',[[-23,-42],[-13,-51],[16,-47],[26,-36],[20,-21],[-17,-21],[-25,-29]]);poly(c,'#83a076',[[-18,-42],[-8,-46],[13,-43],[20,-33],[14,-26],[-14,-27]]);
 for(let i=0;i<5;i++)line(c,'#475d48',-16+i*7,-42,-17+i*7,-24,2);
 body(c,'#768b68',[[-9,-40],[-12,-54],[-9,-64],[9,-65],[15,-55],[8,-39],[3,-30]]);poly(c,'#c2cf9c',[[-6,-58],[7,-58],[8,-50],[1,-42],[-6,-50]]);eye(c,-8,-54,'#eaf4b8',4);eye(c,5,-54,'#eaf4b8',4);box(c,'#3b5147',-2,-46,4,3);
 for(const s of [-1,1])body(c,'#acc58b',[[s*9,-59],[s*23,-64],[s*20,-54],[s*12,-52]]);
 for(const [x,y] of [[-15,-39],[14,-33],[-7,-26]]){oval(c,'#9abd77',x,y,6,3);box(c,'#d9db9a',x,y-3,2,2);}star(c,'#f2e6aa',0,-61,3);
}
function silkMatriarch(c,a){
 for(const s of [-1,1]){c.save();c.scale(s,1);for(let i=0;i<4;i++){const lift=i%2?a:-a;chain(c,[[12,-26+i*3],[28+i*4,-40+i*6+lift],[45+i*2,-17+i*5],[43+i*3,1]],'#76577e',3);line(c,'#bea7ce',29+i*4,-39+i*6+lift,44+i*2,-16+i*5,1);}c.restore();}
 oval(c,ink,0,-35,26,22);oval(c,'#705378',0,-35,24,20);oval(c,'#9c75a3',-5,-40,18,13);poly(c,'#dcc3e4',[[-11,-48],[0,-53],[11,-47],[6,-36],[0,-31],[-7,-37]]);
 for(let i=0;i<3;i++){line(c,'#695176',-18,-41+i*6,18,-41+i*6,1);}
 body(c,'#64465e',[[-15,-23],[-10,-31],[10,-31],[17,-21],[12,-9],[-10,-9]]);poly(c,'#ba93b4',[[-9,-26],[9,-26],[10,-15],[-8,-15]]);
 for(const [x,y] of [[-8,-23],[-2,-25],[4,-25],[10,-23]])eye(c,x,y,'#f4e5ac',3);
 for(const s of [-1,1])body(c,'#e9d8c8',[[s*5,-13],[s*11,-11],[s*8,-3],[s*4,-7]]);
 for(const x of [-13,13]){line(c,'#d9c4df',x,-37,x,-19,1);box(c,'#f5e7e8',x-2,-39,5,3);}
}
function tideCrustacean(c,a){
 for(const s of [-1,1]){c.save();c.scale(s,1);for(let i=0;i<3;i++)chain(c,[[12,-17+i*4],[28+i*3,-14+i*4],[31+i*4,1]],'#4a8391',3);chain(c,[[16,-29],[31,-28],[39,-40+a]],'#639aaa',5);
 body(c,'#386c7f',[[34,-45+a],[33,-51+a],[38,-54+a],[45,-48+a],[47,-39+a],[43,-30+a],[33,-30+a],[29,-37+a],[33,-42+a],[36,-35+a],[41,-35+a],[41,-42+a],[37,-46+a]]);poly(c,'#a3d5ce',[[36,-49+a],[41,-46+a],[44,-39+a],[42,-35+a],[39,-44+a]]);c.restore();}
 body(c,'#396777',[[-27,-24],[-22,-38],[-10,-43],[14,-40],[27,-27],[23,-13],[-20,-12]]);poly(c,'#6fabae',[[-21,-28],[-17,-36],[-7,-40],[10,-36],[20,-26],[15,-19],[-16,-19]]);
 for(let i=0;i<4;i++){line(c,'#3f7888',-12+i*8,-37,-18+i*10,-21,2);}
 for(const x of [-8,8]){line(c,'#9ed1cb',x,-25,x,-37,3);eye(c,x-2,-39,'#f5e3ab',4);}
 poly(c,'#f0deac',[[-4,-21],[0,-29],[5,-21],[0,-16]]);line(c,ink,-11,-16,11,-16,2);
 for(const [x,y] of [[-20,-29],[17,-26],[-13,-22]]){oval(c,'#c7cbb5',x,y,3,2);box(c,'#eff1d6',x-1,y-2,2,1);}
}
function prismMoth(c,a){
 for(const s of [-1,1]){c.save();c.scale(s,1);body(c,'#285b78',[[6,-42],[19,-70-a],[44,-66],[48,-45],[33,-33],[39,-14],[27,-9],[10,-29]]);poly(c,'#79bdce',[[11,-44],[22,-65-a],[38,-60],[39,-45],[26,-38]]);poly(c,'#b7e3df',[[15,-45],[26,-62],[34,-55],[27,-44]]);poly(c,'#577caa',[[15,-33],[27,-32],[34,-17],[27,-14]]);gem(c,'#e9edf1',29,-51,5,10);line(c,'#e0f2e2',9,-39,26,-64,1);line(c,'#99c7df',14,-34,28,-18,1);c.restore();}
 body(c,'#456889',[[-6,-52],[-10,-43],[-6,-16],[0,-7],[7,-18],[9,-43],[5,-52]]);poly(c,'#b5dae3',[[-3,-47],[3,-47],[3,-18],[0,-12],[-3,-23]]);
 for(let i=0;i<4;i++)line(c,'#67859e',-5,-40+i*7,5,-40+i*7,1);eye(c,-5,-48,'#f8ebba',3);eye(c,3,-48,'#f8ebba',3);
 chain(c,[[-3,-51],[-12,-65],[-17,-70]],'#d4e9e2',1);chain(c,[[3,-51],[12,-65],[16,-72]],'#d4e9e2',1);star(c,'#f6f4d0',-17,-71,3);star(c,'#f6f4d0',16,-73,3);
}
function meteorArmadillo(c,a){
 for(const x of [-24,14]){body(c,'#584354',[[x,-19],[x+12,-17],[x+12,0],[x-1,0]]);for(let i=0;i<3;i++)box(c,'#d7b4a7',x+i*4,-2,3,3);}
 body(c,'#624b69',[[-32,-27],[-24,-46],[-7,-55],[17,-51],[31,-35],[28,-18],[-25,-14]]);poly(c,'#9b7685',[[-24,-30],[-20,-42],[-5,-49],[13,-46],[24,-33],[21,-23],[-20,-20]]);
 for(let i=0;i<4;i++){const x=-19+i*12;chain(c,[[x,-41],[x-5,-31],[x-3,-21]],'#543e58',3);line(c,'#d7aea3',x+1,-42,x-3,-31,1);}
 for(const [x,y] of [[-9,-48],[9,-46],[24,-35]])gem(c,'#c8b9e5',x,y,5,12);
 body(c,'#927584',[[-26,-26],[-36,-29],[-42,-22],[-40,-13],[-26,-11],[-18,-18]]);eye(c,-34,-23,'#ffe2a0',5);box(c,ink,-40,-17,3,2);
 chain(c,[[26,-22],[38,-17],[42,-6]],'#a1818a',5);poly(c,'#c9add5',[[36,-8],[43,-14],[45,-2],[39,0]]);
 for(const [x,y] of [[-17,-37],[4,-29],[15,-39]])box(c,'#e9ad78',x,y,3,2);
}
function astralRay(c,a,t){
 // A celestial manta: broad fins, delicate underside, and a comet tail.
 chain(c,[[0,-17],[10,-6],[27,-7],[34,-20],[42,-15]],'#a292c9',2);star(c,'#e6d9fc',42,-15,4);
 for(const s of [-1,1]){c.save();c.scale(s,1);body(c,'#4b4775',[[3,-40],[25,-56-a],[54,-44-a],[43,-32],[32,-15],[18,-23],[6,-18]]);poly(c,'#9b8ac2',[[8,-38],[27,-50-a],[46,-42-a],[31,-24],[18,-28]]);poly(c,'#c1b0dc',[[14,-38],[27,-45],[40,-40],[29,-30]]);for(let i=0;i<3;i++)line(c,'#6e5d97',19+i*9,-43,20+i*7,-30,1);star(c,'#f8eac2',34,-38,3);c.restore();}
 body(c,'#8c7bb7',[[-13,-39],[-9,-48],[0,-52],[11,-44],[16,-33],[9,-18],[0,-13],[-12,-24]]);poly(c,'#d6caed',[[-7,-36],[0,-42],[7,-35],[6,-23],[0,-19],[-6,-26]]);eye(c,-10,-39,'#fff1b5',4);eye(c,6,-39,'#fff1b5',4);
 for(const s of [-1,1])poly(c,'#cdbbdf',[[s*8,-47],[s*16,-58],[s*18,-51],[s*11,-39]]);
 for(let i=0;i<5;i++){const ang=i*Math.PI*.4+t*.2;star(c,'#c8c7f2',Math.cos(ang)*24,-44+Math.sin(ang)*23,2);}
}
function brassMinotaur(c,a){
 for(const x of [-19,9]){body(c,'#72543f',[[x,-26],[x+11,-26],[x+13,-9],[x+17,-3],[x+17,2],[x-2,2],[x-3,-8]]);poly(c,'#b68a58',[[x+1,-22],[x+8,-22],[x+9,-8],[x+1,-8]]);box(c,'#ebc98d',x,-2,15,2);}
 for(const s of [-1,1]){c.save();c.scale(s,1);body(c,'#896444',[[17,-51],[29,-49],[35,-35],[37,-18+a],[28,-10+a],[19,-17+a],[19,-33]]);body(c,'#b18a55',[[25,-31],[36,-28],[37,-14+a],[26,-11+a],[20,-18+a]]);line(c,'#e3bd7a',25,-28,34,-24,2);joint(c,'#e0ba7b',27,-40,5);c.restore();}
 body(c,'#78604a',[[-23,-47],[-15,-59],[14,-59],[24,-43],[18,-23],[-16,-23]]);poly(c,'#b58f59',[[-15,-49],[15,-49],[16,-33],[10,-27],[-13,-30]]);
 for(const x of [-8,7]){box(c,'#d8b472',x,-46,5,12);box(c,'#f0d699',x,-45,3,2);}gem(c,'#e7ca85',0,-36,6,10);
 body(c,'#a3815a',[[-15,-64],[-9,-74],[10,-74],[16,-62],[9,-48],[-9,-48]]);body(c,'#c6a071',[[-11,-58],[11,-58],[9,-49],[-9,-49]]);eye(c,-10,-63,'#fff1b9',5);eye(c,6,-63,'#fff1b9',5);box(c,'#534638',-6,-53,3,2);box(c,'#534638',4,-53,3,2);
 for(const s of [-1,1])body(c,'#f0d5a0',[[s*11,-70],[s*23,-78],[s*25,-85],[s*29,-80],[s*26,-70],[s*16,-63]]);
}
function commandNautilus(c,a,t){
 for(let i=0;i<6;i++){const s=i<3?-1:1,j=i%3;chain(c,[[s*9,-24],[s*(18+j*5),-12-j*9],[s*(30+j*5),-20-j*3+a],[s*(34+j*3),-4-j*8],[s*(23+j*5),2-j*3]],'#be957e',3);for(let k=0;k<3;k++)box(c,'#f0d5ac',s*(20+j*5)+k*s*3,-10-j*9,2,2);}
 oval(c,ink,0,-43,27,28);oval(c,'#6b536b',0,-44,25,26);oval(c,'#bd948f',-4,-47,20,21);oval(c,'#e5b9a2',-6,-48,15,15);
 for(let i=0;i<90;i++){const ang=i*.12,r=2+i*.17;box(c,'#715d70',-6+Math.cos(ang)*r,-47+Math.sin(ang)*r,2,2);}star(c,'#ffe9b2',-6,-47,4);
 for(let i=0;i<6;i++){const ang=i*Math.PI/3;joint(c,'#d2af86',Math.cos(ang)*23,-44+Math.sin(ang)*24,3);}
 body(c,'#947589',[[-14,-26],[-8,-34],[8,-34],[16,-25],[8,-16],[-10,-16]]);eye(c,-9,-26,'#fbe2a9',5);eye(c,5,-26,'#fbe2a9',5);line(c,ink,-5,-19,7,-19,2);
}
function thunderWyvern(c,a,t){
 // Horizontal wing spread and a hooked tail distinguish the Tempest from Rimewyrm.
 chain(c,[[9,-22],[29,-19],[41,-28],[43,-42],[49,-46]],'#47899a',5);poly(c,'#94d3d4',[[40,-40],[43,-53],[49,-47],[44,-35]]);
 for(const s of [-1,1]){c.save();c.scale(s,1);body(c,'#244c67',[[8,-38],[24,-71-a],[50,-65-a],[48,-43],[35,-45],[29,-26],[20,-33],[9,-24]]);poly(c,'#347b91',[[13,-40],[25,-63-a],[42,-59-a],[37,-47],[29,-36],[22,-41]]);line(c,'#ace8e7',9,-34,25,-71-a,2);line(c,'#76c6d4',25,-69-a,49,-65-a,1);line(c,'#2a546e',25,-63,28,-31,2);bolts(c,'#d8f4df',[[29,-54],[22,-49],[30,-46],[23,-40]],1);body(c,'#477f8e',[[s===1?4:8,-24],[15,-13],[16,-4],[10,0],[5,-3],[5,-11]]);for(let i=0;i<3;i++)box(c,'#d4eee2',8+i*3,-1,2,2);c.restore();}
 body(c,'#285970',[[-13,-33],[-10,-49],[-4,-58],[8,-56],[16,-37],[12,-18],[1,-12],[-11,-20]]);poly(c,'#68acb4',[[-5,-46],[3,-47],[10,-33],[5,-19],[-2,-19],[-7,-30]]);for(let i=0;i<4;i++)line(c,'#397081',-4,-25-i*5,5,-25-i*5,1);
 body(c,'#3d8094',[[-10,-55],[-14,-64],[-10,-74],[1,-78],[9,-74],[15,-66],[25,-66],[29,-59],[26,-52],[12,-49],[5,-52]]);poly(c,'#97d9d9',[[4,-69],[13,-63],[24,-63],[25,-57],[11,-54],[3,-58]]);eye(c,3,-65,'#fff0a5',5);box(c,ink,24,-60,2,2);line(c,ink,11,-55,26,-55,2);for(const x of [13,20])poly(c,'#f0f5df',[[x,-54],[x+3,-54],[x+1,-50]]);
 body(c,'#bdded6',[[-9,-71],[-18,-86],[-12,-85],[-1,-74]]);body(c,'#e0e7b4',[[5,-74],[4,-88],[9,-84],[13,-70]]);
 for(let i=0;i<3;i++)poly(c,'#cce9ba',[[11,-35-i*8],[20,-40-i*8],[12,-44-i*8]]);star(c,'#ffeaae',0,-32,4);
 if(a||t)bolts(c,'#8edce5',[[-19,-43],[-26,-49],[-23,-55],[-30,-64]],1);
}
function glacialWyrm(c,a,t){
 // Rimewyrm is a long coiled ice serpent with blade-like fins, not the lake dragon.
 body(c,'#385b7c',[[-23,-24],[-36,-36],[-33,-51],[-16,-58],[9,-52],[27,-45],[36,-32],[34,-13],[23,-2],[0,1],[-18,-5],[-22,-15],[-8,-23],[9,-18],[18,-22],[15,-32],[-3,-36],[-19,-31]]);
 poly(c,'#8bbdcc',[[-27,-37],[-22,-47],[-10,-50],[11,-43],[27,-33],[26,-15],[16,-8],[-4,-8],[-16,-13],[-8,-17],[9,-12],[22,-19],[22,-32],[8,-39],[-10,-43]]);
 line(c,'#d5eee7',-25,-45,-11,-46,2);chain(c,[[11,-44],[25,-34],[25,-19],[17,-11],[2,-10]],'#e7f3e9',2);
 body(c,'#78b0c3',[[-21,-43],[-22,-62],[-16,-78],[-5,-83],[4,-76],[1,-62],[-6,-48],[-7,-33],[-15,-28]]);poly(c,'#c4e7e5',[[-15,-69],[-9,-74],[-5,-71],[-10,-56],[-13,-40],[-17,-39]]);
 for(let i=0;i<5;i++)line(c,'#4b7b9c',-20,-43-i*5,-12,-43-i*5,1);
 for(const [x,y,s] of [[-24,-47,-1],[-26,-60,-1],[7,-52,1],[16,-43,1],[32,-31,1]]){body(c,'#91cbd5',[[x,y],[x+s*19,y-18],[x+s*12,y+3]]);poly(c,'#e5f7f0',[[x,y],[x+s*17,y-15],[x+s*7,y-2]]);}
 body(c,'#b2dce0',[[-18,-76],[-24,-89],[-17,-98],[-8,-99],[2,-90],[14,-88],[22,-80],[19,-73],[2,-72],[-5,-77]]);poly(c,'#e4f3e8',[[-8,-92],[2,-85],[14,-85],[18,-80],[12,-77],[0,-77],[-7,-82]]);eye(c,-6,-87,'#91b9df',6);box(c,ink,17,-81,2,2);line(c,'#6085a4',1,-77,17,-77,1);poly(c,'#f7fff0',[[7,-77],[10,-77],[8,-71]]);
 for(const [x,xx] of [[-20,-31],[-10,-12],[0,9]])body(c,'#dff4ed',[[x,-94],[xx,-107],[xx+3,-104],[x+6,-94]]);
 for(const [x,y] of [[-30,-48],[29,-21],[4,-43]]){star(c,'#dff7f2',x,y,3);}
}
function oathBasilisk(c,a){
 // A two-headed basilisk with balance pans hanging from its paired horns.
 body(c,'#6a6451',[[-28,-24],[-35,-12],[-27,-2],[-4,2],[18,-2],[30,-12],[25,-21],[10,-25],[-5,-19],[-16,-20]]);poly(c,'#b29967',[[-23,-18],[-25,-10],[-10,-5],[9,-6],[20,-12],[14,-17],[1,-15],[-12,-11]]);chain(c,[[18,-10],[32,-7],[41,-16],[43,-24]],'#8f815c',4);
 for(const s of [-1,1]){c.save();c.scale(s,1);body(c,'#8e845c',[[0,-20],[3,-42],[9,-52],[9,-63],[18,-66],[24,-58],[20,-45],[14,-35],[15,-16]]);poly(c,'#d8bf82',[[8,-27],[9,-43],[15,-52],[17,-58],[20,-54],[15,-41],[13,-25]]);for(let i=0;i<4;i++)line(c,'#797750',7,-31-i*5,14,-29-i*5,1);
 body(c,'#b7a477',[[9,-58],[8,-69],[14,-75],[26,-75],[31,-66],[42,-64],[44,-57],[35,-51],[22,-54],[14,-52]]);poly(c,'#e0c896',[[17,-69],[27,-66],[40,-61],[39,-57],[24,-58],[15,-61]]);eye(c,20,-65,'#f8e4a5',5);box(c,ink,39,-59,2,2);line(c,ink,28,-55,39,-55,1);
 body(c,'#e4cf9e',[[12,-69],[8,-83],[12,-84],[21,-71]]);line(c,'#e1c389',s===1?8:12,-81,39,-81,2);line(c,'#ccb27e',38,-81,38,-48,1);body(c,'#b18f63',[[30,-48],[46,-48],[43,-41],[33,-41]]);line(c,'#f1dba4',31,-47,45,-47,1);c.restore();}
 gem(c,'#ead396',0,-21,6,13);for(const x of [-24,-16,17,26])box(c,'#d8bf83',x,-5,3,2);
}
function solarPhoenix(c,a,t){
 // Layered hooked feathers and a streaming tail carry the Sunforge silhouette.
 for(let i=-2;i<=2;i++){const xx=i*9;feather(c,i%2?'#dd8a4e':'#a8563c',xx,-25,xx+i*8,-1+Math.abs(i)*4,5);feather(c,'#f3c574',xx,-24,xx+i*6,-6+Math.abs(i)*4,2);}
 for(const s of [-1,1]){c.save();c.scale(s,1);body(c,'#ac5c42',[[7,-53],[29,-76-a],[56,-79-a],[58,-60],[45,-46],[20,-33]]);for(let i=0;i<6;i++){const x=19+i*6;feather(c,['#e59b54','#f3ba68','#c77546'][i%3],12+i*4,-51-i*2,x+6,-25-i*7-a,5);}poly(c,'#f8d997',[[13,-54],[31,-71-a],[51,-74-a],[32,-62],[21,-46]]);line(c,'#fff0bd',17,-55,43,-69-a,2);c.restore();}
 body(c,'#cb7746',[[-13,-50],[-9,-30],[0,-20],[11,-31],[15,-50],[8,-65],[-6,-64]]);poly(c,'#f2c476',[[-6,-49],[5,-49],[7,-34],[0,-27],[-5,-37]]);line(c,'#de9658',0,-48,0,-30,1);
 body(c,'#e8ae60',[[-10,-66],[-8,-78],[0,-84],[10,-77],[11,-67],[4,-57],[-4,-57]]);body(c,'#fff0af',[[6,-74],[20,-71],[7,-66]]);eye(c,0,-74,'#fffbd1',4);
 for(const [x,xx,yy] of [[-7,-17,-98],[0,-2,-104],[7,17,-95]])feather(c,'#efc87e',x,-78,xx,yy,3);
 for(const x of [-7,7]){chain(c,[[x,-29],[x,-17],[x-3,-12]],'#e5c28b',2);line(c,'#f6e3aa',x,-14,x+5,-13,1);}
 oval(c,'#ebcc82',0,-61,4,3);star(c,'#fff2b9',0,-88,5);
}
function lunarMedusa(c,a,t){
 // An organic moon jellyfish: crescent bell, star spots and long ribbon tentacles.
 for(let i=0;i<7;i++){const x=-23+i*8,sway=Math.sin(t*1.5+i)*3;chain(c,[[x,-39],[x+sway,-23],[x-sway,-10],[x+sway,-2+Math.abs(i-3)*3]],i%2?'#708bb4':'#bbcce7',i%2?2:3);if(i%2===0)star(c,'#e5e6f4',x+sway,-4+Math.abs(i-3)*3,2);}
 body(c,'#344a75',[[-38,-49],[-34,-67],[-21,-79],[-5,-85],[14,-83],[30,-71],[37,-54],[30,-41],[13,-35],[-12,-34],[-29,-40]]);poly(c,'#708ab5',[[-32,-51],[-27,-66],[-16,-74],[0,-79],[19,-73],[29,-60],[29,-49],[10,-42],[-10,-42]]);
 poly(c,'#bfcfeb',[[-25,-58],[-17,-72],[-3,-77],[10,-75],[0,-70],[-7,-61],[-5,-52],[5,-47],[-10,-46],[-21,-49]]);
 line(c,'#dce9f0',-28,-48,-12,-41,2);line(c,'#dce9f0',-12,-41,11,-42,2);line(c,'#dce9f0',11,-42,30,-51,2);
 for(const [x,y] of [[-19,-61],[10,-63],[20,-54],[0,-52]])star(c,'#e2e9f7',x,y,2);
 eye(c,-11,-48,'#f5e7be',5);eye(c,8,-49,'#f5e7be',5);gem(c,'#efe6bf',0,-84,5,11);
 for(const s of [-1,1])body(c,'#94adcc',[[s*20,-43],[s*29,-29],[s*33,-15],[s*29,-12],[s*22,-29],[s*12,-38]]);
}
function memoryCuttlefish(c,a,t){
 // Mnemos has a living mantle edged in page-like fins and six purposeful arms.
 for(const s of [-1,1]){c.save();c.scale(s,1);for(let i=0;i<3;i++){const yy=-22-i*8;chain(c,[[9,yy],[22+i*4,yy+5],[33+i*4,yy-1+a],[37+i*3,yy-9]],'#9773b2',3);line(c,'#d5b4e5',23+i*4,yy+4,33+i*4,yy,1);for(let j=0;j<3;j++)box(c,'#ebd0e4',19+i*4+j*3,yy+3,2,2);}body(c,'#735581',[[s===1?12:11,-51],[27,-60],[33,-48],[25,-33],[12,-31]]);for(let j=0;j<3;j++)line(c,'#c3a2ce',20,-51+j*4,27,-48+j*4,1);c.restore();}
 body(c,'#695182',[[-19,-38],[-26,-53],[-18,-70],[-2,-79],[14,-71],[23,-54],[16,-37],[5,-27],[-7,-29]]);poly(c,'#ac87bd',[[-14,-46],[-18,-56],[-10,-68],[-1,-73],[11,-65],[15,-52],[8,-39],[-5,-36]]);
 poly(c,'#d3b8db',[[-8,-59],[-3,-69],[5,-65],[10,-53],[6,-44],[-3,-42]]);for(let i=0;i<4;i++)line(c,'#947098',-12,-59+i*5,9,-57+i*5,1);
 oval(c,ink,-12,-38,7,6);oval(c,ink,12,-38,7,6);oval(c,'#f0dbae',-12,-38,5,4);oval(c,'#f0dbae',12,-38,5,4);box(c,'#66497d',-13,-40,2,4);box(c,'#66497d',11,-40,2,4);
 body(c,'#8c678e',[[-6,-33],[5,-33],[10,-23],[4,-17],[-4,-17],[-9,-24]]);gem(c,'#f0d2d7',0,-26,4,9);
 // A single open memory folio is carried, not substituted for its body.
 body(c,'#d1b592',[[-17,-15],[-1,-12],[16,-16],[15,-3],[0,0],[-16,-3]]);poly(c,'#efe0bd',[[-13,-12],[-1,-10],[-1,-3],[-13,-5]]);poly(c,'#e3caaf',[[2,-10],[12,-12],[12,-5],[2,-3]]);line(c,'#9c7c84',0,-11,0,-2,1);
}
function crownedGriffin(c,a,t){
 // Veyr: a lion-bodied sovereign with three pairs of wings and a hooked beak.
 for(const s of [-1,1]){c.save();c.scale(s,1);for(let layer=2;layer>=0;layer--){const root=-53+layer*11;body(c,['#666486','#8b82a0','#aaa2b3'][layer],[[8,root],[34,-91+layer*12-a],[59-layer*7,-87+layer*13-a],[49-layer*7,-63+layer*15],[20,root+16]]);for(let i=0;i<4;i++)feather(c,['#d3c3a9','#b7afbb','#e9d6a3'][layer],18+i*6,root-i*3,44-layer*5+i*3,root+12-i*5,3);line(c,'#f5e0ae',13,root,48-layer*5,-81+layer*14-a,1);}c.restore();}
 chain(c,[[14,-24],[30,-22],[40,-29],[43,-42]],'#aa927c',4);body(c,'#d3b784',[[40,-44],[46,-48],[49,-42],[45,-36],[39,-36]]);
 for(const x of [-15,9]){body(c,'#817083',[[x,-27],[x+9,-26],[x+10,-10],[x+14,-5],[x+14,1],[x-2,1],[x-3,-11]]);box(c,'#ead4a1',x,-3,12,3);for(let i=0;i<3;i++)box(c,ink,x+i*4,0,1,2);}
 body(c,'#9c8490',[[-21,-51],[-16,-26],[-6,-18],[10,-20],[24,-34],[17,-51],[3,-59]]);poly(c,'#c8ae98',[[-13,-43],[-10,-28],[0,-23],[10,-28],[15,-40],[3,-48]]);
 body(c,'#b8a193',[[-20,-58],[-15,-76],[1,-82],[18,-71],[21,-55],[10,-42],[-10,-43]]);for(let i=0;i<7;i++){const ang=i*Math.PI/3.5;feather(c,i%2?'#edcf93':'#c4b39d',Math.cos(ang)*13,-60+Math.sin(ang)*13,Math.cos(ang)*24,-60+Math.sin(ang)*24,4);}
 body(c,'#dfcaa4',[[-9,-71],[4,-76],[15,-68],[14,-57],[3,-51],[-8,-58]]);eye(c,0,-66,'#fff6c6',5);body(c,'#f6deaa',[[11,-64],[27,-60],[20,-53],[11,-53]]);line(c,'#9f886f',14,-57,22,-56,1);
 body(c,'#ebc981',[[-14,-80],[-19,-97],[-8,-90],[0,-103],[7,-90],[19,-97],[14,-79]]);line(c,'#f7e7b0',-13,-81,13,-81,2);gem(c,'#d1c7e6',0,-88,4,8);
}

const DRAWINGS={
 'iron-behemoth':ironBehemoth,'archive-owl':archiveOwl,'salvage-scorpion':salvageScorpion,'furnace-salamander':furnaceSalamander,'elder-stag':elderStag,'silk-matriarch':silkMatriarch,'tide-crustacean':tideCrustacean,'prism-moth':prismMoth,'meteor-armadillo':meteorArmadillo,'astral-ray':astralRay,'brass-minotaur':brassMinotaur,'command-nautilus':commandNautilus,'thunder-wyvern':thunderWyvern,'glacial-wyrm':glacialWyrm,'oath-basilisk':oathBasilisk,'solar-phoenix':solarPhoenix,'lunar-medusa':lunarMedusa,'memory-cuttlefish':memoryCuttlefish,'crowned-griffin':crownedGriffin
};
export function drawBoss(c,e,time,{reducedMotion=false,flip=false}={}){
 const d=BOSS_DESIGNS[e.id];if(!d)return false;
 const t=reducedMotion?0:time,windup=e.windup||e.divineCast||e.stormCast,attack=windup?3:e.swingTime?-3:0,motion=attack+(reducedMotion?0:Math.round(Math.sin(t*2)*1.5));
 c.save();c.translate(Math.round(e.x),Math.round(e.y));if(flip)c.scale(-1,1);
 oval(c,'#12212c66',0,2,Math.min(37,d.width*.32),4);
 DRAWINGS[d.shape](c,motion,t);
 // Small hit sparks keep the creature's anatomy visible during combat.
 if(e.flash){star(c,'#fff0cd',-18,-31,3);star(c,'#fff0cd',19,-39,2);}
 c.restore();return true;
}
export function drawBossStrike(c,e){
 const d=BOSS_DESIGNS[e.id];if(!d||!e.attackFacing)return false;
 const face=e.attackFacing,angle=Math.atan2(face.y,face.x),radius=38,col=e.windup?'#edb898':d.color;
 c.save();
 // The same collision sector remains visible, but each creature strikes naturally.
 for(let i=0;i<24;i++){const a=angle-.65+i*1.3/23;box(c,col,e.x+Math.cos(a)*radius,e.y+Math.sin(a)*radius,1,1);}
 if(e.swingTime){const tip={x:e.x+face.x*35,y:e.y+face.y*35-8};
  if(['lightning','frost','judgement','flame','tide','memory','crown','star','shard'].includes(d.attack)){
   bolts(c,col,[[e.x,e.y-20],[e.x+face.x*15-face.y*6,e.y-12+face.y*15+face.x*6],[tip.x,tip.y]],2);star(c,col,tip.x,tip.y,5);
  }else if(['pincer','fang','talon','antler','bite'].includes(d.attack)){
   for(const s of [-1,1])line(c,col,e.x+face.x*20-face.y*s*8,e.y-10+face.y*20+face.x*s*8,tip.x,tip.y,2);
  }else{for(let i=0;i<6;i++){const a=i*Math.PI/3;line(c,col,tip.x+Math.cos(a)*3,tip.y+Math.sin(a)*3,tip.x+Math.cos(a)*10,tip.y+Math.sin(a)*10,2);}}
 }c.restore();return true;
}
