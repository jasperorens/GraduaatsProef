import styled from "styled-components";
import socket from "../../../public/assets/websocketIcon.png"; // Make sure path is correct

export const Content = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  top: 0;
  flex-direction: column;
  justify-content: start;
`;


export const DisplayStyle = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  top: 0;
  justify-content: start;
  width: 100vw;
  min-height: 120vh;
  box-sizing: border-box;
  overflow: hidden;
  background-color: cadetblue;
`;
