# 令和トラベル - 旅行アプリケーション

令和トラベルは、旅行の計画・管理を行うためのSPA（Single Page Application）です。

## 技術スタック

### フロントエンド
- HTML5 + CSS3 + JavaScript (Vanilla)
- レスポンシブデザイン
- Fetch API for HTTP requests

### バックエンド
- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)
- JWT認証

## 機能

- ユーザー登録・ログイン
- 旅行の作成・編集・削除
- 旅行一覧表示
- 予算管理
- レスポンシブデザイン

## セットアップ

### 前提条件
- Node.js (v18以上)
- MongoDB

### インストール

1. 依存関係をインストール
```bash
cd backend
npm install
```

2. 環境変数を設定
```bash
# backend/.env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/reiwa-travel
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 開発サーバーの起動

1. バックエンドサーバーを起動
```bash
cd backend
npm run dev
```

2. フロントエンドサーバーを起動（別のターミナルで）
```bash
cd frontend
python3 -m http.server 3000
```

### アクセス

- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:5000

## 使用方法

1. ブラウザで http://localhost:3000 にアクセス
2. 新規登録またはログイン
3. 新しい旅行を追加
4. 旅行一覧で管理

## プロジェクト構造

```
TypeScriptApp/
├── frontend/          # HTML フロントエンド
│   └── index.html     # メインのHTMLファイル
├── backend/           # Express バックエンド
│   ├── src/
│   │   ├── models/        # MongoDBモデル
│   │   ├── routes/        # APIルート
│   │   ├── middleware/    # ミドルウェア
│   │   └── types/         # TypeScript型定義
│   └── package.json
└── README.md
```

## API エンドポイント

### 認証
- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/login` - ログイン
- `GET /api/auth/me` - 現在のユーザー情報取得

### 旅行管理
- `GET /api/travels` - 旅行一覧取得
- `GET /api/travels/:id` - 旅行詳細取得
- `POST /api/travels` - 旅行作成
- `PUT /api/travels/:id` - 旅行更新
- `DELETE /api/travels/:id` - 旅行削除

## ライセンス

MIT License
