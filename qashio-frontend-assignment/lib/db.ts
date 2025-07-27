import { join } from 'path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { v4 as uuidv4 } from 'uuid';

// Define the transaction interface
export interface Transaction {
  id: string;
  date: string;
  reference: string;
  counterparty: string;
  amount: number;
  status: string;
  category: string;
  narration: string;
}

// Query filters interface
export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof Transaction;
  sortOrder?: 'asc' | 'desc';
}

// Type for the database
interface DatabaseSchema {
  transactions: Transaction[];
}

// Create file path for the database
const file = join(process.cwd(), 'data', 'db.json');

// Create database adapter
const adapter = new JSONFile<DatabaseSchema>(file);

// Create database instance with an empty transactions array as default
// The actual data will be loaded from db.json if it exists
const db = new Low<DatabaseSchema>(adapter, { transactions: [] });

// Initialize the database
const initDb = async () => {
  await db.read();
  
  // If db.data or transactions doesn't exist, initialize with empty array
  if (!db.data) {
    db.data = { transactions: [] };
    await db.write();
  }

  return db;
};

// Transaction CRUD operations
export const transactionService = {
  // Get all transactions
  getAll: async () => {
    const database = await initDb();
    return database.data.transactions;
  },

  // Get transaction by ID
  getById: async (id: string) => {
    const database = await initDb();
    return database.data.transactions.find(transaction => transaction.id === id);
  },

  // Query transactions with filters, pagination and sorting
  query: async (filters: TransactionFilters) => {
    const database = await initDb();
    let result = [...database.data.transactions];
    
    // Apply date range filter
    if (filters.startDate) {
      result = result.filter(t => new Date(t.date) >= new Date(filters.startDate!));
    }
    
    if (filters.endDate) {
      result = result.filter(t => new Date(t.date) <= new Date(filters.endDate!));
    }
    
    // Apply search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(t => 
        t.reference.toLowerCase().includes(term) || 
        t.counterparty.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    if (filters.sortBy) {
      const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;
      result = result.sort((a, b) => {
        const aValue = a[filters.sortBy!];
        const bValue = b[filters.sortBy!];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder * aValue.localeCompare(bValue);
        }
        
        // @ts-ignore - We know these values are comparable
        return sortOrder * (aValue > bValue ? 1 : aValue < bValue ? -1 : 0);
      });
    }
    
    // Calculate pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = result.length;
    
    // Return pagination metadata along with results
    return {
      data: result.slice(startIndex, endIndex),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  // Create a new transaction
  create: async (transaction: Omit<Transaction, 'id'>) => {
    const database = await initDb();
    const newTransaction = {
      id: uuidv4(),
      ...transaction
    };
    
    database.data.transactions.push(newTransaction);
    await database.write();
    
    return newTransaction;
  },

  // Update a transaction
  update: async (id: string, data: Partial<Omit<Transaction, 'id'>>) => {
    const database = await initDb();
    const index = database.data.transactions.findIndex(transaction => transaction.id === id);
    
    if (index === -1) {
      return null;
    }
    
    const updatedTransaction = {
      ...database.data.transactions[index],
      ...data
    };
    
    database.data.transactions[index] = updatedTransaction;
    await database.write();
    
    return updatedTransaction;
  },

  // Delete a transaction
  delete: async (id: string) => {
    const database = await initDb();
    const index = database.data.transactions.findIndex(transaction => transaction.id === id);
    
    if (index === -1) {
      return false;
    }
    
    database.data.transactions.splice(index, 1);
    await database.write();
    
    return true;
  }
}; 