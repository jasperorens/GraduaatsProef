const WebSocketList = [
    {
        name: "SocketIO",
        incoming: 0,
        outgoing: 0,
        addFamily: 0,
        descriptor: "descriptor",
        type: "type",
        protocol: {
            WS: true,
            WSS: true,
            LP: true
        },
        backend: ".NET"
    },
    {
        name: "Pusher",
        incoming: 0,
        outgoing: 0,
        addFamily: 0,
        descriptor: "descriptor",
        type: "type",
        protocol: {
            WS: false,
            WSS: false,
            LP: true
        },
        backend: ".NET"
    },
    {
        name: "GraphQL Subscription",
        incoming: 0,
        outgoing: 0,
        addFamily: 0,
        descriptor: "descriptor",
        type: "type",
        protocol: {
            WS: true,
            WSS: true,
            LP: false
        },
        backend: ".NET"
    }
];

export default WebSocketList;
