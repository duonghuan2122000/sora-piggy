# Research: Localize Transaction Form

## Research Questions

### Question 1: How to use vue-i18n in Vue 3 Composition API?

**Decision**: Use `useI18n()` composition function from vue-i18n

**Rationale**:

- Vue 3 Composition API supports `useI18n()` for accessing translation functions
- `t()` function can be called directly in template and script
- Existing i18n configuration at `src/renderer/src/locales/index.ts` already uses `legacy: false` which enables Composition API mode

**References**:

- vue-i18n documentation for Composition API usage
- Existing code in `src/main.ts` shows i18n plugin is properly installed

### Question 2: How are validation error messages handled in Element Plus forms?

**Decision**: Use translation keys in FormRules message property

**Rationale**:

- Element Plus FormRules accept a `message` property for validation errors
- The message can be a static string or computed value
- We can use `t()` function to provide localized error messages
- Rules are defined in script section, so we need to use `t()` from `useI18n()`

**Example**:

```typescript
const { t } = useI18n();
const rules: FormRules = {
  name: [{ required: true, message: t('validation.nameRequired'), trigger: ['blur', 'change'] }]
};
```

### Question 3: What locale files exist and what translations are needed?

**Decision**: Check existing locale files and identify gaps

**Findings**:

- `vi.json` exists with basic translations (app.title, nav, button, message)
- `en.json` exists (assumed to mirror vi.json structure)
- Current transaction form uses hardcoded English text in:
  - Form labels (Transaction Name, Description, Date & Time, Amount, Category, Account)
  - Placeholders (Enter transaction name, Enter transaction description, Search or add category, Search or add account)
  - Dialog titles (Add Category, Add Account)
  - Button text (Cancel, Save)
  - Validation messages (Please enter transaction name, Please enter amount, etc.)

**Missing Translations Needed**:

- Transaction form section with keys for:
  - Form labels
  - Placeholders
  - Dialog titles
  - Validation messages

### Question 4: How to handle Element Plus built-in i18n?

**Decision**: Element Plus provides its own i18n mechanism that may need configuration

**Rationale**:

- Element Plus components have built-in text (e.g., DatePicker, Select)
- These may need to be localized via Element Plus's i18n mechanism
- For this feature, focus on custom form text first
- Element Plus built-in text can be addressed in future iterations if needed

## Decisions Summary

| Decision                                      | Rationale                                                  |
| --------------------------------------------- | ---------------------------------------------------------- |
| Use `useI18n()` composition function          | Matches Vue 3 Composition API pattern in existing codebase |
| Add translation keys to vi.json and en.json   | Existing infrastructure already supports this              |
| Update FormRules messages with `t()` function | Required for validation error localization                 |
| Focus on custom form text first               | Element Plus built-in i18n can be handled separately       |

## Implementation Approach

1. Add translation keys to `vi.json` and `en.json` for transaction form
2. Import `useI18n` in `SoraAddTransactionView.vue`
3. Replace hardcoded text in template with `t()` function calls
4. Update FormRules to use localized validation messages
5. Test both Vietnamese and English locales
