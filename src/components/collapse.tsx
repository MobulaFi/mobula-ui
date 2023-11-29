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
    <button
      className="flex w-full flex-col text-start overflow-hidden"
      style={{ maxHeight: isOpen ? "100%" : startingHeight }}
    >
      {children}
    </button>
  );
};
