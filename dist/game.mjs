import {BETRAYAL,ROWAN_PHASES} from './betrayal.mjs?v=0.5.0';
import {weaponKit,WEAPON_KITS,ABILITY_LEVELS} from './moves.mjs?v=0.5.0';
import {GOD_EPISODES} from './gods.mjs?v=0.5.0';
import {ULTIMATES,ultimateKey} from './ultimates.mjs?v=0.5.0';
import {EPISODES} from './campaign.mjs?v=0.5.0';
import {SWORDS} from './swords.mjs?v=0.5.0';
import {AdminTools,ADMIN_ITEMS} from './admin.mjs?v=0.5.0';
import {Adventure} from './engine.mjs?v=0.5.0';
import {SAVE_KEY,validSave,clamp,distance} from './core.mjs?v=0.5.0';
import {WIDTH,HEIGHT} from './world.mjs?v=0.5.0';
import {groundCanvas,drawWorld,sprite,itemIcon} from './art.mjs?v=0.5.0';

const $=id=>document.getElementById(id);
const canvas=$('game'),ctx=canvas.getContext('2d'),overlay=$('overlay');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const input={up:false,down:false,left:false,right:false,attack:false,charge:false};
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const adminTools=new AdminTools();
let adventureStarted=false,adminReturn=null,adminNotice='';
let background,lastTime=0,uiClock=0,saveClock=0,toastTimer,saveAvailable=true,saved=null,soundEnabled=false,audio=null,previousMode='playing',game;
const camera={x:112,y:140};
try{const parsed=JSON.parse(localStorage.getItem(SAVE_KEY));if(validSave(parsed))saved=parsed;}catch{saveAvailable=false;}
function save(){
  if(!game||!adventureStarted||game.mode==='title'||game.player.hp<=0)return;
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
  requestAnimationFrame(()=>overlay.querySelector('input:not(:disabled),select:not(:disabled),button:not(:disabled)')?.focus());
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
  $('chapter-label').textContent=game.area.id==='oathhall'?'Epilogue':'Chapter '+['','one','two','three','four','five','six','seven','eight','nine','ten','eleven'][game.chapter];
  $('scene-caption').textContent=game.area.id==='shop'?game.area.caption:game.betrayalStage===6&&game.area.id==='hollow'?'Your family is home. Rowan is helping the prisoners.':game.campaignDone&&game.betrayalStage<6&&game.area.id==='hollow'?'Rowan has a letter for you. Talk to her near the shop.':game.storyDone&&game.area.id==='hollow'?'The whole family is home. Even the knight.':game.returned&&game.area.id==='hollow'?'Rowan is back at the shop. Hear what she’s planning.':game.stage&&game.area.id==='hollow'?'Your spark is awake. Head north into the mossway.':game.area.caption;
  const rowan=game.area.id==='oathhall'?game.area.enemies.find(e=>e.id==='rowan-betrayer'):null,duel=$('duel-status');duel.hidden=!rowan||game.betrayalStage<2;
  if(rowan){$('duel-title').textContent=game.betrayalStage>=5?'The door is open':rowan.dead?'Defeat the remaining remnant':`Rowan · ${rowan.phase} / 3 · ${ROWAN_PHASES[rowan.phase-1].name}`;$('duel-health').value=rowan.hp;$('duel-health').max=rowan.maxHp;$('duel-health').hidden=rowan.dead;$('duel-health').setAttribute('aria-label','Rowan health, phase '+rowan.phase);}
  $('weapon-name').textContent=p.scrapKing?'Scrap King · Admin':SWORDS[p.weaponSkin]?.name??(p.weapon>=12?'Dawnblade':p.weapon>=8?'Iron shortsword':'Battered sword');$('weapon-damage').textContent=game.attackDamage+' DMG';itemIcon($('weapon-icon'),p.scrapKing?'scrap-king':p.weaponSkin??(p.weapon>=12?'blade':'weapon'));
  $('potion-label').textContent=p.potions+' potion'+(p.potions===1?'':'s');
  $('heal-action').disabled=game.mode!=='playing';
  $('power-action').disabled=game.mode!=='playing'||!stage||p.powerCd>0;
  $('power-label').textContent=!stage?'Power sleeping':p.powerCd>0?'Ready in '+Math.ceil(p.powerCd)+'s':'Heart burst';
  const ultSkin=ultimateKey(p),ult=ULTIMATES[ultSkin];
  $('special-action').hidden=false;$('special-action').disabled=game.mode!=='playing'||p.specialCd>0||p.ultimateCharge<100||p.scrapKing&&!p.specialUnlocked||!p.scrapKing&&(!stage||!ult);
  $('special-label').textContent=(ult?.title??'Ultimate')+(p.specialCd>0?' · '+Math.ceil(p.specialCd)+'s':'');
  $('special-action').title=p.ultimateCharge<100?'Hold U or land hits and parries to fill the ultimate meter.':p.scrapKing&&!p.specialUnlocked?'Unlock King’s Verdict in Admin.':!stage&&!p.scrapKing?'Unlock your first potential stage.':'Press V to unleash your ultimate.';
  $('ultimate-fill').style.width=p.ultimateCharge+'%';$('ultimate-charge').textContent=Math.floor(p.ultimateCharge)+' / 100';$('channel-action').disabled=game.mode!=='playing'||p.ultimateCharge>=100;

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
  },quest=quests[game.chapter]??{};
  if(game.campaignStep){const ep=EPISODES[game.campaignStep-1],done=game.campaignDone;quest.title=ep.chapter;quest.description=done?'The dungeon heart is safe. Everyone has a home to return to.':ep.arrival[0];quest.steps=[['Follow the trail to '+ep.name,done||game.area.id===ep.id],['Clear the constructs',done||[0,1,2,3].every(i=>game.defeated.has(ep.id+'-guard-'+i))],['Defeat '+ep.boss,done||game.defeated.has(ep.id+'-boss')],['Hear the next part of the story',done||game.defeated.has(ep.id+'-read')]];}
  if(game.area.divineStep){const ep=GOD_EPISODES[game.area.divineStep-1];quest.title=ep.chapter;quest.description=ep.arrival[0];quest.steps=[['Enter '+ep.name,true],['Defeat the celestial sentinel',game.defeated.has(ep.id+'-sentinel')],['Defeat '+ep.boss,game.defeated.has(ep.id+'-god')],['Recover your lost memory',game.defeated.has(ep.id+'-read')]];}
  if(game.area.id==='oathhall'||game.area.id==='hollow'&&game.campaignDone){quest.title='The Broken Oath';quest.description=game.betrayalStage===6?'Rowan chose to betray you to save her family. You stopped the remnant. Trust will take longer to rebuild.':game.betrayalStage===0?'Three weeks later, Rowan has a letter for Pip. Talk to her beside the shop.':game.betrayalStage===1?'Rowan locked the hall herself. Read her confession before drawing your sword.':game.betrayalStage===5?'The fight is over. Approach Rowan and press G to hear the aftermath.':ROWAN_PHASES[Math.min(2,game.betrayalStage-2)].hint;quest.steps=[['Read Rowan’s letter',game.betrayalStage>=1],['Survive the three-stage duel',game.defeated.has('rowan-betrayer')],['Defeat the royal remnant',game.betrayalStage>=5],['Hear the aftermath and return home',game.betrayalStage===6]];}
  $('quest-title').textContent=quest.title;$('quest-description').textContent=quest.description;
  ['step-training','step-guards','step-boss','step-home'].forEach((id,i)=>{$(id).classList.toggle('complete',quest.steps[i][1]);$(id).querySelector('.step-text').textContent=quest.steps[i][0];});
  $('inventory-toggle').disabled=!adventureStarted||!['playing','paused','inventory'].includes(game.mode);
  for(const [kind,level] of Object.entries(ABILITY_LEVELS)){
    const b=$(kind+'-action'),cd=p[kind+'Cd'],move=weaponKit(p).moves[kind],name=move.name;b.title=name+' · '+move.cooldown+' second cooldown · changes with your weapon';b.disabled=game.mode!=='playing'||stage<level||cd>0;
    b.querySelector('span').textContent=stage<level?name+' · unlock '+level:cd>0?name+' · '+Math.ceil(cd)+'s':name;
  }
  $('lightning-action').disabled=game.mode!=='playing'||p.scrapKing||p.weaponSkin!=='thunderhammer'||p.lightningCd>0;
  $('lightning-action').querySelector('span').textContent=p.weaponSkin!=='thunderhammer'?'Lightning · hammer':p.lightningCd>0?'Lightning · '+Math.ceil(p.lightningCd)+'s':'Lightning';
  $('parry-action').disabled=game.mode!=='playing'||p.parryCd>0;
  $('admin').disabled=game.mode==='special'||game.mode==='inventory';$('help').disabled=game.mode==='admin'||game.mode==='special'||game.mode==='inventory';
  $('pause').disabled=game.mode==='special'||game.mode==='admin'||game.mode==='inventory'||game.mode==='title'||game.mode==='complete'||game.mode==='dead'||game.mode==='dialog';
  $('pause').setAttribute('aria-label',game.mode==='paused'?'Resume game':'Pause game');
  $('field-note').textContent=game.area.id==='oathhall'?'“She knew I would come because I trusted her.”':game.betrayalStage===6&&game.area.id==='hollow'?'“We saved her family. Forgiving her will take longer.”':game.area.divineStep?GOD_EPISODES[game.area.divineStep-1].note:game.campaignStep?EPISODES[game.campaignStep-1].note:game.storyDone?'“We made room for one more. The knight asked for a smaller apron.”':game.familyProof?'“Grandma is a dragon, not a villain. Also, she forgot my birthday again.”':game.returned?'“My best customer is hunting my family. How do I tell her?”':game.defeated.has('warden')?'“I stopped a sword bigger than me. I am going to need a bigger breakfast.”':stage>0?'“That door felt lighter today. Maybe I’m stronger than I thought.”':'“If I don’t come back, someone please water Grandma’s gold.”';
  const h=game.mode==='playing'?game.hint:null,hint=$('interact-hint');hint.hidden=!h;
  if(h)hint.querySelector('span').textContent=h.type?'Open '+({wood:'wooden',iron:'iron',gold:'golden'}[h.type])+' chest':h.label;
}
function updateInventory(){
  $('bag-count').textContent=game.inventory.length+' find'+(game.inventory.length===1?'':'s');
  const grouped=new Map();for(const item of game.inventory){const key=item.id+item.rarity;const existing=grouped.get(key);if(existing)existing.count++;else grouped.set(key,{...item,count:1});}
  const el=$('inventory');el.innerHTML=grouped.size?[...grouped.values()].map(i=>`<div class="loot-row ${i.rarity}"><canvas width="24" height="24" data-item="${escapeHTML(i.id)}" aria-hidden="true"></canvas><div><strong>${escapeHTML(i.name)}</strong><small>${i.skin?(SWORDS[i.skin].god?SWORDS[i.skin].god+'’s guaranteed reward · ':i.skin==='thunderhammer'?'Secret boss reward · ':'Very rare sword · ')+SWORDS[i.skin].damage+' base damage':i.rarity==='trash'?'Junk · sell for '+i.value+' coins':i.rarity==='rare'?'Rare · equipped':i.id==='coins'?'Useful · coins collected':i.id==='potion'?'Useful · potion collected':'Useful · gear collected'}</small></div>${i.skin?'<button data-equip="'+escapeHTML(i.skin)+'" '+(game.player.weaponSkin===i.skin&&!game.player.scrapKing?'disabled':'')+'>'+ (game.player.weaponSkin===i.skin&&!game.player.scrapKing?'Equipped':'Equip')+'</button>':''}${i.count>1?'<span>×'+i.count+'</span>':''}</div>`).join(''):'<p class="empty-bag">A little room for a little luck.<br>Find a chest to fill your satchel.</p>';
  el.querySelectorAll('canvas').forEach(c=>itemIcon(c,c.dataset.item));
}
function shopPanel(){
  const count=game.inventory.filter(i=>i.rarity==='trash').length;
  const line=game.betrayalStage===6?'“Her family needed help. So we helped. You don’t owe Rowan a smile, Pip.”':game.storyDone?'“A human, a knight, a skeleton and a dragon. We are going to need more mugs.”':game.familyProof?'“Go get Grandma. And tell her those birthday presents don’t wrap themselves.”':game.returned?'“Bones is home. Now get to Grandma before your favourite customer does.”':'“Bring Bones back in one piece, will you? Well… his usual number of pieces.”';
  showPanel(`<div class="story-panel dialog-panel"><div class="dialog-speaker">Silk · Your adopted sister</div><h2>Welcome home, short stuff.</h2><p>${line}</p><p>Junk in your bag: <strong>${count} items</strong><br>Coins: <strong>${game.player.coins}</strong> · Potions: <strong>${game.player.potions}</strong></p><div class="buttons"><button data-action="sell" ${count?'':'disabled'}>Sell junk</button><button data-action="buy" class="secondary" ${game.player.coins>=8?'':'disabled'}>Potion · 8 coins</button></div><button data-action="mystery-chest" class="secondary" ${game.player.coins<50||game.inventory.length>=200?'disabled':''}>Mystery chest · 50 coins</button><button data-action="close" class="secondary">Back to the shop</button></div>`);
}
function chapterPanel(){
  const third=game.familyProof;
  showPanel(`<div class="story-panel dialog-panel"><h2>${third?'Before the sword falls':'Your best customer'}</h2><p>${third?'The portrait shows a tiny human beside a skeleton, a spider, and a smiling dragon. Your family.':'Uncle Bones is home. Rowan, your regular customer, returns to buy supplies for her next adventure.'}</p><p>${third?'Rowan still thinks she is hunting a dangerous monster. Get to Grandma and show her the truth.':'You’ve shared jokes and cups of tea at the shop. She has become your friend. She has no idea who you protect at night.'}</p><p><strong>Chapter ${third?'three':'two'} begins.</strong><br>Your strength and loot carry forward.</p><div class="buttons"><button data-action="${third?'continue-story':'meet-knight'}">${third?'Reach Grandma':'Hear Rowan’s plan'}</button><button data-action="close" class="secondary">Explore first</button></div></div>`);
}
function knightCustomerPanel(){
  showPanel(`<div class="story-panel dialog-panel"><div class="dialog-speaker">Rowan · Your regular customer</div><h2>One last bounty.</h2><p>“My family can’t afford Mum’s medicine. The royal official promised enough money if I defeat the dragon in Ember Vault.”</p><p>“You’ve always been kind to me, Pip. When this is over, I’ll come back for tea.”</p><p>She has no idea the dragon is your grandmother. Find the family portrait in the archive, then reach Grandma first.</p><div class="buttons"><button data-action="leave-shop">Enter the old dungeon road</button><button data-action="close" class="secondary">Visit the shop first</button></div></div>`);
}
function completePanel(){
  showPanel(`<div class="story-panel"><h2>A bigger family.</h2><p>You and Rowan expose the official’s false bounty. Grandma keeps her home and gives Rowan gold for her family’s medicine.</p><p>“You looked like you needed protecting,” she says. Pip grins. “We all do, sometimes.”</p><p>Grandma produces a birthday present.<br>It is another oversized apron.</p><p><strong>First story arc complete.</strong><br>${game.opened.size} chests opened · ${game.inventory.filter(i=>i.rarity==='rare').length} rare finds</p><div class="buttons"><button data-action="begin-campaign">Continue the story</button><button data-action="explore" class="secondary">Keep exploring</button><button data-action="new-confirm" class="secondary">Play again</button></div></div>`);
}
function campaignPanel(episode,arrival=false){
  const paragraphs=arrival?episode.arrival:episode.ending;
  showPanel(`<div class="story-panel dialog-panel story-reader"><h2>${arrival?episode.chapter:episode.speaker}</h2>${paragraphs.map(p=>'<p>'+escapeHTML(p)+'</p>').join('')}<div class="buttons"><button data-action="${arrival?'close':'advance-campaign'}">${arrival?'Enter '+episode.name:game.campaignStep===10?'Bring everyone home':'Continue the journey'}</button>${arrival?'':'<button data-action="close" class="secondary">Explore first</button>'}</div></div>`);
}
function divinePanel(episode,arrival=false){
  showPanel('<div class="story-panel dialog-panel story-reader"><h2>'+escapeHTML(arrival?episode.chapter:'A recovered memory')+'</h2>'+ (arrival?episode.arrival:episode.ending).map(p=>'<p>'+escapeHTML(p)+'</p>').join('')+'<div class="buttons"><button data-action="'+(arrival?'close':'advance-divine')+'">'+(arrival?'Enter '+episode.name:game.divineStep===6?'Return to your family':'Climb to the next realm')+'</button>'+(arrival?'':'<button data-action="close" class="secondary">Explore first</button>')+'</div></div>');
}
function divineEnding(){showPanel('<div class="story-panel story-reader"><h2>A door, not a throne.</h2><p>You defeated the six gods, recovered your memories, and broke the oath that banished you.</p><p>Pip is a demigod. He is still the tiny shopkeeper his family raised. Heaven can keep its crown. He has a home to protect.</p><p><strong>Divine story arc complete.</strong><br>Your weapons, family story, and expedition progress are preserved.</p><button data-action="close">Back to the family shop</button></div>');}
let betrayalPage=0,betrayalKind='arrival';
function betrayalPanel(kind='arrival',page=0){
  betrayalKind=kind;betrayalPage=page;game.mode='dialog';const paragraphs=BETRAYAL[kind],last=page===paragraphs.length-1;
  showPanel(`<div class="story-panel dialog-panel betrayal-reader"><h2>${kind==='arrival'?BETRAYAL.title:'The price of a promise'}</h2><p>${escapeHTML(paragraphs[page])}</p><div class="buttons"><button data-action="${last?(kind==='arrival'?'fight-rowan':'finish-betrayal'):'betrayal-next'}">${last?(kind==='arrival'?'Refuse the bargain · Fight':'Return home'):'Continue'}</button>${page?'<button class="secondary" data-action="betrayal-back">Previous</button>':''}</div><p class="footnote">${kind==='arrival'?'Rowan’s choice':'After the fight'} · ${page+1} / ${paragraphs.length}</p></div>`);
}
function betrayalEnding(){showPanel('<div class="story-panel story-reader"><h2>An empty place at the table.</h2><p>Rowan’s family is safe. The royal remnant’s prisoners are free.</p><p>Pip stopped the bargain without becoming its weapon. Rowan stays behind to help the prisoners and tell the truth. Trust will take longer to rebuild.</p><p><strong>The Broken Oath complete.</strong><br>Your swords, loot, and divine journey are preserved.</p><button data-action="explore">Back to the family shop</button></div>');}
function campaignEnding(){
  if(game.betrayalStage===6){betrayalEnding();return;}

  showPanel(`<div class="story-panel story-reader"><h2>A home worth saving.</h2><p>The false bounty is exposed, the dungeon heart is safe, and your family is home.</p><p>Rowan’s mum is recovering. Bones has his chair. Silk has a second till. Grandma has more presents than customers.</p><p>Pip is still small, still kind, and still wearing that oversized apron.</p><p><strong>Eight chapters complete.</strong><br>${game.opened.size} chests opened · ${game.inventory.filter(i=>i.skin).length} sword finds</p><div class="buttons"><button data-action="begin-betrayal">${game.betrayalStage?"Return to the oath hall":"Read Rowan’s letter"}</button><button data-action="replay-campaign" class="secondary">Replay the expedition</button><button data-action="explore" class="secondary">Explore with your family</button></div><p class="footnote">Your swords and loot carry into the next expedition.</p></div>`);
}
function event(e){
  if(['swing','power','loot','unlock','hurt','complete','dodge','healed','parried'].includes(e.type))audioCue(e.type);
  switch(e.type){
    case 'betrayal-arrival':betrayalPanel();save();break;
    case 'betrayal-started':closePanel();toast('Three stages. Face Rowan to parry; dodge sideways out of the marked rush.',{title:'The Broken Oath'});save();break;
    case 'rowan-phase':toast(ROWAN_PHASES[e.phase-1].line+' '+ROWAN_PHASES[e.phase-1].hint,{title:'Stage '+e.phase+' · '+ROWAN_PHASES[e.phase-1].name});save();break;
    case 'betrayal-resumed':closePanel();toast('Your current duel stage is saved.');save();break;
    case 'betrayal-cleared':toast('Approach Rowan and press G to hear the aftermath.',{title:'The fight is over'});save();break;
    case 'betrayal-aftermath':betrayalPanel('aftermath');save();break;
    case 'betrayal-complete':betrayalEnding();save();break;
    case 'started':adventureStarted=true;break;
    case 'portal-open':toast('The thunder falls silent. A doorway is rising from the lake. Walk onto the new stone path and press G.',{title:'Something remembers you'});save();break;
    case 'divine-arrival':divinePanel(e.episode,true);game.defeated.add(game.area.id+'-visited');save();break;
    case 'divine-lore':divinePanel(e.episode);save();break;
    case 'divine-complete':divineEnding();save();break;
    case 'area':background=groundCanvas(game.area);camera.x=clamp(game.player.x-240,0,WIDTH-canvas.width);camera.y=clamp(game.player.y-canvas.height/2-42,0,HEIGHT-canvas.height);clearInput();break;
    case 'message':toast(e.text);break;
    case 'loot':toast(e.loot.name,{title:e.loot.rarity==='rare'?'A rare find!':e.loot.rarity==='trash'?'Well… it’s something.':'Something useful.',rarity:e.loot.rarity});updateInventory();save();break;
    case 'unlock':toast(['','Your first spark! R unleashes a burst of strength.','Growing flame! Stronger swings and a bigger heart burst.','Full potential! Still small. Now impossibly strong.'][e.stage],{title:'Potential unlocked'});break;
    case 'special-start':clearInput();showPanel('<div class="cinematic" role="status" style="--cinematic-color:'+game.specialScene.color+'"><div class="cinematic-top">'+escapeHTML(e.skin==='scrap-king'?'Scrap King':SWORDS[e.skin]?.name??e.theme.name??'Heartsteel')+'</div><div class="cinematic-bottom"><strong>'+escapeHTML(e.theme.title)+'</strong><span>'+escapeHTML(e.theme.line)+'</span></div></div>');audioCue('power');break;
    case 'special-impact':audioCue('unlock');break;
    case 'special-end':closePanel();save();break;
    case 'parried':toast('Perfect parry! Strike now for a stronger counterattack.');break;
    case 'god-sword-earned':updateInventory();save();toast(e.loot.name+' · Added to your inventory. Equip it to use its divine moves.',{title:e.god+'’s sword',rarity:'rare'});break;
    case 'hammer-earned':updateInventory();save();toast('Thunderwake hammer obtained! T summons lightning. A portal has opened on the lake’s new stone path—press G to enter.',{title:'The Lake Tempest defeated',rarity:'rare'});break;
    case 'storm-summoned':toast('The Lake Tempest awakens. Dodge the marked lightning strikes!',{title:'Secret boss summoned'});save();break;
    case 'ability':audioCue('power');break;
    case 'equipped':updateInventory();save();break;
    case 'campaign-arrival':campaignPanel(e.episode,true);game.defeated.add(game.area.id+'-visited');save();break;
    case 'campaign-lore':campaignPanel(e.episode);save();break;
    case 'campaign-complete':campaignEnding();save();break;
    case 'defeated':if(e.id==='warden')toast('Uncle Bones is free. Talk to him near the golden chest.',{title:'The warden has fallen'});if(e.id==='archivist')toast('Collect your family portrait at the top of the archive.',{title:'The archive is open'});if(e.id==='collector')toast('Grandma is safe. Talk to her to bring everyone home.',{title:'The false bounty is broken'});save();break;
    case 'shop':shopPanel();break;
    case 'sold':shopPanel();toast(e.count?'Sold '+e.count+' pieces of junk for '+e.value+' coins.':'No junk to sell.');updateInventory();save();break;
    case 'bought':shopPanel();toast('A fresh potion. Silk insists you stay hydrated.');save();break;
    case 'uncle-locked':showPanel('<div class="story-panel dialog-panel"><div class="dialog-speaker">Uncle Bones</div><h2>A small complication.</h2><p>“Lovely to see you, Pip. I’d offer you a hug, but the enormous suit of armour says no.”</p><p>Defeat the iron warden to break the seal.</p><button data-action="close">I’ll get you out.</button></div>');break;
    case 'rescue':showPanel('<div class="story-panel dialog-panel"><div class="dialog-speaker">Uncle Bones</div><h2>You came for me.</h2><p>“Look at you. Still wearing that ridiculous apron. I knew there was something extraordinary in that little heart.”</p><p>“Now, can we go home? I’ve been standing for three hundred years.”</p><p>As the seal breaks, thunder rolls across a cloudless sky. Bones goes quiet. “The lake is whispering again. Keep your blade close, Pip. Some things hear steel before they hear words.”</p><div class="buttons"><button data-action="home">Bring him home</button><button data-action="close" class="secondary">Loot the chest first</button></div></div>');save();break;
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
    case 'death':if(game.area.id==='oathhall'){showPanel('<div class="story-panel"><h2>Get back on your feet.</h2><p>You retreat behind a fallen shield while the remnant regroups.</p><p>Your current duel stage, defeated soldiers, swords, and loot are saved.</p><button data-action="recover">Retry this stage · Full health</button></div>');break;}showPanel('<div class="story-panel"><h2>A stumble.<br>Not the end.</h2><p>Silk found you and dragged you home.<br>“You owe me a new apron, short stuff.”</p><p>Your loot and unlocked strength are safe.</p><button data-action="recover">Try again · Full health</button></div>');break;
    case 'complete':completePanel();save();break;
    case 'restored':adventureStarted=true;if(game.area.id==='oathhall'){if(game.betrayalStage===1)betrayalPanel();else if(game.betrayalStage===5)betrayalPanel('aftermath');else closePanel();}else if(game.area.divineStep){if(!game.defeated.has(game.area.id+'-read')){game.mode='dialog';divinePanel(GOD_EPISODES[game.area.divineStep-1],true);}else closePanel();}else if(game.campaignDone)campaignEnding();else if(game.storyDone&&!game.campaignStep)completePanel();else if(game.returned&&!game.chapter2Started)chapterPanel();else closePanel();updateInventory();break;
    case 'healed':toast('Restored 40 health.');save();break;
  }
  if(game)updateUI();
}
function newAdventure(){
  adventureStarted=false;game=new Adventure({onEvent:event});background=groundCanvas(game.area);camera.x=112;camera.y=140;updateInventory();updateUI();intro();
}
let inventoryReturn=null;
function openInventory(){
  if(!adventureStarted||!['playing','paused'].includes(game.mode))return;
  inventoryReturn={mode:game.mode,html:overlay.innerHTML};game.mode='inventory';
  const skins=[...new Set(game.inventory.filter(i=>i.skin).map(i=>i.skin))];
  const original=game.player.weapon>=12?'Dawnblade (classic)':game.player.weapon>=8?'Iron shortsword':'Battered sword';
  showPanel('<div class="story-panel inventory-panel"><h2>Your weapons</h2><p>Choose a weapon to equip. E closes your inventory.</p><p>'+game.player.coins+' coins · '+game.player.potions+' potions · '+game.inventory.length+' find'+(game.inventory.length===1?'':'s')+'</p><div class="weapon-picker"><button data-inventory-equip="normal">'+original+'</button>'+skins.map(id=>'<button data-inventory-equip="'+id+'"><img src="assets/'+id+'.png" width="32" height="48" alt=""><span>'+escapeHTML(SWORDS[id].name)+'<small>'+SWORDS[id].damage+' base damage · '+escapeHTML(WEAPON_KITS[id].moves.sweep.name)+' / '+escapeHTML(WEAPON_KITS[id].moves.guard.name)+' / '+escapeHTML(WEAPON_KITS[id].moves.charge.name)+'</small><small>'+escapeHTML(WEAPON_KITS[id].ultimate.name)+'</small></span></button>').join('')+(game.player.scrapKingOwned?'<button data-inventory-equip="scrap-king"><img src="assets/scrap-king.png" width="32" height="48" alt=""><span>Scrap King<small>999 damage · Admin</small></span></button>':'')+'</div><button data-action="inventory-close">Back to game</button></div>');refreshWeaponPicker();updateUI();
}
function refreshWeaponPicker(){for(const b of overlay.querySelectorAll('[data-inventory-equip]')){const equipped=b.dataset.inventoryEquip==='scrap-king'?game.player.scrapKing:!game.player.scrapKing&&(b.dataset.inventoryEquip==='normal'?!game.player.weaponSkin:game.player.weaponSkin===b.dataset.inventoryEquip);b.disabled=equipped;b.setAttribute('aria-pressed',String(equipped));}}
function closeInventory(){const previous=inventoryReturn;inventoryReturn=null;game.mode=previous.mode;if(previous.html)showPanel(previous.html);else closePanel();updateUI();}
function openAdmin(){
  if(game.mode==='admin'||game.mode==='special'||game.mode==='inventory')return;
  adminReturn={mode:game.mode,html:overlay.innerHTML};game.mode='admin';
  adminPanel();updateUI();
}
function adminPanel(refresh=false){
  if(refresh&&adminTools.unlocked&&overlay.querySelector('.admin-panel')){
    const disabled=!adventureStarted||adminReturn.mode==='dead';
    for(const action of ['equip','unequip','heal','coins','potential','special','charge']){
      const button=overlay.querySelector('[data-action="admin-'+action+'"]');
      button.disabled=disabled||(action==='equip'&&game.player.scrapKing)||(action==='unequip'&&!game.player.scrapKing)||(action==='potential'&&game.stage===3)||(action==='special'&&game.player.specialUnlocked);
    }
    overlay.querySelector('.admin-feedback').textContent=adminNotice;
    overlay.querySelector('.admin-note').textContent=(game.player.scrapKing?'Scrap King is equipped. ':'')+(game.player.specialUnlocked?'Press V with Scrap King for King’s Verdict. ':'')+'Tools affect only your save on this device.';
    return;
  }
  if(!adminTools.unlocked){
    showPanel(`<div class="story-panel admin-panel"><h2>Admin panel</h2><p>Enter your admin password.</p><form id="admin-login"><label for="admin-password">Password</label><input id="admin-password" type="password" inputmode="numeric" autocomplete="off" maxlength="32" required aria-describedby="admin-error"><p id="admin-error" role="alert" hidden></p><div class="buttons"><button type="submit">Unlock admin tools</button><button type="button" data-action="admin-close" class="secondary">Back to game</button></div></form><p class="admin-note">Tools affect only your save on this device.</p></div>`);return;
  }
  const unavailable=!adventureStarted||adminReturn.mode==='dead',disabled=unavailable?'disabled':'';
  showPanel(`<div class="story-panel admin-panel"><h2>Admin panel</h2><div class="admin-weapon"><img src="assets/scrap-king.png" width="32" height="48" alt="Scrap King, a steel cleaver with copper fittings"><div><strong>Scrap King</strong><p>999 damage · Admin sword</p></div></div>${unavailable?'<p>Begin or continue your adventure first. If Pip has fallen, bring him home first.</p>':''}<div class="admin-tools"><button data-action="admin-equip" ${disabled||game.player.scrapKing?'disabled':''}>Equip Scrap King</button><button data-action="admin-unequip" class="secondary" ${disabled||!game.player.scrapKing?'disabled':''}>Use normal sword</button><button data-action="admin-heal" ${disabled}>Heal + refill potions</button><button data-action="admin-coins" ${disabled}>Add 100 coins</button><button data-action="admin-potential" ${disabled||game.stage===3?'disabled':''}>Unlock full potential</button><button data-action="admin-charge" ${disabled}>Fill ultimate meter</button><button data-action="admin-special" ${disabled||game.player.specialUnlocked?'disabled':''}>Unlock King’s Verdict</button></div><form id="admin-grant"><label for="admin-item">Give yourself an item</label><div class="admin-grant-fields"><select id="admin-item" ${disabled}>${ADMIN_ITEMS.map(i=>'<option value="'+i.id+'">'+escapeHTML(i.name)+'</option>').join('')}</select><input id="admin-quantity" type="number" min="1" max="99" value="1" required aria-label="Item quantity" ${disabled}></div><button type="submit" ${disabled}>Give item</button></form><p class="admin-feedback" role="status">${escapeHTML(adminNotice)}</p><p class="admin-note">${game.player.scrapKing?'Scrap King is equipped. ':''}${game.player.specialUnlocked?'Press V with Scrap King for King’s Verdict. ':''}Tools affect only your save on this device.</p><div class="buttons"><button data-action="admin-close">Back to game</button><button data-action="admin-lock" class="secondary">Lock panel</button></div></div>`);
}
function closeAdmin(){
  const previous=adminReturn;adminReturn=null;game.mode=previous.mode;
  if(previous.mode==='title')intro();else if(previous.html.includes('data-action="sell"'))shopPanel();else if(previous.mode==='complete'){if(game.campaignDone)campaignEnding();else completePanel();}else if(previous.html)showPanel(previous.html);else closePanel();
  updateUI();
}
overlay.addEventListener('submit',e=>{
  if(e.target.id==='admin-grant'){e.preventDefault();if(game.mode!=='admin'||!adventureStarted)return;const ok=adminTools.grant($('admin-item').value,Number($('admin-quantity').value),game);adminNotice=ok?'Item added to your satchel.':'Could not give that item. Check the quantity and make room in your satchel.';if(ok){save();updateInventory();}adminPanel(true);updateUI();return;}
  if(e.target.id!=='admin-login')return;e.preventDefault();
  if(adminTools.unlock($('admin-password').value)){adminPanel();updateUI();}
  else{$('admin-error').hidden=false;$('admin-error').textContent='Wrong password. Try again.';$('admin-password').setAttribute('aria-invalid','true');$('admin-password').focus();}
});
function pause(){
  if(game.mode==='paused'){game.mode='playing';closePanel();updateUI();return;}
  if(game.mode!=='playing')return;
  game.mode='paused';save();showPanel('<div class="story-panel"><h2>Take a breather.</h2><p>Even a one-in-a-million hero needs a snack break.</p><button data-action="resume">Back to adventure</button><p class="footnote">Your progress is saved on this device.</p></div>');updateUI();
}
function help(){
  if(game.mode==='help'||game.mode==='admin'||game.mode==='inventory')return;
  previousMode=game.mode;game.mode='help';
  showPanel(`<div class="story-panel instructions"><h2>A little field guide</h2><p>Rescue Uncle Bones, discover your customer’s next bounty, and protect Grandma, then save the dungeon heart across eight chapters. Defeat the secret lightning god to open a lake portal into three more chapters, with six gods and the truth of Pip’s banishment.</p><dl><dt><kbd>W A S D</kbd> / Arrows</dt><dd>Move and face your next target.</dd><dt><kbd>SPACE</kbd></dt><dd>Wind up, strike forward, and recover. Hold for repeated swings. Most strikes land in front. Each weapon has its own reach, speed and effect: fire burns, ice slows, lightning chains, and Bloodmoon steals health.</dd><dt><kbd>E</kbd></dt><dd>Open your inventory and change weapons.</dd><dt><kbd>G</kbd></dt><dd>Open chests, talk, and use doorways.</dd><dt><kbd>SHIFT</kbd></dt><dd>Dodge an enemy’s wind-up. You can cancel your own swing to dodge.</dd><dt><kbd>F</kbd></dt><dd>Parry just before a strike. A perfect block staggers the enemy and strengthens your next swing.</dd><dt><kbd>Z</kbd></dt><dd>Open the admin panel.</dd><dt><kbd>V</kbd></dt><dd>Use your sword’s ultimate when the meter is full. Scrap King’s King’s Verdict requires an Admin unlock.</dd><dt><kbd>R</kbd></dt><dd>Heart burst. Unlock it by defeating the practice armour.</dd><dt><kbd>U</kbd></dt><dd>Hold to charge your ultimate while standing still. Hits and parries charge it too.</dd><dt><kbd>J K L</kbd></dt><dd>Your weapon’s attack, defence and movement skills unlock at potential levels 1, 2 and 3. Equip another sword to change all six moves.</dd><dt><kbd>C X B</kbd></dt><dd>Your weapon’s recovery, area and finisher skills unlock at the same three levels. The ability dock shows their names.</dd><dt><kbd>T</kbd></dt><dd>Summon lightning with Thunderwake hammer.</dd><dt><kbd>H</kbd></dt><dd>Drink a potion to heal 40 health.</dd><dt><kbd>ESC</kbd></dt><dd>Pause or resume.</dd></dl><p>Wooden chests: 5% rare · Iron: 15% rare · Golden: 30% rare. Named swords are very rare: 0.15% wood, 0.45% iron, 0.9% gold for any of the eleven skins. Walk to the family-shop door and press G to enter. Sell trash and buy mystery chests inside. Touch controls work too.</p><button data-action="help-close">Got it.</button></div>`);updateUI();
}
overlay.addEventListener('click',e=>{
  const choice=e.target.closest('[data-inventory-equip]');
  if(choice&&!choice.disabled&&game.mode==='inventory'){
    if(choice.dataset.inventoryEquip==='scrap-king'&&game.player.scrapKingOwned){game.player.scrapKing=true;updateInventory();save();}
    else if(choice.dataset.inventoryEquip==='normal'){game.player.scrapKing=false;game.player.weaponSkin=null;updateInventory();save();}
    else game.equipSword(choice.dataset.inventoryEquip);
    refreshWeaponPicker();updateUI();return;
  }
  const button=e.target.closest('button[data-action]');if(!button||button.disabled)return;
  switch(button.dataset.action){
    case 'advance-divine':game.advanceDivine();break;
    case 'begin-campaign':game.beginCampaign();break;
    case 'advance-campaign':game.advanceCampaign();break;
    case 'begin-betrayal':game.beginBetrayal();break;
    case 'betrayal-next':betrayalPanel(betrayalKind,Math.min(BETRAYAL[betrayalKind].length-1,betrayalPage+1));break;
    case 'betrayal-back':betrayalPanel(betrayalKind,Math.max(0,betrayalPage-1));break;
    case 'fight-rowan':game.startBetrayalDuel();break;
    case 'finish-betrayal':game.finishBetrayal();break;
    case 'replay-campaign':game.replayCampaign();break;
    case 'mystery-chest':if(game.buyMysteryChest()){shopPanel();updateInventory();save();}break;
    case 'inventory-close':closeInventory();break;
    case 'admin-close':closeAdmin();break;
    case 'admin-lock':adminTools.lock();adminPanel();break;
    case 'admin-equip':case 'admin-unequip':case 'admin-heal':case 'admin-coins':case 'admin-potential':case 'admin-special':case 'admin-charge':
      if(game.mode==='admin'&&adventureStarted&&adminTools.run(button.dataset.action.slice(6),game)){adminNotice=button.textContent+' — done.';save();updateInventory();adminPanel(true);updateUI();}break;
    case 'start':game.start();closePanel();save();break;
    case 'continue':if(saved){game.restore(saved);}break;
    case 'new-confirm':game.mode='confirm';showPanel('<div class="story-panel"><h2>A fresh adventure?</h2><p>This replaces the saved adventure on this device. Your current loot and progress will be reset.</p><div class="buttons"><button data-action="new" class="secondary">Start fresh</button><button data-action="cancel-new">Keep my adventure</button></div></div>');break;
    case 'cancel-new':if(game.storyDone&&!game.campaignStep||game.campaignDone){game.mode='complete';if(game.campaignDone)campaignEnding();else completePanel();}else intro();break;
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
    case 'help-close':game.mode=previousMode;if(previousMode==='title')intro();else if(previousMode==='paused'){game.mode='playing';pause();}else if(previousMode==='dialog'){game.mode='playing';closePanel();}else if(previousMode==='complete'){if(game.campaignDone)campaignEnding();else completePanel();}else if(previousMode==='dead'){game.mode='dead';event({type:'death'});}else closePanel();break;
  }
  updateUI();
});
const movement={KeyW:'up',ArrowUp:'up',KeyS:'down',ArrowDown:'down',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right'};
document.addEventListener('keydown',e=>{
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.code==='KeyE'&&!e.repeat&&!e.target.closest('input,select,textarea')){e.preventDefault();if(game.mode==='inventory')closeInventory();else openInventory();return;}
  if(e.code==='KeyZ'&&!e.repeat&&!e.target.closest('input,select,textarea')){e.preventDefault();if(game.mode==='admin')closeAdmin();else openAdmin();return;}
  if(e.code==='Tab'&&overlay.children.length){const buttons=[...overlay.querySelectorAll('input:not(:disabled),select:not(:disabled),button:not(:disabled)')];const first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}return;}
  if(e.code==='Escape'){e.preventDefault();if(game.mode==='inventory'){closeInventory();}else if(game.mode==='admin'){closeAdmin();}else if(game.mode==='help')overlay.querySelector('[data-action="help-close"]').click();else if(game.mode==='dialog'&&game.area.id==='oathhall'&&game.betrayalStage===1){betrayalPanel('arrival',betrayalPage);}else if(game.mode==='dialog'){game.mode='playing';closePanel();updateUI();}else pause();return;}
  if(game.mode!=='playing'||e.target.closest('input,select,textarea'))return;
  if(e.code==='Space'&&e.target.closest('button'))return;
  if(movement[e.code]){e.preventDefault();input[movement[e.code]]=true;}
  if(e.code==='KeyU'){e.preventDefault();input.charge=true;}
  if(e.code==='Space'){e.preventDefault();input.attack=true;game.attack();}
  if(!e.repeat){if(e.code==='KeyG'){e.preventDefault();game.interact();}if(e.code==='KeyT'){e.preventDefault();game.lightning();}if(e.code==='KeyC'){e.preventDefault();game.ability('mend');}if(e.code==='KeyX'){e.preventDefault();game.ability('cyclone');}if(e.code==='KeyB'){e.preventDefault();game.ability('stars');}if(e.code==='KeyJ'){e.preventDefault();game.ability('sweep');}if(e.code==='KeyK'){e.preventDefault();game.ability('guard');}if(e.code==='KeyL'){e.preventDefault();game.ability('charge');}if(e.code==='KeyF'){e.preventDefault();game.parry();}if(e.code==='KeyR'){e.preventDefault();game.power();}if(e.code==='KeyV'){e.preventDefault();game.special({reducedMotion});}if(e.code==='KeyH'){e.preventDefault();game.heal();}if(e.code.startsWith('Shift')){e.preventDefault();game.dodge();}}
});
document.addEventListener('keyup',e=>{if(movement[e.code])input[movement[e.code]]=false;if(e.code==='Space')input.attack=false;if(e.code==='KeyU')input.charge=false;});
window.addEventListener('blur',()=>{clearInput();if(game.mode==='playing')pause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInput();save();if(game.mode==='playing')pause();}});
window.addEventListener('pagehide',save);
for(const button of document.querySelectorAll('[data-move]')){
  button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);if(game.mode==='playing')input[button.dataset.move]=true;});
  const stop=()=>input[button.dataset.move]=false;button.addEventListener('pointerup',stop);button.addEventListener('pointercancel',stop);button.addEventListener('lostpointercapture',stop);
}
$('touch-attack').addEventListener('pointerdown',e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);if(game.mode==='playing'){input.attack=true;game.attack();}});
for(const kind of ['pointerup','pointercancel','lostpointercapture'])$('touch-attack').addEventListener(kind,()=>input.attack=false);
$('touch-interact').onclick=()=>game.interact();$('touch-dodge').onclick=()=>game.dodge();$('touch-parry').onclick=()=>game.parry();$('heal-action').onclick=()=>{game.heal();canvas.focus({preventScroll:true});};$('power-action').onclick=()=>{game.power();canvas.focus({preventScroll:true});};
$('inventory').addEventListener('click',e=>{const button=e.target.closest('[data-equip]');if(button&&adventureStarted&&game.mode==='playing'){game.equipSword(button.dataset.equip);updateUI();canvas.focus({preventScroll:true});}});
$('special-action').onclick=()=>{game.special({reducedMotion});canvas.focus({preventScroll:true});};
$('channel-action').addEventListener('pointerdown',e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);if(game.mode==='playing')input.charge=true;});
for(const event of ['pointerup','pointercancel','lostpointercapture'])$('channel-action').addEventListener(event,()=>input.charge=false);
$('inventory-toggle').onclick=()=>game.mode==='inventory'?closeInventory():openInventory();
$('lightning-action').onclick=()=>{game.lightning();canvas.focus({preventScroll:true});};
$('parry-action').onclick=()=>{game.parry();canvas.focus({preventScroll:true});};
for(const kind of ['sweep','guard','charge','mend','cyclone','stars'])$(kind+'-action').onclick=()=>{game.ability(kind);canvas.focus({preventScroll:true});};
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{toast('Full screen is unavailable in this browser. You can expand the browser window instead.');}};
document.addEventListener('fullscreenchange',()=>{$('fullscreen').setAttribute('aria-label',document.fullscreenElement?'Exit full screen':'Enter full screen');$('fullscreen-label').textContent=document.fullscreenElement?'Exit full screen':'Full screen';});
$('admin').onclick=openAdmin;$('pause').onclick=pause;$('help').onclick=help;
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
