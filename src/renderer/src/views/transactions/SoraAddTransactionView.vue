<script setup lang="ts">
import { ref, watch } from 'vue';
import { NCard, NForm, NFormItem, NInput, NDatePicker, NInputNumber, NSelect } from 'naive-ui';
import type { FormInst, FormRules } from 'naive-ui';
import { useTransactionFormStore } from '@renderer/stores/transactionForm';

const formRef = ref<FormInst | null>(null);
const formValue = ref({
  name: '',
  description: '',
  time: null,
  amount: 0,
  category: null,
  account: null
});

const rules: FormRules = {
  name: [{ required: true, message: 'Please enter transaction name', trigger: ['blur', 'input'] }],
  amount: [{ required: true, message: 'Please enter amount', trigger: ['blur', 'input'] }],
  category: [{ required: true, message: 'Please select category', trigger: ['change'] }],
  account: [{ required: true, message: 'Please select account', trigger: ['change'] }]
};

const categoryOptions = [
  { label: 'Income', value: 'Income' },
  { label: 'Expense', value: 'Expense' }
];

const accountOptions = [
  { label: 'Cash', value: 'Cash' },
  { label: 'Bank Account A', value: 'Bank account A' },
  { label: 'Bank Account B', value: 'Bank account B' }
];

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
          <NSelect
            v-model:value="formValue.category"
            :options="categoryOptions"
            placeholder="Select category"
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
</style>
