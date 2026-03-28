<script setup lang="ts">
import { ref, computed, h } from 'vue';
import { NCard, NInput, NSelect, NButton, NDataTable } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { ITransaction } from '@renderer/types/transaction';

// Mock Data
const transactions = ref<ITransaction[]>([
  {
    id: 1,
    name: 'Grocery Shopping',
    description: 'Weekly groceries',
    category: 'Expense',
    account: 'Cash',
    amount: -500000,
    time: new Date('2023-10-25')
  },
  {
    id: 2,
    name: 'Salary',
    description: 'Monthly salary',
    category: 'Income',
    account: 'Bank account A',
    amount: 15000000,
    time: new Date('2023-10-24')
  },
  {
    id: 3,
    name: 'Coffee',
    description: 'Morning coffee',
    category: 'Expense',
    account: 'Cash',
    amount: -30000,
    time: new Date('2023-10-24')
  },
  {
    id: 4,
    name: 'Freelance Payment',
    description: 'Web design project',
    category: 'Income',
    account: 'Bank account B',
    amount: 5000000,
    time: new Date('2023-10-23')
  }
]);

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
const pagination = ref({
  page: 1,
  pageSize: 10,
  pageCount: 1,
  showSizePicker: false
});

// DataTable columns
const columns: DataTableColumns<ITransaction> = [
  {
    title: 'Transaction Name',
    key: 'name',
    width: 250,
    render: (row: ITransaction) => {
      return h('div', { class: 'sora-transaction-name' }, [
        h('div', { class: 'sora-icon-wrapper' }, [row.category === 'Income' ? '+' : '-']),
        h('div', { class: 'sora-text-wrapper' }, [
          h('div', { class: 'sora-name' }, row.name),
          h('div', { class: 'sora-desc' }, row.description)
        ])
      ]);
    }
  },
  {
    title: 'Category',
    key: 'category',
    width: 100
  },
  {
    title: 'Account',
    key: 'account',
    width: 120
  },
  {
    title: 'Transaction Time',
    key: 'time',
    width: 120,
    render: (row: ITransaction) => formatDate(row.time)
  },
  {
    title: 'Amount',
    key: 'amount',
    width: 120,
    render: (row: ITransaction) => {
      return h(
        'div',
        {
          class: row.amount >= 0 ? 'sora-income' : 'sora-expense'
        },
        formatCurrency(row.amount)
      );
    }
  }
];
</script>

<template>
  <div class="sora-transaction-view">
    <!-- Header Section -->
    <NCard class="sora-card">
      <header class="sora-header">
        <div class="sora-search-wrapper">
          <NInput
            v-model:value="searchQuery"
            placeholder="Search transaction"
            class="sora-search-input"
          />
        </div>
        <div class="sora-filters">
          <NSelect v-model:value="selectedCategory" :options="categories" class="sora-select" />
          <NSelect v-model:value="selectedAccount" :options="accounts" class="sora-select" />
          <NSelect v-model:value="selectedSort" :options="sortOptions" class="sora-select" />
        </div>
      </header>
    </NCard>

    <!-- Summary Section -->
    <section class="sora-summary">
      <NCard class="sora-card">
        <div class="sora-card-title">Total Income</div>
        <div class="sora-card-amount sora-income">
          {{ formatCurrency(totalIncome) }}
        </div>
      </NCard>
      <NCard class="sora-card">
        <div class="sora-card-title">Total Expense</div>
        <div class="sora-card-amount sora-expense">
          {{ formatCurrency(totalExpense) }}
        </div>
      </NCard>
      <NCard class="sora-card">
        <div class="sora-card-title">Latest Balance</div>
        <div class="sora-card-amount">
          {{ formatCurrency(latestBalance) }}
        </div>
      </NCard>
    </section>

    <!-- Detail Section with Footer -->
    <NCard class="sora-card sora-detail-card">
      <section class="sora-detail">
        <NDataTable
          :columns="columns"
          :data="filteredTransactions"
          :bordered="false"
          :single-line="false"
          :pagination="false"
          class="sora-data-table"
        />
      </section>
      <template #footer>
        <footer class="sora-footer">
          <div class="sora-count">Total: {{ filteredTransactions.length }} transactions</div>
          <div class="sora-pagination">
            <NButton quaternary class="sora-btn-page" @click="pagination.page--"> &lt; </NButton>
            <NButton
              quaternary
              class="sora-btn-page"
              :class="{ active: pagination.page === 1 }"
              @click="pagination.page = 1"
            >
              1
            </NButton>
            <NButton
              quaternary
              class="sora-btn-page"
              :class="{ active: pagination.page === 2 }"
              @click="pagination.page = 2"
            >
              2
            </NButton>
            <NButton quaternary class="sora-btn-page" @click="pagination.page++"> &gt; </NButton>
          </div>
        </footer>
      </template>
    </NCard>
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

.sora-income {
  color: $color-success;
}

.sora-expense {
  color: $color-warning;
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
  --n-td-padding: 8px 16px;
  --n-th-padding: 12px 16px;
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

/* Footer inside DataTable */
.sora-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-sm $spacing-md;
  background-color: $bg-tertiary-light;
  border-top: 1px solid $gray-1-light;
}

.sora-count {
  font-size: $font-size-sm;
  color: $text-secondary-light;
}

.sora-pagination {
  display: flex;
  gap: $spacing-xs;
}

.sora-btn-page {
  &.active {
    background-color: $color-primary;
    color: #fff;
  }
}
</style>
