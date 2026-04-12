# PBI 20 — Cập nhật giao diện TopNav

## Mục tiêu
Cập nhật giao diện TopNav để chia thành 2 cột:
- Bên trái: tiêu đề trang
- Bên phải: toolbar chứa combobox chọn ngôn ngữ

## Lý do
- Tăng tính nhất quán của layout header và dễ mở rộng toolbar.
- Cho phép người dùng chuyển đổi ngôn ngữ nhanh chóng từ TopNav.

## Phạm vi
- Chỉnh sửa component TopNav (renderer).
- Thêm component LanguageSelect (combobox) nếu chưa có.
- Cập nhật SCSS biến/mixin để hỗ trợ layout bằng flexbox.

## Không gồm
- Thay đổi logic i18n core (chỉ tích hợp chọn ngôn ngữ hiện có).
- Thay đổi layout trên các màn hình phụ khác ngoài TopNav.
