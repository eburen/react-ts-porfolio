import React from 'react';
import { Typography, Box, Grid, Button } from '@mui/material';

const HomePage: React.FC = () => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Our E-Commerce Store
      </Typography>
      <Typography variant="body1" paragraph>
        Discover amazing products at great prices.
      </Typography>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item>
          <Button variant="contained" color="primary">
            Shop Now
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage; 