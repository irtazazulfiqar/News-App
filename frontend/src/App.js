import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import ArticleDetails from './pages/ArticleDetails';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './utility/protectedRoute';
import { AuthProvider } from './context/authContext';
import { Box, Container } from '@mui/material';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Box display="flex" flexDirection="column" minHeight="100vh">
          <Header />
          <Box component="main" flexGrow={1} sx={{ overflowY: 'auto', overflowX: 'hidden', py: 3 }}>
            <Container>
              <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
              </Routes>
            </Container>
          </Box>
        </Box>
      </AuthProvider>
    </Router>
  );
}

export default App;
