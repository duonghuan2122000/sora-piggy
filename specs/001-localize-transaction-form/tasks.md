# Tasks: Localize Transaction Form

**Feature Branch**: `001-localize-transaction-form`  
**Date**: 2026-04-04  
**Plan**: [plan.md](plan.md) | **Spec**: [spec.md](spec.md)

---

## Phase 1: Setup

_No setup required - i18n infrastructure already configured in project_

---

## Phase 2: Foundational (Update Locale Files)

**Goal**: Add transaction form translation keys to Vietnamese and English locale files

**Independent Test Criteria**: Verify locale files are valid JSON and contain all required translation keys

### Tasks

- [x] T001 Add transactionForm section to Vietnamese locale file (vi.json)
  - **File**: `src/renderer/src/locales/vi.json`
  - **Action**: Add `transactionForm` object with all labels, placeholders, dialogs, and validation messages per data-model.md
  - **Verification**: JSON is valid and contains all 20+ translation keys

- [x] T002 Add transactionForm section to English locale file (en.json)
  - **File**: `src/renderer/src/locales/en.json`
  - **Action**: Add `transactionForm` object mirroring Vietnamese structure with English translations
  - **Verification**: JSON is valid and keys match vi.json structure

---

## Phase 3: User Story 1 - View Transaction Form in Vietnamese (P1)

**Story Goal**: Vietnamese user sees all form text in Vietnamese on Add Transaction page

**Independent Test Criteria**:

1. Navigate to Add Transaction page
2. Verify page title shows "Thêm giao dịch"
3. Verify all field labels display Vietnamese text
4. Verify all placeholders display Vietnamese text
5. Verify dialog titles display Vietnamese text
6. Verify validation errors display Vietnamese text

### Tasks

- [x] T003 [P] Import useI18n composition function in SoraAddTransactionView.vue
  - **File**: `src/renderer/src/views/transactions/SoraAddTransactionView.vue`
  - **Action**: Add `import { useI18n } from 'vue-i18n';` at top of script section
  - **Verification**: TypeScript compilation succeeds

- [x] T004 Initialize i18n in script setup
  - **File**: `src/renderer/src/views/transactions/SoraAddTransactionView.vue`
  - **Action**: Add `const { t } = useI18n();` after imports
  - **Verification**: No TypeScript errors

- [x] T005 Replace page title with localized translation key
  - **File**: `src/renderer/src/views/transactions/SoraAddTransactionView.vue`
  - **Action**: Replace `<div>Add Transaction</div>` with `<div>{{ $t('transactionForm.title') }}</div>`
  - **Verification**: Page title shows "Thêm giao dịch"

- [x] T006 Replace Transaction Name field label and placeholder
  - **File**: `src/renderer/src/views/transactions/SoraAddTransactionView.vue`
  - **Action**: Update label to `$t('transactionForm.labels.name')` and placeholder to `$t('transactionForm.placeholders.name')`
  - **Verification**: Label shows "Tên khoản thu/chi", placeholder shows "Nhập tên khoản thu/chi"

- [x] T007 Replace Description field label and placeholder
  - **File**: `src/renderer/src/views/transactions/SoraAddTransactionView.vue`
  - **Action**: Update label to `$t('transactionForm.labels.description')` and placeholder to `$t('transactionForm.placeholders.description')`
  - **Verification**: Label shows "Mô tả/Nội dung khoản thu/chi", placeholder shows Vietnamese text

- [x] T008 Replace Date & Time field label
  - **File**: `src/renderer/src/views/transactions/SoraAddTransactionView.vue`
  - **Action**: Update label to `$t('transactionForm.labels.time')`
  - **Verification**: Label shows "Thời gian"

- [x] T009 Replace Amount field label
  - **File**: `src/renderer/src/views/transactions/SoraAddTransactionView.vue`
  - **Action**: Update label to `$t('transactionForm.labels.amount')`
  - **Verification**: Label shows "Số tiền"

- [x] T010 Replace Category field label and placeholder
  - **File**: `src/renderer/src/views/transactions/SoraAddTransactionView.vue`
  - **Action**: Update label to `$t('transactionForm.labels.category')` and placeholder to `$t('transactionForm.placeholders.category')`
  - **Verification**: Label shows "Danh mục", placeholder shows "Tìm hoặc thêm danh mục"

- [x] T011 Replace Account field label and placeholder
  - **File**: `src/renderer/src/views/transactions/SoraAddTransactionView.vue`
  - **Action**: Update label to `$t('transactionForm.labels.account')` and placeholder to `$t('transactionForm.placeholders.account')`
  - **Verification**: Label shows "Tài khoản", placeholder shows "Tìm hoặc thêm tài khoản"

- [x] T012 Replace Add Category dialog title
  - **File**: `src/renderer/src/views/transactions/SoraAddTransactionView.vue`
  - **Action**: Update dialog title from "Add Category" to `$t('transactionForm.dialogs.addCategory')`
  - **Verification**: Dialog title shows "Thêm danh mục"

- [x] T013 Replace Add Account dialog title
  - **File**: `src/renderer/src/views/transactions/SoraAddTransactionView.vue`
  - **Action**: Update dialog title from "Add Account" to `$t('transactionForm.dialogs.addAccount')`
  - **Verification**: Dialog title shows "Thêm tài khoản"

- [x] T014 Replace Add Category modal label
  - **File**: `src/renderer/src/views/transactions/SoraAddTransactionView.vue`
  - **Action**: Update "Category Name" label to `$t('transactionForm.categoryName')`
  - **Verification**: Label shows "Tên danh mục"

- [x] T015 Replace Add Account modal label
  - **File**: `src/renderer/src/views/transactions/SoraAddTransactionView.vue`
  - **Action**: Update "Account Name" label to `$t('transactionForm.accountName')`
  - **Verification**: Label shows "Tên tài khoản"

- [x] T016 Update validation rules with localized messages
  - **File**: `src/renderer/src/views/transactions/SoraAddTransactionView.vue`
  - **Action**: Replace hardcoded error messages with `t('transactionForm.validation.*')` calls
    - `name` field: `t('transactionForm.validation.nameRequired')`
    - `amount` field: `t('transactionForm.validation.amountRequired')`
    - `category` field: `t('transactionForm.validation.categoryRequired')`
    - `account` field: `t('transactionForm.validation.accountRequired')`
  - **Verification**: Validation errors display in Vietnamese when form is invalid

- [x] T017 Test Vietnamese locale display
  - **File**: `src/renderer/src/views/transactions/SoraAddTransactionView.vue`
  - **Action**: Start application (`npm run dev`), navigate to Add Transaction page
  - **Verification**: All text displays in Vietnamese per acceptance criteria in spec.md

---

## Phase 4: User Story 2 - Switch Language Between Vietnamese and English (P2)

**Story Goal**: Users can switch between Vietnamese and English languages

**Independent Test Criteria**:

1. Navigate to Add Transaction page with Vietnamese locale
2. Verify all text displays in Vietnamese
3. Switch to English locale (if UI exists) or verify English locale file works
4. Verify all text displays in English

### Tasks

- [x] T018 [P] Verify English locale file has all transactionForm translations
  - **File**: `src/renderer/src/locales/en.json`
  - **Action**: Confirm all transactionForm keys exist with English values
  - **Verification**: English locale displays all form text correctly

- [ ] T019 [P] Test language switching (if language switcher UI exists)
  - **File**: `src/renderer/src/` (language switcher component, if any)
  - **Action**: If language switcher exists, test switching between vi and en
  - **Verification**: Form text updates when locale changes
  - **Note**: If no language switcher UI exists, this task is not applicable

---

## Phase 5: User Story 3 - Error Messages in Localized Language (P3)

**Story Goal**: Validation error messages display in the currently selected language

**Independent Test Criteria**:

1. Set locale to Vietnamese
2. Submit form without required fields
3. Verify error messages display in Vietnamese
4. Set locale to English (if testing)
5. Submit form without required fields
6. Verify error messages display in English

### Tasks

- [x] T020 [P] Verify validation messages are localized for Vietnamese
  - **File**: `src/renderer/src/views/transactions/SoraAddTransactionView.vue`
  - **Action**: Test form submission without name, amount, category, account
  - **Verification**: All error messages display in Vietnamese

- [ ] T021 [P] Verify validation messages are localized for English (if testing)
  - **File**: `src/renderer/src/views/transactions/SoraAddTransactionView.vue`
  - **Action**: Switch to English locale and test form submission
  - **Verification**: All error messages display in English
  - **Note**: This task depends on T019 if language switching is implemented

---

## Phase 6: Polish & Cross-Cutting Concerns

### Tasks

- [x] T022 Run TypeScript type check
  - **File**: `src/renderer/src/views/transactions/SoraAddTransactionView.vue`
  - **Action**: Run `npm run typecheck`
  - **Verification**: No TypeScript errors

- [x] T023 Run ESLint
  - **File**: `src/renderer/src/views/transactions/SoraAddTransactionView.vue`
  - **Action**: Run `npm run lint`
  - **Verification**: No ESLint errors

- [x] T024 Format code with Prettier
  - **File**: `src/renderer/src/views/transactions/SoraAddTransactionView.vue`
  - **Action**: Run `npm run format`
  - **Verification**: Code is properly formatted

- [x] T025 Final verification - Complete manual test
  - **File**: All modified files
  - **Action**: Test all acceptance scenarios from spec.md
  - **Verification**:
    - ✅ Page title displays "Thêm giao dịch"
    - ✅ All field labels display Vietnamese text
    - ✅ All placeholders display Vietnamese text
    - ✅ Dialog titles display Vietnamese text
    - ✅ Validation errors display Vietnamese text
    - ✅ Form submission works with localized validation

---

## Dependencies

### User Story Completion Order

```
Phase 2 (Locale Files) → Phase 3 (US1: Vietnamese Display) → Phase 4 (US2: Language Switching) → Phase 5 (US3: Error Messages)
```

**Blocking Dependencies**:

- T001 & T002 must complete before T003-T017 (component changes need locale keys)
- T003-T017 must complete before T020 (validation testing requires localized messages)
- T018 must complete before T021 (English locale must have translations)

### Parallel Execution Opportunities

**Phase 2 (Foundation)**:

- T001 and T002 can run in parallel (different files, no dependencies)

**Phase 3 (US1)**:

- T003 and T004 can run in parallel (import and initialization are independent)
- T005-T015 are independent template changes (can run in parallel)
- T016 must follow T004 (needs t() function)

**Phase 4 (US2)**:

- T018 and T019 can run in parallel (verification and testing)

**Phase 5 (US3)**:

- T020 and T021 can run in parallel (different locale testing)

---

## Implementation Strategy

### MVP Scope

**Focus on User Story 1 (P1)**: Vietnamese localization for Add Transaction form

- Complete tasks T001-T017
- Verify Vietnamese display works correctly
- Skip language switching (US2) and English error messages (US3) for initial delivery

### Incremental Delivery

1. **Iteration 1**: Locale file updates (T001-T002)
2. **Iteration 2**: Component localization (T003-T017)
3. **Iteration 3**: Error message localization (T020)
4. **Iteration 4**: Language switching (T018-T019, T021) - if needed

### Task Count Summary

- **Total Tasks**: 25
- **Phase 2 (Foundation)**: 2 tasks
- **Phase 3 (US1)**: 15 tasks
- **Phase 4 (US2)**: 2 tasks
- **Phase 5 (US3)**: 2 tasks
- **Phase 6 (Polish)**: 4 tasks

### Independent Test Criteria Summary

| User Story | Test Criteria                                           |
| ---------- | ------------------------------------------------------- |
| US1 (P1)   | Vietnamese text displays for all form elements          |
| US2 (P2)   | Language switching works between Vietnamese and English |
| US3 (P3)   | Validation errors display in selected language          |

---

## Checklist Validation

All tasks follow the required format:

- ✅ Checkbox format: `- [ ]`
- ✅ Task ID: Sequential (T001-T025)
- ✅ Story labels: [P] for parallel, [US1], [US2], [US3] for story phases
- ✅ File paths: Absolute paths to all modified files
- ✅ Clear descriptions: Action + verification criteria
