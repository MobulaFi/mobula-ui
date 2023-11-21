import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  AvatarGroup,
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import React, { useContext, useState } from "react";
import { TextLandingMedium, TextSmall } from "../../../../../components/fonts";
import { useColors } from "../../../../../lib/chakra/colorMode";
import { BaseAssetContext } from "../../../context-manager";
import { TradeBlockchainPopup } from "../trade-blockchain-selector";
import { TradeTypePopup } from "../trade-type";
import { TradeValueAmountPopup } from "../trade-value-amount";

export const TradeFiltersPopup = () => {
  const {
    setShowTradeFilters,
    showTradeFilters,
    showTradeTokenAmount,
    setShowTradeTokenAmount,
    setShowTradeValue,
    showTradeValue,
  } = useContext(BaseAssetContext);
  const { borders, text80, boxBg3, hover } = useColors();
  const [activeNames, setActiveNames] = useState({
    liquidity_pool: "All Liquidity Pool",
    blockchain: "Any Blockchains",
    type: "All Types",
    token_amount: "Any Amount",
    value: "Any Value",
  });

  const filters = [
    {
      title:
        activeNames.blockchain !== "Any Blockchains" ? (
          <Flex align="center">
            <AvatarGroup size="xs" spacing="-5px">
              {Array.isArray(activeNames.blockchain)
                ? activeNames.blockchain
                    .filter((_, i) => i < 4)
                    .map((item, i) => (
                      <Avatar
                        border="none"
                        w="18px"
                        h="18px"
                        key={item}
                        bg={hover}
                        name={
                          blockchainsContent[activeNames.blockchain[i]]?.name
                        }
                        src={
                          blockchainsContent[activeNames.blockchain[i]]?.logo ||
                          `/logo/${
                            activeNames.blockchain[i]
                              ?.toLowerCase()
                              .split(" ")[0]
                          }.png`
                        }
                      />
                    ))
                : null}
            </AvatarGroup>
            <TextSmall ml="5px" color={text80}>
              {Array.isArray(activeNames.blockchain) &&
              activeNames.blockchain.length > 4
                ? `+${activeNames.blockchain.length - 4}`
                : null}
            </TextSmall>
          </Flex>
        ) : (
          activeNames.blockchain
        ),
      content: <TradeBlockchainPopup setActiveName={setActiveNames} />,
    },
    // {
    //   title: "All Liquidity Pools",
    //   content: <TradeLiquidityPoolPopup />,
    // },
    {
      title: activeNames.type,
      content: <TradeTypePopup setActiveName={setActiveNames} />,
    },
    {
      title: activeNames.token_amount,
      content: (
        <TradeValueAmountPopup
          title="token_amount"
          state={showTradeTokenAmount}
          setStateValue={setShowTradeTokenAmount}
          setActiveName={setActiveNames}
          activeName={activeNames}
        />
      ),
    },
    {
      title: activeNames.value,
      content: (
        <TradeValueAmountPopup
          title="Value"
          state={showTradeValue}
          setStateValue={setShowTradeValue}
          setActiveName={setActiveNames}
          activeName={activeNames}
        />
      ),
    },
  ];

  return (
    <Modal
      motionPreset="none"
      isOpen={showTradeFilters}
      onClose={() => setShowTradeFilters(false)}
    >
      <ModalOverlay />
      <ModalContent
        bg={boxBg3}
        borderRadius="16px"
        border={borders}
        boxShadow="none"
        w={["90vw", "100%"]}
        maxW="420px"
      >
        <ModalHeader
          mb="0px"
          p={["15px 15px 0px 15px", "15px 15px 0px 15px", "20px 20px 0px 20px"]}
        >
          <TextLandingMedium color={text80}>Filters</TextLandingMedium>
        </ModalHeader>
        <ModalCloseButton color={text80} />
        <ModalBody p={[" 10px 15px", "10px 15px", "20px"]}>
          <Accordion allowToggle>
            {filters.map((filter, index) => (
              <AccordionItem
                borderTop={index !== 0 ? borders : "none"}
                w="100%"
                borderBottom="none"
              >
                <AccordionButton
                  px="0px"
                  fontSize="13px"
                  _hover={{ bg: boxBg3 }}
                >
                  <Box
                    as="span"
                    flex="1"
                    color={text80}
                    textAlign="left"
                    px="0px"
                  >
                    {filter.title}
                  </Box>
                  <AccordionIcon color={text80} mr="0px" />
                </AccordionButton>
                <AccordionPanel pb={4}>{filter.content}</AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
