import React from 'react';

import MuChoiFormatQuestions from './MuChoiFormatQuestions';

const DrawerFormatProviderQuestions = ({ nodeData, setNodes }) => {

    switch (nodeData.type) {
        case 'start':
            return {
                // has to be created
            }
        case 'muChoi':
            return (
                <MuChoiFormatQuestions nodeData={nodeData} setNodes={setNodes}/>
            )
        case 'bridge':
            return {
                // ...
            }
        default:
            console.log("Default in LayoutFormatProvider, check it!");
            // create default functionality
            return null;
    }
}

export default DrawerFormatProviderQuestions;
