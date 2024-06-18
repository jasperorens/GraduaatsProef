import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../../../context/WebSocketContext';
import { Container, StatItem, Title, Value, ButtonContainer, Button } from "../SocketIOStatsDisplay/styles.js";

const WsStatsDisplay = ({ url, protocol }) => {
    const { wsStats, startWsSocketConnection, stopWsSocketConnection } = useWebSocket();
    const [calculateResult, setCalculateResult] = useState(0);
    const [disableDisconnect, setDisableDisconnect] = useState(false);
    const [maxSendSpeed, setMaxSendSpeed] = useState(0);
    const [maxReceiveSpeed, setMaxReceiveSpeed] = useState(0);

    useEffect(() => {
        if (wsStats.totalObjectsReceived >= 80000) {
            stopWsSocketConnection();
            setDisableDisconnect(true);
        }
    }, [wsStats.totalObjectsReceived]);

    useEffect(() => {
        if (wsStats.speed.send > maxSendSpeed) {
            setMaxSendSpeed(wsStats.speed.send);
        }
        if (wsStats.speed.receive > maxReceiveSpeed) {
            setMaxReceiveSpeed(wsStats.speed.receive);
        }
    }, [wsStats.speed]);

    function calculate() {
        let result = wsStats.details.Received / wsStats.totalObjectsReceived
        setCalculateResult(result);
    }

    return (
        <Container>
            <Title>{protocol.toUpperCase()} Data Transfer Stats</Title>
            <StatItem>
                <span>Connection Status:</span>
                <Value>{wsStats.details.Status}</Value>
            </StatItem>
            {/*
                        <StatItem>
                <span>Fruit Sent:</span>
                <Value>{wsStats.fruit}</Value>
            </StatItem>
            <StatItem>
                <span>Vegetable Received:</span>
                <Value>{wsStats.vegetable}</Value>
            </StatItem>
            */}
            &nbsp;
            <StatItem>
                <Value>Bytes:</Value>
            </StatItem>
            <StatItem>
                <span>Total Sent Bytes:</span>
                <Value>{wsStats.details.Transferred} B</Value>
            </StatItem>
            <StatItem>
                <span>Total Received Bytes:</span>
                <Value>{wsStats.details.Received} B</Value>
            </StatItem>
            {/*
                        <StatItem>
                <span>Send Speed:</span>
                <Value>{wsStats.speed.send} B/s</Value>
            </StatItem>
            <StatItem>
                <span>Receive Speed:</span>
                <Value>{wsStats.speed.receive} B/s</Value>
            </StatItem>
            */}
            &nbsp;
            <StatItem>
                <Value>Speed:</Value>
            </StatItem>
            <StatItem>
                <span>Max Send Speed:</span>
                <Value>{maxSendSpeed} B/s</Value>
            </StatItem>
            <StatItem>
                <span>Max Receive Speed:</span>
                <Value>{maxReceiveSpeed} B/s</Value>
            </StatItem>
            &nbsp;
            <StatItem>
                <Value>Objects:</Value>
            </StatItem>
            <StatItem>
                <span>Total Sent Objects:</span>
                <Value>{wsStats.totalObjectsSent}</Value>
            </StatItem>
            <StatItem>
                <span>Total Received Objects:</span>
                <Value>{wsStats.totalObjectsReceived}</Value>
            </StatItem>
            {/*
            <StatItem>
                <span>Average package size:</span>
                <Value>{calculateResult}</Value>
            </StatItem>
            */}
            <ButtonContainer>
                <Button onClick={() => startWsSocketConnection(url)} disabled={wsStats.details.Status === "Connected"}>Connect</Button>
                <Button onClick={() => { console.log('Disconnect button clicked'); stopWsSocketConnection(); }} disabled={disableDisconnect || wsStats.details.Status !== "Connected"}>Disconnect</Button>
                {/* <Button onClick={calculate}>Calculate size</Button> */}
            </ButtonContainer>
        </Container>
    );
};

export default WsStatsDisplay;
