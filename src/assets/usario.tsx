import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  fill?: string;
}

const IconLogo: React.FC<IconProps> = ({ width = 24, height = 24, fill = "#fff", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill={fill}
    viewBox="0 0 24 24"
    {...props}
  >
    <g>
      <path  fillRule="evenodd" d="M12 1.5c5.799 0 10.5 4.701 10.5 10.5a10.47 10.47 0 0 1-3.29 7.633A10.452 10.452 0 0 1 12 22.5a10.452 10.452 0 0 1-7.21-2.867A10.47 10.47 0 0 1 1.5 12C1.5 6.201 6.201 1.5 12 1.5zm0 11.65a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5zm0-7a4.25 4.25 0 0 1 2.71 7.524 7.273 7.273 0 0 1 4.094 4.217 9 9 0 1 0-13.608 0 7.272 7.272 0 0 1 4.094-4.217A4.25 4.25 0 0 1 12 6.15zM12 21a8.962 8.962 0 0 0 5.591-1.947 5.752 5.752 0 0 0-11.182 0A8.962 8.962 0 0 0 12 21z" clipRule="evenodd" opacity="1" />
    </g>
  </svg>
);

export default IconLogo;