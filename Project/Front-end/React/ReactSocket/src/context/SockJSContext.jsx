import React, { createContext, useContext, useState } from 'react';
import SockJS from 'sockjs-client';

const SockJSContext = createContext();

export const useSockJS = () => useContext(SockJSContext);

export const SockJSProvider = ({ children }) => {
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

    const [sockJSStats, setSockJSStats] = useState(initialState);
    const [sockJSSocket, setSockJSSocket] = useState(null);

    const startSockJSConnection = () => {
        console.log("Starting SockJS connection...");
        const newSockJSSocket = new SockJS('http://localhost:4003/sockjs', null, {
            debug: true,
            transports: ['websocket', 'xhr-streaming', 'xhr-polling']
        });

        newSockJSSocket.onopen = () => {
            console.log("SockJS connected");
            setSockJSStats(prev => ({
                ...prev,
                details: { ...prev.details, Status: "Connected" }
            }));
        };

        newSockJSSocket.onmessage = (e) => {
            console.log("SockJS received data:", e.data);
        };

        newSockJSSocket.onclose = (e) => {
            console.log(`SockJS disconnected, code: ${e.code}, reason: ${e.reason}`);
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
            }));
        }
    };

    return (
        <SockJSContext.Provider value={{ sockJSStats, startSockJSConnection, stopSockJSConnection }}>
            {children}
        </SockJSContext.Provider>
    );
};
