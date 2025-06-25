'use client'

import { useState, useEffect } from 'react'
import { Transaction, DashboardStats, MonthlyData, CategorySpending } from '@/lib/types'
import { getMonthName } from '@/lib/utils'

export function useFinanceData() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch transactions from API
  useEffect(() => {
    setLoading(true)
    fetch('/api/transactions')
      .then(res => res.json())
      .then(data => {
        setTransactions(
          data.map((t: any) => ({
            ...t,
            date: new Date(t.date),
            tags: t.tags ? t.tags.split(',').filter((tag: string) => tag) : [],
          }))
        )
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load transactions')
        setLoading(false)
      })
  }, [])

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...transaction,
        tags: transaction.tags?.join(',') || '',
      }),
    })
    const newTx = await res.json()
    setTransactions(prev => [{
      ...newTx,
      date: new Date(newTx.date),
      tags: newTx.tags ? newTx.tags.split(',').filter((tag: string) => tag) : [],
    }, ...prev])
  }

  const deleteTransaction = async (id: string) => {
    await fetch(`/api/transactions/${id}`, { method: 'DELETE' })
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
    getCategorySpending,
    loading,
    error,
  }
}
