import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
    const [serverStats, setServerStats] = useState({
        name: "SocketIO",
        totalBytesSent: 0,
        totalBytesReceived: 0,
        vegetable: "",
        fruit: "",
        details: {
            Status: "",
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

    const socket = io('http://localhost:4000', {
        transports: ['websocket']
    });

    const fruits = [
        "Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape", "Honeydew", "Indian Fig", "Jackfruit",
        "Kiwi", "Lemon", "Mango", "Nectarine", "Orange", "Papaya", "Quince", "Raspberry", "Strawberry", "Tangerine",
        "Ugli Fruit", "Vanilla", "Watermelon", "Xigua", "Yellow Passion Fruit", "Ziziphus", "Apricot", "Blueberry",
        "Cantaloupe", "Durian"
    ];
    let fruitIndex = 0;

    const byteLength = (str) => new TextEncoder().encode(str).length;

    const sendFruitToServer = async () => {
        const fruit = fruits[fruitIndex];
        const dataSize = byteLength(fruit);
        setServerStats(prev => ({
            ...prev,
            fruit,
            totalBytesSent: prev.totalBytesSent + dataSize,
            speed: {
                ...prev.speed,
                send: dataSize
            }
        }));
        try {
            socket.emit('dataFromClient', { fruit });
        } catch (err) {
            console.error("Error sending fruit data to server:", err);
        }
        fruitIndex = (fruitIndex + 1) % fruits.length;
    };

    useEffect(() => {
        socket.on('dataFromServer', async (data) => {
            setServerStats(prev => ({
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
            await sendFruitToServer(); // Send the next fruit to the server
        });

        socket.on('serverStats', (data) => {
            setServerStats(prev => ({
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
    }, []);

    return (
        <WebSocketContext.Provider value={{ serverStats }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export { WebSocketProvider, WebSocketContext };
