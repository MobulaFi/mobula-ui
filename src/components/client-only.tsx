import React, { useEffect, useState } from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
}

export const ClientOnly = ({ children }: ClientOnlyProps) => {
  // State / Props
  const [hasMounted, setHasMounted] = useState(false);

  // Hooks
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Render
  if (!hasMounted) return null;

  return <>{children}</>;
};
