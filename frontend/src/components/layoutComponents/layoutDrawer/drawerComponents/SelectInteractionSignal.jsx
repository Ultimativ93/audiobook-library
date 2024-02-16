import React, { useState } from 'react';
import { Switch } from '@chakra-ui/react';

import SelectInteractionSignalAudio from './SelectInteractionSignalAudio';
import { updateNodeProperty } from '../LayoutDrawerFunctions';

const SelectInteraktionSignal = ({ nodeData, setNodes, audiobookTitle }) => {
  const [shouldShowAudio, setShouldShowAudio] = useState(nodeData.data.interactionSignal === 'true');

  return (
    <>
      <h4>Interaction Signal</h4>
      <Switch
        defaultChecked={shouldShowAudio}
        onChange={(event) => {
          updateNodeProperty(setNodes, nodeData, 'interactionSignal', event.target.checked.toString());
          setShouldShowAudio(event.target.checked);
        }}
      />
      {shouldShowAudio && <SelectInteractionSignalAudio nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle}/>}
    </>
  );
}

export default SelectInteraktionSignal;
