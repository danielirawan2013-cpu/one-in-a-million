import {drawLightningDragon} from './combat-art.mjs?v=0.4.0';
// Silhouettes are chosen by boss identity, never by a shared boss kind.
export const BOSS_DESIGNS={
 warden:{shape:'tower',color:'#b4c2bc',dark:'#44596c',height:49},archivist:{shape:'book',color:'#d1b795',dark:'#695073',height:46},
 'workyard-boss':{shape:'scrap',color:'#c99870',dark:'#615750',height:45},'foundry-boss':{shape:'furnace',color:'#f0b070',dark:'#713b36',height:49},
 'rootgrove-boss':{shape:'tree',color:'#a2bf7b',dark:'#536b4b',height:59},'weaverhall-boss':{shape:'loom',color:'#d3b5ed',dark:'#675078',height:40},
 'stormshore-boss':{shape:'crab',color:'#92c5c7',dark:'#3a6a7f',height:35},'beacon-boss':{shape:'crystal',color:'#c2e5ef',dark:'#477d9a',height:60},
 'starpass-boss':{shape:'centaur',color:'#dbbab3',dark:'#73576f',height:50},'starvault-boss':{shape:'orrery',color:'#ddc8f3',dark:'#796295',height:47},
 'heartgate-boss':{shape:'colossus',color:'#d9b374',dark:'#87644d',height:61},'heartcore-boss':{shape:'command',color:'#f3cb98',dark:'#856276',height:45},
 'skythreshold-god':{shape:'ice-dragon',color:'#bcecf2',dark:'#537b9b',height:96},'oathtribunal-god':{shape:'judge',color:'#e8c28c',dark:'#6c5452',height:61},
 'sunforge-god':{shape:'sun',color:'#f4b079',dark:'#984c3d',height:65},'mooncourt-god':{shape:'moon',color:'#b9c9f4',dark:'#5c6496',height:58},
 'exilearchive-god':{shape:'memory',color:'#d0a8e5',dark:'#705187',height:60},'crownsummit-god':{shape:'sovereign',color:'#f1d38d',dark:'#797392',height:76}
};
const r=(c,color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
const ln=(c,color,x,y,xx,yy,w=2)=>{const n=Math.max(1,Math.ceil(Math.max(Math.abs(xx-x),Math.abs(yy-y))));for(let i=0;i<=n;i++)r(c,color,x+(xx-x)*i/n,y+(yy-y)*i/n,w,w);};
function diamond(c,col,x,y,ww,hh){for(let j=0;j<hh;j++){const w=Math.max(1,Math.round(ww*(1-Math.abs(j-hh/2)/(hh/2))));r(c,col,x-w/2,y+j,w,1);}}
function ring(c,col,x,y,radius){for(let i=0;i<64;i++){const a=i*Math.PI/32;r(c,col,x+Math.cos(a)*radius,y+Math.sin(a)*radius,2,2);}}
function star(c,col,x,y,size=6){ln(c,col,x-size,y,x+size,y);ln(c,col,x,y-size,x,y+size);}
export function drawBoss(c,e,time,{reducedMotion=false,flip=false}={}){
 const d=BOSS_DESIGNS[e.id];if(!d)return false;const t=reducedMotion?0:time,bob=Math.round(Math.sin(t*2)*2);
 if(d.shape==='ice-dragon'){
  // Retain the other chat's dragon drawing; add frost, not a replacement body.
  drawLightningDragon(c,e,time,{reducedMotion,flip});
  for(const side of [-1,1]){for(let i=0;i<4;i++)diamond(c,'#dff9ff',e.x+side*(23+i*6),e.y-62+i*8,8,20);ln(c,'#dff9ff',e.x+side*12,e.y-65,e.x+side*17,e.y-94,3);}
  for(let i=0;i<7;i++){const a=i*Math.PI/3.5+t*.4;star(c,'#dbf7ff',e.x+Math.cos(a)*45,e.y-38+Math.sin(a)*31,3);}return true;
 }
 c.save();c.translate(Math.round(e.x),Math.round(e.y));if(flip)c.scale(-1,1);r(c,'#14232a66',-24,-1,48,7);
 const col=e.flash?'#fff3d5':d.color,dk=d.dark;
 const head=(x=0,y=-36)=>{r(c,dk,x-8,y-10,16,14);r(c,col,x-6,y-8,12,10);r(c,'#182938',x-4,y-4,3,2);r(c,'#182938',x+2,y-4,3,2);};
 const legs=(width=8)=>{r(c,dk,-12,-12,width,12);r(c,dk,4,-12,width,12);r(c,col,-14,-3,width+3,4);r(c,col,3,-3,width+3,4);};
 switch(d.shape){
 case 'tower':legs(10);r(c,dk,-16,-36,32,28);r(c,col,-13,-35,26,23);head(0,-39);r(c,'#eabf76',-3,-42,6,3);r(c,dk,-29,-38,15,35);r(c,col,-27,-36,11,30);ln(c,'#f0dcc0',22,-42,22,-9,3);r(c,dk,17,-12,13,3);break;
 case 'book':c.translate(0,bob-4);r(c,dk,-17,-26,34,24);r(c,col,-14,-34,28,23);r(c,'#e7d8b8',-11,-32,9,19);r(c,'#e7d8b8',2,-32,9,19);r(c,dk,-1,-34,2,25);for(let i=0;i<3;i++){r(c,dk,-9,-28+i*5,6,1);r(c,dk,3,-28+i*5,6,1);}for(const side of [-1,1]){r(c,col,side*25-5,-26,10,15);ln(c,col,side*15,-20,side*25,-23);}r(c,col,-3,-43,6,5);break;
 case 'scrap':legs();r(c,dk,-13,-31,27,24);head(-3,-32);r(c,col,-20,-26,12,13);r(c,col,10,-30,21,10);r(c,'#64797a',14,-20,16,9);for(let i=0;i<3;i++){r(c,'#d7ccb8',-11+i*8,-22,5,3);r(c,dk,-29+i*20,-39,12,6);}ln(c,col,-23,-10,-34,-25,3);break;
 case 'furnace':legs(11);r(c,dk,-20,-42,40,34);r(c,col,-17,-39,34,4);r(c,'#2a2632',-13,-31,26,20);for(let i=0;i<5;i++)r(c,col,-12+i*5,-30,2,18);r(c,'#ed895e',-6,-28,12,16);r(c,'#ffdc89',-3,-23,6,10);r(c,dk,-11,-53,12,12);r(c,col,-12,-53,14,3);r(c,col,-28,-30,8,15);r(c,col,20,-30,8,15);break;
 case 'tree':for(let j=0;j<39;j++)r(c,dk,-7-Math.floor(j/10),-40+j,14+Math.floor(j/5),1);for(const s of [-1,1]){ln(c,dk,s*5,-29,s*24,-41,5);ln(c,dk,s*24,-41,s*30,-54,4);ln(c,dk,s*4,-8,s*25,0,5);}for(let i=0;i<5;i++){r(c,col,-31+i*13,-54+(i%2)*8,15,13);}r(c,'#e8d69a',-6,-30,3,4);r(c,'#e8d69a',4,-30,3,4);break;
 case 'loom':for(const s of [-1,1])for(let i=0;i<4;i++){ln(c,col,s*10,-15-i*3,s*(27+i*3),-31+i*11);ln(c,dk,s*(27+i*3),-31+i*11,s*36,-24+i*10);}r(c,dk,-19,-29,38,21);r(c,col,-16,-31,32,5);for(let i=0;i<7;i++)r(c,'#edd7eb',-14+i*4,-24,1,14);r(c,col,-8,-38,16,9);r(c,'#efedc2',-6,-35,3,3);r(c,'#efedc2',4,-35,3,3);break;
 case 'crab':for(const s of [-1,1]){for(let i=0;i<3;i++){ln(c,dk,s*9,-10,s*(27-i*2),-10+i*5,4);}r(c,dk,s*29-7,-26,14,14);r(c,col,s*29-6,-30,5,12);r(c,col,s*29+1,-30,5,12);ln(c,col,s*12,-15,s*28,-23,3);}r(c,dk,-19,-24,38,20);r(c,col,-15,-25,30,9);r(c,'#eadcaa',-8,-30,3,7);r(c,'#eadcaa',6,-30,3,7);break;
 case 'crystal':diamond(c,dk,0,-58,36,56);diamond(c,col,-3,-55,16,50);for(const s of [-1,1]){diamond(c,col,s*24,-39,16,27);ln(c,dk,s*14,-25,s*25,-18,3);}r(c,'#ffedb7',-5,-30,10,4);break;
 case 'centaur':r(c,dk,-23,-20,42,14);for(const x of [-21,-10,9,17])r(c,col,x,-10,4,12);r(c,dk,8,-40,13,24);head(14,-41);diamond(c,col,-19,-43,17,19);ln(c,col,20,-20,33,-32,3);ln(c,'#f4d6a0',30,-48,30,-12,2);break;
 case 'orrery':c.translate(0,bob-7);ring(c,col,0,-19,24);ring(c,dk,0,-19,16);diamond(c,col,0,-35,22,30);for(let i=0;i<4;i++){const a=t*.6+i*Math.PI/2;star(c,col,Math.cos(a)*30,-19+Math.sin(a)*24,5);}break;
 case 'colossus':legs(16);r(c,dk,-24,-43,48,33);r(c,col,-20,-39,40,6);r(c,col,-31,-46,14,30);r(c,col,19,-46,14,30);head(0,-48);r(c,'#eabb65',-9,-30,18,13);r(c,'#ffe5aa',-4,-27,8,8);ln(c,dk,-24,-11,-38,-6,5);ln(c,dk,24,-11,38,-6,5);break;
 case 'command':c.translate(0,bob-4);diamond(c,dk,0,-39,34,35);r(c,col,-9,-28,18,9);r(c,'#fff1b6',-5,-26,10,5);for(const s of [-1,1]){ln(c,col,s*12,-17,s*34,-27,3);r(c,dk,s*34-5,-35,10,20);r(c,col,s*34-3,-31,6,9);}ln(c,col,0,-2,0,9,4);r(c,col,-8,5,16,3);break;
 case 'judge':for(let j=0;j<38;j++)r(c,dk,-13-Math.floor(j/6),-38+j,26+Math.floor(j/3),1);r(c,col,-13,-37,26,4);head(0,-42);r(c,dk,-9,-48,18,3);ln(c,col,-23,-54,-23,-10,2);ln(c,col,-38,-49,-9,-49,2);for(const x of [-38,-9]){ln(c,col,x,-49,x,-30,1);r(c,col,x-6,-31,12,3);}r(c,col,17,-27,5,12);break;
 case 'sun':c.translate(0,bob-3);for(let i=0;i<12;i++){const a=i*Math.PI/6;ln(c,col,Math.cos(a)*20,-39+Math.sin(a)*20,Math.cos(a)*29,-39+Math.sin(a)*29);}ring(c,col,0,-39,18);head(0,-38);r(c,dk,-12,-29,24,25);for(const s of [-1,1]){ln(c,col,s*13,-28,s*25,-14,5);diamond(c,'#ffe7a3',s*29,-28,13,23);}legs(7);break;
 case 'moon':c.translate(0,bob-5);for(let i=0;i<30;i++){const a=-1.5+i*.1;r(c,col,Math.cos(a)*25-8,-32+Math.sin(a)*25,5,5);}for(let j=0;j<31;j++){const w=11-Math.floor(j/4);r(c,dk,-w+Math.sin(j*.15)*5,-30+j,w*2,1);}head(1,-37);r(c,col,-9,-49,19,4);for(const s of [-1,1]){ln(c,col,s*11,-26,s*26,-18);diamond(c,col,s*29,-20,8,12);}break;
 case 'memory':c.translate(0,bob-7);r(c,dk,-13,-46,26,19);r(c,col,-11,-44,22,15);for(let i=0;i<4;i++)r(c,dk,-8,-41+i*3,16,1);r(c,dk,-8,-25,16,23);r(c,col,-4,-20,8,5);for(const s of [-1,1])for(let i=0;i<2;i++){ln(c,col,s*9,-24+i*12,s*27,-38+i*27);r(c,col,s*27-4,-41+i*27,8,6);}star(c,col,0,-56,5);break;
 case 'sovereign':for(const s of [-1,1])for(let i=0;i<3;i++){ln(c,col,s*12,-35,s*(42-i*4),-60+i*16,4);ln(c,dk,s*16,-30,s*(40-i*4),-53+i*16,2);}for(let j=0;j<38;j++)r(c,dk,-9-Math.floor(j/8),-38+j,18+Math.floor(j/4),1);head(0,-42);r(c,col,-15,-63,30,6);for(let i=-2;i<=2;i++)r(c,col,i*6-2,-73+Math.abs(i)*3,4,12);r(c,'#fff1c6',-3,-62,6,4);break;
 }
 c.restore();return true;
}
