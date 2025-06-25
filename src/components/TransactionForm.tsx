'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Transaction } from '@/lib/types'

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void
  onClose: () => void
}

const categories = {
  income: ['Salary', 'Freelance', 'Investment', 'Business', 'Other Income'],
  expense: ['Housing', 'Food', 'Transportation', 'Healthcare', 'Entertainment', 'Shopping', 'Utilities', 'Other Expense']
}

export function TransactionForm({ onSubmit, onClose }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    type: 'expense' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0],
    tags: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.amount || !formData.description || !formData.category) {
      return
    }

    const transaction: Omit<Transaction, 'id'> = {
      amount: parseFloat(formData.amount),
      description: formData.description,
      category: formData.category,
      type: formData.type,
      date: new Date(formData.date),
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
    }

    onSubmit(transaction)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl w-full max-w-md p-8 relative shadow-3xl border border-gray-200/60 dark:border-gray-700/60">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Add Transaction
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: '' }))}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                formData.type === 'income'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800/30 dark:text-emerald-200 border-2 border-emerald-300 dark:border-emerald-600 shadow-md'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 border-2 border-transparent'
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: '' }))}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                formData.type === 'expense'
                  ? 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-200 border-2 border-red-300 dark:border-red-600 shadow-md'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 border-2 border-transparent'
              }`}
            >
              Expense
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Amount
            </label>
            <Input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0.00"
              className="w-full h-12 text-lg font-medium"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Description
            </label>
            <Input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description"
              className="w-full h-12"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full h-12 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100 text-base"
              required
            >
              <option value="">Select category</option>
              {categories[formData.type].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Date
            </label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full h-12"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Tags (optional)
            </label>
            <Input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="work, monthly, fixed (comma separated)"
              className="w-full h-12"
            />
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 text-base font-semibold border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`flex-1 h-12 text-base font-semibold ${
                formData.type === 'income'
                  ? 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600'
                  : 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600'
              }`}
            >
              Add {formData.type === 'income' ? 'Income' : 'Expense'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
