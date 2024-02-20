"use client";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FiUnlock } from "react-icons/fi";
import { useAccount } from "wagmi";
import { Button } from "../../../../../components/button";
import { LargeFont, MediumFont } from "../../../../../components/fonts";
import { Spinner } from "../../../../../components/spinner";
import { TagPercentage } from "../../../../../components/tag-percentage";
import { PopupUpdateContext } from "../../../../../contexts/popup";
import { UserContext } from "../../../../../contexts/user";
import { useShouldConnect } from "../../../../../hooks/connect";
import { pushData } from "../../../../../lib/mixpanel";
import { getFormattedAmount } from "../../../../../utils/formaters";
import { useTop100 } from "../../context-manager";
import { IWSWallet } from "../../models";

interface PortfolioProps {
  showPageMobile?: number;
}

const EChart = dynamic(() => import("../../../../../lib/echart/line"), {
  ssr: false,
});

const Portfolio = ({ showPageMobile = 0 }: PortfolioProps) => {
  const router = useRouter();
  const [isHover, setIsHover] = useState(false);
  const { user } = useContext(UserContext);
  const { activePortfolio } = useTop100();
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected, isDisconnected } = useAccount();
  const [wallet, setWallet] = useState<IWSWallet>({} as IWSWallet);
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
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

  const getYesterdayTimestamp = () => {
    const oneDayMilliseconds = 24 * 60 * 60 * 1000;
    const currentTime = new Date().getTime();
    const oneDayAgo = currentTime - oneDayMilliseconds;
    return oneDayAgo;
  };

  useEffect(() => {
    const finalPortfolio = user?.portfolios[0] || activePortfolio;
    const walletsArr = finalPortfolio?.wallets || [];
    const uniqueString = walletsArr.join(",");
    const cleanedString = uniqueString.replace(/[\[\] ]/g, "");
    const now = new Date().getTime();
    const oneDayAgo = getYesterdayTimestamp();
    const encodedWallets = cleanedString
      .split(",")
      .map((wallet) => encodeURIComponent(wallet))
      .join("%2C");
    if (!finalPortfolio?.id && isConnected) return;
    try {
      fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/1/wallet/history?wallets=${encodedWallets}&from=${oneDayAgo}&to=${now}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: process.env.NEXT_PUBLIC_PRICE_KEY as string,
          },
        }
      )
        .then((r) => r.json())
        .then((r) => {
          if (r.data) {
            setWallet({
              ...r.data,
              id: finalPortfolio?.id,
            });
            setIsLoading(false);
          } else {
            setWallet(null);
            setIsLoading(false);
          }
        });
    } catch (e) {
      setIsLoading(false);
    }
    return () => {};
  }, [user?.portfolios, isConnected]);

  function getGainsForPeriod() {
    const now = Date.now();
    const periods = {
      "24H": 24 * 60 * 60 * 1000,
    };
    const periodMillis = periods["24H"];
    const periodData =
      wallet?.balance_history?.filter(
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
    if ((wallet?.balance_history?.length as number) > 0) {
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

  const isWalletEmpty = !wallet?.balance_history?.length;

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
        {isConnected && !isLoading ? (
          <div
            className={`min-w-full  flex flex-col w-[200px] transition-all duration-200`}
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
                    } transition-all duration-200 ease-in-out`}
                    style={{
                      width: isHover ? "100%" : "0%",
                    }}
                  />
                </div>
                {isWalletEmpty ? null : (
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
              {isWalletEmpty ? null : (
                <LargeFont
                  extraCss={`mt-[-2px] relative z-[${
                    showPageMobile === 0 ? 11 : 1
                  }]`}
                >
                  $
                  {getFormattedAmount(
                    wallet?.balance_history?.[
                      wallet.balance_history.length - 1
                    ][1]
                  ) || " --"}
                </LargeFont>
              )}
            </div>
            <div className="w-full h-full justify-center absolute top-5 lg:top-3  px-2.5">
              {!isLoading && !isWalletEmpty ? (
                <EChart
                  data={wallet.balance_history}
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
              {wallet === null && !isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col mb-5">
                    <MediumFont extraCss="text-center font-normal">
                      No assets found
                      <br />
                      Manually add a transaction
                    </MediumFont>
                    <Button extraCss="mt-2.5 mx-auto" onClick={handleConnect}>
                      Add a transaction
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
        {isLoading ? (
          <>
            <MediumFont extraCss="ml-2.5 w-fit">Portfolio</MediumFont>
            <div className="flex items-center justify-center h-[110px] lg:h-[90px] mt-5">
              <Spinner extraCss="h-[40px] w-[40px]" />{" "}
            </div>
          </>
        ) : null}
        {!isConnected && !isLoading ? (
          <>
            <MediumFont extraCss="ml-2.5">Portfolio</MediumFont>
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col">
                <MediumFont extraCss="text-center font-normal">
                  Connect your wallet to Mobula <br /> to track your portfolio
                </MediumFont>
                <Button
                  extraCss="mt-2.5 mx-auto"
                  onClick={() => setConnect(true)}
                >
                  <FiUnlock className="mr-1.5" />
                  Connect
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default Portfolio;
