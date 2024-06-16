import React, { createContext, useContext, useState } from 'react';
import { fruits } from '../constants/fruits'; // Importeer fruits uit hetzelfde bestand

const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
    const initialState = {
        totalBytesSent: 0,
        totalBytesReceived: 0,
        totalObjectsSent: 0,
        totalObjectsReceived: 0,
        vegetable: "",
        fruit: "",
        details: {
            Status: "Disconnected",
            Transferred: "",
            Received: "",
            Connection: "",
            Protocol: "",
        },
        speed: {
            send: 0,
            receive: 0,
        }
    };

    const [wsStats, setWsStats] = useState(initialState);
    const [ws, setWs] = useState(null);

    const byteLength = (str) => new TextEncoder().encode(str).length;

    let fruitIndex = 0;

    const sendFruitToWsServer = (wsInstance) => {
        const fruit = fruits[fruitIndex];
        const dataSize = byteLength(fruit);
        setWsStats(prev => ({
            ...prev,
            fruit,
            totalBytesSent: prev.totalBytesSent + dataSize,
            totalObjectsSent: prev.totalObjectsSent + 1,
            speed: {
                ...prev.speed,
                send: dataSize
            }
        }));
        try {
            wsInstance.send(JSON.stringify({ fruit }));
        } catch (err) {
            console.error("Error sending fruit data to WS server:", err);
        }
        fruitIndex = (fruitIndex + 1) % fruits.length;
    };

    const startWsSocketConnection = (url) => {
        console.log("Starting WebSocket connection...");
        const wsInstance = new WebSocket(url);

        wsInstance.onopen = () => {
            console.log("WebSocket connected");
            setWsStats(prev => ({
                ...prev,
                details: { ...prev.details, Status: "Connected" }
            }));
            sendFruitToWsServer(wsInstance);
        };

        wsInstance.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.vegetable) {
                setWsStats(prev => ({
                    ...prev,
                    vegetable: data.vegetable,
                    totalBytesSent: data.totalBytesSent,
                    totalObjectsReceived: prev.totalObjectsReceived + 1,
                    details: {
                        ...prev.details,
                        Transferred: data.details.Transferred
                    },
                    speed: {
                        ...prev.speed,
                        send: data.dataSize
                    }
                }));
                sendFruitToWsServer(wsInstance);
            } else if (data.fruit) {
                setWsStats(prev => ({
                    ...prev,
                    totalBytesReceived: data.totalBytesReceived,
                    totalObjectsReceived: prev.totalObjectsReceived + 1,
                    details: {
                        ...prev.details,
                        Received: data.details.Received
                    },
                    speed: {
                        ...prev.speed,
                        receive: data.dataSize
                    }
                }));
            }
        };

        wsInstance.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        wsInstance.onclose = () => {
            console.log("WebSocket disconnected");
            setWsStats(prev => ({
                ...prev,
                details: { ...prev.details, Status: "Disconnected" }
            }));
        };

        setWs(wsInstance);
    };

    const stopWsSocketConnection = () => {
        if (ws) {
            console.log("Stopping WebSocket connection...");
            ws.close();
            setWs(null);
            setWsStats(prev => ({
                ...prev,
                details: { ...prev.details, Status: "Disconnected" }
            }));
        }
    };

    return (
        <WebSocketContext.Provider value={{ wsStats, startWsSocketConnection, stopWsSocketConnection }}>
            {children}
        </WebSocketContext.Provider>
    );
};
