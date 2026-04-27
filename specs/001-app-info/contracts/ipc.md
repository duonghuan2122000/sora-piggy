# IPC Contract: app:getInfo

## Channel

`app:getInfo`

## Direction

Renderer → Main (invoke/handle)

## Request

Không có payload.

## Response

```typescript
{
  name: string;    // "Sora Piggy"
  version: string; // "1.0.0"
}
```

## Error handling

Không có lỗi (dữ liệu tĩnh từ main process).

## Implementation

### Main process (`src/main/index.ts`)

```typescript
ipcMain.handle('app:getInfo', () => {
  return {
    name: 'Sora Piggy',
    version: app.getVersion()
  };
});
```

### Preload (`src/preload/index.ts`)

```typescript
getAppInfo: () => ipcRenderer.invoke('app:getInfo')
```

### Renderer (AboutView.vue)

```typescript
const appInfo = await window.api.getAppInfo();
```
