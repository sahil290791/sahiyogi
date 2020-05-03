import React from 'react';

function SearchInputLoaderIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ margin: 'auto', background: 'none' }}
      width="32"
      height="32"
      display="block"
      preserveAspectRatio="xMidYMid"
      viewBox="0 0 100 100"
    >
      <circle
        cx="50"
        cy="50"
        r="35"
        fill="none"
        stroke="#656565"
        strokeDasharray="164.93361431346415 56.97787143782138"
        strokeWidth="6"
        transform="rotate(113.231 50 50)"
      >
        <animateTransform
          attributeName="transform"
          dur="1.0638297872340425s"
          keyTimes="0;1"
          repeatCount="indefinite"
          type="rotate"
          values="0 50 50;360 50 50"
        />
      </circle>
    </svg>
  );
}

export default SearchInputLoaderIcon;
