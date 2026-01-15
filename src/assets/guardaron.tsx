import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  fill?: string;
}

const GuardarOnLogo: React.FC<IconProps> = ({ width = 24, height = 24, fill = "#fff", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill={fill}
    viewBox="0 0 24 24"
    {...props}
  >
    <g>
      <path fill={fill} fillRule="evenodd" d="M5 2a2 2 0 0 0-2 2v16.764c0 1.346 1.667 1.982 2.598 1.05L12 15.414l6.402 6.4c.931.932 2.598.296 2.598-1.05V4a2 2 0 0 0-2-2H5z" clipRule="evenodd" opacity="1" />
    </g>
  </svg>
);

export default GuardarOnLogo;