import React from 'react';
import { useSockJS } from "../../../context/SockJSContext";
import { Container, StatItem, Title, Value, ButtonContainer, Button } from "../SocketIOStatsDisplay/styles.js";

function SockJSStatsDisplay() {
    const { sockJSStats, startSockJSConnection, stopSockJSConnection } = useSockJS();

    return (
        <Container>
            <Title>SockJS Data Transfer Stats</Title>
            <StatItem>
                <span>Connection Status:</span>
                <Value>{sockJSStats.details.Status}</Value>
            </StatItem>
            <ButtonContainer>
                <Button onClick={startSockJSConnection} disabled={sockJSStats.details.Status === "Connected"}>Connect</Button>
                <Button onClick={stopSockJSConnection} disabled={sockJSStats.details.Status !== "Connected"}>Disconnect</Button>
            </ButtonContainer>
        </Container>
    );
}

export default SockJSStatsDisplay;
