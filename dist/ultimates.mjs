export const ULTIMATES={
  rimecrown:{title:'Rimewyrm’s Last Winter',motif:'ice',line:'The dragon’s winter answers your hand.'},
  oathbreaker:{title:'No More Binding Oaths',motif:'fang',line:'A promise freely chosen.'},
  solstice:{title:'A Million Dawns',motif:'sun',line:'Every stolen dawn goes home.'},
  tidemirror:{title:'The True Reflection',motif:'moon',line:'Let the false reflections break.'},
  recollection:{title:'Every Life Remembered',motif:'wisp',line:'No one is erased again.'},
  heavensfall:{title:'Heaven Without Chains',motif:'star',line:'No crown decides who deserves a home.'},
  thunderhammer:{title:'Skybreak Smash',motif:'bolt',line:'The storm is in your hands.'},
  dawnblade:{title:'Daybreak Cannon',motif:'sun',line:'A dawn worth fighting for.'},
  moonfang:{title:'Crescent Return',motif:'moon',line:'The night remembers your name.'},
  emberfang:{title:'Cinder Faultline',motif:'flame',line:'A small spark. A roaring answer.'},
  frostbite:{title:'Eightfold Glacier',motif:'ice',line:'Even a storm can stand still.'},
  thornheart:{title:'Roots of the Guardian',motif:'leaf',line:'Roots protect what they love.'},
  voidbreaker:{title:'Event Horizon',motif:'void',line:'There is light beyond the silence.'},
  stormsplitter:{title:'Chainstorm',motif:'bolt',line:'Let the sky answer.'},
  dragonfang:{title:'Elder Dragon’s Breath',motif:'fang',line:'The strength of your family.'},
  bloodmoon:{title:'Crimson Harvest',motif:'moon',line:'A red moon rises.'},
  starfall:{title:'Meteor Shower',motif:'star',line:'A million stars. One little hero.'},
  ghostveil:{title:'Phantom Company',motif:'wisp',line:'The unseen stand beside you.'},
  'scrap-king':{title:'King’s Verdict',motif:'scrap',line:'Every scrap has a purpose.'},
  battered:{title:'Underdog Awakening',motif:'wisp',line:'A battered blade. An unbroken heart.',name:'Battered sword',color:'#d9e1cb'},
  ironshort:{title:'Ironheart Lunge',motif:'fang',line:'Ordinary steel. Extraordinary courage.',name:'Iron shortsword',color:'#b4cbd7'},
  classicdawn:{title:'Guardian’s Sunrise',motif:'sun',line:'The first blade that believed in you.',name:'Dawnblade (classic)',color:'#f3cd87'}
};

export function ultimateKey(p){return p.scrapKing?'scrap-king':p.weaponSkin??(p.weapon>=12?'classicdawn':p.weapon>=8?'ironshort':'battered');}
