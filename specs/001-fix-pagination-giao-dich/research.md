# Research: Sửa lỗi phân trang danh sách giao dịch

## Root Cause Analysis

**Bug**: Click vào số trang / nút Previous/Next trên thanh phân trang không có phản hồi.

**Investigation**:

1. `SoraTransactionView.vue` định nghĩa `onTableChange(pagination)` handler — cập nhật `page`/`pageSize` khi Ant Design table fire `change` event.

2. `SoraTable.vue` wrapper nhận `@change` từ `<a-table>` và forward lên parent bằng `getCurrentInstance().emit('change', ...args)` — dòng 31.

3. **Root cause**: `getCurrentInstance()` trong Vue 3 chỉ hoạt động trong `setup()` hoặc lifecycle hooks. Khi gọi trong event handler (template callback), nó không đảm bảo trả về instance hợp lệ. Kết quả: `inst.emit` là `undefined`, event không bao giờ được forward, parent không nhận được thông báo click phân trang → `page` ref không update → `fetchTransactions()` không gọi → UI không thay đổi.

**Evidence**:
- File: `src/renderer/src/components/ui-wrappers/SoraTable.vue:21-34`
- `getCurrentInstance()` usage outside setup context
- Vue 3 docs: chỉ dùng được trong `setup()` hoặc lifecycle hooks

**Fix**: Thay `getCurrentInstance().emit()` bằng `defineEmits()` — pattern chuẩn của Composition API.

**Decision**: `defineEmits(['change'])` trong `<script setup>` — emit hoạt động đúng trong mọi context.

**Alternatives considered**:
- Bỏ `SoraTable` và dùng `<a-table>` trực tiếp: phá vỡ kiến trúc wrapper (Sora prefix convention)
- Dùng `attrs` để pass event listener: phức tạp hơn, không cần thiết
- Dùng `emit` từ `defineEmits`: pattern chuẩn, đơn giản nhất, tương thích Vue 3

## Verification

Sau fix, click phân trang sẽ:
1. Ant Design `<a-table>` fire `change` event với `pagination.current = trang_mới`
2. `SoraTable.onChange` nhận event, gọi `emit('change', ...args)`
3. `SoraTransactionView.onTableChange` nhận event, set `page.value = trunc_mới`
4. Watcher `[page, pageSize]` trigger `fetchTransactions()`
5. Dữ liệu mới load, UI update
