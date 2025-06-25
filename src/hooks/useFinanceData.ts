'use client'

import { useState, useEffect } from 'react'
import { Transaction, DashboardStats, MonthlyData, CategorySpending } from '@/lib/types'
import { getMonthName } from '@/lib/utils'

export function useFinanceData() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('finance-transactions')
    if (stored) {
      try {
        const parsed = JSON.parse(stored).map((t: any) => ({
          ...t,
          date: new Date(t.date)
        }))
        setTransactions(parsed)
      } catch (error) {
        console.error('Error loading transactions:', error)
      }
    } else {
      // Add some sample data for demo
      const sampleTransactions: Transaction[] = [
        {
          id: '1',
          amount: 5000,
          description: 'Salary',
          category: 'Salary',
          type: 'income',
          date: new Date(2024, 5, 1),
          tags: ['work']
        },
        {
          id: '2',
          amount: 1200,
          description: 'Rent',
          category: 'Housing',
          type: 'expense',
          date: new Date(2024, 5, 1),
          tags: ['monthly', 'fixed']
        },
        {
          id: '3',
          amount: 300,
          description: 'Groceries',
          category: 'Food',
          type: 'expense',
          date: new Date(2024, 5, 5),
          tags: ['essential']
        },
        {
          id: '4',
          amount: 150,
          description: 'Gas',
          category: 'Transportation',
          type: 'expense',
          date: new Date(2024, 5, 8),
          tags: ['car']
        },
        {
          id: '5',
          amount: 500,
          description: 'Freelance Project',
          category: 'Freelance',
          type: 'income',
          date: new Date(2024, 5, 15),
          tags: ['side-income']
        }
      ]
      setTransactions(sampleTransactions)
    }
  }, [])

  // Save to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('finance-transactions', JSON.stringify(transactions))
  }, [transactions])

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    }
    setTransactions(prev => [newTransaction, ...prev])
  }

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  const getStats = (): DashboardStats => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const currentMonthIncome = transactions
      .filter(t => t.type === 'income' && 
        t.date.getMonth() === currentMonth && 
        t.date.getFullYear() === currentYear)
      .reduce((sum, t) => sum + t.amount, 0)

    const currentMonthExpenses = transactions
      .filter(t => t.type === 'expense' && 
        t.date.getMonth() === currentMonth && 
        t.date.getFullYear() === currentYear)
      .reduce((sum, t) => sum + t.amount, 0)

    const previousMonthIncome = transactions
      .filter(t => t.type === 'income' && 
        t.date.getMonth() === previousMonth && 
        t.date.getFullYear() === previousYear)
      .reduce((sum, t) => sum + t.amount, 0)

    const previousMonthExpenses = transactions
      .filter(t => t.type === 'expense' && 
        t.date.getMonth() === previousMonth && 
        t.date.getFullYear() === previousYear)
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      currentMonthIncome,
      currentMonthExpenses,
      previousMonthIncome,
      previousMonthExpenses
    }
  }

  const getMonthlyData = (): MonthlyData[] => {
    const monthlyMap = new Map<string, { income: number; expenses: number }>()

    transactions.forEach(transaction => {
      const monthKey = `${transaction.date.getFullYear()}-${transaction.date.getMonth()}`
      const existing = monthlyMap.get(monthKey) || { income: 0, expenses: 0 }
      
      if (transaction.type === 'income') {
        existing.income += transaction.amount
      } else {
        existing.expenses += transaction.amount
      }
      
      monthlyMap.set(monthKey, existing)
    })

    return Array.from(monthlyMap.entries())
      .map(([monthKey, data]) => {
        const [year, month] = monthKey.split('-').map(Number)
        return {
          month: getMonthName(new Date(year, month)),
          income: data.income,
          expenses: data.expenses,
          net: data.income - data.expenses
        }
      })
      .sort((a, b) => {
        const dateA = new Date(a.month + ' 1, 2024')
        const dateB = new Date(b.month + ' 1, 2024')
        return dateA.getTime() - dateB.getTime()
      })
  }

  const getCategorySpending = (): CategorySpending[] => {
    const categoryMap = new Map<string, number>()
    const expenses = transactions.filter(t => t.type === 'expense')
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0)

    expenses.forEach(transaction => {
      const existing = categoryMap.get(transaction.category) || 0
      categoryMap.set(transaction.category, existing + transaction.amount)
    })

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000', '#00ff00']
    
    return Array.from(categoryMap.entries())
      .map(([category, amount], index) => ({
        category,
        amount,
        percentage: (amount / totalExpenses) * 100,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.amount - a.amount)
  }

  return {
    transactions: transactions.sort((a, b) => b.date.getTime() - a.date.getTime()),
    addTransaction,
    deleteTransaction,
    getStats,
    getMonthlyData,
    getCategorySpending
  }
}
