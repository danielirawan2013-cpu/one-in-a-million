// Canvas-native artwork: integer scanlines keep every contour in real pixels.
const rect=(c,color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
function poly(c,color,points){
  for(let y=Math.floor(Math.min(...points.map(p=>p[1])));y<=Math.ceil(Math.max(...points.map(p=>p[1])));y++){
    const cuts=[];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))cuts.push(a[0]+(y-a[1])/(b[1]-a[1])*(b[0]-a[0]));}
    cuts.sort((a,b)=>a-b);for(let i=0;i+1<cuts.length;i+=2)rect(c,color,Math.ceil(cuts[i]),y,Math.floor(cuts[i+1])-Math.ceil(cuts[i])+1,1);
  }
}
function line(c,color,x,y,xx,yy,w=1){const n=Math.max(1,Math.ceil(Math.max(Math.abs(xx-x),Math.abs(yy-y))));for(let i=0;i<=n;i++)rect(c,color,x+(xx-x)*i/n-w/2,y+(yy-y)*i/n-w/2,w,w);}
function bolt(c,color,x,y,xx,yy,w=2){const dx=xx-x,dy=yy-y,l=Math.max(1,Math.hypot(dx,dy)),nx=-dy/l,ny=dx/l;let a=[x,y];for(let i=1;i<=6;i++){const z=i===6?0:(i%2?4:-4),b=[x+dx*i/6+nx*z,y+dy*i/6+ny*z];line(c,color,...a,...b,w);a=b;}}
function star(c,color,x,y,r){line(c,color,x-r,y,x+r,y,2);line(c,color,x,y-r,x,y+r,2);rect(c,'#effbf5',x-1,y-1,3,3);}
function crescent(c,color,x,y,r,rotation=0){for(let i=0;i<35;i++){const a=rotation-1.7+i*.1,thickness=2+Math.sin(i/34*Math.PI)*5;rect(c,color,x+Math.cos(a)*r,y+Math.sin(a)*r,thickness,thickness);}}
function flame(c,color,x,y,h){poly(c,'#954750',[[x-9,y],[x-8,y-h*.4],[x-3,y-h*.3],[x,y-h],[x+5,y-h*.5],[x+9,y-h*.65],[x+11,y-8],[x+5,y+2]]);poly(c,color,[[x-6,y],[x-4,y-h*.45],[x,y-h*.8],[x+4,y-h*.3],[x+6,y]]);poly(c,'#fff0b8',[[x-2,y],[x,y-h*.38],[x+3,y]]);}
function crystal(c,color,x,y,h){poly(c,'#41688c',[[x-10,y],[x-7,y-h*.6],[x,y-h],[x+9,y-h*.55],[x+10,y]]);poly(c,color,[[x-7,y],[x,y-h],[x+2,y]]);line(c,'#effbf5',x,y-h,x,y-2,2);}

export function drawLightningDragon(c,e,time,{reducedMotion=false,flip=false,apparition=false}={}){
  c.save();c.translate(Math.round(e.x),Math.round(e.y));if(flip)c.scale(-1,1);
  const flap=reducedMotion?0:Math.round(Math.sin(time*3)*3),bob=reducedMotion?0:Math.round(Math.sin(time*2)*2);
  if(!apparition)rect(c,'#142b3555',-32,-2,64,6);
  c.translate(0,bob-5);
  // Hooked tail, separate wing membranes, hind legs and a long scaled neck.
  poly(c,'#16394e',[[-7,-14],[19,-11],[33,-18],[38,-32],[45,-37],[42,-17],[32,-6],[9,-5]]);
  line(c,'#69cad2',15,-10,31,-14,2);line(c,'#69cad2',31,-14,40,-28,2);
  for(const side of [-1,1]){
    c.save();c.scale(side,1);
    poly(c,'#132c40',[[6,-34],[24,-70-flap],[49,-51-flap],[39,-40],[35,-21],[25,-30],[18,-19],[9,-24]]);
    poly(c,'#245569',[[9,-35],[24,-65-flap],[43,-51-flap],[31,-47],[33,-27],[25,-36],[19,-26]]);
    poly(c,'#347f91',[[12,-36],[24,-61-flap],[29,-46],[24,-36],[19,-29]]);
    bolt(c,'#a7eff0',9,-33,24,-68-flap,2);line(c,'#77ced8',24,-68-flap,47,-51-flap,2);
    line(c,'#478caa',24,-65-flap,25,-36,1);line(c,'#478caa',24,-65-flap,36,-27,1);
    poly(c,'#36738a',[[side===1?7:2,-17],[15,-9],[17,-2],[10,0],[5,-10]]);
    for(let i=0;i<3;i++)rect(c,'#d1f3ed',10+i*3,-3,2,3);
    c.restore();
  }
  poly(c,'#15374a',[[-12,-9],[-17,-25],[-14,-46],[-9,-59],[4,-59],[10,-48],[15,-29],[12,-11],[2,-5]]);
  poly(c,'#286c83',[[-10,-13],[-12,-35],[-7,-54],[2,-54],[7,-42],[11,-25],[7,-12]]);
  poly(c,'#8bcfd1',[[-3,-13],[-7,-27],[-4,-47],[1,-47],[5,-31],[4,-16]]);
  for(let i=0;i<5;i++)line(c,'#366580',-4,-17-i*5,4,-17-i*5,1);
  for(let i=0;i<4;i++)poly(c,'#e9efb0',[[8,-21-i*8],[17,-26-i*8],[9,-30-i*8]]);
  // Horned dragon head, jutting snout, exposed teeth and electric eyes.
  poly(c,'#16394e',[[-13,-50],[-20,-64],[-15,-71],[-8,-71],[-3,-66],[8,-64],[12,-57],[6,-50]]);
  poly(c,'#408ca0',[[-13,-55],[-17,-64],[-10,-67],[1,-62],[8,-58],[6,-54]]);
  poly(c,'#8bdce0',[[-8,-64],[2,-63],[12,-60],[18,-59],[18,-53],[7,-51],[-1,-55]]);
  rect(c,'#15394b',5,-57,14,2);rect(c,'#edfce7',7,-56,2,3);rect(c,'#edfce7',12,-56,2,3);
  rect(c,'#183f53',15,-59,2,2);rect(c,'#16283c',-8,-63,8,4);rect(c,'#ffed91',-6,-63,5,2);rect(c,'#fffbd0',-3,-63,2,2);
  poly(c,'#b4edeb',[[-15,-66],[-23,-79],[-19,-80],[-10,-69]]);poly(c,'#edf3b2',[[-5,-67],[-8,-79],[-4,-77],[2,-65]]);
  star(c,'#fff2ac',0,-29,5);
  if(!reducedMotion){for(let i=0;i<3;i++){const y=-25-i*19,a=Math.sin(time*4+i)*2;bolt(c,'#79d8e4',-20+a,y,-29-a,y-12,1);}}
  if(e.windup||e.stormCast){star(c,'#ffe8a1',20,-57,5);bolt(c,'#dafbf9',14,-54,25,-43,2);}
  if(e.flash){c.globalAlpha=.45;poly(c,'#f3fff1',[[-14,-50],[-6,-65],[13,-59],[12,-12],[-5,-8]]);}
  c.restore();
}

const divineStyles={rimecrown:'frostbite',oathbreaker:'dragonfang',solstice:'emberfang',tidemirror:'moonfang',recollection:'ghostveil',heavensfall:'starfall'};
export function drawMoveEffect(c,e,{reducedMotion=false}={}){
  if(divineStyles[e.style])e={...e,style:divineStyles[e.style]};
  const t=1-e.life/e.maxLife,color=e.color,face=e.face??{x:1,y:0},a=Math.atan2(face.y,face.x),r=e.r??45;
  c.save();c.globalAlpha=Math.min(1,e.life*4);
  if(e.kind==='chain-bolt'){bolt(c,color,e.x,e.y-10,e.to.x,e.to.y-10,2);c.restore();return;}
  if(e.kind==='strike-warning'){c.strokeStyle=color;c.lineWidth=1;c.beginPath();c.arc(e.x,e.y,r,0,Math.PI*2);c.stroke();star(c,color,e.x,e.y,4);if(!reducedMotion&&e.style==='starfall')line(c,color,e.x-25,e.y-80,e.x,e.y-8,2);c.restore();return;}
  if(e.shape==='line'||e.shape==='dash'){
    const length=e.range*(reducedMotion?1:Math.min(1,.25+t*2)),w=e.width;
    poly(c,color,[[e.x-face.y*w,e.y+face.x*w-8],[e.x+face.x*length-face.y*w*.15,e.y+face.y*length+face.x*w*.15-8],[e.x+face.x*length+face.y*w*.15,e.y+face.y*length-face.x*w*.15-8],[e.x+face.y*w,e.y-face.x*w-8]]);
    line(c,'#f3fff1',e.x,e.y-8,e.x+face.x*length,e.y+face.y*length-8,2);
    if(e.style==='moonfang')crescent(c,'#f0faff',e.x+face.x*length,e.y+face.y*length-8,20,a);
  }else if(e.shape==='heal'||e.shape==='ward'){
    for(let i=0;i<6;i++){const ang=i*Math.PI/3;star(c,color,e.x+Math.cos(ang)*r,e.y-9+Math.sin(ang)*r*.65,3);}
  }else{
    const radius=reducedMotion?r*.8:r*(.45+t*.55);
    for(let i=0;i<20;i++){
      const ang=e.shape==='arc'?a-1+i*.1:i*Math.PI/10,x=e.x+Math.cos(ang)*radius,y=e.y+Math.sin(ang)*radius-8;
      if(e.style==='emberfang'||e.style==='dragonfang')flame(c,color,x,y,14);
      else if(e.style==='frostbite')crystal(c,color,x,y,16);
      else if(e.style==='thornheart'){line(c,color,e.x,e.y,x,y,1);rect(c,color,x-2,y-3,5,3);}
      else if(e.style==='stormsplitter'||e.style==='thunderhammer')bolt(c,color,x,y-14,x+3,y,2);
      else if(e.style==='starfall')star(c,color,x,y,4);
      else if(e.style==='ghostveil'){rect(c,color,x-3,y-12,6,9);rect(c,color,x-4,y-5,8,9);}
      else if(e.style==='voidbreaker'){line(c,color,x,y,e.x+Math.cos(ang)*(radius-13),e.y+Math.sin(ang)*(radius-13)-8,3);}
      else rect(c,color,x,y,4,3);
    }
  }c.restore();
}

export function drawUltimateSpectacle(c,game,{reducedMotion=false}={}){
  const scene=game.specialScene;if(!scene)return;
  const p=scene.origin,color=scene.color,phase=Math.min(1,scene.elapsed/(scene.duration*.68)),release=scene.hit,anim=reducedMotion?1:phase;
  const x=p.x,y=p.y-18,key=scene.skin;
  c.save();c.globalAlpha=release?.65:.85;
  if(key==='dawnblade'||key==='classicdawn'){
    const sy=y-30-anim*45;for(let i=0;i<10;i++){const a=i*Math.PI/5;line(c,color,x+Math.cos(a)*20,sy+Math.sin(a)*20,x+Math.cos(a)*(30+anim*22),sy+Math.sin(a)*(30+anim*22),3);}star(c,'#fff4b8',x,sy,18);
    if(release)poly(c,color,[[x-22,y],[x+22,y],[x+scene.facing.x*250+22,y+scene.facing.y*250],[x+scene.facing.x*250-22,y+scene.facing.y*250]]);
  }else if(key==='moonfang'){
    const r=30+anim*35;for(let i=0;i<3;i++){const a=i*Math.PI*2/3+(reducedMotion?0:scene.elapsed);crescent(c,color,x+Math.cos(a)*r,y+Math.sin(a)*r*.6,21,a);}
    crescent(c,'#ecfaff',x,y-55,28,-.7);
  }else if(key==='emberfang'){
    for(let i=-2;i<=2;i++)flame(c,color,x+i*25,y+20,20+anim*(65-Math.abs(i)*15));
    if(release)for(let i=0;i<5;i++)flame(c,color,x+scene.facing.x*(35+i*30),y+scene.facing.y*(35+i*30),75);
  }else if(key==='frostbite'){
    for(let i=-3;i<=3;i++)crystal(c,color,x+i*17,y+22,20+anim*(85-Math.abs(i)*17));
    line(c,'#f0ffff',x-60,y+20,x+60,y+20,2);
  }else if(key==='thornheart'){
    for(const side of [-1,1]){let prev=[x+side*10,y+30];for(let i=0;i<25;i++){const h=i*4*anim,xx=x+side*(16+Math.sin(i*.4)*20),yy=y+30-h;line(c,color,...prev,xx,yy,3);if(i%4===0)poly(c,color,[[xx,yy],[xx+side*12,yy-9],[xx+side*9,yy+2]]);prev=[xx,yy];}}
  }else if(key==='voidbreaker'){
    const r=15+anim*45;c.fillStyle='#15192c';c.beginPath();c.ellipse(x,y,r,r*.6,0,0,Math.PI*2);c.fill();
    for(let i=0;i<6;i++)crescent(c,color,x,y,r+i*4,(reducedMotion?0:-scene.elapsed*2)+i*.7);
    if(release)bolt(c,'#ecdfff',x-100,y,x+100,y,3);
  }else if(key==='stormsplitter'||key==='thunderhammer'){
    if(key==='thunderhammer'){poly(c,color,[[x-30,y-90],[x+30,y-90],[x+30,y-61],[x-30,y-61]]);rect(c,'#e3fff4',x-24,y-86,48,6);rect(c,color,x-4,y-61,8,55);}
    for(let i=-2;i<=2;i++)bolt(c,i%2?color:'#ecfff5',x+i*34,y-95,x+i*18,y+15,2);
    if(release)for(let i=0;i<8;i++){const a=i*Math.PI/4;bolt(c,color,x,y,x+Math.cos(a)*110,y+Math.sin(a)*70,2);}
  }else if(key==='dragonfang'){
    c.globalAlpha=.55;drawLightningDragon(c,{x,y:y-15},0,{reducedMotion:true,apparition:true});c.globalAlpha=.9;
    for(let i=0;i<4;i++)flame(c,color,x+scene.facing.x*(30+i*25),y+scene.facing.y*(30+i*25),20+anim*40);
  }else if(key==='bloodmoon'){
    crescent(c,'#ec738b',x,y-55,30,-.5);c.fillStyle='#672c46';c.beginPath();c.arc(x,y-55,22,0,Math.PI*2);c.fill();
    for(let i=0;i<3;i++)crescent(c,color,x,y,25+anim*35+i*8,i*2.1);
  }else if(key==='starfall'){
    for(let i=0;i<7;i++){const xx=x-84+i*28,yy=y-100+(reducedMotion?i%3*13:(scene.elapsed*55+i*19)%100);line(c,'#8069a1',xx-16,yy-35,xx,yy,3);star(c,color,xx,yy,7);}
    star(c,'#f0e2ff',x,y-55,18*anim+5);
  }else if(key==='ghostveil'){
    for(let i=0;i<4;i++){const a=i*Math.PI/2+(reducedMotion?0:scene.elapsed*.6),xx=x+Math.cos(a)*(35+anim*30),yy=y+Math.sin(a)*25;c.globalAlpha=.3+i*.12;rect(c,color,xx-4,yy-23,8,8);poly(c,color,[[xx-7,yy-13],[xx+7,yy-13],[xx+10,yy+4],[xx+3,yy],[xx,yy+4],[xx-4,yy],[xx-10,yy+4]]);line(c,'#ecfff3',xx+8,yy-12,xx+22,yy-32,2);}
  }else if(key==='scrap-king'){
    for(let i=0;i<18;i++){const a=i*Math.PI/9,r=20+(1-anim)*75;rect(c,i%2?color:'#a7c2c5',x+Math.cos(a)*r,y+Math.sin(a)*r,4+i%4,6);}
    poly(c,'#f3cc8b',[[x-22,y-55],[x-28,y-76],[x-10,y-65],[x,y-84],[x+10,y-65],[x+28,y-76],[x+22,y-55]]);
  }else if(key==='ironshort'){
    for(let i=-1;i<=1;i++)line(c,color,x+i*20,y+15,x+i*20,y-85,5);line(c,'#f3fff2',x-40,y-38,x+40,y-38,3);
  }else{
    // The starter sword awakens Pip's small silhouette, rather than an element.
    for(let i=0;i<7;i++){const a=i*Math.PI/3.5;star(c,color,x+Math.cos(a)*(25+anim*35),y+Math.sin(a)*(25+anim*35),4);}
    star(c,'#f4e9ba',x,y-35,10);
  }c.restore();
}
