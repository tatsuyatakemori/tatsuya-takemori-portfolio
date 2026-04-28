// 案 F: Minimal — はてなブログ風の引用ベース + OGPサムネイル埋め込み
// 各作品リンクのOGP画像を Microlink API 経由で取得し、はてなブログの埋め込みカード風に表示
const { useState: useStateM, useEffect: useEffectM } = React;

// 軽量OGPフェッチフック — Microlink (free tier, CORS有効) を使用
function useOGP(url, manualThumbnail) {
  const [data, setData] = useStateM(null);
  useEffectM(() => {
    if (manualThumbnail) { setData({ image: { url: manualThumbnail } }); return; }
    if (!url) return;
    let alive = true;
    fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`)
      .then(r => r.ok ? r.json() : null)
      .then(j => { if (alive && j && j.status === "success") setData(j.data); })
      .catch(() => {});
    return () => { alive = false; };
  }, [url, manualThumbnail]);
  return data;
}

// はてなブログ風カード: サムネ左 / テキスト右。OGP取得失敗時はホスト名タイポ・フォールバック
function CiteCard({ work, hostOf }) {
  const ogp = useOGP(work.link, work.thumbnail);
  const host = hostOf(work.link);
  const ogImg = ogp && ogp.image && ogp.image.url;
  const fav = host ? `https://www.google.com/s2/favicons?domain=${host}&sz=64` : null;

  return (
    <article className="mn-cite">
      <p className="meta"><span className="yr">{work.year}</span></p>
      <div className="mn-cite-body">
        {work.link && (
          <a className="mn-cite-thumb" href={work.link} target="_blank" rel="noreferrer" aria-label={work.title}>
            {ogImg ? <img src={ogImg} alt="" loading="lazy" onError={(e) => { e.target.style.display = "none"; e.target.parentNode.classList.add("no-img"); }} /> : null}
            <div className="mn-cite-thumb-fallback">
              {fav && <img className="fav-lg" src={fav} alt="" />}
              <span className="host-lg">{host}</span>
            </div>
          </a>
        )}
        <div className="mn-cite-text">
          <h3>{work.link ? <a href={work.link} target="_blank" rel="noreferrer">{work.title}</a> : work.title}</h3>
          <p className="role">{work.role}</p>
          {work.desc && <p className="desc">{work.desc}</p>}
          {work.tags && (
            <div className="tags">{work.tags.map(t => <span key={t}>{t}</span>)}</div>
          )}
          {work.link && (
            <p className="src">
              {fav && <img className="favicon" src={fav} alt="" />}
              <a href={work.link} target="_blank" rel="noreferrer">引用元へ</a>
              <span className="host">{host}</span>
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

function MinimalPortfolio() {
  const D = window.PORTFOLIO_DATA;
  const [tab, setTab] = useStateM("works");

  const tabs = [
    ["about",  "About",                  "自己紹介"],
    ["works",  "Works",                  "制作物"],
    ["legacy", "Early Works / Research", "京都大学時代"],
    ["pubs",   "Publications",           "論文・書籍"],
    ["awards", "Awards",                 "受賞歴"],
  ];

  // URLからホスト名（と短縮ラベル）を取り出す
  const hostOf = (url) => {
    if (!url) return null;
    try {
      const u = new URL(url);
      return u.hostname.replace(/^www\./, "");
    } catch { return null; }
  };

  return (
    <div style={{background:"#fafaf9", color:"#1a1a1a", minHeight:"100vh"}}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Noto+Sans+JP:wght@300;400;500&display=swap" />
      <style>{`
        .mn-root { font-family: "Inter", "Noto Sans JP", sans-serif; -webkit-font-smoothing: antialiased; }
        .mn-wrap { max-width: 920px; margin: 0 auto; padding: 80px 56px 120px; }

        .mn-head { display: grid; grid-template-columns: 1fr auto; align-items: end; gap: 32px; margin-bottom: 32px; }
        .mn-head .name { font-size: 22px; font-weight: 500; margin: 0 0 4px; letter-spacing: -0.005em; }
        .mn-head .name-en { font-size: 13px; color: #8a8a87; margin: 0 0 16px; letter-spacing: 0.02em; }
        .mn-head .role { font-size: 13px; color: #4a4a48; margin: 0; max-width: 56ch; line-height: 1.65; }
        .mn-head .role .sep { color: #c5c5c2; }
        .mn-head .links { font-size: 12px; color: #8a8a87; text-align: right; }
        .mn-head .links a { color: #1a1a1a; text-decoration: none; border-bottom: 1px solid #d4d4d2; margin-left: 18px; padding-bottom: 1px; }
        .mn-head .links a:hover { border-bottom-color: #1a1a1a; }

        .mn-lede { font-size: 15px; line-height: 1.85; color: #2a2a28; margin: 0 0 16px; max-width: 60ch; text-wrap: pretty; padding-left: 16px; border-left: 2px solid #1a1a1a; }
        .mn-aidisc { font-family: "JetBrains Mono", "Menlo", monospace; font-size: 10px; letter-spacing: 0.06em; color: #b5b5b1; margin: 0 0 56px; padding-left: 16px; }

        @media (max-width: 720px) {
          .mn-head { grid-template-columns: 1fr; }
          .mn-head .links { text-align: left; }
          .mn-head .links a { margin-left: 0; margin-right: 18px; }
        }

        .mn-tabs { display: flex; gap: 28px; border-bottom: 1px solid #e5e5e3; margin-bottom: 56px; position: sticky; top: 0; background: #fafaf9; padding-top: 16px; z-index: 5; flex-wrap: wrap; }
        .mn-tabs button { background: none; border: none; padding: 12px 0; margin-bottom: -1px; font: inherit; font-size: 13px; color: #8a8a87; cursor: pointer; border-bottom: 1px solid transparent; transition: color .15s, border-color .15s; }
        .mn-tabs button:hover { color: #1a1a1a; }
        .mn-tabs button.active { color: #1a1a1a; border-bottom-color: #1a1a1a; }
        .mn-tabs .ja { color: #b5b5b1; font-size: 11px; margin-left: 4px; }

        .mn-sh { display: flex; align-items: baseline; justify-content: space-between; margin: 0 0 32px; }
        .mn-sh h2 { font-size: 13px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: #1a1a1a; margin: 0; }
        .mn-sh .count { font-size: 12px; color: #8a8a87; font-variant-numeric: tabular-nums; }

        .mn-about p { font-size: 15px; line-height: 1.9; color: #2a2a28; max-width: 62ch; margin: 0 0 24px; text-wrap: pretty; }
        .mn-meta { display: grid; grid-template-columns: 100px 1fr; gap: 4px 32px; margin-top: 48px; font-size: 13px; max-width: 60ch; }
        .mn-meta dt { color: #8a8a87; padding: 8px 0; border-top: 1px solid #ececea; }
        .mn-meta dd { margin: 0; padding: 8px 0; color: #1a1a1a; border-top: 1px solid #ececea; }
        .mn-meta dt:first-of-type, .mn-meta dt:first-of-type + dd { border-top: none; }

        /* --- Citation cards: blockquote-style with OGP thumbnail (left-image / right-text) --- */
        .mn-cite { padding: 28px 0 28px 24px; border-bottom: 1px solid #ececea; border-left: 2px solid #ececea; margin-left: 0; transition: border-color .2s; }
        .mn-cite:last-child { border-bottom: none; }
        .mn-cite:hover { border-left-color: #1a1a1a; }
        .mn-cite .meta { font-size: 11px; color: #8a8a87; letter-spacing: 0.04em; margin: 0 0 14px; font-variant-numeric: tabular-nums; display: flex; gap: 16px; flex-wrap: wrap; }
        .mn-cite .meta .yr { color: #1a1a1a; }
        .mn-cite-body { display: grid; grid-template-columns: 200px 1fr; gap: 24px; align-items: start; }
        .mn-cite-thumb { display: block; width: 200px; aspect-ratio: 4/3; background: #ececea; overflow: hidden; position: relative; }
        .mn-cite-thumb img:not(.fav-lg) { width: 100%; height: 100%; object-fit: cover; display: block; transition: opacity .2s; position: relative; z-index: 1; }
        .mn-cite-thumb:hover img:not(.fav-lg) { opacity: 0.85; }
        .mn-cite-thumb-fallback { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; background: #f0f0ed; padding: 16px; text-align: center; }
        .mn-cite-thumb-fallback .fav-lg { width: 28px; height: 28px; opacity: 0.7; }
        .mn-cite-thumb-fallback .host-lg { font-family: "JetBrains Mono", "Menlo", monospace; font-size: 11px; color: #6a6a68; letter-spacing: 0.02em; word-break: break-all; line-height: 1.4; }
        .mn-cite-text { min-width: 0; }
        .mn-cite h3 { font-size: 16px; font-weight: 500; line-height: 1.45; margin: 0 0 8px; color: #1a1a1a; }
        .mn-cite h3 a { color: inherit; text-decoration: none; border-bottom: 1px solid transparent; }
        .mn-cite h3 a:hover { border-bottom-color: #1a1a1a; }
        .mn-cite .role { font-size: 12px; color: #6a6a68; margin: 0 0 10px; line-height: 1.55; }
        .mn-cite .desc { font-size: 13px; color: #2a2a28; line-height: 1.8; margin: 0 0 10px; text-wrap: pretty; }
        .mn-cite .src { font-size: 12px; color: #6a6a68; margin: 10px 0 0; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .mn-cite .src .favicon { width: 14px; height: 14px; display: inline-block; vertical-align: middle; }
        .mn-cite .src a { color: #1a1a1a; text-decoration: none; border-bottom: 1px solid #d4d4d2; padding-bottom: 1px; }
        .mn-cite .src a:hover { border-bottom-color: #1a1a1a; }
        .mn-cite .src .host { font-family: "JetBrains Mono", "Menlo", monospace; font-size: 11px; color: #8a8a87; }
        .mn-cite .tags { display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 11px; color: #8a8a87; margin-top: 10px; }
        .mn-cite .tags span::before { content: "·　"; color: #c5c5c2; }
        .mn-cite .tags span:first-child::before { content: ""; }
        @media (max-width: 720px) {
          .mn-cite-body { grid-template-columns: 1fr; }
          .mn-cite-thumb { width: 100%; aspect-ratio: 16/9; }
        }

        /* --- Research works: project blocks with multiple media --- */
        .mn-rwlist { display: flex; flex-direction: column; gap: 0; }
        .mn-rw { padding: 32px 0 36px; border-bottom: 1px solid #ececea; }
        .mn-rw:first-child { padding-top: 8px; }
        .mn-rw:last-child { border-bottom: none; }
        .mn-rw-head { display: flex; gap: 16px; align-items: baseline; margin-bottom: 12px; }
        .mn-rw-num { font-family: "JetBrains Mono", "Menlo", monospace; font-size: 11px; color: #8a8a87; letter-spacing: 0.06em; }
        .mn-rw-period { font-size: 11px; color: #8a8a87; font-variant-numeric: tabular-nums; }
        .mn-rw-title { font-size: 22px; font-weight: 500; line-height: 1.35; color: #1a1a1a; margin: 0 0 6px; letter-spacing: -0.005em; }
        .mn-rw-role { font-size: 12px; color: #6a6a68; margin: 0 0 12px; }
        .mn-rw-desc { font-size: 13px; line-height: 1.85; color: #2a2a28; margin: 0 0 14px; max-width: 64ch; text-wrap: pretty; }
        .mn-rw-tags { display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 11px; color: #8a8a87; margin: 0 0 20px; }
        .mn-rw-tags span::before { content: "·　"; color: #c5c5c2; }
        .mn-rw-tags span:first-child::before { content: ""; }
        .mn-rw-media { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; margin-top: 4px; }
        .mn-rw-mitem { display: grid; grid-template-columns: 96px 1fr; gap: 14px; align-items: stretch; padding: 10px; border: 1px solid #ececea; background: #fff; text-decoration: none; color: inherit; transition: border-color .2s, background .2s; }
        .mn-rw-mitem:hover { border-color: #1a1a1a; background: #fafaf9; }
        .mn-rw-thumb { width: 96px; height: 64px; background: #f0f0ed; overflow: hidden; position: relative; flex-shrink: 0; }
        .mn-rw-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .mn-rw-thumb-text { display: flex; align-items: center; justify-content: center; padding: 8px; }
        .mn-rw-host-lg { font-family: "JetBrains Mono", "Menlo", monospace; font-size: 10px; color: #6a6a68; letter-spacing: 0.02em; word-break: break-all; line-height: 1.3; text-align: center; }
        .mn-rw-play { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 28px; height: 28px; border-radius: 50%; background: rgba(26,26,26,0.85); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 10px; padding-left: 2px; }
        .mn-rw-mtext { display: flex; flex-direction: column; justify-content: center; min-width: 0; gap: 2px; }
        .mn-rw-mlabel { font-family: "JetBrains Mono", "Menlo", monospace; font-size: 9px; color: #b5b5b1; letter-spacing: 0.12em; }
        .mn-rw-mtitle { font-size: 12px; color: #1a1a1a; line-height: 1.4; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .mn-rw-mhost { font-family: "JetBrains Mono", "Menlo", monospace; font-size: 10px; color: #8a8a87; }
        @media (max-width: 720px) {
          .mn-rw-media { grid-template-columns: 1fr; }
        }

        /* --- Publications: same blockquote style --- */
        .mn-pub { display: grid; grid-template-columns: 56px 1fr; gap: 28px; padding: 18px 0; border-bottom: 1px solid #ececea; }
        .mn-pub:last-child { border-bottom: none; }
        .mn-pub .yr { font-size: 12px; color: #8a8a87; padding-top: 2px; font-variant-numeric: tabular-nums; }
        .mn-pub h4 { font-size: 14px; font-weight: 500; margin: 0 0 6px; line-height: 1.5; color: #1a1a1a; max-width: 64ch; }
        .mn-pub h4 a { color: inherit; text-decoration: none; border-bottom: 1px solid transparent; }
        .mn-pub h4 a:hover { border-bottom-color: #1a1a1a; }
        .mn-pub .au { font-size: 12px; color: #6a6a68; margin: 0 0 2px; max-width: 70ch; line-height: 1.5; }
        .mn-pub .ven { font-size: 12px; color: #8a8a87; margin: 0; }
        .mn-pub .ven em { font-style: italic; color: #6a6a68; }
        .mn-pub .doi { font-family: "JetBrains Mono", "Menlo", monospace; font-size: 11px; color: #8a8a87; margin-top: 4px; display: inline-block; }
        .mn-pub .doi a { color: inherit; text-decoration: none; border-bottom: 1px solid #d4d4d2; }
        .mn-pub .doi a:hover { border-bottom-color: #1a1a1a; color: #1a1a1a; }

        .mn-aw { display: grid; grid-template-columns: 56px 1fr; gap: 28px; padding: 12px 0; border-bottom: 1px solid #ececea; }
        .mn-aw:last-child { border-bottom: none; }
        .mn-aw .yr { font-size: 12px; color: #8a8a87; font-variant-numeric: tabular-nums; padding-top: 2px; }
        .mn-aw .t { font-size: 13px; line-height: 1.55; color: #1a1a1a; max-width: 70ch; }
        .mn-aw .t .ven { color: #8a8a87; }
        .mn-aw .t .co { display: block; font-size: 11px; color: #8a8a87; margin-top: 3px; }

        .mn-subh { font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #8a8a87; margin: 64px 0 20px; font-weight: 500; display: flex; justify-content: space-between; align-items: baseline; }
        .mn-subh .count { font-size: 11px; color: #b5b5b1; }

        .mn-foot { margin-top: 96px; padding-top: 24px; border-top: 1px solid #e5e5e3; font-size: 12px; color: #8a8a87; display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .mn-foot a { color: #6a6a68; text-decoration: none; margin-left: 20px; }
        .mn-foot a:first-child { margin-left: 0; }
        .mn-foot a:hover { color: #1a1a1a; }
        .mn-foot-links a { margin-left: 20px; }
        .mn-foot-links a:first-child { margin-left: 0; }
      `}</style>

      <div className="mn-root">
        <div className="mn-wrap">

          <header className="mn-head">
            <div className="mn-head-l">
              <p className="name">{D.profile.nameJa}</p>
              <p className="name-en">{D.profile.nameEn}</p>
              <p className="role">{D.profile.title}<span className="sep">　/　</span>{D.profile.affiliation}</p>
            </div>
            <div className="links">
              {D.profile.links.map(l => (
                <a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label}</a>
              ))}
            </div>
          </header>

          <p className="mn-lede">{D.profile.bioShort}</p>

          <p className="mn-aidisc">※ このポートフォリオは AI によって作成されました。</p>

          <nav className="mn-tabs">
            {tabs.map(([k, l, ja]) => (
              <button key={k} className={tab === k ? "active" : ""} onClick={() => setTab(k)}>
                {l}<span className="ja">　{ja}</span>
              </button>
            ))}
          </nav>

          {tab === "about" && (
            <section>
              <div className="mn-sh"><h2>About</h2></div>
              <div className="mn-about">
                {D.profile.bio.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <dl className="mn-meta">
                <dt>所属</dt><dd>{D.profile.affiliation}</dd>
                <dt>学位</dt><dd>{D.profile.degree}（京都大学）</dd>
                <dt>生年</dt><dd>{D.profile.born}</dd>
                <dt>領域</dt><dd>Robotics Engineering × Technical Direction × Art × Entertainment</dd>
              </dl>
            </section>
          )}

          {tab === "works" && (
            <section>
              <div className="mn-sh">
                <h2>Selected Works　/　制作物</h2>
                <span className="count">{D.works.length} works　·　外部リンク参照</span>
              </div>
              <p style={{fontSize:12, color:"#8a8a87", margin:"0 0 32px", maxWidth:"56ch", lineHeight:1.7}}>
                各作品はリリース／レビュー記事のサムネイルとともに引用元へリンクしています。
              </p>
              <div>
                {D.works.map(w => <CiteCard key={w.id} work={w} hostOf={hostOf} />)}
              </div>
            </section>
          )}

          {tab === "legacy" && (
            <section>
              <div className="mn-sh">
                <h2>Early Works / Research　/　京都大学時代　2014 — 2021</h2>
                <span className="count">{D.researchWorks.length} projects</span>
              </div>
              <div className="mn-rwlist">
                {D.researchWorks.map((w,wi) => (
                  <article key={w.id} className="mn-rw">
                    <header className="mn-rw-head">
                      <span className="mn-rw-num">R-{String(wi+1).padStart(2,"0")}</span>
                      <span className="mn-rw-period">{w.period}</span>
                    </header>
                    <h3 className="mn-rw-title">{w.title}</h3>
                    <p className="mn-rw-role">{w.role}</p>
                    <p className="mn-rw-desc">{w.desc}</p>
                    {w.tags && (
                      <div className="mn-rw-tags">{w.tags.map(t => <span key={t}>{t}</span>)}</div>
                    )}
                    {w.media && w.media.length > 0 && (
                      <div className="mn-rw-media">
                        {w.media.map((m, mi) => {
                          if (m.kind === "youtube") {
                            const url = `https://www.youtube.com/watch?v=${m.id}`;
                            const thumb = `https://i.ytimg.com/vi/${m.id}/hqdefault.jpg`;
                            return (
                              <a key={mi} className="mn-rw-mitem mn-rw-yt" href={url} target="_blank" rel="noreferrer">
                                <div className="mn-rw-thumb">
                                  <img src={thumb} alt="" loading="lazy" />
                                  <span className="mn-rw-play">▶</span>
                                </div>
                                <div className="mn-rw-mtext">
                                  <span className="mn-rw-mlabel">VIDEO</span>
                                  <span className="mn-rw-mtitle">{m.title}</span>
                                  <span className="mn-rw-mhost">youtube.com</span>
                                </div>
                              </a>
                            );
                          }
                          // link
                          return (
                            <a key={mi} className="mn-rw-mitem mn-rw-link" href={m.url} target="_blank" rel="noreferrer">
                              <div className="mn-rw-thumb mn-rw-thumb-text">
                                <span className="mn-rw-host-lg">{m.host}</span>
                              </div>
                              <div className="mn-rw-mtext">
                                <span className="mn-rw-mlabel">REFERENCE</span>
                                <span className="mn-rw-mtitle">{m.title}</span>
                                <span className="mn-rw-mhost">{m.host}</span>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </article>
                ))}
              </div>
              <p className="mn-subh"><span>関連リンク</span></p>
              <p style={{fontSize:13, color:"#4a4a48", lineHeight:1.8, margin:0, maxWidth:"56ch"}}>
                研究時代の詳細は旧ブログにアーカイブされています：{" "}
                <a href="https://tattatatakemori.hatenablog.com/" target="_blank" rel="noreferrer" style={{color:"#1a1a1a", borderBottom:"1px solid #d4d4d2", textDecoration:"none", paddingBottom:1}}>tattatatakemori.hatenablog.com</a>
              </p>
            </section>
          )}

          {tab === "pubs" && (
            <section>
              <div className="mn-sh">
                <h2>Journal Articles　/　学術雑誌</h2>
                <span className="count">{D.publications.length} papers</span>
              </div>
              {D.publications.map((p, i) => {
                const host = hostOf(p.url);
                return (
                  <article key={i} className="mn-pub">
                    <div className="yr">{p.year}</div>
                    <div>
                      <h4>{p.url ? <a href={p.url} target="_blank" rel="noreferrer">{p.title}</a> : p.title}</h4>
                      <p className="au">{p.authors}</p>
                      <p className="ven"><em>{p.venue}</em>{p.vol ? `, ${p.vol}` : ""}</p>
                      {p.url && (
                        <span className="doi">↗ <a href={p.url} target="_blank" rel="noreferrer">{host}</a></span>
                      )}
                    </div>
                  </article>
                );
              })}

              <p className="mn-subh"><span>Books / Chapters　/　書籍</span><span className="count">{D.books.length}</span></p>
              {D.books.map((b, i) => {
                const host = hostOf(b.url);
                return (
                  <article key={i} className="mn-pub">
                    <div className="yr">{b.year}</div>
                    <div>
                      <h4>{b.url ? <a href={b.url} target="_blank" rel="noreferrer">{b.title}</a> : b.title}</h4>
                      <p className="au">{b.authors}</p>
                      {b.venue && <p className="ven"><em>{b.venue}</em></p>}
                      {b.url && (
                        <span className="doi">↗ <a href={b.url} target="_blank" rel="noreferrer">{host}</a></span>
                      )}
                    </div>
                  </article>
                );
              })}

              <p className="mn-subh"><span>International Conferences　/　国際会議</span><span className="count">{D.internationalConferences.length}</span></p>
              {D.internationalConferences.map((c, i) => (
                <article key={i} className="mn-pub">
                  <div className="yr">{c.year}</div>
                  <div>
                    <h4>{c.title}</h4>
                    <p className="au">{c.authors}</p>
                    <p className="ven"><em>{c.venue}</em></p>
                  </div>
                </article>
              ))}

              <p className="mn-subh"><span>Patents & Grants　/　特許・予算</span></p>
              {D.patents.map(p => (
                <div key={p.id} className="mn-aw">
                  <div className="yr">特許</div>
                  <div className="t">{p.title}　<span className="ven">（{p.number}）</span></div>
                </div>
              ))}
              {D.grants.map((g, i) => (
                <div key={i} className="mn-aw">
                  <div className="yr">{g.period}</div>
                  <div className="t">
                    {g.title}
                    {g.note && <span className="co">{g.note}</span>}
                    <span className="co">受給：{g.recipient}</span>
                  </div>
                </div>
              ))}
            </section>
          )}

          {tab === "awards" && (
            <section>
              <div className="mn-sh">
                <h2>Awards & Honors　/　受賞歴</h2>
                <span className="count">{D.awards.length} entries</span>
              </div>
              {["学会賞", "学内表彰", "国際大会", "日本大会"].map(cat => {
                const items = D.awards.filter(a => a.category === cat);
                if (!items.length) return null;
                return (
                  <div key={cat}>
                    <p className="mn-subh"><span>{cat}</span><span className="count">{items.length}</span></p>
                    {items.map((a, i) => (
                      <div key={i} className="mn-aw">
                        <div className="yr">{a.year}</div>
                        <div className="t">
                          {a.title}
                          {a.venue && <span className="ven">　/　{a.venue}</span>}
                          {a.co && <span className="co">{a.co}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </section>
          )}

          <footer className="mn-foot">
            <span>© {new Date().getFullYear()} Tatsuya Takemori</span>
            <span className="mn-foot-links">
              {D.profile.links.map(l => (
                <a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label}</a>
              ))}
            </span>
          </footer>

        </div>
      </div>
    </div>
  );
}

window.MinimalPortfolio = MinimalPortfolio;
