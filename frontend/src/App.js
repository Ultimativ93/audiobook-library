import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { ReactFlowProvider } from 'reactflow';

import Editor from './views/Editor';
import DataUpload from './views/DataUpload';
import Player from './views/player/Player';
import './App.css';

function App() {
  return (
    <div className="App" style={{ height: 800 }}>
      <ChakraProvider>
        <ReactFlowProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Editor />} />
              <Route path="/data-upload" element={<DataUpload />} />
              <Route path="/player" element={<Player />} />
            </Routes>
          </BrowserRouter>

        </ReactFlowProvider>
      </ChakraProvider>
    </div>
  );
}

export default App;