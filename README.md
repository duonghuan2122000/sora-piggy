<div align="center">

# 🐷 Sora Piggy

**Your personal finance companion — built for clarity, not complexity.**

[![Electron](https://img.shields.io/badge/Electron-28+-47848F?style=flat&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-local--first-003B57?style=flat&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat)](LICENSE)

[Features](#-features) · [Screenshots](#-screenshots) · [Getting Started](#-getting-started) · [Tech Stack](#-tech-stack) · [Roadmap](#-roadmap)

</div>

---

## 🌟 Overview

**Sora Piggy** is a local-first desktop app for personal expense tracking — no cloud, no subscriptions, no data sharing. Your financial data lives entirely on your machine.

Built with Electron + Vue 3, Sora Piggy is designed to be fast, distraction-free, and genuinely pleasant to use every day. Whether you're splitting bills with friends or saving up for your next trip, Sora Piggy keeps everything in one place.

---

## ✨ Features

### 💸 Transaction Management
- Log income, expenses, and internal transfers in seconds
- Quick-entry shortcut (`Ctrl+N`) with auto-focus on amount field
- Attach receipt photos to any transaction
- Recurring transactions for subscriptions, rent, and regular bills
- Full-text search and multi-filter (date range, category, account, amount)
- Import transactions from bank CSV statements

### 📊 Budget Tracking
- Set monthly spending limits per category
- Visual progress bars that shift green → yellow → red as you approach limits
- Desktop notifications when a category hits 80% of budget
- Copy last month's budget with one click
- Envelope budgeting: roll unused amounts forward to next month

### 🎯 Savings Goals
- Create goals with a target amount and optional deadline
- Track progress with milestone notifications at 25%, 50%, 75%, and 100%
- Auto-contribute: schedule a fixed amount to be moved each month
- View contribution history as a growth chart

### 📈 Reports & Analytics
- Monthly overview: cash flow, net balance, top spending categories
- Trend comparison: this month vs. last month vs. 3-month average
- Category breakdown: treemap and horizontal bar charts
- Cash flow waterfall: income → expenses → savings
- Export reports to PDF or Excel

### ⚙️ Settings & Data
- Manage multiple accounts (cash, bank, e-wallets like MoMo/ZaloPay)
- Custom categories with icon and color
- Automatic scheduled backups to any local folder
- Dark mode / Light mode
- VND and USD currency support

---

## 📸 Screenshots

> Coming soon.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/sora-piggy.git
cd sora-piggy

# Install dependencies
npm install

# Start in development mode
npm run dev
```

### Build for production

```bash
# Build for your current platform
npm run build

# Build for a specific platform
npm run build:mac
npm run build:win
npm run build:linux
```

Distributable files will be output to the `dist/` folder.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Desktop shell | Electron 28+ |
| UI framework | Vue 3 + Composition API |
| UI components | Naive UI |
| State management | Pinia |
| Database | SQLite via `better-sqlite3` |
| Charts | Apache ECharts |
| Build tool | Vite + electron-builder |
| Date handling | Day.js |

---

## 📁 Project Structure

```
sora-piggy/
├── electron/               # Main process
│   ├── main.ts             # App entry point
│   ├── ipc/                # IPC handlers
│   └── services/           # Business logic (transactions, budgets, goals)
├── src/                    # Vue renderer
│   ├── views/              # Page-level components
│   ├── components/         # Shared UI components
│   ├── stores/             # Pinia stores
│   └── composables/        # Shared logic
├── database/
│   └── schema.sql          # SQLite table definitions
└── electron-builder.yml    # Build configuration
```

---

## 🗺 Roadmap

- [x] Project design & architecture
- [ ] Core transaction CRUD
- [ ] Budget module
- [ ] Savings goals module
- [ ] Reports & charts
- [ ] CSV import
- [ ] PDF / Excel export
- [ ] Auto-backup
- [ ] Dark mode
- [ ] Multi-currency support

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

Made with ☕ and a stubborn habit of checking bank statements.

</div>
