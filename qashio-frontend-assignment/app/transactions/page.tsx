'use client';

import { Box, Typography } from '@mui/material';

export default function TransactionsPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Transactions
      </Typography>
      <Typography variant="body1" color="text.secondary">
        View and manage your transactions
      </Typography>
      {/* Implement transactions list, filters, and details dialog here */}
    </Box>
  );
} 