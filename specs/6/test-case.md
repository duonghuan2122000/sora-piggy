# TEST CASE: PBI 6 - Bổ sung thứ tự sắp xếp ngôn ngữ

## TC-001: Database Schema Validation (AC1)
- **Type**: Unit/Integration
- **Priority**: High
- **Status**: [x] Passed
- **Preconditions**:
  - Ứng dụng vừa được khởi động với database mới (clean install).
- **Steps**:
  1. Truy cập SQLite database file (thường nằm tại `~/.config/Sora Piggy/sora-piggy.db`).
  2. Chạy query: `PRAGMA table_info('languages');`.
- **Expected Result**:
  - Bảng `languages` tồn tại.
  - Có cột `order` với type `INTEGER`.
  - Giá trị mặc định (`dflt_value`) cho cột `order` là `0`.
- **Actual Result**: ✅ Passed - Column `order` exists with type INTEGER and default value 0
- **Notes**: Kiểm tra trực tiếp trong file database hoặc thông qua trình quản lý DB.

## TC-002: Migration Testing - Existing Database (Without 'order' column)
- **Type**: Integration
- **Priority**: High
- **Status**: [x] Passed
- **Preconditions**:
  - Có một file database cũ (version trước PBI 6) chưa có cột `order`.
  - Trong database cũ có dữ liệu ngôn ngữ: `vi` (id=1), `en` (id=2).
- **Steps**:
  1. Chạy ứng dụng với file database cũ.
  2. Ứng dụng thực thi logic `initDb`.
  3. Truy vấn database: `SELECT * FROM languages;`.
- **Expected Result**:
  - Ứng dụng không crash.
  - Cột `order` được thêm vào bảng `languages`.
  - Dữ liệu hiện có (`vi`, `en`) được cập nhật:
    - `vi` có `order = 1`.
    - `en` có `order = 2`.
  - Các ngôn ngữ khác (nếu có) có `order = 0` (mặc định).
- **Actual Result**: ✅ Passed - Migration logic safely adds column and updates existing data
- **Notes**: Logic migration nằm trong `src/main/database.ts` (hàm `initDb`).

## TC-003: API Testing - getLanguages Sorting
- **Type**: Unit/Integration
- **Priority**: High
- **Status**: [x] Passed
- **Preconditions**:
  - Database đã được khởi tạo với dữ liệu chuẩn (vi: order 1, en: order 2).
- **Steps**:
  1. Gọi hàm `getLanguages` từ `src/main/database.ts` (hoặc qua IPC).
  2. Kiểm tra danh sách trả về.
- **Expected Result**:
  - Danh sách trả về có trường `order`.
  - Thứ tự sắp xếp: `order ASC` (tăng dần), sau đó `code ASC` (phụ trợ).
  - Ví dụ cụ thể:
    - Nếu có ngôn ngữ mới với `order = 0` (mặc định) và code 'fr': Thứ tự sẽ là `fr` (0) -> `vi` (1) -> `en` (2).
    - Nếu cả 'vi' và 'en' đều có `order = 0`: Thứ tự sẽ là `en` (code 'en') -> `vi` (code 'vi') vì secondary sort `code ASC`.
  - Chi tiết: `vi` (order 1) -> `en` (order 2).
- **Actual Result**: ✅ Passed - Query updated to `ORDER BY order ASC, code ASC`
- **Notes**: Đảm bảo query SQL là `ORDER BY order ASC, code ASC`.

## TC-004: API Testing - Language Interface Type
- **Type**: Unit
- **Priority**: Medium
- **Status**: [x] Passed
- **Preconditions**:
  - Truy cập file source code.
- **Steps**:
  1. Đọc file `src/renderer/src/types/language.ts`.
  2. Kiểm tra interface `Language`.
- **Expected Result**:
  - Interface có thuộc tính `order: number`.
- **Actual Result**: ✅ Passed - Interface has `order: number` property
- **Notes**:

## TC-005: UI Testing - Combobox Display Order
- **Type**: E2E/UI
- **Priority**: High
- **Status**: [x] Passed
- **Preconditions**:
  - Ứng dụng đang chạy.
  - Database đã có dữ liệu ngôn ngữ với `order` được cấu hình.
- **Steps**:
  1. Mở giao diện cài đặt hoặc nơi chọn ngôn ngữ (combobox).
  2. Mở danh sách thả xuống (dropdown).
  3. Quan sát thứ tự các mục.
- **Expected Result**:
  - Ngôn ngữ được hiển thị theo thứ tự tăng dần của `order`.
  - Ví dụ: Tiếng Việt (order 1) xuất hiện trước English (order 2).
- **Actual Result**: ✅ Passed - Data sorted by order from database, no manual override
- **Notes**:
  1. Đảm bảo component sử dụng dữ liệu từ store `availableLanguages`.
  2. Kiểm tra logic getter `availableLanguages` trong store (nếu là computed property) để đảm bảo không áp dụng sắp xếp thủ công (ví dụ: sort theo tên) làm mất thứ tự từ DB.

## TC-006: Store Fallback Data Validation
- **Type**: Unit
- **Priority**: Medium
- **Status**: [x] Passed
- **Preconditions**:
  - Truy cập file source code.
- **Steps**:
  1. Đọc file `src/renderer/src/stores/language.ts`.
  2. Tìm action `loadLanguages`.
  3. Kiểm tra mảng fallback dữ liệu cứng (hardcoded).
- **Expected Result**:
  - Mảng fallback chứa các đối tượng ngôn ngữ.
  - Mỗi đối tượng có trường `order` (ví dụ: `order: 1` cho 'vi', `order: 2` cho 'en').
- **Actual Result**: ✅ Passed - Fallback data has order field (vi: 1, en: 2)
- **Notes**: Cần đảm bảo dữ liệu fallback nhất quán với database để tránh lỗi UI khi API thất bại.

## TC-007: Edge Case - New Language with Default Order
- **Type**: Integration
- **Priority**: Medium
- **Status**: [x] Passed
- **Preconditions**:
  - Database đang chạy.
  - Chức năng thêm ngôn ngữ mới (nếu có) không chỉ định `order`.
- **Steps**:
  1. Thêm một ngôn ngữ mới vào database (ví dụ: code 'fr', name 'Français') mà không chỉ định giá trị `order`.
  2. Gọi API `getLanguages`.
- **Expected Result**:
  - Ngôn ngữ mới có `order = 0` (giá trị mặc định).
  - Trong danh sách sắp xếp, ngôn ngữ mới nằm ở đầu (nếu secondary sort là `code ASC` và 'fr' < 'en'/'vi') hoặc cuối tùy giá trị `code`.
  - Logic sắp xếp không gây lỗi.
- **Actual Result**: ✅ Passed - Default order is 0, sorting works correctly
- **Notes**: Kiểm tra giá trị mặc định trong schema (`DEFAULT 0`).

## TC-008: Edge Case - Duplicate Order Values
- **Type**: Unit/Integration
- **Priority**: Low
- **Status**: [x] Passed
- **Preconditions**:
  - Database có hai ngôn ngữ với cùng giá trị `order`.
- **Steps**:
  1. Cập nhật database: set `order = 1` cho cả 'vi' và 'en'.
  2. Gọi API `getLanguages`.
- **Expected Result**:
  - Danh sách trả về không lỗi.
  - Thứ tự phụ thuộc vào `code ASC` (secondary sort).
  - Ví dụ: 'en' (code 'en') sẽ nằm trước 'vi' (code 'vi') nếu sort code tăng dần.
- **Actual Result**: ✅ Passed - Secondary sort by code handles duplicates correctly
- **Notes**: Xác nhận business rule: "Unique Order: Không bắt buộc order phải duy nhất".

## TC-009: UI Component - No Manual Sorting Override
- **Type**: Code Review/UI
- **Priority**: Medium
- **Status**: [x] Passed
- **Preconditions**:
  - Truy cập file component sử dụng list ngôn ngữ (ví dụ: combobox trong settings).
- **Steps**:
  1. Kiểm tra code trong component (Vue).
  2. Xác nhận source data là từ store `availableLanguages`.
  3. Kiểm tra xem có hàm sort nào được gọi trực tiếp trên dữ liệu trong template hoặc script không (ví dụ: `v-for` có kèm sort, hoặc `computed` property sort lại).
- **Expected Result**:
  - Component hiển thị dữ liệu trực tiếp từ store mà không sắp xếp lại.
  - Nếu có sort, phải đảm bảo không ghi đè thứ tự `order` (ví dụ: chỉ sort secondary hoặc dùng đúng thứ tự từ store).
- **Actual Result**: ✅ Passed - Component uses store data directly without manual sorting
- **Notes**: Risk mitigation cho "Logic sắp xếp bị ghi đè bởi Frontend".
