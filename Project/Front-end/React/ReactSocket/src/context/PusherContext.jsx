import React, { createContext, useContext, useState, useEffect } from 'react';
import Pusher from 'pusher-js';

const PusherContext = createContext();

export const usePusher = () => useContext(PusherContext);

export const PusherProvider = ({ children }) => {
    const [channel, setChannel] = useState(null);

    useEffect(() => {
        const pusher = new Pusher('cdffdac27fe6636df8ef', {
            cluster: 'eu',
            forceTLS: true
        });

        const channelInstance = pusher.subscribe('my-channel');
        channelInstance.bind('my-event', (data) => {
            console.log('Received data:', data);
        });

        channelInstance.bind('pusher:subscription_succeeded', () => {
            console.log('Successfully subscribed to my-channel');
            setChannel(channelInstance);
        });

        channelInstance.bind('pusher:subscription_error', (status) => {
            console.error('Subscription error:', status);
        });

        return () => {
            pusher.unsubscribe('my-channel');
            pusher.disconnect();
        };
    }, []);

    const triggerEvent = async (message) => {
        try {
            const response = await fetch('http://localhost:4004/pusher/trigger', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    channel: 'my-channel',
                    event: 'my-event',
                    message: message
                }),
            });
            const data = await response.json();
            console.log('Event triggered:', data);
        } catch (error) {
            console.error('Error triggering event:', error);
        }
    };

    return (
        <PusherContext.Provider value={{ channel, triggerEvent }}>
            {children}
        </PusherContext.Provider>
    );
};
