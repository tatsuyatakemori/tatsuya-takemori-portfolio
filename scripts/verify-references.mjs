import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {researchReferences} from '../research-references.mjs';
import {researchDetails} from '../research-details.mjs';
const root=new URL('../',import.meta.url);
const context={window:{}};vm.runInNewContext(fs.readFileSync(new URL('data.js',root),'utf8'),context);
const data=context.window.PORTFOLIO_DATA;
let videoCount=0,referenceCount=0;
for(const [id,library] of Object.entries(researchReferences)){
  const html=fs.readFileSync(new URL(`research/${id}/index.html`,root),'utf8');
  const refs=[...library.papers,...library.sources];
  const ids=refs.map(r=>r.id);
  assert.equal(new Set(ids).size,ids.length,`Duplicate references: ${id}`);
  for(const r of refs){
    assert.equal(html.split(`id="ref-${r.id}"`).length-1,1,`Missing/duplicate source: ${id}/${r.id}`);
    assert(r.note && r.label,`Missing reading guide: ${id}/${r.id}`);
  }
  for(const [section,keys] of Object.entries(library.sectionRefs)){
    assert(researchDetails[id].sections.some(s=>s.id===section),`Wrong section: ${id}/${section}`);
    for(const key of keys)assert(ids.includes(key),`Wrong citation: ${id}/${key}`);
  }
  for(const url of researchDetails[id].publicationUrls)assert(library.papers.some(p=>p.url===url),`Lost paper: ${url}`);
  for(const v of library.videos){
    assert(/^[\w-]{11}$/.test(v.id),`Bad video ID: ${v.id}`);
    const iframe=html.match(new RegExp(`<iframe[^>]+src="https://www.youtube-nocookie.com/embed/${v.id}"[^>]*>`))?.[0];
    assert(iframe,`Missing embed: ${v.id}`);
    assert(iframe.includes('title="') && iframe.includes('loading="lazy"') && iframe.includes('referrerpolicy="strict-origin-when-cross-origin"') && iframe.includes('allowfullscreen'),`Missing embed attributes: ${v.id}`);
    assert(html.includes(`https://www.youtube.com/watch?v=${v.id}`),`Missing video fallback: ${v.id}`);
    for(const key of v.refs)assert(ids.includes(key),`Wrong video citation: ${v.id}/${key}`);
  }
  // Check nesting independently of the template (including optional video disclosure).
  const stack=[];const voids=new Set(['meta','link','img','br','hr','input','wbr']);
  for(const match of html.matchAll(/<(\/?)([a-z][\w-]*)\b[^>]*>/gi)){
    const [,closing,tag]=match;
    if(voids.has(tag))continue;
    if(closing)assert.equal(stack.pop(),tag,`Unbalanced ${tag} in ${id}`);else stack.push(tag);
  }
  assert.equal(stack.length,0,`Unclosed tags in ${id}`);
  assert(!/<details\b|more-videos/.test(html),`Videos must not be collapsed: ${id}`);
  const renderedSections=[...html.matchAll(/<section\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/section>/g)];
  for(const video of library.videos){
    const section=video.section==='overview'?'videos':video.section;
    assert(renderedSections.find(m=>m[1]===section)?.[2].includes(`id="video-${video.id}"`),`Video is not beside its explanation: ${id}/${video.id}`);
    assert.equal(html.split(`id="video-${video.id}"`).length-1,1,`Duplicate video: ${id}/${video.id}`);
  }
  videoCount+=library.videos.length;referenceCount+=refs.length;
}
const robots=researchDetails.robotrace.sections;
assert(robots.find(s=>s.id==='omnimo').paragraphs.some(p=>p.includes('初代ではコース記憶を行わず')));
assert(robots.find(s=>s.id==='catchrobo').paragraphs.some(p=>p.includes('5人チーム')));
assert(data.profile.introduction.startsWith('ロボティクスを土台に、メカ・回路・計測・制御を横断して制作。'));
console.log(`PASS: ${referenceCount} annotated references, ${videoCount} visible embeds beside relevant text, valid citations and balanced HTML.`);
