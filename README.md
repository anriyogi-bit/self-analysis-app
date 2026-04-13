# 自己分析ツール

質問票に回答し、診断結果をアップロードすることで、AIが15の観点から自己分析を行うWebアプリケーションです。

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com) でプロジェクトを作成
2. SQL Editor で `supabase/schema.sql` を実行
3. Storage で `diagnosis-files` バケットを作成（Public access）

### 3. 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成し、以下を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアクセス

## デプロイ

### Vercel

1. GitHubリポジトリにプッシュ
2. Vercelでインポート
3. 環境変数を設定
4. デプロイ

## 技術スタック

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Storage)
- Anthropic Claude API
