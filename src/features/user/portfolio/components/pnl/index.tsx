import React, { useContext, useEffect, useState } from "react";
import { SlRefresh } from "react-icons/sl";
import { SmallFont } from "../../../../../components/fonts";
import { Skeleton } from "../../../../../components/skeleton";
import { pushData } from "../../../../../lib/mixpanel";
import { getFormattedAmount } from "../../../../../utils/formaters";
import { PortfolioV2Context } from "../../context-manager";
import { useWebSocketResp } from "../../hooks";
import { boxStyle } from "../../style";
import { Privacy } from "../ui/privacy";
import { NetProfit } from "./net-profit";

export const PNL = () => {
  const { wallet, setTimeframe, timeframe, manager, isLoading, isRefreshing } =
    useContext(PortfolioV2Context);
  const refreshPortfolio = useWebSocketResp();
  const [showMorePnl, setShowMorePnl] = useState(false);
  const [balanceColor, setBalanceColor] = useState(
    "text-light-font-100 dark:text-dark-font-100"
  );

  useEffect(() => {
    if (!wallet) return;
    if (wallet.estimated_balance_change === true) {
      setBalanceColor("text-green dark:text-green");
      setTimeout(() => {
        setBalanceColor("text-light-font-100 dark:text-dark-font-100");
      }, 1000);
    } else if (wallet.estimated_balance_change === false) {
      setBalanceColor("text-red dark:text-red");
      setTimeout(() => {
        setBalanceColor("text-light-font-100 dark:text-dark-font-100");
      }, 1000);
    }
  }, [wallet]);

  return (
    <div
      className={`${boxStyle} flex-col border border-light-border-primary dark:border-dark-border-primary bg-light-bg-secondary dark:bg-dark-bg-secondary`}
      onClick={() => setShowMorePnl(!showMorePnl)}
    >
      <div className="flex justify-between">
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center text-3xl">
              {manager.privacy_mode ? (
                <Privacy extraCss="text-3xl lg:text-2xl md:text-lg" />
              ) : (
                <div className="flex">
                  {isLoading ? (
                    <Skeleton extraCss="mb-[5px] w-[60px] h-[30px] lg:h-[24px] md:h-[18px] rounded-lg" />
                  ) : (
                    <p
                      className={`text-3xl lg:text-2xl md:text-lg font-medium md:font-normal ${balanceColor} transition-all duration-200`}
                    >
                      $
                      {getFormattedAmount(wallet?.estimated_balance, 0, {
                        shouldNotMinifyBigNumbers: true,
                      })}
                    </p>
                  )}
                </div>
              )}
              <button
                className="ml-2 relative w-fit h-fit"
                onClick={() => {
                  refreshPortfolio();
                  pushData("Refresh Portfolio Clicked");
                }}
              >
                <SlRefresh
                  className={`text-2xl lg:text-lg text-light-font-100 dark:text-dark-font-100 rotate-[45deg] font-medium ${
                    isLoading || isRefreshing ? "animate-refresh" : ""
                  }`}
                />
                <div
                  className={`rounded-full flex w-[6px] min-w-[6px] h-[6px] ${
                    isLoading || isRefreshing ? "bg-yellow" : "bg-green"
                  } absolute top-[-5px] right-[-5px]`}
                />
              </button>
            </div>
            <div className="flex flex-col lg:hidden">
              {isLoading ? (
                <Skeleton extraCss="w-[60px] h-[24px] rounded-lg" />
              ) : (
                <></>
                // <Menu matchWidth>
                //   <MenuButton
                //     border={borders}
                //     borderRadius="8px"
                //     color={text80}
                //     fontWeight="400"
                //     h="24px"
                //     px="7.5px"
                //     bg={boxBg6}
                //     fontSize={["12px", "12px", "13px", "14px"]}
                //     as={Button}
                //     rightIcon={<ChevronDownIcon pl="0px" mr="-2px" ml="-5px" />}
                //   >
                //     {timeframe}
                //   </MenuButton>
                //   <MenuList
                //     py="5px"
                //     minW="0px"
                //     border={borders}
                //     boxShadow="1px 2px 13px 3px rgba(0,0,0,0.1)"
                //     bg={boxBg6}
                //     borderRadius="8px"
                //   >
                //     {timeframeOptions.map((time) => (
                //       <MenuItem
                //         _hover={{ color: { text80 } }}
                //         transition="all 250ms ease-in-out"
                //         borderRadius="8px"
                //         color={timeframe === time ? text80 : text40}
                //         py="5px"
                //         fontSize={["12px", "12px", "13px", "14px"]}
                //         bg={boxBg6}
                //         onClick={() => setTimeframe(time)}
                //       >
                //         {time}
                //       </MenuItem>
                //     ))}
                //   </MenuList>
                // </Menu>
              )}
            </div>
            <NetProfit
              extraCss="hidden lg:flex"
              showMorePnl={showMorePnl}
              setShowMorePnl={setShowMorePnl}
            />
          </div>
          <NetProfit
            extraCss="flex lg:hidden"
            showMorePnl={showMorePnl}
            setShowMorePnl={setShowMorePnl}
          />
        </div>
      </div>
      <div
        className={`flex flex-col w-full h-full overflow-hidden ${
          showMorePnl ? "sm:h-full" : "sm:h-[0px]"
        }`}
      >
        {timeframe !== "ALL" ? (
          <div className="mt-2.5 py-2.5 border-b border-light-border-primary dark:border-dark-border-primary flex justify-between px-[5px]">
            {isLoading ? (
              <Skeleton extraCss="w-[110px] h-[14px] lg:h-[13px] md:h-[12px] rounded-lg" />
            ) : (
              <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
                Realized PNL ({timeframe})
              </SmallFont>
            )}
            {manager.privacy_mode ? (
              <Privacy />
            ) : (
              <div className="flex">
                {isLoading ? (
                  <Skeleton extraCss="w-[50px] h-[14px] lg:h-[13px] md:h-[12px] rounded-lg" />
                ) : (
                  <SmallFont
                    extraCss={`${
                      wallet?.relative_global_pnl?.[timeframe.toLowerCase()]
                        ?.realized > 0
                        ? "text-green dark:text-green"
                        : "text-red dark:text-red"
                    }`}
                  >
                    {getFormattedAmount(
                      wallet?.relative_global_pnl?.[timeframe.toLowerCase()]
                        ?.realized
                    )}
                    $
                  </SmallFont>
                )}
              </div>
            )}
          </div>
        ) : null}
        <div className="py-2.5 border-b border-light-border-primary dark:border-dark-border-primary flex justify-between px-[5px]">
          {isLoading ? (
            <Skeleton extraCss="w-[110px] h-[14px] lg:h-[13px] md:h-[12px] rounded-lg" />
          ) : (
            <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
              Realized PNL
            </SmallFont>
          )}
          {manager.privacy_mode ? (
            <Privacy />
          ) : (
            <div className="flex">
              {isLoading ? (
                <Skeleton extraCss="w-[50px] h-[14px] lg:h-[13px] md:h-[12px] rounded-lg" />
              ) : (
                <SmallFont
                  extraCss={`${
                    (wallet?.total_realized || 0) > 0
                      ? "text-green dark:text-green"
                      : "text-red dark:text-red"
                  }`}
                >
                  {getFormattedAmount(wallet?.total_realized)}$
                </SmallFont>
              )}
            </div>
          )}
        </div>
        <div className="flex py-2.5 justify-between px-[5px]">
          {isLoading ? (
            <Skeleton extraCss="w-[110px] h-[14px] lg:h-[13px] md:h-[12px] rounded-lg" />
          ) : (
            <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
              Unrealized PNL
            </SmallFont>
          )}
          {manager.privacy_mode ? (
            <Privacy />
          ) : (
            <div className="flex">
              {isLoading ? (
                <Skeleton extraCss="w-[50px] h-[14px] lg:h-[13px] md:h-[12px] rounded-lg" />
              ) : (
                <SmallFont
                  extraCss={`${
                    (wallet?.total_unrealized || 0) > 0
                      ? "text-green dark:text-green"
                      : "text-red dark:text-red"
                  }`}
                >
                  {getFormattedAmount(wallet?.total_unrealized)}$
                </SmallFont>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
