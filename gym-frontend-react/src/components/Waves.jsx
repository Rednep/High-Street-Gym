import React from "react";
import styled, { keyframes } from "styled-components";

const moveForever = keyframes`
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
`;

const WavesComponent = styled.div`
  position: fixed;
  bottom: 20%;
  width: 100%;
  z-index: -1;
  height: 30vh;
  margin-bottom: -7px;
  min-height: 100px;
  max-height: 150px;

  @media (max-width: 768px) {
    height: 40px;
    min-height: 40px;
  }
`;

const Parallax = styled.g`
  > use {
    animation: ${moveForever} 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;

    &:nth-child(1) {
      animation-delay: -2s;
      animation-duration: 7s;
    }
    &:nth-child(2) {
      animation-delay: -3s;
      animation-duration: 10s;
    }
    &:nth-child(3) {
      animation-delay: -4s;
      animation-duration: 13s;
    }
    &:nth-child(4) {
      animation-delay: -5s;
      animation-duration: 20s;
    }
  }
`;

const TopWavesComponent = styled(WavesComponent)`
  top: 30%;
  bottom: unset;
  transform: scaleY(-1);
`;

const TopWaves = () => (
  <TopWavesComponent>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 24 150 28"
      preserveAspectRatio="none"
      shapeRendering="auto"
    >
      <defs>
        <path
          id="gentle-wave-top"
          d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
        />
      </defs>
      <Parallax>
        <use
          xlinkHref="#gentle-wave-top"
          x="48"
          y="0"
          fill="rgba(0, 121, 184, 0.7)"
        />
        <use
          xlinkHref="#gentle-wave-top"
          x="48"
          y="3"
          fill="rgba(0, 121, 184, 0.5)"
        />
        <use
          xlinkHref="#gentle-wave-top"
          x="48"
          y="5"
          fill="rgba(0, 121, 184, 0.3)"
        />
        <use
          xlinkHref="#gentle-wave-top"
          x="48"
          y="7"
          fill="rgba(0, 121, 184, 1)"
        />
      </Parallax>
    </svg>
  </TopWavesComponent>
);

const BottomWaves = () => (
  <WavesComponent>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 24 150 28"
      preserveAspectRatio="none"
      shapeRendering="auto"
    >
      <defs>
        <path
          id="gentle-wave"
          d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
        />
      </defs>
      <Parallax>
        <use
          xlinkHref="#gentle-wave"
          x="48"
          y="0"
          fill="rgba(0, 121, 184, 0.7)"
        />
        <use
          xlinkHref="#gentle-wave"
          x="48"
          y="3"
          fill="rgba(0, 121, 184, 0.5)"
        />
        <use
          xlinkHref="#gentle-wave"
          x="48"
          y="5"
          fill="rgba(0, 121, 184, 0.3)"
        />
        <use
          xlinkHref="#gentle-wave"
          x="48"
          y="7"
          fill="rgba(0, 121, 184, 1)"
        />
      </Parallax>
    </svg>
  </WavesComponent>
);

export { BottomWaves, TopWaves };
