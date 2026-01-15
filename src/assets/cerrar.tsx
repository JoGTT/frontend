import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  fill?: string;
}

const CerrarLogo: React.FC<IconProps> = ({ width = 24, height = 24, fill = "#fff", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill={fill}
    viewBox="0 0 24 24"
    {...props}
  >
    <g>
      <path fill={fill} fillRule="evenodd" d="M16 12a1 1 0 0 1-1 1H9a1 1 0 1 1 0-2h6a1 1 0 0 1 1 1zm2.707.707a1 1 0 0 0 0-1.414l-3-3a1 1 0 0 0-1.414 1.414L16.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414l3-3zM3 6a2 2 0 0 1 2-2h8a1 1 0 1 1 0 2H5v12a2 2 0 0 0 2 2h6a1 1 0 1 1 0 2H7a4 4 0 0 1-4-4V6z" clipRule="evenodd" opacity="1" />
    </g>
  </svg>
);

export default CerrarLogo;