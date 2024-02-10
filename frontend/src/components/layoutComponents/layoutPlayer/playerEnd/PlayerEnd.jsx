import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

import "./player-end.css"

const PlayerEnd = ({ currentNodeProps, flow, setCurrentNode }) => {
    const [isEnd, setIsEnd] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentNodeProps) {
            if (currentNodeProps.isEnd === 'true') {
                setIsEnd(true);
                console.log('Ist ein Ende');
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
                        setCurrentNode(connectedNode.id-1);
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
                <div className="player-end">
                    <Button colorScheme='green' onClick={(e) => handleToStart()}>Back to Start</Button>
                    <Button colorScheme='blue'onClick={(e) => handleToHome()}>Back to Home</Button>
                </div>

            )}
        </>
    );
};

export default PlayerEnd;
