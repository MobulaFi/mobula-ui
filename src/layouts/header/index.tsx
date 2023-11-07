"use client";
import { useColorMode } from "@chakra-ui/react";
import { parse } from "cookie";
import { useContext, useEffect } from "react";
// import {AddedToWatchlistPopup} from "../../Pages/User/Watchlist/components/popup/added-to-watchlist";
// import {NotifDrawer} from "../../common/components/drawer/notif";
// import {NextChakraLink} from "../../common/components/links";
// import {PopupStateContext} from "../../common/context-manager/popup";
// import {usePageLoad} from "../../common/hooks/pageload";
// import {useColors} from "../../common/utils/color-mode";
// import {CommonPageProvider} from "../common/context-manager";
import { usePathname } from "next/navigation";
import React from "react";
import { NextChakraLink } from "../../components/link";
import { CommonPageProvider } from "../../contexts/commun-page";
import { PopupStateContext } from "../../contexts/popup";
import { usePageLoad } from "../../hooks/pageload";
import { Tabs } from "./components/tabs";
import { UserSection } from "./components/user-section";
import { AccountHeaderContext } from "./context-manager";

export const Header = ({ addressCookie }) => {
  usePageLoad();
  const { showNotif } = useContext(AccountHeaderContext);
  const { showAddedToWatchlist } = useContext(PopupStateContext);
  const { colorMode } = useColorMode();
  const pathname = usePathname();
  const cookie = parse(addressCookie);
  const addressFromCookie = cookie.address;

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

      <div className="border-b-2 border-light-border-primary dark:border-dark-border-primary">
        <div className="px-[15px] md:px-2.5 z-10 max-w-[1920px] mx-auto bg-light-bg-primary dark:bg-dark-bg-primary">
          <div className="flex justify-between py-0 lg:py-2.5 md:py-[7.5px] ">
            <div className="flex items-center cursor-pointer min-w-fit md:min-w-[25px]">
              <NextChakraLink
                href="/"
                extraCss="h-[25px] mr-[20px] lg:mr-auto min-w-fit lg:min-w-[25px]"
              >
                <img
                  className="hidden lg:flex w-full h-full"
                  alt="Mobula logo"
                  src={
                    colorMode === "dark"
                      ? "/mobula/mobula-logo.svg"
                      : "/mobula/mobula-logo-light.svg"
                  }
                />
                <img
                  className="flex lg:hidden w-full h-full max-w-[200px]"
                  src={
                    colorMode === "dark"
                      ? "/mobula/mobula-logo-text.svg"
                      : "/mobula/mobula-logo-text-light.svg"
                  }
                  alt="Mobula logo"
                />
              </NextChakraLink>
              <Tabs />
            </div>
            <UserSection addressFromCookie={addressFromCookie} />
          </div>
        </div>
        {/* {showNotif && <NotifDrawer />}
        {showAddedToWatchlist && <AddedToWatchlistPopup />} */}
      </div>
    </CommonPageProvider>
  );
};
