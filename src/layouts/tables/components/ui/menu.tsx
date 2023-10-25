import { Flex, Icon, Spinner, useColorMode } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useState } from "react";

import { WatchlistContext } from "contexts/pages/watchlist";
import { PopupStateContext, PopupUpdateContext } from "contexts/popup";
import { SettingsMetricContext } from "contexts/settings";
import { UserContext } from "contexts/user";
import { Asset } from "interfaces/assets";
import { IWatchlist } from "interfaces/pages/watchlist";
import { Coin } from "interfaces/swap";
import { useColors } from "lib/chakra/colorMode";
import { pushData } from "lib/mixpanel";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { TbBellRinging } from "react-icons/tb";
import { VscArrowSwap } from "react-icons/vsc";
import { useWatchlist } from "../../hooks/watchlist";

export const MenuCommom = () => {
  const { showMenuTableMobileForToken } = useContext(PopupStateContext);
  const { user } = useContext(UserContext);
  const pathname = usePathname();
  const {
    setShowAddedToWatchlist,
    setShowMenuTableMobileForToken,
    setShowMenuTableMobile,
    setShowAlert,
  } = useContext(PopupUpdateContext);
  const { borders, boxBg3, text60, borders2x, hover, text80 } = useColors();
  const { setShowBuyDrawer } = useContext(SettingsMetricContext);
  const watchlist = user?.main_watchlist as IWatchlist;
  const router = useRouter();
  const { colorMode } = useColorMode();
  const [isLoading, setIsLoading] = useState(false);
  const { setTokenToAddInWatchlist, activeWatchlist, setActiveWatchlist } =
    useContext(WatchlistContext);
  const isDarkMode = colorMode === "dark";
  const { inWatchlist, handleAddWatchlist } = useWatchlist(
    showMenuTableMobileForToken.id
  );

  const addOrRemoveFromWatchlist = async () => {
    if (pathname.includes("watchlist")) {
      if (!activeWatchlist?.assets?.includes(showMenuTableMobileForToken?.id)) {
        setShowAddedToWatchlist(true);
        setTokenToAddInWatchlist(showMenuTableMobileForToken);
      } else {
        handleAddWatchlist(
          showMenuTableMobileForToken.id,
          Number(activeWatchlist?.id),
          false,
          setIsLoading
        );
        setActiveWatchlist((prev) => ({
          ...prev,
          assets: prev.assets.filter(
            (asset) => asset !== showMenuTableMobileForToken.id
          ),
        }));
      }
    } else if (!inWatchlist) {
      setShowAddedToWatchlist(true);
      setTokenToAddInWatchlist(showMenuTableMobileForToken);
    } else {
      setShowAddedToWatchlist(false);
      handleAddWatchlist(
        showMenuTableMobileForToken?.id,
        watchlist?.id,
        false,
        setIsLoading
      );
    }
  };

  return (
    <>
      <Flex
        position="fixed"
        w="100vw"
        h="100vh"
        left="50%"
        zIndex={12}
        transform="translateX(-50%)"
        top="0%"
        display={showMenuTableMobileForToken?.name ? "flex" : "none"}
        bg={isDarkMode ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)"}
        onClick={() => {
          setShowMenuTableMobileForToken(null);
          setShowMenuTableMobile(false);
        }}
      />
      <Flex
        direction="column"
        position="fixed"
        display={showMenuTableMobileForToken?.name ? "flex" : "none"}
        bottom={showMenuTableMobileForToken?.name ? "0px" : "-100%"}
        w="100vw"
        bg={boxBg3}
        borderTop={borders2x}
        zIndex={13}
        left="0px"
        transition="all 300ms ease-in-out"
      >
        <Flex
          p="15px"
          borderBottom={borders}
          _hover={{ bg: hover }}
          transition="all 250ms ease-in-out"
          onClick={() => {
            addOrRemoveFromWatchlist();
            setShowMenuTableMobileForToken(null);
            setShowMenuTableMobile(false);
          }}
        >
          <Flex bg={hover} p="4px" borderRadius="6px" mr="10px">
            {isLoading ? (
              <Spinner size="sm" />
            ) : (
              <>
                {inWatchlist ? (
                  <Icon as={AiFillStar} color="yellow" />
                ) : (
                  <Icon as={AiOutlineStar} color={text60} />
                )}
              </>
            )}
          </Flex>
          {inWatchlist ? "Remove from " : "Add to "} Watchlist
        </Flex>
        {showMenuTableMobileForToken.contracts &&
          showMenuTableMobileForToken.contracts.length > 0 && (
            <Flex
              p="15px"
              borderBottom={borders}
              _hover={{ bg: hover }}
              transition="all 250ms ease-in-out"
              onClick={() => {
                setShowBuyDrawer(showMenuTableMobileForToken as Coin | Asset);
                setShowMenuTableMobileForToken(null);
                setShowMenuTableMobile(false);
              }}
            >
              <Flex bg={hover} p="4px" borderRadius="6px" mr="10px">
                <Icon as={VscArrowSwap} />
              </Flex>
              {`Buy  & Sell ${showMenuTableMobileForToken.symbol}`}
            </Flex>
          )}
        <Flex
          p="15px"
          borderBottom={borders}
          _hover={{ bg: hover }}
          transition="all 250ms ease-in-out"
          onClick={() => {
            setShowAlert(showMenuTableMobileForToken?.name);
            pushData("Interact", {
              name: "Alert Asset",
              from_page: pathname,
              asset: showMenuTableMobileForToken?.name,
            });
            setShowMenuTableMobileForToken(null);
            setShowMenuTableMobile(false);
          }}
        >
          <Flex bg={hover} p="4px" borderRadius="6px" mr="10px">
            <Icon as={TbBellRinging} color={text60} />
          </Flex>
          Set a Price Alert
        </Flex>
      </Flex>
    </>
  );
};
