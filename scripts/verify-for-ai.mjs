import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('for-ai/tatsuya-takemori.md'), html=read('for-ai/index.html');
assert.equal(read('for-ai/tatsuya-takemori.txt'),source);
const home=read('index.html');
assert(home.includes('href="#for-ai" data-section="for-ai"'));
assert(home.includes('<section id="for-ai"'));
assert(home.includes('href="for-ai/tatsuya-takemori.md"'));
const {renderForAI}=await import('./for-ai-page.mjs');
assert(home.includes('<article class="ai-document">'+renderForAI(source,{embedded:true})+'</article>'));
assert.equal((home.match(/<h1\b/g)||[]).length,1);
for(const text of ['本人確認用','編集メモ','未公開','.preview/','enterprise.slack.com','mail.google.com','C:/Users','C:\\Users','noindex','関わった作品の完成形を、そのまま','AIを使う以前にも、制作に関する情報を','これらは、組織全体の効率向上や']){
 assert(!source.includes(text)&&!html.includes(text),`Private or removed material: ${text}`);
}
assert(source.includes('主に構想段階のサポートのみ'));
assert(source.includes('16×3×4＝192桁')&&source.includes('2110627836365271482'));
assert(!html.includes('<script'));
assert.equal((html.match(/<h1\b/g)||[]).length,1);
assert(html.includes('<table>')&&html.includes('<p>'));
assert(!html.includes('\uFFFD'));
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(ids.length,new Set(ids).size);
for(const [,ref] of html.matchAll(/(?:src|href)="([^"]+)"/g)){
 if(ref.startsWith('https://'))continue;
 const [p,anchor]=ref.split('#');
 const target=path.resolve(root,'for-ai',p.split('?')[0]||'index.html');
 assert(!path.relative(root,target).startsWith('..'));
 assert(fs.existsSync(target),`Missing local link: ${ref}`);
 if(anchor)assert(fs.readFileSync(target,'utf8').includes(`id="${anchor}"`));
}
const releaseFiles=fs.readdirSync(path.join(root,'for-ai')).sort();
assert.deepEqual(releaseFiles,['index.html','styles.css','tatsuya-takemori.md','tatsuya-takemori.txt']);
console.log('PASS: For AI navigation, rendered content, Markdown/text parity, links, disclosure boundaries and release file allowlist.');
