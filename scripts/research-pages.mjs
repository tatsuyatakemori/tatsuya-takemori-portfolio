import fs from 'node:fs';
import path from 'node:path';
import {researchDetails} from '../research-details.mjs';
import {researchReferences} from '../research-references.mjs';

const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const external = (url, title) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(title)} <span aria-hidden="true">↗</span></a>`;
export const researchPath = id => `research/${id}/index.html`;

export function buildResearchPages({root, data, images, stylesheet}) {
  const bibliography = [...data.publications, ...data.theses, ...data.internationalConferences];
  for (const work of data.researchWorks) {
    const detail = researchDetails[work.id];
    if (!detail) throw new Error(`Missing research detail: ${work.id}`);
    const url = `https://tatsuyatakemori.github.io/tatsuya-takemori-portfolio/${researchPath(work.id)}`;
    const library = researchReferences[work.id];
    if (!library) throw new Error(`Missing research references: ${work.id}`);
    const papers = library.papers.map(reference => {
      const paper = bibliography.find(p => p.url === reference.url);
      if (!paper) throw new Error(`Missing bibliography entry: ${reference.url}`);
      return {...paper,...reference,kind: data.theses.includes(paper) ? '学位論文記録' : '研究論文'};
    });
    const videos = library.videos;
    const references = library.sources;
    const catalog=[...papers,...references];
    const index=new Map(catalog.map((r,i)=>[r.id,{...r,number:i+1}]));
    if(index.size!==catalog.length)throw new Error(`Duplicate reference id: ${work.id}`);
    const cite = (keys,compact=false) => (keys||[]).map(key=>{
      const r=index.get(key);if(!r)throw new Error(`Unknown reference ${work.id}/${key}`);
      return `<a href="#ref-${esc(key)}" aria-label="参考資料 ${r.number}：${esc(r.label)}">[${r.number}]${compact ? '' : ` ${esc(r.label)}`}</a>`;
    }).join(compact ? ' ' : '');
    const reading = keys => keys?.length ? `<div class="section-references"><span>この内容を詳しく</span>${cite(keys)}</div>` : '';
    const toc = [...(videos.length ? [['videos','まず、動きを見る']] : []),...detail.sections.map(s => [s.id,s.title]),
      ...(papers.length ? [['papers','論文・学位論文']] : []),
      ...(references.length ? [['references','製作記録・発表資料・実績']] : [])];
    const ogImage = images[videos[0]?.id] || images[work.media.find(m=>m.kind==='youtube')?.id];
    const content = detail.sections.map(s => `<section class="detail-section" id="${esc(s.id)}"><h2>${esc(s.title)}</h2>${s.paragraphs.map((p,i)=>`<p>${esc(p)}${library.paragraphRefs?.[s.id]?.[i]?.length ? ` <span class="inline-citations">${cite(library.paragraphRefs[s.id][i],true)}</span>` : ''}</p>`).join('')}${s.points ? `<ul>${s.points.map((p,i)=>`<li>${esc(p)} <span class="inline-citations">${cite(library.pointRefs?.[s.id]?.[i],true)}</span></li>`).join('')}</ul>` : ''}${reading(library.sectionRefs[s.id])}${work.id==='fuhga'&&s.id==='field' ? '<p class="detail-context-link"><a href="../../index.html#talks">大阪城調査など、講演・メディアの記録を見る →</a></p>' : ''}</section>`).join('\n');
    const media = videos.length ? `<section class="detail-section" id="videos"><h2>まず、動きを見る</h2><p class="resource-intro">ページ内で再生できます。再生できない場合は「YouTubeで見る」から開けます。</p><div class="reference-videos">${videos.map((m,i)=>`${i===1 ? `<details class="more-videos"><summary>ほかの動作・解説も見る（${videos.length-1}本）</summary><div class="reference-videos">` : ''}<figure class="reference-video" id="video-${esc(m.id)}"><div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/${esc(m.id)}" title="${esc(m.title)}" width="560" height="315" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div><figcaption><h3>${esc(m.title)}</h3><p>${esc(m.note)}</p><p class="video-credit">公開：${esc(m.by)}</p><div class="video-links">${external(`https://www.youtube.com/watch?v=${m.id}`,'YouTubeで見る')}<span class="inline-citations">${cite(m.refs,true)}</span></div></figcaption></figure>${i===videos.length-1 && i>0 ? '</div></details>' : ''}` ).join('')}</div></section>` : '';
    const resource = r => {
      const number=index.get(r.id).number;
      const back=detail.sections.filter(s=>(library.sectionRefs[s.id]||[]).includes(r.id) || (library.paragraphRefs?.[s.id]||[]).flat().includes(r.id));
      return `<li class="reference-entry" id="ref-${esc(r.id)}"><p class="reference-meta"><span class="reference-number">[${number}]</span> ${esc(r.kind)} · ${esc(r.year)}</p><h3>${esc(r.label)}</h3><p class="reference-description">${esc(r.note)}</p><p class="reference-title">${external(r.readUrl || r.url,r.title)}</p>${r.authors ? `<p class="reference-by">${esc(r.authors)}<br>${esc([r.venue,r.vol].filter(Boolean).join(' / '))}</p>` : `<p class="reference-by">${esc(r.by)}</p>`}<div class="reference-links">${external(r.url,r.access || '元の資料を読む')}${(r.links||[]).map(l=>external(l.url,l.label)).join('')}</div>${back.length ? `<p class="reference-backlinks">解説に戻る：${back.map(s=>`<a href="#${esc(s.id)}">${esc(s.title)}</a>`).join(' / ')}</p>` : ''}</li>`;
    };
    const publications = papers.length ? `<section class="detail-section" id="papers"><h2>論文・学位論文</h2><p class="resource-intro">何を扱う論文かを日本語で案内しています。公開本文がある資料には、直接読めるリンクを添えました。</p><ol class="detail-resources">${papers.map(resource).join('')}</ol></section>` : '';
    const refs = references.length ? `<section class="detail-section" id="references"><h2>製作記録・発表資料・実績</h2><p class="resource-intro">当時の発想や試行錯誤、共同制作の担当、大会での成果を原資料から辿れます。</p><ol class="detail-resources">${references.map(resource).join('')}</ol></section>` : '';
    const related = detail.related.map(id=>{
      const other=data.researchWorks.find(w=>w.id===id);
      if (!other || !researchDetails[id]) throw new Error(`Missing related research: ${id}`);
      return `<li><a href="../${esc(id)}/index.html">${esc(other.title)} <span aria-hidden="true">→</span></a><p>${esc(researchDetails[id].subtitle)}</p></li>`;
    }).join('');
    const html = `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(work.title)} — 竹森達也 / Tatsuya Takemori</title><meta name="description" content="${esc(detail.summary)}"><link rel="canonical" href="${url}">
<meta property="og:type" content="article"><meta property="og:locale" content="ja_JP"><meta property="og:title" content="${esc(work.title)} — 竹森達也"><meta property="og:description" content="${esc(detail.summary)}"><meta property="og:url" content="${url}">${ogImage ? `<meta property="og:image" content="https://tatsuyatakemori.github.io/tatsuya-takemori-portfolio/${esc(ogImage.path)}">` : ''}<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="../../${esc(stylesheet)}"></head>
<body class="detail-page"><a class="skip" href="#main">本文へ移動</a><div class="detail-shell">
<header class="detail-site-header"><a href="../../index.html">竹森 達也 <span lang="en">Tatsuya Takemori</span></a><a href="../../index.html#research">京都大学時代の取り組み</a></header>
<main id="main"><article>
<header class="detail-hero"><p class="eyebrow">EARLY WORKS / RESEARCH · ${esc(work.period)}</p><h1>${esc(work.title)}</h1><p class="detail-subtitle">${esc(detail.subtitle)}</p><p class="detail-lead">${esc(detail.summary)}</p><div class="detail-role"><h2>担当・取り組み</h2><ul>${detail.responsibilities.map(r=>`<li>${esc(r)}</li>`).join('')}</ul></div></header>
<nav class="detail-toc" aria-label="このページの目次"><h2>このページの読み方</h2><p>${esc(library.guide)}</p><p class="reference-count">動画 ${videos.length}本 · 論文・資料 ${catalog.length}件</p><ol>${toc.map(([id,title])=>`<li><a href="#${esc(id)}">${esc(title)}</a></li>`).join('')}</ol></nav>
${media}${content}${publications}${refs}
<aside class="detail-related" aria-labelledby="related-heading"><h2 id="related-heading">ほかの研究・初期作品</h2><ul>${related}</ul></aside>
<p class="detail-back"><a href="../../index.html#research-${esc(work.id)}">← 一覧の「${esc(work.title)}」へ戻る</a><a href="#main">このページの先頭へ ↑</a></p>
</article></main>
<footer><p>© 2026 Tatsuya Takemori</p><p class="fine">AIを活用して制作・更新しています。</p></footer>
</div></body></html>`;
    const dest=path.join(root,researchPath(work.id));
    fs.mkdirSync(path.dirname(dest),{recursive:true});
    fs.writeFileSync(dest,html);
  }
}
