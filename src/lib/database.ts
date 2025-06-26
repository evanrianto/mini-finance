import { Transaction, FinancialSummary } from '@/types';

const STORAGE_KEY = 'mini-finance-transactions';

export class DatabaseService {
  private getTransactions(): Transaction[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading transactions:', error);
      return [];
    }
  }

  private saveTransactions(transactions: Transaction[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  }

  async addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<string> {
    const transactions = this.getTransactions();
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    
    transactions.unshift(newTransaction);
    this.saveTransactions(transactions);
    return newTransaction.id;
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return this.getTransactions().sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime() ||
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async deleteTransaction(id: string): Promise<void> {
    const transactions = this.getTransactions();
    const filteredTransactions = transactions.filter(t => t.id !== id);
    this.saveTransactions(filteredTransactions);
  }

  async getSummary(): Promise<FinancialSummary> {
    const transactions = this.getTransactions();
    
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income,
      expenses,
      balance: income - expenses,
    };
  }

  async getTransactionsByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    const transactions = this.getTransactions();
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return transactionDate >= start && transactionDate <= end;
    });
  }

  async getCategoryTotals(): Promise<Array<{ category: string; total: number }>> {
    const transactions = this.getTransactions();
    const categoryTotals: Record<string, number> = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });
    
    return Object.entries(categoryTotals)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  }

  async getMonthlyData(year: number = new Date().getFullYear()): Promise<Array<{
    month: number;
    type: string;
    total: number;
  }>> {
    const transactions = this.getTransactions();
    const monthlyData: Record<string, number> = {};
    
    transactions
      .filter(t => new Date(t.date).getFullYear() === year)
      .forEach(t => {
        const month = new Date(t.date).getMonth() + 1;
        const key = `${month}-${t.type}`;
        monthlyData[key] = (monthlyData[key] || 0) + t.amount;
      });
    
    const result: Array<{ month: number; type: string; total: number }> = [];
    
    for (let month = 1; month <= 12; month++) {
      result.push(
        { month, type: 'income', total: monthlyData[`${month}-income`] || 0 },
        { month, type: 'expense', total: monthlyData[`${month}-expense`] || 0 }
      );
    }
    
    return result;
  }

  async getDailyData(days: number = 7): Promise<Array<{
    date: string;
    type: string;
    total: number;
  }>> {
    const transactions = this.getTransactions();
    const dailyData: Record<string, number> = {};
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days + 1);
    
    // Initialize all days with 0 values
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      dailyData[`${dateStr}-income`] = 0;
      dailyData[`${dateStr}-expense`] = 0;
    }
    
    transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      })
      .forEach(t => {
        const key = `${t.date}-${t.type}`;
        dailyData[key] = (dailyData[key] || 0) + t.amount;
      });
    
    const result: Array<{ date: string; type: string; total: number }> = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      result.push(
        { date: dateStr, type: 'income', total: dailyData[`${dateStr}-income`] },
        { date: dateStr, type: 'expense', total: dailyData[`${dateStr}-expense`] }
      );
    }
    
    return result;
  }
}

export const databaseService = new DatabaseService();
