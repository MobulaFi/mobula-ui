import React from "react";
import { HomeLanding } from "../../features/landings/home";
import { HomeLandingProvider } from "../../features/landings/home/context-manager";

export default function HomePage() {
  return (
    <HomeLandingProvider>
      <HomeLanding />
    </HomeLandingProvider>
  );
}
