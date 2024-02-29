import React from 'react';
import { Button } from '@chakra-ui/react';
import { useModalsState } from '../../layoutCommon/layoutMenu/ModalsStateContext';

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
      <Button colorScheme="blue" size="sm" mt="2" onClick={openUploadModal}>Upload Data</Button>
    </div>
  );
};

export default LinkUpload;