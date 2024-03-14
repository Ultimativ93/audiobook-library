import React, { useEffect, useState } from 'react';
import { Spacer, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button } from '@chakra-ui/react';

import './layout-menu-modal-preview.css';

import Player from '../../../../../../views/player/Player';
import { fetchFlow } from '../../../../../tasks/editorTasks/FetchFlow';
import { validateMuChoi, validateEndNode, validateBridgeNode, validateTimeNode, validateMuAns, validateReactNode, validateInputNode, validateEdgeMuChoi, validateEdgeEndNode, validateEdgeBridgeNode, validateEdgeTimeNode, validateEdgeMuAns, validateEdgeReactNode, validateEdgeInputNode, validateEdgeStart } from '../../../../../tasks/editorTasks/ValidateFlow';
import LinkPublish from '../../layoutMenuComponents/LinkPublish';

const LayoutMenuModalPreview = ({ isPreviewModalOpen, setModalsState, audiobookTitle, selectedNodes }) => {
    const [flowToCheck, setFlowToCheck] = useState();
    const [validationResults, setValidationResults] = useState({ nodes: [], edges: [] });
    const [playable, setPlayable] = useState(false);

    useEffect(() => {
        setPlayable(false);
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

            const edgeResults = flowToCheck.nodes.map(node => {
                if (node.type === 'muChoi') {
                    return validateEdgeMuChoi(node, flowToCheck.edges);
                } else if (node.type === 'endNode') {
                    return validateEdgeEndNode(node, flowToCheck.edges);
                } else if (node.type === 'bridgeNode') {
                    return validateEdgeBridgeNode(node, flowToCheck.edges);
                } else if (node.type === 'timeNode') {
                    return validateEdgeTimeNode(node, flowToCheck.edges);
                } else if (node.type === 'muAns') {
                    return validateEdgeMuAns(node, flowToCheck.edges);
                } else if (node.type === 'reactNode') {
                    return validateEdgeReactNode(node, flowToCheck.edges);
                } else if (node.type === 'inputNode') {
                    return validateEdgeInputNode(node, flowToCheck.edges);
                } else if (node.data.isStart === 'true') {
                    return validateEdgeStart(node, flowToCheck.edges);
                }
            })

            setValidationResults({
                nodes: nodeResults.filter(result => result !== null),
                edges: edgeResults.filter(result => result !== null),
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

    const downloadValidationResults = () => {
        const nodeResultsText = validationResults.nodes.join('\n');
        const edgeResultsText = validationResults.edges.join('\n');
        const textToDownload = `Node Validation Results:\n${nodeResultsText}\n\nEdge Validation Results:\n${edgeResultsText}`;

        const element = document.createElement("a");
        const file = new Blob([textToDownload], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${audiobookTitle}_validation_results.txt`;
        document.body.appendChild(element);
        element.click();
    };

    return (
        <Modal isOpen={isPreviewModalOpen} onClose={() => setModalsState(prevState => ({ ...prevState, isPreviewModalOpen: false }))} size="5xl">
            <ModalOverlay />
            <ModalContent className="modal-content">
                <ModalCloseButton />
                <ModalHeader>Preview Audiobook</ModalHeader>
                <ModalBody className="modal-body">
                    <p>Node Validation Results:</p>
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
                    <p>Edge Validation Results:</p>
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
                    {validationResults.nodes.length > 0 || validationResults.edges.length > 0 ? (
                        <Button onClick={downloadValidationResults} colorScheme="darkButtons" mt="4">
                            Download Validation Results
                        </Button>
                    ) : null}

                    {playable && (
                        <div className="player-container">
                            <Player selectedNodes={selectedNodes} />
                            <LinkPublish />
                            <p style={{ textAlign: 'center' }}>The audiobook is now ready for publishing.</p>
                        </div>
                    )}



                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default LayoutMenuModalPreview;
