# PBI 18 — Cập nhật color primary cho app

## Mục tiêu
Cập nhật biến color primary của ứng dụng để dùng giá trị primary mặc định của app, đảm bảo giao diện nhất quán và phù hợp với theme mặc định.

## Lý do
- Hiện tại có sự khác nhau giữa các component do nhiều định nghĩa màu primary phân tán.
- Dùng primary mặc định giúp đồng bộ visual, giảm công sức bảo trì và tránh regressions khi cập nhật thư viện UI (Ant Design).

## Phạm vi
- Cập nhật biến theme chính (SCSS variables / theme overrides) trong renderer:
  - src/renderer/src/assets/scss/_variables.scss
  - các file override theme (ví dụ ant-theme.scss hoặc tương đương)
  - kiểm tra và điều chỉnh các component nếu đang dùng giá trị hard-coded

## Tiêu chí nghiệm thu
- Mọi component hiển thị màu primary mới (mặc định) mà không còn dùng các giá trị cũ phân tán.
- Không có lỗi build hoặc TypeScript liên quan đến thay đổi.
- Kiểm tra trực quan (dev server) cho các màn hình chính: TopNav, Buttons, Links, Form controls, Badges.

---

Ngày tạo: 2026-04-12
Người tạo: Claude Code (opsx:propose)
