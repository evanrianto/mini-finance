export interface Transaction {
  id: string
  amount: number
  description: string
  category: string
  type: 'income' | 'expense'
  date: Date
  tags?: string[]
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  type: 'income' | 'expense'
}

export interface MonthlyData {
  month: string
  income: number
  expenses: number
  net: number
}

export interface CategorySpending {
  category: string
  amount: number
  percentage: number
  color: string
}

export interface DashboardStats {
  totalIncome: number
  totalExpenses: number
  netIncome: number
  currentMonthIncome: number
  currentMonthExpenses: number
  previousMonthIncome: number
  previousMonthExpenses: number
}
