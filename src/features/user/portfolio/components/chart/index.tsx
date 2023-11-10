import { Box, Button, Flex, Image, Spinner } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { useContext } from "react";
import { TextLandingSmall } from "../../../../../components/fonts";
import { UserContext } from "../../../../../contexts/user";
import { TimeSelected } from "../../../../../interfaces/pages/asset";
import { useColors } from "../../../../../lib/chakra/colorMode";
import { colors } from "../../constants";
import { PortfolioV2Context } from "../../context-manager";
import { ButtonTimeSlider } from "../ui/button-time-slider";
import { CompareButtons } from "./compare-buttons";
import { ComparePopover } from "./compare-popover";

const EChart = dynamic(() => import("../../../../../lib/echart/line"), {
  ssr: false,
});

export const PortfolioChart = () => {
  const { user } = useContext(UserContext);
  const {
    text80,
    boxBg3,
    boxBg6,
    text10,
    text40,
    hover,
    borders,
    bordersActive,
    borders2x,
  } = useColors();
  const {
    wallet,
    isLoading,
    timeframe,
    setShowSelect,
    isWalletExplorer,
    activePortfolio,
    comparedEntities,
    error,
    isMobile,
    setComparedEntities,
  } = useContext(PortfolioV2Context);

  const isMoreThan991 =
    ((typeof window !== "undefined" && window.innerWidth) || 0) > 991;

  return (
    <Box
      position="relative"
      w="100%"
      mt={["10px", "10px", "10px", "0px"]}
      mb={["10px", "20px", "20px", "80px"]}
    >
      <Flex
        justify="space-between"
        align={["flex-start", "center"]}
        w="100%"
        wrap="wrap"
        mb={["30px", "30px", "0px", "30px"]}
        direction={["column", "row"]}
      >
        <CompareButtons
          display={["none", "none", "none", "flex"]}
          buttonH="35px"
          comparedEntities={comparedEntities}
          setComparedEntities={setComparedEntities}
        />

        <ComparePopover
          display={["none", "none", "none", "flex"]}
          setComparedEntities={setComparedEntities}
          comparedEntities={comparedEntities}
        />

        <ButtonTimeSlider />
        <Flex justify="space-between" w="100%" align="center" mb="-30px">
          <CompareButtons
            display={["flex", "flex", "flex", "none"]}
            mb="-50px"
            buttonH="30px"
            mt="-10px"
            comparedEntities={comparedEntities}
            setComparedEntities={setComparedEntities}
          />

          <ComparePopover
            display={["flex", "flex", "flex", "none"]}
            mb="-50px"
            h="30px"
            mr="0px"
            setComparedEntities={setComparedEntities}
            comparedEntities={comparedEntities}
          />
        </Flex>
      </Flex>
      <Flex align="center" w="100%">
        {/* {wallet.}Array.from(Array(10).keys()).map(() => ( */}
        {!wallet && !isLoading ? (
          <Flex
            position="relative"
            maxH="320px"
            minH="320px"
            mt={["0px", "0px", "0px", "20px"]}
            w="100%"
            border={borders2x}
            borderRadius="16px"
            bg={boxBg3}
            align="center"
            justify="center"
          >
            {Array.from(Array(4).keys()).map((_, i) => (
              <Flex
                h="1px"
                bg={text10}
                w="100%"
                position="absolute"
                top={`${(i + 1) * 20}%`}
              />
            ))}
            <Flex direction="column" align="center" justify="center">
              <TextLandingSmall color={text40} mb="15px">
                No data {error ? `: ${error}` : ""}
              </TextLandingSmall>
              {!isWalletExplorer && activePortfolio?.user === user?.id ? (
                <Button
                  px="6px"
                  py="6px"
                  fontWeight="400"
                  fontSize={["12px", "12px", "13px", "14px"]}
                  color={text80}
                  _hover={{ bg: hover, border: bordersActive }}
                  borderRadius="8px"
                  border={borders}
                  bg={boxBg6}
                  onClick={() => setShowSelect(true)}
                >
                  <Image
                    src="/logo/bitcoin.png"
                    boxSize="20px"
                    borderRadius="full"
                    alt="bitcoin logo"
                    mr="7.5px"
                  />
                  Add an asset
                </Button>
              ) : null}
            </Flex>
          </Flex>
        ) : (
          <Flex
            justify="center"
            mt={["0px", "0px", "0px", "40px"]}
            w="100%"
            minHeight="320px"
            maxHeight="320px"
            align="center"
            position="relative"
            maxW="100%"
            mr="20px"
          >
            {isLoading ? (
              <Spinner boxSize="60px" color="var(--chakra-colors-blue)" />
            ) : (
              <EChart
                height={isMobile || !isMoreThan991 ? 350 : 500}
                data={wallet?.estimated_history || []}
                timeframe={timeframe as TimeSelected}
                leftMargin={["0%", "0%"]}
                extraData={
                  comparedEntities.filter((entity) => entity.data.length).length
                    ? comparedEntities
                        .filter((entity) => entity.data.length)
                        .map((entity, i) => ({
                          data: entity.data,
                          name: entity.label,
                          color: colors[i],
                        }))
                    : null
                }
                unit={comparedEntities.length ? "%" : "$"}
                unitPosition={comparedEntities.length ? "after" : "before"}
                type="Balance"
              />
            )}
          </Flex>
        )}
      </Flex>
    </Box>
  );
};
