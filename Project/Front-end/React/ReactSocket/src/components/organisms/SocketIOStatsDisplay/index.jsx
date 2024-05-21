import React, { useState, useEffect } from 'react';
import { useSocketIO } from "../../../context/SocketIOContext";
import { Container, StatItem, Title, Value, ButtonContainer, Button } from "./styles.js";

function SocketIOStatsDisplay() {
    const { socketIOStats, startSocketIOConnection, stopSocketIOConnection, socket } = useSocketIO();

    // State variables for maximum speeds
    const [maxSendSpeed, setMaxSendSpeed] = useState(0);
    const [maxReceiveSpeed, setMaxReceiveSpeed] = useState(0);

    // State variables for excluded overhead
    const [excludedOverheadSend, setExcludedOverheadSend] = useState(0);
    const [excludedOverheadReceive, setExcludedOverheadReceive] = useState(0);

    // Byte length function
    const byteLength = (str) => new TextEncoder().encode(str).length;

    // Effect to update the maximum speeds
    useEffect(() => {
        if (socketIOStats.speed.send > maxSendSpeed) {
            setMaxSendSpeed(socketIOStats.speed.send);
        }
        if (socketIOStats.speed.receive > maxReceiveSpeed) {
            setMaxReceiveSpeed(socketIOStats.speed.receive);
        }
    }, [socketIOStats.speed]);

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

        if (socket) {
            socket.on('dataFromServer', (data) => {
                console.log('Data from server:', data);
                updateExcludedOverheadReceive(data);
            });

            socket.on('serverStats', (data) => {
                console.log('Server stats:', data);
                updateExcludedOverheadReceive(data);
            });

            socket.on('dataFromClient', (data) => {
                console.log('Data sent to server:', data);
                updateExcludedOverheadSend(data.fruit);
            });

            return () => {
                socket.off('dataFromServer');
                socket.off('serverStats');
                socket.off('dataFromClient');
            };
        }
    }, [socket]);

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
                <span>Total Sent Bytes:</span>
                <Value>{socketIOStats.details.Transferred} B</Value>
            </StatItem>
            <StatItem>
                <span>Total Received Bytes:</span>
                <Value>{socketIOStats.details.Received} B</Value>
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
                <Value>{socketIOStats.speed.send} B/s</Value>
            </StatItem>
            <StatItem>
                <span>Receive Speed:</span>
                <Value>{socketIOStats.speed.receive} B/s</Value>
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
                <Value>{socketIOStats.totalObjectsSent}</Value>
            </StatItem>
            <StatItem>
                <span>Total Received Objects:</span>
                <Value>{socketIOStats.totalObjectsReceived}</Value>
            </StatItem>
            <ButtonContainer>
                <Button onClick={startSocketIOConnection} disabled={socketIOStats.details.Status === "Connected"}>Connect</Button>
                <Button onClick={stopSocketIOConnection} disabled={socketIOStats.details.Status !== "Connected"}>Disconnect</Button>
            </ButtonContainer>
        </Container>
    );
}

export default SocketIOStatsDisplay;
