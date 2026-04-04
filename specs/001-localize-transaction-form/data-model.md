# Data Model: Localization for Transaction Form

## Entity: Locale Translation

### Entity Description

Translation strings for UI text organized by feature/component. Used by vue-i18n to display localized text in the application.

### Fields

| Field                                         | Type   | Description                          | Constraints |
| --------------------------------------------- | ------ | ------------------------------------ | ----------- |
| `transactionForm.title`                       | string | Page/card title for transaction form | Required    |
| `transactionForm.labels.name`                 | string | Transaction name field label         | Required    |
| `transactionForm.labels.description`          | string | Description field label              | Required    |
| `transactionForm.labels.time`                 | string | Date/time field label                | Required    |
| `transactionForm.labels.amount`               | string | Amount field label                   | Required    |
| `transactionForm.labels.category`             | string | Category field label                 | Required    |
| `transactionForm.labels.account`              | string | Account field label                  | Required    |
| `transactionForm.placeholders.name`           | string | Transaction name placeholder         | Required    |
| `transactionForm.placeholders.description`    | string | Description placeholder              | Required    |
| `transactionForm.placeholders.category`       | string | Category autocomplete placeholder    | Required    |
| `transactionForm.placeholders.account`        | string | Account autocomplete placeholder     | Required    |
| `transactionForm.dialogs.addCategory`         | string | Add category dialog title            | Required    |
| `transactionForm.dialogs.addAccount`          | string | Add account dialog title             | Required    |
| `transactionForm.categoryName`                | string | Category name label in dialog        | Required    |
| `transactionForm.accountName`                 | string | Account name label in dialog         | Required    |
| `transactionForm.validation.nameRequired`     | string | Error when name is empty             | Required    |
| `transactionForm.validation.amountRequired`   | string | Error when amount is empty           | Required    |
| `transactionForm.validation.categoryRequired` | string | Error when category is not selected  | Required    |
| `transactionForm.validation.accountRequired`  | string | Error when account is not selected   | Required    |

### State Transitions

N/A - This is static translation data, not stateful entity

### Relationships

- One-to-many: Locale file contains multiple translation keys
- No foreign keys or database relationships

## Validation Rules

### Vietnamese (vi.json) Requirements

- All string values MUST be in Vietnamese with proper diacritics
- Page title: "Thêm giao dịch"
- Field labels use appropriate Vietnamese terminology
- Validation messages in natural Vietnamese

### English (en.json) Requirements

- All string values MUST be in English
- Must mirror Vietnamese structure for all keys
- Fallback locale for when Vietnamese is unavailable

## Sample Data Structure

### vi.json (Vietnamese)

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

### en.json (English)

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
