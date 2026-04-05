<script setup lang="ts">
import { computed } from 'vue';
import type { ITransaction } from '@renderer/types/transaction';

const props = defineProps<{ transaction: ITransaction }>();

const isIncome = computed(
  () => (props.transaction.category || '').toString().toLowerCase() === 'income'
);

// Determine sign from amount to avoid UI inconsistency when category and amount disagree
const sign = computed(() => (Number(props.transaction.amount) >= 0 ? '+' : '-'));

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

// Format the absolute value of amount to avoid double signage; sign is shown separately
const formattedAmount = computed(() =>
  formatCurrency(Math.abs(Number(props.transaction.amount || 0)))
);
</script>

<template>
  <div :data-testid="`transactions-row-${props.transaction.id}`" class="sora-transaction-name">
    <div class="sora-icon-wrapper" data-testid="transactions-row-icon">
      {{ sign }}
    </div>
    <div class="sora-text-wrapper">
      <div class="sora-name" data-testid="transactions-row-name">{{ props.transaction.name }}</div>
      <div class="sora-desc" data-testid="transactions-row-desc">
        {{ props.transaction.description }}
      </div>
    </div>
    <div
      :class="Number(props.transaction.amount) >= 0 ? 'sora-income' : 'sora-expense'"
      data-testid="transactions-row-amount"
    >
      {{ formattedAmount }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.sora-transaction-name {
  display: flex;
  align-items: center;
  gap: 12px;
}
.sora-icon-wrapper {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f3f4f6;
}
.sora-text-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.sora-name {
  font-weight: 500;
}
.sora-desc {
  font-size: 12px;
  color: #6b7280;
}
</style>
