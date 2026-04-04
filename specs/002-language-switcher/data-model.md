# Data Model: Language Switching Feature

## Entity: Language

Represents a supported interface language in the application.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | INTEGER | Yes | Primary key, auto-increment |
| `code` | TEXT | Yes | ISO language code (e.g., "vi", "en") |
| `name` | TEXT | Yes | Display name in Vietnamese (e.g., "Tiếng Việt", "Tiếng Anh") |
| `nameEn` | TEXT | No | Display name in English (e.g., "Vietnamese", "English") |

### Validation Rules

- `code` must be unique (enforced by UNIQUE constraint)
- `code` must be 2-5 characters (ISO standard)
- `name` must not be empty

### State Transitions

- Languages are read-only from database perspective
- No lifecycle management needed (static data)

---

## Entity: UserPreference

Represents user-specific settings stored in the database.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | INTEGER | Yes | Primary key, auto-increment |
| `userId` | TEXT | Yes | Device/user identifier for local-first storage |
| `preferenceKey` | TEXT | Yes | Key name (e.g., "language") |
| `preferenceValue` | TEXT | Yes | Value (e.g., "vi") |
| `createdAt` | TEXT | Yes | ISO timestamp of creation |
| `updatedAt` | TEXT | Yes | ISO timestamp of last update |

### Validation Rules

- `userId` must not be empty
- `preferenceKey` must not be empty
- `preferenceValue` must not be empty
- Unique constraint on `(userId, preferenceKey)` pair

### State Transitions

- **Create**: New preference record when user first selects language
- **Update**: Modify `preferenceValue` and `updatedAt` when language changes
- **Read**: Query by `userId` and `preferenceKey` to retrieve preference

---

## Relationships

### One-to-Many: User to Preferences

- One user (identified by `userId`) can have multiple preferences
- Each preference has a unique `preferenceKey`
- Language preference is one of many possible preferences

---

## Database Schema

### Table: languages

```sql
CREATE TABLE IF NOT EXISTS languages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  nameEn TEXT
);
```

### Table: user_preferences

```sql
CREATE TABLE IF NOT EXISTS user_preferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT NOT NULL,
  preferenceKey TEXT NOT NULL,
  preferenceValue TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  UNIQUE(userId, preferenceKey)
);
```

---

## Data Flow

### Loading Languages on Startup

1. Application starts
2. Renderer calls `window.api.getLanguages()`
3. Main process queries `SELECT * FROM languages`
4. Returns array of language objects to renderer
5. Renderer stores in Pinia `languageStore.languages`

### Loading Language Preference

1. Application starts
2. Renderer calls `window.api.getLanguagePreference(userId)`
3. Main process queries `SELECT preferenceValue FROM user_preferences WHERE userId = ? AND preferenceKey = 'language'`
4. If found: returns stored language code
5. If not found: returns default "vi"
6. Renderer stores in Pinia `languageStore.currentLanguage`

### Setting Language Preference

1. User selects language from dropdown
2. Renderer calls `window.api.setLanguagePreference(userId, languageCode)`
3. Main process upserts preference record (INSERT OR REPLACE)
4. Returns success status to renderer
5. Renderer updates Pinia store and triggers UI refresh

---

## Assumptions

- Language data will be seeded during application initialization
- Device/user identifier will be generated on first app launch
- Existing database schema migration will handle new tables
- No complex validation needed (language codes are standard ISO codes)
