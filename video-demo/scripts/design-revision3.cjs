const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname,'..');
const target = path.join(root,'design/revision3.json');
const previous = fs.existsSync(target) ? JSON.parse(fs.readFileSync(target,'utf8')) : null;
const seeds = previous?.variants.map(v=>v.seed) ?? ['A','B','C'].map(()=>{const b=crypto.randomBytes(141);b[0]|=128;return b.toString('hex')});
const draw = (seed,key)=>crypto.createHash('sha256').update(Buffer.from(seed,'hex')).update('revision3:'+key).digest().readUInt32BE(0)/2**32;
const specs = [
  {id:'A',name:'桌面长镜头',strategy:'continuous',bpm:96,style:'breaks',key:40,palette:{background:'#f7faff',surface:'#e3edfa',accent:'#1366bb',ink:'#19344f'},
    shots:[['desktop',12],['types',11],['search',9],['formatting',7],['queue',9],['drag',7],['local',4],['closing',5]]},
  {id:'B',name:'节拍广告',strategy:'kinetic',bpm:144,style:'electro',key:38,palette:{background:'#fffaf0',surface:'#ffe4bb',accent:'#c64b24',ink:'#482e23'},
    shots:[['desktop',12],['types',18],['formatting',10],['search',10],['categories',8],['preview',10],['queue',12],['local',8],['closing',8]]},
  {id:'C',name:'分镜叙事',strategy:'split',bpm:120,style:'pulse',key:43,palette:{background:'#f3faf6',surface:'#d9ede3',accent:'#127664',ink:'#1b453c'},
    shots:[['desktop',14],['types',14],['queue',10],['drag',8],['search',10],['formatting',6],['settings',4],['local',6],['closing',8]]},
];
const titles={desktop:'呼出，选择，直接粘贴',types:'文本 · 图片 · 链接 · 文件 · 颜色',search:'记得一点，就能找到',formatting:'保留原有格式',queue:'连续粘贴，一气呵成',drag:'跨应用拖拽',categories:'分类、标签与收藏',preview:'粘贴前，先预览',settings:'按你的习惯工作',local:'记录留在本机',closing:'GPL-3.0 开源'};
const variants=specs.map((spec,i)=>{
  const seed=seeds[i];let beat=0;
  const order=[0,1,2,3,4];
  for(let j=4;j>0;j--){const k=Math.floor(draw(seed,'type-order:'+j)*(j+1));[order[j],order[k]]=[order[k],order[j]]}
  const shots=spec.shots.map(([kind,beats],index)=>{
    const fromBeat=beat;beat+=beats;
    return {kind,title:titles[kind],fromBeat,beats,from:Math.round(fromBeat*1800/spec.bpm),to:Math.round(beat*1800/spec.bpm),cameraBias:(draw(seed,'camera:'+kind)-.5)*14,alignment:Math.floor(draw(seed,'alignment:'+kind)*2),index};
  });
  if(shots.at(-1).to!==1200)throw new Error('Invalid 40 second timeline');
  return {...spec,seed,seedBits:1128,typeOrder:order,music:{style:spec.style,bpm:spec.bpm,key:spec.key,hatVariant:Math.floor(draw(seed,'hats')*4),bassVariant:Math.floor(draw(seed,'bass')*3)},shots};
});
const data={revision:3,seedPolicy:'Three distinct editorial structures are constraints. Independent 141-byte seeds drive card order, framing, alignment and music voicing. Native UI geometry and motion are never randomized.',variants};
fs.writeFileSync(target,JSON.stringify(data,null,2));
fs.writeFileSync(path.join(root,'src/generated/revision3.ts'),'export const revision3 = '+JSON.stringify(variants)+' as const;\n');
console.log(variants.map(v=>({id:v.id,strategy:v.strategy,bpm:v.bpm,typeOrder:v.typeOrder,seconds:v.shots.map(s=>[s.kind,(s.to-s.from)/30])})));
