import React, { createContext, useContext, useState } from 'react';

// "ModalstateContext.jsx" component handle the states of LayoutMenuModalSetup, LayoutMenuModalUpload, LayoutMenuModalPreview and LayoutMenuModalPublish.
// It acts as state library, and should be expanded with further states, that are used more often, like isDrawerOpen or setNodes, setEdges etc.
const ModalsStateContext = createContext(null);

export const ModalsStateProvider = ({ children }) => {
  const [modalsState, setModalsState] = useState({
    isSetupModalOpen: false,
    isUploadModalOpen: false,
    isPreviewModalOpen: false,
    isPublishModalOpen: false,
    isMenuModalOpen: false,
  });

  return (
    <ModalsStateContext.Provider value={{ modalsState, setModalsState }}>
      {children}
    </ModalsStateContext.Provider>
  );
};

export const useModalsState = () => useContext(ModalsStateContext);