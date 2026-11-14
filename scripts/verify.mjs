import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {researchDetails} from '../research-details.mjs';
import {researchPath} from './research-pages.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const context = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'data.js'),'utf8'),context);
const d = context.window.PORTFOLIO_DATA;
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'Duplicate HTML ids');
assert.equal((html.match(/class="work"/g)||[]).length,d.works.length,'Missing work cards');
assert.equal((html.match(/class="research-work"/g)||[]).length,d.researchWorks.length,'Missing research entries');
assert.equal((html.match(/class="appearance"/g)||[]).length,d.talks.length+d.mediaAppearances.length,'Missing talks or media appearances');
assert.equal((html.match(/class="record patent"/g)||[]).length,d.patents.length,'Missing patent entries');
const publicationCount = d.publications.length+d.reviewArticles.length+d.books.length+d.internationalConferences.length+d.theses.length+d.awards.length;
assert.equal((html.match(/class="publication"/g)||[]).length,publicationCount,'Missing bibliography or award entries');
assert(!html.includes('unpkg.com') && !html.includes('microlink.io'),'Runtime CDN/API dependency');
assert(!html.includes('\ufffd'),'Invalid Unicode replacement character');
for (const [_, ref] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  if (ref.startsWith('#')) assert(ids.includes(ref.slice(1)),`Broken anchor: ${ref}`);
  else if (!ref.startsWith('https://')) assert(fs.existsSync(path.join(root,ref.split(/[?#]/)[0])),`Missing local asset: ${ref}`);
}
const manifest = JSON.parse(fs.readFileSync(path.join(root,'assets/images.json'),'utf8'));
for (const [id,m] of Object.entries(manifest)) {
  assert(m.width > 0 && m.height > 0,`Invalid image dimensions: ${id}`);
  assert.equal(fs.statSync(path.join(root,m.path)).size,m.bytes,`Image size mismatch: ${id}`);
  const bytes=fs.readFileSync(path.join(root,m.path));
  assert.equal(bytes.toString('ascii',0,4),'RIFF');
  assert.equal(bytes.toString('ascii',8,12),'WEBP');
}
console.log(`PASS: ${d.works.length} work cards, ${d.researchWorks.length} research projects, ${Object.keys(manifest).length} WebP files, unique ids, local assets and anchors.`);

const documents = ['index.html', ...d.researchWorks.map(w=>researchPath(w.id))];
const decode = s => s.replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
for (const file of documents) {
  const contents = fs.readFileSync(path.join(root,file),'utf8');
  const pageIds = [...contents.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(pageIds).size,pageIds.length,`Duplicate ids: ${file}`);
  assert.equal((contents.match(/<h1\b/g)||[]).length,1,`Expected one page title: ${file}`);
  for (const [,attribute] of contents.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const ref=decode(attribute);
    if (/^https:\/\//.test(ref)) continue;
    assert(!/^[a-z]+:/i.test(ref),`Unexpected URL scheme: ${ref}`);
    const [pathname,hash]=ref.split('#');
    const target=pathname.split('?')[0];
    const dest=target ? path.resolve(root,path.dirname(file),decodeURIComponent(target)) : path.join(root,file);
    assert(!path.relative(root,dest).startsWith('..'),`Local link escapes site: ${ref}`);
    assert(fs.existsSync(dest),`Missing target in ${file}: ${ref}`);
    if(hash){
      const targetHtml=fs.readFileSync(dest,'utf8');
      assert(targetHtml.includes(`id="${decodeURIComponent(hash)}"`),`Missing anchor in ${file}: ${ref}`);
    }
  }
}
for(const work of d.researchWorks){
  const file=researchPath(work.id), body=fs.readFileSync(path.join(root,file),'utf8');
  assert(html.includes(`href="${file}"`),`No entry point for ${work.id}`);
  assert(body.includes(`../../index.html#research-${work.id}`),`No return link for ${work.id}`);
  assert(!body.includes('<script'),`Research content should work without JavaScript: ${work.id}`);
  for(const section of researchDetails[work.id].sections)assert(body.includes(`id="${section.id}"`));
  for(const media of work.media)assert(body.includes(media.kind==='youtube' ? `watch?v=${media.id}` : media.url.replace(/&/g,'&amp;')),`Lost research resource: ${work.id}`);
}
console.log(`PASS: ${documents.length} pages, complete research resources, cross-page links, anchors and local assets.`);
