// Exercise the production router with navigation IDs read from the generated HTML.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const code=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const stack=[],voids=new Set(['meta','link','img','br','hr','input','wbr']);
for(const [,closing,tag] of html.matchAll(/<(\/?)([a-z][\w-]*)\b[^>]*>/gi)){
  if(voids.has(tag))continue;
  if(closing)assert.equal(stack.pop(),tag,`Unbalanced ${tag} in home page`);else stack.push(tag);
}
assert.equal(stack.length,0);
const sectionIds=[...html.matchAll(/<section id="([^"]+)"/g)].map(m=>m[1]);
assert.deepEqual(sectionIds,['about','works','talks','awards','contact']);
assert(!html.match(/<header class="site-header">[\s\S]*?<\/header>/)[0].includes('ロボティクス'));
assert(html.includes('https://forms.abstractengine.com/projects/?from=ae'));
const panelIds=[...html.matchAll(/<div id="([^"]+)" data-work-panel/g)].map(m=>m[1]);
assert.deepEqual(panelIds,['production','research','publications']);
const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
function fixture(hash, reduceMotion=false){
  const handlers={},scrolls=[],scrollOptions=[],frames=[];
  const node=id=>({id,hidden:false,attrs:{},dataset:{},value:'',textContent:'',
    setAttribute(k,v){this.attrs[k]=v},getAttribute(k){return this.attrs[k]??null},removeAttribute(k){delete this.attrs[k]},
    addEventListener(type,handler){this[type]=handler},scrollIntoView(options){scrolls.push(id);scrollOptions.push(options)},getBoundingClientRect(){return {top:this.top??0,height:60}}});
  const sections=sectionIds.map(node),panels=panelIds.map(node);
  panels.forEach((p,i)=>p.top=100+i*4000);
  const links=(attr,key)=>[...html.matchAll(new RegExp(`<a[^>]*href="(#[^"]+)" ${attr}="([^"]+)"`,'g'))].map(m=>Object.assign(node(m[2]),{hash:m[1],dataset:{[key]:m[2]}}));
  const nav=links('data-section','section'),workNav=links('data-work-section','workSection'),sectionLinks=links('data-section-link','sectionLink');
  const cards=[...html.matchAll(/<article class="work" id="([^"]+)" data-year="([^"]+)" data-search="([^"]+)"/g)].map(m=>Object.assign(node(m[1]),{dataset:{year:m[2],search:m[3]}}));
  const nodes={'.filters':node('filters'),'#search':node('search'),'#year':node('year'),'#main':node('main'),'#result-count':node('count'),'#no-results':node('empty')};
  nodes['.works-navigation']=node('works-navigation');
  nodes['#year'].value='all';
  const location={hash};
  const document={querySelectorAll(selector){
    return {'main > section':sections,'[data-section]':nav,'[data-work-panel]':panels,'[data-work-section]':workNav,'[data-section-link]':sectionLinks,'.work':cards,'img':[]}[selector]??assert.fail(selector);
  },querySelector(selector){return nodes[selector]},getElementById(id){return [...sections,...panels,...cards].find(n=>n.id===id)??(ids.has(id)?node(id):null)}};
  const history={pushState(a,b,hash){location.hash=hash}};
  vm.runInNewContext(code,{document,location,window:{addEventListener(type,handler){handlers[type]=handler},matchMedia(){return {matches:reduceMotion}},requestAnimationFrame(cb){frames.push(cb);return frames.length}},history});
  return {sections,panels,nav,workNav,sectionLinks,cards,nodes,handlers,location,scrolls,scrollOptions,flush(){while(frames.length)frames.shift()()}};
}
function selected(s,id,panel='production'){
  assert.deepEqual(s.sections.filter(s=>!s.hidden).map(s=>s.id),[id]);
  assert.deepEqual(s.nav.filter(a=>a.attrs['aria-current']==='page').map(a=>a.dataset.section),[id]);
  assert.deepEqual(s.panels.filter(s=>!s.hidden).map(s=>s.id),panelIds,'Every Works category must remain readable by scrolling');
  assert.deepEqual(s.workNav.filter(a=>a.attrs['aria-current']==='location').map(a=>a.dataset.workSection),[panel]);
}
for(const [hash,id,panel] of [['','about'],['#about','about'],['#works','works'],['#work-pixorb','works'],['#research','works','research'],['#legacy','works','research'],['#publications','works','publications'],['#pubs','works','publications'],['#media','talks'],['#talks','talks'],['#awards','awards'],['#contact','contact'],['#missing','about'],['#main','about'],['#top','about']])selected(fixture(hash),id,panel);
for(const id of ['snake','fuhga','mimebot','robotrace']){
  const s=fixture(`#research-${id}`);selected(s,'works','research');assert.equal(s.scrolls.at(-1),`research-${id}`);
}
const s=fixture('');
const click=a=>a.click({preventDefault(){}});
click(s.nav.find(a=>a.dataset.section==='works'));selected(s,'works');
click(s.workNav.find(a=>a.dataset.workSection==='publications'));selected(s,'works','publications');
assert.equal(s.scrolls.at(-1),'publications');assert.equal(s.scrollOptions.at(-1).behavior,'smooth');
click(s.workNav.find(a=>a.dataset.workSection==='research'));selected(s,'works','research');
s.location.hash='#publications';s.handlers.popstate();selected(s,'works','publications');
s.location.hash='#about';s.handlers.hashchange();selected(s,'about');
click(s.sectionLinks.find(a=>a.hash==='#works'));selected(s,'works');
click(s.sectionLinks.find(a=>a.hash==='#research'));selected(s,'works','research');assert.equal(s.scrolls.at(-1),'research');
click(s.nav.find(a=>a.dataset.section==='contact'));selected(s,'contact');
s.location.hash='#top';s.handlers.hashchange();selected(s,'contact');
let prevented=false;s.nav[0].click({ctrlKey:true,preventDefault(){prevented=true}});assert.equal(prevented,false);selected(s,'contact');
s.nodes['#search'].value='PixOrb';s.nodes['#search'].input();assert(s.cards.some(c=>!c.hidden));assert(s.cards.filter(c=>!c.hidden).every(c=>c.dataset.search.includes('pixorb')));
s.nodes['#search'].value='no-match-fixture';s.nodes['#search'].input();assert(s.cards.every(c=>c.hidden));assert.equal(s.nodes['#no-results'].hidden,false);
s.nodes['#search'].value='';s.nodes['#year'].value='2026';s.nodes['#year'].change();assert(s.cards.filter(c=>!c.hidden).every(c=>c.dataset.year==='2026'));
const production=html.slice(html.indexOf('<div id="production"'),html.indexOf('<div id="research"'));
assert(production.includes('class="section-next" href="#research" data-section-link="research"'));
assert(production.indexOf('class="section-next"')>production.lastIndexOf('class="work"'));
assert(html.includes('の解説 →</a>'),'Bibliography should link back to related research');
const reading=fixture('#works');
reading.panels[0].top=-2000;reading.panels[1].top=80;
reading.handlers.scroll();reading.flush();selected(reading,'works','research');assert.equal(reading.location.hash,'#works');
reading.panels[1].top=-2000;reading.panels[2].top=80;
reading.handlers.scroll();reading.flush();selected(reading,'works','publications');
reading.panels[1].top=4000;reading.panels[2].top=8000;
reading.handlers.scroll();reading.flush();selected(reading,'works','production');
const reduced=fixture('#works',true);click(reduced.workNav[2]);assert.equal(reduced.scrollOptions.at(-1).behavior,'instant');
assert.equal(fixture('#publications').scrollOptions.at(-1).behavior,'instant','Direct links must not animate across the full page');
click(reading.workNav[0]);assert.equal(reading.location.hash,'#production');assert.equal(reading.scrolls.at(-1),'production');
const about=html.match(/<section id="about"[\s\S]*?<\/section>/)[0];
assert(about.includes('プロフィール'));assert(!about.includes('自己紹介'));
const contact=html.match(/<section id="contact"[\s\S]*?<\/section>/)[0];
for(const url of ['https://x.com/rbbtake','https://www.instagram.com/takemori.tatsuya/'])assert(contact.includes(url));
assert(contact.includes('DMでも受け付けています'));
console.log('PASS: Profile landing; continuous Works; smooth/reduced-motion anchors; scroll tracking without history changes; legacy links; filters; company and social contact.');
