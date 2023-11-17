/* eslint-disable react/no-unescaped-entities */
import {InfoOutlineIcon} from "@chakra-ui/icons";
import {Box, Button, Flex, FlexProps, Spinner} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import {useRouter} from "next/router";
import {useContext, useEffect, useState} from "react";
import {TextLandingSmall} from "../../../../../../../UI/Text";
import {UserContext} from "../../../../../../../common/context-manager/user";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {GET} from "../../../../../../../common/utils/fetch";
import {TransactionResponse} from "../../../../../../User/Portfolio/components/category/activity/model";
import {colors} from "../../../../../../User/Portfolio/constants";
import {BaseAssetContext} from "../../../../context-manager";
import {Countdown} from "../../../../models";
import {getInitalCountdown} from "../../../../utils";

const EChart = dynamic(
  () => import("../../../../../../../common/charts/EChart"),
  {
    ssr: false,
  },
);

export const ChartLite = ({
  isBalanceHide = false,
  ...props
}: {
  isBalanceHide?: boolean;
} & FlexProps) => {
  const {
    timeSelected,
    baseAsset,
    unformattedHistoricalData,
    chartType: type,
    hideTx,
    transactions,
    setTransactions,
    comparedEntities,
  } = useContext(BaseAssetContext);
  const {
    text60,
    boxBg6,
    text80,
    boxBg3,
    boxBg1,
    hover,
    borders,
    bordersActive,
  } = useColors();
  const [isTracked, setIsTracked] = useState(false);
  const [countdown, setCountdown] = useState<Countdown | null>(
    getInitalCountdown(baseAsset.launch?.date),
  );

  const {user} = useContext(UserContext);
  const router = useRouter();

  const fetchTransactions = (refresh = false) => {
    if (!user || !baseAsset) return;
    const wallets = [...user.external_wallets, user.address];
    const lowerCaseWallets = wallets.map(newWallet => newWallet?.toLowerCase());
    const txsLimit = router?.query.asset ? 200 : 20;
    const txRequest: any = {
      should_fetch: false,
      limit: txsLimit,
      offset: refresh ? 0 : transactions.length,
      wallets: lowerCaseWallets.join(","),
      portfolio_id: user?.portfolios[0]?.id,
      added_transactions: true,
    };
    if (baseAsset) txRequest.only_assets = baseAsset.id;

    GET(
      `${process.env.NEXT_PUBLIC_PORTFOLIO_ENDPOINT}/portfolio/rawtxs`,
      txRequest,
      true,
    )
      .then(r => r.json())
      .then((r: TransactionResponse) => {
        if (r) {
          if (!refresh)
            setTransactions(oldTsx => [...oldTsx, ...r.data.transactions]);
          else setTransactions(r.data.transactions);
        }
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, [user, baseAsset]);

  useEffect(() => {
    setIsTracked(baseAsset?.tracked);
  }, [baseAsset]);

  useEffect(() => {
    if (baseAsset?.launch?.date) {
      const interval = setInterval(() => {
        setCountdown(getInitalCountdown(baseAsset.launch?.date));
      }, 1000);
      return () => clearInterval(interval);
    }
    return () => {};
  }, []);

  const getDateSinceUntracked = () => {
    if (baseAsset) {
      if (unformattedHistoricalData[type]?.ALL?.length === 0)
        return "a few minutes ago";
      const now = new Date().getTime();
      const lastData =
        unformattedHistoricalData[type]?.ALL?.[
          (unformattedHistoricalData[type]?.ALL?.length || 0) - 1
        ];
      const lastDataTime = new Date(lastData?.[0]).getTime();
      const diff = now - lastDataTime;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      if (days > 0) return `${days} days ago`;
      if (hours > 0) return `${hours} hours ago`;
      return "a few minutes ago";
    }
    return "a few minutes ago";
  };

  const renderChartMessage = () => {
    if (
      unformattedHistoricalData?.[type]?.[timeSelected]?.length === undefined
    ) {
      return <Spinner boxSize="60px" color="var(--chakra-colors-blue)" />;
    }

    // if ( baseAsset?.untrack_reason !== "pre-listing") {
    //   return (
    //     <Flex direction="column" align="center" justify="center">

    //       </Flex>
    //   )
    // }

    if (
      !isTracked &&
      baseAsset &&
      baseAsset?.untrack_reason !== "pre-listing" &&
      unformattedHistoricalData?.[type]?.ALL?.length
    ) {
      return (
        <Flex direction="column" align="center" justify="center">
          <InfoOutlineIcon mb="15px" fontSize="30px" color="red" />
          <TextLandingSmall fontSize={["14px", "14px", "15px", "16px"]}>
            {baseAsset?.name} has been untracked {getDateSinceUntracked()} due
            to low liquidity
          </TextLandingSmall>
          {unformattedHistoricalData?.price?.ALL?.length > 0 && (
            <Button
              mt="15px"
              fontSize={["14px", "14px", "15px", "16px"]}
              color={text60}
              fontWeight="400"
              bg={boxBg6}
              transition="all 250ms ease-in-out"
              h="35px"
              px="12px"
              borderRadius="8px"
              border={borders}
              _hover={{
                border: bordersActive,
                bg: hover,
              }}
              onClick={() => setIsTracked(true)}
            >
              Display old chart
            </Button>
          )}
        </Flex>
      );
    }
    if (!isTracked && baseAsset?.untrack_reason !== "pre-listing")
      return (
        <Flex direction="column" align="center" justify="center">
          <InfoOutlineIcon
            mb="15px"
            fontSize="30px"
            color="yellow"
            transform="rotate(180deg)"
          />
          <TextLandingSmall fontSize={["14px", "14px", "15px", "16px"]}>
            {baseAsset?.name} is untracked as it doesn&apos;t have any on-chain
            liquidity
          </TextLandingSmall>
          <Button
            mt="15px"
            fontSize={["14px", "14px", "15px", "16px"]}
            color={text60}
            fontWeight="400"
            bg={boxBg6}
            transition="all 250ms ease-in-out"
            h="35px"
            px="12px"
            borderRadius="8px"
            border={borders}
            _hover={{
              border: bordersActive,
              bg: hover,
            }}
            onClick={() => setIsTracked(true)}
          >
            Display old chart
          </Button>
        </Flex>
      );

    if (countdown) {
      const currentSale =
        baseAsset?.sales?.[(baseAsset?.sales?.length || 0) - 1];
      return (
        <Flex direction="column" align="center" justify="center">
          <InfoOutlineIcon mb="15px" fontSize="30px" color="red" />
          <TextLandingSmall fontSize={["14px", "14px", "15px", "16px"]}>
            {baseAsset?.name} isn't launched yet.
          </TextLandingSmall>
          <Flex justify="space-around" w="180px" mt="20px">
            <Flex direction="column" align="center">
              <Flex
                bg={boxBg1}
                h="35px"
                w="35px"
                align="center"
                justify="center"
                borderRadius="8px"
                border={borders}
              >
                {countdown.days}
              </Flex>
              <TextLandingSmall>Days</TextLandingSmall>
            </Flex>
            :
            <Flex direction="column" align="center">
              <Flex
                bg={boxBg1}
                h="35px"
                w="35px"
                align="center"
                justify="center"
                borderRadius="8px"
                border={borders}
              >
                {countdown.hours}
              </Flex>
              <TextLandingSmall>Hours</TextLandingSmall>
            </Flex>
            :
            <Flex direction="column" align="center">
              <Flex
                bg={boxBg1}
                h="35px"
                w="35px"
                align="center"
                justify="center"
                borderRadius="8px"
                border={borders}
              >
                {countdown.minutes}
              </Flex>
              <TextLandingSmall>Min</TextLandingSmall>
            </Flex>
            :
            <Flex direction="column" align="center">
              <Flex
                bg={boxBg1}
                h="35px"
                w="35px"
                align="center"
                justify="center"
                borderRadius="8px"
                border={borders}
              >
                {countdown.seconds}
              </Flex>
              <TextLandingSmall>Sec</TextLandingSmall>
            </Flex>
          </Flex>
          {currentSale?.link ? (
            <Button
              mt="15px"
              fontSize={["14px", "14px", "15px", "16px"]}
              color={text60}
              fontWeight="400"
              bg={boxBg6}
              transition="all 250ms ease-in-out"
              h="35px"
              px="12px"
              borderRadius="8px"
              border={borders}
              _hover={{
                border: bordersActive,
                bg: hover,
              }}
              onClick={() => {
                window.open(currentSale?.link, "_blank");
              }}
            >
              Open presale
            </Button>
          ) : null}
        </Flex>
      );
    }
  };
  const isMobile =
    (typeof window !== "undefined" ? window.innerWidth : 0) < 768;

  return (
    <Box position="relative" w="100%" h="100%">
      <Flex
        filter={isBalanceHide ? "blur(5px)" : "none"}
        justify="center"
        mt={["-30px", "-30px", "20px"]}
        w="100%"
        align="center"
        position="relative"
        mb={["10px", "10px", "10px", "0px"]}
        {...props}
      >
        {baseAsset?.price_history?.price && (
          <EChart
            data={unformattedHistoricalData?.[type]?.ALL || []}
            timeframe={timeSelected}
            transactions={hideTx ? [] : transactions}
            height={isMobile ? 400 : 500}
            extraData={
              comparedEntities.filter(entity => entity.data.length).length
                ? comparedEntities
                    .filter(entity => entity.data.length)
                    .map((entity, i) => ({
                      data: entity.data,
                      name: entity.label,
                      color: colors[i],
                    }))
                : null
            }
            unit={comparedEntities.length ? "%" : "$"}
            unitPosition={comparedEntities.length ? "after" : "before"}
          />
        )}
      </Flex>
      {!isTracked && baseAsset?.untrack_reason === "pre-listing" ? (
        <Flex
          position="absolute"
          w="100%"
          h="100%"
          left="50%"
          top="50%"
          transform="translateY(-50%) translateX(-50%)"
          align="center"
          justify="center"
          color={text80}
          direction="column"
          zIndex="2"
          bg={boxBg3}
          borderRadius="16px"
          border={borders}
        >
          {renderChartMessage()}
        </Flex>
      ) : null}
    </Box>
  );
};
