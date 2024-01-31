"use client";
import { parse } from "cookie";
import { useContext, useEffect, useState } from "react";
// import {AddedToWatchlistPopup} from "../../Pages/User/Watchlist/components/popup/added-to-watchlist";
// import {NotifDrawer} from "../../common/components/drawer/notif";
// import {NextChakraLink} from "../../common/components/links";
// import {PopupStateContext} from "../../common/context-manager/popup";
// import {usePageLoad} from "../../common/hooks/pageload";
// import {useColors} from "../../common/utils/color-mode";
// import {CommonPageProvider} from "../common/context-manager";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { SearchBarPopup } from "popup/searchbar";
import { FiSearch } from "react-icons/fi";
import {
  CommonPageContext,
  CommonPageProvider,
} from "../../contexts/commun-page";
import { PopupStateContext } from "../../contexts/popup";
import { NotificationDrawer } from "../../drawer/notif";
import { WatchlistDrawer } from "../../drawer/watchlist";
import { useAnalytics } from "../../hooks/analytics";
import { usePageLoad } from "../../hooks/pageload";
import { GET } from "../../utils/fetch";
import { UserSection } from "./components/user-section";
import { AccountHeaderContext } from "./context-manager";

export const Header = ({ addressCookie }) => {
  usePageLoad();
  const { showNotif } = useContext(AccountHeaderContext);
  const { showAddedToWatchlist } = useContext(PopupStateContext);
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const cookie = parse(addressCookie);
  const addressFromCookie = cookie.address;
  useAnalytics();
  useEffect(() => {
    const handleRouteChange = () => {
      localStorage.setItem("previousPath", pathname); // Set current path as previous before the route changes
    };
    setTimeout(() => {
      handleRouteChange();
    }, 2000);
    GET("/connection", {});
  }, [pathname]);

  console.log("pathname", pathname);

  const [triggerSearch, setTriggerSearch] = useState(false);
  const { isMenuMobile, setIsMenuMobile } = useContext(CommonPageContext);
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

      <div
        className={`md:px-2.5 z-10 ${
          pathname === "/home" ? "max-w-[1300px]" : "max-w-[1200px]"
        } w-[95%] lg:w-full mx-auto bg-light-bg-primary dark:bg-dark-bg-primary padding-screen`}
      >
        <div className="flex justify-between items-center py-0 lg:py-2.5 md:py-[7.5px] min-h-[55px] ">
          {/* <div className="flex items-center cursor-pointer min-w-fit md:min-w-[25px] h-[65px] lg:h-auto"> */}
          {/* <NextChakraLink
              href="/home"
              extraCss="h-[25px] mr-[20px] lg:mr-auto min-w-fit lg:min-w-[25px] flex items-center"
            >
              <div className="h-fit w-fit hidden lg:flex">
                <img
                  className="w-[30px] h-[30px]"
                  src={
                    resolvedTheme === "dark"
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
                    resolvedTheme === "dark"
                      ? "/mobula/mobula-logo-text.svg"
                      : "/mobula/mobula-logo-text-light.svg"
                  }
                  alt="Mobula logo"
                />
              </div>
            </NextChakraLink> */}
          {/* <div className="w-fit h-full flex lg:hidden">
              <Tabs />
            </div> */}
          {/* </div> */}
          <div
            className="flex text-light-font-60 dark:text-dark-font-60 items-center rounded-md border
            border-light-border-primary dark:border-dark-border-primary bg-light-bg-secondary 
            dark:bg-dark-bg-secondary h-[35px] mr-2.5 md:mr-[7.5px] transition-all duration-200 
            max-w-[350px] lg:max-w-full w-full ml-0 lg:ml-2.5 cursor-pointer 
            hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover ease-in-out overflow-hidden"
            onClick={() => {
              setTriggerSearch(true);
              setIsMenuMobile(false);
            }}
          >
            <div
              className="flex border-r border-light-border-primary dark:border-dark-border-primary 
              lg:border-transparent lg:dark:border-transparent items-center px-[7.5px] h-full rounded-l"
            >
              <FiSearch className="text-sm md:text-lg text-light-font-100 dark:text-dark-font-100" />
            </div>
            <p className="text-sm text-light-font-100 dark:text-dark-font-100 truncate pl-2 lg:pl-2.5">
              Crypto name, wallet, ens, token address...
            </p>
          </div>
          <UserSection addressFromCookie={addressFromCookie} />
        </div>
      </div>

      {triggerSearch ? (
        <SearchBarPopup trigger={triggerSearch} setTrigger={setTriggerSearch} />
      ) : null}
      {showNotif ? <NotificationDrawer /> : null}
      {showAddedToWatchlist ? <WatchlistDrawer /> : null}
      <div className="bg-light-border-primary dark:bg-dark-border-primary h-[2px] w-full" />
    </CommonPageProvider>
  );
};
