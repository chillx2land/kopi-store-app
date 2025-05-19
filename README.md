# Kopi Store App

コーヒーショップの注文管理アプリケーション

## 概要

Kopi Store Appは、コーヒーショップのオーナーや従業員向けの注文管理アプリケーションです。メニュー管理、注文処理、設定管理などの機能を提供します。

## 技術スタック

- React Native (v0.79.2)
- Expo (v53.0.9)
- TypeScript
- React Navigation
- その他の主要なライブラリ
  - date-fns
  - expo-image-picker
  - react-native-safe-area-context
  - react-native-screens

## 必要要件

- Node.js (v18以上推奨)
- npm または yarn
- iOS開発の場合：
  - macOS
  - Xcode
- Android開発の場合：
  - Android Studio
  - Java Development Kit (JDK)
- Expo CLI
- eas-cli (`npm install -g eas-cli`)

## インストール方法

1. リポジトリのクローン:
```bash
git clone [リポジトリURL]
cd kopi-store-app
```

2. 依存関係のインストール:
```bash
npm install
```

3. iOSの依存関係インストール（iOSの開発時のみ）:
```bash
cd ios
pod install
cd ..
```

## 開発の始め方

1. 開発サーバーの起動:
```bash
npm start
```

2. プラットフォーム別の起動:
- iOS:
```bash
npm run ios
```
- Android:
```bash
npm run android
```
- Web:
```bash
npm run web
```

## リリースビルド手順

1. Expo アカウントへのログイン:
```bash
eas login
```

2. EAS Build の設定:
```bash
eas build:configure
```

3. ビルドの実行:
- iOS開発用ビルド:
```bash
eas build --platform ios --profile development
```
- iOS本番用ビルド:
```bash
eas build --platform ios --profile production
```
- Android開発用ビルド:
```bash
eas build --platform android --profile development
```
- Android本番用ビルド:
```bash
eas build --platform android --profile production
```

4. アプリの提出:
- iOS App Store:
```bash
eas submit -p ios
```
- Google Play Store:
```bash
eas submit -p android
```

## プロジェクト構造

```
kopi-store-app/
├── src/
│   ├── components/     # 共通コンポーネント
│   ├── contexts/       # Reactコンテキスト
│   └── screens/        # 画面コンポーネント
├── assets/            # 画像やフォントなどの静的ファイル
└── docs/             # ドキュメント
```

## 主な機能

- 認証機能（ログイン/ログアウト）
- メニュー管理
- 注文管理
- 設定管理

## 開発進捗

現在、アプリケーションの基本的なUIデザインとモックアップの実装が完了しています。ログイン・ログアウト、メニュー管理（一覧・詳細・編集）、注文管理、設定など、すべての主要画面のUIが実装され、画面間のナビゲーションも問題なく機能しています。各画面ではモックデータを使用して表示を行っており、アプリケーションの基本的な操作フローを確認することができます。

次のフェーズとして、APIサーバーの設計と構築を進めています。バックエンドとの連携を段階的に実装していく予定で、最初のステップとして認証システムとメニュー管理機能のAPI連携から着手します。その後、注文管理システムや設定機能など、残りの機能についても順次APIとの連携を実装していく計画です。

また、アプリケーションの完成度を高めるため、リアルタイムでの注文通知機能やオフラインモードのサポートなども実装を予定しています。これらの機能実装と並行して、アプリケーション全体のパフォーマンス最適化も行っていく予定です。 