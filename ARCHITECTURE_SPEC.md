# Architecture Specification: Financial App UI Layout

Based on the SVG layout provided, the following specification defines the exact structure and implementation details for the application UI.

## 1. Layout Structure

The application uses a standard **Sidebar Layout** pattern implemented with `naive-ui` components.

**Structure Hierarchy:**

- `MainLayout.vue` (Root Container)
  - `NLayout` (Full Screen)
    - `NLayoutSider` (Sidebar)
      - `Sidebar.vue` (Navigation Menu)
    - `NLayout` (Inner Container)
      - `NLayoutHeader` (Top Navigation)
        - `TopNav.vue` (Header Content)
      - `NLayoutContent` (Main Content Area)
        - `RouterView` (Dynamic Route Views)

**Visual Flow:**

1. **Left Sidebar**: Contains the main navigation menu.
2. **Top Header**: Displays the application title and global actions.
3. **Content Area**: Displays the active module (Giao dịch, Ngân sách, etc.).

## 2. Color Scheme

The color scheme is strictly derived from the SVG diagram and implemented in `MainLayout.vue`.

| Element          | Background Color     | Border Color                | Implementation Location |
| :--------------- | :------------------- | :-------------------------- | :---------------------- |
| **Header**       | `rgb(238, 237, 254)` | `rgb(83, 74, 183)` (bottom) | `MainLayout.vue:40-41`  |
| **Sidebar**      | `rgb(230, 241, 251)` | `rgb(24, 95, 165)` (right)  | `MainLayout.vue:44-45`  |
| **Content Area** | `#fff` (white)       | None                        | `MainLayout.vue:49`     |

## 3. Component Implementation

### 3.1 MainLayout.vue

- **Purpose**: Orchestrates the overall page structure.
- **Key Features**:
  - Full viewport height (`100vh`).
  - Uses `naive-ui` layout components for responsive behavior.
  - Handles sidebar collapse/expand state.
- **Location**: `src/renderer/src/layouts/MainLayout.vue`

### 3.2 Sidebar.vue

- **Purpose**: Provides navigation to the 5 main modules.
- **Menu Items** (Matches SVG "5 module" description):
  1. **Giao dịch** (Transactions) -> Route: `/`
  2. **Ngân sách** (Budget) -> Route: `/budget`
  3. **Mục tiêu** (Goals) -> Route: `/goals`
  4. **Báo cáo** (Reports) -> Route: `/reports`
  5. **Cài đặt** (Settings) -> Route: `/settings`
- **Location**: `src/renderer/src/layouts/Sidebar.vue`

### 3.3 TopNav.vue

- **Purpose**: Displays application header and global actions.
- **Content** (Matches SVG Header description):
  - Title: "Vue.js Renderer (Giao diện người dùng)"
  - Subtitle: "5 module: Giao dịch · Ngân sách · Mục tiêu · Báo cáo · Cài đặt"
  - Action: Language toggle (EN/VN).
- **Location**: `src/renderer/src/layouts/TopNav.vue`

## 4. Route Configuration

The application uses Vue Router to map the sidebar menu items to components.

| Route Path  | Component          | Description                |
| :---------- | :----------------- | :------------------------- |
| `/`         | `HomeView.vue`     | Transaction list/dashboard |
| `/budget`   | `BudgetView.vue`   | Budget management          |
| `/goals`    | `GoalsView.vue`    | Goal tracking              |
| `/reports`  | `ReportsView.vue`  | Financial reports          |
| `/settings` | `SettingsView.vue` | Application settings       |

## 5. Summary

The existing layout implementation in `src/renderer/src/layouts/` fully satisfies the architectural requirements derived from the SVG diagram.

- **UI Layout**: Correct sidebar-header-content structure.
- **Styling**: Exact color matching for header, sidebar, and content area.
- **Navigation**: Complete 5-module menu structure.
