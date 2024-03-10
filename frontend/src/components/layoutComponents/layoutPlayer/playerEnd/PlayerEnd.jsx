import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

import "./player-end.css"

const PlayerEnd = ({ currentNodeProps, flow, setCurrentNode, setFirstNodePlayed }) => {
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
            console.log("in handleStart")
            if (startNode) {
                console.log("weiter in handle")
                const connectedEdge = flow.edges.find(edge => edge.source === startNode.id);
                if (connectedEdge) {
                    console.log("deutlich weiter")
                    const connectedNode = flow.nodes.find(node => node.id === connectedEdge.target);
                    if (connectedNode) {
                        console.log("wir versuchen das", connectedNode.id);
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
                <div className="player-end">
                    <Button colorScheme='highlightColor' onClick={(e) => handleToStart()}>Back to Start</Button>
                    <Button colorScheme='darkButtons'onClick={(e) => handleToHome()}>Back to Home</Button>
                </div>

            )}
        </>
    );
};

export default PlayerEnd;
