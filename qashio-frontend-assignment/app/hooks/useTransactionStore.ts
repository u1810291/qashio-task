'use client';

import { create } from 'zustand';
import { TransactionFilters } from '@/app/types';

// Define initial filter state
const initialFilters: TransactionFilters = {
  dateRange: {
    startDate: null,
    endDate: null,
  },
  searchTerm: '',
};

// Define store interface
interface TransactionState {
  filters: TransactionFilters;
  setDateRange: (startDate: Date | null, endDate: Date | null) => void;
  setSearchTerm: (term: string) => void;
  resetFilters: () => void;
}

// Create store with methods to update filters
export const useTransactionStore = create<TransactionState>((set) => ({
  filters: initialFilters,
  
  setDateRange: (startDate, endDate) => 
    set((state) => ({
      filters: {
        ...state.filters,
        dateRange: { startDate, endDate },
      },
    })),
    
  setSearchTerm: (searchTerm) => 
    set((state) => ({
      filters: {
        ...state.filters,
        searchTerm,
      },
    })),
    
  resetFilters: () => set({ filters: initialFilters }),
})); 