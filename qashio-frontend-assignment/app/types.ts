export interface Transaction {
  id: string;
  date: string;
  reference: string;
  counterparty: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  category: string;
  narration: string;
}

export type TransactionFormData = Omit<Transaction, 'id'>;

export interface TransactionFilters {
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  searchTerm: string;
} 