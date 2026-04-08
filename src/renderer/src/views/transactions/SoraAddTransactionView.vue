<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { aCard, aForm, aFormItem, aDatePicker, aInputNumber, aSelect, aModal, aButton } from 'ant-design-vue';
import SoraInput from '@renderer/components/ui-wrappers/SoraInput.vue'
import type { FormInstance } from 'ant-design-vue';
import { useTransactionFormStore } from '@renderer/stores/transactionForm';
import { notifySuccess, notifyError } from '@renderer/utils/sora-notification'

const { t } = useI18n();

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
    },
    {
      validator: (_rule, value, callback) => {
        if (value <= 0) {
          callback(new Error(t('transactionForm.validation.amountGreaterThanZero')));
        } else {
          callback();
        }
      },
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

// Fetch account suggestions for a-select
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

// Fetch suggestions for a-select
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

const handleSubmit = async (): Promise<void> => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      transactionFormStore.setLoading(true);
      try {
        const success = await transactionFormStore.addTransaction({
          name: formValue.value.name,
          description: formValue.value.description,
          time: formValue.value.time,
          amount: formValue.value.amount,
          category: formValue.value.category,
          account: formValue.value.account
        });

        if (success) {
          notifySuccess(t('transactionForm.messages.success'));
          // Reset form after successful save
          formValue.value = {
            name: '',
            description: '',
            time: null,
            amount: 0,
            category: null,
            account: null
          };
          // Reset category and account search values
          categorySearchValue.value = '';
          accountSearchValue.value = '';
        }
      } catch (error) {
        notifyError(t('transactionForm.messages.error'));
      } finally {
        transactionFormStore.setLoading(false);
      }
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

// Global keyboard listener for Ctrl+S
const handleKeyPress = (event: KeyboardEvent): void => {
  if ((event.ctrlKey || event.metaKey) && event.key === 's') {
    event.preventDefault();
    handleSubmit();
  }
};

// Load categories and accounts on mount
onMounted(() => {
  loadCategories();
  loadAccounts();
  window.addEventListener('keydown', handleKeyPress);
});

// Clean up event listener on unmount
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
});
</script>

<template>
  <div class="sora-add-transaction-view">
    <a-card class="sora-card">
      <template #header>
        <div>{{ $t('transactionForm.title') }}</div>
      </template>
      <a-form ref="formRef" :model="formValue" :rules="rules" label-position="top">
        <a-formItem :label="$t('transactionForm.labels.name')" prop="name">
          <SoraInput
            v-model="formValue.name"
            :placeholder="$t('transactionForm.placeholders.name')"
          />
        </a-formItem>

        <a-formItem :label="$t('transactionForm.labels.description')" prop="description">
          <SoraInput
            v-model="formValue.description"
            type="textarea"
            :placeholder="$t('transactionForm.placeholders.description')"
            :rows="3"
          />
        </a-formItem>

        <a-formItem :label="$t('transactionForm.labels.time')" prop="time">
          <a-date-picker v-model="formValue.time" type="datetime" clearable />
        </a-formItem>

        <a-formItem :label="$t('transactionForm.labels.amount')" prop="amount">
          <a-input-number v-model="formValue.amount" :min="1" />
        </a-formItem>

        <a-formItem :label="$t('transactionForm.labels.category')" prop="category">
          <a-select
            v-model="categorySearchValue"
            :fetch-suggestions="querySearch"
            :placeholder="$t('transactionForm.placeholders.category')"
            clearable
            @select="handleCategorySelect"
            @focus="handleCategoryFocus"
          >
            <template #default="{ item }">
              <div :class="{ 'category-add-option': item.isAdd }">
                {{ item.value }}
              </div>
            </template>
          </a-select>
        </a-formItem>

        <a-formItem :label="$t('transactionForm.labels.account')" prop="account">
          <a-select
            v-model="accountSearchValue"
            :fetch-suggestions="queryAccountSearch"
            :placeholder="$t('transactionForm.placeholders.account')"
            clearable
            @select="handleAccountSelect"
          >
            <template #default="{ item }">
              <div :class="{ 'account-add-option': item.isAdd }">
                {{ item.value }}
              </div>
            </template>
          </a-select>
        </a-formItem>
      </a-form>
    </a-card>

    <!-- Add Category Modal -->
    <a-modal
      v-model="showCategoryModal"
      :title="$t('transactionForm.dialogs.addCategory')"
      width="400px"
    >
      <a-form>
        <a-formItem :label="$t('transactionForm.categoryName')">
          <a-input
            v-model="newCategoryName"
            :placeholder="$t('transactionForm.placeholders.categoryName')"
            @keyup.enter="saveCategoryFromModal"
            @keydown.enter.prevent
          />
        </a-formItem>
      </a-form>
      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 8px">
          <a-button @click="showCategoryModal = false">Cancel</a-button>
          <a-button type="primary" @click="saveCategoryFromModal">Save</a-button>
        </div>
      </template>
    </a-modal>

    <!-- Add Account Modal -->
    <a-modal
      v-model="showAccountModal"
      :title="$t('transactionForm.dialogs.addAccount')"
      width="400px"
    >
      <a-form>
        <a-formItem :label="$t('transactionForm.accountName')">
          <a-input
            v-model="newAccountName"
            :placeholder="$t('transactionForm.placeholders.accountName')"
            @keyup.enter="saveAccountFromModal"
            @keydown.enter.prevent
          />
        </a-formItem>
      </a-form>
      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 8px">
          <a-button @click="showAccountModal = false">Cancel</a-button>
          <a-button type="primary" @click="saveAccountFromModal">Save</a-button>
        </div>
      </template>
    </a-modal>
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
