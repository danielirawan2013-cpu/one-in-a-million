export const GOD_SWORD_IDS=['rimecrown','oathbreaker','solstice','tidemirror','recollection','heavensfall'];
export const GOD_SWORD_DROPS={skythreshold:'rimecrown',oathtribunal:'oathbreaker',sunforge:'solstice',mooncourt:'tidemirror',exilearchive:'recollection',crownsummit:'heavensfall'};
export const SWORDS=Object.freeze({
  rimecrown:{name:'Rimecrown · Rimewyrm’s sword',damage:30,color:'#b4edf1',god:'Rimewyrm'},
  oathbreaker:{name:'Oathbreaker · Oras’s sword',damage:31,color:'#e5c899',god:'Oras'},
  solstice:{name:'Solstice · Aurel’s sword',damage:33,color:'#f6a157',god:'Aurel'},
  tidemirror:{name:'Tidemirror · Nym’s sword',damage:32,color:'#b9c9f4',god:'Nym'},
  recollection:{name:'Recollection · Mnemos’s sword',damage:34,color:'#d0a8e5',god:'Mnemos'},
  heavensfall:{name:'Heavensfall · Veyr’s sword',damage:37,color:'#f1d38d',god:'Veyr'},
  thunderhammer:{name:'Thunderwake hammer',damage:28,color:'#91dce9'},
  dawnblade:{name:'Dawnblade',damage:18,color:'#f3d17c'},
  moonfang:{name:'Moonfang',damage:19,color:'#b8e4f5'},
  emberfang:{name:'Emberfang',damage:21,color:'#f6a157'},
  frostbite:{name:'Frostbite',damage:20,color:'#b4edf1'},
  thornheart:{name:'Thornheart',damage:20,color:'#b8cf86'},
  voidbreaker:{name:'Voidbreaker',damage:25,color:'#c5a2ed'},
  stormsplitter:{name:'Stormsplitter',damage:23,color:'#f7dd85'},
  dragonfang:{name:'Dragonfang',damage:24,color:'#efd9ad'},
  bloodmoon:{name:'Bloodmoon',damage:22,color:'#e58a99'},
  starfall:{name:'Starfall',damage:26,color:'#d3bbf5'},
  ghostveil:{name:'Ghostveil',damage:21,color:'#c5eada'}
});
export const SWORD_IDS=Object.keys(SWORDS).filter(id=>id!=='thunderhammer'&&!GOD_SWORD_IDS.includes(id));
// 3% of rare rolls: 0.15% wood, 0.45% iron, 0.9% gold for any named sword.
export const SWORD_CHANCE_WITHIN_RARE=.03;
