import {Adventure} from './engine.mjs?v=0.2.0';
import {SAVE_KEY,validSave,clamp,distance} from './core.mjs?v=0.2.0';
import {WIDTH,HEIGHT} from './world.mjs?v=0.2.0';
import {groundCanvas,drawWorld,sprite,itemIcon} from './art.mjs?v=0.2.0';

const $=id=>document.getElementById(id);
const canvas=$('game'),ctx=canvas.getContext('2d'),overlay=$('overlay');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const input={up:false,down:false,left:false,right:false,attack:false};
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let background,lastTime=0,uiClock=0,saveClock=0,toastTimer,saveAvailable=true,saved=null,soundEnabled=false,audio=null,previousMode='playing',game;
const camera={x:112,y:140};
try{const parsed=JSON.parse(localStorage.getItem(SAVE_KEY));if(validSave(parsed))saved=parsed;}catch{saveAvailable=false;}
function save(){
  if(!game||game.mode==='title'||game.player.hp<=0)return;
  try{localStorage.setItem(SAVE_KEY,JSON.stringify(game.snapshot()));}catch{saveAvailable=false;$('save-note').textContent='Saving is unavailable in this browser. You can still play this session.';}
}
function clearInput(){for(const key of Object.keys(input))input[key]=false;}
function audioCue(type){
  if(!soundEnabled)return;
  try{
    audio??=new (window.AudioContext||window.webkitAudioContext)();audio.resume();
    const notes=type==='unlock'?[330,440,660,880]:type==='loot'?[523,659,784]:type==='power'?[110,220,440]:type==='hurt'?[95]:type==='swing'?[160]:type==='complete'?[392,523,659,784]:type==='dodge'?[240]:[440];
    notes.forEach((frequency,i)=>{const osc=audio.createOscillator(),gain=audio.createGain(),at=audio.currentTime+i*.08;osc.type='triangle';osc.frequency.setValueAtTime(frequency,at);gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(.045,at+.012);gain.gain.exponentialRampToValueAtTime(.0001,at+.13);osc.connect(gain);gain.connect(audio.destination);osc.start(at);osc.stop(at+.14);});
  }catch{soundEnabled=false;$('sound').setAttribute('aria-pressed','false');$('sound-label').textContent='Sound unavailable';$('sound').setAttribute('aria-label','Sound is unavailable');}
}
function toast(text,{title='',rarity=''}={}){
  clearTimeout(toastTimer);const el=$('toast');el.className='loot-toast '+rarity;el.innerHTML=(title?'<strong>'+escapeHTML(title)+'</strong>':'')+escapeHTML(text);el.hidden=false;$('announcer').textContent=(title?title+'. ':'')+text;toastTimer=setTimeout(()=>el.hidden=true,rarity?3800:3000);
}
function showPanel(html){
  clearInput();overlay.innerHTML=html;
  const panel=overlay.querySelector('.story-panel');if(panel){panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');const heading=panel.querySelector('h2');if(heading){heading.id='dialog-title';panel.setAttribute('aria-labelledby','dialog-title');}}
  requestAnimationFrame(()=>overlay.querySelector('button')?.focus());
}
function closePanel(){overlay.innerHTML='';clearInput();canvas.focus({preventScroll:true});}
function intro(){
  game.mode='title';
  showPanel(`<div class="story-panel"><canvas class="portrait" id="portrait" width="32" height="36" aria-label="Pip, a small human wearing an oversized apron"></canvas><h2>Meet Pip.</h2><p>A little human raised by monsters.<br>A battered sword. An oversized apron.<br><strong>A strength he hasn’t discovered yet.</strong></p><p>Uncle Bones is trapped in the crypt.<br>It’s time to bring your family home.</p><div class="buttons">${saved?'<button data-action="continue">Continue adventure</button>':'<button data-action="start">Begin adventure</button>'}</div>${saved?'<button class="secondary" data-action="new-confirm">Start a new adventure</button>':''}<p class="footnote">Move · Fight · Find treasure · Become stronger</p></div>`);
  sprite($('portrait').getContext('2d'),'pip',16,31,{scale:1.8});
}
function updateUI(){
  const p=game.player,stage=game.stage;
  $('health-fill').style.width=p.hp+'%';$('health-text').textContent=p.hp+' / 100';$('coins').textContent=p.coins;
  $('location').textContent=game.area.name;$('location-note').textContent=game.area.note;
  $('chapter-label').textContent='Chapter '+['','one','two','three'][game.chapter];
  $('scene-caption').textContent=game.storyDone&&game.area.id==='hollow'?'The whole family is home. Even the knight.':game.returned&&game.area.id==='hollow'?'Rowan is back at the shop. Hear what she’s planning.':game.stage&&game.area.id==='hollow'?'Your spark is awake. Head north into the mossway.':game.area.caption;
  $('weapon-name').textContent=p.weapon>=12?'Dawnblade':p.weapon>=8?'Iron shortsword':'Battered sword';$('weapon-damage').textContent=game.attackDamage+' DMG';itemIcon($('weapon-icon'),p.weapon>=12?'blade':'weapon');
  $('potion-label').textContent=p.potions+' potion'+(p.potions===1?'':'s');
  $('heal-action').disabled=game.mode!=='playing';
  $('power-action').disabled=game.mode!=='playing'||!stage||p.powerCd>0;
  $('power-label').textContent=!stage?'Power sleeping':p.powerCd>0?'Ready in '+Math.ceil(p.powerCd)+'s':'Heart burst';
  const titles=['A sleeping spark','The first spark','A growing flame','A heart awakened'];
  const notes=['One in a million. You just don’t know it yet.','A little stronger. A lot more possible.','Your body is learning what your heart knew.','Still small. Finally, impossibly strong.'];
  $('stage-count').textContent=stage+' / 3';$('stage-title').textContent=titles[stage];$('stage-note').textContent=notes[stage];
  document.querySelectorAll('.potential-segments span').forEach((el,i)=>el.classList.toggle('active',i<stage));
  const checkpoints=[0,12,38,80],next=checkpoints[stage+1],last=checkpoints[stage];
  $('xp-fill').style.width=(stage===3?100:clamp((p.xp-last)/(next-last)*100,0,100))+'%';
  $('xp-label').textContent=stage===3?'Your full potential is unlocked':(next-p.xp)+' resolve until '+(stage===0?'your first unlock':'your next unlock');
  const quests={
    1:{title:'A family matter',description:'Uncle Bones is trapped in the old crypt. Bring him home before the knight finds him.',steps:[['Find your first spark',stage>0],['Clear the mossway',['guard-1','guard-2','guard-3'].every(id=>game.defeated.has(id))],['Defeat the iron warden',game.defeated.has('warden')],['Bring Uncle Bones home',game.returned]]},
    2:{title:'Your best customer',description:'Rowan needs a bounty to save her family. Her next target is Grandma. Find the family portrait before she reaches the dragon.',steps:[['Hear Rowan’s plan',game.knightMet],['Clear Thornwood Road',['thorn-1','thorn-2','thorn-3'].every(id=>game.defeated.has(id))],['Defeat the archive guardian',game.defeated.has('archivist')],['Collect the family portrait',game.familyProof]]},
    3:{title:'Grandma’s last stand',description:game.storyDone?'You exposed the false bounty and saved Grandma. The shop has room for one more friend.':game.truthRevealed?'The knight knows Grandma is your family. Stand together against the official who created the bounty.':'Reach Grandma and tell Rowan the truth before her sword falls.',steps:[['Tell Rowan the truth',game.truthRevealed],['Clear the vault guards',['ember-1','ember-2'].every(id=>game.defeated.has(id))],['Stop the royal collector',game.defeated.has('collector')],['Bring everyone home',game.storyDone]]}
  },quest=quests[game.chapter];
  $('quest-title').textContent=quest.title;$('quest-description').textContent=quest.description;
  ['step-training','step-guards','step-boss','step-home'].forEach((id,i)=>{$(id).classList.toggle('complete',quest.steps[i][1]);$(id).querySelector('.step-text').textContent=quest.steps[i][0];});
  $('pause').disabled=game.mode==='title'||game.mode==='complete'||game.mode==='dead'||game.mode==='dialog';
  $('pause').setAttribute('aria-label',game.mode==='paused'?'Resume game':'Pause game');
  $('field-note').textContent=game.storyDone?'“We made room for one more. The knight asked for a smaller apron.”':game.familyProof?'“Grandma is a dragon, not a villain. Also, she forgot my birthday again.”':game.returned?'“My best customer is hunting my family. How do I tell her?”':game.defeated.has('warden')?'“I stopped a sword bigger than me. I am going to need a bigger breakfast.”':stage>0?'“That door felt lighter today. Maybe I’m stronger than I thought.”':'“If I don’t come back, someone please water Grandma’s gold.”';
  const h=game.mode==='playing'?game.hint:null,hint=$('interact-hint');hint.hidden=!h;
  if(h)hint.querySelector('span').textContent=h.type?'Open '+({wood:'wooden',iron:'iron',gold:'golden'}[h.type])+' chest':h.label;
}
function updateInventory(){
  $('bag-count').textContent=game.inventory.length+' find'+(game.inventory.length===1?'':'s');
  const grouped=new Map();for(const item of game.inventory){const key=item.id+item.rarity;const existing=grouped.get(key);if(existing)existing.count++;else grouped.set(key,{...item,count:1});}
  const el=$('inventory');el.innerHTML=grouped.size?[...grouped.values()].map(i=>`<div class="loot-row ${i.rarity}"><canvas width="24" height="24" data-item="${escapeHTML(i.id)}" aria-hidden="true"></canvas><div><strong>${escapeHTML(i.name)}</strong><small>${i.rarity==='trash'?'Junk · sell for '+i.value+' coins':i.rarity==='rare'?'Rare · equipped':i.id==='coins'?'Useful · coins collected':i.id==='potion'?'Useful · potion collected':'Useful · gear collected'}</small></div>${i.count>1?'<span>×'+i.count+'</span>':''}</div>`).join(''):'<p class="empty-bag">A little room for a little luck.<br>Find a chest to fill your satchel.</p>';
  el.querySelectorAll('canvas').forEach(c=>itemIcon(c,c.dataset.item));
}
function shopPanel(){
  const count=game.inventory.filter(i=>i.rarity==='trash').length;
  const line=game.storyDone?'“A human, a knight, a skeleton and a dragon. We are going to need more mugs.”':game.familyProof?'“Go get Grandma. And tell her those birthday presents don’t wrap themselves.”':game.returned?'“Bones is home. Now get to Grandma before your favourite customer does.”':'“Bring Bones back in one piece, will you? Well… his usual number of pieces.”';
  showPanel(`<div class="story-panel dialog-panel"><div class="dialog-speaker">Silk · Your adopted sister</div><h2>Welcome home, short stuff.</h2><p>${line}</p><p>Junk in your bag: <strong>${count} items</strong><br>Coins: <strong>${game.player.coins}</strong> · Potions: <strong>${game.player.potions}</strong></p><div class="buttons"><button data-action="sell" ${count?'':'disabled'}>Sell junk</button><button data-action="buy" class="secondary" ${game.player.coins>=8?'':'disabled'}>Potion · 8 coins</button></div><button data-action="close" class="secondary">Back to adventure</button></div>`);
}
function chapterPanel(){
  const third=game.familyProof;
  showPanel(`<div class="story-panel dialog-panel"><h2>${third?'Before the sword falls':'Your best customer'}</h2><p>${third?'The portrait shows a tiny human beside a skeleton, a spider, and a smiling dragon. Your family.':'Uncle Bones is home. Rowan, your regular customer, returns to buy supplies for her next adventure.'}</p><p>${third?'Rowan still thinks she is hunting a dangerous monster. Get to Grandma and show her the truth.':'You’ve shared jokes and cups of tea at the shop. She has become your friend. She has no idea who you protect at night.'}</p><p><strong>Chapter ${third?'three':'two'} begins.</strong><br>Your strength and loot carry forward.</p><div class="buttons"><button data-action="${third?'continue-story':'meet-knight'}">${third?'Reach Grandma':'Hear Rowan’s plan'}</button><button data-action="close" class="secondary">Explore first</button></div></div>`);
}
function knightCustomerPanel(){
  showPanel(`<div class="story-panel dialog-panel"><div class="dialog-speaker">Rowan · Your regular customer</div><h2>One last bounty.</h2><p>“My family can’t afford Mum’s medicine. The royal official promised enough money if I defeat the dragon in Ember Vault.”</p><p>“You’ve always been kind to me, Pip. When this is over, I’ll come back for tea.”</p><p>She has no idea the dragon is your grandmother. Find the family portrait in the archive, then reach Grandma first.</p><div class="buttons"><button data-action="leave-shop">Enter the old dungeon road</button><button data-action="close" class="secondary">Visit the shop first</button></div></div>`);
}
function completePanel(){
  showPanel(`<div class="story-panel"><h2>A bigger family.</h2><p>You and Rowan expose the official’s false bounty. Grandma keeps her home and gives Rowan gold for her family’s medicine.</p><p>“You looked like you needed protecting,” she says. Pip grins. “We all do, sometimes.”</p><p>Grandma produces a birthday present.<br>It is another oversized apron.</p><p><strong>Three chapters complete.</strong><br>${game.opened.size} chests opened · ${game.inventory.filter(i=>i.rarity==='rare').length} rare finds</p><div class="buttons"><button data-action="explore">Keep exploring</button><button data-action="new-confirm" class="secondary">Play again</button></div></div>`);
}
function event(e){
  if(['swing','power','loot','unlock','hurt','complete','dodge','healed'].includes(e.type))audioCue(e.type);
  switch(e.type){
    case 'area':background=groundCanvas(game.area);camera.x=clamp(game.player.x-240,0,WIDTH-canvas.width);camera.y=clamp(game.player.y-canvas.height/2-42,0,HEIGHT-canvas.height);clearInput();break;
    case 'message':toast(e.text);break;
    case 'loot':toast(e.loot.name,{title:e.loot.rarity==='rare'?'A rare find!':e.loot.rarity==='trash'?'Well… it’s something.':'Something useful.',rarity:e.loot.rarity});updateInventory();save();break;
    case 'unlock':toast(['','Your first spark! Q unleashes a burst of strength.','Growing flame! Stronger swings and a bigger heart burst.','Full potential! Still small. Now impossibly strong.'][e.stage],{title:'Potential unlocked'});break;
    case 'defeated':if(e.id==='warden')toast('Uncle Bones is free. Talk to him near the golden chest.',{title:'The warden has fallen'});if(e.id==='archivist')toast('Collect your family portrait at the top of the archive.',{title:'The archive is open'});if(e.id==='collector')toast('Grandma is safe. Talk to her to bring everyone home.',{title:'The false bounty is broken'});save();break;
    case 'shop':shopPanel();break;
    case 'sold':shopPanel();toast(e.count?'Sold '+e.count+' pieces of junk for '+e.value+' coins.':'No junk to sell.');updateInventory();save();break;
    case 'bought':shopPanel();toast('A fresh potion. Silk insists you stay hydrated.');save();break;
    case 'uncle-locked':showPanel('<div class="story-panel dialog-panel"><div class="dialog-speaker">Uncle Bones</div><h2>A small complication.</h2><p>“Lovely to see you, Pip. I’d offer you a hug, but the enormous suit of armour says no.”</p><p>Defeat the iron warden to break the seal.</p><button data-action="close">I’ll get you out.</button></div>');break;
    case 'rescue':showPanel('<div class="story-panel dialog-panel"><div class="dialog-speaker">Uncle Bones</div><h2>You came for me.</h2><p>“Look at you. Still wearing that ridiculous apron. I knew there was something extraordinary in that little heart.”</p><p>“Now, can we go home? I’ve been standing for three hundred years.”</p><div class="buttons"><button data-action="home">Bring him home</button><button data-action="close" class="secondary">Loot the chest first</button></div></div>');save();break;
    case 'chapter':chapterPanel();save();break;
    case 'continued':closePanel();save();break;
    case 'knight-intro':showPanel('<div class="story-panel dialog-panel"><div class="dialog-speaker">Rowan · Your regular customer</div><h2>Tea before danger?</h2><p>“Another adventure, another visit to your shop. Your tea is better than my sword skills, Pip.”</p><p>“I’m taking royal bounties to help my family. When I’m done, maybe I can finally put this sword down.”</p><button data-action="close">Come back safely.</button></div>');break;
    case 'knight-customer':knightCustomerPanel();break;
    case 'portrait-locked':showPanel('<div class="story-panel"><h2>A guarded memory.</h2><p>The archive guardian protects the family portrait. Defeat it to collect the picture.</p><button data-action="close">Back to the archive</button></div>');break;
    case 'family-proof':chapterPanel();save();break;
    case 'reveal':showPanel('<div class="story-panel dialog-panel"><h2>That’s my Grandma.</h2><p>Rowan raises her sword. Pip steps between them and catches the blade with a strength she never imagined he had.</p><p>He shows her the portrait. “They raised me. You’re hunting my family.”</p><p>Before she can answer, the royal official arrives. “Clear out the monsters. Their treasure belongs to me.”</p><p>Rowan lowers her sword. “You lied to me. Pip, I’m with you.”</p><button data-action="stand-together">Stand together</button></div>');break;
    case 'truth-revealed':closePanel();toast('Rowan fights beside you. Stop the official who created the bounty.',{title:'A friend becomes an ally'});save();break;
    case 'ally':showPanel(`<div class="story-panel dialog-panel"><div class="dialog-speaker">Rowan · Your knight friend</div><h2>We do this together.</h2><p>${game.storyDone?'“Silk says I’m family now. I’ve never been happier to be threatened with knitting.”':'“The collector takes his time winding up. Watch his sword, dodge the strike, then hit him while he recovers.”'}</p><button data-action="close">Thanks, Rowan.</button></div>`);break;
    case 'grandma-locked':showPanel('<div class="story-panel dialog-panel"><div class="dialog-speaker">Grandma</div><h2>Hands off the presents.</h2><p>“That rude man wants my treasure. It’s mostly socks, Pip. Expensive socks.”</p><p>Stop the royal collector before he takes Grandma’s home.</p><button data-action="close">I’ll protect you.</button></div>');break;
    case 'grandma-rescued':showPanel('<div class="story-panel dialog-panel"><div class="dialog-speaker">Grandma</div><h2>My little one.</h2><p>“You always thought you were the weak one. But you came back for every one of us.”</p><p>“That knight can come home too. We’ll find her a mug.”</p><div class="buttons"><button data-action="finish-story">Bring everyone home</button><button data-action="close" class="secondary">Loot the chest first</button></div></div>');break;
    case 'family-home':showPanel(`<div class="story-panel dialog-panel"><h2>${e.who==='bones-home'?'Uncle Bones':'Grandma'}</h2><p>${e.who==='bones-home'?'“I’ve been rescued once. That’s enough exercise for this century.”':'“Your birthday present has been in my treasure pile for twelve years. Better late than never.”'}</p><button data-action="close">Back to adventure</button></div>`);break;
    case 'death':showPanel('<div class="story-panel"><h2>A stumble.<br>Not the end.</h2><p>Silk found you and dragged you home.<br>“You owe me a new apron, short stuff.”</p><p>Your loot and unlocked strength are safe.</p><button data-action="recover">Try again · Full health</button></div>');break;
    case 'complete':completePanel();save();break;
    case 'restored':if(game.storyDone)completePanel();else if(game.returned&&!game.chapter2Started)chapterPanel();else closePanel();updateInventory();break;
    case 'healed':toast('Restored 40 health.');save();break;
  }
  if(game)updateUI();
}
function newAdventure(){
  game=new Adventure({onEvent:event});background=groundCanvas(game.area);camera.x=112;camera.y=140;updateInventory();updateUI();intro();
}
function pause(){
  if(game.mode==='paused'){game.mode='playing';closePanel();updateUI();return;}
  if(game.mode!=='playing')return;
  game.mode='paused';save();showPanel('<div class="story-panel"><h2>Take a breather.</h2><p>Even a one-in-a-million hero needs a snack break.</p><button data-action="resume">Back to adventure</button><p class="footnote">Your progress is saved on this device.</p></div>');updateUI();
}
function help(){
  if(game.mode==='help')return;
  previousMode=game.mode;game.mode='help';
  showPanel(`<div class="story-panel instructions"><h2>A little field guide</h2><p>Rescue Uncle Bones, discover your customer’s next bounty, and protect Grandma across three chapters.</p><dl><dt><kbd>W A S D</kbd> / Arrows</dt><dd>Move and face your next target.</dd><dt><kbd>SPACE</kbd></dt><dd>Wind up, strike forward, and recover. Hold for repeated swings. Hits only land in front of you.</dd><dt><kbd>E</kbd></dt><dd>Open chests, talk, and use doorways.</dd><dt><kbd>SHIFT</kbd></dt><dd>Dodge an enemy’s wind-up. You can cancel your own swing to dodge.</dd><dt><kbd>Q</kbd></dt><dd>Heart burst. Unlock it by defeating the practice armour.</dd><dt><kbd>H</kbd></dt><dd>Drink a potion to heal 40 health.</dd><dt><kbd>ESC</kbd></dt><dd>Pause or resume.</dd></dl><p>Wooden chests: 5% rare · Iron: 15% rare · Golden: 30% rare. Sell trash at Silk’s shop. Touch controls work too.</p><button data-action="help-close">Got it.</button></div>`);updateUI();
}
overlay.addEventListener('click',e=>{
  const button=e.target.closest('button[data-action]');if(!button||button.disabled)return;
  switch(button.dataset.action){
    case 'start':game.start();closePanel();save();break;
    case 'continue':if(saved){game.restore(saved);}break;
    case 'new-confirm':game.mode='confirm';showPanel('<div class="story-panel"><h2>A fresh adventure?</h2><p>This replaces the saved adventure on this device. Your current loot and progress will be reset.</p><div class="buttons"><button data-action="new" class="secondary">Start fresh</button><button data-action="cancel-new">Keep my adventure</button></div></div>');break;
    case 'cancel-new':if(game.storyDone){game.mode='complete';completePanel();}else intro();break;
    case 'new':saved=null;try{localStorage.removeItem(SAVE_KEY);}catch{}newAdventure();game.start();closePanel();save();break;
    case 'resume':game.mode='playing';closePanel();break;
    case 'close':game.mode='playing';closePanel();break;
    case 'sell':game.sellJunk();break;
    case 'buy':game.buyPotion();break;
    case 'home':game.returnHome();break;
    case 'meet-knight':game.meetKnight();save();break;
    case 'leave-shop':game.meetKnight();game.continueStory();break;
    case 'continue-story':game.continueStory();break;
    case 'stand-together':game.revealTruth();break;
    case 'finish-story':game.finishStory();break;
    case 'recover':game.recover();closePanel();save();break;
    case 'explore':game.mode='playing';closePanel();break;
    case 'help-close':game.mode=previousMode;if(previousMode==='title')intro();else if(previousMode==='paused'){game.mode='playing';pause();}else if(previousMode==='dialog'){game.mode='playing';closePanel();}else if(previousMode==='complete')completePanel();else if(previousMode==='dead'){game.mode='dead';event({type:'death'});}else closePanel();break;
  }
  updateUI();
});
const movement={KeyW:'up',ArrowUp:'up',KeyS:'down',ArrowDown:'down',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right'};
document.addEventListener('keydown',e=>{
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.code==='Tab'&&overlay.children.length){const buttons=[...overlay.querySelectorAll('button:not(:disabled)')];const first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}return;}
  if(e.code==='Escape'){e.preventDefault();if(game.mode==='help')overlay.querySelector('[data-action="help-close"]').click();else if(game.mode==='dialog'){game.mode='playing';closePanel();updateUI();}else pause();return;}
  if(game.mode!=='playing'||e.target.closest('button'))return;
  if(movement[e.code]){e.preventDefault();input[movement[e.code]]=true;}
  if(e.code==='Space'){e.preventDefault();input.attack=true;game.attack();}
  if(!e.repeat){if(e.code==='KeyE'){e.preventDefault();game.interact();}if(e.code==='KeyQ'){e.preventDefault();game.power();}if(e.code==='KeyH'){e.preventDefault();game.heal();}if(e.code.startsWith('Shift')){e.preventDefault();game.dodge();}}
});
document.addEventListener('keyup',e=>{if(movement[e.code])input[movement[e.code]]=false;if(e.code==='Space')input.attack=false;});
window.addEventListener('blur',()=>{clearInput();if(game.mode==='playing')pause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInput();save();if(game.mode==='playing')pause();}});
window.addEventListener('pagehide',save);
for(const button of document.querySelectorAll('[data-move]')){
  button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);if(game.mode==='playing')input[button.dataset.move]=true;});
  const stop=()=>input[button.dataset.move]=false;button.addEventListener('pointerup',stop);button.addEventListener('pointercancel',stop);button.addEventListener('lostpointercapture',stop);
}
$('touch-attack').addEventListener('pointerdown',e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);if(game.mode==='playing'){input.attack=true;game.attack();}});
for(const kind of ['pointerup','pointercancel','lostpointercapture'])$('touch-attack').addEventListener(kind,()=>input.attack=false);
$('touch-interact').onclick=()=>game.interact();$('touch-dodge').onclick=()=>game.dodge();$('heal-action').onclick=()=>{game.heal();canvas.focus({preventScroll:true});};$('power-action').onclick=()=>{game.power();canvas.focus({preventScroll:true});};
$('pause').onclick=pause;$('help').onclick=help;
$('sound').onclick=()=>{soundEnabled=!soundEnabled;$('sound').setAttribute('aria-pressed',String(soundEnabled));$('sound').setAttribute('aria-label',soundEnabled?'Turn sound off':'Turn sound on');$('sound-label').textContent=soundEnabled?'Sound on':'Sound off';if(soundEnabled)audioCue('loot');};
function frame(time){
  const dt=lastTime?Math.min((time-lastTime)/1000,.05):0;lastTime=time;
  game.tick(dt,input);if(input.attack&&game.mode==='playing')game.attack();
  const targetX=clamp(game.player.x-canvas.width/2,0,WIDTH-canvas.width),targetY=clamp(game.player.y-canvas.height/2-42,0,HEIGHT-canvas.height);
  const follow=reducedMotion?1:1-Math.exp(-dt*10);camera.x+=(targetX-camera.x)*follow;camera.y+=(targetY-camera.y)*follow;
  ctx.clearRect(0,0,canvas.width,canvas.height);drawWorld(ctx,game,camera,background,{reducedMotion,input});
  uiClock+=dt;saveClock+=dt;if(uiClock>.12){updateUI();uiClock=0;}if(saveClock>2&&game.mode==='playing'){save();saveClock=0;}
  requestAnimationFrame(frame);
}
newAdventure();
if(!saveAvailable)$('save-note').textContent='Saving is unavailable in this browser. You can still play this session.';
new ResizeObserver(()=>{const rect=canvas.getBoundingClientRect();if(rect.width){const height=clamp(Math.round(480*rect.height/rect.width),250,420);if(canvas.height!==height)canvas.height=height;}}).observe($('viewport'));
requestAnimationFrame(frame);
