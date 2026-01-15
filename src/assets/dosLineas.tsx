import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  fill?: string;
}

const dosLineas: React.FC<IconProps> = ({ width = 24, height = 24, fill = "#fff", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill={fill}
    viewBox="0 0 24 24"
    {...props}
  >
   
    <g fill={fill}>
      <path d="M19 8.5H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1zM19 13.5H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1z"  ></path>
    </g>
  </svg>
);

export default dosLineas;