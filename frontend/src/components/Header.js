import React from 'react';

function Header() {
  return (
    <header>
      <h1>News App</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/signin">Sign In</a>
        <a href="/signup">Sign Up</a>
      </nav>
    </header>
  );
}

export default Header;
