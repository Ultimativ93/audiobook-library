import React, { useState } from 'react';
import { Switch } from '@chakra-ui/react';

import './drawer-components.css';

import SelectInteractionSignalAudio from './SelectInteractionSignalAudio';
import { updateNodeProperty } from '../../../tasks/drawerTasks/LayoutDrawerFunctions';

// "SelectInteraktionSignal.jsx" component, is accessed by the "Editor" view, in the "LayoutDrawer" component.
// It handles the activation an interaction signal, if selected. And shows, if selected, the "SelectInteractionSignalAudio" component.
// It is a child of "MuAnsFormatGeneral", "MuChoiFormatGeneral", "ReactNodeFormatGeneral" and "TimeNodeFormatGeneral" component.
const SelectInteraktionSignal = ({ nodeData, setNodes, audiobookTitle, fileChange, setFileChange }) => {
  const [shouldShowAudio, setShouldShowAudio] = useState(nodeData.data.interactionSignal === 'true');

  const handleSwitchChange = (event) => {
    const isChecked = event.target.checked;
    setShouldShowAudio(isChecked);
    updateNodeProperty(setNodes, nodeData, 'interactionSignal', isChecked.toString());

    if (!isChecked) {
      updateNodeProperty(setNodes, nodeData, 'interactionSignalAudio', '');
    }
  };

  return (
    <div className='select-interaction-signal-container'>
      <h4>Interaction Signal</h4>
      <Switch
        isChecked={shouldShowAudio}
        onChange={handleSwitchChange}
        colorScheme='darkButtons'
      />
      {shouldShowAudio && <SelectInteractionSignalAudio nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />}
    </div>
  );
};

export default SelectInteraktionSignal;
