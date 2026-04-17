<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  SoraInput,
  SoraButton,
  SoraCard,
  SoraForm,
  SoraFormItem,
  SoraDatePicker,
  SoraInputNumber,
  SoraSelect,
  SoraModal
} from '@renderer/components/ui';
// Ant components are registered globally via plugin; no local import required

// Use a loose type for form rules during migration

import { useTransactionFormStore } from '@renderer/stores/transactionForm';
import { notifySuccess, notifyError } from '@renderer/utils/sora-notification';

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

const formRef = ref<unknown>(null);
const formValue = ref({
  name: '',
  description: '',
  time: null,
  amount: 0,
  category: null as string | null,
  account: null as string | null,
  categoryId: null as number | null,
  accountId: null as number | null
});

const rules: Record<string, unknown> = {
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
  ],
  time: [
    {
      required: true,
      message: t('transactionForm.validation.timeRequired'),
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
    const categories = (await window.api.searchCategories('', 100, 0)) as Array<{ id: number; name: string }>;
    // Convert database rows to select options
    categoryOptions.value = categories.map((cat) => ({
      value: cat.name,
      label: cat.name,
      id: cat.id
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
    const accounts = (await window.api.searchAccounts('', 100, 0)) as Array<{ id: number; name: string }>;
    // Convert database rows to select options
    accountOptions.value = accounts.map((acc) => ({
      value: acc.name,
      label: acc.name,
      id: acc.id
    }));
  } catch (error) {
    console.error('Failed to load accounts:', error);
  } finally {
    isLoadingAccounts.value = false;
  }
};

// Fetch account suggestions for a-select (supports pagination/append)
const PAGE_SIZE = 5;
const queryAccountSearch = async (
  queryString: string,
  cb: (options: AccountOption[]) => void,
  opts?: { append?: boolean }
): Promise<void> => {
  const q = String(queryString || '').trim();
  const append = Boolean(opts?.append);
  const offset = append ? accountOptions.value.length : 0;
  isLoadingAccounts.value = true;
  try {
    const results = (await window.api.searchAccounts(q, PAGE_SIZE, offset)) as Array<{ id: number; name: string }>;
    const mapped = results.map((acc) => ({ value: acc.name, label: acc.name, id: acc.id }));

    if (append) {
      accountOptions.value = [...accountOptions.value, ...mapped];
    } else {
      accountOptions.value = mapped;
    }

    // Add "Add Account" option at the bottom if the typed text is new (only when not appending)
    if (
      !append &&
      q &&
      !accountOptions.value.some((opt) => opt.value?.toString().toLowerCase() === q.toLowerCase())
    ) {
      accountOptions.value.push({ value: `Add Account "${q}"`, label: q, isAdd: true });
    }

    cb(accountOptions.value);
  } catch (error) {
    console.error('Failed to search accounts:', error);
    cb([]);
  } finally {
    isLoadingAccounts.value = false;
  }
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
  // If the option contains an id, store it for submission
  const maybeId = (item as Record<string, unknown>)?.id as number | undefined;
  if (maybeId !== undefined) {
    formValue.value.accountId = Number(maybeId);
  } else {
    formValue.value.accountId = null;
  }
};

// Save account from modal
const saveAccountFromModal = async (): Promise<void> => {
  // Ignore calls that happen too soon after modal opens (prevents auto-save from Enter key)
  if (Date.now() - accountModalOpenedAt.value < 100) return;

  if (!newAccountName.value.trim()) return;

  const accountName = newAccountName.value.trim();
  try {
    const res = await window.api.createAccount({
      name: accountName,
      type: 'general' // Default type
    });

    // Refresh accounts list
    await loadAccounts();

    // Select the newly added account
    formValue.value.account = accountName;
    accountSearchValue.value = '';

    // Try to set returned id
    try {
      if (typeof res === 'number') {
        formValue.value.accountId = res;
      } else if (res) {
        const createdRes = res as unknown as { lastInsertRowid?: number };
        if (createdRes.lastInsertRowid) formValue.value.accountId = Number(createdRes.lastInsertRowid);
      }
    } catch (e) {
      console.error('Failed to parse created account id', e);
    }

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

// Fetch suggestions for a-select (supports pagination/append)
const querySearch = async (
  queryString: string,
  cb: (options: CategoryOption[]) => void,
  opts?: { append?: boolean }
): Promise<void> => {
  const q = String(queryString || '').trim();
  const append = Boolean(opts?.append);
  const offset = append ? categoryOptions.value.length : 0;
  isLoadingCategories.value = true;
  try {
    const results = (await window.api.searchCategories(q, 5, offset)) as Array<{ id: number; name: string }>;
    const mapped = results.map((cat) => ({ value: cat.name, label: cat.name, id: cat.id }));

    if (append) {
      categoryOptions.value = [...categoryOptions.value, ...mapped];
    } else {
      categoryOptions.value = mapped;
    }

    // Add "Add Category" option at the bottom if the typed text is new (only when not appending)
    if (
      !append &&
      q &&
      !categoryOptions.value.some((opt) => opt.value?.toString().toLowerCase() === q.toLowerCase())
    ) {
      categoryOptions.value.push({ value: `Add Category "${q}"`, label: q, isAdd: true });
    }

    cb(categoryOptions.value);
  } catch (error) {
    console.error('Failed to search categories:', error);
    cb([]);
  } finally {
    isLoadingCategories.value = false;
  }
};

// Template helpers for slot props (slotProps typing is dynamic)
function slotIsAdd(slotProps: unknown): boolean {
  const sp = slotProps as Record<string, unknown>;
  const item = sp?.item as Record<string, unknown> | undefined;
  return Boolean((item && Boolean((item['isAdd'] as boolean))) || Boolean(sp?.isAdd));
}
function slotLabel(slotProps: unknown): string {
  const sp = slotProps as Record<string, unknown>;
  const item = sp?.item as Record<string, unknown> | undefined;
  return (item?.value as string | undefined) ?? (sp?.value as string | undefined) ?? (sp?.label as string | undefined) ?? '';
}

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
  // If the option contains an id, store it for submission
  const maybeId = (item as Record<string, unknown>)?.id as number | undefined;
  if (maybeId !== undefined) {
    formValue.value.categoryId = Number(maybeId);
  } else {
    formValue.value.categoryId = null;
  }
};

// Save category from modal
const saveCategoryFromModal = async (): Promise<void> => {
  // Ignore calls that happen too soon after modal opens (prevents auto-save from Enter key)
  if (Date.now() - modalOpenedAt.value < 100) return;

  if (!newCategoryName.value.trim()) return;

  const categoryName = newCategoryName.value.trim();
  try {
    const res = await window.api.createCategory({
      name: categoryName,
      type: 'expense' // Default type, can be made configurable
    });

    // Refresh categories list
    await loadCategories();

    // Select the newly added category
    formValue.value.category = categoryName;
    categorySearchValue.value = '';

    // Try to set returned id
    try {
      if (typeof res === 'number') {
        formValue.value.categoryId = res;
      } else if (res) {
        const createdRes = res as unknown as { lastInsertRowid?: number };
        if (createdRes.lastInsertRowid) formValue.value.categoryId = Number(createdRes.lastInsertRowid);
      }
    } catch (e) {
      console.error('Failed to parse created category id', e);
    }

    // Close modal
    showCategoryModal.value = false;
    newCategoryName.value = '';
  } catch (error) {
    console.error('Failed to add category:', error);
  }
};

// Handle category focus
const handleCategoryFocus = (): void => {
  // Load initial page of categories when focused
  querySearch('', () => {});
};

// Handle account focus
const handleAccountFocus = (): void => {
  // Load initial page of accounts when focused
  queryAccountSearch('', () => {});
};

// Clear modal state when closed
watch(showCategoryModal, (isOpen) => {
  if (!isOpen) {
    newCategoryName.value = '';
  }
});

const transactionFormStore = useTransactionFormStore();

const handleSubmit = async (): Promise<void> => {
  const formInstance = formRef.value as { validate?: () => Promise<unknown> } | undefined;
  try {
    await formInstance?.validate?.();
  } catch {
    // validation failed
    return;
  }

  transactionFormStore.setLoading(true);
  try {
    const success = await transactionFormStore.addTransaction({
      name: formValue.value.name,
      description: formValue.value.description,
      time: formValue.value.time,
      amount: formValue.value.amount,
      category: formValue.value.category,
      account: formValue.value.account,
      categoryId: formValue.value.categoryId,
      accountId: formValue.value.accountId
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
        account: null,
        categoryId: null,
        accountId: null
      };
      // Reset category and account search values
      categorySearchValue.value = '';
      accountSearchValue.value = '';
    }
  } catch {
    notifyError(t('transactionForm.messages.error'));
  } finally {
    transactionFormStore.setLoading(false);
  }
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
  // Lazy-loading: only load initial items on focus/search
  window.addEventListener('keydown', handleKeyPress);
});

// Clean up event listener on unmount
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
});
</script>

<template>
  <div class="sora-add-transaction">
    <SoraCard class="sora-add-transaction__card">
      <template #header>
        <div class="sora-add-transaction__header">
          <div class="sora-add-transaction__header-left">
            <div class="sora-add-transaction__header-title">{{ $t('transactionForm.title') }}</div>
          </div>
          <div class="sora-add-transaction__header-actions">
            <SoraButton type="primary" @click="handleSubmit">{{ $t('button.save') }}</SoraButton>
          </div>
        </div>
      </template>
      <SoraForm
        ref="formRef"
        :model="formValue"
        :rules="rules"
        layout="vertical"
        :hide-required-mark="true"
      >
        <SoraFormItem prop="name">
          <template #label>
            <span
              >{{ $t('transactionForm.labels.name')
              }}<span class="sora-add-transaction__required-star">*</span></span
            >
          </template>
          <SoraInput
            v-model="formValue.name"
            :placeholder="$t('transactionForm.placeholders.name')"
          />
        </SoraFormItem>

        <SoraFormItem :label="$t('transactionForm.labels.description')" prop="description">
          <SoraInput
            v-model="formValue.description"
            type="textarea"
            :placeholder="$t('transactionForm.placeholders.description')"
            :rows="3"
          />
        </SoraFormItem>

        <div class="sora-add-transaction__row sora-add-transaction__row--two">
          <SoraFormItem prop="time">
            <template #label>
              <span
                >{{ $t('transactionForm.labels.time')
                }}<span class="sora-add-transaction__required-star">*</span></span
              >
            </template>
            <SoraDatePicker v-model="formValue.time" type="datetime" clearable />
          </SoraFormItem>

          <SoraFormItem prop="amount">
            <template #label>
              <span
                >{{ $t('transactionForm.labels.amount')
                }}<span class="sora-add-transaction__required-star">*</span></span
              >
            </template>
            <SoraInputNumber v-model="formValue.amount" />
          </SoraFormItem>
        </div>

        <SoraFormItem prop="category">
          <template #label>
            <span
              >{{ $t('transactionForm.labels.category')
              }}<span class="sora-add-transaction__required-star">*</span></span
            >
          </template>
          <SoraSelect
            v-model="categorySearchValue"
            :options="categoryOptions"
            :fetch-suggestions="querySearch"
            :placeholder="$t('transactionForm.placeholders.category')"
            clearable
            @select="handleCategorySelect"
            @focus="handleCategoryFocus"
          >
            <template #default="slotProps">
              <div :class="{ 'sora-category-add-option': slotIsAdd(slotProps) }">
                {{ slotLabel(slotProps) }}
              </div>
            </template>
          </SoraSelect>
        </SoraFormItem>

        <SoraFormItem prop="account">
          <template #label>
            <span
              >{{ $t('transactionForm.labels.account')
              }}<span class="sora-add-transaction__required-star">*</span></span
            >
          </template>
          <SoraSelect
            v-model="accountSearchValue"
            :options="accountOptions"
            :fetch-suggestions="queryAccountSearch"
            :placeholder="$t('transactionForm.placeholders.account')"
            clearable
            @select="handleAccountSelect"
            @focus="handleAccountFocus"
          >
            <template #default="slotProps">
              <div :class="{ 'sora-account-add-option': slotIsAdd(slotProps) }">
                {{ slotLabel(slotProps) }}
              </div>
            </template>
          </SoraSelect>
        </SoraFormItem>
      </SoraForm>
    </SoraCard>

    <!-- Add Category Modal -->
    <SoraModal
      v-model="showCategoryModal"
      :title="$t('transactionForm.dialogs.addCategory')"
      width="400px"
    >
      <SoraForm>
        <SoraFormItem :label="$t('transactionForm.categoryName')">
          <SoraInput
            v-model="newCategoryName"
            :placeholder="$t('transactionForm.placeholders.categoryName')"
            @keyup.enter="saveCategoryFromModal"
            @keydown.enter.prevent
          />
        </SoraFormItem>
      </SoraForm>
      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 8px">
          <SoraButton @click="showCategoryModal = false">{{ $t('button.cancel') }}</SoraButton>
          <SoraButton type="primary" @click="saveCategoryFromModal">{{
            $t('button.save')
          }}</SoraButton>
        </div>
      </template>
    </SoraModal>

    <!-- Add Account Modal -->
    <SoraModal
      v-model="showAccountModal"
      :title="$t('transactionForm.dialogs.addAccount')"
      width="400px"
    >
      <SoraForm>
        <SoraFormItem :label="$t('transactionForm.accountName')">
          <SoraInput
            v-model="newAccountName"
            :placeholder="$t('transactionForm.placeholders.accountName')"
            @keyup.enter="saveAccountFromModal"
            @keydown.enter.prevent
          />
        </SoraFormItem>
      </SoraForm>
      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 8px">
          <SoraButton @click="showAccountModal = false">{{ $t('button.cancel') }}</SoraButton>
          <SoraButton type="primary" @click="saveAccountFromModal">{{
            $t('button.save')
          }}</SoraButton>
        </div>
      </template>
    </SoraModal>
  </div>
</template>

<style scoped lang="scss">
.sora-add-transaction {
  padding: $spacing-md;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sora-add-transaction__card {
  width: 100%;
  margin: 0 auto;
  background-color: #fff;
  border-radius: $radius-md;
  flex: 1;
}

.sora-add-transaction__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-md;
  flex-wrap: nowrap;
  width: 100%;
}

.sora-add-transaction__header-left {
  flex: 1 1 auto;
  min-width: 0;
}

.sora-add-transaction__header-title {
  font-size: $font-size-lg;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sora-add-transaction__header-actions {
  display: flex;
  gap: $spacing-sm;
  flex: 0 0 auto;
  align-items: center;
}

.sora-add-transaction__row {
  display: flex;
  gap: $spacing-md;
  align-items: flex-start;
}

.sora-add-transaction__row--two > * {
  flex: 0 0 calc(50% - (#{$spacing-md} / 2));
  max-width: calc(50% - (#{$spacing-md} / 2));
}

.sora-add-transaction__row--two :deep(.ant-picker) {
  width: 100% !important;
  display: block;
}

/* Fallback for inner input elements */
.sora-add-transaction__row--two :deep(.ant-picker-input) {
  width: 100% !important;
}

.sora-add-transaction__required-star {
  color: $color-error;
  margin-left: $spacing-xs;
}

/* Label spacing adjustments */
:deep(.el-form-item__label),
:deep(.ant-form-item-label) {
  font-weight: 500;
  margin-bottom: $spacing-xs;
}

:deep(.el-autocomplete-suggestion__list) {
  .sora-category-add-option,
  li.sora-category-add-option {
    color: $color-primary;
    font-style: italic;
    border-top: 1px solid #e0e0e0;

    &:hover {
      background-color: #f0f7ff !important;
    }
  }

  .sora-account-add-option,
  li.sora-account-add-option {
    color: $color-primary;
    font-style: italic;
    border-top: 1px solid #e0e0e0;

    &:hover {
      background-color: #f0f7ff !important;
    }
  }
}

/* Ensure number input fills its column */
:deep(.ant-input-number) {
  width: 100%;
}
</style>
