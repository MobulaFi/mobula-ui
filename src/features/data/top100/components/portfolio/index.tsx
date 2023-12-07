"use client";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "../../../../../components/button";
import { LargeFont, MediumFont } from "../../../../../components/fonts";
import { Skeleton } from "../../../../../components/skeleton";
import { TagPercentage } from "../../../../../components/tag-percentage";
import { PopupUpdateContext } from "../../../../../contexts/popup";
import { UserContext } from "../../../../../contexts/user";
import { useShouldConnect } from "../../../../../hooks/connect";
import EChart from "../../../../../lib/echart/line";
import { pushData } from "../../../../../lib/mixpanel";
import { getFormattedAmount } from "../../../../../utils/formaters";
import { useTop100 } from "../../context-manager";
import { IWSWallet } from "../../models";

interface PortfolioProps {
  showPageMobile?: number;
}

export const Portfolio = ({ showPageMobile = 0 }: PortfolioProps) => {
  const router = useRouter();
  const [isHover, setIsHover] = useState(false);
  const { user } = useContext(UserContext);
  const { activePortfolio } = useTop100();
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected, isDisconnected } = useAccount();
  const [wallet, setWallet] = useState<IWSWallet>({} as IWSWallet);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const firstRender = useRef(true);
  const { setConnect } = useContext(PopupUpdateContext);
  const handleConnect = useShouldConnect(() => router.push("/portfolio"));
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
    if (pathname === "/" || pathname === "/home") {
      if (finalPortfolio?.id) {
        const socket = new WebSocket(
          process.env.NEXT_PUBLIC_PORTFOLIO_WSS_ENDPOINT as string
        );
        console.log(
          "NEXT_PUBLIC_PORTFOLIO_WSS_ENDPOINT",
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
        difference: newGains.difference as number,
        percentage: newGains.percentage as number,
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

  return (
    <>
      <div
        className={`flex h-[200px] lg:h-[175px] rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary border
       border-light-border-primary dark:border-dark-border-primary flex-col relative overflow-hidden
        min-w-[407px] md:min-w-full w-[31.5%] mr-2.5 lg:w-full transition duration-500 md:overflow-visible ${
          showPageMobile === 0 ? "z-[3]" : "z-[1]"
        }] py-2.5`}
        style={{ transform: `translateX(-${showPageMobile * 100}%)` }}
      >
        {isConnected ? (
          <div
            className={`min-w-full  flex flex-col w-[200px] transition-all duration-250`}
          >
            <div className="flex flex-col z-[1] top-2.5 px-2.5">
              <div className="flex justify-between w-full mb-0.5">
                <div
                  className="flex flex-col cursor-pointer"
                  onMouseEnter={() => setIsHover(true)}
                  onMouseLeave={() => setIsHover(false)}
                  onClick={() => {
                    pushData("Window Home Clicked", {
                      name: "Portfolio",
                      to_page: "/portfolio",
                    });
                    handleConnect();
                  }}
                >
                  <MediumFont>Portfolio</MediumFont>
                  <div
                    className={`h-[1px] border ${
                      isHover
                        ? "border-light-font-100 dark:border-dark-font-100"
                        : "border-light-bg-secondary dark:border-dark-bg-secondary"
                    } transition-all duration-250 ease-in-out`}
                    style={{
                      width: isHover ? "100%" : "0%",
                    }}
                  />
                </div>
                {wallet?.estimated_balance_history?.length === 0 ||
                !wallet?.estimated_balance_history?.length ? null : (
                  <div
                    className={`relative z-[${showPageMobile === 0 ? 11 : 1}]`}
                  >
                    <TagPercentage
                      isUp={(Number(gains.percentage_raw) || 1) > 0}
                      percentage={gains.percentage || Number("--")}
                      isLoading={isLoading}
                    />
                  </div>
                )}
              </div>
              {isLoading && !wallet?.estimated_balance_history ? (
                <Skeleton extraCss="h-[25px] w-[80px]" />
              ) : null}
              {wallet?.estimated_balance_history?.length === 0 ||
              !wallet?.estimated_balance_history?.length ? null : (
                <LargeFont
                  extraCss={`mt-[-2px] relative z-[${
                    showPageMobile === 0 ? 11 : 1
                  }]`}
                >
                  $
                  {getFormattedAmount(
                    wallet?.estimated_balance_history?.[
                      wallet.estimated_balance_history.length - 1
                    ][1]
                  ) || " --"}
                </LargeFont>
              )}
            </div>
            <div className="w-full h-full justify-center absolute top-5 lg:top-3  px-2.5">
              {!isLoading && wallet?.estimated_balance_history?.length > 0 ? (
                <EChart
                  data={wallet.estimated_balance_history}
                  timeframe="ALL"
                  leftMargin={["0%", "0%"]}
                  height={
                    // eslint-disable-next-line no-nested-ternary
                    // typeof showPageMobile === "number"
                    //   ? "165px"
                    //   : tablet
                    //   ? "175px"
                    //   : "180px"
                    "100%"
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
                    stroke={
                      isDarkMode
                        ? "rgba(34, 37, 49, 1)"
                        : "rgba(245, 245, 245, 1)"
                    }
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
                      <stop
                        stopColor={
                          isDarkMode
                            ? "rgba(34, 37, 49, 1)"
                            : "rgba(245, 245, 245, 1)"
                        }
                      />
                      <stop
                        offset="12%"
                        stopColor={
                          isDarkMode
                            ? "rgba(34, 37, 49, 1)"
                            : "rgba(245, 245, 245, 1)"
                        }
                        stopOpacity="0.1"
                      />
                      <stop
                        offset="30%"
                        stopColor={
                          isDarkMode
                            ? "rgba(34, 37, 49, 1)"
                            : "rgba(245, 245, 245, 1)"
                        }
                      />
                      <stop
                        offset="100%"
                        stopColor={
                          isDarkMode
                            ? "rgba(34, 37, 49, 1)"
                            : "rgba(245, 245, 245, 1)"
                        }
                      />
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
                <div className="my-auto mt-[40px] lg:mt-[35px] flex items-center">
                  <img
                    src={
                      !isDarkMode
                        ? "/asset/empty-roi-light.png"
                        : "/asset/empty-roi.png"
                    }
                    className="h-[110px] sm:h-[100px] w-auto ml-2.5"
                    alt="empty roi"
                  />
                  <div className="flex flex-col items-center ml-auto mr-9 md:mx-auto">
                    <MediumFont extraCss="text-center">
                      No assets found
                      <br />
                      Manually add a transaction
                    </MediumFont>
                    <Button
                      extraCss="mt-2.5 max-w-[200px]"
                      onClick={handleConnect}
                    >
                      Add a transaction
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
        {isDisconnected && !isLoading ? (
          <>
            <MediumFont extraCss="ml-2.5 w-fit">Portfolio</MediumFont>
            <div className="my-auto mt-[20px] lg:mt-[10px] flex items-center">
              <img
                src={
                  !isDarkMode
                    ? "/asset/empty-roi-light.png"
                    : "/asset/empty-roi.png"
                }
                className="h-[110px] sm:h-[110px] w-auto ml-8"
                alt="empty roi"
              />
              <div className="flex flex-col items-center mx-auto md:mx-auto">
                <MediumFont extraCss="text-center">
                  Connect to Mobula <br />
                  to track your assets
                </MediumFont>
                <Button
                  extraCss="mt-2.5 max-w-[200px]"
                  onClick={() => setConnect(true)}
                >
                  Connect
                </Button>
              </div>
            </div>
          </>
        ) : null}
        {isLoading && isDisconnected ? (
          <>
            <MediumFont>Portfolio</MediumFont>
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
                stroke={
                  isDarkMode ? "rgba(34, 37, 49, 1)" : "rgba(245, 245, 245, 1)"
                }
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
                  <stop
                    stopColor={
                      isDarkMode
                        ? "rgba(34, 37, 49, 1)"
                        : "rgba(245, 245, 245, 1)"
                    }
                  />
                  <stop
                    offset="12%"
                    stopColor={
                      isDarkMode
                        ? "rgba(34, 37, 49, 1)"
                        : "rgba(245, 245, 245, 1)"
                    }
                    stopOpacity="0.1"
                  />
                  <stop
                    offset="30%"
                    stopColor={
                      isDarkMode
                        ? "rgba(34, 37, 49, 1)"
                        : "rgba(245, 245, 245, 1)"
                    }
                  />
                  <stop
                    offset="100%"
                    stopColor={
                      isDarkMode
                        ? "rgba(34, 37, 49, 1)"
                        : "rgba(245, 245, 245, 1)"
                    }
                  />
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
      </div>
    </>
  );
};
