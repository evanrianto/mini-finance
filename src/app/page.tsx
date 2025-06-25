'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, TrendingUpIcon, TrendingDownIcon, DollarSignIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TransactionForm } from '@/components/TransactionForm'
import { TransactionList } from '@/components/TransactionList'
import { AnalyticsCharts } from '@/components/AnalyticsCharts'
import { StatsCards } from '@/components/StatsCards'
import { useFinanceData } from '@/hooks/useFinanceData'
import { formatCurrency } from '@/lib/utils'

export default function Home() {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    getStats,
    getMonthlyData,
    getCategorySpending
  } = useFinanceData()
  
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  
  const stats = getStats()
  const monthlyData = getMonthlyData()
  const categorySpending = getCategorySpending()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container-16-9">
        {/* Header */}
        <header className="py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <DollarSignIcon className="h-8 w-8 text-green-600" />
                Personal Finance
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Track your income and expenses beautifully
              </p>
            </div>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </header>

        {/* Navigation */}
        <nav className="py-4">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'transactions', label: 'Transactions' },
              { id: 'analytics', label: 'Analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="py-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <StatsCards stats={stats} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your latest financial activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TransactionList 
                      transactions={transactions.slice(0, 5)} 
                      onDelete={deleteTransaction}
                      compact
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Trend</CardTitle>
                    <CardDescription>Income vs Expenses over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <AnalyticsCharts 
                        monthlyData={monthlyData.slice(-6)} 
                        categorySpending={[]} 
                        type="line"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  All Transactions
                </h2>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {transactions.length} transactions total
                </div>
              </div>
              <Card>
                <CardContent className="p-0">
                  <TransactionList 
                    transactions={transactions} 
                    onDelete={deleteTransaction}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Financial Analytics
              </h2>
              <AnalyticsCharts 
                monthlyData={monthlyData} 
                categorySpending={categorySpending}
                type="mixed"
              />
            </div>
          )}
        </main>

        {/* Transaction Form Modal */}
        {showForm && (
          <TransactionForm
            onSubmit={(transaction) => {
              addTransaction(transaction)
              setShowForm(false)
            }}
            onClose={() => setShowForm(false)}
          />
        )}
      </div>
    </div>
  )
}
