import React, { useEffect, useState } from 'react';
import { usePusher } from '../../../context/PusherContext';
import { fruits } from '../../../constants/fruits';
import { Container, StatItem, Title, Value, ButtonContainer, Button } from "../SocketIOStatsDisplay/styles.js";

function PusherStatsDisplay() {
    const { pusher, channel, triggerEvent } = usePusher();
    const [fruitIndex, setFruitIndex] = useState(0);
    const [receivedMessage, setReceivedMessage] = useState("");

    useEffect(() => {
        if (channel) {
            channel.bind('client-my-event', (data) => {
                setReceivedMessage(data.message);
            });
        }

        return () => {
            if (channel) {
                channel.unbind('client-my-event');
            }
        };
    }, [channel]);

    const handleSendEvent = () => {
        const fruit = fruits[fruitIndex];
        triggerEvent('client-my-event', { message: fruit });
        setFruitIndex((fruitIndex + 1) % fruits.length);
    };

    return (
        <Container>
            <Title>Pusher Data Transfer Stats</Title>
            <StatItem>
                <span>Connection Status:</span>
                <Value>{pusher ? 'Connected' : 'Disconnected'}</Value>
            </StatItem>
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
