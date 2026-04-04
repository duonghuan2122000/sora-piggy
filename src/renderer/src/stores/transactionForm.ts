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
  const isLoading = ref(false);

  const validateAndSubmit = (): void => {
    submitCount.value++;
    // The actual validation and submission logic is handled in the component
    // This store just triggers the submission
  };

  const setLoading = (loading: boolean): void => {
    isLoading.value = loading;
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<boolean> => {
    isLoading.value = true;
    try {
      // Convert timestamp to ISO string for the API
      const apiTransaction = {
        name: transaction.name,
        description: transaction.description || '',
        time: transaction.time ? new Date(transaction.time).toISOString() : new Date().toISOString(),
        amount: transaction.amount,
        category: transaction.category || '',
        account: transaction.account || ''
      };

      // Call the API using the correct method name
      const id = await window.api.createTransaction(apiTransaction);
      console.log('Transaction added with ID:', id);

      // Update local state (optional, can be refreshed from DB)
      const newTransaction: Transaction = {
        ...transaction,
        id: id.toString()
      };
      transactions.value.push(newTransaction);
      return true;
    } catch (error) {
      console.error('Failed to add transaction:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const resetForm = (): void => {
    // Reset form values if needed
    isFormValid.value = false;
  };

  return {
    isFormValid,
    submitCount,
    transactions,
    isLoading,
    validateAndSubmit,
    addTransaction,
    resetForm,
    setLoading
  };
});
