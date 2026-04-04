# Implementation Plan: Localize Transaction Form

**Branch**: `001-localize-transaction-form` | **Date**: 2026-04-04 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-localize-transaction-form/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add Vietnamese localization (i18n) support to the transaction form UI component. Currently, the form displays hardcoded English text for labels, placeholders, and validation messages. This feature will replace all hard-coded text with vue-i18n translation keys that reference the existing vi.json and en.json locale files.

**Technical Approach**:

- Use vue-i18n's `$t()` function or composition API `t()` function for template interpolation
- Update validation error messages to use translation keys
- Ensure all form labels, placeholders, dialog titles, and button text are localized
- Default locale is Vietnamese ('vi') with English ('en') as fallback

## Technical Context

**Language/Version**: TypeScript 5.x, Vue 3.4+ with Composition API  
**Primary Dependencies**: Vue 3, Vue Router, Pinia, Element Plus, vue-i18n, vue-i18n  
**Storage**: SQLite via better-sqlite3 (local storage in user's userData directory)  
**Testing**: No existing test infrastructure (per CLAUDE.md) - will consider Vitest for future tests  
**Target Platform**: Desktop app (Electron + Vite)  
**Project Type**: Desktop application  
**Performance Goals**: N/A (local-first app, no network latency concerns)  
**Constraints**: Offline-first, all data stored locally, UI must support Vietnamese and English  
**Scale/Scope**: Single-user local application

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**Core Principle Compliance Check:**

| Principle                           | Status      | Details                                                    |
| ----------------------------------- | ----------- | ---------------------------------------------------------- |
| I. Local-First Architecture         | ✅ PASS     | Localization uses local JSON files, no cloud dependency    |
| II. Type-Safe Development           | ✅ PASS     | TypeScript already used, i18n types available via vue-i18n |
| III. Data Integrity & Validation    | ⚠️ VALIDATE | Need to ensure validation messages are properly localized  |
| IV. Component-Based UI Architecture | ✅ PASS     | Changes to single component SoraAddTransactionView.vue     |
| V. Offline-First User Experience    | ✅ PASS     | Locale files are bundled with application                  |

**Gate Evaluation:**

- ✅ No architecture violations
- ✅ Type safety maintained with vue-i18n types
- ✅ Single component modification scope is appropriate
- ✅ All changes local-first, no external dependencies

**Gate Status: PASSED** - Proceed to Phase 0 research.

## Project Structure

### Documentation (this feature)

```text
specs/001-localize-transaction-form/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── contracts/           # Phase 1 output (/speckit.plan command)
```

### Source Code (repository root)

```
src/renderer/src/
├── views/transactions/
│   └── SoraAddTransactionView.vue    # PRIMARY FILE TO MODIFY
├── locales/
│   ├── index.ts                       # i18n configuration
│   ├── vi.json                        # Vietnamese translations (existing)
│   └── en.json                        # English translations (existing)
├── stores/
│   └── transactionForm.ts             # State management
└── assets/scss/
    └── _variables.scss               # CSS variables (unused in i18n)
```

**Structure Decision**:

- **Single Component Modification**: Only `SoraAddTransactionView.vue` needs changes for this feature
- **Locale Files**: Already exist at `src/renderer/src/locales/` with vi.json and en.json
- **i18n Configuration**: Already configured at `src/renderer/src/locales/index.ts`
- **No New Files Required**: Feature uses existing i18n infrastructure

### Files to Modify

1. **SoraAddTransactionView.vue** (src/renderer/src/views/transactions/SoraAddTransactionView.vue)
   - Replace hardcoded English text with vue-i18n translation keys
   - Update template labels, placeholders, and dialog titles
   - Update validation error messages in rules

2. **vi.json** (src/renderer/src/locales/vi.json) - Add missing translations if needed
3. **en.json** (src/renderer/src/locales/en.json) - Ensure English translations exist

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation           | Why Needed                           | Simpler Alternative Rejected Because |
| ------------------- | ------------------------------------ | ------------------------------------ |
| N/A - No violations | All changes comply with constitution | N/A                                  |

## Phase 0: Research Complete

**Status**: ✅ COMPLETED

### Research Artifacts

- `research.md` - Complete analysis of vue-i18n usage, Element Plus integration, and locale file structure

### Key Findings

1. **vue-i18n Composition API**: Use `useI18n()` hook for translation access
2. **Validation Messages**: Use `t()` function in FormRules to provide localized error messages
3. **Locale Files**: vi.json and en.json already exist and configured
4. **Element Plus**: Custom form text localized first; built-in i18n can be addressed later

### Unresolved Questions: NONE

All technical questions have been resolved through research.

## Phase 1: Design & Contracts

**Status**: ✅ COMPLETED

### Data Model Design

- **Entity**: Locale Translation strings organized by feature/component
- **Fields**: 20+ translation keys for form labels, placeholders, dialogs, and validation
- **Validation**: Vietnamese diacritics preserved; English mirrors Vietnamese structure
- **Artifacts**: `data-model.md` created

### Interface Contracts

- **Internal**: vue-i18n translation keys follow dot notation pattern
- **Component Contract**: `SoraAddTransactionView.vue` uses `$t()` or `t()` for all text
- **Artifacts**: No external contracts needed (pure internal localization)

### Agent Context Update

- ✅ Updated CLAUDE.md with current technology stack
- ✅ Added vue-i18n and localization context

### Generated Artifacts

- ✅ `research.md` - Phase 0 research findings
- ✅ `data-model.md` - Locale translation data model
- ✅ `quickstart.md` - Implementation guide

### Post-Design Constitution Check

| Principle                        | Status  | Details                                |
| -------------------------------- | ------- | -------------------------------------- |
| I. Local-First Architecture      | ✅ PASS | Locale files remain local              |
| II. Type-Safe Development        | ✅ PASS | vue-i18n provides TypeScript support   |
| III. Data Integrity & Validation | ✅ PASS | Validation messages properly localized |
| IV. Component-Based UI           | ✅ PASS | Single component modification          |
| V. Offline-First UX              | ✅ PASS | All translations bundled               |

**Gate Status: PASSED** - Ready for implementation.

## Next Steps (Phase 2: Implementation)

1. Update `vi.json` with transaction form translations
2. Update `en.json` with transaction form translations
3. Modify `SoraAddTransactionView.vue`:
   - Import `useI18n`
   - Update template with `$t()` calls
   - Update validation rules with `t()` calls
4. Test Vietnamese locale
5. Test English locale fallback
6. Verify validation messages display correctly
