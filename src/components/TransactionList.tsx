'use client'

import * as React from 'react';
import { Delete as TrashIcon, LocalOffer as TagIcon } from '@mui/icons-material';
import { Box, Card, CardContent, Typography, IconButton, Stack, Chip } from '@mui/material';
import { Transaction } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  compact?: boolean;
}

export function TransactionList({ transactions, onDelete, compact = false }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <Box textAlign="center" py={6} color="text.secondary">
        <Typography variant="h6" gutterBottom>No transactions yet</Typography>
        <Typography variant="body2">Add your first transaction to get started!</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2} pt={compact ? 2 : 4}>
      {transactions.map((transaction) => (
        <Card key={transaction.id} sx={{ borderRadius: 3, boxShadow: 3, bgcolor: compact ? 'grey.800' : 'background.paper', color: 'text.primary' }}>
          <CardContent sx={{ p: compact ? 2 : 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant={compact ? 'subtitle1' : 'h6'} fontWeight={600} noWrap>
                {transaction.description}
              </Typography>
              <Typography
                variant={compact ? 'subtitle1' : 'h6'}
                fontWeight={700}
                color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                sx={{ ml: 2 }}
              >
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2} mt={1}>
              <Chip
                label={transaction.category}
                color={transaction.type === 'income' ? 'success' : 'error'}
                size="small"
                sx={{ fontWeight: 600 }}
              />
              <Typography variant="body2" color="text.secondary">
                {formatDate(transaction.date)}
              </Typography>
              {transaction.tags && transaction.tags.length > 0 && (
                <>
                  <TagIcon sx={{ fontSize: 16, ml: 1, color: 'action.active' }} />
                  <Typography variant="caption" color="text.secondary">
                    {transaction.tags.join(', ')}
                  </Typography>
                </>
              )}
              <Box flexGrow={1} />
              <IconButton onClick={() => onDelete(transaction.id)} color="error" size="small">
                <TrashIcon fontSize="small" />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
