'use client';

import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();
  
  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Qashio
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={Link}
            href="/transactions/new"
            sx={{ 
              fontWeight: pathname === '/transactions/new' ? 'bold' : 'normal',
              textDecoration: pathname === '/transactions/new' ? 'underline' : 'none'
            }}
          >
            New Transaction
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
} 