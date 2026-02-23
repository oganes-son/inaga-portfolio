INAGA Portfolio Site
クリエイター「いなが」の音楽・デザイン作品を展示する公式ポートフォリオサイトです。


★ Tech Stack
Framework: Next.js

Styling: Tailwind CSS

Animation: Framer Motion

Icons: React Icons

Deployment: Vercel


★ Key Features
Dynamic Visual Experience: 全画面表示のレスポンシブロゴによるインパクトのあるファーストビュー。

Horizontal Scroll: MUSIC/DESIGNそれぞれのセクションで、横スクロールによる作品閲覧。

Visual Hints: スクロール量に応じて変化する左右のグラデーション（もや）エフェクト。

Instagram-style Grid: 「VIEW ALL」から飛べる一覧ページでは、Instagramライクな正方形グリッドレイアウトを採用。

Dynamic Work Details: 作品ごとに専用の詳細ページを自動生成。

Optimized Performance: lib/works.ts によるデータ一括管理システム。1箇所の修正でサイト全体の作品情報が更新されます。


★ Project Structure

app/
  ├── work-type/
  │     └── [type]/     # MUSIC/DESIGN別の一覧ページ
  └── work-slug/
        └── [slug]/     # 作品ごとの詳細ページ
lib/
  └── works.ts          # 作品データの管理（DBの役割）
public/
  └── images/           # 各作品の画像アセット


★ For Creator inaga
新しい作品を追加したいとき↓

① public/images/MUSIC WORKS/ または DESIGN WORKS/ フォルダに画像を入れる

② lib/works.ts を開き、既存のデータをコピーして新しい情報をうまいこと書き換えて

③ descriptionとtool書いて。ここの改行はそのまま反映されるはず

④ 保存してプッシュ


★ Credits
Artist / Creator: Inaga
Developer: Oganesson
