import React from 'react';
import "../index.css";
import Layout from "../components/layout/index.jsx";
import SocketBox from "../components/organisms/socketBox/index.jsx";
import WebSocketList from "../config/WebSocketList.js";
import webSocketList from "../config/WebSocketList.js";

function HomePage() {
    return (
        <Layout>
            <p>HomePage</p>
            <div className="Carousel">
                {
                    webSocketList.map(socket => (
                            <SocketBox name={socket?.name}
                                       incoming={socket?.incoming}
                                       outgoing={socket?.outgoing}
                                       addFammily={socket?.addFamily}
                                       descriptor={socket?.descriptor}
                                       type={socket?.type}
                                       protocol={socket?.protocol}
                                       backEnd={socket?.backend}/>
                    ))
                }
            </div>
        </Layout>
    );
}

export default HomePage;
