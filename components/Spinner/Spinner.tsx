import React from "react";

const Spinner = ({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    stroke="#000"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g className="spinner">
      <circle cx="12" cy="12" r="9.5" fill="none" stroke-width="3"></circle>
    </g>
    <style jsx>{`
      svg {
        stroke: currentColor;
      }

      .spinner {
        transform-origin: center;
        animation: spinner-animate 2s linear infinite;
      }

      .spinner circle {
        stroke-linecap: round;
        animation: circle-animate 1.5s ease-in-out infinite;
      }

      @keyframes spinner-animate {
        100% {
          transform: rotate(360deg);
        }
      }

      @keyframes circle-animate {
        0% {
          stroke-dasharray: 0 150;
          stroke-dashoffset: 0;
        }

        47.5% {
          stroke-dasharray: 42 150;
          stroke-dashoffset: -16;
        }

        95%,
        100% {
          stroke-dasharray: 42 150;
          stroke-dashoffset: -59;
        }
      }
    `}</style>
  </svg>
);

export default Spinner;
