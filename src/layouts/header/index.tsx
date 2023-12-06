"use client";
import { parse } from "cookie";
import { useContext, useEffect } from "react";
// import {AddedToWatchlistPopup} from "../../Pages/User/Watchlist/components/popup/added-to-watchlist";
// import {NotifDrawer} from "../../common/components/drawer/notif";
// import {NextChakraLink} from "../../common/components/links";
// import {PopupStateContext} from "../../common/context-manager/popup";
// import {usePageLoad} from "../../common/hooks/pageload";
// import {useColors} from "../../common/utils/color-mode";
// import {CommonPageProvider} from "../common/context-manager";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useAlert } from "react-alert";
import { NextChakraLink } from "../../components/link";
import { CommonPageProvider } from "../../contexts/commun-page";
import { PopupStateContext } from "../../contexts/popup";
import { NotificationDrawer } from "../../drawer/notif";
import { usePageLoad } from "../../hooks/pageload";
import { Tabs } from "./components/tabs";
import { UserSection } from "./components/user-section";
import { AccountHeaderContext } from "./context-manager";

export const Header = ({ addressCookie }) => {
  usePageLoad();
  const { showNotif } = useContext(AccountHeaderContext);
  const { showAddedToWatchlist } = useContext(PopupStateContext);
  const { theme } = useTheme();
  const pathname = usePathname();
  const cookie = parse(addressCookie);
  const addressFromCookie = cookie.address;
  const alert = useAlert();

  useEffect(() => {
    const handleRouteChange = () => {
      localStorage.setItem("previousPath", pathname); // Set current path as previous before the route changes
    };
    setTimeout(() => {
      handleRouteChange();
    }, 2000);
  }, [pathname]);
  return (
    <CommonPageProvider>
      {/* Banner to replace with new feature */}
      {/* <Flex
          direction="column"
          py="10px"
          align="center"
          px={["10px", "10px", "15px"]}
          borderBottom="2px solid var(--chakra-colors-borders-3)"
          w="100%"
        >
          <TextLandingSmall color="text.80" w="fit-content">
            Mobula Trading Dashboard is live on Product hunt!{" "}
            <NextChakraLink
              fontStyle="italic"
              isExternal
              color="blue"
              href="https://www.producthunt.com/posts/mobula"
              onClick={() => pushData("CLICK BANNER PRODUCT HUNT")}
            >
              Support it now!
            </NextChakraLink>
          </TextLandingSmall>
        </Flex> */}
      <div className="px-[15px] md:px-2.5 z-10 max-w-[1920px] mx-auto bg-light-bg-primary dark:bg-dark-bg-primary">
        <div className="flex justify-between py-0 lg:py-2.5 md:py-[7.5px] ">
          <div className="flex items-center cursor-pointer min-w-fit md:min-w-[25px] h-[65px] lg:h-auto">
            <NextChakraLink
              href="/"
              extraCss="h-[25px] mr-[20px] lg:mr-auto min-w-fit lg:min-w-[25px] flex items-center"
            >
              <div className="h-fit w-fit hidden lg:flex">
                <img
                  className="w-[30px] h-[30px]"
                  src={
                    theme === "dark"
                      ? "/mobula/mobula-logo.svg"
                      : "/mobula/mobula-logo-light.svg"
                  }
                  alt="Mobula logo"
                />
              </div>
              <div className="h-full items-center w-fit flex lg:hidden">
                <img
                  className="w-[135px] h-[35px] max-w-[200px] "
                  src={
                    theme === "dark"
                      ? "/mobula/mobula-logo-text.svg"
                      : "/mobula/mobula-logo-text-light.svg"
                  }
                  alt="Mobula logo"
                />
              </div>
            </NextChakraLink>
            <div className="w-fit h-full flex lg:hidden">
              <Tabs />
            </div>
          </div>
          <UserSection addressFromCookie={addressFromCookie} />
        </div>
      </div>
      {showNotif ? <NotificationDrawer /> : null}
      {/* {showAddedToWatchlist && <AddedToWatchlistPopup />} */}
      <div className="bg-light-border-primary dark:bg-dark-border-primary h-[2px] w-full" />
    </CommonPageProvider>
  );
};
