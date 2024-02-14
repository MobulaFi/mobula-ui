import React from "react";

interface CollapseProps {
  startingHeight: string;
  children: React.ReactNode;
  isOpen: boolean;
  maxH?: string;
}

export const Collapse = ({
  startingHeight,
  isOpen,
  maxH = "max-h-[1000px]",
  children,
}: CollapseProps) => {
  return (
    <div
      className={`flex w-full flex-col text-start overflow-hidden transition-all duration-500 h-full ease-in-out ${
        isOpen ? maxH || "max-h-[1000px]" : startingHeight
      }`}
    >
      {children}
    </div>
  );
};
