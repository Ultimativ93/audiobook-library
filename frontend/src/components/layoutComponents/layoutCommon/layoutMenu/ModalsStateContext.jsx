import React, { createContext, useContext, useState } from 'react';

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