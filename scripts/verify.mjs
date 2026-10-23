import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
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
assert.equal((html.match(/class="patent"/g)||[]).length,d.patents.length,'Missing patent entries');
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
