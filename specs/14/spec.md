# Danh sách giao dịch thu chi

> PBI: 14  
> Branch: feature/14-danh-sach-giao-dich-thu-chi

## Summary

Product Backlog Item này nhằm mục tiêu lấy dữ liệu và hiển thị danh sách giao dịch thu/chi cho người dùng từ database SQLite local. Hiện tại, màn hình danh sách giao dịch thu/chi đã có giao diện nhưng chưa lấy dữ liệu và hiển thị đầy đủ. PBI này sẽ triển khai luồng lấy dữ liệu với các bộ lọc mặc định và phân trang từ phía database, thay vì xử lý ở client-side như hiện tại.

## Goals

1. Triển khai API lấy danh sách giao dịch thu/chi có hỗ trợ phân trang và lọc từ phía database SQLite
2. Cập nhật màn hình danh sách giao dịch sử dụng API mới với các bộ lọc mặc định
3. Hiển thị dữ liệu giao dịch lên bảng danh sách với thông tin đầy đủ (tên, danh mục, tài khoản, số tiền, ngày tháng)
4. Đảm bảo hiệu suất ứng dụng khi xử lý lượng lớn dữ liệu thông qua phân trang phía server
5. Tính tổng thu/chi dựa trên dấu của số tiền (amount > 0 là thu, amount < 0 là chi)
6. Migrate database schema sang UUID v7 và kiểu dữ liệu phù hợp

## Acceptance Criteria

### AC1: Lấy dữ liệu giao dịch với filter mặc định

**Given** - Người dùng truy cập vào màn hình danh sách giao dịch  
**When** - Ứng dụng khởi tạo và thực hiện lấy dữ liệu  
**Then** - Ứng dụng gọi API với các tham số filter mặc định:

- `name`: chuỗi rỗng (không lọc theo tên)
- `categoryId`: null (lấy tất cả danh mục)
- `accountId`: null (lấy tất cả tài khoản)
- `sortBy`: 'newest' (sắp xếp theo ngày mới nhất)
- `page`: 1
- `pageSize`: 10

### AC2: API trả về dữ liệu phân trang

**Given** - API nhận yêu cầu lấy dữ liệu với các tham số phân trang  
**When** - Database thực hiện truy vấn với điều kiện lọc  
**Then** - API trả về đối tượng chứa:

- `data`: mảng các giao dịch theo trang hiện tại
- `total`: tổng số bản ghi thỏa mãn điều kiện lọc
- `page`: trang hiện tại
- `pageSize`: kích thước trang

### AC3: Hiển thị dữ liệu lên bảng danh sách

**Given** - API trả về danh sách giao dịch  
**When** - Ứng dụng nhận được dữ liệu  
**Then** - Dữ liệu được bind vào bảng ElTable và hiển thị các cột:

- Tên giao dịch (name)
- Danh mục (categoryName)
- Tài khoản (accountName)
- Số tiền (amount) - định dạng VND, hỗ trợ số lẻ (VD: 10.02)
- Ngày tháng (time) - định dạng dd/MM/yyyy

### AC4: Xử lý trường hợp không có dữ liệu

**Given** - Database không có bản ghi giao dịch nào  
**When** - Người dùng truy cập màn hình danh sách giao dịch  
**Then** - Hiển thị thông báo "Không có giao dịch nào" (sử dụng i18n key `transactions.empty`)

> **Note:** Bảng danh sách vẫn hiển thị (không ẩn), component ElTable đã xử lý empty state.

### AC5: Chuyển trang và thay đổi kích thước trang

**Given** - Người dùng đang xem danh sách giao dịch  
**When** - Người dùng nhấn chuyển trang hoặc thay đổi pageSize  
**Then** - Ứng dụng gọi lại API với tham số page/pageSize mới và cập nhật bảng dữ liệu

> **Note:** User có thể thay đổi cả page index và page size.

### AC6: Thay đổi bộ lọc

**Given** - Người dùng thay đổi giá trị bộ lọc (danh mục, tài khoản, sắp xếp)  
**When** - Người dùng chọn giá trị lọc mới  
**Then** - Ứng dụng gọi lại API với các tham số lọc mới và reset về trang 1

### AC7: Hiển thị tổng thu/chi theo filter

**Given** - Người dùng đang xem danh sách giao dịch  
**When** - API trả về dữ liệu kèm theo thông tin summary  
**Then** - Ứng dụng hiển thị:

- Tổng số tiền thu (totalIncome): tổng amount > 0 theo filter hiện tại
- Tổng số tiền chi (totalExpense): tổng giá trị tuyệt đối của amount < 0 theo filter hiện tại

> **Note:** Summary query phải theo bộ lọc filter (bao gồm cả categoryId filter).

### AC8: Tổng thu/chi cập nhật khi thay đổi filter

**Given** - Người dùng thay đổi bộ lọc  
**When** - API được gọi lại với filter mới  
**Then** - Tổng thu/chi được cập nhật theo dữ liệu tương ứng với filter mới

### AC9: Số tiền hỗ trợ số lẻ

**Given** - Giao dịch có số tiền lẻ  
**When** - Dữ liệu được lưu và hiển thị  
**Then** - Số tiền được lưu và hiển thị đúng với số lẻ (VD: 10.02 VND)

### AC10: Xử lý lỗi khi truy vấn

**Given** - Khi có lỗi xảy ra trong quá trình truy vấn database  
**When** - API gặp lỗi (ví dụ: database lỗi, timeout, v.v.)  
**Then** - Ứng dụng xử lý như sau:

- Danh sách giao dịch trả về mảng rỗng
- Các trường thông tin summary để giá trị mặc định là 0 (totalIncome: 0, totalExpense: 0)
- Hiển thị toast thông báo lỗi cho user với thông báo có ý nghĩa và dễ hiểu (sử dụng i18n key `transactions.error`)

> **Assumption:** Lỗi database hiếm khi xảy ra trong ứng dụng local, nhưng vẫn cần handle để đảm bảo trải nghiệm user tốt.

### AC11: Category Dropdown lấy dữ liệu từ database

**Given** - Người dùng mở màn hình danh sách giao dịch  
**When** - Combobox Danh mục được render  
**Then** - Dữ liệu danh mục được load từ bảng categories trong database và bind vào combobox

> **Assumption:** Danh mục mặc định "Tất cả" có giá trị null.

### AC12: Account Dropdown lấy dữ liệu từ database

**Given** - Người dùng mở màn hình danh sách giao dịch  
**When** - Combobox Tài khoản được render  
**Then** - Dữ liệu tài khoản được load từ bảng accounts trong database và bind vào combobox

> **Assumption:** Tài khoản mặc định "Tất cả" có giá trị null.

### AC13: Filter theo accountId thay vì account name

**Given** - Người dùng chọn tài khoản trong combobox  
**When** - API được gọi để lọc dữ liệu  
**Then** - Truy vấn sử dụng accountId thay vì account name

### AC14: Search không phân biệt hoa thường và dấu tiếng Việt

**Given** - Người dùng nhập từ khóa tìm kiếm  
**When** - Thực hiện truy vấn database  
**Then** - Kết quả tìm kiếm không phân biệt hoa thường và không phân biệt dấu (VD: "Tim" có thể tìm thấy "Tìm", "tiền" có thể tìm thấy "tiền", "tien")

> **Assumption:** Xử lý search không dấu có thể sử dụng:
>
> - SQLite collation Vietnamese (PRAGMA case_sensitive_like = OFF + custom collation)
> - Normalize chuỗi (remove dấu) trước khi lưu vào database
> - Sử dụng Full-text search (FTS) trong SQLite

### AC15: Logging chỉ ở Electron main process

**Given** - Ứng dụng thực hiện các thao tác  
**When** - Cần ghi log để debug  
**Then** - Log chỉ được ghi ở Electron main process, không log ở renderer/client để đảm bảo security

### AC16: Hiển thị số tiền âm (giao dịch chi)

**Given** - Giao dịch có số tiền âm (amount < 0)  
**When** - Dữ liệu được hiển thị lên bảng  
**Then** - Số tiền được hiển thị dưới dạng số dương với màu đỏ

> **Ví dụ:** `-500.000` hiển thị thành `500.000` với màu đỏ (sử dụng CSS class cho expense)

## UX/Flows

### Luồng chính

```
┌─────────────────────────────────────────────────────────────────┐
│                      Ứng dụng khởi động                         │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  Bước 1: Người dùng mở ứng dụng                                │
│  - App hiển thị giao diện chính                                 │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  Bước 2: Người dùng chọn menu "Giao dịch"                      │
│  - App chuyển hướng về màn hình danh sách giao dịch             │
│  - Router: /transactions                                        │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  Bước 3: App khởi tạo bộ lọc mặc định                           │
│  - Input tên khoản thu/chi: để trống                            │
│  - Danh mục: Tất cả                                             │
│  - Tài khoản: Tất cả                                            │
│  - Loại sắp xếp: Mới nhất                                       │
│  - Page: 1                                                      │
│  - Page size: 10                                                │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  Bước 4: App thực hiện lấy dữ liệu từ SQLite local (Server-side)│
│  - Gọi IPC channel db:getTransactionsWithFilter                │
│  - Database thực hiện WHERE và ORDER BY và LIMIT/OFFSET        │
│  - Trả về dữ liệu phân trang cho client                         │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  Bước 5: App bind dữ liệu và hiển thị cho người dùng           │
│  - ElTable hiển thị danh sách giao dịch                         │
│  - ElPagination hiển thị thông tin phân trang                   │
│  - Tổng thu/chi cập nhật theo dữ liệu                           │
└─────────────────────────────────────────────────────────────────┘
```

### Luồng Load Category và Account Dropdown

```
┌─────────────────────────────────────────────────────────────────┐
│  Bước 1: App khởi tạo màn hình danh sách giao dịch              │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  Bước 2: Gọi IPC để lấy danh sách categories                    │
│  - IPC channel: db:getCategories                                │
│  - Trả về danh sách categories từ bảng categories              │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  Bước 3: Gọi IPC để lấy danh sách accounts                      │
│  - IPC channel: db:getAccounts                                  │
│  - Trả về danh sách accounts từ bảng accounts                  │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  Bước 4: Bind dữ liệu vào combobox                              │
│  - Category combobox: bind categoryName vào label, categoryId  │
│    vào value                                                    │
│  - Account combobox: bind accountName vào label, accountId     │
│    vào value                                                    │
└─────────────────────────────────────────────────────────────────┘
```

### Giao diện màn hình

```
┌──────────────────────────────────────────────────────────────────────┐
│  [Search: _______________]  [Danh mục ▼] [Tài khoản ▼] [Sắp xếp ▼] │
├──────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐                                   │
│  │ Tổng thu    │  │ Tổng chi    │                                   │
│  │ 10.000.000  │  │ 5.000.000   │                                   │
│  └─────────────┘  └─────────────┘                                   │
├──────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ Tên giao dịch    │Danh mục│Tài khoản│   Ngày    │   Số tiền   │  │
│  ├──────────────────┼────────┼─────────┼───────────┼─────────────┤  │
│  │ Lương tháng     │ Thu    │ Tiền mặt│ 01/04/2026│ 10.000.000  │  │
│  │ Tiền điện       │ Chi    │ Ngân hàng│ 02/04/2026│ 500.000     │  │
│  │ ...             │        │         │           │             │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                [< 1 2 3 ... >]       │
└──────────────────────────────────────────────────────────────────────┘
```

## Data Model

### Request Parameters (Filter Options)

```typescript
interface TransactionFilterParams {
  name?: string; // Tên giao dịch (partial match, case-insensitive, không dấu)
  categoryId?: number | null; // Danh mục: null = tất cả, hoặc categoryId cụ thể
  accountId?: number | null; // Tài khoản: null = tất cả, hoặc accountId cụ thể
  sortBy?: 'newest' | 'oldest';
  page: number; // Trang hiện tại (mặc định: 1)
  pageSize: number; // Kích thước trang (mặc định: 10)
}
```

### Response

```typescript
interface PaginatedTransactions {
  data: ITransaction[]; // Danh sách giao dịch theo trang
  total: number; // Tổng số bản ghi thỏa mãn điều kiện
  page: number; // Trang hiện tại
  pageSize: number; // Kích thước trang
  summary: {
    totalIncome: number; // Tổng số tiền thu (amount > 0) theo filter
    totalExpense: number; // Tổng số tiền chi (|amount| với amount < 0) theo filter
  };
}
```

### ITransaction Interface (đã có từ types/transaction.ts)

```typescript
interface ITransaction {
  id: string; // UUID v7
  name: string;
  description: string;
  categoryId: number; // ID danh mục, tham chiếu đến bảng categories
  categoryName?: string; // Tên danh mục (join từ bảng categories)
  accountId: number; // ID tài khoản, tham chiếu đến bảng accounts
  accountName?: string; // Tên tài khoản (join từ bảng accounts)
  amount: number; // Số tiền, hỗ trợ số lẻ (VD: 10.02). Dương là thu, âm là chi
  time: number; // Unix timestamp (milliseconds)
}
```

### ICategory Interface

```typescript
interface ICategory {
  id: number;
  name: string;
  type: 'income' | 'expense'; // Loại danh mục: thu hoặc chi
  icon?: string; // Icon danh mục
  color?: string; // Màu danh mục
}
```

### IAccount Interface

```typescript
interface IAccount {
  id: number;
  name: string;
  type: 'cash' | 'bank'; // Loại tài khoản: tiền mặt hoặc ngân hàng
  balance?: number; // Số dư tài khoản
}
```

### Database Query

```sql
SELECT
  t.id,
  t.name,
  t.description,
  t.categoryId,
  c.name as categoryName,
  t.accountId,
  a.name as accountName,
  t.amount,
  t.time
FROM transactions t
LEFT JOIN categories c ON t.categoryId = c.id
LEFT JOIN accounts a ON t.accountId = a.id
WHERE
  (:name IS NULL OR :name = '' OR LOWER(remove_diacritics(t.name)) LIKE '%' || LOWER(remove_diacritics(:name)) || '%')
  AND (:categoryId IS NULL OR t.categoryId = :categoryId)
  AND (:accountId IS NULL OR t.accountId = :accountId)
ORDER BY
  CASE WHEN :sortBy = 'newest' THEN t.time END DESC,
  CASE WHEN :sortBy = 'oldest' THEN t.time END ASC
LIMIT :pageSize OFFSET :offset;
```

> **Note:** Hàm `remove_diacritics` là custom function để xử lý không dấu tiếng Việt. Xem chi tiết ở phần "Xử lý search không dấu tiếng Việt".

### Summary Query (Tổng thu/chi theo filter)

```sql
-- Tổng thu theo filter (amount > 0)
SELECT COALESCE(SUM(t.amount), 0) as totalIncome
FROM transactions t
WHERE
  (:name IS NULL OR :name = '' OR LOWER(remove_diacritics(t.name)) LIKE '%' || LOWER(remove_diacritics(:name)) || '%')
  AND (:categoryId IS NULL OR t.categoryId = :categoryId)
  AND (:accountId IS NULL OR t.accountId = :accountId)
  AND t.amount > 0;

-- Tổng chi theo filter (amount < 0, lấy giá trị tuyệt đối)
SELECT COALESCE(SUM(ABS(t.amount)), 0) as totalExpense
FROM transactions t
WHERE
  (:name IS NULL OR :name = '' OR LOWER(remove_diacritics(t.name)) LIKE '%' || LOWER(remove_diacritics(:name)) || '%')
  AND (:categoryId IS NULL OR t.categoryId = :categoryId)
  AND (:accountId IS NULL OR t.accountId = :accountId)
  AND t.amount < 0;
```

> **Note:** Summary query có categoryId filter. Khi user chọn category cụ thể, tổng thu/chi sẽ được tính theo category đó.

### Database Schema Migration

#### Schema cũ (hiện tại)

```sql
-- Bảng transactions cũ
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- Lưu tên danh mục (string)
  account TEXT NOT NULL,  -- Lưu tên tài khoản (string)
  amount INTEGER NOT NULL, -- Số tiền (INTEGER, không hỗ trợ số lẻ)
  time TEXT NOT NULL       -- Ngày tháng (TEXT: ISO string)
);
```

#### Schema mới (sau migration)

```sql
-- Bảng transactions mới với UUID v7 và foreign keys
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY, -- UUID v7
  name TEXT NOT NULL,
  description TEXT,
  categoryId INTEGER NOT NULL, -- FK đến bảng categories
  accountId INTEGER NOT NULL,  -- FK đến bảng accounts
  amount REAL NOT NULL,        -- Số tiền (REAL, hỗ trợ số lẻ)
  time INTEGER NOT NULL,       -- Unix timestamp (milliseconds)
  FOREIGN KEY (categoryId) REFERENCES categories(id),
  FOREIGN KEY (accountId) REFERENCES accounts(id)
);

-- Index cho UUID column (UUID v7 có thể sort theo thời gian)
CREATE INDEX IF NOT EXISTS idx_transactions_time ON transactions(time DESC);
```

#### Migration Plan

```sql
-- Bước 1: Tạo bảng tạm để migrate dữ liệu với UUID v7 từ đầu
CREATE TABLE IF NOT EXISTS transactions_new (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  categoryId INTEGER NOT NULL,
  accountId INTEGER NOT NULL,
  amount REAL NOT NULL,
  time INTEGER NOT NULL,
  FOREIGN KEY (categoryId) REFERENCES categories(id),
  FOREIGN KEY (accountId) REFERENCES accounts(id)
);

-- Bước 2: Chuyển dữ liệu từ bảng cũ sang bảng mới với UUID v7 ngay từ đầu
-- Lưu ý: Cần map category string -> categoryId và account string -> accountId
-- Sử dụng JavaScript để tạo UUID v7 hoặc SQLite với randomblob chuyển đổi
INSERT INTO transactions_new (id, name, description, categoryId, accountId, amount, time)
SELECT
  -- Tạo UUID v7 ngay từ đầu (không cần 2 bước)
  lower(hex(randomblob(16))) as id, -- TODO: Thay bằng UUID v7 từ application layer
  t.name,
  t.description,
  (SELECT c.id FROM categories c WHERE c.name = t.category LIMIT 1) as categoryId,
  (SELECT a.id FROM accounts a WHERE a.name = t.account LIMIT 1) as accountId,
  CAST(t.amount AS REAL) as amount, -- Chuyển từ INTEGER sang REAL
  -- Chuyển time từ TEXT sang Unix timestamp
  CASE
    WHEN typeof(t.time) = 'text' THEN strftime('%s', t.time) * 1000
    ELSE t.time
  END as time
FROM transactions t;

-- Bước 3: Xóa bảng cũ và đổi tên bảng mới
DROP TABLE IF NOT EXISTS transactions;
ALTER TABLE transactions_new RENAME TO transactions;

-- Bước 4: Tạo các index mới
CREATE INDEX IF NOT EXISTS idx_transactions_time ON transactions(time DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_categoryId ON transactions(categoryId);
CREATE INDEX IF NOT EXISTS idx_transactions_accountId ON transactions(accountId);
```

> **Assumption:** Migration cần được thực hiện cẩn thận để đảm bảo:
>
> - category string trong bảng cũ có thể map được với category name trong bảng categories
> - account string trong bảng cũ có thể map được với account name trong bảng accounts
> - Nếu không map được, có thể tạo category/account mới hoặc bỏ qua bản ghi đó
> - **UUID v7 được tạo ngay từ đầu trong migration**, không cần 2 bước (tạo tạm rồi regenerate)

### Xử lý search không dấu tiếng Việt

Có 3 cách tiếp cận để xử lý search không dấu tiếng Việt:

**Cách 1: Sử dụng custom function remove_diacritics (Khuyến nghị)**

Tạo custom SQLite function trong Node.js để remove dấu tiếng Việt:

```typescript
// Custom function để remove dấu tiếng Việt
function removeDiacritics(text: string): string {
  if (!text) return '';

  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove các dấu
    .replace(/[đĐ]/g, 'd'); // Thay thế đ -> d
}

// Đăng ký function trong SQLite
database.window_functions = true;
database.create_function('remove_diacritics', 1, removeDiacritics);
```

Sử dụng trong query:

```sql
WHERE LOWER(remove_diacritics(t.name)) LIKE '%' || LOWER(remove_diacritics(:name)) || '%'
```

**Cách 2: Sử dụng Full-Text Search (FTS) trong SQLite**

Tạo bảng FTS và index dữ liệu:

```sql
-- Tạo bảng FTS cho transactions
CREATE VIRTUAL TABLE IF NOT EXISTS transactions_fts USING fts5(
  name,
  content='transactions',
  content_rowid='rowid'
);

-- Trigger để đồng bộ dữ liệu khi insert/update/delete
CREATE TRIGGER IF NOT EXISTS transactions_ai AFTER INSERT ON transactions BEGIN
  INSERT INTO transactions_fts(rowid, name) VALUES (NEW.rowid, NEW.name);
END;

-- Trigger tương tự cho update và delete
-- Query với FTS:
SELECT t.* FROM transactions t
JOIN transactions_fts fts ON t.rowid = fts.rowid
WHERE transactions_fts MATCH :name;
```

**Cách 3: Normalize dữ liệu khi lưu vào database**

Lưu thêm một cột `nameNormalized` chứa tên không dấu:

```sql
-- Thêm cột normalized
ALTER TABLE transactions ADD COLUMN nameNormalized TEXT;

-- Update dữ liệu hiện tại
UPDATE transactions SET nameNormalized = remove_diacritics(name);

-- Index cho cột normalized
CREATE INDEX IF NOT EXISTS idx_transactions_nameNormalized ON transactions(nameNormalized);

-- Query sử dụng cột normalized
WHERE LOWER(t.nameNormalized) LIKE '%' || LOWER(remove_diacritics(:name)) || '%'
```

> **Recommendation:** Sử dụng Cách 1 (custom function remove_diacritics) vì:
>
> - Không cần thay đổi schema database
> - Không cần tạo bảng FTS riêng
> - Linh hoạt và dễ triển khai
> - Performance chấp nhận được cho lượng dữ liệu vừa phải (< 100,000 bản ghi)

### Database Indexes (Cho performance)

```sql
-- Index cho categoryId để tối ưu filter theo danh mục
CREATE INDEX IF NOT EXISTS idx_transactions_categoryId ON transactions(categoryId);

-- Index cho accountId để tối ưu filter theo tài khoản
CREATE INDEX IF NOT EXISTS idx_transactions_accountId ON transactions(accountId);

-- Index cho time để tối ưu sort theo thời gian
CREATE INDEX IF NOT EXISTS idx_transactions_time ON transactions(time DESC);

-- Composite index cho các truy vấn phổ biến (category + time)
CREATE INDEX IF NOT EXISTS idx_transactions_category_time ON transactions(categoryId, time DESC);
```

> **Note:** Cần tạo các index để đảm bảo performance khi truy vấn với filter. Đảm bảo thời gian phản hồi dưới 200ms cho 10,000 bản ghi.

## Non-functional Requirements

1. **Performance**: API truy vấn dữ liệu với phân trang phải có thời gian phản hồi dưới 200ms cho 10,000 bản ghi
2. **Scalability**: Sử dụng LIMIT/OFFSET trong SQL để đảm bảo hiệu suất khi dữ liệu tăng lên
3. **Security**: Dữ liệu được truy vấn từ SQLite local, không có exposed API ra ngoài internet
4. **Maintainability**: Sử dụng prepared statements trong SQLite để tránh SQL injection
5. **Compatibility**: Đảm bảo tương thích với các giá trị danh mục và tài khoản đã có trong hệ thống
6. **Search**: Tìm kiếm theo tên không phân biệt hoa thường và không phân biệt dấu tiếng Việt
7. **UUID v7**: Sử dụng UUID v7 thay vì auto-increment integer cho khóa chính (id)
   - Đảm bảo tính duy nhất toàn cầu
   - UUID v7 sortable theo thời gian
   - Không đoán được ID tiếp theo (bảo mật tốt hơn)
8. **Data Migration**: Database cần migration từ schema cũ sang schema mới (UUID v7, categoryId, accountId, amount REAL)
9. **Logging**: Chỉ log ở Electron main process, không log ở renderer/client để đảm bảo security
10. **Pagination**: Sử dụng server-side pagination (LIMIT/OFFSET) với giao tiếp qua IPC

## Tasks/Notes

### Tasks

#### 1. Database Schema Migration

**Sub-tasks:**

1.1. Tạo script migration từ schema cũ sang schema mới  
1.2. Chuyển đổi id từ INTEGER AUTOINCREMENT sang TEXT (UUID v7)  
1.3. Chuyển đổi category từ TEXT sang categoryId (foreign key)  
1.4. Chuyển đổi account từ TEXT sang accountId (foreign key)  
1.5. Chuyển đổi amount từ INTEGER sang REAL  
1.6. Chuyển đổi time từ TEXT sang INTEGER (Unix timestamp)  
1.7. Tạo các index mới cho bảng transactions  
1.8. Verify dữ liệu sau migration

#### 2. Tạo API lấy giao dịch có phân trang và lọc (Server-side)

**Sub-tasks:**

2.1. Tạo hàm `getTransactionsWithFilter` trong `database.ts`  
2.2. Xây dựng câu SQL query với các điều kiện WHERE, ORDER BY, LIMIT/OFFSET  
2.3. Join với bảng categories và accounts để lấy tên danh mục và tài khoản  
2.4. Sử dụng categoryId trong điều kiện lọc (không phải category string)  
2.5. Sử dụng accountId trong điều kiện lọc (không phải account string)  
2.6. Trả về danh sách giao dịch theo trang và tổng số bản ghi  
2.7. Đăng ký custom function `remove_diacritics` để hỗ trợ search không dấu

> **Note:** Custom function `remove_diacritics` **CHƯA được implement** trong database.ts, cần tạo mới trong task 12

#### 3. Tính tổng thu/chi theo filter (có categoryId filter)

**Sub-tasks:**

3.1. Sửa đổi hàm `getTransactionsWithFilter` để tính tổng thu/chi theo filter hiện tại  
3.2. Query tổng thu: SUM(amount) với điều kiện amount > 0 và categoryId filter  
3.3. Query tổng chi: SUM(ABS(amount)) với điều kiện amount < 0 và categoryId filter  
3.4. **Lưu ý**: Không sử dụng trường category để xác định thu/chi, chỉ dựa vào dấu của amount  
3.5. Trả về trường `summary` trong response

#### 4. Đảm bảo hiệu suất với Database Indexes

**Sub-tasks:**

4.1. Tạo index cho categoryId: `CREATE INDEX IF NOT EXISTS idx_transactions_categoryId ON transactions(categoryId)`  
4.2. Tạo index cho accountId: `CREATE INDEX IF NOT EXISTS idx_transactions_accountId ON transactions(accountId)`  
4.3. Tạo index cho time (DESC): `CREATE INDEX IF NOT EXISTS idx_transactions_time ON transactions(time DESC)`  
4.4. Tạo composite index: `CREATE INDEX IF NOT EXISTS idx_transactions_category_time ON transactions(categoryId, time DESC)`  
4.5. Kiểm tra performance với EXPLAIN QUERY PLAN

#### 5. Đăng ký IPC handler

**Sub-tasks:**

5.1. Thêm handler `db:getTransactionsWithFilter` trong `main/index.ts`  
5.2. Nhận đối tượng filter params từ renderer  
5.3. Xử lý lỗi và trả về response phù hợp  
5.4. Log error ở main process (sử dụng electron-log hoặc console)

#### 6. Expose API qua preload

**Sub-tasks:**

6.1. Thêm phương thức `getTransactionsWithFilter` trong `preload/index.ts`  
6.2. Cập nhật TypeScript type trong `preload/index.d.ts`  
6.3. Đảm bảo type params và response khớp với database layer

#### 7. Load Category Dropdown từ database

**Sub-tasks:**

7.1. Tạo hàm `getAllCategories` trong `database.ts`  
7.2. Đăng ký IPC handler `db:getCategories` trong `main/index.ts`  
7.3. Expose API qua preload  
7.4. Trong SoraTransactionView.vue: gọi API lấy categories khi mount  
7.5. Bind dữ liệu vào category combobox (label: name, value: id)

#### 8. Load Account Dropdown từ database

**Sub-tasks:**

8.1. Tạo hàm `getAllAccounts` trong `database.ts`  
8.2. Đăng ký IPC handler `db:getAccounts` trong `main/index.ts`  
8.3. Expose API qua preload  
8.4. Trong SoraTransactionView.vue: gọi API lấy accounts khi mount  
8.5. Bind dữ liệu vào account combobox (label: name, value: id)

#### 9. Cập nhật SoraTransactionView.vue

**Sub-tasks:**

9.1. Thay thế `getAllTransactions()` bằng `getTransactionsWithFilter()`  
9.2. Truyền các tham số filter mặc định khi khởi tạo:

- Input tên khoản thu/chi: để trống
- Danh mục: null (Tất cả)
- Tài khoản: null (Tất cả)
- Loại sắp xếp: Mới nhất
- Page: 1
- Page size: 10
  9.3. Xử lý sự kiện thay đổi filter và pagination  
  9.4. Khi filter thay đổi, reset về trang 1
  9.5. Sử dụng categoryId và accountId trong filter params thay vì name

#### 10. Hiển thị tổng thu/chi trên giao diện

**Sub-tasks:**

10.1. Thêm hiển thị thẻ "Tổng thu" và "Tổng chi" trên giao diện  
10.2. Bind dữ liệu `summary.totalIncome` và `summary.totalExpense` từ API  
10.3. Định dạng số tiền theo định dạng VND (hỗ trợ số lẻ)

#### 11. Xử lý lỗi (Error Handling)

**Sub-tasks:**

11.1. Trong database layer: wrap các truy vấn trong try-catch, trả về giá trị mặc định khi lỗi  
11.2. Trong IPC handler: handle exception và log error (chỉ ở main process)  
11.3. Trong Vue component: hiển thị toast thông báo lỗi khi API fails với thông báo có ý nghĩa và dễ hiểu cho user  
11.4. Khi lỗi:

- Danh sách giao dịch = mảng rỗng
- summary.totalIncome = 0
- summary.totalExpense = 0
- Hiển thị toast với i18n key `transactions.error`

#### 12. Xử lý search không dấu tiếng Việt

**Sub-tasks:**

12.1. Tạo custom SQLite function `remove_diacritics` trong database.ts  
12.2. Đăng ký function với SQLite database  
12.3. Cập nhật SQL query để sử dụng function này cho search  
12.4. Test với các trường hợp: "tiền" tìm được "tiền", "Tien" tìm được "tiền", "Tim" tìm được "Tìm"

#### 13. Logging chỉ ở Electron main process

**Sub-tasks:**

13.1. Sử dụng electron-log hoặc console trong main process để log  
13.2. KHÔNG sử dụng console.log hoặc các hàm log khác trong renderer/client code  
13.3. Các error cần log: database errors, IPC errors, uncaught exceptions

### Notes

- API `getAllTransactions()` cũ vẫn giữ lại để đảm bảo tương thích ngược với các màn hình khác nếu cần
- Filter danh mục hiện tại chỉ hỗ trợ null hoặc categoryId cụ thể - cần mở rộng nếu có yêu cầu lọc theo danh mục cụ thể
- Số dư (balance) tạm thời bỏ qua, chưa cần tính toán
- Số tiền amount trong database hỗ trợ số lẻ (VD: 10.02) - cần đảm bảo định dạng hiển thị đúng
- Tham chiếu: File `src/main/database.ts` cho các hàm database, `src/renderer/src/views/transactions/SoraTransactionView.vue` cho màn hình danh sách giao dịch
- **UUID v7**: Sử dụng UUID v7 thay vì auto-increment cho khóa chính (id)
  - Tạo UUID từ application layer (JavaScript) trước khi insert vào database
  - Sử dụng package `uuid` để tạo UUID v7: `import { v7 as uuidv7 } from 'uuid'`
  - Database column `id` sử dụng kiểu TEXT để lưu UUID v7
  - UUID v7 sortable theo timestamp, nên có thể sort theo `time` hoặc `id` đều được
  - Cần cập nhật `types/transaction.ts` và các nơi sử dụng `id` từ `number` sang `string`
- **Server-side Pagination**: Phân trang được xử lý ở server (SQLite local), sử dụng LIMIT/OFFSET và giao tiếp qua IPC
- **Logging**: Chỉ log ở Electron main process để đảm bảo security, không log ở renderer
  - Sử dụng log levels: debug, info, warn, error
  - Log format: theo recommend chung của dự án
- **Search**: Chỉ search theo name trong bảng transactions, không cần search theo các trường khác
- **Filter**: Không cần filter theo type của category
- **Bảng categories và accounts đã tồn tại** trong database (xác nhận trong database.ts)
  - Bảng categories có các cột: id, name, type, icon, color
  - Bảng accounts có các cột: id, name, type, balance
- **Không có trường createdAt/updatedAt** trong bảng transactions
- **Hiển thị số tiền âm**: Khi amount < 0, hiển thị số dương với màu đỏ (CSS class cho expense)
- **Xử lý undefined và null**: Khi parameter là `undefined` thì xử lý giống như `null` (null = tất cả)
  - > **Assumption:** JavaScript client gửi `undefined` khi không có filter, database layer xử lý `undefined` thành `null` để lấy tất cả
- **Chưa có nghiệp vụ xóa category/account**: Hiện tại chưa có tính năng cho phép xóa category hoặc account đã tạo, nên không cần xử lý orphan records trong migration
  - > **Assumption:** Khi không có nghiệp vụ xóa, không cần kiểm tra foreign key constraint violations cho categoryId/accountId
- **Migration chạy tự động**: Migration database sẽ chạy tự động khi app khởi động (trong hàm `initDb()`)
- **IPC naming convention**: Sử dụng pattern `db:<entity>:<action>`
  - Ví dụ: `db:getTransactionsWithFilter`, `db:getCategories`, `db:getAccounts`, `db:addTransaction`, etc.
  - > **Assumption:** Đây là convention chuẩn của dự án, đã được kiểm tra trong codebase hiện tại
- **Custom function remove_diacritics**: Hàm này **CHƯA được implement** trong database.ts, cần tạo mới
  - Tạo trong JavaScript (Node.js) và đăng ký với SQLite sử dụng `database.create_function()`
- **Summary query optimization**: Có thể tối ưu thành 1 câu query với CASE WHEN, nhưng cần đảm bảo hiệu năng truy vấn
  - > **Assumption:** Hiện tại dùng 2 câu query riêng biệt (một cho income, một cho expense) để đảm bảo readability và dễ maintain. Có thể tối ưu sau khi benchmark.

### Câu hỏi đã làm rõ (Q&A)

| STT | Câu hỏi                                                                                                                                                 | Câu trả lời                                                                                      | Trạng thái  |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------- |
| Q1  | Khi user chọn category trong combobox thì truy vấn theo mã category (categoryId) trong bảng giao dịch, không liên quan đến amount                       | Đã xác nhận: Bảng giao dịch lưu categoryId tham chiếu đến bảng category                          | ✅ Resolved |
| Q2  | Summary query có cần theo bộ lọc filter (bao gồm category filter) không?                                                                                | Đã xác nhận: Có, summary query phải theo filter                                                  | ✅ Resolved |
| Q3  | Search name có cần không phân biệt dấu và không phân biệt hoa thường không?                                                                             | Đã xác nhận: Có, search case-insensitive và không dấu                                            | ✅ Resolved |
| Q4  | SortBy xử lý theo thời gian giao dịch (time)                                                                                                            | Đã xác nhận: SortBy theo time                                                                    | ✅ Resolved |
| Q5  | User có thể thay đổi cả page size và page index không?                                                                                                  | Đã xác nhận: Có, user có thể thay đổi cả hai                                                     | ✅ Resolved |
| Q6  | Khi gặp lỗi thì xử lý như thế nào?                                                                                                                      | Đã xác nhận: Danh sách trống, summary default 0, hiển thị toast lỗi                              | ✅ Resolved |
| Q7  | Performance cần đảm bảo, cần tối ưu database                                                                                                            | Đã xác nhận: Cần tạo index cho categoryId, accountId, time                                       | ✅ Resolved |
| Q8  | Cần chi tiết từng đầu việc nhỏ để đảm bảo implement đúng                                                                                                | Đã xác nhận: Đã bổ sung sub-tasks chi tiết                                                       | ✅ Resolved |
| Q9  | Số dư (balance) có cần xử lý không?                                                                                                                     | Đã xác nhận: Chưa cần, tạm bỏ qua                                                                | ✅ Resolved |
| Q10 | Empty state có cần hiển thị bảng không?                                                                                                                 | Đã xác nhận: Có, bảng vẫn hiển thị (ElTable đã xử lý empty state)                                | ✅ Resolved |
| Q11 | Sử dụng kiểu dữ liệu nào cho khóa chính (id)?                                                                                                           | Đã xác nhận: Sử dụng UUID v7 (string), không dùng auto-increment                                 | ✅ Resolved |
| Q12 | UUID v7 được tạo ở đâu - database hay application?                                                                                                      | Đã xác nhận: Tạo từ application layer (JavaScript) trước khi insert                              | ✅ Resolved |
| Q13 | Database column cho id cần kiểu gì?                                                                                                                     | Đã xác nhận: TEXT để lưu UUID v7                                                                 | ✅ Resolved |
| Q14 | Database có cần migrate sang uuid v7 cho khóa chính không?                                                                                              | Đã xác nhận: Có, cần migrate sang UUID v7 cho khóa chính                                         | ✅ Resolved |
| Q15 | Combobox category có cần lấy dữ liệu từ database và bind vào combobox không?                                                                            | Đã xác nhận: Có, combobox category nên lấy dữ liệu category từ database và bind vào combobox     | ✅ Resolved |
| Q16 | Combobox account có cần xử lý tương tự category không?                                                                                                  | Đã xác nhận: Có, xử lý tượng tự category (sử dụng accountId tham chiếu đến bảng accounts)        | ✅ Resolved |
| Q17 | Xác định thu/chi có cần dựa trên category không?                                                                                                        | Đã xác nhận: Không, theo dấu của trường amount (amount > 0 là thu, amount < 0 là chi)            | ✅ Resolved |
| Q18 | Trường amount có cần migrate từ INTEGER sang REAL để hỗ trợ số lẻ không?                                                                                | Đã xác nhận: Có, migrate trường amount sang REAL để hỗ trợ số lẻ                                 | ✅ Resolved |
| Q19 | Phân trang nên xử lý ở đâu - client-side hay server-side?                                                                                               | Đã xác nhận: Phân trang server-side (sqlite local) và giao tiếp với client side qua IPC          | ✅ Resolved |
| Q20 | Account filter nên theo id hay name?                                                                                                                    | Đã xác nhận: Filter theo id (sử dụng accountId thay vì account name)                             | ✅ Resolved |
| Q21 | Search không dấu tiếng Việt cần xử lý như thế nào?                                                                                                      | Đã xác nhận: Sử dụng custom function remove_diacritics hoặc collation Vietnamese hoặc FTS        | ✅ Resolved |
| Q22 | Input tên khoản thu/chi có thể nhập có dấu hoặc không dấu, viết hoa hoặc viết thường - database cần đảm bảo truy vấn không phân biệt hoa thường và dấu? | Đã xác nhận: Database cần đảm bảo search không phân biệt hoa thường và không phân biệt có dấu    | ✅ Resolved |
| Q23 | Logging nên ở đâu để đảm bảo security?                                                                                                                  | Đã xác nhận: Chỉ log trên electron (main process), trên client thì không log để đảm bảo security | ✅ Resolved |
| Q24 | Filter dùng number \| null, SQL query đang chưa cập nhật => Cần cập nhật lại query mẫu trong spec.md                                                    | Đã xác nhận: Cập nhật Database Query và Summary Query sử dụng `null` thay vì `'ALL'`             | ✅ Resolved |
| Q25 | Hiện tại chỉ cần search theo name                                                                                                                       | Đã xác nhận: Chỉ search theo name trong bảng transactions                                        | ✅ Resolved |
| Q26 | Hiển thị số dương + màu đỏ (cho giao dịch chi)                                                                                                          | Đã xác nhận: Khi amount < 0, hiển thị số dương với màu đỏ                                        | ✅ Resolved |
| Q27 | Không cần filter theo type của category                                                                                                                 | Đã xác nhận: Không cần filter theo type trong Notes                                              | ✅ Resolved |
| Q28 | Bảng category/account đã tồn tại (đã xác nhận trong database.ts: categories(id, name, type, icon, color), accounts(id, name, type, balance))            | Đã xác nhận: Bảng categories và accounts đã tồn tại, không cần tạo mới                           | ✅ Resolved |
| Q29 | UUID v7 nên sử dụng package uuid (thư viện npm)                                                                                                         | Đã xác nhận: Sử dụng package `uuid` để tạo UUID v7                                               | ✅ Resolved |
| Q30 | Hiện tại, thông tin giao dịch không có trường createdAt/updatedAt                                                                                       | Đã xác nhận: Bảng transactions không có trường createdAt/updatedAt                               | ✅ Resolved |
| Q31 | Hãy thực hiện log theo recommend chung                                                                                                                  | Đã xác nhận: Sử dụng log levels: debug, info, warn, error                                        | ✅ Resolved |
| Q32 | Error toast nên toast một thông báo có ý nghĩa và dễ hiểu cho user                                                                                      | Đã xác nhận: Cập nhật AC10 về error toast - hiển thị thông báo có ý nghĩa và dễ hiểu             | ✅ Resolved |
| Q33 | Khi parameter là `undefined` thì xử lý giống `null` không?                                                                                              | Đã xác nhận: Có, undefined xử lý giống null (null = tất cả)                                      | ✅ Resolved |
| Q34 | Migration có cần 2 bước để tạo UUID v7 không?                                                                                                           | Đã xác nhận: Không, tạo UUID v7 ngay từ đầu trong migration, không cần 2 bước                    | ✅ Resolved |
| Q35 | Custom function `remove_diacritics` đã được implement trong database.ts chưa?                                                                           | **CHƯA được implement**, cần tạo mới (đã kiểm tra trong database.ts)                             | ✅ Resolved |
| Q36 | Summary query có thể tối ưu thành 1 câu query với CASE WHEN không?                                                                                      | Đã xác nhận: Có thể tối ưu, nhưng cần đảm bảo hiệu năng truy vấn                                 | ✅ Resolved |
| Q37 | Khi migration có orphan records (category/account đã bị xóa) thì xử lý thế nào?                                                                         | Đã xác nhận: Chưa có nghiệp vụ xóa category/account, nên không cần xử lý orphan records          | ✅ Resolved |
| Q38 | Migration có chạy tự động khi app khởi động không?                                                                                                      | Đã xác nhận: Có, migration chạy tự động trong hàm initDb() khi app khởi động                     | ✅ Resolved |
| Q39 | Tương tự Q37 - khi xóa category/account thì orphan records xử lý thế nào?                                                                               | Đã xác nhận: Giống Q37 - chưa có nghiệp vụ xóa category/account                                  | ✅ Resolved |
| Q40 | IPC naming convention của dự án là gì?                                                                                                                  | Đã xác nhận: Pattern `db:<entity>:<action>` là convention chuẩn của dự án                        | ✅ Resolved |

(End of file - total 816 lines)
