import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { ReactFlowProvider } from 'reactflow';

import './App.css';

import Editor from './views/editor/Editor'
import DataUpload from './views/DataUpload';
import Player from './views/player/Player';
import AudiobookSetup from './views/audioBookSetup/AudiobookSetup';
import UserProjects from './views/userProjects/UserProjects';


function App() {
  return (
    <div className="App" style={{ height: 800 }}>
      <ChakraProvider>
        <ReactFlowProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Editor />} />
              <Route path="/data-upload/:audiobookTitle" element={<DataUpload />} />
              <Route path="/player" element={<Player />} />
              <Route path="/audiobook-setup" element={<AudiobookSetup />} />
              <Route path="/user-projects" element={<UserProjects />} />
            </Routes>
          </BrowserRouter>

        </ReactFlowProvider>
      </ChakraProvider>
    </div>
  );
}

export default App;