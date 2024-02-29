import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerOverlay, Tabs, TabList, TabPanels, Tab, TabPanel, extendTheme, ChakraProvider, DrawerCloseButton } from '@chakra-ui/react';

import './layout-drawer.css'

import DrawerFormatProviderGeneral from './layoutDrawerFormats/drawerFormatProviderGeneral/DrawerFormatProviderGeneral';
import DrawerFormatProviderQuestions from './layoutDrawerFormats/drawerFormatProviderQuestions/DrawerFormatProviderQuestions';
import MuAnsFromatCombination from './layoutDrawerFormats/drawerFormatProviderCombination/MuAnsFromatCombination';

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

const theme = extendTheme({ components });

const LayoutDrawer = ({ isOpen, onClose, nodeData, setNodes, setEdges, edges, audiobookTitle }) => {
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
        <ChakraProvider theme={theme}>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                finalFocusRef={btnRef}
                size="xl"
                trapFocus={false}
                variant="alwaysOpen"
            >
                <DrawerOverlay display='none' />
                <DrawerContent width={500} className={`drawer-content ${isOpen ? 'drawer-content-open' : 'drawer-content-closed'}`}>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth='1px'>{`Edit Node: ${nodeData.data.label}`}</DrawerHeader>
                    <DrawerBody>
                        <Tabs index={activeTab === 'general' ? 0 : activeTab === 'questions' ? 1 : 2} onChange={(index) => setActiveTab(index === 0 ? 'general' : index === 1 ? 'questions' : 'combination')}>
                            <TabList>
                                <Tab>General Options</Tab>
                                {(nodeData.type !== 'endNode' && nodeData.type !== 'bridgeNode') && <Tab>Question Options</Tab>}
                                {nodeData.type === 'muAns' && <Tab>Combination Options</Tab>}
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <DrawerFormatProviderGeneral nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} />
                                </TabPanel>
                                <TabPanel>
                                    {(nodeData.type === 'muChoi' || nodeData.type === 'timeNode' || nodeData.type === 'muAns' || nodeData.type === 'reactNode' || nodeData.type === 'inputNode') ? (
                                        <DrawerFormatProviderQuestions nodeData={nodeData} setNodes={setNodes} setEdges={setEdges} edges={edges} audiobookTitle={audiobookTitle} />
                                    ) : (
                                        <DrawerFormatProviderGeneral nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle}/>
                                    )}
                                </TabPanel>
                                {nodeData.type === 'muAns' && 
                                    <TabPanel>
                                        <MuAnsFromatCombination nodeData={nodeData} setNodes={setNodes} setEdges={setEdges} edges={edges} /> 
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