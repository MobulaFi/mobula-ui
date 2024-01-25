import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HomeLanding } from "../features/landings/home";
import { HomeLandingProvider } from "../features/landings/home/context-manager";

export default function HomePage() {
  const cookieStore = cookies();
  const addressCookie = cookieStore.get("address")?.value;
  const signatureCookie = cookieStore.get(
    `user-signature-${addressCookie}`
  )?.value;
  if (signatureCookie) {
    redirect("/home");
  }
  return (
    <HomeLandingProvider>
      <HomeLanding />
    </HomeLandingProvider>
  );
}
