import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import React from "react";
import { DexDrawer } from "../../drawer/dex";
import { createSupabaseDOClient } from "../../lib/supabase";
import { Footer } from "../footer";
import { Header } from "../header";
import { HeaderBanner } from "../header-banner";
import { MenuFixedMobile } from "../menu-mobile";

export const dynamic = "force-static";

interface LayoutProps {
  children: React.ReactNode;
}

const fetchAssets = async () => {
  const supabasse = createSupabaseDOClient();
  const { data, error } = await supabasse
    .from("assets")
    .select("logo,price_change_24h,price,symbol,price")
    .order("global_volume", { ascending: false })
    .limit(50);
  if (error) return [];
  return data;
};

const Layout = async ({ children }: LayoutProps) => {
  const cookieStore = cookies();
  const addressCookie = cookieStore["address"]?.value;
  const assets = await fetchAssets();
  console.log("datadatadata", assets);

  return (
    <div className="bg-light-bg-primary dark:bg-dark-bg-primary">
      <NextTopLoader
        color="#5c7df9"
        showSpinner={false}
        height={2}
        crawl={true}
      />
      <DexDrawer />
      <HeaderBanner assets={assets || []} />
      <Header addressCookie={addressCookie || ""} />
      <div className="w-full min-h-[70vh]">{children}</div>
      <MenuFixedMobile />
      <Footer />
    </div>
  );
};

export default Layout;
