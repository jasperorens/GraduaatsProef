import styled from "styled-components";

export const Container = styled.div`
  flex-direction: column;
  top: 0;
  width: 400px;
  height: ${props => props.$clicked ? "650px" : "300px"};
  justify-content: space-between;
  align-self: start;
  align-content: center;
  z-index: 3;
  background-color: grey;
  border-radius: 15px;
  display: flex;
  box-shadow: 8px 8px 20px -13px black;
  margin: 5px;
`;


export const Title = styled.h1`
  color: #fff4c2;
`;

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 30px;
`;

export const CallField = styled.div`
  color: white;
  display: flex;
  width: 150px;
  height: 30px;
  border-radius: 10px;
  justify-content: end;
  padding-right: 10px;
  margin-left: 10px;
  backdrop-filter: blur(15px);
  background-color: rgba(0, 0, 0, 0.60);
`;

export const CallFieldGreen = styled.div`
  color: #62fa43;
  display: flex;
  width: 150px;
  height: 30px;
  border-radius: 10px;
  justify-content: end;
  padding-right: 10px;
  margin-left: 10px;
  backdrop-filter: blur(15px);
  background-color: rgba(0, 0, 0, 0.60);
`;

export const RadioField = styled.div`
  display: flex;
  width: 500px;
  align-items: center;
  height: 30px;
  justify-content: end;
  padding-right: 10px;
  margin-left: 10px;
`;
export const RadioButton = styled.p`
  margin-right: 5px;
  margin-left: 12px;
  color: ${props => props.active ? "green" : "red"};
`;
export const Arrow = styled.div`
  display: flex;
  align-self: end;
  padding: 10px 20px;
  color: #ffd000;
  cursor: pointer;
`;

