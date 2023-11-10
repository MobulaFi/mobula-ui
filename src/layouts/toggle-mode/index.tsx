"use client";
import { SmallFont } from "components/fonts";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
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
    <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      <SmallFont> {theme === "light" ? "Dark" : "Light"}</SmallFont>
    </Button>
  );
};
