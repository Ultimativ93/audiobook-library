import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerOverlay, Tabs, TabList, TabPanels, Tab, TabPanel, extendTheme, ChakraProvider, DrawerCloseButton } from '@chakra-ui/react';

import './layout-drawer.css'

import DrawerFormatProviderGeneral from './layoutDrawerFormats/drawerFormatProviderGeneral/DrawerFormatProviderGeneral';
import DrawerFormatProviderQuestions from './layoutDrawerFormats/drawerFormatProviderQuestions/DrawerFormatProviderQuestions';
import MuAnsFormatCombination from './layoutDrawerFormats/drawerFormatProviderCombination/MuAnsFormatCombination';
import { customTheme } from '../../tasks/appTasks/AppTasks';

const components = {
    Drawer: {
        variants: {
            alwaysOpen: {
                parts: ['dialog', 'dialogContainer'],
                dialog: {
                    pointerEvents: 'auto',
                },
                dialogContainer: {
                    pointerEvents: 'none',
                },
            },
        },
    },
};

const extendedTheme = extendTheme({
    ...customTheme,
    components
});

// "LayoutDrawer" component, is accessed by the "Editor" view, in the LayoutEditorDrawer.
// Handles the node property changes of all values opens drawer with "DrawerFormatProviderGeneral", "DrawerFormatProviderQuestions" and "MuAnsFormatCombination". 
// Is a child of "Editor" view component.
const LayoutDrawer = ({ isOpen, onClose, nodeData, setNodes, setEdges, edges, audiobookTitle, fileChange, setFileChange }) => {
    const [activeTab, setActiveTab] = useState('general');

    const btnRef = React.useRef();

    useEffect(() => {
        if (nodeData && nodeData.type) {
            if (nodeData.type === 'endNode' || nodeData.type === 'bridgeNode') {
                setActiveTab('general');
            }

            if (activeTab === 'combination' && (nodeData.type !== 'muAns')) {
                setActiveTab('general');
            }
        }
    }, [nodeData]);

    if (!nodeData || !nodeData.data) {
        return null;
    }

    return (
        <ChakraProvider theme={extendedTheme}>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                finalFocusRef={btnRef}
                size='xl'
                trapFocus={false}
                variant='alwaysOpen'
            >
                <DrawerOverlay display='none' />
                <DrawerContent className={`drawer-content ${isOpen ? 'drawer-content-open' : 'drawer-content-closed'}`}>
                    <DrawerCloseButton />
                    <DrawerHeader className='drawer-header' borderBottomWidth='1px'>{`Edit Node: ${nodeData.data.label}`}</DrawerHeader>
                    <DrawerBody>
                        <Tabs colorScheme='darkButtons' index={activeTab === 'general' ? 0 : activeTab === 'questions' ? 1 : 2} onChange={(index) => setActiveTab(index === 0 ? 'general' : index === 1 ? 'questions' : 'combination')}>
                            <TabList >
                                <Tab>General Options</Tab>
                                {(nodeData.type !== 'endNode' && nodeData.type !== 'bridgeNode') && <Tab>Question Options</Tab>}
                                {nodeData.type === 'muAns' && <Tab>Combination Options</Tab>}
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <DrawerFormatProviderGeneral nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
                                </TabPanel>
                                <TabPanel>
                                    {(nodeData.type === 'muChoi' || nodeData.type === 'timeNode' || nodeData.type === 'muAns' || nodeData.type === 'reactNode' || nodeData.type === 'inputNode') ? (
                                        <DrawerFormatProviderQuestions nodeData={nodeData} setNodes={setNodes} setEdges={setEdges} edges={edges} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
                                    ) : (
                                        <DrawerFormatProviderGeneral nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
                                    )}
                                </TabPanel>
                                {nodeData.type === 'muAns' &&
                                    <TabPanel>
                                        <MuAnsFormatCombination nodeData={nodeData} setNodes={setNodes} setEdges={setEdges} edges={edges} />
                                    </TabPanel>
                                }
                            </TabPanels>
                        </Tabs>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </ChakraProvider>
    );
};

export default LayoutDrawer;
