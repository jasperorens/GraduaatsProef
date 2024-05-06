import {
    Arrow,
    CallField,
    CallFieldGreen,
    Container,
    InnerContainer,
    RadioButton,
    RadioField,
    Row,
    Title
} from "./styles.js";
import { useState } from "react";

const SocketBox = ({ incoming, outgoing, name, descriptor, addFammily, type, protocol, backEnd }) => {
    const [clicked, setClicked] = useState(false);
    const dropIt = () => {
        setClicked(prevClicked => !prevClicked);
    }

    return (
        <Container $clicked={clicked}>
            <InnerContainer>
                <Title>{name}</Title>

                <Row>
                    <p>incoming speed at: </p>
                    <CallFieldGreen>{incoming}</CallFieldGreen>
                </Row>

                <Row>
                    <p>outgoing speed at: </p>
                    <CallFieldGreen>{outgoing}</CallFieldGreen>
                </Row>
            </InnerContainer>

            {clicked === false && (
                <InnerContainer>
                    <Arrow onClick={dropIt}>Show More ▼</Arrow>
                </InnerContainer>
            )}

            {clicked === true && (
                <InnerContainer>
                    <Row>
                        <p>Descriptor: </p>
                        <CallField>{descriptor}</CallField>
                    </Row>
                    <Row>
                        <p>Address family: </p>
                        <CallField>{addFammily}</CallField>
                    </Row>
                    <Row>
                        <p>Type: </p>
                        <CallField>{type}</CallField>
                    </Row>
                    <Row>
                        <p>Protocol: </p>
                        <RadioField>
                            <RadioButton active={protocol?.WS}>●</RadioButton>WS
                            <RadioButton active={protocol?.WSS}>●</RadioButton>WSS
                            <RadioButton active={protocol?.LP}>●</RadioButton>LP
                        </RadioField>
                    </Row>
                    <Row>
                        <p>Back-End: </p>
                        <CallField>{backEnd}</CallField>
                    </Row>
                    <Arrow onClick={dropIt}>Show Less ▲</Arrow>
                </InnerContainer>
            )}

        </Container>
    )
}
export default SocketBox;
