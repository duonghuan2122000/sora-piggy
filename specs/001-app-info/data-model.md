# Data Model: Màn hình thông tin app

## Entities

Không có entity lưu trữ mới. Dữ liệu tĩnh từ Electron main process.

## IPC Response

```typescript
interface AppInfo {
  name: string;    // Tên ứng dụng: "Sora Piggy"
  version: string; // Phiên bản từ app.getVersion(): "1.0.0"
}
```

## Data Flow

```
AboutView.vue
  → window.api.getAppInfo()
    → ipcRenderer.invoke('app:getInfo')
      → ipcMain.handle('app:getInfo')
        → app.getVersion() + name constant
```

Không có validation, state transition, hay entity lifecycle.
