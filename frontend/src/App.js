import React, { useState } from 'react';

function App() {
  const [heading, setHeading] = useState("");

  const handleClick = () => {
    fetch('http://127.0.0.1:8000/test/')
      .then(response => response.json())
      .then(data => {
        setHeading(data.heading);
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  return (
    <div>
      <h1>{heading ? heading : "Click the button to fetch data!"}</h1>
      <button onClick={handleClick}>Fetch Data from Django</button>
    </div>
  );
}

export default App;
