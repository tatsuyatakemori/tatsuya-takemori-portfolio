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
  const field=()=>({value:'',addEventListener(){}});
  const nodes={'.filters':{hidden:true},'#search':field(),'#year':field(),'#main':{scrollIntoView(){}}};
  const location={hash};
  const document={querySelectorAll(selector){
    if(selector==='main > section')return sections;
    if(selector==='[data-section]')return nav;
    if(selector==='.work'||selector==='img')return [];
    throw Error(`Unexpected selector: ${selector}`);
  },querySelector(selector){return nodes[selector]}};
  vm.runInNewContext(code,{document,location,window:{addEventListener(type,handler){handlers[type]=handler}},history:{pushState(a,b,hash){location.hash=hash}}});
  return {sections,nav,handlers,location};
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
console.log('PASS: research return links, legacy anchors, navigation clicks, hashchange and history.');
