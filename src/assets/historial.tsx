import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  fill?: string;
}

const HistorialLogo: React.FC<IconProps> = ({ width = 24, height = 24, fill = "#fff", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill={fill}
    viewBox="0 0 24 24"
    {...props}
  >
    <g>
      <path fill={fill} fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm11-6a1 1 0 0 1 1 1v4.586l2.707 2.707a1 1 0 0 1-1.414 1.414L11 12.414V7a1 1 0 0 1 1-1z" clipRule="evenodd" opacity="1" />
    </g>
  </svg>
);

export default HistorialLogo;