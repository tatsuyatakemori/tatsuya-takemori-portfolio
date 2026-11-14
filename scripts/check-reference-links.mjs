import fs from 'node:fs';
import {researchReferences} from '../research-references.mjs';
const urls=[...new Set(Object.values(researchReferences).flatMap(r=>[...r.papers,...r.sources].flatMap(s=>[s.url,...(s.readUrl?[s.readUrl]:[]),...(s.links||[]).map(l=>l.url)])))];
const result=[];
for(const url of urls){try{const r=await fetch(url,{signal:AbortSignal.timeout(12000)});let title;
if(r.headers.get('content-type')?.includes('text/html')){const bytes=await r.arrayBuffer();const text=new TextDecoder(url.includes('seesaawiki.jp')?'euc-jp':'utf-8').decode(bytes);title=text.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();}else await r.body?.cancel();
result.push({url,status:r.status,final:r.url,title});console.log(JSON.stringify(result.at(-1)));
}catch(e){result.push({url,error:e.message});console.log(JSON.stringify(result.at(-1)));}}
fs.writeFileSync(new URL('../docs/reference-link-check-2026-11-14.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
