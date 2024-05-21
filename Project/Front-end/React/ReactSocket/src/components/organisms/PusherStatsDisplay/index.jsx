import React, { useState } from 'react';
import { usePusher } from '../../../context/PusherContext';
import { fruits } from '../../../constants/fruits';
import { Container, StatItem, Title, Value, ButtonContainer, Button } from "../SocketIOStatsDisplay/styles.js";

function PusherStatsDisplay() {
    const { triggerEvent } = usePusher();
    const [fruitIndex, setFruitIndex] = useState(0);
    const [receivedMessage, setReceivedMessage] = useState("");

    const handleSendEvent = () => {
        const fruit = fruits[fruitIndex];
        triggerEvent(fruit);
        setFruitIndex((fruitIndex + 1) % fruits.length);
    };

    return (
        <Container>
            <Title>Pusher Data Transfer Stats</Title>
            <StatItem>
                <span>Last Received Message:</span>
                <Value>{receivedMessage}</Value>
            </StatItem>
            <ButtonContainer>
                <Button onClick={handleSendEvent}>Send Fruit</Button>
            </ButtonContainer>
        </Container>
    );
}

export default PusherStatsDisplay;
