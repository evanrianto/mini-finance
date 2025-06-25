'use client'

import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MonthlyData, CategorySpending } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { PieLabelRenderProps } from 'recharts'

interface AnalyticsChartsProps {
  monthlyData: MonthlyData[]
  categorySpending: CategorySpending[]
  type: 'line' | 'mixed'
}

function renderPieLabel(props: PieLabelRenderProps) {
  const cx = typeof props.cx === 'number' ? props.cx : 0;
  const cy = typeof props.cy === 'number' ? props.cy : 0;
  const midAngle = typeof props.midAngle === 'number' ? props.midAngle : 0;
  const outerRadius = typeof props.outerRadius === 'number' ? props.outerRadius : 0;
  const percent = typeof props.percent === 'number' ? props.percent : 0;
  const payload = props.payload || {};
  const RADIAN = Math.PI / 180;
  const category = payload.category ?? '';
  const percentage = payload.percentage ?? percent * 100;
  // If 100% or nearly so, always anchor to the right of the pie
  if (percentage > 99.9) {
    return (
      <text
        x={cx + outerRadius + 48}
        y={cy}
        fill="#f3f4f6"
        textAnchor="start"
        dominantBaseline="central"
        fontWeight={700}
        fontSize={16}
        style={{ textShadow: '0 1px 4px #18181b' }}
      >
        {`${category} (${percentage.toFixed(1)}%)`}
      </text>
    );
  }
  // Otherwise, position label outside the pie
  const radius = outerRadius + 24;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#f3f4f6"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontWeight={600}
      fontSize={14}
      style={{ textShadow: '0 1px 4px #18181b' }}
    >
      {`${category} (${percentage.toFixed(1)}%)`}
    </text>
  );
}

export function AnalyticsCharts({ monthlyData, categorySpending, type }: AnalyticsChartsProps) {
  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={monthlyData} margin={{ top: 24, right: 32, left: 8, bottom: 24 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fill: '#f3f4f6', fontWeight: 600, fontSize: 14 }} />
          <YAxis tickFormatter={(value) => formatCurrency(value)} tick={{ fill: '#f3f4f6', fontWeight: 600, fontSize: 14 }} />
          <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ background: '#23272f', color: '#f3f4f6', border: '1px solid #3b4252' }} />
          <Legend wrapperStyle={{ color: '#f3f4f6', fontWeight: 600 }} />
          <Line 
            type="monotone" 
            dataKey="income" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Income"
          />
          <Line 
            type="monotone" 
            dataKey="expenses" 
            stroke="#ef4444" 
            strokeWidth={2}
            name="Expenses"
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Trend */}
      <Card className="dark:bg-card-polished dark:text-polished border-polished">
        <CardHeader className="dark:text-polished">
          <CardTitle className="dark:text-polished">Monthly Income vs Expenses</CardTitle>
          <CardDescription className="dark:text-muted-polished">Track your financial flow over time</CardDescription>
        </CardHeader>
        <CardContent className="dark:text-polished">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 24, right: 32, left: 8, bottom: 24 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: '#f3f4f6', fontWeight: 600, fontSize: 14 }} />
                <YAxis tickFormatter={(value) => formatCurrency(value)} tick={{ fill: '#f3f4f6', fontWeight: 600, fontSize: 14 }} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ background: '#23272f', color: '#f3f4f6', border: '1px solid #3b4252' }} />
                <Legend wrapperStyle={{ color: '#f3f4f6', fontWeight: 600 }} />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Income"
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Expenses"
                />
                <Line 
                  type="monotone" 
                  dataKey="net" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Net Income"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      {categorySpending.length > 0 && (
        <Card className="dark:bg-card-polished dark:text-polished border-polished">
          <CardHeader className="dark:text-polished">
            <CardTitle className="dark:text-polished">Expense Categories</CardTitle>
            <CardDescription className="dark:text-muted-polished">Breakdown of your spending by category</CardDescription>
          </CardHeader>
          <CardContent className="dark:text-polished">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySpending}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={renderPieLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {categorySpending.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ background: '#23272f', color: '#f3f4f6', border: '1px solid #3b4252' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monthly Bar Chart */}
      {monthlyData.length > 0 && (
        <Card className="lg:col-span-2 dark:bg-card-polished dark:text-polished border-polished">
          <CardHeader className="dark:text-polished">
            <CardTitle className="dark:text-polished">Monthly Comparison</CardTitle>
            <CardDescription className="dark:text-muted-polished">Compare income and expenses month by month</CardDescription>
          </CardHeader>
          <CardContent className="dark:text-polished">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 24, right: 32, left: 8, bottom: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fill: '#f3f4f6', fontWeight: 600, fontSize: 14 }} />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} tick={{ fill: '#f3f4f6', fontWeight: 600, fontSize: 14 }} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ background: '#23272f', color: '#f3f4f6', border: '1px solid #3b4252' }} />
                  <Legend wrapperStyle={{ color: '#f3f4f6', fontWeight: 600 }} />
                  <Bar dataKey="income" fill="#10b981" name="Income" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Spending List */}
      {categorySpending.length > 0 && (
        <Card className="dark:bg-card-polished dark:text-polished border-polished">
          <CardHeader className="dark:text-polished">
            <CardTitle className="dark:text-polished">Top Spending Categories</CardTitle>
            <CardDescription className="dark:text-muted-polished">Your biggest expense categories</CardDescription>
          </CardHeader>
          <CardContent className="dark:text-polished">
            <div className="space-y-4">
              {categorySpending.slice(0, 5).map((category) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium dark:text-polished">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold dark:text-polished">{formatCurrency(category.amount)}</div>
                    <div className="text-sm text-gray-500 dark:text-muted-polished">{category.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
