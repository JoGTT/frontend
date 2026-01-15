import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  fill?: string;
}

const DocumentosIcon: React.FC<IconProps> = ({ width = 24, height = 24, fill = "#fff", ...props }) => (
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
        d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-7z" 
        clipRule="evenodd" 
      />
      <path 
        fill={fill} 
        d="M13 2v7h7" 
      />
      <path 
        fill={fill} 
        d="M8 11h8v1H8v-1zm0 2h8v1H8v-1zm0 2h8v1H8v-1zm0 2h5v1H8v-1z" 
      />
    </g>
  </svg>
);

export default DocumentosIcon;