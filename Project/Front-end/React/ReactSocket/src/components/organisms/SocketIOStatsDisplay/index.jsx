import React, { useContext } from 'react';
import { WebSocketContext } from "../../../context/WebSocketContext.jsx";
import { Container, StatItem, Title, Value, ButtonContainer, Button } from "./styles.js";

function SocketIOStatsDisplay() {
    const { socketIOStats, startSocketIOConnection, stopSocketIOConnection } = useContext(WebSocketContext);

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
                <span>Total Sent:</span>
                <Value>{socketIOStats.details.Transferred}</Value>
            </StatItem>
            <StatItem>
                <span>Total Received:</span>
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
            <ButtonContainer>
                <Button onClick={startSocketIOConnection} disabled={socketIOStats.details.Status === "Connected"}>Connect Socket.IO</Button>
                <Button onClick={stopSocketIOConnection} disabled={socketIOStats.details.Status !== "Connected"}>Disconnect Socket.IO</Button>
            </ButtonContainer>
        </Container>
    );
}

export default SocketIOStatsDisplay;
