<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  ElCard,
  ElInput,
  ElSelect,
  ElOption,
  ElTable,
  ElTableColumn,
  ElPagination
} from 'element-plus';
import { ITransaction } from '@renderer/types/transaction';

// Transactions data from database
const transactions = ref<ITransaction[]>([]);

onMounted(async () => {
  try {
    transactions.value = await window.api.getAllTransactions();
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
  }
});

// Filter State
const searchQuery = ref('');
const selectedCategory = ref('All');
const selectedAccount = ref('All');
const selectedSort = ref('Newest');

const categories = [
  { label: 'All', value: 'All' },
  { label: 'Income', value: 'Income' },
  { label: 'Expense', value: 'Expense' }
];

const accounts = [
  { label: 'All', value: 'All' },
  { label: 'Cash', value: 'Cash' },
  { label: 'Bank account A', value: 'Bank account A' },
  { label: 'Bank account B', value: 'Bank account B' }
];

const sortOptions = [
  { label: 'Newest', value: 'Newest' },
  { label: 'Oldest', value: 'Oldest' }
];

// Computed
const filteredTransactions = computed(() => {
  let result = [...transactions.value];

  // Filter by Search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (t) => t.name.toLowerCase().includes(query) || t.description.toLowerCase().includes(query)
    );
  }

  // Filter by Category
  if (selectedCategory.value !== 'All') {
    result = result.filter((t) => t.category === selectedCategory.value);
  }

  // Filter by Account
  if (selectedAccount.value !== 'All') {
    result = result.filter((t) => t.account === selectedAccount.value);
  }

  // Sort
  result.sort((a, b) => {
    const dateA = new Date(a.time).getTime();
    const dateB = new Date(b.time).getTime();
    return selectedSort.value === 'Newest' ? dateB - dateA : dateA - dateB;
  });

  return result;
});

const totalIncome = computed(() =>
  transactions.value.filter((t) => t.category === 'Income').reduce((sum, t) => sum + t.amount, 0)
);

const totalExpense = computed(() =>
  transactions.value.filter((t) => t.category === 'Expense').reduce((sum, t) => sum + t.amount, 0)
);

const latestBalance = computed(() => totalIncome.value + totalExpense.value);

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const formatDate = (date: Date): string => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Pagination state
const page = ref(1);
const pageSize = ref(10);

const handlePageChange = (newPage: number): void => {
  page.value = newPage;
};

const handlePageSizeChange = (newPageSize: number): void => {
  pageSize.value = newPageSize;
  page.value = 1;
};
</script>

<template>
  <div class="sora-transaction-view">
    <!-- Header Section -->
    <ElCard class="sora-card">
      <header class="sora-header">
        <div class="sora-search-wrapper">
          <ElInput
            v-model="searchQuery"
            placeholder="Search transaction"
            class="sora-search-input"
          />
        </div>
        <div class="sora-filters">
          <ElSelect v-model="selectedCategory" class="sora-select">
            <ElOption
              v-for="cat in categories"
              :key="cat.value"
              :label="cat.label"
              :value="cat.value"
            />
          </ElSelect>
          <ElSelect v-model="selectedAccount" class="sora-select">
            <ElOption
              v-for="acc in accounts"
              :key="acc.value"
              :label="acc.label"
              :value="acc.value"
            />
          </ElSelect>
          <ElSelect v-model="selectedSort" class="sora-select">
            <ElOption
              v-for="sort in sortOptions"
              :key="sort.value"
              :label="sort.label"
              :value="sort.value"
            />
          </ElSelect>
        </div>
      </header>
    </ElCard>

    <!-- Summary Section -->
    <section class="sora-summary">
      <ElCard class="sora-card">
        <div class="sora-card-title">Total Income</div>
        <div class="sora-card-amount sora-income">
          {{ formatCurrency(totalIncome) }}
        </div>
      </ElCard>
      <ElCard class="sora-card">
        <div class="sora-card-title">Total Expense</div>
        <div class="sora-card-amount sora-expense">
          {{ formatCurrency(totalExpense) }}
        </div>
      </ElCard>
      <ElCard class="sora-card">
        <div class="sora-card-title">Latest Balance</div>
        <div class="sora-card-amount">
          {{ formatCurrency(latestBalance) }}
        </div>
      </ElCard>
    </section>

    <!-- Detail Section with Pagination -->
    <ElCard class="sora-card sora-detail-card">
      <section class="sora-detail">
        <ElTable
          :data="filteredTransactions"
          class="sora-data-table"
          height="100%"
          style="width: 100%"
        >
          <ElTableColumn prop="name" label="Transaction Name" width="250">
            <template #default="scope">
              <div class="sora-transaction-name">
                <div class="sora-icon-wrapper">
                  {{ scope.row.category === 'Income' ? '+' : '-' }}
                </div>
                <div class="sora-text-wrapper">
                  <div class="sora-name">{{ scope.row.name }}</div>
                  <div class="sora-desc">{{ scope.row.description }}</div>
                </div>
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="category" label="Category" width="100" />
          <ElTableColumn prop="account" label="Account" width="120" />
          <ElTableColumn prop="time" label="Transaction Time" width="120">
            <template #default="scope">
              {{ formatDate(scope.row.time) }}
            </template>
          </ElTableColumn>
          <ElTableColumn prop="amount" label="Amount" width="120">
            <template #default="scope">
              <div :class="scope.row.amount >= 0 ? 'sora-income' : 'sora-expense'">
                {{ formatCurrency(scope.row.amount) }}
              </div>
            </template>
          </ElTableColumn>
        </ElTable>
        <div class="sora-pagination-wrapper">
          <ElPagination
            v-model:current-page="page"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50]"
            :total="filteredTransactions.length"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handlePageSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </section>
    </ElCard>
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
  flex: 1; /* Take available space */
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
</style>
