import { cookies } from "next/headers";

import NextTopLoader from "nextjs-toploader";
import React from "react";
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
      <Header addressCookie={addressCookie || ""} />
      {children}
      <MenuFixedMobile />
      <Footer />
    </div>
  );
};

export default Layout;
