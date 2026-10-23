# Tatsuya Takemori — Portfolio

公開先: https://tatsuyatakemori.github.io/tatsuya-takemori-portfolio/

GitHub Pagesで配信する静的サイトです。本文と画像はサイト内にあり、React、Babel、外部OGP取得APIは不要です。JavaScriptが無効でも全セクションを読めます。

## 編集と確認

- `data.js`: プロフィール、作品、講演・登壇、メディア出演、研究、論文・解説・博士論文、受賞歴の元データ
- `styles.css`: レイアウトとスマートフォン表示
- `app.js`: セクション切替、検索、年別フィルター
- `scripts/build.mjs`: 元データから `index.html` を生成（Node.js標準機能のみ）
- `assets/thumbnails/`: 表示用WebP画像
- `assets/images.json`: 画像の取得元、参照ページ、撮影クレジット、寸法
- `uploads/`, `variants/`: 以前の元資料とReact版。公開ページからは使用しません。履歴資料として保存しています。

```powershell
node scripts/build.mjs
node scripts/verify.mjs
python -m http.server 8767 --bind 127.0.0.1
```

プレビュー: http://127.0.0.1:8767/

`index.html` は生成物です。直接編集せず、元データまたは生成スクリプトを修正して再生成してください。GitHub Pagesのプロジェクト配下に置くため、CSS・JavaScript・画像は相対パスです。

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
