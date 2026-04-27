# Kế hoạch Triển khai: Sửa lỗi phân trang danh sách giao dịch

**Branch**: `feature/pbi-58-transactions-phan-trang` | **Ngày**: 2026-04-27 | **Đặc tả**: `specs/001-fix-pagination-giao-dich/spec.md`
**Đầu vào**: Đặc tả tính năng từ `/specs/001-fix-pagination-giao-dich/spec.md`

## Tổng quan

Bug: Click phân trang trên màn hình danh sách giao dịch không hoạt động.

Root cause: `SoraTable.vue` dùng `getCurrentInstance()` trong event handler để emit event `change` lên parent. Vue 3 không đảm bảo `getCurrentInstance()` hoạt động ngoài `setup()` — handler chạy nhưng emit không fire, parent không nhận được event, `page`/`pageSize` không update.

Fix: Thay `getCurrentInstance().emit()` bằng `defineEmits()` — pattern chuẩn của Vue 3 Composition API.

## Bối cảnh Kỹ thuật

**Ngôn ngữ/Phiên bản**: TypeScript (strict mode)  
**Thư viện chính**: Vue 3 (Composition API), Ant Design Vue 3 (a-table), Pinia  
**Lưu trữ**: SQLite qua better-sqlite3 (local)  
**Kiểm thử**: Vitest (unit + integration)  
**Nền tảng mục tiêu**: Windows / macOS / Linux (Electron desktop)  
**Loại dự án**: Electron desktop app (Vue renderer + Node main process)  
**Mục tiêu hiệu năng**: Chuyển trang dưới 1 giây (local SQLite)  
**Ràng buộc**: Không thay đổi database schema, không thêm thư viện mới  
**Quy mô/Phạm vi**: 1 component wrapper (`SoraTable.vue`), 1 view (`SoraTransactionView.vue`), update tests

## Kiểm tra Hiến pháp

*CỔNG: Phải vượt qua trước Nghiên cứu Phase 0. Kiểm tra lại sau thiết kế Phase 1.*

| Nguyên tắc | Trạng thái | Ghi chú |
|---|---|---|
| I. Chất Lượng Code (SOLID, DRY, strict mode, xử lý lỗi) | ✅ Pass | Fix đơn giản, chỉ thay emit pattern |
| II. Kiểm Thử (bắt buộc, ≥80% coverage) | ✅ Pass | Có test hiện tại, cần update/add test cho event flow |
| III. Kiến Trúc (Electron + Vue 3 + IPC) | ✅ Pass | Không phá vỡ kiến trúc IPC |
| IV. Giao Diện & UX (loading, validation, i18n) | ✅ Pass | Pagination đã có loading state sẵn |
| V. Bảo Mật (validate input, parameterized query) | ✅ Pass | Không đụng tới database |

## Cấu trúc Dự án

### Tài liệu (tính năng này)

```text
specs/001-fix-pagination-giao-dich/
├── spec.md                # Đặc tả (đã hoàn thành)
├── plan.md                # File này
├── research.md            # Kết quả Phase 0
├── data-model.md          # Kết quả Phase 1 (không cần — bug fix)
├── quickstart.md          # Kết quả Phase 1 (không cần — bug fix)
├── contracts/             # Kết quả Phase 1 (không cần — bug fix)
└── tasks.md               # Kết quả Phase 2 (/speckit.tasks)
```

### Mã nguồn (thư mục gốc repository)

```text
src/
└── renderer/
    └── src/
        └── components/
            └── ui-wrappers/
                └── SoraTable.vue     # File cần fix

src/
└── renderer/
    └── src/
        └── views/
            └── transactions/
                └── SoraTransactionView.vue  # Verify event flow

tests/
└── unit/
    └── paginated-transactions.spec.ts  # Update/add tests
```

**Quyết định Cấu trúc**: Bug fix đơn giản — chỉ sửa 1 file component wrapper (`SoraTable.vue`). Không thêm file mới.

## Theo dõi Độ phức tạp

Không có vi phạm hiến pháp. Complexity thấp.
