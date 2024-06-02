import React from 'react';
import Layout from "../components/layout/index.jsx";
import StatsDisplay from "../components/organisms/SocketIOStatsDisplay/index.jsx";
import RxJSWebSocketStatsDisplay from "../components/organisms/RxJSWebSocketStatsDisplay/index.jsx";
import WsStatsDisplay from "../components/organisms/WsStatsDisplay/index.jsx";
import { Boxer } from "./styles.js";

function HomePage() {
    return (
        <Layout title="Homepage">
            <Boxer>
                <StatsDisplay />
                <RxJSWebSocketStatsDisplay />
                <WsStatsDisplay url="ws://localhost:4003" protocol="ws" />
            </Boxer>
        </Layout>
    );
}

export default HomePage;
