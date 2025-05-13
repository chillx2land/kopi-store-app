# KOPI API ロードマップ v1.0

## 🎯 概要

KOPIプロジェクトのAPIサーバー専用ロードマップです。NestJS + PrismaをベースにGraphQL APIを実装し、ユーザーアプリ／店舗アプリ両方のバックエンドとして機能します。

---

## ✅ フェーズ 1️⃣ セットアップ

* NestJS プロジェクト初期化
* GraphQL モジュール導入
* Prisma セットアップ（PostgreSQL接続）
* 環境変数・設定ファイル作成

---

## ✅ フェーズ 2️⃣ DB設計 & 構築

* `prisma/schema.prisma` にDB設計（既存設計【DBテーブル設計.md】を反映）
* `npx prisma migrate dev` で初期マイグレーション
* シードスクリプトでデータ投入（例：ダミー店舗・メニュー）

---

## ✅ フェーズ 3️⃣ 基本API構築（公開API）

* **stores**

  * 店舗一覧取得（`stores`）
  * 店舗詳細取得（`store`）
* **menuItems**

  * メニュー一覧取得（`menuItems`）

---

## ✅ フェーズ 4️⃣ 注文API

* **createOrder**（注文作成）
* **orderStatus**（注文ステータス取得）
* **orders**（注文履歴取得）
* クーポン適用ロジック追加

---

## ✅ フェーズ 5️⃣ 店舗向けAPI

* **login**（JWTトークン返却）
* **orders**（注文一覧取得）
* **order**（注文詳細取得）
* **updateOrderStatus**（注文ステータス更新）
* **menuItems**（店舗メニュー取得・作成・編集・削除）
* **updateMyStoreStatus**（営業状態更新）

---

## ✅ フェーズ 6️⃣ 認証 & セキュリティ

* JWT認証・ガード実装
* ロールベース認可（スタッフ／マネージャー）
* 入力バリデーション
* エラーハンドリング
* レートリミット

---

## ✅ フェーズ 7️⃣ テスト & QA

* ユニットテスト（サービス・リゾルバ）
* 統合テスト
* E2Eテスト（GraphQLシナリオ）
* API仕様レビュー

---

## ✅ フェーズ 8️⃣ デプロイ & CI/CD

* GitHub Actions 設定

  * Lint／ビルド／テスト
  * デプロイパイプライン
* Heroku / Render へデプロイ
* GraphQL Playground 公開確認

---

## ✅ フェーズ 9️⃣ 拡張 & 最適化

* ログ・監視（例：Winston + Datadog）
* スロークエリ・パフォーマンス監視
* GraphQLスキーマ自動ドキュメント生成
* セキュリティ監査

---

## ✨ 備考

* 仕様は常に\[API仕様書.md]と同期
* DB変更時は `prisma migrate` と `schema.prisma` を最新化
* API実装後は都度テストケースを追加

このロードマップに沿って、堅牢なAPI開発を進めましょう 🚀
