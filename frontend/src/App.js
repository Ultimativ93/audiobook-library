import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { ReactFlowProvider } from 'reactflow';

import './App.css';

import Editor from './views/editor/Editor';
import DataUpload from './views/dataUpload/DataUpload';
import Player from './views/player/Player';
import UserProjects from './views/userProjects/UserProjects';
import Home from './views/home/Home';
import { ModalsStateProvider } from '../src/components/layoutComponents/layoutCommon/layoutMenu/ModalsStateContext';

const customTheme = extendTheme({
  colors: {
    darkButtons: {
      50: "#f2f2f8",
      100: "#d8d9da",
      200: "#bfbfbf",
      300: "#a6a6a6",
      400: "#8c8c8c",
      500: "#404040",
      600: "#595959",
      700: "#404040",
      800: "#252627",
      900: "#1a202c",
    },

    blueButtons: {
      50: "#ebf4fa",
      100: "#d1dbe1",
      200: "#b5c3cb",
      300: "#b5c3cb",
      400: "#7a91a0",
      500: "#617887",
      600: "#4a5d69",
      700: "#35434b",
      800: "#1e282e",
      900: "#040e13",
    },

    choiceColor: {
      500: "#c06859",
      600: "#cf8c7c",
      700: "#c06859",
    },

    bridgeColor: {
      500: "#ADA86F",
      600: "#beba8c",
      700: "#ADA86F",
    },

    timeColor: {
      500: "#536161",
      600: "#6c7c7c",
      700: "#536161",
    },

    muansColor: {
      500: "#6D9394",
      600: "#96b3b4",
      700: "#6D9394",
    },

    reactColor: {
      500: "#6D9476",
      600: "#97b49d",
      700: "#6D9476",
    },

    inputColor: {
      500: "#7A6A67",
      600: "#968683",
      700: "#7A6A67"
    },

    endColor: {
      500: "#555361",
      600: "#6c6a7b",
      700: "#555361",
    }
  }
  
});

function App() {
  return (
    <div className="App">
      <ChakraProvider theme={customTheme}>
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
