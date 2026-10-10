const pixel=(c,color,x,y,w=2,h=2)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
function line(c,color,x,y,xx,yy,w=1){const n=Math.max(1,Math.ceil(Math.max(Math.abs(xx-x),Math.abs(yy-y))));for(let i=0;i<=n;i++)pixel(c,color,x+(xx-x)*i/n,y+(yy-y)*i/n,w,w);}
function mark(c,pattern,color,x,y,size,t){
 const r=size;
 if(pattern==='frost'){line(c,color,x,y-r,x-r*.45,y+r,2);line(c,color,x,y-r,x+r*.45,y+r,2);line(c,'#edfaff',x,y-r,x,y+r);line(c,color,x-r*.45,y+r,x+r*.45,y+r);}
 else if(pattern==='oath'){for(let i=0;i<3;i++){const yy=y-r+i*r*.8;line(c,color,x-3,yy,x+3,yy);line(c,color,x-3,yy,x-3,yy+5);line(c,color,x+3,yy,x+3,yy+5);}line(c,'#fff0d0',x-r,y+4,x+r,y-4);}
 else if(pattern==='sun'){for(let i=0;i<r;i++){const w=Math.max(1,Math.round(Math.sin(i/r*Math.PI)*r*.4));pixel(c,i<r/2?color:'#ffe4a5',x-w,y-i,w*2,2);}line(c,color,x-r*.5,y-4,x-r,y-10,2);line(c,color,x+r*.5,y-4,x+r,y-10,2);}
 else if(pattern==='moon'){for(let i=0;i<18;i++){const a=-Math.PI*.6+i*Math.PI*1.2/17;pixel(c,color,x-Math.cos(a)*r,y+Math.sin(a)*r,2,2);}line(c,'#edf0ff',x-r*.5,y-r*.35,x-r*.5,y+r*.35);}
 else if(pattern==='memory'){pixel(c,'#42354f',x-r*.6,y-r*.5,r*1.2,r);pixel(c,color,x-r*.6,y-r*.5,r*1.2,2);line(c,'#f2d8ee',x,y-r*.4,x,y+r*.5);line(c,color,x-r*.4,y,x-2,y-2);line(c,color,x+2,y-2,x+r*.4,y);}
 else {line(c,color,x-r,y+5,x+r,y+5,2);for(const dx of [-r,0,r]){line(c,color,x+dx,y+5,x+dx,y-r*.6,2);pixel(c,'#fff0d0',x+dx-1,y-r*.6-2,3,3);}line(c,color,x-r,y+8,x+r,y+8);}
}
export function drawBossCharge(c,e,time,{reducedMotion=false}={}){
 if(!e.divineCast)return;
 const t=1-e.divineCast.time/1.05,spin=reducedMotion?0:time*.4,color=e.color,pattern=e.pattern;c.save();
 for(let i=0;i<6;i++){const a=i*Math.PI/3+spin,r=35+25*(1-t);mark(c,pattern,color,e.x+Math.cos(a)*r,e.y-24+Math.sin(a)*r*.5,8+3*t,t);}
 // Sparks converge on the caster; damage is still only in the marked zones.
 if(!reducedMotion)for(let i=0;i<8;i++){const a=i*Math.PI/4,d=60*(1-t);line(c,color,e.x+Math.cos(a)*d,e.y-20+Math.sin(a)*d*.6,e.x+Math.cos(a)*(d+6),e.y-20+Math.sin(a)*(d+6)*.6);}
 c.restore();
}
export function drawBossVFX(c,e,{reducedMotion=false}={}){
 if(!['divine-strike','boss-impact'].includes(e.kind))return false;
 const t=1-e.life/e.maxLife;c.save();c.globalAlpha=Math.max(0,1-t);
 if(e.kind==='boss-impact'){
  for(let i=0;i<8;i++){const a=i*Math.PI/4,r=8+22*t;line(c,e.color,e.x+Math.cos(a)*r*.45,e.y+Math.sin(a)*r*.45,e.x+Math.cos(a)*r,e.y+Math.sin(a)*r,2);}
 }else{
  const count=e.pattern==='crown'?5:8;
  for(let i=0;i<count;i++){
   const a=i*Math.PI*2/count,spread=(e.r??32)*(.6+t*.8),x=e.shape==='column'?e.x+Math.cos(a)*e.width:e.shape==='row'?e.x+(i-count/2)*38:e.x+Math.cos(a)*spread,y=e.shape==='column'?75+i*68:e.shape==='row'?e.y+Math.sin(a)*e.width:e.y+Math.sin(a)*spread;
   mark(c,e.pattern,e.color,x,y-(reducedMotion?0:t*25),e.pattern==='sun'?22:12,t);
   if(e.pattern==='crown'||e.pattern==='frost')line(c,e.color,x,y-40*(1-t),x,y,2);
  }
 }
 c.restore();return e.kind==='boss-impact';
}
