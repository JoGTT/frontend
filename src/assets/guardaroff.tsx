import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  fill?: string;
}

const GuardarOffLogo: React.FC<IconProps> = ({ width = 24, height = 24, fill = "#fff", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill={fill}
    viewBox="0 0 24 24"
    {...props}
  >
    <g>
      <path fill={fill} fillRule="evenodd" d="M3 5a2 2 0 0 1 2-2h10.586A2 2 0 0 1 17 3.586L20.414 7A2 2 0 0 1 21 8.414V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm4 0v4a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6.414L15.586 5H7z" clipRule="evenodd" opacity="1" />
    </g>
  </svg>
);

export default GuardarOffLogo;