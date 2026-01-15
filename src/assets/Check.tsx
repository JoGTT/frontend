import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  fill?: string;
}

const CheckLogo: React.FC<IconProps> = ({ width = 24, height = 24, fill = "#fff", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill={fill}
    viewBox="0 0 24 24"
    {...props}
  >
    <g>
      <path fill={fill} fillRule="evenodd" d="M19.293 5.293a1 1 0 0 1 1.414 1.414l-10 10a1 1 0 0 1-1.414 0l-5-5a1 1 0 1 1 1.414-1.414L10 14.586l9.293-9.293z" clipRule="evenodd" opacity="1" />
    </g>
  </svg>
);

export default CheckLogo;