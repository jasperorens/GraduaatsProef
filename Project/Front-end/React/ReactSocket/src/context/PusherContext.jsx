import React, { createContext, useContext, useState, useEffect } from 'react';
import Pusher from 'pusher-js';

const PusherContext = createContext();

export const usePusher = () => useContext(PusherContext);

export const PusherProvider = ({ children }) => {
    const [pusher, setPusher] = useState(null);
    const [channel, setChannel] = useState(null);

    useEffect(() => {
        const pusherClient = new Pusher('cdffdac27fe6636df8ef', {
            cluster: 'eu',
            authEndpoint: 'http://localhost:4004/pusher/auth',
            forceTLS: true
        });

        const channel = pusherClient.subscribe('private-my-channel');

        channel.bind('pusher:subscription_succeeded', () => {
            console.log('Subscription to private channel succeeded');
        });

        channel.bind('pusher:subscription_error', (status) => {
            console.error('Subscription error:', status);
        });

        pusherClient.connection.bind('connected', () => {
            console.log('Pusher connected');
        });

        pusherClient.connection.bind('error', (err) => {
            console.error('Pusher connection error:', err);
        });

        setPusher(pusherClient);
        setChannel(channel);

        return () => {
            channel.unbind_all();
            pusherClient.disconnect();
        };
    }, []);

    const triggerEvent = (event, data) => {
        if (channel) {
            channel.trigger(event, data);
        }
    };

    return (
        <PusherContext.Provider value={{ pusher, channel, triggerEvent }}>
            {children}
        </PusherContext.Provider>
    );
};
