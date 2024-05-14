import React from 'react';
import Layout from "../components/layout/index.jsx";
import SocketIOStatsDisplay from "../components/organisms/SocketIOStatsDisplay/index.jsx";
import RxJSWebSocketStatsDisplay from "../components/organisms/RxJSWebSocketStatsDisplay/index.jsx";

function HomePage() {
    return (
        <Layout title="Homepage">
            <SocketIOStatsDisplay />
            <RxJSWebSocketStatsDisplay />
        </Layout>
    );
}

export default HomePage;
