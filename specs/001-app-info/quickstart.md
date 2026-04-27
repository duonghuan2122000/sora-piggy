# Quickstart: Màn hình thông tin app

## Các bước implement

### 1. Main process — IPC handler

Thêm vào `src/main/index.ts`:

```typescript
ipcMain.handle('app:getInfo', () => {
  return {
    name: 'Sora Piggy',
    version: app.getVersion()
  };
});
```

### 2. Preload — API bridge

Thêm vào api object trong `src/preload/index.ts`:

```typescript
getAppInfo: () => ipcRenderer.invoke('app:getInfo')
```

### 3. AboutView.vue — Nội dung hoàn chỉnh

Cập nhật `src/renderer/src/views/AboutView.vue`:
- Gọi `window.api.getAppInfo()` trong `onMounted`
- Hiển thị tên app + version trong SoraCard
- Dùng keys i18n mới `about.title`, `about.appName`, `about.version`

### 4. Sidebar.vue — Menu item

Thêm vào `src/renderer/src/layouts/Sidebar.vue`:
- Import `faInfoCircle` từ `@fortawesome/free-solid-svg-icons`
- Thêm `{ key: 'About', label: 'About', icon: faInfoCircle, to: '/about' }` vào `menuGroups`

### 5. i18n — Locale keys

Thêm vào `en.json`:
```json
"about": { "title": "About", "appName": "App Name", "version": "Version" }
```

Thêm vào `vi.json`:
```json
"about": { "title": "Thông tin app", "appName": "Tên ứng dụng", "version": "Phiên bản" }
```

## Kiểm thử

- Unit test: AboutView renders correct info from IPC mock
- Unit test: IPC handler returns correct format
- E2E: Navigate to /about, verify name + version displayed
- Sidebar: Verify "Thông tin app" menu item visible and navigates correctly

## Edge cases

- Version unavailable: Ẩn dòng phiên bản (spec clarification)
