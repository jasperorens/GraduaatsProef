import styled, { css, keyframes } from 'styled-components';

const moveLeft = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

export const CarouselContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  margin-top: 50px;
  width: 200%;
  overflow: hidden;

  ${({ $active, $duration, $delay, $delayTime }) => css`
    animation: ${moveLeft} ${$duration} linear infinite;
    animation-play-state: ${$active ? 'running' : 'paused'};
    animation-delay: ${$delay ? `${$delayTime}` : '0s'};
  `}
`;
