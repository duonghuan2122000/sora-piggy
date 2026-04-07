# Architecture Files for PBI 14

Thư mục này chứa các file kiến trúc liên quan đến PBI 14.

## Planned Files

| File                  | Description               | Status            |
| --------------------- | ------------------------- | ----------------- |
| `diagram.drawio`      | Sơ đồ kiến trúc hệ thống  | TODO - sẽ tạo sau |
| `database-schema.svg` | Sơ đồ database schema mới | TODO - sẽ tạo sau |

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    RENDERER PROCESS                         │
│  Vue.js + Pinia + Element Plus                              │
│  └── SoraTransactionView.vue                               │
└─────────────────────────────────────────────────────────────┘
                              │ IPC
┌─────────────────────────────────────────────────────────────┐
│                    MAIN PROCESS                             │
│  └── IPC Handlers (db:getTransactions, db:getCategories)   │
│      └── Database Layer (better-sqlite3)                   │
│          └── SQLite (sora-piggy.db)                        │
└─────────────────────────────────────────────────────────────┘
```

## Key Components

1. **Database Layer**: Pagination queries với LIMIT/OFFSET
2. **IPC Handlers**: db:getTransactions với filters
3. **Vue Components**: SoraTransactionView.vue với reactive state
4. **Migration**: UUID v7 migration từ schema cũ

## Ghi chú

- File `.drawio` cần được tạo bằng draw.io hoặc diagrams.net
- Các file SVG có thể được tạo thủ công hoặc bằng tool khác
- Placeholder này để đánh dấu vị trí lưu diagram
