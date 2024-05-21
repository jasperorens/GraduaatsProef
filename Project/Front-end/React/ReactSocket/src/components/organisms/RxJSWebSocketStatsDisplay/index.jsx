import React from 'react';
import { useRxJSWebSocket } from "../../../context/RxJSWebSocketContext";
import { Container, StatItem, Title, Value, ButtonContainer, Button } from "./styles.js";

function RxJSWebSocketStatsDisplay() {
    const { rxjsWebSocketStats, startRxjsSocketConnection, stopRxjsSocketConnection } = useRxJSWebSocket();

    return (
        <Container>
            <Title>RxJS WebSocket Data Transfer Stats</Title>
            <StatItem>
                <span>Connection Status:</span>
                <Value>{rxjsWebSocketStats.details.Status}</Value>
            </StatItem>
            <StatItem>
                <span>Fruit Sent:</span>
                <Value>{rxjsWebSocketStats.fruit}</Value>
            </StatItem>
            <StatItem>
                <span>Vegetable Received:</span>
                <Value>{rxjsWebSocketStats.vegetable}</Value>
            </StatItem>
            <StatItem>
                <span>Total Sent:</span>
                <Value>{rxjsWebSocketStats.details.Transferred}</Value>
            </StatItem>
            <StatItem>
                <span>Total Received:</span>
                <Value>{rxjsWebSocketStats.details.Received}</Value>
            </StatItem>
            <StatItem>
                <span>Send Speed:</span>
                <Value>{rxjsWebSocketStats.speed.send} B/s</Value>
            </StatItem>
            <StatItem>
                <span>Receive Speed:</span>
                <Value>{rxjsWebSocketStats.speed.receive} B/s</Value>
            </StatItem>
            <ButtonContainer>
                <Button onClick={startRxjsSocketConnection} disabled={rxjsWebSocketStats.details.Status === "Connected"}>Connect RxJS WebSocket</Button>
                <Button onClick={stopRxjsSocketConnection} disabled={rxjsWebSocketStats.details.Status !== "Connected"}>Disconnect RxJS WebSocket</Button>
            </ButtonContainer>
        </Container>
    );
}

export default RxJSWebSocketStatsDisplay;
