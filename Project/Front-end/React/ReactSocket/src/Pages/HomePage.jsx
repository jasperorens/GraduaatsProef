import React from 'react';
import Layout from "../components/layout/index.jsx";
import StatsDisplay from "../components/organisms/StatsDisplay/index.jsx";

function HomePage() {
    return (
        <Layout title="Homepage">
            <StatsDisplay />
        </Layout>
    );
}

export default HomePage;
