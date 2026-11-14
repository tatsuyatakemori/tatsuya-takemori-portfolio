// Run the actual navigation script against a small DOM fixture.
// Regression: returning from a research page must not hide the target section.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const code=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
function fixture(hash){
  const handlers={};
  const ids=['works','about','talks','research','publications','awards'];
  const sections=ids.map(id=>({id,hidden:false}));
  const nav=ids.map(id=>({dataset:{section:id},hash:`#${id}`,attrs:{},
    setAttribute(k,v){this.attrs[k]=v},removeAttribute(k){delete this.attrs[k]},
    addEventListener(type,handler){this[type]=handler}}));
  const researchLink={hash:'#research',addEventListener(type,handler){this[type]=handler}};
  let scrollCount=0;
  const field=()=>({value:'',addEventListener(){}});
  const nodes={'.filters':{hidden:true},'#search':field(),'#year':field(),'#main':{scrollIntoView(){scrollCount++}}};
  const location={hash};
  const document={querySelectorAll(selector){
    if(selector==='main > section')return sections;
    if(selector==='[data-section]')return nav;
    if(selector==='[data-section-link]')return [researchLink];
    if(selector==='.work'||selector==='img')return [];
    throw Error(`Unexpected selector: ${selector}`);
  },querySelector(selector){return nodes[selector]}};
  vm.runInNewContext(code,{document,location,window:{addEventListener(type,handler){handlers[type]=handler}},history:{pushState(a,b,hash){location.hash=hash}}});
  return {sections,nav,handlers,location,researchLink,get scrollCount(){return scrollCount}};
}
function selected(state,id){
  assert.deepEqual(state.sections.filter(s=>!s.hidden).map(s=>s.id),[id]);
  assert.deepEqual(state.nav.filter(a=>a.attrs['aria-current']==='page').map(a=>a.dataset.section),[id]);
}
for(const id of ['snake','fuhga','mimebot','robotrace'])selected(fixture(`#research-${id}`),'research');
for(const [hash,id] of [['','works'],['#work-pixorb','works'],['#legacy','research'],['#media','talks'],['#pubs','publications'],['#missing','works']])selected(fixture(hash),id);
const state=fixture('#research-snake');
state.nav[0].click({preventDefault(){}});selected(state,'works');
state.location.hash='#research-fuhga';state.handlers.popstate();selected(state,'research');
state.location.hash='#about';state.handlers.hashchange();selected(state,'about');
const fromWorks=fixture('#works');
fromWorks.researchLink.click({preventDefault(){}});selected(fromWorks,'research');
assert.equal(fromWorks.location.hash,'#research');assert.equal(fromWorks.scrollCount,1,'Research link must scroll to the main content');
fromWorks.location.hash='#works';fromWorks.handlers.popstate();selected(fromWorks,'works');
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const works=html.match(/<section id="works"[\s\S]*?<\/section>/)?.[0];
assert(works?.includes('class="works-research" href="#research" data-section-link="research"'),'Research link must be within Works');
assert(works.indexOf('class="works-research"')>works.lastIndexOf('class="work"'),'Research link must follow all work cards');
console.log('PASS: Works-to-research navigation, scroll, back history, research return links and legacy anchors.');
