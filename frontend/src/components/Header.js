import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

function Header() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News App
          </Typography>
          <div>
            {isAuthenticated ? (
              <Button color="inherit" onClick={logout}>
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
