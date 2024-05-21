import styled from "styled-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";



export const PlayButton = styled(FontAwesomeIcon)`
  height: 50px;
  width: 50px;
  margin: 0;
  padding: 0;
  color: darkslategrey;
  cursor: pointer;
`;

export const Player = styled.div`
  display: flex; 
  background: white;
  width: 200px;
  border-radius: 20px;
  justify-content: space-evenly; 
  margin: 40px auto;
  padding: 10px;
  box-shadow: inset 10px 10px 20px -10px rgba(0,0,0,0.2);
`;

export const Boxer = styled.div`
    margin: auto;
    display: flex;
    flex-direction: row;
`;