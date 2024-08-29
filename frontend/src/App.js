import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from 'pages/SignIn';
import SignUp from 'pages/SignUp';
import Dashboard from 'pages/Dashboard';
import ArticleDetails from 'pages/ArticleDetails';
import Header from 'components/Header';
import Footer from 'components/Footer';
//import ProtectedRoute from 'utils/ProtectedRoute';
import { AuthProvider } from 'context/AuthContext';
import { Box, Container } from '@mui/material';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
