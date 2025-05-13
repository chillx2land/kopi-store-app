# kopi API仕様書 v1.0

## ✅ 認証仕様

- **ユーザーアプリ**：認証なし（userDeviceIdをリクエストに含めて識別）
- **店舗スタッフアプリ**：JWTベース認証
  - `login(email, password)` → JWTトークン返却
  - 各APIに `Authorization: Bearer <token>` ヘッダー付与

---

## ✅ API一覧

### 🟢 ユーザーアプリ向けAPI

| 機能               | Query/Mutation | 引数               | 備考                          |
|--------------------|----------------|-------------------|-------------------------------|
| 店舗一覧取得          | stores         | -                 | is_open == true のみ取得        |
| 店舗詳細取得          | store          | id                |                               |
| メニュー取得          | menuItems      | storeId           |                               |
| 注文作成             | createOrder    | input             | nickname必須                   |
| 注文ステータス取得      | orderStatus    | orderId           |                               |
| 注文履歴取得          | orders         | userDeviceId      |                               |

---

### 🟢 店舗スタッフアプリ向けAPI

| 機能               | Query/Mutation       | 引数               | 備考                          |
|--------------------|---------------------|-------------------|-------------------------------|
| ログイン             | login               | email, password   | JWT返却                        |
| 注文一覧取得          | orders              | storeId, status   |                               |
| 注文詳細取得          | order               | id                |                               |
| 注文ステータス更新      | updateOrderStatus   | orderId, status   |                               |
| 営業状態更新          | updateMyStoreStatus | isOpen            | storeIdはJWTから自動判定         |
| メニュー一覧取得        | menuItems           | storeId           |                               |
| メニュー作成          | createMenuItem      | input             |                               |
| メニュー更新          | updateMenuItem      | menuItemId, input |                               |
| メニュー削除          | deleteMenuItem      | menuItemId        | **物理削除**                    |

---

## ✅ GraphQLスキーマ例（抜粋）

### 🎯 `createOrder`

```graphql
input OrderItemInput {
  menuItemId: ID!
  quantity: Int!
  selectedOptions: JSON
}

input CreateOrderInput {
  userDeviceId: ID!
  storeId: ID!
  nickname: String!
  items: [OrderItemInput!]!
  couponCode: String
  scheduledAt: String
}

type Mutation {
  createOrder(input: CreateOrderInput!): Order
}

type Order {
  id: ID!
  status: String!
  totalAmount: Int!
}
```

### 🎯 updateMyStoreStatus

type Mutation {
  updateMyStoreStatus(isOpen: Boolean!): Store
}

✅ 備考・仕様補足
    •    deleteMenuItem は物理削除
    •    クーポン適用は 1オーダーに1枚のみ
    •    クーポンは 注文作成時のみ 適用
    •    OrderItem に商品名／価格のスナップショット保存済 → メニュー削除後の履歴影響なし
    •    updateMyStoreStatus はJWT内の store_id を参照し対象店舗自動判定
    •    注文ステータス履歴のAPI／テーブルは不要
    •    nicknameは必須入力・未入力（空文字／スペースのみ）はバリデーションエラー
