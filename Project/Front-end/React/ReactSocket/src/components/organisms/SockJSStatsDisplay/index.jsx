import React, { useContext } from 'react';
import { WebSocketContext } from "../../../context/WebSocketContext.jsx";
import { Container, StatItem, Title, Value, ButtonContainer, Button } from "../SocketIOStatsDisplay/styles.js";

function SockJSStatsDisplay() {
    const { sockJSStats, startSockJSConnection, stopSockJSConnection, resetStats } = useContext(WebSocketContext);

    return (
        <Container>
            <Title>SockJS Data Transfer Stats</Title>
            <StatItem>
                <span>Connection Status:</span>
                <Value>{sockJSStats.details.Status}</Value>
            </StatItem>
            <StatItem>
                <span>Fruit Sent:</span>
                <Value>{sockJSStats.fruit}</Value>
            </StatItem>
            <StatItem>
                <span>Vegetable Received:</span>
                <Value>{sockJSStats.vegetable}</Value>
            </StatItem>
            <StatItem>
                <span>Total Sent Bits:</span>
                <Value>{sockJSStats.details.Transferred}</Value>
            </StatItem>
            <StatItem>
                <span>Total Received Bits:</span>
                <Value>{sockJSStats.details.Received}</Value>
            </StatItem>
            <StatItem>
                <span>Send Speed:</span>
                <Value>{sockJSStats.speed.send} B/s</Value>
            </StatItem>
            <StatItem>
                <span>Receive Speed:</span>
                <Value>{sockJSStats.speed.receive} B/s</Value>
            </StatItem>
            <StatItem>
                <span>Total Sent Objects:</span>
                <Value>{sockJSStats.totalObjectsSent}</Value>
            </StatItem>
            <StatItem>
                <span>Total Received Objects:</span>
                <Value>{sockJSStats.totalObjectsReceived}</Value>
            </StatItem>
            <ButtonContainer>
                <Button onClick={startSockJSConnection} disabled={sockJSStats.details.Status === "Connected"}>Connect</Button>
                <Button onClick={stopSockJSConnection} disabled={sockJSStats.details.Status !== "Connected"}>Disconnect</Button>
                <Button onClick={resetStats}>Reset</Button>
            </ButtonContainer>
        </Container>
    );
}

export default SockJSStatsDisplay;
