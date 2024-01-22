import React, { useState, useEffect } from 'react';
import { Switch } from '@chakra-ui/react';
import { updateIsEnd } from '../LayoutDrawerFunctions';

const SelectEnd = ({ nodeData, setNodes }) => {
    const isEndValue = nodeData.data.isEnd === 'true'; // Convert string to boolean

    return (
        <>
            <h4>Is End</h4>
            <Switch
                defaultChecked={isEndValue}
                onChange={(event) => updateIsEnd(setNodes, nodeData, event)}
            />
        </>
    );
};

export default SelectEnd;
