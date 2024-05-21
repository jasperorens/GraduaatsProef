import React from 'react';
import { SocketIOProvider } from './SocketIOContext';
import { RxJSWebSocketProvider } from './RxJSWebSocketContext';
import { SockJSProvider } from './SockJSContext';
import {PusherProvider} from "./PusherContext.jsx";

const WebSocketProvider = ({ children }) => {
    return (
        <SocketIOProvider>
            <PusherProvider>
                <RxJSWebSocketProvider>
                    <SockJSProvider>
                        {children}
                    </SockJSProvider>
                </RxJSWebSocketProvider>
            </PusherProvider>
        </SocketIOProvider>
    );
};

export default WebSocketProvider;
