import React from "react";
import { OverviewProvider } from "../../features/dao/protocol/context-manager/overview";

interface LayoutProps {
  params: any;
  children: React.ReactNode;
}

export default function Layout({ params, children }: LayoutProps) {
  return (
    <OverviewProvider
      recentlyAdded={params?.recentlyAdded}
      daoMembers={params?.daoMembers}
      validated={params?.validated}
      rejected={params?.rejected}
    >
      {children}
    </OverviewProvider>
  );
}
