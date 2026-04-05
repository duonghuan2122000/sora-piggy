# KẾ HOẠCH KỸ THUẬT: Thêm Giao Dịch Thu Chi

## 1. Architecture Overview

### 1.1 Component Interaction Flow
```
User Action (Click Button / Ctrl+S)
    ↓
SoraAddTransactionView.vue (Renderer)
    ↓
Pinia Store: transactionForm.ts (State Management)
    ↓
IPC API: window.api.createTransaction (Preload Bridge)
    ↓
Electron Main Process (src/main/index.ts)
    ↓
SQLite Database (better-sqlite3)
```

### 1.2 Key Components
- **SoraAddTransactionView.vue**: Main component handling form UI, validation, and submission
- **transactionForm.ts**: Pinia store managing form state and business logic
- **preload/index.ts**: Context bridge exposing IPC APIs
- **main/index.ts**: Electron main process handling database operations
- **database.ts**: SQLite CRUD operations

## 2. Component/File Changes Needed

### 2.1 SoraAddTransactionView.vue (src/renderer/src/views/transactions/)
**Changes required:**
1. Add loading state variable `isLoading`
2. Implement global keyboard listener for Ctrl+S
3. Add ElMessage notifications for success/error
4. Update form submission logic to handle loading state
5. Reset form after successful save
6. Update validation rule for amount (> 0 instead of min=0)

### 2.2 transactionForm.ts (src/renderer/src/stores/)
**Changes required:**
1. Add loading state management
2. Update `addTransaction` method to:
   - Return success/error status
   - Handle loading state
   - Throw errors for caller to handle notifications

### 2.3 i18n Files (src/renderer/src/locales/)
**Changes required:**
1. Add success/error message keys for transactions

## 3. Implementation Steps (Ordered)

### Step 1: Update Pinia Store (transactionForm.ts)
1. Add `isLoading` ref to store state
2. Modify `addTransaction` method to:
   - Set `isLoading = true` at start
   - Set `isLoading = false` in finally block
   - Return boolean success status
   - Throw error to caller for notification handling
3. Export loading state and reset method

### Step 2: Update SoraAddTransactionView.vue
1. Import `ElMessage` from Element Plus
2. Add `isLoading` ref for button loading state
3. Implement global keyboard listener:
   ```typescript
   onMounted(() => {
     const handleKeyPress = (event: KeyboardEvent) => {
       if ((event.ctrlKey || event.metaKey) && event.key === 's') {
         event.preventDefault();
         handleSubmit();
       }
     };
     window.addEventListener('keydown', handleKeyPress);
     onUnmounted(() => window.removeEventListener('keydown', handleKeyPress));
   });
   ```
4. Update form validation rules:
   - Add custom validator for `amount > 0`
5. Update `handleSubmit` function:
   - Set `isLoading = true`
   - Call store's `addTransaction`
   - Show ElMessage success notification
   - Reset form fields on success
   - Show ElMessage error notification on failure
   - Set `isLoading = false` in finally block
6. Bind loading state to Save button

### Step 3: Update i18n Messages
1. Add success/error messages to `en.json` and `vi.json`
   - `transactionForm.messages.success`: "Transaction saved successfully"
   - `transactionForm.messages.error`: "Failed to save transaction"

### Step 4: Update Amount Validation Rule
1. Change minimum value from 0 to 1 in ElInputNumber
2. Add custom validation rule to ensure amount > 0

## 4. Data Flow

### 4.1 Save Transaction Flow
```
1. User clicks "Lưu" or presses Ctrl+S
2. SoraAddTransactionView.handleSubmit() triggered
3. Form validation runs (Element Plus rules)
4. If valid:
   a. Set isLoading = true
   b. Call transactionFormStore.addTransaction()
   c. Store converts data to API format
   d. Store calls window.api.createTransaction()
   e. Main process receives db:addTransaction IPC
   f. Database executes INSERT INTO transactions
   g. Returns new transaction ID
   h. Store receives ID, updates local state
   i. Returns success to component
5. Component shows ElMessage success notification
6. Component resets form fields
7. Set isLoading = false
```

### 4.2 Error Handling Flow
```
1. Database operation fails (e.g., constraint violation)
2. Error propagates up through IPC chain
3. Store catches error, re-throws to component
4. Component catches error, shows ElMessage error
5. Form data is preserved (not reset)
6. isLoading set to false
```

## 5. UI/UX Considerations

### 5.1 Loading State
- **Button State**: Show spinner icon and disable button during save
- **User Feedback**: Cursor changes to wait, button shows loading indicator
- **Duration**: Should be minimal (< 500ms typically)

### 5.2 Notifications
- **Success**: Green ElMessage at top of screen, auto-dismiss after 3s
- **Error**: Red ElMessage showing specific error message, stays longer
- **Position**: Top-right corner (Element Plus default)

### 5.3 Form Reset
- **After Success**: Clear all fields (name, description, time, amount, category, account)
- **After Error**: Preserve all entered data for correction
- **Time Field**: Reset to current date/time or null

### 5.4 Keyboard Shortcut
- **Ctrl+S / Cmd+S**: Global listener works anywhere in the app
- **Context**: Should only trigger when add transaction view is active
- **Prevent Default**: Prevent browser default save behavior

### 5.5 Accessibility
- **Button States**: Disabled state clearly visible
- **Error Messages**: Associated with form fields via Element Plus validation
- **Focus Management**: Maintain focus on relevant field after errors

## 6. Edge Cases to Handle

### 6.1 Validation Edge Cases
| Case | Expected Behavior |
|------|-------------------|
| Amount = 0 | Validation error: "Amount must be greater than 0" |
| Amount < 0 | Validation error: "Amount must be positive" |
| Empty name | Validation error: "Please enter transaction name" |
| No category selected | Validation error: "Please select category" |
| No account selected | Validation error: "Please select account" |
| Time not selected | Validation error (Element Plus default) |

### 6.2 Database Edge Cases
| Case | Expected Behavior |
|------|-------------------|
| Category doesn't exist | Database constraint violation, show error |
| Account doesn't exist | Database constraint violation, show error |
| Network/IO error | Catch error, show generic error message |
| Duplicate transaction | Allow (business requirement) |

### 6.3 User Interaction Edge Cases
| Case | Expected Behavior |
|------|-------------------|
| Rapid Ctrl+S presses | Debounce or ignore subsequent calls while loading |
| Form invalid + Ctrl+S | Show validation errors, don't submit |
| Navigate away during save | Component unmounts, loading state cleans up |
| Modal open + Ctrl+S | Ignore shortcut if modal is open |

### 6.4 State Management Edge Cases
| Case | Expected Behavior |
|------|-------------------|
| Component remount | Reset loading state to false |
| Store state persists | Clear loading state on component mount |
| Concurrent saves | Prevent multiple simultaneous submissions |

## 7. Technical Requirements Summary

### 7.1 Dependencies
- **Element Plus**: ElMessage, ElButton (loading prop), ElForm
- **Pinia**: Store management
- **Vue 3**: Composition API (onMounted, onUnmounted, ref)
- **Electron**: IPC communication via context bridge

### 7.2 Type Safety
- Use existing `ITransaction` interface for API calls
- Type `window.api.createTransaction` parameters correctly
- Ensure store return types are consistent

### 7.3 Performance Considerations
- Minimal re-rendering: Use ref for loading state only
- Async operations: Properly handle promise chains
- Memory: Clean up event listeners on unmount

## 8. Testing Checklist

- [ ] Form validation works for all required fields
- [ ] Amount validation rejects 0 and negative values
- [ ] Ctrl+S triggers form submission
- [ ] Loading state shows during save
- [ ] Success notification appears after save
- [ ] Form resets after successful save
- [ ] Error notification appears on failure
- [ ] Form data preserved on error
- [ ] Multiple rapid submissions handled correctly
- [ ] Event listener cleaned up on component unmount
