---

description: "Danh sách tác vụ sửa lỗi phân trang danh sách giao dịch"

---

# Tác vụ: Sửa lỗi phân trang danh sách giao dịch

**Đầu vào**: Tài liệu thiết kế từ `specs/001-fix-pagination-giao-dich/`
**Tiên quyết**: plan.md, spec.md, research.md

**Kiểm thử**: BẮT BUỘC theo Hiến pháp (mục II). Viết test TRƯỚC khi triển khai, đảm bảo test fail (red), sau đó implement (green).

## Định dạng: `[ID] [P?] [Story] Mô tả`

- **[P]**: Có thể chạy song song (file khác nhau, không phụ thuộc)
- **[Story]**: User story mà tác vụ này thuộc về
- Bao gồm đường dẫn file chính xác trong mô tả

## Root Cause

Bug tại `src/renderer/src/components/ui-wrappers/SoraTable.vue:31` — dùng `getCurrentInstance()` trong event handler. Vue 3 không đảm bảo `getCurrentInstance()` hoạt động ngoài `setup()`. Event `change` không emit lên parent → `page`/`pageSize` không update → phân trang không hoạt động.

## Phase 1: Fix root cause (P1)

**Mục đích**: Sửa `SoraTable.vue` event emission để pagination event propagate lên parent.

**Lưu ý**: US1 (click số trang) và US2 (Previous/Next) cùng phụ thuộc 1 fix — không thể tách rời.

### Kiểm thử

- [x] T001 [P] [US1] Viết unit test cho SoraTable change event emission trong `tests/unit/SoraTable.spec.ts`

### Triển khai

- [x] T002 [US1] Thay `getCurrentInstance().emit()` bằng `defineEmits()` trong `src/renderer/src/components/ui-wrappers/SoraTable.vue`

**Checkpoint**: Pagination event emit hoạt động. Click số trang / Previous / Next đều gọi được `fetchTransactions()`.

---

## Phase 2: User Story 3 — Phân trang + bộ lọc (Ưu tiên: P2)

**Mục tiêu**: Phân trang hoạt động nhất quán với dữ liệu đã lọc. Khi filter thay đổi, reset về trang 1.

**Kiểm thử độc lập**: Áp dụng bộ lọc danh mục → click trang 2 → verify dữ liệu chỉ thuộc danh mục đã lọc.

### Kiểm thử

- [ ] T003 [P] [US3] Viết integration test cho pagination + filter interaction trong `tests/integration/pagination-filters.spec.ts`

**Checkpoint**: Phân trang + filter hoạt động đồng bộ.

---

## Phase 3: Xác thực & hoàn thiện

**Mục đích**: Verify không regressions, đảm bảo chất lượng.

- [x] T004 Chạy `npm run typecheck && npm run lint && npm run test` — tất cả pass không lỗi mới
- [x] T005 Mở app dev (`npm run dev`), test manual pagination các edge case:
  - Click số trang 2 → data đúng, active style đúng
  - Click Previous/Next → chuyển trang đúng
  - Trang 1 → Previous disabled. Trang cuối → Next disabled
  - Filter danh mục → reset trang 1
  - Filter sổ tiền + phân trang
  - Click nhanh nhiều lần → không crash
  - Change page size → data update đúng

---

## Phụ thuộc & Thứ tự thực thi

### Phụ thuộc

- **T001, T002**: Phụ thuộc lẫn nhau (cùng file `SoraTable.vue` — làm tuần tự)
- **T003**: Phụ thuộc T002 (cần fix xong trước)
- **T004**: Phụ thuộc tất cả (chạy cuối cùng)
- **T005**: Phụ thuộc T004 (manual test sau khi mọi thứ pass)

### Cơ hội Song song

- T001 có thể viết song song với T002 (nếu tách file test riêng)
- T003 độc lập về file test, có thể song song với verify tasks sau khi T002 xong

---

## Chiến lược Triển khai

### MVP (Phase 1)

1. ✅ T001 + T002 → Fix SoraTable.vue + test
2. ✅ T004 → verify typecheck/lint/test pass
3. **⬜ DỪNG**: Manual test app → phân trang hoạt động

### Phase 2 (khi MVP ổn định)

1. ⬜ T003 → Integration test cho pagination + filter
2. ⬜ T005 → Manual test edge cases
