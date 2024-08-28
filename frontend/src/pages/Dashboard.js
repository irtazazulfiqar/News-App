import React from 'react';
import { Container, Typography } from '@mui/material';

function Dashboard() {
  return (
    <Container maxWidth="md">
      <Typography variant="h3" gutterBottom>
        Welcome to the Dashboard!
      </Typography>
      <Typography variant="body1">
        Welcome to Dashboard.
      </Typography>
    </Container>
  );
}

export default Dashboard;
