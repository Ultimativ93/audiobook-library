import { useState, useEffect } from 'react';
import './App.css';
import EditorInteractive from './components/EditorInteractive';

function App() {
  //const [audiobooks, setAudioBooks] = useState({});

  /*useEffect(() => {
    // Hier die fetch-Anfrage einfügen
    fetch("http://localhost:3500/")
      .then(response => response.json())
      .then(data => {
        setAudioBooks(data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [])*/

  return (
    <div className="App">
      <p>We r working</p>
      <EditorInteractive/>
      <a href="http://localhost:3500">Get back to Main</a>
    </div>
  );
}



export default App;
