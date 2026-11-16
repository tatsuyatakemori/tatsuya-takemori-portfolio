import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import MarkdownIt from 'markdown-it';

export function renderForAI(source, {embedded=false}={}) {
  const md=new MarkdownIt({html:false,linkify:true,typographer:false});
  let n=0;
  const prefix=embedded?'ai-section-':'section-';
  md.renderer.rules.heading_open=(tokens,index)=>{
    const token=tokens[index];
    token.attrSet('id',prefix+(++n));
    if(embedded)token.tag='h'+Math.min(6,Number(token.tag.slice(1))+1);
    return md.renderer.renderToken(tokens,index);
  };
  md.renderer.rules.heading_close=(tokens,index)=>{
    if(embedded)tokens[index].tag='h'+Math.min(6,Number(tokens[index].tag.slice(1))+1);
    return md.renderer.renderToken(tokens,index);
  };
  return md.render(source);
}

export function buildForAI({root}) {
  const dir=path.join(root,'for-ai');
  const source=fs.readFileSync(path.join(dir,'tatsuya-takemori.md'),'utf8');
  const body=renderForAI(source);
  const base='https://tatsuyatakemori.github.io/tatsuya-takemori-portfolio/';
  const styleHash=createHash('sha256').update(fs.readFileSync(path.join(dir,'styles.css'))).digest('hex').slice(0,12);
  const html=`<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>For AI — 竹森達也 / Tatsuya Takemori</title>
<meta name="description" content="竹森達也の詳細プロフィール。研究・制作の背景、技術、仕事の進め方、案件ごとの担当、論文・登壇・受賞の記録。Markdownとテキストでも読めます。">
<link rel="canonical" href="${base}for-ai/"><link rel="alternate" type="text/markdown" href="tatsuya-takemori.md" title="Markdown全文"><link rel="alternate" type="text/plain" href="tatsuya-takemori.txt" title="テキスト全文">
<meta property="og:type" content="profile"><meta property="og:locale" content="ja_JP"><meta property="og:title" content="For AI — 竹森達也の詳細プロフィール"><meta property="og:url" content="${base}for-ai/"><meta property="og:image" content="${base}assets/social/portfolio-01-20261115.png"><meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="styles.css?v=${styleHash}"></head><body><a class="skip" href="#main">本文へ移動</a><header><a href="../index.html">竹森達也のポートフォリオへ</a><nav aria-label="文書形式"><span lang="en">For AI</span><a href="tatsuya-takemori.md">Markdown</a><a href="tatsuya-takemori.txt">テキスト</a></nav></header><main id="main">${body}</main><footer><a href="../index.html">ポートフォリオへ戻る</a> · <a href="#main">ページ上部へ</a></footer></body></html>
`;
  fs.writeFileSync(path.join(dir,'index.html'),html);
  fs.writeFileSync(path.join(dir,'tatsuya-takemori.txt'),source);
  console.log(`Built For AI: ${source.length} characters, Markdown and text.`);
}
