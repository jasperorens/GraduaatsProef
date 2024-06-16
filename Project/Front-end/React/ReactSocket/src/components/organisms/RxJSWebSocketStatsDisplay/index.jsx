import React, { useState, useEffect } from 'react';
import { useRxJSWebSocket } from '../../../context/RxJSWebSocketContext';
import { Container, StatItem, Title, Value, ButtonContainer, Button } from "../SocketIOStatsDisplay/styles.js";

const RxJSWebSocketStatsDisplay = () => {
    const { rxjsWebSocketStats, startRxjsSocketConnection, stopRxjsSocketConnection, rxjsSocket } = useRxJSWebSocket();

    // State variables for maximum speeds
    const [maxSendSpeed, setMaxSendSpeed] = useState(0);
    const [maxReceiveSpeed, setMaxReceiveSpeed] = useState(0);
    const [calculateResult, setCalculateResult] = useState(0);
    // State variables for excluded overhead
    const [excludedOverheadSend, setExcludedOverheadSend] = useState(0);
    const [excludedOverheadReceive, setExcludedOverheadReceive] = useState(0);

    // Byte length function
    const byteLength = (str) => new TextEncoder().encode(str).length;

    // Effect to update the maximum speeds
    useEffect(() => {
        if (rxjsWebSocketStats.speed.send > maxSendSpeed) {
            setMaxSendSpeed(rxjsWebSocketStats.speed.send);
        }
        if (rxjsWebSocketStats.speed.receive > maxReceiveSpeed) {
            setMaxReceiveSpeed(rxjsWebSocketStats.speed.receive);
        }
    }, [rxjsWebSocketStats.speed]);

    useEffect(() => {
        const updateExcludedOverheadSend = (fruit) => {
            const originalSize = byteLength(fruit);
            console.log(`Original send size: ${originalSize} bytes`);
            setExcludedOverheadSend(prev => prev + originalSize);
        };

        const updateExcludedOverheadReceive = (data) => {
            const receivedString = data.vegetable || data.fruit;
            const originalSize = byteLength(receivedString);
            console.log(`Original receive size: ${originalSize} bytes`);
            setExcludedOverheadReceive(prev => prev + originalSize);
        };

        if (rxjsSocket) {
            const subscription = rxjsSocket.subscribe(
                (msg) => {
                    const data = msg;
                    if (data.vegetable) {
                        updateExcludedOverheadReceive(data);
                    } else if (data.fruit) {
                        updateExcludedOverheadReceive(data);
                    }
                },
                (err) => console.error('RxJS WebSocket error:', err),
                () => console.log('RxJS WebSocket connection closed')
            );

            rxjsSocket.subscribe({
                next: (data) => {
                    if (data.fruit) {
                        updateExcludedOverheadSend(data.fruit);
                    }
                },
                error: (err) => console.error('RxJS WebSocket error:', err)
            });

            return () => subscription.unsubscribe();
        }
    }, [rxjsSocket]);

    function calculate() {
        let result = rxjsWebSocketStats.details.Received / rxjsWebSocketStats.totalObjectsReceived
        setCalculateResult(result);
    }

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
                <span>Total Sent Bytes:</span>
                <Value>{rxjsWebSocketStats.totalBytesSent} B</Value>
            </StatItem>
            <StatItem>
                <span>Total Received Bytes:</span>
                <Value>{rxjsWebSocketStats.totalBytesReceived} B</Value>
            </StatItem>
            {/*
             <StatItem>
                <span>Excluded Overhead Sent:</span>
                <Value>{excludedOverheadSend} B</Value>
            </StatItem>
            <StatItem>
                <span>Excluded Overhead Received:</span>
                <Value>{excludedOverheadReceive} B</Value>
            </StatItem>
            */}
            <StatItem>
                <span>Send Speed:</span>
                <Value>{rxjsWebSocketStats.speed.send} B/s</Value>
            </StatItem>
            <StatItem>
                <span>Receive Speed:</span>
                <Value>{rxjsWebSocketStats.speed.receive} B/s</Value>
            </StatItem>
            <StatItem>
                <span>Max Send Speed:</span>
                <Value>{maxSendSpeed} B/s</Value>
            </StatItem>
            <StatItem>
                <span>Max Receive Speed:</span>
                <Value>{maxReceiveSpeed} B/s</Value>
            </StatItem>
            <StatItem>
                <span>Total Sent Objects:</span>
                <Value>{rxjsWebSocketStats.totalObjectsSent}</Value>
            </StatItem>
            <StatItem>
                <span>Total Received Objects:</span>
                <Value>{rxjsWebSocketStats.totalObjectsReceived}</Value>
            </StatItem>
            <StatItem>
                <span>Average package size</span>
                <span>{calculateResult}</span>
            </StatItem>
            <ButtonContainer>
                <Button onClick={startRxjsSocketConnection} disabled={rxjsWebSocketStats.details.Status === "Connected"}>Connect</Button>
                <Button onClick={stopRxjsSocketConnection} disabled={rxjsWebSocketStats.details.Status !== "Connected"}>Disconnect</Button>
                <Button onClick={calculate}>Calculate size</Button>
            </ButtonContainer>
        </Container>
    );
};

export default RxJSWebSocketStatsDisplay;
