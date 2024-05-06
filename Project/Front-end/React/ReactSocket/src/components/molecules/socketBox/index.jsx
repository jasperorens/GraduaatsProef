import {
    Arrow,
    CallField,
    CallFieldGreen,
    Container,
    InnerContainer, Plain,
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
                    <Plain>incoming speed at: </Plain>
                    <CallFieldGreen>{incoming}</CallFieldGreen>
                </Row>

                <Row>
                    <Plain>outgoing speed at: </Plain>
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
                        <Plain>Descriptor: </Plain>
                        <CallField>{descriptor}</CallField>
                    </Row>
                    <Row>
                        <Plain>Address family: </Plain>
                        <CallField>{addFammily}</CallField>
                    </Row>
                    <Row>
                        <Plain>Type: </Plain>
                        <CallField>{type}</CallField>
                    </Row>
                    <Row>
                        <Plain>Protocol: </Plain>
                        <RadioField>
                            <RadioButton active={protocol?.WS}>●</RadioButton>WS
                            <RadioButton active={protocol?.WSS}>●</RadioButton>WSS
                            <RadioButton active={protocol?.LP}>●</RadioButton>LP
                        </RadioField>
                    </Row>
                    <Row>
                        <Plain>Back-End: </Plain>
                        <CallField>{backEnd}</CallField>
                    </Row>
                    <Arrow onClick={dropIt}>Show Less ▲</Arrow>
                </InnerContainer>
            )}

        </Container>
    )
}
export default SocketBox;
