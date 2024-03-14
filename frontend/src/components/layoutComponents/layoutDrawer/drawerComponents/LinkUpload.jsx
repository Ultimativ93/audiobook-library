import React from 'react';
import { Button } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import { useModalsState } from '../../layoutCommon/layoutMenu/ModalsStateContext';

import "./drawer-components.css";

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
      <Button rightIcon={<DownloadIcon />} colorScheme="lightButtons" size="sm" mt="2" onClick={openUploadModal}>Media Manager</Button>
    </div>
  );
};

export default LinkUpload;