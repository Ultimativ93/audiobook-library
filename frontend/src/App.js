import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { ReactFlowProvider } from 'reactflow';

import './App.css';

import Header from './components/layoutComponents/layoutCommon/header/Header';
import Footer from './components/layoutComponents/layoutCommon/footer/Footer';
import Editor from './views/editor/Editor';
import DataUpload from './views/dataUpload/DataUpload';
import Player from './views/player/Player';
import UserProjects from './views/userProjects/UserProjects';
import Home from './views/home/Home';
import Tutorials from './views/tutorials/Tutorials';
import Contact from './views/contact/Contact';
import Team from './views/team/Team';

import { ModalsStateProvider } from '../src/components/layoutComponents/layoutCommon/layoutMenu/ModalsStateContext';
import { customTheme } from '../src/components/tasks/appTasks/AppTasks';

function App() {
  return (
    <div className="App">
      <ChakraProvider theme={customTheme}>
        <ReactFlowProvider>
          <ModalsStateProvider>
            <Router>
              <Header />
              <Routes>
                <Route path="/editor/:audiobookTitleParam" element={<Editor />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/data-upload/:audiobookTitle" element={<DataUpload />} />
                <Route path="/player" element={<Player />} />
                <Route path="/user-projects" element={<UserProjects />} />
                <Route path="/" element={<Home />} />
                <Route path="/tutorials" element={<Tutorials />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/team" element={<Team />} />
              </Routes>
              <Footer />
            </Router>
          </ModalsStateProvider>
        </ReactFlowProvider>
      </ChakraProvider>
    </div>
  );
}

export default App;
