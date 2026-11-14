import fs from 'node:fs';
import {researchReferences} from '../research-references.mjs';
const ids=[...new Set(Object.values(researchReferences).flatMap(r=>r.videos.map(v=>v.id)))];
const results=[];
for(const id of ids){
  try {
    const response=await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`,{signal:AbortSignal.timeout(15000)});
    const body=await response.text();
    let info;try{info=JSON.parse(body)}catch{}
    const row={id,status:response.status,title:info?.title,author:info?.author_name,iframe:info?.html};
    results.push(row);console.log(JSON.stringify(row));
  } catch(error) {results.push({id,error:error.message});console.log(id,error.message);}
}
fs.writeFileSync(new URL('../docs/video-source-check-2026-11-14.json',import.meta.url),JSON.stringify(results,null,2)+'\n');
