<div align="center">

# 🐷 Sora Piggy

Ứng dụng quản lý chi tiêu cá nhân local‑first (dữ liệu lưu trên máy, không đồng bộ lên đám mây).

[![Electron](https://img.shields.io/badge/Electron-28+-47848F?style=flat&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-local--first-003B57?style=flat&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat)](LICENSE)

</div>

---

## Giới thiệu ngắn

Sora Piggy là ứng dụng desktop để ghi chép giao dịch, quản lý ngân sách và mục tiêu tiết kiệm. Thiết kế hướng tới sự đơn giản, hiệu năng và bảo mật dữ liệu cục bộ.

---

## Tính năng chính (tóm tắt)

- Ghi nhận thu/chi, chuyển nội bộ, giao dịch định kỳ
- Quản lý nhiều tài khoản và danh mục (icon, màu)
- Báo cáo cơ bản: tổng quan tháng, phân tích theo danh mục
- Sao lưu cục bộ theo lịch và import CSV

---

## Bắt đầu (tiếng Việt)

Yêu cầu trước:

- Node.js 18+
- npm (hoặc yarn)

Cài đặt và chạy ở chế độ phát triển:

```powershell
git clone https://github.com/your-username/sora-piggy.git
cd sora-piggy
npm install
npm run dev
```

Lệnh hữu ích:

- Phát triển: npm run dev
- Xem bản dựng preview: npm run start
- Build production (kèm kiểm tra TypeScript): npm run build
- Rebuild native deps (better-sqlite3): npm run rebuild
- Lint: npm run lint
- Format: npm run format
- Type check: npm run typecheck
- Test (Vitest): npm run test

Tạo build cho nền tảng cụ thể:

- npm run build:win | npm run build:mac | npm run build:linux | npm run build:unpack

---

## Công nghệ chính

- Electron (shell desktop)
- Vue 3 + Composition API (renderer)
- Ant Design Vue (UI components)
- Pinia (state)
- SQLite via better-sqlite3 (local DB)
- Vite + electron-vite + electron-builder (build toolchain)
- Vitest (unit test), Playwright (E2E dev dep)

---

## Cấu trúc dự án (tóm tắt)

- src/main — mã cho Electron main process (khởi tạo DB, IPC handlers)
- src/preload — preload script, expose API an toàn cho renderer (contextBridge)
- src/renderer/src — ứng dụng Vue (views, components, stores, composables)
- build / dist — kết quả build; electron-builder config tại electron-builder.yml

Các file quan trọng:

- src/main/index.ts — entry main process
- src/main/database.ts — helpers SQLite (better-sqlite3)
- src/preload/index.ts — contextBridge API
- src/renderer/src/main.ts — entry Vue renderer

---

## Quy chuẩn & lưu ý dành cho nhà phát triển

- Luôn chạy: npm run typecheck && npm run lint trước khi commit
- Sử dụng path alias @renderer cho mã frontend khi cần
- Vue SFC dùng <script setup lang="ts"> và tránh any không cần thiết
- Không commit secrets; backup DB test khi viết test tác động DB

---

## Đóng góp

Chào mừng PR, issue, và ý tưởng. Quy trình cơ bản:

1. Fork → tạo branch tính năng
2. Chạy typecheck + lint + test liên quan
3. Tạo PR mô tả ngắn và checklist test

---

## License

Project được cấp phép theo MIT — xem LICENSE để biết chi tiết.

---

Made with ☕
