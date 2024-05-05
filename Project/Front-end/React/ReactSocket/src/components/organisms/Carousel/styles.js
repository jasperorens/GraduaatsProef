import styled, { css, keyframes } from "styled-components";

const moveLeft = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
`;

export const CarouselContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;

  ${({ active, duration }) => css`
    animation: ${moveLeft} ${duration} linear infinite;
    animation-play-state: ${active ? 'running' : 'paused'};
  `}
`;
