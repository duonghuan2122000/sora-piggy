# Architecture Plan: SoraTransactionView Component

## 1. Component Structure (Template Structure)

The component is structured with a vertical layout containing four main sections:

- **Header (Filters)**: Flex container with inputs for search, category, account, and sorting.
- **Summary (Cards)**: Grid layout with 3 cards (Income, Expense, Balance). Balance card has a gray background (`$bg-tertiary`) and 8px border radius (`$radius-md`).
- **Detail (Table)**: Naive UI table displaying transaction details with pagination.
- **Footer**: Horizontal layout with total count and pagination controls.

## 2. TypeScript Interfaces

Defined in the component script:

- `Transaction`: id, name, description, categoryId, categoryName, accountId, accountName, timestamp, amount, type.
- `FilterState`: searchQuery, categoryId, accountId, sortBy, sortOrder.
- `SummaryStats`: totalIncome, totalExpense, balance.

## 3. State Management Approach

Using Vue 3 Composition API:

- **Refs**: `transactions` (array of Transaction objects).
- **Reactive**: `filters` (filter state), `pagination` (page, pageSize, total).
- **Computed**: `filteredTransactions` (applies filter, sort, pagination logic), `summaryStats` (calculates totals).

## 4. Props and Emits

- **Props**: None required for this view. Optional: `initialFilters` to pre-populate filters.
- **Emits**: None required. Events handled internally.

## 5. Folder Structure Suggestion

```
src/renderer/src/views/
  └── SoraTransactionView.vue  // Single File Component (Script, Template, Style)
```

## Reference Implementation

The component is implemented in `src/renderer/src/views/SoraTransactionView.vue`.
