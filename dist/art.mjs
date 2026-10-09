import {TILE,COLS,ROWS,WIDTH,HEIGHT,noise} from './world.mjs?v=0.2.0';
import {SWORD_SWING,clamp} from './core.mjs?v=0.2.0';
const P={'.':null,o:'#252830',h:'#634337',H:'#8d6550',s:'#e9bc92',S:'#f3d1a0',e:'#202a2c',a:'#e8debe',A:'#c4b48f',c:'#517a78',C:'#6e9b91',b:'#493e3e',B:'#695246',l:'#b9c3c0',L:'#e0dfce',g:'#8b8e99',G:'#5b6072',r:'#997150',R:'#c7a46b',v:'#a799c9',V:'#716a97',y:'#f1c674',Y:'#e9e0af'};
const sprites={
  pip:[
    '....hhhhhhh.....','...hhHHHHHhh....','...hhHHHHHHh....','....sSSSShh.....','....seSSehs.....','....sSSSSs......','.....sss........','...ccAAAcc......','..cccaAaAcc.....','..sccaAaAcs.....','..sccaAaAcs.....','...cAAAAAc......','....AAAAA.......','....bb.bb.......','....bb.bb.......','...BBB.BBB......'
  ],
  pip_up:[
    '....hhhhhhh.....','...hhHHHHHhh....','...hhHHHHHHh....','....hhhhhhh.....','....hhHHHhh.....','....shhhhs......','.....sss........','...ccAcAcc......','..cccAcAccc.....','..sccAcAccs.....','..sccAcAccs.....','...ccccccc......','....ccccc.......','....bb.bb.......','....bb.bb.......','...BBB.BBB......'
  ],
  pip_side:[
    '....hhhhhhh.....','...hhHHHHHhh....','...hHHHHHHhh....','....hhSSSs......','....hhSSeSs.....','....hsSSSSs.....','.....ssss.......','....cccAAc......','...ccccAAcs.....','...ccccAAcs.....','...ccccAAc......','....ccAAAc......','....AAAAA.......','....bb.bb.......','....bb.bb.......','...BBB.BBB......'
  ],
  knight:[
    '.....oooooo.....','....oLLLLllo....','....ollllllo....','....ohseSsho....','....ohSSSSho....','.....ossss......','...ccLLLllcc....','..ccLLlllllcc...','..ccLlLLllLcc...','..scLLllllLcs...','..scLLLLLLLcs...','...ccGGGGcc.....','....GGGGG.......','....GG.GG.......','....ll.ll.......','...LLL.LLL......'
  ],
  portrait:[
    'RRRRRRRRRRRRRRRRRRRR','RYYYYYYYYYYYYYYYYYYR','RY...LL....hh....vvYR','RY..LeL...hssh...vVYR','RY..LLL...sees...vVYR','RY...L.....ss...vvYR','RY..LLL...cAAc..vvYR','RY..L.L...cAAc..vVYR','RY..L.L...AAAA..vvYR','RY...L....b..b..vvYR','RYYYYYYYYYYYYYYYYYYR','RRRRRRRRRRRRRRRRRRRR'
  ],
  dragon:[
    '..VV......................VV..','..VvV.......HHHH.........VvV..','.VvvvV.....hHHHHh.......VvvvV.','.VvvvvV....vYvvYv......VvvvvV.','VvvvvvvV...vvvvvvv.....VvvvvvvV','VvVVvvvvV..vYvvYv....VvvvvVVvV','VV..VvvvvV..vvYvv...VvvvvV..VV','....VvvvvVVvvvvvvVVvvvvV......','.....VVvvvvvvvvvvvvvvVV.......','.......VVvvvvvvvvvvVV.........','........vvvvvvvvvvvv..........','.......vvvvvvYYvvvvvv.........','.......vVvvvYYYYvvvVv.........','......vvVvvvYYYYvvvVvv........','.....vvvVvvvvYYvvvvVvvv.......','....vvvvVvvvvvvvvvvVvvvv......','...vvvvvVVvvvvvvvvVVvvvvv.....','..vvvvvV..VVvvvvVV..Vvvvvv....','..vvvVV....VVvvVV....VVvvv....','.vvVV......vVvvVv......VVvv...','VV.........VV..VV.........VV..'
  ],
  collector:[
    '.......rrrrrr.......','......rRRRRRRr......','.....rrRRRRRRrr.....','....rrrrrrrrrrrr....','......hSSSShh.......','......seSSehs.......','......sSSSSss.......','.......sHHs.........','.....VVYYYYVV.......','....VvVYvvYVvV......','...VvvVYvvYVvvV.....','...svvVYYYYVvvs.....','...svvVvvvvVvvs.....','....vvVvvvvVvv......','....vVVvvvvVVv......','....vVvvvvvvVv......','....VVvvvvvvVV......','.....GGGGGGGG.......','.....GGG..GGG.......','.....GGG..GGG.......','....BBBB..BBBB......','....BBBB..BBBB......'
  ],
  guard:[
    '.....oooooo.....','....oLLllllo....','....ollllllo....','....olGeGllo....','....ollllllo....','.....oGGGGo.....','...oollllGoo....','..olLllllllGo...','.ollllllllGllo..','.oGlLLllGGlGlo..','..oGllGlGllGo...','...ollllllGo....','....oGGGGo......','....oG..Go......','...oll..llo.....','...ooo..ooo.....'
  ],
  practice:[
    '.....rrrrr......','....rRRRRRr.....','....rReReRr.....','....rRRRRRr.....','.....rrrrr......','...ggGggGgg.....','..glLLllLLlg....','..glLlGGlLlg....','..rgllllllgr....','..rGggggggGr....','....gggggg......','......rr........','......rr........','......rr........','....rrrrrr......','...rrrrrrrr.....'
  ],
  skeleton:[
    '....ooooooo.....','...oLLLLLLLo....','...oLeLLeLLo....','...oLLLLLLLo....','....oLeLeLo.....','.....ooooo......','...LLLoooLLL....','..Lo.LoLo.LoL...','..Lo.LLLL.LoL...','..Lo.LoLo.LoL...','...o.LLLL.o.....','.....oLLo.......','.....L.LL.......','.....L..L.......','....LL..LL......','....LL..LL......'
  ],
  spider:[
    '......vvv.......','.....vYYYv......','...oovvvvvvoo...','..o.vvVVVVvv.o..','.o.vVvYvvYvVv.o.','.o.vVVVVVVVVv.o.','..o.vVVVVVVv.o..','..o..vvvvvv..o..','.o..o......o..o.','o..o........o..o','..o..........o..'
  ],
  boss:[
    '........yyyy........','.......yYYYYy.......','.....ooooYYoooo.....','....oLLLLLLLLLLo....','....oLllllllllLo....','....oLGeGeGeGlLo....','....oLllllllllLo....','.....oGGGGGGGGo.....','...ooLLLLLLGGGGoo...','..olLLLllllllGGGGo..','.olLLllGggGllGGGGlo.','.olLLllgYYGllGGGGlo.','.olLLllgYYGllGGGGlo.','.oGGlllGggGllllGGlo.','..oGllllllllllGGGo..','...oGllllllllGGGo...','....oGGGGGGGGGGo....','....oGGGo..oGGGo....','....oGGGo..oGGGo....','...olLLlo..olLLlo...','...olLLlo..olLLlo...','...oooooo..oooooo...'
  ]
};
export function sprite(ctx,kind,x,y,{scale=1,flash=false,flip=false,step=0}={}){
  const rows=sprites[kind]||sprites.guard,w=rows[0].length,h=rows.length;
  ctx.save();ctx.translate(Math.round(x),Math.round(y));if(flip)ctx.scale(-1,1);
  const startX=-Math.floor(w/2),startY=-h;
  for(let row=0;row<h;row++)for(let col=0;col<rows[row].length;col++){
    const color=P[rows[row][col]];if(!color)continue;ctx.fillStyle=flash?'#f5e6bc':color;
    const legOffset=kind.startsWith('pip')&&row>12?((col<8?1:-1)*step):0;
    ctx.fillRect((startX+col)*scale,(startY+row)*scale+legOffset,scale,scale);
  }ctx.restore();
}
function block(c,color,x,y,w,h){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);}
function shadow(c,x,y,w=20,h=6){c.fillStyle='#12272b55';c.fillRect(x-w/2,y-2,w,h);}
function pixelLine(c,color,x1,y1,x2,y2,width=1){
  const steps=Math.max(1,Math.ceil(Math.max(Math.abs(x2-x1),Math.abs(y2-y1))));
  for(let i=0;i<=steps;i++)block(c,color,x1+(x2-x1)*i/steps-width/2,y1+(y2-y1)*i/steps-width/2,width,width);
}
function blade(c,x,y,angle,{length=20,color='#d8ddda',hand=true}={}){
  const dx=Math.cos(angle),dy=Math.sin(angle),px=-dy,py=dx;
  pixelLine(c,'#414b4c',x+dx*4,y+dy*4,x+dx*(length-2),y+dy*(length-2),3);
  pixelLine(c,color,x+dx*4,y+dy*4,x+dx*length,y+dy*length,2);
  pixelLine(c,'#f2eee0',x+dx*4+px,y+dy*4+py,x+dx*(length-4)+px,y+dy*(length-4)+py,1);
  pixelLine(c,'#baa071',x+dx*3-px*4,y+dy*3-py*4,x+dx*3+px*4,y+dy*3+py*4,2);
  pixelLine(c,'#856446',x-dx*3,y-dy*3,x+dx*2,y+dy*2,2);
  if(hand)block(c,'#e9bc92',x-1,y-1,3,3);
}
export function drawObject(c,o,time=0){
  const x=Math.round(o.x),y=Math.round(o.y);
  if(o.kind==='tree'){
    shadow(c,x,y+2,33,7);block(c,'#413b32',x-4,y-20,8,23);block(c,'#786047',x-1,y-21,3,20);
    block(c,'#1d3434',x-21,y-34,42,20);block(c,'#264438',x-27,y-48,54,22);block(c,'#34533c',x-23,y-61,46,29);block(c,'#426747',x-16,y-68,32,29);
    block(c,'#52764a',x-8,y-65,20,10);block(c,'#567c4b',x-20,y-48,13,9);block(c,'#60864d',x+4,y-51,11,6);block(c,'#2c4939',x+12,y-40,12,13);block(c,'#284235',x-15,y-29,30,12);
    for(let i=0;i<14;i++){const tx=x-20+noise(i,x)*40,ty=y-57+noise(i,y)*34;block(c,i%2?'#648750':'#3d5c3f',tx,ty,3,2);}
  }else if(o.kind==='bush'){
    shadow(c,x,y,19,4);block(c,'#284537',x-10,y-9,20,9);block(c,'#507447',x-7,y-13,14,9);block(c,'#6c9156',x-5,y-11,5,3);block(c,'#d0a66e',x+4,y-6,2,2);
  }else if(o.kind==='mushroom'){
    block(c,'#c9bea3',x-1,y-5,2,6);block(c,'#b87566',x-5,y-7,10,4);block(c,'#d59277',x-3,y-10,6,5);block(c,'#f1cbb1',x-2,y-8,2,2);block(c,'#f1cbb1',x+2,y-6,2,2);
  }else if(o.kind==='house'){
    shadow(c,x+64,y+98,140,9);block(c,'#50473a',x,y+22,128,76);block(c,'#a58b62',x+5,y+27,118,66);
    for(let i=0;i<4;i++)block(c,'#c4aa78',x+7,y+29+i*16,114,2);
    block(c,'#514b3d',x+3,y+31,5,62);block(c,'#514b3d',x+61,y+29,6,64);block(c,'#514b3d',x+118,y+31,5,62);
    block(c,'#503e3d',x-8,y+3,144,28);block(c,'#704844',x-5,y-7,138,27);block(c,'#955952',x+6,y-17,117,25);block(c,'#b06858',x+18,y-25,92,17);block(c,'#bc8062',x+29,y-32,70,12);
    for(let i=0;i<7;i++){block(c,'#cc8d67',x+18+i*13,y-22,9,2);block(c,'#a06752',x+i*18,y+7,15,3);}
    block(c,'#74604c',x+99,y-35,12,19);block(c,'#b59b78',x+97,y-38,16,5);
    for(const wx of [x+18,x+87]){block(c,'#403a35',wx,y+39,25,23);block(c,'#efc270',wx+3,y+42,19,17);block(c,'#f9dba1',wx+5,y+44,6,7);block(c,'#7f654c',wx+11,y+41,3,19);block(c,'#7f654c',wx+2,y+50,21,2);block(c,'#3e583f',wx-3,y+63,31,5);block(c,'#80a460',wx,y+60,6,4);block(c,'#d78e77',wx+18,y+59,3,4);}
    block(c,'#584339',x+48,y+54,30,43);block(c,'#342f2d',x+53,y+58,20,39);block(c,'#806149',x+55,y+60,17,37);block(c,'#e9bf72',x+67,y+79,2,2);block(c,'#b8ab88',x+43,y+95,41,5);
    block(c,'#35544a',x+35,y+31,60,15);block(c,'#e2d4a0',x+35,y+31,60,1);c.font='6px Silkscreen';c.textAlign='center';c.fillStyle='#e9dcb0';c.fillText('FAMILY GOODS',x+65,y+41);
  }else if(o.kind==='sign'){
    block(c,'#6f5742',x-2,y-11,4,13);block(c,'#b49c6c',x-13,y-20,26,13);block(c,'#e1cca0',x-11,y-18,22,2);c.fillStyle='#423f31';c.font='5px Silkscreen';c.textAlign='center';c.fillText('CRYPT',x,y-11);
  }else if(o.kind==='cart'){
    block(c,'#382f2d',x-13,y-2,6,7);block(c,'#382f2d',x+9,y-2,6,7);block(c,'#a78353',x-17,y-16,34,16);block(c,'#c7a775',x-15,y-14,30,3);block(c,'#6c5140',x-12,y-9,23,2);block(c,'#6c8b58',x-7,y-21,9,7);block(c,'#d19268',x+4,y-21,7,7);
  }else if(o.kind==='lantern'||o.kind==='torch'){
    block(c,'#60513d',x-1,y-20,3,21);block(c,'#453c34',x-5,y-29,11,12);block(c,'#e6b967',x-3,y-27,7,8);block(c,'#f8dfa5',x-1,y-26,3,5+Math.round(Math.sin(time*7+x)));block(c,'#89734d',x-5,y-30,11,2);
  }else if(o.kind==='ruin'||o.kind==='pillar'){
    shadow(c,x,y,31,8);block(c,'#373e42',x-12,y-35,24,38);block(c,'#6c7471',x-9,y-36,19,33);block(c,'#90948a',x-9,y-36,5,31);block(c,'#a4a48d',x-14,y-41,28,7);block(c,'#555e5b',x-15,y-1,30,5);
    if(o.kind==='ruin'){block(c,'#475e47',x-14,y-41,17,3);block(c,'#5e7a52',x-11,y-34,5,10);block(c,'#4b634a',x+4,y-17,7,11);}
  }else if(o.kind==='crystal'){
    shadow(c,x,y,27,5);block(c,'#87555e',x-9,y-15,18,15);block(c,'#be8f9c',x-4,y-24,8,24);block(c,'#ecd0c3',x-3,y-24,2,18);block(c,'#ac7180',x+6,y-12,6,12);block(c,'#ebc79d',x+7,y-12,2,9);block(c,'#d9b184',x-6,y+1,16,2);
  }else if(o.kind==='tomb'){
    shadow(c,x,y,37,6);block(c,'#272d38',x-18,y-9,36,12);block(c,'#636371',x-17,y-22,34,17);block(c,'#85818a',x-14,y-26,28,14);block(c,'#a4a092',x-14,y-26,28,3);block(c,'#c2b69d',x-2,y-23,4,11);block(c,'#c2b69d',x-6,y-20,12,3);
  }
}
export function drawChest(c,chest,time=0){
  const x=Math.round(chest.x),y=Math.round(chest.y);shadow(c,x,y,25,6);
  const color=chest.type==='gold'?['#a17638','#e6bf6d','#f8dd90']:chest.type==='iron'?['#515965','#889293','#bcc2ae']:['#76523c','#b88753','#ddb57a'];
  block(c,'#2b292c',x-11,y-16,22,18);block(c,color[0],x-10,y-14,20,15);block(c,color[1],x-10,y-15,20,chest.opened?4:7);
  if(chest.opened){block(c,'#202c2b',x-8,y-8,16,6);block(c,color[2],x-11,y-22,22,5);block(c,color[0],x-11,y-17,22,2);}
  else{block(c,color[2],x-10,y-15,20,2);block(c,color[2],x-7,y-15,2,16);block(c,color[2],x+5,y-15,2,16);block(c,'#e1b566',x-2,y-7,4,5);block(c,'#4d4437',x-1,y-6,2,2);
    if(chest.type==='gold'){const a=Math.round(Math.sin(time*3)*2);block(c,'#fff0b5',x+12,y-22+a,1,5);block(c,'#fff0b5',x+10,y-20+a,5,1);}
  }
}
export function drawGate(c,gate,areaId){
  const x=gate.x,y=gate.y;block(c,'#232f30',x-22,y-38,44,47);block(c,areaId==='crypt'?'#66636e':'#777c65',x-27,y-35,10,44);block(c,'#999a7b',x-27,y-35,3,43);block(c,'#777c65',x+17,y-35,10,44);block(c,'#777c65',x-23,y-44,46,10);block(c,'#a2a28b',x-17,y-50,34,8);block(c,'#30483c',x-27,y+6,54,4);
  for(const lx of [x-33,x+33])drawObject(c,{kind:'lantern',x:lx,y:y+1},0);
}
export function groundCanvas(area){
  const c=document.createElement('canvas');c.width=WIDTH;c.height=HEIGHT;const ctx=c.getContext('2d');
  const stone=area.ground==='stone';
  for(let ty=0;ty<ROWS;ty++)for(let tx=0;tx<COLS;tx++){
    const n=noise(tx,ty,area.id==='hollow'?1:2),x=tx*TILE,y=ty*TILE;
    const path=stone?false:Math.abs(x+8-(352+Math.sin(ty*.3)*18))<(area.id==='hollow'?48:33)||(area.id==='hollow'&&tx>10&&tx<24&&ty>16&&ty<22);
    block(ctx,path?['#8f8260','#9c8c66','#aa9770'][Math.floor(n*3)]:area.palette[Math.floor(n*3)],x,y,16,16);
    if(stone){block(ctx,'#2b303b',x,y+15,16,1);block(ctx,'#2f333e',x+15,y,1,16);if(n>.78)block(ctx,'#77726e',x+3,y+3,5,1);}
    else if(path){block(ctx,'#b5a47a',x+2,y+2,3,1);if(n>.65){block(ctx,'#746f52',x+8,y+9,3,2);block(ctx,'#b4a37a',x+9,y+9,2,1);}}
    else{for(let i=0;i<4;i++){const gx=x+Math.floor(noise(i,tx+ty,2)*13),gy=y+Math.floor(noise(i,ty+tx,5)*13);block(ctx,n>.6?'#73945d':'#537251',gx,gy,1,3);block(ctx,'#486547',gx+1,gy+1,2,1);}if(n>.92){block(ctx,'#ceae79',x+7,y+7,2,2);block(ctx,'#c48474',x+10,y+6,2,2);}}
    if(tx<2||tx>41||ty<2||ty>27){block(ctx,stone?'#222a32':'#203932',x,y,16,16);if(!stone&&n>.4)block(ctx,'#355340',x+3,y+2,8,8);}
  }
  if(area.id==='hollow'){
    for(let y=224;y<393;y+=8)for(let x=45;x<170;x+=8){const edge=Math.sin(y*.08)*7;if(x>49+edge&&x<166-edge){block(ctx,'#466b6c',x,y,8,8);if(x<59+edge||x>156-edge||y<233||y>383)block(ctx,'#5d887b',x,y,8,8);else if(noise(x,y)>.72)block(ctx,'#79a59a',x+1,y+4,5,1);}}
    block(ctx,'#786348',152,299,70,24);for(let i=0;i<8;i++){block(ctx,'#b29867',154+i*8,300,6,23);block(ctx,'#786346',154+i*8,302,1,19);}block(ctx,'#514c35',152,296,70,3);block(ctx,'#514c35',152,322,70,3);
    for(const [x,y] of [[205,345],[488,361],[447,255]]){block(ctx,'#77765c',x,y,10,6);block(ctx,'#b0a582',x+2,y,7,2);}
  }
  if(stone){
    block(ctx,'#283039',24,24,134,432);block(ctx,'#283039',547,24,133,432);
    for(let y=24;y<456;y+=24){block(ctx,'#50515f',140,y,18,22);block(ctx,'#797583',140,y,3,22);block(ctx,'#50515f',547,y,18,22);block(ctx,'#797583',547,y,3,22);}
    block(ctx,'#50515f',158,24,389,15);block(ctx,'#797583',158,24,389,3);
    block(ctx,'#67514f',310,97,84,265);block(ctx,'#997c62',310,97,2,265);block(ctx,'#997c62',392,97,2,265);
    for(let y=101;y<362;y+=8){block(ctx,'#745c52',313,y,78,1);if(y%3===0){block(ctx,'#947553',316,y,4,3);block(ctx,'#947553',385,y,4,3);}}
  }
  return c;
}
export function itemIcon(canvas,id){
  const c=canvas.getContext('2d');c.clearRect(0,0,24,24);const s=(color,x,y,w,h)=>block(c,color,x,y,w,h);
  if(['sword','blade','weapon'].includes(id)){s('#453c39',4,18,3,3);s('#85643d',6,15,4,5);s(id==='blade'?'#b195ca':'#c0c0ae',9,5,3,12);s(id==='blade'?'#ecd8fa':'#eeead7',12,4,3,11);s('#826440',5,14,12,3);s('#ecd193',9,15,3,2);}
  else if(id==='potion'){s('#bba984',10,2,5,3);s('#dbc7a5',9,5,6,5);s('#788e83',6,10,12,11);s('#bd6b66',8,13,8,6);s('#edaa96',8,13,3,3);s('#e4d7b5',7,11,2,5);}
  else if(id==='coins'){s('#a97b35',6,7,14,12);s('#dfb35d',5,5,13,12);s('#f5d28b',7,6,8,2);s('#a97b35',10,8,3,6);}
  else if(id==='boots'){s('#654b7a',5,7,6,9);s('#ad8cc3',6,5,5,9);s('#ad8cc3',5,14,13,5);s('#e7d0ee',5,18,15,2);}
  else if(id==='pendant'){s('#ba9758',7,3,2,8);s('#ba9758',15,3,2,8);s('#f1ce7e',7,11,10,7);s('#ae92c5',9,12,6,5);s('#ecd7f3',10,12,2,2);}
  else if(id==='sock'){s('#d0c2a0',9,4,7,12);s('#846b52',9,5,7,3);s('#d0c2a0',5,14,11,5);s('#9e8762',5,17,11,3);}
  else if(id==='potato'){s('#ae8b59',5,8,14,10);s('#c3a16b',7,5,10,14);s('#7f6245',8,10,2,2);s('#69824d',13,7,3,4);s('#7f6245',14,15,2,2);}
  else if(id==='rock'){s('#777979',5,9,14,10);s('#a3a092',8,6,9,10);s('#c8bea3',9,7,4,2);}
  else{s('#7e7766',5,14,14,3);s('#9b9481',8,7,4,12);s('#b6a98c',8,7,5,3);s('#775841',5,18,7,3);}
}
export function drawWorld(ctx,game,camera,background,{reducedMotion=false,input={}}={}){
  ctx.imageSmoothingEnabled=false;
  const shake=reducedMotion?0:game.shake;
  ctx.save();ctx.translate(-Math.round(camera.x)+(shake?Math.round(Math.sin(game.time*90)*shake):0),-Math.round(camera.y));ctx.drawImage(background,0,0);
  for(const gate of game.exits)drawGate(ctx,gate,game.area.id);
  if(game.area.id==='hollow'){
    for(let i=0;i<8;i++){const x=61+i*12,y=247+((i*19)%124);block(ctx,'#80b0a5',x+Math.sin(game.time+i)*3,y,6,1);}
  }
  const entities=[...game.area.objects.map(o=>({...o,sortY:o.kind==='house'?o.y+o.h:o.y,draw:()=>drawObject(ctx,o,game.time)})),...game.area.chests.map(o=>({...o,sortY:o.y,draw:()=>drawChest(ctx,o,game.time)})),...game.area.npcs.map(n=>({...n,sortY:n.y,draw:()=>{
    shadow(ctx,n.x,n.y,n.kind==='dragon'?48:20,5);sprite(ctx,n.kind,n.x,n.y,{scale:n.kind==='dragon'?1.6:1});
    if(n.id==='uncle'&&!game.defeated.has('warden')){block(ctx,'#69717e',n.x-14,n.y-25,28,2);for(let i=0;i<5;i++)block(ctx,'#848b91',n.x-12+i*6,n.y-25,2,28);}
    if(n.id==='uncle'&&game.defeated.has('warden')){block(ctx,'#f7d78d',n.x-1,n.y-31+Math.sin(game.time*3),2,6);block(ctx,'#f7d78d',n.x-1,n.y-23+Math.sin(game.time*3),2,2);}
    if(n.id==='ally'&&n.swingTime){const face=n.attackFacing,angle=Math.atan2(face.y,face.x);blade(ctx,n.x+face.x*4,n.y-8+face.y*4,angle-1+(1-n.swingTime/.25)*1.8,{length:22});}
  }})),...game.area.enemies.map(e=>({...e,sortY:e.y,draw:()=>{
    if(e.dormant)return;
    if(e.dead){block(ctx,'#66746b',e.x-5,e.y-3,9,4);block(ctx,'#9a9d85',e.x-3,e.y-3,3,2);return;}
    shadow(ctx,e.x,e.y,e.kind==='boss'?33:22,6);sprite(ctx,e.id==='collector'?'collector':e.kind,e.x,e.y,{scale:e.kind==='boss'?1.5:1,flash:!!e.flash,flip:game.player.x<e.x});
    if(e.windup||e.swingTime){
      const face=e.attackFacing,angle=Math.atan2(face.y,face.x),radius=e.kind==='boss'?38:28;
      if(e.windup){ctx.strokeStyle='#d78670';ctx.lineWidth=1;ctx.beginPath();ctx.arc(e.x,e.y,radius,angle-.65,angle+.65);ctx.stroke();blade(ctx,e.x+Math.cos(angle-1.2)*6,e.y-8+Math.sin(angle-1.2)*6,angle-1.2,{length:e.kind==='boss'?29:21,hand:false});}
      else{const progress=1-e.swingTime/.18;blade(ctx,e.x+face.x*4,e.y-8+face.y*4,angle-1+progress*1.8,{length:e.kind==='boss'?29:21,hand:false});}
    }
    if(e.hp<e.maxHp||e.kind==='boss'){const w=e.kind==='boss'?42:24;block(ctx,'#252b2d',e.x-w/2,e.y-(e.kind==='boss'?40:23),w,4);block(ctx,e.kind==='boss'?'#cf8972':'#b5c396',e.x-w/2+1,e.y-(e.kind==='boss'?39:22),Math.round((w-2)*e.hp/e.maxHp),2);}
  }}))];
  const p=game.player;
  entities.push({sortY:p.y,draw:()=>{
    shadow(ctx,p.x,p.y,16,5);
    if(game.stage>=2){const orbit=game.time*2;block(ctx,'#f2d995',p.x+Math.cos(orbit)*13,p.y-11+Math.sin(orbit)*8,2,2);}
    const moving=input.up||input.down||input.left||input.right;const step=moving?Math.round(Math.sin(game.time*15)):0;
    const face=p.attackTime?p.attackFacing:p.facing,angle=Math.atan2(face.y,face.x),up=face.y<-.5,side=Math.abs(face.x)>.5;
    const elapsed=SWORD_SWING.duration-p.attackTime;
    const strike=p.attackTime&&elapsed>=SWORD_SWING.windup&&elapsed<SWORD_SWING.activeUntil;
    const lean=strike?1:0,bx=p.x+face.x*lean,by=p.y+face.y*lean;
    const drawSword=()=>{
      if(p.attackTime){
        let offset;
        if(elapsed<SWORD_SWING.windup)offset=-.75-.35*elapsed/SWORD_SWING.windup;
        else if(elapsed<SWORD_SWING.activeUntil){const t=(elapsed-SWORD_SWING.windup)/(SWORD_SWING.activeUntil-SWORD_SWING.windup);offset=-1.1+1.9*(1-Math.pow(1-t,2));}
        else{const t=(elapsed-SWORD_SWING.activeUntil)/(SWORD_SWING.duration-SWORD_SWING.activeUntil);offset=.8+.35*t;}
        const hx=bx-face.y*4+face.x*2,hy=by-8+face.x*4+face.y*2;
        if(strike&&!reducedMotion){ctx.globalAlpha=.25;blade(ctx,hx,hy,angle+offset-.2,{color:'#f3e2bc',hand:false});ctx.globalAlpha=1;}
        blade(ctx,hx,hy,angle+offset,{color:p.weapon>=12?'#d2b6e4':'#d8ddda'});
      }else{
        const handX=bx+(face.x<0?-5:5),handY=by-7;
        blade(ctx,handX,handY,up?-Math.PI/2+.25:side?angle+.85:Math.PI/2-.3,{length:15,color:p.weapon>=12?'#d2b6e4':'#c9cbb8'});
      }
    };
    if(up)drawSword();
    sprite(ctx,up?'pip_up':side?'pip_side':'pip',bx,by,{flip:side&&face.x<0,step:p.attackTime?0:step,flash:p.hurtFlash>0});
    if(!up)drawSword();
  }});
  entities.sort((a,b)=>a.sortY-b.sortY).forEach(e=>e.draw());
  for(const e of game.effects){
    const progress=1-e.life/e.maxLife;
    if(e.kind==='number'){ctx.font='8px Silkscreen';ctx.fillStyle=e.color;ctx.textAlign='center';ctx.fillText(e.text,e.x,e.y-progress*15);}
    else{ctx.globalAlpha=1-progress;ctx.strokeStyle=e.kind==='enemy-swing'?'#d58370':'#f6d68a';ctx.lineWidth=e.kind==='unlock'?3:2;ctx.beginPath();ctx.arc(e.x,e.y-6,e.r*progress,0,Math.PI*2);ctx.stroke();if(e.kind==='power'||e.kind==='unlock'){for(let i=0;i<12;i++){const a=i*Math.PI/6;block(ctx,'#f4dea1',e.x+Math.cos(a)*e.r*progress,e.y-6+Math.sin(a)*e.r*progress,3,3);}}ctx.globalAlpha=1;}
  }
  for(const p of game.particles){ctx.globalAlpha=Math.min(1,p.life*3);block(ctx,p.color,p.x,p.y,p.size,p.size);}ctx.globalAlpha=1;
  // Dusk insects stay anchored to the world, rather than flashing over the UI.
  if(game.area.id!=='crypt')for(let i=0;i<14;i++){const x=230+noise(i,8)*300+Math.sin(game.time*.5+i)*12,y=90+noise(i,9)*320+Math.cos(game.time*.6+i)*7;ctx.globalAlpha=.4+Math.sin(game.time*1.5+i)*.25;block(ctx,'#f2d986',x,y,1,1);}ctx.globalAlpha=1;
  ctx.restore();
}
