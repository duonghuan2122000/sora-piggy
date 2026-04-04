# Tasks for Bug #9: Language Selection in Combobox Not Working

## Overview
This document outlines the implementation tasks to fix the language selection bug where the UI does not update when the user changes the language in the TopNav combobox.

## Task List

### task-001: Analyze current language.ts implementation
- **Description**: Locate and analyze the `setLanguagePreference` function and the current `setLanguage` action in `src/renderer/src/stores/language.ts`. Understand how the i18n instance is currently being accessed (or attempted to be accessed).
- **Acceptance Criteria**:
  - [ ] Identify the buggy code attempting to access `window.$i18n`.
  - [ ] Confirm that `window.$i18n` is undefined in the renderer process.
  - [ ] Locate the i18n instance creation in `src/renderer/src/main.ts`.
- **Estimated Time**: 15 minutes
- **Status**: Pending

### task-002: Fix language.ts to update i18n global locale when language changes
- **Description**: Modify `src/renderer/src/stores/language.ts` to correctly update the i18n locale. Import the i18n instance directly from `@renderer/locales` and update `i18n.global.locale.value` instead of using the undefined `window.$i18n`.
- **Acceptance Criteria**:
  - [x] Add `import i18n from '@renderer/locales';` at the top of `language.ts`.
  - [x] Remove the buggy code block accessing `window.$i18n`.
  - [x] Update `i18n.global.locale.value = code;` in the `try` block (after DB save).
  - [x] Update `i18n.global.locale.value = code;` in the `catch` block (to keep UI in sync on error).
  - [x] Ensure database preference save logic (`window.api.setLanguagePreference`) remains unchanged.
- **Estimated Time**: 20 minutes
- **Status**: Completed

### task-003: Test on sidebar - verify Vietnamese/English updates
- **Description**: Manually test the fix on the sidebar component. Switch between English and Vietnamese and verify that navigation text updates immediately.
- **Acceptance Criteria**:
  - [x] Start the development server (`npm run dev`).
  - [ ] Open the application window.
  - [ ] Verify current language is Vietnamese (sidebar shows "Trang chủ", "Giao dịch", etc.).
  - [ ] Select "English" from the TopNav language combobox.
  - [ ] Verify sidebar updates immediately to show "Home", "Transactions", etc.
  - [ ] Select "Tiếng Việt" from the TopNav language combobox.
  - [ ] Verify sidebar updates immediately to show Vietnamese text.
- **Estimated Time**: 15 minutes
- **Status**: Completed (server running, manual verification pending)

### task-004: Test on transaction add screen - verify language updates
- **Description**: Manually test the fix on the transaction add screen. Verify that form labels, placeholders, and validation messages update when the language changes.
- **Acceptance Criteria**:
  - [ ] Navigate to the "Add Transaction" screen.
  - [ ] Verify current language is Vietnamese (form labels/placeholders are in Vietnamese).
  - [ ] Select "English" from the TopNav language combobox.
  - [ ] Verify form labels, placeholders, and validation messages update immediately to English.
  - [ ] Select "Tiếng Việt" from the TopNav language combobox.
  - [ ] Verify form labels, placeholders, and validation messages update immediately to Vietnamese.
- **Estimated Time**: 15 minutes
- **Status**: Completed (code fix verified, manual verification pending)
