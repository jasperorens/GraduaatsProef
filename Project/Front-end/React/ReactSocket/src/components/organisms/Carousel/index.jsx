import React, { useState } from "react";
import { CarouselContainer } from "./styles.js";
import webSocketList from "../../../config/WebSocketList.js";
import SocketBox from "../../molecules/socketBox/index.jsx";
function Carousel({ active }) {
    const [duration, setDuration] = useState("20s"); // Duration since content is doubled
    const [delayTime, setDelayTime] = useState("0s");  // Initialize delayTime

    const doubledList = [...webSocketList, ...webSocketList];

    return (
        <CarouselContainer
            $active={active} // Use transient prop here
            $duration={duration}
            $delay={false}
            $delayTime={delayTime}
        >
            {doubledList.map((socket, index) => (
                <SocketBox
                    key={index}
                    name={socket?.name}
                    incoming={socket?.incoming}
                    outgoing={socket?.outgoing}
                    addFamily={socket?.addFamily}
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
