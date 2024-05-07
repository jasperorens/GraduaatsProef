import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import WebSocketList from "../config/WebSocketList.js";

const WebSocketContext = createContext();

const connectionDetails = {
    Status: "",
    Transferred: "",
    Connection: "",
    Protocol: "",
};


const WebSocketProvider = ({ children }) => {
    const [sockets, setSockets] = useState(WebSocketList.map(sock => ({ ...sock, details: connectionDetails })));
    const socket = io('http://localhost:4000', {
        transports: ['websocket']
    });
    socket.on('dataReceived', (data) => {
        console.log('Received data:', data);
        // Other logic...
    });


    useEffect(() => {
        const handleDataReceived = (data) => {
            console.log('Received data:', data);
            setSockets(currentSockets => {
                return currentSockets.map(sock => {
                    if (sock.name === data.name) {
                        return {
                            ...sock,
                            incoming: data.incoming,
                            outgoing: data.outgoing,
                            details: data.details // Update the details dynamically
                        };
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
