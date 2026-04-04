---
description: 'Task list for language switching feature implementation'
---

# Tasks: Language Switching Feature

**Input**: Design documents from `/specs/002-language-switcher/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Tests are OPTIONAL - not explicitly requested in feature specification

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Electron + Vue App**: `src/main/`, `src/preload/`, `src/renderer/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 [P] Review implementation plan and confirm approach with team
- [ ] T002 [P] Set up development environment (ensure npm packages installed)
- [ ] T003 [P] Verify existing i18n setup for Vietnamese and English translations

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database Layer

- [x] T004 Add `languages` table schema to `src/main/database.ts`
  - Fields: id, code (UNIQUE), name, nameEn
  - Create table on app initialization

- [x] T005 Add `user_preferences` table schema to `src/main/database.ts`
  - Fields: id, userId, preferenceKey, preferenceValue, createdAt, updatedAt
  - UNIQUE constraint on (userId, preferenceKey)

- [x] T006 [P] Seed initial language data in database initialization
  - Insert Vietnamese (vi) and English (en) records

### Main Process IPC Handlers

- [x] T007 Add `getLanguages()` IPC handler in `src/main/index.ts`
  - Returns array of Language objects from database

- [x] T008 Add `getLanguagePreference(userId)` IPC handler in `src/main/index.ts`
  - Returns user's language preference or "vi" default

- [x] T009 Add `setLanguagePreference(userId, language)` IPC handler in `src/main/index.ts`
  - Upserts preference record with current timestamp

### Preload Script

- [x] T010 Expose language APIs in `src/preload/index.ts`
  - Add `getLanguages()`, `getLanguagePreference()`, `setLanguagePreference()` methods
  - Add TypeScript type definitions for all methods

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Select Language from TopNav (Priority: P1) 🎯 MVP

**Goal**: User can open language selector in TopNav, see available languages, and switch interface language

**Independent Test**: Navigate to TopNav, click language selector, select different language, verify interface updates immediately

### Implementation for User Story 1

- [x] T011 [P] [US1] Create TypeScript interface for Language in `src/renderer/src/types/language.ts`
  - Define Language interface with code, name, nameEn properties

- [x] T012 [P] [US1] Create Pinia language store in `src/renderer/src/stores/language.ts`
  - State: languages array, currentLanguage string, isLoading boolean
  - Actions: loadLanguages(), loadPreference(), setLanguage()

- [x] T013 [P] [US1] Create LanguageSelector component in `src/renderer/src/components/LanguageSelector.vue`
  - Use Element Plus `el-select` component
  - Populate options from languageStore.languages
  - Emit `language-changed` event on selection
  - Position: top-right corner of TopNav

- [x] T014 [US1] Update TopNav layout in `src/renderer/src/layouts/TopNav.vue`
  - Import LanguageSelector component
  - Import languageStore
  - Position selector in top-right area
  - Call `languageStore.loadLanguages()` on mount
  - Call `languageStore.loadPreference()` on mount

- [x] T015 [US1] Connect language store to i18n system
  - Update i18n locale when language changes
  - Ensure UI text updates reactively

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Default Vietnamese Language (Priority: P2)

**Goal**: Application displays Vietnamese by default when no language preference is saved

**Independent Test**: Clear language preferences, restart app, verify Vietnamese interface displays

### Implementation for User Story 2

- [x] T016 [US2] Implement default language fallback in language store
  - Return "vi" when no preference found in database
  - Store default in Pinia state

- [x] T017 [US2] Update TopNav to handle default language on fresh install
  - Ensure language selector shows Vietnamese as default selection

- [ ] T018 [US2] Test default language behavior
  - Verify Vietnamese displays on first app launch
  - Verify Vietnamese displays after clearing preferences

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Language List from Database (Priority: P3)

**Goal**: Language selector loads available languages from database, not hardcoded

**Independent Test**: Verify language list matches database records, add/remove language in DB and verify selector updates

### Implementation for User Story 3

- [x] T019 [P] [US3] Implement database query for getLanguages() in `src/main/database.ts`
  - Query: `SELECT * FROM languages ORDER BY code`
  - Return array of language objects

- [x] T020 [P] [US3] Add database initialization logic to create tables on first run
  - Check if tables exist, create if not
  - Seed language data if empty

- [ ] T021 [US3] Test language list from database
  - Verify selector shows languages from DB
  - Add new language record to DB, restart app, verify it appears
  - Remove language record from DB, restart app, verify it disappears

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T022 [P] Add error handling for database failures
  - Wrap database calls in try-catch
  - Fallback to hardcoded Vietnamese/English list
  - Log errors to console for debugging

- [x] T023 [P] Add graceful error indicator for database issues
  - Subtle tooltip or console log when DB unavailable
  - Ensure app remains usable with default language

- [x] T024 [P] Run TypeScript type checking
  - Execute `npm run typecheck` to verify types

- [x] T025 [P] Run ESLint validation
  - Execute `npm run lint` to verify code style

- [x] T026 [P] Run Prettier formatting
  - Execute `npm run format` to format code

- [x] T027 [P] Update documentation
  - Add any new constants or types to appropriate files
  - Document any configuration changes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on User Story 1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent functionality

### Within Each User Story

- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all models for User Story 1 together:
Task: "Create Language interface in src/renderer/src/types/language.ts"
Task: "Create Pinia language store in src/renderer/src/stores/language.ts"

# Launch component and layout together:
Task: "Create LanguageSelector component in src/renderer/src/components/LanguageSelector.vue"
Task: "Update TopNav layout in src/renderer/src/layouts/TopNav.vue"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (language selector UI)
   - Developer B: User Story 2 (default language)
   - Developer C: User Story 3 (database integration)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
