# Quickstart: Localize Transaction Form

## Prerequisites

- Node.js installed (version 18+ recommended)
- Repository cloned locally
- Dependencies installed (`npm install`)

## Setup Steps

1. **Navigate to project directory**

   ```bash
   cd C:\DBHuan\sora-piggy
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

## Implementation Steps

### Step 1: Update Vietnamese Locale (vi.json)

Add transaction form translations to `src/renderer/src/locales/vi.json`:

```json
{
  "transactionForm": {
    "title": "Thêm giao dịch",
    "labels": {
      "name": "Tên khoản thu/chi",
      "description": "Mô tả/Nội dung khoản thu/chi",
      "time": "Thời gian",
      "amount": "Số tiền",
      "category": "Danh mục",
      "account": "Tài khoản"
    },
    "placeholders": {
      "name": "Nhập tên khoản thu/chi",
      "description": "Nhập mô tả/nội dung khoản thu/chi",
      "category": "Tìm hoặc thêm danh mục",
      "account": "Tìm hoặc thêm tài khoản"
    },
    "dialogs": {
      "addCategory": "Thêm danh mục",
      "addAccount": "Thêm tài khoản"
    },
    "categoryName": "Tên danh mục",
    "accountName": "Tên tài khoản",
    "validation": {
      "nameRequired": "Vui lòng nhập tên khoản thu/chi",
      "amountRequired": "Vui lòng nhập số tiền",
      "categoryRequired": "Vui lòng chọn danh mục",
      "accountRequired": "Vui lòng chọn tài khoản"
    }
  }
}
```

### Step 2: Update English Locale (en.json)

Add matching transaction form translations to `src/renderer/src/locales/en.json`:

```json
{
  "transactionForm": {
    "title": "Add Transaction",
    "labels": {
      "name": "Transaction Name",
      "description": "Description",
      "time": "Date & Time",
      "amount": "Amount",
      "category": "Category",
      "account": "Account"
    },
    "placeholders": {
      "name": "Enter transaction name",
      "description": "Enter transaction description",
      "category": "Search or add category",
      "account": "Search or add account"
    },
    "dialogs": {
      "addCategory": "Add Category",
      "addAccount": "Add Account"
    },
    "categoryName": "Category Name",
    "accountName": "Account Name",
    "validation": {
      "nameRequired": "Please enter transaction name",
      "amountRequired": "Please enter amount",
      "categoryRequired": "Please select category",
      "accountRequired": "Please select account"
    }
  }
}
```

### Step 3: Update SoraAddTransactionView.vue

Modify `src/renderer/src/views/transactions/SoraAddTransactionView.vue`:

1. **Import useI18n**:

   ```typescript
   import { useI18n } from 'vue-i18n';
   ```

2. **Setup i18n in script**:

   ```typescript
   const { t } = useI18n();
   ```

3. **Update template labels and placeholders**:

   ```vue
   <template>
     <ElCard>
       <template #header>
         <div>{{ $t('transactionForm.title') }}</div>
       </template>

       <ElFormItem :label="$t('transactionForm.labels.name')" prop="name">
         <ElInput v-model="formValue.name" :placeholder="$t('transactionForm.placeholders.name')" />
       </ElFormItem>

       <!-- Repeat for other fields... -->
     </ElCard>
   </template>
   ```

4. **Update validation rules**:
   ```typescript
   const rules: FormRules = {
     name: [
       {
         required: true,
         message: t('transactionForm.validation.nameRequired'),
         trigger: ['blur', 'change']
       }
     ],
     amount: [
       {
         required: true,
         message: t('transactionForm.validation.amountRequired'),
         trigger: ['blur', 'change']
       }
     ],
     category: [
       {
         required: true,
         message: t('transactionForm.validation.categoryRequired'),
         trigger: ['change']
       }
     ],
     account: [
       {
         required: true,
         message: t('transactionForm.validation.accountRequired'),
         trigger: ['change']
       }
     ]
   };
   ```

## Verification

1. **Start the application**:

   ```bash
   npm run dev
   ```

2. **Navigate to Add Transaction page**

3. **Verify Vietnamese text displays**:
   - Page title shows "Thêm giao dịch"
   - All labels show Vietnamese text
   - All placeholders show Vietnamese text
   - Dialog titles show Vietnamese text

4. **Test validation messages**:
   - Submit form without required fields
   - Verify error messages appear in Vietnamese

## Testing

### Manual Testing Checklist

- [ ] Page title displays in Vietnamese
- [ ] All field labels display in Vietnamese
- [ ] All placeholders display in Vietnamese
- [ ] Dialog titles display in Vietnamese
- [ ] Validation errors display in Vietnamese
- [ ] Form submission works with localized validation

### Edge Cases to Test

- [ ] Switch language (if UI exists) and verify text updates
- [ ] Special Vietnamese characters (accents, diacritics) display correctly
- [ ] Form works correctly in both Vietnamese and English modes
