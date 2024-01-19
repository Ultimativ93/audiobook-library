import Editor from './views/Editor';
import { ChakraProvider } from '@chakra-ui/react';
import { ReactFlowProvider } from 'reactflow';
import './App.css';


function App() {
  return (
    <ChakraProvider>
      <ReactFlowProvider>
        <div className="App" style={{ height: 800 }}>
          <Editor />
        </div>
      </ReactFlowProvider>
    </ChakraProvider>

  );
}

export default App;
