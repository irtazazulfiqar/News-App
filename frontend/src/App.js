import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from 'components/Header';
import Footer from 'components/Footer';
import SignUp from 'pages/SignUp';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        {/* We can add other routes here */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
