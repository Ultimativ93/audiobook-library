import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { ReactFlowProvider } from 'reactflow';

import './App.css';

import Editor from './views/editor/Editor';
import DataUpload from './views/dataUpload/DataUpload';
import Player from './views/player/Player';
import UserProjects from './views/userProjects/UserProjects';
import Home from './views/home/Home';
import { ModalsStateProvider } from '../src/components/layoutComponents/layoutCommon/layoutMenu/ModalsStateContext';

function App() {
  return (
    <div className="App">
      <ChakraProvider>
        <ReactFlowProvider>
          <ModalsStateProvider>
            <Router>
              <Routes>
                <Route path="/editor/:audiobookTitleParam" element={<Editor />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/data-upload/:audiobookTitle" element={<DataUpload />} />
                <Route path="/player" element={<Player />} />
                <Route path="/user-projects" element={<UserProjects />} />
                <Route path="/" element={<Home />} />
              </Routes>
            </Router>
          </ModalsStateProvider>
        </ReactFlowProvider>
      </ChakraProvider>
    </div>
  );
}

export default App;
