import React from "react";
import { OverviewProvider } from "../../../../features/dao/protocol/context-manager/overview";

interface LayoutProps {
  props: any;
  children: React.ReactNode;
}

export const Layout = ({ props, children }: LayoutProps) => {
  return (
    <OverviewProvider
      recentlyAdded={props?.recentlyAdded}
      daoMembers={props?.daoMembers}
      validated={props?.validated}
      rejected={props?.rejected}
    >
      {children}
    </OverviewProvider>
  );
};

export default Layout;
