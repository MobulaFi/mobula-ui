"use client";
import { Box, Button, Flex, Icon, Spinner, Tbody, Tr } from "@chakra-ui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AiFillStar, AiOutlineStar, AiOutlineSwap } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TbBellRinging } from "react-icons/tb";
import { NextImageFallback } from "../../../components/image";
import { WatchlistContext } from "../../../contexts/pages/watchlist";
import { PopupStateContext, PopupUpdateContext } from "../../../contexts/popup";
import { SettingsMetricContext } from "../../../contexts/settings";
import { UserContext } from "../../../contexts/user";
import { defaultTop100 } from "../../../features/data/Home/constants";
import { useTop100 } from "../../../features/data/Home/context-manager";
import { Asset } from "../../../interfaces/assets";
import { IWatchlist } from "../../../interfaces/pages/watchlist";
import { useColors } from "../../../lib/chakra/colorMode";
import { pushData } from "../../../lib/mixpanel";
import { createSupabaseDOClient } from "../../../lib/supabase";
// import { PriceAlertPopup } from "../../../components/popup/price-alert/indext";
import React from "react";
import { useIsInViewport } from "../../../hooks/viewport";
import { getUrlFromName } from "../../../utils/formaters";
import { EntryContext, TableContext } from "../context-manager";
import { useWatchlist } from "../hooks/watchlist";
import { TableAsset } from "../model";
import { getCountdown } from "../utils";
import { Segment } from "./segment";
import { ChangeSegment } from "./segments/change";
import { ChartSegment } from "./segments/chart";
import { MarketCapSegment } from "./segments/market_cap";
import { PriceSegment } from "./segments/price";
import { VolumeSegment } from "./segments/volume";
import { TokenInfo } from "./ui/token";

export const Entry = ({
  token: tokenBuffer,
  index,
  isTop100,
  isMobile,
  showRank = false,
}: {
  token: TableAsset;
  index: number;
  isTop100?: boolean;
  isMobile?: boolean;
  showRank?: boolean;
}) => {
  const entryRef = useRef<HTMLTableSectionElement>(null);
  const router = useRouter();
  const [token, setToken] = useState<TableAsset>(tokenBuffer);
  const [isHover, setIsHover] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const isBalance =
    Object.keys(token).includes("balance") &&
    (pathname === "/" || pathname === "/home" || pathname === "/?page=" + page);

  const {
    text60,
    borders,
    boxBg3,
    bgMain,
    bgTable,
    hover,
    boxBg6,
    bordersActive,
    text80,
    text40,
  } = useColors();
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const isVisible = useIsInViewport(entryRef);
  const { setTokenToAddInWatchlist, activeWatchlist, setActiveWatchlist } =
    useContext(WatchlistContext);
  const [metricsChanges, setMetricsChanges] = useState<{
    price: boolean | null;
    volume: boolean | null;
    market_cap: boolean | null;
  }>({
    price: null,
    volume: null,
    market_cap: null,
  });
  const { showAlert } = useContext(PopupStateContext);
  const {
    setShowAddedToWatchlist,
    setShowMenuTableMobileForToken,
    setShowMenuTableMobile,
  } = useContext(PopupUpdateContext);
  const { inWatchlist, handleAddWatchlist } = useWatchlist(token.id);
  const { lastColumn } = useContext(TableContext);
  const { setShowBuyDrawer } = useContext(SettingsMetricContext);
  const { activeView } = useTop100();
  const [show, setShow] = useState(false);

  const [addedToWatchlist, setAddedToWatchlist] = useState(inWatchlist);
  const watchlist = user?.main_watchlist as IWatchlist;

  const updateMetricsChange = (key) => {
    setMetricsChanges((prev) => {
      let updatedValue = prev[key];
      if (token[key]) updatedValue = true;
      else if (token[key] !== undefined) updatedValue = false;
      return { ...prev, [key]: updatedValue };
    });

    setTimeout(() => {
      setMetricsChanges((prev) => ({ ...prev, [key]: null }));
    }, 800);
  };

  useEffect(() => updateMetricsChange("price"), [token?.price]);
  useEffect(() => updateMetricsChange("volume"), [token?.global_volume]);
  useEffect(() => updateMetricsChange("market_cap"), [token?.market_cap]);
  useEffect(() => updateMetricsChange("rank"), [token?.rank]);

  const url = `/asset/${getUrlFromName(token.name)}`;

  const lastComponent = {
    Chart: token.id ? (
      <Box w="135px" h="45px">
        <NextImageFallback
          width={135}
          height={45}
          alt={`${token.name} sparkline`}
          src={
            `https://mobula-assets.s3.eu-west-3.amazonaws.com/sparklines/${token.id}/24h.png` ||
            "/404/sparkline.png"
          }
          fallbackSrc="/404/sparkline.png"
          priority={index < 4}
          unoptimized
        />
      </Box>
    ) : (
      isBalance && (
        <Button
          ml={["0%", "0%", "30px"]}
          color={text80}
          borderRadius="8px"
          w={["100%", "100%", "80%"]}
          h="30px"
          fontSize="xs"
          border={borders}
          fontWeight="400"
          bg={boxBg6}
          _hover={{ bg: hover, border: bordersActive }}
          transition="all 250ms ease-in-out"
          onClick={() =>
            router.push(token.name !== "Mobula" ? "/list" : "/earn")
          }
        >
          {token.name !== "Mobula" ? "List this asset" : "Earn MOBL"}
        </Button>
      )
    ),
    Added: getCountdown(Date.now() - new Date(token.created_at).getTime()),
  };

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        const supabase = createSupabaseDOClient();
        supabase
          .from("assets")
          .select(
            "price,market_cap,global_volume,rank,created_at,price_change_24h"
          )
          .match({ id: token.id })
          .single()
          .then((r) => {
            if (
              r.data &&
              (r.data.price !== token.price ||
                r.data.global_volume !== token.global_volume ||
                r.data.market_cap !== token.market_cap ||
                r.data.rank !== token.rank)
            ) {
              setToken({
                ...token,
                price: r.data.price,
                priceChange:
                  r.data.price !== token.price
                    ? r.data.price > token.price
                    : undefined,
                market_cap: r.data.market_cap,
                marketCapChange:
                  r.data.market_cap !== token.market_cap
                    ? r.data.market_cap > token.market_cap
                    : undefined,
                volume: r.data.global_volume,
                rank: r.data.rank,
                volumeChange:
                  r.data.global_volume !== token.global_volume
                    ? r.data.global_volume > token.global_volume
                    : undefined,
                price_change_24h: r.data.price_change_24h,
              });
            }
          });
      }, 5000);

      return () => clearInterval(interval);
    }
    return () => {};
  }, [isVisible, token]);

  const addOrRemoveFromWatchlist = async () => {
    if (pathname.includes("watchlist")) {
      if (!activeWatchlist?.assets?.includes(token?.id)) {
        setShowAddedToWatchlist(true);
        setTokenToAddInWatchlist(token);
      } else {
        handleAddWatchlist(
          token.id,
          Number(activeWatchlist?.id),
          false,
          setIsLoading
        );
        setActiveWatchlist((prev) => ({
          ...prev,
          assets: prev?.assets
            ? prev.assets.filter((asset) => asset !== token.id)
            : [],
        }));
      }
    } else if (!inWatchlist) {
      setShowAddedToWatchlist(true);
      setTokenToAddInWatchlist(token);
    } else {
      setShowAddedToWatchlist(false);
      handleAddWatchlist(token?.id, watchlist?.id, false, setIsLoading);
    }
  };

  const value = useMemo(
    () => ({
      isHover,
      url,
    }),
    [isHover, url]
  );

  const getBackgroundFromTable = () => {
    if (isTop100 && !isHover) return bgTable;
    if (isTop100 && isHover) return boxBg3;
    if (!isTop100 && isHover) return boxBg3;
    return bgMain;
  };

  const showMinimalMobile =
    (isMobile &&
      JSON.stringify(activeView?.display) ===
        JSON.stringify(defaultTop100.display) &&
      JSON.stringify(activeView?.filters) ===
        JSON.stringify(defaultTop100.filters)) ||
    (activeView?.name === "Portfolio" && isMobile);

  const renderSegments = () =>
    activeView?.display?.map((entry) => {
      switch (entry.type) {
        case "price":
          return (
            <PriceSegment
              token={token}
              display={entry.value}
              metricsChanges={metricsChanges}
              key={`price-${token.id}-${entry.value}`}
            />
          );
        case "change":
          return (
            <ChangeSegment
              token={token}
              display={entry.value}
              key={`change-${token.id}-${entry.value}`}
            />
          );
        case "market_cap":
          return (
            <MarketCapSegment
              metricsChanges={metricsChanges}
              token={token}
              display={entry.value}
              key={`mc-${token.id}-${entry.value}`}
            />
          );
        case "volume":
          return (
            <VolumeSegment
              metricsChanges={metricsChanges}
              token={token}
              display={entry.value}
              key={`volume-${token.id}-${entry.value}`}
            />
          );
        case "chart":
          return (
            <ChartSegment
              token={token}
              display="Chart"
              key={`chart-${token.id}-${entry.value}`}
            />
          );
        default:
          return null;
      }
    });

  return (
    <EntryContext.Provider value={value}>
      {showMinimalMobile ? (
        <Tbody
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          fontFamily="Inter"
          borderBottom="none"
          bg={[isHover ? boxBg3 : "none"]}
          _hover={{
            cursor: "pointer",
            color: text80,
          }}
          ref={entryRef}
        >
          <Tr
            color={text80}
            display={["table-row", "table-row", "table-row", "none"]}
          >
            <Segment
              pl="10px"
              pr={["0px", "0px"]}
              noLink
              maxW={["35px", "20px", "auto"]}
              position={["sticky", "sticky", "sticky"]}
              left="0px"
              zIndex={2}
              py={["5px", "5px", "5px", "20px"]}
              bg={getBackgroundFromTable()}
            >
              <Flex
                align="center"
                justify="center"
                display={["none", "none", "flex"]}
              >
                {isLoading ? (
                  <Spinner
                    thickness="2px"
                    speed="0.65s"
                    emptyColor={boxBg3}
                    color="blue"
                    size="xs"
                  />
                ) : (
                  <>
                    {inWatchlist || addedToWatchlist ? (
                      <Icon
                        as={AiFillStar}
                        color="yellow"
                        onClick={() => {
                          addOrRemoveFromWatchlist();
                          setAddedToWatchlist(!addedToWatchlist);
                        }}
                      />
                    ) : (
                      <Icon
                        as={AiOutlineStar}
                        color={text60}
                        onClick={() => {
                          addOrRemoveFromWatchlist();
                          setAddedToWatchlist(!addedToWatchlist);
                        }}
                      />
                    )}
                  </>
                )}
                <Box marginLeft="5px" opacity="0.6" color={text80}>
                  {token.rank}
                </Box>
              </Flex>
              <Box w="fit-content" display={["block", "block", "none"]}>
                <Button
                  as={Button}
                  px="5px"
                  py="8px"
                  onClick={() => {
                    setShowMenuTableMobile(true);
                    setShowMenuTableMobileForToken(token);
                  }}
                >
                  <Icon
                    as={BsThreeDotsVertical}
                    color={text40}
                    fontSize="18px"
                  />
                </Button>
              </Box>
            </Segment>
            <Segment
              py="10px"
              maxWidth={["120px", "190px !important"]}
              minWidth={["105px", "125px", "125px", "19Opx"]}
              position="sticky"
              w="fit-content"
              left={["24px", "24px", "70px"]}
              bg={getBackgroundFromTable()}
            >
              <TokenInfo token={token} showRank={showRank} index={index} />
            </Segment>
            <PriceSegment
              token={token}
              metricsChanges={metricsChanges}
              display="Price USD"
            />
            {activeView?.name === "Portfolio" ? (
              <VolumeSegment
                token={token}
                metricsChanges={metricsChanges}
                display="24h Volume"
              />
            ) : (
              <ChangeSegment token={token} display="24h %" />
            )}
          </Tr>
        </Tbody>
      ) : (
        <Tbody
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          fontFamily="Inter"
          borderBottom="none"
          bg={[isHover ? boxBg3 : "none"]}
          _hover={{
            cursor: "pointer",
            color: text80,
          }}
          ref={entryRef}
        >
          <Tr color={text80} display={["table-row"]}>
            <Segment
              pl={["5px", "10px"]}
              pr={["10px", "0px"]}
              noLink
              maxW={["35px", "20px", "auto"]}
              position={["sticky", "sticky", "sticky"]}
              left="0px"
              zIndex={2}
              py={["5px", "5px", "5px", "30px"]}
              bg={getBackgroundFromTable()}
            >
              <Flex
                align="center"
                justify="center"
                display={["none", "none", "flex"]}
              >
                {isLoading ? (
                  <Spinner
                    thickness="2px"
                    speed="0.65s"
                    emptyColor={boxBg3}
                    color="blue"
                    size="xs"
                  />
                ) : (
                  <>
                    {inWatchlist || addedToWatchlist ? (
                      <Icon
                        as={AiFillStar}
                        color="yellow"
                        onClick={() => {
                          addOrRemoveFromWatchlist();
                          setAddedToWatchlist(!addedToWatchlist);
                        }}
                      />
                    ) : (
                      <Icon
                        as={AiOutlineStar}
                        color={text60}
                        onClick={() => {
                          addOrRemoveFromWatchlist();
                          setAddedToWatchlist(!addedToWatchlist);
                        }}
                      />
                    )}
                  </>
                )}
                <Box marginLeft="5px" opacity="0.6" color={text80}>
                  {token.rank}
                </Box>
              </Flex>
              <Box w="fit-content" display={["block", "block", "none"]}>
                <Button
                  as={Button}
                  px="5px"
                  py="8px"
                  h="100%"
                  onClick={() => {
                    setShowMenuTableMobile(true);
                    setShowMenuTableMobileForToken(token);
                  }}
                >
                  <Icon
                    as={BsThreeDotsVertical}
                    color={text40}
                    fontSize="18px"
                  />
                </Button>
              </Box>
            </Segment>
            <Segment
              py="10px"
              maxWidth={["160px ", "100px ", "150px ", "190px "]}
              minWidth={["125px", "185px", "180px", "19Opx"]}
              position="sticky"
              left={["32px", "32px", "73px"]}
              zIndex="1"
              bg={getBackgroundFromTable()}
            >
              <TokenInfo token={token} showRank={showRank} index={index} />
            </Segment>
            {activeView?.display?.length ? (
              activeView?.display?.length > 0
            ) : false &&
              (pathname === "/" ||
                pathname === "/home" ||
                pathname === "/?page=" + page) ? (
              renderSegments()
            ) : (
              <>
                <PriceSegment
                  token={token}
                  metricsChanges={metricsChanges}
                  display="Price USD"
                />
                <ChangeSegment token={token} display="24h %" />
                <MarketCapSegment
                  token={token}
                  metricsChanges={metricsChanges}
                  display="Market Cap"
                />
                <VolumeSegment
                  token={token}
                  metricsChanges={metricsChanges}
                  display="24h Volume"
                />
                {pathname === "/" ||
                pathname === "/home" ||
                pathname === `/?page=${page}` ||
                isBalance ? (
                  <ChartSegment token={token} display="Chart" />
                ) : null}
              </>
            )}
            {pathname !== "/" &&
            pathname !== "/home" &&
            pathname !== `/?page=${page}` ? (
              <Segment color={text80}>{lastComponent[lastColumn]}</Segment>
            ) : null}

            <Segment display={["none", "none", "table-cell"]} noLink>
              <Flex align="center" justify="flex-end">
                <Button
                  variant="outlined_grey"
                  px="0px"
                  boxSize="28px"
                  mr="5px"
                  onClick={() => {
                    setShow(true);
                    pushData("Interact", {
                      name: "Alert Asset",
                      from_page: pathname,
                      asset: token?.name,
                    });
                  }}
                >
                  <Icon as={TbBellRinging} color={text60} fontSize="18px" />
                </Button>
                {token.contracts && token.contracts.length > 0 && (
                  <Button
                    variant="outlined_grey"
                    px="0px"
                    boxSize="28px"
                    onClick={() => {
                      setShowBuyDrawer(token as Asset);
                      pushData("Interact", {
                        name: "Swap Drawer",
                        from_page: pathname,
                        asset: token?.name,
                      });
                    }}
                  >
                    <Icon
                      as={AiOutlineSwap}
                      transform="rotate(90deg)"
                      color={text60}
                      fontSize="18px"
                    />
                  </Button>
                )}
              </Flex>
            </Segment>
          </Tr>
        </Tbody>
      )}
      {/* {show || (isMobile && showAlert === token?.name) ? (
        <PriceAlertPopup
          show={(show as any) || (showAlert as any)}
          setShow={setShow}
          asset={token as Asset}
        />
      ) : null} */}
    </EntryContext.Provider>
  );
};
