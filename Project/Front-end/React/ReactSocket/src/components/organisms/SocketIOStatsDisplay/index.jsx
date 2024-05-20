import React, { useContext } from 'react';
import { WebSocketContext } from "../../../context/WebSocketContext.jsx";
import { Container, StatItem, Title, Value, ButtonContainer, Button } from "./styles.js";

function SocketIOStatsDisplay() {
    const { socketIOStats, startSocketIOConnection, stopSocketIOConnection, resetStats } = useContext(WebSocketContext);

    return (
        <Container>
            <Title>Socket.IO Data Transfer Stats</Title>
            <StatItem>
                <span>Connection Status:</span>
                <Value>{socketIOStats.details.Status}</Value>
            </StatItem>
            <StatItem>
                <span>Fruit Sent:</span>
                <Value>{socketIOStats.fruit}</Value>
            </StatItem>
            <StatItem>
                <span>Vegetable Received:</span>
                <Value>{socketIOStats.vegetable}</Value>
            </StatItem>
            <StatItem>
                <span>Total Sent Bits:</span>
                <Value>{socketIOStats.details.Transferred}</Value>
            </StatItem>
            <StatItem>
                <span>Total Received Bits:</span>
                <Value>{socketIOStats.details.Received}</Value>
            </StatItem>
            <StatItem>
                <span>Send Speed:</span>
                <Value>{socketIOStats.speed.send} B/s</Value>
            </StatItem>
            <StatItem>
                <span>Receive Speed:</span>
                <Value>{socketIOStats.speed.receive} B/s</Value>
            </StatItem>
            <StatItem>
                <span>Total Sent Objects:</span>
                <Value>{socketIOStats.totalObjectsSent}</Value>
            </StatItem>
            <StatItem>
                <span>Total Received Objects:</span>
                <Value>{socketIOStats.totalObjectsReceived}</Value>
            </StatItem>
            <ButtonContainer>
                <Button onClick={startSocketIOConnection} disabled={socketIOStats.details.Status === "Connected"}>Connect</Button>
                <Button onClick={stopSocketIOConnection} disabled={socketIOStats.details.Status !== "Connected"}>Disconnect</Button>
                <Button onClick={resetStats}>Reset</Button>
            </ButtonContainer>
        </Container>
    );
}

export default SocketIOStatsDisplay;
