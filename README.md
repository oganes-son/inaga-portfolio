# いなが ポートフォリオ

音楽・グラフィックデザイン作品のポートフォリオサイト。
**https://inagainaga.vercel.app**

---

## 技術スタック

| カテゴリ | 使用技術 |
|---------|---------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS v4 |
| アニメーション | Framer Motion |
| 3D | Three.js / React Three Fiber |
| D&D | @dnd-kit |
| デプロイ | Vercel |
| コンテンツ管理 | GitHub API（管理画面からコミット） |

---

## 主な機能

- **フルスクリーンロゴ** — インパクトのあるファーストビュー
- **横スクロールギャラリー** — MUSIC / DESIGN 作品を横スクロールで閲覧
- **埋め込みプレイヤー** — メインページでサンプル楽曲を再生（音声ビジュアライザー付き）
- **作品詳細ページ** — 各作品の専用ページを自動生成
- **SNSリンク** — SoundCloud / YouTube / Niconico / Spotify / Apple Music / Amazon Music
- **管理画面** — コードを触らずに作品・ニュースを追加・編集・削除・並び替え

---

## ディレクトリ構成

```
inaga-portfolio/
├── app/
│   ├── page.tsx              # メインページ
│   ├── layout.tsx            # レイアウト・メタデータ・JSON-LD
│   ├── sitemap.ts            # サイトマップ自動生成
│   ├── robots.ts             # robots.txt 自動生成
│   ├── admin/
│   │   └── page.tsx          # 管理画面（認証付き）
│   ├── api/admin/
│   │   ├── auth/route.ts     # パスワード認証 API
│   │   ├── data/route.ts     # works.json 取得・更新 API
│   │   └── image/route.ts    # 画像・MP3 アップロード・削除 API
│   ├── work-slug/[slug]/
│   │   └── page.tsx          # 作品詳細ページ
│   └── work-type/[type]/
│       └── page.tsx          # MUSIC / DESIGN 一覧ページ
├── components/
│   └── VisualizerStyle2.tsx  # メインページ埋め込みプレイヤー
├── hooks/
│   └── useAudioVisualizer.ts # 音声ビジュアライザーフック
├── lib/
│   └── works.ts              # データ型定義・エクスポート
├── data/
│   └── works.json            # 作品・ニュースデータ（管理画面で編集）
└── public/
    ├── images/
    │   ├── MUSIC WORKS/      # 音楽作品画像
    │   └── DESIGN WORKS/     # デザイン作品画像
    └── music/                # MP3 ファイル
```

---

## ローカル開発

```bash
npm install
npm run dev
```

`http://localhost:3000` で起動。

---

## 環境変数

Vercel のダッシュボードで以下を設定する。

| 変数名 | 内容 |
|--------|------|
| `ADMIN_PASSWORD` | 管理画面のパスワード |
| `GITHUB_TOKEN` | GitHub Personal Access Token（`contents: write` 権限） |

ローカルで試す場合は `.env.local` を作成：

```
ADMIN_PASSWORD=your_password
GITHUB_TOKEN=your_github_token
```

---

## 管理画面

`/admin` にアクセス（URL を知っている人のみ利用可）。

### できること

| タブ | 操作 |
|------|------|
| MUSIC | 音楽作品の追加・編集・削除・並び替え |
| DESIGN | デザイン作品の追加・編集・削除・並び替え |
| NEWS | お知らせの追加・編集・削除・並び替え |
| PLAYER | メインページの埋め込みプレイヤーの楽曲変更・MP3アップロード |

### 保存の流れ

1. 「一時保存」でローカルに反映（この時点では GitHub に送られない）
2. 全ての編集が終わったら「**全てコミット ↑**」で GitHub にプッシュ
3. Vercel が自動リビルド（1〜2分でサイトに反映）

---

## デプロイ

`main` ブランチへのプッシュで Vercel が自動デプロイする。
管理画面からの操作も同じく `main` ブランチにコミットされる。

---

## Credits

- **Artist / Creator** : いなが
- **Developer** : oganesson
