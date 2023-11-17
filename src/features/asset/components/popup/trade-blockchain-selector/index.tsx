import {CheckIcon} from "@chakra-ui/icons";
import {Button, Flex, Image} from "@chakra-ui/react";
import {blockchainsContent} from "mobula-lite/lib/chains/constants";
import {useContext, useEffect} from "react";
import {useAlert} from "react-alert";
import {TextSmall} from "../../../../../../UI/Text";
import {useColors} from "../../../../../../common/utils/color-mode";
import {BaseAssetContext} from "../../../context-manager";
import {cancelButtonStyle} from "../../../style";

export const TradeBlockchainPopup = ({
  onClose,
  setActiveName,
}: {
  onClose?: any;
  setActiveName: any;
}) => {
  const {
    setShowTradeFilters,
    setSelectedTradeFilters,
    selectedTradeFilters,
    baseAsset,
    setMarketMetrics,
    filters,
    setFilters,
    setShouldInstantLoad,
  } = useContext(BaseAssetContext);
  const alert = useAlert();
  const {text80, hover, boxBg6, bordersActive, borders, boxBg3} = useColors();

  useEffect(() => {
    if (selectedTradeFilters.blockchains.length === 0)
      setSelectedTradeFilters(prevState => ({
        ...prevState,
        blockchains: baseAsset?.blockchains,
      }));
  }, [baseAsset]);

  useEffect(() => {
    if (selectedTradeFilters.blockchains.length === 0)
      setSelectedTradeFilters(prevState => ({
        ...prevState,
        blockchains: baseAsset?.blockchains,
      }));
  }, [baseAsset]);

  const handleAddFilter = (reset: boolean) => {
    setShouldInstantLoad(true);
    setMarketMetrics(prev => ({
      ...prev,
      trade_history: [],
    }));
    const index = filters.findIndex(
      entry => entry.value[0] === "trade_history.blockchain",
    );
    if (index !== -1) filters.splice(index, 1);

    if (!reset)
      setActiveName(prev => ({
        ...prev,
        blockchain: selectedTradeFilters.blockchains,
      }));

    const final = filters.filter(
      f => f.value[0] !== "trade_history.blockchain",
    );

    if (!reset) {
      final.push({
        action: "in",
        value: ["trade_history.blockchain", selectedTradeFilters.blockchains],
      });
    }
    setFilters(final);
    if (onClose) onClose();
    setShowTradeFilters(false);
  };

  return (
    <Flex direction="column">
      <Flex
        direction="column"
        w="100%"
        maxH="390px"
        overflowY="scroll"
        className="scroll"
      >
        {baseAsset?.blockchains?.map((entry, i) => {
          if (!entry) return null;

          return (
            <Flex
              align="center"
              mt={i !== 0 ? "7.5px" : "0px"}
              cursor="pointer"
              key={entry}
              onClick={() => {
                if (selectedTradeFilters.blockchains.includes(entry)) {
                  setSelectedTradeFilters(prevState => ({
                    ...prevState,
                    blockchains: prevState.blockchains.filter(
                      item => item !== entry,
                    ),
                  }));
                } else {
                  setSelectedTradeFilters(prev => ({
                    ...prev,
                    blockchains: [...selectedTradeFilters.blockchains, entry],
                  }));
                }
              }}
              mb={
                i === (baseAsset?.blockchains?.length || 0) - 1
                  ? "0px"
                  : "7.5px"
              }
            >
              <Flex
                boxSize="16px"
                borderRadius="4px"
                border={bordersActive}
                align="center"
                justify="center"
              >
                <CheckIcon
                  fontSize="11px"
                  color={text80}
                  opacity={
                    selectedTradeFilters.blockchains.includes(entry) ? 1 : 0
                  }
                />
              </Flex>

              <Image
                ml="15px"
                borderRadius="full"
                src={
                  blockchainsContent[entry]?.logo ||
                  `/logo/${entry.toLowerCase().split(" ")[0]}.png`
                }
                boxSize="25px"
                minW="25px"
                mr="10px"
              />
              <TextSmall>{entry}</TextSmall>
            </Flex>
          );
        })}
        <Flex
          mt="10px"
          pt="20px"
          borderTop={borders}
          position="sticky"
          bottom="0px"
          bg={boxBg3}
        >
          <Button
            sx={cancelButtonStyle}
            color={text80}
            border={borders}
            bg={boxBg6}
            _hover={{
              border: bordersActive,
              bg: hover,
            }}
            onClick={() => {
              setSelectedTradeFilters({
                ...selectedTradeFilters,
                blockchains: baseAsset?.blockchains,
              });
              setActiveName(prev => ({
                ...prev,
                blockchain: "All Chains",
              }));
              setShouldInstantLoad(true);
              setShowTradeFilters(false);
              handleAddFilter(true);
              if (onClose) onClose();
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
              if (selectedTradeFilters.blockchains.length > 0) {
                handleAddFilter(false);
              } else alert.error("Please select at least one blockchain");
            }}
          >
            Apply
          </Button>{" "}
        </Flex>
      </Flex>
    </Flex>
  );
};
