# SPEC: Bổ sung thứ tự sắp xếp ngôn ngữ trong danh sách chọn ngôn ngữ

## Thông tin PBI
- **Mã PBI**: 6
- **Branch git**: feature/6-bo-sung-thu-tu-sap-x
- **Thư mục**: specs/6

## Mô tả yêu cầu
Bổ sung thứ tự sắp xếp ngôn ngữ trong danh sách chọn ngôn ngữ. Hiện tại, danh sách ngôn ngữ không có thứ tự rõ ràng (được sắp xếp theo code). Yêu cầu thêm trường `order` vào database để cấu hình thứ tự hiển thị trong combobox chọn ngôn ngữ.

## Phạm vi chi tiết

### 1. Database Schema (`src/main/database.ts`)
- Cập nhật bảng `languages` để thêm cột `order` (INTEGER).
- Cập nhật logic seeding dữ liệu ban đầu (nếu cần).
- Cập nhật truy vấn `getLanguages` để sắp xếp theo `order`.

### 2. API & Preload (`src/preload/index.ts`)
- Đảm bảo `getLanguages` trả về dữ liệu đã được sắp xếp.

### 3. Types (`src/renderer/src/types/language.ts`)
- Cập nhật interface `Language` để bao gồm thuộc tính `order`.

### 4. Store (`src/renderer/src/stores/language.ts`)
- Đảm bảo store sử dụng dữ liệu đã được sắp xếp từ API.

### 5. UI (Combobox)
- Hiển thị ngôn ngữ theo thứ tự từ database (không thay đổi logic hiển thị hiện tại, chỉ đảm bảo dữ liệu đầu vào đã được sắp xếp).

## Yêu cầu kỹ thuật cụ thể

### Database
1.  **Migration/Schema Update**:
    *   Thêm cột `order` vào bảng `languages`.
    *   Kiểu dữ liệu: `INTEGER`.
    *   Giá trị mặc định: `0`.
    *   **Logic an toàn cho cột đã tồn tại**:
        *   Kiểm tra sự tồn tại của cột bằng `PRAGMA table_info('languages')`.
        *   Nếu cột `order` chưa tồn tại, thực thi `ALTER TABLE languages ADD COLUMN order INTEGER DEFAULT 0;`.
    *   SQL tạo bảng (cho cài đặt mới):
        ```sql
        CREATE TABLE IF NOT EXISTS languages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          nameEn TEXT,
          order INTEGER DEFAULT 0
        );
        ```

2.  **Seed Data & Data Migration**:
    *   Cập nhật dữ liệu seed ban đầu trong `initDb` để gán thứ tự:
        *   Tiếng Việt (vi): order = 1
        *   English (en): order = 2
    *   **Logic cho cài đặt cũ**:
        *   Sau khi đảm bảo cột `order` tồn tại, cập nhật thứ tự cho các ngôn ngữ mặc định để đảm bảo tính nhất quán (idempotent):
            ```sql
            UPDATE languages SET order = 1 WHERE code = 'vi';
            UPDATE languages SET order = 2 WHERE code = 'en';
            ```
        *   *Lưu ý*: Các ngôn ngữ mới được thêm mà không chỉ định `order` sẽ mặc định là `0`.

3.  **Query Update**:
    *   Cập nhật hàm `getLanguages` trong `database.ts`.
    *   Thay đổi từ `ORDER BY code` sang `ORDER BY order ASC, code ASC`.

### Code Implementation
1.  **`src/main/database.ts`**:
    *   Cập nhật `initDb`:
        *   Thêm cột `order` vào câu lệnh `CREATE TABLE`.
        *   Thêm logic kiểm tra `PRAGMA table_info` và `ALTER TABLE` nếu cần.
        *   Cập nhật logic seed và update dữ liệu t tồn tại.
    *   Cập nhật hàm `getLanguages` để sắp xếp theo `order`.

2.  **`src/renderer/src/types/language.ts`**:
    *   Thêm `order: number` vào interface `Language`.

3.  **`src/renderer/src/stores/language.ts`**:
    *   Cập nhật dữ liệu fallback trong `loadLanguages` để bao gồm `order` (1 và 2).
    *   Kiểm tra getter `availableLanguages` (không cần thay đổi logic, vì data đã được sort từ DB).

## Acceptance Criteria

**AC1: Database Schema**
- GIVEN bảng `languages` tồn tại
- WHEN kiểm tra schema
- THEN thấy cột `order` với kiểu INTEGER và giá trị mặc định là 0

**AC2: Dữ liệu ngôn ngữ**
- GIVEN ứng dụng khởi động
- WHEN gọi API `getLanguages`
- THEN kết quả trả về có trường `order`
- AND Tiếng Việt có `order` = 1
- AND English có `order` = 2

**AC3: Thứ tự hiển thị**
- GIVEN danh sách ngôn ngữ trong database đã được cấu hình `order`
- WHEN mở combobox chọn ngôn ngữ trong UI
- THEN ngôn ngữ được hiển thị theo thứ tự tăng dần của `order` (1, 2, ...)

**AC4: Kiểu dữ liệu Typescript**
- GIVEN file `types/language.ts`
- WHEN kiểm tra interface `Language`
- THEN thấy thuộc tính `order: number`

## Business Rules
1.  **Default Order**: Nếu ngôn ngữ mới được thêm mà không chỉ định `order`, mặc định là `0`.
2.  **Sorting**: Thứ tự hiển thị ưu tiên `order` tăng dần, sau đó mới đến `code` (phụ trợ).
3.  **Unique Order**: Không bắt buộc `order` phải duy nhất (dù khuyến khích để tránh nhầm lẫn), nhưng logic sắp xếp sẽ xử lý được nếu trùng.

## Out of Scope
- Giao diện quản lý thứ tự ngôn ngữ (drag & drop hoặc form chỉnh sửa order) - phần này chỉ đảm bảo lưu trữ và đọc thứ tự từ DB.
- Thêm ngôn ngữ mới (chỉ đảm bảo cơ chế order cho ngôn ngữ hiện có và tương lai).
- *Đã làm rõ*: Logic migrate dữ liệu được xử lý tự động trong `initDb` (kiểm tra cột, cập nhật giá trị mặc định cho ngôn ngữ cũ). Người dùng không cần thao tác thủ công.

## Clarifications & Assumptions

### Clarifications
1.  **Giao diện quản lý thứ tự**: Xác nhận OUT OF SCOPE. Người dùng không thể thay đổi thứ tự ngôn ngữ qua UI.
2.  **Migrate dữ liệu cũ**: Xử lý tự động trong `initDb`. Không cần script migrate riêng.
3.  **Giá trị order mặc định**: Các ngôn ngữ mới thêm mà không chỉ định order sẽ mặc định là 0.
4.  **Thứ tự hiển thị**: Sắp xếp theo `order ASC` (tăng dần), sau đó theo `code ASC` (phụ trợ).

### Assumptions đã thực hiện
> **Assumption:** Schema migration được xử lý bằng cách kiểm tra `PRAGMA table_info` trước khi chạy `ALTER TABLE`. Điều này đảm bảo an toàn cho cơ sở dữ liệu hiện có.
> 
> **Assumption:** Dữ liệu existing cho 'vi' và 'en' sẽ được cập nhật thành order=1 và order=2 tương ứng, ngay cả khi cơ sở dữ liệu đã tồn tại từ trước.
> 
> **Assumption:** Fallback data trong Pinia store sẽ bao gồm trường `order` để đảm bảo tính nhất quán khi API thất bại.
> 
> **Assumption:** `getLanguages` trả về dữ liệu đã được sắp xếp đúng theo yêu cầu (order ASC, code ASC).

### Cần xác nhận từ user
1.  Liệu việc cập nhật order cho existing 'vi' và 'en' (nếu database đã có) có chấp nhận được không? (Giả định: Có, vì là hành động idempotent và cải thiện UX).
2.  Có cần xử lý trường hợp ngôn ngữ mới có cùng order với ngôn ngữ cũ không? (Giả định: Có, secondary sort by code xử lý được).

## Ghi chú triển khai
- Cần chạy `ALTER TABLE` an toàn để không mất dữ liệu cũ.
- Nên kiểm tra xem cột `order` đã tồn tại chưa trước khi thêm (dùng `PRAGMA table_info`).
- Hiện tại `initDb` chỉ tạo bảng nếu không tồn tại, không có cơ chế migrate schema hoàn chỉnh. Cần thêm logic kiểm tra cột.
