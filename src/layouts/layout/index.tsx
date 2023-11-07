import { cookies } from "next/headers";
import React from "react";
import { Box } from "../../components/box";
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
      <Box extraClass="max-w-[300px]">
        froogr jorgjkjnr kns nsj gnsenk len ejksng kjsenkjg esjkn gjksnegjn
        skejng jsegjsenj kgkje nkjs ngkjn jjse ng
      </Box>
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
