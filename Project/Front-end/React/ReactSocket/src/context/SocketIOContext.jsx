import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { fruits } from '../constants/fruits';

const SocketIOContext = createContext();

export const useSocketIO = () => useContext(SocketIOContext);

export const SocketIOProvider = ({ children }) => {
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

    const [socketIOStats, setSocketIOStats] = useState(initialState);
    const [socket, setSocket] = useState(null);

    let fruitIndex = 0;

    const byteLength = (str) => new TextEncoder().encode(str).length;

    const sendFruitToServer = (socket) => {
        const fruit = fruits[fruitIndex];
        const dataSize = byteLength(fruit);
        setSocketIOStats(prev => ({
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
            console.log(`Sending fruit to server: ${fruit}, size: ${dataSize} bytes`);
            socket.emit('dataFromClient', { fruit });
        } catch (err) {
            console.error("Error sending fruit data to server:", err);
        }
        fruitIndex = (fruitIndex + 1) % fruits.length;
    };

    const startSocketIOConnection = () => {
        console.log("Starting Socket.IO connection...");
        const newSocket = io('http://localhost:4001', {
            transports: ['websocket']
        });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log("Socket.IO connected");
            setSocketIOStats(prev => ({
                ...prev,
                details: { ...prev.details, Status: "Connected" }
            }));

            // Start sending data immediately upon connection
            sendFruitToServer(newSocket);
        });

        newSocket.on('connect_error', (error) => {
            console.error("Socket.IO connection error:", error);
        });

        newSocket.on('disconnect', () => {
            console.log("Socket.IO disconnected");
            setSocketIOStats(prev => ({
                ...prev,
                details: { ...prev.details, Status: "Disconnected" }
            }));
        });

        newSocket.on('dataFromServer', (data) => {
            console.log('Data received from server:', data);
            setSocketIOStats(prev => ({
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
            sendFruitToServer(newSocket);
        });

        newSocket.on('serverStats', (data) => {
            console.log('Server stats received:', data);
            setSocketIOStats(prev => ({
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
        });
    };

    const stopSocketIOConnection = () => {
        if (socket) {
            console.log("Stopping Socket.IO connection...");
            socket.disconnect();
            setSocket(null);
            setSocketIOStats(prev => ({
                ...prev,
                details: { ...prev.details, Status: "Disconnected" }
            }));
        }
    };

    useEffect(() => {
        if (socket) {
            socket.on('dataFromServer', (data) => {
                console.log('Data received from server:', data);
                setSocketIOStats(prev => ({
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
                sendFruitToServer(socket);
            });

            socket.on('serverStats', (data) => {
                console.log('Server stats received:', data);
                setSocketIOStats(prev => ({
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
            });

            return () => {
                socket.off('dataFromServer');
                socket.off('serverStats');
            };
        }
    }, [socket]);

    return (
        <SocketIOContext.Provider value={{ socketIOStats, startSocketIOConnection, stopSocketIOConnection, socket }}>
            {children}
        </SocketIOContext.Provider>
    );
};
