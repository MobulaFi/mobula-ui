import {Flex, useColorMode, useMediaQuery} from "@chakra-ui/react";
import {useContext, useEffect} from "react";
import {ChartHeader} from "./charts/header";
import {ChartLite} from "./charts/linear";
import ChartBox from "./charts/trading-view";
import {Description} from "./description";
import {PriceData} from "./price-data";
// eslint-disable-next-line import/no-cycle
import {SwapProvider} from "../../../../../../common/providers/swap";
import {AssetPro} from "../../../../../../common/providers/swap/components/second-swap";
import {useColors} from "../../../../../../common/utils/color-mode";
import {BaseAssetContext} from "../../../context-manager";
import {CoreActor} from "./core-actor";
import {ListingDetails} from "./listing-details";
import {PresaleDetails} from "./presale-details";
import {SimilarAsset} from "./similar-asset";
import {Socials} from "./socials";
import {TimeSwitcher} from "./time-switcher";
import {TokenMetrics} from "./token-metrics";
import {TokenTrades} from "./trades";

export const Essentials = ({marketMetrics}) => {
  const {
    historyData,
    baseAsset,
    activeChart,
    setShowMobileMetric,
    setActiveMetric,
    untracked,
  } = useContext(BaseAssetContext);
  const [isDesktop] = useMediaQuery("(min-width: 768px)", {
    ssr: true,
    fallback: false,
  });

  const {bgMain} = useColors();
  const {colorMode} = useColorMode();
  const hasBeenListed =
    (baseAsset?.trust_score || 0) +
      (baseAsset?.social_score || 0) +
      (baseAsset?.utility || 0) >
    0;

  useEffect(() => {
    setShowMobileMetric(true);
    setActiveMetric("Metrics");
  }, []);

  const isOffChain = !baseAsset?.blockchains?.length || !baseAsset?.tracked;

  return (
    <>
      <Flex
        mt={["0px", "0px", "0px", "20px"]}
        direction={[
          "column-reverse",
          "column-reverse",
          "column-reverse",
          "row",
        ]}
      >
        <Flex
          direction="column"
          maxW="990px"
          w={["100%", "100%", "100%", "calc(100% - 345px)"]}
          mr={["0px", "0px", "0px", "25px"]}
        >
          {untracked.isUntracked ? null : <ChartHeader />}
          {untracked.isUntracked ? null : (
            <TimeSwitcher display={["flex", "flex", "none", "none"]} />
          )}
          {activeChart === "Trading view" && colorMode !== undefined ? (
            <ChartBox
              baseAsset={baseAsset}
              historyData={historyData}
              marketMetrics={marketMetrics}
              background={bgMain}
              minH={["320px", "320px", "370px", "500px"]}
              h={["370px", "370px", "420px", "520px"]}
              w={["95%", "95%", "100%", "100%"]}
              mx="auto"
            />
          ) : (
            <ChartLite
              minH={["250px", "300px", "350px", "480px"]}
              h={["350px", "350px", "400px", "480px"]}
              w={["95%", "95%", "100%", "100%"]}
              mx="auto"
            />
          )}
          {!untracked.isUntracked ? (
            <TokenMetrics
              isMobile
              display={["flex", "flex", "flex", "none"]}
              mt="15px"
            />
          ) : null}
          {untracked.isUntracked || isOffChain ? null : <TokenTrades />}
          {/* {!untracked.isUntracked ? (
            <Flex w="100%" display={["flex", "flex", "none", "none"]}>
              <HoldingRoi
                chartId="holdings-chart-mobile"
                display={["flex", "flex", "none", "none"]}
              />{" "}
            </Flex>
          ) : null} */}

          <Description />
          <Socials />
          {!untracked.isUntracked ? <PriceData /> : null}

          <CoreActor
            display={[
              baseAsset?.investors?.length > 0 ? "flex" : "none",
              baseAsset?.investors?.length > 0 ? "flex" : "none",
              baseAsset?.investors?.length > 0 ? "flex" : "none",
              "none",
            ]}
          />
        </Flex>

        <Flex
          direction="column"
          maxW={["100%", "100%", "100%", "320px"]}
          w="100%"
          display={["none", "none", "none", "flex"]}
        >
          <Flex>
            {isDesktop && (
              <SwapProvider
                tokenOutBuffer={{
                  ...baseAsset,
                  blockchain: baseAsset?.blockchains[0],
                  address:
                    baseAsset && "contracts" in baseAsset
                      ? baseAsset.contracts[0]
                      : undefined,
                  logo: baseAsset?.image || baseAsset?.logo,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  name: baseAsset?.name || baseAsset?.symbol,
                }}
                lockToken={["out"]}
              >
                {" "}
                <AssetPro asset={baseAsset} />
              </SwapProvider>
            )}
          </Flex>

          {!untracked.isUntracked ? <TokenMetrics /> : null}
          {/* {!untracked.isUntracked ? (
            <HoldingRoi chartId="holdings-chart" />
          ) : null} */}
          <CoreActor
            display={[
              "none",
              "none",
              "none",
              baseAsset?.investors?.length > 0 ? "flex" : "none",
            ]}
          />
          {untracked.isUntracked ? (
            <PresaleDetails display={hasBeenListed ? "flex" : "none"} />
          ) : null}
          {untracked.isUntracked ? (
            <ListingDetails display={hasBeenListed ? "flex" : "none"} />
          ) : null}
          {untracked.isUntracked ? (
            <ListingDetails
              display={[
                hasBeenListed ? "flex" : "none",
                hasBeenListed ? "flex" : "none",
                "none",
                "none",
              ]}
              mt="10px"
            />
          ) : null}
        </Flex>
      </Flex>
      <SimilarAsset />
    </>
  );
};
