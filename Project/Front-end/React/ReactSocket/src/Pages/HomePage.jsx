import React from 'react';
import Layout from "../components/layout/index.jsx";
import StatsDisplay from "../components/organisms/SocketIOStatsDisplay/index.jsx";
import RxJSWebSocketStatsDisplay from "../components/organisms/RxJSWebSocketStatsDisplay/index.jsx";
import SockJSStatsDisplay from "../components/organisms/SockJSStatsDisplay/index.jsx";
import PusherStatsDisplay from "../components/organisms/PusherStatsDisplay/index.jsx";

import {Boxer} from "./styles.js";


function HomePage() {
    return (
        <Layout title="Homepage">
            <Boxer>
                <StatsDisplay />
                <RxJSWebSocketStatsDisplay />
            </Boxer>
            {/*
             <Boxer>
                <PusherStatsDisplay />
                <SockJSStatsDisplay />
            </Boxer>
            */}
        </Layout>
    );
}

export default HomePage;
