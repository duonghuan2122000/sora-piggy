<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NDatePicker,
  NInputNumber,
  NSelect,
  NAutoComplete,
  NModal,
  NButton
} from 'naive-ui';
import type { FormInst, FormRules, AutoCompleteOption } from 'naive-ui';
import { useTransactionFormStore } from '@renderer/stores/transactionForm';

const formRef = ref<FormInst | null>(null);
const formValue = ref({
  name: '',
  description: '',
  time: null,
  amount: 0,
  category: null as string | null,
  account: null
});

const rules: FormRules = {
  name: [{ required: true, message: 'Please enter transaction name', trigger: ['blur', 'input'] }],
  amount: [{ required: true, message: 'Please enter amount', trigger: ['blur', 'input'] }],
  category: [{ required: true, message: 'Please select category', trigger: ['change'] }],
  account: [{ required: true, message: 'Please select account', trigger: ['change'] }]
};

// Category state
const categoryOptions = ref<AutoCompleteOption[]>([]);
const categorySearchValue = ref('');
const isLoadingCategories = ref(false);

// Add Category Modal state
const showCategoryModal = ref(false);
const newCategoryName = ref('');
const modalOpenedAt = ref(0);

// Load categories from database
const loadCategories = async (): Promise<void> => {
  isLoadingCategories.value = true;
  try {
    const categories = await window.api.getCategories();
    // Convert database rows to select options
    categoryOptions.value = categories.map((cat: { name: string }) => ({
      label: cat.name,
      value: cat.name
    }));
  } catch (error) {
    console.error('Failed to load categories:', error);
  } finally {
    isLoadingCategories.value = false;
  }
};

// Filter categories based on search input
const filteredCategories = computed(() => {
  const search = categorySearchValue.value.toLowerCase();
  let filtered = categoryOptions.value;

  if (search) {
    filtered = categoryOptions.value.filter((option) =>
      option.label?.toString().toLowerCase().includes(search)
    );
  }

  // Add "Add Category" option at the bottom if the typed text is new
  if (isNewCategory.value && categorySearchValue.value.trim()) {
    return [
      ...filtered,
      {
        label: `Add Category "${categorySearchValue.value.trim()}"`,
        value: '__add_category__',
        class: 'category-add-option'
      }
    ];
  }

  return filtered;
});

// Check if the typed category already exists
const isNewCategory = computed(() => {
  if (!categorySearchValue.value) return false;
  const search = categorySearchValue.value.toLowerCase();
  return !categoryOptions.value.some((option) => option.label?.toString().toLowerCase() === search);
});

// Handle category selection
const handleCategorySelect = (value: string): void => {
  // Prevent processing if modal is already open
  if (showCategoryModal.value) return;

  if (value === '__add_category__') {
    // Open modal with pre-filled category name
    newCategoryName.value = categorySearchValue.value.trim();
    showCategoryModal.value = true;
    modalOpenedAt.value = Date.now(); // Record timestamp when modal opens
    return;
  }

  formValue.value.category = value;
  categorySearchValue.value = '';
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

const accountOptions = [
  { label: 'Cash', value: 'Cash' },
  { label: 'Bank Account A', value: 'Bank account A' },
  { label: 'Bank Account B', value: 'Bank account B' }
];

// Clear modal state when closed
watch(showCategoryModal, (isOpen) => {
  if (!isOpen) {
    newCategoryName.value = '';
  }
});

const transactionFormStore = useTransactionFormStore();

const handleSubmit = (): void => {
  formRef.value?.validate((errors) => {
    if (!errors) {
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

// Load categories on mount
onMounted(() => {
  loadCategories();
});
</script>

<template>
  <div class="sora-add-transaction-view">
    <NCard title="Add Transaction" class="sora-card">
      <NForm ref="formRef" :model="formValue" :rules="rules" label-placement="top">
        <NFormItem label="Transaction Name" path="name">
          <NInput v-model:value="formValue.name" placeholder="Enter transaction name" />
        </NFormItem>

        <NFormItem label="Description" path="description">
          <NInput
            v-model:value="formValue.description"
            type="textarea"
            placeholder="Enter transaction description"
            :rows="3"
          />
        </NFormItem>

        <NFormItem label="Date & Time" path="time">
          <NDatePicker v-model:value="formValue.time" type="datetime" clearable />
        </NFormItem>

        <NFormItem label="Amount" path="amount">
          <NInputNumber v-model:value="formValue.amount" :min="0" placeholder="0.00" />
        </NFormItem>

        <NFormItem label="Category" path="category">
          <NAutoComplete
            v-model:value="categorySearchValue"
            :options="filteredCategories"
            :loading="isLoadingCategories"
            placeholder="Search or add category"
            clearable
            @select="handleCategorySelect"
            @focus="handleCategoryFocus"
          />
        </NFormItem>

        <NFormItem label="Account" path="account">
          <NSelect
            v-model:value="formValue.account"
            :options="accountOptions"
            placeholder="Select account"
          />
        </NFormItem>
      </NForm>
    </NCard>

    <!-- Add Category Modal -->
    <NModal v-model:show="showCategoryModal">
      <NCard
        style="width: 400px"
        title="Add Category"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <NForm>
          <NFormItem label="Category Name">
            <NInput
              v-model:value="newCategoryName"
              placeholder="Enter category name"
              @keyup.enter="saveCategoryFromModal"
              @keydown.enter.prevent
            />
          </NFormItem>
        </NForm>
        <template #footer>
          <div style="display: flex; justify-content: flex-end; gap: 8px">
            <NButton @click="showCategoryModal = false">Cancel</NButton>
            <NButton type="primary" @click="saveCategoryFromModal">Save</NButton>
          </div>
        </template>
      </NCard>
    </NModal>
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

:deep(.n-form-item-label) {
  font-weight: 500;
}

:deep(.category-add-option) {
  color: #1890ff;
  font-style: italic;
  border-top: 1px solid #e0e0e0;

  &:hover {
    background-color: #f0f7ff !important;
  }
}
</style>
