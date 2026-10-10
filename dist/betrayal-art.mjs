// Authored pixel silhouettes: Rowan, shield lancers and masked arbalists.
const colors={o:'#202830',h:'#513b37',H:'#a46d4b',s:'#e7b78f',e:'#263340',a:'#587384',A:'#a3bac6',w:'#dce4df',r:'#a75956',R:'#df9685',b:'#394959',B:'#67737f',g:'#ab9064',G:'#e5c899',m:'#8d949b',M:'#dddacb'};
const rowan=[
 '.......hhhhhhh........','......hhHHHHHhh.......','.....hhHHHHHHHhh......','.....hHHHssHHHHh......','.....hHssssesHHh......','......hsssssHHh.......','.......hsssshh........','........sss...........',
 '.....ooAAaaAAoo.......','....oAAwaaaawAAo......','....oAaaaaaaaAAo......','...oAsaaaaaaaAsAo.....','...oAsaAwwwAaasAo.....','...oAsaAaAAaaasAo.....','....ssaaaAAaaass......','....ssrRRRRRrss.......','......rrRrrRr.........','......bbbbbbb.........','......bBBbBBb.........','......bBBbBBb.........','......bBB.bBB.........','......bBB.bBB.........','......aAA.aAA.........','......aAA.aAA.........','.....oMMM.oMMMo.......'
];
const lancer=[
 '.........ooo..........','........oMMMo.........','.......oMmmmMo........','.......omooomo........','.......ommmmmo........','........omMmo.........','......ooMMMMMoo.......','.....oMmmmmmmmMo......','.....oMmMmmmMmMo......','.....ommmmmmmmmo......','.....omMmmmMmmmo......','......oMMmmmMMo.......','......orRRRRRro.......','.......obbbbbo........','.......obBbbBo........','.......obB.bBo........','.......omM.mMo........','.......omM.mMo........','......oMMM.MMMo.......'
];
const arbalist=[
 '........oooo..........','.......obBBbo.........','......obBBBBbo........','......obMooMbo........','......obrRRrbo........','.......orrro..........','.....oobbbbbboo.......','....obBbRRRbBBbo......','....obBBbbbBBBbo......','....obbbbbbBbbbo......','.....ssbGGbbss........','.....ssbbbbbss........','.......bbbbbb.........','.......bbBbbb.........','.......bBBbBB.........','.......bBBbBB.........','.......bBB.BB.........','.......oBB.BBo........','......obbB.Bbbo.......'
];
const rect=(c,col,x,y,w,h)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h);};
function line(c,col,x,y,xx,yy,w=1){const n=Math.max(1,Math.ceil(Math.max(Math.abs(xx-x),Math.abs(yy-y))));for(let i=0;i<=n;i++)rect(c,col,x+(xx-x)*i/n,y+(yy-y)*i/n,w,w);}
function pixels(c,rows,x,y,scale,flash){rows.forEach((row,yy)=>[...row].forEach((p,xx)=>{if(colors[p])rect(c,flash?'#f6e5c2':colors[p],x+(xx-rows[0].length/2)*scale,y+(yy-rows.length)*scale,scale,scale);}));}
export function drawOathFighter(c,e,time,{reducedMotion=false}={}){
 if(e.id!=='rowan-betrayer'&&!e.remnant)return false;
 c.save();const row=e.id==='rowan-betrayer',s=row?1.5:1.2,kind=e.remnant,face=e.cast?.facing??e.attackFacing??{x:0,y:1},angle=Math.atan2(face.y,face.x),x=e.x,y=e.y;
 c.globalAlpha=.35;rect(c,'#16212a',x-(row?16:12),y-1,row?32:24,5);c.globalAlpha=1;
 if(e.dead&&row){pixels(c,rowan,x,y+13,1.2,false);rect(c,'#393b45',x-14,y-2,28,7);line(c,'#bbcbd0',x+19,y-3,x+37,y+5,2);rect(c,'#e5c899',x+14,y-5,5,6);c.restore();return true;}
 pixels(c,row?rowan:kind==='spear'?lancer:arbalist,x,y,s,!!e.flash);
 if(row){
  const raised=!!e.cast,handX=x+(face.x||1)*10,handY=y-16,bladeAngle=raised?angle-.6:angle+.65;
  line(c,'#263340',handX,handY,handX+Math.cos(bladeAngle)*31,handY+Math.sin(bladeAngle)*31,4);line(c,'#dce4df',handX,handY,handX+Math.cos(bladeAngle)*29,handY+Math.sin(bladeAngle)*29,2);
  line(c,'#e5c899',handX-Math.sin(bladeAngle)*5,handY+Math.cos(bladeAngle)*5,handX+Math.sin(bladeAngle)*5,handY-Math.cos(bladeAngle)*5,2);rect(c,'#e7b78f',handX-2,handY-2,4,4);
  if(e.guardTime){rect(c,'#b99e7c',x-20,y-27,10,20);rect(c,'#587384',x-18,y-25,6,16);}
  if(e.phaseRest){for(let i=0;i<9;i++){const a=i*Math.PI*2/9;rect(c,'#df9685',x+Math.cos(a)*26,y-16+Math.sin(a)*16,2,3);}}
 }else if(kind==='spear'){
  // Tall kite shield with a metal spine, exposed spear tip above the helmet.
  rect(c,'#202830',x-15,y-24,13,25);rect(c,'#67737f',x-13,y-23,9,20);rect(c,'#dddacb',x-9,y-23,2,24);rect(c,'#a75956',x-12,y-14,8,3);rect(c,'#202830',x-13,y-2,9,3);
  const a=e.cast?angle:-Math.PI/2;line(c,'#ab9064',x+9,y-8,x+9+Math.cos(a)*38,y-8+Math.sin(a)*38,2);line(c,'#dddacb',x+9+Math.cos(a)*32,y-8+Math.sin(a)*32,x+9+Math.cos(a)*43,y-8+Math.sin(a)*43,3);
 }else{
  // Wide mechanical bow and hood distinguish the ranged remnant at game scale.
  const hx=x+face.x*7,hy=y-12+face.y*4;line(c,'#ab9064',hx-Math.sin(angle)*13,hy+Math.cos(angle)*13,hx+Math.sin(angle)*13,hy-Math.cos(angle)*13,3);line(c,'#dddacb',hx-Math.sin(angle)*12+face.x*4,hy+Math.cos(angle)*12+face.y*4,hx+Math.sin(angle)*12+face.x*4,hy-Math.cos(angle)*12+face.y*4);line(c,'#394959',hx-face.x*7,hy-face.y*7,hx+face.x*10,hy+face.y*10,3);
 }
 if(e.cast)drawOathCast(c,e.cast,{warning:true,reducedMotion});c.restore();return true;
}
export function drawOathCast(c,cast,{warning=false,reducedMotion=false}={}){
 c.save();const f=cast.facing,a=Math.atan2(f.y,f.x),r=cast.range,type=cast.attackKind??cast.kind,col=warning?'#edb28d':type==='bolt'?'#e5c899':'#f6d7bd';
 c.translate(cast.x,cast.y);c.rotate(a);c.strokeStyle=col;c.lineWidth=warning?1:3;c.fillStyle=col+'25';
 if(type==='sweep'){c.beginPath();c.moveTo(0,0);c.arc(0,0,r,-Math.PI*.75,Math.PI*.75);c.closePath();if(warning)c.fill();c.stroke();}
 else{c.fillRect(0,-cast.width,r,cast.width*2);c.strokeRect(0,-cast.width,r,cast.width*2);for(let x=12;x<r;x+=18){line(c,col,x-4,-4,x,0,warning?1:2);line(c,col,x,0,x-4,4,warning?1:2);}if(!warning){line(c,col,0,0,r,0,4);line(c,'#fff0d0',0,-1,r,-1,1);}}
 if(warning){const progress=1-cast.time/cast.maxTime;c.fillStyle='#fff0d0';c.fillRect(-5,-3,Math.round(progress*10),6);}
 c.restore();
}
export function drawOathEffect(c,e,{reducedMotion=false}={}){
 if(e.kind==='oath-strike'){drawOathCast(c,e,{reducedMotion});return true;}
 if(!['oath-break','oath-arrival'].includes(e.kind))return false;
 c.save();const t=1-e.life/e.maxLife;c.globalAlpha=1-t;const radius=e.r*(.3+t*.7),color=e.kind==='oath-break'?'#df9685':'#d7b58e';
 for(let i=0;i<16;i++){const a=i*Math.PI/8;line(c,color,e.x+Math.cos(a)*radius*.7,e.y+Math.sin(a)*radius*.7,e.x+Math.cos(a)*radius,e.y+Math.sin(a)*radius,2);if(e.kind==='oath-break')rect(c,'#e5c899',e.x+Math.cos(a)*radius,e.y+Math.sin(a)*radius,3,3);}
 c.restore();return true;
}
