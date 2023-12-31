import { BaseAssetProvider } from "features/asset/context-manager";
import { unformatFilters } from "features/asset/utils";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import { ShowMoreProvider } from "../../features/asset/context-manager/navActive";
import { NavActiveProvider } from "../../features/asset/context-manager/showMore";
import { Asset } from "../../interfaces/assets";
import { ILaunchpad } from "../../interfaces/launchpads";
import { Trade } from "../../interfaces/trades";

type AssetProps = {
  asset?: Asset;
  tradHistory?: Trade[];
  launchpads?: ILaunchpad[];
  key?: number;
};

interface LayoutProps {
  children: ReactNode;
  params: AssetProps;
}
export default function AssetLayout({ params, children }: LayoutProps) {
  const cookieStore = cookies();
  const hideTxCookie = cookieStore.get("hideTx")?.value || "false";
  const tradeCookie =
    unformatFilters(cookieStore.get("trade-filters")?.value || "") || [];

  return (
    <BaseAssetProvider
      token={(params?.asset as Asset) || ({} as Asset)}
      tradHistory={params?.tradHistory || []}
      launchpad={params?.launchpads}
      hideTxCookie={hideTxCookie}
      tradeCookie={tradeCookie}
    >
      <ShowMoreProvider>
        <NavActiveProvider>{children}</NavActiveProvider>
      </ShowMoreProvider>
    </BaseAssetProvider>
  );
}
