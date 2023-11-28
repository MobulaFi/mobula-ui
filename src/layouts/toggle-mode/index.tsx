"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import { Button } from "../../components/button";

export const ToggleColorMode = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      w="fit-content"
      ml="30px"
    >
      {theme === "dark" ? (
        <div className="flex items-center">
          <BsMoon className="text-[15px] text-light-font-100 dark:text-dark-font-100" />
          <p className="ml-[5px] text-base font-medium">Dark Mode</p>
        </div>
      ) : (
        <div className="flex items-center">
          <BsSun className="text-[15px] text-light-font-100 dark:text-dark-font-100" />
          <p className="ml-[5px] text-base font-medium">Light Mode</p>
        </div>
      )}
    </Button>
  );
};
