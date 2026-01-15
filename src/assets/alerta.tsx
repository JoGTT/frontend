import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  fill?: string;
}

const AlertaIcon: React.FC<IconProps> = ({ width = 24, height = 24, fill = "#fff", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill={fill}
    viewBox="0 0 512 512"
    {...props}
  >
    <g>
      <path 
        fill={fill} 
        d="M501.362 383.95 320.497 51.474c-29.059-48.921-99.896-48.986-128.994 0L10.647 383.95c-29.706 49.989 6.259 113.291 64.482 113.291h361.736c58.174 0 94.203-63.251 64.497-113.291zM256 437.241c-16.538 0-30-13.462-30-30s13.462-30 30-30 30 13.462 30 30-13.462 30-30 30zm30-120c0 16.538-13.462 30-30 30s-30-13.462-30-30v-150c0-16.538 13.462-30 30-30s30 13.462 30 30v150z" 
      />
    </g>
  </svg>
);

export default AlertaIcon;