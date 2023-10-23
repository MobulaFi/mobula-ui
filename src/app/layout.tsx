import type { Metadata } from "next";
import "./calendars.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mobula | Home",
  description: "Generated by create next app",
};

import Layout from "@/layouts/layout";
import { Providers } from "@/lib/chakra/provider";
import { cookies } from "next/headers";
import React from "react";
import "../../styles.scss";
import "../../styles/header.scss";
import "../../styles/responsive.scss";

async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const userCookie = cookieStore.get("user-balance")?.value;
  const tradeFilterCookie = cookieStore.get("trade-filter")?.value;

  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;
