import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  fill?: string;
}

const RemoverLogo: React.FC<IconProps> = ({ width = 24, height = 24, fill = "#fff", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill={fill}
    viewBox="0 0 24 24"
    {...props}
  >
    <g>
      <path fill={fill} fillRule="evenodd" d="M10 2a1 1 0 0 0-1 1v1H6a1 1 0 0 0 0 2v12a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V6a1 1 0 1 0 0-2h-3V3a1 1 0 0 0-1-1h-4zM9 8a1 1 0 0 1 2 0v8a1 1 0 1 1-2 0V8zm4 0a1 1 0 0 1 2 0v8a1 1 0 1 1-2 0V8z" clipRule="evenodd" opacity="1" />
    </g>
  </svg>
);

export default RemoverLogo;