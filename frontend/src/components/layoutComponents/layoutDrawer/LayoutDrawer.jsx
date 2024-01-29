import React from 'react';
import { Drawer, DrawerContent, DrawerOverlay, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

import DrawerFormatProviderGeneral from './layoutDrawerFormats/drawerFormatProviderGeneral/DrawerFormatProviderGeneral';
import DrawerFormatProviderQuestions from './layoutDrawerFormats/drawerFormatProviderQuestions/DrawerFormatProviderQuestions';
import MuAnsFromatCombination from './layoutDrawerFormats/drawerFormatProviderCombination/MuAnsFromatCombination';

const LayoutDrawer = ({ isOpen, onClose, nodeData, setNodes, setEdges, edges }) => {
    const btnRef = React.useRef();

    if (!nodeData || !nodeData.data) {
        // If nodeData is null or its data property is null, we can decide what to render in this case !!!!!!
        return null;
    }

    console.log("In LayoutDrawer data: ", nodeData);

    return (
        <Drawer
            isOpen={isOpen}
            placement='right'
            onClose={onClose}
            finalFocusRef={btnRef}
            size="md"
        >
            <DrawerOverlay />
            <DrawerContent>
                <Tabs>
                    <TabList>
                        <Tab>General Options</Tab>
                        <Tab>Question Options</Tab>
                        {nodeData.type === 'muAns' && <Tab>Combination Options</Tab>}
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <DrawerFormatProviderGeneral nodeData={nodeData} setNodes={setNodes}/>
                        </TabPanel>
                        <TabPanel>
                            <DrawerFormatProviderQuestions nodeData={nodeData} setNodes={setNodes} setEdges={setEdges} edges={edges}/>
                        </TabPanel>
                        <TabPanel>
                            <MuAnsFromatCombination nodeData={nodeData} setNodes={setNodes} setEdges={setEdges} edges={edges} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </DrawerContent>
        </Drawer>
    );
};

export default LayoutDrawer;
