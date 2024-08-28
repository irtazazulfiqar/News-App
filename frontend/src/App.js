import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from 'components/Header';
import Footer from 'components/Footer';
import SignUp from 'pages/SignUp';
import Dashboard from 'pages/Dashboard';

function App() {
  return (
    <Router>
        <Header />
        <Routes>
          <Route path="/signup" element={<SignUp />} />
        </Routes>
        <Footer />
    </Router>
  );
}

export default App;
