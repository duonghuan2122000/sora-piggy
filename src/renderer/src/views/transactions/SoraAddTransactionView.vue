<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import {
  ElCard,
  ElForm,
  ElFormItem,
  ElInput,
  ElDatePicker,
  ElInputNumber,
  ElAutocomplete,
  ElDialog,
  ElButton
} from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { useTransactionFormStore } from '@renderer/stores/transactionForm';

interface CategoryOption {
  value: string;
  label?: string;
  class?: string;
  isAdd?: boolean;
}

interface AccountOption {
  value: string;
  label?: string;
  class?: string;
  isAdd?: boolean;
}

const formRef = ref<FormInstance | null>(null);
const formValue = ref({
  name: '',
  description: '',
  time: null,
  amount: 0,
  category: null as string | null,
  account: null as string | null
});

const rules: FormRules = {
  name: [{ required: true, message: 'Please enter transaction name', trigger: ['blur', 'change'] }],
  amount: [{ required: true, message: 'Please enter amount', trigger: ['blur', 'change'] }],
  category: [{ required: true, message: 'Please select category', trigger: ['change'] }],
  account: [{ required: true, message: 'Please select account', trigger: ['change'] }]
};

// Category state
const categoryOptions = ref<CategoryOption[]>([]);
const categorySearchValue = ref('');
const isLoadingCategories = ref(false);

// Account state
const accountOptions = ref<AccountOption[]>([]);
const accountSearchValue = ref('');
const isLoadingAccounts = ref(false);

// Add Category Modal state
const showCategoryModal = ref(false);
const newCategoryName = ref('');
const modalOpenedAt = ref(0);

// Add Account Modal state
const showAccountModal = ref(false);
const newAccountName = ref('');
const accountModalOpenedAt = ref(0);

// Load categories from database
const loadCategories = async (): Promise<void> => {
  isLoadingCategories.value = true;
  try {
    const categories = await window.api.getCategories();
    // Convert database rows to select options
    categoryOptions.value = categories.map((cat: { name: string }) => ({
      value: cat.name
    }));
  } catch (error) {
    console.error('Failed to load categories:', error);
  } finally {
    isLoadingCategories.value = false;
  }
};

// Load accounts from database
const loadAccounts = async (): Promise<void> => {
  isLoadingAccounts.value = true;
  try {
    const accounts = await window.api.getAccounts();
    // Convert database rows to select options
    accountOptions.value = accounts.map((acc: { name: string }) => ({
      value: acc.name
    }));
  } catch (error) {
    console.error('Failed to load accounts:', error);
  } finally {
    isLoadingAccounts.value = false;
  }
};

// Check if the typed account already exists
const isAccountNew = computed(() => {
  if (!accountSearchValue.value) return false;
  const search = accountSearchValue.value.toLowerCase();
  return !accountOptions.value.some((option) => option.value?.toString().toLowerCase() === search);
});

// Fetch account suggestions for ElAutocomplete
const queryAccountSearch = (queryString: string, cb: (options: AccountOption[]) => void): void => {
  let results = accountOptions.value;

  if (queryString) {
    results = accountOptions.value.filter((option) =>
      option.value?.toString().toLowerCase().includes(queryString.toLowerCase())
    );
  }

  // Add "Add Account" option at the bottom if the typed text is new
  if (isAccountNew.value && accountSearchValue.value.trim()) {
    const accountName = accountSearchValue.value.trim();
    results = [
      ...results,
      {
        value: `Add Account "${accountName}"`,
        label: accountName, // Store the actual account name separately
        isAdd: true
      }
    ];
  }

  cb(results);
};

// Handle account selection
const handleAccountSelect = (item: Record<string, unknown>): void => {
  // Prevent processing if modal is already open
  if (showAccountModal.value) return;

  const itemValue = item.value as string;

  if ((item as { isAdd?: boolean }).isAdd) {
    // Use the label property which contains the actual account name
    const accountName = (item as { label?: string }).label || accountSearchValue.value.trim();

    // Open modal with pre-filled account name
    newAccountName.value = accountName;
    showAccountModal.value = true;
    accountModalOpenedAt.value = Date.now(); // Record timestamp when modal opens
    return;
  }

  // Normal account selection - update form value and search field
  formValue.value.account = itemValue;
  accountSearchValue.value = itemValue;
};

// Save account from modal
const saveAccountFromModal = async (): Promise<void> => {
  // Ignore calls that happen too soon after modal opens (prevents auto-save from Enter key)
  if (Date.now() - accountModalOpenedAt.value < 100) return;

  if (!newAccountName.value.trim()) return;

  const accountName = newAccountName.value.trim();
  try {
    await window.api.createAccount({
      name: accountName,
      type: 'general' // Default type
    });

    // Refresh accounts list
    await loadAccounts();

    // Select the newly added account
    formValue.value.account = accountName;
    accountSearchValue.value = '';

    // Close modal
    showAccountModal.value = false;
    newAccountName.value = '';
  } catch (error) {
    console.error('Failed to add account:', error);
  }
};

// Clear account modal state when closed
watch(showAccountModal, (isOpen) => {
  if (!isOpen) {
    newAccountName.value = '';
  }
});

// Check if the typed category already exists
const isNewCategory = computed(() => {
  if (!categorySearchValue.value) return false;
  const search = categorySearchValue.value.toLowerCase();
  return !categoryOptions.value.some((option) => option.value?.toString().toLowerCase() === search);
});

// Fetch suggestions for ElAutocomplete
const querySearch = (queryString: string, cb: (options: CategoryOption[]) => void): void => {
  let results = categoryOptions.value;

  if (queryString) {
    results = categoryOptions.value.filter((option) =>
      option.value?.toString().toLowerCase().includes(queryString.toLowerCase())
    );
  }

  // Add "Add Category" option at the bottom if the typed text is new
  if (isNewCategory.value && categorySearchValue.value.trim()) {
    const categoryName = categorySearchValue.value.trim();
    results = [
      ...results,
      {
        value: `Add Category "${categoryName}"`,
        label: categoryName, // Store the actual category name separately
        isAdd: true
      }
    ];
  }

  cb(results);
};

// Handle category selection
const handleCategorySelect = (item: Record<string, unknown>): void => {
  // Prevent processing if modal is already open
  if (showCategoryModal.value) return;

  if ((item as { isAdd?: boolean }).isAdd) {
    // Use the label property which contains the actual category name
    const categoryName = (item as { label?: string }).label || categorySearchValue.value.trim();

    // Open modal with pre-filled category name
    newCategoryName.value = categoryName;
    showCategoryModal.value = true;
    modalOpenedAt.value = Date.now(); // Record timestamp when modal opens
    return;
  }

  formValue.value.category = item.value as string;
  categorySearchValue.value = item.value as string;
};

// Save category from modal
const saveCategoryFromModal = async (): Promise<void> => {
  // Ignore calls that happen too soon after modal opens (prevents auto-save from Enter key)
  if (Date.now() - modalOpenedAt.value < 100) return;

  if (!newCategoryName.value.trim()) return;

  const categoryName = newCategoryName.value.trim();
  try {
    await window.api.createCategory({
      name: categoryName,
      type: 'expense' // Default type, can be made configurable
    });

    // Refresh categories list
    await loadCategories();

    // Select the newly added category
    formValue.value.category = categoryName;
    categorySearchValue.value = '';

    // Close modal
    showCategoryModal.value = false;
    newCategoryName.value = '';
  } catch (error) {
    console.error('Failed to add category:', error);
  }
};

// Handle category focus
const handleCategoryFocus = (): void => {
  // Ensure dropdown opens when focused
};

// Clear modal state when closed
watch(showCategoryModal, (isOpen) => {
  if (!isOpen) {
    newCategoryName.value = '';
  }
});

const transactionFormStore = useTransactionFormStore();

const handleSubmit = (): void => {
  formRef.value?.validate((valid) => {
    if (valid) {
      transactionFormStore.addTransaction({
        name: formValue.value.name,
        description: formValue.value.description,
        time: formValue.value.time,
        amount: formValue.value.amount,
        category: formValue.value.category,
        account: formValue.value.account
      });
      // Optionally reset form after submission
      // formValue.value = { ...initialValues };
    }
  });
};

// Watch for trigger from TopNav
watch(
  () => transactionFormStore.submitCount,
  () => {
    handleSubmit();
  }
);

// Load categories and accounts on mount
onMounted(() => {
  loadCategories();
  loadAccounts();
});
</script>

<template>
  <div class="sora-add-transaction-view">
    <ElCard class="sora-card">
      <template #header>
        <div>Add Transaction</div>
      </template>
      <ElForm ref="formRef" :model="formValue" :rules="rules" label-position="top">
        <ElFormItem label="Transaction Name" prop="name">
          <ElInput v-model="formValue.name" placeholder="Enter transaction name" />
        </ElFormItem>

        <ElFormItem label="Description" prop="description">
          <ElInput
            v-model="formValue.description"
            type="textarea"
            placeholder="Enter transaction description"
            :rows="3"
          />
        </ElFormItem>

        <ElFormItem label="Date & Time" prop="time">
          <ElDatePicker v-model="formValue.time" type="datetime" clearable />
        </ElFormItem>

        <ElFormItem label="Amount" prop="amount">
          <ElInputNumber v-model="formValue.amount" :min="0" placeholder="0.00" />
        </ElFormItem>

        <ElFormItem label="Category" prop="category">
          <ElAutocomplete
            v-model="categorySearchValue"
            :fetch-suggestions="querySearch"
            placeholder="Search or add category"
            clearable
            @select="handleCategorySelect"
            @focus="handleCategoryFocus"
          >
            <template #default="{ item }">
              <div :class="{ 'category-add-option': item.isAdd }">
                {{ item.value }}
              </div>
            </template>
          </ElAutocomplete>
        </ElFormItem>

        <ElFormItem label="Account" prop="account">
          <ElAutocomplete
            v-model="accountSearchValue"
            :fetch-suggestions="queryAccountSearch"
            placeholder="Search or add account"
            clearable
            @select="handleAccountSelect"
          >
            <template #default="{ item }">
              <div :class="{ 'account-add-option': item.isAdd }">
                {{ item.value }}
              </div>
            </template>
          </ElAutocomplete>
        </ElFormItem>
      </ElForm>
    </ElCard>

    <!-- Add Category Modal -->
    <ElDialog v-model="showCategoryModal" title="Add Category" width="400px">
      <ElForm>
        <ElFormItem label="Category Name">
          <ElInput
            v-model="newCategoryName"
            placeholder="Enter category name"
            @keyup.enter="saveCategoryFromModal"
            @keydown.enter.prevent
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 8px">
          <ElButton @click="showCategoryModal = false">Cancel</ElButton>
          <ElButton type="primary" @click="saveCategoryFromModal">Save</ElButton>
        </div>
      </template>
    </ElDialog>

    <!-- Add Account Modal -->
    <ElDialog v-model="showAccountModal" title="Add Account" width="400px">
      <ElForm>
        <ElFormItem label="Account Name">
          <ElInput
            v-model="newAccountName"
            placeholder="Enter account name"
            @keyup.enter="saveAccountFromModal"
            @keydown.enter.prevent
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 8px">
          <ElButton @click="showAccountModal = false">Cancel</ElButton>
          <ElButton type="primary" @click="saveAccountFromModal">Save</ElButton>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
.sora-add-transaction-view {
  padding: $spacing-md;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sora-card {
  width: 100%;
  margin: 0 auto;
  background-color: #fff;
  border-radius: $radius-md;
  flex: 1;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-autocomplete-suggestion__list) {
  li.category-add-option {
    color: #1890ff;
    font-style: italic;
    border-top: 1px solid #e0e0e0;

    &:hover {
      background-color: #f0f7ff !important;
    }
  }

  li.account-add-option {
    color: #1890ff;
    font-style: italic;
    border-top: 1px solid #e0e0e0;

    &:hover {
      background-color: #f0f7ff !important;
    }
  }
}
</style>
