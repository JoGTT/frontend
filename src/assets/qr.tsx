import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  fill?: string;
}

const QrIcon: React.FC<IconProps> = ({ width = 24, height = 24, fill = "#fff", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill={fill}
    viewBox="0 0 24 24"
    {...props}
  >
    <g>
      <path 
        fill={fill} 
        fillRule="evenodd" 
        d="M3 11V7a4 4 0 014-4h4M13 3h4a4 4 0 014 4v4M11 21H7a4 4 0 01-4-4v-4M21 13v4a4 4 0 01-4 4h-4M7 7h3v3H7V7zM14 7h3v3h-3V7zM7 14h3v3H7v-3zM14 14h3v3h-3v-3z" 
        clipRule="evenodd" 
        opacity="1" 
      />
    </g>
  </svg>
);

export default QrIcon;