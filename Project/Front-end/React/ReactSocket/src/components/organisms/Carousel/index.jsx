import React, {useEffect, useState} from "react";
import { CarouselContainer } from "./styles.js";
import webSocketList from "../../../config/WebSocketList.js";
import SocketBox from "../../molecules/socketBox/index.jsx";

function Carousel(active) {
    const [duration, setDuration] = useState("10s");


    return (
        <CarouselContainer active={active.active} duration={duration}>
            {webSocketList.map((socket, index) => (
                <SocketBox
                    key={index}
                    name={socket?.name}
                    incoming={socket?.incoming}
                    outgoing={socket?.outgoing}
                    addFammily={socket?.addFamily}
                    descriptor={socket?.descriptor}
                    type={socket?.type}
                    protocol={socket?.protocol}
                    backEnd={socket?.backend}
                />
            ))}

            {webSocketList.map((socket, index) => (
                <SocketBox
                    key={index}
                    name={socket?.name}
                    incoming={socket?.incoming}
                    outgoing={socket?.outgoing}
                    addFammily={socket?.addFamily}
                    descriptor={socket?.descriptor}
                    type={socket?.type}
                    protocol={socket?.protocol}
                    backEnd={socket?.backend}
                />
            ))}
        </CarouselContainer>
    );
}

export default Carousel;
