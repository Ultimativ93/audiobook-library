import React, { useEffect, useRef } from 'react';
import { Checkbox, Stack } from '@chakra-ui/react';
import { updateNodeProperty } from '../LayoutDrawerFunctions';

import './drawer-components.css';

const SelectInputSelections = ({ nodeData, setNodes }) => {
    const inputSelectionsRef = useRef(nodeData.data.inputSelections || {
        mouse: false,
        touch: false,
        speak: false,
        keyboard: false,
        touchKeyboard: false,
        shake: false,
    });

    const handleCheckBoxChange = (inputSelection) => {
        const updatedInputSelections = {
            ...inputSelectionsRef.current,
            [inputSelection]: {
                name: inputSelection,
                isSelected: !inputSelectionsRef.current[inputSelection]?.isSelected,
            },
        };

        updateNodeProperty(setNodes, nodeData, 'inputSelections', updatedInputSelections);
        inputSelectionsRef.current = updatedInputSelections;
    };

    useEffect(() => {
        inputSelectionsRef.current = nodeData.data.inputSelections || {
            mouse: false,
            touch: false,
            speak: false,
            keyboard: false,
            touchKeyboard: false,
            shake: false,
        };
    }, [nodeData.data.inputSelections]);

    return (
        <div className='select-input-selections-container'>
            <h4 style={{ marginTop:'5px'}}>Select Input Selections</h4>
            <Stack direction='row' flexWrap='wrap'>
                {Object.keys(inputSelectionsRef.current).map((key, index) => (
                    <Checkbox
                        key={index}
                        isChecked={inputSelectionsRef.current[key].isSelected}
                        onChange={() => handleCheckBoxChange(key)}
                        colorScheme='darkButtons'
                    >
                        {key}
                    </Checkbox>
                ))}
            </Stack>
        </div>
    );
};

export default SelectInputSelections;