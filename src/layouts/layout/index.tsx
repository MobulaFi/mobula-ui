import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import React from "react";
import { DexDrawer } from "../../drawer/dex";
import { Footer } from "../footer";
import { Header } from "../header";
import { MenuFixedMobile } from "../menu-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const cookieStore = cookies();
  const addressCookie = cookieStore["address"]?.value;

  return (
    <div className="bg-light-bg-primary dark:bg-dark-bg-primary">
      <NextTopLoader
        color="#5c7df9"
        showSpinner={false}
        height={2}
        crawl={true}
      />
      <DexDrawer />
      <Header addressCookie={addressCookie || ""} />
      <div className="w-full min-h-[70vh]">{children}</div>
      <MenuFixedMobile />
      <Footer />
    </div>
  );
};

export default Layout;
