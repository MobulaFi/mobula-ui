/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Flex, Spinner, useMediaQuery } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";

import React from "react";
import {
  FormattedHistoricalData,
  TimeSelected,
} from "../../../../../interfaces/pages/asset";
import { createSupabaseDOClient } from "../../../../../lib/supabase";
import { colors } from "../../constants";
import { PortfolioV2Context } from "../../context-manager";
import { ButtonTimeSlider } from "../ui/button-time-slider";

const EChart = dynamic(() => import("../../../../../lib/echart/line"), {
  ssr: false,
});

export const PortfolioChartAsset = () => {
  const [isCompare, setIsCompare] = useState(false);
  const { timeframe, asset, isLoading, transactions, wallet } =
    useContext(PortfolioV2Context);
  useState<FormattedHistoricalData | null>(null);
  const [unformattedHistoricalData, setUnformattedHistoricalData] = useState<
    [number, number][] | null
  >(null);

  const generateNewBuffer = (
    recent?: [number, number][],
    history?: [number, number][]
  ): [number, number][] => {
    const historyAssetBase = history?.filter(
      (entry) => Date.now() > entry[0] + 7 * 24 * 60 * 60 * 1000
    );
    const weeklyAsset = recent?.filter(
      (entry) => entry[0] + 7 * 24 * 60 * 60 * 1000 > Date.now()
    );

    return historyAssetBase?.concat(weeklyAsset);
  };

  useEffect(() => {
    const fetchAssetData = async () => {
      const noCacheSupabase = createSupabaseDOClient({ noCache: true });
      const supabase = createSupabaseDOClient();
      const fetchPromise: any[] = [];
      fetchPromise.push(
        noCacheSupabase
          .from("assets")
          .select(
            "price_history,price,volume,off_chain_volume,market_cap,market_cap_diluted,liquidity,total_supply,trade_history(*), assets_raw_pairs(pairs_data,pairs_per_chain),assets_social(*)"
          )
          .limit(20, {
            foreignTable: "trade_history",
          })
          .order("date", { foreignTable: "trade_history", ascending: false })
          .match({ id: asset?.id }),
        supabase
          .from("history")
          .select("price_history")
          .match({ asset: asset?.id })
      );
      const [{ data }, history] = await Promise.all(fetchPromise);
      if (data && data[0]) {
        const newUnformattedBuffer = generateNewBuffer(
          data[0].price_history.price,
          history?.data?.[0]?.price_history
        );
        setUnformattedHistoricalData(newUnformattedBuffer);
      }
    };

    if (asset?.id) fetchAssetData();
  }, [asset]);

  const [isSmallerThan1280] = useMediaQuery("(max-width: 1280px)", {
    ssr: true,
    fallback: false, // return false on the server, and re-evaluate on the client side
  });

  const isMobile =
    (typeof window !== "undefined" ? window.innerWidth : 0) < 768;
  return (
    <Box
      position="relative"
      w={["100%", "100%", "100%"]}
      mt="10px"
      mb={["0px", "0px", "0px", isSmallerThan1280 ? "20px" : "0px"]}
    >
      <Flex
        display={["none", "none", "flex"]}
        align="center"
        justify="space-between"
        mb="20px"
      >
        <Button
          variant="outlined_grey"
          ml="auto"
          mr="10px"
          mb="70px"
          h="38px"
          zIndex="1"
          onClick={() => {
            setIsCompare((prev) => !prev);
          }}
        >
          {isCompare ? "Hide" : "Compare to Wallet"}
        </Button>
        <ButtonTimeSlider isChart />
      </Flex>

      <Flex w="100%" justify="flex-end" display={["flex", "flex", "none"]}>
        <ButtonTimeSlider isChart />
      </Flex>
      <Flex align="center">
        <Flex
          justify="center"
          mt="0px"
          w="100%"
          minHeight={["280px", "280px", "280px", "220px"]}
          align="center"
          position="relative"
          maxW="100%"
          maxH="200px"
          mr="20px"
        >
          {isLoading ? (
            <Spinner
              boxSize="60px"
              mx="auto"
              color="var(--chakra-colors-blue)"
            />
          ) : (
            <EChart
              data={unformattedHistoricalData || []}
              timeframe={timeframe as TimeSelected}
              height={isMobile ? 350 : 500}
              leftMargin={["0%", "0%"]}
              transactions={transactions}
              type={asset.name}
              extraData={
                isCompare
                  ? [
                      {
                        data: wallet.estimated_history,
                        name: "Balance",
                        color: colors[0],
                      },
                    ]
                  : null
              }
              unit={isCompare ? "%" : "$"}
              unitPosition={isCompare ? "after" : "before"}
            />
          )}
        </Flex>
      </Flex>
    </Box>
  );
};
