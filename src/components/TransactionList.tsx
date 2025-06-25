'use client'

import { Trash2Icon, TagIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Transaction } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'

interface TransactionListProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
  compact?: boolean
}

export function TransactionList({ transactions, onDelete, compact = false }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No transactions yet. Add your first transaction to get started!</p>
      </div>
    )
  }

  if (compact) {
    return (
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {transaction.description}
                </h3>
                <span
                  className={`font-bold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{transaction.category}</span>
                <span>•</span>
                <span>{formatDate(transaction.date)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <div className="space-y-2">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {transaction.description}
                </h3>
                <span
                  className={`text-lg font-bold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                    : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                }`}>
                  {transaction.category}
                </span>
                <span>{formatDate(transaction.date)}</span>
                {transaction.tags && transaction.tags.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <TagIcon className="h-3 w-3" />
                    <span>{transaction.tags.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(transaction.id)}
              className="ml-4 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
