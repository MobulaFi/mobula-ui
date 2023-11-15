import { Asset } from "interfaces/assets";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import { VscArrowSwap } from "react-icons/vsc";
import { useAccount } from "wagmi";
import {
  MediumFont,
  SmallFont,
  TextSmall,
} from "../../../../../../components/fonts";
import { Menu } from "../../../../../../components/menu";
import {
  PopupStateContext,
  PopupUpdateContext,
} from "../../../../../../contexts/popup";
import { SettingsMetricContext } from "../../../../../../contexts/settings";
import { useWatchlist } from "../../../../../../layouts/tables/hooks/watchlist";
import { useColors } from "../../../../../../lib/chakra/colorMode";
import { pushData } from "../../../../../../lib/mixpanel";
import { createSupabaseDOClient } from "../../../../../../lib/supabase";
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
}

const EChart = dynamic(() => import("../../../../../../lib/echart/line"), {
  ssr: false,
});

const LinkTd = ({ children, asset, extraCss }: LinkTdProps) => {
  const pathname = usePathname();
  const basePath = pathname?.split("?")[0];

  return (
    <td
      className={`${tdStyle} ${extraCss} border-b border-t border-light-border-primary dark:border-dark-border-primary`}
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
  const { setShowBuyDrawer } = useContext(SettingsMetricContext);
  const { handleAddWatchlist, inWatchlist } = useWatchlist(asset.id);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isHover, setIsHover] = useState(null);
  const router = useRouter();
  const {
    text40,
    text80,
    boxBg1,
    borders,
    hover,
    bg,
    boxBg3,
    text60,
    borders2x,
  } = useColors();
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

  console.log("Coucou c'est moi l'asset:", asset);

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

  const [token, setToken] = useState();

  useEffect(() => {
    if (showTokenInfo !== asset?.id) return;
    const supabase = createSupabaseDOClient();
    supabase
      .from("assets")
      .select("name, id, symbol, price_history")
      .eq("id", asset?.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.log(error);
          return;
        }
        setToken(data);
      });
  }, [asset, showTokenInfo]);

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

  return (
    <>
      <tr
        className="cursor-pointer relative bg-light-bg-secondary dark:bg-dark-bg-secondary hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover transition-all duration-250"
        onClick={() => {
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
        }}
      >
        {isMobile && (
          <td
            className={`${tdStyle} border-b border-light-border-primary dark:border-dark-border-primary`}
          >
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
              className="flex fixed w-screen h-screen left-[50%] z-[12] -translate-x-1/2 top-0 bg-light-font-40 dark:bg-dark-font-40"
              onClick={() => setShowCustomMenu(!showCustomMenu)}
            />
            <div
              className="flex flex-col fixed bottom-0 w-screen bg-light-bg-secondary dark:bg-dark-bg-secondary border-t-2
           border-light-border-primary dark:border-dark-border-primary z-[13] left-0 transition-all duration-250"
            >
              <div
                className="flex p-[15px] transition-all duration-250 border-b border-light-border-primary
             dark:border-dark-border-primary hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover"
                onClick={() => setShowBuyDrawer(asset as any)}
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
                className="flex p-[15px] transition-all duration-250 border-b border-light-border-primary
           dark:border-dark-border-primary hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover"
                onClick={() => setTokenTsx(asset)}
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
                className="flex p-[15px] transition-all duration-250 border-b border-light-border-primary
                dark:border-dark-border-primary hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover"
                // onClick={() => {
                //   router.push(
                //     `${pathname.split("?")[0]}/${getUrlFromName(asset.name)}`
                //   );
                // }}
              >
                <div
                  className={`${flexGreyBoxStyle} ${
                    isHover === 1
                      ? "bg-blue dark:bg-blue"
                      : "bg-light-bg-hover dark:bg-dark-bg-hover"
                  }`}
                >
                  <BiShow className="text-light-font-100 dark:text-dark-font-100" />
                </div>
                See transactions
              </div>

              <div
                className="flex p-[15px] transition-all duration-250 border-b border-light-border-primary
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
          extraCss={`sticky top-0 left-[-1px] border-l border-light-border-primary dark:border-dark-border-primary rounded-l-2xl ${
            showTokenInfo === asset?.id ? "pb-[300px]" : "pb-[15px]"
          }`}
          asset={asset}
        >
          <div className="flex items-center min-w-[130px]">
            <img
              className="rounded-full w-[28px] h-[28px] min-w-[28px]"
              src={asset.image}
              alt={`${asset.name} logo`}
            />
            <div className="flex flex-col overflow-x-hidden truncate ml-2.5 lg:ml-[7.5px] font-medium text-sm lg:text-[13px] md:text-xs">
              <SmallFont extraCss="text-light-font-100 dark:text-dark-font-100 font-medium text-sm md:text-[13px]">
                {asset.symbol}
              </SmallFont>
              <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 font-medium text-sm md:text-[13px] max-w-[130px] truncate">
                {asset?.name}
              </SmallFont>
            </div>
          </div>
        </LinkTd>
        <LinkTd
          extraCss={`${
            showTokenInfo === asset?.id ? "pb-[300px]" : "pb-[15px]"
          }`}
          asset={asset}
        >
          <div className="flex flex-col items-end w-full">
            {manager.privacy_mode ? (
              <Privacy extraCss="justify-end" />
            ) : (
              <TextSmall fontWeight="500" textAlign="end" color={changeColor}>
                ${getFormattedAmount(asset.estimated_balance)}
              </TextSmall>
            )}
            {manager.privacy_mode ? (
              <Privacy extraCss="justify-end" />
            ) : (
              <SmallFont extraCss="font-medium text-light-font-40 dark:text-dark-font-40 text-end">
                {`${getFormattedAmount(asset.token_balance)} ${asset.symbol}`}
              </SmallFont>
            )}
          </div>
        </LinkTd>
        <LinkTd
          asset={asset}
          extraCss={`${
            showTokenInfo === asset?.id ? "pb-[300px]" : "pb-[15px]"
          }`}
        >
          <div className="flex flex-col items-end w-full">
            <SmallFont extraCss={`font-medium text-end ${changeColor}`}>
              ${getFormattedAmount(asset.price)}
            </SmallFont>
            <SmallFont
              extraCss={`font-medium text-end ${
                Number(getTokenPercentage(asset.change_24h)) > 0
                  ? "text-green dark:text-green"
                  : "text-red dark:text-red"
              }`}
            >
              {getTokenPercentage(asset.change_24h)}%
            </SmallFont>
          </div>
        </LinkTd>
        <LinkTd
          asset={asset}
          extraCss={`${
            showTokenInfo === asset?.id ? "pb-[300px]" : "pb-[15px]"
          }`}
        >
          {manager.privacy_mode ? (
            <Privacy extraCss="justify-end" />
          ) : (
            <SmallFont
              extraCss={`font-medium text-end ${
                Number(
                  getAmountLoseOrWin(asset.change_24h, asset.estimated_balance)
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
          )}
        </LinkTd>
        <LinkTd
          asset={asset}
          extraCss={`${
            showTokenInfo === asset?.id ? "pb-[300px]" : "pb-[15px]"
          }`}
        >
          {manager.privacy_mode ? (
            <Privacy extraCss="justify-end" />
          ) : (
            <SmallFont
              extraCss={`font-medium text-end ${
                Number(getTokenPercentage(asset.realized_usd)) > 0
                  ? "text-green dark:text-green"
                  : "text-red dark:text-red"
              }`}
            >
              {getFormattedAmount(asset.realized_usd)}$
            </SmallFont>
          )}
        </LinkTd>
        <LinkTd
          asset={asset}
          extraCss={`${
            showTokenInfo === asset?.id ? "pb-[300px]" : "pb-[15px]"
          }`}
        >
          {manager.privacy_mode ? (
            <Privacy extraCss="justify-end" />
          ) : (
            <SmallFont
              extraCss={`font-medium text-end ${
                Number(getTokenPercentage(asset.unrealized_usd)) > 0
                  ? "text-green dark:text-green"
                  : "text-red dark:text-red"
              }`}
            >
              {getFormattedAmount(asset.unrealized_usd)}$
            </SmallFont>
          )}
        </LinkTd>
        {!isMobile && (
          <td
            className={`${tdStyle} ${
              showTokenInfo === asset?.id ? "pb-[300px]" : "pb-[15px]"
            } border-r border-b border-t border-light-border-primary dark:border-dark-border-primary rounded-r-2xl`}
          >
            <div className="flex justify-end items-start">
              <button onClick={() => setShowBuyDrawer(asset as any)}>
                <VscArrowSwap className="text-light-font-100 dark:text-dark-font-100" />
              </button>
              <Menu
                titleCss="ml-2.5"
                title={
                  <BsThreeDotsVertical className="text-light-font-100 dark:text-dark-font-100" />
                }
              >
                <div
                  onClick={() => {
                    pushData("Asset Removed");
                    const newPortfolio = {
                      ...activePortfolio,
                      removed_assets: [
                        ...activePortfolio.removed_assets,
                        asset.id,
                      ],
                    };
                    setActivePortfolio(newPortfolio);
                    refreshPortfolio(newPortfolio);

                    GET("/portfolio/edit", {
                      account: address as string,
                      removed_assets: [
                        ...activePortfolio.removed_assets,
                        asset.id,
                      ].join(","),
                      removed_transactions:
                        activePortfolio.removed_transactions.join(","),
                      wallets: activePortfolio.wallets.join(","),
                      id: activePortfolio.id,
                      name: activePortfolio.name,
                      reprocess: true,
                      public: activePortfolio.public,
                    });
                  }}
                >
                  <div
                    className="flex items-center bg-light-bg-secondary dark:bg-dark-bg-secondary text-sm lg:text-[13px] md:text-xs whitespace-nowrap mb-2.5"
                    onMouseEnter={() => setIsHover(0)}
                    onMouseLeave={() => setIsHover(null)}
                    onClick={() => setTokenTsx(asset)}
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
                    className={`flex items-center bg-light-bg-secondary dark:bg-dark-bg-secondary text-sm lg:text-[13px] md:text-xs whitespace-nowrap ${
                      manager.privacy_mode
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    } mb-2.5`}
                    onMouseEnter={() => setIsHover(1)}
                    onMouseLeave={() => setIsHover(null)}
                    // onClick={() => {
                    //   if (manager.privacy_mode) return;
                    //   router.push(
                    //     `${pathname?.split("?")[0]}/${getUrlFromName(asset.name)}`
                    //   );
                    // }}
                  >
                    <div
                      className={`${flexGreyBoxStyle} ${
                        isHover === 1
                          ? "bg-blue dark:bg-blue text-dark-font-100 dark:text-dark-font-100"
                          : "bg-light-bg-hover dark:bg-dark-bg-hover text-light-font-100 dark:text-dark-font-100"
                      }`}
                    >
                      <BiShow />
                    </div>
                    See transactions
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
          <div className="absolute left-0 w-full bottom-0 h-[300px] flex pb-4 flex-col">
            <div className="flex w-full items-center">
              <div className="flex items-center px-5 pt-5 w-2/4">
                <div className="mr-8">
                  <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 font-medium">
                    Avg Price bought
                  </SmallFont>
                  <SmallFont extraCss="font-medium">
                    {getFormattedAmount(newWallet?.price_bought)}$
                  </SmallFont>
                </div>
                <div>
                  <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 font-medium">
                    Total Invested
                  </SmallFont>
                  <SmallFont extraCss="font-medium">
                    {getFormattedAmount(asset?.total_invested)}$
                  </SmallFont>
                </div>
              </div>
              <div className="flex items-center pl-2.5 pr-5 pt-0 w-2/4">
                <div className="flex flex-col w-full h-full">
                  <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 font-medium mb-1">
                    Buy Price Range
                  </SmallFont>
                  <div className="w-full h-[5px] rounded-full bg-light-border-primary dark:bg-dark-border-primary">
                    <div
                      className="h-full bg-green dark:bg-green rounded-full"
                      style={{ width: `${getPercentageOfBuyRange()}%` }}
                    />
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs lg:text-[11px] md:text-[10px] font-medium">
                        ${getFormattedAmount(newWallet?.min_buy_price)}
                      </p>
                      <p className="text-xs lg:text-[11px] md:text-[10px] font-medium">
                        ${getFormattedAmount(newWallet?.max_buy_price)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="w-[50%] px-5">
                <EChart
                  data={tokenInfo?.price_history?.price || []}
                  timeframe="ALL"
                  height="250px"
                  width="100%"
                  leftMargin={["0%", "0%"]}
                  type={tokenInfo?.name}
                  unit="$"
                  noDataZoom
                />
              </div>
              <div className="w-[50%] flex flex-col p-2.5 pt-0">
                {editAssetManager.transactions ? (
                  <div className="flex flex-col w-full rounded-lg pt-0">
                    <MediumFont extraCss="mt-5">Transactions</MediumFont>
                    <div className="overflow-y-scroll h-[190px] w-full">
                      <Activity isSmallTable />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </tr>
      <tr className="h-[10px]"></tr>
    </>
  );
};
