"use client";

import React from "react";
import { Card, CardContent, Typography, Grid, Box, Avatar, useTheme } from "@mui/material";
import { TrendingUp, TrendingDown, AccountBalanceWallet, Warning } from "@mui/icons-material";
import { FinancialSummary } from "@/types";

interface FinancialSummaryProps {
  summary: FinancialSummary;
}

const FinancialSummaryComponent: React.FC<FinancialSummaryProps> = ({ summary }) => {
  const theme = useTheme();

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return theme.palette.success.main;
    if (balance < 0) return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  const summaryCards = [
    {
      title: "Total Income",
      amount: summary.income,
      icon: TrendingUp,
      color: theme.palette.success.main,
      bgColor: theme.palette.success.light + "20",
    },
    {
      title: "Total Expenses",
      amount: summary.expenses,
      icon: TrendingDown,
      color: theme.palette.error.main,
      bgColor: theme.palette.error.light + "20",
    },
    {
      title: "Net Balance",
      amount: summary.balance,
      icon: summary.balance >= 0 ? AccountBalanceWallet : Warning,
      color: getBalanceColor(summary.balance),
      bgColor: getBalanceColor(summary.balance) + "20",
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
        Financial Overview
      </Typography>

      <Grid container spacing={3}>
        {summaryCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Grid key={index} size={{ xs: 12, md: 4 }} component="div">
              <Card
                sx={{
                  height: "100%",
                  background: `linear-gradient(135deg, ${card.bgColor} 0%, ${theme.palette.background.paper} 100%)`,
                  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                        sx={{ fontWeight: 500 }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        variant="h4"
                        component="div"
                        sx={{
                          fontWeight: 700,
                          color: card.color,
                          lineHeight: 1.2,
                        }}
                      >
                        {formatCurrency(card.amount)}
                      </Typography>
                    </Box>

                    <Avatar
                      sx={{
                        bgcolor: card.color,
                        width: 56,
                        height: 56,
                        boxShadow: theme.shadows[4],
                      }}
                    >
                      <IconComponent sx={{ fontSize: 28 }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default FinancialSummaryComponent;
