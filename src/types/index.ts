export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  createdAt: string;
}

export interface FinancialSummary {
  income: number;
  expenses: number;
  balance: number;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface ThemeMode {
  mode: 'light' | 'dark';
}

export interface AddTransactionForm {
  type: 'income' | 'expense';
  amount: string;
  description: string;
  category: string;
  date: string;
}
