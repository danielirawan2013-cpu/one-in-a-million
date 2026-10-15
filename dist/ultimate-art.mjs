import {drawShadowProcession} from './shadow-art.mjs?v=0.7.0';
// Distinct compositions and movement for every ultimate; no full-screen flashes.
const px=(c,col,x,y,w=2,h=2)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
function ln(c,col,x,y,xx,yy,w=1){const n=Math.max(1,Math.ceil(Math.max(Math.abs(xx-x),Math.abs(yy-y))));for(let i=0;i<=n;i++)px(c,col,x+(xx-x)*i/n,y+(yy-y)*i/n,w,w);}
function poly(c,col,p){for(let y=Math.ceil(Math.min(...p.map(v=>v[1])));y<=Math.floor(Math.max(...p.map(v=>v[1])));y++){const cuts=[];for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))cuts.push(a[0]+(y-a[1])/(b[1]-a[1])*(b[0]-a[0]));}cuts.sort((a,b)=>a-b);for(let i=0;i+1<cuts.length;i+=2)px(c,col,cuts[i],y,cuts[i+1]-cuts[i]+1,1);}}
function ring(c,col,x,y,r,ellipse=1){for(let i=0;i<80;i++){const a=i*Math.PI/40;px(c,col,x+Math.cos(a)*r,y+Math.sin(a)*r*ellipse,2,2);}}
function star(c,col,x,y,r){ln(c,col,x-r,y,x+r,y,2);ln(c,col,x,y-r,x,y+r,2);px(c,'#fff3cf',x-1,y-1,3,3);}
function moon(c,col,x,y,r,rotation=0){for(let i=0;i<36;i++){const a=-1.7+i*.1+rotation;px(c,col,x+Math.cos(a)*r,y+Math.sin(a)*r,2+Math.sin(i/35*Math.PI)*4,3);}}
function ice(c,col,x,y,h){poly(c,'#365e85',[[x-9,y],[x-6,y-h*.6],[x,y-h],[x+8,y-h*.5],[x+9,y]]);poly(c,col,[[x-6,y],[x,y-h],[x+2,y]]);ln(c,'#f0fcff',x,y-h+4,x,y-5,1);}
function fire(c,col,x,y,h){poly(c,'#8b3a45',[[x-12,y],[x-8,y-h*.5],[x-2,y-h*.35],[x,y-h],[x+8,y-h*.6],[x+12,y]]);poly(c,col,[[x-8,y],[x,y-h*.8],[x+7,y]]);poly(c,'#fff1bc',[[x-3,y],[x,y-h*.4],[x+4,y]]);}
function bolt(c,col,x,y,xx,yy){let a=[x,y];for(let i=1;i<=7;i++){const b=[x+(xx-x)*i/7+(i===7?0:(i%2?5:-5)),y+(yy-y)*i/7];ln(c,col,...a,...b,2);a=b;}}
function beam(c,col,x,y,f,length,width){const s={x:-f.y,y:f.x};poly(c,col,[[x-s.x*width,y-s.y*width],[x+f.x*length-s.x*width*.4,y+f.y*length-s.y*width*.4],[x+f.x*length+s.x*width*.4,y+f.y*length+s.y*width*.4],[x+s.x*width,y+s.y*width]]);ln(c,'#fff8db',x,y,x+f.x*length,y+f.y*length,2);}
function ghost(c,col,x,y,dir={x:0,y:-1}){px(c,col,x-4,y-22,8,8);poly(c,col,[[x-8,y-12],[x+8,y-12],[x+10,y+5],[x+3,y+1],[x,y+5],[x-4,y+1],[x-10,y+5]]);ln(c,'#f1f6ef',x+dir.x*6,y-7+dir.y*6,x+dir.x*32,y-7+dir.y*32,2);}
function chain(c,col,a,b,broken=false){const n=9;for(let i=0;i<n;i++){if(broken&&i===4)continue;const x=a.x+(b.x-a.x)*i/n,y=a.y+(b.y-a.y)*i/n;ring(c,col,x,y,4,i%2?.5:1);}}
function feather(c,col,x,y,side,h){poly(c,col,[[x,y],[x+side*h,y-h*.5],[x+side*h*.65,y+8],[x+side*h*.4,y+2]]);}
export function drawUniqueUltimate(c,game,{reducedMotion=false,drawDragon}={}){
 const s=game.specialScene;if(!s)return false;const key=s.skin,x=s.origin.x,y=s.origin.y-8,col=s.color,white='#fff3d1';
 const t=reducedMotion?.7:s.elapsed/s.duration,q=Math.min(1,t/s.impact),out=Math.max(0,(t-s.impact)/(1-s.impact)),v=reducedMotion?.7:q;
 const f=s.facing,side={x:-f.y,y:f.x},at=(d=0,l=0)=>({x:x+f.x*d+side.x*l,y:y+f.y*d+side.y*l});
 const points=s.targets?.length?s.targets.slice(0,6):[at(70),at(100,-40),at(100,40)];
 c.save();c.globalAlpha=reducedMotion?.7:.86;
 switch(key){
 case 'shadowfangs':drawShadowProcession(c,s,{reducedMotion});break;
 case 'battered':{
  const r=18+v*28;px(c,'#7f6f58',x-r*.5,y-60,r,35);px(c,col,x-r*.5+3,y-58,r-6,23);for(let i=0;i<4;i++)px(c,white,x-r*.5+5+i*r/5,y-62,r/6,10);
  for(let i=0;i<3;i++)ring(c,col,x,y,20+(s.hit?out*120:v*18)+i*12,.6);break;
 }
 case 'ironshort':for(const a of [-.3,.3]){const dir={x:f.x*Math.cos(a)-f.y*Math.sin(a),y:f.x*Math.sin(a)+f.y*Math.cos(a)};beam(c,col,x,y,dir,35+v*150,3);}if(s.hit)beam(c,white,x,y,f,230,5);break;
 case 'classicdawn':{
  const r=30+v*30;poly(c,'#416e62',[[x,y-70],[x+r,y-45],[x+r*.7,y+7],[x,y+35],[x-r*.7,y+7],[x-r,y-45]]);ring(c,col,x,y-16,r);for(const a of [-1,1]){px(c,white,x+a*52-3,y-15,6,22);px(c,white,x+a*52-10,y-8,20,6);}break;
 }
 case 'dawnblade':{const p=at(18);ring(c,col,p.x,p.y,18+v*12);if(s.hit)beam(c,col,p.x,p.y,f,290,22);else for(let i=-2;i<=2;i++){const a=at(35+i*12,i*15);ln(c,col,a.x,a.y,p.x,p.y,2);}break;}
 case 'moonfang':for(let i=0;i<2;i++){const dist=s.hit?(1-out)*170:v*55,p=at(dist,(i?1:-1)*(20+Math.sin(t*Math.PI)*45));moon(c,col,p.x,p.y,24,(i?1:-1)*t*Math.PI*2);}break;
 case 'emberfang':for(let i=0;i<5;i++){const p=at(35+i*35);ln(c,'#6e3037',p.x-side.x*13,p.y-side.y*13,p.x+side.x*13,p.y+side.y*13,4);fire(c,col,p.x,p.y,12+v*(65-i*5));}break;
 case 'frostbite':for(let i=0;i<8;i++){const a=i*Math.PI/4,r=24+(s.hit?out*115:v*35);ice(c,col,x+Math.cos(a)*r,y+Math.sin(a)*r,20+v*35);}ring(c,'#e1f9ff',x,y,48+v*30,.6);break;
 case 'thornheart':for(const p of points){let prev={x,y};for(let i=0;i<16;i++){const k=i/15*v,n={x:x+(p.x-x)*k+Math.sin(i*.8)*7,y:y+(p.y-y)*k};ln(c,col,prev.x,prev.y,n.x,n.y,3);if(i%4===0)feather(c,'#bfd394',n.x,n.y,i%8?-1:1,12);prev=n;}if(s.hit)for(let i=-1;i<=1;i++)ln(c,col,p.x+i*10,p.y+5,p.x-i*12,p.y-30,3);}break;
 case 'voidbreaker':{const p=at(65),r=s.hit?Math.max(7,65*(1-out)):12+v*45;c.fillStyle='#101422';c.beginPath();c.ellipse(p.x,p.y,r,r*.7,0,0,Math.PI*2);c.fill();for(let i=0;i<6;i++){const a=i*Math.PI/3+(reducedMotion?0:-s.elapsed*2);moon(c,col,p.x,p.y,r+7,a);}if(s.hit&&out>.7)star(c,white,p.x,p.y,65);break;}
 case 'stormsplitter':{let prev={x,y};for(let i=0;i<points.length;i++){const p=points[i];bolt(c,i%2?col:'#e8fff2',prev.x,prev.y,p.x,p.y-10);star(c,col,p.x,p.y-10,5+v*9);prev=p;}break;}
 case 'dragonfang':if(drawDragon){c.globalAlpha=.5;drawDragon(c,{x:x-f.x*35,y:y-f.y*35-18},0,{reducedMotion:true,apparition:true});c.globalAlpha=.8;}for(let i=0;i<5;i++){const p=at(30+i*34);fire(c,col,p.x,p.y,20+v*(30+i*8));}break;
 case 'bloodmoon':moon(c,'#f4a0aa',x,y-65,30,-.4);for(const p of points){const k=s.hit?1-out:.35+v*.3;ln(c,col,p.x,p.y-12,x+(p.x-x)*k,y+(p.y-y)*k,2);}for(let i=0;i<3;i++)moon(c,col,x,y,35+v*40,i*2.1+(reducedMotion?0:s.elapsed));break;
 case 'starfall':for(let i=0;i<9;i++){const p=points[i%points.length],rise=reducedMotion?35:s.hit?Math.max(0,110-out*180+i*4):100-v*35;ln(c,'#8d7eb2',p.x-25,p.y-rise-42,p.x,p.y-rise,3);star(c,col,p.x,p.y-rise,8);if(s.hit)ring(c,col,p.x,p.y,16+out*20,.5);}break;
 case 'ghostveil':for(let i=0;i<4;i++){const a=i*Math.PI/2+Math.PI/4,r=s.hit?90-out*35:70+v*20,p={x:x+Math.cos(a)*r,y:y+Math.sin(a)*r};const target=points[i%points.length],d=Math.max(1,Math.hypot(target.x-p.x,target.y-p.y)),dir={x:(target.x-p.x)/d,y:(target.y-p.y)/d};c.globalAlpha=.6;ghost(c,col,p.x,p.y,dir);if(s.hit)beam(c,col,p.x,p.y,dir,d,8);}break;
 case 'thunderhammer':{const h=reducedMotion?65:s.hit?20-out*15:85-v*20;px(c,'#345363',x-36,y-h-33,72,32);px(c,col,x-32,y-h-30,64,25);px(c,white,x-29,y-h-27,58,4);px(c,'#b28b62',x-5,y-h,10,55);if(s.hit)for(let i=0;i<3;i++){const p=points[i%points.length];bolt(c,white,p.x,p.y-140,p.x,p.y);ring(c,col,p.x,p.y,30+out*20,.6);}break;}
 case 'scrap-king':{const h=reducedMotion?80:s.hit?15:100-v*20;for(let i=0;i<14;i++){const a=i*Math.PI/7,r=20+(1-v)*65;px(c,i%2?col:'#b4cbd2',x+Math.cos(a)*r,y-h+Math.sin(a)*r,6,8);}poly(c,col,[[x-25,y-h-12],[x-31,y-h-34],[x-10,y-h-22],[x,y-h-43],[x+10,y-h-22],[x+31,y-h-34],[x+25,y-h-12]]);if(s.hit){poly(c,'#a7c1c4',[[x-55,y-118],[x+40,y-118],[x+65,y+3],[x-40,y+3]]);ln(c,white,x+40,y-118,x+65,y+3,4);ring(c,col,x,y,35+out*140,.6);}break;}
 case 'rimecrown':if(drawDragon){c.globalAlpha=.6;drawDragon(c,{x,y:y-45},0,{reducedMotion:true,apparition:true});c.globalAlpha=.9;}for(const p of points)for(let i=0;i<4;i++){const a=i*Math.PI/2;ice(c,'#c3edff',p.x+Math.cos(a)*35,p.y+Math.sin(a)*24,12+v*50);}for(let i=0;i<14;i++){const a=i*2.4,r=35+i*5;star(c,'#e9fbff',x+Math.cos(a+(reducedMotion?0:s.elapsed))*r,y+Math.sin(a)*r*.6,3);}break;
 case 'oathbreaker':for(const p of points){chain(c,col,{x,y:y-15},{x:p.x,y:p.y-12},s.hit&&out>.5);ring(c,col,p.x,p.y-12,22);if(s.hit){ln(c,white,p.x-24,p.y-40,p.x+24,p.y+8,3);ln(c,white,p.x+24,p.y-40,p.x-24,p.y+8,3);}}break;
 case 'solstice':{const spread=45+v*70;for(const sign of [-1,1])for(let i=0;i<5;i++)feather(c,i%2?'#ffdf96':col,x+sign*10,y-45+i*6,sign,spread-i*10);fire(c,col,x,y-5,55+v*40);star(c,white,x,y-60,15);if(s.hit)for(let i=-2;i<=2;i++)fire(c,col,x+i*42,y+15,30+out*40);break;}
 case 'tidemirror':for(const sign of [-1,1]){const d=s.hit?120*(1-out):70+v*50,p=at(0,sign*d);for(let i=-3;i<=3;i++){const n={x:p.x+f.x*i*18,y:p.y+f.y*i*18};moon(c,col,n.x,n.y,20,Math.atan2(f.y,f.x)+(sign>0?Math.PI:0));}ln(c,'#eefaff',p.x-f.x*65,p.y-f.y*65,p.x+f.x*65,p.y+f.y*65,3);}if(s.hit)ring(c,col,x,y,20+out*80,.65);break;
 case 'recollection':{const r=55;ring(c,col,x,y-25,r);for(let i=0;i<12;i++){const a=i*Math.PI/6;ln(c,col,x+Math.cos(a)*(r-5),y-25+Math.sin(a)*(r-5),x+Math.cos(a)*r,y-25+Math.sin(a)*r,2);}const a=reducedMotion?-2:-s.elapsed*3;ln(c,white,x,y-25,x+Math.cos(a)*36,y-25+Math.sin(a)*36,2);for(let i=0;i<5;i++){const p=(s.history?.length?s.history[Math.max(0,s.history.length-1-i*3)]:null)??at((i-2)*25,(i%2?1:-1)*30);c.globalAlpha=.3+i*.1;ghost(c,col,p.x,p.y);px(c,'#f0e1ef',p.x-6,p.y-42,12,8);ln(c,col,p.x-3,p.y-39,p.x+3,p.y-39);}break;}
 case 'heavensfall':for(let i=-1;i<=1;i++){const xx=Math.max(175,Math.min(529,x+i*70)),yy=reducedMotion?130:s.hit?60+out*240:55+v*45;beam(c,col,xx,yy,{x:0,y:1},90,9);chain(c,'#b1a2a9',{x:xx-22,y:yy-10},{x:xx+22,y:yy+35},s.hit);}if(s.hit)for(let i=-1;i<=1;i++)beam(c,white,170,Math.max(65,Math.min(428,y+i*60)),{x:1,y:0},365,7);break;
 default:c.restore();return false;
 }
 c.restore();return true;
}
