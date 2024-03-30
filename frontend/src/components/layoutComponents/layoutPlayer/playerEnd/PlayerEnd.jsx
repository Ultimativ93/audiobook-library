import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

import './player-end.css';

// "PlayerEnd.jsx" component, is accessed by the "Player" component in the "LayoutMenuModalPreview" and the "Audiobook" view.
// It handles the end node, showcases the answers and asks the user to play again, or get back to the homepage.
// It is a child of "Player" component.
const PlayerEnd = ({ currentNodeProps, flow, setCurrentNode, setFirstNodePlayed }) => {
    const [isEnd, setIsEnd] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentNodeProps) {
            if (currentNodeProps.isEnd === 'true') {
                setIsEnd(true);
            } else {
                setIsEnd(false);
            }
        }

    }, [currentNodeProps]);

    const handleToStart = () => {
        if (flow && flow.nodes) {
            const startNode = flow.nodes.find(node => node.id === '1');
            if (startNode) {
                const connectedEdge = flow.edges.find(edge => edge.source === startNode.id);
                if (connectedEdge) {
                    const connectedNode = flow.nodes.find(node => node.id === connectedEdge.target);
                    if (connectedNode) {
                        setFirstNodePlayed(false);
                        setCurrentNode(flow.nodes.findIndex(node => node.id === connectedNode.id));
                    }
                }
            }
        }
    }

    const handleToHome = () => {
        navigate('/');
    }

    return (
        <>
            {isEnd && (
                <div className='player-end'>
                    <Button colorScheme='highlightColor' onClick={(e) => handleToStart()}>Back to Start</Button>
                    <Button colorScheme='darkButtons' onClick={(e) => handleToHome()}>Back to Home</Button>
                </div>

            )}
        </>
    );
};

export default PlayerEnd;
