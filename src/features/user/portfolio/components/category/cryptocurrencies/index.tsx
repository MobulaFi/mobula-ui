import {
  Button,
  Flex,
  Image,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  useColorMode,
} from "@chakra-ui/react";
import {useContext, useEffect, useMemo, useState} from "react";

import {TextLandingSmall} from "../../../../../../UI/Text";
import {useColors} from "../../../../../../common/utils/color-mode";
import {PortfolioV2Context} from "../../../context-manager";
import {thStyle} from "../../../style";
import {TbodyCryptocurrencies} from "../../ui/tbody-cryptocurrencies";
import {TbodySkeleton} from "../../ui/tbody-skeleton";

export const Cryptocurrencies = () => {
  const {
    wallet,
    hiddenTokens,
    setHiddenTokens,
    isLoading,
    activePortfolio,
    isMobile,
  } = useContext(PortfolioV2Context);
  const [showMore, setShowMore] = useState(false);
  const {boxBg1, boxBg6, borders, text40, text80, bg} = useColors();
  const {colorMode} = useColorMode();
  const isWhiteMode = colorMode === "light";

  const numberOfAsset =
    wallet?.portfolio?.reduce((count, entry) => {
      const meetsBalanceCondition = showMore || entry.estimated_balance > 1;
      return meetsBalanceCondition ? count : count + 1;
    }, 0) ?? 0;
  const isNormalBalance = wallet?.portfolio
    ? wallet?.portfolio.some(entry => entry.estimated_balance > 1)
    : false;

  const getFilterFromBalance = () => {
    if (!wallet || !wallet?.portfolio) return [];

    return wallet.portfolio.filter(entry => {
      const meetsBalanceCondition = showMore || entry.estimated_balance > 1;
      return isNormalBalance ? meetsBalanceCondition : true;
    });
  };

  const filteredData = useMemo(
    () => getFilterFromBalance(),
    [wallet, showMore],
  );

  return (
    <TableContainer
      position="relative"
      pb={["20px", "20px", "100px"]}
      overflowX="scroll"
    >
      <Table overflowX="scroll" pb="100px">
        {isNormalBalance && numberOfAsset ? (
          <TableCaption
            bg={boxBg6}
            mt="0px"
            borderTop="none"
            textAlign="start"
            borderRadius="0px 0px 8px 8px"
            pl="0px"
          >
            <Button
              fontWeight="500"
              color={text80}
              fontSize={["12px", "12px", "13px", "14px"]}
              h="100%"
              pl="20px"
              position="sticky"
              top="0px"
              left="-1px"
              mb="2px"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore
                ? "Hide low balances "
                : `Show low balances  (${numberOfAsset} assets) `}
            </Button>
          </TableCaption>
        ) : null}

        <Thead borderRadius="8px 8px 0px 0px">
          <Tr>
            {isMobile && (
              <Th
                {...thStyle}
                borderBottom={borders}
                color={text80}
                isNumeric
                borderRadius="0px 8px 0px 0px"
              ></Th>
            )}
            <Th
              {...thStyle}
              borderBottom={borders}
              color={text80}
              borderRight="none"
              borderRadius="8px 0px 0px 0px"
              position="sticky"
              top="0px"
              left="-1px"
              bgColor={bg}
            >
              Asset
            </Th>
            <Th {...thStyle} borderBottom={borders} color={text80} isNumeric>
              Holdings
            </Th>
            <Th {...thStyle} borderBottom={borders} color={text80} isNumeric>
              Price
            </Th>
            <Th {...thStyle} borderBottom={borders} color={text80} isNumeric>
              24h Profit
            </Th>
            <Th {...thStyle} borderBottom={borders} color={text80} isNumeric>
              Realized PNL
            </Th>
            <Th {...thStyle} borderBottom={borders} color={text80} isNumeric>
              Unrealized PNL
            </Th>
            {!isMobile && (
              <Th
                {...thStyle}
                borderBottom={borders}
                color={text80}
                isNumeric
                borderRadius="0px 8px 0px 0px"
              >
                Actions
              </Th>
            )}
          </Tr>
        </Thead>
        {!isLoading &&
        filteredData?.sort((a, b) => b.estimated_balance - a.estimated_balance)
          .length > 0 ? (
          <Tbody>
            {filteredData
              ?.sort((a, b) => b.estimated_balance - a.estimated_balance)
              .map(asset => (
                <TbodyCryptocurrencies asset={asset} />
              ))}
          </Tbody>
        ) : null}
        {isLoading ? (
          <Tbody>
            {Array.from(Array(10).keys()).map(() => (
              <TbodySkeleton />
            ))}
          </Tbody>
        ) : null}
      </Table>

      {filteredData?.sort((a, b) => b.estimated_balance - a.estimated_balance)
        .length > 0 || isLoading ? null : (
        <Flex
          h="300px"
          w="100%"
          bg={boxBg1}
          borderRadius=" 0 0 8px 8px"
          align="center"
          justify="center"
          border={borders}
          direction="column"
        >
          <Image
            src={isWhiteMode ? "/asset/empty-light.png" : "/asset/empty.png"}
            h="160px"
            mb="-50px"
            mt="25px"
          />

          <Flex
            maxW="80%"
            direction="column"
            m="auto"
            mt="40px"
            align="center"
            justify="center"
          >
            <TextLandingSmall mb="5px" textAlign="center" color={text40}>
              No tokens found{" "}
            </TextLandingSmall>
          </Flex>
        </Flex>
      )}
    </TableContainer>
  );
};
