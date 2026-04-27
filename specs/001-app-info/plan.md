# Kế hoạch Triển khai: Màn hình thông tin app

**Branch**: `004-app-info` | **Ngày**: 2026-04-27 | **Đặc tả**: `specs/001-app-info/spec.md`
**Đầu vào**: Đặc tả tính năng từ `/specs/001-app-info/spec.md`

## Tổng quan

Xây dựng màn hình "Thông tin app" hiển thị tên ứng dụng "Sora Piggy" và phiên bản. Route `/about` và `AboutView.vue` đã tồn tại dạng stub. Cần bổ sung menu item sidebar, IPC lấy thông tin app, và nội dung view.

## Bối cảnh Kỹ thuật

**Ngôn ngữ/Phiên bản**: TypeScript (strict mode), Vue 3 (Composition API)  
**Thư viện chính**: Electron 33.x, Vue 3, Pinia, Vue Router, Ant Design Vue, FontAwesome  
**Lưu trữ**: Không cần (dữ liệu tĩnh từ package.json qua IPC)  
**Kiểm thử**: Vitest (unit), Playwright (E2E)  
**Nền tảng mục tiêu**: Windows, macOS, Linux (Electron desktop)  
**Loại dự án**: Ứng dụng desktop (Electron + Vue)  
**Mục tiêu hiệu năng**: Không yêu cầu đặc biệt (màn hình tĩnh, load tức thì)  
**Ràng buộc**: Local-first, IPC qua contextBridge, Vue Router với lazy-loaded views  
**Quy mô/Phạm vi**: Single user, 1 màn hình tĩnh

## Kiểm tra Hiến pháp

*CỔNG: Phải vượt qua trước Nghiên cứu Phase 0. Kiểm tra lại sau thiết kế Phase 1.*

- **I. Chất Lượng Code**: OK — logic đơn giản, không phá vỡ SOLID/DRY
- **II. Kiểm Thử**: Cần unit test cho AboutView rendering + IPC call. 80% coverage target.
- **III. Kiến Trúc**: OK — tuân thủ Electron + Vue 3 + IPC. Renderer gọi IPC `app:getInfo`, main process trả về dữ liệu.
- **IV. Giao Diện**: OK — dùng SoraCard và components wrapper hiện có, i18n en/vi
- **V. Bảo Mật**: OK — không có input người dùng, chỉ đọc dữ liệu tĩnh

**Kết luận**: Tất cả gates pass. Không vi phạm.

## Cấu trúc Dự án

### Tài liệu (tính năng này)

```text
specs/001-app-info/
├── plan.md              # File này
├── spec.md              # Đặc tả tính năng
├── tasks.md             # Tasks (tạo bởi /speckit.tasks)
└── checklists/
    └── requirements.md  # Checklist chất lượng
```

### Mã nguồn (thay đổi)

```text
src/
├── main/
│   └── index.ts                   # [+] IPC handler: app:getInfo
├── preload/
│   └── index.ts                   # [+] API: getAppInfo
└── renderer/
    └── src/
        ├── views/
        │   └── AboutView.vue      # [SỬA] Từ stub → hoàn chỉnh
        ├── layouts/
        │   └── Sidebar.vue        # [SỬA] Thêm menu item About
        └── locales/
            ├── en.json            # [SỬA] Thêm keys about section
            └── vi.json            # [SỬA] Thêm keys about section
```

## Phase 0: Nghiên cứu

Không có NEEDS CLARIFICATION. Feature đã rõ:
- App version lấy từ `app.getVersion()` (Electron API) tương đương `package.json` version
- App name lấy từ `electron-builder.yml` productName hoặc hardcode "Sora Piggy"
- Cần expose qua IPC channel mới `app:getInfo`

**Quyết định**:
- IPC: `app:getInfo` → `{ name: "Sora Piggy", version: "x.y.z" }`
- Icon menu: `faInfoCircle` từ `@fortawesome/free-solid-svg-icons`
- Menu item đặt trong group "Summary" (group hiển thị duy nhất hiện tại) hoặc tạo group riêng

## Phase 1: Thiết kế

### Data Model

Không có entity mới. Dữ liệu trả về từ IPC:

```typescript
interface AppInfo {
  name: string;    // "Sora Piggy"
  version: string; // "1.0.0" từ app.getVersion()
}
```

### Contracts

**IPC contract**:
- Channel: `app:getInfo`
- Direction: Renderer → Main (invoke/handle)
- Request payload: none
- Response: `{ name: string; version: string }`

**Preload API**:
```typescript
// src/preload/index.ts
getAppInfo: () => ipcRenderer.invoke('app:getInfo')
```

### View template

AboutView.vue gồm:
- SoraCard với header slot title="Thông tin app"
- Nội dung: tên app + phiên bản
- SoraButton (optional: đóng/back)

### Sidebar menu

Thêm item vào `menuGroups` trong group phù hợp:
```typescript
{ key: 'About', label: 'About', icon: faInfoCircle, to: '/about' }
```

Không thêm vào `HIDDEN_MENU_KEYS`.

### i18n keys

en.json:
```json
"about": {
  "title": "About",
  "appName": "App Name",
  "version": "Version"
}
```

vi.json:
```json
"about": {
  "title": "Thông tin app",
  "appName": "Tên ứng dụng",
  "version": "Phiên bản"
}
```

## Theo dõi Độ phức tạp

Không có vi phạm hiến pháp.

## Files cần thay đổi

| File | Action | Mục đích |
|------|--------|----------|
| `src/main/index.ts` | SỬA | Thêm `ipcMain.handle('app:getInfo', ...)` |
| `src/preload/index.ts` | SỬA | Thêm `getAppInfo` vào api object |
| `src/renderer/src/views/AboutView.vue` | SỬA | Nội dung hoàn chỉnh |
| `src/renderer/src/layouts/Sidebar.vue` | SỬA | Thêm import icon + menu item |
| `src/renderer/src/locales/en.json` | SỬA | Thêm about section |
| `src/renderer/src/locales/vi.json` | SỬA | Thêm about section |
