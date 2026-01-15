import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  fill?: string;
}

const CarpetaIcon: React.FC<IconProps> = ({ width = 24, height = 24, fill = "#fff", ...props }) => (
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
        d="M403.626 85.731H139.537c-8.181 0-14.813-6.632-14.813-14.813v-7.412c0-8.341-6.762-15.103-15.103-15.103H30.206C13.524 48.403 0 61.926 0 78.609v254.163l38.757-188.557a14.813 14.813 0 0 1 14.51-11.831h380.565v-16.447c0-16.683-13.524-30.206-30.206-30.206z" 
      />
      <path 
        fill={fill} 
        d="M481.79 162.01H65.345L7.058 445.577c-1.912 9.304 5.194 18.02 14.693 18.02h433.357c15.397 0 28.33-11.581 30.023-26.885l26.682-241.174c1.979-17.889-12.026-33.528-30.023-33.528z" 
      />
    </g>
  </svg>
);

export default CarpetaIcon;