import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { webSocket } from 'rxjs/webSocket';
import SockJS from 'sockjs-client';

const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
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
    const [rxjsWebSocketStats, setRxjsWebSocketStats] = useState(initialState);
    const [sockJSStats, setSockJSStats] = useState(initialState);

    const [socket, setSocket] = useState(null);
    const [rxjsSocket, setRxjsSocket] = useState(null);
    const [sockJSSocket, setSockJSSocket] = useState(null);

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
            totalObjectsSent: prev.totalObjectsSent + 1, // Increment total sent objects
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
            setSocketIOStats(prev => ({
                ...prev,
                details: { ...prev.details, Status: "Connected" }
            }));
        });

        newSocket.on('connect_error', (error) => {
            console.error("Socket.IO connection error:", error);
        });

        newSocket.on('disconnect', () => {
            console.log("Socket.IO disconnected");
        });

        setSocket(newSocket);
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
                details: { ...prev.details, Status: "Disconnected" }
                // Retain other state values
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
                    totalObjectsReceived: prev.totalObjectsReceived + 1, // Increment total received objects
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
            totalObjectsSent: prev.totalObjectsSent + 1, // Increment total sent objects
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
                        totalObjectsReceived: prev.totalObjectsReceived + 1, // Increment total received objects
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
                details: { ...prev.details, Status: "Disconnected" }
                // Retain other state values
            }));
        }
    };

    // SockJS handlers
    const sendFruitToSockJSServer = (sockJSSocket) => {
        const fruit = fruits[fruitIndex];
        const dataSize = byteLength(fruit);
        setSockJSStats(prev => ({
            ...prev,
            fruit,
            totalBytesSent: prev.totalBytesSent + dataSize,
            totalObjectsSent: prev.totalObjectsSent + 1, // Increment total sent objects
            speed: {
                ...prev.speed,
                send: dataSize
            }
        }));
        try {
            console.log(`SockJS: Sending fruit: ${fruit}, size: ${dataSize} bytes`);
            sockJSSocket.send(JSON.stringify({ fruit }));
        } catch (err) {
            console.error("Error sending fruit data to SockJS server:", err);
        }
        fruitIndex = (fruitIndex + 1) % fruits.length;
    };

    const startSockJSConnection = () => {
        console.log("Starting SockJS connection...");
        const newSockJSSocket = new SockJS('http://localhost:4003/sockjs');

        newSockJSSocket.onopen = () => {
            console.log("SockJS connected");
            setSockJSStats(prev => ({
                ...prev,
                details: { ...prev.details, Status: "Connected" }
            }));
            sendFruitToSockJSServer(newSockJSSocket);
        };

        newSockJSSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log("SockJS received data:", data);
            if (data.vegetable) {
                setSockJSStats(prev => ({
                    ...prev,
                    vegetable: data.vegetable,
                    totalBytesSent: data.totalBytesSent,
                    totalObjectsReceived: prev.totalObjectsReceived + 1, // Increment total received objects
                    details: {
                        ...prev.details,
                        Transferred: data.details.Transferred
                    },
                    speed: {
                        ...prev.speed,
                        send: data.dataSize
                    }
                }));
                sendFruitToSockJSServer(newSockJSSocket);
            } else if (data.fruit) {
                setSockJSStats(prev => ({
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
        };

        newSockJSSocket.onclose = () => {
            console.log("SockJS disconnected");
            setSockJSStats(prev => ({
                ...prev,
                details: { ...prev.details, Status: "Disconnected" }
            }));
        };

        newSockJSSocket.onerror = (err) => {
            console.error("SockJS connection error:", err);
        };

        setSockJSSocket(newSockJSSocket);
    };

    const stopSockJSConnection = () => {
        if (sockJSSocket) {
            console.log("Stopping SockJS connection...");
            sockJSSocket.close();
            setSockJSSocket(null);
            setSockJSStats(prev => ({
                ...prev,
                details: { ...prev.details, Status: "Disconnected" }
                // Retain other state values
            }));
        }
    };

    const resetStats = () => {
        setSocketIOStats(initialState);
        setRxjsWebSocketStats(initialState);
        setSockJSStats(initialState);
    };

    return (
        <WebSocketContext.Provider value={{
            socketIOStats,
            startSocketIOConnection,
            stopSocketIOConnection,
            rxjsWebSocketStats,
            startRxjsSocketConnection,
            stopRxjsSocketConnection,
            sockJSStats,
            startSockJSConnection,
            stopSockJSConnection,
            resetStats
        }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export { WebSocketProvider, WebSocketContext };