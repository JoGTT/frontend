import React from "react";

interface HamburgerMenuProps {
  isOpen?: boolean;
  width?: number;
  height?: number;
  strokeWidth?: number;
  color?: string;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  isOpen = false,
  width = 24,
  height = 24,
  strokeWidth = 2,
  color = "currentColor"
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: "transform 0.3s ease-out",
      }}
    >
      {isOpen ? (
        // X icon when open
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        // Hamburger menu (3 lines) when closed
        <>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  );
};

export default HamburgerMenu;
