const fs=require('fs');
const s = fs.readFileSync('public/recipes.json','utf8');
let objs=[];
let idx=0;
while (true) {
  const start = s.indexOf('{', idx);
  if (start === -1) break;
  let depth = 0;
  let i = start;
  for (; i < s.length; i++) {
    if (s[i] === '{') depth++;
    else if (s[i] === '}') depth--;
    if (depth === 0) break;
  }
  if (depth !== 0) break;
  const sub = s.slice(start, i+1);
  try {
    const o = JSON.parse(sub);
    if (o && typeof o.id !== 'undefined') objs.push(o);
  } catch (e) {
    // ignore parse errors
  }
  idx = i+1;
}
const map = new Map();
for (const o of objs) map.set(o.id, o);
const arr = Array.from(map.values()).sort((a,b)=>a.id-b.id);
fs.writeFileSync('public/recipes.recovered.json', JSON.stringify(arr, null, 2));
console.log('WROTE', arr.length, 'objects');
