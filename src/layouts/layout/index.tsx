import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import React from "react";
import { DexDrawer } from "../../drawer/dex";
import { createSupabaseDOClient } from "../../lib/supabase";
import { Footer } from "../footer";
import { Header } from "../header";
import { HeaderBanner } from "../header-banner";
import { MenuFixedMobile } from "../menu-mobile";
import { Nav } from "../nav";

interface LayoutProps {
  children: React.ReactNode;
}

const fetchAssets = async () => {
  const supabasse = createSupabaseDOClient();
  const { data, error } = await supabasse
    .from("assets")
    .select("logo,price_change_24h,price,symbol,price,name")
    .order("global_volume", { ascending: false })
    .limit(50);
  if (error) return [];
  return data;
};

const Layout = async ({ children }: LayoutProps) => {
  const cookieStore = cookies();
  const addressCookie = cookieStore["address"]?.value;
  const assets = await fetchAssets();

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
      <div className="flex">
        <Nav />
        <div className="w-full pl-[60px] lg:pl-0" id="app">
          <Header addressCookie={addressCookie || ""} />
          <div className="w-full min-h-[70vh]">{children}</div> <Footer />
        </div>
      </div>
      <MenuFixedMobile />
    </div>
  );
};

export default Layout;
