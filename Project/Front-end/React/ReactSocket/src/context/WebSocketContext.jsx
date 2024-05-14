import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { webSocket } from 'rxjs/webSocket';

const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
    const [socketIOStats, setSocketIOStats] = useState({
        totalBytesSent: 0,
        totalBytesReceived: 0,
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
    });

    const [rxjsWebSocketStats, setRxjsWebSocketStats] = useState({
        totalBytesSent: 0,
        totalBytesReceived: 0,
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
    });

    const [socket, setSocket] = useState(null);
    const [rxjsSocket, setRxjsSocket] = useState(null);

    const fruits = [
        "Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape", "Honeydew", "Indian Fig", "Jackfruit",
        "Kiwi", "Lemon", "Mango", "Nectarine", "Orange", "Papaya", "Quince", "Raspberry", "Strawberry", "Tangerine",
        "Ugli Fruit", "Vanilla", "Watermelon", "Xigua", "Yellow Passion Fruit", "Ziziphus", "Apricot", "Blueberry",
        "Cantaloupe", "Durian"
    ];
    let fruitIndex = 0;

    const byteLength = (str) => new TextEncoder().encode(str).length;

    // Socket.IO handlers
    const sendFruitToServer = async () => {
        const fruit = fruits[fruitIndex];
        const dataSize = byteLength(fruit);
        setSocketIOStats(prev => ({
            ...prev,
            fruit,
            totalBytesSent: prev.totalBytesSent + dataSize,
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

        newSocket.on('connect', () => {
            console.log("Socket.IO connected");
        });

        newSocket.on('connect_error', (error) => {
            console.error("Socket.IO connection error:", error);
        });

        newSocket.on('disconnect', () => {
            console.log("Socket.IO disconnected");
        });

        setSocket(newSocket);
        setSocketIOStats(prev => ({ ...prev, details: { ...prev.details, Status: "Connected" } }));
        newSocket.emit('startSending');
    };

    const stopSocketIOConnection = () => {
        if (socket) {
            console.log("Stopping Socket.IO connection...");
            socket.emit('stopSending');
            socket.disconnect();
            setSocket(null);
            setSocketIOStats(prev => ({
                ...prev,
                details: { ...prev.details, Status: "Disconnected" },
                vegetable: "",
                fruit: "",
                totalBytesSent: 0,
                totalBytesReceived: 0,
                speed: { send: 0, receive: 0 },
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
                    details: {
                        ...prev.details,
                        Transferred: data.details.Transferred
                    },
                    speed: {
                        ...prev.speed,
                        send: data.dataSize
                    }
                }));
                sendFruitToServer(); // Send the next fruit to the server
            });

            socket.on('serverStats', (data) => {
                console.log('Server stats received:', data);
                setSocketIOStats(prev => ({
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
            });

            return () => {
                socket.off('dataFromServer');
                socket.off('serverStats');
            };
        }
    }, [socket]);

    // RxJS WebSocket handlers
    const sendFruitToRxjsServer = (subject) => {
        const fruit = fruits[fruitIndex];
        const dataSize = byteLength(fruit);
        setRxjsWebSocketStats(prev => ({
            ...prev,
            fruit,
            totalBytesSent: prev.totalBytesSent + dataSize,
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
        setRxjsWebSocketStats(prev => ({ ...prev, details: { ...prev.details, Status: "Connected" } }));

        subject.subscribe(
            (msg) => {
                const data = msg;
                if (data.vegetable) {
                    setRxjsWebSocketStats(prev => ({
                        ...prev,
                        vegetable: data.vegetable,
                        totalBytesSent: data.totalBytesSent,
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

        sendFruitToRxjsServer(subject); // Start sending fruits
    };

    const stopRxjsSocketConnection = () => {
        if (rxjsSocket) {
            console.log("Stopping RxJS WebSocket connection...");
            rxjsSocket.complete();
            setRxjsSocket(null);
            setRxjsWebSocketStats(prev => ({
                ...prev,
                details: { ...prev.details, Status: "Disconnected" },
                vegetable: "",
                fruit: "",
                totalBytesSent: 0,
                totalBytesReceived: 0,
                speed: { send: 0, receive: 0 },
            }));
        }
    };

    return (
        <WebSocketContext.Provider value={{
            socketIOStats,
            startSocketIOConnection,
            stopSocketIOConnection,
            rxjsWebSocketStats,
            startRxjsSocketConnection,
            stopRxjsSocketConnection
        }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export { WebSocketProvider, WebSocketContext };
