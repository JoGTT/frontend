import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  fill?: string;
}

const UserXLogo: React.FC<IconProps> = ({ width = 24, height = 24, fill = "#fff", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill={fill}
    viewBox="0 0 6.35 6.35"
    {...props}
  >
    <g>
        <path d="M3.038.257a1.676 1.676 0 0 0-.965 3.05A2.727 2.727 0 0 0 .36 5.834a.265.265 0 0 0 .53 0 2.19 2.19 0 0 1 3.345-1.865.266.266 0 1 0 .28-.452 2.716 2.716 0 0 0-.484-.23c.416-.305.688-.796.688-1.35 0-.923-.756-1.68-1.68-1.68zm0 .53c.638 0 1.15.513 1.15 1.15s-.512 1.149-1.15 1.149c-.637 0-1.148-.51-1.148-1.149S2.4.787 3.038.787zm1.358 3.44a.265.265 0 0 0-.184.455l.474.474-.474.474a.265.265 0 1 0 .373.375l.475-.475.474.475a.265.265 0 0 0 .376-.375l-.475-.474.475-.474a.265.265 0 0 0-.194-.455.265.265 0 0 0-.182.08l-.474.475-.475-.475a.265.265 0 0 0-.189-.08z" ></path>
    </g>
  </svg>
);

export default UserXLogo;