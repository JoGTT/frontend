import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  fill?: string;
}

const ExpedientesIcon: React.FC<IconProps> = ({ width = 24, height = 24, fill = "#fff", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill={fill}
    viewBox="0 0 682.667 682.667"
    {...props}
  >
    <g>
      <path 
        fill="none" 
        stroke={fill} 
        strokeWidth="15" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeMiterlimit="10"
        d="M0 0h-145.762" 
        transform="matrix(1.33333 0 0 -1.33333 559.238 260.87)" 
      />
      <path 
        fill="none" 
        stroke={fill} 
        strokeWidth="15" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeMiterlimit="10"
        d="M0 0h-145.762" 
        transform="matrix(1.33333 0 0 -1.33333 559.238 203.471)" 
      />
      <path 
        fill="none" 
        stroke={fill} 
        strokeWidth="15" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeMiterlimit="10"
        d="M0 0h-89.383c-9.678 0-17.522 7.845-17.522 17.523v110.882c0 9.678 7.844 17.523 17.522 17.523H0c9.678 0 17.523-7.845 17.523-17.523V17.523C17.523 7.845 9.678 0 0 0Z" 
        transform="translate(199.477 305.127)" 
      />
      <path 
        fill="none" 
        stroke={fill} 
        strokeWidth="15" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeMiterlimit="10"
        d="M0 0c0-15.417-12.494-27.916-27.907-27.916-15.412 0-27.907 12.499-27.907 27.916 0 15.418 12.495 27.917 27.907 27.917C-12.494 27.917 0 15.418 0 0Z" 
        transform="translate(182.692 382.45)" 
      />
      <path 
        fill="none" 
        stroke={fill} 
        strokeWidth="15" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeMiterlimit="10"
        d="M0 0c-7.363 20.456-24.626 36.183-46.007 41.393" 
        transform="translate(216.32 317.859)" 
      />
      <path 
        fill="none" 
        stroke={fill} 
        strokeWidth="15" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeMiterlimit="10"
        d="M0 0c-21.382-5.21-38.644-20.937-46.008-41.393" 
        transform="translate(139.259 359.252)" 
      />
      <path 
        fill="none" 
        stroke={fill} 
        strokeWidth="15" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeMiterlimit="10"
        d="M0 0v-82.537c0-11.36 9.206-20.569 20.562-20.569h82.51" 
        transform="translate(368.948 501.437)" 
      />
      <path 
        fill="none" 
        stroke={fill} 
        strokeWidth="15" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeMiterlimit="10"
        d="M0 0v76.905C0 89.643-10.326 99.97-23.065 99.97h-299.148c-9.03 0-17.625 3.88-23.598 10.652l-12.175 13.806a31.467 31.467 0 0 1-23.599 10.653h-92.35c-12.739 0-23.065-10.327-23.065-23.065v-212.587c0-13.208 10.707-23.914 23.914-23.914h449.172C-10.707-124.485 0-113.779 0-100.571v65.508" 
        transform="translate(504.5 132.068)" 
      />
      <path 
        fill="none" 
        stroke={fill} 
        strokeWidth="15" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeMiterlimit="10"
        d="M0 0v152.55a33.18 33.18 0 0 1-9.715 23.461l-86.623 86.651a33.161 33.161 0 0 1-23.453 9.717h-285.042c-18.317 0-33.167-14.854-33.167-33.178V70.174" 
        transform="translate(475 232.038)" 
      />
    </g>
  </svg>
);

export default ExpedientesIcon;