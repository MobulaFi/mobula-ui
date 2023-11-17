import { cookies } from "next/headers";
import React from "react";
import { ToggleColorMode } from "../../layouts/toggle-mode";
import { Footer } from "../footer";
import { Header } from "../header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const cookieStore = cookies();
  const addressCookie = cookieStore["address"]?.value;
  return (
    <div className="bg-light-bg-primary dark:bg-dark-bg-primary">
      <Header addressCookie={addressCookie || ""} />
      <ToggleColorMode />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
