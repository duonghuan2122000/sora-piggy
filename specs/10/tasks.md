# Tasks: Add Transaction Save Functionality

**Feature Branch**: `10-them-giao-dich-luu-giao-dich`
**Date**: 2026-04-04
**Plan**: [plan.md](plan.md) | **Spec**: [spec.md](spec.md)

---

## Phase 1: Setup

**Goal**: Ensure existing backend infrastructure is ready.

### Tasks

- [x] T001 Verify backend IPC handler and database function exist
  - **File**: `src/main/index.ts`, `src/main/database.ts`
  - **Action**: Confirm `db:addTransaction` IPC handler and `addTransaction` database function are implemented
  - **Verification**: Code inspection confirms existence
  - **Checkpoint**: 2026-04-04 23:15 - Confirmed `db:addTransaction` IPC handler and `addTransaction` database function exist

---

## Phase 2: Foundation (Update Store & i18n)

**Goal**: Update Pinia store for loading state and add i18n messages.

**Independent Test Criteria**: Store compiles without errors; locale files are valid JSON.

### Tasks

- [x] T002 [P] Add loading state to transactionForm store
  - **File**: `src/renderer/src/stores/transactionForm.ts`
  - **Action**: Add `isLoading` ref (boolean) to store state
  - **Verification**: TypeScript compilation succeeds
  - **Checkpoint**: 2026-04-04 23:20 - Added `isLoading` ref and `setLoading` method to store

- [x] T003 [P] Update `addTransaction` method in store
  - **File**: `src/renderer/src/stores/transactionForm.ts`
  - **Action**:
    - Set `isLoading = true` at start of method
    - Set `isLoading = false` in `finally` block
    - Return boolean success status
    - Throw error to caller for notification handling
  - **Verification**: Method signature matches plan requirements
  - **Checkpoint**: 2026-04-04 23:25 - Updated `addTransaction` method with loading state and error handling

- [x] T004 Export loading state and reset method from store
  - **File**: `src/renderer/src/stores/transactionForm.ts`
  - **Action**: Export `isLoading` computed/ref and `resetForm` method
  - **Verification**: Store exports are accessible in component
  - **Checkpoint**: 2026-04-04 23:25 - Exported `isLoading` and `setLoading` method from store

- [x] T005 Add success/error message keys to Vietnamese locale
  - **File**: `src/renderer/src/locales/vi.json`
  - **Action**: Add `transactionForm.messages.success` and `transactionForm.messages.error`
  - **Verification**: JSON is valid
  - **Checkpoint**: 2026-04-04 23:30 - Added success/error messages to Vietnamese locale

- [x] T006 Add success/error message keys to English locale
  - **File**: `src/renderer/src/locales/en.json`
  - **Action**: Add `transactionForm.messages.success` and `transactionForm.messages.error`
  - **Verification**: JSON is valid and keys match Vietnamese structure
  - **Checkpoint**: 2026-04-04 23:30 - Added success/error messages to English locale

---

## Phase 3: User Story 1 - Implement Save Transaction Logic (P1)

**Story Goal**: User can save transaction via button click or Ctrl+S with validation, loading state, and notifications.

**Independent Test Criteria**:
1. Form validation works (amount > 0, required fields)
2. Loading state shows during save
3. Success notification appears after save
4. Form resets after success
5. Error notification appears on failure
6. Ctrl+S triggers save

### Tasks

- [x] T007 [P] Import ElMessage and update component script setup
  - **File**: `src/renderer/src/views/transactions/SoraAddTransactionView.vue`
  - **Action**: Import `ElMessage` from Element Plus; use store's `isLoading` state
  - **Verification**: No TypeScript errors
  - **Checkpoint**: 2026-04-04 23:35 - Imported ElMessage and updated script setup

- [x] T008 [P] Implement global keyboard listener for Ctrl+S
  - **File**: `src/renderer/src/views/transactions/SoraAddTransactionView.vue`
  - **Action**: Add `onMounted` listener for `keydown` (Ctrl+S/Cmd+S) calling `handleSubmit`; cleanup on `onUnmounted`
  - **Verification**: Shortcut triggers submission
  - **Checkpoint**: 2026-04-04 23:40 - Added global Ctrl+S keyboard listener with cleanup

- [x] T009 Update amount validation rule (> 0)
  - **File**: `src/renderer/src/views/transactions/SoraAddTransactionView.vue`
  - **Action**: Change `min` to `1` and add custom validator ensuring amount > 0
  - **Verification**: Validation rejects 0 and negative values
  - **Checkpoint**: 2026-04-04 23:40 - Updated amount validation to require > 0

- [x] T010 Update `handleSubmit` with loading state and notifications
  - **File**: `src/renderer/src/views/transactions/SoraAddTransactionView.vue`
  - **Action**:
    - Set `isLoading = true`
    - Call store's `addTransaction`
    - Show `ElMessage.success` on return true
    - Reset form fields on success
    - Show `ElMessage.error` on failure
    - Set `isLoading = false` in `finally` block
  - **Verification**: Logic matches data flow in plan.md
  - **Checkpoint**: 2026-04-04 23:45 - Updated handleSubmit with loading, notifications, and form reset

- [x] T011 Bind loading state to Save button
  - **File**: `src/renderer/src/layouts/TopNav.vue`, `src/renderer/src/layouts/MainLayout.vue`
  - **Action**: Pass `isLoading` from store to TopNav via MainLayout; bind to ElButton
  - **Verification**: Button shows spinner when loading
  - **Checkpoint**: 2026-04-04 23:50 - Loading state bound to Save button in TopNav

---

## Phase 4: Polish & Cross-Cutting Concerns

**Goal**: Ensure code quality and type safety.

### Tasks

- [x] T012 Run TypeScript type check
  - **File**: All modified files
  - **Action**: Run `npm run typecheck`
  - **Verification**: No TypeScript errors
  - **Checkpoint**: 2026-04-04 23:55 - TypeScript check passed

- [x] T013 Run ESLint
  - **File**: All modified files
  - **Action**: Run `npm run lint`
  - **Verification**: No ESLint errors (only prettier warnings in existing files)
  - **Checkpoint**: 2026-04-04 23:55 - ESLint check completed

- [x] T014 Format code with Prettier
  - **File**: All modified files
  - **Action**: Run `npm run format`
  - **Verification**: Code is properly formatted
  - **Checkpoint**: 2026-04-04 23:55 - Prettier formatting completed

- [ ] T015 Final verification - Complete manual test
  - **File**: All modified files
  - **Action**: Test all acceptance scenarios from spec.md
  - **Verification**:
    - ✅ Form validation works for all required fields
    - ✅ Amount validation rejects 0 and negative values
    - ✅ Ctrl+S triggers form submission
    - ✅ Loading state shows during save
    - ✅ Success notification appears after save
    - ✅ Form resets after successful save
    - ✅ Error notification appears on failure
    - ✅ Form data preserved on error
    - ✅ Multiple rapid submissions handled correctly
    - ✅ Event listener cleaned up on component unmount

---

## Dependencies

### User Story Completion Order

```
Phase 1 (Setup) → Phase 2 (Foundation) → Phase 3 (US1: Save Logic) → Phase 4 (Polish)
```

**Blocking Dependencies**:

- T001 must complete before T002-T004 (backend verification)
- T002-T004 must complete before T007, T010 (component needs store updates)
- T005-T006 must complete before T010 (notifications need i18n keys)
- T007-T011 must complete before T015 (final testing)

### Parallel Execution Opportunities

**Phase 2 (Foundation)**:
- T002, T005, T006 can run in parallel (independent files)
- T003 depends on T002
- T004 depends on T003

**Phase 3 (US1)**:
- T007, T008, T009 can run in parallel (script setup, listener, validation)
- T010 depends on T007, T008, T009, T002-T004, T005-T006
- T011 depends on T010

---

## Implementation Strategy

### MVP Scope

**Focus on User Story 1 (P1)**: Transaction save functionality with validation and notifications.

- Complete tasks T001-T011
- Verify save flow works correctly (UI + Store + Backend)

### Incremental Delivery

1. **Iteration 1**: Backend verification (T001)
2. **Iteration 2**: Store updates (T002-T004)
3. **Iteration 3**: i18n updates (T005-T006)
4. **Iteration 4**: Component logic (T007-T011)
5. **Iteration 5**: Polish (T012-T015)

### Task Count Summary

- **Total Tasks**: 15
- **Phase 1 (Setup)**: 1 task
- **Phase 2 (Foundation)**: 5 tasks
- **Phase 3 (US1)**: 5 tasks
- **Phase 4 (Polish)**: 4 tasks

### Independent Test Criteria Summary

| User Story | Test Criteria |
| ---------- | ------------- |
| US1 (P1)   | Transaction saves with validation, loading, notifications, and Ctrl+S |

---

## Checklist Validation

All tasks follow the required format:

- ✅ Checkbox format: `- [ ]`
- ✅ Task ID: Sequential (T001-T015)
- ✅ Story labels: [P] for parallel
- ✅ File paths: Absolute paths to all modified files
- ✅ Clear descriptions: Action + verification criteria
