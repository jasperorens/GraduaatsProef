import React, {useEffect, useState} from 'react';
import "../index.css";
import Layout from "../components/layout/index.jsx";
import Carousel from "../components/organisms/Carousel/index.jsx";

function HomePage() {
    const [active, setActive] = useState(true);

    const handleSocketBoxClick = () => {
        if (active === true){
            setActive(false);
        }
        else {
            setActive(true);
        }

    };


    return (
        <Layout>
            <button onClick={handleSocketBoxClick}>stop</button>
            <p>HomePage</p>
            <Carousel active={active}/>
        </Layout>
    );
}

export default HomePage;
