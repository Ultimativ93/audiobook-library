import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [audiobooks, setAudioBooks] = useState({});

  useEffect(() => {
    // Hier die fetch-Anfrage einfügen
    fetch("http://localhost:3500/")
      .then(response => response.json())
      .then(data => {
        setAudioBooks(data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [])

  return (
    <div className="App">
        <p>
          {audiobooks.text}
        </p>
    </div>
  );
}

export default App;
