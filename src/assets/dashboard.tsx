import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  fill?: string;
}

const DashboardIcon: React.FC<IconProps> = ({ width = 24, height = 24, fill = "#fff", ...props }) => (
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
        d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm7 11v7h-7v-7h7zm-11 0v7H3v-7h7z" 
        clipRule="evenodd" 
        opacity="1" 
      />
    </g>
  </svg>
);

export default DashboardIcon;