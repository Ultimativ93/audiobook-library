import React from 'react';

import MuChoiFormatGeneral from './MuChoiFormatGeneral';

const DrawerFormatProviderGeneral = ({ nodeData, setNodes }) => {

    switch (nodeData.type) {
        case 'start':
            return {
                // has to be created
            }
        case 'muChoi':
            return (
                <MuChoiFormatGeneral nodeData={nodeData} setNodes={setNodes}/>
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

export default DrawerFormatProviderGeneral;
