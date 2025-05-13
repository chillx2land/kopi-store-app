# kopi API ディレクトリ構成 v1.0

## 🗂️ 提案ディレクトリ構成

```
kopi-api/
├── src/
│   ├── modules/
│   │   ├── auth/             # 認証（JWT、ガード）
│   │   ├── users/            # ユーザー（アカウントレス）
│   │   ├── stores/           # 店舗関連
│   │   ├── menu-items/       # メニュー関連
│   │   ├── orders/           # 注文関連
│   │   ├── coupons/          # クーポン関連（あれば）
│   │   └── common/           # 共通モジュール（デコレーター、ガードなど）
│   ├── config/               # 設定（環境変数、DB接続など）
│   ├── prisma/               # Prisma関連ファイル（schema.prisma, seed.tsなど）
│   ├── main.ts               # エントリーポイント
│   └── app.module.ts         # ルートモジュール
├── test/                     # E2Eテスト
├── prisma/                   # Prisma CLI用（migrationsなど）
│   └── migrations/
├── .env                      # 環境変数ファイル
├── .env.example              # 環境変数サンプル
├── nest-cli.json
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🔑 各ディレクトリの役割

* **modules/**

  * 機能ごとのモジュールをまとめる（API仕様書と1:1対応）。
* **config/**

  * DB接続、JWT、GraphQLなど設定ファイル群。
* **prisma/**

  * Prisma用の`schema.prisma`やシードデータを管理。
* **test/**

  * JestなどでのE2Eテスト用ディレクトリ。
* **prisma/migrations/**

  * Prisma CLIが生成するマイグレーションを保持。

---

## ✨ 補足

* **NestJS標準構成**をベースに、kopi専用の機能をモジュール単位で切り分けています。
* `common/` は、ガード・例外フィルター・カスタムデコレーターなど共通処理用。
* Prismaのマイグレーションは `prisma/` ディレクトリにまとめ、DBスキーマの変更管理を明確化。
* **API仕様書.md**と常に対応する形で構成を保つことを推奨します。

この構成で、API開発を効率的に進めましょう 🚀

