import React, { useEffect, useState } from 'react';
import {Spacer, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';

import './layout-menu-modal-preview.css';

import Player from '../../../../../../views/player/Player';
import { fetchFlow } from '../../../../../tasks/editorTasks/FetchFlow';
import { validateMuChoi, validateEndNode, validateBridgeNode, validateTimeNode, validateMuAns, validateReactNode, validateInputNode, validateEdges } from '../../../../../tasks/editorTasks/ValidateFlow';

const LayoutMenuModalPreview = ({ isPreviewModalOpen, setModalsState, audiobookTitle }) => {
    const [flowToCheck, setFlowToCheck] = useState();
    const [validationResults, setValidationResults] = useState({ nodes: [], edges: [] });
    const [playable, setPlayable] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (audiobookTitle !== 'null' && audiobookTitle !== undefined) {
                try {
                    const flow = await fetchFlow(audiobookTitle);
                    setFlowToCheck(flow);
                } catch (error) {
                    console.error('Error fetching flow:', error);
                }
            }
        };

        fetchData();
    }, [isPreviewModalOpen]);

    const validateFlow = () => {
        if (flowToCheck && flowToCheck.nodes && flowToCheck.edges) {
            const nodeResults = flowToCheck.nodes.map(node => {
                if (node.type === 'muChoi') {
                    return validateMuChoi(node);
                } else if (node.type === 'endNode') {
                    return validateEndNode(node);
                } else if (node.type === 'bridgeNode') {
                    return validateBridgeNode(node);
                } else if (node.type === 'timeNode') {
                    return validateTimeNode(node);
                } else if (node.type === 'muAns') {
                    return validateMuAns(node);
                } else if (node.type === 'reactNode') {
                    return validateReactNode(node);
                } else if (node.type === 'inputNode') {
                    return validateInputNode(node);
                }
                return null;
            });

            const edgeResults = validateEdges(flowToCheck.nodes, flowToCheck.edges);

            setValidationResults({
                nodes: nodeResults.filter(result => result !== null),
                edges: edgeResults
            });
        }
    };

    useEffect(() => {
        if (validationResults.nodes.length === 0 && validationResults.edges.length === 0) {
            setPlayable(true);

        } else {
            setPlayable(false);
        }
    }, [validationResults]);

    useEffect(() => {
        validateFlow();
    }, [flowToCheck]);

    return (
        <Modal isOpen={isPreviewModalOpen} size="5xl" onClose={() => setModalsState(prevState => ({ ...prevState, isPreviewModalOpen: false }))}>
            <ModalOverlay />
            <ModalContent className="modal-content">
                <ModalCloseButton />
                <ModalHeader>Preview Audiobook</ModalHeader>
                <ModalBody className="modal-body">
                    <h2>Node Validation Results:</h2>
                    {validationResults.nodes && validationResults.nodes.length === 0 ? (
                        <p>No missing Data, everything looks good!</p>
                    ) : (
                        <ul>
                            {validationResults.nodes.map((result, index) => (
                                <li key={index}>{result}</li>
                            ))}
                        </ul>
                    )}
                    <br />
                    <h2>Edge Validation Results:</h2>
                    {validationResults.edges && validationResults.edges.length > 0 ? (
                        <ul>
                            {validationResults.edges.map((edge, index) => (
                                <li key={index}>{`${edge}`}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No invalid edges found.</p>
                    )}
                    <Spacer />
                    {playable && (
                        <div className="player-container">
                            <Player />
                        </div>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default LayoutMenuModalPreview;
