'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Chip,
  useTheme,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Delete,
  ReceiptLong,
} from '@mui/icons-material';
import { Transaction } from '@/types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  const theme = useTheme();

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTransactionIcon = (type: 'income' | 'expense') => {
    return type === 'income' ? TrendingUp : TrendingDown;
  };

  const getTransactionColor = (type: 'income' | 'expense') => {
    return type === 'income' ? theme.palette.success.main : theme.palette.error.main;
  };

  const renderEmptyState = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        textAlign: 'center',
      }}
    >
      <ReceiptLong
        sx={{
          fontSize: 64,
          color: 'text.disabled',
          mb: 2,
        }}
      />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No Transactions Yet
      </Typography>
      <Typography variant="body2" color="text.disabled" sx={{ maxWidth: 300 }}>
        Start tracking your finances by adding your first income or expense transaction.
      </Typography>
    </Box>
  );

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom align="center">
            Recent Transactions
          </Typography>
          {renderEmptyState()}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography variant="h5" component="h2" align="center">
            Recent Transactions
          </Typography>
        </Box>
        
        <List sx={{ pt: 0 }}>
          {transactions.map((transaction, index) => {
            const IconComponent = getTransactionIcon(transaction.type);
            const color = getTransactionColor(transaction.type);
            
            return (
              <React.Fragment key={transaction.id}>
                <ListItem
                  sx={{
                    px: 3,
                    py: 2,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: color,
                        width: 48,
                        height: 48,
                      }}
                    >
                      <IconComponent />
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            mb: 0.5,
                          }}
                        >
                          {transaction.description}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: color,
                            ml: 2,
                          }}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(Math.abs(transaction.amount))}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Chip
                          label={transaction.category}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: 'divider',
                            color: 'text.secondary',
                            fontSize: '0.75rem',
                          }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 2 }}
                        >
                          {formatDate(transaction.date)}
                        </Typography>
                      </Box>
                    }
                  />
                  
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => onDelete(transaction.id)}
                      sx={{
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: 'error.light',
                          color: 'error.contrastText',
                        },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                
                {index < transactions.length - 1 && (
                  <Divider variant="inset" component="li" sx={{ ml: 9 }} />
                )}
              </React.Fragment>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
};

export default TransactionList;
