import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';

function Header() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
            News App
          </Typography>
          <div>
            {isAuthenticated ? (
              <Button
                color="inherit"
                onClick={logout}
                sx={{
                  borderRadius: '50%',
                  padding: '8px 16px',
                  marginLeft: 'auto',
                }}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/signin">
                  Sign In
                </Button>
                <Button color="inherit" component={Link} to="/signup">
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
