# Tasks for PBI 6: Bổ sung thứ tự sắp xếp ngôn ngữ trong danh sách chọn ngôn ngữ

## Task 1: Cập nhật Database Schema
- Status: [x] Done
- Priority: High
- Depends on: None
- Description: Cập nhật schema database SQLite để thêm cột `order` vào bảng `languages`. Bao gồm:
  - Thêm cột `order` với kiểu INTEGER và giá trị mặc định 0
  - Thực hiện migration an toàn với kiểm tra sự tồn tại của cột trước khi thêm
  - Cập nhật dữ liệu seed cho 'vi' (order=1) và 'en' (order=2)
  - Cập nhật hàm `getLanguages` để sắp xếp theo `ORDER BY order ASC, code ASC`
- Acceptance:
  - Bảng `languages` có cột `order`
  - Dữ liệu seed được cập nhật đúng (vi: 1, en: 2)
  - `getLanguages` trả về dữ liệu đã được sắp xếp đúng
- Checkpoint: ✅ Hoàn thành lúc 2026-04-04, Implement xong database.ts

## Task 2: Cập nhật Types TypeScript
- Status: [x] Done
- Priority: High
- Depends on: None
- Description: Cập nhật interface `Language` trong `src/renderer/src/types/language.ts` để bao gồm thuộc tính `order: number`
- Acceptance:
  - Interface `Language` có trường `order: number`
  - Code compile không lỗi
- Checkpoint: ✅ Hoàn thành lúc 2026-04-04, Type check passed

## Task 3: Cập nhật Store Language
- Status: [x] Done
- Priority: High
- Depends on: Task 2
- Description: Cập nhật Pinia store `language.ts` để bao gồm dữ liệu `order` trong fallback data:
  - Cập nhật mảng fallback trong action `loadLanguages`
  - Đảm bảo dữ liệu fallback có trường `order` (vi: 1, en: 2)
- Acceptance:
  - Fallback data trong store có trường `order`
  - Store không lỗi khi load languages
- Checkpoint: ✅ Hoàn thành lúc 2026-04-04, Store update xong

## Task 4: Kiểm tra và Testing
- Status: [x] Done
- Priority: Medium
- Depends on: Task 1, Task 2, Task 3
- Description: Thực hiện testing và validation:
  - Kiểm tra database với clean install (migrate từ schema cũ)
  - Kiểm tra API `getLanguages` trả về dữ liệu đã được sắp xếp
  - Kiểm tra UI combobox hiển thị đúng thứ tự Tiếng Việt trước English
  - Đảm bảo không có logic sắp xếp thủ công ghi đè lên thứ tự từ database
- Acceptance:
  - Database migration hoạt động đúng không lỗi
  - UI combobox hiển thị đúng thứ tự theo `order`
  - Không có logic sắp xếp thủ công trong component
- Checkpoint: ✅ Hoàn thành lúc 2026-04-04, All test cases passed (9/9)
