// Each region has a different landscape and route, not a palette-swapped carpet.
export const REGION_STYLES={moss:'overgrown-road',crypt:'buried-prison',thorn:'thornwood',tower:'library',ember:'treasure-cave',workyard:'salvage-yard',foundry:'lava-foundry',rootgrove:'root-cathedral',weaverhall:'silk-canopy',stormshore:'beach',beacon:'lighthouse',starpass:'meteor-craters',starvault:'observatory',heartgate:'brass-lock',heartcore:'living-heart',skythreshold:'frozen-island',oathtribunal:'tribunal',sunforge:'solar-island',mooncourt:'moon-pools',exilearchive:'floating-library',crownsummit:'cloud-palace'};
const b=(c,col,x,y,w,h)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h);};
function line(c,col,x,y,xx,yy,w=1){const n=Math.max(1,Math.ceil(Math.max(Math.abs(xx-x),Math.abs(yy-y))));for(let i=0;i<=n;i++)b(c,col,x+(xx-x)*i/n,y+(yy-y)*i/n,w,w);}
function disk(c,col,x,y,r){for(let yy=-r;yy<=r;yy++){const w=Math.floor(Math.sqrt(r*r-yy*yy));b(c,col,x-w,y+yy,w*2,1);}}
function circle(c,col,x,y,r){for(let i=0;i<120;i++){const a=i*Math.PI/60;b(c,col,x+Math.cos(a)*r,y+Math.sin(a)*r,2,2);}}
function bookcase(c,x,y){b(c,'#312d43',x,y,55,34);for(let row=0;row<2;row++){b(c,'#b49875',x,y+row*18,55,3);for(let i=0;i<7;i++)b(c,['#9e7a82','#8bbaa9','#d3b788'][i%3],x+4+i*7,y+4+row*18,4,12);}}
function crystal(c,x,y,col){for(let yy=0;yy<45;yy++){const w=yy<15?Math.floor(yy*.5):yy>34?Math.floor((45-yy)*.8):8;b(c,'#30577e',x-w,y+yy,w*2+1,1);b(c,col,x-w,y+yy,w,1);}line(c,'#e8f9f7',x,y+3,x,y+37,1);}
function clouds(c,noise){for(let i=0;i<18;i++){const x=noise(i,9)*704,y=noise(i,7)*480;b(c,'#293854',x-38,y,76,10);b(c,'#435570',x-24,y-6,49,12);b(c,'#6f7c9a',x-11,y-10,24,5);}}
export function paintRegionGround(c,a,noise){
 if(!REGION_STYLES[a.id])return;
 const indoor=a.ground==='stone',frost=a.id==='skythreshold',sky=['skythreshold','sunforge','crownsummit'].includes(a.id),pal=a.palette;
 b(c,sky?'#172540':indoor?'#1b252f':pal[0],24,24,656,432);
 if(sky){clouds(c,noise);b(c,frost?'#43658a':'#515771',158,39,388,417);}
 else if(indoor)b(c,pal[0],158,39,388,417);
 for(let y=40;y<455;y+=8)for(let x=indoor?160:32;x<(indoor?546:675);x+=8){const n=noise(x,y,a.id.length);b(c,pal[Math.floor(n*3)],x,y,8,8);if(n>.88)b(c,pal[3],x+2,y+2,2,1);}
 // Walkable central routes use different materials and arrangements.
 if(['moss','thorn','workyard','rootgrove','stormshore','starpass'].includes(a.id)){
  for(let y=40;y<453;y+=8){const bend=a.id==='thorn'?Math.sin(y*.015)*45:a.id==='rootgrove'?Math.sin(y*.021)*32:Math.sin(y*.012)*18;const x=352+bend;b(c,a.id==='stormshore'?'#cfb688':a.id==='workyard'?'#776a5c':'#8c8967',x-28,y,56,8);if(y%24===0)b(c,'#b6aa83',x-17,y,32,2);}
 }
 switch(a.id){
 case 'moss':for(const s of [-1,1]){line(c,'#476347',352+s*78,70,352+s*42,402,12);for(let i=0;i<9;i++){b(c,'#82946c',352+s*80,i*40+47,19,8);}}break;
 case 'crypt':for(const x of [172,466])for(const y of [78,188,303]){b(c,'#171f2b',x,y,60,60);b(c,'#647183',x,y,60,4);for(let i=0;i<6;i++)b(c,'#9aa5b5',x+i*10,y+2,2,58);}for(let i=0;i<5;i++){b(c,'#837b66',300+i*22,260,15,4);b(c,'#a1a095',303+i*22,266,10,3);}break;
 case 'thorn':for(const s of [-1,1])for(let i=0;i<13;i++){const x=352+s*(100+i%3*18),y=44+i*31;line(c,'#47403e',x,y,x+s*28,y+26,5);line(c,'#b88c83',x+s*13,y+9,x+s*22,y+3,2);b(c,'#657c59',x-5,y-8,18,14);}break;
 case 'tower':for(const x of [170,473])for(const y of [74,174,280,387])bookcase(c,x,y);b(c,'#836a7b',271,157,161,119);b(c,'#c2ae9f',283,167,137,5);b(c,'#272c43',341,171,22,91);for(let i=0;i<7;i++)b(c,'#a1968c',291,185+i*11,41,2);break;
 case 'ember':for(const x of [160,473])for(let y=52;y<440;y+=56){disk(c,'#6c4755',x+25,y+20,23);for(let i=0;i<15;i++)b(c,i%2?'#e3bc68':'#bd874a',x+(i*17)%57,y+(i*13)%37,5,3);}for(const x of [190,510])crystal(c,x,188,'#d797ad');break;
 case 'workyard':for(let i=0;i<14;i++){const x=i%2?465:172,y=65+Math.floor(i/2)*51;b(c,'#453f3c',x,y,54,34);b(c,'#a88660',x+3,y+2,48,4);for(let j=0;j<5;j++){b(c,'#738887',x+3+j*9,y+8+j%2*8,7,15);}}for(const x of [319,385])line(c,'#b49b71',x,40,x,444,3);break;
 case 'foundry':for(const x of [162,470]){b(c,'#7d3938',x,40,70,410);for(let y=46;y<451;y+=13){b(c,'#e48851',x+4,y,62,6);b(c,'#ffd284',x+13,y+1,23,2);}}b(c,'#6f5b4b',229,270,245,34);for(let x=240;x<466;x+=13)b(c,'#bc9162',x,270,3,34);for(const x of [271,433])line(c,'#a68158',x,42,x,440,5);break;
 case 'rootgrove':for(const s of [-1,1]){line(c,'#383e34',352+s*163,62,352+s*78,420,17);line(c,'#776147',352+s*160,68,352+s*80,418,6);for(let i=0;i<8;i++){const x=352+s*(148-i*9),y=83+i*42;line(c,'#4f7351',x,y,x+s*55,y+18,9);b(c,'#a5c47b',x+s*25,y+5,18,12);}}disk(c,'#50715a',352,220,70);circle(c,'#9cbe78',352,220,62);break;
 case 'weaverhall':for(const x of [174,516])for(let y=51;y<437;y+=58){line(c,'#b8a7cf',x,y,352,y+44);line(c,'#7f779e',x,y+15,352,y+53);}for(let x=215;x<508;x+=29)line(c,'#a89abd',x,62,352,375,1);b(c,'#574963',268,220,168,34);for(let x=273;x<435;x+=9)b(c,'#d4badc',x,220,2,34);break;
 case 'stormshore':for(let x=30;x<265;x+=8)for(let y=35;y<453;y+=8){b(c,x>235?'#bbc497':'#3a7185',x,y,8,8);if((x+y)%40===0)b(c,'#9dccc9',x,y,7,1);}for(const [x,y] of [[460,90],[485,310],[202,228]]){b(c,'#715643',x,y,47,25);b(c,'#b2916a',x+6,y+3,36,5);line(c,'#ccb582',x+22,y-34,x+22,y+15,2);line(c,'#e3dcc1',x+22,y-32,x+40,y-12,3);}break;
 case 'beacon':disk(c,'#25394f',352,246,166);disk(c,'#566a85',352,246,147);for(let i=0;i<9;i++){circle(c,'#8799b0',352,246,45+i*12);}b(c,'#b2c6d1',342,85,20,66);b(c,'#dae5d4',345,88,6,58);line(c,'#dccb89',352,152,270,375,3);line(c,'#dccb89',352,152,434,375,3);break;
 case 'starpass':for(const [x,y,r] of [[207,116,49],[466,338,46],[470,85,30],[226,359,29]]){disk(c,'#262e46',x,y,r);circle(c,'#786c81',x,y,r);disk(c,'#a88691',x+5,y-3,r/3|0);crystal(c,x+4,y-24,'#debfad');}break;
 case 'starvault':for(let i=0;i<100;i++){const x=170+noise(i,8)*362,y=44+noise(i,5)*400;b(c,'#c4c4e7',x,y,i%8?1:3,1);}for(const r of [65,100,146])circle(c,'#8f91c0',352,243,r);for(const x of [198,503])crystal(c,x,170,'#afbce9');break;
 case 'heartgate':for(const x of [174,466]){b(c,'#644c44',x,47,64,388);for(let y=52;y<432;y+=24){b(c,'#a78858',x,y,64,4);b(c,'#d3b97e',x+3,y,4,23);}}circle(c,'#c6a476',352,221,98);circle(c,'#826546',352,221,82);for(let i=0;i<12;i++){const a=i*Math.PI/6;b(c,'#d9b482',352+Math.cos(a)*99-5,221+Math.sin(a)*99-5,10,10);}break;
 case 'heartcore':for(let i=0;i<5;i++){const x=185+i*82;line(c,'#a68177',x,426,352,208,3);line(c,'#d5a68e',x+3,426,355,208);}disk(c,'#694f75',352,208,77);circle(c,'#cdb0cc',352,208,76);circle(c,'#f0c9a9',352,208,50);break;
 case 'skythreshold':b(c,'#afcadd',177,53,350,386);for(let y=60;y<440;y+=32){line(c,'#678bab',190,y,320,y+21,2);line(c,'#6f97b2',320,y+21,503,y+5,1);}for(const [x,y] of [[187,120],[501,295],[194,381],[499,68]])crystal(c,x,y,'#dff7ff');for(let i=0;i<28;i++)b(c,'#eefaff',184+(i*39)%335,61+(i*57)%374,3,3);break;
 case 'oathtribunal':disk(c,'#897457',352,232,111);circle(c,'#d8b78b',352,232,110);for(let i=0;i<6;i++){const a=i*Math.PI/3;const x=352+Math.cos(a)*100,y=232+Math.sin(a)*100;b(c,'#4b4248',x-14,y-10,28,21);b(c,'#c8b393',x-11,y-7,22,3);}b(c,'#b89d78',247,76,210,8);break;
 case 'sunforge':for(const x of [161,493]){b(c,'#8e4b3b',x,43,50,408);for(let y=50;y<448;y+=16)b(c,'#f8b46d',x+5,y,40,4);}disk(c,'#b0754c',352,220,105);circle(c,'#f2cd81',352,220,90);for(let i=0;i<16;i++){const a=i*Math.PI/8;line(c,'#edc27f',352+Math.cos(a)*108,220+Math.sin(a)*108,352+Math.cos(a)*130,220+Math.sin(a)*130,3);}break;
 case 'mooncourt':for(const [x,y,r] of [[229,150,54],[476,315,45],[230,387,36],[471,87,29]]){disk(c,'#263f67',x,y,r);circle(c,'#acc6e2',x,y,r);for(let i=0;i<5;i++)b(c,'#7399be',x-19,y-25+i*11,35,1);}for(let y=83;y<426;y+=29)b(c,'#9faecc',316,y,72,14);break;
 case 'exilearchive':for(const x of [170,475])for(const y of [60,153,272,385]){b(c,'#242f48',x-5,y+36,65,7);bookcase(c,x,y);}for(let i=0;i<13;i++){const x=247+(i*31)%205,y=104+(i*47)%259;b(c,'#b7a4d0',x,y,15,9);b(c,'#efe0ea',x+2,y+2,11,5);}line(c,'#ab89c5',352,421,352,95,5);break;
 case 'crownsummit':b(c,'#9c9da9',219,52,266,372);for(let y=62;y<436;y+=25){b(c,'#e6d8bc',229,y,246,3);b(c,'#626786',229,y+3,246,3);}disk(c,'#767487',352,175,99);circle(c,'#e9ce92',352,175,96);for(const x of [180,519]){b(c,'#838ba1',x-10,69,20,350);b(c,'#e5cf98',x-14,65,28,8);b(c,'#e5cf98',x-14,410,28,8);}break;
 }
}
