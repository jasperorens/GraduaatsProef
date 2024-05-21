import React from 'react';
import Layout from "../components/layout/index.jsx";
import StatsDisplay from "../components/organisms/SocketIOStatsDisplay/index.jsx";
import RxJSWebSocketStatsDisplay from "../components/organisms/RxJSWebSocketStatsDisplay/index.jsx";
import SockJSStatsDisplay from "../components/organisms/SockJSStatsDisplay/index.jsx";
import PusherStatsDisplay from "../components/organisms/PusherStatsDisplay/index.jsx";

function HomePage() {
    return (
        <Layout title="Homepage">
            <StatsDisplay />
            <RxJSWebSocketStatsDisplay />
            <PusherStatsDisplay/>
            <SockJSStatsDisplay />
        </Layout>
    );
}

export default HomePage;
