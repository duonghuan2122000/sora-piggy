# Implementation Plan: Language Switching Feature

**Branch**: `002-language-switcher` | **Date**: 2026-04-04 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-language-switcher/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add a language selector combobox to the TopNav that allows users to switch between Vietnamese and English interfaces. The selector loads available languages from the database and persists user preferences using SQLite storage. Default language is Vietnamese, with graceful error handling for database failures.

**Technical Approach**: 
- Add `languages` and `user_preferences` tables to SQLite
- Implement IPC handlers for language CRUD operations
- Create Vue component for language selector
- Use Pinia store for reactive state management
- Follow existing Electron + Vue + TypeScript patterns

---

## Technical Context

**Language/Version**: TypeScript 5.x, Vue 3.4+, Element Plus 2.x
**Primary Dependencies**: Pinia (state), better-sqlite3 (database), Electron 27+
**Storage**: SQLite via better-sqlite3 (local-first, stored in userData directory)
**Testing**: Manual testing + future Vitest integration
**Target Platform**: Desktop application (Windows, macOS, Linux via Electron)
**Project Type**: desktop-app (Electron + Vue + SQLite)
**Performance Goals**: Language switch completes within 1 second, UI updates immediately
**Constraints**: Offline-capable, local-first storage, TypeScript type safety required
**Scale/Scope**: Single-user desktop application, 2-5 languages supported

---

## Constitution Check

### Gate 1: Local-First Architecture (NON-NEGOTIABLE)

✅ **PASS**: All data stored locally in SQLite database
- Languages table: static data seeded on init
- User preferences: stored in user_preferences table
- No cloud sync required for core functionality

### Gate 2: Type-Safe Development (NON-NEGOTIABLE)

✅ **PASS**: All code written in TypeScript
- Language entity has TypeScript interface
- IPC handlers have proper type definitions
- Pinia store uses typed state and actions

### Gate 3: Data Integrity & Validation

✅ **PASS**: Multi-layer validation
- Client-side: Vue component validation
- Database: UNIQUE constraints on language code and preference pairs
- Schema: Proper field types and constraints

### Gate 4: Component-Based UI Architecture

✅ **PASS**: Vue 3 Composition API + Pinia
- LanguageSelector component with scoped styles
- Pinia store for language state management
- Element Plus components for UI

### Gate 5: Offline-First User Experience

✅ **PASS**: Fully functional offline
- Language data stored locally in SQLite
- Fallback to hardcoded languages on DB failure
- No network connectivity required

**All gates passed** - No violations to justify

---

## Project Structure

### Documentation (this feature)

```text
specs/002-language-switcher/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output - technology decisions
├── data-model.md        # Phase 1 output - entities and schema
├── quickstart.md        # Phase 1 output - implementation guide
├── checklists/
│   └── requirements.md  # Specification quality checklist
└── spec.md              # Feature specification
```

### Source Code Structure (Electron + Vue App)

```text
src/
├── main/
│   ├── index.ts              # IPC handlers for language operations
│   └── database.ts           # SQLite CRUD for languages, user_preferences
├── preload/
│   └── index.ts              # Expose language APIs to renderer
└── renderer/
    └── src/
        ├── stores/
        │   └── language.ts   # Pinia store for language state
        ├── components/
        │   └── LanguageSelector.vue  # Language dropdown component
        ├── layouts/
        │   └── TopNav.vue    # Updated with language selector
        ├── types/
        │   └── language.ts   # TypeScript interfaces
        └── locales/
            ├── vi.json       # Vietnamese translations (existing)
            └── en.json       # English translations (existing)
```

**Structure Decision**: This is an Electron desktop application with Vue frontend. The feature adds to the existing structure without changing the overall architecture. IPC handlers go in main process, UI components in renderer, and state management in Pinia stores.

---

## Implementation Phases

### Phase 0: Research & Decisions (Complete)

**Research completed in [research.md](research.md)**:
- Database schema design for language preferences
- IPC communication patterns
- Vue component structure
- Pinia store implementation
- Error handling strategy
- Default language behavior

**Key Decisions**:
1. Add `languages` and `user_preferences` tables to SQLite
2. Use existing IPC pattern from database.ts
3. Create reusable LanguageSelector component
4. Use Pinia for reactive state management
5. Graceful fallback on database errors

### Phase 1: Design & Contracts

#### Data Model (Complete)

See [data-model.md](data-model.md) for full details:

**Entities**:
- `Language`: id, code, name, nameEn
- `UserPreference`: id, userId, preferenceKey, preferenceValue, createdAt, updatedAt

**Database Schema**:
- `languages` table with UNIQUE constraint on code
- `user_preferences` table with UNIQUE constraint on (userId, preferenceKey)

#### Interface Contracts

**IPC Contracts** (main ↔ renderer):

1. `getLanguages()` → `Language[]`
   - Returns all available languages from database
   
2. `getLanguagePreference(userId: string)` → `string`
   - Returns user's selected language code (or "vi" default)
   
3. `setLanguagePreference(userId: string, language: string)` → `boolean`
   - Saves user's language selection
   - Returns success status

**UI Contracts** (component ↔ store):

1. LanguageSelector emits `language-changed` event
2. Pinia store provides reactive `currentLanguage` state
3. TopNav component calls `loadLanguages()` on mount

#### Quickstart Guide

See [quickstart.md](quickstart.md) for implementation steps:
1. Database migration
2. Main process IPC handlers
3. Preload script update
4. Pinia store creation
5. LanguageSelector component
6. TopNav integration
7. Testing checklist

### Phase 2: Task Generation (Deferred)

**Not created by /speckit.plan** - Use `/speckit.tasks` command to generate detailed tasks.

---

## Complexity Tracking

No violations detected in Constitution Check. All requirements align with existing patterns and constraints.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| N/A | N/A | N/A |

---

## Implementation Checklist

### Database Layer
- [ ] Add `languages` table to database schema
- [ ] Add `user_preferences` table to database schema
- [ ] Seed initial language data (vi, en)
- [ ] Implement CRUD operations in database.ts

### Main Process (Electron)
- [ ] Add `getLanguages` IPC handler
- [ ] Add `getLanguagePreference` IPC handler
- [ ] Add `setLanguagePreference` IPC handler
- [ ] Register handlers in main/index.ts

### Preload Script
- [ ] Expose language APIs via contextBridge
- [ ] Add TypeScript type definitions

### Renderer (Vue)
- [ ] Create Pinia language store
- [ ] Create LanguageSelector component
- [ ] Update TopNav to include selector
- [ ] Connect to i18n system

### Testing
- [ ] Manual UI testing
- [ ] TypeScript type checking
- [ ] ESLint validation
- [ ] Code formatting with Prettier

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Database migration fails | Low | Medium | Use transactions, provide rollback script |
| Type safety violations | Low | High | Run `npm run typecheck` before commit |
| UI not updating reactively | Medium | Medium | Use Pinia computed properties, test reactivity |
| Default language not working | Low | High | Test fresh install scenario |
| Error handling gaps | Medium | Medium | Comprehensive edge case testing |

---

## Next Steps

1. **Immediate**: Review this plan and confirm approach
2. **Then**: Use `/speckit.tasks` to generate detailed implementation tasks
3. **Implementation**: Follow quickstart.md guide
4. **Testing**: Execute test checklist
5. **Review**: Run typecheck, lint, and format before commit
