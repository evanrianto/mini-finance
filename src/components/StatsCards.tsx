'use client'

import * as React from 'react';
import { TrendingUp, TrendingDown, AttachMoney, AccountBalanceWallet } from '@mui/icons-material';
import { Card, CardContent, Typography, Box, Stack, Avatar } from '@mui/material';
import { DashboardStats } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const incomeChange = stats.previousMonthIncome
    ? ((stats.currentMonthIncome - stats.previousMonthIncome) / stats.previousMonthIncome) * 100
    : 0;
  const expenseChange = stats.previousMonthExpenses
    ? ((stats.currentMonthExpenses - stats.previousMonthExpenses) / stats.previousMonthExpenses) * 100
    : 0;

  const cards = [
    {
      title: 'Total Income',
      value: stats.totalIncome,
      icon: <TrendingUp color="success" />, // green
      color: 'success.main',
      change: incomeChange,
      isPositive: incomeChange >= 0
    },
    {
      title: 'Total Expenses',
      value: stats.totalExpenses,
      icon: <TrendingDown color="error" />, // red
      color: 'error.main',
      change: expenseChange,
      isPositive: expenseChange <= 0
    },
    {
      title: 'Net Income',
      value: stats.netIncome,
      icon: <AttachMoney color={stats.netIncome >= 0 ? 'success' : 'error'} />, // green or red
      color: stats.netIncome >= 0 ? 'success.main' : 'error.main',
      change: 0,
      isPositive: stats.netIncome >= 0
    },
    {
      title: 'This Month',
      value: stats.currentMonthIncome - stats.currentMonthExpenses,
      icon: <AccountBalanceWallet color={(stats.currentMonthIncome - stats.currentMonthExpenses) >= 0 ? 'primary' : 'error'} />, // blue or red
      color: (stats.currentMonthIncome - stats.currentMonthExpenses) >= 0 ? 'primary.main' : 'error.main',
      change: 0,
      isPositive: (stats.currentMonthIncome - stats.currentMonthExpenses) >= 0
    }
  ];

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} mb={3}>
      {cards.map((card) => (
        <Card key={card.title} sx={{ flex: 1, bgcolor: 'background.paper', color: 'text.primary', borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={600} mb={0.5}>
                  {card.title}
                </Typography>
                <Typography variant="h5" fontWeight={700} color={card.color}>
                  {formatCurrency(card.value)}
                </Typography>
                {card.change !== 0 && (
                  <Typography variant="caption" color={card.isPositive ? 'success.main' : 'error.main'}>
                    {card.isPositive ? '+' : '-'}{Math.abs(card.change).toFixed(1)}% from last month
                  </Typography>
                )}
              </Box>
              <Avatar sx={{ bgcolor: 'grey.100', color: card.color, width: 48, height: 48 }}>
                {card.icon}
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
