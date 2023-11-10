import { Collapse, useMediaQuery } from "@chakra-ui/react";
import { default as React, useContext, useState } from "react";
import { Container } from "../../../components/container";
import { MediumFont } from "../../../components/fonts";
import { Spinner } from "../../../components/spinner";
import { SwapProvider } from "../../../layouts/swap";
import { SmallSwapLine } from "../../../layouts/swap/components/small-swap-line";
import { PortfolioChartAsset } from "./components/chart-asset";
import { HeaderAsset } from "./components/header-asset";
import { Holdings } from "./components/holdings";
import { PNLAsset } from "./components/pnl-asset";
import { EditTransactionPopup } from "./components/popup/edit-transaction";
import { ManageAssetPopup } from "./components/popup/manage-asset";
import { ButtonSlider } from "./components/ui/button-slider";
import { ButtonTimeSlider } from "./components/ui/button-time-slider";
import { PortfolioV2Context } from "./context-manager";

export const PortfolioAsset = () => {
  const { manager, editAssetManager, asset, timeframe } =
    useContext(PortfolioV2Context);
  const [typeSelected, setTypeSelected] = useState("Chart");

  const [isSmallerThan1280] = useMediaQuery("(max-width: 1280px)", {
    ssr: true,
    fallback: false, // return false on the server, and re-evaluate on the client side
  });
  const [isLargerThan991] = useMediaQuery("(min-width: 991px)", {
    ssr: true,
    fallback: false, // return false on the server, and re-evaluate on the client side
  });

  const isMultiChain =
    asset?.cross_chain_balances &&
    Object.keys(asset?.cross_chain_balances)?.length > 1;

  return (
    <Container extraCss="mt-[15px]">
      <HeaderAsset />
      <div className="mt-[5px] w-full flex flex-row lg:flex-col">
        <div className="flex-col hidden lg:flex w-full">
          {editAssetManager.token_details ? <PNLAsset /> : null}
          <ButtonSlider
            switcherOptions={["Chart", "Widgets"]}
            typeSelected={typeSelected}
            setTypeSelected={setTypeSelected}
            mt="10px"
            mb="0px"
          />
          <Collapse startingHeight={0} in={typeSelected === "Widgets"}>
            <ButtonTimeSlider mt="10px" />
            {editAssetManager.holdings && isMultiChain ? (
              <Holdings asset chartId="holdings-asset-mobile" />
            ) : null}
            {timeframe !== "ALL" ? (
              <>
                {" "}
                {/* {manager.daily_pnl ? (
                  <DailyPnl chartId="asset-daily-pnl-mobile" wallet={asset} />
                ) : null} */}
                {/* {manager.cumulative_pnl ? (
                  <CumulativePnl chartId="asset-cumulative-pnl-mobile" />
                ) : null} */}
              </>
            ) : null}
          </Collapse>
        </div>
        <div className="flex flex-col max-w-[320px] lg:max-w-full w-auto lg:w-full">
          <div className="flex lg:hidden flex-col max-w-full w-fit">
            {editAssetManager.token_details ? <PNLAsset /> : null}
            {asset && (
              <div className="mt-2.5">
                <SwapProvider
                  tokenOutBuffer={{
                    ...asset,
                    blockchain: asset?.blockchains?.[0],
                    address:
                      asset && "contracts" in asset
                        ? asset.contracts[0]
                        : undefined,
                    logo: asset?.image || asset?.logo,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    name: asset?.name || asset?.symbol,
                  }}
                  lockToken={["out"]}
                >
                  <SmallSwapLine asset={asset} mb="0px" />
                </SwapProvider>
              </div>
            )}
            {editAssetManager.holdings && isMultiChain ? (
              <Holdings asset chartId="holdings-asset" />
            ) : null}

            {timeframe !== "ALL" ? (
              <>
                {/* {manager.daily_pnl ? (
                  <DailyPnl chartId="asset-daily-pnl" wallet={asset} />
                ) : null} */}
                {/* {manager.cumulative_pnl ? (
                  <CumulativePnl chartId="asset-cumulative-pnl" />
                ) : null} */}
              </>
            ) : null}
          </div>
        </div>
        <div className="ml-5 lg:ml-0 max-w-[860px] min-h-[486px] w-calc-full-320 lg:w-full flex flex-col">
          {editAssetManager.buy_sell_chart && asset ? (
            <Collapse
              startingHeight={isSmallerThan1280 ? 0 : 486}
              in={typeSelected === "Chart"}
            >
              <div
                className={`flex mt-0 min-h-[486px] lg:min-h-auto w-full ${
                  isSmallerThan1280 && isLargerThan991 ? "flex-col" : "flex-row"
                } lg:flex-col`}
              >
                <PortfolioChartAsset />
              </div>
            </Collapse>
          ) : (
            <div className="flex max-w-[860px] min-h-[486px] w-full ml-5 lg:ml-0 h-[486px] items-center justify-center">
              <Spinner extraCss="h-[60px] w-[60px] min-w-[60px] text-blue" />
            </div>
          )}
          {editAssetManager.transactions ? (
            <div className="flex flex-col w-full">
              <MediumFont extraCss="mt-5">
                {asset?.symbol} Transactions
              </MediumFont>
              {/* <Activity /> */}
            </div>
          ) : null}
        </div>
      </div>
      <ManageAssetPopup />
      <EditTransactionPopup />
    </Container>
  );
};
