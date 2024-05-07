import {
    Arrow,
    CallField,
    CallFieldGreen,
    Container,
    InnerContainer,
    Plain,
    RadioButton,
    RadioField,
    Row,
    Title
} from "./styles.js";
import {useContext, useEffect, useState} from "react";
import { WebSocketContext } from "../../../context/WebSocketContext.jsx";

const SocketBox = ({ name }) => {
    const { sockets } = useContext(WebSocketContext);
    const socketData = sockets.find(sock => sock.name === name);
    const [clicked, setClicked] = useState(false);
    console.log(`Rendering ${name}`, new Date().toLocaleTimeString());

    console.log(`Data for ${name}:`, socketData);

    useEffect(() => {
        console.log(`Component updated with new data for ${name}:`, socketData);
    }, [socketData]);


    const dropIt = () => {
        setClicked(prevClicked => !prevClicked);
    };

    if (!socketData) {
        return <div>Loading...</div>;
    }

    // Destructuring the properties from socketData
    const { incoming, outgoing, descriptor, addFamily, type, protocol, backEnd } = socketData;

    return (
        <Container $clicked={clicked}>
            <InnerContainer>
                <Title>{name}</Title>

                <Row>
                    <Plain>Status: </Plain>
                    <CallFieldGreen>{socketData.details.Status}</CallFieldGreen>
                </Row>

                <Row>
                    <Plain>Transferred: </Plain>
                    <CallFieldGreen>{socketData.details.Transferred}</CallFieldGreen>
                </Row>
            </InnerContainer>

            {!clicked && (
                <InnerContainer>
                    <Arrow onClick={dropIt}>Show More ▼</Arrow>
                </InnerContainer>
            )}

            {clicked && (
                <InnerContainer>
                    <Row>
                        <Plain>Connection: </Plain>
                        <CallField>{socketData.details.Connection}</CallField>
                    </Row>
                    <Row>
                        <Plain>Protocol: </Plain>
                        <CallField>{socketData.details.Protocol}</CallField>
                    </Row>
                    <Row>
                        <Plain>Protocol: </Plain>
                        <CallField>{socketData.details.Protocol}</CallField>
                    </Row>
                    <Row>
                        {/*
                                                <Plain>Protocol: </Plain>
                        <RadioField>
                            <RadioButton active={protocol?.WS}>●</RadioButton>WS
                            <RadioButton active={protocol?.WSS}>●</RadioButton>WSS
                            <RadioButton active={protocol?.LP}>●</RadioButton>LP
                        </RadioField>
                        */}
                    </Row>
                    <Row>
                        <Plain>Protocol: </Plain>
                        <CallField>{socketData.details.Protocol}</CallField>
                    </Row>
                    <Arrow onClick={dropIt}>Show Less ▲</Arrow>
                </InnerContainer>
            )}

        </Container>
    );
};

export default SocketBox;
