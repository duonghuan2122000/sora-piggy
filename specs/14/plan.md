PBI: 14
Spec: specs/14/spec.md
Branch: feature/14-danh-sach-giao-dich-thu-chi

# Plan: PBI 14 - Danh sách giao dịch thu chi

## Executive Summary

PBI 14 nhằm mục tiêu triển khai API lấy danh sách giao dịch thu/chi từ database SQLite local với hỗ trợ phân trang và lọc từ phía server, thay thế cho cách xử lý client-side hiện tại. Dự án bao gồm migration database schema từ auto-increment integer sang UUID v7, cập nhật UI để sử dụng API mới, và đảm bảo hiệu suất ứng dụng khi xử lý lượng lớn dữ liệu.

**Các mốc quan trọng:**

- Migration database schema sang UUID v7
- Triển khai API phân trang phía server
- Cập nhật UI Transaction View
- Hỗ trợ search không phân biệt hoa thường và dấu tiếng Việt

---

## Proposed Architecture

### High-Level Architecture

```
RENDERER PROCESS
================================================================
Vue.js Application (SoraTransactionView.vue)
  - Transaction Store (Pinia)
  - Filter State (page, pageSize, categoryId, accountId, sortBy)
  - UI Components (Element Plus)
                                    |
                           IPC Bridge (preload)
                                    |
================================================================
MAIN PROCESS
================================================================
IPC Handlers
  - db:getTransactions (with pagination & filters)
  - db:getCategories (for dropdown)
  - db:getAccounts (for dropdown)
                                    |
Database Layer (better-sqlite3)
  - Transaction Repository (paginated queries)
  - Category Repository
  - Account Repository
  - Migration Manager
                                    |
SQLite Database (sora-piggy.db)
  - Tables: transactions, categories, accounts, languages
```

### Data Flow

1. User interacts with filters: User changes category, account, search query, or pagination
2. Vue component triggers fetch: Component calls API with current filter state
3. IPC invocation: Renderer calls window.api.getTransactions(filterParams)
4. Main process handles request: IPC handler receives request, forwards to database layer
5. Database executes query: SQLite executes paginated query with filters and returns results
6. Response returned: Main process returns PaginatedTransactions response
7. UI updates: Vue component updates reactive state and re-renders table

---

## Components & Interfaces

### 1. Database Layer (src/main/database.ts)

**New Functions:**

- getTransactionsPaginated(filters: TransactionFilterParams): PaginatedTransactions
- migrateToUuidV7(): void

### 2. IPC Handlers (src/main/index.ts)

**New Channels:**

- db:getTransactions - Receives TransactionFilterParams, returns PaginatedTransactions
- db:getCategories - Returns Category[] with id, name, type, icon, color
- db:getAccounts - Returns Account[] with id, name, type, balance

### 3. Preload API (src/preload/index.ts)

**Updated Interface:**

```typescript
interface TransactionFilterParams {
  name?: string;
  categoryId?: number | null;
  accountId?: number | null;
  sortBy?: newest | oldest;
  page: number;
  pageSize: number;
}

interface PaginatedTransactions {
  data: ITransaction[];
  total: number;
  page: number;
  pageSize: number;
  summary: {
    totalIncome: number;
    totalExpense: number;
  };
}
```

### 4. Vue Components

**SoraTransactionView.vue Updates:**

- Fetch transactions on mount with default filters
- React to filter changes (debounced)
- Display pagination controls
- Show summary (totalIncome, totalExpense)
- Handle empty state with i18n key transactions.empty
- Handle error state with i18n key transactions.error

---

## Data Model Changes

### Current Schema (Before Migration)

| Column      | Type                  | Description          |
| ----------- | --------------------- | -------------------- |
| id          | INTEGER AUTOINCREMENT | Primary key          |
| name        | TEXT NOT NULL         | Transaction name     |
| description | TEXT                  | Optional description |
| category    | TEXT NOT NULL         | income/expense       |
| account     | TEXT NOT NULL         | cash/bank account    |
| amount      | INTEGER NOT NULL      | Amount in cents      |
| time        | TEXT NOT NULL         | ISO string           |

### New Schema (After Migration)

| Column      | Type             | Description               |
| ----------- | ---------------- | ------------------------- |
| id          | TEXT PRIMARY KEY | UUID v7                   |
| name        | TEXT NOT NULL    | Transaction name          |
| description | TEXT             | Optional description      |
| category_id | INTEGER NOT NULL | FK to categories(id)      |
| account_id  | INTEGER NOT NULL | FK to accounts(id)        |
| amount      | REAL NOT NULL    | Amount (supports decimal) |
| time        | INTEGER NOT NULL | Unix timestamp (ms)       |

### TypeScript Interfaces

```typescript
// src/main/types/transaction.ts
export interface ITransaction {
  id: string; // UUID v7
  name: string;
  description: string;
  categoryId: number;
  categoryName?: string;
  accountId: number;
  accountName?: string;
  amount: number;
  time: number; // Unix timestamp (ms)
}

export interface TransactionFilterParams {
  name?: string;
  categoryId?: number | null;
  accountId?: number | null;
  sortBy?: newest | oldest;
  page: number;
  pageSize: number;
}

export interface PaginatedTransactions {
  data: ITransaction[];
  total: number;
  page: number;
  pageSize: number;
  summary: {
    totalIncome: number;
    totalExpense: number;
  };
}
```

---

## APIs & Contracts

### API Contract: Get Transactions

**Request IPC: db:getTransactions**

| Parameter  | Type        | Default      | Description            |
| ---------- | ----------- | ------------ | ---------------------- |
| name       | string      | Empty string | Search query           |
| categoryId | number/null | null         | All categories if null |
| accountId  | number/null | null         | All accounts if null   |
| sortBy     | string      | newest       | Sort order             |
| page       | number      | 1            | Page number            |
| pageSize   | number      | 10           | Page size              |

**Response:**
{
data: ITransaction[],
total: number,
page: number,
pageSize: number,
summary: {
totalIncome: number,
totalExpense: number
}
}

### Search Implementation

Search query uses COLLATE NOCASE for case-insensitive search. For Vietnamese diacritics support, processing is done at application layer.

---

## Non-functional Requirements

### Performance

- Target: Response time < 200ms for 10,000 records
- Implementation: LIMIT/OFFSET with indexed columns

### Scalability

- LIMIT/OFFSET: Ensures performance as data grows
- Indexes: Create indexes on filtered columns (category_id, account_id, time)

### Security

- Local only: Data from SQLite local, not exposed to internet
- Prepared statements: All queries use parameterized queries

### Maintainability

- Prepared statements: All queries use prepared statements
- Separation of concerns: Database logic separate from IPC handlers

### Other Requirements

- UUID v7: Use uuid library with v7() method
- Auto-migration: Run migration automatically on startup
- Backup: Create backup before migration if database exists
- Logging: All logging in Electron main process only
- Pagination: Server-side with LIMIT/OFFSET

---

## Migration Plan

### Phase 1: Database Migration

1. Backup existing database (if exists)
2. Create new columns with new data types
3. Migrate data from old columns to new columns
4. Drop old columns and rename new columns
5. Create indexes for performance

---

## Implementation Tasks

| Task ID   | Description                                   | Estimated Hours | Priority |
| --------- | --------------------------------------------- | --------------- | -------- |
| T1        | Database migration to UUID v7                 | 3               | P0       |
| T2        | Create paginated query functions              | 2               | P0       |
| T3        | Update IPC handlers for pagination            | 1               | P0       |
| T4        | Update preload API types                      | 1               | P0       |
| T5        | Update renderer transaction types             | 1               | P0       |
| T6        | Implement category/account dropdown data      | 2               | P1       |
| T7        | Update SoraTransactionView.vue to use new API | 3               | P1       |
| T8        | Implement filter change handling              | 2               | P1       |
| T9        | Implement search with Vietnamese support      | 2               | P2       |
| T10       | Add error handling and empty state            | 1               | P1       |
| T11       | Add i18n keys (empty, error)                  | 0.5             | P2       |
| T12       | Add logging to main process                   | 1               | P2       |
| T13       | Testing and bug fixes                         | 3               | P1       |
| **Total** |                                               | **21.5**        |          |

### Implementation Order

1. T1-T3: Backend infrastructure (migration + API)
2. T4-T5: Type definitions
3. T6: Dropdown data
4. T7-T8: Main UI component
5. T9-T12: Additional features
6. T13: Testing

---

## Timeline/Phases

### Phase 1: Database & API (Day 1-2)

- Database migration
- Paginated query functions
- IPC handlers

### Phase 2: Frontend Integration (Day 2-3)

- Type updates
- UI component updates
- Filter handling

### Phase 3: Polish & Testing (Day 3-4)

- Error handling
- i18n
- Testing
- Bug fixes

---

## Risks & Mitigations

### Risk 1: Data Migration Failure

- Impact: High - Loss of user data
- Mitigation: Backup database before migration, implement rollback mechanism, test migration on sample data first

### Risk 2: Performance with Large Datasets

- Impact: Medium - Slow response times
- Mitigation: Create indexes on filtered columns, use EXPLAIN QUERY PLAN to optimize

### Risk 3: Breaking Changes for Existing Users

- Impact: High - Existing data format incompatibility
- Mitigation: Full migration path from old schema, downgrade protection in migration script

### Risk 4: Vietnamese Search Not Working

- Impact: Low - Feature does not work as expected
- Mitigation: Implement fallback search (case-insensitive only)

---

## Open Questions

1. Category/Account Selection: Store as IDs or keep string-based?
   - Decision: Use IDs (foreign keys) for better scalability

2. UUID v7 Generation: How to generate in SQLite?
   - Decision: Generate in Node.js using uuid library

3. Search Performance: DB or application layer?
   - Decision: Hybrid - basic search in DB, Vietnamese normalization in app layer

4. Backward Compatibility: Handle existing data?
   - Decision: Auto-migrate on startup with backup

---

## Dependencies

### Internal Dependencies

- Database layer: Must be stable before API changes
- Preload API: Types must match between main and renderer
- i18n: Must include new keys for error/empty states

### External Dependencies

- uuid: ^9.0.0 (UUID v7 generation)
- element-plus: Already in use
- vue-i18n: Already in use

### Package.json Changes

{
"dependencies": {
"uuid": "^9.0.0"
},
"devDependencies": {
"@types/uuid": "^9.0.0"
}
}

---

## Acceptance Criteria Mapping

| AC ID | Description         | Implementation                        | Verification                       |
| ----- | ------------------- | ------------------------------------- | ---------------------------------- |
| AC1   | Default filters     | TransactionFilterParams with defaults | Check API returns filtered data    |
| AC2   | Paginated response  | PaginatedTransactions interface       | Verify data, total, page, pageSize |
| AC3   | Display on table    | Vue template with columns             | Visual inspection                  |
| AC4   | Empty state         | v-if="data.length === 0"              | Test with no data                  |
| AC5   | Pagination controls | ElPagination component                | Test page changes                  |
| AC6   | Filter changes      | Watch filter state, refetch           | Change filters, verify             |
| AC7   | Summary totals      | Server-calculated in response         | Verify with sample data            |
| AC8   | Summary updates     | React to filter changes               | Change filter, check totals        |
| AC9   | Decimal amounts     | REAL type in SQLite                   | Insert/test 10.02 amount           |
| AC10  | Error handling      | Try-catch + toast notification        | Simulate DB error                  |
| AC11  | Category dropdown   | Fetch from database                   | Check dropdown populated           |
| AC12  | Account dropdown    | Fetch from database                   | Check dropdown populated           |
| AC13  | Filter by ID        | Use accountId/categoryId              | Test filter by ID                  |
| AC14  | Vietnamese search   | Custom normalization                  | Search Vietnamese text             |
| AC15  | Logging in main     | console.log in main process           | Check logs only in main            |
| AC16  | Display negative    | Show positive with red color          | Check expense display              |
