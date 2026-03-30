<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import {
  ElCard,
  ElForm,
  ElFormItem,
  ElInput,
  ElDatePicker,
  ElInputNumber,
  ElSelect,
  ElOption,
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

const formRef = ref<FormInstance | null>(null);
const formValue = ref({
  name: '',
  description: '',
  time: null,
  amount: 0,
  category: null as string | null,
  account: null
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
      value: cat.name
    }));
  } catch (error) {
    console.error('Failed to load categories:', error);
  } finally {
    isLoadingCategories.value = false;
  }
};

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
    results = [
      ...results,
      {
        value: `Add Category "${categorySearchValue.value.trim()}"`,
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
    // Open modal with pre-filled category name
    newCategoryName.value = categorySearchValue.value.trim();
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

// Load categories on mount
onMounted(() => {
  loadCategories();
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
          <ElSelect v-model="formValue.account" placeholder="Select account">
            <ElOption
              v-for="item in accountOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
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
}
</style>
