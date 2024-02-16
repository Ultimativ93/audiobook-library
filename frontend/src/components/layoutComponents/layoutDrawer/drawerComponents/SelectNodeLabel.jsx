import React from 'react';
import { Input } from '@chakra-ui/react';

import { updateNodeProperty } from '../LayoutDrawerFunctions';

const SelectNodeLabel = ({ nodeData, setNodes }) => {
    return (
        <>
            <h4>Select Node Label</h4>
            <Input
                placeholder='Node name..'
                defaultValue={nodeData.data.label}
                onChange={(event) => updateNodeProperty(setNodes, nodeData, 'label', event.target.value)}
            />
        </>
    );
};

export default SelectNodeLabel;
