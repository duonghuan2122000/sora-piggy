import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Transaction {
  id: string;
  name: string;
  description: string;
  time: number | null;
  amount: number;
  category: string | null;
  account: string | null;
}

export const useTransactionFormStore = defineStore('transactionForm', () => {
  const isFormValid = ref(false);
  const submitCount = ref(0);
  const transactions = ref<Transaction[]>([]);

  const validateAndSubmit = (): void => {
    submitCount.value++;
    // The actual validation and submission logic is handled in the component
    // This store just triggers the submission
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>): void => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString() // Simple ID generation
    };
    transactions.value.push(newTransaction);
    console.log('Transaction added:', newTransaction);
    // In a real app, you would make an API call here
  };

  return {
    isFormValid,
    submitCount,
    transactions,
    validateAndSubmit,
    addTransaction
  };
});
