import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  fill?: string;
}

const CirculoOff: React.FC<IconProps> = ({ width = 20, height = 20, fill = "#FFFFFF", ...props }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 426.667 426.667"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g>
        <path
          d="M213.333 106.667c-58.88 0-106.667 47.787-106.667 106.667S154.453 320 213.333 320 320 272.213 320 213.333s-47.787-106.666-106.667-106.666z"
          fill="none"
          opacity="1"
          data-original="#000000"
        />
        <path
          d="M213.333 0C95.467 0 0 95.467 0 213.333s95.467 213.333 213.333 213.333S426.667 331.2 426.667 213.333 331.2 0 213.333 0zm0 384c-94.293 0-170.667-76.373-170.667-170.667S119.04 42.667 213.333 42.667 384 119.04 384 213.333 307.627 384 213.333 384z"
          fill={fill}
          opacity="1"
          data-original="#000000"
        />
    </g>
  </svg>
);

export default CirculoOff;
