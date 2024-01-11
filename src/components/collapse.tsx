import React from "react";

interface CollapseProps {
  startingHeight: string;
  children: React.ReactNode;
  isOpen: boolean;
}

export const Collapse = ({
  startingHeight,
  isOpen,
  children,
}: CollapseProps) => {
  return (
    <div
      className={`flex w-full flex-col text-start overflow-hidden transition-all duration-300 h-full ease-in-out ${
        isOpen ? "max-h-[1000px]" : startingHeight
      }`}
    >
      {children}
    </div>
  );
};
