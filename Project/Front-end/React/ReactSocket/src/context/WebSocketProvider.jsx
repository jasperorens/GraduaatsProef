import React from 'react';
import { SocketIOProvider } from './SocketIOContext';
import { RxJSWebSocketProvider } from './RxJSWebSocketContext';
import { WebSocketProvider as NativeWebSocketProvider } from './WebSocketContext';

const WebSocketProvider = ({ children }) => {
    return (
        <SocketIOProvider>
            <RxJSWebSocketProvider>
                <NativeWebSocketProvider>
                    {children}
                </NativeWebSocketProvider>
            </RxJSWebSocketProvider>
        </SocketIOProvider>
    );
};

export default WebSocketProvider;
