"use client";
import { Button, Flex, Image, Skeleton, useColorMode } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import {
  TextLandingMedium,
  TextLandingSmall,
} from "../../../../../components/fonts";
import { TagPercentage } from "../../../../../components/tag-percentage";
import { PopupUpdateContext } from "../../../../../contexts/popup";
import { UserContext } from "../../../../../contexts/user";
import { useColors } from "../../../../../lib/chakra/colorMode";
import { pushData } from "../../../../../lib/mixpanel";
import { getFormattedAmount } from "../../../../../utils/formaters";
import { useTop100 } from "../../context-manager";
import { IWSWallet } from "../../models";

const EChart = dynamic(() => import("../../../../../lib/echart/line"), {
  ssr: false,
});

interface PortfolioProps {
  showPageMobile?: number;
}

export const Portfolio = ({ showPageMobile = 0 }: PortfolioProps) => {
  const { boxBg3, text80, text10, hover, boxBg6, borders } = useColors();
  const router = useRouter();
  const [isHover, setIsHover] = useState(false);
  const { user } = useContext(UserContext);
  const { activePortfolio } = useTop100();
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected, isDisconnected } = useAccount();
  const [wallet, setWallet] = useState<IWSWallet>({} as IWSWallet);
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  const firstRender = useRef(true);
  const { setConnect } = useContext(PopupUpdateContext);
  const pathname = usePathname();
  const [gains, setGains] = useState<{
    difference: number | null;
    percentage: number | null;
    difference_raw: number | null;
    percentage_raw: number | null;
  }>({
    difference: null,
    percentage: null,
    difference_raw: null,
    percentage_raw: null,
  });

  useEffect(() => {
    if (firstRender?.current) firstRender.current = false;
  }, []);

  useEffect(() => {
    const finalPortfolio = user?.portfolios[0] || activePortfolio;
    console.log(finalPortfolio);
    if (pathname === "/" || pathname === "/home") {
      if (finalPortfolio?.id) {
        const socket = new WebSocket(
          process.env.NEXT_PUBLIC_PORTFOLIO_WSS_ENDPOINT
        );
        setIsLoading(true);
        socket.addEventListener("open", () => {
          socket.send(
            `{"portfolio": {"id": ${
              finalPortfolio.id
            },"only": "chart_24h", "settings": { "wallets": ${JSON.stringify(
              finalPortfolio.wallets
            )}, "removed_assets": ${JSON.stringify(
              finalPortfolio.removed_assets
            )}, "removed_transactions": ${JSON.stringify(
              finalPortfolio.removed_transactions
            )}}}, "force": true}`
          );
        });
        socket.addEventListener("message", (event) => {
          try {
            if (JSON.parse(event.data) !== null) {
              setWallet({
                ...JSON.parse(event.data),
                id: finalPortfolio.id,
              });
              setIsLoading(false);
            } else {
              setWallet(null);
              setIsLoading(false);
            }
          } catch (e) {
            // console.log(e)
          }
        });
        socket.addEventListener("error", () => {
          setIsLoading(false);
        });
      }
      if (!isConnected) setIsLoading(false);
    }
    return () => {};
  }, [user?.portfolios]);

  function getGainsForPeriod() {
    const now = Date.now();
    const periods = {
      "24H": 24 * 60 * 60 * 1000,
    };
    const periodMillis = periods["24H"];
    const periodData =
      wallet.estimated_balance_history.filter(
        ([timestamp]) => now - timestamp <= periodMillis
      ) || [];
    if (periodData?.length < 2) return { difference: null, percentage: null };
    const startAmount = periodData[0][1];
    const endAmount = periodData[periodData.length - 1][1];
    const difference = endAmount - startAmount;
    const percentage = (difference / startAmount) * 100;

    return {
      difference: getFormattedAmount(difference),
      percentage: getFormattedAmount(percentage),
      difference_raw: difference,
      percentage_raw: percentage,
    };
  }

  useEffect(() => {
    if (wallet?.estimated_balance_history?.length > 0) {
      const newGains = getGainsForPeriod();
      setGains({
        difference: newGains.difference,
        percentage: newGains.percentage,
        difference_raw: newGains.difference_raw ?? null,
        percentage_raw: newGains.percentage_raw ?? null,
      });
    } else {
      setGains({
        difference: null,
        percentage: null,
        difference_raw: null,
        percentage_raw: null,
      });
    }
  }, [wallet, isConnected]);

  const tablet =
    (typeof window !== "undefined" ? window.innerWidth : 0) < 991 &&
    (typeof window !== "undefined" ? window.innerWidth : 0) >= 480;

  console.log(
    "djdjdjd",
    wallet,
    process.env.NEXT_PUBLIC_PORTFOLIO_WSS_ENDPOINT
  );

  return (
    <Flex
      h={["175px", "175px", "175px", "200px"]}
      borderRadius="12px"
      bg={boxBg3}
      border={borders}
      direction="column"
      p="10px 15px"
      position="relative"
      overflow="hidden"
      mr={["0px", "0px", "10px"]}
      minW={["100%", "100%", "407px"]}
      w={["100%", "31.5%"]}
      transform={`translateX(-${showPageMobile * 100}%)`}
      transition="all 500ms ease-in-out"
      zIndex={showPageMobile === 0 ? 3 : 1}
    >
      {isConnected ? (
        <>
          <Flex
            direction="column"
            position="absolute"
            zIndex="1"
            w="94%"
            top="10px"
          >
            <Flex justify="space-between" w="100%" mb="2px">
              <Flex
                direction="column"
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                onClick={() => {
                  pushData("Window Home Clicked", {
                    name: "Portfolio",
                    to_page: "/portfolio",
                  });
                  router.push("/portfolio");
                }}
                cursor="pointer"
              >
                <TextLandingSmall mt="-2px" color={text80}>
                  Portfolio
                </TextLandingSmall>
                <Flex
                  h="1px"
                  border={`1px solid ${isHover ? text80 : boxBg3}`}
                  w={`${isHover ? 100 : 0}%`}
                  transition="all 250ms ease-in-out"
                />
              </Flex>
              {wallet?.estimated_balance_history?.length === 0 ||
              !wallet?.estimated_balance_history?.length ? null : (
                <Flex
                  position="relative"
                  zIndex={showPageMobile === 0 ? 11 : 1}
                >
                  <TagPercentage
                    isUp={(Number(gains.percentage_raw) || 1) > 0}
                    percentage={gains.percentage || Number("--")}
                    isLoading={isLoading}
                  />
                </Flex>
              )}
            </Flex>
            {isLoading && !wallet?.estimated_balance_history ? (
              <Skeleton
                h="25px"
                w="80px"
                borderRadius="8px"
                startColor={boxBg6}
                endColor={hover}
              />
            ) : null}
            {wallet?.estimated_balance_history?.length === 0 ||
            !wallet?.estimated_balance_history?.length ? null : (
              <TextLandingMedium
                mt="-2px"
                position="relative"
                zIndex={showPageMobile === 0 ? 11 : 1}
              >
                $
                {getFormattedAmount(
                  wallet?.estimated_balance_history?.[
                    wallet.estimated_balance_history.length - 1
                  ][1]
                ) || " --"}
              </TextLandingMedium>
            )}
          </Flex>
          <Flex w="100%" mt="3px" h="100%" justify="center" mb="10px">
            {!isLoading && wallet?.estimated_balance_history?.length > 0 ? (
              <EChart
                data={wallet.estimated_balance_history}
                timeframe="ALL"
                width="100%"
                leftMargin={["0%", "0%"]}
                height={
                  // eslint-disable-next-line no-nested-ternary
                  typeof showPageMobile === "number"
                    ? "165px"
                    : tablet
                    ? "175px"
                    : "190px"
                }
                bg="transparent"
                // bg={isDarkMode ? "#151929" : "#F7F7F7"}
                type="Holdings"
                noDataZoom
                noAxis
              />
            ) : null}
            {isLoading && !firstRender.current ? (
              <svg
                width="1140"
                height="160"
                viewBox="0 0 1140 160"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  transform="scale(1, 3.5)"
                  d="M108.354 62.0435L1 79H571H1139L1067.39 54.6957L1011.15 75.0435L899.708 59.2174L835.296 54.6957L782.13 36.0435L722.83 59.2174L629.789 33.2174L556.175 66L483.583 54.6957H384.408L329.197 27L249.448 44.5217L190.148 33.2174L108.354 62.0435Z"
                  fill="url(#chart-shine)"
                  stroke={hover}
                  strokeWidth="2"
                />
                <defs>
                  <linearGradient
                    id="chart-shine"
                    x1="0"
                    y1="100%"
                    x2="100%"
                    y2="100%"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor={hover} />
                    <stop offset="12%" stopColor={hover} stopOpacity="0.1" />
                    <stop offset="30%" stopColor={hover} />
                    <stop offset="100%" stopColor={hover} />
                    <animate
                      id="gradient"
                      attributeName="x1"
                      dur="1s"
                      from="0"
                      to="100%"
                      repeatCount="indefinite"
                      begin="0s"
                    />
                  </linearGradient>
                </defs>
              </svg>
            ) : null}
            {wallet === null && !isLoading ? (
              <Flex
                my="auto"
                mt={["35px", "35px", "35px", "45px"]}
                align="center"
              >
                <Image
                  src={
                    !isDarkMode
                      ? "/asset/empty-roi-light.png"
                      : "/asset/empty-roi.png"
                  }
                  h={["80px", "110px"]}
                  w="auto"
                />
                <Flex direction="column" align="center" ml="15px">
                  <TextLandingSmall textAlign="center">
                    No assets found
                    <br />
                    Manually add a transaction
                  </TextLandingSmall>
                  <Button
                    variant="outlined"
                    mt="10px"
                    maxW="200px"
                    onClick={() => router.push("/portfolio")}
                  >
                    Add a transaction
                  </Button>
                </Flex>
              </Flex>
            ) : null}
          </Flex>
        </>
      ) : null}
      {isDisconnected && !isLoading ? (
        <>
          <TextLandingSmall color={text80}>Portfolio</TextLandingSmall>
          <Flex align="center" my="auto" justify="space-around">
            <Image
              src={
                !isDarkMode
                  ? "/asset/empty-roi-light.png"
                  : "/asset/empty-roi.png"
              }
              h={["80px", "110px"]}
              w="auto"
              alt="Empty ROI"
            />
            <Flex direction="column" align="center" ml="15px">
              <TextLandingSmall textAlign="center">
                Connect to Mobula to track your assets
              </TextLandingSmall>
              <Button
                variant="outlined"
                mt="10px"
                maxW="200px"
                onClick={() => setConnect(true)}
              >
                Connect
              </Button>
            </Flex>
          </Flex>
        </>
      ) : null}
      {isLoading && isDisconnected ? (
        <>
          <TextLandingSmall color={text80}>Portfolio</TextLandingSmall>
          <svg
            width="1140"
            height="160"
            viewBox="0 0 1140 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              transform="scale(1, 3.5)"
              d="M108.354 62.0435L1 79H571H1139L1067.39 54.6957L1011.15 75.0435L899.708 59.2174L835.296 54.6957L782.13 36.0435L722.83 59.2174L629.789 33.2174L556.175 66L483.583 54.6957H384.408L329.197 27L249.448 44.5217L190.148 33.2174L108.354 62.0435Z"
              fill="url(#chart-shine)"
              stroke={hover}
              strokeWidth="2"
            />
            <defs>
              <linearGradient
                id="chart-shine"
                x1="0"
                y1="100%"
                x2="100%"
                y2="100%"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor={hover} />
                <stop offset="12%" stopColor={hover} stopOpacity="0.1" />
                <stop offset="30%" stopColor={hover} />
                <stop offset="100%" stopColor={hover} />
                <animate
                  id="gradient"
                  attributeName="x1"
                  dur="1s"
                  from="0"
                  to="100%"
                  repeatCount="indefinite"
                  begin="0s"
                />
              </linearGradient>
            </defs>
          </svg>
        </>
      ) : null}
    </Flex>
  );
};
