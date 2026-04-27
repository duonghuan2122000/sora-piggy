# Tác vụ: Màn hình thông tin app

**Đầu vào**: Tài liệu thiết kế từ `/specs/001-app-info/`
**Tiên quyết**: plan.md, spec.md, data-model.md, contracts/ipc.md, quickstart.md

**Kiểm thử**: BẮT BUỘC theo Hiến pháp (mục II). Viết test TRƯỚC khi triển khai, đảm bảo test fail (red), sau đó implement (green).

**Tổ chức**: Tác vụ được nhóm theo user story để cho phép triển khai và kiểm thử độc lập từng story.

## Định dạng: `[ID] [P?] [Story] Mô tả`

- **[P]**: Có thể chạy song song (file khác nhau, không phụ thuộc)
- **[Story]**: User story mà tác vụ này thuộc về (vd: US1, US2)
- Bao gồm đường dẫn file chính xác trong mô tả

## Phase 1: Thiết lập (Hạ tầng dùng chung)

**Mục đích**: Dự án đã được thiết lập sẵn, không cần khởi tạo thêm.

Không có tác vụ.

---

## Phase 2: Nền tảng (Tiên quyết chặn)

**Mục đích**: IPC handler và preload API — blocking prerequisite cho mọi user story

**⚠️ NGHIÊM TRỌNG**: Không thể bắt đầu user story cho đến khi phase này hoàn thành

- [x] T001 Thêm IPC handler `app:getInfo` trong `src/main/index.ts` trả về `{ name: "Sora Piggy", version: app.getVersion() }`
- [x] T002 [P] Thêm `getAppInfo` vào api object trong `src/preload/index.ts` (gọi `ipcRenderer.invoke('app:getInfo')`)

**Checkpoint**: Renderer có thể gọi `window.api.getAppInfo()` và nhận dữ liệu app info.

---

## Phase 3: User Story 1 - Xem thông tin app + Menu điều hướng (Ưu tiên: P1) 🎯 MVP

**Mục tiêu**: Màn hình thông tin app hiển thị tên + phiên bản, có menu item để truy cập.

**Kiểm thử độc lập**: Truy cập menu "Thông tin app" → vào màn hình → xem tên và phiên bản.

### Kiểm thử cho User Story 1 (BẮT BUỘC - theo Hiến pháp) 🔴

> **GHI CHÚ**: Viết các kiểm thử này TRƯỚC, đảm bảo chúng THẤT BẠI trước khi triển khai

- [x] T003 [P] [US1] Viết unit test cho AboutView rendering với mock IPC trong `test/unit/about-view.spec.ts`
- [x] T004 [P] [US1] Viết unit test cho IPC handler `app:getInfo` trong `test/unit/app-info-ipc.spec.ts` (cần mock `app.getVersion()`)

### Triển khai cho User Story 1

- [x] T005 [P] [US1] Cập nhật `src/renderer/src/views/AboutView.vue`: gọi `getAppInfo` trong `onMounted`, hiển thị tên app + version trong SoraCard
- [x] T006 [P] [US1] Thêm menu item About vào `src/renderer/src/layouts/Sidebar.vue`: import `faInfoCircle`, thêm `{ key: 'About', label: 'About', icon: faInfoCircle, to: '/about' }` vào `menuGroups`
- [x] T007 [P] [US1] Thêm i18n keys about section trong `src/renderer/src/locales/en.json`
- [x] T008 [P] [US1] Thêm i18n keys about section trong `src/renderer/src/locales/vi.json`

**Checkpoint**: User Story 1 hoạt động đầy đủ — menu "Thông tin app" visible, click vào thấy màn hình với tên + version.

---

## Phase N: Hoàn thiện & Quan tâm xuyên suốt

**Mục đích**: Cải tiến ảnh hưởng nhiều user stories

- [x] T009 Chạy `typecheck && lint && test` xác nhận không lỗi
- [x] T010 Chạy `git diff --stat HEAD` xác nhận scope thay đổi đúng (gitnexus CLI unavailable)

---

## Phụ thuộc & Thứ tự thực thi

### Phụ thuộc giữa các Phase

- **Thiết lập (Phase 1)**: Không có tác vụ
- **Nền tảng (Phase 2)**: CHẶN tất cả user stories — IPC handler phải có trước
- **User Stories (Phase 3)**: Phụ thuộc Phase Nền tảng
- **Hoàn thiện (Phase cuối)**: Phụ thuộc Phase 3 hoàn thành

### Phụ thuộc giữa User Stories

- **User Story 1 (P1)**: Cả US1 (view) và US2 (menu) gộp chung Phase 3 vì cùng P1 và phụ thuộc IPC. US1 (view content) và US2 (sidebar) độc lập, có thể song song [P].

### Trong mỗi User Story

- Kiểm thử PHẢI được viết và THẤT BẠI trước khi triển khai
- Tác vụ [P] có thể chạy song song
- Story hoàn thành trước khi chuyển sang bước tiếp theo

### Cơ hội Song song

- T002 [P] độc lập với T001 (preload vs main process)
- T003, T004 [P] độc lập (test cho view vs test cho IPC)
- T005, T006, T007, T008 [P] đều độc lập (view, sidebar, en.json, vi.json)

---

## Ví dụ Song song: Phase 3

```bash
# Chạy tất cả [P] tác vụ cùng nhau:
Tác vụ: "Viết unit test cho AboutView rendering trong test/unit/about-view.spec.ts"
Tác vụ: "Viết unit test cho IPC handler app:getInfo trong test/unit/app-info-ipc.spec.ts"

# Sau đó chạy implementation song song:
Tác vụ: "Cập nhật AboutView.vue"
Tác vụ: "Thêm menu item Sidebar.vue"
Tác vụ: "Thêm i18n keys en.json"
Tác vụ: "Thêm i18n keys vi.json"
```

---

## Chiến lược Triển khai

### MVP Trước (Phase 3 là MVP)

1. Hoàn thành Phase 2: IPC + preload
2. Hoàn thành Phase 3: US1 (view + sidebar + i18n)
3. **DỪNG và XÁC THỰC**: Kiểm thử toàn bộ flow
4. Phase cuối: typecheck + lint + test + gitnexus

### Phân phối Tăng dần

1. Hoàn thành Nền tảng (IPC) → Nền tảng sẵn sàng
2. Thêm view + sidebar + i18n → Kiểm thử độc lập → Kiểm thử toàn bộ

---

## Ghi chú

- [P] tác vụ = file khác nhau, không phụ thuộc
- [US1] nhãn ánh xạ tác vụ đến user story
- Mỗi user story phải có thể hoàn thành và kiểm thử độc lập
- Xác minh kiểm thử thất bại trước khi triển khai
- Commit sau mỗi nhóm tác vụ hoàn thành
