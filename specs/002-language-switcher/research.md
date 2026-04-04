# Research: Language Switching Feature

## Decision 1: Database Schema for Language Preferences

**Decision**: Add a `user_preferences` table to store language settings with user/device identifier

**Rationale**: 
- Aligns with local-first architecture (Constitution §I)
- Uses existing SQLite infrastructure
- Allows per-user preference isolation on shared machines
- Non-sensitive data (language code only) doesn't require encryption

**Alternatives considered**:
- Store in localStorage: Not consistent with SQLite-based local-first approach
- Store in existing transactions table: Would violate single-responsibility principle
- Hardcode in config file: Not flexible for dynamic language list

---

## Decision 2: IPC Communication Pattern for Language Selection

**Decision**: Use existing IPC pattern from database.ts with new handlers

**Rationale**:
- Follows established pattern in codebase (Constitution §Development Workflow)
- Maintains type safety through TypeScript interfaces
- Keeps main process handling database operations
- Renderer remains reactive via Pinia store

**Implementation approach**:
- Add `getLanguages()` IPC handler
- Add `getLanguagePreference()` IPC handler
- Add `setLanguagePreference()` IPC handler
- Use existing database.ts CRUD patterns

---

## Decision 3: Vue Component for Language Selector

**Decision**: Create reusable `LanguageSelector` component in TopNav

**Rationale**:
- Follows component-based architecture (Constitution §IV)
- Allows for potential reuse in other parts of UI
- Maintains separation of concerns
- Element Plus Select component fits requirements

**Structure**:
- Component in `src/renderer/src/components/LanguageSelector.vue`
- Uses Element Plus `el-select` with `el-option`
- Connected to Pinia store for state management
- Emits change event for immediate UI update

---

## Decision 4: Pinia Store for Language State

**Decision**: Create or extend existing Pinia store for language preferences

**Rationale**:
- Centralizes language state management (Constitution §IV)
- Enables reactive updates across components
- Separates UI state from database operations
- Follows existing Pinia patterns in codebase

**Store structure**:
- `languageStore` with:
  - `languages`: array of available languages
  - `currentLanguage`: currently selected language
  - `isLoading`: loading state indicator
  - Actions: `loadLanguages()`, `setLanguage()`, `loadPreference()`

---

## Decision 5: Error Handling Strategy

**Decision**: Graceful fallback with subtle error indicator

**Rationale**:
- Ensures app remains usable even if database fails
- User is informed without being blocked
- Aligns with offline-first user experience (Constitution §V)
- Non-intrusive error reporting

**Implementation**:
- Try-catch around database operations
- Fallback to hardcoded Vietnamese/English list
- Console log for debugging
- Optional tooltip for user awareness

---

## Decision 6: Default Language Behavior

**Decision**: Vietnamese (vi) as default when no preference exists

**Rationale**:
- Matches original feature requirement
- Appropriate for Vietnamese user base
- Consistent with localization setup already in app

---

## Technology Stack Confirmed

- **Language**: TypeScript (Constitution §II - NON-NEGOTIABLE)
- **UI Framework**: Vue 3 + Composition API + Element Plus
- **State Management**: Pinia stores
- **Database**: SQLite via better-sqlite3 (local-first)
- **Styling**: SCSS with CSS variables
- **IPC**: Electron contextBridge pattern
