import React from 'react';
import sedegesLogo from '../assets/sedeges.png';

interface SedegesLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const SedegesLogo: React.FC<SedegesLogoProps> = ({ className = "", width = 100, height = 100 }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <img
      src={sedegesLogo}
      alt="SEDEGES La Paz"
      width={width}
      height={height}
      className="object-contain bg-transparent"
    />
  </div>
);

export default SedegesLogo;