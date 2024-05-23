import React from 'react';
import { SocketIOProvider } from './SocketIOContext';
import { RxJSWebSocketProvider } from './RxJSWebSocketContext';



const WebSocketProvider = ({ children }) => {
    return (
        <SocketIOProvider>

                <RxJSWebSocketProvider>

                        {children}

                </RxJSWebSocketProvider>

        </SocketIOProvider>
    );
};

export default WebSocketProvider;
