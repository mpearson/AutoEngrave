import * as React from "react";

export const LoadingSpinner: React.SFC = () => (
  <svg
    width="100%"
    height="100%"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 30 30"
    preserveAspectRatio="xMidYMid"
    className="lds-dual-ring"
  >
    <circle
      cx="15"
      cy="15"
      fill="none"
      strokeLinecap="butt"
      r="8"
      strokeWidth="3"
      stroke="#ffffff"
      strokeDasharray="12.5663706 12.5663706"
      transform="rotate(95 50 50)"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        calcMode="linear"
        values="0 15 15;360 15 15"
        keyTimes="0;1"
        dur="1.2s"
        begin="0s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);
