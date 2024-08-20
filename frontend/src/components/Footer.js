import React from 'react';
import { Box, Typography, Container } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.primary.main,
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1">
          &copy; {new Date().getFullYear()} My Website
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
