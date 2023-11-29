"use client";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { BsMoon, BsSun } from "react-icons/bs";
interface ToggleColorModeProps {
  isMobile?: boolean;
}

export const ToggleColorMode = ({ isMobile }: ToggleColorModeProps) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`${isMobile ? "ml-[30px]" : ""} w-fit`}
    >
      {theme === "dark" ? (
        <div className="flex items-center">
          <BsMoon className="text-lg text-light-font-100 dark:text-dark-font-100" />
          {isMobile ? (
            <p className="ml-2.5 text-base font-medium">Dark Mode</p>
          ) : null}
        </div>
      ) : (
        <div className="flex items-center">
          <BsSun className="text-lg text-light-font-100 dark:text-dark-font-100" />
          {isMobile ? (
            <p className="ml-2.5 text-base font-medium">Light Mode</p>
          ) : null}
        </div>
      )}
    </button>
  );
};
