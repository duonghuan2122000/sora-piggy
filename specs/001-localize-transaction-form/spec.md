# Feature Specification: Localize Transaction Form

**Feature Branch**: `001-localize-transaction-form`
**Created**: 2026-04-04
**Status**: Draft
**Input**: User description: "Tôi muốn bổ sung localize cho màn hình thêm giao dịch. Hiện trạng: Tại màn hình thêm giao dịch, các text, placeholder, alert đang sử dụng hard text. Yêu cầu: Bổ sung localize cho màn hình thêm giao dịch, mặc định: Tiếng Việt"

## User Scenarios & Testing

### User Story 1 - View Transaction Form in Vietnamese (Priority: P1)

A Vietnamese user opens the "Add Transaction" screen and sees all labels, placeholders, and messages in Vietnamese.

**Why this priority**: This is the core requirement - making the UI accessible to Vietnamese users who are the primary audience.

**Independent Test**: Navigate to the Add Transaction page and verify all text displays in Vietnamese without any English text visible.

**Acceptance Scenarios**:

1. **Given** user is on the Add Transaction page, **When** page loads, **Then** page title displays "Thêm giao dịch"
2. **Given** user views the form, **When** checking the transaction name field, **Then** label shows "Tên khoản thu/chi" and placeholder shows "Nhập tên khoản thu/chi"
3. **Given** user views the form, **When** checking the description field, **Then** label shows "Mô tả/Nội dung khoản thu/chi" and placeholder shows "Nhập mô tả/nội dung khoản thu/chi"
4. **Given** user views the form, **When** checking the date/time field, **Then** label shows "Thời gian" and default value is today's date
5. **Given** user views the form, **When** checking the amount field, **Then** label shows "Số tiền"
6. **Given** user views the form, **When** checking the category field, **Then** label shows "Danh mục" and placeholder shows "Tìm hoặc thêm danh mục"
7. **Given** user views the form, **When** checking the account field, **Then** label shows "Tài khoản" và placeholder shows "Tìm hoặc thêm tài khoản"

---

### User Story 2 - Switch Language Between Vietnamese and English (Priority: P2)

Users can switch between Vietnamese and English languages to view the interface in their preferred language.

**Why this priority**: Provides flexibility for bilingual users or users who prefer English.

**Independent Test**: Use the language switcher (if available) or check that both Vietnamese and English locale files exist and can be loaded.

**Acceptance Scenarios**:

1. **Given** application supports i18n, **When** Vietnamese locale is active, **Then** all transaction form text displays in Vietnamese
2. **Given** application supports i18n, **When** English locale is active, **Then** all transaction form text displays in English

---

### User Story 3 - Error Messages in Localized Language (Priority: P3)

Validation error messages display in the currently selected language.

**Why this priority**: Ensures complete localization including user feedback.

**Independent Test**: Submit the form with missing required fields and verify error messages appear in the selected language.

**Acceptance Scenarios**:

1. **Given** Vietnamese locale is active, **When** user submits form without transaction name, **Then** error message displays in Vietnamese
2. **Given** Vietnamese locale is active, **When** user submits form without amount, **Then** error message displays in Vietnamese
3. **Given** Vietnamese locale is active, **When** user submits form without category, **Then** error message displays in Vietnamese
4. **Given** Vietnamese locale is active, **When** user submits form without account, **Then** error message displays in Vietnamese

---

### Edge Cases

- What happens when locale file is missing for a specific string? (Default to fallback locale)
- How does the system handle special characters in Vietnamese (accents, diacritics)?
- What if user switches language mid-form completion?

## Requirements

### Functional Requirements

- **FR-001**: System MUST support Vietnamese localization for all transaction form labels and placeholders
- **FR-002**: System MUST support English localization as fallback when Vietnamese is not available
- **FR-003**: System MUST display page title "Thêm giao dịch" when Vietnamese locale is active
- **FR-004**: System MUST display transaction name label as "Tên khoản thu/chi" in Vietnamese
- **FR-005**: System MUST display transaction name placeholder as "Nhập tên khoản thu/chi" in Vietnamese
- **FR-006**: System MUST display description label as "Mô tả/Nội dung khoản thu/chi" in Vietnamese
- **FR-007**: System MUST display description placeholder as "Nhập mô tả/nội dung khoản thu/chi" in Vietnamese
- **FR-008**: System MUST display date/time label as "Thời gian" in Vietnamese
- **FR-009**: System MUST default date/time picker to current date when form loads
- **FR-010**: System MUST display amount label as "Số tiền" in Vietnamese
- **FR-011**: System MUST display category label as "Danh mục" in Vietnamese
- **FR-012**: System MUST display category placeholder as "Tìm hoặc thêm danh mục" in Vietnamese
- **FR-013**: System MUST display account label as "Tài khoản" in Vietnamese
- **FR-014**: System MUST display account placeholder as "Tìm hoặc thêm tài khoản" in Vietnamese
- **FR-015**: System MUST display validation error messages in Vietnamese when locale is set to Vietnamese
- **FR-016**: System MUST support adding new transaction with all localized text visible

### Key Entities

- **Locale Messages**: Translation strings for UI text organized by feature/component
- **Transaction Form**: The form component that displays labels, placeholders, and validation messages

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% of transaction form UI text is localized to Vietnamese (verified by UI inspection)
- **SC-002**: All 7 required labels and 6 placeholders display correct Vietnamese text
- **SC-003**: Default date/time value shows current date on form load without user interaction
- **SC-004**: Validation error messages display in Vietnamese when locale is Vietnamese
- **SC-005**: Application can switch between Vietnamese and English without breaking the form

## Assumptions

- The application already has i18n infrastructure (vue-i18n) configured
- The locale files (vi.json and en.json) already exist and are properly imported
- The default locale is set to Vietnamese ('vi')
- Element Plus components support i18n for built-in text (if needed)
- Date/time formatting will follow locale-specific conventions
- The existing Vue component structure supports template interpolation for labels and placeholders
