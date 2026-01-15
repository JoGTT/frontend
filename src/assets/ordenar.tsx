import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  fill?: string;
}

const OrdenarLogo: React.FC<IconProps> = ({ width = 24, height = 24, fill = "#fff", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill={fill}
    viewBox="0 0 24 24"
    {...props}
  >
    <g>
      <path fill={fill} d="M10 18H4c-.6 0-1-.4-1-1s.4-1 1-1h6c.6 0 1 .4 1 1s-.4 1-1 1zM13 13H4c-.6 0-1-.4-1-1s.4-1 1-1h9c.6 0 1 .4 1 1s-.4 1-1 1zM18 20c-.6 0-1-.4-1-1v-8c0-.6.4-1 1-1s1 .4 1 1v8c0 .6-.4 1-1 1z" opacity="1" />
      <path fill={fill} d="M18 20c-.3 0-.5-.1-.7-.3l-3-3c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l2.3 2.3 2.3-2.3c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-3 3c-.2.2-.4.3-.7.3zM16 8H4c-.6 0-1-.4-1-1s.4-1 1-1h12c.6 0 1 .4 1 1s-.4 1-1 1z" opacity="1" />
    </g>
  </svg>
);

export default OrdenarLogo;