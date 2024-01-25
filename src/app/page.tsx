import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import { HomeLanding } from "../features/landings/home";
import { HomeLandingProvider } from "../features/landings/home/context-manager";

export default function HomePage() {
  const cookieStore = cookies();
  const addressCookie = cookieStore.get("user-address")?.value;
  // const signatureCookie = cookieStore.get(
  //   `user-signature-${addressCookie}`
  // )?.value;
  if (addressCookie) {
    redirect("/home");
  }
  return (
    <HomeLandingProvider>
      <HomeLanding />
    </HomeLandingProvider>
  );
}
