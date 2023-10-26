"use client";
import { useEffect } from "react";

export const ToggleColorMode = () => {
  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <button
      className="bg-gray-dark dark:bg-white rounded-full p-2 h-10 w-10 text-black dark:text-white focus:outline-none w-full flex items-center justify-center"
      onClick={() => {
        if (document.documentElement.classList.contains("dark")) {
          document.documentElement.classList.remove("dark");
          localStorage.theme = "light";
        } else {
          document.documentElement.classList.add("dark");
          localStorage.theme = "dark";
        }
      }}
    >
      Light or Dark
    </button>
  );
};
