"use client";
import { SmallFont } from "components/fonts";
import { useEffect } from "react";
import { Button } from "../../components/button";

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

  const isDarkMode =
    document?.documentElement?.classList.contains("dark") || false;

  return (
    <div
      className={
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      }
    >
      <Button
        onClick={() => {
          const isDark = document.documentElement.classList.contains("dark");
          document.documentElement.classList.toggle("dark");
          localStorage.theme = isDark ? "light" : "dark";
        }}
      >
        <SmallFont>Dark</SmallFont>
      </Button>
    </div>
  );
};
