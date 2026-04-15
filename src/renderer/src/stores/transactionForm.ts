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
  categoryId?: number | null;
  accountId?: number | null;
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

  const addTransaction = async (transaction: Omit<Transaction, 'id'> & { categoryId?: number | null; accountId?: number | null }): Promise<boolean> => {
    isLoading.value = true;
    try {
      // Resolve categoryId
      let categoryId: number | null = transaction.categoryId ?? null;
      if (!categoryId && transaction.category) {
        try {
          const categories = (await window.api.getAllCategories()) as Array<{ id: number; name: string }>;
          const found = (categories || []).find((c) => String(c.name).toLowerCase() === String(transaction.category).toLowerCase());
          if (found) {
            categoryId = found.id;
          } else {
            // create new category and use returned id
            const created = await window.api.createCategory({ name: transaction.category, type: 'expense' });
            if (typeof created === 'number') categoryId = created;
            else {
              const createdRes = created as unknown as { lastInsertRowid?: number };
              if (createdRes && typeof createdRes.lastInsertRowid === 'number') categoryId = Number(createdRes.lastInsertRowid);
            }
          }
        } catch (e) {
          console.error('Failed to resolve categoryId, falling back to first category', e);
          const allCats = (await window.api.getAllCategories()) as Array<{ id: number; name: string }>;
          categoryId = allCats.length > 0 ? allCats[0].id : null;
        }
      }

      // Resolve accountId
      let accountId: number | null = transaction.accountId ?? null;
      if (!accountId && transaction.account) {
        try {
          const accounts = (await window.api.getAllAccounts()) as Array<{ id: number; name: string }>;
          const found = (accounts || []).find((a) => String(a.name).toLowerCase() === String(transaction.account).toLowerCase());
          if (found) {
            accountId = found.id;
          } else {
            const created = await window.api.createAccount({ name: transaction.account, type: 'general', balance: 0 });
            if (typeof created === 'number') accountId = created;
            else {
              const createdRes = created as unknown as { lastInsertRowid?: number };
              if (createdRes && typeof createdRes.lastInsertRowid === 'number') accountId = Number(createdRes.lastInsertRowid);
            }
          }
        } catch (e) {
          console.error('Failed to resolve accountId, falling back to first account', e);
          const allAccs = (await window.api.getAllAccounts()) as Array<{ id: number; name: string }>;
          accountId = allAccs.length > 0 ? allAccs[0].id : null;
        }
      }

      // Convert timestamp to ISO string for the API
      let timeIso: string;
      if (transaction.time) {
        const parsed = new Date(transaction.time as unknown as string | number);
        if (!isNaN(parsed.getTime())) {
          timeIso = parsed.toISOString();
        } else {
          // Fallback to current time if provided value is invalid
          timeIso = new Date().toISOString();
        }
      } else {
        timeIso = new Date().toISOString();
      }

      const apiTransaction: { name: string; description: string; time: string; amount: number; categoryId: number | null; accountId: number | null } = {
        name: transaction.name,
        description: transaction.description || '',
        time: timeIso as string,
        amount: transaction.amount,
        categoryId,
        accountId
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
