import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import { VscArrowSwap } from "react-icons/vsc";
import { useAccount } from "wagmi";
import { SmallFont, TextSmall } from "../../../../../../components/fonts";
import { Menu } from "../../../../../../components/menu";
import {
  PopupStateContext,
  PopupUpdateContext,
} from "../../../../../../contexts/popup";
import { SettingsMetricContext } from "../../../../../../contexts/settings";
import { useWatchlist } from "../../../../../../layouts/tables/hooks/watchlist";
import { useColors } from "../../../../../../lib/chakra/colorMode";
import { pushData } from "../../../../../../lib/mixpanel";
import { GET } from "../../../../../../utils/fetch";
import {
  getFormattedAmount,
  getTokenPercentage,
  getUrlFromName,
} from "../../../../../../utils/formaters";
import { PortfolioV2Context } from "../../../context-manager";
import { useWebSocketResp } from "../../../hooks";
import { UserHoldingsAsset } from "../../../models";
import { flexGreyBoxStyle, tdStyle } from "../../../style";
import { getAmountLoseOrWin } from "../../../utils";
import { Privacy } from "../privacy";

interface TbodyCryptocurrenciesProps {
  asset: UserHoldingsAsset;
}

interface LinkTdProps {
  children: React.ReactNode;
  asset: UserHoldingsAsset;
  extraCss?: string;
}

const LinkTd = ({ children, asset, extraCss }: LinkTdProps) => {
  const pathname = usePathname();
  const basePath = pathname?.split("?")[0];

  return (
    <td className={`${tdStyle} ${extraCss}`}>
      <Link href={asset ? `${basePath}/${getUrlFromName(asset?.name)}` : "/"}>
        {children}
      </Link>
    </td>
  );
};

export const TbodyCryptocurrencies = ({
  asset,
}: TbodyCryptocurrenciesProps) => {
  const {
    setShowAddTransaction,
    isMobile,
    activePortfolio,
    tokenTsx,
    setTokenTsx,
    manager,
    setActivePortfolio,
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

  return (
    <tr className="cursor-pointer">
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
              onClick={() => {
                router.push(
                  `${pathname.split("?")[0]}/${getUrlFromName(asset.name)}`
                );
              }}
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
        extraCss="sticky top-0 left-[-1px] border-b border-light-border-primary dark:border-dark-border-primary bg-light-bg-primary dark:bg-dark-bg-primary"
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
        extraCss="border-b border-light-border-primary dark:border-dark-border-primary"
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
        extraCss="border-b border-light-border-primary dark:border-dark-border-primary"
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
        extraCss="border-b border-light-border-primary dark:border-dark-border-primary"
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
        extraCss="border-b border-light-border-primary dark:border-dark-border-primary"
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
        extraCss="border-b border-light-border-primary dark:border-dark-border-primary"
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
          className={`${tdStyle} border-b border-light-border-primary dark:border-dark-border-primary`}
        >
          <div className="flex justify-end">
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
                  className="flex items-center bg-light-bg-terciary dark:bg-dark-bg-terciary text-sm lg:text-[13px] md:text-xs whitespace-nowrap mb-2.5"
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
                  className={`flex items-center bg-light-bg-terciary dark:bg-dark-bg-terciary text-sm lg:text-[13px] md:text-xs whitespace-nowrap ${
                    manager.privacy_mode
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  } mb-2.5`}
                  onMouseEnter={() => setIsHover(1)}
                  onMouseLeave={() => setIsHover(null)}
                  onClick={() => {
                    if (manager.privacy_mode) return;
                    router.push(
                      `${pathname?.split("?")[0]}/${getUrlFromName(asset.name)}`
                    );
                  }}
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
                  className="flex items-center bg-light-bg-terciary dark:bg-dark-bg-terciary text-sm lg:text-[13px] md:text-xs whitespace-nowrap"
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
    </tr>
  );
};
