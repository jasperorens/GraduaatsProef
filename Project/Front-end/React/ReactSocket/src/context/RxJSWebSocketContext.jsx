import React, { createContext, useContext, useState } from 'react';
import { webSocket } from 'rxjs/webSocket';
import { fruits } from '../constants/fruits';

const RxJSWebSocketContext = createContext();

export const useRxJSWebSocket = () => useContext(RxJSWebSocketContext);

export const RxJSWebSocketProvider = ({ children }) => {
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

    const [rxjsWebSocketStats, setRxjsWebSocketStats] = useState(initialState);
    const [rxjsSocket, setRxjsSocket] = useState(null);

    let fruitIndex = 0;

    const byteLength = (str) => new TextEncoder().encode(str).length;

    const sendFruitToRxjsServer = (subject) => {
        const fruit = fruits[fruitIndex];
        const dataSize = byteLength(fruit);
        setRxjsWebSocketStats(prev => ({
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
            subject.next({ fruit });
        } catch (err) {
            console.error("Error sending fruit data to RxJS server:", err);
        }
        fruitIndex = (fruitIndex + 1) % fruits.length;
    };

    const startRxjsSocketConnection = () => {
        console.log("Starting RxJS WebSocket connection...");
        const subject = webSocket('ws://localhost:4002/rxjs-websocket');
        setRxjsSocket(subject);
        setRxjsWebSocketStats(prev => ({
            ...prev,
            details: { ...prev.details, Status: "Connected" }
        }));

        subject.subscribe(
            (msg) => {
                const data = msg;
                if (data.vegetable) {
                    setRxjsWebSocketStats(prev => ({
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
                    sendFruitToRxjsServer(subject);
                } else if (data.fruit) {
                    setRxjsWebSocketStats(prev => ({
                        ...prev,
                        totalBytesReceived: data.totalBytesReceived,
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
            },
            (err) => console.error('RxJS WebSocket error:', err),
            () => console.log('RxJS WebSocket connection closed')
        );

        sendFruitToRxjsServer(subject);
    };

    const stopRxjsSocketConnection = () => {
        if (rxjsSocket) {
            console.log("Stopping RxJS WebSocket connection...");
            rxjsSocket.complete();
            setRxjsSocket(null);
            setRxjsWebSocketStats(prev => ({
                ...prev,
                details: { ...prev.details, Status: "Disconnected" }
            }));
        }
    };

    return (
        <RxJSWebSocketContext.Provider value={{ rxjsWebSocketStats, startRxjsSocketConnection, stopRxjsSocketConnection }}>
            {children}
        </RxJSWebSocketContext.Provider>
    );
};
