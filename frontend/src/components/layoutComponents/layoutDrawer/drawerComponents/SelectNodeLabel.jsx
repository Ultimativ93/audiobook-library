import React, { useState, useEffect } from 'react';
import { Input } from '@chakra-ui/react';

import { updateNodeProperty } from '../LayoutDrawerFunctions';

const SelectNodeLabel = ({ nodeData, setNodes }) => {
    const [label, setLabel] = useState(nodeData.data.label);

    useEffect(() => {
        setLabel(nodeData.data.label);
    }, [nodeData]);
    
    const handleLabelChange = (event) => {
        const newValue = event.target.value;
        setLabel(newValue);
        updateNodeProperty(setNodes, nodeData, 'label', newValue);
    };

    return (
        <>
            <h4>Select Node Label</h4>
            <Input
                placeholder='Node name..'
                value={label}
                onChange={handleLabelChange}
            />
        </>
    );
};

export default SelectNodeLabel;
