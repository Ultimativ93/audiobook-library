import React from 'react';
import { Button } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import { useModalsState } from '../../layoutCommon/layoutMenu/ModalsStateContext';

import './drawer-components.css';

// "LinkUpload.jsx" component, is accessed in the "Editor" view from the "LayoutDrawer" component. It is used as link that opens up the LayoutMenuModalUpload.
// It is a child of "BridgeNodeFormatGeneral", "EndNodeFormatGeneral", "InputNodeFormatGeneral", "MuAnsFormatGeneral", "MuChoiFormatgeneral", "ReactNodeFormatGeneral", "TimeNodeFormatGeneral" component.
const LinkUpload = () => {
  const { setModalsState } = useModalsState();

  const openUploadModal = () => {
    setModalsState(prevState => ({
      ...prevState,
      isUploadModalOpen: true,
    }));
  };

  return (
    <div>
      <Button rightIcon={<DownloadIcon />} colorScheme='lightButtons' size='sm' mt='2' onClick={openUploadModal}>Media Manager</Button>
    </div>
  );
};

export default LinkUpload;