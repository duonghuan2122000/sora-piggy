# Proposal: Chuyển giao diện về Ant Design

## Mục tiêu
Chuyển toàn bộ UI của ứng dụng từ Element Plus sang Ant Design Vue (ant-design-vue) để đạt được giao diện nhất quán, bộ component phong phú hơn và tiện lợi khi tuỳ chỉnh theme.

## Tại sao
- Ant Design cung cấp tập component phong phú và nhất quán, nhiều tùy chọn theme và hệ sinh thái lớn.
- Giúp chuẩn hóa UI, dễ duy trì, và tận dụng thư viện component chuẩn (Form, Table, Layout, Modal, Notification, etc.).
- Hiện tại repo dùng Element Plus; migration sẽ cải thiện khả năng mở rộng và đồng nhất giao diện.

## Phạm vi (Scope)
- Thay thế các import và sử dụng Element Plus trong renderer (Vue) sang Ant Design Vue.
- Tạo lớp wrapper / adapter nội bộ (UI wrappers) để giảm thay đổi trực tiếp trong nhiều component.
- Cập nhật theme biến SCSS để map các biến màu/sizes hiện tại sang Ant Design variables.
- Cập nhật các layout chính: MainLayout, Sidebar, TopNav và các components dùng rộng rãi (tables, forms, dialogs, buttons, inputs, selects, datepickers, dropdowns, notifications).

## Không nằm trong phạm vi
- Không thay đổi business logic, schema DB, hoặc IPC giữa renderer ↔ main.
- Không refactor lớn ngoài migration UI (trừ khi cần để hỗ trợ Ant Design).

## Yêu cầu và giả định
- Dự án build bằng Vite + Vue 3. Sử dụng TypeScript.
- Người giữ repo chấp thuận thay dependency và tạo PR từ branch feature.

## Rủi ro
- Thời gian migration có thể lớn nếu nhiều component tuỳ chỉnh dựa trên Element Plus API.
- Khả năng phá vỡ layout: cần kiểm thử giao diện toàn diện.
- Có thể phát sinh regressions do khác biệt hành vi (Modal/Drawer focus, form validation, icon sets).

## Kết quả mong đợi
- Một branch thay dependency, cập nhật imports, và wrappers UI.
- Tài liệu migration ngắn cho devs: cách dùng các UI wrappers mới.
- PR kèm checklist QA (smoke manual + visual checks).

---

Location: openspec/changes/chuyen-giao-dien-ant-design/

