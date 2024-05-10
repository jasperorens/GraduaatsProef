import React, { useContext } from 'react';
import { WebSocketContext } from "../../../context/WebSocketContext.jsx";
import { Container, StatItem, Title, Value } from "./styles.js";

function StatsDisplay() {
    const { serverStats } = useContext(WebSocketContext);

    return (
        <Container>
            <Title>Socket.IO Data Transfer Stats</Title>
            <StatItem>
                <span>Fruit Sent:</span>
                <Value>{serverStats.fruit}</Value>
            </StatItem>
            <StatItem>
                <span>Vegetable Received:</span>
                <Value>{serverStats.vegetable}</Value>
            </StatItem>
            <StatItem>
                <span>Total Sent:</span>
                <Value>{serverStats.details.Transferred}</Value>
            </StatItem>
            <StatItem>
                <span>Total Received:</span>
                <Value>{serverStats.details.Received}</Value>
            </StatItem>
            <StatItem>
                <span>Send Speed:</span>
                <Value>{serverStats.speed.send} B/s</Value>
            </StatItem>
            <StatItem>
                <span>Receive Speed:</span>
                <Value>{serverStats.speed.receive} B/s</Value>
            </StatItem>
        </Container>
    );
}

export default StatsDisplay;
