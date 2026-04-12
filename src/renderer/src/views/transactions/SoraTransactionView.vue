<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import SoraInput from '@renderer/components/ui-wrappers/SoraInput.vue';
import SoraTable from '@renderer/components/ui-wrappers/SoraTable.vue';
import { notifyError } from '@renderer/utils/sora-notification';
import {
  ITransaction,
  TransactionFilterParams,
  PaginatedTransactions
} from '@renderer/types/transaction';
import TransactionItem from '@renderer/components/TransactionItem.vue';

interface CategoryOption {
  id: number;
  name: string;
  type: string;
  icon?: string;
  color?: string;
}

interface AccountOption {
  id: number;
  name: string;
  type: string;
  balance?: number;
}

// Transactions data from database
const transactions = ref<ITransaction[]>([]);

// Category and Account options from database
const categoryOptions = ref<CategoryOption[]>([]);
const accountOptions = ref<AccountOption[]>([]);

// Loading states
const loading = ref(false);
const categoriesLoading = ref(false);
const accountsLoading = ref(false);

// i18n
const { t } = useI18n();

// Default filter values
const SORT_NEWEST = 'newest';
const SORT_OLDEST = 'oldest';

// Filter state - use number type for SoraSelect compatibility
// Use -1 to represent "all" option
const searchQuery = ref('');
const selectedCategoryId = ref<number>(-1);
const selectedAccountId = ref<number>(-1);
const selectedSort = ref<'newest' | 'oldest'>(SORT_NEWEST);

// Pagination state
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);

// Summary from API
const totalIncome = ref(0);
const totalExpense = ref(0);

// Debounce timer for search
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

// Convert -1 to null for API calls (null means "all")
const toApiFilterId = (value: number): number | null => {
  return value === -1 ? null : value;
};

// Fetch categories from database
const fetchCategories = async (): Promise<void> => {
  categoriesLoading.value = true;
  try {
    const result = await window.api.getAllCategories();
    categoryOptions.value = result as CategoryOption[];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  } finally {
    categoriesLoading.value = false;
  }
};

// Fetch accounts from database
const fetchAccounts = async (): Promise<void> => {
  accountsLoading.value = true;
  try {
    const result = await window.api.getAllAccounts();
    accountOptions.value = result as AccountOption[];
  } catch (error) {
    console.error('Failed to fetch accounts:', error);
  } finally {
    accountsLoading.value = false;
  }
};

// Fetch transactions with pagination and filters
const fetchTransactions = async (): Promise<void> => {
  loading.value = true;
  try {
    const filters: TransactionFilterParams = {
      name: searchQuery.value || undefined,
      categoryId: toApiFilterId(selectedCategoryId.value),
      accountId: toApiFilterId(selectedAccountId.value),
      sortBy: selectedSort.value,
      page: page.value,
      pageSize: pageSize.value
    };

    const result = await window.api.getTransactionsPaginated(filters);
    const paginatedResult = result as PaginatedTransactions;

    transactions.value = paginatedResult.data;
    total.value = paginatedResult.total;
    totalIncome.value = paginatedResult.summary.totalIncome;
    totalExpense.value = paginatedResult.summary.totalExpense;
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    notifyError(t('transactions.error') || 'Lỗi khi tải danh sách giao dịch');
    transactions.value = [];
    total.value = 0;
    totalIncome.value = 0;
    totalExpense.value = 0;
  } finally {
    loading.value = false;
  }
};

// Initialize data on mount
onMounted(async () => {
  await Promise.all([fetchCategories(), fetchAccounts()]);
  await fetchTransactions();
});

// Watch for filter changes and refetch
watch([searchQuery, selectedCategoryId, selectedAccountId, selectedSort], () => {
  // Handle clear - convert undefined/null back to -1 (all option)
  if (selectedCategoryId.value === undefined || selectedCategoryId.value === null) {
    selectedCategoryId.value = -1;
  }
  if (selectedAccountId.value === undefined || selectedAccountId.value === null) {
    selectedAccountId.value = -1;
  }

  // Debounce search input only
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }
  searchDebounceTimer = setTimeout(() => {
    page.value = 1;
    fetchTransactions();
  }, 300);
});

watch([page, pageSize], () => {
  fetchTransactions();
});

const handlePageChange = (newPage: number): void => {
  page.value = newPage;
};

const handlePageSizeChange = (newPageSize: number): void => {
  pageSize.value = newPageSize;
  page.value = 1;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const formattedTotalIncome = computed(() => formatCurrency(totalIncome.value));
const formattedTotalExpense = computed(() => formatCurrency(totalExpense.value));

const formatDate = (date: string | number | Date): string => {
  const d = new Date(date as never);
  if (isNaN(d.getTime())) return '—';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Category dropdown options
interface SelectOption {
  value: number;
  label: string;
}

const categorySelectOptions = computed<SelectOption[]>(() => {
  const allOption = { value: -1, label: t('common.all') || 'Tất cả' };
  const categoryOpts = categoryOptions.value.map((c) => ({
    value: c.id,
    label: c.name
  }));
  return [allOption, ...categoryOpts];
});

const accountSelectOptions = computed<SelectOption[]>(() => {
  const allOption = { value: -1, label: t('common.all') || 'Tất cả' };
  const accountOpts = accountOptions.value.map((a) => ({
    value: a.id,
    label: a.name
  }));
  return [allOption, ...accountOpts];
});

const sortSelectOptions = computed(() => [
  { value: SORT_NEWEST, label: t('transactions.sort.newest') || 'Mới nhất' },
  { value: SORT_OLDEST, label: t('transactions.sort.oldest') || 'Cũ nhất' }
]);
</script>

<template>
  <div class="sora-transaction-view">
    <!-- Header Section -->
    <SoraCard class="sora-card">
      <header class="sora-header">
        <div class="sora-search-wrapper">
          <SoraInput
            v-model="searchQuery"
            :placeholder="t('transactionForm.placeholders.name')"
            class="sora-search-input"
          />
        </div>
        <div class="sora-filters">
          <SoraSelect
            v-model="selectedCategoryId"
            class="sora-select"
            :loading="categoriesLoading"
            clearable
            placeholder=""
          >
            <SoraSelectOption
              v-for="cat in categorySelectOptions"
              :key="cat.value"
              :label="cat.label"
              :value="cat.value"
            />
          </SoraSelect>
          <SoraSelect
            v-model="selectedAccountId"
            class="sora-select"
            :loading="accountsLoading"
            clearable
            placeholder=""
          >
            <SoraSelectOption
              v-for="acc in accountSelectOptions"
              :key="acc.value"
              :label="acc.label"
              :value="acc.value"
            />
          </SoraSelect>
          <SoraSelect v-model="selectedSort" class="sora-select">
            <SoraSelectOption
              v-for="sort in sortSelectOptions"
              :key="sort.value"
              :label="sort.label"
              :value="sort.value"
            />
          </SoraSelect>
        </div>
      </header>
    </SoraCard>

    <!-- Summary Section -->
    <section class="sora-summary">
      <SoraCard class="sora-card">
        <div class="sora-card-title">{{ t('transactionForm.labels.income') }}</div>
        <div class="sora-card-amount sora-income">{{ formattedTotalIncome }}</div>
      </SoraCard>
      <SoraCard class="sora-card">
        <div class="sora-card-title">{{ t('transactionForm.labels.expense') }}</div>
        <div class="sora-card-amount sora-expense">{{ formattedTotalExpense }}</div>
      </SoraCard>
    </section>

    <!-- Detail Section with Pagination -->
    <SoraCard class="sora-card sora-detail-card">
      <section class="sora-detail">
        <SoraTable
          v-loading="loading"
          :data-source="transactions"
          class="sora-data-table"
          style="width: 100%"
          :table-props="{ columns: [] }"
        >
          <template #default="{ record }">
            <TransactionItem :transaction="record" />
          </template>
          <!-- category -->
          <template #column-category="{ record }">
            {{ record.categoryName }}
          </template>
          <!-- account -->
          <template #column-account="{ record }">
            {{ record.accountName }}
          </template>
          <!-- time -->
          <template #column-time="{ record }">
            {{ formatDate(record.time) }}
          </template>
          <!-- amount -->
          <template #column-amount="{ record }">
            <div :class="Number(record.amount) >= 0 ? 'sora-income' : 'sora-expense'">
              {{ formatCurrency(Math.abs(Number(record.amount || 0))) }}
            </div>
          </template>
        </SoraTable>
        <div
          v-if="transactions.length === 0 && !loading"
          data-testid="transactions-empty"
          class="sora-empty"
        >
          {{ t('transactions.empty') }}
        </div>
        <div class="sora-pagination-wrapper">
          <a-pagination
            :current="page"
            :page-size="pageSize"
            :page-size-options="[10, 20, 50]"
            :total="total"
            @change="handlePageChange"
            @show-size-change="handlePageSizeChange"
          />
        </div>
      </section>
    </SoraCard>
  </div>
</template>

<style scoped lang="scss">
.sora-transaction-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  padding: $spacing-md;
  background-color: $bg-secondary-light;
  color: $text-primary-light;
  height: 100%;
  box-sizing: border-box;
}

/* Header */
.sora-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $spacing-md;
  flex-wrap: wrap;
}

.sora-search-wrapper {
  flex: 1;
  min-width: 200px;
}

.sora-search-input {
  width: 100%;
}

.sora-filters {
  display: flex;
  gap: $spacing-sm;
}

.sora-select {
  min-width: 120px;
}

/* Summary */
.sora-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $spacing-md;
}

/* Card styles for all sections */
.sora-card {
  background-color: #fff;
  border-radius: $radius-md;
}

/* Summary card specific styles */
.sora-summary .sora-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 80px;
}

.sora-card-title {
  font-size: $font-size-sm;
  color: $text-secondary-light;
  margin-bottom: $spacing-xs;
}

.sora-card-amount {
  font-size: $font-size-lg;
  font-weight: bold;
}

:deep(.sora-income) {
  color: $color-success !important;
}

:deep(.sora-expense) {
  color: $color-error !important;
}

/* Detail Card */
.sora-detail-card {
  flex: 1;
  padding: 0 !important;
}

/* Detail Table */
.sora-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sora-data-table {
  height: 100%;
  flex: 1;
}

:deep(.el-table__cell) {
  padding: 8px 16px;
}

:deep(.el-table th.el-table__cell) {
  padding: 12px 16px;
}

.sora-pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
}

/* Transaction Name cell styling */
.sora-transaction-name {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.sora-icon-wrapper {
  width: 32px;
  height: 32px;
  background-color: $bg-secondary-light;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-md;
  flex-shrink: 0;
}

.sora-text-wrapper {
  display: flex;
  flex-direction: column;
}

.sora-name {
  font-weight: 500;
}

.sora-desc {
  font-size: $font-size-xs;
  color: $text-secondary-light;
}

.sora-empty {
  padding: 40px;
  text-align: center;
  color: $text-secondary-light;
}
</style>
