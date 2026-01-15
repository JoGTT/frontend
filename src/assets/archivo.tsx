import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  fill?: string;
}

const ArchivoIcon: React.FC<IconProps> = ({ width = 24, height = 24, fill = "#fff", ...props }) => (
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
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" 
        clipRule="evenodd" 
      />
      <path 
        fill={fill} 
        d="M14 2v6h6" 
      />
    </g>
  </svg>
);

export default ArchivoIcon;