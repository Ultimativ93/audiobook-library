import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

import "./player-end.css"

const PlayerEnd = ({ currentNodeProps, flow, setCurrentNode }) => {
    const [isEnd, setIsEnd] = useState(null);
    const navigate = useNavigate();

    //console.log("CurrentnodeProps in End: ", currentNodeProps)

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
        console.log("in HandleStart Flow:", flow);
        if (flow && flow.nodes) {
            const startNode = flow.nodes.reduce((minNode, currentNode) => {
                return minNode.id < currentNode.id ? minNode : currentNode;
            })

            setCurrentNode(startNode.id);
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
