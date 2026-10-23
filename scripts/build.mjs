import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const versionedAsset = name => `${name}?v=${createHash('sha256').update(fs.readFileSync(path.join(root, name))).digest('hex').slice(0, 12)}`;
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), context);
const d = context.window.PORTFOLIO_DATA;
const images = JSON.parse(fs.readFileSync(path.join(root, 'assets/images.json'), 'utf8'));
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link = (url, label, cls = '') => `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}<span aria-hidden="true"> ↗</span></a>`;
const tags = list => `<ul class="tags">${list.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`;
const photo = (key, alt, eager = false) => {
  const im = images[key];
  if (!im || !fs.existsSync(path.join(root, im.path))) throw new Error(`Missing image: ${key}`);
  return `<img${im.height > im.width ? ' class="portrait"' : ''} src="${im.path}" alt="${esc(alt)}" width="${im.width}" height="${im.height}" loading="${eager ? 'eager' : 'lazy'}" decoding="async"${eager ? ' fetchpriority="high"' : ''}>`;
};
const social = d.profile.links.filter(l => l.primary).map(l => `<a class="social-button" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer"><span>${esc(l.label)} <span aria-hidden="true">↗</span></span><small>${esc(l.handle)}</small></a>`).join('');
const socialSecondary = d.profile.links.filter(l => !l.primary).map(l => link(l.url, l.label)).join('');
const nav = [['works','Works','制作物'],['about','About','自己紹介'],['talks','Talks & Media','講演・登壇・メディア出演'],['research','Research','京都大学時代'],['publications','Publications & Patents','論文・書籍・特許'],['awards','Awards','受賞歴']];
const sectionHead = (title, ja, count='') => `<header class="section-head"><h2>${title}<span>${ja}</span></h2>${count ? `<p>${esc(count)}</p>` : ''}</header>`;
const works = d.works.map((w, i) => `<article class="work" id="work-${w.id}" data-year="${w.year.slice(0,4)}" data-search="${esc([w.title,w.role,w.desc,...w.tags].join(' ').toLowerCase())}">
  <figure><a class="work-image" href="${esc(w.link)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(w.title)}：作品紹介を開く">${photo(w.id, w.title, i === 0)}</a>${w.imageCredit ? `<figcaption>${esc(w.imageCredit)}</figcaption>` : ''}</figure>
  <div class="work-meta"><span>${esc(w.year)}</span><span>${String(i+1).padStart(2,'0')}</span></div>
  <h3>${link(w.link,w.title)}</h3><p class="role"><span>担当</span>${esc(w.role)}</p><p class="description">${esc(w.desc)}</p>
  ${tags(w.tags)}<p class="source">${link(w.link, '作品紹介・クレジット')}${w.videoUrl ? link(w.videoUrl, '作品映像') : ''}<span>${esc(new URL(w.link).hostname.replace(/^www\./,''))}</span></p>
</article>`).join('\n');
const research = d.researchWorks.map(w => `<article class="research-work"><div class="research-heading"><p class="eyebrow">${esc(w.period)}</p><h3>${esc(w.title)}</h3><p class="role">${esc(w.role)}</p>${tags(w.tags)}</div><div><p class="description">${esc(w.desc)}</p><div class="media-grid">${w.media.map(m => m.kind === 'youtube' ? `<a class="video" href="https://www.youtube.com/watch?v=${m.id}" target="_blank" rel="noopener noreferrer"><div class="video-image">${photo(m.id,m.title)}<span class="play" aria-hidden="true">▶</span></div><span>${esc(m.title)} ↗</span></a>` : `<p class="reference">${link(m.url,m.title)}</p>`).join('')}</div></div></article>`).join('');
const publication = p => `<article class="publication"><span class="year">${esc(p.year)}</span><div><h4>${p.url ? link(p.url,p.title) : esc(p.title)}</h4><p>${esc(p.authors)}</p>${p.venue ? `<p class="venue">${esc(p.venue)}${p.vol ? `, ${esc(p.vol)}` : ''}</p>` : ''}${p.note ? `<p>${esc(p.note)}</p>` : ''}${p.relatedLinks?.length ? `<p class="record-links">${p.relatedLinks.map(l=>link(l.url,l.label)).join('')}</p>` : ''}</div></article>`;
const appearance = a => `<article class="appearance"><div class="appearance-date"><time datetime="${esc(a.date)}">${esc(a.date.replaceAll('-','.'))}</time>${a.dateLabel ? `<span>${esc(a.dateLabel)}</span>` : ''}</div><div><p class="appearance-role">${esc(a.role)}</p><h3>${esc(a.title)}</h3><p class="appearance-event">${esc(a.event)}${a.venue ? ` / ${esc(a.venue)}` : ''}</p><p class="description">${esc(a.description)}</p>${a.url ? `<p class="source">${link(a.url,a.linkLabel)}</p>` : ''}</div></article>`;
const sub = (en, ja) => `<h3 class="subheading">${en}<span>${ja}</span></h3>`;
const awards = ['学会賞','学内表彰','国際大会','日本大会'].map(cat => `${sub(cat,'')}${d.awards.filter(a=>a.category===cat).map(a=>`<article class="publication"><span class="year">${esc(a.year)}</span><div><h4>${esc(a.title)}</h4>${a.venue ? `<p>${esc(a.venue)}</p>` : ''}${a.co ? `<p>${esc(a.co)}</p>` : ''}</div></article>`).join('')}`).join('');
const html = `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>竹森達也 / Tatsuya Takemori — Portfolio</title><meta name="description" content="${esc(d.profile.bioShort)}">
<link rel="canonical" href="https://tatsuyatakemori.github.io/tatsuya-takemori-portfolio/">
<meta property="og:type" content="website"><meta property="og:locale" content="ja_JP"><meta property="og:title" content="竹森達也 / Tatsuya Takemori — Portfolio"><meta property="og:description" content="${esc(d.profile.bioShort)}"><meta property="og:url" content="https://tatsuyatakemori.github.io/tatsuya-takemori-portfolio/"><meta property="og:image" content="https://tatsuyatakemori.github.io/tatsuya-takemori-portfolio/assets/thumbnails/moon-edition.webp"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:creator" content="@rbbtake">
<link rel="stylesheet" href="${versionedAsset('styles.css')}"><script src="${versionedAsset('app.js')}" defer></script></head>
<body><a class="skip" href="#main">本文へ移動</a><div class="shell">
<header class="site-header"><div><p class="eyebrow">HARDWARE ENGINEERING / TECHNICAL DIRECTION</p><h1>${esc(d.profile.nameJa)}<span>${esc(d.profile.nameEn)}</span></h1><p class="affiliation">${esc(d.profile.title)}<span>Abstract Engine</span></p></div><div class="social-block"><p class="social-label">制作・活動をフォロー</p><div class="social">${social}</div></div></header>
<div class="intro"><p>ロボティクス技術を、<br>アートとエンターテイメントの現場へ。</p><span>Mechanical design<br>Electronics & control<br>Art & installation</span></div>
<nav class="navigation" aria-label="メインナビゲーション">${nav.map(([id,en,ja])=>`<a href="#${id}" data-section="${id}">${en}<span>${ja}</span></a>`).join('')}</nav>
<main id="main">
<section id="works" aria-label="制作物">${sectionHead('Works','制作物',`${d.works.length} works / 2022–2026`)}<div class="filters" hidden><label>作品を探す<input id="search" type="search" placeholder="作品名・技術・担当で検索" autocomplete="off"></label><label>年<select id="year"><option value="all">すべての年</option>${[...new Set(d.works.map(w=>w.year.slice(0,4)))].map(y=>`<option value="${y}">${y}</option>`).join('')}</select></label><p id="result-count" aria-live="polite">${d.works.length}件</p></div><div class="works-grid">${works}</div><p id="no-results" hidden>該当する作品がありません。検索語や年を変更してください。</p></section>
<section id="about" aria-label="自己紹介">${sectionHead('About','自己紹介')}<div class="about-content"><p class="about-lead">${esc(d.profile.bioLead)}</p>${d.profile.bio.split('\n\n').map(p=>`<p>${esc(p)}</p>`).join('')}<dl><dt>所属</dt><dd>${esc(d.profile.affiliation)}</dd><dt>学位</dt><dd>${esc(d.profile.degree)}（京都大学）</dd><dt>生年</dt><dd>${esc(d.profile.born)}</dd></dl></div></section>
<section id="talks" aria-label="講演・登壇・メディア出演">${sectionHead('Talks &amp; Media','講演・登壇・メディア出演',`${d.talks.length} talks / ${d.mediaAppearances.length} media appearances`)}<div class="appearances">${[...d.talks,...d.mediaAppearances].sort((a,b)=>b.date.localeCompare(a.date)).map(appearance).join('')}</div></section>
<section id="research" aria-label="研究・初期作品">${sectionHead('Early Works / Research','京都大学時代',`${d.researchWorks.length} projects`)}${research}</section>
<section id="publications" aria-label="論文・書籍・特許">${sectionHead('Publications &amp; Patents','論文・書籍・特許')}${sub('Journal Articles',`学術雑誌 · ${d.publications.length}件`)}${d.publications.map(publication).join('')}${sub('Review Articles','解説')}${d.reviewArticles.map(publication).join('')}${sub('Books / Chapters','書籍')}${d.books.map(publication).join('')}${sub('International Conferences','国際会議')}${d.internationalConferences.map(publication).join('')}${sub('Doctoral Thesis','博士論文・要約公開')}${d.theses.map(publication).join('')}${sub('Patents & Grants','特許・予算')}${d.patents.map(p=>`<p class="record patent">${link(p.url,p.title)}（${esc(p.number)} / ${esc(p.status)}）</p>`).join('')}${d.grants.map(g=>`<div class="record"><p>${esc(g.period)} — ${esc(g.title)}</p>${g.note ? `<p>${esc(g.note)}</p>` : ''}<p>受給：${esc(g.recipient)}</p></div>`).join('')}</section>
<section id="awards" aria-label="受賞歴">${sectionHead('Awards & Honors','受賞歴',`${d.awards.length} entries`)}${awards}</section>
</main><aside class="follow-panel" aria-label="SNSでフォロー"><div><p class="eyebrow">FOLLOW</p><h2>制作の続きは、SNSで。</h2><p>作品や活動に興味を持ってくださった方へ。</p></div><div class="social">${social}</div></aside><footer><div><p>© 2026 Tatsuya Takemori</p><p class="fine">AIを活用して制作・更新しています。</p></div><div class="footer-links">${socialSecondary}<a href="#works">ページ上部へ ↑</a></div></footer>
</div></body></html>`;
fs.writeFileSync(path.join(root, 'index.html'), html);
console.log(`Built index.html: ${d.works.length} works, ${d.researchWorks.length} research projects; all image files present.`);
