'use client'

import * as React from 'react';
import { useState } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Typography, Tabs, Tab, Container } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { AnalyticsCharts } from '@/components/AnalyticsCharts';
import { StatsCards } from '@/components/StatsCards';
import { useFinanceData } from '@/hooks/useFinanceData';

export default function Home() {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    getStats,
    getMonthlyData,
    getCategorySpending
  } = useFinanceData();

  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const stats = getStats();
  const monthlyData = getMonthlyData();
  const categorySpending = getCategorySpending();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachMoneyIcon color="success" sx={{ fontSize: 40 }} />
              <Typography variant="h3" fontWeight={700}>
                Personal Finance
              </Typography>
            </Box>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
              Track your income and expenses with elegance
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
            sx={{ fontWeight: 600, px: 3, py: 1.5, fontSize: 16 }}
          >
            Add Transaction
          </Button>
        </Box>

        {/* Navigation */}
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 4 }}
        >
          <Tab label="Overview" />
          <Tab label="Transactions" />
          <Tab label="Analytics" />
        </Tabs>

        {/* Main Content */}
        <Box sx={{ mt: 2 }}>
          {activeTab === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <StatsCards stats={stats} />
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
                <Card sx={{ flex: 1 }}>
                  <CardHeader
                    title={<Typography variant="h6">Recent Transactions</Typography>}
                    subheader={<Typography color="text.secondary">Your latest financial activity</Typography>}
                  />
                  <CardContent>
                    <TransactionList
                      transactions={transactions.slice(0, 5)}
                      onDelete={deleteTransaction}
                      compact
                    />
                  </CardContent>
                </Card>
                <Card sx={{ flex: 1 }}>
                  <CardHeader
                    title={<Typography variant="h6">Monthly Trend</Typography>}
                    subheader={<Typography color="text.secondary">Income vs Expenses over time</Typography>}
                  />
                  <CardContent>
                    <Box sx={{ height: 260 }}>
                      <AnalyticsCharts
                        monthlyData={monthlyData.slice(-6)}
                        categorySpending={[]}
                        type="line"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          )}

          {activeTab === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4" fontWeight={700}>
                  All Transactions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {transactions.length} transactions total
                </Typography>
              </Box>
              <Card>
                <CardContent>
                  <TransactionList
                    transactions={transactions}
                    onDelete={deleteTransaction}
                  />
                </CardContent>
              </Card>
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Typography variant="h4" fontWeight={700} mb={2}>
                Financial Analytics
              </Typography>
              <AnalyticsCharts
                monthlyData={monthlyData}
                categorySpending={categorySpending}
                type="mixed"
              />
            </Box>
          )}
        </Box>

        {/* Transaction Form Modal */}
        {showForm && (
          <TransactionForm
            onSubmit={(transaction) => {
              addTransaction(transaction);
              setShowForm(false);
            }}
            onClose={() => setShowForm(false)}
          />
        )}
      </Container>
    </Box>
  );
}
