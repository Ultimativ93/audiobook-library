import React, { useState } from 'react';
import { Switch } from '@chakra-ui/react';

import './drawer-components.css';

import SelectInteractionSignalAudio from './SelectInteractionSignalAudio';
import { updateNodeProperty } from '../LayoutDrawerFunctions';

const SelectInteraktionSignal = ({ nodeData, setNodes, audiobookTitle }) => {
  const [shouldShowAudio, setShouldShowAudio] = useState(nodeData.data.interactionSignal === 'true');

  const handleSwitchChange = (event) => {
    const isChecked = event.target.checked;
    setShouldShowAudio(isChecked);
    updateNodeProperty(setNodes, nodeData, 'interactionSignal', isChecked.toString());

    if (!isChecked) {
      updateNodeProperty(setNodes, nodeData, 'interactionSignalAudio', '');
      console.log("nodeData", nodeData);
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
      {shouldShowAudio && <SelectInteractionSignalAudio nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle}/>}
    </div>
  );
}

export default SelectInteraktionSignal;
