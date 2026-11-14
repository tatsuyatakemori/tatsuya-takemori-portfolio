# Tatsuya Takemori — Portfolio

公開先: https://tatsuyatakemori.github.io/tatsuya-takemori-portfolio/

GitHub Pagesで配信する静的サイトです。本文と画像はサイト内にあり、React、Babel、外部OGP取得APIは不要です。JavaScriptが無効でも全セクションを読めます。

## 編集と確認

- `data.js`: プロフィール、作品、講演・登壇、メディア出演、研究、論文・解説・博士論文、受賞歴の元データ
- `styles.css`: レイアウトとスマートフォン表示
- `app.js`: セクション切替、検索、年別フィルター
- `scripts/build.mjs`: 元データから `index.html` を生成（Node.js標準機能のみ）
- `research-details.mjs`: 研究4件の一覧用概要、詳しい解説、関連論文・研究への対応付け
- `research-references.mjs`: 本文・動画に対応する参考資料、公開本文リンク、日本語の読み方ガイド
- `scripts/research-pages.mjs`: 研究の子ページを生成する共通テンプレート
- `research/<id>/index.html`: 研究・初期作品の子ページ（生成物）
- `assets/thumbnails/`: 表示用WebP画像
- `assets/images.json`: 画像の取得元、参照ページ、撮影クレジット、寸法
- `uploads/`, `variants/`: 以前の元資料とReact版。公開ページからは使用しません。履歴資料として保存しています。

```powershell
node scripts/build.mjs
node scripts/verify.mjs
node scripts/verify-navigation.mjs
node scripts/verify-references.mjs
python -m http.server 8767 --bind 127.0.0.1
```

プレビュー: http://127.0.0.1:8767/

`index.html` は生成物です。直接編集せず、元データまたは生成スクリプトを修正して再生成してください。GitHub Pagesのプロジェクト配下に置くため、CSS・JavaScript・画像は相対パスです。

## 研究の子ページを充実させる

対象は「Early Works / Research 京都大学時代」の4件です。講演・メディアに子ページは作りません。

`research-details.mjs` の `summary` が一覧と子ページ冒頭の短い概要、`sections` が見出しごとの解説です。長い文章を一段落に詰めず、`paragraphs` に段落単位で追加します。`points` は動作例や成果など、並列に読める項目に使います。

`research-references.mjs` の `papers` は `data.js` の雑誌論文・国際会議・学位論文とURLで照合し、書誌を再利用します。`sources` は本人の製作記、大学の記事、主催者の結果など。各資料に安定した `id`、日本語の案内 `label`、読む目的 `note` を付け、`sectionRefs` / `paragraphRefs` / `pointRefs` で説明に対応付けます。番号はページ内で自動採番されます。`readUrl` はDOIの転送先に問題がある場合などの閲覧用URLです。

`videos` はページ内のYouTube埋め込みと、再生できない場合の外部リンクを生成します。各動画の `section` を `overview` または本文の節IDに指定すると、対応する説明の近くへ配置されます。動画はすべて常時表示し、開閉式にはしません。本文と資料一覧はJavaScriptなしで読めます。動画の再生はYouTubeに依存します。

Works末尾の `data-section-link="research"` は、研究タブを開いて本文先頭へスクロールする導線です。JavaScript無効時も通常の `#research` リンクとして動作します。

2026-11-14の資料調査・確認範囲・注意点は [参考資料の更新記録](docs/research-references-2026-11-14.md) を参照してください。外部確認は必要なときだけ `node scripts/check-reference-links.mjs` と `node scripts/check-research-sources.mjs` で実行できます。HTTP応答やoEmbed成功は、実際の動画再生を保証しません。

一覧用の動画は `data.js` の各研究の `media` で管理します。子ページで既存の資料を落とさないよう、`media` のリンクと `research-details.mjs` の従来の `publicationUrls` は検証用にも保持しています。新しい資料は `research-references.mjs` に追加してください。

生成後の `research/` も `index.html` とともに公開します。子ページはJavaScriptなしで読め、`#research-<id>` の戻り先で一覧の研究タブが開きます。検証スクリプトは子ページの画像、相対リンク、ページ内リンク、研究資料の引継ぎと、戻る際のタブ選択を確認します。

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

2026-10-23、Git CLIの非対話push dry-runが成功し、従来の認証不足は解消を確認しました。更新ブランチは `update/portfolio-20261023` です。公開設定はこの作業では変更していません。

更新ブランチの差分をレビューして公開用ブランチへ反映してください。GitHub Pagesの実際の配信ブランチ・設定はリポジトリのSettings > Pagesで確認してください。更新ブランチのpushと公開サイトへの反映は別です。

## 内容の出典

2026年に追加した作品と確認範囲は [更新記録](docs/update-20261023.md) を参照。画像の取得成功は動画本編の再生確認や、すべての過去の経歴の再検証を意味しません。
