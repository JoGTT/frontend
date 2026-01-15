import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  fill?: string;
}

const VencimientoIcon: React.FC<IconProps> = ({ width = 24, height = 24, fill = "#fff", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill={fill}
    viewBox="0 0 64 64"
    {...props}
  >
    <g>
      <path 
        fill={fill} 
        d="M9 58h17a1 1 0 0 0 0-2H9a5.006 5.006 0 0 1-5-5V20h49a1 1 0 0 0 0-2H3a1 1 0 0 0-1 1v32a7.009 7.009 0 0 0 7 7Z" 
      />
      <path 
        fill={fill} 
        d="M3 16a1 1 0 0 0 1-1v-3a5.006 5.006 0 0 1 5-5h2v2.184a3 3 0 1 0 2 0V7h7v2.184a3 3 0 1 0 2 0V7h7v2.184a3 3 0 1 0 2 0V7h7v2.184a3 3 0 1 0 2 0V7h7v2.184a3 3 0 1 0 2 0V7h2a5.006 5.006 0 0 1 5 5v10H7a1 1 0 0 0 0 2h49v21a1 1 0 0 0 2 0V12a7.008 7.008 0 0 0-7-7h-2V2a1 1 0 0 0-2 0v3h-7V2a1 1 0 0 0-2 0v3h-7V2a1 1 0 0 0-2 0v3h-7V2a1 1 0 0 0-2 0v3h-7V2a1 1 0 0 0-2 0v3H9a7.008 7.008 0 0 0-7 7v3a1 1 0 0 0 1 1Zm9-3a1 1 0 1 1 1-1 1 1 0 0 1-1 1Zm9 0a1 1 0 1 1 1-1 1 1 0 0 1-1 1Zm9 0a1 1 0 1 1 1-1 1 1 0 0 1-1 1Zm9 0a1 1 0 1 1 1-1 1 1 0 0 1-1 1Zm9 0a1 1 0 1 1 1-1 1 1 0 0 1-1 1Z" 
      />
      <path 
        fill={fill} 
        d="M26 28a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2Zm-6 4v-4h4v4ZM35 34a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2Zm-4-6h4v4h-4ZM15 28a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2Zm-6 4v-4h4v4ZM26 38a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2Zm-6 4v-4h4v4ZM15 38a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2Zm-6 4v-4h4v4ZM24 46h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-4 6v-4h4v4ZM13 46H9a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-4 6v-4h4v4ZM28.385 61.45A3.035 3.035 0 0 0 31.066 63h27.868a3.035 3.035 0 0 0 2.681-1.55 2.916 2.916 0 0 0-.046-2.979L47.635 35.426a3.1 3.1 0 0 0-5.27 0L28.43 58.472a2.917 2.917 0 0 0-.045 2.978Zm1.757-1.944 13.934-23.045a1.1 1.1 0 0 1 1.848 0l13.934 23.044A1.011 1.011 0 0 1 58.934 61H31.066a1.014 1.014 0 0 1-.924-1.494Z" 
      />
      <path 
        fill={fill} 
        d="M45 54a1 1 0 0 0 1-1v-8a1 1 0 0 0-2 0v8a1 1 0 0 0 1 1Z" 
      />
      <circle cx="45" cy="57" r="1" fill={fill} />
    </g>
  </svg>
);

export default VencimientoIcon;