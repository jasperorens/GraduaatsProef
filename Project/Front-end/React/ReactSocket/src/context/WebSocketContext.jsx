import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import WebSocketList from "../config/WebSocketList.js";

const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
    const [sockets, setSockets] = useState(WebSocketList);
    const socket = io('http://localhost:4000', {
        transports: ['websocket']
    });
    socket.on('dataReceived', (data) => {
        console.log('Received data:', data);
        // Other logic...
    });


    useEffect(() => {
        const handleDataReceived = (data) => {
            setSockets(currentSockets => {
                return currentSockets.map(sock => {
                    if (sock.name === data.name) {
                        // Ensure we create a new object to help React detect the change
                        return {...sock, incoming: data.incoming, outgoing: data.outgoing};
                    }
                    return {...sock};
                });
            });
        };


        socket.on('dataReceived', handleDataReceived);

        return () => {
            socket.off('dataReceived', handleDataReceived);
        };
    }, []);



    return (
        <WebSocketContext.Provider value={{ sockets }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export { WebSocketProvider, WebSocketContext };
