'use client'

import { TrendingUpIcon, TrendingDownIcon, DollarSignIcon, WalletIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { DashboardStats } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const incomeChange = stats.previousMonthIncome 
    ? ((stats.currentMonthIncome - stats.previousMonthIncome) / stats.previousMonthIncome) * 100
    : 0

  const expenseChange = stats.previousMonthExpenses
    ? ((stats.currentMonthExpenses - stats.previousMonthExpenses) / stats.previousMonthExpenses) * 100
    : 0

  const cards = [
    {
      title: 'Total Income',
      value: stats.totalIncome,
      icon: TrendingUpIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: incomeChange,
      isPositive: incomeChange >= 0
    },
    {
      title: 'Total Expenses',
      value: stats.totalExpenses,
      icon: TrendingDownIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: expenseChange,
      isPositive: expenseChange <= 0
    },
    {
      title: 'Net Income',
      value: stats.netIncome,
      icon: DollarSignIcon,
      color: stats.netIncome >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: stats.netIncome >= 0 ? 'bg-green-50' : 'bg-red-50',
      change: 0,
      isPositive: stats.netIncome >= 0
    },
    {
      title: 'This Month',
      value: stats.currentMonthIncome - stats.currentMonthExpenses,
      icon: WalletIcon,
      color: (stats.currentMonthIncome - stats.currentMonthExpenses) >= 0 ? 'text-blue-600' : 'text-red-600',
      bgColor: (stats.currentMonthIncome - stats.currentMonthExpenses) >= 0 ? 'bg-blue-50' : 'bg-red-50',
      change: 0,
      isPositive: (stats.currentMonthIncome - stats.currentMonthExpenses) >= 0
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {card.title}
                  </p>
                  <p className={`text-2xl font-bold ${card.color}`}>
                    {formatCurrency(card.value)}
                  </p>
                  {card.change !== 0 && (
                    <p className={`text-xs ${card.isPositive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                      {card.isPositive ? <TrendingUpIcon className="h-3 w-3 mr-1" /> : <TrendingDownIcon className="h-3 w-3 mr-1" />}
                      {Math.abs(card.change).toFixed(1)}% from last month
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
