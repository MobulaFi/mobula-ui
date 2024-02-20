import { NextImageFallback } from "components/image";
import { Asset } from "interfaces/assets";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { BiHide } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import { TbTriangleFilled } from "react-icons/tb";
import { VscArrowSwap } from "react-icons/vsc";
import { useAccount } from "wagmi";
import { MediumFont, SmallFont } from "../../../../../../components/fonts";
import { Menu } from "../../../../../../components/menu";
import {
  PopupStateContext,
  PopupUpdateContext,
} from "../../../../../../contexts/popup";
import { SettingsMetricContext } from "../../../../../../contexts/settings";
import { TimeSelected } from "../../../../../../interfaces/pages/asset";
import { useWatchlist } from "../../../../../../layouts/new-tables/hooks/watchlist";
import { pushData } from "../../../../../../lib/mixpanel";
import { GET } from "../../../../../../utils/fetch";
import {
  getFormattedAmount,
  getTokenPercentage,
} from "../../../../../../utils/formaters";
import { PortfolioV2Context } from "../../../context-manager";
import { useWebSocketResp } from "../../../hooks";
import { UserHoldingsAsset } from "../../../models";
import { flexGreyBoxStyle, tdStyle } from "../../../style";
import { getAmountLoseOrWin } from "../../../utils";
import { Activity } from "../../category/activity";
import { Privacy } from "../privacy";

interface TbodyCryptocurrenciesProps {
  asset: UserHoldingsAsset;
  showTokenInfo: number | null;
  setShowTokenInfo: React.Dispatch<React.SetStateAction<number | null>>;
  tokenInfo: Asset;
}

interface LinkTdProps {
  children: React.ReactNode;
  asset: UserHoldingsAsset;
  extraCss?: string;
  [key: string]: any;
}

const EChart = dynamic(() => import("../../../../../../lib/echart/line"), {
  ssr: false,
});

const LinkTd = ({ children, asset, extraCss, ...props }: LinkTdProps) => {
  const pathname = usePathname();
  const basePath = pathname?.split("?")[0];

  return (
    <td
      className={`${tdStyle} ${extraCss} border-t-0 mt-0 py-0  md:px-[5px]`}
      {...props}
    >
      {/* href={asset ? `${basePath}/${getUrlFromName(asset?.name)}` : "/"} */}
      {/*  <Link> */}
      {children}
    </td>
  );
};

export const TbodyCryptocurrencies = ({
  asset,
  showTokenInfo,
  setShowTokenInfo,
  tokenInfo,
}: TbodyCryptocurrenciesProps) => {
  const {
    setShowAddTransaction,
    isMobile,
    activePortfolio,
    editAssetManager,
    tokenTsx,
    setTokenTsx,
    manager,
    setAsset,
    setActivePortfolio,
    wallet,
  } = useContext(PortfolioV2Context);
  const { setShowBuyDrawer, showBuyDrawer } = useContext(SettingsMetricContext);
  const { handleAddWatchlist, inWatchlist } = useWatchlist(asset.id);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isHover, setIsHover] = useState<number | null>(null);
  const [tokenTimeframe, setTokenTimeframe] = useState("24H");
  const [changeColor, setChangeColor] = useState(
    "text-light-font-100 dark:text-dark-font-100"
  );

  const {
    setShowAddedToWatchlist,
    setShowMenuTableMobileForToken,
    setShowMenuTableMobile,
    setShowAlert,
  } = useContext(PopupUpdateContext);

  const [showCustomMenu, setShowCustomMenu] = useState(false);

  const { showMenuTableMobileForToken } = useContext(PopupStateContext);

  const refreshPortfolio = useWebSocketResp();

  const { address } = useAccount();

  useEffect(() => {
    if (!asset) return;

    if (asset.estimated_balance_change === true) {
      setChangeColor("text-green dark:text-green");

      setTimeout(() => {
        setChangeColor("text-light-font-100 dark:text-dark-font-100");
      }, 1000);
    } else if (asset.estimated_balance_change === false) {
      setChangeColor("text-red dark:text-red");

      setTimeout(() => {
        setChangeColor("text-light-font-100 dark:text-dark-font-100");
      }, 1000);
    }
  }, [asset]);

  useEffect(() => {
    setIsInWatchlist(inWatchlist);
  }, [inWatchlist]);

  const newWallet = wallet?.portfolio.filter(
    (entry) => entry.name === asset?.name
  )[0];

  const getPercentageOfBuyRange = () => {
    if (newWallet) {
      const minPriceBought = newWallet?.min_buy_price;
      const maxPriceBought = newWallet?.max_buy_price;
      const priceBought = newWallet?.price_bought;

      const priceRange = maxPriceBought - Number(minPriceBought);
      const priceDifference = priceBought - Number(minPriceBought);

      const result = (priceDifference * 100) / priceRange;
      return getFormattedAmount(result);
    }
    return 0;
  };

  const triggerTokenInfo = () => {
    if (showTokenInfo === asset?.id) {
      setAsset(null);
      setShowTokenInfo(null);
    } else if (showTokenInfo && showTokenInfo !== asset?.id) {
      setAsset(asset);
      setShowTokenInfo(asset?.id);
    } else {
      setAsset(asset);
      setShowTokenInfo(asset?.id);
    }
  };

  const hideAsset = () => {
    pushData("Asset Removed");
    const newPortfolio = {
      ...activePortfolio,
      removed_assets: [...activePortfolio.removed_assets, asset.id],
    };
    setActivePortfolio(newPortfolio);
    refreshPortfolio(newPortfolio);
    GET("/portfolio/edit", {
      account: address as string,
      removed_assets: [...activePortfolio.removed_assets, asset.id].join(","),
      removed_transactions: activePortfolio.removed_transactions.join(","),
      wallets: activePortfolio.wallets.join(","),
      id: activePortfolio.id,
      name: activePortfolio.name,
      reprocess: true,
      public: activePortfolio.public,
    });
  };

  return (
    <>
      <tr className="cursor-pointer relative">
        {isMobile && (
          <td className={`${tdStyle} w-fit `}>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowCustomMenu(!showCustomMenu);
                }}
              >
                <BsThreeDotsVertical className="text-light-font-100 dark:text-dark-font-100" />
              </button>
            </div>
          </td>
        )}
        {showCustomMenu && (
          <>
            <div
              className="flex fixed w-screen h-screen left-[50%] z-[12] -translate-x-1/2 top-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowCustomMenu(!showCustomMenu)}
            />
            <div
              className="flex flex-col fixed bottom-0 w-screen bg-light-bg-secondary dark:bg-dark-bg-secondary border-t-2
           border-light-border-primary dark:border-dark-border-primary z-[13] left-0 transition-all duration-200"
            >
              <div
                className="flex p-[15px] transition-all duration-200 border-b border-light-border-primary
             dark:border-dark-border-primary hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover"
                onClick={() => setShowBuyDrawer(asset)}
              >
                <div
                  className={`${flexGreyBoxStyle} ${
                    isHover === 2
                      ? "bg-blue dark:bg-blue"
                      : "bg-light-bg-hover dark:bg-dark-bg-hover"
                  }`}
                >
                  <VscArrowSwap className="text-light-font-100 dark:text-dark-font-100" />{" "}
                </div>
                Swap
              </div>
              <div
                className="flex p-[15px] transition-all duration-200 border-b border-light-border-primary
           dark:border-dark-border-primary hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover"
                onClick={hideAsset}
              >
                <div
                  className={`${flexGreyBoxStyle} ${
                    isHover === 0
                      ? "bg-blue dark:bg-blue"
                      : "bg-light-bg-hover dark:bg-dark-bg-hover"
                  }`}
                >
                  <BiHide className="text-light-font-100 dark:text-dark-font-100" />
                </div>
                Hide asset
              </div>
              <div
                className="flex p-[15px] transition-all duration-200 border-b border-light-border-primary
             dark:border-dark-border-primary hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover"
                onClick={() => {
                  setTokenTsx(asset);
                  setShowAddTransaction(true);
                  pushData("Add Asset Button Clicked");
                }}
              >
                <div
                  className={`${flexGreyBoxStyle} ${
                    isHover === 2
                      ? "bg-blue dark:bg-blue"
                      : "bg-light-bg-hover dark:bg-dark-bg-hover"
                  }`}
                >
                  <IoMdAddCircleOutline className="text-light-font-100 dark:text-dark-font-100" />
                </div>
                Add transactions
              </div>
            </div>
          </>
        )}
        <LinkTd
          extraCss={`sticky top-0 left-[-1px] ${isMobile ? "pl-0" : ""} ${
            showTokenInfo === asset?.id ? "h-[400px] md:h-[600px]" : "pb-[15px]"
          } transition-all duration-300 ease-in-out`}
          asset={asset}
          onClick={triggerTokenInfo}
        >
          <div className="flex items-center min-w-[130px]">
            <NextImageFallback
              height={28}
              width={28}
              className="rounded-full min-w-[28px]"
              src={asset.image}
              alt={`${asset.name} logo`}
              fallbackSrc={""}
            />
            <div className="flex flex-col overflow-x-hidden truncate ml-2.5 lg:ml-[7.5px] font-normal text-sm lg:text-[13px] md:text-xs">
              <SmallFont extraCss="text-light-font-100 dark:text-dark-font-100 font-normal text-sm md:text-[13px]">
                {asset.symbol}
              </SmallFont>
              <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 font-normal text-sm md:text-[13px] max-w-[130px] truncate md:max-w-[77px]">
                {asset?.name}
              </SmallFont>
            </div>
          </div>
        </LinkTd>
        <LinkTd
          extraCss={` transition-all duration-300 ease-in-out`}
          asset={asset}
          onClick={triggerTokenInfo}
        >
          <div className="flex flex-col items-end w-full">
            {manager.privacy_mode ? (
              <Privacy extraCss="justify-end" />
            ) : (
              <SmallFont extraCss={`font-normal text-end ${changeColor}`}>
                ${getFormattedAmount(asset.estimated_balance)}
              </SmallFont>
            )}
            {manager.privacy_mode ? (
              <Privacy extraCss="justify-end" />
            ) : (
              <SmallFont extraCss="font-normal text-light-font-40 dark:text-dark-font-40 text-end">
                {`${getFormattedAmount(asset.token_balance)} ${asset.symbol}`}
              </SmallFont>
            )}
          </div>
        </LinkTd>
        {isMobile ? null : (
          <LinkTd
            asset={asset}
            extraCss={` transition-all duration-300 ease-in-out`}
            onClick={triggerTokenInfo}
          >
            <div className="flex flex-col items-end w-full">
              <SmallFont extraCss={`font-normal text-end ${changeColor}`}>
                ${getFormattedAmount(asset.price)}
              </SmallFont>
              <SmallFont
                extraCss={`font-normal text-end ${
                  Number(getTokenPercentage(asset.change_24h)) > 0
                    ? "text-green dark:text-green"
                    : "text-red dark:text-red"
                }`}
              >
                {getTokenPercentage(asset.change_24h)}%
              </SmallFont>
            </div>
          </LinkTd>
        )}
        <LinkTd
          asset={asset}
          extraCss={`transition-all duration-300 ease-in-out `}
          onClick={triggerTokenInfo}
        >
          {manager.privacy_mode ? (
            <Privacy extraCss="justify-end" />
          ) : (
            <div className="flex items-center justify-end">
              {isMobile ? null : (
                <TbTriangleFilled
                  className={`font-normal text-[10px] mr-1.5 text-end ${
                    Number(
                      getAmountLoseOrWin(
                        asset.change_24h,
                        asset.estimated_balance
                      )
                    ) > 0
                      ? "text-green dark:text-green"
                      : "text-red dark:text-red rotate-180"
                  }`}
                />
              )}
              <SmallFont
                extraCss={`font-normal text-end ${
                  Number(
                    getAmountLoseOrWin(
                      asset.change_24h,
                      asset.estimated_balance
                    )
                  ) > 0
                    ? "text-green dark:text-green"
                    : "text-red dark:text-red"
                }`}
              >
                {getFormattedAmount(
                  getAmountLoseOrWin(asset.change_24h, asset.estimated_balance)
                )}
                $
              </SmallFont>
            </div>
          )}
        </LinkTd>
        {isMobile ? null : (
          <LinkTd
            asset={asset}
            extraCss={` transition-all duration-300 ease-in-out`}
            onClick={triggerTokenInfo}
          >
            {manager.privacy_mode ? (
              <Privacy extraCss="justify-end" />
            ) : (
              <SmallFont
                extraCss={`font-normal text-end ${
                  Number(getTokenPercentage(asset.realized_usd)) > 0
                    ? "text-green dark:text-green"
                    : "text-red dark:text-red"
                }`}
              >
                {getFormattedAmount(asset.realized_usd)}$
              </SmallFont>
            )}
          </LinkTd>
        )}
        {isMobile ? null : (
          <LinkTd
            asset={asset}
            extraCss={`transition-all duration-300 ease-in-out`}
            onClick={triggerTokenInfo}
          >
            {manager.privacy_mode ? (
              <Privacy extraCss="justify-end" />
            ) : (
              <SmallFont
                extraCss={`font-normal text-end ${
                  Number(getTokenPercentage(asset.unrealized_usd)) > 0
                    ? "text-green dark:text-green"
                    : "text-red dark:text-red"
                }`}
              >
                {getFormattedAmount(asset.unrealized_usd)}$
              </SmallFont>
            )}
          </LinkTd>
        )}
        {!isMobile && (
          <td
            className={`${tdStyle}  border-r border-b border-t border-light-border-primary dark:border-dark-border-primary rounded-r-2xl transition-all duration-300 ease-in-out`}
            // onClick={triggerTokenInfo}
          >
            <div className="flex justify-end items-start">
              <button onClick={() => setShowBuyDrawer(asset)}>
                <VscArrowSwap className="text-light-font-100 dark:text-dark-font-100" />
              </button>
              <Menu
                titleCss="ml-2.5"
                title={
                  <BsThreeDotsVertical className="text-light-font-100 dark:text-dark-font-100" />
                }
              >
                <div>
                  <div
                    className="flex items-center bg-light-bg-secondary dark:bg-dark-bg-secondary text-sm lg:text-[13px] md:text-xs whitespace-nowrap mb-2.5"
                    onMouseEnter={() => setIsHover(0)}
                    onMouseLeave={() => setIsHover(null)}
                    onClick={hideAsset}
                  >
                    <div
                      className={`${flexGreyBoxStyle} ${
                        isHover === 0
                          ? "bg-blue dark:bg-blue text-dark-font-100 dark:text-dark-font-100"
                          : "bg-light-bg-hover dark:bg-dark-bg-hover text-light-font-100 dark:text-dark-font-100"
                      }`}
                    >
                      <BiHide />
                    </div>
                    Hide asset
                  </div>
                  <div
                    onMouseEnter={() => setIsHover(2)}
                    onMouseLeave={() => setIsHover(null)}
                    className="flex items-center bg-light-bg-secondary dark:bg-dark-bg-secondary text-sm lg:text-[13px] md:text-xs whitespace-nowrap"
                    onClick={() => {
                      setTokenTsx(asset);
                      setShowAddTransaction(true);
                      pushData("Add Asset Button Clicked");
                    }}
                  >
                    <div
                      className={`${flexGreyBoxStyle} ${
                        isHover === 2
                          ? "bg-blue dark:bg-blue text-dark-font-100 dark:text-dark-font-100"
                          : "bg-light-bg-hover dark:bg-dark-bg-hover text-light-font-100 dark:text-dark-font-100"
                      }`}
                    >
                      <IoMdAddCircleOutline />
                    </div>
                    Add transactions
                  </div>
                </div>
              </Menu>
            </div>
          </td>
        )}
        {showTokenInfo === asset.id ? (
          <div className="absolute left-0 w-full bottom-0 h-[300px] md:h-[600px] flex pb-4 flex-col transition-all duration-300 ease-in-out">
            <div className="flex w-full items-center"></div>
            <div className="flex md:flex-col">
              <div className="w-[50%] md:w-full px-5 relative ">
                <div className="flex items-center pr-5 pt-5 w-full">
                  <div className="mr-8">
                    <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 font-normal  mb-0.5">
                      Avg Price bought
                    </SmallFont>
                    <SmallFont extraCss="font-normal">
                      {getFormattedAmount(newWallet?.price_bought)}$
                    </SmallFont>
                  </div>
                  <div>
                    <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 font-normal mb-0.5">
                      Total Invested
                    </SmallFont>
                    <SmallFont extraCss="font-normal">
                      {getFormattedAmount(asset?.total_invested)}$
                    </SmallFont>
                  </div>
                </div>
                <div className="flex items-center justify-between absolute top-[80px] md:top-[70px] w-full pr-8 ">
                  <MediumFont>{asset?.symbol} Price History</MediumFont>
                  <div className="flex z-10">
                    <button
                      className={`w-full px-1.5 font-normal ${
                        tokenTimeframe === "24H"
                          ? "text-light-font-100 dark:text-dark-font-100"
                          : "text-light-font-40 dark:text-dark-font-40"
                      } text-sm lg:text-[13px] md:text-xs`}
                      onClick={() => setTokenTimeframe("24H")}
                    >
                      24H
                    </button>
                    <button
                      className={`w-full px-1.5 font-normal ${
                        tokenTimeframe === "7D"
                          ? "text-light-font-100 dark:text-dark-font-100"
                          : "text-light-font-40 dark:text-dark-font-40"
                      } text-sm lg:text-[13px] md:text-xs`}
                      onClick={() => setTokenTimeframe("7D")}
                    >
                      7D
                    </button>
                  </div>
                </div>
                <div className="md:mt-4">
                  <EChart
                    data={tokenInfo?.price_history?.price || []}
                    timeframe={tokenTimeframe as TimeSelected}
                    height="250px"
                    width="100%"
                    leftMargin={["0%", "0%"]}
                    type={tokenInfo?.name}
                    unit="$"
                    noDataZoom
                  />
                </div>
              </div>
              <div className="w-[50%] md:w-full flex flex-col p-2.5 pt-2.5 md:pt-0 md:mt-[-15px]">
                <div className="flex items-center pr-5 pt-0 w-full pb-5">
                  <div className="flex flex-col w-full h-full">
                    <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 font-normal mb-1">
                      Buy Price Range
                    </SmallFont>
                    <div className="w-full h-[5px] rounded-full bg-light-border-primary dark:bg-dark-border-primary">
                      <div
                        className="h-full bg-green dark:bg-green rounded-full"
                        style={{ width: `${getPercentageOfBuyRange()}%` }}
                      />
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs lg:text-[11px] md:text-[10px] font-normal">
                          ${getFormattedAmount(newWallet?.min_buy_price)}
                        </p>
                        <p className="text-xs lg:text-[11px] md:text-[10px] font-normal">
                          ${getFormattedAmount(newWallet?.max_buy_price)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {editAssetManager.transactions ? (
                  <div className="flex flex-col w-full rounded-lg pt-0">
                    <MediumFont extraCss="mt-5">Transactions</MediumFont>
                    <div className="overflow-y-scroll h-[190px] w-full">
                      {asset?.id === tokenInfo?.id &&
                      showTokenInfo === tokenInfo?.id ? (
                        <Activity isSmallTable />
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </tr>
    </>
  );
};
