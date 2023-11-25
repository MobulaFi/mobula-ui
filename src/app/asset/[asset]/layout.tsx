import { unformatFilters } from "features/asset/utils";
import { cookies } from "next/headers";
import React, { ReactNode } from "react";
import { BaseAssetProvider } from "../../../features/asset/context-manager";
import { ShowMoreProvider } from "../../../features/asset/context-manager/navActive";
import { NavActiveProvider } from "../../../features/asset/context-manager/showMore";
import { Asset } from "../../../interfaces/assets";
import { ILaunchpad } from "../../../interfaces/launchpads";
import { Trade } from "../../../interfaces/trades";

export interface AssetProps {
  asset: Asset;
  tradHistory?: Trade[];
  launchpads: ILaunchpad[];
  key: number;
}

interface LayoutProps {
  children: ReactNode;
  props: AssetProps;
}

const AssetLayout: React.FC<LayoutProps> = ({ props, children }) => {
  const cookieStore = cookies();
  const hideTxCookie = cookieStore.get("hideTx")?.value || "false";
  const pref = cookieStore.get("pref") || "";
  const tradeCookie =
    unformatFilters(cookieStore.get("trade-filters")?.value || "") || [];

  return (
    <BaseAssetProvider
      token={props?.asset}
      pref={"Candlestick" as never}
      tradHistory={props?.tradHistory || []}
      launchpad={props?.launchpads}
      hideTxCookie={hideTxCookie}
      tradeCookie={tradeCookie}
    >
      <ShowMoreProvider>
        <NavActiveProvider>{children}</NavActiveProvider>
      </ShowMoreProvider>
    </BaseAssetProvider>
  );
};

export default AssetLayout;
