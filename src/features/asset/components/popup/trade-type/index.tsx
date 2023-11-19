import { CheckIcon } from "@chakra-ui/icons";
import { Button, Flex } from "@chakra-ui/react";
import React, { useContext } from "react";
import { TextSmall } from "../../../../../components/fonts";
import { useColors } from "../../../../../lib/chakra/colorMode";
import { BaseAssetContext } from "../../../context-manager";
import { cancelButtonStyle } from "../../../style";

export const TradeTypePopup = ({
  onClose,
  setActiveName,
}: {
  onClose?: any;
  setActiveName?: any;
}) => {
  const {
    setSelectedTradeFilters,
    setMarketMetrics,
    filters,
    setFilters,
    selectedTradeFilters,
    setShouldInstantLoad,
    setShowTradeFilters,
  } = useContext(BaseAssetContext);
  const { text80, boxBg6, borders, bordersActive, hover } = useColors();

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleSelectType = (type) => {
    if (selectedTradeFilters.type === type || type === "all") {
      setSelectedTradeFilters({
        ...selectedTradeFilters,
        type: null,
      });
    } else {
      setSelectedTradeFilters({
        ...selectedTradeFilters,
        type,
      });
    }
  };

  const handleAddFilter = (reset) => {
    setShouldInstantLoad(true);
    setMarketMetrics((prev) => ({
      ...prev,
      trade_history: [],
    }));
    const index = filters.findIndex(
      (entry) => entry.value[0] === "trade_history.type"
    );
    if (index !== -1) filters.splice(index, 1);
    if (reset) return;
    if (selectedTradeFilters.type !== null) {
      setActiveName((prev) => ({
        ...prev,
        type: `${capitalizeFirstLetter(selectedTradeFilters.type)} Tx`,
      }));
      const final = filters.filter(
        (f) => f.value[0] !== "trade_history.blockchain"
      );
      final.push({
        action: "eq",
        value: ["trade_history.type", selectedTradeFilters.type || null],
      });
      setFilters(final);
    } else {
      setActiveName((prev) => ({
        ...prev,
        type: "All Types",
      }));
      setFilters([...filters]);
    }
    if (onClose) onClose();
    setShowTradeFilters(false);
  };

  return (
    <Flex direction="column">
      <Flex align="center" mb="7.5px" mt="0px">
        <Button onClick={() => handleSelectType("buy")}>
          <Flex
            boxSize="16px"
            bg={boxBg6}
            borderRadius="4px"
            border={bordersActive}
            align="center"
            justify="center"
          >
            <CheckIcon
              fontSize="11px"
              color={text80}
              opacity={selectedTradeFilters.type === "buy" ? "1" : "0"}
            />
          </Flex>
          <Flex direction="column" ml="15px">
            <TextSmall color="green">Buy transactions</TextSmall>
          </Flex>
        </Button>
      </Flex>
      <Flex align="center" mt="7.5px" mb="7.5px">
        <Button onClick={() => handleSelectType("sell")}>
          <Flex
            boxSize="16px"
            bg={boxBg6}
            borderRadius="4px"
            border={bordersActive}
            align="center"
            justify="center"
          >
            <CheckIcon
              fontSize="11px"
              color={text80}
              opacity={selectedTradeFilters.type === "sell" ? "1" : "0"}
            />
          </Flex>
          <Flex direction="column" ml="15px">
            <TextSmall color="red">Sell transactions</TextSmall>
          </Flex>
        </Button>
      </Flex>
      <Flex align="center" mt="7.5px" mb="7.5px">
        <Button onClick={() => handleSelectType("buy/sell")}>
          <Flex
            boxSize="16px"
            borderRadius="4px"
            border={bordersActive}
            bg={boxBg6}
            align="center"
            justify="center"
          >
            <CheckIcon
              fontSize="11px"
              color={text80}
              opacity={selectedTradeFilters.type === null ? "1" : "0"}
            />
          </Flex>
          <Flex direction="column" ml="15px">
            <TextSmall color={text80}>Buy/Sell transactions</TextSmall>
          </Flex>
        </Button>
      </Flex>
      <Flex mt="10px">
        <Button
          sx={cancelButtonStyle}
          color={text80}
          bg={boxBg6}
          border={borders}
          _hover={{
            border: bordersActive,
            bg: hover,
          }}
          onClick={() => {
            handleSelectType("all");
            setSelectedTradeFilters({
              ...selectedTradeFilters,
              type: null,
            });
            handleAddFilter(true);
            setActiveName((prev) => ({
              ...prev,
              type: "All Types",
            }));
            if (onClose) onClose();
            setShowTradeFilters(false);
          }}
        >
          Reset
        </Button>
        <Button
          variant="outlined"
          mb="0px"
          color={text80}
          maxW="100px"
          h="30px"
          onClick={() => {
            handleAddFilter(false);
          }}
        >
          Apply
        </Button>{" "}
      </Flex>
    </Flex>
  );
};
