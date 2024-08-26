import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from 'components/Header';
import Footer from 'components/Footer';
import SignUp from 'pages/SignUp';
import SignIn from 'pages/SignIn';
import Dashboard from 'pages/Dashboard';
import ProtectedRoute from 'utility/ProtectedRoute';
import {AuthProvider} from 'context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={
            <ProtectedRoute element={<Dashboard />} />
          } />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
