import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ITransaction } from '@renderer/types/transaction';

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

  const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<void> => {
    try {
      // Convert timestamp to Date for the API
      const apiTransaction: Omit<ITransaction, 'id'> = {
        name: transaction.name,
        description: transaction.description,
        time: transaction.time ? new Date(transaction.time) : new Date(),
        amount: transaction.amount,
        category: transaction.category || '',
        account: transaction.account || ''
      };

      // Call the API
      const id = await window.api.addTransaction(apiTransaction);
      console.log('Transaction added with ID:', id);

      // Update local state (optional, can be refreshed from DB)
      const newTransaction: Transaction = {
        ...transaction,
        id: id.toString()
      };
      transactions.value.push(newTransaction);
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  return {
    isFormValid,
    submitCount,
    transactions,
    validateAndSubmit,
    addTransaction
  };
});
