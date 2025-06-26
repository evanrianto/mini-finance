'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Fab,
  Snackbar,
  Alert,
  Container,
  useMediaQuery,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Add,
} from '@mui/icons-material';
import { lightTheme, darkTheme } from '@/lib/theme';
import { databaseService } from '@/lib/database';
import FinancialSummary from '@/components/FinancialSummary';
import FinancialCharts from '@/components/FinancialCharts';
import TransactionList from '@/components/TransactionList';
import AddTransactionModal from '@/components/AddTransactionModal';
import { Transaction, FinancialSummary as FinancialSummaryType } from '@/types';

export default function Home() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<FinancialSummaryType>({
    income: 0,
    expenses: 0,
    balance: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [loading, setLoading] = useState(true);

  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    setIsDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [transactionsData, summaryData] = await Promise.all([
        databaseService.getAllTransactions(),
        databaseService.getSummary(),
      ]);
      setTransactions(transactionsData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to load data:', error);
      showSnackbar('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddTransaction = async (transaction: Parameters<typeof databaseService.addTransaction>[0]) => {
    try {
      await databaseService.addTransaction(transaction);
      await loadData();
      showSnackbar(`${transaction.type === 'income' ? 'Income' : 'Expense'} added successfully`, 'success');
    } catch (error) {
      console.error('Failed to add transaction:', error);
      throw error;
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await databaseService.deleteTransaction(id);
      await loadData();
      showSnackbar('Transaction deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      showSnackbar('Failed to delete transaction', 'error');
    }
  };


  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.default',
          }}
        >
          <Typography variant="h4" color="text.primary">
            Loading...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* App Bar */}
        <AppBar position="sticky" elevation={1} sx={{ backgroundColor: 'background.paper' }}>
          <Toolbar>
            <Typography variant="h5" component="h1" sx={{ flexGrow: 1, fontWeight: 700, color: 'primary.main' }}>
              💰 MiniFinance
            </Typography>
            <IconButton onClick={toggleTheme} color="inherit">
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Main Content with 16:9 Aspect Ratio Container */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            p: 2,
          }}
        >
          <Container
            maxWidth={false}
            sx={{
              maxWidth: '1600px', // 16:9 aspect ratio for large screens
              width: '100%',
              aspectRatio: { lg: '16/9' },
              maxHeight: { lg: '90vh' },
              overflow: 'auto',
              backgroundColor: 'background.paper',
              borderRadius: 3,
              boxShadow: theme.shadows[4],
              p: 0,
            }}
          >
            <Box
              sx={{
                height: '100%',
                overflow: 'auto',
                p: 3,
              }}
            >
              {/* Financial Summary */}
              <FinancialSummary summary={summary} />

              {/* Financial Charts */}
              <FinancialCharts transactions={transactions} isDarkMode={isDarkMode} />

              {/* Transaction List */}
              <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
            </Box>
          </Container>
        </Box>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
          onClick={() => setModalOpen(true)}
        >
          <Add />
        </Fab>

        {/* Add Transaction Modal */}
        <AddTransactionModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onAdd={handleAddTransaction}
        />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
