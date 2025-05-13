# kopi DBテーブル設計 v1.0

## ✅ User（アカウントレスユーザー）

| column      | type      | note                     |
|-------------|-----------|-------------------------|
| id          | UUID      | PK                       |
| device_id   | string    | デバイス識別子           |
| nickname    | string    | 直近注文時のニックネーム |
| created_at  | timestamp |                         |
| updated_at  | timestamp |                         |

※ ログインなし → 端末識別で一意管理

---

## ✅ Store（店舗）

| column        | type      | note                    |
|---------------|-----------|------------------------|
| id            | UUID      | PK                      |
| name          | string    | 店舗名                  |
| address       | string    | 住所                    |
| phone_number  | string    | 電話番号                |
| opening_hours | jsonb     | 営業時間設定            |
| is_open       | boolean   | 現在営業中フラグ        |
| created_at    | timestamp |                         |
| updated_at    | timestamp |                         |

---

## ✅ StoreStaff（店舗スタッフアカウント）

| column        | type      | note                    |
|---------------|-----------|------------------------|
| id            | UUID      | PK                      |
| store_id      | UUID      | FK: Store.id            |
| email         | string    | ログインID              |
| password_hash | string    | ハッシュ化パスワード     |
| role          | enum      | ["staff", "manager"]    |
| created_at    | timestamp |                         |
| updated_at    | timestamp |                         |

---

## ✅ MenuItem（メニュー）

| column      | type      | note                    |
|-------------|-----------|------------------------|
| id          | UUID      | PK                      |
| store_id    | UUID      | FK: Store.id            |
| name        | string    | 商品名                  |
| description | text      | 商品説明                |
| price       | integer   | 基本価格（円）          |
| image_url   | string    | 画像URL                 |
| is_active   | boolean   | 販売中フラグ            |
| created_at  | timestamp |                         |
| updated_at  | timestamp |                         |

---

## ✅ MenuItemOption（メニューオプション）

| column        | type      | note                    |
|---------------|-----------|------------------------|
| id            | UUID      | PK                      |
| menu_item_id  | UUID      | FK: MenuItem.id         |
| name          | string    | オプション名（例：サイズ） |
| choices       | jsonb     | [{label, price_diff}]    |
| is_required   | boolean   | 必須選択フラグ          |
| created_at    | timestamp |                         |
| updated_at    | timestamp |                         |

---

## ✅ Order（注文）

| column        | type      | note                                    |
|---------------|-----------|----------------------------------------|
| id            | UUID      | PK                                      |
| user_id       | UUID      | FK: User.id                             |
| store_id      | UUID      | FK: Store.id                            |
| nickname      | string    | この注文時のニックネーム               |
| status        | enum      | ["受付済", "調理中", "準備完了", "受取済"] |
| total_amount  | integer   | 合計金額（割引後）                      |
| coupon_id     | UUID      | FK: Coupon.id (nullable)                |
| scheduled_at  | timestamp | 受取予定時間                            |
| created_at    | timestamp |                                         |
| updated_at    | timestamp |                                         |

---

## ✅ OrderItem（注文内商品）

| column        | type      | note                    |
|---------------|-----------|------------------------|
| id            | UUID      | PK                      |
| order_id      | UUID      | FK: Order.id            |
| menu_item_id  | UUID      | FK: MenuItem.id         |
| name          | string    | 商品名（スナップショット）|
| price         | integer   | 単価                    |
| quantity      | integer   | 個数                    |
| options       | jsonb     | 選択したオプション      |

---

## ✅ Coupon（クーポン）

| column         | type      | note                              |
|----------------|-----------|-----------------------------------|
| id             | UUID      | PK                                |
| code           | string    | クーポンコード                    |
| description    | string    | 説明                              |
| discount_type  | enum      | ["fixed", "percent"]              |
| discount_value | integer   | 値 or %                           |
| expires_at     | timestamp | 有効期限                          |
| is_active      | boolean   | 有効フラグ                        |
| created_at     | timestamp |                                   |
| updated_at     | timestamp |                                   |

※ クーポンは **プラットフォーム（kopi）発行** とする

---

## ✅ 仕様補足

- **営業状態管理は `Store.is_open` カラムのみで対応**
- **注文ステータス履歴のテーブルは不要**
- **ユーザー管理は端末単位で十分（アカウントレス）**
- **オプションは店舗ごとに異なる仕様 → MenuItemOption を MenuItem ごとに持たせる**
- **クーポンは全店舗共通（store_id 不要）**

---

この仕様でDB設計を確定とします。
追加や修正があればお知らせください！
