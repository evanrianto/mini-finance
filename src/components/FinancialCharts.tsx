"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { BarChart, PieChart, TrendingUp } from "@mui/icons-material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Transaction } from "@/types";
import { chartColors } from "@/lib/theme";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface FinancialChartsProps {
  transactions: Transaction[];
  isDarkMode: boolean;
}

const FinancialCharts: React.FC<FinancialChartsProps> = ({ transactions, isDarkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeChart, setActiveChart] = useState<"daily" | "monthly" | "categories">("daily");

  const colors = chartColors[isDarkMode ? "dark" : "light"];

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  };

  const commonPluginOptions = {
    legend: {
      position: "top" as const,
      labels: {
        color: theme.palette.text.primary,
        font: {
          size: 12,
          weight: 500,
        },
      },
    },
    tooltip: {
      backgroundColor: theme.palette.background.paper,
      titleColor: theme.palette.text.primary,
      bodyColor: theme.palette.text.primary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      cornerRadius: 8,
      callbacks: {
        label: (context: { parsed: { y?: number }; dataset: { label?: string } }) => {
          const value = context.parsed.y || 0;
          return `${context.dataset.label}: ${formatCurrency(value)}`;
        },
      },
    },
  };

  const piePluginOptions = {
    legend: {
      position: "top" as const,
      labels: {
        color: theme.palette.text.primary,
        font: {
          size: 12,
          weight: 500,
        },
      },
    },
    tooltip: {
      backgroundColor: theme.palette.background.paper,
      titleColor: theme.palette.text.primary,
      bodyColor: theme.palette.text.primary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      cornerRadius: 8,
      callbacks: {
        label: (context: { parsed: number; label: string }) => {
          const value = context.parsed;
          return `${context.label}: ${formatCurrency(value)}`;
        },
      },
    },
  };

  const commonScaleOptions = {
    x: {
      ticks: {
        color: theme.palette.text.secondary,
        font: { size: 11 },
      },
      grid: {
        color: theme.palette.divider + "40",
      },
    },
    y: {
      ticks: {
        color: theme.palette.text.secondary,
        font: { size: 11 },
        callback: (value: string | number) => formatCurrency(Number(value)),
      },
      grid: {
        color: theme.palette.divider + "40",
      },
    },
  };

  const getDailyData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split("T")[0];
    });

    const dailyIncome = last7Days.map((day) =>
      transactions
        .filter((t) => t.type === "income" && t.date === day)
        .reduce((sum, t) => sum + t.amount, 0)
    );

    const dailyExpenses = last7Days.map((day) =>
      transactions
        .filter((t) => t.type === "expense" && t.date === day)
        .reduce((sum, t) => sum + t.amount, 0)
    );

    return {
      labels: last7Days.map((day) => {
        const date = new Date(day);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [
        {
          label: "Income",
          data: dailyIncome,
          borderColor: colors.income,
          backgroundColor: colors.income + "20",
          borderWidth: 3,
          tension: 0.4,
        },
        {
          label: "Expenses",
          data: dailyExpenses,
          borderColor: colors.expense,
          backgroundColor: colors.expense + "20",
          borderWidth: 3,
          tension: 0.4,
        },
      ],
    };
  }, [transactions, colors]);

  const getMonthlyData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return {
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        label: date.toLocaleDateString("en-US", { month: "short" }),
      };
    });

    const monthlyIncome = months.map(({ month, year }) =>
      transactions
        .filter((t) => {
          const tDate = new Date(t.date);
          return (
            t.type === "income" && tDate.getMonth() + 1 === month && tDate.getFullYear() === year
          );
        })
        .reduce((sum, t) => sum + t.amount, 0)
    );

    const monthlyExpenses = months.map(({ month, year }) =>
      transactions
        .filter((t) => {
          const tDate = new Date(t.date);
          return (
            t.type === "expense" && tDate.getMonth() + 1 === month && tDate.getFullYear() === year
          );
        })
        .reduce((sum, t) => sum + t.amount, 0)
    );

    return {
      labels: months.map((m) => m.label),
      datasets: [
        {
          label: "Income",
          data: monthlyIncome,
          backgroundColor: colors.income,
          borderColor: colors.income,
          borderWidth: 1,
        },
        {
          label: "Expenses",
          data: monthlyExpenses,
          backgroundColor: colors.expense,
          borderColor: colors.expense,
          borderWidth: 1,
        },
      ],
    };
  }, [transactions, colors]);

  const getCategoryData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const category = t.category || "Other";
        categoryTotals[category] = (categoryTotals[category] || 0) + t.amount;
      });

    const sortedCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8);

    return {
      labels: sortedCategories.map(([name]) =>
        name.length > 12 ? `${name.substring(0, 12)}...` : name
      ),
      datasets: [
        {
          data: sortedCategories.map(([, amount]) => amount),
          backgroundColor: colors.categories,
          borderColor: colors.categories.map((color) => color + "CC"),
          borderWidth: 2,
        },
      ],
    };
  }, [transactions, colors]);

  const renderChart = () => {
    const hasData = transactions.length > 0;

    if (!hasData) {
      return (
        <Box
          sx={{
            height: 300,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "text.secondary",
            backgroundColor: "background.default",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            No transaction data available
          </Typography>
          <Typography variant="body2">Add some transactions to see charts</Typography>
        </Box>
      );
    }

    const chartHeight = isMobile ? 250 : 300;

    switch (activeChart) {
      case "daily":
        return (
          <Box sx={{ height: chartHeight }}>
            <Line
              data={getDailyData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: commonPluginOptions,
                scales: commonScaleOptions,
              }}
            />
          </Box>
        );

      case "monthly":
        return (
          <Box sx={{ height: chartHeight }}>
            <Bar
              data={getMonthlyData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: commonPluginOptions,
                scales: commonScaleOptions,
              }}
            />
          </Box>
        );

      case "categories":
        if (getCategoryData.labels.length === 0) {
          return (
            <Box
              sx={{
                height: chartHeight,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "text.secondary",
                backgroundColor: "background.default",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6">No expense categories found</Typography>
            </Box>
          );
        }

        return (
          <Box sx={{ height: chartHeight }}>
            <Pie
              data={getCategoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: piePluginOptions,
              }}
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" component="h3" gutterBottom align="center" sx={{ mb: 3 }}>
          Financial Analytics
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <ToggleButtonGroup
            value={activeChart}
            exclusive
            onChange={(_, value) => value && setActiveChart(value)}
            size="small"
            sx={{
              "& .MuiToggleButton-root": {
                px: 2,
                py: 1,
                border: `1px solid ${theme.palette.divider}`,
                "&.Mui-selected": {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                },
              },
            }}
          >
            <ToggleButton value="daily">
              <TrendingUp sx={{ mr: 1, fontSize: 18 }} />
              Daily
            </ToggleButton>
            <ToggleButton value="monthly">
              <BarChart sx={{ mr: 1, fontSize: 18 }} />
              Monthly
            </ToggleButton>
            <ToggleButton value="categories">
              <PieChart sx={{ mr: 1, fontSize: 18 }} />
              Categories
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {renderChart()}

        {transactions.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 4,
              mt: 3,
              pt: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: colors.income,
                  borderRadius: "50%",
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Income
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: colors.expense,
                  borderRadius: "50%",
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Expenses
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialCharts;
