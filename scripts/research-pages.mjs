import fs from 'node:fs';
import path from 'node:path';
import {researchDetails} from '../research-details.mjs';

const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const external = (url, title) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(title)} <span aria-hidden="true">↗</span></a>`;
export const researchPath = id => `research/${id}/index.html`;

export function buildResearchPages({root, data, images, stylesheet}) {
  const bibliography = [...data.publications, ...data.theses];
  for (const work of data.researchWorks) {
    const detail = researchDetails[work.id];
    if (!detail) throw new Error(`Missing research detail: ${work.id}`);
    const url = `https://tatsuyatakemori.github.io/tatsuya-takemori-portfolio/${researchPath(work.id)}`;
    const papers = detail.publicationUrls.map(url => {
      const paper = bibliography.find(p => p.url === url);
      if (!paper) throw new Error(`Missing bibliography entry: ${url}`);
      return paper;
    });
    const videos = work.media.filter(m => m.kind === 'youtube');
    // A paper already appears with its full bibliography; do not list it twice.
    const references = work.media.filter(m => m.kind === 'link' && !detail.publicationUrls.includes(m.url));
    const toc = [...detail.sections.map(s => [s.id,s.title]),
      ...(videos.length ? [['videos','動作を映像で見る']] : []),
      ...(papers.length ? [['papers','論文・学位論文']] : []),
      ...(references.length ? [['references','関連資料・記事']] : [])];
    const ogImage = videos[0] && images[videos[0].id];
    const content = detail.sections.map(s => `<section class="detail-section" id="${esc(s.id)}"><h2>${esc(s.title)}</h2>${s.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}${s.points ? `<ul>${s.points.map(p=>`<li>${esc(p)}</li>`).join('')}</ul>` : ''}</section>`).join('\n');
    const media = videos.length ? `<section class="detail-section" id="videos"><h2>動作を映像で見る</h2><p class="resource-intro">サムネイルからYouTubeの動画を開けます。</p><div class="detail-videos">${videos.map(m=>{
      const im=images[m.id];
      if (!im) throw new Error(`Missing video thumbnail: ${m.id}`);
      return `<a class="video" href="https://www.youtube.com/watch?v=${esc(m.id)}" target="_blank" rel="noopener noreferrer"><div class="video-image"><img src="../../${esc(im.path)}" alt="${esc(m.title)}の動画サムネイル" width="${im.width}" height="${im.height}" loading="lazy" decoding="async"><span class="play" aria-hidden="true">▶</span></div><span>${esc(m.title)} ↗</span></a>`;
    }).join('')}</div></section>` : '';
    const publications = papers.length ? `<section class="detail-section" id="papers"><h2>論文・学位論文</h2><p class="resource-intro">研究の手法や実験について、詳しく知りたい方へ。</p><ul class="detail-resources">${papers.map(p=>`<li><h3>${external(p.url,p.title)}</h3><p>${esc(p.authors)}</p><p>${esc([p.venue,p.vol,p.year].filter(Boolean).join(' / '))}</p>${p.note ? `<p>${esc(p.note)}</p>` : ''}</li>`).join('')}</ul></section>` : '';
    const refs = references.length ? `<section class="detail-section" id="references"><h2>関連資料・記事</h2><ul class="detail-resources">${references.map(m=>`<li>${external(m.url,m.title)}</li>`).join('')}</ul></section>` : '';
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
<header class="detail-site-header"><a href="../../index.html">竹森 達也 <span lang="en">Tatsuya Takemori</span></a><a href="../../index.html#research">研究・初期作品の一覧</a></header>
<main id="main"><article>
<header class="detail-hero"><p class="eyebrow">EARLY WORKS / RESEARCH · ${esc(work.period)}</p><h1>${esc(work.title)}</h1><p class="detail-subtitle">${esc(detail.subtitle)}</p><p class="detail-lead">${esc(detail.summary)}</p><div class="detail-role"><h2>担当・取り組み</h2><ul>${detail.responsibilities.map(r=>`<li>${esc(r)}</li>`).join('')}</ul></div></header>
<nav class="detail-toc" aria-label="このページの目次"><h2>このページで読めること</h2><ol>${toc.map(([id,title])=>`<li><a href="#${esc(id)}">${esc(title)}</a></li>`).join('')}</ol></nav>
${content}${media}${publications}${refs}
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
