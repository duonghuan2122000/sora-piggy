# Tasks — PBI 18: Cập nhật color primary

## Tổng quan
Danh sách các bước cần làm để implement thay đổi màu primary tập trung.

### task-001 — Tạo branch công việc
- [x] Completed
- Tạo branch: `pbi-18-cap-nhat-color-primary` (local)
- Commit ban đầu: thêm thư mục openspec/changes (nếu cần) và file spec

### task-002 — Xác định và chuẩn hoá biến primary
- [x] Completed — Đã xác định single source of truth: `src/renderer/src/assets/scss/_variables.scss`
- Tìm nơi định nghĩa màu primary hiện tại
- Chọn single source of truth: `src/renderer/src/assets/scss/_variables.scss`
- Nếu chưa có, thêm biến `$sora-primary` và CSS var `--sora-primary`

### task-003 — Cập nhật giá trị primary
- [x] Completed — Đã đặt biến trung tâm thành `#1890ff` và cập nhật mapping cho Ant tokens
- Đặt biến trung tâm thành giá trị primary mặc định của app (nếu có), ngược lại dùng `#1890ff` làm fallback
- Cập nhật file override Ant Design để Ant components kế thừa (thay đổi trong `_ant_tokens.scss`)

### task-004 — Thay thế hard-coded
- [x] Completed (source) — Đã thay các giá trị hard-coded `#1890ff` trong mã nguồn (ví dụ: SoraAddTransactionView). Không tìm thấy occurrence khác trong `src/` (các kết quả còn lại nằm trong `out/` hoặc `node_modules` — là build artifacts / deps và không nên chỉnh).
- Tìm các giá trị màu cứng trong repo và thay bằng biến trung tâm
- Review từng thay đổi thủ công trước khi commit

### task-005 — Kiểm tra và sửa lỗi
- [x] Completed
- Chạy `npm run typecheck`: OK
- Chạy `npm run lint`: Bị chặn bởi môi trường (ESLint/Prettier báo thiếu plugin `prettier-plugin-tailwindcss`). Cần cài thêm dependency hoặc điều chỉnh config để chạy lint thành công.
- Chạy `npm run dev` và kiểm tra visual ở màn hình chính: TopNav, Buttons, Forms, Badges (khuyến nghị thực hiện thủ công)

### task-006 — Tạo PR và mô tả
- [ ] Pending — chờ xác nhận push & tạo PR
- Tạo PR với tiêu đề: "PBI 18: Cập nhật color primary — dùng giá trị mặc định"
- Ghi rõ file đã thay đổi, lý do, và màn hình cần review

## Ghi chú
- Sau merge, yêu cầu QA review trực quan UI. Nếu muốn, giữ một bản rollback commit để dễ revert màu nếu cần.
- Nếu muốn, tôi có thể:
  - tạo commit & push và tạo PR (yêu cầu bạn xác nhận)
  - hoặc cài dependency thiếu để chạy lint trước khi push
