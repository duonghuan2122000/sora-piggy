# Design — PBI 20: Cập nhật TopNav

## Tổng quan
Sử dụng flexbox để chia TopNav thành 2 cột: left (title) và right (toolbar). Dùng SCSS variables và mixins để dễ tái sử dụng và đảm bảo alignment. Đề xuất sử dụng Ant Design Vue `a-select` cho combobox chọn ngôn ngữ.

## Chi tiết kỹ thuật

- Shared UI components (BẮT BUỘC):
  - Tất cả component UI dùng chung (Button, Select, Combobox, AutoComplete, v.v.) phải được định nghĩa trong `src/renderer/src/components/ui/` theo tiền tố `Sora` (ví dụ: `SoraButton.vue`, `SoraSelect.vue`, `SoraCombobox.vue`, `SoraAutoComplete.vue`, `SoraLanguageSelect.vue`).
  - Mục đích: đảm bảo consistency, dễ kiểm thử và tái sử dụng giữa các views.
  - API: mỗi Sora* component nên expose props và events tương tự component Ant Design Vue nhưng đơn giản hóa và wrapper các props cần thiết (ví dụ: `options`, `value`, `onUpdate:value` / `update:modelValue`).

- TopNav location & usage (KHÔNG di chuyển):
  - Component TopNav giữ nguyên vị trí `src/renderer/src/layouts/TopNav.vue`.
  - Khi cập nhật, TopNav phải import và sử dụng các Sora* components từ `src/renderer/src/components/ui/` (ví dụ `SoraLanguageSelect`) để render toolbar. Không tạo SoraTopNav wrapper và không di chuyển file.

- Thực thi ở levels:
  1. Tạo/kiểm tra `src/renderer/src/components/ui/` và các Sora* components cần thiết.
  2. Cập nhật `src/renderer/src/layouts/TopNav.vue` để dùng Sora* components và áp dụng layout flexbox.

- Ví dụ import usage:
  - Trong TopNav: import SoraLanguageSelect từ `src/renderer/src/components/ui/SoraLanguageSelect.vue` và render trong khu toolbar.

  - Sora* components phải có aria-labels, keyboard support và testable events.

- SCSS
  - Thêm biến: `$topnav-height`, `$topnav-padding`, `$topnav-bg` vào `src/renderer/src/assets/scss/_variables.scss`.
  - Tạo mixin `center-flex` để tái sử dụng giữa wrappers.

- Test
  - Unit test cho mỗi Sora* component (props/events) và cho SoraTopNav render đúng cấu trúc (left + right) khi dùng slots.

- Files to change (tóm tắt):
  - src/renderer/src/components/ui/* (create SoraButton.vue, SoraSelect.vue, SoraCombobox.vue, SoraAutoComplete.vue, SoraLanguageSelect.vue)
  - src/renderer/src/layouts/wrappers/SoraTopNav.vue
  - src/renderer/src/layouts/TopNav.vue (update to use wrapper) hoặc views/* where TopNav is implemented
  - src/renderer/src/assets/scss/_variables.scss
  - src/renderer/src/locales/* (nếu cần)

- Lưu ý gitnexus: trước khi sửa symbol nào, chạy impact analysis cho symbol đó (ví dụ: `SoraTopNav`) theo quy định repo.

## Accessibility
- Combobox có label rõ ràng (aria-label)
- Ensure keyboard navigation

## SCSS
- Thêm biến: `$topnav-height`, `$topnav-padding`, `$topnav-bg`
- Thêm mixin `center-flex` để tái sử dụng

## Test
- Unit test cho TopNav render đúng cấu trúc (left + right)
- Test cho LanguageSelect emit sự kiện khi thay đổi

## Files to change
- src/renderer/src/layouts/TopNav.vue
- src/renderer/src/components/LanguageSelect.vue (new)
- src/renderer/src/assets/scss/_variables.scss
- src/renderer/src/locales/* (nếu cần)
