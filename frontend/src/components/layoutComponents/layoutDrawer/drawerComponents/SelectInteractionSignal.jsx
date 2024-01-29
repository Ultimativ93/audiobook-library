import React, { useState } from 'react';
import { Switch } from '@chakra-ui/react';

import SelectInteractionSignalAudio from './SelectInteractionSignalAudio';
import { updateNodePropertyCheck } from '../LayoutDrawerFunctions';

const SelectInteraktionSignal = ({ nodeData, setNodes }) => {
  const [shouldShowAudio, setShouldShowAudio] = useState(nodeData.data.interactionSignal === 'true');

  return (
    <>
      <h4>Interaction Signal</h4>
      <Switch
        defaultChecked={shouldShowAudio}
        onChange={(event) => {
          updateNodePropertyCheck(setNodes, nodeData, 'interactionSignal', event);
          setShouldShowAudio(event.target.checked);
        }}
      />
      {shouldShowAudio && <SelectInteractionSignalAudio nodeData={nodeData} setNodes={setNodes}/>}
    </>
  );
}

export default SelectInteraktionSignal;
