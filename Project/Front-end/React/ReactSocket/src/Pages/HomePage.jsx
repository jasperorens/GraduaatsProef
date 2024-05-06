import React, { useState } from 'react';
import "../index.css";
import Layout from "../components/layout/index.jsx";
import Carousel from "../components/organisms/Carousel/index.jsx";
import {PlayButton, Player} from "./styles.js";
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';

function HomePage() {
    const [active, setActive] = useState(true);

    const handleSocketBoxClick1 = () => {
        setActive(false);
    };
    const handleSocketBoxClick2 = () => {
        setActive(true);
    };

    return (
        <Layout title="Homepage">

            <Player>
                <PlayButton icon={faStop} onClick={handleSocketBoxClick1} />
                <PlayButton icon={faPlay} onClick={handleSocketBoxClick2} />
            </Player>


            <Carousel active={active}/>
        </Layout>
    );
}

export default HomePage;
