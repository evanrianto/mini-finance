"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Typography,
  Chip,
  IconButton,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Close,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Description,
  Category,
  DateRange,
} from "@mui/icons-material";
import { AddTransactionForm } from "@/types";

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (transaction: Omit<AddTransactionForm, "amount"> & { amount: number }) => Promise<void>;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ open, onClose, onAdd }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState<AddTransactionForm>({
    type: "expense",
    amount: "",
    description: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const commonCategories = {
    income: ["Salary", "Freelance", "Investment", "Business", "Gift", "Other"],
    expense: ["Food", "Transportation", "Shopping", "Bills", "Entertainment", "Health", "Other"],
  };

  const validateForm = (): boolean => {
    if (
      !formData.amount ||
      isNaN(parseFloat(formData.amount)) ||
      parseFloat(formData.amount) <= 0
    ) {
      setError("Please enter a valid amount");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Please enter a description");
      return false;
    }
    if (!formData.category.trim()) {
      setError("Please select or enter a category");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      await onAdd({
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        category: formData.category.trim(),
        date: formData.date,
      });
      handleClose();
    } catch {
      setError("Failed to add transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      type: "expense",
      amount: "",
      description: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
    });
    setError("");
    onClose();
  };

  const handleInputChange =
    (field: keyof AddTransactionForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      setError("");
    };

  const handleCategorySelect = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      category,
    }));
    setError("");
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          minHeight: isMobile ? "100vh" : "auto",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
        }}
      >
        <Typography variant="h5" component="span" fontWeight="600">
          Add Transaction
        </Typography>
        <IconButton onClick={handleClose} edge="end">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom color="text.secondary">
            Transaction Type
          </Typography>
          <ToggleButtonGroup
            value={formData.type}
            exclusive
            onChange={(_, value) => value && setFormData((prev) => ({ ...prev, type: value }))}
            fullWidth
            sx={{
              "& .MuiToggleButton-root": {
                py: 1.5,
                "&.Mui-selected": {
                  color: "white",
                  "&:hover": {
                    backgroundColor:
                      formData.type === "income"
                        ? theme.palette.success.dark
                        : theme.palette.error.dark,
                  },
                },
              },
            }}
          >
            <ToggleButton
              value="income"
              sx={{
                "&.Mui-selected": {
                  backgroundColor: theme.palette.success.main,
                },
              }}
            >
              <TrendingUp sx={{ mr: 1 }} />
              Income
            </ToggleButton>
            <ToggleButton
              value="expense"
              sx={{
                "&.Mui-selected": {
                  backgroundColor: theme.palette.error.main,
                },
              }}
            >
              <TrendingDown sx={{ mr: 1 }} />
              Expense
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
            <TextField
              label="Amount"
              value={formData.amount}
              onChange={handleInputChange("amount")}
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              fullWidth
              required
              error={error.includes("amount")}
              InputProps={{
                startAdornment: <AttachMoney sx={{ color: "action.active", mr: 0.5 }} />,
              }}
            />

            <TextField
              label="Date"
              value={formData.date}
              onChange={handleInputChange("date")}
              type="date"
              fullWidth
              required
              InputProps={{
                startAdornment: <DateRange sx={{ color: "action.active", mr: 0.5 }} />,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>

          <TextField
            label="Description"
            value={formData.description}
            onChange={handleInputChange("description")}
            fullWidth
            required
            error={error.includes("description")}
            InputProps={{
              startAdornment: <Description sx={{ color: "action.active", mr: 0.5 }} />,
            }}
            placeholder="What was this transaction for?"
          />

          <TextField
            label="Category"
            value={formData.category}
            onChange={handleInputChange("category")}
            fullWidth
            required
            error={error.includes("category")}
            InputProps={{
              startAdornment: <Category sx={{ color: "action.active", mr: 0.5 }} />,
            }}
            placeholder="Select or enter a category"
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom color="text.secondary">
            Quick Categories
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {commonCategories[formData.type].map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => handleCategorySelect(category)}
                variant={formData.category === category ? "filled" : "outlined"}
                color={formData.category === category ? "primary" : "default"}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor:
                      formData.category === category
                        ? theme.palette.primary.dark
                        : theme.palette.action.hover,
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={loading}
          size="large"
          sx={{ minWidth: 100 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          size="large"
          sx={{ minWidth: 100 }}
        >
          {loading ? "Adding..." : "Add Transaction"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTransactionModal;
