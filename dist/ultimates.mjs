export const ULTIMATES={
  thunderhammer:{title:'Tempest Judgement',motif:'bolt',line:'The storm is in your hands.'},
  dawnblade:{title:'Daybreak Judgement',motif:'sun',line:'A dawn worth fighting for.'},
  moonfang:{title:'Lunar Judgement',motif:'moon',line:'The night remembers your name.'},
  emberfang:{title:'Inferno Judgement',motif:'flame',line:'A small spark. A roaring answer.'},
  frostbite:{title:'Glacial Judgement',motif:'ice',line:'Even a storm can stand still.'},
  thornheart:{title:'Briar Judgement',motif:'leaf',line:'Roots protect what they love.'},
  voidbreaker:{title:'Void Judgement',motif:'void',line:'There is light beyond the silence.'},
  stormsplitter:{title:'Storm Judgement',motif:'bolt',line:'Let the sky answer.'},
  dragonfang:{title:'Dragon Judgement',motif:'fang',line:'The strength of your family.'},
  bloodmoon:{title:'Crimson Judgement',motif:'moon',line:'A red moon rises.'},
  starfall:{title:'Celestial Judgement',motif:'star',line:'A million stars. One little hero.'},
  ghostveil:{title:'Phantom Judgement',motif:'wisp',line:'The unseen stand beside you.'},
  'scrap-king':{title:'King’s Verdict',motif:'scrap',line:'Every scrap has a purpose.'},
  battered:{title:'Underdog Awakening',motif:'wisp',line:'A battered blade. An unbroken heart.',name:'Battered sword',color:'#d9e1cb'},
  ironshort:{title:'Ironheart Verdict',motif:'fang',line:'Ordinary steel. Extraordinary courage.',name:'Iron shortsword',color:'#b4cbd7'},
  classicdawn:{title:'First-Light Reckoning',motif:'sun',line:'The first blade that believed in you.',name:'Dawnblade (classic)',color:'#f3cd87'}
};

export function ultimateKey(p){return p.scrapKing?'scrap-king':p.weaponSkin??(p.weapon>=12?'classicdawn':p.weapon>=8?'ironshort':'battered');}
