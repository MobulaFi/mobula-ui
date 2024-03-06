import { Metadata } from "next";
import React from "react";
import { Pricing } from "../../features/landings/pricing";

export const metadata: Metadata = {
  title: "Mobula API Pricing Plans | Mobula",
  description:
    "Explore our flexible pricing plans for the Mobula API. Choose the one that best suits your development and growth needs. Access advanced features and dedicated support to propel your projects to new heights.",
  robots: "index, follow",
  keywords:
    "Mobula, Mobula crypto, Crypto API, API, Mobula API, Mobula API Pricing, Mobula API Pricing Plan",
};

export default function PricingPage() {
  return (
    <>
      <Pricing />
    </>
  );
}
