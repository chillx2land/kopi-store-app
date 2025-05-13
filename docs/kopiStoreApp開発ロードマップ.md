# 🚀 kopiStoreApp 開発ロードマップ v1.0

このロードマップは、店舗スタッフ向けアプリ「kopiStoreApp」のMVPリリースに向けたステップをまとめたものです。各フェーズごとに必要な機能とタスクを順次実装していきます。

---

## 🎯 フェーズ 1️⃣ セットアップ
- [ ] **プロジェクト作成**  
  - React Native + Expo プロジェクトをTypeScriptベースで作成  
  - ディレクトリ構成（screens, components, hooks, graphql, utils）の設計
- [ ] **依存ライブラリ設定**  
  - Apollo Client（GraphQL通信、JWT対応）
  - React Navigation
  - Zustand（状態管理）
- [ ] **初期設定**  
  - 環境変数の設定（APIエンドポイント、認証トークン管理など）

---

## 🎯 フェーズ 2️⃣ ログイン機能
- [ ] **ログイン画面の作成**
  - email/password入力フォーム
  - 入力バリデーション（未入力、形式チェック）
- [ ] **API連携**
  - `login` Mutationの実装 → JWTトークン取得
- [ ] **認証状態管理**
  - 取得したトークンを SecureStore/AsyncStorage に保存
  - ログイン済み状態の保持と画面遷移制御

---

## 🎯 フェーズ 3️⃣ 注文管理機能
- [ ] **注文一覧画面**
  - 注文をステータス別・受取時間順に表示（API: `orders(storeId, status)`）
- [ ] **注文詳細画面**
  - 注文内の商品詳細、ニックネーム、カスタマイズ内容などの表示（API: `order(id)`）
- [ ] **ステータス更新機能**
  - ボタンやドロップダウンでステータス更新（API: `updateOrderStatus(orderId, status)`）

---

## 🎯 フェーズ 4️⃣ 店舗管理機能
- [ ] **営業状態管理**
  - 営業開始／終了ボタンの実装（API: `updateMyStoreStatus(isOpen)`）
- [ ] **店舗情報表示**
  - 店舗名、住所、営業時間などの基本情報表示

---

## 🎯 フェーズ 5️⃣ メニュー管理機能（MVP後でも可）
- [ ] **メニュー一覧取得**
- [ ] **メニュー新規作成／編集／削除**
  - API: `menuItems`, `createMenuItem`, `updateMenuItem`, `deleteMenuItem`

---

## 🎯 フェーズ 6️⃣ プッシュ通知 & UX改善
- [ ] **プッシュ通知連携**
  - Notifee + Firebase Messaging の設定（注文受付、調理開始、準備完了の通知）
- [ ] **UX改善**
  - アニメーションやスケルトンローディングの実装

---

## 🎯 フェーズ 7️⃣ テスト & QA
- [ ] **ユニットテスト**
  - 各コンポーネント、フォーム、バリデーションのテスト（jest + @testing-library/react-native）
- [ ] **E2Eテスト**
  - 実機レベルでのシナリオテスト（Detoxなど）
- [ ] **エラートラッキング**
  - Sentryなどによる本番環境でのエラー監視

---

## 🎯 フェーズ 8️⃣ デプロイ & ビルド
- [ ] **Expo EAS Buildの活用**
  - iOS/Androidビルドの実施
- [ ] **配布**
  - TestFlight / Google Play Internalを利用した配布
- [ ] **ドキュメント整備**
  - READMEや利用ガイドの作成

---

このロードマップに沿って、開発を進めることで、店舗スタッフ向けアプリの主要機能を順次実装し、早期にMVPのリリースを目指せます。  
必要に応じてタスクの優先順位や詳細仕様は調整していきましょう 🚀
