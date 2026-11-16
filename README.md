# Tatsuya Takemori — Portfolio

公開先: https://tatsuyatakemori.github.io/tatsuya-takemori-portfolio/

GitHub Pagesで配信する静的サイトです。本文と画像はサイト内にあり、React、Babel、外部OGP取得APIは不要です。JavaScriptが無効でも全セクションを読めます。

## 編集と確認

- `data.js`: プロフィール、作品、講演・登壇、メディア出演、研究、論文・解説・博士論文、受賞歴の元データ
- `styles.css`: レイアウトとスマートフォン表示
- `app.js`: セクション切替、検索、年別フィルター
- `scripts/build.mjs`: 元データから `index.html` を生成（For AI本文の変換にはmarkdown-itを使用）
- `research-details.mjs`: 研究4件の一覧用概要、詳しい解説、関連論文・研究への対応付け
- `research-references.mjs`: 本文・動画に対応する参考資料、公開本文リンク、日本語の読み方ガイド
- `scripts/research-pages.mjs`: 研究の子ページを生成する共通テンプレート
- `research/<id>/index.html`: 研究・初期作品の子ページ（生成物）
- `assets/thumbnails/`: 表示用WebP画像
- `assets/images.json`: 画像の取得元、参照ページ、撮影クレジット、寸法
- `uploads/`, `variants/`: 以前の元資料とReact版。公開ページからは使用しません。履歴資料として保存しています。

```powershell
npm ci
node scripts/build.mjs
node scripts/verify.mjs
node scripts/verify-navigation.mjs
node scripts/verify-references.mjs
python -m http.server 8767 --bind 127.0.0.1
```

プレビュー: http://127.0.0.1:8767/

`index.html` は生成物です。直接編集せず、元データまたは生成スクリプトを修正して再生成してください。GitHub Pagesのプロジェクト配下に置くため、CSS・JavaScript・画像は相対パスです。

## ナビゲーションと共有画像

トップはAboutです。上位はAbout / Works / Talks & Media / Awards / Contact / For AIの6項目で、Worksでは制作・研究・論文を一続きに掲載し、上部のリンクで各位置へ滑らかに移動します。動きを減らす設定では即時移動します。`#works` は制作、`#research` は研究、`#publications` は論文一覧を開きます。旧`#legacy`・`#pubs`・`#media`および研究詳細からの`#research-<id>`も維持しています。研究と論文の対応付けは既存の`research-references.mjs`を共有し、論文一覧からも研究解説へリンクします。

共通ヘッダーには氏名・肩書・所属のみを表示します。プロフィール本文はAbout、相談の案内・SNSのDM・会社の受付先はContactにあります。

トップの共有画像は`assets/social/portfolio-01-20261115.png`（1200×630）。採用案01。黒地に「Tatsuya Takemori’s Portfolio」をSegoe UI Lightで左揃え・同じ大きさの2行に配置。日本語・写真・装飾は入れず、名前とサイトの目的を一つのタイトルとして扱います。再生成はWindowsで`powershell -NoProfile -ExecutionPolicy Bypass -File scripts/build-social-image.ps1`。Segoe UI Lightが必要で、別の場所にある場合は`-EnglishFontPath`で指定できます。画像の再生成は通常のサイトビルドには不要です。

## 研究の子ページを充実させる

対象は「Early Works / Research 京都大学時代」の4件です。講演・メディアに子ページは作りません。

`research-details.mjs` の `summary` が一覧と子ページ冒頭の短い概要、`sections` が見出しごとの解説です。長い文章を一段落に詰めず、`paragraphs` に段落単位で追加します。`points` は動作例や成果など、並列に読める項目に使います。

`research-references.mjs` の `papers` は `data.js` の雑誌論文・国際会議・学位論文とURLで照合し、書誌を再利用します。`sources` は本人の製作記、大学の記事、主催者の結果など。各資料に安定した `id`、日本語の案内 `label`、読む目的 `note` を付け、`sectionRefs` / `paragraphRefs` / `pointRefs` で説明に対応付けます。番号はページ内で自動採番されます。`readUrl` はDOIの転送先に問題がある場合などの閲覧用URLです。

`videos` はページ内のYouTube埋め込みと、再生できない場合の外部リンクを生成します。各動画の `section` を `overview` または本文の節IDに指定すると、対応する説明の近くへ配置されます。動画はすべて常時表示し、開閉式にはしません。本文と資料一覧はJavaScriptなしで読めます。動画の再生はYouTubeに依存します。

Works末尾の `data-section-link="research"` は、Worksを開いて研究の位置へスクロールする導線です。JavaScript無効時も通常の `#research` リンクとして動作します。

2026-11-14の資料調査・確認範囲・注意点は [参考資料の更新記録](docs/research-references-2026-11-14.md) を参照してください。外部確認は必要なときだけ `node scripts/check-reference-links.mjs` と `node scripts/check-research-sources.mjs` で実行できます。HTTP応答やoEmbed成功は、実際の動画再生を保証しません。

一覧用の動画は `data.js` の各研究の `media` で管理します。子ページで既存の資料を落とさないよう、`media` のリンクと `research-details.mjs` の従来の `publicationUrls` は検証用にも保持しています。新しい資料は `research-references.mjs` に追加してください。

生成後の `research/` も `index.html` とともに公開します。子ページはJavaScriptなしで読め、`#research-<id>` の戻り先でWorks内の対応する研究に移動します。検証スクリプトは子ページの画像、相対リンク、ページ内リンク、研究資料の引継ぎと、戻る際のタブ選択を確認します。

## 画像を追加・変更する

作品データに出典ページ `link` と画像URL `thumbnail` を指定します。撮影クレジットを確認できた場合は `imageCredit` を記載します。その後、以下を実行します。

```powershell
# 初回のみ必要: python -m pip install requests Pillow
python scripts/sync-images.py
node scripts/build.mjs
node scripts/verify.mjs
```

画像をデコードしてWebPへ変換し、最大1200×900の範囲に収めます。元データの画像URLをローカルパスに置換し、出典はmanifestに保持します。同じ取得元のキャッシュがあれば再利用します。縦長画像は一覧でも全体を表示します。

## 公開

GitHub Pagesの公開ブランチは`main`です。ソースと生成済みHTML・CSS・JavaScript・画像を一緒にコミットし、公開が承認された変更を`main`へpushします。反映後は配信HTML、バージョン付きCSS・JavaScript、共有画像を確認してください。

`.preview/`はローカルでの検討用です。比較案・確認ページ・生成途中の資料を公開コミットに含めません。

## 内容の出典

2026年に追加した作品と確認範囲は [更新記録](docs/update-20261023.md) を参照。画像の取得成功は動画本編の再生確認や、すべての過去の経歴の再検証を意味しません。

## For AI

`for-ai/tatsuya-takemori.md`が詳細プロフィールの正本です。`scripts/for-ai-page.mjs`がMarkdownから`for-ai/index.html`と同内容の`.txt`を生成します。トップのFor AIタブで、他の項目と同じページ内切り替えで読めます（`#for-ai`）。`for-ai/`は直接参照用として維持しています。本文はJavaScriptなしで読め、Markdown・テキストの直接リンクもあります。`npm ci`でビルド依存を導入し、通常のビルドに続いて`node scripts/verify-for-ai.mjs`でリンク・生成物・公開範囲を確認します。

`.preview/`の編集メモ、調査レポート、出典の取得記録、過去のドラフトは公開対象に含めません。

6項目のナビゲーションは広い画面では6列、760px以下では3列×2行です。For AI本文もビルド時にHTMLへ埋め込み、タブを押した際の追加通信はありません。`#ai-section-<番号>`の直接リンクでもFor AIを開きます。本文の正本は引き続きMarkdownです。
