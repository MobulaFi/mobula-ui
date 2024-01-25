"use client";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import { cn } from "../../lib/shadcn/lib/utils";
interface ToggleColorModeProps {
  isMobile?: boolean;
  extraCss?: string;
}

export const ToggleColorMode = ({
  isMobile,
  extraCss,
}: ToggleColorModeProps) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (pathname === "/" && theme !== "dark") {
      setTheme("dark");
    }
  }, [pathname]);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => {
        if (pathname !== "/") setTheme(theme === "dark" ? "light" : "dark");
      }}
      className={cn(`${isMobile ? "ml-[30px]" : ""} w-fit`, extraCss)}
      disabled={pathname === "/"}
    >
      {theme === "dark" ? (
        <div className="flex items-center">
          <BsMoon className="text-lg text-light-font-100 dark:text-dark-font-100" />
          {isMobile ? (
            <p className="ml-2.5 text-base font-normal">Dark Mode</p>
          ) : null}
        </div>
      ) : (
        <div className="flex items-center">
          <BsSun className="text-lg text-light-font-100 dark:text-dark-font-100" />
          {isMobile ? (
            <p className="ml-2.5 text-base font-normal">Light Mode</p>
          ) : null}
        </div>
      )}
    </button>
  );
};
