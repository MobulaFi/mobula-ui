import React, { useState } from "react";
import { cn } from "../lib/shadcn/lib/utils";

interface MenuProps {
  title: React.ReactNode;
  extraCss?: string;
  titleCss?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export const Menu = ({
  title,
  extraCss,
  titleCss,
  children,
  disabled = false,
}: MenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex relative">
      <button
        className={titleCss}
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {title}
      </button>
      {isOpen ? (
        <div
          onMouseLeave={() => setIsOpen(false)}
          className={cn(
            "flex flex-col p-2.5 rounded-lg bg-light-bg-terciary dark:bg-dark-bg-terciary absolute top-[110%] right-0 z-10 border border-light-border-primary dark:border-dark-border-primary shadow-md",
            extraCss
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};
