import {SHADOW_ROSTER} from './shadows.mjs?v=0.7.0';
const r=(c,col,x,y,w,h)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
const line=(c,col,x,y,xx,yy,w=1)=>{const n=Math.max(1,Math.ceil(Math.max(Math.abs(xx-x),Math.abs(yy-y))));for(let i=0;i<=n;i++)r(c,col,x+(xx-x)*i/n,y+(yy-y)*i/n,w,w);};
function poly(c,col,p){for(let y=Math.ceil(Math.min(...p.map(q=>q[1])));y<=Math.floor(Math.max(...p.map(q=>q[1])));y++){const cuts=[];for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))cuts.push(a[0]+(y-a[1])/(b[1]-a[1])*(b[0]-a[0]));}cuts.sort((a,b)=>a-b);for(let i=0;i+1<cuts.length;i+=2)r(c,col,cuts[i],y,cuts[i+1]-cuts[i]+1,1);}}
function ellipse(c,col,x,y,rx,ry){for(let j=-ry;j<=ry;j++){const w=rx*Math.sqrt(Math.max(0,1-j*j/(ry*ry)));r(c,col,x-w,y+j,w*2+1,1);}}
function blade(c,col,x,y,face,length=27){line(c,'#202037',x,y,x+face.x*length,y+face.y*length,4);line(c,col,x+1,y,x+face.x*length+1,y+face.y*length,2);line(c,'#e5d5ff',x+face.x*(length-7),y+face.y*(length-7),x+face.x*length,y+face.y*length);}
export function drawShadow(c,s,time,{reducedMotion=false,names=true}={}){
 c.save();c.translate(Math.round(s.x),Math.round(s.y));const col=s.color,accent=s.accent,dk='#17182e',step=reducedMotion?0:Math.round(Math.sin(time*8+s.x)*1.2),face=s.facing??{x:0,y:-1};
 ellipse(c,'#0c0e1dbb',0,0,s.kind==='wyvern'?23:15,4);ellipse(c,'#6545aa66',0,-1,16,4);
 if(s.kind==='bear'){
  ellipse(c,dk,0,-14,17,11);ellipse(c,'#353052',-2,-17,13,9);r(c,col,-15,-7,5,8);r(c,col,8,-7,5,8);r(c,dk,-17,-26,18,14);r(c,col,-14,-28,4,5);r(c,col,-3,-28,4,5);r(c,accent,-15,-21,4,2);r(c,accent,-6,-21,4,2);line(c,col,-17,-10,-21,-4,2);
 }else if(s.kind==='wyvern'){
  for(const side of [-1,1]){poly(c,dk,[[0,-16],[side*22,-36-step],[side*33,-17],[side*22,-20],[side*15,-7]]);line(c,col,0,-16,side*22,-36-step,2);line(c,col,side*22,-36-step,side*33,-17);}
  poly(c,'#383253',[[-7,-3],[-9,-23],[0,-34],[9,-20],[6,-2]]);r(c,col,-5,-29,10,8);line(c,col,-5,-29,-10,-37,2);line(c,col,4,-29,9,-37,2);r(c,accent,-3,-26,6,2);line(c,col,4,-4,23,2,3);
 }else if(s.kind==='ant'){
  for(const side of [-1,1]){poly(c,'#34304d',[[side*4,-18],[side*20,-30-step],[side*26,-15],[side*6,-9]]);line(c,col,side*5,-18,side*20,-30-step);line(c,col,side*7,-8,side*14,3,2);line(c,col,side*5,-17,side*17,-6,2);}
  ellipse(c,dk,0,-13,8,13);r(c,col,-5,-31,10,9);line(c,col,-3,-29,-7,-38,2);line(c,col,3,-29,7,-38,2);r(c,accent,-4,-28,3,2);r(c,accent,2,-28,3,2);r(c,col,-3,-15,6,7);
 }else if(s.kind==='naga'){
  for(let i=0;i<7;i++)r(c,i%2?col:dk,-5+Math.sin(i*.7)*7,-13+i*2,12,4);r(c,dk,-9,-29,18,19);r(c,col,-7,-34,14,9);r(c,accent,-5,-31,3,2);r(c,accent,3,-31,3,2);for(const side of [-1,1])for(let i=0;i<2;i++)line(c,col,side*7,-24+i*8,side*(18+i*3),-30+i*18,2);
 }else{
  const heavy=s.kind==='tank',mage=s.kind==='mage'||s.kind==='acolyte',ww=heavy?13:8;
  poly(c,dk,[[-ww,-25],[ww,-25],[ww+3,-3],[-ww-3,-3]]);r(c,'#3b3157',-ww+2,-24,ww*2-4,18);r(c,col,-ww,-25,ww*2,3);r(c,col,-5,-34,10,10);r(c,dk,-4,-31,8,6);r(c,accent,-3,-30,6,2);
  if(s.id==='igris'){poly(c,'#b04e83',[[0,-33],[3,-45],[8,-43],[4,-32]]);line(c,col,6,-21,12,-10,2);blade(c,accent,12,-10,s.attackTime?face:{x:.25,y:-1},30);}
  else if(s.kind==='marshal'){for(const side of [-1,1])for(let i=0;i<3;i++)poly(c,col,[[side*6,-23],[side*(19-i*3),-38+i*8],[side*11,-15+i*3]]);for(let i=0;i<6;i++)r(c,accent,12+i*4,-16-Math.sin(i*.7+(reducedMotion?0:time))*5,3,4);}
  else if(heavy){r(c,dk,-22,-26,14,29);r(c,col,-20,-24,10,24);r(c,accent,-18,-20,3,15);line(c,col,13,-8,13,-31,3);r(c,col,8,-36,14,8);}
  else if(mage){poly(c,col,[[-7,-31],[0,-44],[8,-31]]);line(c,col,13,-4,13,-36,2);ellipse(c,accent,13,-38,5,5);}
  else if(s.kind==='archer'){c.strokeStyle=col;c.beginPath();c.arc(14,-18,12,-1.5,1.5);c.stroke();line(c,accent,14,-30,14,-6);}
  else if(s.kind==='axes'){for(const side of [-1,1]){line(c,col,side*12,-7,side*15,-29,2);r(c,accent,side*15-5,-31,10,7);}}
  else blade(c,col,10,-10,s.attackTime?face:{x:.4,y:-1},22);
  if(!mage){r(c,col,-6,-6,4,7+step);r(c,col,3,-6,4,7-step);}
 }
 if(s.attackTime&&s.target){const tx=s.target.x-s.x,ty=s.target.y-s.y;line(c,accent,face.x*12,-12+face.y*12,tx,ty-8,2);}
 if(!s.infantry&&names){c.font='6px Silkscreen';c.textAlign='center';c.fillStyle='#e9dcff';c.fillText(s.name,0,s.kind==='wyvern'?-44:s.id==='igris'||s.kind==='mage'||s.kind==='marshal'?-48:-39);}
 c.restore();
}
export function drawShadowEffect(c,e,{reducedMotion=false}={}){
 if(!e.kind.startsWith('shadow-'))return false;const t=1-e.life/e.maxLife;c.save();c.globalAlpha=Math.max(0,1-t);
 if(e.kind==='shadow-gate'){
  const r=reducedMotion?15:9+22*t;ellipse(c,'#181328',e.x,e.y,r,5);for(let i=0;i<7;i++){const x=e.x+(i-3)*5,h=reducedMotion?14:(1-t)*(18+i%3*8);line(c,e.color,x,e.y,x+Math.sin(i)*3,e.y-h,2);}
 }else if(e.kind==='shadow-claw'){for(let i=-1;i<=1;i++)line(c,'#b1dff0',e.x-14+i*6,e.y-30,e.x+8+i*6,e.y-4,2);}
 else if(e.to){const to=e.to;if(['mage','acolyte','wyvern'].includes(e.style)){const q=reducedMotion?1:Math.min(1,t*4),x=e.x+(to.x-e.x)*q,y=e.y-20+(to.y-e.y+10)*q;ellipse(c,'#7551b3',x,y,7,7);ellipse(c,'#dbc8ff',x,y,3,3);}else{line(c,e.color,e.x,e.y-15,to.x,to.y-10,2);if(e.style==='marshal')for(let i=0;i<7;i++)r(c,'#debeff',e.x+(to.x-e.x)*i/7,e.y-15+(to.y-e.y+5)*i/7,3,3);}}
 c.restore();return true;
}
export function drawShadowProcession(c,scene,{reducedMotion=false}={}){
 const q=reducedMotion?.8:Math.min(1,scene.elapsed/(scene.duration*scene.impact)),out=scene.hit?1: q;
 c.save();const x=scene.origin.x,y=scene.origin.y;
 ellipse(c,'#121125dd',x,y,65+q*65,22);c.strokeStyle='#ad82ed';c.lineWidth=2;c.beginPath();c.ellipse(x,y,55+q*60,18,0,0,Math.PI*2);c.stroke();
 for(let i=0;i<15;i++){const row=Math.floor(i/5),col=i%5,p={...SHADOW_ROSTER[i],x:x+(col-2)*(28+row*4),y:y-32-row*34+(reducedMotion?0:(1-out)*30),attackTime:scene.hit?.2:0,facing:{x:0,y:-1}};c.globalAlpha=.35+out*.6;drawShadow(c,p,reducedMotion?0:scene.elapsed,{reducedMotion,names:false});}
 c.globalAlpha=1;c.fillStyle='#eadfff';c.font='20px Silkscreen';c.textAlign='center';c.fillText('ARISE',x,y-147);
 c.restore();
}
