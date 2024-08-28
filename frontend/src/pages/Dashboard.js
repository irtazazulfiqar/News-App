import React from 'react';
import { Container, Typography } from '@mui/material';

function Dashboard() {
  return (
    <Container maxWidth="md">
      <Typography variant="h3" gutterBottom>
        Welcome to the Dashboard!
      </Typography>
      <Typography variant="body1">
        Here you can manage your profile, view data, and much more.
      </Typography>
    </Container>
  );
}

export default Dashboard;
