import { unformatFilters } from "features/asset/utils";
import { Asset } from "interfaces/assets";
import { cookies } from "next/headers";
import { BaseAssetProvider } from "../../../features/asset/context-manager";
import { ShowMoreProvider } from "../../../features/asset/context-manager/navActive";
import { NavActiveProvider } from "../../../features/asset/context-manager/showMore";

interface LayoutProps {
  props: {
    asset: Asset;
    cookies: any;
    tradHistory: any;
    launchpads: any;
  };
  children: React.ReactNode;
}

export const Layout = ({ props, children }: LayoutProps) => {
  const cookieStore = cookies();
  const hideTxCookie = cookieStore.get("hideTx")?.value || "false";
  const tradeCookie =
    unformatFilters(cookieStore.get("trade-filters")?.value || "") || [];
  return (
    <BaseAssetProvider
      token={props?.asset}
      pref={"Candlestick" as never}
      cookies={props?.cookies}
      tradHistory={props?.tradHistory}
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

export default Layout;
