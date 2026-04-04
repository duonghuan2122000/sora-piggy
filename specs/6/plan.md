# PLAN: PBI 6 - Bổ sung thứ tự sắp xếp ngôn ngữ

## Tổng quan giải pháp
Mục tiêu của PBI này là thêm khả năng sắp xếp thứ tự hiển thị cho các ngôn ngữ trong danh sách chọn. Hiện tại, ngôn ngữ được sắp xếp theo mã code (`ORDER BY code`). Yêu cầu là thêm trường `order` vào cơ sở dữ liệu để cho phép định cấu hình thứ tự hiển thị (ví dụ: Tiếng Việt trước, English sau).

Giải pháp bao gồm:
1.  Mở rộng schema SQLite (thêm cột `order`).
2.  Cập nhật dữ liệu seed cho ngôn ngữ mặc định.
3.  Cập nhật truy vấn để sắp xếp theo `order` (tăng dần), rồi đến `code`.
4.  Cập nhật interface TypeScript và dữ liệu fallback trong store.

## Architecture & Design

### Text-based Architecture Diagram

```mermaid
graph TD
    subgraph "Main Process (Electron)"
        DB[SQLite Database]
        IPC_Handler[IPC Handlers]
    end

    subgraph "Preload"
        API[Context Bridge API]
    end

    subgraph "Renderer (Vue 3)"
        Store[Pinia Store (language.ts)]
        UI[Language Combobox]
    end

    UI --> Store
    Store --> API
    API --> IPC_Handler
    IPC_Handler --> DB

    %% Data Flow
    DB -- "SELECT * FROM languages ORDER BY order ASC, code ASC" --> IPC_Handler
    IPC_Handler -- "getLanguages()" --> API
    API -- "window.api.getLanguages()" --> Store
    Store -- "availableLanguages" --> UI
```

### Component Design
*   **Database (`src/main/database.ts`)**:
    *   `initDb`: Cập nhật `CREATE TABLE` và logic thêm cột `order` (migration an toàn).
    *   `getLanguages`: Cập nhật câu lệnh SQL để sắp xếp theo `order`.
*   **Types (`src/renderer/src/types/language.ts`)**:
    *   Cập nhật interface `Language` để bao gồm `order: number`.
*   **Store (`src/renderer/src/stores/language.ts`)**:
    *   Cập nhật dữ liệu fallback trong `loadLanguages` để bao gồm `order`.
    *   Getter `availableLanguages` không cần thay đổi logic vì dữ liệu đã được sort từ DB.

## Implementation Steps

1.  **Cập nhật Database Schema (`src/main/database.ts`)**:
    *   Sửa hàm `initDb` để thêm cột `order` vào bảng `languages`.
    *   Sử dụng `PRAGMA table_info` để kiểm tra sự tồn tại của cột trước khi chạy `ALTER TABLE`.
    *   Cập nhật dữ liệu seed cho 'vi' và 'en' với `order` tương ứng (1 và 2).
    *   Cập nhật hàm `getLanguages` để sử dụng `ORDER BY order ASC, code ASC`.

2.  **Cập nhật Interface TypeScript (`src/renderer/src/types/language.ts`)**:
    *   Thêm thuộc tính `order: number` vào interface `Language`.

3.  **Cập nhật Store (`src/renderer/src/stores/language.ts`)**:
    *   Cập nhật mảng fallback trong `loadLanguages` để bao gồm trường `order`.

4.  **Kiểm tra và Xác nhận**:
    *   Đảm bảo UI combobox hiển thị đúng thứ tự mới.
    *   Kiểm tra trường hợp database đã tồn tại (migration).

## Database Changes

### Schema
Bảng `languages` hiện tại:
```sql
CREATE TABLE IF NOT EXISTS languages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  nameEn TEXT
);
```

Bảng `languages` sau khi cập nhật:
```sql
CREATE TABLE IF NOT EXISTS languages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  nameEn TEXT,
  order INTEGER DEFAULT 0
);
```

### Migration Logic (trong `initDb`)
1.  **Kiểm tra cột tồn tại**:
    ```sql
    PRAGMA table_info('languages');
    ```
    Kiểm tra xem cột `order` đã tồn tại chưa.
2.  **Thêm cột nếu chưa có**:
    ```sql
    ALTER TABLE languages ADD COLUMN order INTEGER DEFAULT 0;
    ```
3.  **Cập nhật dữ liệu seed**:
    *   `UPDATE languages SET order = 1 WHERE code = 'vi';`
    *   `UPDATE languages SET order = 2 WHERE code = 'en';`

### Query Changes
*   Hàm `getLanguages` trong `database.ts` sẽ thay đổi từ:
    ```sql
    SELECT * FROM languages ORDER BY code
    ```
    Thành:
    ```sql
    SELECT * FROM languages ORDER BY order ASC, code ASC
    ```

## API Changes
Không có thay đổi về API. `getLanguages` trả về dữ liệu đã được sắp xếp từ database, đảm bảo tính nhất quán.

## Frontend Changes

### 1. Types (`src/renderer/src/types/language.ts`)
Cập nhật interface:
```typescript
export interface Language {
  id: number;
  code: string;
  name: string;
  nameEn?: string;
  order: number; // Thêm trường mới
}
```

### 2. Store (`src/renderer/src/stores/language.ts`)
Cập nhật dữ liệu fallback trong action `loadLanguages`:
```typescript
// Fallback to hardcoded languages
this.languages = [
  { id: 1, code: 'vi', name: 'Tiếng Việt', nameEn: 'Vietnamese', order: 1 },
  { id: 2, code: 'en', name: 'English', nameEn: 'English', order: 2 }
];
```

### 3. Component (Combobox)
*   **Yêu cầu**: Hiển thị ngôn ngữ theo thứ tự từ database.
*   **Thay đổi**: Không cần thay đổi logic component nếu component hiện tại sử dụng dữ liệu từ store `availableLanguages` (đã được sort từ DB). Cần kiểm tra lại component để đảm bảo không có logic sắp xếp thủ công nào ghi đè lên thứ tự từ DB.

## Testing Strategy

### Đơn vị (Unit Tests)
*   Chưa có framework test hiện tại, nhưng nếu thêm:
    *   Kiểm tra `initDb` đảm bảo cột `order` được tạo.
    *   Kiểm tra `getLanguages` trả về dữ liệu đã được sắp xếp đúng.

### Tích hợp (Integration)
1.  **Kiểm tra Database**:
    *   Chạy ứng dụng với database mới (clean install).
    *   Kiểm tra schema `languages` có cột `order`.
    *   Kiểm tra dữ liệu seed: `vi` có `order=1`, `en` có `order=2`.
2.  **Kiểm tra Database Cũ (Migration)**:
    *   Chạy ứng dụng với database cũ (không có cột `order`).
    *   Kiểm tra ứng dụng không lỗi, cột `order` được thêm tự động.
    *   Kiểm tra dữ liệu `vi` và `en` được cập nhật `order`.
3.  **Kiểm tra UI**:
    *   Mở combobox chọn ngôn ngữ.
    *   Xác nhận thứ tự hiển thị: Tiếng Việt (order 1) trước English (order 2).

### Kiểm thử Acceptance Criteria (AC)
*   **AC1**: Kiểm tra schema database.
*   **AC2**: Kiểm tra API `getLanguages` trả về `order`.
*   **AC3**: Kiểm tra UI combobox hiển thị đúng thứ tự.
*   **AC4**: Kiểm tra interface TypeScript có thuộc tính `order`.

## Risks & Mitigations

### Risk 1: Mất dữ liệu khi thêm cột
*   **Mô tả**: Sử dụng câu lệnh `ALTER TABLE` không đúng có thể gây lỗi hoặc mất dữ liệu (tuy nhiên `ALTER TABLE ADD COLUMN` trong SQLite thường an toàn).
*   **Mitigation**: Sử dụng logic kiểm tra `PRAGMA table_info` trước khi chạy `ALTER TABLE`. Đảm bảo cột `order` có giá trị mặc định `DEFAULT 0`.

### Risk 2: Logic sắp xếp bị ghi đè bởi Frontend
*   **Mô tả**: Component UI có thể có logic sắp xếp thủ công (ví dụ: sort theo tên) làm mất thứ tự từ database.
*   **Mitigation**: Kiểm tra kỹ các component hiển thị danh sách ngôn ngữ. Đảm bảo component hiển thị dữ liệu trực tiếp từ store mà không sắp xếp lại.

### Risk 3: Conflict với các nhánh/feature khác
*   **Mô tả**: Thay đổi schema database có thể ảnh hưởng đến các tính năng khác đang phát triển.
*   **Mitigation**: Kiểm tra kỹ các PR hiện có. Thực hiện migration an toàn để không phá vỡ các tính năng hiện tại.

### Risk 4: Dữ liệu fallback không đầy đủ
*   **Mô tả**: Nếu API thất bại, store sử dụng dữ liệu fallback cứng. Nếu fallback không có `order`, UI có thể lỗi hoặc hiển thị không đúng.
*   **Mitigation**: Cập nhật đầy đủ trường `order` trong dữ liệu fallback.

## Timeline Estimate
*   Cập nhật Database & Types: 15 phút
*   Cập nhật Store & UI: 15 phút
*   Kiểm tra & Testing: 15 phút
*   **Tổng cộng**: ~45 phút
