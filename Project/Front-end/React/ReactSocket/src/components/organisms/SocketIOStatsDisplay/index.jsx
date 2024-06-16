import React, { useState, useEffect } from 'react';
import { useSocketIO } from "../../../context/SocketIOContext";
import { Container, StatItem, Title, Value, ButtonContainer, Button } from "./styles.js";

function SocketIOStatsDisplay() {
    const { socketIOStats, startSocketIOConnection, stopSocketIOConnection, socket } = useSocketIO();
    const [calculateResult, setCalculateResult] = useState(0);
    const [maxSendSpeed, setMaxSendSpeed] = useState(0);
    const [maxReceiveSpeed, setMaxReceiveSpeed] = useState(0);

    // State variables for excluded overhead
    const [excludedOverheadSend, setExcludedOverheadSend] = useState(0);
    const [excludedOverheadReceive, setExcludedOverheadReceive] = useState(0);

    // State variable for disabling the Disconnect button
    const [disableDisconnect, setDisableDisconnect] = useState(false);

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

    //Taking in to account that this triggers to late i have calculated it to stop on 80000 by reducing
    //it by 339
    useEffect(() => {
        if (socketIOStats.totalObjectsReceived >= 80000) {
            stopSocketIOConnection();
            setDisableDisconnect(true);
        }
    }, [socketIOStats.totalObjectsReceived]);

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
            console.log("Socket is connected, setting up listeners");

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
                console.log("Cleaning up socket listeners");
                socket.off('dataFromServer');
                socket.off('serverStats');
                socket.off('dataFromClient');
            };
        }
    }, [socket]);

    function calculate() {
        let result = socketIOStats.details.Received / socketIOStats.totalObjectsReceived;
        setCalculateResult(result);
    }

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
            <StatItem>
                <span>Average package size:</span>
                <Value>{calculateResult}</Value>
            </StatItem>
            <ButtonContainer>
                <Button onClick={() => { console.log('Connect button clicked'); startSocketIOConnection(); }} disabled={socketIOStats.details.Status === "Connected"}>Connect</Button>
                <Button onClick={() => { console.log('Disconnect button clicked'); stopSocketIOConnection(); }} disabled={disableDisconnect || socketIOStats.details.Status !== "Connected"}>Disconnect</Button>
                <Button onClick={calculate}>Calculate size</Button>
            </ButtonContainer>
        </Container>
    );
}

export default SocketIOStatsDisplay;
