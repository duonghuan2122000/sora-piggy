# Thiết kế kỹ thuật — Cập nhật color primary

## Tổng quan
Mục đích là chuyển toàn bộ hệ thống theme để sử dụng duy nhất một biến primary (central theme variable). Nếu repo đã có biến primary trung tâm, cập nhật giá trị đó; nếu chưa, tạo biến và dùng giá trị mặc định của Ant Design (#1890ff) làm fallback.

## Các bước thực thi (kỹ thuật)
1. Xác định biến primary hiện có
   - Tìm trong `src/renderer/src/assets/scss/` các file chứa `$primary`, `--primary-color`, `@primary-color` hoặc `--ant-primary-color`.
2. Chọn một nguồn chân chính (single source of truth)
   - Ưu tiên: `_variables.scss` trong assets/scss.
   - Nếu không có, tạo biến `$sora-primary` hoặc CSS var `--sora-primary` trong `_variables.scss` và export cho toàn app.
3. Đặt giá trị thành "primary mặc định của app"
   - Nếu project đã định nghĩa rõ giá trị mặc định trước đây thì sử dụng giá trị đó.
   - Nếu không rõ, dùng Ant Design default `#1890ff` như fallback và ghi chú rõ trong commit.
4. Cập nhật overrides cho Ant Design (nếu có)
   - Kiểm tra file override theme (vd. ant-theme.scss) và cập nhật `@primary-color` hoặc biến tương ứng để Ant components kế thừa.
5. Tìm và thay thế các giá trị hard-coded
   - Grep các màu hex phổ biến (ví dụ các màu trước đó) và thay bằng biến trung tâm.
   - Không thay thế blind — review từng thay đổi.
6. Build & kiểm tra
   - Chạy `npm run dev` và test giao diện.
   - Chạy `npm run typecheck` và `npm run lint` để đảm bảo không phá vỡ build.

## Rủi ro & biện pháp giảm thiểu
- Rủi ro: Thay đổi màu có thể gây visual regressions.
  - Giảm thiểu: review thủ công các màn hình quan trọng và revert giá trị nếu cần.
- Rủi ro: Không tìm hết chỗ dùng màu hard-coded.
  - Giảm thiểu: sau thay đổi chạy grep để tìm hex codes còn lại và bổ sung vào tasks nếu cần.

## Files chính cần chỉnh sửa
- src/renderer/src/assets/scss/_variables.scss
- src/renderer/src/assets/scss/ant-theme.scss (hoặc file override tương đương)
- các component dùng directly color (nếu có)
