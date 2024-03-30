import React, { useState, useEffect } from 'react';
import { Input, Box, Text } from '@chakra-ui/react';

import { updateNodeProperty } from '../../../tasks/drawerTasks/LayoutDrawerFunctions';

// "SelectNodeLabel.jsx" component, is accessed by the "Editor" view, in the "LayoutDrawer" component.
// It handles the input and deselection of node labels and is handled in the "DrawerFormatProviderGeneral".
// It is a child of "BridgeNodeFormatGeneral", "EndNodesFormatGeneral", "MuAnsFormatGeneral", "MuChoiFormatGeneral", "ReactNodeFormatGeneral" and "TimeNodeFormatGeneral" component.
const SelectNodeLabel = ({ nodeData, setNodes }) => {
    const [label, setLabel] = useState(nodeData.data.label);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        setLabel(nodeData.data.label);
    }, [nodeData]);

    const handleLabelChange = (event) => {
        const newValue = event.target.value;
        if (newValue.length <= 30) {
            setLabel(newValue);
            updateNodeProperty(setNodes, nodeData, 'label', newValue);
            setIsError(false);
        } else {
            setIsError(true);
        }
    };

    return (
        <div className='select-node-label-container'>
            <h4>Select Node Label</h4>
            <Input
                placeholder='Node name..'
                value={label}
                onChange={handleLabelChange}
                borderColor={isError ? 'red.500' : 'gray.200'}
                focusBorderColor='darkButtons'
            />
            {isError && (
                <Box mt={1}>
                    <Text color='red.500' fontSize='sm'>The label must be 30 characters or less.</Text>
                </Box>
            )}
        </div>
    );
};

export default SelectNodeLabel;
